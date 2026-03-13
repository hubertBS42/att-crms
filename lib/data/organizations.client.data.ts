import { DataResponse } from '@/interfaces'
import { Organization } from '@/lib/generated/prisma/client'
import { formatError } from '../utils'

export const fetchOrganizations = async (): Promise<DataResponse<Organization[]>> => {
	try {
		const response = await fetch('/api/organizations')

		if (!response.ok) {
			return { success: false, error: 'Failed to fetch organizations' }
		}

		const data: Organization[] = await response.json()
		return { success: true, data }
	} catch (error) {
		return { success: false, error: formatError(error) }
	}
}
