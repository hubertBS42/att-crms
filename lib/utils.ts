import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'
import { CreateRecording } from '@/interfaces'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseRecording(filePath: string): CreateRecording | null {
	const ext = path.extname(filePath)
	const dirname = path.dirname(filePath)
	const customer = path.basename(dirname)
	const filename = path.basename(filePath, ext)
	// "record_2026-03-05_10-47-56_02030962222_147041007_147041007"

	const parts = filename.split('_')

	if (parts.length < 6) {
		console.error(`Unexpected filename format: ${filename}`)
		return null
	}

	const date = parts[1]
	const rawTime = parts[2]
	const caller = parts[3]
	const calledNumber = parts[4]
	const answeredBy = parts[5]

	const time = rawTime.replace(/-/g, ':') // "10:47:56"
	const datetime = new Date(`${date}T${time}`)

	return {
		customer,
		callDate: date,
		callTime: time,
		datetime,
		caller,
		calledNumber,
		answeredBy,
		filename: path.basename(filePath),
		filePath,
	}
}
