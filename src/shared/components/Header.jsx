import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import { getBetaTesters } from '../services/betaTesters'
import useAuth from '../hooks/useAuth'

function Header() {
  const navigate = useNavigate()
  const { user, email, isBetaTester, isLoggedIn, logout } = useAuth()
  const [betaCount, setBetaCount] = useState(null)

  const fetchCount = () => {
    getBetaTesters()
      .then((data) => setBetaCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setBetaCount(null))
  }

  useEffect(() => { fetchCount() }, [])

  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener('beta-tester-registered', handler)
    return () => window.removeEventListener('beta-tester-registered', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="w-full border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Logo />
        <nav className="flex items-center gap-4 md:gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors md:text-base ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
            }
          >
            Inicio
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink
                to="/registro"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors md:text-base ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
                }
              >
                Registro
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors md:text-base ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
                }
              >
                Login
              </NavLink>
            </>
          )}

          <NavLink
            to="/beta-tester"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors md:text-base ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
            }
          >
            Beta Tester
            {betaCount !== null && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {betaCount}
              </span>
            )}
          </NavLink>

          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
              <span className="text-sm font-medium text-slate-700">
                {user?.fullName || email}
              </span>
              {isBetaTester ? (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Beta Tester
                </span>
              ) : (
                <NavLink
                  to="/beta-tester"
                  className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  Ser Beta Tester
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
