import { FilterConfig } from '@/components/data-table'

export const filters: FilterConfig[] = [
	{ key: 'callDate', label: 'Call Date', type: 'dateRange' },
	{ key: 'caller', label: 'Caller', type: 'text', placeholder: 'Search caller...' },
	{ key: 'calledNumber', label: 'Number Called', type: 'text', placeholder: 'Search number called...' },
	{ key: 'answeredBy', label: 'Answered By', type: 'text', placeholder: 'Search answered by...' },
]
