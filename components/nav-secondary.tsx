'use client'

import { PlatformRole } from '@/lib/access-control'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/constants'
import { Session } from '@/interfaces'
import Link from 'next/link'

export function NavSecondary({ session, isGlobalWorkspace, isLoading }: { session: Session | null; isGlobalWorkspace: boolean; isLoading: boolean }) {
	if (!isLoading && session) {
		const filteredNavItems = NAV_ITEMS.secondary.filter(item => {
			const hasRole = item.role.includes(session?.user.role as PlatformRole)
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
}
