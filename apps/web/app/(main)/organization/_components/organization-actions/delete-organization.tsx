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
import { Spinner } from '@/components/ui/spinner'
import { Organization } from '@att-crms/db/client'
import { authClient } from '@/lib/auth-client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'
import { useOrganizationSwitcher } from '@/hooks/use-org-switch'

const DeleteOrganization = ({ organization }: { organization: Organization }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)
	const { switchOrganization, isSwitching } = useOrganizationSwitcher()
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
				{ organizationId: organization.id },
				{
					onError: ctx => {
						setIsOpen(false)
						toast.error('Failed to delete organization', {
							description: ctx.error.message,
						})
					},
					onSuccess: async () => {
						// Switch to global workspace after deletion
						await switchOrganization({ organizationSlug: 'global' })
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
					variant='destructive'
					className='w-full'
					disabled={!canDelete}
				>
					<Trash2 className='size-4' />
					Delete Organization
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`This action cannot be undone. ${organization.name} and all its call recordings will be permanently deleted.`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending || isSwitching}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleDelete()
						}}
						disabled={isPending || isSwitching}
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						{isPending || isSwitching ? <Spinner /> : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteOrganization
