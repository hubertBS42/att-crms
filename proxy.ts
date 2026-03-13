import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { routePermissions } from './lib/route-permissions'
import { PlatformRole } from './lib/access-control'
import prisma from './lib/prisma'

const authPaths = [/^\/sign-in/, /^\/reset-password/, /^\/set-password/]

export async function proxy(request: NextRequest) {
	const { nextUrl } = request

	// Quick session check (uses cookie cache if enabled)
	const session = await auth.api.getSession({
		headers: request.headers,
	})

	const isOnAuthPath = authPaths.some(pattern => pattern.test(nextUrl.pathname))

	// Redirect unauthenticated users to sign-in from any protected page
	if (!session && !isOnAuthPath) {
		// Return 401 for API routes
		if (nextUrl.pathname.startsWith('/api')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Redirect to sign-in for all other routes
		const redirectURL = new URL('/sign-in', request.url)
		redirectURL.searchParams.set('callbackURL', nextUrl.pathname + nextUrl.search)
		return NextResponse.redirect(redirectURL)
	}

	// Redirect to homepage if on auth path but already signed in
	if (isOnAuthPath && session) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// Check route permissions
	if (session) {
		const matchedRoute = Object.keys(routePermissions).find(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/'))

		const permission = matchedRoute ? routePermissions[matchedRoute] : null

		if (permission) {
			const userRole = session.user.role as PlatformRole

			const activeOrg = await prisma.organization.findUnique({
				where: { id: session.session.activeOrganizationId ?? '' },
				select: { slug: true },
			})

			const isGlobalWorkspace = activeOrg?.slug === 'global'
			const currentContext = isGlobalWorkspace ? 'global' : 'org'

			// Check role
			if (!permission.role.includes(userRole)) {
				return NextResponse.redirect(new URL('/', request.url))
			}

			// Check context
			if (!permission.context.includes(currentContext)) {
				return NextResponse.redirect(new URL('/', request.url))
			}
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
