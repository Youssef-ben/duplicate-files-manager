import { AppWizard } from '@components/appWizard'
import { AppWizardStep } from '@components/appWizard/AppWizard'
import { useCliRun } from '@hooks/useCliRun'
import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { ScanStep, SelectionStep } from './steps'
import { DUPLICATES_STEPS_IDS, useDuplicatesStore } from './store/duplicatesStore'

export const Duplicate = (): React.JSX.Element => {
  const { reset } = useDuplicatesStore()
  const { steps } = useDuplicatesStore(useShallow((state) => ({ steps: state.steps })))

  const { setMenu } = useCliRun()

  useEffect(() => {
    setMenu('duplicate')
  }, [setMenu])

  const handleFinishClick = useCallback(async () => {
    await window.appApi.global.removeFolder('duplicate')
    reset()
  }, [reset])

  const wizardSteps: AppWizardStep[] = useMemo(
    () => [
      {
        id: DUPLICATES_STEPS_IDS.selection,
        label: 'Selection',
        isActive: true,
        isCompleted: steps.selection.status === 'COMPLETED',
        isRunning: steps.selection.status === 'RUNNING',
        component: <SelectionStep />
      },
      {
        id: DUPLICATES_STEPS_IDS.scan,
        label: 'Scan',
        isActive: false,
        isCompleted: steps.scan.status === 'COMPLETED',
        isRunning: steps.scan.status === 'RUNNING',
        component: <ScanStep />
      }
    ],
    [steps]
  )

  return <AppWizard steps={wizardSteps} onFinishClick={handleFinishClick} />
}
