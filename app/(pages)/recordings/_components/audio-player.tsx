'use client'
import {
	MediaController,
	MediaControlBar,
	MediaTimeRange,
	MediaTimeDisplay,
	MediaVolumeRange,
	MediaPlayButton,
	MediaMuteButton,
	MediaPlaybackRateButton,
} from 'media-chrome/react'

interface AudioPlayerProps {
	src: string
	showDuration?: boolean
}
const AudioPlayer = ({ src, showDuration = true }: AudioPlayerProps) => {
	return (
		<MediaController audio>
			<audio
				slot='media'
				src={src}
				preload='auto'
				crossOrigin=''
				autoPlay
			/>
			<MediaControlBar className='w-full px-3 rounded-md bg-card'>
				<MediaPlayButton className='bg-transparent mr-3' />

				<MediaTimeDisplay
					showDuration={showDuration}
					className='bg-transparent'
				/>
				<MediaTimeRange className='bg-transparent' />
				<MediaPlaybackRateButton className='bg-transparent' />
				<MediaMuteButton className='bg-transparent' />
				<MediaVolumeRange className='bg-transparent' />
			</MediaControlBar>
		</MediaController>
	)
}

export default AudioPlayer
