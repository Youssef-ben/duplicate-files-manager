import {
  ArrowPathIcon,
  Cog6ToothIcon,
  FolderIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import type { ComponentType, SVGProps } from 'react'

import DuplicatePage from '@pages/Duplicate'
import OrganizePage from '@pages/Organize'
import SettingsPage from '@pages/Settings'
import SynchronizePage from '@pages/Synchronize'

type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>
type NavigationPage = ComponentType

export const NAVIGATION_PATHS = {
  organize: '/organize',
  duplicate: '/duplicate',
  synchronize: '/synchronize',
  settings: '/settings'
} as const

export type NavigationPath = (typeof NAVIGATION_PATHS)[keyof typeof NAVIGATION_PATHS]

export interface NavigationItem {
  label: string
  path: NavigationPath
  icon: NavigationIcon
}

export interface AppRoute {
  path: NavigationPath
  component: NavigationPage
}

const primaryItems: readonly NavigationItem[] = [
  { label: 'Organize', path: NAVIGATION_PATHS.organize, icon: FolderIcon },
  { label: 'Duplicate', path: NAVIGATION_PATHS.duplicate, icon: Squares2X2Icon },
  { label: 'Synchronize', path: NAVIGATION_PATHS.synchronize, icon: ArrowPathIcon }
]

const secondaryItems: readonly NavigationItem[] = [
  { label: 'Settings', path: NAVIGATION_PATHS.settings, icon: Cog6ToothIcon }
]

export const NAVIGATION_ITEMS = {
  primary: primaryItems,
  secondary: secondaryItems
} as const

export const APP_ROUTES: readonly AppRoute[] = [
  { path: NAVIGATION_PATHS.organize, component: OrganizePage },
  { path: NAVIGATION_PATHS.duplicate, component: DuplicatePage },
  { path: NAVIGATION_PATHS.synchronize, component: SynchronizePage },
  { path: NAVIGATION_PATHS.settings, component: SettingsPage }
]

export const isNavigationItemActive = (pathname: string, path: NavigationPath): boolean => {
  return pathname === path || (path === NAVIGATION_PATHS.organize && pathname === '/')
}
