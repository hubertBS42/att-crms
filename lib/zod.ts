import * as z from 'zod'
import { OrganizationPlan, OrganizationStatus } from './generated/prisma/enums'

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

export const addOrganizationFormSchema = z.object({
	name: z.string().min(1, 'Your must provide an organization name.').min(3, 'Organization name must be at least 3 characters'),
	slug: z.string().min(1, 'Your must provide an organization slug.').min(3, 'Organization slug must be at least 3 characters'),
	logo: z.string().optional(),
	plan: z.enum(OrganizationPlan),
	status: z.enum(OrganizationStatus),
})

export const updateOrganizationFormSchema = addOrganizationFormSchema.extend({
	id: z.string().min(1, 'ID is required'),
})
