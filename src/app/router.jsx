import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import LoginPage from '../features/auth/pages/LoginPage'
import BetaTesterPage from '../features/betatester/pages/BetaTesterPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/beta-tester" element={<BetaTesterPage />} />
    </Routes>
  )
}

export default AppRouter
