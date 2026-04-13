import { CommonStepHeader } from '@components/steps'
import { FolderIcon } from '@heroicons/react/24/outline'
import type { StepStatus } from '@renderer/types/common'

interface SelectionHeaderProps {
  folderPath: string
  status: StepStatus
  onResetClick: () => void
}

export const SelectionHeader = ({
  folderPath,
  status,
  onResetClick
}: SelectionHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Library Organizer"
      status={status}
      onCancelClick={onResetClick}
      onReRunClick={onResetClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={<CompletedContent folderPath={folderPath} />}
    />
  )
}

const IdleContent = (): React.JSX.Element => {
  return <div>Choose a root directory to begin the organization process.</div>
}

const RunningContent = (): React.JSX.Element => {
  return <div>Scanning directory structure to prepare for the organization process.</div>
}

interface CompletedContentProps {
  folderPath: string
}
const CompletedContent = ({ folderPath }: CompletedContentProps): React.JSX.Element => {
  return (
    <div className="flex max-w-full min-w-0 flex-row items-baseline justify-between gap-2 mt-1">
      <div
        className="w-0 min-w-0 flex-1 truncate text-sm text-outline-dim"
        title={folderPath.trim()}
      >
        <div className="relative w-full flex flex-row items-baseline justify-start">
          <FolderIcon className="absolute size-4 stroke-3 shrink-0 bottom-px " />
          <span className="ml-5 text-xs font-semibold w-full truncate">{folderPath.trim()}</span>
        </div>
      </div>
    </div>
  )
}
