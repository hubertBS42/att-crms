import { CreateRecording } from '@/interfaces'
import prisma from './prisma'

export async function indexRecording(recording: CreateRecording) {
	try {
		await prisma.recording.upsert({
			where: { filename: recording.filename },
			update: {}, // do nothing if it already exists
			create: {
				filename: recording.filename,
				filePath: recording.filePath,
				callDate: recording.callDate,
				callTime: recording.callTime,
				datetime: recording.datetime,
				caller: recording.caller,
				calledNumber: recording.calledNumber,
				answeredBy: recording.answeredBy,
				customer: recording.customer,
			},
		})
		console.log(`Indexed: ${recording.filename}`)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// P2002 = unique constraint violation, file already indexed — safe to ignore
		if (error?.code === 'P2002') {
			console.log(`Already indexed, skipping: ${recording.filename}`)
			return
		}
		console.error(`Failed to index ${recording.filename}:`, error)
	}
}
