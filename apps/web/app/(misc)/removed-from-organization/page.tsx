import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import RemovedFromOrganization from './_components/removed-from-organization'
import { prisma } from '@att-crms/db'
import SuccessToast from '@/components/success-toast'
import { Metadata } from 'next'

interface RemovedFromOrganizationPage {
	searchParams: Promise<{ success?: string }>
}

export const metadata: Metadata = {
	title: 'Removed From Organization',
}

const RemovedFromOrganizationPage = async ({ searchParams }: RemovedFromOrganizationPage) => {
	const { success } = await searchParams
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	// Get remaining memberships
	const memberships = await prisma.member.findMany({
		where: { userId: session.user.id },
		include: { organization: true },
	})

	return (
		<>
			{success && <SuccessToast message={decodeURIComponent(success)} />}
			<RemovedFromOrganization memberships={memberships} />
		</>
	)
}

export default RemovedFromOrganizationPage
