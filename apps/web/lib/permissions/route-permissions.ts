import { AudioLines, Building2, LayoutDashboard, LucideIcon, Settings2Icon, UsersIcon } from 'lucide-react'
import { SystemLevelRole } from './system-permissions'
import { NavSubItem } from '@/interfaces'

interface RoutePermission {
	role: SystemLevelRole[]
	context: ('global' | 'org')[]
	nav?: {
		title: string
		icon: LucideIcon
		group: 'main' | 'secondary'
		order: number
		items?: NavSubItem[]
	}
}

export const routePermissions: Record<string, RoutePermission> = {
	'/': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['global', 'org'],
		nav: {
			title: 'Dashboard',
			icon: LayoutDashboard,
			group: 'main',
			order: 1,
		},
	},
	'/organizations': {
		role: ['superAdmin', 'admin'],
		context: ['global'],
		nav: {
			title: 'Organizations',
			icon: Building2,
			group: 'main',
			order: 2,
		},
	},
	'/users': {
		role: ['superAdmin', 'admin'],
		context: ['global'],
		nav: {
			title: 'Users',
			icon: UsersIcon,
			group: 'main',
			order: 3,
		},
	},
	'/recordings': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
		nav: {
			title: 'Recordings',
			icon: AudioLines,
			group: 'main',
			order: 1,
		},
	},
	'/members': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
		nav: {
			title: 'Members',
			icon: UsersIcon,
			group: 'main',
			order: 2,
		},
	},
	'/settings': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
		nav: {
			title: 'Settings',
			icon: Settings2Icon,
			group: 'secondary',
			order: 1,
		},
	},

	'/account/profile': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['global', 'org'],
	},
	'/account/password': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['global', 'org'],
	},
}
