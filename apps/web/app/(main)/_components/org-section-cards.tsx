import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, HardDriveIcon, UsersIcon } from 'lucide-react'
import { formatDuration, formatSize } from '@/lib/utils'
import { fetchOrgDashboardData } from '@/lib/data/dashboard.data'

const OrgSectionCards = async () => {
	const result = await fetchOrgDashboardData()
	if (!result.success || !result.data) return
	const { durationChangePercent, recordingsChangePercent, totalDuration, totalMembers, totalRecordings, totalSize } = result.data
	const recordingsTrending = recordingsChangePercent >= 0
	const durationTrending = durationChangePercent >= 0

	return (
		<div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Recordings</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{totalRecordings.toLocaleString()}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							{recordingsTrending ? <TrendingUpIcon /> : <TrendingDownIcon />}
							{recordingsChangePercent > 0 ? '+' : ''}
							{recordingsChangePercent}%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						{recordingsTrending ? 'Trending up this month' : 'Trending down this month'}
						{recordingsTrending ? <TrendingUpIcon className='size-4' /> : <TrendingDownIcon className='size-4' />}
					</div>
					<div className='text-muted-foreground'>Compared to last month</div>
				</CardFooter>
			</Card>

			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Duration</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{formatDuration(totalDuration, 'human')}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							{durationTrending ? <TrendingUpIcon /> : <TrendingDownIcon />}
							{durationChangePercent > 0 ? '+' : ''}
							{durationChangePercent}%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						{durationTrending ? 'Up from last month' : 'Down from last month'}
						{durationTrending ? <TrendingUpIcon className='size-4' /> : <TrendingDownIcon className='size-4' />}
					</div>
					<div className='text-muted-foreground'>Combined call duration</div>
				</CardFooter>
			</Card>

			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Storage Used</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{formatSize(totalSize)}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							<HardDriveIcon />
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Total storage consumed
						<HardDriveIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>Across all recordings</div>
				</CardFooter>
			</Card>

			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Active Members</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{totalMembers.toLocaleString()}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							<UsersIcon />
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Organization members
						<UsersIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>Currently active</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default OrgSectionCards
