import { APP_NAME } from '@/constants'

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
			<div className='flex w-full max-w-sm flex-col gap-6'>
				<a
					href='#'
					className='flex items-center gap-2 self-center font-medium'
				>
					{APP_NAME}
				</a>
				{children}
			</div>
		</div>
	)
}
