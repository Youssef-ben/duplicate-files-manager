/** Last segment extension including dot, lowercased (no Node `path` — safe in Vite renderer). */
function fileExtensionFromPath(filePath: string): string {
  const base = filePath.replace(/\\/g, '/').split('/').pop() ?? '';
  const dot = base.lastIndexOf('.');
  if (dot <= 0) return '';
  return base.slice(dot).toLowerCase();
}

/**
 * MIME type for local file serving and `<video type="…">` hints.
 * Keep in sync with `localfile` protocol responses in the main process.
 */
export function mimeTypeFromFilePath(filePath: string): string {
  switch (fileExtensionFromPath(filePath)) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.ico':
      return 'image/x-icon';
    case '.bmp':
      return 'image/bmp';
    case '.mp4':
    case '.m4v':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.ogv':
      return 'video/ogg';
    case '.mov':
      return 'video/quicktime';
    case '.3gp':
      return 'video/3gpp';
    case '.3g2':
      return 'video/3gpp2';
    case '.avi':
      return 'video/x-msvideo';
    case '.mkv':
      return 'video/x-matroska';
    case '.mpeg':
    case '.mpg':
      return 'video/mpeg';
    default:
      return 'application/octet-stream';
  }
}
