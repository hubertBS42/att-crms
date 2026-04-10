import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Organization } from '@att-crms/db/client'
import DeleteOrganization from './delete-organization'
import LeaveOrganization from './leave-organization'

interface OrganizationActionsProps {
	organization: Organization
	isPlatformStaff: boolean
}

const OrganizationActions = ({ organization, isPlatformStaff }: OrganizationActionsProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Actions</CardTitle>
				<CardDescription>{isPlatformStaff ? 'Permanently delete this organization and all its data.' : 'Leave this organization.'}</CardDescription>
			</CardHeader>
			<CardContent>{isPlatformStaff ? <DeleteOrganization organization={organization} /> : <LeaveOrganization />} </CardContent>
		</Card>
	)
}
export default OrganizationActions
