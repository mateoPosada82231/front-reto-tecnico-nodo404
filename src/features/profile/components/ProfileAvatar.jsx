import { User } from 'lucide-react'
import useAuthStore from '../../../shared/stores/useAuthStore'

function ProfileAvatar({ name, size = 'lg', avatarUrl: overrideAvatarUrl, onClick, className = '' }) {
  const storeAvatarUrl = useAuthStore((state) => state.avatarUrl)
  const activeAvatarUrl = overrideAvatarUrl ?? storeAvatarUrl

  const sizeClasses =
    size === 'xl'
      ? 'h-24 w-24 text-3xl'
      : size === 'lg'
      ? 'h-16 w-16 text-xl'
      : size === 'sm'
      ? 'h-9 w-9 text-sm'
      : 'h-12 w-12 text-base'

  const iconSizes =
    size === 'xl'
      ? 'h-12 w-12'
      : size === 'lg'
      ? 'h-8 w-8'
      : size === 'sm'
      ? 'h-4 w-4'
      : 'h-6 w-6'

  if (activeAvatarUrl) {
    return (
      <div
        onClick={onClick}
        className={`relative rounded-full overflow-hidden shrink-0 border-2 border-emerald-400/90 shadow-md ${
          onClick ? 'cursor-pointer hover:ring-4 hover:ring-emerald-400/40 transition-all' : ''
        } ${sizeClasses} ${className}`}
      >
        <img
          src={activeAvatarUrl}
          alt={name || 'Avatar'}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  // When no photo is uploaded: simple clean avatar placeholder without text or extra shapes
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center rounded-full shrink-0 border border-border/80 bg-surface/50 text-text-dim shadow-xs ${
        onClick ? 'cursor-pointer hover:bg-surface hover:text-text-main transition-all' : ''
      } ${sizeClasses} ${className}`}
    >
      <User className={iconSizes} />
    </div>
  )
}

export default ProfileAvatar