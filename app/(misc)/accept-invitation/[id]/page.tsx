// app/accept-invitation/[invitationId]/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import AcceptInvitationUI from './_components/accept-invitation-ui'
import { Metadata } from 'next'

interface AcceptInvitationPageProps {
	params: Promise<{ id: string }>
}

export const metadata: Metadata = {
	title: 'Organization invitation',
}
const AcceptInvitationPage = async ({ params }: AcceptInvitationPageProps) => {
	const { id } = await params

	// Check invitation validity
	const invitation = await prisma.invitation.findUnique({
		where: { id },
		include: { user: true, organization: true },
		// select: {
		// 	id: true,
		// 	email: true,
		// 	role: true,
		// 	status: true,
		// 	expiresAt: true,
		// },
	})

	if (!invitation || invitation.status !== 'pending' || new Date() > invitation.expiresAt) {
		redirect('/sign-in')
	}

	// Check if user is already signed in
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session) {
		// Check if invited email has an existing account
		const user = await prisma.user.findUnique({
			where: { email: invitation.email },
			select: { id: true },
		})

		if (user) {
			redirect(`/sign-in?callbackURL=/accept-invitation/${id}`)
		} else {
			redirect(`/sign-up?callbackURL=/accept-invitation/${id}`)
		}
	}

	// User is signed in — show accept/decline UI
	return <AcceptInvitationUI invitation={invitation} />
}

export default AcceptInvitationPage
