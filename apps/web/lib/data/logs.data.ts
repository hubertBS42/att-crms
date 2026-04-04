'server-only'

import { auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '@att-crms/db'
import { formatError } from '../utils'
import { ActivityResource, ActivityType, Activity } from '@att-crms/db/client'
import { DataResponse } from '@/interfaces'

export interface LogsFilters {
	actorName?: string
	type?: ActivityType
	resource?: ActivityResource
	startDate?: Date
	endDate?: Date
	page?: number
	pageSize?: number
	organizationId?: string | null
}

export interface LogsData {
	activities: Activity[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export const fetchLogs = async (organizationId?: string | null): Promise<DataResponse<{ activities: Activity[] }>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activities = await prisma.activity.findMany({
			where: {
				...(organizationId !== undefined && { organizationId }),
			},
		})

		return { success: true, data: { activities } }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
