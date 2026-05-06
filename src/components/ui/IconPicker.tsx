import { GameIcon, HABIT_ICON_NAMES, STAT_ICON_NAMES } from '../../lib/icons'

interface Props {
  value: string
  onChange: (icon: string) => void
  variant?: 'habit' | 'stat'
}

export function IconPicker({ value, onChange, variant = 'habit' }: Props) {
  const icons = variant === 'stat' ? STAT_ICON_NAMES : HABIT_ICON_NAMES
  return (
    <div className="flex flex-wrap gap-2">
      {icons.map(name => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: value === name ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            outline: value === name ? '2px solid white' : 'none',
          }}
        >
          <GameIcon name={name} size={18} weight="duotone" />
        </button>
      ))}
    </div>
  )
}
