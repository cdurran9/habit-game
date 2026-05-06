import { supabase } from './supabase'
import type { Stat, Habit, LogEntry, AppData, Reward, RewardPrerequisite } from '../types'
import { DEFAULT_STATS } from '../constants/defaults'

// ── Row shapes (snake_case as stored in Postgres) ──────────────────────────

interface StatRow {
  id: string; user_id: string; name: string; abbreviation: string
  color: string; icon: string; xp: number; level: number; order: number
}

interface HabitRow {
  id: string; user_id: string; name: string; description: string
  frequency: string; linked_stat_ids: string[]; color: string; icon: string
  created_at: string; archived_at: string | null
}

interface LogRow {
  id: string; user_id: string; habit_id: string; date: string; completed_at: string
}

interface ProfileRow {
  user_id: string; character_name: string
}

interface RewardRow {
  id: string; user_id: string; name: string; description: string
  prerequisites: RewardPrerequisite[]; claimed_at: string | null; created_at: string
}

// ── Converters ─────────────────────────────────────────────────────────────

const toStat   = (r: StatRow): Stat => ({ id: r.id, name: r.name, abbreviation: r.abbreviation, color: r.color, icon: r.icon, xp: r.xp, level: r.level, order: r.order })
const toHabit  = (r: HabitRow): Habit => ({ id: r.id, name: r.name, description: r.description, frequency: r.frequency as Habit['frequency'], linkedStatIds: r.linked_stat_ids, color: r.color, icon: r.icon, createdAt: r.created_at, archivedAt: r.archived_at ?? undefined })
const toLog    = (r: LogRow): LogEntry => ({ id: r.id, habitId: r.habit_id, date: r.date, completedAt: r.completed_at })

const toReward  = (r: RewardRow): Reward => ({ id: r.id, name: r.name, description: r.description, prerequisites: r.prerequisites, claimedAt: r.claimed_at ?? undefined, createdAt: r.created_at })
const fromReward = (r: Reward, userId: string): RewardRow => ({ id: r.id, user_id: userId, name: r.name, description: r.description, prerequisites: r.prerequisites, claimed_at: r.claimedAt ?? null, created_at: r.createdAt })

const fromStat  = (s: Stat, userId: string): Omit<StatRow, never> => ({ id: s.id, user_id: userId, name: s.name, abbreviation: s.abbreviation, color: s.color, icon: s.icon, xp: s.xp, level: s.level, order: s.order })
const fromHabit = (h: Habit, userId: string): Omit<HabitRow, never> => ({ id: h.id, user_id: userId, name: h.name, description: h.description, frequency: h.frequency, linked_stat_ids: h.linkedStatIds, color: h.color, icon: h.icon, created_at: h.createdAt, archived_at: h.archivedAt ?? null })
const fromLog   = (l: LogEntry, userId: string): Omit<LogRow, never> => ({ id: l.id, user_id: userId, habit_id: l.habitId, date: l.date, completed_at: l.completedAt })

// ── Load all user data ─────────────────────────────────────────────────────

export async function loadUserData(userId: string): Promise<AppData> {
  const [statsRes, habitsRes, logRes, profileRes, rewardsRes] = await Promise.all([
    supabase.from('stats').select('*').eq('user_id', userId).order('order'),
    supabase.from('habits').select('*').eq('user_id', userId),
    supabase.from('log_entries').select('*').eq('user_id', userId),
    supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('rewards').select('*').eq('user_id', userId),
  ])

  // New user — seed default stats and profile
  if (!statsRes.data?.length) {
    const defaultRows = DEFAULT_STATS.map(s => fromStat(s, userId))
    await supabase.from('stats').insert(defaultRows)
    await supabase.from('profiles').insert({ user_id: userId, character_name: 'Adventurer' })
  }

  const resolvedStats = statsRes.data?.length ? (statsRes.data as StatRow[]).map(toStat) : DEFAULT_STATS.map(s => ({ ...s }))

  return {
    version: 1,
    stats: resolvedStats,
    habits: ((habitsRes.data ?? []) as HabitRow[]).map(toHabit),
    log:    ((logRes.data    ?? []) as LogRow[]).map(toLog),
    characterName: (profileRes.data as ProfileRow | null)?.character_name ?? 'Adventurer',
    rewards: ((rewardsRes.data ?? []) as RewardRow[]).map(toReward),
  }
}

// ── Targeted writes ────────────────────────────────────────────────────────

export async function upsertStat(stat: Stat, userId: string) {
  await supabase.from('stats').upsert(fromStat(stat, userId))
}

export async function insertHabit(habit: Habit, userId: string) {
  await supabase.from('habits').insert(fromHabit(habit, userId))
}

export async function updateHabit(habit: Habit, userId: string) {
  await supabase.from('habits').update(fromHabit(habit, userId)).eq('id', habit.id).eq('user_id', userId)
}

export async function deleteHabit(id: string, userId: string) {
  await Promise.all([
    supabase.from('habits').delete().eq('id', id).eq('user_id', userId),
    supabase.from('log_entries').delete().eq('habit_id', id).eq('user_id', userId),
  ])
}

export async function insertLog(entry: LogEntry, userId: string) {
  await supabase.from('log_entries').insert(fromLog(entry, userId))
}

export async function updateCharacterName(name: string, userId: string) {
  await supabase.from('profiles').upsert({ user_id: userId, character_name: name })
}

export async function upsertReward(reward: Reward, userId: string) {
  await supabase.from('rewards').upsert(fromReward(reward, userId))
}

export async function deleteReward(id: string, userId: string) {
  await supabase.from('rewards').delete().eq('id', id).eq('user_id', userId)
}
