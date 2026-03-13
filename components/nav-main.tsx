'use client'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/constants'
import { NavItem, Session } from '@/interfaces'
import { ChevronRight, CirclePlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { cn } from '@/lib/utils'
import { PlatformRole } from '@/lib/access-control'

export function NavMain({ session, isGlobalWorkspace, isLoading }: { session: Session | null; isGlobalWorkspace: boolean; isLoading: boolean }) {
	const { setOpenMobile } = useSidebar()
	const pathname = usePathname()

	// Helper function to check if a URL is active
	const isActive = (url: string): boolean => {
		if (pathname.includes('add')) {
			const pathnameArray = pathname.split('/')
			pathnameArray.pop()
			const newPathname = pathnameArray.join('/')
			return newPathname === url
		}

		if (pathname.includes('edit')) {
			const pathnameArray = pathname.split('/')
			pathnameArray.splice(4, 2)
			const newPathname = pathnameArray.join('/')
			return newPathname === url
		}

		return pathname === url
	}

	// Helper function to check if any child is active (for parent highlight)
	const hasActiveChild = (items?: Array<{ url: string; items?: NavItem[] }>): boolean => {
		if (!items) return false
		return items.some(item => {
			if (isActive(item.url)) return true
			if (item.items) return hasActiveChild(item.items)
			return false
		})
	}

	if (!isLoading && session) {
		const filteredNavItems = NAV_ITEMS.main.filter(item => {
			const hasRole = item.role.includes(session?.user.role as PlatformRole)
			const hasContext = isGlobalWorkspace ? item.context.includes('global') : item.context.includes('org')

			return hasRole && hasContext
		})

		return (
			<SidebarGroup>
				<SidebarGroupContent className='flex flex-col gap-2'>
					<SidebarMenu>
						<SidebarMenuItem className='flex items-center gap-2'>
							<SidebarMenuButton
								tooltip='Quick Create'
								className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
							>
								<CirclePlusIcon />
								<span>Quick Create</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					<SidebarMenu>
						{filteredNavItems.map(item =>
							item.items ? (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={isActive(item.url)}
								>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
											isActive={isActive(item.url)}
										>
											<Link href={item.url}>
												{item.icon && <item.icon />} <span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className='data-[state=open]:rotate-90'>
												<ChevronRight />
												<span className='sr-only'>Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map(subItem => (
													<Collapsible
														key={subItem.title}
														asChild
														defaultOpen={hasActiveChild(subItem.items)}
													>
														<SidebarMenuSubItem>
															{subItem.items ? (
																<>
																	<SidebarMenuSubButton asChild>
																		<Link
																			href={subItem.url}
																			className={cn('flex w-full items-center justify-between', { 'bg-accent text-accent-foreground': hasActiveChild(subItem.items) })}
																		>
																			{subItem.title}
																		</Link>
																	</SidebarMenuSubButton>
																	<CollapsibleTrigger asChild>
																		<SidebarMenuAction className='data-[state=open]:rotate-90'>
																			<ChevronRight />
																			<span className='sr-only'>Toggle</span>
																		</SidebarMenuAction>
																	</CollapsibleTrigger>
																	<CollapsibleContent>
																		<SidebarMenuSub className='ml-4'>
																			{subItem.items.map(nestedItem => (
																				<SidebarMenuSubItem key={nestedItem.title}>
																					<SidebarMenuSubButton
																						asChild
																						isActive={isActive(nestedItem.url)}
																					>
																						<Link
																							href={nestedItem.url}
																							onClick={() => setOpenMobile(false)}
																						>
																							<span>{nestedItem.title}</span>
																						</Link>
																					</SidebarMenuSubButton>
																				</SidebarMenuSubItem>
																			))}
																		</SidebarMenuSub>
																	</CollapsibleContent>
																</>
															) : (
																<SidebarMenuButton
																	tooltip={item.title}
																	asChild
																	isActive={isActive(subItem.url)}
																>
																	<Link
																		href={subItem.url}
																		onClick={() => setOpenMobile(false)}
																	>
																		{item.icon && <item.icon />} <span>{item.title}</span>
																	</Link>
																</SidebarMenuButton>
															)}
														</SidebarMenuSubItem>
													</Collapsible>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										tooltip={item.title}
										asChild
										isActive={isActive(item.url)}
									>
										<Link
											href={item.url}
											onClick={() => setOpenMobile(false)}
										>
											{item.icon && <item.icon />} <span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							),
						)}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		)
	}
}
