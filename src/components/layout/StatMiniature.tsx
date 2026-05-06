import { motion } from 'framer-motion'
import type { Stat } from '../../types'
import { xpProgressInCurrentLevel } from '../../lib/xp'
import { GameIcon } from '../../lib/icons'

interface Props {
  stat: Stat
  isAnimating: boolean
}

export function StatMiniature({ stat, isAnimating }: Props) {
  const progress = xpProgressInCurrentLevel(stat.xp)

  return (
    <motion.div
      layoutId={`stat-card-${stat.id}`}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
      style={{ visibility: isAnimating ? 'hidden' : 'visible' }}
    >
      <GameIcon name={stat.icon} size={18} weight="duotone" color={stat.color} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">{stat.abbreviation}</span>
          <span className="text-white/50 text-xs">Lv {stat.level}</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: stat.color, originX: 0 }}
            animate={{ scaleX: progress.fraction }}
            initial={{ scaleX: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
