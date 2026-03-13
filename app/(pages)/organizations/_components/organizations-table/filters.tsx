import { FilterConfig } from '@/components/data-table'
import { Organization } from '@/lib/generated/prisma/client'

export const filters: FilterConfig<Organization>[] = [
	{
		columnId: 'name',
		label: 'Name',
		type: 'text',
		placeholder: 'Search by name',
	},
]
