'use client'

import DiscardButton from '@/components/discard-button'
import InputField from '@/components/input-field'
import SaveButton from '@/components/save-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { capitalizeFirstLetter, generatePassword } from '@/lib/utils'
import { addUserFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SYSTEM_LEVEL_ROLE_NAMES } from '@/lib/permissions/system-permissions'
import BackButton from '@/components/back-button'
import { ORG_LEVEL_ROLE_NAMES } from '@/lib/permissions/org-permissions'
import { Organization } from '@att-crms/db/client'
import SelectField from '@/components/select-field'
import { Plus, Trash2 } from 'lucide-react'
import { createUserAction } from '@/lib/actions/user.actions'

const systemRoleOptions = SYSTEM_LEVEL_ROLE_NAMES.filter(item => item !== 'superAdmin').map(role => ({ label: capitalizeFirstLetter(role), value: role }))
const orgRoleOptions = ORG_LEVEL_ROLE_NAMES.filter(item => item !== 'owner').map(role => ({ label: capitalizeFirstLetter(role), value: role }))

const AddUserForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const [isOrgsLoading, setIsOrgsLoading] = useState(false)

	const form = useForm<z.infer<typeof addUserFormSchema>>({
		resolver: zodResolver(addUserFormSchema),
		defaultValues: {
			name: '',
			email: '',
			image: '',
			systemRole: 'user',
			organizations: [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'organizations',
	})

	const selectedRole = form.watch('systemRole')
	const isOrgUser = selectedRole === 'user'

	// Set first org default after fetch
	useEffect(() => {
		if (!isOrgUser) return

		const fetchOrgs = async () => {
			setIsOrgsLoading(true)
			try {
				const response = await fetch('/api/organizations')
				const data: Organization[] = await response.json()
				const filtered = data.filter(org => org.slug !== 'global')
				setOrganizations(filtered)
				if (filtered.length) {
					form.setValue('organizations', [{ organizationId: filtered[0]?.id ?? '', orgRole: 'member' }])
				}
				// form.setValue('organizations', [{ organizationId: filtered[0]?.id ?? '', orgRole: 'member' }])
			} catch (error) {
				console.error('Failed to fetch organizations:', error)
			} finally {
				setIsOrgsLoading(false)
			}
		}

		fetchOrgs()
	}, [isOrgUser, form])

	const orgOptions = organizations.map(org => ({
		label: org.name,
		value: org.id,
	}))

	const onSubmit: SubmitHandler<z.infer<typeof addUserFormSchema>> = async data => {
		startTransition(async () => {
			const result = await createUserAction({
				name: data.name,
				email: data.email,
				password: generatePassword({ passwordLength: 16 }),
				systemRole: data.systemRole,
				image: data.image,
				organizations: data.systemRole === 'user' ? data.organizations : undefined,
			})

			if (result.error) {
				if (result.error === 'User already exists. Use another email.') {
					form.setError('email', {
						type: 'custom',
						message: 'This email address is already registered to a user',
					})
				} else {
					toast.error('Failed to create user', { description: result.error })
				}
			}
		})
	}

	const handleDiscard = async () => {
		router.push('/users')
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<div className='flex items-end'>
					<div className='grid'>
						<h1 className='text-xl md:text-2xl font-bold'>Add User</h1>
						<p className='text-muted-foreground text-sm'>Create a new user to manage organizations and recordings.</p>
					</div>

					<div className='hidden items-center gap-2 md:ml-auto md:flex'>
						{form.formState.isDirty ? (
							<DiscardButton
								isLoading={isPending}
								handleDiscard={handleDiscard}
							/>
						) : (
							<BackButton
								link='/users'
								isLoading={isPending}
							/>
						)}

						<SaveButton
							isLoading={isPending}
							isDisabled={!form.formState.isDirty}
						/>
					</div>
				</div>

				<div className='grid gap-8'>
					<div className='grid gap-4'>
						<Card>
							<CardHeader>
								<CardTitle>User Details</CardTitle>
								<CardDescription>Basic information about the user.</CardDescription>
							</CardHeader>
							<CardContent className='grid grid-cols-2 gap-5'>
								<div className='grid col-span-2'>
									<InputField
										control={form.control}
										label='Full Name'
										name='name'
										disabled={isPending}
										autoFocus
									/>
								</div>
								<div className='grid col-span-2 lg:col-span-1'>
									<InputField
										control={form.control}
										label='Email'
										name='email'
										type='email'
										disabled={isPending}
									/>
								</div>
								<div className='grid col-span-2 lg:col-span-1'>
									<SelectField
										control={form.control}
										label='System Role'
										name='systemRole'
										options={systemRoleOptions}
										disabled={isPending}
										loadingPlaceholder='Admin'
									/>
								</div>

								<div className='grid col-span-2'>
									<InputField
										control={form.control}
										name='image'
										label='Avatar URL'
										disabled={isPending}
									/>
								</div>
							</CardContent>
						</Card>

						{isOrgUser && (
							<Card>
								<CardHeader>
									<CardTitle>Organization</CardTitle>
									<CardDescription>Assign this user to one or more organizations.</CardDescription>
								</CardHeader>
								<CardContent className='grid gap-4'>
									{fields.map((field, index) => (
										<div
											key={field.id}
											className='grid grid-cols-2 gap-4 items-end'
										>
											<SelectField
												control={form.control}
												label='Organization'
												name={`organizations.${index}.organizationId`}
												options={orgOptions}
												disabled={isPending || isOrgsLoading}
												loadingPlaceholder='Select organization'
											/>
											<div className='flex items-end gap-2'>
												<div className='flex-1'>
													<SelectField
														control={form.control}
														label='Member Role'
														name={`organizations.${index}.orgRole`}
														options={orgRoleOptions}
														disabled={isPending}
														loadingPlaceholder='Member'
													/>
												</div>
												{fields.length > 1 && (
													<Button
														type='button'
														variant={'outline'}
														size={'icon'}
														onClick={() => remove(index)}
														disabled={isPending}
														className='mb-0.5'
													>
														<Trash2 className='size-4' />
													</Button>
												)}
											</div>
										</div>
									))}
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={() => append({ organizationId: '', orgRole: 'member' })}
										disabled={isPending || isOrgsLoading || orgOptions.length === fields.length}
										className='w-full'
									>
										<Plus className='size-4' />
										Add Organization
									</Button>
								</CardContent>
							</Card>
						)}
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
								onClick={() => router.push('/users')}
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
export default AddUserForm
