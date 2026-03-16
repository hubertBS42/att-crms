import { ColumnDef, FilterFn } from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import { ActionsSkeleton } from './actions'
import { User } from '@/lib/generated/prisma/client'
import { SystemLevelRole } from '@/lib/permissions/system-permissions'

const genRoleBadge = (role: SystemLevelRole) => {
	const roleConfig = {
		superAdmin: { variant: 'default' as const, className: '' },
		admin: { variant: 'secondary' as const, className: '' },
		user: { variant: 'outline' as const, className: '' },
	}

	const config = roleConfig[role] || roleConfig.user
	return <Badge variant={config.variant}>{capitalizeFirstLetter(role)}</Badge>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dateRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
	if (!filterValue || !Array.isArray(filterValue)) return true

	const [start, end] = filterValue as [Date, Date]
	const cellValue = row.getValue(columnId)

	// Handle null/undefined values
	if (cellValue == null) return false

	// Convert to Date object
	let date: Date
	if (cellValue instanceof Date) {
		date = cellValue
	} else if (typeof cellValue === 'string' || typeof cellValue === 'number') {
		date = new Date(cellValue)
	} else {
		return false
	}

	// Check if date is valid
	if (isNaN(date.getTime())) return false

	// Compare dates (ignoring time for start, including time for end)
	return date >= start && date <= end
}

const Actions = dynamic(() => import('./actions'), { ssr: false, loading: () => <ActionsSkeleton /> })

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
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Name'
			/>
		),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Email'
			/>
		),
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Role'
			/>
		),
		cell: ({ row }) => genRoleBadge(row.original.role as SystemLevelRole),
		filterFn: 'equals',
	},
	{
		accessorKey: 'banned',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Status'
			/>
		),
		cell: ({ row }) => {
			const isBanned = row.getValue('banned') as boolean
			return <Badge variant={isBanned ? 'destructive' : 'default'}>{isBanned ? 'Banned' : 'Active'}</Badge>
		},
		filterFn: 'equals',
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Created on'
			/>
		),
		cell: ({ row }) => {
			const dateTime: Date = row.original.createdAt
			const formatted = format(dateTime, 'LLL dd, y')
			return <div className='text-sm'>{formatted}</div>
		},
		sortingFn: 'datetime',
		filterFn: dateRangeFilterFn,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original
			return <Actions userId={user.id} />
		},
	},
]
