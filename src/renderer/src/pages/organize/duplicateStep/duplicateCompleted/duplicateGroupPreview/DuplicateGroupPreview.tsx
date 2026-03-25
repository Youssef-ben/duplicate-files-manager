import { SimpleButton } from '@components/buttons'
import { mimeTypeFromFilePath } from '@shared/fileMime'
import { loadFileUrl } from '@utils/strings'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface DuplicateGroupPreviewProps {
  filePath: string
}

/**
 * Large preview for the selected duplicate group. Many phone `.3GP` files use
 * H.263 / AMR codecs that Chromium cannot decode — we fall back to copy + "open externally".
 */
export const DuplicateGroupPreview = ({
  filePath
}: DuplicateGroupPreviewProps): React.JSX.Element => {
  const [previewFailed, setPreviewFailed] = useState(false)
  const previewUrl = loadFileUrl(filePath)
  const mime = mimeTypeFromFilePath(filePath)
  const sourceType = mime.startsWith('video/') ? mime : undefined

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewFailed(false)
  }, [filePath])

  const handleOpenExternally = useCallback(async () => {
    try {
      await window.appApi.global.openFilePath(filePath)
    } catch {
      toast.error('Could not open this file with the default application.')
    }
  }, [filePath])

  if (previewFailed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-3 py-3 h-full w-full min-h-0 overflow-y-auto rounded-md border border-outline-variant bg-surface-container text-center">
        <p className="text-xs text-outline-dim leading-relaxed">
          This preview cannot play the file. Camera-style .3GP clips often use codecs (for example
          H.263 or AMR) that the built-in player does not support. Open it in VLC or your default
          video app instead.
        </p>
        <SimpleButton variant="outline" label="Open Externally" onClick={handleOpenExternally} />
      </div>
    )
  }

  return (
    <video
      key={filePath}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full object-cover rounded-md shadow-card bg-black"
      onError={() => setPreviewFailed(true)}
    >
      <source src={previewUrl} type={sourceType} />
    </video>
  )
}
