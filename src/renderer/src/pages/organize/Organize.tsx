import { AppWizard, AppWizardStep } from '@components/appWizard'
import { ORGANIZE_STEPS_IDS, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { ConfirmStep } from './confirmStep'
import { DuplicateStep } from './duplicateStep'
import { FlattenFolder } from './flattenStep'
import { OutputStep } from './outputStep'
import { SelectionStep } from './selectionStep'

export const Organize = (): React.JSX.Element => {
  const { reset } = useOrganizeStore()
  const { steps } = useOrganizeStore(useShallow((state) => ({ steps: state.steps })))

  const wizardSteps: AppWizardStep[] = useMemo(
    () => [
      {
        id: ORGANIZE_STEPS_IDS.selection,
        label: 'Selection',
        isActive: true,
        isCompleted: steps.selection.status === 'COMPLETED',
        isRunning: steps.selection.status === 'RUNNING',
        component: <SelectionStep />
      },
      {
        id: ORGANIZE_STEPS_IDS.output,
        label: 'Output',
        isActive: false,
        isCompleted: steps.output.status === 'COMPLETED',
        isRunning: steps.output.status === 'RUNNING',
        component: <OutputStep />
      },
      {
        id: ORGANIZE_STEPS_IDS.flatten,
        label: 'Flatten',
        isActive: false,
        isCompleted: steps.flatten.status === 'COMPLETED',
        isRunning: steps.flatten.status === 'RUNNING',
        component: <FlattenFolder />
      },
      {
        id: ORGANIZE_STEPS_IDS.duplicates,
        label: 'Duplicates',
        isActive: false,
        isCompleted: steps.duplicates.status === 'COMPLETED',
        isRunning: steps.duplicates.status === 'RUNNING',
        component: <DuplicateStep />
      },
      {
        id: ORGANIZE_STEPS_IDS.confirm,
        label: 'Confirm',
        isActive: false,
        isCompleted: steps.confirm.status === 'COMPLETED',
        isRunning: steps.confirm.status === 'RUNNING',
        component: <ConfirmStep />
      }
    ],
    [steps]
  )

  return <AppWizard steps={wizardSteps} onFinishClick={reset} />
}
