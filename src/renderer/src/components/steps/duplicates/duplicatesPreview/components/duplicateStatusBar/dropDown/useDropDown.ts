import { useCallback, useEffect, useRef, useState } from 'react'

interface UseActionsDropDownProps {
  flaggedCount: number
  onDeleteDuplicates: () => void
  onSelectDuplicates: () => void
  onUnselectDuplicates: () => void
}

interface useDropDownResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  open: boolean
  handleOnDropdownClick: (open: boolean) => void
  showSelectAll: boolean
  disableDelete: boolean
  handleDeleteDuplicates: () => void
  handleSelectDuplicates: () => void
  handleUnselectDuplicates: () => void
}

export const useDropDown = ({
  flaggedCount,
  onDeleteDuplicates,
  onSelectDuplicates,
  onUnselectDuplicates
}: UseActionsDropDownProps): useDropDownResult => {
  const [open, setOpen] = useState(false)
  const [showSelectAll, setShowSelectAll] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Handle the opening and closing of the dropdown
   */
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent): void => {
      if (containerRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleDeleteDuplicates = (): void => {
    onDeleteDuplicates()
    setOpen(false)
    setShowSelectAll(true)
  }

  const handleSelectDuplicates = (): void => {
    onSelectDuplicates()
    setOpen(false)
    setShowSelectAll(false)
  }

  const handleUnselectDuplicates = (): void => {
    onUnselectDuplicates()
    setOpen(false)
    setShowSelectAll(true)
  }

  const handleOnDropdownClick = useCallback((): void => {
    setOpen((previous) => !previous)
  }, [setOpen])

  return {
    containerRef,

    open,
    handleOnDropdownClick,

    showSelectAll,
    disableDelete: flaggedCount === 0,

    handleDeleteDuplicates,
    handleSelectDuplicates,
    handleUnselectDuplicates
  }
}
