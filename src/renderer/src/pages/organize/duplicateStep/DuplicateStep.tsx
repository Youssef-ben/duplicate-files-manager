import { DuplicatesPreview, DuplicatesScanner } from '@components/steps';
import { DuplicateHeader } from './duplicateHeader';
import { useDuplicateStep } from './useDuplicateStep';

export const DuplicateStep = (): React.JSX.Element => {
  const { isCompleted, headerProps, scannerProps, previewProps } = useDuplicateStep();

  return (
    <div className="flex flex-1 flex-col w-full h-full gap-4 overflow-hidden">
      <DuplicateHeader {...headerProps} />

      {!isCompleted && <DuplicatesScanner {...scannerProps} />}

      {isCompleted && <DuplicatesPreview {...previewProps} />}
    </div>
  );
};
