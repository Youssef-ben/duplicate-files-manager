import { ProgressEvent } from '@handlers/cli/types'

/**
 * Returns the name of the folder from a given path.
 *
 * @param path - The path to get the folder name from.
 * @returns The name of the folder.
 */
export function getFolderName(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const parts = trimmed.split(/[/\\]/).filter(Boolean)
  const name = parts.length > 0 ? parts[parts.length - 1]! : trimmed
  return name.trim()
}

/**
 * Trims trailing separators and joins path segments with `/` so paths from
 * mixed or OS-specific separators compare and key reliably.
 */
export function normalizeFolderPath(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const parts = trimmed.split(/[/\\]/).filter(Boolean)
  return parts.join('/')
}

/**
 * Parent directory path in the same normalized form as {@link normalizeFolderPath},
 * or empty string when there is no parent (root or single-segment path).
 */
export function getParentFolderPath(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const parts = trimmed.split(/[/\\]/).filter(Boolean)
  if (parts.length <= 1) return ''
  return parts.slice(0, -1).join('/')
}

/**
 * Returns the progress percentage of a given current and total.
 *
 * @returns The progress percentage.
 */
export function getProgressPercentage(progress: ProgressEvent | null): number {
  if (!progress?.current || !progress?.total) return 0

  return Math.round((progress.current / progress.total) * 100)
}

const sizes = ['KB', 'MB', 'GB', 'TB']
const SI_FACTOR = 1024

/**
 * Converts a given number of bytes to a human readable size, starting from KB.
 *
 * @param bytes - The number of bytes to convert.
 * @returns The human readable size.
 */
export function humanizeSize(bytes: number): string {
  if (bytes < SI_FACTOR) return '0 KB'

  const i = Math.floor(Math.log(bytes) / Math.log(SI_FACTOR)) - 1
  const idx = Math.min(Math.max(i, 0), sizes.length - 1)
  return parseFloat((bytes / Math.pow(SI_FACTOR, idx + 1)).toFixed(2)) + ' ' + sizes[idx]
}
