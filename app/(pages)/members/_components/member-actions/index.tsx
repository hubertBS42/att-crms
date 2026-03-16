'use client'

import { MemberWithUserWithSessions } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import RemoveMember from './remove-member'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import PromoteToOwner from './promote-to-owner'

interface MemberActionsProps {
	member: MemberWithUserWithSessions
	dangerZone?: boolean
}

const MemberActions = ({ member, dangerZone = false }: MemberActionsProps) => {
	const { data: session, isPending: isSessionLoading } = authClient.useSession()
	const { data: activeOrganization, isPending: isActiveOrgLoading } = authClient.useActiveOrganization()

	if (isSessionLoading || isActiveOrgLoading || !session) return null

	const currentMember = activeOrganization?.members?.find(m => m.userId === session.user.id)

	const canSetRole = authClient.organization.checkRolePermission({
		role: (currentMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { member: ['set-role'] },
	})

	const canRemove = authClient.organization.checkRolePermission({
		role: (currentMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { member: ['delete'] },
	})

	const isCurrentMember = member.user.id === session.user.id
	const isOwner = member.role === 'owner'

	if (dangerZone) {
		return <div className='grid gap-y-2'>{!isCurrentMember && canRemove && <RemoveMember member={member} />}</div>
	}

	return <div className='grid gap-y-2'>{!isCurrentMember && canSetRole && !isOwner && <PromoteToOwner member={member} />}</div>
}
export default MemberActions
