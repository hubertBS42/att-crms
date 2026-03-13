'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'

interface DateRangeFilterProps<TData> {
	column: Column<TData, unknown>
	id: string
}

const DateRangeFilter = <TData,>({ column, id }: DateRangeFilterProps<TData>) => {
	const columnFilterValue = column.getFilterValue()

	// Derive date from column filter value (no local state needed)
	const date: DateRange | undefined =
		Array.isArray(columnFilterValue) && columnFilterValue.length === 2 ? { from: new Date(columnFilterValue[0]), to: new Date(columnFilterValue[1]) } : undefined

	const handleSelect = (range: DateRange | undefined) => {
		if (range?.from && range?.to) {
			// Set to start of day for 'from' and end of day for 'to'
			const from = new Date(range.from)
			from.setHours(0, 0, 0, 0)

			const to = new Date(range.to)
			to.setHours(23, 59, 59, 999)

			column.setFilterValue([from, to])
		} else if (range?.from) {
			// Single date selected
			const from = new Date(range.from)
			from.setHours(0, 0, 0, 0)
			const to = new Date(range.from)
			to.setHours(23, 59, 59, 999)
			column.setFilterValue([from, to])
		} else {
			column.setFilterValue(undefined)
		}
	}

	const handleClear = () => {
		column.setFilterValue(undefined)
	}

	return (
		<div className='flex gap-2'>
			<Popover>
				<PopoverTrigger
					asChild
					id={id}
				>
					<Button
						variant={'outline'}
						className={cn('h-8 w-full justify-start text-left font-light', !date && 'text-muted-foreground')}
					>
						<CalendarIcon className='mr-px size-4 opacity-50' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date range</span>
						)}
						{date && (
							<span
								className='z-50 ml-auto p-1 cursor-pointer'
								onClick={handleClear}
							>
								{' '}
								<X className='size-3.5' />
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto overflow-hidden p-0'
					align='start'
				>
					<Calendar
						autoFocus
						defaultMonth={date?.from}
						mode='range'
						selected={date}
						captionLayout='dropdown'
						onSelect={handleSelect}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export default DateRangeFilter
