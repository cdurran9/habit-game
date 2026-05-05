import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  fraction: number
  previousFraction: number
  didLevelUp: boolean
  color: string
  height?: number
  delay?: number
}

export function XpBar({ fraction, previousFraction, didLevelUp, color, height = 8, delay = 350 }: Props) {
  const controls = useAnimation()

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (didLevelUp) {
        await controls.start({ scaleX: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } })
        controls.set({ scaleX: 0 })
        await controls.start({ scaleX: fraction, transition: { type: 'spring', stiffness: 60, damping: 14 } })
      } else {
        await controls.start({ scaleX: fraction, transition: { type: 'spring', stiffness: 80, damping: 18 } })
      }
    }, delay)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, backgroundColor: 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        animate={controls}
        className="h-full rounded-full"
        style={{ backgroundColor: color, originX: 0 }}
        initial={{ scaleX: previousFraction }}
      />
    </div>
  )
}
