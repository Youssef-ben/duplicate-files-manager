import { DetailsCard } from '@components/detailsCard';
import { FolderIcon } from '@heroicons/react/24/outline';
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore';
import { humanizeSize } from '@utils/strings';

export const FlatteningPreview = (): React.JSX.Element => {
  const { selectedFolderPath } = useOrganizeStore();
  const { result } = useOrganizeStore(StepSelector('selection'));

  if (!result || !selectedFolderPath) return <></>;

  return (
    <div className="flex flex-row items-start justify-center w-full gap-2 px-2 py-2">
      <DetailsCard isPath title="Root Folder" value={selectedFolderPath} icon={FolderIcon} />
      <DetailsCard title="Folders" value={result.folder_count.toLocaleString()} />
      <DetailsCard title="Files" value={result.total_files.toLocaleString()} />
      <DetailsCard title="Size" value={humanizeSize(result.total_bytes)} />
    </div>
  );
};
