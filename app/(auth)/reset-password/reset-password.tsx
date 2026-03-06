'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { resetPasswordFormSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

export function ResetPasswordForm() {
	const [isPending, startTransition] = React.useTransition()
	const [isComplete, setIsComplete] = React.useState(false)

	const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			email: '',
		},
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<z.infer<typeof resetPasswordFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.requestPasswordReset(
				{
					email: data.email,
					redirectTo: '/set-password?action=reset',
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

	if (isComplete) {
		return (
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Reset link sent</CardTitle>
					<CardDescription>Thank you. If an account with that email exists, we&apos;ve sent a password reset link to your inbox.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						asChild
						className='w-full'
					>
						<Link href={'/'}>Go home</Link>
					</Button>
				</CardContent>
			</Card>
		)
	}
	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle className='text-xl'>Forgot your password</CardTitle>
				<CardDescription>Enter your email below to reset your password</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							control={form.control}
							name='email'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input
										{...field}
										id='email'
										aria-invalid={fieldState.invalid}
										type='email'
										placeholder='m@example.com'
										required
										autoFocus
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
								{isPending ? 'Processing...' : 'Reset password'}
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
