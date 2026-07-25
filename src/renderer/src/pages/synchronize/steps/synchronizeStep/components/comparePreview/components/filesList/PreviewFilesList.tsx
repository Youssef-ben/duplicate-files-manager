import { SynchronizeFile } from '@handlers/cli/types/synchronize.mode';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { FileItem } from './fileItem/FileItem';

const GROUP_ROW_STRIDE_PX = 64;
const RENDER_HIDDEN_GROUPS = 4;

export interface FilesListProps {
  files: SynchronizeFile[];
  selectedFile: SynchronizeFile | null;
  onFileClick: (file: SynchronizeFile) => void;
}

export const FilesList = ({
  files,
  selectedFile,
  onFileClick
}: FilesListProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => ref.current,
    estimateSize: () => GROUP_ROW_STRIDE_PX,
    overscan: RENDER_HIDDEN_GROUPS
  });

  return (
    <div className="flex flex-1 flex-col h-full min-h-0">
      <div ref={ref} className="h-full min-h-0 w-full overflow-y-auto p-2">
        <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((item) => {
            const currentFile = files[item.index];
            if (!currentFile) return null;

            return (
              <div
                key={item.key}
                className="absolute top-0 left-0 w-full box-border"
                style={{
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`
                }}
              >
                <FileItem
                  isSelected={selectedFile?.hash === currentFile.hash}
                  file={currentFile}
                  onClick={onFileClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
