import { DuplicatesPreviewProps, DuplicatesScannerProps } from '@components/steps';
import { DuplicatesProgressSummary, DuplicatesResults } from '@handlers/cli/types/duplicates.mode';
import { useCliRun } from '@hooks/useCliRun';
import { useDuplicatesStore } from '@pages/duplicates/store/duplicatesStore';
import { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { ScanHeaderProps } from './components';

interface UseScanStepResult {
  headerProps: ScanHeaderProps;
  scannerProps: DuplicatesScannerProps;
  previewProps: DuplicatesPreviewProps;
  isCompleted: boolean;
}

export const useScanStep = (): UseScanStepResult => {
  const { summary, runnerId, progress, run, resetRunner, onCliDone } = useCliRun();

  const { scanningResults } = useDuplicatesStore(
    useShallow((state) => {
      return {
        scanningResults: state.steps.selection.result
      };
    })
  );

  const { folder, step } = useDuplicatesStore(
    useShallow((state) => {
      return {
        folder: state.folder,
        step: state.steps.scan,
        reset: state.reset
      };
    })
  );

  useEffect(
    function onScanningCompleted(): void {
      if (summary && step.status === 'RUNNING' && step.stepRunnerId === runnerId) {
        const { report_path } = summary as DuplicatesProgressSummary;
        const results = window.appApi.cli.readSummaryResult<DuplicatesResults>(report_path);
        step.complete(results);
      }
    },
    [summary, step, runnerId]
  );

  const handleOnCancelClick = useCallback(() => {
    step.reset();
    resetRunner();
  }, [step, resetRunner]);

  const handleOnStartProcess = useCallback(() => {
    if (!folder.path) return;

    // Reset the step store.
    handleOnCancelClick();

    const newRunId = crypto.randomUUID();
    step.start(newRunId);
    run({
      runId: newRunId,
      menu: 'duplicate',
      mode: 'find-duplicate',
      sourceRoot: folder.path as string
    });
  }, [step, folder.path, handleOnCancelClick, run]);

  const handleOnRunCli = useCallback(
    (inputPath: string) => {
      if (!folder.path) return;

      run({
        runId: crypto.randomUUID(),
        menu: 'duplicate',
        mode: 'delete-duplicate',
        input: inputPath,
        sourceRoot: folder.path as string
      });
    },
    [folder.path, run]
  );

  const isCompleted = useMemo(() => step.status === 'COMPLETED', [step.status]);

  return {
    isCompleted,
    headerProps: {
      status: step.status,
      groupsCount: step.result?.duplicate_groups ?? 0,
      filesCount: step.result?.duplicate_files ?? 0,
      totalSize: step.result?.duplicate_total_bytes ?? 0,
      onCancelClick: handleOnCancelClick,
      onResetClick: handleOnStartProcess
    },
    scannerProps: {
      isIdle: step.status === 'NOT_STARTED',
      isRunning: step.status === 'RUNNING',
      isCompleted: step.status === 'COMPLETED',
      progress: progress,
      startedAtMs: step.startedAtMs ?? 0,
      folderPath: folder.path ?? '',
      scanningResults,
      onStartScan: handleOnStartProcess
    },
    previewProps: {
      menu: 'duplicate',
      duplicatesResults: step.result,
      onRunCli: handleOnRunCli,
      onReRunClick: handleOnStartProcess,
      onCliDone
    }
  };
};
