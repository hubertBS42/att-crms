'use client'

import { authClient } from '@/lib/auth-client'
import { Recording } from '@att-crms/db/client'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import ShareRecording from './share-recording'
import DownloadRecording from './download-recording'
import DeleteRecording from './delete-recording'

interface RecordingActionsProps {
	recording: Recording
	onClose: () => void
}

const RecordingActions = ({ recording, onClose }: RecordingActionsProps) => {
	const { data: activeMember, isPending: isActiveMemberLoading } = authClient.useActiveMember()

	if (isActiveMemberLoading || !activeMember) return null

	const canDelete = authClient.organization.checkRolePermission({
		role: (activeMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { recording: ['delete'] },
	})
	return (
		<div className='grid gap-y-2'>
			<ShareRecording recording={recording} />
			<DownloadRecording recording={recording} />
			{canDelete && (
				<DeleteRecording
					recording={recording}
					onDelete={onClose}
				/>
			)}
		</div>
	)
}
export default RecordingActions
