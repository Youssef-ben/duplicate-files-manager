import { SynchronizeFile } from '@handlers/cli/types/synchronize.mode';
import { FilePreview, FilesList, StatusBar, SyncCompleted, SyncLoading } from './components';
import { useComparePreview } from './useComparePreview';

export interface ComparePreviewProps {
  compareResult: SynchronizeFile[];
  onReRunClick: () => void;
}

export const ComparePreview = ({
  compareResult,
  onReRunClick
}: ComparePreviewProps): React.JSX.Element => {
  const { isSynchronizing, statusBarProps, filesListProps, filePreviewProps } =
    useComparePreview(compareResult);

  if (filesListProps.files.length === 0) {
    return <SyncCompleted onReRunClick={onReRunClick} />;
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-0 gap-2 overflow-hidden">
      <SyncLoading isSynchronizing={isSynchronizing} />

      {/* Status Bar */}
      <StatusBar {...statusBarProps} />

      {/* Main Content */}
      <div className="flex flex-row items-stretch justify-center w-full min-h-0 flex-1 overflow-hidden">
        <FilesList {...filesListProps} />

        <FilePreview {...filePreviewProps} />
      </div>
    </div>
  );
};
