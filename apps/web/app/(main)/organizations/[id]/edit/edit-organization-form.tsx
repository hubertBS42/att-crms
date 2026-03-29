'use client'
import InputField from '@/components/input-field'
import SelectField from '@/components/select-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ORGANIZATION_PLAN_OPTIONS, ORGANIZATION_STATUS_OPTIONS, RETENTION_OPTIONS } from '@/constants'
import { DataResponse } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import { OrganizationPlan, OrganizationStatus } from '@att-crms/db/enums'
import { updateOrganizationFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { z } from 'zod'
import DeleteOrganization from '../../_components/delete-organization'
import { Organization } from '@att-crms/db/client'
import { updateRetentionPolicyAction } from '@/lib/actions/organization.actions'
import ResourceFormHeader from '@/components/resource-form-header'
import ResourceFormFooter from '@/components/resource-form-footer'

const EditOrganizationForm = ({ data }: { data: Promise<DataResponse<Organization | null>> }) => {
	const response = React.use(data)
	if (!response.success) throw new Error(response.error)
	if (!response.data) notFound()

	const organization = response.data

	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()
	const [autoGenSlug, setAutoGenSlug] = React.useState(false)

	const form = useForm<z.infer<typeof updateOrganizationFormSchema>>({
		resolver: zodResolver(updateOrganizationFormSchema),
		defaultValues: {
			id: organization.id,
			name: organization.name,
			slug: organization.slug,
			logo: organization.logo ?? '',
			plan: organization.plan as OrganizationPlan,
			status: organization.status as OrganizationStatus,
			retentionDays: organization.retentionDays?.toString() ?? 'forever',
		},
	})

	const nameValue = form.watch('name')

	React.useEffect(() => {
		if (!autoGenSlug) return

		const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
		form.setValue('slug', slugified, { shouldDirty: false })
	}, [nameValue, autoGenSlug, form])

	const handleAutoGenSlug = (checked: boolean) => {
		setAutoGenSlug(checked)
		if (checked) {
			// Re-generate slug from current name when re-enabling
			const slugified = slugify(nameValue, { lower: true, strict: true, remove: /\./g })
			form.setValue('slug', slugified, { shouldDirty: false })
		}
	}

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
					logo: !orgData.logo ? undefined : orgData.logo,
					plan: orgData.plan,
					status: orgData.status,
					metadata: organization.slug !== orgData.slug ? { previousSlug: organization.slug } : undefined,
				},
				organizationId: organization.id,
			})

			if (updateOrgErr) {
				toast.error('Operation failed', { description: updateOrgErr.message })
				return
			}

			// Update retention policy if it changed
			if (orgData.retentionDays !== organization.retentionDays?.toString()) {
				const retentionResult = await updateRetentionPolicyAction({
					organizationId: organization.id,
					retentionDays: orgData.retentionDays === 'forever' ? null : parseInt(orgData.retentionDays),
				})

				if (!retentionResult.success) {
					toast.error('Organization updated but failed to update retention policy', {
						description: retentionResult.error,
					})
					return
				}
			}

			toast.success('Organization updated successfully.')
			router.push('/organizations')
		})
	}
	const handleDiscard = async () => {
		router.push('/organizations')
	}
	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<ResourceFormHeader
					heading='Edit Organization'
					description="Update organization's details and status."
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
						<div className='grid gap-4'>
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

							<Card>
								<CardHeader>
									<CardTitle>Recording Retention</CardTitle>
									<CardDescription>Recordings older than the selected period will be automatically deleted.</CardDescription>
								</CardHeader>
								<CardContent>
									<SelectField
										control={form.control}
										name='retentionDays'
										disabled={isPending}
										loadingPlaceholder='Keep forever'
										options={RETENTION_OPTIONS}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Danger Zone</CardTitle>
									<CardDescription>Permanently delete this organization and all associated data.</CardDescription>
								</CardHeader>
								<CardContent>
									<DeleteOrganization organization={organization} />
								</CardContent>
							</Card>
						</div>
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

export default EditOrganizationForm
