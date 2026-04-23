import { ScanningResults } from '@handlers/cli/types/scan.mode'
import { SynchronizeCompareResults } from '@handlers/cli/types/synchronize.mode'
import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Wizard step ids for the Synchronize flow (must match `Synchronize` wizard steps).
 */
export const SYNCHRONIZE_STEPS_IDS = {
  source: 1,
  destination: 2,
  synchronize: 3
} as const

export type SynchronizeStepKey = keyof typeof SYNCHRONIZE_STEPS_IDS

export type SynchronizeStepResultType = ScanningResults | SynchronizeCompareResults
/**
 * Step type in the Synchronize flow.
 */
export type SynchronizeStep<T extends SynchronizeStepResultType> = {
  stepRunnerId: string | null
  status: 'NOT_STARTED' | 'RUNNING' | 'COMPLETED' | 'ERROR'
  result?: T
  startedAtMs?: number
  durationInMs?: number

  start: (runId: string) => void
  complete: (result: T) => void
  reset: () => void
}

interface SynchronizeState {
  steps: {
    source: SynchronizeStep<ScanningResults>
    destination: SynchronizeStep<ScanningResults>
    synchronize: SynchronizeStep<SynchronizeCompareResults>
  }

  folders: {
    sourceFolder?: string
    destinationFolder?: string
    getFolder: (folder: 'source' | 'destination') => string | undefined
    setFolder: (folder: 'source' | 'destination', path?: string) => void
  }

  reset: () => void
}

type SynchronizeSetState = Parameters<StateCreator<SynchronizeState, [['zustand/immer', never]]>>[0]

const getStepReducer = <T extends SynchronizeStepResultType>(
  stepKey: SynchronizeStepKey,
  set: SynchronizeSetState
): SynchronizeStep<T> => {
  return {
    status: 'NOT_STARTED',
    stepRunnerId: null,
    result: undefined,

    start: (runId: string) =>
      set((state: SynchronizeState) => {
        state.steps[stepKey].stepRunnerId = runId
        state.steps[stepKey].status = 'RUNNING'
        state.steps[stepKey].result = undefined
        state.steps[stepKey].startedAtMs = Date.now()
        state.steps[stepKey].durationInMs = undefined
      }),
    complete: (result: T) =>
      set((state: SynchronizeState) => {
        state.steps[stepKey].status = 'COMPLETED'
        state.steps[stepKey].result = result as T
        state.steps[stepKey].durationInMs = state.steps[stepKey]?.startedAtMs
          ? Date.now() - state.steps[stepKey].startedAtMs
          : undefined
      }),
    reset: () =>
      set((state) => {
        state.steps[stepKey].status = 'NOT_STARTED'
        state.steps[stepKey].stepRunnerId = null
        state.steps[stepKey].result = undefined
        state.steps[stepKey].startedAtMs = undefined
        state.steps[stepKey].durationInMs = undefined
      })
  }
}

export const useSynchronizeStore = create<SynchronizeState>()(
  immer((set: SynchronizeSetState, get: () => SynchronizeState) => ({
    steps: {
      source: getStepReducer<ScanningResults>('source', set),
      destination: getStepReducer<ScanningResults>('destination', set),
      synchronize: getStepReducer<SynchronizeCompareResults>('synchronize', set)
    },

    folders: {
      sourceFolder: undefined,
      destinationFolder: undefined,
      getFolder: (folder: 'source' | 'destination') => {
        return folder === 'source' ? get().folders.sourceFolder : get().folders.destinationFolder
      },
      setFolder: (folder: 'source' | 'destination', path?: string) => {
        set((state) => {
          if (folder === 'source') {
            state.folders.sourceFolder = path ?? undefined
          } else if (folder === 'destination') {
            state.folders.destinationFolder = path ?? undefined
          }
        })
      }
    },

    reset: () => {
      set((state) => {
        state.folders.sourceFolder = undefined
        state.folders.destinationFolder = undefined
        for (const stepKey of Object.keys(SYNCHRONIZE_STEPS_IDS) as SynchronizeStepKey[]) {
          state.steps[stepKey].status = 'NOT_STARTED'
          state.steps[stepKey].stepRunnerId = null
          state.steps[stepKey].result = undefined
        }
      })
    }
  }))
)

export const SynchronizeStepSelector =
  <K extends SynchronizeStepKey>(stepKey: K) =>
  (state: SynchronizeState): SynchronizeState['steps'][K] =>
    state.steps[stepKey]
