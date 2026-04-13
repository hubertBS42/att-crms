'use client'
import { DataTable } from '@/components/data-table'
import { MembersData } from '@/interfaces'
import { columns } from './columns'
import { useRouter } from 'next/navigation'

interface MembersTableProps {
	data: MembersData
}

const MembersTable = ({ data }: MembersTableProps) => {
	const router = useRouter()
	return (
		<DataTable
			columns={columns}
			data={data.members}
			pagination={{
				total: data.total,
				page: data.page,
				pageSize: data.pageSize,
				totalPages: data.totalPages,
			}}
			onRowClick={member => router.push(`/organization/members/${member.id}/details`)}
		/>
	)
}

export default MembersTable
