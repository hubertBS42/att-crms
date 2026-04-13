import { Metadata } from 'next'
import OrganizationsTable from './_components/organizations-table'
import { fetchOrganizations } from '@/lib/data/organizations.data'
import AddButton from '@/components/add-button'
import SuccessToast from '@/components/success-toast'
import { OrganizationsFilters } from '@/interfaces'

export const metadata: Metadata = {
	title: 'Manage Organizations',
}

type OrganizationsPageProps = {
	searchParams: Promise<{
		success?: string
		name?: string
		pageSize?: string
		page?: string
		sort?: string
		order?: string
	}>
}
const OrganizationsPage = async ({ searchParams }: OrganizationsPageProps) => {
	const params = await searchParams

	const filters: OrganizationsFilters = {
		name: params.name,
		page: params.page ? parseInt(params.page) : 1,
		pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
		sort: params.sort,
		order: params.order as 'asc' | 'desc' | undefined,
	}

	const result = await fetchOrganizations(filters)
	if (!result.success) throw new Error(result.error)
	return (
		<main className='flex flex-col gap-y-6'>
			{params.success && <SuccessToast message={decodeURIComponent(params.success)} />}
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage Organizations</h1>
					<p className='text-muted-foreground text-sm'>View and manage all organizations.</p>
				</div>

				<AddButton
					label='Add Organization'
					url='/organizations/add'
				/>
			</div>
			<OrganizationsTable data={result.data} />
		</main>
	)
}

export default OrganizationsPage
