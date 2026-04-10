import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import { format } from 'date-fns'
import { prisma } from '@att-crms/db'
import OrganizationActions from './_components/organization-actions'

export const dynamic = 'force-dynamic'

const OrganizationOverviewPage = async () => {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	const activeOrganizationId = session.session.activeOrganizationId
	if (!activeOrganizationId) redirect('/')

	const organization = await prisma.organization.findUnique({
		where: { id: activeOrganizationId },
	})

	if (!organization) notFound()

	const isPlatformStaff = session.user.role === 'superAdmin' || session.user.role === 'admin'

	return (
		<div className='grid gap-4'>
			<Card>
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
					<CardDescription>General information about this organization</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Name</p>
							<p className='text-sm font-medium'>{organization.name}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Slug</p>
							<p className='text-sm font-medium font-mono'>{organization.slug}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Plan</p>
							<div>
								<Badge variant='secondary'>{capitalizeFirstLetter(organization.plan ?? 'N/A')}</Badge>
							</div>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Status</p>
							<div>
								<Badge variant={organization.status === 'ACTIVE' ? 'default' : organization.status === 'SUSPENDED' ? 'destructive' : 'outline'}>
									{capitalizeFirstLetter(organization.status?.toLowerCase() ?? 'N/A')}
								</Badge>
							</div>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Created on</p>
							<p className='text-sm font-medium'>{format(new Date(organization.createdAt), 'LLL dd, y')}</p>
						</div>
						{organization.retentionDays && (
							<div className='grid gap-1'>
								<p className='text-xs text-muted-foreground'>Recording Retention</p>
								<p className='text-sm font-medium'>
									{organization.retentionDays === 365 ? '1 year' : organization.retentionDays === 730 ? '2 years' : `${organization.retentionDays} days`}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<OrganizationActions
				organization={organization}
				isPlatformStaff={isPlatformStaff}
			/>
		</div>
	)
}

export default OrganizationOverviewPage
