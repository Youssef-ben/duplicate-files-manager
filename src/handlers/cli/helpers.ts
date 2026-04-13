import { IGNORED_FOLDERS_FILE } from '@shared/constants'
import { app } from 'electron'
import path from 'path'
import { CliRunArgs } from './types'

/**
 * Gets the path to the output file for the given arguments.
 *
 * @param args The arguments for the CLI.
 * @returns The path to the output file for the given arguments.
 */
function getCliOutputPath(args: CliRunArgs): string {
  if (args.output) {
    return args.output
  }

  return path.join(app.getPath('userData'), 'results', args.menu, `${args.mode}-results.json`)
}

/**
 * Gets the path to the ignore config file for the given arguments.
 *
 * @param args The arguments for the CLI.
 * @returns The path to the ignore config file for the given arguments.
 */
export function getCliIgnoreConfigPath(): string {
  return path.join(app.getPath('userData'), 'results', `${IGNORED_FOLDERS_FILE}.json`)
}

const CLI_EXE_NAME = 'library-organizer-cli'
/**
 * Gets the path to the CLI executable.
 *
 * Condition:
 * - If packaged -> the path will be in the `resources` folder
 * - If not packaged -> the path will be in the `app.getAppPath()` folder
 *
 * @returns The path to the CLI executable.
 */
export function getCliPath(): string {
  const exe = process.platform === 'win32' ? `${CLI_EXE_NAME}.exe` : CLI_EXE_NAME
  const resourcesPath = app.isPackaged ? process.resourcesPath : app.getAppPath()

  return path.join(resourcesPath, 'resources', exe)
}

/**
 * Gets the arguments for the CLI.
 *
 * @param args The arguments for the CLI.
 * @returns The arguments for the CLI.
 */
export function getCliFlags(args: CliRunArgs): string[] {
  const flags: string[] = [args.sourceRoot, '--mode', args.mode, '--progress-format', 'json']

  if (args.dryRun) flags.push('--dry-run')
  if (args.target) flags.push('--target', args.target)
  if (args.direction) flags.push('--direction', args.direction)
  if (args.input) flags.push('--input', args.input)
  if (args.confirm) flags.push('--confirm')
  if (args.outputFolder) flags.push('--output-folder', args.outputFolder)

  flags.push('--output', getCliOutputPath(args))
  flags.push('--ignore-config', getCliIgnoreConfigPath())

  return flags
}
