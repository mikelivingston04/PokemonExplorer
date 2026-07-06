// A simple bounded-concurrency queue. Expensive-tier filters can fan out to
// hundreds of per-candidate fetches (evolution chains, movesets) — without a
// cap, a single filter change with no generation/type narrowing could fire
// 1000+ simultaneous requests against a free community-run API.
export function createLimiter(maxConcurrent: number) {
  let active = 0
  const queue: (() => void)[] = []

  function next() {
    if (active >= maxConcurrent || queue.length === 0) return
    active++
    const run = queue.shift()!
    run()
  }

  return function schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--
            next()
          })
      })
      next()
    })
  }
}

// Shared across all expensive-tier queries in the app.
export const expensiveFetchLimiter = createLimiter(8)
