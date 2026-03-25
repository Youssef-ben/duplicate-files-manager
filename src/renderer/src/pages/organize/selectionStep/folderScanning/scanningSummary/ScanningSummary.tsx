import { ScanningLoader } from '../scanningLoader'
import { DiscoveredStructure } from './discoveredStructure'
import { ScanSummary } from './scanSummary'
import { useScanningSummary } from './useScanningSummary'

export const ScanningSummary = (): React.JSX.Element => {
  const { folderTree, scanSummary, discoveredStructure } = useScanningSummary()

  if (!folderTree) return <ScanningLoader progress={0} label="Loading summary..." />

  return (
    <div className="flex min-h-0 flex-1 flex-row items-stretch gap-2 py-2 pr-1">
      <ScanSummary {...scanSummary} />

      <DiscoveredStructure {...discoveredStructure} />
    </div>
  )
}
