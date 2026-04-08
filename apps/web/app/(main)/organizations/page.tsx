import { Metadata } from 'next'
import OrganizationsTable from './_components/organizations-table'
import { Suspense } from 'react'
import Loader from '@/components/loader'
import { fetchOrganizations } from '@/lib/data/organizations.data'
import AddButton from '@/components/add-button'
import SuccessToast from '@/components/success-toast'

export const metadata: Metadata = {
	title: 'Manage Organizations',
}

interface OrganizationsPageProps {
	searchParams: Promise<{ success?: string }>
}
const OrganizationsPage = async ({ searchParams }: OrganizationsPageProps) => {
	const { success } = await searchParams
	const data = fetchOrganizations()
	return (
		<main className='flex flex-col gap-y-6'>
			{success && <SuccessToast message={decodeURIComponent(success)} />}
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
