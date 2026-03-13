import { PlatformRole } from './access-control'

interface RoutePermission {
	role: PlatformRole[]
	context: ('global' | 'org')[]
}

export const routePermissions: Record<string, RoutePermission> = {
	'/': {
		role: ['superadmin', 'admin', 'user'],
		context: ['global', 'org'],
	},
	'/organizations': {
		role: ['superadmin', 'admin'],
		context: ['global'],
	},
	'/users': {
		role: ['superadmin', 'admin'],
		context: ['global'],
	},
	'/recordings': {
		role: ['superadmin', 'admin', 'user'],
		context: ['org'],
	},
	'/members': {
		role: ['superadmin', 'admin'],
		context: ['org'],
	},
}
