// import 'dotenv/config'
import { startWatcher, stopWatcher } from './watcher'
import { prisma } from '@att-crms/db'
import { runRetentionCleanup } from './retention'

// const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000 // run once a day
const RETENTION_INTERVAL_MS = 5 * 60 * 1000

let retentionInterval: NodeJS.Timeout | null = null

const shutdown = async (signal: string) => {
	console.log(`Received ${signal}, shutting down...`)

	const forceExit = setTimeout(() => {
		console.error('Forced exit after timeout')
		process.exit(1)
	}, 5000)
	forceExit.unref()

	if (retentionInterval) {
		clearInterval(retentionInterval)
		retentionInterval = null
	}

	try {
		await stopWatcher()
		await prisma.$disconnect()
		console.log('Shutdown complete')
	} catch (error) {
		console.error('Error during shutdown:', error)
	} finally {
		process.exit(0)
	}
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGQUIT', () => shutdown('SIGQUIT'))

// Run retention cleanup on startup and then every 24 hours
await runRetentionCleanup()
retentionInterval = setInterval(runRetentionCleanup, RETENTION_INTERVAL_MS)

startWatcher()
