import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const RecentActivitiesSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-5 w-32' />
				<Skeleton className='h-4 w-48 mt-1' />
			</CardHeader>
			<CardContent className='h-full'>
				<div className='flex flex-col divide-y h-62.5'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='flex items-start gap-3 py-3 first:pt-0 last:pb-0'
						>
							<Skeleton className='mt-0.5 size-8 shrink-0 rounded-full' />
							<div className='grid gap-1.5 w-full'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-3 w-1/4' />
								<Skeleton className='h-3 w-1/3' />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

export default RecentActivitiesSkeleton
