import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
// import { OrganizationPlan } from '@/lib/generated/prisma/enums'

async function main() {
	// Clear database
	await prisma.recording.deleteMany()
	await prisma.invitation.deleteMany()
	await prisma.member.deleteMany()
	await prisma.organization.deleteMany()
	await prisma.session.deleteMany()
	await prisma.account.deleteMany()
	await prisma.user.deleteMany()

	console.log('Database cleared')

	// Create Global workspace first
	const globalWorkspace = await prisma.organization.create({
		data: {
			name: 'Global',
			slug: 'global',
		},
	})

	// Create your company's organization
	// const yourCompany = await prisma.organization.create({
	// 	data: {
	// 		name: 'AT Telecommunications',
	// 		slug: 'at-telecommunications', // must match FTP folder
	// 		plan: OrganizationPlan.ENTERPRISE,
	// 	},
	// })

	// Create superAdmin (you)
	const superAdmin = await auth.api.signUpEmail({
		body: {
			name: process.env.SEED_SUPERADMIN_NAME!,
			email: process.env.SEED_SUPERADMIN_EMAIL!,
			password: process.env.SEED_SUPERADMIN_PASSWORD!,
		},
	})

	// Promote to superAdmin role
	await prisma.user.update({
		where: { email: process.env.SEED_SUPERADMIN_EMAIL! },
		data: { role: 'superAdmin' },
	})

	// SuperAdmin is member of Global workspace
	await prisma.member.create({
		data: {
			userId: superAdmin.user.id,
			organizationId: globalWorkspace.id,
			role: 'owner',
		},
	})

	// SuperAdmin is also member of your company's org
	// await prisma.member.create({
	// 	data: {
	// 		userId: superAdmin.user.id,
	// 		organizationId: yourCompany.id,
	// 		role: 'owner',
	// 	},
	// })

	// -----------------------------------------------
	// CLIENT ORGANIZATIONS
	// -----------------------------------------------

	// const clients = [
	// 	{ name: 'Acme Corp', slug: 'acme-corp', ownerEmail: 'admin@acme.com', ownerName: 'Acme Admin', plan: OrganizationPlan.ENTERPRISE },
	// 	{ name: 'Globex', slug: 'globex', ownerEmail: 'admin@globex.com', ownerName: 'Globex Admin', plan: OrganizationPlan.BASIC },
	// ]

	// for (const client of clients) {
	// 	// Create client organization
	// 	const org = await prisma.organization.create({
	// 		data: {
	// 			name: client.name,
	// 			slug: client.slug,
	// 			plan: client.plan,
	// 		},
	// 	})

	// 	// Add superAdmin as an owner of client org
	// 	await prisma.member.create({
	// 		data: {
	// 			userId: superAdmin.user.id,
	// 			organizationId: org.id,
	// 			role: 'owner',
	// 		},
	// 	})
	// 	// Create account for each client
	// 	const clientAccount = await auth.api.signUpEmail({
	// 		body: {
	// 			name: client.ownerName,
	// 			email: client.ownerEmail,
	// 			password: 'securepassword',
	// 		},
	// 	})

	// 	// Add client as owner of their org
	// 	await prisma.member.create({
	// 		data: {
	// 			userId: clientAccount.user.id,
	// 			organizationId: org.id,
	// 			role: 'owner',
	// 		},
	// 	})

	// 	console.log(`Created org: ${client.name} with owner: ${client.ownerEmail}`)
	// }

	console.log('Seed complete')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
