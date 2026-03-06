import * as z from 'zod'

export const signInFormSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string(),
})

export const resetPasswordFormSchema = z.object({
	email: z.email('Invalid email address'),
})

export const setPasswordFormSchema = z
	.object({
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		error: "Passwords don't match",
		path: ['confirmPassword'],
	})
