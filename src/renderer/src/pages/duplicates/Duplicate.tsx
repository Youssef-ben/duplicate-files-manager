import { AppWizard } from '@components/appWizard'
import { AppWizardStep } from '@components/appWizard/AppWizard'

const steps: AppWizardStep[] = [
  {
    id: 1,
    label: 'Selection',
    isActive: true,
    isCompleted: false,
    component: <>Selection — pick the root folder to scan (images and videos in scope).</>
  },
  {
    id: 2,
    label: 'Scan',
    isActive: false,
    isCompleted: false,
    component: <>Duplicate scan — build duplicate groups (same content, multiple paths).</>
  },
  {
    id: 3,
    label: 'Review',
    isActive: false,
    isCompleted: false,
    component: (
      <>
        Review and removal — mark paths to remove; dry-run / preview first, then confirm before
        delete.
      </>
    )
  }
]

export const Duplicate = (): React.JSX.Element => {
  return (
    <AppWizard steps={steps}>
      <div className="flex flex-col items-left justify-center w-full gap-1">
        <span className="text-xl font-semibold text-primary">Duplicates Finder</span>
        <p className="text-sm text-outline-dim">
          Find duplicate media in place and resolve them with preview and confirmation.
        </p>
      </div>
    </AppWizard>
  )
}
