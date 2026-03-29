import Loader from '@/components/loader'
import { fetchOrganizationInvitations, fetchOrganizationMembers } from '@/lib/data/members.data'
import { Metadata } from 'next'
import { Suspense } from 'react'
import MembersTable from './_components/members-table'
import InviteMemberModal from './_components/invite-member-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InvitationsTable from './_components/invitations-table'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Manage members',
}
const MembersPage = async () => {
	const members = fetchOrganizationMembers()
	const invitations = fetchOrganizationInvitations()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage Members</h1>
					<p className='text-muted-foreground text-sm'>View and manage all members.</p>
				</div>

				<InviteMemberModal />
			</div>
			<Tabs defaultValue='members'>
				<TabsList>
					<TabsTrigger value='members'>Members</TabsTrigger>
					<TabsTrigger value='invitations'>Invitations</TabsTrigger>
				</TabsList>
				<TabsContent value='members'>
					<Suspense fallback={<Loader />}>
						<MembersTable data={members} />
					</Suspense>
				</TabsContent>
				<TabsContent value='invitations'>
					<Suspense fallback={<Loader />}>
						<InvitationsTable data={invitations} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</main>
	)
}

export default MembersPage
