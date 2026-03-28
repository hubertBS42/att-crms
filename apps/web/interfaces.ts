import { Invitation, Member, Organization, Session, User } from '@att-crms/db/client'
import { type LucideIcon } from 'lucide-react'

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

export type FlatNode<T> = Omit<T, 'children'> & {
	parentId: string | null
	depth: number
}
export type TreeNode<T> = T & {
	children?: TreeNode<T>[]
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

export type UserWithSessions = User & { sessions: Session[] }
export type MemberWithUser = Member & { user: User }
export type MemberWithUserWithSessions = Member & { user: UserWithSessions }
export type UserWithSessionsAndMemberships = User & {
	sessions: Session[]
	members: (Member & { organization: Organization })[]
}

export interface BreadcrumbSegment {
	text: string
	href: string
}
export interface BreadcrumbConfig {
	pathname: string
	segments: BreadcrumbSegment[]
}

export interface OrgRecordingsOverTimeData {
	date: string
	count: number
}

export interface GlobalRecordingsOverTimeData {
	chartData: { date: string; [orgSlug: string]: number | string }[]
	organizations: { slug: string; name: string }[]
}

export type InvitationWithUser = Invitation & { user: User }
