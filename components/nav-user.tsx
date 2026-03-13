'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { abbreviateName } from '@/lib/utils'
import { Session } from '@/interfaces'

export const NavUserSkeleton = () => {
	return <Skeleton className='h-12 w-full rounded-lg' />
}

const NavUser = ({ session, isLoading }: { session: Session | null; isLoading: boolean }) => {
	const { isMobile } = useSidebar()

	const router = useRouter()

	if (!isLoading && session) {
		const { user } = session
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={user.image || ''}
										alt={user.name}
									/>
									<AvatarFallback className='rounded-lg'>{abbreviateName(user.name)}</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>{user.name}</span>
									<span className='truncate text-xs text-muted-foreground'>{user.email}</span>
								</div>
								<EllipsisVerticalIcon className='ml-auto size-4' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
							side={isMobile ? 'bottom' : 'right'}
							align='end'
							sideOffset={4}
						>
							<DropdownMenuLabel className='p-0 font-normal'>
								<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
									<Avatar className='h-8 w-8 rounded-lg'>
										<AvatarImage
											src={user.image || ''}
											alt={user.name}
										/>
										<AvatarFallback className='rounded-lg'>{abbreviateName(user.name)}</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-medium'>{user.name}</span>
										<span className='truncate text-xs text-muted-foreground'>{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<CircleUserRoundIcon />
									Account
								</DropdownMenuItem>
								<DropdownMenuItem>
									<CreditCardIcon />
									Billing
								</DropdownMenuItem>
								<DropdownMenuItem>
									<BellIcon />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={async () => await authClient.signOut({ fetchOptions: { onSuccess: () => router.push('/') } })}>
								<LogOutIcon />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}
}

export default NavUser
