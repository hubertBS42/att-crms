import { Metadata } from 'next'
import OrganizationHeader from './_components/organization-header'

export const metadata: Metadata = {
	title: 'Organization Overview',
}

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='flex flex-col gap-y-6'>
			<OrganizationHeader />
			{children}
		</main>
	)
}

export default OrganizationLayout
