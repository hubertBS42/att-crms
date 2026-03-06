import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { APP_DESCRIPTION, APP_NAME } from '@/constants'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		template: `%s - ${APP_NAME}`,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute={'class'}
					defaultTheme='system'
					enableSystem
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
