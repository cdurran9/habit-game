import { createContext, useContext, useReducer, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { AppData, Habit, Stat, LogEntry, XpGainEvent } from '../types'
import { loadData, saveData } from '../lib/storage'
import { levelFromXp } from '../lib/xp'
import { uuid } from '../lib/uuid'
import { XP_PER_COMPLETION } from '../constants/defaults'
import { todayString } from '../lib/date'

type Action =
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'UPDATE_HABIT'; habit: Habit }
  | { type: 'ARCHIVE_HABIT'; id: string }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'UPDATE_STAT'; stat: Stat }
  | { type: 'GAIN_XP'; statId: string; amount: number }
  | { type: 'LOG_COMPLETION'; habitId: string }
  | { type: 'UPDATE_CHARACTER_NAME'; name: string }

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.habit] }

    case 'UPDATE_HABIT':
      return { ...state, habits: state.habits.map(h => h.id === action.habit.id ? action.habit : h) }

    case 'ARCHIVE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.id ? { ...h, archivedAt: new Date().toISOString() } : h),
      }

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.id),
        log: state.log.filter(l => l.habitId !== action.id),
      }

    case 'UPDATE_STAT':
      return { ...state, stats: state.stats.map(s => s.id === action.stat.id ? action.stat : s) }

    case 'GAIN_XP': {
      const stats = state.stats.map(s => {
        if (s.id !== action.statId) return s
        const newXp = s.xp + action.amount
        return { ...s, xp: newXp, level: levelFromXp(newXp) }
      })
      return { ...state, stats }
    }

    case 'LOG_COMPLETION': {
      const entry: LogEntry = {
        id: uuid(),
        habitId: action.habitId,
        date: todayString(),
        completedAt: new Date().toISOString(),
      }
      return { ...state, log: [...state.log, entry] }
    }

    case 'UPDATE_CHARACTER_NAME':
      return { ...state, characterName: action.name }

    default:
      return state
  }
}

interface GameContextValue {
  data: AppData
  dispatch: React.Dispatch<Action>
  xpQueue: XpGainEvent[]
  dequeueXp: () => void
  completeHabit: (habitId: string) => void
  isCompletedToday: (habitId: string) => boolean
  devMode: boolean
  setDevMode: (v: boolean) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, loadData)
  const [xpQueue, setXpQueue] = useState<XpGainEvent[]>([])
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => saveData(data), 200)
    return () => clearTimeout(timer)
  }, [data])

  const isCompletedToday = useCallback((habitId: string) => {
    const today = todayString()
    return data.log.some(l => l.habitId === habitId && l.date === today)
  }, [data.log])

  const completeHabit = useCallback((habitId: string) => {
    if (!devMode && isCompletedToday(habitId)) return

    const habit = data.habits.find(h => h.id === habitId)
    if (!habit) return

    if (!devMode) dispatch({ type: 'LOG_COMPLETION', habitId })

    const events: XpGainEvent[] = habit.linkedStatIds.map(statId => {
      const stat = data.stats.find(s => s.id === statId)!
      const previousXp = stat.xp
      const previousLevel = stat.level
      const newXp = previousXp + XP_PER_COMPLETION
      const newLevel = levelFromXp(newXp)
      dispatch({ type: 'GAIN_XP', statId, amount: XP_PER_COMPLETION })
      return { statId, xpGained: XP_PER_COMPLETION, previousXp, previousLevel, newXp, newLevel, didLevelUp: newLevel > previousLevel }
    })

    setXpQueue(q => [...q, ...events])
  }, [data.habits, data.stats, devMode, isCompletedToday])

  const dequeueXp = useCallback(() => {
    setXpQueue(q => q.slice(1))
  }, [])

  return (
    <GameContext.Provider value={{ data, dispatch, xpQueue, dequeueXp, completeHabit, isCompletedToday, devMode, setDevMode }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
