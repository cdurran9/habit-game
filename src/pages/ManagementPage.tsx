import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { HabitListItem } from '../components/habits/HabitListItem'
import { HabitForm } from '../components/habits/HabitForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import type { Habit } from '../types'

export function ManagementPage() {
  const { data, dispatch } = useGame()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)

  const activeHabits = data.habits.filter(h => !h.archivedAt)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(habit: Habit) {
    setEditing(habit)
    setModalOpen(true)
  }

  function handleSave(habit: Habit) {
    if (editing) {
      dispatch({ type: 'UPDATE_HABIT', habit })
    } else {
      dispatch({ type: 'ADD_HABIT', habit })
    }
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Habits</h1>
          <p className="text-white/40 text-sm mt-1">{activeHabits.length} active habit{activeHabits.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate}>+ New Habit</Button>
      </div>

      {activeHabits.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <div className="text-5xl mb-4">⚔️</div>
          <p className="text-lg">No habits yet.</p>
          <p className="text-sm mt-2">Create your first quest to start earning XP.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {activeHabits.map(h => (
            <HabitListItem key={h.id} habit={h} onEdit={openEdit} />
          ))}
        </AnimatePresence>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Edit Habit' : 'New Habit'}
      >
        <HabitForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>
    </div>
  )
}
