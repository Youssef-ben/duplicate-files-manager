import { CliProgressEvent } from '@handlers/cli/types';

/**
 * Returns the URL of a given file path.
 * Uses host `fs` and query `p` so the URL is not parsed as `localfile://e/...` (drive as host).
 *
 * @param path - The path to get the URL from.
 * @returns The URL of the file.
 */
export function loadFileUrl(path: string): string {
  const normalized = path.replace(/\\/g, '/');
  if (!normalized.trim()) return '';
  return `localfile://fs/?p=${encodeURIComponent(normalized)}`;
}

/**
 * Returns the name of the folder from a given path.
 *
 * @param path - The path to get the folder name from.
 * @returns The name of the folder.
 */
export function getFolderName(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '');
  const parts = trimmed.split(/[/\\]/).filter(Boolean);
  const name = parts.length > 0 ? parts[parts.length - 1]! : trimmed;
  return name.trim();
}

/**
 * Returns the name of the file from a given path.
 *
 * @param path - The path to get the file name from.
 * @returns The name of the file.
 */
export function getFileName(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '');
  const parts = trimmed.split(/[/\\]/).filter(Boolean);
  const name = parts.length > 0 ? parts[parts.length - 1]! : trimmed;
  return name.trim();
}

/**
 * Trims trailing separators and joins path segments with `/` so paths from
 * mixed or OS-specific separators compare and key reliably.
 */
export function normalizeFolderPath(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '');
  const parts = trimmed.split(/[/\\]/).filter(Boolean);
  return parts.join('/');
}

/**
 * Parent directory path in the same normalized form as {@link normalizeFolderPath},
 * or empty string when there is no parent (root or single-segment path).
 */
export function getParentFolderPath(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '');
  const parts = trimmed.split(/[/\\]/).filter(Boolean);
  if (parts.length <= 1) return '';
  return parts.slice(0, -1).join('/');
}

/**
 * Returns the progress percentage of a given current and total.
 *
 * @returns The progress percentage.
 */
export function getProgressPercentage(progress: CliProgressEvent | null): number {
  if (!progress?.current || !progress?.total) return 0;

  return Math.floor((progress.current / progress.total) * 100);
}

const sizes = ['KB', 'MB', 'GB', 'TB'];
const SI_FACTOR = 1024;

/**
 * Converts a given number of bytes to a human readable size, starting from KB.
 *
 * @param bytes - The number of bytes to convert.
 * @returns The human readable size.
 */
export function humanizeSize(bytes: number): string {
  if (bytes < SI_FACTOR) return '0 KB';

  const i = Math.floor(Math.log(bytes) / Math.log(SI_FACTOR)) - 1;
  const idx = Math.min(Math.max(i, 0), sizes.length - 1);
  return parseFloat((bytes / Math.pow(SI_FACTOR, idx + 1)).toFixed(2)) + ' ' + sizes[idx];
}

/**
 * Formats a given number of milliseconds to a human readable duration.
 *
 * @param ms - The number of milliseconds to format.
 * @returns The human readable duration.
 */
export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} Second(s)`;

  const time = `${Math.floor((ms % 3_600_000) / 60_000)} Minute(s)`;

  const hours = Math.floor(ms / 3_600_000);
  if (hours > 0) {
    return `${hours} Hour(s) ${time}`;
  }

  return time;
}

const PER_FILE_OVERHEAD_MS = 50;

const etaMsFromBytes = (
  processedBytes: number,
  totalBytes: number,
  elapsedMs: number,
  processedFiles: number,
  totalFiles: number
): number => {
  if (totalBytes <= 0 || processedBytes <= 0 || elapsedMs <= 0) return 0;

  const speedBps = processedBytes / (elapsedMs / 1000);
  if (speedBps <= 0) return 0;

  const remainingFiles = totalFiles - processedFiles;
  const transferMs = ((totalBytes - processedBytes) / speedBps) * 1000;
  const overheadMs = remainingFiles * PER_FILE_OVERHEAD_MS;

  return Math.max(0, transferMs + overheadMs);
};

export function calculateRemainingTime(
  progress: CliProgressEvent | undefined,
  startTimeMs: number | undefined
): number {
  if (!progress || !startTimeMs) return 0;

  // calculate the eta
  const elapsedMs = Date.now() - startTimeMs;

  return etaMsFromBytes(
    progress.processed_bytes ?? 0,
    progress.total_bytes ?? 0,
    elapsedMs,
    progress.current ?? 0,
    progress.total ?? 0
  );
}

/** Lowercase suffixes we preview with `<img>` (browser-decodable raster/vector). */
const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.ico',
  '.tif',
  '.tiff',
  '.avif',
  '.heic',
  '.heif',
  '.jxl'
] as const;

/**
 * Checks if a given path is an image.
 *
 * @param path - The path to check.
 * @returns True if the path is an image, false otherwise.
 */
export function isImage(path: string): boolean {
  const lowerPath = path.toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext)) || false;
}
