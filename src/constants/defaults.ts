import type { Stat } from '../types'

export const XP_PER_COMPLETION = 10

export const DEFAULT_STATS: Stat[] = [
  { id: 'str', name: 'Strength',     abbreviation: 'STR', color: '#ef4444', icon: 'Barbell',       xp: 0, level: 1, order: 0 },
  { id: 'dex', name: 'Dexterity',    abbreviation: 'DEX', color: '#22c55e', icon: 'Lightning',     xp: 0, level: 1, order: 1 },
  { id: 'con', name: 'Constitution', abbreviation: 'CON', color: '#f97316', icon: 'Shield',        xp: 0, level: 1, order: 2 },
  { id: 'int', name: 'Intelligence', abbreviation: 'INT', color: '#3b82f6', icon: 'BookOpen',      xp: 0, level: 1, order: 3 },
  { id: 'wis', name: 'Wisdom',       abbreviation: 'WIS', color: '#a855f7', icon: 'Eye',           xp: 0, level: 1, order: 4 },
  { id: 'cha', name: 'Charisma',     abbreviation: 'CHA', color: '#ec4899', icon: 'Star',          xp: 0, level: 1, order: 5 },
]

export const HABIT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]
