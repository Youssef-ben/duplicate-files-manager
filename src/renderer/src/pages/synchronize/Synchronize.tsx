import { AppWizard } from '@components/appWizard';
import { AppWizardStep } from '@components/appWizard/AppWizard';
import { useCliRun } from '@hooks/useCliRun';
import { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { DestinationStep, SourceStep, SynchronizeStep } from './steps';
import { SYNCHRONIZE_STEPS_IDS, useSynchronizeStore } from './store/synchronizeStore';

export const Synchronize = (): React.JSX.Element => {
  const { reset, steps } = useSynchronizeStore(
    useShallow((state) => ({
      reset: state.reset,
      steps: state.steps
    }))
  );

  const { setMenu } = useCliRun();

  useEffect(() => {
    setMenu('synchronize');
  }, [setMenu]);

  const handleFinishClick = useCallback(async () => {
    await window.appApi.global.removeFolder('synchronize');
    reset();
  }, [reset]);

  const wizardSteps: AppWizardStep[] = useMemo(
    () => [
      {
        id: SYNCHRONIZE_STEPS_IDS.source,
        label: 'Source',
        isActive: true,
        isCompleted: steps.source.status === 'COMPLETED',
        isRunning: steps.source.status === 'RUNNING',
        component: <SourceStep />
      },
      {
        id: SYNCHRONIZE_STEPS_IDS.destination,
        label: 'Destination',
        isActive: false,
        isCompleted: steps.destination.status === 'COMPLETED',
        isRunning: steps.destination.status === 'RUNNING',
        component: <DestinationStep />
      },
      {
        id: SYNCHRONIZE_STEPS_IDS.synchronize,
        label: 'Synchronize',
        isActive: false,
        isCompleted: steps.synchronize.status === 'COMPLETED',
        isRunning: steps.synchronize.status === 'RUNNING',
        component: <SynchronizeStep />
      }
    ],
    [steps]
  );

  return <AppWizard steps={wizardSteps} onFinishClick={handleFinishClick} />;
};
