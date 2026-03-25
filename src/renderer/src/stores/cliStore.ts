import type { CliEvent, ProgressEvent, SummaryEvent } from '@handlers/cli'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface CliState {
  runId: string | null
  status: 'IDLE' | 'RUNNING' | 'DONE' | 'ERROR'
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
    status: 'IDLE',
    progress: null,
    summary: null,

    start: (runId) =>
      set((state) => {
        state.runId = runId
        state.status = 'RUNNING'
        state.progress = null
        state.summary = null
      }),
    cancel: () =>
      set((state) => {
        state.status = 'IDLE'
        state.runId = null
      }),
    reset: () =>
      set((s) => {
        s.status = 'IDLE'
        s.runId = null
        s.progress = null
        s.summary = null
      }),
    handleEvent: (event) =>
      set((state) => {
        if (event.type === 'progress') state.progress = event as ProgressEvent
        if (event.type === 'summary') {
          state.summary = event
          state.status = 'DONE'
        }
      })
  }))
)
