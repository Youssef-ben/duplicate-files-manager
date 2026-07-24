import type { CliProgressEvent, CliRunArgs, SummaryEvent } from '@handlers/cli';
import { CliMenu } from '@handlers/cli/types';
import { useCliStore } from '@stores/cliStore';
import { useCallback, useEffect } from 'react';

interface UseCliRunResult {
  runnerId: string | null;
  runnerStatus: 'IDLE' | 'RUNNING' | 'DONE' | 'ERROR';
  progress: CliProgressEvent | null;
  summary: SummaryEvent | null;

  run: (args: CliRunArgs) => void;
  stop: () => void;
  resetRunner: () => void;
  setMenu: (menu: CliMenu) => void;
  /** Subscribe to CLI completion (summary). Returns unsubscribe. */
  onCliDone: (callback: (summary: SummaryEvent) => void) => () => void;
}

export function useCliRun(): UseCliRunResult {
  const { runId, start, handleEvent, cancel, status, progress, summary, reset, menu, setMenu } =
    useCliStore();

  useEffect(() => {
    const unsubscribe = window.appApi.cli.onProgress(handleEvent);
    return unsubscribe;
  }, [handleEvent]);

  const run = useCallback(
    (args: CliRunArgs): void => {
      if (!args.runId) {
        args.runId = crypto.randomUUID();
      }
      // If caller didn't specify a menu, default to the currently selected one.
      // (Some screens explicitly pass a menu to avoid relying on global state.)
      if (!args.menu) {
        args.menu = menu;
      } else if (args.menu !== menu) {
        setMenu(args.menu);
      }
      start(args.runId);
      window.appApi.cli.run(args);
    },
    [start, menu, setMenu]
  );

  const stop = useCallback((): void => {
    const runId = useCliStore.getState().runId;
    if (runId) {
      window.appApi.cli.cancel(runId);
      cancel();
    }
  }, [cancel]);

  const resetRunner = useCallback((): void => {
    stop();
    reset();
  }, [reset, stop]);

  return {
    runnerId: runId,
    runnerStatus: status,
    progress,
    summary,
    run,
    stop,
    resetRunner,
    setMenu,
    onCliDone: window.appApi.cli.onDone
  };
}
