import { Metadata } from 'next'
import { SignInForm } from './sign-in-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const metadata: Metadata = {
	title: 'Account sign in',
}

const SignInPage = async ({ searchParams }: { searchParams: Promise<{ callbackURL: string }> }) => {
	const { callbackURL } = await searchParams

	// await auth.api.signUpEmail({
	// 	body: {
	// 		email: 'hubert@attelecomms.co.uk',
	// 		name: 'Hubert Quarshie',
	// 		password: 'Dextro18',
	// 	},
	// 	headers: await headers(),
	// })
	return <SignInForm callbackURL={callbackURL} />
}

export default SignInPage
