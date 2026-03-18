'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse } from '@/interfaces'
import { User } from '@/lib/generated/prisma/client'
import { use } from 'react'
import { columns } from './columns'
import { filters } from './filters'
import { useRouter } from 'next/navigation'

const UsersTable = ({ data }: { data: Promise<DataResponse<User[]>> }) => {
	const router = useRouter()
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	return (
		<DataTable
			columns={columns}
			data={response.data}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
			onRowClick={user => router.push(`/users/${user.id}/edit`)}
		/>
	)
}

export default UsersTable
