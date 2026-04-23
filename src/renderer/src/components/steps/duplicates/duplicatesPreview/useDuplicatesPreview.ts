import { SummaryEvent } from '@handlers/cli/types'
import {
  DeleteDuplicates,
  DuplicatesFile,
  DuplicatesResults
} from '@handlers/cli/types/duplicates.mode'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  DuplicateGroupProps,
  DuplicateGroupsListProps,
  DuplicateStatusBarProps
} from './components'
import {
  canActOnUnselectedFile,
  findGroupContainingPath,
  resolveSelectedGroupHash
} from './helpers'

interface DuplicatePreviewResult {
  isDeleting: boolean
  selectedGroup: string
  groups: Record<string, DuplicatesFile[]>
  statusBarProps: DuplicateStatusBarProps
  groupsListProps: DuplicateGroupsListProps
  groupProps: DuplicateGroupProps
}

interface UseDuplicatesPreviewProps {
  menu: 'duplicate' | 'organize'
  duplicatesResults?: DuplicatesResults
  onRunCli: (inputPath: string) => void
  onCliDone: (callback: (summary: SummaryEvent) => void) => () => void
}

const initGroups = (results?: DuplicatesResults): Record<string, DuplicatesFile[]> =>
  (results?.groups ?? []).reduce<Record<string, DuplicatesFile[]>>((acc, group) => {
    acc[group.hash] = group.files
    return acc
  }, {})

export const useDuplicatesPreview = ({
  menu = 'duplicate',
  duplicatesResults,
  onRunCli,
  onCliDone
}: UseDuplicatesPreviewProps): DuplicatePreviewResult => {
  const cliLock = useRef(false) // prevents concurrent CLI calls

  const [isDeleting, setIsDeleting] = useState(false)

  const [selectedGroup, setSelectedGroup] = useState<string>(
    duplicatesResults?.groups?.[0]?.hash ?? ''
  )
  const [groups, setGroups] = useState<Record<string, DuplicatesFile[]>>(() =>
    initGroups(duplicatesResults)
  )

  const resolvedSelectedGroup = useMemo(
    () => resolveSelectedGroupHash(groups, selectedGroup),
    [groups, selectedGroup]
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const saveJsonFile = useCallback(
    async (paths: string[]): Promise<string | undefined> => {
      try {
        const payload: DeleteDuplicates = { count: paths.length, delete: { files: paths } }
        return await window.appApi.global.writeJsonFile<DeleteDuplicates>(
          `delete-duplicates`,
          menu,
          payload
        )
      } catch (err) {
        console.error('Error flagging duplicates:', err)
        toast.error('An error occurred while trying to flag duplicates. Please try again!')
        return undefined
      }
    },
    [menu]
  )

  const withCliLock = useCallback(async (fn: () => Promise<void>) => {
    if (cliLock.current) return
    cliLock.current = true
    try {
      await fn()
    } finally {
      cliLock.current = false
    }
  }, [])

  // ─── Flag selection ────────────────────────────────────────────────────────

  const handleSelectAllDuplicates = useCallback(async () => {
    const next = Object.fromEntries(
      Object.entries(groups).map(([hash, files]) => [
        hash,
        files.map((file, index) => ({
          ...file,
          is_flagged: index > 0
        }))
      ])
    )

    setGroups(next)
  }, [groups])

  const handleUnselectAllDuplicates = useCallback(async () => {
    setGroups(
      Object.fromEntries(
        Object.entries(groups).map(([hash, files]) => [
          hash,
          files.map((file) => ({ ...file, is_flagged: false }))
        ])
      )
    )
  }, [groups])

  const handleOnDuplicateClick = useCallback(
    async (filePath: string) => {
      if (!filePath) return
      const found = findGroupContainingPath(groups, filePath)
      if (!found) return
      const { hash, files, file: fileToFlag } = found

      if (!canActOnUnselectedFile(files, fileToFlag)) {
        toast.error('At least one file must stay unselected in a group.')
        return
      }

      const newGroups = {
        ...groups,
        [hash]: files.map((file) =>
          file.path === filePath ? { ...file, is_flagged: !file.is_flagged } : file
        )
      }

      setGroups(newGroups)
    },
    [groups]
  )

  // ─── CLI deletions ─────────────────────────────────────────────────────────

  /** Bulk delete: runs CLI then removes flagged files from state */
  const handleOnDeleteDuplicates = useCallback(async () => {
    setIsDeleting(true)

    const flagged = Object.values(groups)
      .flatMap((files) => files)
      .filter((f) => f.is_flagged)
    if (!flagged.length) return

    await withCliLock(async () => {
      const inputPath = await saveJsonFile(flagged.map((f) => f.path))
      if (!inputPath) return

      onRunCli(inputPath)
    })
  }, [groups, saveJsonFile, onRunCli, withCliLock])

  /** Single-file delete: waits for CLI before updating state */
  const handleOnDeleteDuplicateClick = useCallback(
    async (filePath: string) => {
      if (!filePath) return

      const found = findGroupContainingPath(groups, filePath)
      if (!found) return
      const { files, file: fileToDelete } = found

      if (!canActOnUnselectedFile(files, fileToDelete)) {
        toast.error('At least one file must stay unselected in a group.')
        return
      }

      await withCliLock(async () => {
        const inputPath = await saveJsonFile([filePath])
        if (!inputPath) return

        onRunCli(inputPath)

        handleOnDuplicateClick(filePath)
      })
    },
    [groups, saveJsonFile, onRunCli, withCliLock, handleOnDuplicateClick]
  )

  const handleOnGroupClick = useCallback(
    (hash: string) => {
      if (hash !== resolvedSelectedGroup) setSelectedGroup(hash)
    },
    [resolvedSelectedGroup]
  )

  useEffect(() => {
    const unsubscribe = onCliDone(async function cleanUp(summary: SummaryEvent) {
      if (!summary || summary['action'] !== 'delete-duplicate') return

      setGroups((prev) =>
        Object.fromEntries(
          Object.entries(prev).flatMap(([hash, files]) => {
            const remaining = files.filter((f) => !f.is_flagged)
            return remaining.length > 1 ? [[hash, remaining]] : []
          })
        )
      )
      toast.success('Duplicates deleted successfully!')

      setIsDeleting(false)
    })

    return unsubscribe
  }, [onCliDone])

  // ─── Derived counts ────────────────────────────────────────────────────────

  const flaggedFilesCount = useMemo(
    () =>
      Object.values(groups)
        .flatMap((f) => f)
        .filter((f) => f.is_flagged).length,
    [groups]
  )

  const totalFilesCount = useMemo(() => Object.values(groups).flatMap((f) => f).length, [groups])

  return {
    isDeleting,
    groups,
    selectedGroup: resolvedSelectedGroup,
    statusBarProps: {
      flaggedCount: flaggedFilesCount,
      totalCount: totalFilesCount,
      onAction: handleOnDeleteDuplicates,
      onSelectAll: handleSelectAllDuplicates,
      onUnselectAll: handleUnselectAllDuplicates
    },
    groupsListProps: {
      groups,
      selectedGroup: resolvedSelectedGroup,
      onGroupClick: handleOnGroupClick
    },
    groupProps: {
      files: groups[resolvedSelectedGroup] ?? [],
      onClick: handleOnDuplicateClick,
      onDeleteClick: handleOnDeleteDuplicateClick
    }
  }
}
