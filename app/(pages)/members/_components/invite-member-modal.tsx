'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import InputField from '@/components/input-field'
import { authClient } from '@/lib/auth-client'
import { ORG_LEVEL_ROLE_NAMES, OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { inviteMemberFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { capitalizeFirstLetter } from '@/lib/utils'
import { UserPlus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import RoleSelector from '@/components/role-selector'

const InviteMemberModal = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
		resolver: zodResolver(inviteMemberFormSchema),
		defaultValues: {
			email: '',
			role: 'member',
		},
	})

	const { data: activeMember, isPending: isActiveMemberLoading } = authClient.useActiveMember()

	if (isActiveMemberLoading || !activeMember) return null

	const canInvite = authClient.organization.checkRolePermission({
		role: (activeMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { invitation: ['create'] },
	})

	const roleOptions = ORG_LEVEL_ROLE_NAMES.filter(role => role !== 'owner').map(role => ({ label: capitalizeFirstLetter(role), value: role }))

	const onSubmit: SubmitHandler<z.infer<typeof inviteMemberFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.organization.inviteMember(
				{
					email: data.email,
					role: data.role as OrganizationLevelRole,
				},
				{
					onError: ctx => {
						if (ctx.error.status === 422) {
							form.setError('email', {
								type: 'custom',
								message: 'This email has already been invited.',
							})
						} else {
							toast.error('Operation failed', { description: ctx.error.message })
						}
					},
					onSuccess: () => {
						toast.success('Invitation sent', {
							description: `An invitation has been sent to ${data.email}.`,
						})
						form.reset()
						setIsOpen(false)
					},
				},
			)
		})
	}

	if (!canInvite) return null

	return (
		<Dialog
			open={isOpen}
			onOpenChange={open => {
				setIsOpen(open)
				if (!open) form.reset()
			}}
		>
			<DialogTrigger asChild>
				<Button size='sm'>
					<UserPlus className='size-4' />
					Invite Member
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Member</DialogTitle>
					<DialogDescription>Send an invitation to a new member to join this organization.</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='grid gap-6'>
						<FieldGroup>
							<InputField
								control={form.control}
								label='Email'
								name='email'
								type='email'
								disabled={isPending}
								autoFocus
							/>
							<RoleSelector
								control={form.control}
								isDisabled={isPending}
								isPending={isPending}
								options={roleOptions}
								permissionType='organization'
							/>
						</FieldGroup>
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								disabled={isPending}
								onClick={() => {
									form.reset()
									setIsOpen(false)
								}}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={isPending || !form.formState.isDirty}
							>
								{isPending ? <Spinner /> : 'Send Invite'}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default InviteMemberModal
