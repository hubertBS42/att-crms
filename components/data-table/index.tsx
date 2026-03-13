'use client'
import {
	Column,
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import FiltersToolbar from './filters-toolbar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { cn } from '@/lib/utils'
import Pagination from './pagination'

export type FilterType = 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange' | 'boolean'

export interface FilterConfig<TData> {
	columnId: string
	label: string
	type: FilterType
	placeholder?: string
	options?: Array<{ label: string; value: string }> // For select filters
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	accessor?: (row: TData) => any
}

export interface DataTableFilterProps<TData> {
	column: Column<TData, unknown>
	config: FilterConfig<TData>
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filters?: FilterConfig<TData>[]
	defaultSorting?: SortingState
}

// Custom filter functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const numberRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
	const [min, max] = filterValue as [number | undefined, number | undefined]
	const value = row.getValue(columnId) as number
	if (min !== undefined && value < min) return false
	if (max !== undefined && value > max) return false
	return true
}

export function DataTable<TData, TValue>({ columns, data, filters = [], defaultSorting = [] }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		filterFns: {
			numberRange: numberRangeFilterFn,
		},
	})

	return (
		<div className='grid border rounded-md'>
			{filters.length > 0 && (
				<FiltersToolbar
					table={table}
					filters={filters}
				/>
			)}
			<div className='relative w-full overflow-auto border border-l-0 border-r-0'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, idx) => {
									return (
										<TableHead
											key={header.id}
											className={cn(idx === 0 && 'w-7')}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell, idx) => (
										<TableCell
											key={cell.id}
											className={cn(idx === row.getVisibleCells().length - 1 && 'w-7')}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Pagination table={table} />
		</div>
	)
}
