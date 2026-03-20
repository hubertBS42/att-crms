import { ParsedRecording } from '@/interfaces'
import prisma from './prisma'

export async function indexRecordingBatch(recordings: ParsedRecording[]) {
	const results = await Promise.allSettled(recordings.map(recording => indexRecording(recording)))

	const succeeded = results.filter(r => r.status === 'fulfilled').length
	const failed = results.filter(r => r.status === 'rejected').length

	if (failed > 0) console.warn(`Batch: ${succeeded} indexed, ${failed} skipped`)
}

export async function indexRecording(recording: ParsedRecording) {
	try {
		const { organizationSlug, ...data } = recording

		await prisma.recording.upsert({
			where: { filename: recording.filename },
			update: {}, // do nothing if it already exists
			create: {
				...data,
				organization: {
					connect: { slug: organizationSlug },
				},
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
