'use client'
import { Button } from '@/components/ui/button'

export default function HomePage() {
	const sayHello = () => alert('Hello')
	return (
		<div>
			<h1>Home Page</h1>
			<Button onClick={sayHello}>Greet</Button>
		</div>
	)
}
