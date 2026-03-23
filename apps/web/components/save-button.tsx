'use client'

import { Save } from 'lucide-react'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'

const SaveButton = ({ isLoading, isDisabled }: { isLoading?: boolean; isDisabled?: boolean }) => {
	return (
		<Button
			size={'sm'}
			type='submit'
			disabled={isLoading || isDisabled}
		>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Save /> Save
				</>
			)}
		</Button>
	)
}

export default SaveButton
