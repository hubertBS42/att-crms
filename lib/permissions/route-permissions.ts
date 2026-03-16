import { SystemLevelRole } from './system-permissions'

interface RoutePermission {
	role: SystemLevelRole[]
	context: ('global' | 'org')[]
}

export const routePermissions: Record<string, RoutePermission> = {
	'/': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['global', 'org'],
	},
	'/organizations': {
		role: ['superAdmin', 'admin'],
		context: ['global'],
	},
	'/users': {
		role: ['superAdmin', 'admin'],
		context: ['global'],
	},
	'/recordings': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
	},
	'/members': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
	},
}
