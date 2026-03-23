import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@att-crms/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const recording = await prisma.recording.findUnique({
		where: { id },
	})

	if (!recording) return NextResponse.json({ error: 'Not found' }, { status: 404 })

	if (!fs.existsSync(recording.filePath)) {
		return NextResponse.json({ error: 'File not found' }, { status: 404 })
	}

	const ext = path.extname(recording.filename).toLowerCase()
	const mimeTypes: Record<string, string> = {
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.ogg': 'audio/ogg',
		'.m4a': 'audio/mp4',
	}
	const contentType = mimeTypes[ext] ?? 'audio/mpeg'

	const stat = fs.statSync(recording.filePath)
	const fileSize = stat.size
	const range = request.headers.get('range')

	// Handle range requests for audio seeking
	if (range) {
		const parts = range.replace(/bytes=/, '').split('-')
		const start = parseInt(parts[0] ?? '0', 10)
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
		const chunkSize = end - start + 1

		const stream = fs.createReadStream(recording.filePath, { start, end })
		const body = new ReadableStream({
			start(controller) {
				stream.on('data', chunk => controller.enqueue(chunk))
				stream.on('end', () => controller.close())
				stream.on('error', err => controller.error(err))
			},
			cancel() {
				stream.destroy()
			},
		})

		return new NextResponse(body, {
			status: 206, // Partial Content
			headers: {
				'Content-Type': contentType,
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize.toString(),
			},
		})
	}

	// No range request — stream the full file
	const stream = fs.createReadStream(recording.filePath)
	const body = new ReadableStream({
		start(controller) {
			stream.on('data', chunk => controller.enqueue(chunk))
			stream.on('end', () => controller.close())
			stream.on('error', err => controller.error(err))
		},
		cancel() {
			stream.destroy()
		},
	})

	return new NextResponse(body, {
		status: 200,
		headers: {
			'Content-Type': contentType,
			'Accept-Ranges': 'bytes',
			'Content-Length': fileSize.toString(),
		},
	})
}
