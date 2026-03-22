import { useCliRun } from '@hooks/useCliRun'
import { useOrganizeStore } from '@pages/organize/store/organizeStore'
import { useCallback } from 'react'
import { ScanningContent } from './scanningContent'
import { SelectionsContent } from './selectionsContent'

export const FolderSelections = (): React.JSX.Element => {
  const { rootFolderPath, setRootFolderPath } = useOrganizeStore()
  const { run } = useCliRun()

  const handleOnFolderSelected = useCallback(
    (path: string): void => {
      setRootFolderPath(path)
      run({ sourceRoot: path, mode: 'scan' })
    },
    [setRootFolderPath, run]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      {rootFolderPath ? (
        <ScanningContent />
      ) : (
        <SelectionsContent onFolderSelected={handleOnFolderSelected} />
      )}
    </div>
  )
}
