'use client'

import { UserWithSessionsAndMemberships } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { editOrgUserFormSchema } from '@/lib/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SelectField from '@/components/select-field'
import { Organization } from '@att-crms/db/client'
import { ORG_LEVEL_ROLE_NAMES, OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import UserFormFields from './user-form-fields'
import ResourceFormHeader from '@/components/resource-form-header'
import ResourceFormFooter from '@/components/resource-form-footer'
import { Badge } from '@/components/ui/badge'
import { updateUserAction } from '@/lib/actions/user.actions'

const orgRoleOptions = ORG_LEVEL_ROLE_NAMES.filter(item => item !== 'owner').map(role => ({ label: capitalizeFirstLetter(role), value: role }))

const EditOrgUserForm = ({ user }: { user: UserWithSessionsAndMemberships }) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const [isOrgsLoading, setIsOrgsLoading] = useState(false)
	const [removedMembers, setRemovedMembers] = useState<{ memberId: string; organizationId: string }[]>([])

	const form = useForm<z.infer<typeof editOrgUserFormSchema>>({
		resolver: zodResolver(editOrgUserFormSchema) as never,
		defaultValues: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image ?? '',
			organizations: user.members.map(m => ({
				memberId: m.id,
				organizationId: m.organizationId,
				orgRole: m.role as OrganizationLevelRole,
				isNew: false,
			})),
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'organizations',
	})

	const fetchOrganizations = async () => {
		setIsOrgsLoading(true)
		try {
			const response = await fetch('/api/organizations')
			const data: Organization[] = await response.json()
			setOrganizations(data.filter(org => org.slug !== 'global'))
		} catch (error) {
			console.error('Failed to fetch organizations:', error)
		} finally {
			setIsOrgsLoading(false)
		}
	}

	useEffect(() => {
		fetchOrganizations()
	}, [])

	const orgOptions = organizations.map(org => ({
		label: org.name,
		value: org.id,
	}))

	const handleRemove = (index: number) => {
		const field = fields[index]
		if (field && field.memberId) {
			setRemovedMembers(prev => [...prev, { memberId: field.memberId!, organizationId: field.organizationId }])
		}
		remove(index)
	}

	const onSubmit: SubmitHandler<z.infer<typeof editOrgUserFormSchema>> = async data => {
		startTransition(async () => {
			const result = await updateUserAction({
				id: data.id,
				email: data.email,
				name: data.name,
				image: data.image,
				organizations: data.organizations,
				removedMembers: removedMembers,
			})

			if (!result.success) {
				toast.error('Failed to update user', { description: result.error })
				return
			}

			toast.success('User successfully updated.')
			router.push('/users')
		})
	}

	const handleDiscard = async () => router.push('/users')

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<ResourceFormHeader
					heading='Edit user'
					description='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
					isPending={isPending}
					isDirty={form.formState.isDirty}
					handleDiscard={handleDiscard}
				/>

				<div className='grid gap-8'>
					<div className='grid gap-4'>
						<UserFormFields
							control={form.control}
							user={user}
							isPending={isPending}
						/>

						<div className='grid lg:grid-cols-3'>
							<div className='lg:col-span-2'>
								{/* Organizations card */}
								<Card>
									<CardHeader>
										<CardTitle>Organizations</CardTitle>
										<CardDescription>Manage this user&apos;s organization memberships</CardDescription>
									</CardHeader>
									<CardContent className='grid gap-4'>
										{fields.map((field, index) => {
											// Get all selected organization IDs except the current field
											const selectedOrgIds = fields.filter((_, i) => i !== index).map(f => f.organizationId)

											// Filter out already selected orgs
											const availableOrgOptions = orgOptions.filter(org => !selectedOrgIds.includes(org.value))
											return (
												<div
													key={field.id}
													className='grid grid-cols-2 gap-4 items-end'
												>
													<SelectField
														control={form.control}
														label='Organization'
														name={`organizations.${index}.organizationId`}
														options={availableOrgOptions}
														disabled={isPending || isOrgsLoading || !field.isNew}
														loadingPlaceholder='Select organization'
													/>
													<div className='flex items-end gap-2'>
														<div className='flex-1'>
															{field.orgRole === 'owner' ? (
																// Show read-only badge for owners
																<div className='grid gap-1.5'>
																	<p className='text-sm font-medium'>Member role</p>
																	<div className='flex h-9 items-center'>
																		<Badge variant='default'>Owner</Badge>
																	</div>
																</div>
															) : (
																<SelectField
																	control={form.control}
																	label='Member role'
																	name={`organizations.${index}.orgRole`}
																	options={orgRoleOptions}
																	disabled={isPending}
																	loadingPlaceholder='Member'
																/>
															)}
														</div>
														<Button
															type='button'
															variant='outline'
															size='icon'
															onClick={() => handleRemove(index)}
															disabled={isPending}
															className='mb-0.5 shrink-0'
														>
															<Trash2 className='size-4' />
														</Button>
													</div>
												</div>
											)
										})}
										{orgOptions.length > fields.length && (
											<Button
												type='button'
												variant='outline'
												size='sm'
												onClick={() =>
													append({
														memberId: undefined,
														organizationId: organizations.find(org => !fields.map(f => f.organizationId).includes(org.id))?.id ?? '',
														orgRole: 'member',
														isNew: true,
													})
												}
												disabled={isPending || isOrgsLoading}
												className='w-full'
											>
												<Plus className='size-4' />
												Add organization
											</Button>
										)}
									</CardContent>
								</Card>
							</div>
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

export default EditOrgUserForm
