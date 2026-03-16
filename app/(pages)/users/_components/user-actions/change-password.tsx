'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Loader } from 'lucide-react'
import { changePasswordFormSchema } from '@/lib/zod'
import { authClient } from '@/lib/auth-client'
import PasswordField from '@/components/password-field'

const ChangePassword = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof changePasswordFormSchema>>({
		resolver: zodResolver(changePasswordFormSchema),
		defaultValues: {
			currentPassword: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof changePasswordFormSchema>> = async values => {
		startTransition(async () => {
			await authClient.changePassword(
				{
					currentPassword: values.currentPassword,
					newPassword: values.password,
					revokeOtherSessions: true,
				},
				{
					onSuccess: () => {
						setIsOpen(false)
						form.reset()
						toast.success('Operation success', { description: 'Your password has been changed.' })
					},
					onError: ctx => {
						if (ctx.error.code === 'INVALID_PASSWORD') {
							form.setError('currentPassword', {
								type: 'custom',
								message: 'This password is incorrect.',
							})
						} else {
							toast.error('Operation failed', { description: ctx.error.message })
						}
					},
				},
			)
		})
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>
				<Button
					type='button'
					className='w-full text-red-500 hover:text-red-700 hover:bg-red-50'
					variant={'outline'}
				>
					Change password
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-106.25'>
				<DialogHeader>
					<DialogTitle>Change password</DialogTitle>
					<DialogDescription>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='grid grid-cols-2 gap-4'>
						<div className='col-span-2'>
							<PasswordField
								control={form.control}
								name='currentPassword'
								label='Current password'
								disabled={isPending}
							/>
						</div>

						<div className='col-span-2'>
							<PasswordField
								control={form.control}
								name='password'
								label='New password'
								disabled={isPending}
							/>
						</div>
						<div className='col-span-2'>
							<PasswordField
								control={form.control}
								name='confirmPassword'
								label='Confirm password'
								disabled={isPending}
							/>
						</div>
						<div className='col-span-2'>
							<Button
								className='w-full'
								type='button'
								onClick={() => form.handleSubmit(onSubmit)()}
								disabled={isPending}
							>
								{isPending ? <Loader className='w-4 h-4 animate-spin' /> : 'Change password'}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
export default ChangePassword
