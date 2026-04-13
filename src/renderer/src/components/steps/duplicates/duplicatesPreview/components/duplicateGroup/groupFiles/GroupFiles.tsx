import { DuplicatesFile } from '@handlers/cli/types/duplicates.mode'
import { DuplicateImage } from './duplicateImage'

export interface GroupFilesProps {
  files: DuplicatesFile[]
  onClick: (filePath: string) => void
  onDeleteClick: (filePath: string) => void
}

export const GroupFiles = ({
  files,
  onClick,
  onDeleteClick
}: GroupFilesProps): React.JSX.Element => {
  return (
    <div className="flex flex-2 flex-col min-h-0 w-full overflow-y-auto px-4 py-2 gap-2">
      {files.map((file) => (
        <DuplicateImage
          key={file.path}
          imagePath={file.path}
          size={file.size_bytes}
          isFlagged={file.is_flagged}
          onClick={() => onClick(file.path)}
          onDeleteClick={() => onDeleteClick(file.path)}
        />
      ))}
    </div>
  )
}
