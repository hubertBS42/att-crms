import BackButton from './back-button'
import DiscardButton from './discard-button'
import SaveButton from './save-button'

interface ResourceFormFooterProps {
	isPending: boolean
	isDirty: boolean
	handleDiscard: () => Promise<void>
}
const ResourceFormFooter = ({ isPending, isDirty, handleDiscard }: ResourceFormFooterProps) => {
	return (
		<div className='flex items-center justify-center gap-2 md:hidden'>
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
	)
}
export default ResourceFormFooter
