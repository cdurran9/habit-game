import { motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import type { Habit } from '../../types'
import { useGame } from '../../context/GameContext'
import { GameIcon } from '../../lib/icons'
import { Button } from '../ui/Button'

interface Props {
  habit: Habit
}

export function HabitCard({ habit }: Props) {
  const { completeHabit, isCompletedToday, data } = useGame()
  const done = isCompletedToday(habit.id)
  const linkedStats = data.stats.filter(s => habit.linkedStatIds.includes(s.id))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl border"
      style={{
        backgroundColor: done ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
        borderColor: done ? 'rgba(255,255,255,0.05)' : habit.color + '44',
      }}
    >
      <motion.div
        animate={done ? { scale: [1, 1.3, 1] } : {}}
        className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: habit.color + '22' }}
      >
        {done
          ? <Check size={20} weight="bold" color={habit.color} />
          : <GameIcon name={habit.icon} size={20} weight="duotone" color={habit.color} />
        }
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm" style={{ color: done ? 'rgba(255,255,255,0.3)' : 'white' }}>
          {habit.name}
        </div>
        {habit.description && (
          <div className="text-white/30 text-xs mt-0.5 truncate">{habit.description}</div>
        )}
        <div className="flex gap-1.5 mt-1.5">
          {linkedStats.map(s => (
            <span
              key={s.id}
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: s.color + '33', color: s.color }}
            >
              <GameIcon name={s.icon} size={11} weight="duotone" color={s.color} />
              {s.abbreviation}
            </span>
          ))}
        </div>
      </div>

      <Button
        onClick={() => completeHabit(habit.id)}
        disabled={done}
        variant={done ? 'ghost' : 'primary'}
        className={done ? 'opacity-30' : ''}
      >
        {done ? 'Done!' : '+XP'}
      </Button>
    </motion.div>
  )
}
