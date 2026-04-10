'use client'

import { Member, Organization } from '@att-crms/db/client'
import { useOrganizationSwitcher } from '@/hooks/use-org-switch'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/sign-out-button'

type MemberWithOrganization = Member & { organization: Organization }

const RemovedFromOrganization = ({ memberships }: { memberships: MemberWithOrganization[] }) => {
	const { switchOrganization, isSwitching } = useOrganizationSwitcher()

	const hasOtherOrgs = memberships.length > 0

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='grid gap-6 text-center max-w-md w-full p-6'>
				<div className='flex justify-center'>
					<ShieldX className='size-16 text-destructive' />
				</div>
				<div className='grid gap-2'>
					<h1 className='text-2xl font-bold'>Removed From Organization</h1>
					<p className='text-muted-foreground text-sm'>
						You have been removed from this organization.
						{hasOtherOrgs ? ' You can switch to another organization or sign out.' : ' You no longer have access to any organizations.'}
					</p>
				</div>

				{hasOtherOrgs && (
					<div className='grid gap-2'>
						<p className='text-sm font-medium'>Switch to another organization:</p>
						{memberships.map(membership => (
							<Button
								key={membership.id}
								variant='outline'
								disabled={isSwitching}
								onClick={() => switchOrganization({ organizationId: membership.organizationId })}
							>
								{membership.organization.name}
							</Button>
						))}
					</div>
				)}

				<SignOutButton variant='outline' />
			</div>
		</div>
	)
}

export default RemovedFromOrganization
