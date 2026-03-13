import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const role = session.user.role
	const isPlatformStaff = role === 'superadmin' || role === 'admin'

	if (isPlatformStaff) {
		// Return all organizations
		const organizations = await prisma.organization.findMany({
			orderBy: { name: 'asc' },
		})
		return NextResponse.json(organizations)
	}

	// For regular users, return only their orgs
	const organizations = await prisma.organization.findMany({
		where: {
			members: {
				some: { userId: session.user.id },
			},
		},
		orderBy: { name: 'asc' },
	})

	return NextResponse.json(organizations)
}
