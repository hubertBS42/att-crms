'use server'
import { headers } from 'next/headers'
import { auth, Session } from '../auth'
import { formatError } from '../utils'
import { logActivity, prisma } from '@att-crms/db'
import { OrganizationLevelRole } from '../permissions/org-permissions'
import { SystemLevelRole } from '../permissions/system-permissions'
import { User } from '@att-crms/db/client'
import { addOrganizationMemberAction, removeOrganizationMemberAction, updateOrganizationMemberRoleAction } from './member.actions'

async function addUserToAllOrganizations({ userId, systemRole }: { userId: string; systemRole: SystemLevelRole }) {
	try {
		const organizations = await prisma.organization.findMany({
			select: { id: true, name: true },
		})

		await prisma.member.createMany({
			data: organizations.map(org => ({
				userId,
				organizationId: org.id,
				role: systemRole === 'superAdmin' ? 'owner' : 'admin',
			})),
			skipDuplicates: true,
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function createUserAction({
	name,
	email,
	image,
	password,
	systemRole,
	organizations,
}: {
	name: string
	email: string
	image: string | null
	password: string
	systemRole: SystemLevelRole
	organizations?: { organizationId: string; orgRole: OrganizationLevelRole }[]
}) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		// Create user via better-auth admin API
		const newUser = await auth.api.createUser({
			body: { name, email, password, role: systemRole, data: { ...(image && { image }) } },
			headers: headersObj,
		})

		// Request password reset
		await auth.api.requestPasswordReset({
			body: { email, redirectTo: '/set-password?action=set' },
			headers: headersObj,
		})

		const userId = newUser.user.id
		const userName = newUser.user.name

		await logActivity({
			type: 'CREATE',
			resource: 'USER',
			actorId: session.user.id,
			actorName: session.user.name,
			targetId: userId,
			targetName: userName,
		})

		// Add to organizations
		if (systemRole === 'user' && organizations?.length) {
			// Add members
			await Promise.all(organizations.map(({ organizationId, orgRole }) => addOrganizationMemberAction({ userId, organizationId, role: orgRole, session })))
		} else {
			await addUserToAllOrganizations({ userId, systemRole })
		}

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

async function updateOrgMembershipsAction({
	userId,
	organizations,
	removedMembers,
	session,
}: {
	userId: string
	organizations: {
		memberId?: string
		organizationId: string
		orgRole: OrganizationLevelRole
		isNew: boolean
	}[]
	removedMembers: { memberId: string; organizationId: string }[]
	session: Session
}) {
	try {
		await Promise.all([
			// Add new memberships
			...organizations.filter(org => org.isNew).map(async ({ orgRole, organizationId }) => addOrganizationMemberAction({ userId, organizationId, role: orgRole, session })),

			// Update memberships whose role changed
			...organizations
				.filter(org => !org.isNew && org.memberId)
				.map(async ({ memberId, orgRole, organizationId }) => {
					const existingMembership = await prisma.member.findUnique({
						where: { id: memberId },
					})
					if (existingMembership?.role !== orgRole) return updateOrganizationMemberRoleAction({ memberId: memberId ?? '', role: orgRole, organizationId, session })
				}),

			// Remove deleted memberships
			...removedMembers.map(async ({ memberId, organizationId }) => removeOrganizationMemberAction({ memberId, organizationId, session })),
		])

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function updateUserAction({
	id,
	name,
	email,
	image,
	organizations,
	removedMembers,
}: {
	id: string
	name: string
	email: string
	image: string | null
	organizations?: {
		memberId?: string
		organizationId: string
		orgRole: OrganizationLevelRole
		isNew: boolean
	}[]
	removedMembers?: { memberId: string; organizationId: string }[]
}) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		// Fetch current user to detect what actually changed
		const currentUser = await prisma.user.findUnique({
			where: { id },
			select: { name: true, email: true, image: true },
		})

		const userDetailsChanged = currentUser?.name !== name || currentUser?.email !== email || currentUser?.image !== image

		await auth.api.adminUpdateUser({
			body: {
				userId: id,
				data: { name, email, ...(image && { image }) },
			},
			headers: headersObj,
		})

		// Only log UPDATE USER if user details actually changed
		if (userDetailsChanged) {
			await logActivity({
				type: 'UPDATE',
				resource: 'USER',
				actorId: session.user.id,
				actorName: session.user.name,
				targetId: id,
				targetName: name,
			})
		}

		if (organizations?.length || removedMembers?.length) {
			await updateOrgMembershipsAction({
				userId: id,
				organizations: organizations ?? [],
				removedMembers: removedMembers ?? [],
				session,
			})
		}

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function banUserAction(data: { userId: string; banReason: string | null; banExpiresIn: Date | null }) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		let banExpiresIn: number | undefined = undefined

		if (data.banExpiresIn) {
			const now = Date.now() // current time in ms
			banExpiresIn = Math.floor((data.banExpiresIn.getTime() - now) / 1000)
		}

		const response = await auth.api.banUser({
			body: {
				userId: data.userId,
				banExpiresIn,
				banReason: data?.banReason ?? undefined,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'UPDATE',
			resource: 'USER',
			actorId: session.user.id,
			actorName: session.user.name,
			targetId: response.user.id,
			targetName: response.user.name,
			metadata: { action: 'ban', reason: data.banReason },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function unbanUserAction(userId: string) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		const response = await auth.api.unbanUser({
			body: {
				userId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'UPDATE',
			resource: 'USER',
			actorId: session.user.id,
			actorName: session.user.name,
			targetId: response.user.id,
			targetName: response.user.name,
			metadata: { action: 'unban' },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function deleteUserAction(user: User) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		// Memberships are cascade deleted by better-auth
		await auth.api.removeUser({
			body: { userId: user.id },
			headers: headersObj,
		})

		await logActivity({
			type: 'DELETE',
			resource: 'USER',
			actorId: session.user.id,
			actorName: session.user.name,
			targetId: user.id,
			targetName: user.name,
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function userSignUpAction({ name, email, password, callbackURL }: { name: string; email: string; password: string; callbackURL: string }) {
	try {
		const response = await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
				callbackURL,
			},
			headers: await headers(),
		})

		await logActivity({
			type: 'CREATE',
			resource: 'USER',
			targetId: response.user.id,
			targetName: response.user.name,
			metadata: { action: 'self_signup' },
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function requestPasswordResetAction({ email, redirectTo, actor }: { email: string; redirectTo: string; actor: 'self' | 'admin' }) {
	try {
		const headersObj = await headers()

		let actorName: string | null = null
		let actorId: string | null = null

		if (actor === 'admin') {
			const session = await auth.api.getSession({ headers: headersObj })
			if (!session) return { success: false, error: 'Unauthorized' }

			const { role: sessionRole } = session.user
			if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
				return { success: false, error: 'Forbidden' }
			}

			actorName = session.user.name
			actorId = session.user.id
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, name: true },
		})

		if (!user) return { success: false, error: 'User not found' }

		await auth.api.requestPasswordReset({
			body: {
				email,
				redirectTo,
			},
		})

		await logActivity({
			type: 'ALERT',
			resource: 'USER',
			...(actorId && { actorId }),
			...(actorName && { actorName }),
			targetId: user.id,
			targetName: user.name,
			metadata: { action: actor === 'admin' ? 'admin_requested_password_reset' : 'self_requested_password_reset' },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
