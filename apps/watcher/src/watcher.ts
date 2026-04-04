import chokidar, { FSWatcher } from 'chokidar'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { parseRecording, ParsedRecording } from './parser.js'
import { indexRecordingBatch } from './indexer.js'

const RECORDINGS_PATH = process.env.RECORDINGS_PATH ?? path.join(os.homedir(), 'call_recordings')
const BATCH_SIZE = 50
const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a']

let watcherStarted = false
let watcherInstance: FSWatcher | null = null
const processedFiles = new Set<string>()

const liveQueue: string[] = []
let lastAddTime = 0
let queueCheckInterval: NodeJS.Timeout | null = null

async function reconcile() {
	console.log('Running reconciliation scan...')

	const allFiles = fs.readdirSync(RECORDINGS_PATH, { recursive: true }) as string[]
	const audioFiles = allFiles
		.map(f => path.join(RECORDINGS_PATH, f as string))
		.filter(f => {
			try {
				return fs.statSync(f).isFile() && validExtensions.includes(path.extname(f).toLowerCase())
			} catch {
				return false
			}
		})

	const missed = audioFiles.filter(f => !processedFiles.has(f))

	if (missed.length === 0) {
		console.log('Reconciliation complete — no missed files')
		return
	}

	console.log(`Reconciliation found ${missed.length} missed files — indexing...`)

	missed.forEach(f => processedFiles.add(f))

	for (let i = 0; i < missed.length; i += BATCH_SIZE) {
		const batch = missed.slice(i, i + BATCH_SIZE)
		await processBatch({ files: batch, isLive: false })
		console.log(`Reconciliation indexed ${Math.min(i + BATCH_SIZE, missed.length)} / ${missed.length}`)
	}

	console.log('Reconciliation complete')
}

async function processLiveQueue() {
	if (liveQueue.length === 0) return

	const files = [...liveQueue]
	liveQueue.length = 0

	const live = isReady

	console.log(`Processing ${live ? 'live' : 'initial'} queue: ${files.length} files`)

	for (let i = 0; i < files.length; i += BATCH_SIZE) {
		const batch = files.slice(i, i + BATCH_SIZE)
		await processBatch({ files: batch, isLive: live })
		console.log(`${live ? 'Live' : 'Initial'} indexed ${Math.min(i + BATCH_SIZE, files.length)} / ${files.length}`)
	}

	console.log(`${live ? 'Live' : 'Initial'} queue processing complete`)

	await reconcile()

	if (!isReady) {
		isReady = true
		console.log('Watcher is now live')
	}
}

function startQueueMonitor() {
	if (queueCheckInterval) return

	queueCheckInterval = setInterval(async () => {
		const timeSinceLastAdd = Date.now() - lastAddTime

		if (timeSinceLastAdd >= 5000 && liveQueue.length > 0) {
			clearInterval(queueCheckInterval!)
			queueCheckInterval = null
			await processLiveQueue()
		}
	}, 1000)
}

async function processBatch({ files, isLive = false }: { files: string[]; isLive?: boolean }) {
	const results = await Promise.all(files.map(parseRecording))

	const nullResults = results.filter(r => r === null).length
	if (nullResults > 0) {
		console.warn(`${nullResults} files could not be parsed`)
	}

	const recordings = results.filter(Boolean) as ParsedRecording[]
	await indexRecordingBatch({ recordings, isLive })
}

let isReady = false

export async function startWatcher() {
	if (watcherStarted) return
	watcherStarted = true

	const watcher = chokidar.watch(RECORDINGS_PATH, {
		persistent: true,
		ignoreInitial: false,
		awaitWriteFinish: {
			stabilityThreshold: 3000,
			pollInterval: 500,
		},
	})

	watcherInstance = watcher

	watcher.on('add', filePath => {
		if (!validExtensions.includes(path.extname(filePath).toLowerCase())) return
		if (processedFiles.has(filePath)) return
		processedFiles.add(filePath)

		liveQueue.push(filePath)
		lastAddTime = Date.now()
		startQueueMonitor()
	})

	watcher.on('ready', () => {
		console.log(`Watcher ready: ${liveQueue.length} existing recordings queued`)
		isReady = false
		lastAddTime = Date.now()
		startQueueMonitor()
	})

	watcher.on('error', error => {
		console.error('Watcher error:', error)
	})

	console.log(`Watching for recordings in: ${RECORDINGS_PATH}`)
}

export async function stopWatcher() {
	if (queueCheckInterval) {
		clearInterval(queueCheckInterval)
		queueCheckInterval = null
	}

	if (liveQueue.length > 0) {
		console.log(`Processing ${liveQueue.length} remaining files before shutdown...`)
		await processLiveQueue()
	}

	if (watcherInstance) {
		await watcherInstance.close()
		watcherInstance = null
		watcherStarted = false
		console.log('Watcher stopped')
	}
}
