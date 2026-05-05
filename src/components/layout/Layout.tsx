import { Outlet } from 'react-router-dom'
import { LayoutGroup } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { AnimationOrchestrator } from '../animation/AnimationOrchestrator'

export function Layout() {
  return (
    <LayoutGroup>
      <div className="flex min-h-screen bg-[#1a1a2e]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <AnimationOrchestrator />
      </div>
    </LayoutGroup>
  )
}
