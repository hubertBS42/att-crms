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
import { leaveOrganizationAction } from '@/lib/actions/member.actions'
import { authClient } from '@/lib/auth-client'
import { DoorOpen } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const LeaveOrganization = () => {
	const [isPending, startTransition] = useTransition()
	const { data: activeOrganization, isPending: isActiveOrganizationPending } = authClient.useActiveOrganization()
	const [isOpen, setIsOpen] = useState(false)

	if (isActiveOrganizationPending || !activeOrganization) return <Skeleton className='w-full h-9' />

	const handleLeave = () => {
		startTransition(async () => {
			const response = await leaveOrganizationAction({ organizationId: activeOrganization.id })

			if (!response.success) {
				setIsOpen(false)
				toast.error('Operation failed', { description: response.error })
				return
			}
		})
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<AlertDialogTrigger asChild>
				<Button
					type='button'
					className='w-full'
					variant='destructive'
				>
					<DoorOpen className='size-4' />
					Leave Organization
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`You will be removed from ${activeOrganization.name} and will lose access to all its resources.`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleLeave()
						}}
						disabled={isPending}
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						{isPending ? <Spinner /> : 'Proceed'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default LeaveOrganization
