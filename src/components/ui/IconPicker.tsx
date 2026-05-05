import { HABIT_ICONS } from '../../constants/defaults'

interface Props {
  value: string
  onChange: (icon: string) => void
}

export function IconPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {HABIT_ICONS.map(icon => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: value === icon ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            outline: value === icon ? '2px solid white' : 'none',
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
