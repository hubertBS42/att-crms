import { formatDistanceToNow } from 'date-fns'
import { BuildingIcon, Clock, MicIcon, UserIcon, MailIcon, UserMinusIcon, UserPlusIcon, ShieldAlertIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ActivityResource, ActivityType } from '@att-crms/db/client'
import { fetchRecentActivities } from '@/lib/data/dashboard.data'

interface ActivityConfigEntry {
	icon: React.ElementType
	color: string
	label: (a: Activity) => string
}

type ActivityKey = `${ActivityType}_${ActivityResource}`

const activityConfig: Partial<Record<ActivityKey, ActivityConfigEntry>> = {
	CREATE_RECORDING: {
		icon: MicIcon,
		color: 'text-blue-500 bg-blue-500/10',
		label: a => `New recording indexed${a.organizationName ? ` for ${a.organizationName}` : ''}`,
	},
	DELETE_RECORDING: {
		icon: MicIcon,
		color: 'text-red-500 bg-red-500/10',
		label: a => `Recording ${a.targetName} was deleted${a.organizationName ? ` from ${a.organizationName}` : ''}`,
	},
	CREATE_ORGANIZATION: {
		icon: BuildingIcon,
		color: 'text-green-500 bg-green-500/10',
		label: a => `${a.targetName ?? 'Organization'} was created`,
	},
	UPDATE_ORGANIZATION: {
		icon: BuildingIcon,
		color: 'text-blue-500 bg-blue-500/10',
		label: a => `${a.targetName ?? 'Organization'} was updated`,
	},
	DELETE_ORGANIZATION: {
		icon: BuildingIcon,
		color: 'text-red-500 bg-red-500/10',
		label: a => `${a.targetName ?? 'Organization'} was deleted`,
	},
	CREATE_USER: {
		icon: UserIcon,
		color: 'text-emerald-500 bg-emerald-500/10',
		label: a => {
			const metadata = a.metadata as { action?: string } | null
			if (metadata?.action === 'self_signup') return `${a.targetName ?? 'User'} signed up`
			return `${a.targetName ?? 'User'} was created`
		},
	},
	UPDATE_USER: {
		icon: UserIcon,
		color: 'text-blue-500 bg-blue-500/10',
		label: a => {
			const metadata = a.metadata as { action?: string; reason?: string } | null
			if (metadata?.action === 'ban') return `${a.targetName ?? 'User'} was banned${metadata.reason ? `: ${metadata.reason}` : ''}`
			if (metadata?.action === 'unban') return `${a.targetName ?? 'User'} was unbanned`
			if (metadata?.action === 'profile_updated') return `${a.targetName ?? 'User'} updated their profile`
			return `${a.targetName ?? 'User'} was updated`
		},
	},
	DELETE_USER: {
		icon: UserIcon,
		color: 'text-red-500 bg-red-500/10',
		label: a => `${a.targetName ?? 'User'} was deleted`,
	},
	ALERT_USER: {
		icon: ShieldAlertIcon,
		color: 'text-yellow-500 bg-yellow-500/10',
		label: a => {
			const metadata = a.metadata as { action?: string } | null
			if (metadata?.action === 'self_requested_password_reset') return `${a.targetName ?? 'User'} requested a password reset`
			if (metadata?.action === 'admin_requested_password_reset') return `Password reset requested for ${a.targetName ?? 'user'}`
			if (metadata?.action === 'password_changed') return `${a.targetName ?? 'User'} changed their password`
			return `Alert for ${a.targetName ?? 'user'}`
		},
	},
	CREATE_MEMBER: {
		icon: UserPlusIcon,
		color: 'text-emerald-500 bg-emerald-500/10',
		label: a => `${a.targetName ?? 'User'} was added to ${a.organizationName ?? 'organization'}`,
	},
	UPDATE_MEMBER: {
		icon: UserIcon,
		color: 'text-blue-500 bg-blue-500/10',
		label: a => {
			const metadata = a.metadata as { role?: string } | null
			return `${a.targetName ?? 'User'}'s role${a.organizationName ? ` in ${a.organizationName}` : ''} was updated${metadata?.role ? ` to ${metadata.role}` : ''}`
		},
	},
	DELETE_MEMBER: {
		icon: UserMinusIcon,
		color: 'text-red-500 bg-red-500/10',
		label: a => {
			const metadata = a.metadata as { action?: string } | null
			if (metadata?.action === 'leave_organization') {
				return `${a.actorName ?? 'Someone'} left ${a.organizationName ?? 'organization'}`
			}
			return `${a.targetName ?? 'User'} was removed from ${a.organizationName ?? 'organization'}`
		},
	},
	CREATE_INVITATION: {
		icon: MailIcon,
		color: 'text-violet-500 bg-violet-500/10',
		label: a => `${a.targetName ?? 'Someone'} was invited to ${a.organizationName ?? 'organization'}`,
	},
	UPDATE_INVITATION: {
		icon: MailIcon,
		color: 'text-blue-500 bg-blue-500/10',
		label: a => {
			const metadata = a.metadata as { action?: string } | null
			if (metadata?.action === 'invitation_accepted') return `${a.actorName ?? 'Someone'} accepted an invitation to ${a.organizationName ?? 'organization'}`
			if (metadata?.action === 'invitation_rejected') return `${a.actorName ?? 'Someone'} rejected an invitation to ${a.organizationName ?? 'organization'}`
			if (metadata?.action === 'invitation_resent') return `Invitation resent to ${a.targetName ?? 'someone'}`
			return `Invitation updated`
		},
	},
	DELETE_INVITATION: {
		icon: MailIcon,
		color: 'text-red-500 bg-red-500/10',
		label: a => `Invitation to ${a.targetName ?? 'someone'} was cancelled`,
	},
}

const getFallbackConfig = (type: ActivityType): ActivityConfigEntry => ({
	icon: Clock,
	color: 'text-muted-foreground bg-muted',
	label: a => `${type} ${a.resource}${a.targetName ? ` — ${a.targetName}` : ''}`,
})

const RecentActivities = async () => {
	const result = await fetchRecentActivities()
	if (!result.success) return null

	const activities = result.data

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest actions across the platform</CardDescription>
			</CardHeader>
			<CardContent className='h-full'>
				{activities.length === 0 ? (
					<div className='grid h-full items-center'>
						<div className='grid gap-2 text-center text-sm text-muted-foreground'>
							<Clock className='mx-auto size-20' />
							<span>No recent activity</span>
						</div>
					</div>
				) : (
					<div className='flex flex-col divide-y h-62.5 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground'>
						{activities.map(activity => {
							const key = `${activity.type}_${activity.resource}` as ActivityKey
							const config = activityConfig[key] ?? getFallbackConfig(activity.type)
							const Icon = config.icon

							return (
								<div
									key={activity.id}
									className='flex items-start gap-3 py-3 first:pt-0 last:pb-0'
								>
									<div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${config.color}`}>
										<Icon className='size-4' />
									</div>
									<div className='grid gap-0.5 min-w-0'>
										<p className='text-sm font-medium leading-snug'>{config.label(activity)}</p>
										{activity.actorName && <p className='text-xs text-muted-foreground'>by {activity.actorName}</p>}
										<p className='text-xs text-muted-foreground'>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</p>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default RecentActivities
