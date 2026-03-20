import { ColumnDef, FilterFn } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { Recording } from '@/lib/generated/prisma/client'
import { formatDuration } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dateRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
	if (!filterValue || !Array.isArray(filterValue)) return true

	const [start, end] = filterValue as [Date, Date]
	const cellValue = row.getValue(columnId)

	if (cellValue == null) return false

	let date: Date
	if (cellValue instanceof Date) {
		date = cellValue
	} else if (typeof cellValue === 'string' || typeof cellValue === 'number') {
		date = new Date(cellValue)
	} else {
		return false
	}

	if (isNaN(date.getTime())) return false

	return date >= start && date <= end
}

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
	// {
	// 	accessorKey: 'size',
	// 	header: ({ column }) => (
	// 		<ColumnHeader
	// 			column={column}
	// 			title='Size'
	// 		/>
	// 	),
	// 	cell: ({ row }) => <div className='text-sm'>{formatSize(row.original.size)}</div>,
	// },
]
