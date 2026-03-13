import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import OrganizationsTable from './_components/organizations-table'
import { Suspense } from 'react'
import Loader from '@/components/loader'
import { fetchOrganizations } from '@/lib/data/organizations.server.data'

export const metadata: Metadata = {
	title: 'Manage organizations',
}
const OrganizationsPage = () => {
	const data = fetchOrganizations()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage organizations</h1>
					<p className='text-muted-foreground text-sm'>View and manage all organizations.</p>
				</div>

				<Link
					className={buttonVariants({ variant: 'default', size: 'sm' })}
					href={'/organizations/add'}
				>
					<Plus />
					<span className='hidden md:block'>Add organization</span>
				</Link>
			</div>
			<Suspense fallback={<Loader />}>
				<OrganizationsTable data={data} />
			</Suspense>
		</main>
	)
}

export default OrganizationsPage
