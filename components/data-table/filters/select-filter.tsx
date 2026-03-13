'use client'

import ClientOnlySelect from '@/components/client-only-select'
import { SelectOption } from '@/interfaces'
import { Column } from '@tanstack/react-table'

interface SelectFilterProps<TData> {
	column: Column<TData, unknown>
	options: SelectOption[]
	id: string
	placeholder?: string
}

const SelectFilter = <TData,>({ column, options, id, placeholder }: SelectFilterProps<TData>) => {
	const filterValue = column.getFilterValue()
	const currentValue = filterValue === undefined ? 'all' : String(filterValue) // Convert boolean to string for display

	return (
		<ClientOnlySelect
			value={currentValue}
			onValueChange={value => {
				if (value === 'all') {
					column.setFilterValue(undefined)
				} else {
					// Check if the value is a boolean string
					if (value === 'true' || value === 'false') {
						column.setFilterValue(value === 'true')
					} else {
						column.setFilterValue(value)
					}
				}
			}}
			options={options}
			size='sm'
			side='bottom'
			id={id}
			loadingPlaceholder='All'
			placeholder={placeholder || 'Select...'}
		/>
	)
}

export default SelectFilter
