'use client'

import { MemberWithUserWithSessions } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import RemoveMember from './remove-member'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import PromoteToOwner from './promote-to-owner'
import { Skeleton } from '@/components/ui/skeleton'
import LeaveOrganization from './leave-organization'

interface MemberActionsProps {
	member: MemberWithUserWithSessions
}

const MemberActions = ({ member }: MemberActionsProps) => {
	const { data: activeMember, isPending: isActiveMemberLoading } = authClient.useActiveMember()

	if (isActiveMemberLoading || !activeMember) return <Skeleton className='h-9 rounded-md' />

	const canSetRole = authClient.organization.checkRolePermission({
		role: (activeMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { member: ['set-role'] },
	})

	const canRemove = authClient.organization.checkRolePermission({
		role: (activeMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { member: ['delete'] },
	})

	const isCurrentMember = member.id === activeMember?.id
	const isOwner = member.role === 'owner'

	return (
		<div className='grid gap-y-2'>
			{!isCurrentMember ? (
				<>
					{canRemove && <RemoveMember member={member} />}
					{canSetRole && !isOwner && <PromoteToOwner member={member} />}
				</>
			) : (
				<LeaveOrganization />
			)}
		</div>
	)
}
export default MemberActions
