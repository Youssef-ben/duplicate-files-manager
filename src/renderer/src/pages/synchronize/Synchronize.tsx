import { AppWizard } from '@components/appWizard'
import { AppWizardStep } from '@components/appWizard/AppWizard'

const steps: AppWizardStep[] = [
  {
    id: 1,
    label: 'Selection',
    isActive: true,
    isCompleted: false,
    component: <>Selection — choose folder A and folder B (both trees in scope).</>,
    isRunning: false
  },
  {
    id: 2,
    label: 'Scan',
    isActive: false,
    isCompleted: false,
    component: <>Scan / compare — preview-only diff (only on A, only on B, conflicts per CLI).</>,
    isRunning: false
  },
  {
    id: 3,
    label: 'Direction',
    isActive: false,
    isCompleted: false,
    component: (
      <>Direction — A → B, B → A, or bidirectional (each side gets missing files from the other).</>
    ),
    isRunning: false
  },
  {
    id: 4,
    label: 'Review',
    isActive: false,
    isCompleted: false,
    component: (
      <>
        Review and sync — choose planned copies; dry-run / preview first, then confirm before write.
      </>
    ),
    isRunning: false
  }
]

export const Synchronize = (): React.JSX.Element => {
  return (
    <AppWizard steps={steps}>
      <div className="flex flex-col items-left justify-center w-full gap-1">
        <span className="text-xl font-semibold text-primary">Library Synchronizer</span>
        <p className="text-sm text-outline-dim">
          Align two folder trees with a clear direction and confirmed apply step.
        </p>
      </div>
    </AppWizard>
  )
}
