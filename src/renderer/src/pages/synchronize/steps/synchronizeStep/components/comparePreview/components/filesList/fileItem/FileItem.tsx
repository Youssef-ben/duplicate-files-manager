import { SynchronizeFile } from '@handlers/cli/types/synchronize.mode'
import { VideoCameraIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@renderer/utils/ClassNameMerger'
import { getFileName, isImage, loadFileUrl } from '@renderer/utils/strings'
import { useMemo } from 'react'

export interface FileItemProps {
  isSelected: boolean
  file: SynchronizeFile
  onClick: (file: SynchronizeFile) => void
}

export const FileItem = ({ isSelected, file, onClick }: FileItemProps): React.JSX.Element => {
  const { is_flagged, path } = file

  const isFileAnImage = useMemo(() => isImage(path), [path])
  const fileName = useMemo(() => getFileName(path), [path])

  return (
    <div
      onClick={() => onClick(file)}
      className={mergeCls(
        'flex flex-row items-center justify-center w-full gap-4 px-2 py-2 rounded-sm bg-surface-container shadow-card cursor-pointer',
        {
          'text-primary hover:bg-surface-variant hover:shadow-ghost': !is_flagged && !isSelected,
          'bg-primary text-on-primary': is_flagged || isSelected,
          'bg-surface-variant text-primary': isSelected,
          'border border-primary': isSelected && is_flagged
        }
      )}
    >
      <div className="flex w-10 h-10 flex-col items-center justify-center bg-surface-variant rounded-md">
        {!isFileAnImage && <VideoCameraIcon className="size-6 text-primary" aria-hidden />}
        {isFileAnImage && (
          <img
            src={loadFileUrl(path)}
            alt={fileName}
            loading="lazy"
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col items-start justify-start h-full w-0 min-w-0">
        <span className="text-xs text-Primary font-semibold">{fileName}</span>
      </div>
    </div>
  )
}
