'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { formatError } from '@/lib/utils'
import fs from 'fs'

export async function deleteRecordingAction(recordingId: string) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const canDelete = await auth.api.hasPermission({
			headers: await headers(),
			body: {
				permissions: {
					recording: ['delete'],
				},
			},
		})

		if (!canDelete.success) return { success: false, error: "You can't perform this action" }

		const recording = await prisma.recording.findUnique({
			where: { id: recordingId },
		})

		if (!recording) return { success: false, error: 'Recording not found' }

		// Delete file from filesystem
		if (fs.existsSync(recording.filePath)) {
			fs.unlinkSync(recording.filePath)
		}

		// Delete from database
		await prisma.recording.delete({
			where: { id: recordingId },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
