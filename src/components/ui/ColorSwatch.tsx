import { HABIT_COLORS } from '../../constants/defaults'

interface Props {
  value: string
  onChange: (color: string) => void
}

export function ColorSwatch({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {HABIT_COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: color,
            borderColor: value === color ? 'white' : 'transparent',
          }}
        />
      ))}
    </div>
  )
}
