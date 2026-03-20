import { Member, Prisma, Session, User } from '@/lib/generated/prisma/client'
import { authClient } from './lib/auth-client'
import { type LucideIcon } from 'lucide-react'
import { Organization } from 'better-auth/plugins'

export type ParsedRecording = Omit<Prisma.RecordingCreateInput, 'organization'> & {
	organizationSlug: string
}

export type BetterAuthSession = typeof authClient.$Infer.Session

export interface NavSubItem {
	title: string
	url: string
	icon?: LucideIcon
	context?: ('global' | 'org')[]
	items?: NavSubItem[]
}

export interface NavItem {
	title: string
	url: string
	icon: LucideIcon
	group: 'main' | 'secondary'
	order: number
	items?: NavSubItem[]
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

export type UserWithSessions = User & { sessions: Session[] }
export type MemberWithUser = Member & { user: User }
export type MemberWithUserWithSessions = Member & { user: UserWithSessions }
export type UserWithSessionsAndMemberships = User & {
	sessions: Session[]
	members: (Member & { organization: Organization })[]
}
