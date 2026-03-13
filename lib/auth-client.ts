import { createAuthClient } from 'better-auth/react'
import { adminClient, inferOrgAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { ac, platformRoles } from '@/lib/access-control'

export const authClient = createAuthClient({
	plugins: [
		organizationClient({
			schema: inferOrgAdditionalFields({
				organization: {
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
			}),
		}),
		adminClient({
			ac,
			roles: platformRoles,
		}),
	],
})
