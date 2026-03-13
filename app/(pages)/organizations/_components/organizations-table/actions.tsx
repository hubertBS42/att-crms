'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { useOrganizationSwitcher } from '@/hooks/use-org-switch'
import { authClient } from '@/lib/auth-client'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export const ActionsSkeleton = () => {
	return <MoreVertical className='ml-auto size-4' />
}

const Actions = ({ organizationId }: { organizationId: string }) => {
	const [dropdownMenuIsOpen, setDropdownMenuIsOpen] = React.useState(false)
	const [alertDialogIsOpen, setAlertDialogIsOpen] = React.useState(false)
	const [isPending, startTransition] = React.useTransition()
	const { switchOrganization } = useOrganizationSwitcher()
	const router = useRouter()

	const handleDelete = async () => {
		startTransition(async () => {
			await authClient.organization.delete(
				{
					organizationId,
				},
				{
					onSuccess: () => {
						startTransition(() => {
							setAlertDialogIsOpen(false)
							router.push('/organizations')
							toast.success('Operation success', { description: 'Organization has been deleted.' })
						})
					},
					onError: ctx => {
						startTransition(() => {
							setAlertDialogIsOpen(false)
							toast.error('Operation failed', { description: ctx.error.message })
						})
					},
				},
			)
		})
	}

	return (
		<div className='flex justify-end'>
			<DropdownMenu
				open={dropdownMenuIsOpen}
				onOpenChange={setDropdownMenuIsOpen}
			>
				<DropdownMenuTrigger asChild>
					<MoreVertical className='size-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild>
						<Link href={`/organizations/${organizationId}/edit`}>View</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={e => {
							e.preventDefault()
							setDropdownMenuIsOpen(false)
							switchOrganization({ organizationId })
						}}
					>
						Switch
					</DropdownMenuItem>
					<DropdownMenuItem
						variant='destructive'
						onSelect={e => {
							e.preventDefault()
							setDropdownMenuIsOpen(false)
							setAlertDialogIsOpen(true)
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={alertDialogIsOpen}
				onOpenChange={setAlertDialogIsOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>This action cannot be undone. This will permanently delete this organization and related data.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={e => {
								e.preventDefault()
								handleDelete()
							}}
							disabled={isPending}
						>
							{isPending ? <Spinner /> : 'Continue'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default Actions
