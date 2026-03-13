'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { signInFormSchema } from '@/lib/zod'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { APP_URL } from '@/constants'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import InputField from '@/components/input-field'
import PasswordField from '@/components/password-field'

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

					onSuccess: async ctx => {
						const { role } = ctx.data.user
						if (role === 'superadmin' || role === 'admin') {
							// Platform staff → Global workspace
							await authClient.organization.setActive({ organizationSlug: 'global' })
						} else {
							// Regular users → their own org
							const { data: orgs } = await authClient.organization.list()
							if (!orgs || orgs.length === 0) return
							await authClient.organization.setActive({ organizationId: orgs[0].id })
						}
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
						<InputField
							control={form.control}
							name='email'
							label='Email'
							placeholder='john@example.com'
							type='email'
							disabled={isPending}
							autoFocus
							required
						/>

						<PasswordField
							control={form.control}
							name='password'
							label='Password'
							disabled={isPending}
							resetPassword
							required
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
