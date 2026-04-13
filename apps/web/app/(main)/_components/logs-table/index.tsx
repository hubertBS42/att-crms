'use client'

import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { LogsData } from '@/interfaces'
import { filters } from './filters'

interface LogsTableProps {
	data: LogsData
}

const LogsTable = ({ data }: LogsTableProps) => {
	return (
		<DataTable
			columns={columns}
			data={data.activities}
			filters={filters}
			pagination={{
				total: data.total,
				page: data.page,
				pageSize: data.pageSize,
				totalPages: data.totalPages,
			}}
		/>
	)
}

export default LogsTable
