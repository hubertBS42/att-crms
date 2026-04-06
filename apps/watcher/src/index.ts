import { startWatcher, stopWatcher } from './watcher.js'
import { prisma } from '@att-crms/db'
import { runRetentionCleanup } from './retention.js'

let retentionInterval: NodeJS.Timeout | null = null
let retentionTimeout: NodeJS.Timeout | null = null

function msUntilMidnight(): number {
	const now = new Date()
	const midnight = new Date()
	midnight.setHours(24, 0, 0, 0) // next midnight
	return midnight.getTime() - now.getTime()
}

function scheduleRetention() {
	const totalMinutes = Math.round(msUntilMidnight() / 1000 / 60)
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60

	const timeLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

	console.log(`Retention cleanup scheduled for midnight (in ${timeLabel})`)

	retentionTimeout = setTimeout(async () => {
		retentionTimeout = null
		await runRetentionCleanup()
		retentionInterval = setInterval(runRetentionCleanup, 24 * 60 * 60 * 1000)
	}, msUntilMidnight())
}

const shutdown = async (signal: string) => {
	console.log(`Received ${signal}, shutting down...`)

	const forceExit = setTimeout(() => {
		console.error('Forced exit after timeout')
		process.exit(1)
	}, 5000)
	forceExit.unref()

	if (retentionTimeout) {
		clearTimeout(retentionTimeout)
		retentionTimeout = null
	}

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

scheduleRetention()
startWatcher()
