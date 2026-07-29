const PALETTE = ['bg-plumbob/15 text-plumbob', 'bg-azure/15 text-azure']

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function pickColor(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function ProfileAvatar({ name, size = 'lg' }) {
  const sizeClasses = size === 'lg' ? 'h-24 w-24 text-3xl' : 'h-12 w-12 text-base'
  const colorClasses = pickColor(name || '?')

  return (
    <div className={`flex items-center justify-center rounded-full font-semibold shrink-0 ${sizeClasses} ${colorClasses}`}>
      {getInitials(name)}
    </div>
  )
}

export default ProfileAvatar