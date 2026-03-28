import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const RecordingsChartSkeleton = () => {
	return (
		<Card className='@container/card'>
			<CardHeader className='flex flex-row items-start justify-between'>
				<div className='grid gap-1.5'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-4 w-56' />
				</div>
				<Skeleton className='h-8 w-48 rounded-lg' />
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<div className='h-62.5 w-full flex flex-col justify-end gap-1'>
					{/* Y axis + bars */}
					<div className='flex items-end gap-1 h-full'>
						{/* Y axis labels */}
						<div className='flex flex-col justify-between h-full pb-6 w-8 shrink-0'>
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton
									key={i}
									className='h-3 w-6'
								/>
							))}
						</div>
						{/* Bars */}
						<div className='flex items-end gap-0.5 h-full w-full'>
							{Array.from({ length: 30 }).map((_, i) => (
								<Skeleton
									key={i}
									className='flex-1 rounded-sm'
									style={{
										height: `${Math.max(15, Math.random() * 100)}%`,
									}}
								/>
							))}
						</div>
					</div>
					{/* X axis */}
					<div className='flex justify-between pl-8'>
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								key={i}
								className='h-3 w-10'
							/>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default RecordingsChartSkeleton
