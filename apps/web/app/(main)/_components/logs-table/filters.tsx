import { FilterConfig } from '@/components/data-table'

export const filters: FilterConfig[] = [
	{ key: 'target', label: 'Target', type: 'text', placeholder: 'Search target...' },
	{ key: 'actorName', label: 'Actor', type: 'text', placeholder: 'Search actor...' },
	{
		key: 'type',
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
		key: 'resource',
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
	{ key: 'createdAt', label: 'Date', type: 'dateRange' },
]
