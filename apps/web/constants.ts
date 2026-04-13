import os from 'os'
import path from 'path'
import { BreadcrumbConfig } from './interfaces'
import { OrganizationPlan, OrganizationStatus } from '@att-crms/db/enums'
import { capitalizeFirstLetter } from './lib/utils'
export const APP_NAME = 'ATT CRMS'
export const APP_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const APP_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const APP_LOGO = 'https://attdata.co.uk/resources/images/logo.png'
export const RECORDINGS_PATH = process.env.RECORDINGS_PATH ?? path.join(os.homedir(), 'call_recordings')

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
			{ text: 'Manage Organizations', href: '#' },
		],
	},
	{
		pathname: '/organizations/add',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Organizations', href: '/organizations' },
			{ text: 'Add Organization', href: '#' },
		],
	},
	{
		pathname: '/organizations/[id]/edit',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Organizations', href: '/organizations' },
			{ text: 'Edit Organization', href: '#' },
		],
	},
	{
		pathname: '/users',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Users', href: '#' },
		],
	},
	{
		pathname: '/users/add',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Users', href: '/users' },
			{ text: 'Add User', href: '#' },
		],
	},
	{
		pathname: '/users/[id]/edit',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Users', href: '/users' },
			{ text: 'Edit User', href: '#' },
		],
	},
	{
		pathname: '/recordings',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Recordings', href: '#' },
		],
	},
	{
		pathname: '/members',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Members', href: '#' },
		],
	},
	{
		pathname: '/members/[id]/details',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Manage Members', href: '/members' },
			{ text: 'Member Details', href: '#' },
		],
	},
	{
		pathname: '/organization',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organization Overview', href: '#' },
		],
	},
	{
		pathname: '/organization/logs',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organization Logs', href: '#' },
		],
	},
	{
		pathname: '/organization/members',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organization Members', href: '#' },
		],
	},
	{
		pathname: '/organization/invitations',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Organization Invitations', href: '#' },
		],
	},
	{
		pathname: '/account',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account Overview', href: '#' },
		],
	},
	{
		pathname: '/account/profile',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account Overview', href: '/account' },
			{ text: 'Profile Details', href: '#' },
		],
	},
	{
		pathname: '/account/password',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account Overview', href: '/account' },
			{ text: 'Change Password', href: '#' },
		],
	},
	{
		pathname: '/account/sessions',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Account Overview', href: '/account' },
			{ text: 'Manage Sessions', href: '#' },
		],
	},
	{
		pathname: '/logs',
		segments: [
			{ text: 'Dashboard', href: '/' },
			{ text: 'Activity Logs', href: '#' },
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

export const RETENTION_OPTIONS = [
	{ label: 'Keep forever', value: 'forever' },
	{ label: '30 days', value: '30' },
	{ label: '60 days', value: '60' },
	{ label: '90 days', value: '90' },
	{ label: '180 days', value: '180' },
	{ label: '1 year', value: '365' },
	{ label: '2 years', value: '730' },
]
