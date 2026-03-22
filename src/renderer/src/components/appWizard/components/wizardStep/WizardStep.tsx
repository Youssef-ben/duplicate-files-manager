import { CheckIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'
import { JSX } from 'react'

interface WizardStepProps {
  id: number
  label: string
  isActive: boolean
  isCompleted: boolean
}

export const WizardStep = ({ id, label, isActive, isCompleted }: WizardStepProps): JSX.Element => {
  return (
    <div
      className={mergeCls(
        'flex min-w-30 flex-row cursor-context-menu items-center justify-center gap-2 pb-2 pr-2 text-outline-dim border-b-2 border-rounded-full border-transparent transition-all duration-300 ease-in-out text-sm',
        {
          ' border-primary text-primary font-bold ': isActive,
          ' text-primary font-medium ': isCompleted && !isActive
        }
      )}
    >
      <span
        className={mergeCls(
          'rounded-full bg-surface-variant/60 size-5 text-[11px]  flex items-center justify-center',
          {
            'bg-primary text-on-primary': isActive,
            'text-on-outline-dim font-bold': isCompleted && !isActive
          }
        )}
      >
        {isCompleted && !isActive && <CheckIcon className="size-3 stroke-2 text-on-outline-dim" />}
        {!isCompleted && id}
      </span>
      <span className="capitalize">{label}</span>
    </div>
  )
}
