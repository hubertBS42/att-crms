import { createAuthClient } from 'better-auth/react'
import { adminClient, inferOrgAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { systemAccessController, systemLevelRoles } from './permissions/system-permissions'
import { orgAccessController, organizationLevelRoles } from './permissions/org-permissions'
import { auth } from './auth'

export const authClient = createAuthClient({
	plugins: [
		adminClient({
			ac: systemAccessController,
			roles: systemLevelRoles,
		}),
		organizationClient({
			ac: orgAccessController,
			roles: organizationLevelRoles,
			schema: inferOrgAdditionalFields<typeof auth>(),
		}),
	],
})
