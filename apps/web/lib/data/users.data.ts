'server-only'
import { prisma } from '@att-crms/db'
import { headers } from 'next/headers'
import { getAllowedRoles, SystemLevelRole } from '../permissions/system-permissions'
import { auth } from '../auth'
import { formatError } from '../utils'
import { DataResponse, UserWithSessionsAndMemberships } from '@/interfaces'
import { User } from '@att-crms/db/client'

export const fetchAllUsers = async (): Promise<DataResponse<User[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isPlatformStaff = role === 'superAdmin' || role === 'admin'
		if (!isPlatformStaff) return { success: false, error: 'Forbidden' }

		const allowedRoles = getAllowedRoles(role as SystemLevelRole)

		const users = await prisma.user.findMany({
			where: {
				role: { in: allowedRoles },
			},
		})

		return { success: true, data: users }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const getUserById = async (userId: string): Promise<DataResponse<UserWithSessionsAndMemberships | null>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isPlatformStaff = role === 'superAdmin' || role === 'admin'
		if (!isPlatformStaff) return { success: false, error: 'Forbidden' }

		const allowedRoles = getAllowedRoles(role as SystemLevelRole)

		const user = await prisma.user.findUnique({
			where: { id: userId, role: { in: allowedRoles } },
			include: {
				sessions: { orderBy: { createdAt: 'desc' } },
				members: {
					include: { organization: true },
				},
			},
		})

		if (!user) return { success: false, error: 'User not found' }

		return { success: true, data: user }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
