import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

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

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
