import type { CliEvent, ProgressEvent, SummaryEvent } from '@handlers/cli'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface CliState {
  runId: string | null
  status: 'idle' | 'running' | 'done' | 'error'
  progress: ProgressEvent | null
  summary: SummaryEvent | null
  start: (runId: string) => void
  handleEvent: (e: CliEvent) => void
  cancel: () => void
  reset: () => void
}

export const useCliStore = create<CliState>()(
  immer((set) => ({
    runId: null,
    status: 'idle',
    progress: null,
    summary: null,
    start: (runId) =>
      set((s) => {
        s.runId = runId
        s.status = 'running'
        s.progress = null
        s.summary = null
      }),
    handleEvent: (e) =>
      set((s) => {
        if (e.type === 'progress') s.progress = e
        if (e.type === 'summary') {
          s.summary = e
          s.status = 'done'
        }
      }),
    cancel: () =>
      set((s) => {
        s.status = 'idle'
        s.runId = null
      }),
    reset: () =>
      set((s) => {
        s.status = 'idle'
        s.runId = null
        s.progress = null
        s.summary = null
      })
  }))
)
