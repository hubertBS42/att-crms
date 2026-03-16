import { getSystemAdminById } from '@/lib/data/users.data'
import { Metadata } from 'next'
import EditUserForm from './edit-user-form'
import { Suspense } from 'react'
import Loader from '@/components/loader'

export const metadata: Metadata = {
	title: 'Edit user',
}

type Props = {
	params: Promise<{ id: string }>
}

const EditUserPage = async ({ params }: Props) => {
	const { id } = await params
	const data = getSystemAdminById(id)
	return (
		<Suspense fallback={<Loader />}>
			<EditUserForm data={data} />
		</Suspense>
	)
}
export default EditUserPage
