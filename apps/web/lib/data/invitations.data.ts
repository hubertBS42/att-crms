'server-only'

import { DataResponse, InvitationsData, InvitationsFilters } from '@/interfaces'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { prisma } from '@att-crms/db'
import { formatError } from '../utils'

export const fetchOrganizationInvitations = async (filters: InvitationsFilters = {}): Promise<DataResponse<InvitationsData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const { email, page = 1, pageSize = 10, sort, order } = filters

		const where = {
			...(email && { email: { contains: email, mode: 'insensitive' as const } }),
			organizationId: activeOrganizationId,
			status: 'pending',
		}

		const orderBy = sort ? { [sort]: order ?? 'asc' } : { createdAt: 'desc' as const }

		const [invitations, total] = await Promise.all([
			prisma.invitation.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
				include: { user: true },
			}),
			prisma.invitation.count({ where }),
		])

		return {
			success: true,
			data: {
				invitations,
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		}
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
