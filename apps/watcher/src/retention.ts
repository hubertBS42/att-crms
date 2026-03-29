import { prisma, logActivity } from '@att-crms/db'
import fs from 'fs'

export async function runRetentionCleanup() {
	console.log('Running retention cleanup...')

	// Fetch all orgs with a retention policy
	const organizations = await prisma.organization.findMany({
		where: { retentionDays: { not: null } },
		select: { id: true, name: true, slug: true, retentionDays: true },
	})

	for (const org of organizations) {
		const cutoffDate = new Date()
		cutoffDate.setDate(cutoffDate.getDate() - org.retentionDays!)

		const expiredRecordings = await prisma.recording.findMany({
			where: {
				organizationSlug: org.slug,
				datetime: { lt: cutoffDate },
			},
			select: { id: true, filename: true, filePath: true },
		})

		if (expiredRecordings.length === 0) continue

		console.log(`Deleting ${expiredRecordings.length} expired recordings for ${org.name}`)

		for (const recording of expiredRecordings) {
			try {
				// Delete file from filesystem
				if (fs.existsSync(recording.filePath)) {
					fs.unlinkSync(recording.filePath)
				}

				// Delete from database
				await prisma.recording.delete({
					where: { id: recording.id },
				})

				await logActivity({
					type: 'DELETE',
					resource: 'RECORDING',
					organizationId: org.id,
					organizationName: org.name,
					targetId: recording.id,
					targetName: recording.filename,
					metadata: { action: 'retention_cleanup', retentionDays: org.retentionDays },
				})
			} catch (error) {
				console.error(`Failed to delete recording ${recording.filename}:`, error)
			}
		}

		console.log(`Retention cleanup complete for ${org.name}`)
	}

	console.log('Retention cleanup complete')
}
