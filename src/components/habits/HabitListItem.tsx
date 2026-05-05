import { motion } from 'framer-motion'
import type { Habit } from '../../types'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'

interface Props {
  habit: Habit
  onEdit: (habit: Habit) => void
}

export function HabitListItem({ habit, onEdit }: Props) {
  const { dispatch, data } = useGame()
  const linkedStats = data.stats.filter(s => habit.linkedStatIds.includes(s.id))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
    >
      <div
        className="text-xl w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: habit.color + '22' }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm">{habit.name}</div>
        {habit.description && (
          <div className="text-white/30 text-xs mt-0.5 truncate">{habit.description}</div>
        )}
        <div className="flex gap-1.5 mt-1">
          <span className="text-white/30 text-xs capitalize">{habit.frequency}</span>
          {linkedStats.map(s => (
            <span key={s.id} className="text-xs" style={{ color: s.color }}>{s.icon} {s.abbreviation}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button variant="ghost" onClick={() => onEdit(habit)}>Edit</Button>
        <Button variant="danger" onClick={() => dispatch({ type: 'DELETE_HABIT', id: habit.id })}>Delete</Button>
      </div>
    </motion.div>
  )
}
