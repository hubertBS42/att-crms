import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Switch } from './ui/switch'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './ui/field'

interface SwitchCardFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label?: string
	description?: string
	disabled?: boolean
	onChange?: (checked: boolean) => void
}

const SwitchCardField = <T extends FieldValues>({ control, name, description, label, disabled, onChange }: SwitchCardFieldProps<T>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					orientation={'horizontal'}
					className='border rounded-lg p-3'
					data-invalid={fieldState.invalid}
				>
					<FieldContent className='gap-y-1'>
						{label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
						{description && <FieldDescription>{description}</FieldDescription>}
					</FieldContent>

					<Switch
						checked={field.value}
						onCheckedChange={checked => {
							field.onChange(checked)
							if (onChange) {
								onChange(checked)
							}
						}}
						disabled={disabled}
						id={name}
						aria-invalid={fieldState.invalid}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	)
}

export default SwitchCardField
