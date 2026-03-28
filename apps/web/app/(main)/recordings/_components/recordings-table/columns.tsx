import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { Recording } from '@att-crms/db/client'
import { formatDuration } from '@/lib/utils'
import { dateRangeFilterFn } from '@/components/data-table'

export const columns: ColumnDef<Recording>[] = [
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
				onClick={e => e.stopPropagation()}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'callDate',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Call date'
			/>
		),
		cell: ({ row }) => <div className='text-sm'>{format(new Date(row.original.callDate), 'LLL dd, y')}</div>,
		filterFn: dateRangeFilterFn,
	},
	{
		accessorKey: 'callTime',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Call time'
			/>
		),
		cell: ({ row }) => <div className='text-sm font-mono'>{row.original.callTime}</div>,
		enableSorting: false,
	},
	{
		accessorKey: 'caller',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Caller'
			/>
		),
	},
	{
		accessorKey: 'calledNumber',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Number called'
			/>
		),
	},
	{
		accessorKey: 'answeredBy',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Answered by'
			/>
		),
	},
	{
		accessorKey: 'duration',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Duration'
			/>
		),
		cell: ({ row }) => <div className='text-sm font-mono'>{formatDuration(row.original.duration, 'timestamp')}</div>,
	},
]
