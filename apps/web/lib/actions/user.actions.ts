'use server'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { formatError } from '../utils'
import { prisma } from '@att-crms/db'
import { OrganizationLevelRole } from '../permissions/org-permissions'
import { SystemLevelRole } from '../permissions/system-permissions'

export async function addOrgUserAction({ userId, organizations }: { userId: string; organizations: { organizationId: string; orgRole: OrganizationLevelRole }[] }) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		await Promise.all(
			organizations.map(async ({ organizationId, orgRole }) =>
				auth.api.addMember({
					body: { userId, organizationId, role: orgRole },
					headers: await headers(),
				}),
			),
		)

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function addUserToAllOrganizations({ userId, systemRole }: { userId: string; systemRole: SystemLevelRole }) {
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
				role: systemRole === 'superAdmin' ? 'owner' : 'admin',
			})),
			skipDuplicates: true,
		})

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export async function updateOrgMembershipsAction({
	userId,
	organizations,
	removedMembers,
}: {
	userId: string
	organizations: {
		memberId?: string
		organizationId: string
		orgRole: OrganizationLevelRole
		isNew: boolean
	}[]
	removedMembers: { memberId: string; organizationId: string }[]
}) {
	try {
		const headerObj = await headers()
		const session = await auth.api.getSession({ headers: headerObj })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { role: sessionRole } = session.user
		if (sessionRole !== 'superAdmin' && sessionRole !== 'admin') {
			return { success: false, error: 'Forbidden' }
		}

		await Promise.all([
			// Add new memberships
			...organizations
				.filter(org => org.isNew)
				.map(org =>
					auth.api.addMember({
						body: {
							userId,
							organizationId: org.organizationId,
							role: org.orgRole,
						},
						headers: headerObj,
					}),
				),

			// Update existing memberships
			...organizations
				.filter(org => !org.isNew && org.memberId)
				.map(org =>
					auth.api.updateMemberRole({
						body: {
							role: org.orgRole,
							memberId: org.memberId ?? '',
							organizationId: org.organizationId,
						},
						headers: headerObj,
					}),
				),

			// Remove deleted memberships
			...removedMembers.map(({ memberId, organizationId }) =>
				auth.api.removeMember({
					body: {
						memberIdOrEmail: memberId,
						organizationId,
					},
					headers: headerObj,
				}),
			),
		])

		return { success: true }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
