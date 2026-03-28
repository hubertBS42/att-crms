import os from 'os'
import path from 'path'
import { BreadcrumbConfig } from './interfaces'
import { OrganizationPlan, OrganizationStatus } from '@att-crms/db/enums'
import { capitalizeFirstLetter } from './lib/utils'
export const APP_NAME = 'ATT CRMS'
export const APP_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const APP_URL = process.env.SERVER_URL || 'http://localhost:3000'
export const APP_LOGO = 'https://attdata.co.uk/resources/images/logo.png'
export const RECORDINGS_PATH = path.join(os.homedir(), process.env.RECORDINGS_DIR ?? 'call_recordings')

export const RESET_PASSWORD_TOKEN_EXPIRATON = 1800 // 30 minutes
export const INVITATION_EXPIRATON = 1800 // 30 minutes
export const SESSION_CACHE_EXPIRATION = 300 // 5 minutes

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
	{
		pathname: '/account',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account overview', href: '#' },
		],
	},
	{
		pathname: '/account/profile',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account overview', href: '/account' },
			{ text: 'Profile', href: '#' },
		],
	},
	{
		pathname: '/account/password',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account overview', href: '/account' },
			{ text: 'Password', href: '#' },
		],
	},
	{
		pathname: '/account/sessions',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account overview', href: '/account' },
			{ text: 'Sessions', href: '#' },
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
