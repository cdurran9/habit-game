import { NavLink } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import { StatMiniature } from './StatMiniature'

export function Sidebar() {
  const { data, xpQueue, devMode, signOut } = useGame()

  const totalLevel = data.stats.reduce((sum, s) => sum + s.level, 0)
  const animatingStatId = xpQueue[0]?.statId ?? null

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
    }`

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#12121f] border-r border-white/5 p-4 gap-6">
      {/* Character header */}
      <div className="text-center pt-2">
        <div className="text-3xl mb-1">⚔️</div>
        <div className="text-white font-bold text-sm truncate">{data.characterName}</div>
        <div className="text-white/40 text-xs mt-0.5">Total Level {totalLevel}</div>
        {devMode && (
          <div className="mt-1.5 text-yellow-400 text-xs font-semibold bg-yellow-400/10 rounded px-2 py-0.5">
            DEV MODE
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <NavLink to="/track" className={navClass}>📅 Track</NavLink>
        <NavLink to="/habits" className={navClass}>📋 Habits</NavLink>
        <NavLink to="/settings" className={navClass}>⚙️ Settings</NavLink>
      </nav>

      {/* Stats */}
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        <div className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-1">Stats</div>
        {[...data.stats].sort((a, b) => a.order - b.order).map(stat => (
          <StatMiniature key={stat.id} stat={stat} isAnimating={animatingStatId === stat.id} />
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="text-white/25 hover:text-white/50 text-xs text-left px-2 py-1 transition-colors"
      >
        Sign out
      </button>
    </aside>
  )
}
