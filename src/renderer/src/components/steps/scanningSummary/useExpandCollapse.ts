import { useCallback, useMemo, useState } from 'react';
import { FolderNode } from './summaryFolderTree';

interface UseExpandCollapseResult {
  expanded: Record<string, boolean>;
  isAnyExpanded: boolean;
  expandAll: () => void;
  collapseAll: () => void;
  toggle: (path: string) => void;
}

/**
 * Collects all paths from a folder tree
 * @param nodes - The nodes to collect paths from
 * @returns The paths
 */
function collectAllPaths(nodes: FolderNode[]): string[] {
  return nodes.flatMap((node) => [node.path, ...collectAllPaths(node.children)]);
}

export const useExpandCollapse = (nodes: FolderNode[]): UseExpandCollapseResult => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const allPaths = useMemo(() => collectAllPaths(nodes), [nodes]);
  const isAnyExpanded = useMemo(() => Object.values(expanded).some(Boolean), [expanded]);

  const expandAll = useCallback(
    () => setExpanded(Object.fromEntries(allPaths.map((p) => [p, true]))),
    [allPaths]
  );

  const collapseAll = useCallback(() => setExpanded({}), []);

  const toggle = useCallback(
    (path: string) => setExpanded((prev) => ({ ...prev, [path]: !prev[path] })),
    []
  );

  return { expanded, isAnyExpanded, expandAll, collapseAll, toggle };
};
