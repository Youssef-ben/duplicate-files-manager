import { ProgressBar } from '@components/progressBar'
import { ScanningProgressSummary, ScanningResults } from '@handlers/cli/types/scan.mode'
import { useCliRun } from '@hooks/useCliRun'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { getProgressPercentage } from '@utils/strings'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { ScanningHeader } from './scanningHeader'
import { ScanningLoader } from './scanningLoader'
import { ScanningSummary } from './scanningSummary'

export const FolderScanning = (): React.JSX.Element => {
  const { selectedFolderPath, reset } = useOrganizeStore()
  const { result, stepRunnerId, status, complete } = useOrganizeStore(StepSelector('selection'))

  const { runnerId, summary, progress, resetRunner } = useCliRun()

  /**
   * On completion:
   * - Read the summary
   * - Set the summary
   * - Complete the step
   */
  useEffect(() => {
    if (status === 'COMPLETED') return

    if (summary && stepRunnerId === runnerId) {
      const { report_path } = summary as ScanningProgressSummary
      const results = window.appApi.cli.readSummaryResult<ScanningResults>(report_path)
      if (results.folder_count === 0 && results.total_files === 0 && results.total_bytes === 0) {
        reset()
        resetRunner()
        toast.warning('Nothing to organize here. Please select a different folder.')
        return
      }
      complete(results)
    }
  }, [summary, stepRunnerId, runnerId, status, complete, reset, resetRunner])

  const progressPercentage = useMemo(
    () => (status === 'COMPLETED' ? 100 : getProgressPercentage(progress)),
    [progress, status]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-2">
      <ScanningHeader folderPath={selectedFolderPath ?? ''} />

      <div className="flex flex-col items-left justify-center w-full">
        <ProgressBar percentage={progressPercentage} />
        {status !== 'COMPLETED' && progress?.file && (
          <span className="truncate text-[10px] text-outline-dim mb-2">{progress.file}</span>
        )}
      </div>

      {!result ? <ScanningLoader progress={progressPercentage} /> : <ScanningSummary />}
    </div>
  )
}
