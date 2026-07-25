import { useEffect, useState } from 'react';

export function useThumbnail(src: string, size = 200): string | undefined {
  const [thumb, setThumb] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!src.trim()) {
      setTimeout(() => {
        setThumb(undefined);
      }, 0);
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;

    const generate = async (): Promise<void> => {
      try {
        // Fetch + blob URL keeps the canvas untainted (custom protocols like
        // localfile:// would otherwise block toDataURL).
        const response = await fetch(src);
        if (!response.ok) return;

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to decode thumbnail image'));
          img.src = objectUrl!;
        });

        if (cancelled) return;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (ctx === null) return;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);

        const scale = Math.min(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;

        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, x, y, width, height);

        setThumb(canvas.toDataURL('image/jpeg', 0.7));
      } catch {
        if (!cancelled) setThumb(undefined);
      } finally {
        if (objectUrl !== undefined) {
          URL.revokeObjectURL(objectUrl);
        }
      }
    };

    void generate();

    return () => {
      cancelled = true;
      setThumb(undefined);
    };
  }, [src, size]);

  return thumb;
}
