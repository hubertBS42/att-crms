import { Metadata } from 'next'
import SettingsNav from './_components/settings-nav'

export const metadata: Metadata = {
	title: 'Settings',
}

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Settings</h1>
				<p className='text-muted-foreground text-sm'>Manage your organization settings.</p>
			</div>
			<SettingsNav />
			{children}
		</main>
	)
}

export default SettingsLayout
