import { useState } from 'react'
import type { Habit, HabitFrequency } from '../../types'
import { useGame } from '../../context/GameContext'
import { uuid } from '../../lib/uuid'
import { Button } from '../ui/Button'
import { ColorSwatch } from '../ui/ColorSwatch'
import { IconPicker } from '../ui/IconPicker'
import { GameIcon } from '../../lib/icons'

interface Props {
  initial?: Habit
  onSave: (habit: Habit) => void
  onCancel: () => void
}

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'weekly', label: 'Weekly (Mon)' },
]

export function HabitForm({ initial, onSave, onCancel }: Props) {
  const { data } = useGame()
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [frequency, setFrequency] = useState<HabitFrequency>(initial?.frequency ?? 'daily')
  const [linkedStatIds, setLinkedStatIds] = useState<string[]>(initial?.linkedStatIds ?? [])
  const [color, setColor] = useState(initial?.color ?? '#3b82f6')
  const [icon, setIcon] = useState(initial?.icon ?? 'Target')

  function toggleStat(id: string) {
    setLinkedStatIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || linkedStatIds.length === 0) return
    onSave({
      id: initial?.id ?? uuid(),
      name: name.trim(),
      description: description.trim(),
      frequency,
      linkedStatIds,
      color,
      icon,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      archivedAt: initial?.archivedAt,
    })
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30'
  const labelClass = 'block text-white/60 text-xs font-semibold uppercase tracking-wide mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Name</label>
        <input
          className={inputClass}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Do 10 pushups"
          required
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="I will do pushups every morning, adding one more each day"
        />
      </div>

      <div>
        <label className={labelClass}>Frequency</label>
        <div className="flex flex-wrap gap-2">
          {FREQUENCIES.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: frequency === f.value ? color : 'rgba(255,255,255,0.05)',
                color: frequency === f.value ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Linked Stats <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {data.stats.map(stat => (
            <button
              key={stat.id}
              type="button"
              onClick={() => toggleStat(stat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: linkedStatIds.includes(stat.id) ? stat.color + '33' : 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: linkedStatIds.includes(stat.id) ? stat.color : 'transparent',
                color: linkedStatIds.includes(stat.id) ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            >
              <GameIcon name={stat.icon} size={13} weight="duotone" /> {stat.abbreviation}
            </button>
          ))}
        </div>
        {linkedStatIds.length === 0 && (
          <p className="text-red-400/70 text-xs mt-1">Select at least one stat</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Icon</label>
        <IconPicker value={icon} onChange={setIcon} />
      </div>

      <div>
        <label className={labelClass}>Color</label>
        <ColorSwatch value={color} onChange={setColor} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={!name.trim() || linkedStatIds.length === 0}>
          {initial ? 'Save Changes' : 'Create Habit'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
