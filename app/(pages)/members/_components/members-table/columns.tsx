import { ColumnDef, FilterFn } from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import { ActionsSkeleton } from './actions'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { MemberWithUser } from '@/interfaces'
import { RollCellSkeleton } from './role-cell'

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
const RoleCell = dynamic(() => import('./role-cell'), { ssr: false, loading: () => <RollCellSkeleton /> })

export const columns: ColumnDef<MemberWithUser>[] = [
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
		id: 'name',
		accessorFn: row => row.user.name,
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Name'
			/>
		),
		// cell: ({ row }) => row.original.user.name,
	},
	{
		id: 'email',
		accessorFn: row => row.user.email,
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Email'
			/>
		),
		// cell: ({ row }) => row.original.user.email,
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Role'
			/>
		),
		cell: ({ row }) => <RoleCell member={row.original} />,
		filterFn: 'equals',
	},

	{
		id: 'createdAt',
		accessorFn: row => row.user.createdAt,
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Joined on'
			/>
		),
		cell: ({ row }) => {
			const dateTime: Date = row.original.user.createdAt
			const formatted = format(dateTime, 'LLL dd, y')
			return <div className='text-sm'>{formatted}</div>
		},
		sortingFn: 'datetime',
		filterFn: dateRangeFilterFn,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const member = row.original
			return <Actions member={member} />
		},
	},
]
