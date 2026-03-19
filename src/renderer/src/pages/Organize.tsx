import { ThemeSwitcher } from '@renderer/components/themeSwitcher'

export default function Organize(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Organize</h1>
        <p className="text-sm text-subtext1">Library Organizer</p>
      </div>

      <ThemeSwitcher />
    </div>
  )
}
