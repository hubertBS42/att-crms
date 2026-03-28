'server-only'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { prisma } from '@att-crms/db'
import { formatError } from '../utils'
import { DataResponse, GlobalRecordingsOverTimeData, OrgRecordingsOverTimeData } from '@/interfaces'
import { startOfMonth, subMonths, subDays } from 'date-fns'
import { format } from 'date-fns'
import { Activity } from '@att-crms/db/client'

export const fetchOrgDashboardData = async () => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const now = new Date()
		const thisMonthStart = startOfMonth(now)
		const lastMonthStart = startOfMonth(subMonths(now, 1))

		const [totalRecordings, totalDurationResult, totalSizeResult, totalMembers, thisMonthRecordings, lastMonthRecordings, thisMonthDuration, lastMonthDuration] =
			await Promise.all([
				// Total recordings
				prisma.recording.count({
					where: { organization: { id: activeOrganizationId } },
				}),
				// Total duration
				prisma.recording.aggregate({
					where: { organization: { id: activeOrganizationId } },
					_sum: { duration: true },
				}),
				// Total size
				prisma.recording.aggregate({
					where: { organization: { id: activeOrganizationId } },
					_sum: { size: true },
				}),
				// Total members
				prisma.member.count({
					where: {
						organizationId: activeOrganizationId,
						user: { role: { notIn: ['superAdmin', 'admin'] } },
					},
				}),
				// This month recordings
				prisma.recording.count({
					where: {
						organization: { id: activeOrganizationId },
						datetime: { gte: thisMonthStart },
					},
				}),
				// Last month recordings
				prisma.recording.count({
					where: {
						organization: { id: activeOrganizationId },
						datetime: { gte: lastMonthStart, lt: thisMonthStart },
					},
				}),
				// This month duration
				prisma.recording.aggregate({
					where: {
						organization: { id: activeOrganizationId },
						datetime: { gte: thisMonthStart },
					},
					_sum: { duration: true },
				}),
				// Last month duration
				prisma.recording.aggregate({
					where: {
						organization: { id: activeOrganizationId },
						datetime: { gte: lastMonthStart, lt: thisMonthStart },
					},
					_sum: { duration: true },
				}),
			])

		const calcChange = (current: number, previous: number) => {
			if (previous === 0) return current > 0 ? 100 : 0
			return Math.round(((current - previous) / previous) * 100)
		}

		return {
			success: true,
			data: {
				totalRecordings,
				totalDuration: totalDurationResult._sum.duration ?? 0,
				totalSize: totalSizeResult._sum.size ?? 0,
				totalMembers,
				recordingsChangePercent: calcChange(thisMonthRecordings, lastMonthRecordings),
				durationChangePercent: calcChange(thisMonthDuration._sum.duration ?? 0, lastMonthDuration._sum.duration ?? 0),
			},
		}
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const fetchGlobalDashboardData = async () => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const now = new Date()
		const thisMonthStart = startOfMonth(now)
		const lastMonthStart = startOfMonth(subMonths(now, 1))

		const [totalOrganizations, totalRecordings, totalStorageResult, totalUsers, thisMonthOrgs, lastMonthOrgs, thisMonthRecordings, lastMonthRecordings] = await Promise.all(
			[
				// Total organizations (excluding global)
				prisma.organization.count({
					where: { slug: { not: 'global' } },
				}),
				// Total recordings
				prisma.recording.count(),
				// Total storage
				prisma.recording.aggregate({
					_sum: { size: true },
				}),
				// Total users (excluding platform staff)
				prisma.user.count({
					where: { role: { notIn: ['superAdmin', 'admin'] } },
				}),
				// This month orgs
				prisma.organization.count({
					where: {
						slug: { not: 'global' },
						createdAt: { gte: thisMonthStart },
					},
				}),
				// Last month orgs
				prisma.organization.count({
					where: {
						slug: { not: 'global' },
						createdAt: { gte: lastMonthStart, lt: thisMonthStart },
					},
				}),
				// This month recordings
				prisma.recording.count({
					where: { datetime: { gte: thisMonthStart } },
				}),
				// Last month recordings
				prisma.recording.count({
					where: { datetime: { gte: lastMonthStart, lt: thisMonthStart } },
				}),
			],
		)

		const calcChange = (current: number, previous: number) => {
			if (previous === 0) return current > 0 ? 100 : 0
			return Math.round(((current - previous) / previous) * 100)
		}

		return {
			success: true,
			data: {
				totalOrganizations,
				totalRecordings,
				totalStorage: totalStorageResult._sum.size ?? 0,
				totalUsers,
				organizationsChangePercent: calcChange(thisMonthOrgs, lastMonthOrgs),
				recordingsChangePercent: calcChange(thisMonthRecordings, lastMonthRecordings),
			},
		}
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const fetchOrgRecordingsOverTime = async (): Promise<DataResponse<OrgRecordingsOverTimeData[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const ninetyDaysAgo = subDays(new Date(), 90)

		const recordings = await prisma.recording.findMany({
			where: {
				organization: { id: activeOrganizationId },
				datetime: { gte: ninetyDaysAgo },
			},
			select: { datetime: true },
			orderBy: { datetime: 'asc' },
		})

		// Group by date
		const grouped = recordings.reduce<Record<string, number>>((acc, recording) => {
			const date = format(recording.datetime, 'yyyy-MM-dd')
			acc[date] = (acc[date] ?? 0) + 1
			return acc
		}, {})

		// Fill in missing days with 0
		const result: { date: string; count: number }[] = []
		const today = new Date()

		for (let i = 90; i >= 0; i--) {
			const date = format(subDays(today, i), 'yyyy-MM-dd')
			result.push({ date, count: grouped[date] ?? 0 })
		}

		return { success: true, data: result }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const fetchGlobalRecordingsOverTime = async (): Promise<DataResponse<GlobalRecordingsOverTimeData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const ninetyDaysAgo = subDays(new Date(), 90)

		const [recordings, organizations] = await Promise.all([
			prisma.recording.findMany({
				where: { datetime: { gte: ninetyDaysAgo } },
				select: { datetime: true, organizationSlug: true },
				orderBy: { datetime: 'asc' },
			}),
			prisma.organization.findMany({
				where: { slug: { not: 'global' } },
				select: { slug: true, name: true },
			}),
		])

		// Group by date and org
		const grouped: Record<string, Record<string, number>> = {}
		for (const recording of recordings) {
			const date = format(recording.datetime, 'yyyy-MM-dd')
			if (!grouped[date]) grouped[date] = {}
			grouped[date][recording.organizationSlug] = (grouped[date][recording.organizationSlug] ?? 0) + 1
		}

		// Fill in all days
		const result = []
		const today = new Date()

		for (let i = 90; i >= 0; i--) {
			const date = format(subDays(today, i), 'yyyy-MM-dd')
			const entry: { date: string; [key: string]: number | string } = { date }
			for (const org of organizations) {
				entry[org.slug] = grouped[date]?.[org.slug] ?? 0
			}
			result.push(entry)
		}

		return {
			success: true,
			data: {
				chartData: result,
				organizations,
			},
		}
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}

export const fetchRecentActivities = async (limit = 10): Promise<DataResponse<Activity[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const activeOrg = activeOrganizationId
			? await prisma.organization.findUnique({
					where: { id: activeOrganizationId },
					select: { slug: true },
				})
			: null

		const isGlobal = activeOrg?.slug === 'global'

		const activities = await prisma.activity.findMany({
			where: isGlobal ? undefined : { organizationId: activeOrganizationId },
			orderBy: { createdAt: 'desc' },
			take: limit,
		})

		return { success: true, data: activities }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
