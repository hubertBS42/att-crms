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
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { MemberWithUser } from '@/interfaces'
import { removeOrganizationMember } from '@/lib/actions/members.actions'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export const ActionsSkeleton = () => {
	return <MoreVertical className='ml-auto size-4' />
}

const Actions = ({ member }: { member: MemberWithUser }) => {
	const [dropdownMenuIsOpen, setDropdownMenuIsOpen] = React.useState(false)
	const [alertDialogIsOpen, setAlertDialogIsOpen] = React.useState(false)
	const [isPending, startTransition] = React.useTransition()
	const router = useRouter()

	const handleRemove = () => {
		startTransition(async () => {
			const response = await removeOrganizationMember(member.id)

			if (response.error) {
				setAlertDialogIsOpen(false)
				toast.error('Operation failed', { description: response.error })
			} else {
				setAlertDialogIsOpen(false)
				router.refresh()
				toast.success('Operation success', { description: 'Member has been removed.' })
			}
		})
	}

	return (
		<div className='flex justify-end'>
			<DropdownMenu
				open={dropdownMenuIsOpen}
				onOpenChange={setDropdownMenuIsOpen}
			>
				<DropdownMenuTrigger asChild>
					<MoreVertical className='size-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild>
						<Link href={`/members/${member.id}/details`}>Details</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						variant='destructive'
						onSelect={e => {
							e.preventDefault()
							setDropdownMenuIsOpen(false)
							setAlertDialogIsOpen(true)
						}}
					>
						Remove
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={alertDialogIsOpen}
				onOpenChange={setAlertDialogIsOpen}
			>
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
		</div>
	)
}

export default Actions
