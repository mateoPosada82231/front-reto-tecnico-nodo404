import { NavLink } from 'react-router-dom'
import Logo from '../atoms/Logo'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/registro', label: 'Registro' },
  { to: '/login', label: 'Login' },
]

function Header() {
  return (
    <header className="w-full border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Logo />
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
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header