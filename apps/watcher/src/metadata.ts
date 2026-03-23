import { parseFile } from 'music-metadata'
import fs from 'fs'

interface RecordingMetadata {
	duration: number
	size: number
}

export async function getRecordingMetadata(filePath: string): Promise<RecordingMetadata> {
	const size = fs.statSync(filePath).size

	const metadata = await parseFile(filePath, {
		duration: true,
		skipCovers: true,
	})

	return {
		duration: metadata.format.duration ?? 0,
		size,
	}
}
