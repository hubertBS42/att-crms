'use client'

import { DataTable } from '@/components/data-table'
import { invitationColumns } from './columns'
import { DataResponse, InvitationWithUser } from '@/interfaces'
import { filters } from './filters'
import { use } from 'react'

const InvitationsTable = ({ data }: { data: Promise<DataResponse<InvitationWithUser[]>> }) => {
	const response = use(data)
	const invitations = response.success ? response.data : []
	if (!response.success) throw new Error(response.error)
	return (
		<DataTable
			columns={invitationColumns}
			filters={filters}
			data={invitations}
			defaultSorting={[{ id: 'expiresAt', desc: true }]}
		/>
	)
}

export default InvitationsTable
