import { Recording } from '@/interfaces'
import chokidar from 'chokidar'
import { parseRecording } from './utils'
// import path from 'path'

let watcherStarted = false

export async function startWatcher() {
	if (watcherStarted) return // prevent hot-reload from spawning duplicates
	watcherStarted = true

	const RECORDINGS_ROOT = process.env.RECORDINGS_PATH || '/var/recordings'

	const watcher = chokidar.watch(RECORDINGS_ROOT, {
		persistent: true,
		ignoreInitial: false,
		awaitWriteFinish: {
			stabilityThreshold: 3000,
			pollInterval: 500,
		},
	})

	const recordings: Recording[] = []

	watcher.on('add', async filePath => {
		const recording = parseRecording(filePath)
		recordings.push(recording)
		console.log(recording)
	})

	watcher.on('ready', () => {
		console.log('All existing recordings:', recordings)
	})

	console.log(`Watching for recordings in: ${RECORDINGS_ROOT}`)
}
