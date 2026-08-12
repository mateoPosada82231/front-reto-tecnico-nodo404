import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../features/landing/pages/LandingPage'
import ExpansionDetailPage from '../features/landing/pages/ExpansionDetailPage'
import lang from '../shared/lang'

const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const OAuthCallback = lazy(() => import('../features/auth/pages/OAuthCallback'))
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'))
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage'))

const FALLBACK_TEXT = {
  es: 'Cargando…',
  en: 'Loading…',
}

function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          {FALLBACK_TEXT[lang.get()] || FALLBACK_TEXT.es}
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/expansion/:id" element={<ExpansionDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
