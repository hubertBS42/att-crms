import { FilterConfig } from '@/components/data-table'
import { MemberWithUser } from '@/interfaces'

export const filters: FilterConfig<MemberWithUser>[] = [
	{
		columnId: 'name',
		label: 'Name',
		type: 'text',
		placeholder: 'Search by name',
	},
]
