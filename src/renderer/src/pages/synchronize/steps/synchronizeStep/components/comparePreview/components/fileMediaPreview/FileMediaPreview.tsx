import { MediaPreview } from '@components/mediaPreview';

export interface FileMediaPreviewProps {
  filePath: string;
}

export const FileMediaPreview = ({ filePath }: FileMediaPreviewProps): React.JSX.Element => {
  return (
    <div className="flex shrink-0 items-center justify-center px-0 pt-0 w-full min-h-0">
      <div className="w-[350px] h-[350px] xl:w-[450px] xl:h-[450px] aspect-square min-w-0">
        <MediaPreview filePath={filePath} />
      </div>
    </div>
  );
};
