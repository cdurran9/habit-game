import { NavLink } from 'react-router-dom'
import { CalendarCheck, ListChecks, Gear, Sword, SignOut } from '@phosphor-icons/react'
import { useGame } from '../../context/GameContext'
import { StatMiniature } from './StatMiniature'

export function Sidebar() {
  const { data, xpQueue, devMode, signOut } = useGame()

  const totalLevel = data.stats.reduce((sum, s) => sum + s.level, 0)
  const animatingStatId = xpQueue[0]?.statId ?? null

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
    }`

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#12121f] border-r border-white/5 p-4 gap-6">
      <div className="text-center pt-2">
        <Sword size={32} weight="duotone" color="rgba(255,255,255,0.7)" className="mx-auto mb-1" />
        <div className="text-white font-bold text-sm truncate">{data.characterName}</div>
        <div className="text-white/40 text-xs mt-0.5">Total Level {totalLevel}</div>
        {devMode && (
          <div className="mt-1.5 text-yellow-400 text-xs font-semibold bg-yellow-400/10 rounded px-2 py-0.5">
            DEV MODE
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/track" className={navClass}>
          <CalendarCheck size={16} weight="duotone" /> Track
        </NavLink>
        <NavLink to="/habits" className={navClass}>
          <ListChecks size={16} weight="duotone" /> Habits
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <Gear size={16} weight="duotone" /> Settings
        </NavLink>
      </nav>

      <div className="flex flex-col gap-1 flex-1 min-h-0">
        <div className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-1">Stats</div>
        {[...data.stats].sort((a, b) => a.order - b.order).map(stat => (
          <StatMiniature key={stat.id} stat={stat} isAnimating={animatingStatId === stat.id} />
        ))}
      </div>

      <button
        onClick={signOut}
        className="flex items-center gap-2 text-white/25 hover:text-white/50 text-xs px-2 py-1 transition-colors"
      >
        <SignOut size={14} /> Sign out
      </button>
    </aside>
  )
}
