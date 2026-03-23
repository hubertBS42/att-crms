import { existsSync, rmSync } from 'fs'
import { join } from 'path'

const monorepoRoot = process.cwd()

const targets = [
	// Root
	'node_modules',
	// Apps
	'apps/web/node_modules',
	'apps/web/.next',
	'apps/watcher/node_modules',
	'apps/watcher/dist',
	// Packages
	'packages/database/node_modules',
	'packages/database/dist',
	'packages/database/generated',
	'packages/typescript-config/node_modules',
	'packages/eslint-config/node_modules',
	// Dist
	'dist',
]

for (const target of targets) {
	const fullPath = join(monorepoRoot, target)
	if (existsSync(fullPath)) {
		console.log(`Removing ${target}...`)
		rmSync(fullPath, { recursive: true, force: true })
	}
}

console.log('✅ Clean complete')
