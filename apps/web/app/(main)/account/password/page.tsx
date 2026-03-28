import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UpdatePasswordForm from '../_components/update-password-form'

export const dynamic = 'force-dynamic'

const PasswordPage = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>Change your password. You will be required to enter your current password to confirm.</CardDescription>
			</CardHeader>
			<CardContent>
				<UpdatePasswordForm />
			</CardContent>
		</Card>
	)
}

export default PasswordPage
