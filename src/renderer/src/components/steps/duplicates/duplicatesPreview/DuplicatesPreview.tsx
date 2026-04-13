import { DuplicatesResults } from '@handlers/cli/types/duplicates.mode'
import {
  CleanUpCompleted,
  DuplicateGroup,
  DuplicateGroupsList,
  DuplicateStatusBar
} from './components'
import { useDuplicatesPreview } from './useDuplicatesPreview'

export interface DuplicatesPreviewProps {
  menu: 'duplicate' | 'organize'
  duplicatesResults?: DuplicatesResults
  onRunCli: (inputPath: string) => void
  onReRunClick: () => void
}

export const DuplicatesPreview = ({
  menu,
  duplicatesResults,
  onRunCli,
  onReRunClick
}: DuplicatesPreviewProps): React.JSX.Element => {
  const { selectedGroup, groups, statusBarProps, groupsListProps, groupProps } =
    useDuplicatesPreview({ menu, duplicatesResults, onRunCli })

  if (Object.keys(groups).length === 0) {
    return <CleanUpCompleted onReRunClick={onReRunClick} />
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-0 gap-2 p-0 overflow-hidden">
      {/* Status Bar */}
      <DuplicateStatusBar {...statusBarProps} />

      {/* Main Content */}
      <div className="flex flex-row items-stretch justify-center w-full min-h-0 flex-1 overflow-hidden">
        <DuplicateGroupsList {...groupsListProps} />

        {selectedGroup && <DuplicateGroup {...groupProps} />}
      </div>
    </div>
  )
}
