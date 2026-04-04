'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
	{ href: '/settings', label: 'Overview' },
	{ href: '/settings/logs', label: 'Logs' },
]

const SettingsNav = () => {
	const pathname = usePathname()

	return (
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
	)
}

export default SettingsNav
