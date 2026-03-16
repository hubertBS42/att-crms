'use client'

import * as React from 'react'

import { NavUserSkeleton } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import dynamic from 'next/dynamic'
import { OrganizationSwitcherSkeleton } from '@/components/organization-switcher'
import { NavMainSkeleton } from '@/components/nav-main'
import { NavSecondarySkeleton } from '@/components/nav-secondary'

const NavUser = dynamic(() => import('@/components/nav-user'), { ssr: false, loading: () => <NavUserSkeleton /> })
const NavMain = dynamic(() => import('@/components/nav-main'), { ssr: false, loading: () => <NavMainSkeleton /> })
const NavSecondary = dynamic(() => import('@/components/nav-secondary'), { ssr: false, loading: () => <NavSecondarySkeleton /> })
const OrganizationSwitcher = dynamic(() => import('@/components/organization-switcher'), { ssr: false, loading: () => <OrganizationSwitcherSkeleton /> })

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible='offcanvas'
			{...props}
		>
			<SidebarHeader>
				<OrganizationSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<NavSecondary />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
