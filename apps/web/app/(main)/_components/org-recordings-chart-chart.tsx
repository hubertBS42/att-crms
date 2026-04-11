'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useIsMobile } from '@/hooks/use-mobile'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DataResponse, OrgRecordingsOverTimeData } from '@/interfaces'
import { use, useEffect, useMemo, useState } from 'react'

interface OrgRecordingsChartProps {
	data: Promise<DataResponse<OrgRecordingsOverTimeData[]>>
}

const chartConfig = {
	count: {
		label: 'Recordings',
		color: 'var(--primary)',
	},
} satisfies ChartConfig

const OrgRecordingsChart = ({ data }: OrgRecordingsChartProps) => {
	const response = use(data)
	const isMobile = useIsMobile()
	const [timeRange, setTimeRange] = useState('90d')

	useEffect(() => {
		if (isMobile) {
			setTimeRange('7d')
		}
	}, [isMobile])

	const recordingsData = useMemo(() => {
		return response.success ? response.data : []
	}, [response])

	const filteredData = useMemo(() => {
		const referenceDate = new Date()
		let daysToSubtract = 90
		if (timeRange === '30d') daysToSubtract = 30
		else if (timeRange === '7d') daysToSubtract = 7

		const startDate = new Date(referenceDate)
		startDate.setDate(startDate.getDate() - daysToSubtract)
		return recordingsData.filter(item => new Date(item.date) >= startDate)
	}, [recordingsData, timeRange])

	const totalRecordings = filteredData.reduce((sum, item) => sum + item.count, 0)

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Recordings Over Time</CardTitle>
				<CardDescription>
					<span className='hidden @[540px]/card:block'>{totalRecordings.toLocaleString()} recordings in the selected period</span>
					<span className='@[540px]/card:hidden'>{totalRecordings.toLocaleString()} recordings</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type='single'
						value={timeRange}
						onValueChange={setTimeRange}
						variant='outline'
						className='hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex'
					>
						<ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
						<ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
						<ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
					</ToggleGroup>
					<Select
						value={timeRange}
						onValueChange={setTimeRange}
					>
						<SelectTrigger
							className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
							size='sm'
							aria-label='Select a value'
						>
							<SelectValue placeholder='Last 3 months' />
						</SelectTrigger>
						<SelectContent className='rounded-xl'>
							<SelectItem
								value='90d'
								className='rounded-lg'
							>
								Last 3 months
							</SelectItem>
							<SelectItem
								value='30d'
								className='rounded-lg'
							>
								Last 30 days
							</SelectItem>
							<SelectItem
								value='7d'
								className='rounded-lg'
							>
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-62.5 w-full'
				>
					<BarChart
						data={filteredData}
						barSize={timeRange === '7d' ? 32 : timeRange === '30d' ? 12 : 4}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={value =>
								new Date(value).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})
							}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							allowDecimals={false}
							width={30}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={value =>
										new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										})
									}
									indicator='dot'
								/>
							}
						/>
						<Bar
							dataKey='count'
							fill='var(--color-count)'
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default OrgRecordingsChart
