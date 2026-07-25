import { DuplicatesPreviewProps, DuplicatesScannerProps } from '@components/steps';
import { DuplicatesProgressSummary, DuplicatesResults } from '@handlers/cli/types/duplicates.mode';
import { useCliRun } from '@hooks/useCliRun';
import { useCallback, useEffect, useMemo } from 'react';
import { StepSelector, useOrganizeStore } from '../store/organizeStore';
import { DuplicateHeaderProps } from './duplicateHeader';

interface UseDuplicateStepResult {
  isCompleted: boolean;

  headerProps: DuplicateHeaderProps;
  scannerProps: DuplicatesScannerProps;
  previewProps: DuplicatesPreviewProps;
}

export const useDuplicateStep = (): UseDuplicateStepResult => {
  const { getPath } = useOrganizeStore();

  const { result: scanningResults } = useOrganizeStore(StepSelector('selection'));

  const {
    stepRunnerId,
    status,
    result,
    startedAtMs,
    start,
    complete,
    reset: resetDuplicates
  } = useOrganizeStore(StepSelector('duplicates'));

  const { runnerId, summary, progress, run, resetRunner, stop, onCliDone } = useCliRun();

  /**
   * On completion:
   * - Read the summary
   * - Set the summary
   * - Complete the step
   */
  useEffect(() => {
    if (!summary || status === 'COMPLETED' || stepRunnerId !== runnerId) return;
    const { report_path } = summary as DuplicatesProgressSummary;
    const results = window.appApi.cli.readSummaryResult<DuplicatesResults>(report_path);

    complete(results);
  }, [summary, status, stepRunnerId, runnerId, complete]);

  useEffect(() => {
    if (!getPath()) window.location.reload();
  }, [getPath]);

  const handleStartProcess = useCallback(() => {
    if (!getPath()) return;

    // Reset the step store.
    resetDuplicates();
    resetRunner();

    queueMicrotask(() => {
      const newRunId = crypto.randomUUID();
      start(newRunId);
      run({
        runId: newRunId,
        menu: 'organize',
        mode: 'find-duplicate',
        sourceRoot: getPath()
      });
    });
  }, [start, run, resetDuplicates, resetRunner, getPath]);

  const handleCancelDuplicate = useCallback(() => {
    stop();
    resetDuplicates();
  }, [stop, resetDuplicates]);

  const handleOnRunCli = useCallback(
    (inputPath: string) => {
      if (!getPath()) return;

      run({
        runId: crypto.randomUUID(),
        menu: 'organize',
        mode: 'delete-duplicate',
        input: inputPath,
        sourceRoot: getPath()
      });
    },
    [getPath, run]
  );

  return {
    isCompleted: useMemo(() => status === 'COMPLETED', [status]),

    headerProps: {
      status,
      groupsCount: result?.duplicate_groups ?? 0,
      filesCount: result?.duplicate_files ?? 0,
      totalSize: result?.duplicate_total_bytes ?? 0,
      onCancelClick: handleCancelDuplicate,
      onReRunClick: handleStartProcess
    },
    scannerProps: {
      isIdle: status === 'NOT_STARTED',
      isRunning: status === 'RUNNING',
      isCompleted: status === 'COMPLETED',
      progress,
      folderPath: getPath(),
      startedAtMs: startedAtMs ?? 0,
      scanningResults: scanningResults,
      onStartScan: handleStartProcess
    },
    previewProps: {
      menu: 'organize',
      duplicatesResults: result,
      onRunCli: handleOnRunCli,
      onReRunClick: handleStartProcess,
      onCliDone
    }
  };
};
