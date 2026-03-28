'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { CirclePlusIcon, Building, UserRound } from 'lucide-react'
import Link from 'next/link'

const QuickCreateButton = () => {
	const { isMobile } = useSidebar()
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							tooltip='Quick Create'
							className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
						>
							<CirclePlusIcon />
							<span>Quick Create</span>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link
									href={'/organizations/add'}
									className='cursor-pointer'
								>
									<Building />
									New organization
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={'/users/add'}
									className='cursor-pointer'
								>
									<UserRound />
									New user
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

export default QuickCreateButton
