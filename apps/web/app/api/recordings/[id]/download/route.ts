import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import { prisma } from '@att-crms/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({ headers: request.headers })
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id } = await params

	const recording = await prisma.recording.findUnique({
		where: { id },
	})

	if (!recording) return NextResponse.json({ error: 'Not found' }, { status: 404 })

	if (!fs.existsSync(recording.filePath)) {
		return NextResponse.json({ error: 'File not found' }, { status: 404 })
	}

	const fileBuffer = fs.readFileSync(recording.filePath)
	const ext = path.extname(recording.filename).toLowerCase()

	const mimeTypes: Record<string, string> = {
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.ogg': 'audio/ogg',
		'.m4a': 'audio/mp4',
	}

	return new NextResponse(new Uint8Array(fileBuffer), {
		headers: {
			'Content-Type': mimeTypes[ext] ?? 'audio/mpeg',
			'Content-Disposition': `attachment; filename="${recording.filename}"`,
			'Content-Length': fileBuffer.length.toString(),
		},
	})
}
