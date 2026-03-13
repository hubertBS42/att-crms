import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin, organization } from 'better-auth/plugins'
import { ac, platformRoles, organizationRoles } from '@/lib/access-control'

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: false,
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	plugins: [
		admin({
			ac,
			platformRoles,
		}),
		organization({
			ac,
			organizationRoles,
			allowUserToCreateOrganization: async user => {
				// Only platform admins and superadmins can create organizations
				return user.role === 'admin' || user.role === 'superadmin'
			},
			sendInvitationEmail: async data => {
				// Send invitation email
			},
			organizationHooks: {
				afterCreateOrganization: async ({ organization }) => {
					// Fetch all superadmins and admins
					const platformStaff = await prisma.user.findMany({
						where: {
							role: { in: ['superadmin', 'admin'] },
						},
					})

					// Add all platform staff as members of the new org
					await prisma.member.createMany({
						data: platformStaff.map(staff => ({
							userId: staff.id,
							organizationId: organization.id,
							role: staff.role === 'superadmin' ? 'owner' : 'admin',
						})),
						skipDuplicates: true,
					})
				},
			},
			schema: {
				organization: {
					modelName: 'organization',
					additionalFields: {
						plan: {
							type: 'string',
							input: true,
							required: false,
						},
						status: {
							type: 'string',
							input: true,
							required: false,
						},
					},
				},
			},
		}),
		nextCookies(),
	],
})
