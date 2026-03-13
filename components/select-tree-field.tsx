'use client'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { flattenNodeTree } from '@/lib/utils'
import { type TreeNode } from '@/interfaces'
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'

interface SelectTreePickerFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label?: string
	placeholder?: string
	size?: 'sm' | 'default'
	loadingPLaceholder: string
	description?: string
	className?: string
	disabled?: boolean
	options: TreeNode<{ label: string; value: string; id: string; parentId: string | null }>[]
	disabledOptions?: string[]
	side?: 'top' | 'bottom' | 'left' | 'right'
}

const PlaceholderComponet = ({ placeholderLabel, placeholderText }: { placeholderLabel?: string; placeholderText?: string }) => {
	return (
		<Field className='flex flex-col gap-1'>
			{placeholderLabel && <FieldLabel>{placeholderText}</FieldLabel>}
			<div className="flex w-full h-9 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
				{placeholderText || '...'}
				<ChevronDownIcon className='pointer-events-none size-4 text-muted-foreground' />
			</div>
		</Field>
	)
}

const SelectTreeField = <T extends FieldValues>({
	control,
	name,
	description,
	label,
	side,
	placeholder,
	loadingPLaceholder,
	options,
	disabledOptions,
	size,
	...selectProps
}: SelectTreePickerFieldProps<T>) => {
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return (
			<PlaceholderComponet
				placeholderLabel={label}
				placeholderText={loadingPLaceholder}
			/>
		)
	}

	const flatOptions = flattenNodeTree(options)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					className='grid gap-1'
					data-invalid={fieldState.invalid}
				>
					{label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
					<Select
						onValueChange={field.onChange}
						value={field.value}
						{...selectProps}
					>
						<SelectTrigger
							size={size}
							className='w-full'
							id={name}
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent side={side}>
							<SelectGroup>
								{flatOptions.map(option => (
									<SelectItem
										key={option.value}
										value={option.value}
										disabled={disabledOptions && disabledOptions.includes(option.value)}
										style={{ paddingLeft: `${8 + option.depth * 16}px` }}
									>
										{/* {'-'.repeat(option.depth)} */}
										{option.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{description && <FieldDescription>{description}</FieldDescription>}
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

export default SelectTreeField
