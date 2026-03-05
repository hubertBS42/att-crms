// instrumentation.ts (in your project root)
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const { startWatcher } = await import('./lib/watcher')
		await startWatcher()
	}
}
