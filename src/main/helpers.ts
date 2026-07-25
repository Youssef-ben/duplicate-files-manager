import { mimeTypeFromFilePath } from '@shared/fileMime';
import { createReadStream } from 'fs';
import { readFile, stat } from 'fs/promises';
import { Readable } from 'node:stream';

interface SingleRange {
  start: number;
  end: number;
}
function parseSingleRange(rangeHeader: string, size: number): SingleRange | null {
  const match = /^bytes=([^,\s]+)$/i.exec(rangeHeader.trim());
  if (match === null) return null;
  const rangeSpec = match[1];
  if (rangeSpec.includes(',')) return null;

  const dashIndex = rangeSpec.indexOf('-');
  if (dashIndex < 0) return null;
  const startPart = rangeSpec.slice(0, dashIndex);
  const endPart = rangeSpec.slice(dashIndex + 1);

  if (startPart === '' && endPart !== '') {
    const suffixLen = Number(endPart);
    if (!Number.isFinite(suffixLen) || suffixLen <= 0) return null;
    const start = Math.max(0, size - suffixLen);
    return { start, end: size - 1 };
  }

  const start = startPart === '' ? 0 : Number(startPart);
  let end = endPart === '' ? size - 1 : Number(endPart);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || start >= size || end < start) return null;
  end = Math.min(end, size - 1);
  return { start, end };
}

/** Serves local files; supports Range so `<video>` can seek and buffer (Chromium requires this). */
export async function localFileResponse(req: Request, filePath: string): Promise<Response> {
  let fileSize: number;
  try {
    fileSize = (await stat(filePath)).size;
  } catch {
    return new Response(null, { status: 404 });
  }

  const mime = mimeTypeFromFilePath(filePath);
  const rangeHeader = req.headers.get('range');

  if (rangeHeader === null || fileSize === 0) {
    try {
      const data = await readFile(filePath);
      const body = new Uint8Array(data);
      return new Response(body, {
        status: 200,
        headers: {
          'content-type': mime,
          'content-length': String(body.byteLength),
          'accept-ranges': 'bytes'
        }
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  }

  const range = parseSingleRange(rangeHeader, fileSize);
  if (range === null) {
    return new Response(null, { status: 400 });
  }

  const { start, end } = range;
  const chunkSize = end - start + 1;

  const nodeStream = createReadStream(filePath, { start, end });
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    status: 206,
    headers: {
      'content-type': mime,
      'content-length': String(chunkSize),
      'content-range': `bytes ${start}-${end}/${fileSize}`,
      'accept-ranges': 'bytes'
    }
  });
}
