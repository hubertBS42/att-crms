import { Metadata } from 'next'
import { fetchLogs } from '@/lib/data/logs.data'
import LogsTable from '../../logs/_components/logs-table'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const metadata: Metadata = {
	title: 'Activity Logs',
}

const OrgLogsPage = async () => {
	const session = await auth.api.getSession({ headers: await headers() })
	const activeOrganizationId = session?.session.activeOrganizationId

	const result = await fetchLogs(activeOrganizationId)
	if (!result.success) throw new Error(result.error)

	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Activity Logs</h1>
				<p className='text-muted-foreground text-sm'>Audit trail of all activity in this organization.</p>
			</div>
			<LogsTable logs={result.data.activities} />
		</main>
	)
}

export default OrgLogsPage
