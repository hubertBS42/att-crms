'use client'

import { TreeNode } from '@/interfaces'
import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronRight, ChevronsUpDown, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

type Option = {
	label: string
	value: string
}

interface SelectCascaderFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label?: string
	placeholder?: string
	size?: 'sm' | 'default'
	description?: string
	className?: string
	disabled?: boolean
	options: TreeNode<{ label: string; value: string }>[]
	disabledOptions?: string[]
}

const SelectCascaderField = <T extends FieldValues>({
	control,
	name,
	label,
	disabled,
	placeholder = 'Select options',
	description,
	options,
	disabledOptions = [],
	size,
	className,
}: SelectCascaderFieldProps<T>) => {
	const [open, setOpen] = React.useState(false)
	const [path, setPath] = React.useState<TreeNode<Option>[]>([])
	const [searchMode, setSearchMode] = React.useState(false)

	const getDisplayValue = (value: string[]) => {
		if (!value || value.length === 0) return null

		let current = options
		const labels: string[] = []

		for (const val of value) {
			const item = current.find(node => node.value === val)
			if (item) {
				labels.push(item.label)
				current = item.children || []
			}
		}

		return labels.join(' / ')
	}

	const handleSelect = (item: TreeNode<Option>, level: number, onChange: (value: string[]) => void) => {
		const newPath = [...path.slice(0, level), item]
		setPath(newPath)

		if (!item.children || item.children.length === 0) {
			const newValue = newPath.map(p => p.value)
			onChange(newValue)
			setOpen(false)
			setPath([])
			setSearchMode(false)
		}
	}

	const getCurrentLevel = (level: number) => {
		if (level === 0) return options
		return path[level - 1]?.children || []
	}

	type SearchResult = {
		item: TreeNode<Option>
		path: TreeNode<Option>[]
		fullPath: string
		value: string[]
	}

	const searchItems = (items: TreeNode<Option>[], term: string, parentPath: TreeNode<Option>[] = []) => {
		let results: SearchResult[] = []

		for (const item of items) {
			const currentPath = [...parentPath, item]

			if (item.label.toLowerCase().includes(term.toLowerCase())) {
				results.push({
					item,
					path: currentPath,
					fullPath: currentPath.map(p => p.label).join(' / '),
					value: currentPath.map(p => p.value),
				})
			}

			if (item.children) {
				results = results.concat(searchItems(item.children, term, currentPath))
			}
		}

		return results
	}

	const numColumns = path.length + 1

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					className={cn('grid gap-y-1', className)}
					data-invalid={fieldState.invalid}
				>
					{label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
					<Popover
						open={open}
						onOpenChange={setOpen}
					>
						<PopoverTrigger
							asChild
							id={name}
						>
							<Button
								variant={'outline'}
								role='combobox'
								aria-expanded={open}
								disabled={disabled}
								aria-invalid={fieldState.invalid}
								className={cn('w-full justify-between', size === 'sm' && 'h-9 text-xs')}
							>
								<span className={cn('truncate font-light', !field.value && 'text-muted-foreground')}>{getDisplayValue(field.value) || placeholder}</span>
								<div className='flex items-center gap-1 ml-2 shrink-0'>
									{field.value && field.value.length > 0 ? (
										<span
											className='opacity-50 hover:opacity-100 z-100'
											onClick={e => {
												e.stopPropagation()
												field.onChange([])
											}}
										>
											<X className='size-4' />
										</span>
									) : (
										<ChevronsUpDown className='size-4 shrink-0 opacity-50' />
									)}
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent className='PopoverContent'>
							<Command shouldFilter={false}>
								<CommandInput
									placeholder='Search...'
									onValueChange={search => setSearchMode(search.length > 0)}
								/>
								<CommandList>
									<CommandEmpty>No results found.</CommandEmpty>
									{searchMode ? (
										<CommandGroup>
											{(command => {
												const searchTerm = command?.querySelector('input')?.value || ''
												return searchItems(options, searchTerm).map((result, idx) => {
													const isSelected = field.value && field.value.join(',') === result.value.join(',')
													const isDisabled = result.value.some((v: string) => disabledOptions.includes(v))

													return (
														<CommandItem
															key={idx}
															value={result.fullPath}
															disabled={isDisabled}
															onSelect={() => {
																if (!isDisabled) {
																	field.onChange(result.value)
																	setOpen(false)
																	setPath([])
																	setSearchMode(false)
																}
															}}
														>
															<Check className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')} />
															<span className='text-sm'>{result.fullPath}</span>
														</CommandItem>
													)
												})
											})(document.querySelector('[cmdk-root]'))}
										</CommandGroup>
									) : (
										<div className='flex max-h-75 overflow-hidden'>
											{Array.from({ length: numColumns }).map((_, level) => {
												const items = getCurrentLevel(level)
												if (items.length === 0) return null

												return (
													<CommandGroup
														key={level}
														className='min-w-45 border-r last:border-r-0 overflow-y-auto **:[[cmdk-group-items]]:p-0'
													>
														{items.map(item => {
															const isSelected = path[level]?.value === item.value
															const isFinalSelected = field.value && field.value.length === level + 1 && field.value[level] === item.value
															const isDisabled = disabledOptions.includes(item.value)

															return (
																<CommandItem
																	key={item.value}
																	value={item.value}
																	disabled={isDisabled}
																	onSelect={() => {
																		if (!isDisabled) {
																			handleSelect(item, level, field.onChange)
																		}
																	}}
																	className={cn('rounded-none justify-between', isSelected && 'bg-accent')}
																>
																	<span>{item.label}</span>
																	<div className='flex items-center gap-1'>
																		{isFinalSelected && <Check className='size-4' />}
																		{item.children && item.children.length > 0 && <ChevronRight className='size-4 opacity-50' />}
																	</div>
																</CommandItem>
															)
														})}
													</CommandGroup>
												)
											})}
										</div>
									)}
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{description && <FieldDescription>{description}</FieldDescription>}
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

export default SelectCascaderField
