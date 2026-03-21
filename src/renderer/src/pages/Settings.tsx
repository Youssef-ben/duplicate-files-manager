import { ThemeSwitcher } from '@components/themeSwitcher'
import { JSX } from 'react'

interface SettingSectionProps {
  title: string
  children: React.ReactNode
}
export const SettingSection = ({ title, children }: SettingSectionProps): JSX.Element => {
  return (
    <div className="flex flex-row items-center gap-2 w-full border-t border-b border-outline-variant py-4">
      <div className="flex flex-col h-full items-start gap-2 w-1/4 justify-start">
        <span className="text-md font-semibold">{title}</span>
      </div>

      <div className="flex flex-col items-start gap-2 py-1 w-full">{children}</div>
    </div>
  )
}

export default function Settings(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 text-center w-full p-4">
      {/* Settings Title */}
      <div className="flex text-center flex-col items-start w-full">
        <span className="text-lg font-semibold">Application preferences</span>
        <span className="text-sm text-muted">
          Personalize your experience and make the app truly yours!
        </span>
      </div>

      <div className="flex flex-col items-left gap-0 w-full px-0">
        {/* Theme */}
        <SettingSection title="Theme">
          <ThemeSwitcher />
        </SettingSection>
      </div>
    </div>
  )
}
