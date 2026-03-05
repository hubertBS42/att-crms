import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import { parseRecording } from './utils'
import { indexRecordingBatch, indexRecording } from './indexer'
import { CreateRecording } from '@/interfaces'

let watcherStarted = false
const processedFiles = new Set<string>()
const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a']
const BATCH_SIZE = 50

async function processBatch(files: string[]) {
	const recordings = files.map(parseRecording).filter(Boolean) as CreateRecording[]
	await indexRecordingBatch(recordings)
}

export async function startWatcher() {
	if (watcherStarted) return
	watcherStarted = true

	const RECORDINGS_ROOT = process.env.RECORDINGS_PATH || '/home/hubert/call_recordings'
	const pendingFiles: string[] = []
	let isReady = false

	const watcher = chokidar.watch(RECORDINGS_ROOT, {
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
			const recording = parseRecording(filePath)
			if (!recording) return
			await indexRecording(recording)
			console.log(`New recording detected: ${path.basename(filePath)}`)
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

	console.log(`Watching for recordings in: ${RECORDINGS_ROOT}`)
}
