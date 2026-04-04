import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { logActivity, prisma } from '@att-crms/db'
import { APP_NAME, APP_URL, INVITATION_EXPIRATON, RECORDINGS_PATH, RESET_PASSWORD_TOKEN_EXPIRATON, SESSION_CACHE_EXPIRATION } from '@/constants'
import SetPasswordEmail from '@/components/email-templates/set-password-email'
import ResetPasswordEmail from '@/components/email-templates/reset-password-email'
import PasswordUpdatedEmail from '@/components/email-templates/password-updated-email'
import { sendEmail } from './nodemailer'
import { admin, organization } from 'better-auth/plugins'
import { systemAccessController, systemLevelRoles } from './permissions/system-permissions'
import { orgAccessController, organizationLevelRoles } from './permissions/org-permissions'
import InviteMemberEmail from '@/components/email-templates/invite-member-email'
import path from 'path'
import fs from 'fs'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: true,
		minPasswordLength: 6,
		maxPasswordLength: 128,
		resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRATON,
		sendResetPassword: async ({ user, url }) => {
			const resetUrl = new URL(url)
			const callbackURL = resetUrl.searchParams.get('callbackURL')

			let action = 'reset'

			if (callbackURL) {
				try {
					const callbackUrl = new URL(callbackURL, resetUrl.origin)
					action = callbackUrl.searchParams.get('action') || 'reset'
				} catch (error) {
					console.error('Failed to parse callbackURL:', error)
				}
			}

			if (action === 'set') {
				await sendEmail({
					to: user.email,
					subject: `You've been invited to ${APP_NAME} — set your password`,
					reactTemplate: SetPasswordEmail({ name: user.name, url }),
				})
			} else {
				await sendEmail({
					to: user.email,
					subject: `Reset your ${APP_NAME} password`,
					reactTemplate: ResetPasswordEmail({ name: user.name, url }),
				})
			}
		},

		onPasswordReset: async ({ user }) => {
			await sendEmail({
				to: user.email,
				subject: 'Your password has been updated!',
				reactTemplate: PasswordUpdatedEmail({ name: user.name }),
			})
		},
		revokeSessionsOnPasswordReset: true,
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: SESSION_CACHE_EXPIRATION,
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	plugins: [
		admin({
			ac: systemAccessController,
			roles: systemLevelRoles,
		}),
		organization({
			ac: orgAccessController,
			roles: organizationLevelRoles,
			invitationExpiresIn: INVITATION_EXPIRATON,
			async sendInvitationEmail(data) {
				const inviteLink = `${APP_URL}/accept-invitation/${data.id}`

				await sendEmail({
					to: data.email,
					subject: `You've been invited to join ${data.organization.name} on ${APP_NAME}`,
					reactTemplate: InviteMemberEmail({
						inviterName: data.inviter.user.name,
						name: data.email,
						organizationName: data.organization.name,
						role: data.role,
						url: inviteLink,
					}),
				})
			},
			organizationHooks: {
				afterCreateOrganization: async ({ organization, user }) => {
					// Fix the creator's role — better-auth assigns owner by default
					// but admin users should only get admin org role
					const creator = await prisma.user.findUnique({
						where: { id: user.id },
						select: { role: true },
					})

					if (creator?.role === 'admin') {
						// Downgrade creator from owner to admin
						await prisma.member.updateMany({
							where: {
								userId: user.id,
								organizationId: organization.id,
							},
							data: { role: 'admin' },
						})
					}

					// Fetch all other system admins
					const systemAdmins = await prisma.user.findMany({
						where: {
							role: { in: ['superAdmin', 'admin'] },
							id: { not: user.id },
						},
					})

					// Add all other system admins as members of the new org
					await prisma.member.createMany({
						data: systemAdmins.map(systemAdmin => ({
							userId: systemAdmin.id,
							organizationId: organization.id,
							role: systemAdmin.role === 'superAdmin' ? 'owner' : 'admin',
						})),
						skipDuplicates: true,
					})

					// Create a directory for the organization in the recordings directory
					const orgDirectory = path.join(RECORDINGS_PATH, organization.slug)

					if (!fs.existsSync(orgDirectory)) {
						fs.mkdirSync(orgDirectory, { recursive: true })
						// Set ownership to sftpuser group so they can write to it
						// This requires the app user to have sudo privileges or be in the same group
						fs.chmodSync(orgDirectory, 0o775) // rwxrwxr-x — group can write
						console.log(`Created directory: ${orgDirectory}`)
					}

					await logActivity({
						type: 'CREATE',
						resource: 'ORGANIZATION',
						actorName: user.name,
						actorId: user.id,
						targetName: organization.name,
						targetId: organization.id,
					})
				},
				afterUpdateOrganization: async ({ organization, user }) => {
					const metadata = organization?.metadata as { previousSlug?: string } | null
					const previousSlug = metadata?.previousSlug

					if (previousSlug && previousSlug !== organization?.slug) {
						const oldDirectory = path.join(RECORDINGS_PATH, previousSlug)
						const newDirectory = path.join(RECORDINGS_PATH, organization?.slug ?? '')

						if (fs.existsSync(oldDirectory)) {
							fs.renameSync(oldDirectory, newDirectory)
							console.log(`Renamed directory: ${oldDirectory} → ${newDirectory}`)
						}

						// Update all recording filePaths in the database
						const recordings = await prisma.recording.findMany({
							where: { organizationSlug: previousSlug },
						})

						await Promise.all(
							recordings.map(recording =>
								prisma.recording.update({
									where: { id: recording.id },
									data: {
										filePath: recording.filePath.replace(oldDirectory, newDirectory),
									},
								}),
							),
						)

						// Clean up previousSlug from metadata
						await prisma.organization.update({
							where: { id: organization?.id },
							data: {
								metadata: JSON.stringify({
									...((organization?.metadata as object) ?? {}),
									previousSlug: undefined,
								}),
							},
						})
					}

					await logActivity({
						type: 'UPDATE',
						resource: 'ORGANIZATION',
						actorName: user.name,
						actorId: user.id,
						targetName: organization?.name,
						targetId: organization?.id,
					})
				},
				beforeDeleteOrganization: async ({ organization }) => {
					const orgDirectory = path.join(RECORDINGS_PATH, organization.slug)

					// Delete all recording rows from the database first
					await prisma.recording.deleteMany({
						where: { organizationSlug: organization.slug },
					})

					// Delete the directory and all its contents
					if (fs.existsSync(orgDirectory)) {
						fs.rmSync(orgDirectory, { recursive: true, force: true })
						console.log(`Deleted directory: ${orgDirectory}`)
					}
				},
				afterDeleteOrganization: async ({ organization, user }) => {
					await logActivity({
						type: 'DELETE',
						resource: 'ORGANIZATION',
						actorName: user.name,
						actorId: user.id,
						targetName: organization?.name,
						targetId: organization?.id,
					})
				},
			},
			schema: {
				organization: {
					additionalFields: {
						plan: {
							type: 'string',
							input: true,
							required: true,
						},
						status: {
							type: 'string',
							input: true,
							required: true,
						},
					},
				},
			},
		}),
		nextCookies(),
	],
})

export type Session = typeof auth.$Infer.Session
