import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

const NotFoundPage = () => {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='grid gap-6 text-center max-w-md w-full p-6'>
				<div className='flex justify-center'>
					<FileQuestion className='size-16 text-muted-foreground' />
				</div>
				<div className='grid gap-2'>
					<h1 className='text-2xl font-bold'>Page Not Found</h1>
					<p className='text-muted-foreground text-sm'>The page you are looking for does not exist or has been moved.</p>
				</div>
				<div className='flex gap-3 justify-center'>
					<Button asChild>
						<Link href='/'>Go Home</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage
