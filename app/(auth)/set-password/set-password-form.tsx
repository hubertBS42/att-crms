'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { setPasswordFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

export function SetPasswordForm({ token, action }: { token: string; action: string }) {
	const [isPending, startTransition] = React.useTransition()
	const [isComplete, setIsComplete] = React.useState(false)

	const form = useForm<z.infer<typeof setPasswordFormSchema>>({
		resolver: zodResolver(setPasswordFormSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<z.infer<typeof setPasswordFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.resetPassword(
				{
					newPassword: data.password,
					token,
				},
				{
					onSuccess: () => {
						startTransition(() => {
							setIsComplete(true)
						})
					},
				},
			)
		})
	}

	function getButtonText(isPending: boolean, action: 'set' | 'reset') {
		if (isPending) return action === 'set' ? 'Setting password...' : 'Resetting password...'
		return action === 'set' ? 'Set password' : 'Reset password'
	}

	if (isComplete) {
		return (
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>{`Password ${action === 'set' ? 'set' : 'reset'}`}</CardTitle>
					<CardDescription>{`Your password has been successfully ${action === 'set' ? 'set' : 'reset'}. You can now sign in with this password.`}</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						asChild
						className='w-full'
					>
						<Link href={'/sign-in'}>Sign in</Link>
					</Button>
				</CardContent>
			</Card>
		)
	}
	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle className='text-xl'>{`${action === 'set' ? 'Set' : 'Reset'} your password`}</CardTitle>
				<CardDescription>Enter your preferred password below to login</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							control={form.control}
							name='password'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='password'>Password</FieldLabel>
									<Input
										{...field}
										id='password'
										aria-invalid={fieldState.invalid}
										type='password'
										required
										autoFocus
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name='confirmPassword'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='confirmPassword'>Confirm password</FieldLabel>
									<Input
										{...field}
										id='confirmPassword'
										aria-invalid={fieldState.invalid}
										type='password'
										required
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Field>
							<Button
								type='submit'
								disabled={isPending}
							>
								{isPending && <Spinner />}
								{getButtonText(isPending, action as 'set' | 'reset')}
							</Button>
							<FieldDescription className='text-center'>
								Remember you password? <Link href='/sign-in'>Sign in</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
