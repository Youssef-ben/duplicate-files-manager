import { AppWizard } from '@components/appWizard'
import { AppWizardStep } from '@components/appWizard/AppWizard'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { useMemo } from 'react'
import { FolderSelections } from './folderSelections'

export const Organize = (): React.JSX.Element => {
  const selectionStep = useOrganizeStore(StepSelector('selection'))

  const steps: AppWizardStep[] = useMemo(
    () => [
      {
        id: 1,
        label: 'Selection',
        isActive: true,
        isCompleted: selectionStep.isCompleted,
        component: <FolderSelections />
      },
      {
        id: 2,
        label: 'Flatten',
        isActive: false,
        isCompleted: false,
        component: <>Flatten</>
      },
      {
        id: 3,
        label: 'Duplicates',
        isActive: false,
        isCompleted: false,
        component: <>Duplicates</>
      },
      {
        id: 4,
        label: 'Confirm',
        isActive: false,
        isCompleted: false,
        component: <>Confirm</>
      }
    ],
    [selectionStep]
  )

  return <AppWizard steps={steps} />
}
