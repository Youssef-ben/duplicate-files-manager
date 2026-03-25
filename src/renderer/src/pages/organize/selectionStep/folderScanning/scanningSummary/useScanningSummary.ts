import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { humanizeSize } from '@utils/strings'
import { useMemo } from 'react'
import { DiscoveredStructureProps } from './discoveredStructure'
import { ScanSummaryProps } from './scanSummary'
import { FolderNode } from './summaryFolderTree'
import { useExpandCollapse } from './useExpandCollapse'
import { useFolderTree } from './useFolderTree'

interface UseScanningSummaryResult {
  folderTree: FolderNode[]
  scanSummary: ScanSummaryProps
  discoveredStructure: DiscoveredStructureProps
}

export const useScanningSummary = (): UseScanningSummaryResult => {
  const folderTree = useFolderTree()
  const { expanded, isAnyExpanded, expandAll, collapseAll, toggle } = useExpandCollapse(folderTree)

  const { result } = useOrganizeStore(StepSelector('selection'))

  const scanSummary: ScanSummaryProps = useMemo(
    () => ({
      foldersCount: result?.folder_count.toLocaleString() ?? '0',
      filesCount: result?.total_files.toLocaleString() ?? '0',
      totalSize: humanizeSize(result?.total_bytes ?? 0)
    }),
    [result]
  )

  const discoveredStructure: DiscoveredStructureProps = useMemo(
    () => ({
      isAnyExpanded,
      collapseAll,
      expandAll,
      folderTree,
      expanded,
      toggle
    }),
    [isAnyExpanded, collapseAll, expandAll, folderTree, expanded, toggle]
  )

  return {
    folderTree,
    scanSummary,
    discoveredStructure
  }
}
