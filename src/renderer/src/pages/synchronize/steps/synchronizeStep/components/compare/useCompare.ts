import { SimpleButtonProps } from '@components/buttons';
import { useSynchronizeStore } from '@pages/synchronize/store/synchronizeStore';
import { humanizeSize } from '@renderer/utils/strings';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SummaryProps } from './summary';

interface UseCompareResult {
  isIdle: boolean;
  buttonProps: SimpleButtonProps;
  sourceSummaryProps: SummaryProps;
  destinationSummaryProps: SummaryProps;
}

export const useCompare = (onCompareClick: () => void): UseCompareResult => {
  const { folders, step, sourceStep, destinationStep } = useSynchronizeStore(
    useShallow((state) => ({
      folders: state.folders,
      step: state.steps.synchronize,
      sourceStep: state.steps.source,
      destinationStep: state.steps.destination
    }))
  );

  const isIdle = useMemo(() => step.status === 'NOT_STARTED', [step.status]);

  return {
    isIdle,
    buttonProps: {
      label: 'Start Comparison',
      variant: 'outline',
      onClick: onCompareClick
    },
    sourceSummaryProps: {
      path: folders.getFolder('source') as string,
      title: 'Source Directory',
      foldersCount: sourceStep.result?.folder_count.toString() ?? '0',
      filesCount: sourceStep.result?.total_files.toString() ?? '0',
      totalSize: humanizeSize(sourceStep.result?.total_bytes ?? 0)
    },
    destinationSummaryProps: {
      path: folders.getFolder('destination') as string,
      title: 'Destination Directory',
      foldersCount: destinationStep.result?.folder_count.toString() ?? '0',
      filesCount: destinationStep.result?.total_files.toString() ?? '0',
      totalSize: humanizeSize(destinationStep.result?.total_bytes ?? 0)
    }
  };
};
