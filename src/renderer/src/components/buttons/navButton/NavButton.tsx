import { mergeCls } from '@utils/ClassNameMerger'

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

export const NavButton = ({
  icon,
  label,
  isActive = false,
  onClick
}: NavButtonProps): React.JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={mergeCls(
        'flex w-full cursor-pointer items-center gap-2 rounded-md p-2 px-4 text-left transition-colors  ',
        {
          'hover:bg-primary-dim/80 hover:text-on-primary': !isActive,
          'bg-primary text-on-primary font-medium': isActive
        }
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
