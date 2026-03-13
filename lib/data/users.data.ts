'server-only'
import { DataResponse } from '@/interfaces'
import { User } from '../generated/prisma/client'
import { auth } from '../auth'
import { headers } from 'next/headers'
import { getAllowedRoles, PlatformRole } from '../access-control'
import prisma from '../prisma'
import { formatError } from '../utils'

export const fetchUsers = async (): Promise<DataResponse<User[]>> => {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) return { success: false, error: 'Unauthorized' }

	try {
		const allowRoles = getAllowedRoles(session.user.role as PlatformRole)

		const users = await prisma.user.findMany({
			where: {
				role: {
					in: allowRoles,
				},
			},
		})

		return { success: true, data: users }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
