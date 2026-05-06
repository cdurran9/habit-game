import type { AppData } from '../types'
import { DEFAULT_STATS } from '../constants/defaults'

const STORAGE_KEY = 'habit-game-data'
const CURRENT_VERSION = 1

function defaultData(): AppData {
  return {
    version: CURRENT_VERSION,
    stats: DEFAULT_STATS,
    habits: [],
    log: [],
    characterName: 'Adventurer',
    rewards: [],
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.version) return defaultData()
    return parsed
  } catch {
    return defaultData()
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // quota exceeded — silently ignore
  }
}
