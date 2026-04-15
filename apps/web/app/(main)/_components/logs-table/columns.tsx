'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Activity, ActivityResource, ActivityType } from '@att-crms/db/client'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '@/lib/utils'
import { BuildingIcon, MicIcon, UserIcon, MailIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'

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
		header: () => (
			<ColumnHeader
				title='Target'
				sortKey='targetName'
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
		header: () => (
			<ColumnHeader
				title='Type'
				sortKey='type'
			/>
		),
		cell: ({ row }) => (
			<span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASSES[row.original.type]}`}>
				{capitalizeFirstLetter(row.original.type)}
			</span>
		),
	},
	{
		accessorKey: 'resource',
		header: () => (
			<ColumnHeader
				title='Resource'
				sortKey='resource'
			/>
		),
		cell: ({ row }) => <Badge variant='outline'>{capitalizeFirstLetter(row.original.resource)}</Badge>,
	},
	{
		accessorKey: 'actorName',
		header: () => (
			<ColumnHeader
				title='Actor'
				sortKey='actorName'
			/>
		),
		cell: ({ row }) => <span>{row.original.actorName ?? '—'}</span>,
	},
	{
		accessorKey: 'organizationName',
		header: () => (
			<ColumnHeader
				title='Organization'
				sortKey='organizationName'
			/>
		),
		cell: ({ row }) => <span>{row.original.organizationName ?? '—'}</span>,
	},
	{
		accessorKey: 'createdAt',
		header: () => (
			<ColumnHeader
				title='Date'
				sortKey='createdAt'
			/>
		),
		cell: ({ row }) => <span>{format(new Date(row.original.createdAt), 'MMM d, yyyy, h:mm a')}</span>,
	},
]
