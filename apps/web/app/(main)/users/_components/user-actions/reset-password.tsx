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
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const ResetPassword = ({ user }: { user: User }) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)

	const handleReset = () => {
		startTransition(async () => {
			await authClient.requestPasswordReset(
				{
					email: user.email,
					redirectTo: '/set-password?action=reset',
				},
				{
					onSuccess: () => {
						setIsOpen(false)
						toast.success('Operation success', { description: 'Reset email has been sent.' })
					},

					onError: ctx => {
						toast.error('Operation failed', { description: ctx.error.message })
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
					Reset password
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`An email with a password reset link is about to be sent to ${user.name}, do you wish to continue?`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleReset()
						}}
						disabled={isPending}
					>
						{isPending ? <Loader className='h-4 w-4 animate-spin' /> : 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
export default ResetPassword
