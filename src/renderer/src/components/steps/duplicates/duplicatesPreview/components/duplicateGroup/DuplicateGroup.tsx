import { useMemo } from 'react';
import { GroupFiles, GroupFilesProps } from './groupFiles';
import { GroupPreview } from './groupPreview';

export interface DuplicateGroupProps extends GroupFilesProps {}

export const DuplicateGroup = ({
  files,
  onClick,
  onDeleteClick
}: DuplicateGroupProps): React.JSX.Element => {
  if (!files || files.length === 0) return <></>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filePath = useMemo(() => files[0].path ?? '', [files]);

  return (
    <div className="flex flex-2 flex-col h-full min-h-0 gap-2 w-full overflow-hidden">
      <GroupPreview filePath={filePath} />
      <GroupFiles files={files} onClick={onClick} onDeleteClick={onDeleteClick} />
    </div>
  );
};
