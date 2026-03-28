import { Card, CardAction, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SectionCardsSkeleton = () => {
	return (
		<div className='grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
			{Array.from({ length: 4 }).map((_, i) => (
				<Card
					key={i}
					className='@container/card'
				>
					<CardHeader>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-8 w-32 mt-1' />
						<CardAction>
							<Skeleton className='h-6 w-16 rounded-full' />
						</CardAction>
					</CardHeader>
					<CardFooter className='flex-col items-start gap-1.5'>
						<Skeleton className='h-4 w-40' />
						<Skeleton className='h-3 w-32' />
					</CardFooter>
				</Card>
			))}
		</div>
	)
}

export default SectionCardsSkeleton
