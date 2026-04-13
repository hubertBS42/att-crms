'server-only'
import { DataResponse, OrganizationsData, OrganizationsFilters } from '@/interfaces'
import { Organization } from '@att-crms/db/client'
import { formatError } from '../utils'
import { auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '@att-crms/db'

export const fetchOrganizations = async (filters: OrganizationsFilters = {}): Promise<DataResponse<OrganizationsData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { name, page = 1, pageSize = 10, sort, order } = filters

		const { role } = session.user
		const isSystemAdmin = role === 'superAdmin' || role === 'admin'

		const where = {
			...(isSystemAdmin ? undefined : { members: { some: { userId: session.user.id } } }),
			...(name && { name: { contains: name, mode: 'insensitive' as const } }),
		}

		const orderBy = sort ? { [sort]: order ?? 'asc' } : { name: 'asc' as const }

		const [organizations, total] = await Promise.all([
			prisma.organization.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.organization.count({ where }),
		])

		return {
			success: true,
			data: {
				organizations,
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

export const getOrganizationById = async (organizationId: string): Promise<DataResponse<Organization | null>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isSystemAdmin = role === 'superAdmin' || role === 'admin'

		if (!isSystemAdmin) return { success: false, error: 'Forbidden' }

		const organization = await prisma.organization.findUnique({
			where: { id: organizationId },
		})

		if (!organization) return { success: false, error: 'Organization not found' }

		return { success: true, data: organization }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
