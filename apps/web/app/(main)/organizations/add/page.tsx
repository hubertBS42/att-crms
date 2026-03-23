import { Metadata } from 'next'
import AddOrganizationForm from './add-organization-form'

export const metadata: Metadata = {
	title: 'Add organization',
}
const AddOrganizationPage = () => {
	return <AddOrganizationForm />
}

export default AddOrganizationPage
