import { NavLink } from 'react-router-dom'
import { CalendarCheck, ListChecks, Gear, Gift } from '@phosphor-icons/react'

const tabs = [
  { to: '/track',    Icon: CalendarCheck, label: 'Track'    },
  { to: '/habits',   Icon: ListChecks,    label: 'Habits'   },
  { to: '/rewards',  Icon: Gift,          label: 'Rewards'  },
  { to: '/settings', Icon: Gear,          label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#12121f] border-t border-white/5 flex z-30">
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-white' : 'text-white/35'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} weight={isActive ? 'duotone' : 'regular'} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
