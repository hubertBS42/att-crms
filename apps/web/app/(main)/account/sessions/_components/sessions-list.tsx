'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { revokeSessionAction } from '@/lib/actions/account.actions'
import { formatDistanceToNow } from 'date-fns'
import { MonitorIcon, SmartphoneIcon, GlobeIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Session } from 'better-auth'

interface SessionsListProps {
	sessions: Session[]
	currentSessionId: string
}

const getDeviceIcon = (userAgent?: string | null) => {
	if (!userAgent) return GlobeIcon
	if (/mobile|android|iphone/i.test(userAgent)) return SmartphoneIcon
	return MonitorIcon
}

const getDeviceLabel = (userAgent?: string | null) => {
	if (!userAgent) return 'Unknown device'
	if (/mobile|android|iphone/i.test(userAgent)) return 'Mobile device'
	if (/windows/i.test(userAgent)) return 'Windows PC'
	if (/mac/i.test(userAgent)) return 'Mac'
	if (/linux/i.test(userAgent)) return 'Linux'
	return 'Desktop'
}

const SessionItem = ({ session, currentSessionId }: { session: Session; currentSessionId: string }) => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const isCurrent = session.id === currentSessionId
	const Icon = getDeviceIcon(session.userAgent)

	const handleRevoke = () => {
		startTransition(async () => {
			const result = await revokeSessionAction(session.token)
			if (!result.success) {
				toast.error('Failed to revoke session', { description: result.error })
				return
			}
			toast.success('Session revoked')
			router.refresh()
		})
	}

	return (
		<div className='flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0'>
			<div className='flex items-center gap-3'>
				<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
					<Icon className='size-5 text-muted-foreground' />
				</div>
				<div className='grid gap-0.5'>
					<div className='flex items-center gap-2'>
						<p className='text-sm font-medium'>{getDeviceLabel(session.userAgent)}</p>
						{isCurrent && (
							<Badge
								variant='outline'
								className='text-xs'
							>
								Current
							</Badge>
						)}
					</div>
					<p className='text-xs text-muted-foreground'>
						{session.ipAddress ?? 'Unknown IP'} · Active {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
					</p>
				</div>
			</div>
			{!isCurrent && (
				<Button
					variant='outline'
					size='sm'
					disabled={isPending}
					onClick={handleRevoke}
				>
					{isPending ? <Spinner /> : 'Revoke'}
				</Button>
			)}
		</div>
	)
}

const SessionsList = ({ sessions, currentSessionId }: SessionsListProps) => {
	return (
		<div className='flex flex-col divide-y'>
			{sessions.map(session => (
				<SessionItem
					key={session.id}
					session={session}
					currentSessionId={currentSessionId}
				/>
			))}
		</div>
	)
}

export default SessionsList
