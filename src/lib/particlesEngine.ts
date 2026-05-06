import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

let initialized = false
let initializing = false
const pending: Array<() => void> = []

export function ensureParticlesEngine(onReady: () => void): void {
  if (initialized) { onReady(); return }
  pending.push(onReady)
  if (initializing) return
  initializing = true
  initParticlesEngine(async engine => {
    await loadSlim(engine)
  }).then(() => {
    initialized = true
    pending.forEach(cb => cb())
    pending.length = 0
  })
}
