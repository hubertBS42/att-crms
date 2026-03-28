import { logActivity, prisma } from '@att-crms/db'
import { ParsedRecording } from './parser.js'

export async function indexRecordingBatch({ recordings, isLive = false }: { recordings: ParsedRecording[]; isLive?: boolean }) {
	const results = await Promise.allSettled(recordings.map(recording => indexRecording({ recording, isLive })))

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

export async function indexRecording({ recording, isLive = false }: { recording: ParsedRecording; isLive?: boolean }) {
	try {
		const { organizationSlug, ...data } = recording

		const org = await prisma.organization.findUnique({
			where: { slug: organizationSlug },
			select: { id: true, name: true },
		})

		if (!org) {
			console.warn(`Organization not found for slug: "${organizationSlug}" — skipping ${recording.filename}`)
			return
		}

		const result = await prisma.recording.upsert({
			where: { filename: recording.filename },
			update: {},
			create: {
				...data,
				organization: {
					connect: { slug: organizationSlug },
				},
			},
		})

		if (result && isLive) {
			await logActivity({
				type: 'CREATE',
				resource: 'RECORDING',
				organizationId: org.id,
				organizationName: org.name,
				targetId: result.id,
				targetName: recording.filename,
				metadata: {
					caller: recording.caller,
					calledNumber: recording.calledNumber,
					duration: recording.duration,
					size: recording.size,
				},
			})
		}

		console.log(`Indexed: ${recording.filename}`)
	} catch (error: any) {
		if (error?.code === 'P2002') {
			console.log(`Already indexed, skipping: ${recording.filename}`)
			return
		}
		console.error(`Failed to index ${recording.filename}:`, error)
	}
}
