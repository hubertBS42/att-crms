import { startWatcher, stopWatcher } from './watcher.js'

const shutdown = async () => {
	console.log('Shutting down watcher...')
	await stopWatcher()
	process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGQUIT', shutdown)

startWatcher()
