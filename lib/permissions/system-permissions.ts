import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, userAc } from 'better-auth/plugins/admin/access'

const statement = {
	...defaultStatements,
	recording: ['listen', 'share', 'download', 'delete'],
	organization: ['create', 'update', 'delete', 'switch'],
} as const

export const systemAccessController = createAccessControl(statement)

export const systemLevelRoles = {
	user: systemAccessController.newRole({
		recording: ['listen', 'share', 'download'],
		...userAc.statements,
	}),
	admin: systemAccessController.newRole({
		recording: ['listen', 'share', 'download'],
		...adminAc.statements,
	}),
	superAdmin: systemAccessController.newRole({
		recording: ['listen', 'share', 'download', 'delete'],
		...adminAc.statements,
	}),
}

// Create the OrganizationLevelRole type from the keys
export type SystemLevelRole = keyof typeof systemLevelRoles

// Create a literal tuple of role names
export const SYSTEM_LEVEL_ROLE_NAMES = Object.keys(systemLevelRoles) as [SystemLevelRole, ...Array<SystemLevelRole>]

export const SYSTEM_LEVEL_ROLE_LEVELS: Record<SystemLevelRole, number> = {
	user: 1,
	admin: 2,
	superAdmin: 3,
}

export const getAllowedRoles = (userRole: SystemLevelRole): string[] => {
	const currentRoleLevel = SYSTEM_LEVEL_ROLE_LEVELS[userRole] ?? -1
	return (
		Object.entries(SYSTEM_LEVEL_ROLE_LEVELS)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, level]) => level <= currentRoleLevel)
			.map(([role]) => role)
	)
}

export const getAllowedSystemAdminRoles = (userRole: SystemLevelRole): SystemLevelRole[] => {
	const currentRoleLevel = SYSTEM_LEVEL_ROLE_LEVELS[userRole] ?? -1
	const staffRoles: SystemLevelRole[] = ['admin', 'superAdmin']

	return staffRoles.filter(role => SYSTEM_LEVEL_ROLE_LEVELS[role] <= currentRoleLevel)
}
