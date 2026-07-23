import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-text-main md:text-xl group"
    >
      <img
        src="/sims-icon.png"
        alt=""
        className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <span>
        Los Sims <span className="text-plumbob">4</span>
      </span>
    </Link>
  )
}

export default Logo
