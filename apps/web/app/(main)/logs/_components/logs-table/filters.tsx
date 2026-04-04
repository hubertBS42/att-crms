import { FilterConfig } from '@/components/data-table'
import { Activity } from '@att-crms/db/client'

export const filters: FilterConfig<Activity>[] = [
	{
		columnId: 'actorName',
		label: 'Actor',
		type: 'text',
		placeholder: 'Search by actor...',
	},
	{
		columnId: 'type',
		label: 'Type',
		type: 'select',
		options: [
			{ label: 'All', value: 'all' },
			{ label: 'Create', value: 'CREATE' },
			{ label: 'Update', value: 'UPDATE' },
			{ label: 'Delete', value: 'DELETE' },
			{ label: 'Alert', value: 'ALERT' },
		],
	},
	{
		columnId: 'resource',
		label: 'Resource',
		type: 'select',
		options: [
			{ label: 'All', value: 'all' },
			{ label: 'Recording', value: 'RECORDING' },
			{ label: 'Organization', value: 'ORGANIZATION' },
			{ label: 'Member', value: 'MEMBER' },
			{ label: 'Invitation', value: 'INVITATION' },
			{ label: 'User', value: 'USER' },
		],
	},
	{
		columnId: 'createdAt',
		label: 'Date',
		type: 'dateRange',
	},
]
