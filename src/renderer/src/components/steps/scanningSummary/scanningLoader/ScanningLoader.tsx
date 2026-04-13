import { LoadingDots } from '@components/loadingDots'
import { mergeCls } from '@utils/ClassNameMerger'

export interface ScanningLoaderProps {
  progress: number
  label?: string
  className?: string
}

export const ScanningLoader = ({
  progress,
  label,
  className
}: ScanningLoaderProps): React.JSX.Element => {
  return (
    <div
      className={mergeCls(
        'flex flex-col items-center justify-center w-full h-full text-outline-dim',
        className
      )}
    >
      <div className="flex flex-row items-end justify-center gap-2">
        {label ?? (progress <= 0 ? 'Scanning' : 'Processing')}
        <LoadingDots dotClassName="bg-outline-dim" />
      </div>
      {progress > 0 && <span className="text-xs font-semibold text-primary">{progress}%</span>}
    </div>
  )
}
