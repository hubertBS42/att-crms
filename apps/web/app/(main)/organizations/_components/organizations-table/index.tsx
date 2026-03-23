'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse } from '@/interfaces'
import { Organization } from '@att-crms/db/client'
import { use } from 'react'
import { columns } from './columns'
import { filters } from './filters'
import { useRouter } from 'next/navigation'

const OrganizationsTable = ({ data }: { data: Promise<DataResponse<Organization[]>> }) => {
	const router = useRouter()
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	const filteredOrgs = response.data.filter(org => org.slug !== 'global')
	return (
		<DataTable
			columns={columns}
			data={filteredOrgs}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
			onRowClick={organization => router.push(`/organizations/${organization.id}/edit`)}
		/>
	)
}

export default OrganizationsTable
