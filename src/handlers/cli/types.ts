export type ProgressEvent = {
  type: 'progress'
  stage: string
  phase: string
  current: number
  total: number
}

export type SummaryEvent = {
  type: 'summary'
  action: string
  [key: string]: unknown
}

export type CliEvent = ProgressEvent | SummaryEvent

export type CliRunArgs = {
  runId: string
  mode: 'flatten' | 'organize' | 'compare' | 'sync' | 'find-duplicate' | 'delete-duplicate'
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
}
