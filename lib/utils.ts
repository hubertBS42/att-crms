import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'
import { ParsedRecording } from '@/interfaces'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseRecording(filePath: string): ParsedRecording | null {
	const ext = path.extname(filePath)
	const dirname = path.dirname(filePath)
	const organizationSlug = path.basename(dirname)
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
		organizationSlug,
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

// Random password generator
export function generatePassword(options: { useSymbols?: boolean; useNumbers?: boolean; useLowerCase?: boolean; useUpperCase?: boolean; passwordLength: number }) {
	const { useSymbols = true, useNumbers = true, useLowerCase = true, useUpperCase = true, passwordLength } = options

	let charset = ''
	let newPassword = ''

	if (useSymbols) charset += '!@#$%^&*()'
	if (useNumbers) charset += '0123456789'
	if (useLowerCase) charset += 'abcdefghijklmnopqrstuvwxyz'
	if (useUpperCase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

	for (let i = 0; i < passwordLength; i++) {
		newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
	}

	return newPassword
}
