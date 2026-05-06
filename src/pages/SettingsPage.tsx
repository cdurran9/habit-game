import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Button } from '../components/ui/Button'
import { ColorSwatch } from '../components/ui/ColorSwatch'
import { IconPicker } from '../components/ui/IconPicker'
import { GameIcon } from '../lib/icons'
import type { Stat } from '../types'

function StatEditor({ stat }: { stat: Stat }) {
  const { dispatch } = useGame()
  const [name, setName] = useState(stat.name)
  const [abbr, setAbbr] = useState(stat.abbreviation)
  const [color, setColor] = useState(stat.color)
  const [icon, setIcon] = useState(stat.icon)
  const [saved, setSaved] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  function handleSave() {
    dispatch({
      type: 'UPDATE_STAT',
      stat: { ...stat, name: name.trim() || stat.name, abbreviation: abbr.trim() || stat.abbreviation, color, icon },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const inputClass = 'bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/30 w-full'

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          style={{ backgroundColor: color + '22' }}
          onClick={() => setShowIconPicker(v => !v)}
          title="Click to change icon"
        >
          <GameIcon name={icon} size={20} weight="duotone" color={color} />
        </button>
        <div className="flex gap-2 flex-1">
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input className={`${inputClass} w-20`} value={abbr} onChange={e => setAbbr(e.target.value.toUpperCase().slice(0, 3))} placeholder="ABR" />
        </div>
      </div>

      {showIconPicker && (
        <div className="mb-4">
          <div className="text-white/40 text-xs mb-2">Icon</div>
          <IconPicker value={icon} onChange={v => { setIcon(v); setShowIconPicker(false) }} variant="stat" />
        </div>
      )}

      <div className="mb-4">
        <div className="text-white/40 text-xs mb-2">Color</div>
        <ColorSwatch value={color} onChange={setColor} />
      </div>
      <Button onClick={handleSave} variant={saved ? 'ghost' : 'primary'}>
        {saved ? '✓ Saved' : 'Save'}
      </Button>
    </div>
  )
}

export function SettingsPage() {
  const { data, dispatch, devMode, setDevMode } = useGame()
  const [characterName, setCharacterName] = useState(data.characterName)

  function handleNameSave() {
    dispatch({ type: 'UPDATE_CHARACTER_NAME', name: characterName.trim() || data.characterName })
  }

  const inputClass = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 flex-1'

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Settings</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Character</h2>
        <div className="flex gap-3">
          <input className={inputClass} value={characterName} onChange={e => setCharacterName(e.target.value)} placeholder="Adventurer" />
          <Button onClick={handleNameSave}>Save</Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Developer</h2>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setDevMode(!devMode)}
            className="w-10 h-6 rounded-full relative transition-colors"
            style={{ backgroundColor: devMode ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}
          >
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: devMode ? '1.25rem' : '0.25rem' }} />
          </div>
          <span className="text-white/70 text-sm">
            Unlimited XP mode
            {devMode && <span className="ml-2 text-yellow-400 text-xs font-semibold">ON — daily limit bypassed, XP not logged</span>}
          </span>
        </label>
      </section>

      <section>
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Stats</h2>
        <div className="flex flex-col gap-3">
          {[...data.stats].sort((a, b) => a.order - b.order).map(stat => (
            <StatEditor key={stat.id} stat={stat} />
          ))}
        </div>
      </section>
    </div>
  )
}
