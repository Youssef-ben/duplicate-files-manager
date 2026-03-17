import { ThemeSwitcher } from '@renderer/components/themeSwitcher'

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4">
      <p>Library Organizer</p>
      <ThemeSwitcher />
    </div>
  )
}
