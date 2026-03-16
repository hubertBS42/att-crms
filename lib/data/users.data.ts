'server-only'
import { DataResponse, UserWithSessions } from '@/interfaces'
import { User } from '../generated/prisma/client'
import { auth } from '../auth'
import { headers } from 'next/headers'
import prisma from '../prisma'
import { formatError } from '../utils'
import { getAllowedSystemAdminRoles, SystemLevelRole } from '../permissions/system-permissions'

export const fetchSystemAdminUsers = async (): Promise<DataResponse<User[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isPlatformStaff = role === 'superAdmin' || role === 'admin'
		if (!isPlatformStaff) return { success: false, error: 'Forbidden' }

		const allowedRoles = getAllowedSystemAdminRoles(role as SystemLevelRole)

		const users = await prisma.user.findMany({
			where: {
				role: { in: allowedRoles },
			},
			orderBy: { createdAt: 'desc' },
		})

		return { success: true, data: users }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const getSystemAdminById = async (userId: string): Promise<DataResponse<UserWithSessions | null>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role } = session.user
		const isPlatformStaff = role === 'superAdmin' || role === 'admin'
		if (!isPlatformStaff) return { success: false, error: 'Forbidden' }

		const allowedRoles = getAllowedSystemAdminRoles(role as SystemLevelRole)

		const user = await prisma.user.findUnique({
			where: { id: userId, role: { in: allowedRoles } },
			include: {
				sessions: { orderBy: { createdAt: 'desc' } },
			},
		})

		if (!user) return { success: false, error: 'User not found' }

		return { success: true, data: user }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
