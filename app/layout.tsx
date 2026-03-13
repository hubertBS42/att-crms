import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import { APP_DESCRIPTION, APP_NAME } from '@/constants'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
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
			className={cn('font-sans', inter.variable)}
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute={'class'}
					defaultTheme='system'
					enableSystem
				>
					<TooltipProvider>
						{children}
						<Toaster />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
