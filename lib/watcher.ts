import chokidar from 'chokidar'
// import { indexRecording } from './indexer'
import path from 'path'

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

	watcher.on('add', async filePath => {
		const customer = path.basename(path.dirname(filePath))
		console.log(customer)
		// await indexRecording({ filePath, customer })
	})

	console.log(`Watching for recordings in: ${RECORDINGS_ROOT}`)
}
