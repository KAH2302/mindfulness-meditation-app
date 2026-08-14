import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { MeditationPage } from './pages/MeditationPage'
import { MusicPage } from './pages/MusicPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/meditation" element={<MeditationPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
