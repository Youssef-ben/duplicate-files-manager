import { BookmarkSquareIcon } from '@heroicons/react/24/outline';
import { mergeCls } from '@utils/ClassNameMerger';
import { ComponentType, SVGProps } from 'react';

export interface DetailsCardProps {
  isPath?: boolean;
  title: string;
  value: string;
  isFolder?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export const DetailsCard = ({
  title,
  value,
  icon = undefined,
  isPath = false
}: DetailsCardProps): React.JSX.Element => {
  const Icon = icon ?? BookmarkSquareIcon;

  return (
    <div
      title={title ?? ''}
      className={mergeCls(
        'flex items-start h-full gap-2 py-4  px-4 rounded-sm bg-surface-bright shadow-card',
        {
          'flex-row flex-2 justify-between items-start w-fit min-w-[50%]': isPath,
          'flex-row flex-1 justify-start items-start': !isPath
        }
      )}
    >
      {icon && (
        <div className="flex w-10 h-10 flex-col items-center justify-center bg-surface-variant rounded-md p-2">
          <Icon className="size-6 text-primary" />
        </div>
      )}

      <div className="flex flex-2 flex-col items-start justify-center w-full gap-1">
        <span className="text-xs font-semibold text-primary uppercase">{title}</span>
        <span className="text-xs font-normal text-outline-dim font-mono truncate">{value}</span>
      </div>
    </div>
  );
};
