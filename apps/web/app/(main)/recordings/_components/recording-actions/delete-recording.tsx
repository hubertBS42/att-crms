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
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Recording } from '@att-crms/db/client'
import { deleteRecordingAction } from '@/lib/actions/recording.actions'
import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface DeleteRecordingProps {
	recording: Recording
	onDelete?: () => void
}

const DeleteRecording = ({ recording, onDelete }: DeleteRecordingProps) => {
	const [isPending, startTransition] = useTransition()
	const [isOpen, setIsOpen] = useState(false)

	const handleDelete = () => {
		startTransition(async () => {
			const result = await deleteRecordingAction(recording.id)
			if (!result.success) {
				setIsOpen(false)
				toast.error('Failed to delete recording', { description: result.error })
				return
			}
			setIsOpen(false)
			toast.success('Recording deleted successfully.')
			onDelete?.()
		})
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<AlertDialogTrigger asChild>
				<Button
					variant='destructive'
					className='w-full'
				>
					<Trash2 className='size-4' />
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{`This will permanently delete ${recording.filename}. This action cannot be undone.`}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							handleDelete()
						}}
						disabled={isPending}
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						{isPending ? <Spinner /> : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteRecording
