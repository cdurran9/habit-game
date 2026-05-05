import { Outlet } from 'react-router-dom'
import { LayoutGroup, motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { useGame } from '../../context/GameContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { AnimationOrchestrator } from '../animation/AnimationOrchestrator'

export function Layout() {
  const { shakeVersion } = useGame()
  const shakeControls = useAnimation()

  useEffect(() => {
    if (shakeVersion === 0) return
    shakeControls.start({
      x: [0, -12, 12, -9, 9, -5, 5, -2, 2, 0],
      y: [0,   6,  -6,  5, -5,  3, -3,  0],
      rotate: [0, -1, 1, -0.75, 0.75, 0],
      transition: { duration: 0.55, ease: 'easeOut' },
    })
  }, [shakeVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LayoutGroup>
      <motion.div animate={shakeControls} className="flex flex-col min-h-screen bg-[#1a1a2e]">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <TopBar />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </motion.div>

      <AnimationOrchestrator />
    </LayoutGroup>
  )
}
