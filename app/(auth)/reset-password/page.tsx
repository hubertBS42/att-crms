import { Metadata } from 'next'
import { ResetPasswordForm } from './reset-password'

export const metadata: Metadata = {
	title: 'Reset your password',
}

const ResetPasswordPage = () => {
	return <ResetPasswordForm />
}

export default ResetPasswordPage
