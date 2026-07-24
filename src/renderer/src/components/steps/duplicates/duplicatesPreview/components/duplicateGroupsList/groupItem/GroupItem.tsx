import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { mergeCls } from '@utils/ClassNameMerger';
import { isImage, loadFileUrl } from '@utils/strings';

interface GroupItemProps {
  isSelected: boolean;
  title: string;
  value?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const GroupItem = ({
  isSelected,
  title,
  value,
  imageUrl,
  onClick
}: GroupItemProps): React.JSX.Element => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={mergeCls(
        'flex flex-row items-center justify-center w-full gap-4 px-2 py-2 rounded-sm bg-surface-container shadow-card cursor-pointer',
        {
          'text-primary hover:bg-surface-variant hover:shadow-ghost': !isSelected,
          'bg-primary text-on-primary': isSelected
        }
      )}
    >
      <div className="flex w-10 h-10 flex-col items-center justify-center bg-surface-variant rounded-md">
        {!imageUrl && <PhotoIcon className="size-6 text-primary" />}
        {imageUrl && !isImage(imageUrl) && (
          <VideoCameraIcon className="size-6 text-primary" aria-hidden />
        )}
        {imageUrl && isImage(imageUrl) && (
          <img
            src={loadFileUrl(imageUrl)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start justify-center w-0 min-w-0">
        <div className="flex flex-col items-start justify-center w-full gap-1">
          <span className="text-xs font-semibold truncate w-full">{title}</span>
          {value && (
            <span
              className={mergeCls('text-xs font-normal text-outline-dim', {
                'text-outline-variant': isSelected
              })}
            >
              {value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
