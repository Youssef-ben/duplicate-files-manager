import { SummaryEvent } from '@handlers/cli/types'
import { SynchronizeFile } from '@handlers/cli/types/synchronize.mode'
import { useCliRun } from '@hooks/useCliRun'
import { useSynchronizeStore } from '@pages/synchronize/store/synchronizeStore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FilePreviewProps, FilesListProps, StatusBarProps } from './components'

interface UseComparePreviewResult {
  isSynchronizing: boolean
  statusBarProps: StatusBarProps
  filesListProps: FilesListProps
  filePreviewProps: FilePreviewProps
}

export const useComparePreview = (compareResult: SynchronizeFile[]): UseComparePreviewResult => {
  const { run, onCliDone } = useCliRun()
  const { folders } = useSynchronizeStore()

  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const [syncJsonFile, setSyncJsonFile] = useState<string | null>(null)
  const [files, setFiles] = useState<SynchronizeFile[]>(compareResult)
  const [selectedFile, setSelectedFile] = useState<SynchronizeFile | null>(compareResult[0] ?? null)

  const handleOnAction = useCallback(() => {
    if (!syncJsonFile) return

    if (files.filter((file) => file.is_flagged).length === 0) {
      toast.error('Nothing to synchronize, please select at least one file.')
      return
    }

    run({
      menu: 'synchronize',
      mode: 'sync',
      direction: 'to-target',
      sourceRoot: folders.getFolder('source') as string,
      target: folders.getFolder('destination') as string,
      input: syncJsonFile
    })

    setIsSynchronizing(true)
  }, [syncJsonFile, folders, files, run])

  const saveJsonFile = useCallback(async (files: SynchronizeFile[]): Promise<void> => {
    try {
      const flaggedFiles = files.filter((file) => file.is_flagged) ?? []

      const payload = {
        count: flaggedFiles.length,
        missing_in_target: flaggedFiles
      }

      const jsonFile = await window.appApi.global.writeJsonFile(
        `sync-targets`,
        'synchronize',
        payload
      )
      setSyncJsonFile(jsonFile)
    } catch (err) {
      console.error('Error flagging duplicates:', err)
      toast.error('An error occurred while trying to flag duplicates. Please try again!')
      return undefined
    }
  }, [])

  const getCurrentFile = useCallback(
    (files: SynchronizeFile[]): SynchronizeFile | null => {
      if (!selectedFile) return files[0] ?? null

      return files.find((file) => file.hash === selectedFile.hash) ?? null
    },
    [selectedFile]
  )

  const handleOnSelectAll = useCallback(async () => {
    const newFiles = files.map((file) => ({ ...file, is_flagged: true }))
    await saveJsonFile(newFiles)

    setFiles(newFiles)
    setSelectedFile(getCurrentFile(newFiles))
  }, [files, saveJsonFile, getCurrentFile])

  const handleOnUnselectAll = useCallback(async () => {
    const newFiles = files.map((file) => ({ ...file, is_flagged: false }))
    await saveJsonFile([])

    setFiles(newFiles)
    setSelectedFile(getCurrentFile(newFiles))
  }, [files, saveJsonFile, getCurrentFile])

  const handleOnFileClick = useCallback((file: SynchronizeFile) => {
    setSelectedFile(file)
  }, [])

  const handleOnFlagCurrentClick = useCallback(async () => {
    if (!selectedFile) return

    const newFiles = files.map((file) =>
      file.hash === selectedFile.hash ? { ...file, is_flagged: !file.is_flagged } : file
    )
    await saveJsonFile(newFiles)

    setFiles(newFiles)
    setSelectedFile(getCurrentFile(newFiles))
  }, [files, selectedFile, saveJsonFile, getCurrentFile])

  useEffect(() => {
    const unsubscribe = onCliDone(async function cleanUp(summary: SummaryEvent) {
      if (!summary || summary['action'] !== 'sync') return

      const newFiles = files.filter((file) => !file.is_flagged)
      setFiles(newFiles)
      setSelectedFile(newFiles[0] ?? null)
      await saveJsonFile([])

      toast.success('Synchronization completed successfully.')
      setIsSynchronizing(false)
    })

    return unsubscribe
  }, [onCliDone, saveJsonFile, files])

  const flaggedCount = useMemo(() => files.filter((file) => file.is_flagged).length, [files])

  return {
    isSynchronizing,
    statusBarProps: {
      totalCount: files.length,
      flaggedCount,
      onAction: handleOnAction,
      onSelectAll: handleOnSelectAll,
      onUnselectAll: handleOnUnselectAll
    },
    filesListProps: {
      files,
      selectedFile,
      onFileClick: handleOnFileClick
    },
    filePreviewProps: {
      file: selectedFile,
      onFlagCurrentClick: handleOnFlagCurrentClick
    }
  }
}
