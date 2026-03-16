'use client'

import { DataResponse, MemberWithUserWithSessions } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useRouter } from 'next/navigation'
import { use, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { editMemberFormSchema } from '@/lib/zod'
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
import { ORG_LEVEL_ROLE_NAMES, OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import RoleSelector from '@/components/role-selector'
import BackButton from '@/components/back-button'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

const MemberActions = dynamic(() => import('../../_components/member-actions'), { ssr: false, loading: () => <Skeleton className='w-full h-10' /> })
const EditMemberForm = ({ data }: { data: Promise<DataResponse<MemberWithUserWithSessions | null>> }) => {
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	if (!response.data) notFound()

	const member = response.data

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof editMemberFormSchema>>({
		resolver: zodResolver(editMemberFormSchema),
		defaultValues: {
			id: member.id,
			name: member.user.name,
			email: member.user.email,
			image: member.user.image,
			role: member.role as OrganizationLevelRole,
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof editMemberFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.organization.updateMemberRole(
				{
					role: data.role,
					memberId: data.id,
				},
				{
					onError: ctx => {
						toast.error('Operation failed', { description: ctx.error.message })
					},
					onSuccess: () => {
						toast.success('Operation success', { description: 'Member has been updated successfully!' })
						router.push('/members')
					},
				},
			)
		})
	}

	const handleDiscard = async () => {
		router.push('/members')
	}

	const orgRoleOptions = ORG_LEVEL_ROLE_NAMES.map(role => ({ label: capitalizeFirstLetter(role), value: role }))

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className='grid gap-y-6'>
				<div className='flex items-end'>
					<div className='grid'>
						<h1 className='text-xl md:text-2xl font-bold'>Edit member</h1>
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
								isLoading={isPending}
								link={'/members'}
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

						<Card className='lg:col-span-2'>
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
										disabled
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
										options={orgRoleOptions}
										isSubmitting={isPending}
										permissionType='organization'
										user={member}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Right column */}
						<div className='grid gap-4'>
							<Card>
								<CardHeader>
									<CardTitle className='flex justify-between items-center'>
										Status {member.user.banned ? <Badge variant={'destructive'}>Banned</Badge> : <Badge>Active</Badge>}
									</CardTitle>
									{/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
								</CardHeader>
								{member.user.banned && (
									<CardContent>
										<div className='grid text-sm gap-y-5'>
											<div>
												<h3 className='font-medium'>Ban reason:</h3>
												<p className='text-muted-foreground'>{member.user.banReason}</p>
											</div>

											<div>
												<h3 className='font-medium'>Ban expiration:</h3>
												<p className='text-muted-foreground'>{member.user.banExpires ? format(member.user.banExpires, 'LLL dd, y') : 'N/A'}</p>
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
									<MemberActions member={member} />
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
								onClick={() => router.push('/members')}
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
export default EditMemberForm
