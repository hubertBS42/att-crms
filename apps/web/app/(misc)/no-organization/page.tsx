import { APP_NAME } from '@/constants'
import { Building2 } from 'lucide-react'
import SignOutButton from '@/components/sign-out-button'

const NoOrganizationPage = () => {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='grid gap-6 text-center max-w-md w-full p-6'>
				<div className='flex justify-center'>
					<Building2 className='size-16 text-muted-foreground' />
				</div>
				<div className='grid gap-2'>
					<h1 className='text-2xl font-bold'>No Organization</h1>
					<p className='text-muted-foreground text-sm'>
						You are not a member of any organization on {APP_NAME}. Please contact your administrator to be added to an organization.
					</p>
				</div>
				<SignOutButton />
			</div>
		</div>
	)
}

export default NoOrganizationPage
