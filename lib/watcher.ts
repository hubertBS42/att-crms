import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import { parseRecording } from './utils'
import { indexRecording } from './indexer'

let watcherStarted = false
const processedFiles = new Set<string>()
const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a']

export async function startWatcher() {
	if (watcherStarted) return
	watcherStarted = true

	const RECORDINGS_ROOT = process.env.RECORDINGS_PATH || '/home/hubert/call_recordings'

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

		const recording = parseRecording(filePath)
		if (!recording) return

		await indexRecording(recording)
	})

	watcher.on('ready', () => {
		console.log(`Watcher ready: monitoring ${RECORDINGS_ROOT}`)
	})
}
