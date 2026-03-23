import { Spinner } from './ui/spinner'

const Loader = () => {
	return (
		<div className='flex absolute justify-center items-center top-0 bottom-0 left-0 right-0'>
			<Spinner className='size-6' />
		</div>
	)
}

export default Loader
