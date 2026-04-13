import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import { User } from '@att-crms/db/client'
import { SystemLevelRole } from '@/lib/permissions/system-permissions'
import ColumnHeader from '@/components/data-table/column-header'

const genRoleBadge = (role: SystemLevelRole) => {
	const roleConfig = {
		superAdmin: { variant: 'default' as const, className: '' },
		admin: { variant: 'secondary' as const, className: '' },
		user: { variant: 'outline' as const, className: '' },
	}

	const config = roleConfig[role] || roleConfig.user
	return <Badge variant={config.variant}>{capitalizeFirstLetter(role)}</Badge>
}

export const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
				onClick={e => e.stopPropagation()}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: () => (
			<ColumnHeader
				title='Name'
				sortKey='name'
			/>
		),
	},
	{
		accessorKey: 'email',
		header: () => (
			<ColumnHeader
				title='Email'
				sortKey='email'
			/>
		),
	},
	{
		accessorKey: 'role',
		header: () => (
			<ColumnHeader
				title='Role'
				sortKey='role'
			/>
		),
		cell: ({ row }) => genRoleBadge(row.original.role as SystemLevelRole),
	},
	{
		accessorKey: 'banned',
		header: () => (
			<ColumnHeader
				title='Status'
				sortKey='banned'
			/>
		),
		cell: ({ row }) => {
			const isBanned = row.getValue('banned') as boolean
			return <Badge variant={isBanned ? 'destructive' : 'default'}>{isBanned ? 'Banned' : 'Active'}</Badge>
		},
	},
	{
		accessorKey: 'createdAt',
		header: () => (
			<ColumnHeader
				title='Created on'
				sortKey='createdAt'
			/>
		),
		cell: ({ row }) => {
			const dateTime: Date = row.original.createdAt
			const formatted = format(dateTime, 'LLL dd, y')
			return <div className='text-sm'>{formatted}</div>
		},
	},
]
