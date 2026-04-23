import { useEffect, useState } from 'react'

export function useThumbnail(src: string, size = 200): string | undefined {
  const [thumb, setThumb] = useState<string | undefined>(undefined)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = size
      canvas.height = size

      // Optional: background (important if transparent images)
      ctx!.fillStyle = '' // or "transparent"
      ctx?.fillRect(0, 0, size, size)

      // 👉 scale to fit (contain)
      const scale = Math.min(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale

      // 👉 center inside square
      const x = (size - w) / 2
      const y = (size - h) / 2

      ctx!.imageSmoothingQuality = 'high'
      ctx?.drawImage(img, x, y, w, h)

      setThumb(canvas.toDataURL('image/jpeg', 0.7))
    }
  }, [src, size])

  return thumb
}
