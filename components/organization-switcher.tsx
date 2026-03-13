'use client'

import { ChevronsUpDown, Plus } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Organization } from '@/lib/generated/prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { abbreviateName, capitalizeFirstLetter } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import { Session } from '@/interfaces'
import { useOrganizationSwitcher } from '@/hooks/use-org-switch'

export const OrganizationSwitcherSkeleton = () => {
	return <Skeleton className='h-12 w-full rounded-lg' />
}

const OrganizationSwitcher = ({
	organizations,
	activeOrganization,
	isLoading,
	session,
}: {
	organizations: Organization[]
	activeOrganization: Organization | null
	isLoading: boolean
	session: Session | null
}) => {
	const { isMobile } = useSidebar()
	const { switchOrganization } = useOrganizationSwitcher()

	if (session && !isLoading && organizations) {
		const isAdmin = session.user.role === 'admin' || session.user.role === 'superadmin'
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border'
							>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={activeOrganization!.logo || ''}
										alt={activeOrganization!.name}
									/>
									<AvatarFallback className='rounded-lg'>{abbreviateName(activeOrganization!.name)}</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>{activeOrganization!.name}</span>
									<span className='truncate text-xs text-muted-foreground'>
										{activeOrganization!.slug === 'global' ? 'Administrator' : capitalizeFirstLetter(activeOrganization!.plan)}
									</span>
								</div>
								<ChevronsUpDown className='ml-auto size-4' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
							align='start'
							side={isMobile ? 'bottom' : 'right'}
							sideOffset={4}
						>
							<DropdownMenuLabel className='text-xs text-muted-foreground'>Organizations</DropdownMenuLabel>
							{isAdmin && (
								<DropdownMenuCheckboxItem
									className='gap-2 px-1 py-1.5 text-sm'
									onClick={() => switchOrganization({ organizationSlug: 'global' })}
									checked={activeOrganization!.slug === 'global'}
								>
									<Avatar className='h-8 w-8 rounded-lg'>
										<AvatarImage
											src={''}
											alt={'Global'}
										/>
										<AvatarFallback className='rounded-lg'>{abbreviateName('Global')}</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-medium'>{'Global'}</span>
										<span className='truncate text-xs text-muted-foreground'>Administrator</span>
									</div>
								</DropdownMenuCheckboxItem>
							)}

							{organizations.map((organization, index) => {
								if (organization.slug !== 'global') {
									return (
										<DropdownMenuCheckboxItem
											key={index}
											className='gap-2 px-1 py-1.5 text-sm'
											onClick={() => switchOrganization({ organizationId: organization.id })}
											checked={organization.id === activeOrganization?.id}
										>
											<Avatar className='h-8 w-8 rounded-lg'>
												<AvatarImage
													src={organization.logo || ''}
													alt={organization.name}
												/>
												<AvatarFallback className='rounded-lg'>{abbreviateName(organization.name)}</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-medium'>{organization.name}</span>
												<span className='truncate text-xs text-muted-foreground'>{capitalizeFirstLetter(organization.plan)}</span>
											</div>
										</DropdownMenuCheckboxItem>
									)
								}
							})}

							{isAdmin && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem className='gap-2 p-2'>
										<div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
											<Plus className='size-4' />
										</div>
										<div className='font-medium text-muted-foreground'>Add organization</div>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}
}

export default OrganizationSwitcher
