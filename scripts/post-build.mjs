// scripts/post-build.mjs
import { cpSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const nextDir = join(root, '.next')
const standaloneDir = join(nextDir, 'standalone')

if (!existsSync(standaloneDir)) {
	console.error('Standalone directory not found. Make sure output: "standalone" is set in next.config.ts')
	process.exit(1)
}

// Copy static assets
console.log('Copying static assets...')
cpSync(join(nextDir, 'static'), join(standaloneDir, '.next', 'static'), { recursive: true })

// Copy public folder
if (existsSync(join(root, 'public'))) {
	console.log('Copying public folder...')
	cpSync(join(root, 'public'), join(standaloneDir, 'public'), { recursive: true })
}

// Copy prisma schema and migrations
console.log('Copying prisma...')
cpSync(join(root, 'prisma'), join(standaloneDir, 'prisma'), { recursive: true })

// Copy generated prisma client
console.log('Copying generated prisma client...')
mkdirSync(join(standaloneDir, 'lib', 'generated'), { recursive: true })
cpSync(join(root, 'lib', 'generated', 'prisma'), join(standaloneDir, 'lib', 'generated', 'prisma'), { recursive: true })

console.log('✅ Post-build copy complete')
