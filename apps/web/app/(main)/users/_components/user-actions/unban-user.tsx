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
import { authClient } from '@/lib/auth-client'
import { User } from '@att-crms/db/client'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const UnbanUser = ({ user }: { user: User }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const handleUnban = () => {
		startTransition(async () => {
			await authClient.admin.unbanUser(
				{
					userId: user.id,
				},
				{
					onSuccess: () => {
						startTransition(() => {
							setIsOpen(false)
							router.push(`/users/${user.id}/edit`)
							toast.success('Operation success', { description: 'The user has been successfully unbanned.' })
						})
					},
					onError: () => {
						toast.error('Operation failed', { description: 'Something went wrong...' })
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
					className='w-full text-red-500 hover:text-red-700 hover:bg-red-50'
					variant={'outline'}
				>
					Unban account
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						{`You are about to unban ${user.name}'s account allowing them to access the application again. Do you still wish to proceed?`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleUnban()
						}}
						disabled={isPending}
					>
						{isPending ? <Loader className='h-4 w-4 animate-spin' /> : 'Proceed'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
export default UnbanUser
