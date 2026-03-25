import { DuplicatesProgressSummary } from './types/duplicates.mode'
import { FlatteningProgressSummary } from './types/flatten.mode'
import { OrganizeProgressSummary } from './types/organize.mode'
import { ScanningProgressSummary } from './types/scan.mode'

export type ProgressEvent = {
  type: 'progress'
  stage: string
  phase: string
  current: number
  total: number
  file?: string
  file_size_bytes?: number
  processed_bytes?: number
  total_bytes?: number
}

type SummaryEventBase = {
  type: 'summary'
  action: string
  [key: string]: unknown
}
export type SummaryEvent =
  | SummaryEventBase
  | ScanningProgressSummary
  | FlatteningProgressSummary
  | DuplicatesProgressSummary
  | OrganizeProgressSummary

export type CliEvent = ProgressEvent | SummaryEvent

export type CliMode =
  | 'flatten'
  | 'organize'
  | 'compare'
  | 'sync'
  | 'find-duplicate'
  | 'delete-duplicate'
  | 'scan'
  | 'rename'

export type CliRunArgs = {
  runId?: string
  mode: CliMode
  sourceRoot: string
  dryRun?: boolean
  target?: string
  direction?: 'to-target' | 'to-source' | 'both'
  output?: string
  input?: string
  confirm?: boolean
  outputFolder?: string
}

export type CliApi = {
  run: (args: CliRunArgs) => void
  cancel: (runId: string) => void
  onProgress: (callback: (e: CliEvent) => void) => () => void
  readSummaryResult: <T>(jsonPath: string) => T
}
