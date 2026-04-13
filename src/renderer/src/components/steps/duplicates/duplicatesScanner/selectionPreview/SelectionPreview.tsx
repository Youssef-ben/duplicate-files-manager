import { DetailsCard } from '@components/detailsCard'
import { ScanningResults } from '@handlers/cli/types/scan.mode'
import { DocumentDuplicateIcon, FolderIcon, ServerIcon } from '@heroicons/react/24/outline'
import { humanizeSize } from '@utils/strings'

export interface SelectionPreviewProps {
  folderPath?: string
  scanningResults?: ScanningResults
}

export const SelectionPreview = ({
  folderPath,
  scanningResults
}: SelectionPreviewProps): React.JSX.Element => {
  if (!scanningResults || !folderPath) return <></>

  return (
    <div className="flex flex-row items-start justify-center w-full gap-2 p-2 ">
      <DetailsCard isPath title="Working Folder" value={folderPath} icon={FolderIcon} />
      <DetailsCard
        title="Files Staged"
        value={scanningResults.total_files.toLocaleString()}
        icon={DocumentDuplicateIcon}
      />
      <DetailsCard
        title="Size"
        value={humanizeSize(scanningResults.total_bytes)}
        icon={ServerIcon}
      />
    </div>
  )
}
