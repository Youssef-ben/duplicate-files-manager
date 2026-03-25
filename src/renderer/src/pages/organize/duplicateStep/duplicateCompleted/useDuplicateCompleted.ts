import { CliRunArgs } from '@handlers/cli/types'
import {
  DeleteDuplicates,
  DuplicatesFile,
  DuplicatesGroup
} from '@handlers/cli/types/duplicates.mode'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

function groupsResultToRecord(groups: DuplicatesGroup[]): Record<string, DuplicatesGroup> {
  const records: Record<string, DuplicatesGroup> = {}
  for (const g of groups) {
    if (g.files.length <= 1) continue
    records[g.hash] = { ...g, files: g.files.map((file) => ({ ...file })) }
  }
  return records
}

function removePathsFromGroups(
  groups: Record<string, DuplicatesGroup>,
  paths: string[]
): Record<string, DuplicatesGroup> {
  const next: Record<string, DuplicatesGroup> = {}
  for (const [hash, group] of Object.entries(groups)) {
    const remaining = group.files.filter((f) => !paths.includes(f.path))
    if (remaining.length <= 1) continue
    next[hash] = { ...group, files: remaining }
  }
  return next
}

export interface UseDuplicateCompletedData {
  hasData: boolean
  groups: Record<string, DuplicatesGroup>
  selectedGroup: DuplicatesGroup | undefined
  count: {
    total: number
    flagged: number
  }
  handleOnGroupClick: (group: DuplicatesGroup) => void
  handleOnFlagClick: (file: DuplicatesFile) => void
  handleOnDeleteClick: () => void
  handleOnDeleteFileClick: (file: DuplicatesFile) => void
  handleSelectAllDuplicates: () => void
  handleUnselectAllDuplicates: () => void
}

interface UseDuplicateCompletedProps {
  run: (args: CliRunArgs) => void
}
export const useDuplicateCompleted = ({
  run
}: UseDuplicateCompletedProps): UseDuplicateCompletedData => {
  const { selectedFolderPath, outputFolderPath } = useOrganizeStore()
  const { result } = useOrganizeStore(StepSelector('duplicates'))

  const [groupsByHash, setGroupsByHash] = useState<Record<string, DuplicatesGroup>>({})
  const [selectedHash, setSelectedHash] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!result?.groups.length) return

    setGroupsByHash(groupsResultToRecord(result.groups))
    setSelectedHash((prev) => {
      if (prev && result.groups.some((g) => g.hash === prev)) return prev
      return result.groups[0].hash
    })
  }, [result])

  const selectedGroup = useMemo(
    () =>
      selectedHash !== undefined
        ? groupsByHash[selectedHash]
        : groupsByHash[Object.keys(groupsByHash)[0]],
    [selectedHash, groupsByHash]
  )

  const handleOnGroupClick = useCallback(
    (group: DuplicatesGroup): void => {
      if (group.hash === selectedHash) return
      setSelectedHash(group.hash)
    },
    [selectedHash]
  )

  const handleOnFlagClick = useCallback(
    (selectedFile: DuplicatesFile): void => {
      if (!selectedGroup) return

      const fileToFlag = selectedGroup.files.find((f) => f.path === selectedFile.path)
      if (!fileToFlag) return

      if (!fileToFlag.is_flagged) {
        const flaggedCount = selectedGroup.files.filter((f) => f.is_flagged).length
        if (flaggedCount + 1 >= selectedGroup.files.length) {
          toast.error('At least one file must stay unselected in a group.')
          return
        }
      }

      setGroupsByHash((prev) => ({
        ...prev,
        [selectedGroup.hash]: {
          ...selectedGroup,
          files: selectedGroup.files.map((file) =>
            file.path === selectedFile.path ? { ...file, is_flagged: !file.is_flagged } : file
          )
        }
      }))
    },
    [selectedGroup]
  )

  const deleteFiles = useCallback(
    async (paths: string[]) => {
      if (paths.length === 0) return

      const deleteObj: DeleteDuplicates = { count: paths.length, delete: { files: paths } }

      try {
        const inputPath = await window.appApi.global.writeJsonFile<DeleteDuplicates>(
          'delete-duplicates',
          deleteObj
        )

        run({
          mode: 'delete-duplicate',
          input: inputPath,
          sourceRoot: outputFolderPath ?? (selectedFolderPath as string)
        })

        setGroupsByHash((prev) => {
          const next = removePathsFromGroups(prev, paths)
          setSelectedHash(Object.keys(next)[0] ?? undefined)
          return next
        })
      } catch {
        toast.error('Failed to delete files. Please try again.')
      }
    },
    [run, selectedFolderPath, outputFolderPath]
  )

  const handleOnDeleteClick = useCallback(async () => {
    const toBeDeleted = Object.values(groupsByHash)
      .flatMap((g) => g.files)
      .filter((f) => f.is_flagged)
      .map((f) => f.path)

    await deleteFiles(toBeDeleted)

    queueMicrotask(() => {
      toast.success(`Deleted (${toBeDeleted.length}) files successfully!`)
    })
  }, [groupsByHash, deleteFiles])

  const handleSelectAllDuplicates = useCallback(() => {
    setGroupsByHash((prev) => {
      const next: Record<string, DuplicatesGroup> = {}
      for (const [hash, group] of Object.entries(prev)) {
        next[hash] = {
          ...group,
          files: group.files.map((file, index) => ({
            ...file,
            is_flagged: index > 0
          }))
        }
      }
      return next
    })
  }, [])

  const handleUnselectAllDuplicates = useCallback(() => {
    setGroupsByHash((prev) => {
      const next: Record<string, DuplicatesGroup> = {}
      for (const [hash, group] of Object.entries(prev)) {
        next[hash] = {
          ...group,
          files: group.files.map((file) => ({ ...file, is_flagged: false }))
        }
      }
      return next
    })
  }, [])

  const handleOnDeleteFileClick = useCallback(
    async (file: DuplicatesFile) => {
      await deleteFiles([file.path])

      queueMicrotask(() => {
        toast.success('File deleted successfully!')
      })
    },
    [deleteFiles]
  )

  const flaggedFilesCount = useMemo(
    () =>
      Object.values(groupsByHash)
        .flatMap((g) => g.files)
        .filter((f) => f.is_flagged).length,
    [groupsByHash]
  )

  const totalFiles = useMemo(
    () => Object.values(groupsByHash).flatMap((g) => g.files).length,
    [groupsByHash]
  )

  return {
    hasData: !!result && (result?.duplicate_files ?? 0) > 0 && Object.keys(groupsByHash).length > 0,
    groups: groupsByHash,
    selectedGroup,
    count: {
      total: totalFiles,
      flagged: flaggedFilesCount
    },
    handleOnGroupClick,
    handleOnFlagClick,
    handleOnDeleteClick,
    handleOnDeleteFileClick,
    handleSelectAllDuplicates,
    handleUnselectAllDuplicates
  }
}
