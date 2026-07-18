import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import LoginPage from '../features/auth/pages/LoginPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default AppRouter