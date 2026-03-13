import { LayoutDashboardIcon, Building2, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon } from 'lucide-react'
import { BreadcrumbConfig, NavItem } from './interfaces'
import { OrganizationPlan, OrganizationStatus } from './lib/generated/prisma/enums'
import { capitalizeFirstLetter } from './lib/utils'

export const APP_NAME = 'CRMS'
export const APP_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const APP_URL = 'http://localhost:3000'
export const NAV_ITEMS: { main: NavItem[]; secondary: NavItem[] } = {
	main: [
		{
			title: 'Dashboard',
			url: '/',
			icon: LayoutDashboardIcon,
			context: ['global', 'org'],
			role: ['superadmin', 'admin', 'user'],
		},
		{
			title: 'Organizations',
			url: '/organizations',
			icon: Building2,
			context: ['global'],
			role: ['superadmin', 'admin'],
		},
		{
			title: 'Users',
			url: '/users',
			icon: UsersIcon,
			context: ['global'],
			role: ['superadmin', 'admin'],
		},
	],
	secondary: [
		{
			title: 'Settings',
			url: '/settings',
			icon: Settings2Icon,
			context: ['global'],
			role: ['superadmin', 'admin'],
		},
		{
			title: 'Get Help',
			url: '#',
			icon: CircleHelpIcon,
			context: ['global'],
			role: ['superadmin', 'admin'],
		},
		{
			title: 'Search',
			url: '#',
			icon: SearchIcon,
			context: ['global'],
			role: ['superadmin', 'admin'],
		},
	],
}
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
