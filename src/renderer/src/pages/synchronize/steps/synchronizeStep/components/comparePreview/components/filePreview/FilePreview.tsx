import { SynchronizeFile } from '@handlers/cli/types/synchronize.mode'
import { CheckIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@renderer/utils/ClassNameMerger'
import { getFileName } from '@renderer/utils/strings'
import { FileMediaPreview } from '../fileMediaPreview'

export interface FilePreviewProps {
  file: SynchronizeFile | null
  onFlagCurrentClick: () => void
}

export const FilePreview = ({ file, onFlagCurrentClick }: FilePreviewProps): React.JSX.Element => {
  if (!file) return <></>

  const { path, is_flagged } = file

  return (
    <div className="flex flex-2 flex-col h-full min-h-0 w-full gap-2 px-2 py-2 overflow-hidden">
      {/* Flag Current File */}
      <div
        onClick={onFlagCurrentClick}
        className="group flex flex-row items-start justify-between w-full h-fit px-2 py-2 gap-1 border-b cursor-pointer border-outline-variant"
      >
        <span className="text-sm font-semibold text-primary">{getFileName(path)}</span>
        <button
          className={mergeCls(
            'flex items-center cursor-pointer justify-center w-5 h-5 rounded-sm ',
            {
              'bg-surface-variant': !is_flagged,
              'bg-primary': is_flagged
            }
          )}
        >
          <CheckIcon
            className={mergeCls('size-4 text-primary rounded-sm', {
              'hidden group-hover:flex group-hover:text-outline': !is_flagged,
              'flex bg-primary text-on-primary stroke-2': is_flagged
            })}
          />
        </button>
      </div>

      {/* File Media Preview */}
      <FileMediaPreview filePath={path} />

      {/* File Path */}
      <div className="flex flex-col items-start justify-center w-full h-fit px-2 py-2 gap-1 border-t border-outline-variant">
        <span className="text-xs font-normal text-outline-dim">{path}</span>
      </div>
    </div>
  )
}
