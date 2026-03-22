import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog'
import { useCallback } from 'react'
import { FolderSelector } from './folderSelector'
import { SelectionHeader } from './selectionHeader'
import { SelectionNotice } from './selectionNotice'

interface SelectionsContentProps {
  onFolderSelected: (path: string) => void
}

export const SelectionsContent = ({
  onFolderSelected
}: SelectionsContentProps): React.JSX.Element => {
  const { openFolder } = useOpenFolderDialog()

  const handleOnBrowseClick = useCallback(async (): Promise<void> => {
    const path = await openFolder()
    if (path) {
      onFolderSelected(path)
    }
  }, [openFolder, onFolderSelected])

  return (
    <div className="flex flex-col w-full gap-4 h-full">
      {/* Header */}
      <SelectionHeader />

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full gap-2 h-full ">
        {/* Target Directory */}
        <FolderSelector onFolderSelected={onFolderSelected} onClick={handleOnBrowseClick} />

        {/* Footer */}
        <SelectionNotice />
      </div>
    </div>
  )
}
