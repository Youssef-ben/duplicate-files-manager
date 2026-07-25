import { CancelButton, RefreshButton } from '@components/buttons';
import { PulsingDot } from '@components/pulsingDot';
import { StepStatus } from '@renderer/types/common';
import { useMemo } from 'react';

export interface CommonStepHeaderProps {
  title: string;
  status: StepStatus;
  idleContent: React.JSX.Element;
  runningContent?: React.JSX.Element;
  completedContent?: React.JSX.Element;
  onCancelClick: () => void;
  onReRunClick: () => void;
}

export const CommonStepHeader = ({
  title,
  status,
  idleContent,
  runningContent,
  completedContent,
  onCancelClick,
  onReRunClick
}: CommonStepHeaderProps): React.JSX.Element => {
  const isRunning = useMemo(() => status === 'RUNNING', [status]);
  const isCompleted = useMemo(() => status === 'COMPLETED', [status]);

  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <div className="flex flex-row items-baseline justify-between w-full">
        <div className="flex flex-row items-center justify-start">
          <span className="text-xl font-semibold text-primary">{title}</span>
          {isRunning && <PulsingDot />}
        </div>

        {/* Re-run the action */}
        {isCompleted && onReRunClick && (
          <RefreshButton title="Re-run process" onClick={onReRunClick} />
        )}

        {/* Cancel the action */}
        {isRunning && <CancelButton onClick={onCancelClick} />}
      </div>

      <div className="text-sm text-outline-dim text-justify">
        {!isRunning && !isCompleted && idleContent}
        {isRunning && runningContent}
        {isCompleted && completedContent}
      </div>
    </div>
  );
};
