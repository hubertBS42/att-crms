'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse } from '@/interfaces'
import { Organization } from '@/lib/generated/prisma/client'
import { use } from 'react'
import { columns } from './columns'
import { filters } from './filters'

const OrganizationsTable = ({ data }: { data: Promise<DataResponse<Organization[]>> }) => {
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	const filteredOrgs = response.data.filter(org => org.slug !== 'global')
	return (
		<DataTable
			columns={columns}
			data={filteredOrgs}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
		/>
	)
}

export default OrganizationsTable
