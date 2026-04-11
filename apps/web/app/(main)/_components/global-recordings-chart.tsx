'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useIsMobile } from '@/hooks/use-mobile'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DataResponse, GlobalRecordingsOverTimeData } from '@/interfaces'
import { use, useEffect, useMemo, useState } from 'react'

interface GlobalRecordingsChartProps {
	data: Promise<DataResponse<GlobalRecordingsOverTimeData>>
}

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const GlobalRecordingsChart = ({ data }: GlobalRecordingsChartProps) => {
	const response = use(data)

	const isMobile = useIsMobile()
	const [timeRange, setTimeRange] = useState('90d')

	useEffect(() => {
		if (isMobile) setTimeRange('7d')
	}, [isMobile])

	const chartData = useMemo(() => {
		return response.success ? response.data.chartData : []
	}, [response])

	const organizations = useMemo(() => {
		return response.success ? response.data.organizations : []
	}, [response])

	const filteredData = useMemo(() => {
		const referenceDate = new Date()
		let daysToSubtract = 90
		if (timeRange === '30d') daysToSubtract = 30
		else if (timeRange === '7d') daysToSubtract = 7

		const startDate = new Date(referenceDate)
		startDate.setDate(startDate.getDate() - daysToSubtract)
		return chartData.filter(item => new Date(item.date) >= startDate)
	}, [chartData, timeRange])

	const chartConfig = useMemo(() => {
		return organizations.reduce<ChartConfig>((acc, org, index) => {
			acc[org.slug] = {
				label: org.name,
				color: COLORS[index % COLORS.length],
			}
			return acc
		}, {})
	}, [organizations])

	const totalRecordings = filteredData.reduce((sum, item) => {
		return sum + organizations.reduce((orgSum, org) => orgSum + ((item[org.slug] as number) ?? 0), 0)
	}, 0)

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Recordings Over Time</CardTitle>
				<CardDescription>
					<span className='hidden @[540px]/card:block'>{totalRecordings.toLocaleString()} recordings across all organizations</span>
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
						<ChartLegend content={<ChartLegendContent />} />
						{organizations.map((org, index) => (
							<Bar
								key={org.slug}
								dataKey={org.slug}
								stackId='a'
								fill={COLORS[index % COLORS.length]}
								radius={index === organizations.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
							/>
						))}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default GlobalRecordingsChart
