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
import { authClient } from '@/lib/auth-client'
import { User } from '@/lib/generated/prisma/client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const DeleteUser = ({ user }: { user: User }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	const handleDelete = () => {
		startTransition(async () => {
			await authClient.admin.removeUser(
				{
					userId: user.id,
				},
				{
					onSuccess: () => {
						startTransition(() => {
							setIsOpen(false)
							router.push('/users')
							toast.success('Operation sucess', { description: 'User has been deleted.' })
						})
					},
					onError: ctx => {
						startTransition(() => {
							setIsOpen(false)
							toast.error('Operation failed', { description: ctx.error.message })
						})
					},
				},
			)
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
					Delete account
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This action cannot be undone. ${user.name}'s account and all associated resources will be permanently deleted from the system.`}
					</AlertDialogDescription>
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
export default DeleteUser
