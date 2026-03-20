'use client'
import { DataTable } from '@/components/data-table'
import { DataResponse } from '@/interfaces'
import { use, useState } from 'react'
import { columns } from './columns'
import { filters } from './filters'
import { Recording } from '@/lib/generated/prisma/client'
import RecordingSheet from '../recording-sheet'

const RecordingsTable = ({ data }: { data: Promise<DataResponse<Recording[]>> }) => {
	const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
	const response = use(data)
	if (!response.success) throw new Error(response.error)
	return (
		<>
			<DataTable
				columns={columns}
				data={response.data}
				filters={filters}
				defaultSorting={[{ id: 'callDate', desc: true }]}
				onRowClick={recording => setSelectedRecording(recording)}
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
