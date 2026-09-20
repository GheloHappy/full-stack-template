import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home.page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
