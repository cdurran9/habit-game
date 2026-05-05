export function xpToReachLevel(level: number): number {
  return level * (level - 1) * 50
}

export function levelFromXp(xp: number): number {
  let level = 1
  while (xpToReachLevel(level + 1) <= xp) level++
  return level
}

export function xpProgressInCurrentLevel(xp: number) {
  const level = levelFromXp(xp)
  const floorXp = xpToReachLevel(level)
  const ceilingXp = xpToReachLevel(level + 1)
  return {
    current: xp - floorXp,
    required: ceilingXp - floorXp,
    fraction: (xp - floorXp) / (ceilingXp - floorXp),
  }
}
