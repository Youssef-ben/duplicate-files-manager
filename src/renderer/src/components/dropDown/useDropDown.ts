import { useCallback, useEffect, useRef, useState } from 'react';

interface UseActionsDropDownProps {
  flaggedCount: number;
  onAction: () => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

interface useDropDownResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  handleOnDropdownClick: (open: boolean) => void;
  showSelectAll: boolean;
  disableDelete: boolean;
  handleAction: () => void;
  handleSelectAll: () => void;
  handleUnselectAll: () => void;
}

export const useDropDown = ({
  flaggedCount,
  onAction,
  onSelectAll,
  onUnselectAll
}: UseActionsDropDownProps): useDropDownResult => {
  const [open, setOpen] = useState(false);
  const [showSelectAll, setShowSelectAll] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Handle the opening and closing of the dropdown
   */
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent): void => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleAction = (): void => {
    onAction();
    setOpen(false);
    setShowSelectAll(true);
  };

  const handleSelectAll = (): void => {
    onSelectAll();
    setOpen(false);
    setShowSelectAll(false);
  };

  const handleUnselectAll = (): void => {
    onUnselectAll();
    setOpen(false);
    setShowSelectAll(true);
  };

  const handleOnDropdownClick = useCallback((): void => {
    setOpen((previous) => !previous);
  }, [setOpen]);

  return {
    containerRef,

    open,
    handleOnDropdownClick,

    showSelectAll,
    disableDelete: flaggedCount === 0,

    handleAction,
    handleSelectAll,
    handleUnselectAll
  };
};
