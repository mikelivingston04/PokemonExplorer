import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SpriteImageProps {
  src: string | null | undefined
  alt: string
  className?: string
}

// Falls back to an empty placeholder box instead of the browser's broken-image
// icon if a sprite URL 404s or a transient network hiccup drops the request.
export function SpriteImage({ src, alt, className }: SpriteImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className={cn('bg-muted/40', className)} />
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
