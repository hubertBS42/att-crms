'server-only'

import { headers } from 'next/headers'
import { auth } from '../auth'
import { formatError } from '../utils'
import { DataResponse } from '@/interfaces'
import { prisma } from '@att-crms/db'
import { Recording } from '@att-crms/db/client'

export const fetchOrganizationRecordings = async (): Promise<DataResponse<Recording[]>> => {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session) return { success: false, error: 'Unauthorized' }

		const activeOrganizationId = session.session.activeOrganizationId
		if (!activeOrganizationId) return { success: false, error: 'No active organization' }

		const recordings = await prisma.recording.findMany({
			where: { organizationSlug: { not: undefined }, organization: { id: activeOrganizationId } },
		})

		return { success: true, data: recordings }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
