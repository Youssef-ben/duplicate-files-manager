import type { AppApi } from '@shared/window.types'

declare global {
  interface Window {
    appApi: AppApi
  }
}

export {}
