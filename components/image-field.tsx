'use client'

import Image from 'next/image'
import React from 'react'
import { Control, Controller, FieldValues, Path, UseFormClearErrors } from 'react-hook-form'
import { ImageIcon, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES } from '@/constants'
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field'
import { Spinner } from './ui/spinner'

const ImageTile = ({ image, isDeleting, isDisabled, handleRemove }: { image: string; isDeleting: boolean; isDisabled?: boolean; handleRemove: () => void }) => {
	return (
		<div className='border overflow-hidden relative aspect-square rounded-md flex items-center justify-center'>
			{isDeleting && (
				<div className='absolute top-0 right-0 left-0 bottom-0 z-10 flex items-center justify-center bg-accent/60'>
					<Spinner className='size-6' />
				</div>
			)}
			<Image
				src={image}
				sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 10vw'
				alt='Preview image'
				fill
				className='object-cover rounded-md'
				priority
				unoptimized
			/>
			{(!isDeleting || !isDisabled) && (
				<Button
					type='button'
					variant={'destructive'}
					size={'icon'}
					className='absolute top-1 right-1 size-6'
					onClick={() => handleRemove()}
				>
					<X />
				</Button>
			)}
		</div>
	)
}

const PlaceHolderTile = ({ isLoading, handleClick }: { isLoading: boolean; handleClick: () => void }) => {
	return (
		<div
			className={cn('border overflow-hidden relative aspect-square rounded-md flex items-center justify-center', isLoading ? 'pointer-events-none' : 'cursor-pointer')}
			onClick={() => handleClick()}
		>
			{isLoading ? (
				<div className='absolute top-0 right-0 left-0 bottom-0 z-10 flex items-center justify-center bg-accent/60'>
					<Spinner className='size-6' />
				</div>
			) : (
				<ImageIcon className='size-6 text-muted-foreground' />
			)}
		</div>
	)
}

interface ImageUploaderProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label?: string
	description?: string
	className?: string
	disabled?: boolean
	maxImages?: number
	sizeLimit?: number
	defaultValues?: string | string[] | null
	onAdd: (images: FileList) => Promise<string[]>
	onRemove: (url: string) => Promise<void>
	clearErrors: UseFormClearErrors<T>
}

const ImageField = <T extends FieldValues>({
	control,
	name,
	description,
	label,
	className,
	disabled,
	maxImages = 1,
	sizeLimit = 1000, //1Mb in kb
	defaultValues,
	onAdd,
	onRemove,
	clearErrors,
}: ImageUploaderProps<T>) => {
	const [previews, setPreviews] = React.useState<string[]>(!defaultValues ? [] : typeof defaultValues === 'string' ? [defaultValues] : defaultValues)
	const [imageTobeDeletedIndex, setImageToBeDeletedIndex] = React.useState<number | null>(null)
	const [newImagesSlots, setNewImagesSlots] = React.useState<number[]>([])
	const [isLoading, setIsLoading] = React.useState(false)
	const imageInputRef = React.useRef<HTMLInputElement>(null)

	const handleFileChange = React.useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>, onChange: (newData: string | string[]) => void, existingData: string | string[] | null) => {
			if (e.target.files) {
				// Check file size
				for (const file of e.target.files) {
					if (file.size > sizeLimit * 1024) {
						control.setError(name, {
							type: 'custom',
							message: maxImages > 1 ? `Each image must be ${sizeLimit}KB or smaller.` : `Image must be ${sizeLimit}KB or smaller`,
						})

						return
					}
				}

				const normalizedExistingData = !existingData || typeof existingData === 'string' ? [] : existingData

				if (e.target.files.length + normalizedExistingData.length > maxImages) {
					control.setError(name, {
						type: 'custom',
						message: `You\'re allowed to upload up to ${maxImages} image${maxImages > 1 && 's'}.`,
					})
					return
				}

				clearErrors(name)
				setIsLoading(true)

				// Specify pending images slots
				const newImagesIndices = Array.from({ length: e.target.files.length }, (_, i) => normalizedExistingData.length + i)
				setNewImagesSlots(newImagesIndices)
				const uploadedImages = await onAdd(e.target.files)

				setIsLoading(false)
				setNewImagesSlots([])

				const combinedImages = [...normalizedExistingData, ...uploadedImages]
				onChange(maxImages === 1 ? combinedImages[0] : combinedImages)
				setPreviews(combinedImages)
			}
		},
		[maxImages, clearErrors, control, name, sizeLimit, onAdd],
	)

	const removeImage = React.useCallback(
		async (index: number, onChange: (newData: string[] | null) => void) => {
			clearErrors(name)
			setIsLoading(true)
			setImageToBeDeletedIndex(index)

			await onRemove(previews[index])

			setIsLoading(false)
			setImageToBeDeletedIndex(null)
			const filtered = previews.filter(image => image !== previews[index])
			setPreviews(filtered)
			onChange(maxImages === 1 && filtered.length === 0 ? null : filtered)

			// Clear the file input value to allow re-adding the same file
			if (imageInputRef.current) {
				imageInputRef.current.value = ''
			}

			// if (onRemove) onRemove(imageToRemove)
		},
		[onRemove, previews, clearErrors, name, maxImages],
	)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value, ref, ...field }, fieldState }) => {
				const assignInputRef = (el: HTMLInputElement | null) => {
					imageInputRef.current = el
					ref(el) // this is the react-hook-form field ref
				}

				return (
					<Field
						className='grid gap-y-1'
						data-invalid={fieldState.invalid}
					>
						{label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

						<Input
							type='file'
							multiple={maxImages > 1 ? true : false}
							accept={ACCEPTED_IMAGE_TYPES.join(',')}
							className='hidden'
							onChange={e => handleFileChange(e, onChange, value)}
							disabled={disabled}
							ref={assignInputRef}
							id={name}
							{...field}
						/>
						<div
							className={cn('gap-x-1.5', className)}
							style={{ display: 'grid', gridTemplateColumns: `repeat(${maxImages}, minmax(0, 1fr))` }}
						>
							{Array.from({ length: maxImages }, (_, i) => {
								if (previews[i]) {
									return (
										<ImageTile
											key={i}
											handleRemove={() => removeImage(i, onChange)}
											image={previews[i]}
											isDeleting={imageTobeDeletedIndex === i && isLoading}
										/>
									)
								} else {
									return (
										<PlaceHolderTile
											key={i}
											isLoading={newImagesSlots.includes(i) && isLoading}
											handleClick={() => imageInputRef.current?.click()}
										/>
									)
								}
							})}
						</div>
						{description && <FieldDescription>{description}</FieldDescription>}
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)
			}}
		/>
	)
}

export default ImageField
