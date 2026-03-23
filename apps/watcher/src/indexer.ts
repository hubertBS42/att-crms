import { prisma } from '@att-crms/db'
import { ParsedRecording } from './parser.js'

export async function indexRecordingBatch(recordings: ParsedRecording[]) {
	const results = await Promise.allSettled(recordings.map(recording => indexRecording(recording)))

	const succeeded = results.filter(r => r.status === 'fulfilled')
	const failed = results.filter(r => r.status === 'rejected')

	if (failed.length > 0) {
		console.warn(`Batch: ${succeeded} indexed, ${failed} failed`)

		failed.forEach((result, i) => {
			if (result.status === 'rejected') {
				console.error(`Failed recording:`, result.reason)
			}
		})
	}
}

export async function indexRecording(recording: ParsedRecording) {
	try {
		const { organizationSlug, ...data } = recording

		await prisma.recording.upsert({
			where: { filename: recording.filename },
			update: {},
			create: {
				...data,
				organization: {
					connect: { slug: organizationSlug },
				},
			},
		})

		console.log(`Indexed: ${recording.filename}`)
	} catch (error: any) {
		if (error?.code === 'P2002') {
			console.log(`Already indexed, skipping: ${recording.filename}`)
			return
		}
		console.error(`Failed to index ${recording.filename}:`, error)
	}
}
