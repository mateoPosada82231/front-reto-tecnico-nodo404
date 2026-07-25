import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'

const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const BetaTesterPage = lazy(() => import('../features/betatester/pages/BetaTesterPage'))
const OAuthCallback = lazy(() => import('../features/auth/pages/OAuthCallback'))

function AppRouter() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/beta-tester" element={<BetaTesterPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
