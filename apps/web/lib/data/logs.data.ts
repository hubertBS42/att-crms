'server-only'

import { auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '@att-crms/db'
import { formatError } from '../utils'
import { DataResponse, LogsData, LogsFilters } from '@/interfaces'

export const fetchLogs = async (filters: LogsFilters = {}): Promise<DataResponse<LogsData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const { target, actorName, type, resource, startDate, endDate, page = 1, pageSize = 10, organizationId, sort, order } = filters

		const where = {
			...(organizationId !== undefined && { organizationId }),
			...(actorName && { actorName: { contains: actorName, mode: 'insensitive' as const } }),
			...(target && { targetName: { contains: target, mode: 'insensitive' as const } }),
			...(type && { type }),
			...(resource && { resource }),
			...(startDate || endDate
				? {
						createdAt: {
							...(startDate && { gte: startDate }),
							...(endDate && { lte: endDate }),
						},
					}
				: {}),
		}

		const orderBy = sort ? { [sort]: order ?? 'asc' } : { createdAt: 'desc' as const }

		const [activities, total] = await Promise.all([
			prisma.activity.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.activity.count({ where }),
		])

		return {
			success: true,
			data: {
				activities,
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		}
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
