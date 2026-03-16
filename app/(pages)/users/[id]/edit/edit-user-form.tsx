'use client'

import { DataResponse, UserWithSessions } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useRouter } from 'next/navigation'
import { use, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { editUserFormSchema } from '@/lib/zod'
import { updateUser } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InputField from '@/components/input-field'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import DiscardButton from '@/components/discard-button'
import SaveButton from '@/components/save-button'
import { capitalizeFirstLetter } from '@/lib/utils'
import { format } from 'date-fns'
import { SYSTEM_LEVEL_ROLE_NAMES, SystemLevelRole } from '@/lib/permissions/system-permissions'
import RoleSelector from '@/components/role-selector'
import BackButton from '@/components/back-button'

const UserActions = dynamic(() => import('../../_components/user-actions'), { ssr: false, loading: () => <Skeleton className='w-full h-10' /> })
const EditUserForm = ({ data }: { data: Promise<DataResponse<UserWithSessions | null>> }) => {
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	if (!response.data) notFound()

	const user = response.data

	const router = useRouter()

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof editUserFormSchema>>({
		resolver: zodResolver(editUserFormSchema),
		defaultValues: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			role: user.role as SystemLevelRole,
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof editUserFormSchema>> = async data => {
		startTransition(async () => {
			const res = await updateUser(data)

			if (!res.success) {
				toast.error('Operation failed', { description: res.error })
			} else {
				toast.success('Operation success', { description: 'User has been updated successfully!' })
				router.push('/users')
			}
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
						<h1 className='text-xl md:text-2xl font-bold'>Edit user</h1>
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
					<div className='grid items-start gap-4 lg:grid-cols-3'>
						{/* Left column */}
						<div className='grid gap-4 lg:col-span-2'>
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
										/>
									</div>

									<div className='grid col-span-2 lg:col-span-1'>
										<InputField
											control={form.control}
											label='Email'
											name='email'
											type='email'
											disabled
										/>
									</div>

									<div className='grid col-span-2 lg:col-span-1'>
										<RoleSelector
											control={form.control}
											isSubmitting={isPending}
											user={user}
											options={adminRoleOptions}
											permissionType='system'
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Sessions</CardTitle>
									<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
								</CardHeader>
								<CardContent>{/* <Sessions user={user} /> */}</CardContent>
							</Card>
						</div>

						{/* Right column */}
						<div className='grid gap-4'>
							<Card>
								<CardHeader>
									<CardTitle className='flex justify-between items-center'>Status {user.banned ? <Badge variant={'destructive'}>Banned</Badge> : <Badge>Active</Badge>}</CardTitle>
									{/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
								</CardHeader>
								{user.banned && (
									<CardContent>
										<div className='grid text-sm gap-y-5'>
											<div>
												<h3 className='font-medium'>Ban reason:</h3>
												<p className='text-muted-foreground'>{user.banReason}</p>
											</div>

											<div>
												<h3 className='font-medium'>Ban expiration:</h3>
												<p className='text-muted-foreground'>{user.banExpires ? format(user.banExpires, 'LLL dd, y') : 'N/A'}</p>
											</div>
										</div>
									</CardContent>
								)}
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='flex justify-between items-end'>Actions</CardTitle>
									<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
								</CardHeader>
								<CardContent>
									<UserActions user={user} />
								</CardContent>
							</Card>
						</div>
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
export default EditUserForm
