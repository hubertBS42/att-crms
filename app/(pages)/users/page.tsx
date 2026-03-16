import Loader from '@/components/loader'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import UsersTable from './_components/users-table'
import { fetchSystemAdminUsers } from '@/lib/data/users.data'

export const metadata: Metadata = {
	title: 'Manage users',
}
const UsersPage = () => {
	const data = fetchSystemAdminUsers()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage users</h1>
					<p className='text-muted-foreground text-sm'>View and manage all users.</p>
				</div>

				<Link
					className={buttonVariants({ variant: 'default', size: 'sm' })}
					href={'/users/add'}
				>
					<Plus />
					<span className='hidden md:block'>Add user</span>
				</Link>
			</div>
			<Suspense fallback={<Loader />}>
				<UsersTable data={data} />
			</Suspense>
		</main>
	)
}

export default UsersPage
