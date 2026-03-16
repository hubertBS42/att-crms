'use client'

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/constants'
import { SystemLevelRole } from '@/lib/permissions/system-permissions'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'
import { authClient } from '@/lib/auth-client'

export function NavSecondarySkeleton() {
	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupContent className='flex flex-col gap-2'>
				<SidebarMenu>
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton
							key={i}
							className='h-8 w-full rounded-lg'
						/>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

const NavSecondary = () => {
	const { data: session, isPending: isSessionLoading } = authClient.useSession()
	const { data: activeOrganization, isPending: isActiveOrganizationLoading } = authClient.useActiveOrganization()

	const isLoading = isSessionLoading || isActiveOrganizationLoading

	if (isLoading || !session || !activeOrganization) return <NavSecondarySkeleton />

	const isGlobalWorkspace = activeOrganization.slug === 'global'

	const filteredNavItems = NAV_ITEMS.secondary.filter(item => {
		const hasRole = item.role.includes(session.user.role as SystemLevelRole)
		const hasContext = isGlobalWorkspace ? item.context.includes('global') : item.context.includes('org')
		return hasRole && hasContext
	})
	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupContent>
				<SidebarMenu>
					{filteredNavItems.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								asChild
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export default NavSecondary
