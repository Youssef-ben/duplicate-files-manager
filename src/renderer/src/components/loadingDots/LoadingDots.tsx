import { mergeCls } from '@utils/ClassNameMerger'

const LoadingDot = ({ className }: { className?: string }): React.JSX.Element => {
  return (
    <span
      aria-hidden
      className={mergeCls(
        'inline-block size-[3px] rounded-full animate-bounce bg-primary',
        className
      )}
    />
  )
}

export interface LoadingDotsProps {
  className?: string
  dotClassName?: string
}
export const LoadingDots = ({ className, dotClassName }: LoadingDotsProps): React.JSX.Element => {
  return (
    <span className={mergeCls('text-sm inline-flex items-center text-primary gap-1', className)}>
      <span className="animate-bounce [animation-delay:-0.3s]">
        <LoadingDot className={dotClassName} />
      </span>
      <span className="animate-bounce [animation-delay:-0.10s]">
        <LoadingDot className={dotClassName} />
      </span>
      <span className="animate-bounce">
        <LoadingDot className={dotClassName} />
      </span>
    </span>
  )
}
