import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { xpProgressInCurrentLevel } from '../../lib/xp'
import { XpBar } from './XpBar'
import { LevelNumber } from './LevelNumber'
import { LevelUpBurst } from './LevelUpBurst'
import { AnimatedCount } from './AnimatedCount'

type Phase = 'idle' | 'showing' | 'done'

export function AnimationOrchestrator() {
  const { xpQueue, dequeueXp, data, triggerShake } = useGame()
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentEvent, setCurrentEvent] = useState(xpQueue[0] ?? null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (phase === 'idle' && xpQueue.length > 0) {
      setCurrentEvent(xpQueue[0])
      setPhase('showing')
      if (xpQueue[0].didLevelUp) triggerShake()
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setPhase('done'), 1800)
    }
  }, [xpQueue, phase, triggerShake])

  useEffect(() => {
    if (phase === 'done') {
      dequeueXp()
      setPhase('idle')
    }
  }, [phase, dequeueXp])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  if (!currentEvent || phase === 'idle') return null

  const stat = data.stats.find(s => s.id === currentEvent.statId)
  if (!stat) return null

  const prevProgress = xpProgressInCurrentLevel(currentEvent.previousXp)
  const newProgress = xpProgressInCurrentLevel(currentEvent.newXp)

  return (
    <>
      {/* Particle burst */}
      {currentEvent.didLevelUp && (
        <LevelUpBurst color={stat.color} active={phase === 'showing'} />
      )}

      {/* Backdrop */}
      <AnimatePresence>
        {phase === 'showing' && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            {/* Expanded stat card */}
            <motion.div
              layoutId={`stat-card-${stat.id}`}
              className="rounded-2xl p-8 w-80 shadow-2xl"
              style={{ backgroundColor: '#1e1e2e', borderColor: stat.color, borderWidth: 2 }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.span
                  className="text-5xl"
                  animate={currentEvent.didLevelUp ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {stat.icon}
                </motion.span>
                <div>
                  <div className="text-white/60 text-sm font-medium uppercase tracking-widest">{stat.abbreviation}</div>
                  <div className="text-white text-2xl font-bold">{stat.name}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Level</span>
                  <span className="text-white text-lg font-bold flex items-center gap-2">
                    <LevelNumber level={currentEvent.newLevel} didLevelUp={currentEvent.didLevelUp} />
                    {currentEvent.didLevelUp && (
                      <motion.span
                        className="text-yellow-400 text-sm font-bold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        LEVEL UP!
                      </motion.span>
                    )}
                  </span>
                </div>

                <XpBar
                  fraction={newProgress.fraction}
                  previousFraction={prevProgress.fraction}
                  didLevelUp={currentEvent.didLevelUp}
                  color={stat.color}
                  height={12}
                />

                <div className="flex justify-between mt-2 text-white/40 text-xs">
                  <span>
                    <AnimatedCount from={prevProgress.current} to={newProgress.current} />
                    {' / '}
                    <AnimatedCount from={prevProgress.required} to={newProgress.required} />
                    {' XP'}
                  </span>
                  <motion.span
                    className="font-semibold"
                    style={{ color: stat.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    +{currentEvent.xpGained} XP
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
