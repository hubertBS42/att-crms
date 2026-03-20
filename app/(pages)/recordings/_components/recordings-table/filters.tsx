import { FilterConfig } from '@/components/data-table'
import { Recording } from '@/lib/generated/prisma/client'

export const filters: FilterConfig<Recording>[] = [
	{
		columnId: 'callDate',
		label: 'Call date',
		type: 'dateRange',
	},
	{
		columnId: 'caller',
		label: 'Caller',
		type: 'text',
		placeholder: 'Search by caller',
	},
	{
		columnId: 'calledNumber',
		label: 'Number called',
		type: 'text',
		placeholder: 'Search by number called',
	},
	{
		columnId: 'answeredBy',
		label: 'Answered by',
		type: 'text',
		placeholder: 'Search by answered by',
	},
]
