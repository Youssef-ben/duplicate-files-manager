import { DuplicatesFile } from '@handlers/cli/types/duplicates.mode'
import { getFolderName } from '@renderer/utils/strings'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { GroupItem } from './groupItem'

const GROUP_ROW_STRIDE_PX = 64
const RENDER_HIDDEN_GROUPS = 4

export interface DuplicateGroupsListProps {
  groups: Record<string, DuplicatesFile[]>
  selectedGroup: string
  onGroupClick: (hash: string) => void
}

export const DuplicateGroupsList = ({
  groups,
  selectedGroup,
  onGroupClick
}: DuplicateGroupsListProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: Object.keys(groups).length,
    getScrollElement: () => ref.current,
    estimateSize: () => GROUP_ROW_STRIDE_PX,
    overscan: RENDER_HIDDEN_GROUPS
  })

  return (
    <div className="flex flex-1 flex-col h-full min-h-0">
      <div ref={ref} className="h-full min-h-0 w-full overflow-y-auto p-2">
        <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((item) => {
            const currentHash = Object.keys(groups)[item.index]
            const files = groups[currentHash]
            if (!currentHash || !files) return null

            return (
              <div
                key={item.key}
                className="absolute top-0 left-0 w-full box-border"
                style={{
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`
                }}
              >
                <GroupItem
                  imageUrl={files[0].path}
                  title={getFolderName(files[0].path)}
                  value={`${files.length} files`}
                  isSelected={selectedGroup === currentHash}
                  onClick={() => onGroupClick(currentHash)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
