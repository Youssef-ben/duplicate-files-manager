import { mergeCls } from '@utils/ClassNameMerger'

interface NavButtonProps {
  icon: React.ReactNode
  label: string
}

export const NavButton = ({ icon, label }: NavButtonProps): React.JSX.Element => {
  return (
    <button
      className={mergeCls(
        'flex w-full cursor-pointer items-center gap-2 rounded-md p-2 px-4 text-left ',
        'hover:bg-accent hover:text-mantle hover:font-bold'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
