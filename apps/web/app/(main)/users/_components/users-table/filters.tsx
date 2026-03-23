import { FilterConfig } from '@/components/data-table'
// import { SYSTEM_ROLE_NAMES } from '@/lib/access-control'
import { User } from '@att-crms/db/client'
// import { capitalizeFirstLetter } from '@/lib/utils'

export const filters: FilterConfig<User>[] = [
	{
		columnId: 'name',
		label: 'Name',
		type: 'text',
		placeholder: 'Search by name',
	},
	// {
	// 	columnId: 'email',
	// 	label: 'Email',
	// 	type: 'text',
	// 	placeholder: 'Search by email...',
	// },
	// {
	// 	columnId: 'role',
	// 	label: 'Role',
	// 	type: 'select',
	// 	placeholder: 'Filter by role',
	// 	options: [{ label: 'All', value: 'all' }, ...SYSTEM_ROLE_NAMES.map(role => ({ label: capitalizeFirstLetter(role), value: role }))],
	// },
	// {
	// 	columnId: 'banned',
	// 	label: 'Status',
	// 	type: 'select',
	// 	placeholder: 'Filter by status',
	// 	options: [
	// 		{ label: 'All', value: 'all' },
	// 		{ label: 'Active', value: 'false' },
	// 		{ label: 'Banned', value: 'true' },
	// 	],
	// },
	// {
	// 	columnId: 'createdAt',
	// 	label: 'Created on',
	// 	type: 'dateRange',
	// },
]
