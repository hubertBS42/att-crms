'use client'

import { Input } from '@/components/ui/input'
import { Column } from '@tanstack/react-table'
import { useState } from 'react'

interface NumberRangeFilterProps<TData> {
	column: Column<TData, unknown>
}

const NumberRangeFilter = <TData,>({ column }: NumberRangeFilterProps<TData>) => {
	const [min, setMin] = useState('')
	const [max, setMax] = useState('')

	const handleMinChange = (value: string) => {
		setMin(value)
		const minNum = value ? parseFloat(value) : undefined
		const maxNum = max ? parseFloat(max) : undefined
		column.setFilterValue(minNum !== undefined || maxNum !== undefined ? [minNum, maxNum] : undefined)
	}

	const handleMaxChange = (value: string) => {
		setMax(value)
		const minNum = min ? parseFloat(min) : undefined
		const maxNum = value ? parseFloat(value) : undefined
		column.setFilterValue(minNum !== undefined || maxNum !== undefined ? [min, maxNum] : undefined)
	}

	return (
		<div className='flex gap-2'>
			<Input
				type='number'
				placeholder='Min'
				value={min}
				onChange={e => handleMinChange(e.target.value)}
				className='h-8'
			/>
			<Input
				type='number'
				placeholder='Max'
				value={max}
				onChange={e => handleMaxChange(e.target.value)}
				className='h-8'
			/>
		</div>
	)
}

export default NumberRangeFilter
