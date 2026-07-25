import { StepProgressProps } from '@components/steps';
import { SummaryEvent } from '@handlers/cli/types';
import {
  SynchronizeCompareResults,
  SynchronizeCompareSummary,
  SynchronizeFile
} from '@handlers/cli/types/synchronize.mode';
import { useCliRun } from '@hooks/useCliRun';
import { useSynchronizeStore } from '@pages/synchronize/store/synchronizeStore';
import { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ComparePreviewProps, CompareProps, HeaderProps } from './components';

interface UseSynchronizeStepResults {
  isIdle: boolean;
  isCompleted: boolean;
  isRunning: boolean;
  headerProps: HeaderProps;
  compareProps: CompareProps;
  progressProps: StepProgressProps;
  comparePreviewProps: ComparePreviewProps;
}

export const useSynchronizeStep = (): UseSynchronizeStepResults => {
  const { progress, resetRunner, stop, run, onCliDone } = useCliRun();

  const { folders, step } = useSynchronizeStore(
    useShallow((state) => ({
      folders: state.folders,
      step: state.steps.synchronize
    }))
  );

  const handleOnCompare = useCallback(() => {
    const newRunId = crypto.randomUUID();
    step.start(newRunId);
    run({
      runId: newRunId,
      menu: 'synchronize',
      mode: 'compare',
      sourceRoot: folders.getFolder('source') as string,
      target: folders.getFolder('destination') as string
    });
  }, [folders, step, run]);

  const handleOnResetClick = useCallback(() => {
    step.reset();
    resetRunner();

    handleOnCompare();
  }, [step, resetRunner, handleOnCompare]);

  const handleOnCancelClick = useCallback(() => {
    stop();
    step.reset();
  }, [stop, step]);

  // Subscribe to CLI completion (summary).
  useEffect(() => {
    const unsubscribe = onCliDone(function cleanUp(summary: SummaryEvent) {
      if (!summary || summary['action'] !== 'compare') return;

      const { report_path } = summary as SynchronizeCompareSummary;
      const results = window.appApi.cli.readSummaryResult<SynchronizeCompareResults>(report_path);
      step.complete(results);
    });

    return unsubscribe;
  }, [onCliDone, step]);

  const isIdle = useMemo(() => step.status === 'NOT_STARTED', [step.status]);
  const isRunning = useMemo(() => step.status === 'RUNNING', [step.status]);
  const isCompleted = useMemo(() => step.status === 'COMPLETED', [step.status]);

  const compareResult = useMemo(() => {
    return uniqueFilesByHash(step.result?.missing_in_target ?? []) ?? [];
  }, [step.result]);

  return {
    isIdle,
    isCompleted,
    isRunning,
    headerProps: {
      status: step.status,
      onResetClick: handleOnResetClick,
      onCancelClick: handleOnCancelClick
    },
    compareProps: {
      onCompareClick: handleOnCompare
    },
    progressProps: {
      progress,
      startedAtMs: step.startedAtMs ?? 0
    },
    comparePreviewProps: {
      compareResult,
      onReRunClick: handleOnResetClick
    }
  };
};

/**
 * Remove duplicate files by hash
 */
function uniqueFilesByHash(files: SynchronizeFile[]): SynchronizeFile[] {
  const seenHashes = new Set();
  const uniqueFiles = files.filter((file) => {
    if (seenHashes.has(file.hash)) {
      return false;
    }
    seenHashes.add(file.hash);
    return true;
  });

  return uniqueFiles;
}
