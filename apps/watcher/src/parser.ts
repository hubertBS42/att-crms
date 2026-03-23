import path from 'path'
import { Prisma } from '@att-crms/db/client'
import { getRecordingMetadata } from './metadata.js'

export type ParsedRecording = Omit<Prisma.RecordingCreateInput, 'organization'> & {
	organizationSlug: string
}

export async function parseRecording(filePath: string): Promise<ParsedRecording | null> {
	const ext = path.extname(filePath)
	const dirname = path.dirname(filePath)
	const organizationSlug = path.basename(dirname)
	const filename = path.basename(filePath, ext)

	const parts = filename.split('_')

	if (parts.length < 6) {
		console.error(`Unexpected filename format: ${filename}`)
		return null
	}

	const date = parts[1] ?? ''
	const rawTime = parts[2] ?? ''
	const caller = parts[3] ?? ''
	const calledNumber = parts[4] ?? ''
	const answeredBy = parts[5] ?? ''

	const time = rawTime?.replace(/-/g, ':')
	const datetime = new Date(`${date}T${time}`)

	if (isNaN(datetime.getTime())) {
		console.error(`Invalid datetime for file: ${filename}`)
		return null
	}

	if (!organizationSlug) {
		console.error(`Could not determine organization slug for: ${filePath}`)
		return null
	}

	const { duration, size } = await getRecordingMetadata(filePath)

	return {
		organizationSlug,
		callDate: date,
		callTime: time,
		datetime,
		caller,
		calledNumber,
		answeredBy,
		filename: path.basename(filePath),
		filePath,
		duration,
		size,
	}
}
