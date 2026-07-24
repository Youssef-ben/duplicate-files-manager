import { AnimatePresence, motion } from 'framer-motion';
import { SummaryFolder } from './summaryFolder';

export interface FolderNode {
  path: string;
  name: string;
  size: number;
  files: number;
  children: FolderNode[];
}

interface SummaryFolderTreeProps {
  nodes: FolderNode[];
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
}

export const SummaryFolderTree = ({
  nodes,
  depth,
  expanded,
  onToggle
}: SummaryFolderTreeProps): React.JSX.Element => {
  return (
    <>
      {nodes.map((node) => (
        <div
          key={node.path}
          style={{ paddingLeft: 8 }}
          className="flex flex-col w-full min-w-0 gap-2"
        >
          <SummaryFolder
            name={node.name}
            size={node.size}
            path={node.path}
            files={node.files}
            depth={depth}
            hasChildren={node.children.length > 0}
            isExpanded={!!expanded[node.path]}
            onToggle={() => onToggle(node.path)}
          />
          <AnimatePresence initial={false}>
            {expanded[node.path] && node.children.length > 0 && (
              <motion.div
                key="children"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden flex flex-col gap-2"
              >
                <SummaryFolderTree
                  nodes={node.children}
                  depth={depth + 1}
                  expanded={expanded}
                  onToggle={onToggle}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};
