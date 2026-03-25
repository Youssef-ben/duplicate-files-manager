import { mergeCls } from '@utils/ClassNameMerger'

export interface SimpleButtonProps {
  label: string
  onClick: () => void
  variant?: 'filled' | 'outline'
}

const variantCls = {
  filled:
    'border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim active:scale-95',
  outline:
    'border-primary bg-transparent text-primary hover:bg-primary-dim hover:text-on-primary hover:border-primary-dim'
}

export const SimpleButton = ({
  label,
  onClick,
  variant = 'filled'
}: SimpleButtonProps): React.JSX.Element => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={mergeCls(
        'flex flex-row items-center justify-center gap-1 w-35 px-4 py-1 rounded-md group cursor-pointer',
        'transition-colors border active:scale-95 active:bg-primary-dim/40',
        variantCls[variant]
      )}
    >
      <span className={mergeCls('text-sm')}>{label}</span>
    </button>
  )
}
