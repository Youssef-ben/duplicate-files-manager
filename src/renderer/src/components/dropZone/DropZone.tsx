import { mergeCls } from '@utils/ClassNameMerger';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

export interface DropZoneProps {
  onFolderSelected: (path: string) => void;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export const DropZone = ({
  onFolderSelected,
  onClick,
  children,
  className
}: DropZoneProps): React.JSX.Element => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragDepthRef = useRef(0);

  const endDragHighlight = (): void => {
    dragDepthRef.current = 0;
    setIsDraggingOver(false);
  };

  const handleDragEnter = (e: React.DragEvent): void => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDraggingOver(false);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    endDragHighlight();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const path = window.appApi.global.getPathForFile(file);
    onFolderSelected(path);
  };

  return (
    <div
      className={mergeCls(
        'rounded-md border border-dashed border-outline-variant cursor-pointer transition-colors duration-300',
        {
          'border-primary bg-primary-container/35 ring-2 ring-primary/25 ring-offset-2 ring-offset-surface':
            isDraggingOver
        },
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
