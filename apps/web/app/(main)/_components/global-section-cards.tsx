import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, HardDriveIcon, UsersIcon } from 'lucide-react'
import { formatSize } from '@/lib/utils'
import { fetchGlobalDashboardData } from '@/lib/data/dashboard.data'

const GlobalSectionCards = async () => {
	const response = await fetchGlobalDashboardData()
	if (!response.success || !response.data) return
	const { totalOrganizations, totalRecordings, totalStorage, totalUsers, organizationsChangePercent, recordingsChangePercent } = response.data
	const orgsTrending = organizationsChangePercent >= 0
	const recordingsTrending = recordingsChangePercent >= 0

	return (
		<div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Organizations</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{totalOrganizations.toLocaleString()}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							{orgsTrending ? <TrendingUpIcon /> : <TrendingDownIcon />}
							{organizationsChangePercent > 0 ? '+' : ''}
							{organizationsChangePercent}%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						{orgsTrending ? 'Growing this month' : 'Down this month'}
						{orgsTrending ? <TrendingUpIcon className='size-4' /> : <TrendingDownIcon className='size-4' />}
					</div>
					<div className='text-muted-foreground'>Compared to last month</div>
				</CardFooter>
			</Card>

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
						{recordingsTrending ? 'Up from last month' : 'Down from last month'}
						{recordingsTrending ? <TrendingUpIcon className='size-4' /> : <TrendingDownIcon className='size-4' />}
					</div>
					<div className='text-muted-foreground'>Across all organizations</div>
				</CardFooter>
			</Card>

			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Storage</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{formatSize(totalStorage)}</CardTitle>
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
					<div className='text-muted-foreground'>Across all organizations</div>
				</CardFooter>
			</Card>

			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Users</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{totalUsers.toLocaleString()}</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							<UsersIcon />
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Registered users
						<UsersIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>Across all organizations</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default GlobalSectionCards
