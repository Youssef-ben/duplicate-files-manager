import { CliApi } from '@handlers/cli'
import { GlobalApi } from '@handlers/global'
import { ThemeApi } from '@handlers/theme'

export type AppApi = {
  global: GlobalApi
  cli: CliApi
  theme: ThemeApi
}
