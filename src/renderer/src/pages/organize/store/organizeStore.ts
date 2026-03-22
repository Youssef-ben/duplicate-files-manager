import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/** Wizard step ids for the Organize flow (must match `Organize` steps). */
export const organizeStepIds = {
  selection: 1,
  flatten: 2,
  duplicates: 3,
  confirm: 4
} as const

export type OrganizeStepId = (typeof organizeStepIds)[keyof typeof organizeStepIds]
export type OrganizeStepKey = keyof typeof organizeStepIds

const ORGANIZE_STEP_KEYS = Object.keys(organizeStepIds) as OrganizeStepKey[]

export interface OrganizeStep {
  isCompleted: boolean
  setIsCompleted: (completed: boolean) => void
}

interface OrganizeState {
  steps: Record<OrganizeStepKey, OrganizeStep>

  /** Root folder chosen on the Selection step; drives step 1 completion. */
  rootFolderPath: string | null
  setRootFolderPath: (path: string | null) => void
  reset: () => void
}

export const useOrganizeStore = create<OrganizeState>()(
  immer((set) => ({
    steps: ORGANIZE_STEP_KEYS.reduce(
      (acc, key) => {
        acc[key] = {
          isCompleted: false,
          setIsCompleted: (completed: boolean) =>
            set(({ steps }) => {
              steps[key].isCompleted = completed
            })
        }
        return acc
      },
      {} as Record<OrganizeStepKey, OrganizeStep>
    ),

    rootFolderPath: null,
    setRootFolderPath: (path) =>
      set((s) => {
        s.rootFolderPath = path
      }),
    reset: () =>
      set((s) => {
        s.rootFolderPath = null

        // Clear all step completions
        for (const key of ORGANIZE_STEP_KEYS) {
          s.steps[key].isCompleted = false
        }
      })
  }))
)

/** Select the full slice for a wizard step (`isCompleted` + `setIsCompleted`). */
export const StepSelector =
  <K extends OrganizeStepKey>(stepKey: K) =>
  (state: OrganizeState): OrganizeStep =>
    state.steps[stepKey]
