import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, userAc } from 'better-auth/plugins/admin/access'

const statement = {
	...defaultStatements,
	recording: ['listen', 'share', 'download', 'delete'],
	organization: ['create', 'delete', 'switch'],
} as const

export const ac = createAccessControl(statement)

export const roles = {
	// Platform-level roles
	user: ac.newRole({
		recording: ['listen', 'share', 'download'],
		organization: ['switch'],
		...userAc.statements,
	}),
	admin: ac.newRole({
		recording: ['listen', 'share', 'download', 'delete'],
		organization: ['create', 'switch'],
		...adminAc.statements,
	}),
	superadmin: ac.newRole({
		recording: ['listen', 'share', 'download', 'delete'],
		organization: ['create', 'delete', 'switch'],
		...adminAc.statements,
	}),

	// Organization-level roles
	member: ac.newRole({
		recording: ['listen', 'share'],
	}),
	orgAdmin: ac.newRole({
		recording: ['listen', 'share', 'download', 'delete'],
	}),
	owner: ac.newRole({
		recording: ['listen', 'share', 'download', 'delete'],
		organization: ['delete', 'switch'],
	}),
} as const
