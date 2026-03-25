/* eslint-disable react-hooks/incompatible-library */
import { CliRunArgs } from '@handlers/cli/types'
import { useVirtualizer } from '@tanstack/react-virtual'
import { getFolderName, isImage, loadFileUrl } from '@utils/strings'
import { useMemo, useRef } from 'react'
import { ActionsDropDown } from './actionsDropDown/ActionsDropDown'
import { CleanUpCompleted } from './cleanUpCompleted'
import { DuplicateGroupPreview } from './duplicateGroupPreview'
import { DuplicateImage } from './duplicateImage'
import { DuplicateItem } from './duplicateItem'
import { useDuplicateCompleted } from './useDuplicateCompleted'

const GROUP_ROW_STRIDE_PX = 64
const FILE_ROW_STRIDE_PX = 68

interface DuplicateCompletedProps {
  onReRunClick: () => void
  onDeleteClick: (args: CliRunArgs) => void
}

export const DuplicateCompleted = ({
  onReRunClick,
  onDeleteClick
}: DuplicateCompletedProps): React.JSX.Element => {
  const {
    hasData,
    groups,
    count,
    selectedGroup,
    handleOnGroupClick,
    handleOnFlagClick,
    handleOnDeleteClick,
    handleOnDeleteFileClick,
    handleSelectAllDuplicates,
    handleUnselectAllDuplicates
  } = useDuplicateCompleted({ run: onDeleteClick })

  const groupList = useMemo(() => Object.values(groups), [groups])
  const files = useMemo(() => selectedGroup?.files ?? [], [selectedGroup])

  const groupsScrollRef = useRef<HTMLDivElement>(null)
  const filesScrollRef = useRef<HTMLDivElement>(null)

  const groupVirtualizer = useVirtualizer({
    count: groupList.length,
    getScrollElement: () => groupsScrollRef.current,
    estimateSize: () => GROUP_ROW_STRIDE_PX,
    overscan: 6
  })

  const fileVirtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => filesScrollRef.current,
    estimateSize: () => FILE_ROW_STRIDE_PX,
    overscan: 6
  })

  if (!hasData) return <CleanUpCompleted onReRunClick={onReRunClick} />

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-0 gap-2 p-0 overflow-hidden">
      {/* Status Bar */}
      <div className="flex flex-row items-end justify-between w-full h-10 shrink-0 gap-2 px-2 border-b border-outline-variant pb-2 uppercase">
        <span className="text-[10px] font-normal text-outline-dim">
          {`Selected: ${count.flagged} / ${count.total}`}
        </span>

        <ActionsDropDown
          flaggedCount={count.flagged}
          onDeleteDuplicates={handleOnDeleteClick}
          onSelectDuplicates={handleSelectAllDuplicates}
          onUnselectDuplicates={handleUnselectAllDuplicates}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-row items-stretch justify-center w-full min-h-0 flex-1 gap-0 p-0 overflow-hidden">
        {/* Group List */}
        <div className="flex flex-1 flex-col h-full min-h-0 p-2">
          <div ref={groupsScrollRef} className="h-full min-h-0 w-full overflow-y-auto px-1">
            <div
              className="relative w-full"
              style={{ height: `${groupVirtualizer.getTotalSize()}px` }}
            >
              {groupVirtualizer.getVirtualItems().map((virtualRow) => {
                const group = groupList[virtualRow.index]
                if (!group) return null
                return (
                  <div
                    key={virtualRow.key}
                    className="absolute top-0 left-0 w-full box-border"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <DuplicateItem
                      isSelected={selectedGroup?.hash === group.hash}
                      imageUrl={group.files[0].path}
                      title={`${getFolderName(group.files[0].path)}`}
                      value={`${group.files.length} files`}
                      onClick={() => handleOnGroupClick(group)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Group Preview */}
        {selectedGroup && (
          <div className="flex flex-2 flex-col h-full min-h-0 w-full gap-0 overflow-hidden">
            <div className="flex shrink-0 items-center justify-center px-0 pt-0 w-full min-h-0">
              <div className="w-full sm:max-w-[min(100%,50%)] xl:max-w-[min(100%,40%)] aspect-square min-w-0">
                {isImage(selectedGroup.files[0]?.path ?? '') ? (
                  <img
                    src={loadFileUrl(selectedGroup.files[0]?.path ?? '')}
                    alt="Selected Duplicate"
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <DuplicateGroupPreview filePath={selectedGroup.files[0]?.path ?? ''} />
                )}
              </div>
            </div>

            <div
              key={selectedGroup?.hash ?? 'none'}
              className="flex flex-1 flex-col min-h-0 w-full rounded-md overflow-hidden"
            >
              <div ref={filesScrollRef} className="h-full min-h-0 w-full overflow-y-auto p-2">
                <div
                  className="relative w-full"
                  style={{ height: `${fileVirtualizer.getTotalSize()}px` }}
                >
                  {fileVirtualizer.getVirtualItems().map((virtualRow) => {
                    const file = files[virtualRow.index]
                    if (!file) return null
                    return (
                      <div
                        key={virtualRow.key}
                        className="absolute top-0 left-0 w-full box-border pb-2"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                      >
                        <DuplicateImage
                          imagePath={file.path}
                          size={file.size_bytes}
                          isFlagged={file.is_flagged}
                          onClick={() => handleOnFlagClick(file)}
                          onDeleteClick={() => handleOnDeleteFileClick(file)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
