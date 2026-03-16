import { createAuthClient } from 'better-auth/react'
import { adminClient, inferOrgAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { systemAccessController, systemLevelRoles } from './permissions/system-permissions'
import { orgAccessController, organizationLevelRoles } from './permissions/org-permissions'

export const authClient = createAuthClient({
	plugins: [
		organizationClient({
			schema: inferOrgAdditionalFields({
				organization: {
					additionalFields: {
						plan: {
							type: 'string',
							input: true,
							required: true,
						},
						status: {
							type: 'string',
							input: true,
							required: true,
						},
					},
				},
			}),
		}),
		adminClient({
			ac: systemAccessController,
			roles: systemLevelRoles,
		}),
		organizationClient({
			ac: orgAccessController,
			roles: organizationLevelRoles,
		}),
	],
})
