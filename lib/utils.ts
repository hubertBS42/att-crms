import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'
import { Recording } from '@/interfaces'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseRecording(filePath: string): Recording {
	const customer = path.basename(path.dirname(filePath))
	const filename = path.basename(filePath, path.extname(filePath))
	// "record_2026-03-05_10-47-56_02030962222_147041007_147041007"

	const parts = filename.split('_')

	const date = parts[1]
	const rawTime = parts[2]
	console.log('rawTime: ', rawTime)
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
