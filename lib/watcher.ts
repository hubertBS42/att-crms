import chokidar from 'chokidar'
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

	const titles: string[] = []

	watcher.on('add', async filePath => {
		const customer = path.basename(path.dirname(filePath))
		const title = path.basename(filePath)

		titles.push(title)
		console.log(customer)
	})

	watcher.on('ready', () => {
		console.log('All existing recordings:', titles)
	})

	console.log(`Watching for recordings in: ${RECORDINGS_ROOT}`)
}
