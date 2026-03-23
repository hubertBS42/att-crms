import Loader from '@/components/loader'
import { fetchOrganizationRecordings } from '@/lib/data/recordings.data'
import { Metadata } from 'next'
import { Suspense } from 'react'
import RecordingsTable from './_components/recordings-table'
import RefreshButton from '@/components/refresh-button'

export const metadata: Metadata = {
	title: 'Manage recordings',
}
const RecordingsPage = () => {
	const data = fetchOrganizationRecordings()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage recordings</h1>
					<p className='text-muted-foreground text-sm'>View and manage all recordings.</p>
				</div>

				<RefreshButton />
			</div>
			<Suspense fallback={<Loader />}>
				<RecordingsTable data={data} />
			</Suspense>
		</main>
	)
}

export default RecordingsPage
