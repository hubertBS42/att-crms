import { AudioLines, Building2, LayoutDashboard, LucideIcon, ScrollTextIcon, UsersIcon } from 'lucide-react'
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
	'/logs': {
		role: ['superAdmin', 'admin'],
		context: ['global'],
		nav: {
			title: 'Logs',
			icon: ScrollTextIcon,
			group: 'main',
			order: 4,
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
	// '/members': {
	// 	role: ['superAdmin', 'admin', 'user'],
	// 	context: ['org'],
	// 	nav: {
	// 		title: 'Members',
	// 		icon: UsersIcon,
	// 		group: 'main',
	// 		order: 2,
	// 	},
	// },
	'/organization': {
		role: ['superAdmin', 'admin', 'user'],
		context: ['org'],
		nav: {
			title: 'Organization',
			icon: Building2,
			group: 'main',
			order: 2,
			items: [
				{
					title: 'Members',
					url: '/organization/members',
					context: ['org'],
				},
				{
					title: 'Invitations',
					url: '/organization/invitations',
					context: ['org'],
				},
				{
					title: 'Logs',
					url: '/organization/logs',
					context: ['org'],
				},
			],
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
