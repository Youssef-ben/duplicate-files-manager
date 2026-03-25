import { useCliRun } from '@hooks/useCliRun'
import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { useCallback } from 'react'

interface UseFolderSelectionResult {
  handleOnFolderSelected: (path: string) => void
  handleOnBrowseClick: () => void
}

export const useFolderSelection = (): UseFolderSelectionResult => {
  const { openFolder } = useOpenFolderDialog()
  const { setSelectedFolderPath } = useOrganizeStore()
  const { start } = useOrganizeStore(StepSelector('selection'))

  const { run } = useCliRun()

  const handleOnFolderSelected = useCallback(
    (path: string): void => {
      setSelectedFolderPath(path)

      const newRunId = crypto.randomUUID()
      start(newRunId)
      run({
        runId: newRunId,
        mode: 'scan',
        sourceRoot: path
      })
    },
    [setSelectedFolderPath, start, run]
  )

  const handleOnBrowseClick = useCallback(async (): Promise<void> => {
    const path = await openFolder()
    if (path) {
      handleOnFolderSelected(path)
    }
  }, [openFolder, handleOnFolderSelected])

  return { handleOnFolderSelected, handleOnBrowseClick }
}
