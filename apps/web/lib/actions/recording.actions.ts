'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { formatError } from '@/lib/utils'
import fs from 'fs'
import { logActivity, prisma } from '@att-crms/db'

export async function deleteRecordingAction(recordingId: string) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const canDelete = await auth.api.hasPermission({
			headers: headersObj,
			body: {
				permissions: {
					recording: ['delete'],
				},
			},
		})

		if (!canDelete.success) return { success: false, error: "You can't perform this action" }

		const recording = await prisma.recording.findUnique({
			where: { id: recordingId },
			include: { organization: { select: { id: true, name: true } } },
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

		await logActivity({
			type: 'DELETE',
			resource: 'RECORDING',
			actorId: session.user.id,
			actorName: session.user.name,
			organizationId: recording.organization.id,
			organizationName: recording.organization.name,
			targetId: recording.id,
			targetName: recording.filename,
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
