import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Organization } from '@/lib/generated/prisma/client'
import { Session } from '@/interfaces'
import { fetchOrganizations } from '@/lib/data/organizations.client.data'

interface UseSidebarReturn {
	session: Session | null
	organizations: Organization[]
	activeOrganization: Organization | null
	isGlobalWorkspace: boolean
	isLoading: boolean
}

export function useSidebarData(): UseSidebarReturn {
	const { data: session, isPending: isSessionLoading } = authClient.useSession()

	const [organizations, setOrganizations] = useState<Organization[]>([])
	const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null)
	const [isOrgsLoading, setIsOrgsLoading] = useState(true)

	useEffect(() => {
		const fetchOrgs = async () => {
			try {
				const result = await fetchOrganizations()
				if (result.success) {
					const filteredOrg = result.data.find(org => org.id === session?.session.activeOrganizationId)
					setOrganizations(result.data)
					setActiveOrganization(filteredOrg ?? null)
				}
			} catch (error) {
				console.error('Failed to fetch organizations:', error)
			} finally {
				setIsOrgsLoading(false)
			}
		}

		if (session) fetchOrgs()
	}, [session])

	return {
		session,
		organizations,
		activeOrganization,
		isGlobalWorkspace: activeOrganization?.slug === 'global',
		isLoading: isSessionLoading || isOrgsLoading,
	}
}
