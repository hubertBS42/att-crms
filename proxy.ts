import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { routePermissions } from './lib/permissions/route-permissions'
import { SystemLevelRole } from './lib/permissions/system-permissions'
import prisma from './lib/prisma'

const authPaths = [/^\/sign-in/, /^\/sign-up/, /^\/reset-password/, /^\/set-password/]
const publicPaths = [/^\/accept-invitation/, /^\/no-organization/, /^\/removed-from-organization/]

export async function proxy(request: NextRequest) {
	const { nextUrl } = request

	const isOnAuthPath = authPaths.some(pattern => pattern.test(nextUrl.pathname))
	const isOnPublicPath = publicPaths.some(pattern => pattern.test(nextUrl.pathname))

	// Allow public paths
	if (isOnPublicPath) return NextResponse.next()

	// Block direct /sign-up without invitation
	if (nextUrl.pathname.startsWith('/sign-up')) {
		const callbackURL = nextUrl.searchParams.get('callbackURL')
		const isFromInvitation = callbackURL?.startsWith('/accept-invitation')
		if (!isFromInvitation) {
			return NextResponse.redirect(new URL('/sign-in', request.url))
		}
	}

	const session = await auth.api.getSession({ headers: request.headers })

	// Redirect unauthenticated users
	if (!session && !isOnAuthPath) {
		const redirectURL = new URL('/sign-in', request.url)
		redirectURL.searchParams.set('callbackURL', nextUrl.pathname + nextUrl.search)
		return NextResponse.redirect(redirectURL)
	}

	// Redirect authenticated users away from auth pages
	if (isOnAuthPath && session) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	if (session) {
		const isPlatformStaff = session.user.role === 'superAdmin' || session.user.role === 'admin'
		const isOnNoOrgPage = nextUrl.pathname === '/no-organization'
		const isOnRemovedPage = nextUrl.pathname === '/removed-from-organization'

		if (!isPlatformStaff) {
			const activeOrganizationId = session.session.activeOrganizationId

			// Check if user has any memberships
			const membershipCount = await prisma.member.count({
				where: { userId: session.user.id },
			})

			if (membershipCount === 0 && !isOnNoOrgPage) {
				return NextResponse.redirect(new URL('/no-organization', request.url))
			}

			if (membershipCount > 0 && isOnNoOrgPage) {
				return NextResponse.redirect(new URL('/', request.url))
			}

			// Check if user is still a member of their active org
			if (activeOrganizationId) {
				const isActiveMember = await prisma.member.findFirst({
					where: {
						userId: session.user.id,
						organizationId: activeOrganizationId,
					},
				})

				if (!isActiveMember && !isOnRemovedPage) {
					return NextResponse.redirect(new URL('/removed-from-organization', request.url))
				}
			}
		}

		// Check route permissions
		const matchedRoute = Object.keys(routePermissions)
			.sort((a, b) => b.length - a.length) // ✅ sort by length — most specific first
			.find(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/'))

		const permission = matchedRoute ? routePermissions[matchedRoute] : null

		if (permission) {
			const userRole = session.user.role as SystemLevelRole

			const activeOrg = await prisma.organization.findUnique({
				where: { id: session.session.activeOrganizationId ?? '' },
				select: { slug: true },
			})

			const isGlobalWorkspace = activeOrg?.slug === 'global'
			const currentContext = isGlobalWorkspace ? 'global' : 'org'

			if (!permission.role.includes(userRole)) {
				return NextResponse.redirect(new URL('/', request.url))
			}

			if (!permission.context.includes(currentContext)) {
				return NextResponse.redirect(new URL('/', request.url))
			}
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
