export interface Stat {
  id: string
  name: string
  abbreviation: string
  color: string
  icon: string
  xp: number
  level: number
  order: number
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly'

export interface Habit {
  id: string
  name: string
  description: string
  frequency: HabitFrequency
  linkedStatIds: string[]
  color: string
  icon: string
  createdAt: string
  archivedAt?: string
}

export interface LogEntry {
  id: string
  habitId: string
  date: string
  completedAt: string
}

export interface AppData {
  version: number
  stats: Stat[]
  habits: Habit[]
  log: LogEntry[]
  characterName: string
}

export interface XpGainEvent {
  statId: string
  xpGained: number
  previousXp: number
  previousLevel: number
  newXp: number
  newLevel: number
  didLevelUp: boolean
}
