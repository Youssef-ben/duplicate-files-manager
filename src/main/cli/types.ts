export interface ProgressEvent {
  type: 'progress'
  stage: string
  phase: string
  current: number
  total: number
}

export interface SummaryEvent {
  type: 'summary'
  action: string
  [key: string]: unknown
}

export type CliEvent = ProgressEvent | SummaryEvent

export interface CliRunArgs {
  runId: string
  mode: 'all' | 'flatten' | 'organize' | 'find-duplicate' | 'compare' | 'sync' | 'delete-duplicate'
  sourceRoot: string
  dryRun?: boolean
  target?: string
  direction?: 'to-target' | 'to-source' | 'both'
  output?: string
  input?: string
  confirm?: boolean
}
