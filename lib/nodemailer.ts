import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { APP_NAME } from '@/constants'

// Create a transporter object
export const transporter = nodemailer.createTransport({
	host: process.env.SITE_MAILER_HOST,
	port: Number(process.env.SITE_MAILER_PORT),
	auth: {
		user: process.env.SITE_MAILER_EMAIL,
		pass: process.env.SITE_MAILER_PASSWORD,
	},
})

// Helper function to send emails
export async function sendEmail({ to, subject, reactTemplate }: { to: string; subject: string; reactTemplate: React.ReactElement }) {
	try {
		// Render React component to HTML
		const html = await render(reactTemplate)

		// Render React component to plain text (for email clients that don't support HTML)
		const text = await render(reactTemplate, { plainText: true })

		const info = await transporter.sendMail({
			from: `${APP_NAME} <${process.env.SITE_MAILER_EMAIL}>`,
			to,
			subject,
			html,
			text,
		})

		console.log('Email sent:', info.messageId)
		return { success: true, messageId: info.messageId }
	} catch (error) {
		console.error('Email error:', error)
		return { success: false, error }
	}
}
