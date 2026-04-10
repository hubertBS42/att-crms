'use client'

import { MemberWithUserWithSessions } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import RemoveMember from './remove-member'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MemberActionsProps {
	member: MemberWithUserWithSessions
}

const MemberActions = ({ member }: MemberActionsProps) => {
	const { data: activeMember } = authClient.useActiveMember()

	const canRemove = authClient.organization.checkRolePermission({
		role: (activeMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: { member: ['delete'] },
	})

	const isCurrentMember = member.id === activeMember?.id

	if (isCurrentMember) return null
	if (!isCurrentMember && !canRemove) return null
	return (
		<Card>
			<CardHeader>
				<CardTitle>Actions</CardTitle>
				<CardDescription>Remove member from organization</CardDescription>
			</CardHeader>
			<CardContent>{canRemove && <RemoveMember member={member} />}</CardContent>
		</Card>
	)
}
export default MemberActions
