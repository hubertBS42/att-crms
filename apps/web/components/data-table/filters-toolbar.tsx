'use client'

import { Table } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { FilterConfig } from '.'
import FilterRenderer from './filters/filter-renderer'
import { FieldLabel } from '../ui/field'

interface FiltersToolbarProps<TData> {
	table: Table<TData>
	filters: FilterConfig<TData>[]
}

const FiltersToolbar = <TData,>({ table, filters }: FiltersToolbarProps<TData>) => {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className='flex flex-col gap-4 p-4'>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{filters.map(filterConfig => {
					const column = table.getColumn(filterConfig.columnId)
					if (!column) return null

					return (
						<div
							key={filterConfig.columnId}
							className='space-y-1'
						>
							<FieldLabel htmlFor={filterConfig.columnId}>{filterConfig.label}</FieldLabel>
							<FilterRenderer
								column={column}
								config={filterConfig}
							/>
						</div>
					)
				})}
			</div>

			{isFiltered && (
				<div className='flex justify-start'>
					<Button
						onClick={() => table.resetColumnFilters()}
						size={'sm'}
						variant={'ghost'}
					>
						<X className='size-4' />
						Reset Filters
					</Button>
				</div>
			)}
		</div>
	)
}

export default FiltersToolbar
