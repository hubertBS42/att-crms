import { Metadata } from 'next'
import EditOrganizationForm from './edit-organization-form'
import { getOrganizationById } from '@/lib/data/organizations.server.data'
import { Suspense } from 'react'
import Loader from '@/components/loader'

export const metadata: Metadata = {
	title: 'Edit organization',
}

type Props = {
	params: Promise<{ id: string }>
}

const EditOrganizationPage = async ({ params }: Props) => {
	const { id } = await params
	const data = getOrganizationById(id)
	return (
		<Suspense fallback={<Loader />}>
			<EditOrganizationForm data={data} />
		</Suspense>
	)
}

export default EditOrganizationPage
