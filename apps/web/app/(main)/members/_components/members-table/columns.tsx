import { ColumnDef } from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { MemberWithUser } from '@/interfaces'
import { RollCellSkeleton } from './role-cell'
import { dateRangeFilterFn } from '@/components/data-table'

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
				title='Joined On'
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
]
