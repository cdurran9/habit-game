import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider, useGame } from './context/GameContext'
import { Layout } from './components/layout/Layout'
import { AuthPage } from './components/auth/AuthPage'
import { TrackingPage } from './pages/TrackingPage'
import { ManagementPage } from './pages/ManagementPage'
import { SettingsPage } from './pages/SettingsPage'
import { RewardsPage } from './pages/RewardsPage'

function AppRoutes() {
  const { session, appLoading } = useGame()

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) return <AuthPage />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/track" replace />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/habits" element={<ManagementPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  )
}
