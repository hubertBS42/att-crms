import { APP_NAME, APP_LOGO } from '@/constants'
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components'

interface PasswordUpdatedEmailProps {
	name: string
}

const PasswordUpdatedEmail = ({ name }: PasswordUpdatedEmailProps) => {
	const previewText = `Your ${APP_NAME} password has been updated`

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className='bg-[#f4f4f5] m-auto font-sans'>
					<Container className='mx-auto my-10 max-w-120'>
						{/* Header */}
						<Section className='bg-[#18181b] rounded-t-xl px-10 py-8 text-center'>
							<Img
								src={APP_LOGO.url}
								width='48'
								height='48'
								alt={APP_NAME}
								className='mx-auto'
							/>
						</Section>

						{/* Body */}
						<Section className='bg-white px-10 py-8'>
							<Heading className='text-[#18181b] text-xl font-semibold m-0 mb-2'>Password updated</Heading>
							<Text className='text-[#71717a] text-sm leading-relaxed mt-0'>
								Hi {name}, your {APP_NAME} account password was successfully updated.
							</Text>

							<Hr className='border-[#e4e4e7] my-6' />

							<Text className='text-[#71717a] text-xs leading-relaxed'>
								If you didn&apos;t make this change, please reset your password immediately or contact our support team — your account may have been compromised.
							</Text>
						</Section>

						{/* Footer */}
						<Section className='bg-[#fafafa] rounded-b-xl border border-t-0 border-[#e4e4e7] px-10 py-6'>
							<Text className='text-[#a1a1aa] text-xs text-center m-0'>
								© {new Date().getFullYear()} {APP_NAME}. All rights reserved.
							</Text>
							<Text className='text-[#a1a1aa] text-xs text-center m-0 mt-1'>You&apos;re receiving this email because your account password was recently changed.</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default PasswordUpdatedEmail
