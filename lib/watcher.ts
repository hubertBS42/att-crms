import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import { indexRecordingBatch, indexRecording } from './indexer'
import { ParsedRecording } from '@/interfaces'
import { RECORDINGS_PATH } from '@/constants'
import { getRecordingMetadata } from './recording-metadata'

let watcherStarted = false
const processedFiles = new Set<string>()
const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a']
const BATCH_SIZE = 50

async function parseRecording(filePath: string): Promise<ParsedRecording | null> {
	const ext = path.extname(filePath)
	const dirname = path.dirname(filePath)
	const organizationSlug = path.basename(dirname)
	const filename = path.basename(filePath, ext)

	const parts = filename.split('_')

	if (parts.length < 6) {
		console.error(`Unexpected filename format: ${filename}`)
		return null
	}

	const date = parts[1]
	const rawTime = parts[2]
	const caller = parts[3]
	const calledNumber = parts[4]
	const answeredBy = parts[5]

	const time = rawTime.replace(/-/g, ':')
	const datetime = new Date(`${date}T${time}`)

	if (isNaN(datetime.getTime())) {
		console.error(`Invalid datetime for file: ${filename}`)
		return null
	}

	if (!organizationSlug) {
		console.error(`Could not determine organization slug for: ${filePath}`)
		return null
	}

	// Extract duration and size
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

async function processBatch(files: string[]) {
	const results = await Promise.all(files.map(parseRecording))
	const recordings = results.filter(Boolean) as ParsedRecording[]
	await indexRecordingBatch(recordings)
}

export async function startWatcher() {
	if (watcherStarted) return
	watcherStarted = true

	const pendingFiles: string[] = []
	let isReady = false

	const watcher = chokidar.watch(RECORDINGS_PATH, {
		persistent: true,
		ignoreInitial: false,
		awaitWriteFinish: {
			stabilityThreshold: 3000,
			pollInterval: 500,
		},
	})

	watcher.on('add', async filePath => {
		// Skip directories
		if (fs.statSync(filePath).isDirectory()) return

		// Skip non-audio files
		if (!validExtensions.includes(path.extname(filePath).toLowerCase())) return

		// Skip already processed files
		if (processedFiles.has(filePath)) return

		processedFiles.add(filePath)

		if (!isReady) {
			// Still in initial scan - queue it
			pendingFiles.push(filePath)
		} else {
			// Live detection after initial scan
			const recording = await parseRecording(filePath)
			if (!recording) return
			console.log(`New recording detected: ${path.basename(filePath)}`)
			await indexRecording(recording)
		}
	})

	watcher.on('ready', async () => {
		console.log(`Watcher ready: found ${pendingFiles.length} existing recordings to index`)

		// Process in batches of 50
		for (let i = 0; i < pendingFiles.length; i += BATCH_SIZE) {
			const batch = pendingFiles.slice(i, i + BATCH_SIZE)
			await processBatch(batch)
			console.log(`Indexed ${Math.min(i + BATCH_SIZE, pendingFiles.length)} / ${pendingFiles.length}`)
		}

		console.log('Initial indexing complete')
		isReady = true // from this point, new add events are live files
	})

	console.log(`Watching for recordings in: ${RECORDINGS_PATH}`)
}
