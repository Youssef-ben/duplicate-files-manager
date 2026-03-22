import packageJson from '@pkg'
import { app } from 'electron'
import path from 'path'
import { CliRunArgs } from './types'

/**
 * Gets the path to the output file for the given arguments.
 *
 * @param args The arguments for the CLI.
 * @returns The path to the output file for the given arguments.
 */
function getOutputPath(args: CliRunArgs): string {
  return args.output ?? path.join(app.getPath('userData'), `${args.mode}-results.json`)
}

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
  const exe = process.platform === 'win32' ? `${packageJson.name}.exe` : packageJson.name
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

  flags.push('--output', getOutputPath(args))

  return flags
}
