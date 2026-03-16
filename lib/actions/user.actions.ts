'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { formatError } from '../utils'
import { editUserFormSchema } from '../zod'
import z from 'zod'

export async function addUserToAllOrganizations(userId: string, role: string) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		const organizations = await prisma.organization.findMany({
			select: { id: true },
		})

		await prisma.member.createMany({
			data: organizations.map(org => ({
				userId,
				organizationId: org.id,
				role: role === 'superAdmin' ? 'owner' : 'admin',
			})),
			skipDuplicates: true,
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const updateUser = async (data: z.infer<typeof editUserFormSchema>) => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		const user = editUserFormSchema.parse(data)

		await prisma.user.update({
			where: { id: user.id },
			data: {
				name: user.name,
				role: user.role,
				email: user.email,
				image: user.image,
			},
		})

		const memberRole = user.role === 'superAdmin' ? 'owner' : 'platformAdmin'

		await prisma.member.updateMany({
			where: { userId: user.id },
			data: { role: memberRole },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
