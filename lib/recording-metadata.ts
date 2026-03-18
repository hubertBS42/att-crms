import { parseFile } from 'music-metadata'
import fs from 'fs'

interface RecordingMetadata {
	duration: number // in seconds
	size: number // in bytes
}

export async function getRecordingMetadata(filePath: string): Promise<RecordingMetadata> {
	const size = fs.statSync(filePath).size

	const metadata = await parseFile(filePath, {
		duration: true, // ensure duration is calculated
		skipCovers: true, // skip album art to speed things up
	})

	const duration = metadata.format.duration ?? 0

	return { duration, size }
}
