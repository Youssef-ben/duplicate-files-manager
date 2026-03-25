import { useOrganizeStore } from '@pages/organize/store/organizeStore'
import { FolderScanning } from './folderScanning'
import { FolderSelection } from './folderSelection'

export const SelectionStep = (): React.JSX.Element => {
  const { selectedFolderPath } = useOrganizeStore()

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      {selectedFolderPath && <FolderScanning />}
      {!selectedFolderPath && <FolderSelection />}
    </div>
  )
}
