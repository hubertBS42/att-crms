import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, userAc } from 'better-auth/plugins/admin/access'

const statement = {
	...defaultStatements,
	recording: ['listen', 'share', 'download', 'delete'],
	organization: ['create', 'delete', 'switch'],
} as const

export const ac = createAccessControl(statement)

export const platformRoles = {
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
} as const

export const organizationRoles = {
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

// Create the Role type from the keys
export type PlatformRole = keyof typeof platformRoles
export type OrganizationRole = keyof typeof organizationRoles

// Create a literal tuple of role names
export const PLATFORM_ROLE_NAMES = Object.keys(platformRoles) as [PlatformRole, ...Array<PlatformRole>]

export const PLATFORM_ROLE_LEVELS: Record<PlatformRole, number> = {
	user: 1,
	admin: 2,
	superadmin: 3,
}

export const getAllowedRoles = (userRole: PlatformRole): string[] => {
	const currentRoleLevel = PLATFORM_ROLE_LEVELS[userRole] ?? -1
	return Object.entries(PLATFORM_ROLE_LEVELS)
		.filter(([_, level]) => level <= currentRoleLevel)
		.map(([role]) => role)
}
