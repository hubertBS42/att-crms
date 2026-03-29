import { Metadata } from 'next'
import OrganizationsTable from './_components/organizations-table'
import { Suspense } from 'react'
import Loader from '@/components/loader'
import { fetchOrganizations } from '@/lib/data/organizations.data'
import AddButton from '@/components/add-button'

export const metadata: Metadata = {
	title: 'Manage organizations',
}
const OrganizationsPage = () => {
	const data = fetchOrganizations()
	return (
		<main className='flex flex-col gap-y-6'>
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
			<Suspense fallback={<Loader />}>
				<OrganizationsTable data={data} />
			</Suspense>
		</main>
	)
}

export default OrganizationsPage
