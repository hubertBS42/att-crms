import { Metadata } from 'next'
import { fetchLogs } from '@/lib/data/logs.data'
import LogsTable from '../_components/logs-table'
import { LogsFilters } from '@/interfaces'
import { ActivityResource, ActivityType } from '@att-crms/db/enums'

export const metadata: Metadata = {
	title: 'Activity Logs',
}

type LogsPageProps = {
	searchParams: Promise<{
		target?: string
		actorName?: string
		type?: string
		resource?: string
		createdAtStart?: string
		createdAtEnd?: string
		page?: string
		pageSize?: string
		sort?: string
		order?: string
	}>
}

const LogsPage = async ({ searchParams }: LogsPageProps) => {
	const params = await searchParams

	const filters: LogsFilters = {
		target: params.target,
		actorName: params.actorName,
		type: params.type ? (params.type as ActivityType) : undefined,
		resource: params.resource ? (params.resource as ActivityResource) : undefined,
		startDate: params.createdAtStart ? new Date(params.createdAtStart) : undefined,
		endDate: params.createdAtEnd ? new Date(params.createdAtEnd) : undefined,
		page: params.page ? parseInt(params.page) : 1,
		pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
		sort: params.sort,
		order: params.order as 'asc' | 'desc' | undefined,
	}

	const result = await fetchLogs(filters)
	if (!result.success) throw new Error(result.error)

	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Activity Logs</h1>
				<p className='text-muted-foreground text-sm'>Full audit trail of all platform activity.</p>
			</div>

			<LogsTable data={result.data} />
		</main>
	)
}

export default LogsPage
