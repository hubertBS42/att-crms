'use client'

import { DataTable } from '@/components/data-table'
import { Activity } from '@att-crms/db/client'
import { columns } from './columns'
import { filters } from './filters'

const LogsTable = ({ logs }: { logs: Activity[] }) => {
	return (
		<DataTable
			columns={columns}
			data={logs}
			filters={filters}
			defaultSorting={[{ id: 'createdAt', desc: true }]}
		/>
	)
}

export default LogsTable
