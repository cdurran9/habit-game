import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/track',    icon: '📅', label: 'Track'  },
  { to: '/habits',   icon: '📋', label: 'Habits' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#12121f] border-t border-white/5 flex z-30">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-white' : 'text-white/35'
            }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
