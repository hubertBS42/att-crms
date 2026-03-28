import { FilterConfig } from '@/components/data-table'
import { InvitationWithUser } from '@/interfaces'

export const filters: FilterConfig<InvitationWithUser>[] = [
	{
		columnId: 'email',
		label: 'Email',
		type: 'text',
		placeholder: 'Search by email',
	},
]
