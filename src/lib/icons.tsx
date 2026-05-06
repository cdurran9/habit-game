import {
  Barbell, Lightning, Shield, BookOpen, Eye, Star,
  CalendarCheck, ListChecks, Gear, SignOut, Sword,
  Drop, Leaf, Moon, PencilSimple, Target, MusicNotes,
  Waves, Bicycle, Broom, Pill, Plant, Handshake,
  PersonSimpleRun, Brain, Check,
} from '@phosphor-icons/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ICON_MAP: Record<string, any> = {
  Barbell, Lightning, Shield, BookOpen, Eye, Star,
  CalendarCheck, ListChecks, Gear, SignOut, Sword,
  Drop, Leaf, Moon, PencilSimple, Target, MusicNotes,
  Waves, Bicycle, Broom, Pill, Plant, Handshake,
  PersonSimpleRun, Brain, Check,
}

export type IconName = keyof typeof ICON_MAP

export const HABIT_ICON_NAMES: IconName[] = [
  'Barbell', 'PersonSimpleRun', 'BookOpen', 'Brain',
  'Drop', 'Leaf', 'Moon', 'PencilSimple',
  'Target', 'MusicNotes', 'Waves', 'Bicycle',
  'Broom', 'Pill', 'Plant', 'Handshake',
]

export const STAT_ICON_NAMES: IconName[] = [
  'Barbell', 'Lightning', 'Shield', 'BookOpen', 'Eye', 'Star',
  'Brain', 'Sword', 'Waves', 'Leaf', 'Target', 'MusicNotes',
]

interface GameIconProps {
  name: string
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  color?: string
  className?: string
}

export function GameIcon({ name, size = 20, weight = 'regular', color, className }: GameIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} weight={weight} color={color} className={className} />
}
