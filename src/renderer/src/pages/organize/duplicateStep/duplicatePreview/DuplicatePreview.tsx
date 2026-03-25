import { DetailsCard } from '@components/detailsCard'
import { DocumentDuplicateIcon, FolderIcon, ServerIcon } from '@heroicons/react/24/outline'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { humanizeSize } from '@utils/strings'

export const DuplicatePreview = (): React.JSX.Element => {
  const { getPath } = useOrganizeStore()
  const { result } = useOrganizeStore(StepSelector('flatten'))

  if (!result || !getPath()) return <></>

  return (
    <div className="flex flex-row items-start justify-center w-full gap-2 py-2 px-2">
      <DetailsCard isPath title="Working Folder" value={getPath()} icon={FolderIcon} />
      <DetailsCard
        title="Files Staged"
        value={result.total_staged.toLocaleString()}
        icon={DocumentDuplicateIcon}
      />
      <DetailsCard title="Size" value={humanizeSize(result.total_bytes)} icon={ServerIcon} />
    </div>
  )
}
