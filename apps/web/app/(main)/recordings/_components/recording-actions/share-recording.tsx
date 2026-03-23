'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Recording } from '@att-crms/db/client'
import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { APP_URL } from '@/constants'

const ShareRecording = ({ recording }: { recording: Recording }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [copied, setCopied] = useState(false)

	const shareUrl = `${APP_URL}/api/recordings/${recording.id}/stream`

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			toast.success('Link copied to clipboard')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Failed to copy link')
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='w-full'
				>
					<Share2 className='size-4' />
					Share
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Recording</DialogTitle>
					<DialogDescription>Copy the link below to share this recording.</DialogDescription>
				</DialogHeader>
				<div className='flex gap-2'>
					<Input
						value={shareUrl}
						readOnly
						className='font-mono text-xs'
					/>
					<Button
						variant='outline'
						size='icon'
						onClick={handleCopy}
					>
						{copied ? <Check className='size-4' /> : <Copy className='size-4' />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ShareRecording
