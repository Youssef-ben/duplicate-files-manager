import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

interface CleanUpCompletedProps {
  onReRunClick: () => void
}

export const CleanUpCompleted = ({ onReRunClick }: CleanUpCompletedProps): React.JSX.Element => {
  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full gap-5 py-24 select-none"
      style={{ color: 'var(--color-on-surface)' }}
    >
      {/* Icon ring */}
      <div className="relative flex items-center justify-center">
        {/* outer pulse ring */}
        <div
          className="absolute w-28 h-28 rounded-full opacity-20 animate-ping"
          style={{ background: 'var(--color-primary-container)', animationDuration: '2.4s' }}
        />
        <div
          className="w-24 h-24 flex items-center justify-center shadow-lg bg-surface rounded-full pl-2"
          style={{
            animation: 'pop 0.5s cubic-bezier(.36,1.56,.64,1) 0.3s both',
            transition: 'background 0.4s ease'
          }}
        >
          <span style={{ fontSize: 40 }}>🎉</span>
        </div>
      </div>

      {/* Text */}
      <div className="text-center flex flex-col gap-1.5">
        <h2 className="text-xl font-semibold text-on-surface">All Duplicates Cleaned</h2>
        <p className="hidden text-sm max-w-xs text-on-surface-variant">
          All duplicates have been cleaned up.
        </p>
        <p className="text-sm max-w-xs text-on-surface-variant">
          You can now proceed to the next step or refresh at any time.
        </p>
      </div>
      <button
        onClick={onReRunClick}
        type="button"
        className={mergeCls(
          'group flex flex-row items-center justify-center gap-2 w-fit pl-2 pr-3 py-1 rounded-md cursor-pointer',
          'border border-primary bg-transparent text-primary',
          'hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim active:scale-95',
          'transition-all duration-500 '
        )}
      >
        <ArrowPathIcon className="size-4 stroke-2 transition-all duration-500 group-hover:rotate-90" />
        <span className="text-sm group-hover:font-normal">Re-scan to find more duplicates</span>
      </button>
    </div>
  )
}
