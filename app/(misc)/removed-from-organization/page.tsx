import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import RemovedFromOrganization from './_components/removed-from-organization'

const RemovedFromOrganizationPage = async () => {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	// Get remaining memberships
	const memberships = await prisma.member.findMany({
		where: { userId: session.user.id },
		include: { organization: true },
	})

	return <RemovedFromOrganization memberships={memberships} />
}

export default RemovedFromOrganizationPage
