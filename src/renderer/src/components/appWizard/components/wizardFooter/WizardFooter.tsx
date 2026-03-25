import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface WizardFooterProps {
  goToPreviousStep: () => void
  isFirstStep: boolean
  goToNextStep: () => void
  isLastStep: boolean
  isCompleted: boolean
  isRunning: boolean
  isWizardCompleted: boolean
  onWizardCompleted: () => void
}

export const WizardFooter = ({
  goToPreviousStep,
  isFirstStep,
  goToNextStep,
  isLastStep,
  isCompleted,
  isRunning,
  isWizardCompleted,
  onWizardCompleted
}: WizardFooterProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-between gap-8 w-full h-12 rounded-b-md px-6 bg-surface-bright border-t border-surface-variant">
      <button
        id="wizard-previous"
        type="button"
        onClick={goToPreviousStep}
        disabled={isFirstStep || isRunning}
        className={mergeCls(
          'flex w-fit flex-row items-center justify-center gap-2 rounded-md py-1',
          {
            'opacity-50 cursor-not-allowed': isFirstStep || isRunning,
            'group cursor-pointer hover:font-medium active:scale-95 ': !isFirstStep && !isRunning
          }
        )}
      >
        <ChevronLeftIcon className="size-4 stroke-2 group-hover:stroke-3" />
        <span className="text-md">Back</span>
      </button>

      <button
        id="wizard-next"
        type="button"
        onClick={isWizardCompleted ? onWizardCompleted : goToNextStep}
        disabled={(isLastStep && !isWizardCompleted) || !isCompleted}
        className={mergeCls(
          'flex w-[120px] flex-row items-center justify-center gap-1 rounded-md px-4 py-1 transition-colors',
          {
            'opacity-50 cursor-not-allowed': (isLastStep && !isWizardCompleted) || !isCompleted,
            'group active:scale-95 cursor-pointer border border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim':
              (!isLastStep && isCompleted) || (isLastStep && isWizardCompleted)
          }
        )}
      >
        <span className="text-md group-hover:font-medium">
          {isWizardCompleted ? 'Finish' : 'Continue'}
        </span>
        {!isWizardCompleted && <ChevronRightIcon className="size-4 stroke-2 mt-[3px]" />}
      </button>
    </div>
  )
}
