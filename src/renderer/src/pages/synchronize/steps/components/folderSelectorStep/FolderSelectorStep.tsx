import { ScanningSummary, StepProgress } from '@components/steps'
import { FolderSelection } from '@components/steps/folderSelection'
import { SynchronizeHeader } from '../synchronizeHeader'
import { useFolderSelectorStep } from './useFolderSelectorStep'

export interface FolderSelectorStepProps {
  folder: 'source' | 'destination'
  stepKey: 'source' | 'destination'
}

export const FolderSelectorStep = ({
  folder,
  stepKey
}: FolderSelectorStepProps): React.JSX.Element => {
  const {
    isCompleted,
    hasSelection,
    showProgress,
    progressProps,
    headerProps,
    selectionProps,
    summaryProps
  } = useFolderSelectorStep({ folder, stepKey })

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <SynchronizeHeader {...headerProps} />

      {!hasSelection && <FolderSelection {...selectionProps} />}

      {showProgress && <StepProgress {...progressProps} />}

      {isCompleted && (
        <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
          <ScanningSummary {...summaryProps} />
        </div>
      )}
    </div>
  )
}
