import { CancelButton, RefreshButton } from '@components/buttons'
import { PulsingDot } from '@components/pulsingDot'
import { useCliRun } from '@hooks/useCliRun'
import {
  OrganizeStepKey,
  StepSelector,
  useOrganizeStore
} from '@pages/organize/store/organizeStore'
import { useCallback, useMemo } from 'react'

export interface CommonStepHeaderProps {
  stepId: OrganizeStepKey
  title: string
  onReRunClick?: () => void
  idleContent: React.JSX.Element
  runningContent?: React.JSX.Element
  completedContent?: React.JSX.Element
}

export const CommonStepHeader = ({
  stepId,
  title,
  onReRunClick,
  idleContent,
  runningContent,
  completedContent
}: CommonStepHeaderProps): React.JSX.Element => {
  const { status, reset } = useOrganizeStore(StepSelector(stepId))

  const { resetRunner } = useCliRun()

  const isRunning = useMemo(() => status === 'RUNNING', [status])
  const isCompleted = useMemo(() => status === 'COMPLETED', [status])

  const onCancelClick = useCallback(() => {
    reset()
    resetRunner()
  }, [reset, resetRunner])

  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <div className="flex flex-row items-baseline justify-between w-full">
        <div className="flex flex-row items-center justify-start">
          <span className="text-xl font-semibold text-primary">{title}</span>
          {isRunning && <PulsingDot />}
        </div>

        {/* Re-run the flattening */}
        {isCompleted && onReRunClick && (
          <RefreshButton title="Re-run Flattening" onClick={onReRunClick} />
        )}

        {/* Cancel the flattening */}
        {isRunning && <CancelButton onClick={onCancelClick} />}
      </div>

      {!isRunning && !isCompleted && idleContent}
      {isRunning && runningContent}
      {isCompleted && completedContent}
    </div>
  )
}
