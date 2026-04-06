import { cpSync, existsSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const monorepoRoot = join(root, '..', '..')
const distDir = join(monorepoRoot, 'dist')
const watcherDistDir = join(distDir, 'watcher')

if (!existsSync(distDir)) {
	console.error('Dist directory not found. Make sure the web app is built first.')
	process.exit(1)
}

// Clean previous watcher dist
if (existsSync(watcherDistDir)) {
	console.log('Cleaning previous watcher dist...')
	rmSync(watcherDistDir, { recursive: true, force: true })
}

mkdirSync(watcherDistDir, { recursive: true })

// Copy compiled watcher output
console.log('Copying watcher build...')
cpSync(join(root, 'dist'), join(watcherDistDir, 'dist'), { recursive: true })

// Copy package.json for dependencies reference
cpSync(join(root, 'package.json'), join(watcherDistDir, 'package.json'))

// Copy node_modules
console.log('Copying watcher node_modules...')
if (existsSync(join(root, 'node_modules'))) {
	cpSync(join(root, 'node_modules'), join(watcherDistDir, 'node_modules'), {
		recursive: true,
	})
}

// Copy .env if it exists
if (existsSync(join(root, '.env'))) {
	console.log('Copying watcher .env...')
	cpSync(join(root, '.env'), join(watcherDistDir, '.env'))
}

console.log('✅ Watcher post-build complete')
console.log('\nDist structure updated:')
console.log('  dist/')
console.log('  ├── web/                  ← Next.js server')
console.log('  ├── watcher/              ← Watcher process')
console.log('  │   ├── dist/             ← Compiled output')
console.log('  │   ├── node_modules/')
console.log('  │   ├── package.json')
console.log('  │   └── .env')
console.log('  └── ecosystem.config.cjs  ← PM2 config')
