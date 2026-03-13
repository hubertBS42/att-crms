'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse } from '@/interfaces'
import { User } from '@/lib/generated/prisma/client'
import { use } from 'react'
import { columns } from './columns'
import { filters } from './filters'

const UsersTable = ({ data }: { data: Promise<DataResponse<User[]>> }) => {
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	return (
		<DataTable
			columns={columns}
			data={response.data}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
		/>
	)
}

export default UsersTable
