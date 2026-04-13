import { Metadata } from 'next'
import { InvitationsFilters } from '@/interfaces'
import { fetchOrganizationInvitations } from '@/lib/data/invitations.data'
import InviteMemberModal from './_components/invite-member-modal'
import InvitationsTable from './_components/invitations-table'

export const metadata: Metadata = {
	title: 'Organization Invitations',
}

type OrganizationInvitationsPageProps = {
	searchParams: Promise<{
		email?: string
		page?: string
		pageSize?: string
		sort?: string
		order?: string
	}>
}

const OrganizationInvitationsPage = async ({ searchParams }: OrganizationInvitationsPageProps) => {
	const params = await searchParams

	const filters: InvitationsFilters = {
		email: params.email,
		page: params.page ? parseInt(params.page) : 1,
		pageSize: params.pageSize ? parseInt(params.pageSize) : 10,
		sort: params.sort,
		order: params.order as 'asc' | 'desc' | undefined,
	}

	const result = await fetchOrganizationInvitations(filters)
	if (!result.success) throw new Error(result.error)

	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-lg font-bold'>Manage Invitations</h1>
					<p className='text-muted-foreground text-sm'>View and manage invitations for this organization.</p>
				</div>

				<InviteMemberModal />
			</div>
			<InvitationsTable data={result.data} />
		</main>
	)
}

export default OrganizationInvitationsPage
