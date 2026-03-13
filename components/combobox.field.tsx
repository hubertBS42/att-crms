'use client'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field'

interface ComboboxFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label?: string
	placeholder: string
	searchPlaceholder: string
	description?: string
	options: { label: string; value: string }[]
	disabled?: boolean
	modal?: boolean
}

const ComboboxField = <T extends FieldValues>({
	control,
	name,
	description,
	label,
	placeholder,
	searchPlaceholder,
	options,
	disabled,
	modal = false,
}: ComboboxFieldProps<T>) => {
	const [open, setOpen] = React.useState(false)
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					className='grid gap-y-1'
					data-invalid={fieldState.invalid}
				>
					{label && (
						<FieldLabel
							htmlFor={name}
							className={cn(disabled && 'pointer-events-none')}
						>
							{label}
						</FieldLabel>
					)}
					<Popover
						open={open}
						onOpenChange={setOpen}
						modal={modal}
					>
						<PopoverTrigger
							id={name}
							asChild
						>
							<Button
								variant={'outline'}
								role='combobox'
								className={cn('w-full justify-between font-light', !field.value && 'text-muted-foreground')}
								disabled={disabled}
							>
								{field.value ? options.find(options => options.value === field.value)?.label : placeholder}
								<ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='p-0'>
							<Command>
								<CommandInput
									placeholder={searchPlaceholder}
									className='h-9'
								/>
								<CommandList>
									<CommandEmpty>No data found.</CommandEmpty>
									<CommandGroup>
										{options.map(option => (
											<CommandItem
												value={option.value}
												key={option.value}
												onSelect={() => {
													field.onChange(option.value)
													setOpen(false)
												}}
											>
												{option.label}
												<CheckIcon className={cn('ml-auto size-4', option.value === field.value ? 'opacity-100' : 'opacity-0')} />
											</CommandItem>
										))}
									</CommandGroup>
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

export default ComboboxField
