import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { xpProgressInCurrentLevel } from '../../lib/xp'
import { GameIcon } from '../../lib/icons'

export function TopBar() {
  const { data, xpQueue } = useGame()
  const totalLevel = data.stats.reduce((sum, s) => sum + s.level, 0)
  const animatingStatId = xpQueue[0]?.statId ?? null

  return (
    <header className="bg-[#12121f] border-b border-white/5 px-4 py-2 flex items-center gap-3">
      <div className="flex-shrink-0">
        <div className="text-white font-bold text-sm leading-none">{data.characterName}</div>
        <div className="text-white/40 text-xs mt-0.5">Lv {totalLevel}</div>
      </div>

      <div className="w-px h-8 bg-white/10 flex-shrink-0" />

      <div className="flex gap-3 overflow-x-auto flex-1">
        {[...data.stats].sort((a, b) => a.order - b.order).map(stat => {
          const progress = xpProgressInCurrentLevel(stat.xp)
          return (
            <div
              key={stat.id}
              className="flex flex-col items-center gap-1 flex-shrink-0"
              style={{ opacity: animatingStatId === stat.id ? 0 : 1 }}
            >
              <GameIcon name={stat.icon} size={16} weight="duotone" color={stat.color} />
              <div className="w-8 h-1 rounded-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color, originX: 0 }}
                  animate={{ scaleX: progress.fraction }}
                  initial={{ scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 60, damping: 14 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}
