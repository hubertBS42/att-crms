import { APP_LOGO, APP_NAME, INVITATION_EXPIRATON } from '@/constants'
import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components'
import { formatDuration } from '../utils'

interface InviteMemberEmailProps {
	name: string
	inviterName: string
	organizationName: string
	role: string
	url: string
}

const InviteMemberEmail = ({ name, inviterName, organizationName, role, url }: InviteMemberEmailProps) => {
	const previewText = `${inviterName} invited you to join ${organizationName} on ${APP_NAME}`

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
								src={APP_LOGO}
								width='48'
								height='48'
								alt={APP_NAME}
								className='mx-auto'
							/>
						</Section>

						{/* Body */}
						<Section className='bg-white px-10 py-8'>
							<Heading className='text-[#18181b] text-xl font-semibold m-0 mb-2'>You&apos;ve been invited</Heading>
							<Text className='text-[#71717a] text-sm leading-relaxed mt-0'>
								Hi {name}, <strong className='text-[#18181b]'>{inviterName}</strong> has invited you to join <strong className='text-[#18181b]'>{organizationName}</strong> on{' '}
								{APP_NAME} as a <strong className='text-[#18181b]'>{role}</strong>.
							</Text>

							<Section className='my-8 text-center'>
								<Button
									href={url}
									className='bg-[#18181b] text-white text-sm font-medium py-3 px-6 rounded-lg no-underline'
								>
									Accept Invitation
								</Button>
							</Section>

							<Hr className='border-[#e4e4e7] my-6' />

							<Text className='text-[#71717a] text-xs leading-relaxed'>
								This invitation will expire in <strong>{formatDuration(INVITATION_EXPIRATON)}</strong>. If you weren&apos;t expecting this invitation, you can safely ignore this
								email.
							</Text>

							<Text className='text-xs text-[#71717a] mt-0'>If the button above doesn&apos;t work, copy and paste this URL into your browser:</Text>
							<Text className='text-xs text-[#18181b] break-all mt-0'>{url}</Text>
						</Section>

						{/* Footer */}
						<Section className='bg-[#fafafa] rounded-b-xl border border-t-0 border-[#e4e4e7] px-10 py-6'>
							<Text className='text-[#a1a1aa] text-xs text-center m-0'>
								© {new Date().getFullYear()} {APP_NAME}. All rights reserved.
							</Text>
							<Text className='text-[#a1a1aa] text-xs text-center m-0 mt-1'>
								You&apos;re receiving this email because {inviterName} invited you to {organizationName}.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default InviteMemberEmail
