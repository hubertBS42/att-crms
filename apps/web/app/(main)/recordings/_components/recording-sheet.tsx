'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Recording } from '@att-crms/db/client'
import { formatDuration, formatSize } from '@/lib/utils'
import { format } from 'date-fns'
import AudioPlayer from './audio-player'
import RecordingActions from './recording-actions'

interface RecordingSheetProps {
	recording: Recording | null
	isOpen: boolean
	onClose: () => void
}

const RecordingSheet = ({ recording, isOpen, onClose }: RecordingSheetProps) => {
	if (!recording) return null

	return (
		<Sheet
			open={isOpen}
			onOpenChange={onClose}
		>
			<SheetContent className='min-w-full sm:min-w-125'>
				<SheetHeader>
					<SheetTitle className='text-lg'>Call Recording</SheetTitle>
					<SheetDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit</SheetDescription>
				</SheetHeader>

				<div className='grid gap-6 mt-6 px-4'>
					{/* Audio player */}
					<AudioPlayer src={`/api/recordings/${recording.id}/stream`} />

					{/* Metadata */}
					<div className='grid grid-cols-2 gap-4 text-sm'>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Call date</p>
							<p className='font-medium'>{format(new Date(recording.callDate), 'LLL dd, y')}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Call time</p>
							<p className='font-medium font-mono'>{recording.callTime}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Caller</p>
							<p className='font-medium'>{recording.caller}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Number called</p>
							<p className='font-medium'>{recording.calledNumber}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Answered by</p>
							<p className='font-medium'>{recording.answeredBy}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Duration</p>
							<p className='font-medium font-mono'>{formatDuration(recording.duration, 'timestamp')}</p>
						</div>
						<div className='grid gap-1'>
							<p className='text-xs text-muted-foreground'>Size</p>
							<p className='font-medium'>{formatSize(recording.size)}</p>
						</div>
					</div>
					<RecordingActions
						onClose={onClose}
						recording={recording}
					/>
				</div>
			</SheetContent>
		</Sheet>
	)
}

export default RecordingSheet
