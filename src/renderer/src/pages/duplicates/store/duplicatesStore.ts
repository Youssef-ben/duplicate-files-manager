import { DuplicatesResults } from '@handlers/cli/types/duplicates.mode';
import { ScanningResults } from '@handlers/cli/types/scan.mode';
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Wizard step ids for the Duplicates flow (must match `Duplicate` steps).
 */
export const DUPLICATES_STEPS_IDS = {
  selection: 1,
  scan: 2
} as const;

export type DuplicatesStepKey = keyof typeof DUPLICATES_STEPS_IDS;

export type DuplicatesStepResultType = ScanningResults | DuplicatesResults;

/**
 * Step type in the Duplicates flow.
 */
export type DuplicatesStep<T extends DuplicatesStepResultType> = {
  // State
  stepRunnerId: string | null;
  status: 'NOT_STARTED' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  result?: T;
  startedAtMs?: number;
  durationInMs?: number;

  // Actions
  start: (runId: string) => void;
  complete: (result: T) => void;
  reset: () => void;
};

/**
 * The Duplicates store state.
 */
interface DuplicatesState {
  steps: {
    selection: DuplicatesStep<ScanningResults>;
    scan: DuplicatesStep<DuplicatesResults>;
  };

  /** Root folder chosen on the Selection step; drives step 1 completion. */
  folder: {
    path?: string;
    setPath: (path?: string) => void;
  };

  /** Reset the store to its initial state. */
  reset: () => void;
}

/**
 * The Organize store zustand (Set) state function.
 *
 * @param state - The state to set.
 * @returns The set state function.
 */
type DuplicatesSetState = Parameters<StateCreator<DuplicatesState, [['zustand/immer', never]]>>[0];

/**
 * Creates the step reducer for the given step key.
 *
 * @param stepKey - The key of the step to create.
 * @param set - The set function from the store.
 * @returns The step reducer.
 */
const getStepReducer = <T extends DuplicatesStepResultType>(
  stepKey: DuplicatesStepKey,
  set: DuplicatesSetState
): DuplicatesStep<T> => {
  return {
    // State
    status: 'NOT_STARTED',
    stepRunnerId: null,
    result: undefined,

    // Actions
    start: (runId: string) =>
      set((state: DuplicatesState) => {
        state.steps[stepKey].stepRunnerId = runId;
        state.steps[stepKey].status = 'RUNNING';
        state.steps[stepKey].result = undefined;
        state.steps[stepKey].startedAtMs = Date.now();
        state.steps[stepKey].durationInMs = undefined;
      }),
    complete: (result: T) =>
      set((state: DuplicatesState) => {
        state.steps[stepKey].status = 'COMPLETED';
        state.steps[stepKey].result = result as T;
        state.steps[stepKey].durationInMs = state.steps[stepKey]?.startedAtMs
          ? Date.now() - state.steps[stepKey].startedAtMs
          : undefined;
      }),
    reset: () =>
      set((state) => {
        state.steps[stepKey].status = 'NOT_STARTED';
        state.steps[stepKey].stepRunnerId = null;
        state.steps[stepKey].result = undefined;
        state.steps[stepKey].startedAtMs = undefined;
        state.steps[stepKey].durationInMs = undefined;
      })
  };
};

/**
 * The Duplicates store.
 *
 * @returns The Duplicates store.
 * @example
 * const { steps, selectedFolderPath, setSelectedFolderPath, reset } = useDuplicatesStore()
 *
 * steps.selection.start('123')
 * steps.selection.complete({ result: 'success' })
 * steps.selection.reset()
 */
export const useDuplicatesStore = create<DuplicatesState>()(
  immer((set: DuplicatesSetState) => ({
    steps: {
      selection: getStepReducer<ScanningResults>('selection', set),
      scan: getStepReducer<DuplicatesResults>('scan', set)
    },

    folder: {
      path: undefined,
      setPath: (path?: string) => {
        set((state) => {
          state.folder.path = path ?? undefined;
        });
      }
    },

    reset: () => {
      set((state) => {
        state.folder.path = undefined;
        for (const stepKey of Object.keys(DUPLICATES_STEPS_IDS) as DuplicatesStepKey[]) {
          state.steps[stepKey].status = 'NOT_STARTED';
          state.steps[stepKey].stepRunnerId = null;
          state.steps[stepKey].result = undefined;
        }
      });
    }
  }))
);

export const StepSelector =
  <K extends DuplicatesStepKey>(stepKey: K) =>
  (state: DuplicatesState): DuplicatesState['steps'][K] =>
    state.steps[stepKey];
