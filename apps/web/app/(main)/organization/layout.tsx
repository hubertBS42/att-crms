import { Metadata } from 'next'
import Header from './_components/header'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Organization Overview',
}

const OrganizationLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className='flex flex-col gap-y-6'>
			<Header />
			{children}
		</main>
	)
}

export default OrganizationLayout
