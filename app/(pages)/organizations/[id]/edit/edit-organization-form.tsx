'use client'
import DiscardButton from '@/components/discard-button'
import InputField from '@/components/input-field'
import SaveButton from '@/components/save-button'
import SelectField from '@/components/select-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { ORGANIZATION_PLAN_OPTIONS, ORGANIZATION_STATUS_OPTIONS } from '@/constants'
import { DataResponse } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import { Organization, OrganizationPlan, OrganizationStatus } from '@/lib/generated/prisma/client'
import { updateOrganizationFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { z } from 'zod'

const EditOrganizationForm = ({ data }: { data: Promise<DataResponse<Organization | null>> }) => {
	const response = React.use(data)
	if (!response.success) throw new Error(response.error)
	if (!response.data) notFound()

	const organization = response.data

	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()

	const form = useForm<z.infer<typeof updateOrganizationFormSchema>>({
		resolver: zodResolver(updateOrganizationFormSchema),
		defaultValues: {
			id: organization.id,
			name: organization.name,
			slug: organization.slug,
			logo: organization.logo ?? '',
			plan: organization.plan as OrganizationPlan,
			status: organization.status as OrganizationStatus,
		},
	})

	// eslint-disable-next-line react-hooks/incompatible-library
	const nameValue = form.watch('name')

	React.useEffect(() => {
		// Don't auto-populate if slug already exists (edit mode)
		if (organization.slug) return

		// Only auto-populate if the user hasn't manually edited the slug
		if (!form.getFieldState('slug').isDirty) {
			const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
			form.setValue('slug', slugified)
		}
	}, [nameValue, form, organization.slug])

	const onSubmit: SubmitHandler<z.infer<typeof updateOrganizationFormSchema>> = async orgData => {
		startTransition(async () => {
			// Check slug availability only if it changed
			if (orgData.slug !== organization.slug) {
				const { error: checkSlugError } = await authClient.organization.checkSlug({
					slug: orgData.slug,
				})

				if (checkSlugError) {
					return form.setError('slug', {
						type: 'custom',
						message: checkSlugError.message,
					})
				}
			}

			const { error: updateOrgErr } = await authClient.organization.update({
				data: {
					name: orgData.name,
					slug: orgData.slug,
					logo: orgData.logo,
					plan: orgData.plan,
					status: orgData.status,
				},
				organizationId: organization.id,
			})

			if (updateOrgErr) {
				toast.error('Operation failed', { description: updateOrgErr.message })
				return
			} else {
				toast.success('Organization updated successfully.')
				router.push('/organizations')
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
						<h1 className='text-xl md:text-2xl font-bold'>Edit organization</h1>
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

export default EditOrganizationForm
