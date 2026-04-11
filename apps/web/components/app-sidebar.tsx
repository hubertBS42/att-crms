'use client'

import { NavUserSkeleton } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import dynamic from 'next/dynamic'
import { OrganizationSwitcherSkeleton } from '@/components/organization-switcher'
import { NavMainSkeleton } from '@/components/nav'
import { ComponentProps } from 'react'

const NavUser = dynamic(() => import('@/components/nav-user'), { ssr: false, loading: () => <NavUserSkeleton /> })
const Nav = dynamic(() => import('@/components/nav'), { ssr: false, loading: () => <NavMainSkeleton /> })
const OrganizationSwitcher = dynamic(() => import('@/components/organization-switcher'), { ssr: false, loading: () => <OrganizationSwitcherSkeleton /> })

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible='offcanvas'
			{...props}
		>
			<SidebarHeader>
				<OrganizationSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<Nav />
				{/* <NavSecondary /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
