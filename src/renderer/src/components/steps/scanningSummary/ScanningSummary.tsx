import { ScanningResults } from '@handlers/cli/types/scan.mode'
import { DiscoveredStructure } from './discoveredStructure'
import { ScanningLoader } from './scanningLoader'
import { ScanSummary } from './scanSummary'
import { useScanningSummary } from './useScanningSummary'

export interface ScanningSummaryProps {
  result?: ScanningResults
}

export const ScanningSummary = ({ result }: ScanningSummaryProps): React.JSX.Element => {
  const { folderTree, scanSummary, discoveredStructure } = useScanningSummary({ result })

  if (!folderTree) return <ScanningLoader progress={0} label="Loading summary..." />

  return (
    <div className="flex min-h-0 flex-1 flex-row items-stretch gap-2 py-2 pr-1">
      <ScanSummary {...scanSummary} />

      <DiscoveredStructure {...discoveredStructure} />
    </div>
  )
}
