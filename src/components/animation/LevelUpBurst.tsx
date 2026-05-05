import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

interface Props {
  color: string
  active: boolean
}

let engineInitialized = false

export function LevelUpBurst({ color, active }: Props) {
  const [ready, setReady] = useState(engineInitialized)

  useEffect(() => {
    if (engineInitialized) { setReady(true); return }
    initParticlesEngine(async engine => {
      await loadSlim(engine)
    }).then(() => {
      engineInitialized = true
      setReady(true)
    })
  }, [])

  if (!ready || !active) return null

  return (
    <Particles
      id="level-up-burst"
      options={{
        fullScreen: { enable: true, zIndex: 9999 },
        particles: {
          number: { value: 0 },
          color: { value: [color, '#ffffff', '#fbbf24'] },
          shape: { type: ['circle', 'star'] },
          opacity: { value: { min: 0.6, max: 1 } },
          size: { value: { min: 4, max: 10 } },
          move: {
            enable: true,
            speed: { min: 8, max: 20 },
            direction: 'none',
            outModes: { default: 'destroy' },
            gravity: { enable: true, acceleration: 9.8 },
          },
          life: { duration: { value: 1.5 }, count: 1 },
        },
        emitters: [
          {
            direction: 'top',
            rate: { delay: 0, quantity: 80 },
            position: { x: 50, y: 60 },
            size: { width: 20, height: 0 },
            life: { count: 1, duration: 0.1 },
          },
        ],
      }}
    />
  )
}
