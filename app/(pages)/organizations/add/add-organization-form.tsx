'use client'
import DiscardButton from '@/components/discard-button'
import InputField from '@/components/input-field'
import SaveButton from '@/components/save-button'
import SelectField from '@/components/select-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { ORGANIZATION_PLAN_OPTIONS, ORGANIZATION_STATUS_OPTIONS } from '@/constants'
import { authClient } from '@/lib/auth-client'
import { OrganizationPlan, OrganizationStatus } from '@/lib/generated/prisma/enums'
import { addOrganizationFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import slugify from 'slugify'
import { toast } from 'sonner'

const AddOrganizationForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()

	const form = useForm<z.infer<typeof addOrganizationFormSchema>>({
		resolver: zodResolver(addOrganizationFormSchema),
		defaultValues: {
			name: '',
			slug: '',
			logo: '',
			plan: OrganizationPlan.BASIC,
			status: OrganizationStatus.ACTIVE,
		},
	})

	// eslint-disable-next-line react-hooks/incompatible-library
	const nameValue = form.watch('name')

	React.useEffect(() => {
		// Only auto-populate if the user hasn't manually edited the slug
		if (!form.getFieldState('slug').isDirty) {
			const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
			form.setValue('slug', slugified)
		}
	}, [nameValue, form])

	const onSubmit: SubmitHandler<z.infer<typeof addOrganizationFormSchema>> = async orgData => {
		startTransition(async () => {
			const { error: checkSlugError } = await authClient.organization.checkSlug({
				slug: orgData.slug,
			})

			if (checkSlugError) {
				return form.setError('slug', {
					type: 'custom',
					message: checkSlugError.message,
				})
			}

			const { error: createOrgErr } = await authClient.organization.create({
				name: orgData.name,
				slug: orgData.slug,
				logo: orgData.logo,
				plan: orgData.plan,
				status: orgData.status,
			})

			if (createOrgErr) {
				toast.error('Operation failed', { description: createOrgErr.message })
			} else {
				router.push('/organizations')
				toast.success('Organizaiton created successfully.')
			}
		})
	}

	const handleDiscard = async () => {
		router.push('/organizations')
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<div className='flex items-end'>
					<div className='grid'>
						<h1 className='text-xl md:text-2xl font-bold'>Add organization</h1>
						<p className='text-muted-foreground text-sm'>Lorem ipsum dolar sit amet consectetur adipisicing elit.</p>
					</div>

					<div className='hidden items-center gap-2 md:ml-auto md:flex'>
						{form.formState.isDirty ? (
							<DiscardButton
								isLoading={isPending}
								handleDiscard={handleDiscard}
							/>
						) : (
							<Button
								variant={'outline'}
								size={'sm'}
								disabled={isPending}
								onClick={() => router.push('/organizations')}
								type='button'
							>
								Back
							</Button>
						)}
						<SaveButton
							isLoading={isPending}
							isDisabled={!form.formState.isDirty}
						/>
					</div>
				</div>

				<div className='grid gap-8'>
					<div className='grid items-start gap-4 lg:grid-cols-3'>
						{/* Left column */}
						<div className='lg:col-span-2'>
							<Card>
								<CardHeader>
									<CardTitle>Details</CardTitle>
									<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
								</CardHeader>
								<CardContent>
									<FieldGroup>
										<InputField
											control={form.control}
											label='Name'
											name='name'
											disabled={isPending}
											autoFocus
										/>
										<InputField
											control={form.control}
											label='Slug'
											name='slug'
											disabled={isPending}
										/>
										<SelectField
											control={form.control}
											label='Plan'
											name='plan'
											disabled={isPending}
											loadingPlaceholder='Basic'
											options={ORGANIZATION_PLAN_OPTIONS}
										/>
									</FieldGroup>
								</CardContent>
							</Card>
						</div>

						{/* Right column */}
						<Card>
							<CardHeader>
								<CardTitle>Status</CardTitle>
								<CardDescription>Lipsum dolor sit amet, consectetur</CardDescription>
							</CardHeader>
							<CardContent>
								<SelectField
									control={form.control}
									name='status'
									disabled={isPending}
									loadingPlaceholder='Active'
									options={ORGANIZATION_STATUS_OPTIONS}
								/>
							</CardContent>
						</Card>
					</div>
					<div className='flex items-center justify-center gap-2 md:hidden'>
						{form.formState.isDirty ? (
							<DiscardButton
								isLoading={isPending}
								handleDiscard={handleDiscard}
							/>
						) : (
							<Button
								variant={'outline'}
								size={'sm'}
								disabled={isPending}
								onClick={() => router.push('/organizations')}
								type='button'
							>
								Back
							</Button>
						)}
						<SaveButton
							isLoading={isPending}
							isDisabled={!form.formState.isDirty}
						/>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddOrganizationForm
