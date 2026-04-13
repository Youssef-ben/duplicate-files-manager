import { DuplicatesPreview, DuplicatesScanner } from '@components/steps'
import { ScanHeader } from './components'
import { useScanStep } from './useScanStep'

export const ScanStep = (): React.JSX.Element => {
  const { isCompleted, headerProps, scannerProps, previewProps } = useScanStep()

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <ScanHeader {...headerProps} />

      {!isCompleted && <DuplicatesScanner {...scannerProps} />}

      {isCompleted && <DuplicatesPreview {...previewProps} />}
    </div>
  )
}
