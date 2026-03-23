import { FilterConfig } from '@/components/data-table'
import { Organization } from '@att-crms/db/client'

export const filters: FilterConfig<Organization>[] = [
	{
		columnId: 'name',
		label: 'Name',
		type: 'text',
		placeholder: 'Search by name',
	},
]
