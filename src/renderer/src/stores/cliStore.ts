import type { CliEvent, CliProgressEvent, SummaryEvent } from '@handlers/cli';
import type { CliMenu } from '@handlers/cli/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CliState {
  runId: string | null;
  status: 'IDLE' | 'RUNNING' | 'DONE' | 'ERROR';
  progress: CliProgressEvent | null;
  summary: SummaryEvent | null;
  /** Namespaces default CLI JSON output under userData/results/<menu>/ */
  menu: CliMenu;

  start: (runId: string) => void;
  handleEvent: (e: CliEvent) => void;
  cancel: () => void;
  reset: () => void;
  setMenu: (menu: CliMenu) => void;
}

export const useCliStore = create<CliState>()(
  immer((set) => ({
    runId: null,
    status: 'IDLE',
    progress: null,
    summary: null,
    menu: 'organize',

    start: (runId) =>
      set((state) => {
        state.runId = runId;
        state.status = 'RUNNING';
        state.progress = null;
        state.summary = null;
      }),
    cancel: () =>
      set((state) => {
        state.status = 'IDLE';
        state.runId = null;
      }),
    reset: () =>
      set((s) => {
        s.status = 'IDLE';
        s.runId = null;
        s.progress = null;
        s.summary = null;
      }),
    handleEvent: (event) =>
      set((state) => {
        if (event.type === 'progress') state.progress = event as CliProgressEvent;
        if (event.type === 'summary') {
          state.summary = event;
          state.status = 'DONE';
        }
      }),
    setMenu: (menu) =>
      set((state) => {
        state.menu = menu;
      })
  }))
);
