import { SimpleButton } from '@components/buttons'
import { mergeCls } from '@renderer/utils/ClassNameMerger'
import { mimeTypeFromFilePath } from '@shared/fileMime'
import { isImage, loadFileUrl } from '@utils/strings'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useThumbnail } from './useThumbnail'

const THUMBNAIL_SIZE = 230

interface GroupPreviewProps {
  filePath: string
}

export const GroupPreview = ({ filePath }: GroupPreviewProps): React.JSX.Element => {
  const isImageFile = useMemo(() => isImage(filePath), [filePath])

  return (
    <div className="flex shrink-0 items-center justify-center px-0 pt-0 w-full min-h-0">
      <div className="w-[230px] h-[230px] xl:w-[350px] xl:h-[350px] aspect-square min-w-0">
        {isImageFile && <ImagePreview filePath={filePath} />}
        {!isImageFile && <VideoPreview filePath={filePath} />}
      </div>
    </div>
  )
}

const ImagePreview = ({ filePath }: GroupPreviewProps): React.JSX.Element => {
  const thumb = useThumbnail(loadFileUrl(filePath), THUMBNAIL_SIZE)
  if (!thumb) {
    return <div className="max-w-[230px] max-h-[230px] aspect-square min-w-0 bg-black rounded-sm" />
  }

  return (
    <img
      src={thumb}
      alt={filePath}
      className="w-[230px] h-[230px] aspect-square object-fill rounded-sm"
    />
  )
}

/**
 * Large preview for the selected duplicate group. Many phone `.3GP` files use
 * H.263 / AMR codecs that Chromium cannot decode — we fall back to copy + "open externally".
 */
const VideoPreview = ({ filePath }: GroupPreviewProps): React.JSX.Element => {
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
      <div
        className={mergeCls(
          'flex flex-col items-center justify-center gap-2 px-3 py-2 w-full h-full min-h-0 rounded-sm',
          'bg-surface text-on-surface shadow-card text-justify'
        )}
      >
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
      className="w-full h-full object-cover aspect-square rounded-sm shadow-card bg-black"
      onError={() => setPreviewFailed(true)}
    >
      <source src={previewUrl} type={sourceType} />
    </video>
  )
}
