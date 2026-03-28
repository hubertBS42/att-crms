'use client'

import { useState, useTransition } from 'react'
import { Invitation } from '@att-crms/db/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '@/lib/utils'
import { cancelInvitationAction, resendInvitationAction } from '@/lib/actions/invitation.actions'
import { toast } from 'sonner'
import { MailIcon, Trash2Icon, InfoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const InvitationActions = ({ invitation }: { invitation: Invitation }) => {
	const [isPending, startTransition] = useTransition()
	const [isCancelOpen, setIsCancelOpen] = useState(false)
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)
	const router = useRouter()

	const handleCancel = () => {
		startTransition(async () => {
			const result = await cancelInvitationAction(invitation.id)
			if (!result.success) {
				toast.error('Failed to cancel invitation', { description: result.error })
				return
			}
			toast.success('Invitation cancelled')
			setIsCancelOpen(false)
			router.refresh()
		})
	}

	const handleResend = () => {
		startTransition(async () => {
			const result = await resendInvitationAction(invitation.id)
			if (!result.success) {
				toast.error('Failed to resend invitation', { description: result.error })
				return
			}
			toast.success('Invitation resent', {
				description: `A new invitation has been sent to ${invitation.email}`,
			})
			router.refresh()
		})
	}

	return (
		<div className='flex items-center justify-end gap-2'>
			{/* Details */}
			<Sheet
				open={isDetailsOpen}
				onOpenChange={setIsDetailsOpen}
			>
				<SheetTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='size-8'
					>
						<InfoIcon className='size-4' />
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Invitation Details</SheetTitle>
						<SheetDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit</SheetDescription>
					</SheetHeader>
					<div className='grid gap-4 text-sm px-4'>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Email</p>
							<p className='font-medium'>{invitation.email}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Role</p>
							<Badge
								variant='outline'
								className='w-fit'
							>
								{capitalizeFirstLetter(invitation.role as string)}
							</Badge>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Status</p>
							<Badge
								variant='outline'
								className='w-fit'
							>
								{capitalizeFirstLetter(invitation.status)}
							</Badge>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Invited On</p>
							<p className='font-medium'>{format(new Date(invitation.expiresAt), 'LLL dd, y')}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Expires At</p>
							<p className='font-medium'>{format(new Date(invitation.expiresAt), 'LLL dd, y HH:mm')}</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Resend */}
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				disabled={isPending}
				onClick={handleResend}
			>
				{isPending ? <Spinner /> : <MailIcon className='size-4' />}
			</Button>

			{/* Cancel */}
			<AlertDialog
				open={isCancelOpen}
				onOpenChange={setIsCancelOpen}
			>
				<AlertDialogTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='size-8 text-destructive hover:text-destructive'
					>
						<Trash2Icon className='size-4' />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
						<AlertDialogDescription>
							{`Are you sure you want to cancel the invitation sent to ${invitation.email}? They will no longer be able to join the organization using this invitation.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Keep</AlertDialogCancel>
						<AlertDialogAction
							onClick={e => {
								e.preventDefault()
								handleCancel()
							}}
							disabled={isPending}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							{isPending ? <Spinner /> : 'Cancel Invitation'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default InvitationActions
