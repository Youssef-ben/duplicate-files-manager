import { DuplicatesResults } from '@handlers/cli/types/duplicates.mode'
import { FlatteningResults } from '@handlers/cli/types/flatten.mode'
import { OrganizeResults } from '@handlers/cli/types/organize.mode'
import { OutputFolderResults, ScanningResults } from '@handlers/cli/types/scan.mode'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { StateCreator } from 'zustand/vanilla'

/**
 * Wizard step ids for the Organize flow (must match `Organize` steps).
 */
export const ORGANIZE_STEPS_IDS = {
  selection: 1,
  output: 2,
  flatten: 3,
  duplicates: 4,
  confirm: 5
} as const

export type OrganizeStepKey = keyof typeof ORGANIZE_STEPS_IDS

export type OrganizeStepResultType =
  | ScanningResults
  | OutputFolderResults
  | FlatteningResults
  | DuplicatesResults
  | OrganizeResults

/**
 * Step type in the Organize flow.
 */
type OrganizeStep<T extends OrganizeStepResultType> = {
  // State
  stepRunnerId: string | null
  status: 'NOT_STARTED' | 'RUNNING' | 'COMPLETED' | 'ERROR'
  result?: T
  startedAtMs?: number
  completedAtMs?: number

  // Actions
  start: (runId: string) => void
  complete: (result: T) => void
  reset: () => void
}

/**
 * The Organize store state.
 *
 * @returns The Organize store zustand (Get) state interface.
 */
interface OrganizeState {
  steps: {
    selection: OrganizeStep<ScanningResults>
    output: OrganizeStep<OutputFolderResults>
    flatten: OrganizeStep<FlatteningResults>
    duplicates: OrganizeStep<DuplicatesResults>
    confirm: OrganizeStep<OrganizeResults>
  }

  /** Root folder chosen on the Selection step; drives step 1 completion. */
  selectedFolderPath?: string
  setSelectedFolderPath: (path?: string) => void

  /** Output folder chosen on the Output step; drives step 2 completion. */
  outputFolderPath?: string
  setOutputFolderPath: (path?: string) => void

  /** Reset the store to its initial state. */
  reset: () => void
  getPath: () => string
}

/**
 * The Organize store zustand (Set) state function.
 *
 * @param state - The state to set.
 * @returns The set state function.
 */
type OrganizeSetState = Parameters<StateCreator<OrganizeState, [['zustand/immer', never]]>>[0]

/**
 * Creates the step reducer for the given step key.
 *
 * @param stepKey - The key of the step to create.
 * @param set - The set function from the store.
 * @returns The step reducer.
 */
const getStepReducer = <T extends OrganizeStepResultType>(
  stepKey: OrganizeStepKey,
  set: OrganizeSetState
): OrganizeStep<T> => {
  return {
    // State
    status: 'NOT_STARTED',
    stepRunnerId: null,
    result: undefined,

    // Actions
    start: (runId: string) =>
      set((state: OrganizeState) => {
        state.steps[stepKey].stepRunnerId = runId
        state.steps[stepKey].status = 'RUNNING'
        state.steps[stepKey].result = undefined
        state.steps[stepKey].startedAtMs = Date.now()
        state.steps[stepKey].completedAtMs = undefined
      }),
    complete: (result: T) =>
      set((state: OrganizeState) => {
        state.steps[stepKey].status = 'COMPLETED'
        state.steps[stepKey].result = result as T
        state.steps[stepKey].completedAtMs = state.steps[stepKey]?.startedAtMs
          ? Date.now() - state.steps[stepKey].startedAtMs
          : undefined
      }),
    reset: () =>
      set((state) => {
        state.steps[stepKey].status = 'NOT_STARTED'
        state.steps[stepKey].stepRunnerId = null
        state.steps[stepKey].result = undefined
        state.steps[stepKey].startedAtMs = undefined
        state.steps[stepKey].completedAtMs = undefined
      })
  }
}

/**
 * The Organize store.
 *
 * @returns The Organize store.
 * @example
 * const { steps, selectedFolderPath, setSelectedFolderPath, reset } = useOrganizeStore()
 *
 * steps.selection.start('123')
 * steps.selection.complete({ result: 'success' })
 * steps.selection.reset()
 */
export const useOrganizeStore = create<OrganizeState>()(
  immer((set: OrganizeSetState, get: () => OrganizeState) => ({
    steps: {
      selection: getStepReducer<ScanningResults>('selection', set),
      output: getStepReducer<OutputFolderResults>('output', set),
      flatten: getStepReducer<FlatteningResults>('flatten', set),
      duplicates: getStepReducer<DuplicatesResults>('duplicates', set),
      confirm: getStepReducer<OrganizeResults>('confirm', set)
    },

    selectedFolderPath: undefined,
    outputFolderPath: undefined,
    setSelectedFolderPath: (path) =>
      set((state: OrganizeState) => {
        state.selectedFolderPath = path
      }),
    setOutputFolderPath: (path) =>
      set((state: OrganizeState) => {
        state.outputFolderPath = path
      }),

    getPath: () => {
      const { outputFolderPath, selectedFolderPath } = get()
      return outputFolderPath ?? selectedFolderPath ?? ''
    },

    reset: () =>
      set((state: OrganizeState) => {
        state.selectedFolderPath = undefined
        state.outputFolderPath = undefined

        for (const stepKey of Object.keys(ORGANIZE_STEPS_IDS) as OrganizeStepKey[]) {
          state.steps[stepKey].status = 'NOT_STARTED'
          state.steps[stepKey].stepRunnerId = null
          state.steps[stepKey].result = undefined
        }
      })
  }))
)

/**
 * Select the full state slice for a wizard step.
 *
 * @param stepKey - The key of the step to select.
 * @returns The full state slice for the step.
 */
export const StepSelector =
  <K extends OrganizeStepKey>(stepKey: K) =>
  (state: OrganizeState): OrganizeState['steps'][K] =>
    state.steps[stepKey]
