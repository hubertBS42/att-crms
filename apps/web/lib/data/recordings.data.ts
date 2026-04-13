'server-only'

import { headers } from 'next/headers'
import { auth } from '../auth'
import { formatError } from '../utils'
import { DataResponse, RecordingsData, RecordingsFilters } from '@/interfaces'
import { prisma } from '@att-crms/db'

export const fetchOrganizationRecordings = async (filters: RecordingsFilters = {}): Promise<DataResponse<RecordingsData>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const { caller, calledNumber, answeredBy, startDate, endDate, page = 1, pageSize = 10, sort, order } = filters

		const where = {
			organization: { id: activeOrganizationId },
			...(caller && { caller: { contains: caller, mode: 'insensitive' as const } }),
			...(calledNumber && { calledNumber: { contains: calledNumber, mode: 'insensitive' as const } }),
			...(answeredBy && { answeredBy: { contains: answeredBy, mode: 'insensitive' as const } }),
			...(startDate || endDate
				? {
						datetime: {
							...(startDate && { gte: startDate }),
							...(endDate && { lte: endDate }),
						},
					}
				: {}),
		}

		const orderBy = sort ? { [sort]: order ?? 'asc' } : { datetime: 'desc' as const }

		const [recordings, total] = await Promise.all([
			prisma.recording.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.recording.count({ where }),
		])

		return {
			success: true,
			data: {
				recordings,
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
