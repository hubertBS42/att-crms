'use client'

import DiscardButton from '@/components/discard-button'
import InputField from '@/components/input-field'
import SaveButton from '@/components/save-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { capitalizeFirstLetter, generatePassword } from '@/lib/utils'
import { addUserFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { addUserToAllOrganizations } from '@/lib/actions/user.actions'
import { SYSTEM_LEVEL_ROLE_NAMES } from '@/lib/permissions/system-permissions'
import RoleSelector from '@/components/role-selector'
import BackButton from '@/components/back-button'

const AddUserForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof addUserFormSchema>>({
		resolver: zodResolver(addUserFormSchema),
		defaultValues: {
			name: '',
			email: '',
			image: null,
			role: 'admin',
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof addUserFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.admin.createUser(
				{
					name: data.name,
					email: data.email,
					password: generatePassword({ passwordLength: 16 }),
					role: data.role,
					data: {
						image: data.image,
					},
				},
				{
					onSuccess: async ctx => {
						await addUserToAllOrganizations(ctx.data.user.id, data.role)
						await authClient.requestPasswordReset({
							email: data.email,
							redirectTo: '/set-password?action=set',
						})
						router.push('/users')
						toast.success('User successfully added.')
					},

					onError: ctx => {
						if (ctx.error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
							form.setError('email', {
								type: 'custom',
								message: 'This email address is already registered to a user.',
							})
						} else {
							toast.error(ctx.error.message)
						}
					},
				},
			)
		})
	}

	const handleDiscard = async () => {
		router.push('/users')
	}

	const adminRoleOptions = SYSTEM_LEVEL_ROLE_NAMES.filter(item => item !== 'user').map(role => ({ label: capitalizeFirstLetter(role), value: role }))
	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<div className='flex items-end'>
					<div className='grid'>
						<h1 className='text-xl md:text-2xl font-bold'>Add user</h1>
						<p className='text-muted-foreground text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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
					<div className='grid items-start gap-4'>
						<Card>
							<CardHeader>
								<CardTitle>Details</CardTitle>
								<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
							</CardHeader>
							<CardContent className='grid grid-cols-2 gap-5'>
								<div className='grid col-span-2'>
									<InputField
										control={form.control}
										label='Full name'
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
									<RoleSelector
										control={form.control}
										isSubmitting={isPending}
										options={adminRoleOptions}
										permissionType='system'
									/>
								</div>
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
