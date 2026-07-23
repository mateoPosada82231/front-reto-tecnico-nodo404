function SocialIcons({ items = [], className = '' }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {items.map(({ href, icon: Icon, label }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-text-dim transition-all duration-200 hover:text-plumbob hover:scale-110"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
