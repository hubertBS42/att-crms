'use client'
import { Input } from '@/components/ui/input'
import { Column } from '@tanstack/react-table'
import { useState } from 'react'

interface TextFilterProps<TData> {
	column: Column<TData, unknown>
	placeholder?: string
	id: string
}

const TextFilter = <TData,>({ column, placeholder, id }: TextFilterProps<TData>) => {
	const columnFilterValue = column.getFilterValue()

	// Use local state for input value (for immediate UI feedback)
	// but derive initial value from column filter
	const [value, setValue] = useState((columnFilterValue ?? '') as string)

	const handleChange = (newValue: string) => {
		setValue(newValue)
		column.setFilterValue(newValue || undefined)
	}

	// Reset local state when column filter is externally cleared
	// This  works because the component re-renders when columnFilterValue changes
	if (columnFilterValue === undefined && value !== '') {
		setValue('')
	}

	return (
		<Input
			placeholder={placeholder || 'Filter...'}
			value={value}
			onChange={e => handleChange(e.target.value)}
			className='h-8 w-full text-light'
			id={id}
		/>
	)
}

export default TextFilter
