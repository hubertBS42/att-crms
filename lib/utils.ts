import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'
import { FlatNode, ParsedRecording } from '@/interfaces'
import { ZodError } from 'zod'
import { APIError } from 'better-auth'

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

export const abbreviateName = (name: string) => {
	const names = name.trim().split(/\s+/).filter(Boolean)

	if (names.length === 0) return '?'
	if (names.length === 1) return names[0].charAt(0).toUpperCase()

	const firstInitial = names[0].charAt(0).toUpperCase()
	const lastInitial = names[names.length - 1].charAt(0).toUpperCase()
	return firstInitial + lastInitial
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any): string => {
	if (error instanceof ZodError) {
		const fieldErrors = error.issues.map(issue => issue.message)
		return fieldErrors?.join('. ') || 'Validation error'
	}

	if (error.name === 'PrismaClientKnownRequestError') {
		if (error.code === 'P2002') {
			const field = error.meta?.target?.[0] || 'Field'
			return `${field.chartAt(0).toUpperCase() + field.slice(1)} already exists`
		} else {
			return error.message.split(':')[1].replace(/\s+/g, ' ').trim()
		}
	}

	if (error instanceof APIError) {
		return error.status?.toString() || 'API Error'
	}

	// Fallback to any standard error or unkown error
	if (typeof error?.message === 'string') return error.message

	// Last resort: try to stringify or return a default
	try {
		return JSON.stringify(error)
	} catch {
		return 'An unknown error occurred'
	}
}

export const flattenNodeTree = <T extends { id: string; children?: T[] }>(tree: T[], parentId: string | null = null, depth = 0): FlatNode<T>[] => {
	return tree.flatMap(node => {
		const { children, ...rest } = node
		const flatNode: FlatNode<T> = { ...rest, parentId, depth }

		const childNodes = children ? flattenNodeTree(children, node.id, depth + 1) : []
		return [flatNode, ...childNodes]
	})
}

export const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
