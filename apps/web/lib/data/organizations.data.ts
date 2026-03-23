'server-only'
import { DataResponse } from '@/interfaces'
import { Organization } from '@att-crms/db/client'
import { formatError } from '../utils'
import { auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '@att-crms/db'

export const fetchOrganizations = async (): Promise<DataResponse<Organization[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isSystemAdmin = role === 'superAdmin' || role === 'admin'

		const data = await prisma.organization.findMany({
			where: isSystemAdmin
				? undefined
				: {
						members: { some: { userId: session.user.id } },
					},
			orderBy: { name: 'asc' },
		})
		return { success: true, data }
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
