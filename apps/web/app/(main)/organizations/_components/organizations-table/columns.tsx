import { ColumnDef } from '@tanstack/react-table'
import { Organization, OrganizationPlan, OrganizationStatus } from '@att-crms/db/client'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from '@/components/data-table/column-header'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import { dateRangeFilterFn } from '@/components/data-table'

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
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Name'
			/>
		),
	},
	{
		accessorKey: 'slug',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Slug'
			/>
		),
	},
	{
		accessorKey: 'plan',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Plan'
			/>
		),
		cell: ({ row }) => genPlanBadge(row.original.plan),
		filterFn: 'equals',
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Status'
			/>
		),
		cell: ({ row }) => genStatusBadge(row.original.status),
		filterFn: 'equals',
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Created On'
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
]
