import { cpSync, existsSync, mkdirSync, rmSync, renameSync, writeFileSync } from 'fs'
import { join } from 'path'

// eslint-disable-next-line no-undef
const root = process.cwd()
const monorepoRoot = join(root, '..', '..')
const nextDir = join(root, '.next')
const standaloneDir = join(nextDir, 'standalone')
const distDir = join(monorepoRoot, 'dist')

if (!existsSync(standaloneDir)) {
	console.error('Standalone directory not found. Make sure output: "standalone" is set in next.config.ts')
	// eslint-disable-next-line no-undef
	process.exit(1)
}

// Clean previous dist
if (existsSync(distDir)) {
	console.log('Cleaning previous dist...')
	rmSync(distDir, { recursive: true, force: true })
}

mkdirSync(distDir, { recursive: true })

// Copy static assets
console.log('Copying static assets...')
cpSync(join(nextDir, 'static'), join(standaloneDir, 'apps', 'web', '.next', 'static'), { recursive: true })

// Copy public folder
if (existsSync(join(root, 'public'))) {
	console.log('Copying public folder...')
	cpSync(join(root, 'public'), join(standaloneDir, 'apps', 'web', 'public'), { recursive: true })
}

// Copy standalone output directly to dist
console.log('Copying standalone output...')
cpSync(standaloneDir, distDir, { recursive: true })

// Remove unnecessary folders
console.log('Cleaning up unnecessary folders...')
for (const item of ['node_modules', 'packages', 'package.json']) {
	const target = join(distDir, item)
	if (existsSync(target)) {
		rmSync(target, { recursive: true, force: true })
	}
}

// Rename apps/web to web and remove apps folder
console.log('Restructuring output...')
renameSync(join(distDir, 'apps', 'web'), join(distDir, 'web'))
rmSync(join(distDir, 'apps'), { recursive: true, force: true })

// Move server.js into web folder
if (existsSync(join(distDir, 'server.js'))) {
	renameSync(join(distDir, 'server.js'), join(distDir, 'web', 'server.js'))
}

// Copy .env
console.log('Copying .env...')
cpSync(join(monorepoRoot, '.env'), join(distDir, '.env'), { recursive: true })

// Generate ecosystem.config.cjs
console.log('Generating ecosystem.config.cjs...')
const ecosystem = `
module.exports = {
  apps: [
    {
      name: 'att-crms-web',
      script: './web/server.js',
      node_args: "--env-file=.env"
    },
    {
      name: 'att-crms-watcher',
      script: './watcher/dist/index.js',
      watch: false,
      autorestart: true,
      restart_delay: 3000,
      node_args: "--env-file=.env"
    },
  ],
}
`

writeFileSync(join(distDir, 'ecosystem.config.cjs'), ecosystem)

console.log('✅ Web post-build complete')
console.log('\nDist structure:')
console.log('  dist/')
console.log('  ├── web/                  ← Next.js server')
console.log('  │   ├── server.js')
console.log('  │   ├── .next/')
console.log('  │   └── public/')
console.log('  ├── .env')
console.log('  └── ecosystem.config.cjs  ← PM2 config')
