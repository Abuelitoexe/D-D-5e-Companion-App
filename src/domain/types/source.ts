export type SourceId = 'PHB2024' | 'RAVENLOFT' | 'HEROES_FAERUN' | 'CLASS_TIPS'

export interface SourceRef {
  sourceId: SourceId
  sourceLabel: string
  page?: number
  section?: string
  needsVerification?: boolean
}
