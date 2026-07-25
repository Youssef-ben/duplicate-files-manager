import { StepProgress } from '@components/steps/stepProgress';
import { ComparePreview, Header } from './components';
import { Compare } from './components/compare';
import { useSynchronizeStep } from './useSynchronizeStep';

export const SynchronizeStep = (): React.JSX.Element => {
  const {
    isIdle,
    isRunning,
    isCompleted,
    headerProps,
    compareProps,
    progressProps,
    comparePreviewProps
  } = useSynchronizeStep();

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <Header {...headerProps} />

      {isIdle && <Compare {...compareProps} />}

      {isRunning && <StepProgress {...progressProps} />}

      {isCompleted && <ComparePreview {...comparePreviewProps} />}
    </div>
  );
};
