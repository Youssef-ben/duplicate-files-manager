import { SimpleButton } from '@components/buttons';
import { StepProgress } from '@components/steps';
import { CliProgressEvent } from '@handlers/cli/types';
import { SelectionPreview, SelectionPreviewProps } from './selectionPreview';

export interface DuplicatesScannerProps extends SelectionPreviewProps {
  isIdle: boolean;
  isRunning: boolean;
  isCompleted: boolean;
  progress: CliProgressEvent | null;
  startedAtMs: number;
  onStartScan: () => void;
}

export const DuplicatesScanner = ({
  isIdle,
  isRunning,
  progress,
  startedAtMs,
  folderPath,
  scanningResults,
  onStartScan
}: DuplicatesScannerProps): React.JSX.Element => {
  return (
    <div className="flex flex-col w-full h-full min-h-0 gap-2 p-0 overflow-hidden">
      <SelectionPreview folderPath={folderPath} scanningResults={scanningResults} />

      {/* Start Processing Button */}
      {isIdle && (
        <div className="flex flex-col items-end justify-center w-full gap-1">
          <SimpleButton variant="outline" label="Find Duplicates" onClick={onStartScan} />
        </div>
      )}

      {isRunning && <StepProgress startedAtMs={startedAtMs} progress={progress} />}
    </div>
  );
};
