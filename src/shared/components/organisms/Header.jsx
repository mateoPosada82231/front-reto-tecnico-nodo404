import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../atoms/Logo'
import LanguageToggle from '../layout/LanguageToggle'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/registro', key: 'nav.register' },
  { to: '/login', key: 'nav.login' },
]

function Header() {
  const { t } = useTranslation()

  return (
    <header className="w-full border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Logo />
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="flex items-center gap-4 md:gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors md:text-base ${
                    isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}

export default Header