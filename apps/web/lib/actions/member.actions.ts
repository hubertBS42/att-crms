'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { formatError } from '@/lib/utils'
import { prisma } from '@att-crms/db'

export async function removeOrganizationMember(memberId: string) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		// Check org-level permission instead of system role
		const currentMember = await prisma.member.findFirst({
			where: {
				userId: session.user.id,
				organizationId: activeOrganizationId,
			},
		})

		if (!currentMember) return { success: false, error: 'Forbidden' }

		const canRemove = await auth.api.hasPermission({
			headers: await headers(),
			body: {
				permissions: { member: ['delete'] },
			},
		})

		if (!canRemove.success) return { success: false, error: 'Forbidden' }

		// Remove member from organization
		await auth.api.removeMember({
			body: {
				memberIdOrEmail: memberId,
				organizationId: activeOrganizationId,
			},

			headers: await headers(),
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
