'use server'

import { headers } from 'next/headers'
import { auth } from '../auth'
import { prisma } from '@att-crms/db'
import { formatError } from '../utils'

export async function updateRetentionPolicyAction({ organizationId, retentionDays }: { organizationId: string; retentionDays: number | null }) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		await prisma.organization.update({
			where: { id: organizationId },
			data: { retentionDays },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
