import { Prisma, User } from '@/lib/generated/prisma/client'
import { authClient } from './lib/auth-client'
import { type LucideIcon } from 'lucide-react'
import { PlatformRole } from './lib/access-control'

export type ParsedRecording = Omit<Prisma.RecordingCreateInput, 'organization'> & {
	organizationSlug: string
}

export type Session = typeof authClient.$Infer.Session
export interface NavItem {
	title: string
	url: string
	icon?: LucideIcon
	isActive?: boolean
	context: ('global' | 'org')[]
	role: PlatformRole[]
	items?: NavItem[]
}
export interface BreadcrumbSegment {
	text: string
	href: string
}
export interface BreadcrumbConfig {
	pathname: string
	segments: BreadcrumbSegment[]
}

interface SuccessResponse<T> {
	success: true
	data: T
}

interface ErrorResponse {
	success: false
	error: string
}

export type DataResponse<T> = SuccessResponse<T> | ErrorResponse
export type SelectOption = { label: string; value: string }
export type PrimitiveOption = string | number
export type FlatNode<T> = Omit<T, 'children'> & {
	parentId: string | null
	depth: number
}
export type TreeNode<T> = T & {
	children?: TreeNode<T>[]
}
