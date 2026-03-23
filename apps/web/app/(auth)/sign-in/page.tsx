import { Metadata } from 'next'
import { SignInForm } from './sign-in-form'

export const metadata: Metadata = {
	title: 'Account sign in',
}

const SignInPage = async ({ searchParams }: { searchParams: Promise<{ callbackURL: string }> }) => {
	const { callbackURL } = await searchParams
	return <SignInForm callbackURL={callbackURL} />
}

export default SignInPage
