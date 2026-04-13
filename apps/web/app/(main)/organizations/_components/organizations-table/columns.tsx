import { ColumnDef } from '@tanstack/react-table'
import { Organization, OrganizationPlan, OrganizationStatus } from '@att-crms/db/client'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import ColumnHeader from '@/components/data-table/column-header'

const genStatusBadge = (status: OrganizationStatus) => {
	const statusConfig = {
		ACTIVE: { variant: 'default' as const, className: '' },
		INACTIVE: { variant: 'secondary' as const, className: '' },
		SUSPENDED: { variant: 'destructive' as const, className: '' },
	}

	const config = statusConfig[status] || statusConfig.ACTIVE
	return <Badge variant={config.variant}>{capitalizeFirstLetter(status)}</Badge>
}

const genPlanBadge = (plan: OrganizationPlan) => {
	const planConfig = {
		BASIC: { variant: 'default' as const, className: '' },
		ENTERPRISE: { variant: 'secondary' as const, className: '' },
	}

	const config = planConfig[plan] || planConfig.BASIC
	return <Badge variant={config.variant}>{capitalizeFirstLetter(plan)}</Badge>
}

export const columns: ColumnDef<Organization>[] = [
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
		accessorKey: 'slug',
		header: () => (
			<ColumnHeader
				title='Slug'
				sortKey='name'
				enableSorting={false}
			/>
		),
	},
	{
		accessorKey: 'plan',
		header: () => (
			<ColumnHeader
				title='Plan'
				sortKey='plan'
			/>
		),
		cell: ({ row }) => genPlanBadge(row.original.plan),
	},
	{
		accessorKey: 'status',
		header: () => (
			<ColumnHeader
				title='Status'
				sortKey='status'
			/>
		),
		cell: ({ row }) => genStatusBadge(row.original.status),
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
