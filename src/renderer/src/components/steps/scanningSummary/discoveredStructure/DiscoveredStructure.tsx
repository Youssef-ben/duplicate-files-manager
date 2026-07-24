import { FolderNode, SummaryFolderTree } from '../summaryFolderTree';

export interface DiscoveredStructureProps {
  isAnyExpanded: boolean;
  collapseAll: () => void;
  expandAll: () => void;
  folderTree: FolderNode[];
  expanded: Record<string, boolean>;
  toggle: (path: string) => void;
}

export const DiscoveredStructure = ({
  isAnyExpanded,
  collapseAll,
  expandAll,
  folderTree,
  expanded,
  toggle
}: DiscoveredStructureProps): React.JSX.Element => {
  return (
    <div className="flex min-h-0 min-w-0 flex-2 flex-col items-start rounded-md shadow-card bg-surface py-2 px-2 gap-2 overflow-hidden">
      <div className="flex flex-row items-center justify-between w-full pl-2 pb-2">
        <span className="text-lg font-semibold text-primary capitalize">Discovered Structure</span>
        <button
          onClick={isAnyExpanded ? collapseAll : expandAll}
          className="text-xs text-primary font-medium hover:underline cursor-pointer"
        >
          {isAnyExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="flex flex-col items-start bg-transparent justify-start w-full min-w-0 gap-2 overflow-y-auto p-2">
        <SummaryFolderTree depth={0} nodes={folderTree} expanded={expanded} onToggle={toggle} />
      </div>
    </div>
  );
};
