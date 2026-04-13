'use client'
import { DataTable } from '@/components/data-table'
import { OrganizationsData } from '@/interfaces'
import { columns } from './columns'
import { useRouter } from 'next/navigation'
import { filters } from './filters'

interface OrganizationsTableProps {
	data: OrganizationsData
}

const OrganizationsTable = ({ data }: OrganizationsTableProps) => {
	const router = useRouter()
	const filteredOrgs = data.organizations.filter(org => org.slug !== 'global')
	return (
		<DataTable
			columns={columns}
			filters={filters}
			data={filteredOrgs}
			onRowClick={organization => router.push(`/organizations/${organization.id}/edit`)}
			pagination={{
				total: data.total,
				page: data.page,
				pageSize: data.pageSize,
				totalPages: data.totalPages,
			}}
		/>
	)
}

export default OrganizationsTable
