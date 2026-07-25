import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'

const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const OAuthCallback = lazy(() => import('../features/auth/pages/OAuthCallback'))

function AppRouter() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
