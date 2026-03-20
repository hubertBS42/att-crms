'use client'

import { Button } from '@/components/ui/button'
import { Recording } from '@/lib/generated/prisma/client'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const DownloadRecording = ({ recording }: { recording: Recording }) => {
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownload = async () => {
		try {
			setIsDownloading(true)

			const response = await fetch(`/api/recordings/${recording.id}/download`)

			if (!response.ok) {
				toast.error('Failed to download recording')
				return
			}

			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = recording.filename
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('Failed to download recording')
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<Button
			variant='outline'
			className='w-full'
			onClick={handleDownload}
			disabled={isDownloading}
		>
			<Download className='size-4' />
			{isDownloading ? 'Downloading...' : 'Download'}
		</Button>
	)
}

export default DownloadRecording
