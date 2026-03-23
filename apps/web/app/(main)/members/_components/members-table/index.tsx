'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse, MemberWithUser } from '@/interfaces'
import { use } from 'react'
import { columns } from './columns'
import { filters } from './filters'
import { useRouter } from 'next/navigation'

const MembersTable = ({ data }: { data: Promise<DataResponse<MemberWithUser[]>> }) => {
	const router = useRouter()
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	return (
		<DataTable
			columns={columns}
			data={response.data}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
			onRowClick={member => router.push(`/members/${member.id}/details`)}
		/>
	)
}

export default MembersTable
