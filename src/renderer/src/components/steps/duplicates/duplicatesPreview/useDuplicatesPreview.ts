import {
  DeleteDuplicates,
  DuplicatesFile,
  DuplicatesResults
} from '@handlers/cli/types/duplicates.mode'
import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  DuplicateGroupProps,
  DuplicateGroupsListProps,
  DuplicateStatusBarProps
} from './components'
import {
  canActOnUnselectedFile,
  findGroupContainingPath,
  removeFileFromGroup,
  resolveSelectedGroupHash
} from './helpers'

interface DuplicatePreviewResult {
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
}

const initGroups = (results?: DuplicatesResults): Record<string, DuplicatesFile[]> =>
  (results?.groups ?? []).reduce<Record<string, DuplicatesFile[]>>((acc, group) => {
    acc[group.hash] = group.files
    return acc
  }, {})

export const useDuplicatesPreview = ({
  menu = 'duplicate',
  duplicatesResults,
  onRunCli
}: UseDuplicatesPreviewProps): DuplicatePreviewResult => {
  const cliLock = useRef(false) // prevents concurrent CLI calls

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
          `delete-duplicates-${crypto.randomUUID()}`,
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
    const flagged = Object.values(groups)
      .flatMap((files) => files)
      .filter((f) => f.is_flagged)
    if (!flagged.length) return

    await withCliLock(async () => {
      const inputPath = await saveJsonFile(flagged.map((f) => f.path))
      if (!inputPath) return

      onRunCli(inputPath)

      // Wait for CLI to finish before updating state
      setTimeout(() => {
        setGroups((prev) =>
          Object.fromEntries(
            Object.entries(prev).flatMap(([hash, files]) => {
              const remaining = files.filter((f) => !f.is_flagged)
              return remaining.length > 1 ? [[hash, remaining]] : []
            })
          )
        )
        toast.success('Duplicates deleted successfully!')
      }, 1000)
    })
  }, [groups, saveJsonFile, onRunCli, withCliLock])

  /** Single-file delete: waits for CLI before updating state */
  const handleOnDeleteDuplicateClick = useCallback(
    async (filePath: string) => {
      if (!filePath) return

      const found = findGroupContainingPath(groups, filePath)
      if (!found) return
      const { hash, files, file: fileToDelete } = found

      if (!canActOnUnselectedFile(files, fileToDelete)) {
        toast.error('At least one file must stay unselected in a group.')
        return
      }

      await withCliLock(async () => {
        const inputPath = await saveJsonFile([filePath])
        if (!inputPath) return

        onRunCli(inputPath)

        setGroups((prev) => removeFileFromGroup(prev, hash, filePath))
        toast.success('Duplicate deleted successfully!')
      })
    },
    [groups, saveJsonFile, onRunCli, withCliLock]
  )

  const handleOnGroupClick = useCallback(
    (hash: string) => {
      if (hash !== resolvedSelectedGroup) setSelectedGroup(hash)
    },
    [resolvedSelectedGroup]
  )

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
    groups,
    selectedGroup: resolvedSelectedGroup,
    statusBarProps: {
      flaggedCount: flaggedFilesCount,
      totalCount: totalFilesCount,
      onDeleteDuplicates: handleOnDeleteDuplicates,
      onSelectDuplicates: handleSelectAllDuplicates,
      onUnselectDuplicates: handleUnselectAllDuplicates
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
