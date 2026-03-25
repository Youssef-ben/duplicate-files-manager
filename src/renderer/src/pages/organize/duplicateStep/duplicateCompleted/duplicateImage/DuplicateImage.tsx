import { CheckIcon, PhotoIcon, TrashIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'
import { getFolderName, humanizeSize, isImage, loadFileUrl } from '@utils/strings'

interface DuplicateImageProps {
  imagePath: string
  size: number
  isFlagged: boolean
  onClick?: () => void
  onDeleteClick?: () => void
}

export const DuplicateImage = ({
  imagePath,
  size,
  isFlagged,
  onClick,
  onDeleteClick
}: DuplicateImageProps): React.JSX.Element => {
  const title = `${getFolderName(imagePath)}`
  return (
    <div
      title={title}
      onClick={onClick}
      className={mergeCls(
        'flex flex-row items-center justify-center w-full gap-4 px-2 py-2 rounded-sm bg-surface-container shadow-card cursor-pointer',
        'group',
        {
          'text-primary hover:bg-surface-variant hover:shadow-ghost': !isFlagged,
          'bg-primary text-on-primary border border-primary': isFlagged
        }
      )}
    >
      <div
        className={mergeCls(
          'flex w-10 h-10 flex-col items-center justify-center bg-surface-variant text-outline-dim rounded-md',
          {
            hidden: isFlagged
          }
        )}
      >
        {!imagePath ? (
          <PhotoIcon className="size-6 text-primary" />
        ) : isImage(imagePath) ? (
          <img
            src={loadFileUrl(imagePath)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <VideoCameraIcon className="size-6 text-primary" aria-hidden />
        )}
      </div>
      <div
        className={mergeCls(
          ' hidden w-10 h-10 flex-col items-center justify-center bg-transparent text-outline-dim rounded-md',
          {
            'flex bg-amber-50/90 text-primary': isFlagged
          }
        )}
      >
        <CheckIcon className="size-5 stroke-4 accent-current" />
      </div>

      <div className="flex flex-1 flex-col items-start justify-center w-0 min-w-0">
        <div className="flex flex-col items-start justify-center w-full gap-1">
          <div className="flex flex-row items-center justify-between w-full">
            <span className="text-xs font-semibold truncate flex-1">{title}</span>
            <span className="text-[10px] font-normal">{humanizeSize(size)}</span>
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-1 min-w-0">
            <span
              className={mergeCls('text-[10px] font-normal min-w-0 flex-1 truncate', {
                'text-outline-dim': !isFlagged,
                'text-on-primary/60': isFlagged
              })}
            >
              {imagePath}
            </span>
            <button
              type="button"
              title="Delete File"
              onClick={onDeleteClick}
              className={mergeCls(
                'flex w-6 h-6 flex-row items-center justify-center gap-1 rounded-full p-1 transition-colors group active:scale-95 cursor-pointer',
                'hover:bg-error/30 hover:text-error hover:border-error',
                {
                  'border-surface bg-surface text-primary': isFlagged,
                  'border-primary bg-transparent text-primary': !isFlagged
                }
              )}
            >
              <TrashIcon className="size-4 stroke-2 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
