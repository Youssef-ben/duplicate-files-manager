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
      className={mergeCls(
        'flex flex-row items-center justify-center w-full gap-0 px-2 py-2 rounded-sm shadow-card cursor-pointer',
        'group',
        {
          'bg-surface-container text-primary hover:bg-surface-variant hover:shadow-ghost':
            !isFlagged,
          'bg-primary text-on-primary ': isFlagged
        }
      )}
    >
      <div
        onClick={onClick}
        className="flex flex-row items-center justify-center w-full  h-full gap-2"
      >
        <DuplicateImageThumbnail imagePath={imagePath} isFlagged={isFlagged} title={title} />

        <div className="flex flex-1 flex-col items-start justify-between h-full min-w-0 w-0 overflow-hidden">
          <span className="text-xs font-semibold truncate flex-1">{title}</span>
          <span
            className={mergeCls('text-[10px] font-normal w-full flex-1 truncate', {
              'text-outline-dim': !isFlagged,
              'text-on-primary/60': isFlagged
            })}
          >
            {imagePath}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-fit min-w-12 gap-1">
        <span className="text-[10px] font-normal">{humanizeSize(size)}</span>
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
  )
}

interface DuplicateImageThumbnailProps {
  imagePath: string
  isFlagged: boolean
  title: string
}

const DuplicateImageThumbnail = ({
  imagePath,
  isFlagged,
  title
}: DuplicateImageThumbnailProps): React.JSX.Element => {
  if (isFlagged) {
    return (
      <div className="flex w-10 h-10 flex-col items-center justify-center bg-amber-50/90 text-primary rounded-md">
        <CheckIcon className="size-5 stroke-4 accent-current" />
      </div>
    )
  }

  if (!imagePath) {
    return (
      <div className="flex w-10 h-10 flex-col items-center justify-center bg-surface-variant text-outline-dim rounded-md">
        <PhotoIcon className="size-6 text-primary" />
      </div>
    )
  }

  return (
    <div className="flex w-10 h-10 flex-col items-center justify-center bg-surface-variant text-outline-dim rounded-md">
      {isImage(imagePath) ? (
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
  )
}
