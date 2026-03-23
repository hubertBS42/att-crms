'server-only'
import { DataResponse, MemberWithUser, MemberWithUserWithSessions } from '@/interfaces'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { formatError } from '../utils'
import { prisma } from '@att-crms/db'

export const fetchOrganizationMembers = async (): Promise<DataResponse<MemberWithUser[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const members = await prisma.member.findMany({
			where: {
				organizationId: activeOrganizationId,
				user: {
					role: { notIn: ['superAdmin', 'admin'] },
				},
			},
			include: { user: true },
		})

		return { success: true, data: members }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const getOrganizationMemberById = async (memberId: string): Promise<DataResponse<MemberWithUserWithSessions | null>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const member = await prisma.member.findFirst({
			where: {
				id: memberId,
				organizationId: activeOrganizationId,
				user: {
					role: { notIn: ['superAdmin', 'admin'] },
				},
			},
			include: {
				user: {
					include: {
						sessions: { orderBy: { createdAt: 'desc' } },
					},
				},
			},
		})

		if (!member) return { success: false, error: 'Member not found' }

		return { success: true, data: member }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
