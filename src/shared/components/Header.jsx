import { NavLink } from 'react-router-dom'
import { LogOut, Beaker, Menu, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import useHeader from '../hooks/useHeader'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 md:text-base ${
    isActive ? 'text-plumbob' : 'text-text-sub hover:text-text-main'
  }`

const mobileLinkClass = ({ isActive }) =>
  `block text-sm font-medium py-2 ${isActive ? 'text-plumbob' : 'text-text-sub'}`

function Header() {
  const {
    user,
    email,
    isBetaTester,
    isLoggedIn,
    betaCount,
    mobileOpen,
    showBetaButton,
    theme,
    toggleTheme,
    handleLogout,
    toggleMobile,
    closeMobile,
  } = useHeader()

  return (
    <header className="w-full glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink to="/registro" className={navLinkClass}>
                Registro
              </NavLink>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            </>
          )}

          {showBetaButton && (
            <NavLink
              to="/beta-tester"
              className="relative inline-flex items-center gap-1.5 rounded-full bg-plumbob/10 border border-plumbob/30 px-3.5 py-1.5 text-xs font-semibold text-plumbob transition-all duration-300 hover:bg-plumbob/20 hover:border-plumbob/50 hover:shadow-lg hover:shadow-plumbob/20 beta-glow"
            >
              <Beaker className="w-3.5 h-3.5" />
              Ser Beta Tester
              {betaCount !== null && betaCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-plumbob text-white px-1.5 py-0.5 text-[0.625rem] font-bold leading-none">
                  {betaCount}
                </span>
              )}
            </NavLink>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
              <span className="text-sm font-medium text-text-sub truncate max-w-[8.75rem]">
                {user?.fullName || email}
              </span>
              {isBetaTester && (
                <span className="inline-flex items-center gap-1 rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
                  <Beaker className="w-3 h-3" />
                  Beta
                </span>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            onClick={toggleMobile}
            className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-surface/50 transition-colors cursor-pointer"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="hidden md:flex items-center">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-3 animate-slide-down">
          <NavLink to="/" end onClick={closeMobile} className={mobileLinkClass}>
            Inicio
          </NavLink>

          {!isLoggedIn && (
            <>
              <NavLink to="/registro" onClick={closeMobile} className={mobileLinkClass}>
                Registro
              </NavLink>
              <NavLink to="/login" onClick={closeMobile} className={mobileLinkClass}>
                Login
              </NavLink>
            </>
          )}

          {showBetaButton && (
            <NavLink
              to="/beta-tester"
              onClick={closeMobile}
              className="flex items-center gap-2 text-sm font-medium text-plumbob py-2"
            >
              <Beaker className="w-4 h-4" />
              Ser Beta Tester
            </NavLink>
          )}

          {isLoggedIn && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-sm text-text-sub mb-3">{user?.fullName || email}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
