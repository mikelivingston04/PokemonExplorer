import { useState } from 'react'
import { cn } from '@/lib/utils'
import styles from './SpriteImage.module.scss'

interface SpriteImageProps {
  src: string | null | undefined
  alt: string
  // Sizing is intentionally the caller's responsibility (this component has
  // no fixed size of its own) — pass a CSS module class or width/height.
  className?: string
}

export function SpriteImage({ src, alt, className }: SpriteImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className={cn(styles.placeholder, className)} />
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
