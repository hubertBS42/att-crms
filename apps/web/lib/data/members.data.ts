'server-only'
import { DataResponse, MembersData, MembersFilters, MemberWithUserWithSessions } from '@/interfaces'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { formatError } from '../utils'
import { prisma } from '@att-crms/db'

export const fetchOrganizationMembers = async (filters: MembersFilters = {}): Promise<DataResponse<MembersData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const { name, page = 1, pageSize = 10, sort, order } = filters

		const where = {
			organizationId: activeOrganizationId,
			user: {
				role: { notIn: ['superAdmin', 'admin'] },
				...(name && { name: { contains: name, mode: 'insensitive' as const } }),
			},
		}

		const orderBy = sort ? { [sort]: order ?? 'asc' } : { createdAt: 'desc' as const }

		const [members, total] = await Promise.all([
			prisma.member.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
				include: { user: true },
			}),
			prisma.member.count({ where }),
		])

		return {
			success: true,
			data: {
				members,
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
