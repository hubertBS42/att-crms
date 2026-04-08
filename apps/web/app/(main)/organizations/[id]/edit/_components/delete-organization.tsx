'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { Organization } from '@att-crms/db/client'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const DeleteOrganization = ({ organization }: { organization: Organization }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const { data, isPending: isActiveMemberRoleLoading } = authClient.useActiveMemberRole()

	const canDelete = authClient.organization.checkRolePermission({
		role: (data?.role ?? 'member') as OrganizationLevelRole,
		permissions: {
			organization: ['delete'],
		},
	})

	const handleDelete = () => {
		startTransition(async () => {
			await authClient.organization.delete(
				{
					organizationId: organization.id,
				},
				{
					onSuccess: () => {
						startTransition(() => {
							setIsOpen(false)
							router.push('/organizations')
							toast.success('Organization has been deleted.')
						})
					},
					onError: ctx => {
						startTransition(() => {
							setIsOpen(false)
							toast.error(ctx.error.message)
						})
					},
				},
			)
		})
	}

	if (isActiveMemberRoleLoading) return <Skeleton className='h-9 rounded-md' />
	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<AlertDialogTrigger asChild>
				<Button
					type='button'
					className='w-full'
					variant={'destructive'}
					disabled={!canDelete}
				>
					Delete organization
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`This action cannot be undone. ${organization.name} and all its call recordings will be permanently deleted.`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleDelete()
						}}
						disabled={isPending}
					>
						{isPending ? <Spinner /> : 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
export default DeleteOrganization
