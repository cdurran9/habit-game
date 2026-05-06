import { useEffect, useState } from 'react'
import Particles from '@tsparticles/react'
import { ensureParticlesEngine } from '../../lib/particlesEngine'

interface Props {
  active: boolean
}

export function RewardClaimBurst({ active }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureParticlesEngine(() => setReady(true))
  }, [])

  if (!ready || !active) return null

  return (
    <Particles
      id="reward-claim-burst"
      options={{
        fullScreen: { enable: true, zIndex: 9999 },
        particles: {
          number: { value: 0 },
          color: { value: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9f43', '#ffffff'] },
          shape: { type: ['circle', 'star', 'square'] },
          opacity: { value: { min: 0.7, max: 1 } },
          size: { value: { min: 5, max: 13 } },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 40 },
          },
          move: {
            enable: true,
            speed: { min: 8, max: 22 },
            direction: 'none',
            outModes: { default: 'destroy' },
            gravity: { enable: true, acceleration: 8 },
          },
          life: { duration: { value: 2 }, count: 1 },
        },
        emitters: [
          {
            direction: 'top',
            rate: { delay: 0, quantity: 150 },
            position: { x: 50, y: 65 },
            size: { width: 40, height: 0 },
            life: { count: 1, duration: 0.15 },
          },
        ],
      }}
    />
  )
}
