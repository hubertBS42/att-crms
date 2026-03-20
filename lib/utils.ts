import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FlatNode } from '@/interfaces'
import { ZodError } from 'zod'
import { APIError } from 'better-auth'
import { promisify } from 'util'
import { randomBytes, scrypt, timingSafeEqual } from 'crypto'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const hashPasswordWithScrypt = async (password: string) => {
	const scryptAsync = promisify(scrypt)
	const salt = randomBytes(16).toString('hex')
	const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
	return `${salt}:${derivedKey.toString('hex')}`
}

export const verifyPasswordWithScrypt = async (hashedPassword: string, password: string) => {
	const scryptAsync = promisify(scrypt)
	const [salt, storedKeyHex] = hashedPassword.split(':')
	const storedKey = Buffer.from(storedKeyHex, 'hex')
	const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

	// Use timingSafeEqual to prevent timing attacks
	return timingSafeEqual(storedKey, derivedKey)
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

export const formatDuration = (seconds: number, format: 'human' | 'timestamp' = 'human'): string => {
	if (format === 'timestamp') {
		const h = Math.floor(seconds / 3600)
		const m = Math.floor((seconds % 3600) / 60)
		const s = Math.floor(seconds % 60)
		return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
	}

	// Human readable
	if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? 's' : ''}`
	}

	const minutes = seconds / 60

	if (minutes < 60) {
		const roundedMinutes = Math.round(minutes)
		return `${roundedMinutes} minute${roundedMinutes !== 1 ? 's' : ''}`
	}

	const hours = minutes / 60

	if (hours % 1 === 0) {
		return `${hours} hour${hours !== 1 ? 's' : ''}`
	}

	const roundedHours = Math.round(hours * 10) / 10
	return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`
}

export const formatSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
