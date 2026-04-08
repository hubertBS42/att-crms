'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { banUserFormSchema } from '@/lib/zod'
import { useRouter } from 'next/navigation'
import DateField from '@/components/date-field'
import TextAreaField from '@/components/textarea-field'
import { Spinner } from '@/components/ui/spinner'
import { User } from '@att-crms/db/client'
import { banUserAction } from '@/lib/actions/user.actions'
import { ShieldX } from 'lucide-react'

const BanUser = ({ user }: { user: User }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm<z.infer<typeof banUserFormSchema>>({
		resolver: zodResolver(banUserFormSchema),
		defaultValues: {
			userId: user.id,
			banReason: '',
			banExpiresIn: null,
		},
	})

	const onSubmit: SubmitHandler<z.infer<typeof banUserFormSchema>> = async values => {
		startTransition(async () => {
			const response = await banUserAction({ userId: values.userId, banExpiresIn: values.banExpiresIn, banReason: values.banReason })
			if (!response.success) {
				toast.error('Operation failed', { description: 'Something went wrong..' })
				return
			}

			startTransition(() => {
				setIsOpen(false)
				form.reset()
				router.push(`/users/${user.id}/edit`)
				toast.success('Operation success', { description: 'User has been banned.' })
			})
		})
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>
				<Button
					type='button'
					className='w-full text-red-500 hover:text-red-700 hover:bg-red-50'
					variant={'outline'}
				>
					<ShieldX className='size-5' />
					Ban User
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-106.25'>
				<DialogHeader>
					<DialogTitle>Ban User</DialogTitle>
					<DialogDescription>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='grid grid-cols-2 gap-4'>
						<div className='col-span-2'>
							<DateField
								control={form.control}
								name='banExpiresIn'
								label='Ban Expiration'
								disabled={isPending}
								disabledDates={date => date < new Date()}
							/>
						</div>

						<div className='col-span-2'>
							<TextAreaField
								control={form.control}
								label='Ban Reason'
								name='banReason'
								disabled={isPending}
							/>
						</div>
						<div className='col-span-2'>
							<Button
								className='w-full'
								type='button'
								onClick={() => form.handleSubmit(onSubmit)()}
								disabled={isPending}
							>
								{isPending ? <Spinner /> : 'Proceed'}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
export default BanUser
