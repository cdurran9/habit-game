import { createContext, useContext, useReducer, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { AppData, Habit, Stat, LogEntry, XpGainEvent } from '../types'
import { supabase } from '../lib/supabase'
import { loadUserData, upsertStat, insertHabit, updateHabit, deleteHabit, insertLog, updateCharacterName } from '../lib/db'
import { levelFromXp } from '../lib/xp'
import { uuid } from '../lib/uuid'
import { XP_PER_COMPLETION } from '../constants/defaults'
import { todayString } from '../lib/date'

// ── Reducer ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOAD_DATA'; data: AppData }
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'UPDATE_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'UPDATE_STAT'; stat: Stat }
  | { type: 'GAIN_XP'; statId: string; amount: number }
  | { type: 'LOG_COMPLETION'; entry: LogEntry }
  | { type: 'UPDATE_CHARACTER_NAME'; name: string }

const empty: AppData = { version: 1, stats: [], habits: [], log: [], characterName: 'Adventurer' }

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.data

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.habit] }

    case 'UPDATE_HABIT':
      return { ...state, habits: state.habits.map(h => h.id === action.habit.id ? action.habit : h) }

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

    case 'LOG_COMPLETION':
      return { ...state, log: [...state.log, action.entry] }

    case 'UPDATE_CHARACTER_NAME':
      return { ...state, characterName: action.name }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface GameContextValue {
  data: AppData
  dispatch: React.Dispatch<Action>
  session: Session | null
  appLoading: boolean
  xpQueue: XpGainEvent[]
  dequeueXp: () => void
  completeHabit: (habitId: string) => void
  isCompletedToday: (habitId: string) => boolean
  devMode: boolean
  setDevMode: (v: boolean) => void
  signOut: () => Promise<void>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, empty)
  const [session, setSession] = useState<Session | null>(null)
  const [appLoading, setAppLoading] = useState(true)
  const [xpQueue, setXpQueue] = useState<XpGainEvent[]>([])
  const [devMode, setDevMode] = useState(false)

  // ── Auth + initial data load ─────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id).then(d => {
          dispatch({ type: 'LOAD_DATA', data: d })
          setAppLoading(false)
        })
      } else {
        setAppLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        loadUserData(session.user.id).then(d => {
          dispatch({ type: 'LOAD_DATA', data: d })
          setAppLoading(false)
        })
      } else {
        dispatch({ type: 'LOAD_DATA', data: empty })
        setAppLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Wrapped dispatch — updates local state then syncs to Supabase ────────

  const syncDispatch = useCallback(async (action: Action) => {
    dispatch(action)
    const userId = session?.user.id
    if (!userId) return

    switch (action.type) {
      case 'ADD_HABIT':
        await insertHabit(action.habit, userId)
        break
      case 'UPDATE_HABIT':
        await updateHabit(action.habit, userId)
        break
      case 'DELETE_HABIT':
        await deleteHabit(action.id, userId)
        break
      case 'UPDATE_STAT':
        await upsertStat(action.stat, userId)
        break
      case 'UPDATE_CHARACTER_NAME':
        await updateCharacterName(action.name, userId)
        break
    }
  }, [session])

  // ── Complete habit ───────────────────────────────────────────────────────

  const isCompletedToday = useCallback((habitId: string) => {
    const today = todayString()
    return data.log.some(l => l.habitId === habitId && l.date === today)
  }, [data.log])

  const completeHabit = useCallback((habitId: string) => {
    if (!devMode && isCompletedToday(habitId)) return

    const habit = data.habits.find(h => h.id === habitId)
    if (!habit) return

    const userId = session?.user.id
    const entry: LogEntry = {
      id: uuid(),
      habitId,
      date: todayString(),
      completedAt: new Date().toISOString(),
    }

    if (!devMode) {
      dispatch({ type: 'LOG_COMPLETION', entry })
      if (userId) insertLog(entry, userId)
    }

    const events: XpGainEvent[] = habit.linkedStatIds.map(statId => {
      const stat = data.stats.find(s => s.id === statId)!
      const previousXp = stat.xp
      const previousLevel = stat.level
      const newXp = previousXp + XP_PER_COMPLETION
      const newLevel = levelFromXp(newXp)
      const updatedStat = { ...stat, xp: newXp, level: newLevel }
      dispatch({ type: 'GAIN_XP', statId, amount: XP_PER_COMPLETION })
      if (userId) upsertStat(updatedStat, userId)
      return { statId, xpGained: XP_PER_COMPLETION, previousXp, previousLevel, newXp, newLevel, didLevelUp: newLevel > previousLevel }
    })

    setXpQueue(q => [...q, ...events])
  }, [data.habits, data.stats, session, devMode, isCompletedToday])

  const dequeueXp = useCallback(() => setXpQueue(q => q.slice(1)), [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <GameContext.Provider value={{ data, dispatch: syncDispatch, session, appLoading, xpQueue, dequeueXp, completeHabit, isCompletedToday, devMode, setDevMode, signOut }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
