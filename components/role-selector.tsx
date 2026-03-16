'use client'

import SelectField from '@/components/select-field'
import { MemberWithUserWithSessions, PrimitiveOption, SelectOption, UserWithSessions } from '@/interfaces'
import { authClient } from '@/lib/auth-client'
import { OrganizationLevelRole } from '@/lib/permissions/org-permissions'
import { SystemLevelRole } from '@/lib/permissions/system-permissions'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Control } from 'react-hook-form'

interface RoleSelectorProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>
	isSubmitting: boolean
	user?: UserWithSessions | MemberWithUserWithSessions
	options: PrimitiveOption[] | SelectOption[]
	name?: string
	label?: string
	placeholder?: string
	permissionType?: 'system' | 'organization'
}

const RoleSelector = ({ control, isSubmitting, user, options, name = 'role', label = 'Role', placeholder, permissionType = 'system' }: RoleSelectorProps) => {
	const getUserId = (user?: UserWithSessions | MemberWithUserWithSessions): string | undefined => {
		if (!user) return undefined
		if ('user' in user) return user.user.id
		return user.id
	}

	const getUserRole = (user?: UserWithSessions | MemberWithUserWithSessions): string | undefined => {
		if (!user) return undefined
		if ('user' in user) return user.role
		return user.role
	}

	const { data, isPending: isSessionLoading } = authClient.useSession()
	const { data: activeOrganization, isPending: isActiveOrgLoading } = authClient.useActiveOrganization()

	const canSetRoleSystem = authClient.admin.checkRolePermission({
		role: data?.user.role as SystemLevelRole,
		permissions: {
			user: ['set-role'],
		},
	})

	const currentMember = activeOrganization?.members?.find(member => member.userId === data?.user.id)

	const canSetRoleOrg = authClient.organization.checkRolePermission({
		role: (currentMember?.role ?? 'member') as OrganizationLevelRole,
		permissions: {
			member: ['set-role'],
		},
	})

	const canSetRole = permissionType === 'organization' ? canSetRoleOrg : canSetRoleSystem

	const isCurrentUser = data?.session ? getUserId(user) === data.session.userId : false

	const resolvedPlaceholder = placeholder ?? getUserRole(user) ?? 'admin'

	const isLoading = isSessionLoading || (permissionType === 'organization' && isActiveOrgLoading)

	return (
		<div className='grid col-span-2 lg:col-span-1'>
			<SelectField
				control={control}
				name={name}
				label={label}
				options={options}
				disabled={isLoading || isSubmitting || isCurrentUser || !canSetRole}
				loadingPlaceholder={capitalizeFirstLetter(resolvedPlaceholder)}
			/>
		</div>
	)
}

export default RoleSelector
