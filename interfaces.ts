import { Prisma } from '@/lib/generated/prisma/client'

export type ParsedRecording = Omit<Prisma.RecordingCreateInput, 'organization'> & {
	organizationSlug: string
}
