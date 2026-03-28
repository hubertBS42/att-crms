import { auth } from '@/lib/auth'
import { fetchGlobalRecordingsOverTime, fetchOrgRecordingsOverTime } from '@/lib/data/dashboard.data'
import { prisma } from '@att-crms/db'
import { headers } from 'next/headers'
import GlobalSectionCards from './_components/global-section-cards'
import OrgSectionCards from './_components/org-section-cards'
import { Suspense } from 'react'
import GlobalRecordingsChart from './_components/global-recordings-chart'
import OrgRecordingsChart from './_components/org-recordings-chart-chart'
import RecentActivities from './_components/recent-activities'
import SectionCardsSkeleton from './_components/section-cards-skeleton'
import RecentActivitiesSkeleton from './_components/recent-activities-skeleton'
import RecordingsChartSkeleton from './_components/recordings-chart-skeleton'

const DashboardPage = async () => {
	const session = await auth.api.getSession({ headers: await headers() })
	const activeOrganizationId = session?.session.activeOrganizationId

	const activeOrg = activeOrganizationId
		? await prisma.organization.findUnique({
				where: { id: activeOrganizationId },
				select: { slug: true },
			})
		: null

	const isGlobal = activeOrg?.slug === 'global'

	const orgRecordingsData = fetchOrgRecordingsOverTime()
	const globalRecordingsData = fetchGlobalRecordingsOverTime()

	return (
		<div className='grid gap-4 md:gap-6'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground text-sm'>{isGlobal ? 'Platform overview across all organizations.' : "Overview of your organization's call recordings."}</p>
			</div>
			<Suspense fallback={<SectionCardsSkeleton />}>{isGlobal ? <GlobalSectionCards /> : <OrgSectionCards />}</Suspense>

			<div className='grid lg:grid-cols-3 gap-4'>
				<div className='lg:col-span-2'>
					<Suspense fallback={<RecordingsChartSkeleton />}>
						{isGlobal ? <GlobalRecordingsChart data={globalRecordingsData} /> : <OrgRecordingsChart data={orgRecordingsData} />}
					</Suspense>
				</div>
				<Suspense fallback={<RecentActivitiesSkeleton />}>
					<RecentActivities />
				</Suspense>
			</div>
		</div>
	)
}

export default DashboardPage
