import { ScanningSummaryProps, StepProgressProps } from '@components/steps'
import { FolderSelectionProps } from '@components/steps/folderSelection'
import { ScanningProgressSummary, ScanningResults } from '@handlers/cli/types/scan.mode'
import { useCliRun } from '@hooks/useCliRun'
import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog'
import { SynchronizeHeaderProps } from '@pages/synchronize/steps/components'
import { useSynchronizeStore } from '@pages/synchronize/store/synchronizeStore'
import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'

interface UseFolderSelectorStepResult {
  isCompleted: boolean
  hasSelection: boolean
  showProgress: boolean
  headerProps: SynchronizeHeaderProps
  selectionProps: FolderSelectionProps
  progressProps: StepProgressProps
  summaryProps: ScanningSummaryProps
}

export interface UseFolderSelectorStepProps {
  folder: 'source' | 'destination'
  stepKey: 'source' | 'destination'
}

export const useFolderSelectorStep = ({
  folder,
  stepKey
}: UseFolderSelectorStepProps): UseFolderSelectorStepResult => {
  const { openFolder } = useOpenFolderDialog()
  const { runnerId, summary, progress, resetRunner, stop, run } = useCliRun()

  const { folders, step } = useSynchronizeStore(
    useShallow((state) => {
      return {
        folders: state.folders,
        step: state.steps[stepKey]
      }
    })
  )

  const setFolder = useCallback(
    (path?: string) => {
      folders.setFolder(folder, path)
    },
    [folders, folder]
  )

  const handleOnResetClick = useCallback(() => {
    setFolder(undefined)
    step.reset()
    resetRunner()
  }, [setFolder, step, resetRunner])

  const handleOnCancelClick = useCallback(() => {
    stop()
    setFolder(undefined)
    step.reset()
  }, [stop, setFolder, step])

  const handleOnFolderSelected = useCallback(
    (path: string): void => {
      setFolder(path)

      const newRunId = crypto.randomUUID()
      step.start(newRunId)
      run({
        runId: newRunId,
        menu: 'synchronize',
        mode: 'scan',
        sourceRoot: path
      })
    },
    [setFolder, step, run]
  )

  const handleOnBrowseClick = useCallback(async (): Promise<void> => {
    const path = await openFolder()
    if (path) {
      handleOnFolderSelected(path)
    }
  }, [openFolder, handleOnFolderSelected])

  useEffect(() => {
    if (summary && step.status === 'RUNNING' && step.stepRunnerId === runnerId) {
      const { report_path } = summary as ScanningProgressSummary
      const results = window.appApi.cli.readSummaryResult<ScanningResults>(report_path)
      step.complete(results)
    }
  }, [summary, step, runnerId])

  const isRunning = useMemo(() => step.status === 'RUNNING', [step.status])
  const isCompleted = useMemo(() => step.status === 'COMPLETED', [step.status])

  return {
    isCompleted,
    hasSelection: !!folders.getFolder(folder),
    headerProps: {
      title: `${folder.charAt(0).toUpperCase() + folder.slice(1)} Directory`,
      status: step.status,
      folderPath: folders.getFolder(folder) ?? '',
      onResetClick: handleOnResetClick,
      onCancelClick: handleOnCancelClick
    },
    selectionProps: {
      tips: {
        title: 'Synchronize Finder Tips'
      },
      handleOnFolderSelected: handleOnFolderSelected,
      handleOnBrowseClick: handleOnBrowseClick
    },
    showProgress: isRunning && !isCompleted,
    progressProps: {
      startedAtMs: step.startedAtMs ?? 0,
      progress: progress
    },
    summaryProps: {
      result: step.result
    }
  }
}
