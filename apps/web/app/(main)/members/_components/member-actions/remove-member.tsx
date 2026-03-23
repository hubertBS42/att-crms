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
import { removeOrganizationMember } from '@/lib/actions/member.actions'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const RemoveMember = ({ member }: { member: MemberWithUserWithSessions }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	const handleRemove = () => {
		startTransition(async () => {
			const response = await removeOrganizationMember(member.id)

			if (response.error) {
				setIsOpen(false)
				toast.error('Operation failed', { description: response.error })
			} else {
				setIsOpen(false)
				toast.success('Member removed', {
					description: `${member.user.name} has been removed from this organization.`,
				})
				router.push('/members')
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
					variant={'destructive'}
				>
					Remove member
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`This action cannot be undone. ${member.user.name} will be removed from this organization.`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleRemove()
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
export default RemoveMember
