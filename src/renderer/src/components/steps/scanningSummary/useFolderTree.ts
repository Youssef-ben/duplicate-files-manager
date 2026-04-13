import { ScannedResultsFolder, ScanningResults } from '@handlers/cli/types/scan.mode'
import { getFolderName, getParentFolderPath, normalizeFolderPath } from '@utils/strings'
import { useMemo } from 'react'
import { FolderNode } from './summaryFolderTree'

/**
 * Sorts a folder tree in place by name
 * @param nodes - The nodes to sort
 */
function sortFolderTreeInPlace(nodes: FolderNode[]): void {
  nodes.sort((a, b) => a.name.localeCompare(b.name))

  for (const node of nodes) {
    sortFolderTreeInPlace(node.children)
  }
}

/**
 * Builds a folder tree based on the summary results.
 *
 * @param folders - The folders to build the tree from
 * @param root - The root folder
 * @returns The folder tree
 */
function buildFolderTree(folders: ScannedResultsFolder[], root: string): FolderNode[] {
  const rootNorm = normalizeFolderPath(root)
  const nodeMap = new Map<string, FolderNode>()

  for (const folder of folders) {
    if (!folder.path.trim()) continue

    const pathNorm = normalizeFolderPath(folder.path)
    if (pathNorm === rootNorm || pathNorm === '') continue

    // key is normalized for reliable lookup; path retains original for display
    nodeMap.set(pathNorm, {
      path: folder.path,
      name: getFolderName(folder.path),
      size: folder.recursive_bytes,
      files: folder.direct_files,
      children: []
    })
  }

  const roots: FolderNode[] = []

  for (const node of nodeMap.values()) {
    const parentPath = getParentFolderPath(node.path)
    const parent = nodeMap.get(parentPath)
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  // Sort the tree
  sortFolderTreeInPlace(roots)

  // Return the tree
  return roots
}

interface UseFolderTreeProps {
  result?: ScanningResults
}
export const useFolderTree = ({ result }: UseFolderTreeProps): FolderNode[] => {
  return useMemo(() => {
    if (!result) return []
    return buildFolderTree(result.folders, result.root)
  }, [result])
}
