'use client'
import { DataTable } from '@/components/data-table'
import { RecordingsData } from '@/interfaces'
import { useState } from 'react'
import { columns } from './columns'
import { Recording } from '@att-crms/db/client'
import RecordingSheet from '../recording-sheet'
import { filters } from './filters'

interface RecordingsTableProps {
	data: RecordingsData
}

const RecordingsTable = ({ data }: RecordingsTableProps) => {
	const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)

	return (
		<>
			<DataTable
				columns={columns}
				data={data.recordings}
				onRowClick={setSelectedRecording}
				filters={filters}
				pagination={{
					total: data.total,
					page: data.page,
					pageSize: data.pageSize,
					totalPages: data.totalPages,
				}}
			/>
			<RecordingSheet
				recording={selectedRecording}
				isOpen={!!selectedRecording}
				onClose={() => setSelectedRecording(null)}
			/>
		</>
	)
}

export default RecordingsTable
