import { useEffect, useRef, useState } from 'react'

const LOAD_MARGIN_PX = 400

// Reveals `items` in pages as a sentinel element scrolls near the viewport
// (or a bounded scroll container, via `scrollRef`). Deliberately re-checks
// the sentinel's position with getBoundingClientRect on every reveal and on
// scroll/resize, rather than relying solely on IntersectionObserver's
// enter/exit callback — with small tiles, a single page of new content can
// still leave the sentinel inside the trigger margin, so no new "entering"
// transition ever fires and growth silently stalls.
export function useInfiniteReveal<T>(items: T[], pageSize: number) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(pageSize)
    scrollRef.current?.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    if (visibleCount >= items.length) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    function tryLoadMore() {
      const el = sentinelRef.current
      if (!el) return
      const root = scrollRef.current
      const rootBottom = root ? root.getBoundingClientRect().bottom : window.innerHeight
      if (el.getBoundingClientRect().top <= rootBottom + LOAD_MARGIN_PX) {
        setVisibleCount((count) => Math.min(count + pageSize, items.length))
      }
    }

    tryLoadMore()
    const target: EventTarget = scrollRef.current ?? window
    target.addEventListener('scroll', tryLoadMore, { passive: true })
    window.addEventListener('resize', tryLoadMore)
    return () => {
      target.removeEventListener('scroll', tryLoadMore)
      window.removeEventListener('resize', tryLoadMore)
    }
  }, [visibleCount, items.length, pageSize])

  return { visible: items.slice(0, visibleCount), scrollRef, sentinelRef, hasMore: visibleCount < items.length }
}
