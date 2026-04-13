import { Metadata } from 'next'
import { fetchLogs } from '@/lib/data/logs.data'
import LogsTable from '../../_components/logs-table'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ActivityResource, ActivityType } from '@att-crms/db/enums'
import { LogsFilters } from '@/interfaces'

export const metadata: Metadata = {
	title: 'Activity Logs',
}

type OrgsLogsPageProps = {
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

const OrgLogsPage = async ({ searchParams }: OrgsLogsPageProps) => {
	const session = await auth.api.getSession({ headers: await headers() })
	const activeOrganizationId = session?.session.activeOrganizationId

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
		organizationId: activeOrganizationId,
	}

	const result = await fetchLogs(filters)
	if (!result.success) throw new Error(result.error)

	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-lg font-bold'>Activity Logs</h1>
				<p className='text-muted-foreground text-sm'>Audit trail of all activity in this organization.</p>
			</div>
			<LogsTable data={result.data} />
		</main>
	)
}

export default OrgLogsPage
