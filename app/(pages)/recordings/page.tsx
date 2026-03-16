import Loader from '@/components/loader'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Manage recordings',
}
const RecordingsPage = () => {
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-start'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage recordings</h1>
					<p className='text-muted-foreground text-sm'>View and manage all recordings.</p>
				</div>
			</div>
			<Suspense fallback={<Loader />}>{/* <UsersTable data={data} /> */}</Suspense>
		</main>
	)
}

export default RecordingsPage
