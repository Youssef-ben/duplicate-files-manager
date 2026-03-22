import { ScanningSummary } from './types/scan.mode'

export type ProgressEvent = {
  type: 'progress'
  stage: string
  phase: string
  current: number
  total: number
}

type SummaryEventBase = {
  type: 'summary'
  action: string
  [key: string]: unknown
}
export type SummaryEvent = SummaryEventBase | ScanningSummary

export type CliEvent = ProgressEvent | ScanningSummary | SummaryEvent
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
}

export type CliApi = {
  run: (args: CliRunArgs) => void
  cancel: (runId: string) => void
  onProgress: (callback: (e: CliEvent) => void) => () => void
  readSummaryResult: <T>(jsonPath: string) => T
}
