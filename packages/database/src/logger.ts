import { prisma } from './prisma.js'
import { Prisma } from '../generated/prisma/client.js'

export async function logActivity(params: Prisma.ActivityCreateInput) {
	try {
		await prisma.activity.create({ data: params })
	} catch (error) {
		console.error('Failed to log activity:', error)
	}
}
