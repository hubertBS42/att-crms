import * as z from 'zod'
import { OrganizationPlan, OrganizationStatus } from './generated/prisma/enums'
import { SYSTEM_LEVEL_ROLE_NAMES } from './permissions/system-permissions'
import { ORG_LEVEL_ROLE_NAMES } from './permissions/org-permissions'

export const signInFormSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string(),
})

export const signUpFormSchema = z
	.object({
		fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
		email: z.email('Invalid email address.'),
		password: z.string().min(6, 'Password must be at least 6 characters.'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
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

export const changePasswordFormSchema = z
	.object({
		currentPassword: z.string().min(1, 'You need to provide the current password.'),
		password: z.string().min(6, 'Password must be at least 6 characters.'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

const slugSchema = z
	.string()
	.min(1, 'You must provide an organization slug')
	.min(3, 'Organization slug must be at least 3 characters')
	.max(63, 'Slug must be 63 characters or less')
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen')

export const addOrganizationFormSchema = z.object({
	name: z.string().min(1, 'You must provide an organization name').min(3, 'Organization name must be at least 3 characters'),
	slug: slugSchema,
	logo: z.string().nullable(),
	plan: z.enum(OrganizationPlan),
	status: z.enum(OrganizationStatus),
})

export const updateOrganizationFormSchema = addOrganizationFormSchema.extend({
	id: z.string().min(1, 'ID is required'),
})

export const addUserFormSchema = z.object({
	name: z.string().min(1, 'You must provide a full name').min(3, 'Full name must be at least 3 characters'),
	email: z.email('A valid email address is required'),
	image: z.string().nullable(),
	role: z.enum(SYSTEM_LEVEL_ROLE_NAMES).describe('Must be one of the predefined roles'),
})

export const editUserFormSchema = addUserFormSchema.extend({
	id: z.string().min(1, 'ID is required'),
})

export const editMemberFormSchema = z.object({
	id: z.string().min(1, 'ID is required'),
	name: z.string().min(1, 'You must provide a full name').min(3, 'Full name must be at least 3 characters'),
	email: z.email('A valid email address is required'),
	image: z.string().nullable(),
	role: z.enum(ORG_LEVEL_ROLE_NAMES).describe('Must be one of the predefined roles'),
})

export const banUserFormSchema = z.object({
	userId: z.string().min(1, 'UserId is required'),
	banReason: z.string().nullable(),
	banExpiresIn: z
		.date()
		.nullable()
		.refine(date => !date || date.getTime() > Date.now(), { message: 'Ban expiration must be in the future.' }),
})

export const inviteMemberFormSchema = z.object({
	email: z.email('Please enter a valid email address'),
	role: z.enum(['member', 'admin'] as const),
})
