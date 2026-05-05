import { useEffect, useRef, useState } from 'react'

interface Props {
  from: number
  to: number
  delay?: number
  duration?: number
}

export function AnimatedCount({ from, to, delay = 350, duration = 600 }: Props) {
  const [display, setDisplay] = useState(from)
  const rafRef = useRef<number>()

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const startTime = performance.now()
      const diff = to - from

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(from + diff * eased))
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{display}</>
}
