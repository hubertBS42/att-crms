import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin, organization } from 'better-auth/plugins'
import { ac, roles } from '@/access-control'

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
			roles,
		}),
		organization({
			ac,
			roles,
			allowUserToCreateOrganization: async user => {
				// Only platform admins and superadmins can create organizations
				return user.role === 'admin' || user.role === 'superadmin'
			},
			sendInvitationEmail: async data => {
				// Send invitation email
			},
		}),
		nextCookies(),
	],
})
