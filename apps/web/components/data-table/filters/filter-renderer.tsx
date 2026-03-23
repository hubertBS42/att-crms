'use client'

import { Column } from '@tanstack/react-table'
import { FilterConfig } from '..'
import TextFilter from './text-filter'
import SelectFilter from './select-filter'
import DateRangeFilter from './date-range-filter'
import NumberRangeFilter from './number-range-filter'

interface FilterRendererProps<TData> {
	column: Column<TData, unknown>
	config: FilterConfig<TData>
}

const FilterRenderer = <TData,>({ column, config }: FilterRendererProps<TData>) => {
	switch (config.type) {
		case 'text':
			return (
				<TextFilter
					column={column}
					placeholder={config.placeholder}
					id={config.columnId}
				/>
			)
		case 'select':
			return (
				<SelectFilter
					column={column}
					options={config.options || []}
					placeholder={config.placeholder}
					id={config.columnId}
				/>
			)
		case 'dateRange':
			return (
				<DateRangeFilter
					column={column}
					id={config.columnId}
				/>
			)
		case 'numberRange':
			return <NumberRangeFilter column={column} />
		default:
			return null
	}
}

export default FilterRenderer
