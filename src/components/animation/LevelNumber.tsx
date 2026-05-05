import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  level: number
  didLevelUp: boolean
  className?: string
}

export function LevelNumber({ level, didLevelUp, className = '' }: Props) {
  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={level}
          initial={didLevelUp ? { y: 20, opacity: 0, scale: 0.5 } : false}
          animate={didLevelUp ? { y: 0, opacity: 1, scale: [1, 1.6, 1.2, 1] } : { y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, times: didLevelUp ? [0, 0.4, 0.7, 1] : undefined }}
          className="inline-block"
        >
          {level}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
