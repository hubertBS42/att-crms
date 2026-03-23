import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, memberAc, ownerAc } from 'better-auth/plugins/organization/access'

const statement = {
	...defaultStatements,
	member: [...defaultStatements.member, 'set-role'],
	recording: ['listen', 'share', 'download', 'delete'],
} as const

export const orgAccessController = createAccessControl(statement)

export const organizationLevelRoles = {
	owner: orgAccessController.newRole({
		...ownerAc.statements,
		member: [...ownerAc.statements.member, 'set-role'],
		recording: ['listen', 'share', 'download', 'delete'],
	}),

	admin: orgAccessController.newRole({
		...adminAc.statements,
		member: [...adminAc.statements.member, 'set-role'],
		recording: ['listen', 'share', 'download'],
	}),
	member: orgAccessController.newRole({
		...memberAc.statements,
		recording: ['listen', 'share', 'download'],
	}),
}

// Create the OrganizationLevelRole type from the keys
export type OrganizationLevelRole = keyof typeof organizationLevelRoles

// Create a literal tuple of role names
export const ORG_LEVEL_ROLE_NAMES = Object.keys(organizationLevelRoles) as [OrganizationLevelRole, ...Array<OrganizationLevelRole>]
