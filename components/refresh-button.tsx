'use client'

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const RefreshButton = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleRefresh = () => {
		startTransition(() => {
			router.refresh()
		})
	}

	return (
		<Button
			variant='outline'
			size='sm'
			onClick={handleRefresh}
			disabled={isPending}
		>
			{isPending ? <Spinner /> : <RefreshCw className='size-4' />}
			Refresh
		</Button>
	)
}

export default RefreshButton
