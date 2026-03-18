// import { LayoutDashboardIcon, Building2, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, AudioLines } from 'lucide-react'
import { BreadcrumbConfig } from './interfaces'
import { OrganizationPlan, OrganizationStatus } from './lib/generated/prisma/enums'
import { capitalizeFirstLetter } from './lib/utils'
import os from 'os'
import path from 'path'

export const APP_NAME = 'ATT CRMS'
export const APP_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const APP_URL = process.env.SERVER_URL || 'http://localhost:3000'
export const APP_LOGO = 'https://www.attelecoms.co.uk/templates/att/images/logo.png'
export const RECORDINGS_PATH = path.join(os.homedir(), process.env.RECORDINGS_DIR ?? 'call_recordings')

export const RESET_PASSWORD_TOKEN_EXPIRATON = 1800 // 30 minutes
export const INVITATION_EXPIRATON = 1800 // 30 minutes
export const SESSION_CACHE_EXPIRATION = 300 // 5 minutes

// export const NAV_ITEMS: { main: NavItem[]; secondary: NavItem[] } = {
// 	main: [
// 		{
// 			title: 'Dashboard',
// 			url: '/',
// 			icon: LayoutDashboardIcon,
// 			context: ['global', 'org'],
// 			role: ['superAdmin', 'admin', 'user'],
// 		},
// 		{
// 			title: 'Organizations',
// 			url: '/organizations',
// 			icon: Building2,
// 			context: ['global'],
// 			role: ['superAdmin', 'admin'],
// 		},
// 		{
// 			title: 'Users',
// 			url: '/users',
// 			icon: UsersIcon,
// 			context: ['global'],
// 			role: ['superAdmin', 'admin'],
// 		},
// 		{
// 			title: 'Recordings',
// 			url: '/recordings',
// 			icon: AudioLines,
// 			context: ['org'],
// 			role: ['superAdmin', 'admin', 'user'],
// 		},
// 		{
// 			title: 'Members',
// 			url: '/members',
// 			icon: UsersIcon,
// 			context: ['org'],
// 			role: ['superAdmin', 'admin', 'user'],
// 		},
// 	],
// 	secondary: [
// 		{
// 			title: 'Settings',
// 			url: '/settings',
// 			icon: Settings2Icon,
// 			context: ['global'],
// 			role: ['superAdmin', 'admin'],
// 		},
// 		{
// 			title: 'Get Help',
// 			url: '#',
// 			icon: CircleHelpIcon,
// 			context: ['global'],
// 			role: ['superAdmin', 'admin'],
// 		},
// 		{
// 			title: 'Search',
// 			url: '#',
// 			icon: SearchIcon,
// 			context: ['global'],
// 			role: ['superAdmin', 'admin'],
// 		},
// 	],
// }
export const BREADCRUMB_DATA: BreadcrumbConfig[] = [
	{
		pathname: '/',
		segments: [
			{
				text: 'Dashboard',
				href: '/',
			},
		],
	},
	{
		pathname: '/organizations',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organizations', href: '#' },
		],
	},
	{
		pathname: '/organizations/add',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organizations', href: '/organizations' },
			{ text: 'Add organization', href: '#' },
		],
	},
	{
		pathname: '/organizations/[id]/edit',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organizations', href: '/organizations' },
			{ text: 'Edit organization', href: '#' },
		],
	},
	{
		pathname: '/users',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Users', href: '#' },
		],
	},
	{
		pathname: '/users/add',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Users', href: '/users' },
			{ text: 'Add user', href: '#' },
		],
	},
	{
		pathname: '/users/[id]/edit',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Users', href: '/users' },
			{ text: 'Edit user', href: '#' },
		],
	},
	{
		pathname: '/recordings',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Recordings', href: '#' },
		],
	},
	{
		pathname: '/members',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Members', href: '#' },
		],
	},
	{
		pathname: '/members/[id]/details',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Members', href: '/members' },
			{ text: 'Member details', href: '#' },
		],
	},
	{
		pathname: '/settings',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Settings', href: '#' },
		],
	},
]

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50]
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export const ORGANIZATION_STATUS_OPTIONS = Object.values(OrganizationStatus).map(value => ({
	label: capitalizeFirstLetter(value),
	value,
}))

export const ORGANIZATION_PLAN_OPTIONS = Object.values(OrganizationPlan).map(value => ({
	label: capitalizeFirstLetter(value),
	value,
}))
