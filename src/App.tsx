import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { Layout } from './components/layout/Layout'
import { TrackingPage } from './pages/TrackingPage'
import { ManagementPage } from './pages/ManagementPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/track" replace />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/habits" element={<ManagementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}
