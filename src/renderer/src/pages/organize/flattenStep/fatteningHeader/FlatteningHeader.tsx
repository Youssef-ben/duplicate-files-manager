import { CommonStepHeader } from '@components/steps/commonStepHeader'
import type { StepStatus } from '@renderer/types/common'

interface FlatteningHeaderProps {
  status: StepStatus
  onCancelClick: () => void
  onReRunClick: () => void
}

export const FlatteningHeader = ({
  status,
  onCancelClick,
  onReRunClick
}: FlatteningHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Staging Files"
      status={status}
      onCancelClick={onCancelClick}
      onReRunClick={onReRunClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={<CompletedContent />}
    />
  )
}

const IdleContent = (): React.JSX.Element => {
  return (
    <p className="text-sm text-outline-dim text-justify w-full">
      <span className="block mb-2 w-full">
        When started the app will moves files from their original folders into a staging folder. If
        duplicates are found, they&apos;ll be renamed with a suffix that you can specify in the
        settings
        <span className="text-xs font-semibold text-on-surface-variant italic pl-1">
          (Default: *_[0-9]*)
        </span>
        .
      </span>
      <span className="text-xs font-semibold text-primary italic px-2 py-1 bg-surface border-l-4 border-primary w-full">
        Note that this keeps the original files intact—only copies are created in the staging
        folder. This is a non-destructive action.
      </span>
    </p>
  )
}

const RunningContent = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <p className="text-sm text-outline-dim text-justify">
        Currently flattening your directory structure and preparing the staging area.
      </p>
    </div>
  )
}

const CompletedContent = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <p className="text-sm text-outline-dim text-justify">
        Your directory structure has been staged and is ready for the next step.
      </p>
    </div>
  )
}
