import { authClient } from '@/lib/auth-client'
import { formatError } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type SwitchByIdParams = { organizationId: string; organizationSlug?: never }
type SwitchBySlugParams = { organizationSlug: string; organizationId?: never }
type SwitchParams = SwitchByIdParams | SwitchBySlugParams

interface UseOrganizationSwitcherReturn {
	switchOrganization: (params: SwitchParams) => Promise<void>
	isSwitching: boolean
}

export function useOrganizationSwitcher(): UseOrganizationSwitcherReturn {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const switchOrganization = async (params: SwitchParams) => {
		try {
			if ('organizationSlug' in params) {
				await authClient.organization.setActive({ organizationSlug: params.organizationSlug })
			} else {
				await authClient.organization.setActive({ organizationId: params.organizationId })
			}

			// Wrap the navigation and refresh in a transition
			startTransition(() => {
				router.push('/')
				router.refresh()
			})

			toast.success('Operation success', { description: 'Organization has been switched.' })
		} catch (error) {
			toast.success('Operation success', { description: formatError(error) })
		}
	}

	return {
		switchOrganization,
		isSwitching: isPending,
	}
}
