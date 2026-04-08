'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Table } from '@tanstack/react-table'
import { PAGE_SIZE_OPTIONS } from '@/constants'
import ClientOnlySelect from '../client-only-select'

export interface PaginationProps<TData> {
	table: Table<TData>
}

const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
	const pageSize = table.getState().pagination.pageSize
	const pageIndex = table.getState().pagination.pageIndex
	const totalRows = table.getFilteredRowModel().rows.length
	const selectedRows = table.getFilteredSelectedRowModel().rows.length
	const pageCount = table.getPageCount()

	// Don't render if no data
	if (totalRows === 0) return null

	return (
		<div className='flex items-center justify-between p-4'>
			<div className='hidden lg:flex lg:flex-1 text-sm'>
				{selectedRows} of {totalRows} Row(s) Selected
			</div>
			<div className='flex items-center justify-between lg:justify-normal space-x-6 lg:space-x-8 w-full lg:w-fit'>
				<div className='flex items-center space-x-2'>
					<p className='hidden lg:inline text-sm'>Rows Per Page</p>
					<div className='w-17'>
						<ClientOnlySelect
							value={`${pageSize}`}
							onValueChange={value => table.setPageSize(Number(value))}
							options={PAGE_SIZE_OPTIONS}
							size='sm'
							side='top'
							loadingPlaceholder='10'
							id='pageSize'
						/>
					</div>
				</div>
				<div className='flex w-25 items-center justify-center text-sm'>
					Page {pageIndex + 1} of {pageCount}
				</div>
				<div className='flex items-center gap-x-2'>
					<Button
						variant={'outline'}
						className='hidden size-8 p-0 lg:flex'
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						aria-label='Go To First Page'
					>
						<span className='sr-only'>Go To Previous Page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant={'outline'}
						className='size-8 p-0'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						aria-label='Go To Previous Page'
					>
						<span className='sr-only'>Go To Previous Page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant={'outline'}
						className='size-8 p-0'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						aria-label='Go To Next Page'
					>
						<span className='sr-only'>Go To Next Page</span>
						<ChevronRight />
					</Button>
					<Button
						variant={'outline'}
						className='hidden size-8 p-0 lg:flex'
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
						aria-label='Go To Last Page'
					>
						<span className='sr-only'>Go To Last Page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Pagination
