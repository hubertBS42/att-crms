// hooks/use-nav-items.ts
import { NavItem } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import { routePermissions } from '@/lib/permissions/route-permissions'
import { SystemLevelRole } from '@/lib/permissions/system-permissions'

const getNavItems = (role: SystemLevelRole, isGlobalWorkspace: boolean): Record<string, NavItem[]> => {
	const currentContext = isGlobalWorkspace ? 'global' : 'org'

	return (
		Object.entries(routePermissions)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, permission]) => {
				if (!permission.nav) return false
				const hasRole = permission.role.includes(role)
				const hasContext = permission.context.includes(currentContext)
				return hasRole && hasContext
			})
			.map(([url, permission]) => ({
				url,
				...permission.nav!,
				items: permission.nav?.items?.filter(item => !item.context || item.context.includes(currentContext)),
			}))
			.sort((a, b) => a.order - b.order)
			.reduce(
				(acc, item) => {
					if (!acc[item.group]) acc[item.group] = []
					acc[item.group].push(item)
					return acc
				},
				{} as Record<string, NavItem[]>,
			)
	)
}

interface UseNavItemsReturn {
	navItems: Record<string, NavItem[]>
	isGlobalWorkspace: boolean
	isAdmin: boolean
	isLoading: boolean
}

export const useNavItems = (): UseNavItemsReturn => {
	const { data: session, isPending: isSessionLoading } = authClient.useSession()
	const { data: activeOrganization, isPending: isActiveOrganizationLoading } = authClient.useActiveOrganization()

	const isLoading = isSessionLoading || isActiveOrganizationLoading

	if (isLoading || !session || !activeOrganization) {
		return {
			navItems: {},
			isGlobalWorkspace: false,
			isAdmin: false,
			isLoading: true,
		}
	}

	const isGlobalWorkspace = activeOrganization.slug === 'global'
	const isAdmin = session.user.role === 'admin' || session.user.role === 'superAdmin'
	const navItems = getNavItems(session.user.role as SystemLevelRole, isGlobalWorkspace)

	return {
		navItems,
		isGlobalWorkspace,
		isAdmin,
		isLoading: false,
	}
}
