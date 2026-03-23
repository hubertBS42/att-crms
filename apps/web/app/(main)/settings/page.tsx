import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/utils'
import { format } from 'date-fns'
import DeleteOrganization from './_components/delete-organization'
import { prisma } from '@att-crms/db'

const SettingsPage = async () => {
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
		<div className='grid gap-y-6'>
			{/* Header */}
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Settings</h1>
				<p className='text-muted-foreground text-sm'>Manage your organization settings.</p>
			</div>

			<div className='grid items-start gap-4 lg:grid-cols-3'>
				{/* Left column */}
				<div className='lg:col-span-2 grid gap-4'>
					{/* Organization details */}
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
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right column */}
				{isPlatformStaff && (
					<Card className='border-destructive'>
						<CardHeader>
							<CardTitle>Actions</CardTitle>
							<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
						</CardHeader>
						<CardContent>
							<DeleteOrganization organization={organization} />
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}

export default SettingsPage
