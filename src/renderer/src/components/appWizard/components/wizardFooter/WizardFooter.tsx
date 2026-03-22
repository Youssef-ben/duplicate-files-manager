import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface WizardFooterProps {
  goToPreviousStep: () => void
  isFirstStep: boolean
  goToNextStep: () => void
  isLastStep: boolean
  isCompleted: boolean
}

export const WizardFooter = ({
  goToPreviousStep,
  isFirstStep,
  goToNextStep,
  isLastStep,
  isCompleted
}: WizardFooterProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-between gap-8 w-full h-12 rounded-b-md px-6 bg-surface-bright border-t border-surface-variant">
      <button
        type="button"
        onClick={goToPreviousStep}
        disabled={isFirstStep}
        className={mergeCls(
          'flex w-fit flex-row items-center justify-center gap-2 rounded-md py-1',
          {
            'opacity-50 cursor-not-allowed': isFirstStep,
            'group cursor-pointer hover:font-medium active:scale-95 ': !isFirstStep
          }
        )}
      >
        <ChevronLeftIcon className="size-4 stroke-2 group-hover:stroke-3" />
        <span className="text-md">Back</span>
      </button>

      <button
        type="button"
        onClick={goToNextStep}
        disabled={isLastStep || !isCompleted}
        className={mergeCls(
          'flex w-[120px] flex-row items-center justify-center gap-1 rounded-md px-4 py-1 transition-colors',
          {
            'opacity-50 cursor-not-allowed': isLastStep || !isCompleted,
            'group active:scale-95 cursor-pointer border border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim':
              !isLastStep && isCompleted
          }
        )}
      >
        <span className="text-md group-hover:font-medium">Continue</span>
        <ChevronRightIcon className="size-4 stroke-2 mt-[3px]" />
      </button>
    </div>
  )
}
