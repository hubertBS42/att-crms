import { getUserById } from '@/lib/data/users.data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EditOrgUserForm from '../../_components/edit-org-user-form'
import EditAdminForm from '../../_components/edit-admin-form'

export const metadata: Metadata = {
	title: 'Edit user',
}

interface EditUserPageProps {
	params: Promise<{ id: string }>
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
	const { id } = await params
	const response = await getUserById(id)
	if (!response.success) throw new Error(response.error)
	if (!response.data) notFound()

	const user = response.data

	if (user.role === 'user') {
		return <EditOrgUserForm user={user} />
	}

	return <EditAdminForm user={user} />
	return <></>
}
export default EditUserPage
