import { Metadata } from 'next'
import { fetchLogs } from '@/lib/data/logs.data'
import LogsTable from './_components/logs-table'
import { Suspense } from 'react'
import Loader from '@/components/loader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Activity Logs',
}

const LogsPage = async () => {
	const result = await fetchLogs()
	if (!result.success) throw new Error(result.error)

	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Activity Logs</h1>
				<p className='text-muted-foreground text-sm'>Full audit trail of all platform activity.</p>
			</div>
			<Suspense fallback={<Loader />}>
				<LogsTable logs={result.data.activities} />
			</Suspense>
		</main>
	)
}

export default LogsPage
