import { ListChecks } from '@phosphor-icons/react'
import { useGame } from '../context/GameContext'
import { HabitCard } from '../components/habits/HabitCard'
import { isDueToday } from '../lib/date'

export function TrackingPage() {
  const { data, isCompletedToday } = useGame()

  const todaysHabits = data.habits.filter(
    h => !h.archivedAt && isDueToday(h.frequency)
  )

  const pending = todaysHabits.filter(h => !isCompletedToday(h.id))
  const done = todaysHabits.filter(h => isCompletedToday(h.id))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Today's Quests</h1>
        <p className="text-white/40 text-sm mt-1">{today}</p>
      </div>

      {todaysHabits.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <ListChecks size={48} weight="duotone" className="mx-auto mb-4" />
          <p className="text-lg">No habits scheduled for today.</p>
          <p className="text-sm mt-2">Head to <span className="text-white/40">Habits</span> to create some.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {pending.map(h => <HabitCard key={h.id} habit={h} />)}
        </div>
      )}

      {done.length > 0 && (
        <div>
          <div className="text-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
            Completed ({done.length})
          </div>
          <div className="flex flex-col gap-3">
            {done.map(h => <HabitCard key={h.id} habit={h} />)}
          </div>
        </div>
      )}
    </div>
  )
}
