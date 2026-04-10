'use server'

import { auth, type Session } from '@/lib/auth'
import { headers } from 'next/headers'
import { formatError } from '@/lib/utils'
import { logActivity, prisma } from '@att-crms/db'
import { OrganizationLevelRole } from '../permissions/org-permissions'
import { redirect } from 'next/navigation'

export async function addOrganizationMemberAction({
	userId,
	organizationId,
	role,
	session,
}: {
	userId: string
	organizationId: string
	role: OrganizationLevelRole
	session?: Session
}) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		// Fetch org and user in parallel
		const [organization, user] = await Promise.all([
			prisma.organization.findUnique({
				where: { id: organizationId },
				select: { id: true, name: true },
			}),
			prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, name: true },
			}),
		])

		if (!organization) return { success: false, error: 'Organization not found' }
		if (!user) return { success: false, error: 'User not found' }

		await auth.api.addMember({
			body: {
				userId,
				role,
				organizationId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'CREATE',
			resource: 'MEMBER',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId: organization.id,
			organizationName: organization.name,
			targetId: user.id,
			targetName: user.name,
			metadata: {
				role,
			},
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function removeOrganizationMemberAction({ memberId, organizationId, session }: { memberId: string; organizationId: string; session?: Session }) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		// Fetch member before removing so we have their details for logging
		const member = await prisma.member.findUnique({
			where: { id: memberId },
			include: {
				user: { select: { id: true, name: true } },
				organization: { select: { id: true, name: true } },
			},
		})

		if (!member) return { success: false, error: 'Member not found' }

		await auth.api.removeMember({
			body: {
				memberIdOrEmail: memberId,
				organizationId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'DELETE',
			resource: 'MEMBER',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId: member.organization.id,
			organizationName: member.organization.name,
			targetId: member.user.id,
			targetName: member.user.name,
		})
	} catch (error) {
		return { success: false, error: formatError(error) }
	}

	redirect('/members?success=Member+removed+successfully')
}

export async function updateOrganizationMemberRoleAction({
	memberId,
	organizationId,
	role,
	session,
}: {
	memberId: string
	organizationId: string
	role: string
	session?: Session
}) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		const member = await prisma.member.findUnique({
			where: { id: memberId },
			include: {
				user: { select: { id: true, name: true } },
				organization: { select: { id: true, name: true } },
			},
		})

		if (!member) return { success: false, error: 'Member not found' }

		await auth.api.updateMemberRole({
			body: {
				memberId,
				role,
				organizationId,
			},

			headers: headersObj,
		})

		await logActivity({
			type: 'UPDATE',
			resource: 'MEMBER',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId: member.organization.id,
			organizationName: member.organization.name,
			targetId: member.user.id,
			targetName: member.user.name,
			metadata: {
				role,
			},
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function leaveOrganizationAction({ organizationId, session }: { organizationId: string; session?: Session }) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		const organization = await prisma.organization.findUnique({
			where: { id: organizationId },
			select: { name: true },
		})

		if (!organization) return { success: false, error: 'Organization not found' }

		await auth.api.leaveOrganization({
			body: {
				organizationId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'DELETE',
			resource: 'MEMBER',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId,
			organizationName: organization.name,
			metadata: {
				action: 'leave_organization',
			},
		})
	} catch (error) {
		return { success: false, error: formatError(error) }
	}

	redirect('/removed-from-organization?success=You+have+left+the+organization')
}
