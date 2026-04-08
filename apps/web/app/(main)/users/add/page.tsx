import { Metadata } from 'next'
import AddUserForm from './_components/add-user-form'

export const metadata: Metadata = {
	title: 'Add user',
}

const AddUserPage = () => {
	return <AddUserForm />
}

export default AddUserPage
