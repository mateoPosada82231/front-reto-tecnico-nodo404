import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'
import ExpansionDetailPage from '../features/landing/pages/ExpansionDetailPage'

const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const OAuthCallback = lazy(() => import('../features/auth/pages/OAuthCallback'))
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'))

function AppRouter() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando…</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/expansion/:id" element={<ExpansionDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
