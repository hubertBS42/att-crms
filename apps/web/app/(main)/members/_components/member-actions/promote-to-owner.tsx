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
import { MemberWithUserWithSessions } from '@/interfaces'
import { updateOrganizationMemberRoleAction } from '@/lib/actions/member.actions'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const PromoteToOwner = ({ member }: { member: MemberWithUserWithSessions }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()

	const handlePromote = () => {
		startTransition(async () => {
			const response = await updateOrganizationMemberRoleAction({
				memberId: member.id,
				organizationId: member.organizationId,
				role: 'owner',
			})

			if (!response.success) {
				toast.error('Operation failed', { description: response.error })
				return
			}

			toast.success('Operation success', { description: 'Member has been promoted to owner!' })
			router.refresh()
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
					variant='outline'
				>
					Promote to Owner
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Promote to Owner?</AlertDialogTitle>
					<AlertDialogDescription>
						{`${member.user.name} will become an owner of this organization and will have full control including the ability to delete it.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handlePromote()
						}}
						disabled={isPending}
					>
						{isPending ? <Spinner /> : 'Promote'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default PromoteToOwner
