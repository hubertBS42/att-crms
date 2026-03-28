'use client'

import InputField from '@/components/input-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserWithSessionsAndMemberships } from '@/interfaces'
import { capitalizeFirstLetter } from '@/lib/utils'
import { format } from 'date-fns'
import { Control } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const UserActions = dynamic(() => import('./user-actions'), {
	ssr: false,
	loading: () => <Skeleton className='w-full h-10' />,
})

interface UserFormFieldsProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>
	user: UserWithSessionsAndMemberships
	isPending: boolean
}

const UserFormFields = ({ control, user, isPending }: UserFormFieldsProps) => {
	return (
		<div className='grid items-stretch gap-4 lg:grid-cols-3'>
			<div className='lg:col-span-2'>
				{/* Details card */}
				<Card className='h-full'>
					<CardHeader>
						<CardTitle>Details</CardTitle>
						<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
					</CardHeader>
					<CardContent className='grid gap-5'>
						<InputField
							control={control}
							label='Full name'
							name='name'
							disabled={isPending}
						/>
						<InputField
							control={control}
							label='Email'
							name='email'
							type='email'
							disabled
						/>
						<Field className='gap-y-1'>
							<FieldLabel>Role</FieldLabel>
							<Input
								defaultValue={capitalizeFirstLetter(user.role)}
								disabled
							/>
						</Field>
						<InputField
							control={control}
							name='image'
							label='Avatar URL'
							disabled={isPending}
						/>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-4 content-start'>
				{/* Status card */}
				<Card>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							Status
							{user.banned ? <Badge variant='destructive'>Banned</Badge> : <Badge>Active</Badge>}
						</CardTitle>
					</CardHeader>
					{user.banned && (
						<CardContent>
							<div className='grid text-sm gap-y-5'>
								<div>
									<h3 className='font-medium'>Ban reason:</h3>
									<p className='text-muted-foreground'>{user.banReason}</p>
								</div>
								<div>
									<h3 className='font-medium'>Ban expiration:</h3>
									<p className='text-muted-foreground'>{user.banExpires ? format(user.banExpires, 'LLL dd, y') : 'N/A'}</p>
								</div>
							</div>
						</CardContent>
					)}
				</Card>

				{/* Actions card */}
				<Card>
					<CardHeader>
						<CardTitle>Actions</CardTitle>
						<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
					</CardHeader>
					<CardContent>
						<UserActions user={user} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default UserFormFields
