import { Activity, ActivityResource, ActivityType, Invitation, Member, Organization, Recording, Session, User } from '@att-crms/db/client'
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

export interface RecordingsFilters {
	caller?: string
	calledNumber?: string
	answeredBy?: string
	startDate?: Date
	endDate?: Date
	page?: number
	pageSize?: number
	sort?: string
	order?: string
}

export interface RecordingsData {
	recordings: Recording[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export interface LogsFilters {
	target?: string
	actorName?: string
	type?: ActivityType
	resource?: ActivityResource
	startDate?: Date
	endDate?: Date
	page?: number
	pageSize?: number
	organizationId?: string | null
	sort?: string
	order?: string
}

export interface LogsData {
	activities: Activity[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export interface OrganizationsFilters {
	name?: string
	page?: number
	pageSize?: number
	sort?: string
	order?: string
}

export interface OrganizationsData {
	organizations: Organization[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}
export interface UsersFilters {
	name?: string
	page?: number
	pageSize?: number
	sort?: string
	order?: string
}

export interface UsersData {
	users: User[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}
export interface InvitationsFilters {
	email?: string
	page?: number
	pageSize?: number
	sort?: string
	order?: string
}

export interface InvitationsData {
	invitations: InvitationWithUser[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}
export interface MembersFilters {
	name?: string
	page?: number
	pageSize?: number
	sort?: string
	order?: string
}

export interface MembersData {
	members: MemberWithUser[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}
