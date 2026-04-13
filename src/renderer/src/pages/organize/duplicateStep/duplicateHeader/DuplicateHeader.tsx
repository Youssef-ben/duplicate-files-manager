import { CommonStepHeader } from '@components/steps/commonStepHeader'
import type { StepStatus } from '@renderer/types/common'
import { humanizeSize } from '@utils/strings'

export interface DuplicateHeaderProps extends CompletedContentProps {
  status: StepStatus
  onCancelClick: () => void
  onReRunClick: () => void
}

export const DuplicateHeader = ({
  status,
  groupsCount,
  filesCount,
  totalSize,
  onCancelClick,
  onReRunClick
}: DuplicateHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Finding Duplicates"
      status={status}
      onCancelClick={onCancelClick}
      onReRunClick={onReRunClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={
        <CompletedContent groupsCount={groupsCount} filesCount={filesCount} totalSize={totalSize} />
      }
    />
  )
}

const IdleContent = (): React.JSX.Element => {
  return (
    <p className="text-sm text-outline-dim text-justify w-full">
      <span className="block mb-2 w-full">
        Analyze the staged folder to safely detect and report duplicate files.
      </span>
    </p>
  )
}

const RunningContent = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <p className="text-sm text-outline-dim text-justify">
        Carefully scanning to identify duplicates — no changes are being made yet.
      </p>
    </div>
  )
}

interface CompletedContentProps {
  groupsCount: number
  filesCount: number
  totalSize: number
}

const CompletedContent = ({
  groupsCount,
  filesCount,
  totalSize
}: CompletedContentProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-6">
      <div className="flex flex-row items-center justify-start gap-1">
        <span className="text-xs font-semibold text-primary bg-primary-dim/10 px-2 py-1 rounded-md w-fit">
          <span className="font-mono">{groupsCount.toLocaleString()}</span> Groups (
          <span className="font-mono">{filesCount.toLocaleString()}</span> files,{' '}
          <span className="font-mono">{humanizeSize(totalSize)}</span>)
        </span>
        <span className="text-sm text-outline-dim text-justify">
          — Choose the versions to delete and confirm to apply your changes.
        </span>
      </div>
    </div>
  )
}
