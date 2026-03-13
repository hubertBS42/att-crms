import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export default function ColumnHeader<TData, TValue>({ column, title, className }: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<Button
			variant='ghost'
			size='sm'
			className='-ml-2.5 h-8'
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			<span>{title}</span>
			{column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
		</Button>
	)
}
