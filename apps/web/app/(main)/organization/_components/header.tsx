'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
	{ href: '/organization', label: 'Overview' },
	{ href: '/organization/members', label: 'Members' },
	{ href: '/organization/invitations', label: 'Invitations' },
	{ href: '/organization/logs', label: 'Logs' },
]

const Header = () => {
	const pathname = usePathname()
	const { data: activeOrganization, isPending } = authClient.useActiveOrganization()
	return (
		<div className='grid gap-y-6'>
			<div className='grid'>
				{isPending ? <Skeleton className='h-7 w-48 md:h-8 md:w-80' /> : <h1 className='text-xl md:text-2xl font-bold'>{activeOrganization?.name}</h1>}
				<p className='text-muted-foreground text-sm'>Manage this organization</p>
			</div>
			<nav className='flex gap-1 border-b'>
				{links.map(link => {
					const isActive = pathname === link.href
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								'px-3 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors',
								isActive ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
							)}
						>
							{link.label}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
export default Header
