import { createAuthClient } from 'better-auth/react'
import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { ac, roles } from '@/access-control'

export const authClient = createAuthClient({
	plugins: [
		organizationClient(),
		adminClient({
			ac,
			roles,
		}),
	],
})
