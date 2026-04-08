import { Metadata } from 'next'
import { ResetPasswordForm } from './_components/reset-password-form'

export const metadata: Metadata = {
	title: 'Reset your password',
}

const ResetPasswordPage = () => {
	return <ResetPasswordForm />
}

export default ResetPasswordPage
