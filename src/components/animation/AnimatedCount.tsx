import { motion, useAnimation } from 'framer-motion'
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
  const wobbleControls = useAnimation()

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const startTime = performance.now()
      const diff = to - from

      wobbleControls.start({
        x: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
        y: [0, 1, -1, 1, -1, 0],
        transition: { duration: 0.12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
      })

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(from + diff * eased))

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          wobbleControls.start({ x: 0, y: 0, transition: { duration: 0.1 } })
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.span animate={wobbleControls} style={{ display: 'inline-block' }}>
      {display}
    </motion.span>
  )
}
