export function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isDueToday(frequency: string): boolean {
  const day = new Date().getDay() // 0=Sun, 6=Sat
  if (frequency === 'daily') return true
  if (frequency === 'weekdays') return day >= 1 && day <= 5
  if (frequency === 'weekends') return day === 0 || day === 6
  if (frequency === 'weekly') return day === 1 // Mondays
  return true
}
