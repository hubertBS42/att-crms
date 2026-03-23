import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'

export default function DashboardPage() {
	return (
		<div className='grid gap-4 md:gap-6'>
			<SectionCards />
			<ChartAreaInteractive />
		</div>
	)
}
