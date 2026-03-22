import { mergeCls } from '@utils/ClassNameMerger'

export interface ScanningLoaderProps {
  show: boolean
  progress: number
  label?: string
  className?: string
}

export const ScanningLoader = ({
  show,
  progress,
  label,
  className
}: ScanningLoaderProps): React.JSX.Element => {
  if (!show) return <></>

  return (
    <div
      className={mergeCls(
        'flex flex-col items-center justify-center w-full h-full text-outline-dim',
        className
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {label ?? (progress <= 0 ? 'Scanning' : 'Processing')}
        <span className="text-2xl inline-flex">
          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
          <span className="animate-bounce [animation-delay:-0.10s]">.</span>
          <span className="animate-bounce">.</span>
        </span>
      </div>
      {progress > 0 && <span className="text-xs font-semibold text-primary">{progress}%</span>}
    </div>
  )
}
