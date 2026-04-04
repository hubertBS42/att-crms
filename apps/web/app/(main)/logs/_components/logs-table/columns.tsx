// app/(pages)/logs/_components/logs-columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Activity, ActivityResource, ActivityType } from '@att-crms/db/client'
import { Badge } from '@/components/ui/badge'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '@/lib/utils'
import { BuildingIcon, MicIcon, UserIcon, MailIcon } from 'lucide-react'
import { dateRangeFilterFn } from '@/components/data-table'
import { Checkbox } from '@/components/ui/checkbox'

const TYPE_BADGE_CLASSES: Record<ActivityType, string> = {
	CREATE: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
	UPDATE: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
	DELETE: 'text-red-500 bg-red-500/10 border-red-500/20',
	ALERT: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
}

const RESOURCE_ICONS: Record<ActivityResource, React.ElementType> = {
	RECORDING: MicIcon,
	ORGANIZATION: BuildingIcon,
	MEMBER: UserIcon,
	INVITATION: MailIcon,
	USER: UserIcon,
}

export const columns: ColumnDef<Activity>[] = [
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
		accessorKey: 'targetName',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Target'
			/>
		),
		cell: ({ row }) => {
			const Icon = RESOURCE_ICONS[row.original.resource] ?? UserIcon
			return (
				<div className='flex items-center gap-2'>
					<div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-muted'>
						<Icon className='size-3.5 text-muted-foreground' />
					</div>
					<div className='grid gap-0.5'>
						<p className='text-sm font-medium'>{row.original.targetName ?? '—'}</p>
						{row.original.targetId && <p className='text-xs text-muted-foreground font-mono truncate max-w-48'>{row.original.targetId}</p>}
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Type'
			/>
		),
		cell: ({ row }) => (
			<span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASSES[row.original.type]}`}>
				{capitalizeFirstLetter(row.original.type)}
			</span>
		),
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true
			return row.original.type === filterValue
		},
	},
	{
		accessorKey: 'resource',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Resource'
			/>
		),
		cell: ({ row }) => <Badge variant='outline'>{capitalizeFirstLetter(row.original.resource)}</Badge>,
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true
			return row.original.resource === filterValue
		},
	},
	{
		accessorKey: 'actorName',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Actor'
			/>
		),
		cell: ({ row }) => <p className='text-sm'>{row.original.actorName ?? '—'}</p>,
	},
	{
		accessorKey: 'organizationName',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Organization'
			/>
		),
		cell: ({ row }) => <p className='text-sm'>{row.original.organizationName ?? '—'}</p>,
		enableSorting: false,
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Date'
			/>
		),
		cell: ({ row }) => <p className='text-sm text-muted-foreground whitespace-nowrap'>{format(new Date(row.original.createdAt), 'LLL dd, y HH:mm')}</p>,
		filterFn: dateRangeFilterFn,
	},
]
