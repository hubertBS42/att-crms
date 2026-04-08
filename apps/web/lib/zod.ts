import { z } from 'zod'
import { ORG_LEVEL_ROLE_NAMES } from './permissions/org-permissions'
import { OrganizationPlan, OrganizationStatus } from '@att-crms/db/enums'

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

export const addUserFormSchema = z.discriminatedUnion('systemRole', [
	z.object({
		name: z.string().min(1, 'Name is required'),
		email: z.email('Please enter a valid email address'),
		image: z.url('Invalid URL').optional().or(z.literal('')),
		systemRole: z.literal('admin'),
	}),
	z.object({
		name: z.string().min(1, 'Name is required'),
		email: z.email('Please enter a valid email address'),
		image: z.url('Invalid URL').optional().or(z.literal('')),
		systemRole: z.literal('user'),
		organizations: z.array(
			z.object({
				organizationId: z.string().min(1, 'Organization is required'),
				orgRole: z.enum(['member', 'admin'] as const),
			}),
		),
	}),
])

export const editAdminFormSchema = z.object({
	id: z.string().min(1, 'ID is required'),
	name: z.string().min(1, 'Name is required'),
	email: z.email('Please enter a valid email address'),
	image: z.url('Invalid URL').optional().or(z.literal('')),
})

export const editOrgUserFormSchema = z.object({
	id: z.string().min(1, 'ID is required'),
	name: z.string().min(1, 'Name is required'),
	email: z.email('Please enter a valid email address'),
	image: z.url('Invalid URL').optional().or(z.literal('')),
	organizations: z.array(
		z.object({
			memberId: z.string().optional(),
			organizationId: z.string().min(1, 'Organization is required'),
			orgRole: z.enum(ORG_LEVEL_ROLE_NAMES),
			isNew: z.boolean(),
		}),
	),
})

export const editUserFormSchema = z.discriminatedUnion('systemRole', [editAdminFormSchema, editOrgUserFormSchema])

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

const slugSchema = z
	.string()
	.min(1, 'You must provide an organization slug')
	.min(3, 'Organization slug must be at least 3 characters')
	.max(63, 'Slug must be 63 characters or less')
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen')

export const addOrganizationFormSchema = z.object({
	name: z.string().min(1, 'You must provide an organization name').min(3, 'Organization name must be at least 3 characters'),
	slug: slugSchema,
	logo: z.url('Invalid URL').optional().or(z.literal('')),
	plan: z.enum(OrganizationPlan),
	status: z.enum(OrganizationStatus),
})

export const updateOrganizationFormSchema = addOrganizationFormSchema.extend({
	id: z.string().min(1, 'ID is required'),
	retentionDays: z.string(),
})

export const profileFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email('Invalid email address'),
	image: z.url('Invalid URL').optional().or(z.literal('')),
})

export const updatePasswordFormSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your new password'),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
	.refine(data => data.currentPassword !== data.newPassword, {
		message: 'New password must be different from current password',
		path: ['newPassword'],
	})
