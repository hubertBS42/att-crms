'use server'

import { headers } from 'next/headers'
import { auth, Session } from '../auth'
import { OrganizationLevelRole } from '../permissions/org-permissions'
import { logActivity, prisma } from '@att-crms/db'
import { formatError } from '../utils'

export async function inviteMemberAction({ email, role, session }: { email: string; role: OrganizationLevelRole; session?: Session }) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = sessionData.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		await auth.api.createInvitation({
			body: {
				email,
				role,
				organizationId: activeOrganizationId,
			},
			headers: headersObj,
		})

		const [user, org] = await Promise.all([
			prisma.user.findUnique({
				where: { email },
				select: { id: true, name: true },
			}),
			prisma.organization.findUnique({
				where: { id: activeOrganizationId },
				select: { name: true },
			}),
		])

		if (!org) return { success: false, error: 'Organization not found' }

		await logActivity({
			type: 'CREATE',
			resource: 'INVITATION',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId: activeOrganizationId,
			organizationName: org.name,
			...(user && { targetId: user.id }),
			targetName: user?.name ?? email,
			metadata: {
				action: 'invitation_sent',
				role,
			},
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function acceptInvitationAction({
	invitationId,
	organizationId,
	organizationName,
	session,
}: {
	invitationId: string
	organizationId: string
	organizationName: string
	session?: Session
}) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		await auth.api.acceptInvitation({
			body: {
				invitationId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'UPDATE',
			resource: 'INVITATION',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId,
			organizationName,
			targetId: sessionData.user.id,
			targetName: sessionData.user.name,
			metadata: { action: 'invitation_accepted' },
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function rejectInvitationAction({
	invitationId,
	organizationId,
	organizationName,
	session,
}: {
	invitationId: string
	organizationId: string
	organizationName: string
	session?: Session
}) {
	try {
		const headersObj = await headers()

		// Use provided session or fetch it
		const sessionData = session ?? (await auth.api.getSession({ headers: headersObj }))
		if (!sessionData) return { success: false, error: 'Unauthorized' }

		await auth.api.rejectInvitation({
			body: {
				invitationId,
			},
			headers: headersObj,
		})

		await logActivity({
			type: 'UPDATE',
			resource: 'INVITATION',
			actorId: sessionData.user.id,
			actorName: sessionData.user.name,
			organizationId,
			organizationName,
			targetId: sessionData.user.id,
			targetName: sessionData.user.name,
			metadata: { action: 'invitation_rejected' },
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function cancelInvitationAction(invitationId: string) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const invitation = await prisma.invitation.findUnique({
			where: { id: invitationId },
			include: { organization: { select: { id: true, name: true } } },
		})

		if (!invitation) return { success: false, error: 'Invitation not found' }

		await auth.api.cancelInvitation({
			body: { invitationId },
			headers: headersObj,
		})

		const user = await prisma.user.findUnique({
			where: { email: invitation.email },
			select: { id: true, name: true },
		})

		await logActivity({
			type: 'DELETE',
			resource: 'INVITATION',
			actorId: session.user.id,
			actorName: session.user.name,
			organizationId: invitation.organization.id,
			organizationName: invitation.organization.name,
			...(user && { targetId: user.id }),
			targetName: user?.name ?? invitation.email,
			metadata: { action: 'invitation_cancelled' },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function resendInvitationAction(invitationId: string) {
	try {
		const headersObj = await headers()
		const session = await auth.api.getSession({ headers: headersObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const invitation = await prisma.invitation.findUnique({
			where: { id: invitationId },
			include: { organization: { select: { id: true, name: true } } },
		})

		if (!invitation) return { success: false, error: 'Invitation not found' }

		// Cancel existing and create a new one
		await auth.api.cancelInvitation({
			body: { invitationId },
			headers: headersObj,
		})

		await auth.api.createInvitation({
			body: {
				email: invitation.email,
				role: invitation.role as OrganizationLevelRole,
				organizationId: invitation.organizationId,
			},
			headers: headersObj,
		})

		const user = await prisma.user.findUnique({
			where: { email: invitation.email },
			select: { id: true, name: true },
		})

		await logActivity({
			type: 'CREATE',
			resource: 'INVITATION',
			actorId: session.user.id,
			actorName: session.user.name,
			organizationId: invitation.organization.id,
			organizationName: invitation.organization.name,
			...(user && { targetId: user.id }),
			targetName: user?.name ?? invitation.email,
			metadata: { action: 'invitation_resent', role: invitation.role },
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
