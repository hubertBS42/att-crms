import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns-tz'
import { Recording } from '@att-crms/db/client'
import { formatDuration } from '@/lib/utils'
import ColumnHeader from '@/components/data-table/column-header'

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
		header: () => (
			<ColumnHeader
				title='Call Date'
				sortKey='datetime'
			/>
		),
		cell: ({ row }) => <span>{format(new Date(row.original.datetime), 'MMM d, yyyy', { timeZone: 'UTC' })}</span>,
	},
	{
		accessorKey: 'callTime',
		header: () => (
			<ColumnHeader
				title='Call Time'
				sortKey='callTime'
				enableSorting={false}
			/>
		),
		cell: ({ row }) => <span className='font-mono'>{format(new Date(row.original.datetime), 'HH:mm:ss', { timeZone: 'UTC' })}</span>,
	},
	{
		accessorKey: 'caller',
		header: () => (
			<ColumnHeader
				title='Caller'
				sortKey='caller'
				enableSorting={false}
			/>
		),
	},
	{
		accessorKey: 'calledNumber',
		header: () => (
			<ColumnHeader
				title='Number Called'
				sortKey='calledNumber'
				enableSorting={false}
			/>
		),
	},
	{
		accessorKey: 'answeredBy',
		header: () => (
			<ColumnHeader
				title='Answered By'
				sortKey='answeredBy'
				enableSorting={false}
			/>
		),
	},
	{
		accessorKey: 'duration',
		header: () => (
			<ColumnHeader
				title='Duration'
				sortKey='duration'
			/>
		),
		cell: ({ row }) => <span className='font-mono'>{formatDuration(row.original.duration, 'timestamp')}</span>,
	},
]
