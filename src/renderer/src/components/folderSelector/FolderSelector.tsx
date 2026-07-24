import { DropZone } from '@components/dropZone';
import { FolderIcon } from '@heroicons/react/24/solid';

export interface FolderSelectorProps {
  title: string;
  description: string;
  onClick: () => void;
  onFolderSelected: (path: string) => void;
}

export const FolderSelector = ({
  title,
  description,
  onClick,
  onFolderSelected
}: FolderSelectorProps): React.JSX.Element => {
  return (
    <DropZone
      onFolderSelected={onFolderSelected}
      onClick={onClick}
      className="flex flex-col items-center justify-center w-[80%] lg:w-[50%] gap-4 p-8 h-[340px] mx-auto  "
    >
      <div className="flex flex-row items-center justify-center size-15 gap-1 rounded-md p-2">
        <FolderIcon className="size-13 text-primary" />
      </div>

      <div className="flex flex-col items-center justify-center w-full mb-4 ">
        <span className="text-xl font-bold text-primary">{title}</span>
        <span className="text-md text-outline-dim">{description}</span>
      </div>
    </DropZone>
  );
};
