import type { CliProgressEvent } from '@handlers/cli'
import { DuplicatesProgressSummary } from '@handlers/cli/types/duplicates.mode'
import { ScanningResults } from '@handlers/cli/types/scan.mode'
import { useCliRun } from '@hooks/useCliRun'
import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog'
import { DuplicatesStep } from '@pages/duplicates/store/duplicatesStore'
import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { useOrganizeStore } from '../store/organizeStore'

interface UseFolderSelectionResult {
  step: DuplicatesStep<ScanningResults>
  folder: string
  progress: CliProgressEvent | null
  isRunning: boolean
  isCompleted: boolean
  handleOnResetClick: () => void
  handleOnFolderSelected: (path: string) => void
  handleOnBrowseClick: () => void
}

export const useFolderSelection = (): UseFolderSelectionResult => {
  const { openFolder } = useOpenFolderDialog()
  const { runnerId, progress, summary, run, resetRunner } = useCliRun()

  const { selectedFolderPath, setSelectedFolderPath, step, reset } = useOrganizeStore(
    useShallow((state) => {
      return {
        selectedFolderPath: state.selectedFolderPath,
        setSelectedFolderPath: state.setSelectedFolderPath,
        step: state.steps.selection,
        reset: state.reset
      }
    })
  )

  const handleOnResetClick = useCallback(() => {
    reset()
    resetRunner()
  }, [resetRunner, reset])

  const handleOnFolderSelected = useCallback(
    (path: string): void => {
      setSelectedFolderPath(path)

      const newRunId = crypto.randomUUID()
      step.start(newRunId)
      run({
        runId: newRunId,
        menu: 'organize',
        mode: 'scan',
        sourceRoot: path
      })
    },
    [setSelectedFolderPath, step, run]
  )

  const handleOnBrowseClick = useCallback(async (): Promise<void> => {
    const path = await openFolder()
    if (path) {
      handleOnFolderSelected(path)
    }
  }, [openFolder, handleOnFolderSelected])

  useEffect(() => {
    if (summary && step.status === 'RUNNING' && step.stepRunnerId === runnerId) {
      const { report_path } = summary as DuplicatesProgressSummary
      const results = window.appApi.cli.readSummaryResult<ScanningResults>(report_path)
      step.complete(results)
    }
  }, [summary, step, runnerId])

  const isRunning = useMemo(() => step.status === 'RUNNING', [step.status])
  const isCompleted = useMemo(() => step.status === 'COMPLETED', [step.status])

  return {
    step: step,
    folder: selectedFolderPath ?? '',
    progress,
    isRunning,
    isCompleted,
    handleOnResetClick,
    handleOnFolderSelected,
    handleOnBrowseClick
  }
}
