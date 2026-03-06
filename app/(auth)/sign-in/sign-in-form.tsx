'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signInFormSchema } from '@/lib/zod'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { APP_URL } from '@/constants'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export function SignInForm({ callbackURL }: { callbackURL: string }) {
	const [isPending, startTransition] = React.useTransition()

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof signInFormSchema>> = async data => {
		startTransition(async () => {
			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
					callbackURL: callbackURL || APP_URL,
				},
				{
					onError: ctx => {
						toast.error('Sign in failed', {
							position: 'top-left',
							description: ctx.error.message,
							richColors: true,
						})
					},
				},
			)
		})
	}
	return (
		<Card>
			<CardHeader className='text-center'>
				<CardTitle className='text-xl'>Welcome back</CardTitle>
				<CardDescription>Login into your account</CardDescription>
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

						<Controller
							control={form.control}
							name='password'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<div className='flex items-center'>
										<FieldLabel htmlFor='password'>Password</FieldLabel>
										<Link
											href='/reset-password'
											className='ml-auto text-sm underline-offset-4 hover:underline'
										>
											Forgot your password?
										</Link>
									</div>

									<Input
										{...field}
										id='password'
										aria-invalid={fieldState.invalid}
										type='password'
										required
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Button
							type='submit'
							disabled={isPending}
						>
							{isPending && <Spinner />}
							{isPending ? 'Signing in...' : 'Sign in'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
