'use client'
import InputField from '@/components/input-field'
import SelectField from '@/components/select-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ORGANIZATION_PLAN_OPTIONS, ORGANIZATION_STATUS_OPTIONS } from '@/constants'
import { authClient } from '@/lib/auth-client'
import { OrganizationPlan, OrganizationStatus } from '@att-crms/db/enums'
import { addOrganizationFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import slugify from 'slugify'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import ResourceFormHeader from '@/components/resource-form-header'
import ResourceFormFooter from '@/components/resource-form-footer'

const AddOrganizationForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()
	const [autoGenSlug, setAutoGenSlug] = React.useState(true)

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

	const nameValue = form.watch('name')

	React.useEffect(() => {
		if (!autoGenSlug) return

		const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
		form.setValue('slug', slugified, { shouldDirty: false }) // keep dirty state clean
	}, [nameValue, autoGenSlug, form])

	const handleAutoGenSlug = (checked: boolean) => {
		setAutoGenSlug(checked)
		if (checked) {
			// Re-generate slug from current name when re-enabling
			const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
			form.setValue('slug', slugified, { shouldDirty: false })
		}
	}

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
				logo: !orgData.logo ? undefined : orgData.logo,
				plan: orgData.plan,
				status: orgData.status,
				keepCurrentActiveOrganization: true,
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
				<ResourceFormHeader
					heading='Add Organization'
					description='Create a new organization to manage members and recordings.'
					backTo='/organizations'
					isPending={isPending}
					isDirty={form.formState.isDirty}
					handleDiscard={handleDiscard}
				/>

				<div className='grid gap-8'>
					<div className='grid items-start gap-4 lg:grid-cols-3'>
						{/* Left column */}
						<div className='lg:col-span-2'>
							<Card>
								<CardHeader>
									<CardTitle>Organization Details</CardTitle>
									<CardDescription>Configure the basic information and settings for your organization.</CardDescription>
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

										<Field>
											<InputField
												control={form.control}
												label='Slug'
												name='slug'
												disabled={autoGenSlug || isPending}
											/>
											<Field orientation='horizontal'>
												<Checkbox
													id='autoGenSlug'
													checked={autoGenSlug}
													onCheckedChange={checked => handleAutoGenSlug(Boolean(checked))}
												/>
												<FieldLabel
													htmlFor='autoGenSlug'
													className='font-light'
												>
													Auto generate slug
												</FieldLabel>
											</Field>
										</Field>
										<SelectField
											control={form.control}
											label='Plan'
											name='plan'
											disabled={isPending}
											loadingPlaceholder='Basic'
											options={ORGANIZATION_PLAN_OPTIONS}
										/>
										<InputField
											control={form.control}
											name='logo'
											label='Logo URL'
											disabled={isPending}
										/>
									</FieldGroup>
								</CardContent>
							</Card>
						</div>

						{/* Right column */}
						<Card>
							<CardHeader>
								<CardTitle>Organization Status</CardTitle>
								<CardDescription>Set the status for this organization.</CardDescription>
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

					<ResourceFormFooter
						isPending={isPending}
						isDirty={form.formState.isDirty}
						handleDiscard={handleDiscard}
					/>
				</div>
			</div>
		</form>
	)
}

export default AddOrganizationForm
