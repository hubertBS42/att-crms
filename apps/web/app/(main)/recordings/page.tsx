import { fetchOrganizationRecordings } from '@/lib/data/recordings.data'
import { Metadata } from 'next'
import RecordingsTable from './_components/recordings-table'
import { RecordingsFilters } from '@/interfaces'

export const metadata: Metadata = {
	title: 'Manage Recordings',
}

type RecordingsPageProps = {
	searchParams: Promise<{
		caller?: string
		calledNumber?: string
		answeredBy?: string
		callDateStart?: string
		callDateEnd?: string
		pageSize?: string
		page?: string
		sort?: string
		order?: string
	}>
}
const RecordingsPage = async ({ searchParams }: RecordingsPageProps) => {
	const params = await searchParams

	const filters: RecordingsFilters = {
		page: params.page ? parseInt(params.page) : 1,
		pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
		caller: params.caller,
		calledNumber: params.calledNumber,
		answeredBy: params.answeredBy,
		startDate: params.callDateStart ? new Date(params.callDateStart) : undefined,
		endDate: params.callDateEnd ? new Date(params.callDateEnd) : undefined,
		sort: params.sort,
		order: params.order as 'asc' | 'desc' | undefined,
	}

	const result = await fetchOrganizationRecordings(filters)
	if (!result.success) throw new Error(result.error)
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Manage Recordings</h1>
				<p className='text-muted-foreground text-sm'>View and manage all recordings.</p>
			</div>

			<RecordingsTable data={result.data} />
		</main>
	)
}

export default RecordingsPage
