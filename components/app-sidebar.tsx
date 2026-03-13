'use client'

import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUserSkeleton } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import dynamic from 'next/dynamic'
import { useSidebarData } from '@/hooks/use-sidebar-data'
import { OrganizationSwitcherSkeleton } from '@/components/organization-switcher'

const NavUser = dynamic(() => import('@/components/nav-user'), { ssr: false, loading: () => <NavUserSkeleton /> })
const OrganizationSwitcher = dynamic(() => import('@/components/organization-switcher'), { ssr: false, loading: () => <OrganizationSwitcherSkeleton /> })

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { activeOrganization, isGlobalWorkspace, organizations, isLoading, session } = useSidebarData()
	return (
		<Sidebar
			collapsible='offcanvas'
			{...props}
		>
			<SidebarHeader>
				<OrganizationSwitcher
					organizations={organizations}
					activeOrganization={activeOrganization}
					isLoading={isLoading}
					session={session}
				/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					session={session}
					isGlobalWorkspace={isGlobalWorkspace}
					isLoading={isLoading}
				/>
				<NavSecondary
					session={session}
					isGlobalWorkspace={isGlobalWorkspace}
					isLoading={isLoading}
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					session={session}
					isLoading={isLoading}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
