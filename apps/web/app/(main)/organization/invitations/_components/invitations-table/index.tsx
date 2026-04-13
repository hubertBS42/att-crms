'use client'

import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { InvitationsData } from '@/interfaces'

interface InvitationsTableProps {
	data: InvitationsData
}

const InvitationsTable = ({ data }: InvitationsTableProps) => {
	return (
		<DataTable
			columns={columns}
			data={data.invitations}
			pagination={{
				total: data.total,
				page: data.page,
				pageSize: data.pageSize,
				totalPages: data.totalPages,
			}}
		/>
	)
}

export default InvitationsTable
