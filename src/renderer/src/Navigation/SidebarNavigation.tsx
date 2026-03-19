import { NavButton } from '@components/navButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { isNavigationItemActive, NAVIGATION_ITEMS } from './routes'

export const SidebarNavigation = (): React.JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex w-45 flex-col justify-between gap-4 py-2">
      <nav className="flex items-start flex-col gap-1 px-2 text-sm">
        {NAVIGATION_ITEMS.primary.map((item) => {
          const Icon = item.icon

          return (
            <NavButton
              key={item.path}
              icon={<Icon className="h-5 w-5" />}
              label={item.label}
              isActive={isNavigationItemActive(location.pathname, item.path)}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </nav>

      <div className="flex items-center justify-center gap-2 px-2">
        {NAVIGATION_ITEMS.secondary.map((item) => {
          const Icon = item.icon

          return (
            <NavButton
              key={item.path}
              icon={<Icon className="h-5 w-5" />}
              label={item.label}
              isActive={isNavigationItemActive(location.pathname, item.path)}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </div>
    </div>
  )
}
