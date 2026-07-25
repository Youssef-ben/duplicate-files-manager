import { SummaryItem } from './summaryItem';

export interface SummaryProps {
  title: string;
  path: string;
  foldersCount: string;
  filesCount: string;
  totalSize: string;
}

export const Summary = ({
  title,
  path,
  foldersCount,
  filesCount,
  totalSize
}: SummaryProps): React.JSX.Element => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-row items-stretch w-full">
      <div className="flex flex-1 h-fit w-full flex-col items-start justify-start bg-surface gap-2 text-outline-dim rounded-md p-2 px-3">
        <span className="text-xs font-semibold text-primary w-full mb-2 pb-2 border-b border-outline-variant uppercase">
          {title}
        </span>
        <SummaryItem isPath label="Root" value={path} />
        <SummaryItem label="Scanned Folders" value={foldersCount} />
        <SummaryItem label="Files Found" value={filesCount} />
        <SummaryItem label="Total Size" value={totalSize} />
      </div>
    </div>
  );
};
