import Loader from '@/components/loader'
import { fetchOrganizationMembers } from '@/lib/data/members.data'
import { Metadata } from 'next'
import { Suspense } from 'react'
import MembersTable from './_components/members-table'
import InviteMemberModal from './_components/invite-member-modal'

export const metadata: Metadata = {
	title: 'Manage members',
}
const MembersPage = () => {
	const data = fetchOrganizationMembers()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage members</h1>
					<p className='text-muted-foreground text-sm'>View and manage all members.</p>
				</div>

				<InviteMemberModal />
			</div>
			<Suspense fallback={<Loader />}>
				<MembersTable data={data} />
			</Suspense>
		</main>
	)
}

export default MembersPage
