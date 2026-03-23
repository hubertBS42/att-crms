import BackButton from './back-button'
import DiscardButton from './discard-button'
import SaveButton from './save-button'

interface ResourceFormHeaderProps {
	heading: string
	description: string
	isPending: boolean
	isDirty: boolean
	handleDiscard: () => Promise<void>
}
const ResourceFormHeader = ({ heading, description, isPending, isDirty, handleDiscard }: ResourceFormHeaderProps) => {
	return (
		<div className='flex items-end'>
			<div className='grid'>
				<h1 className='text-xl md:text-2xl font-bold'>{heading}</h1>
				<p className='text-muted-foreground text-sm'>{description}</p>
			</div>
			<div className='hidden items-center gap-2 md:ml-auto md:flex'>
				{isDirty ? (
					<DiscardButton
						isLoading={isPending}
						handleDiscard={handleDiscard}
					/>
				) : (
					<BackButton
						link='/users'
						isLoading={isPending}
					/>
				)}
				<SaveButton
					isLoading={isPending}
					isDisabled={!isDirty}
				/>
			</div>
		</div>
	)
}
export default ResourceFormHeader
