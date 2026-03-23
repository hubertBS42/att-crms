import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import RemovedFromOrganization from './_components/removed-from-organization'
import { prisma } from '@att-crms/db'

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
