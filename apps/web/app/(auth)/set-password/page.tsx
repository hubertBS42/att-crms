import { Metadata } from 'next'
import { SetPasswordForm } from './set-password-form'
import TokenError from './token-error'

export const metadata: Metadata = {
	title: 'Set a new password',
}
const SetPasswordPage = async ({ searchParams }: { searchParams: Promise<{ token: string; action: string }> }) => {
	const { token, action } = await searchParams
	if (!token) return <TokenError />
	return (
		<SetPasswordForm
			action={action}
			token={token}
		/>
	)
}

export default SetPasswordPage
