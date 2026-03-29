import Loader from '@/components/loader'
import { Metadata } from 'next'
import { Suspense } from 'react'
import UsersTable from './_components/users-table'
import { fetchAllUsers } from '@/lib/data/users.data'
import AddButton from '@/components/add-button'

export const metadata: Metadata = {
	title: 'Manage users',
}
const UsersPage = () => {
	const data = fetchAllUsers()
	return (
		<main className='flex flex-col gap-y-6'>
			<div className='flex items-end justify-between'>
				<div className='grid'>
					<h1 className='text-xl md:text-2xl font-bold'>Manage Users</h1>
					<p className='text-muted-foreground text-sm'>View and manage all users.</p>
				</div>

				<AddButton
					label='Add User'
					url='/users/add'
				/>
			</div>
			<Suspense fallback={<Loader />}>
				<UsersTable data={data} />
			</Suspense>
		</main>
	)
}

export default UsersPage
