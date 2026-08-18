import { X } from 'lucide-react'
import useContent from '../../../shared/hooks/useContent'
import { parsePlatforms, parseLanguages } from '../../../shared/utils/extensionOptions'

function CartItem({ item, onRemove, removing, onUpdateItem }) {
  const { content: cartContent } = useContent('cart')
  const { content: detailContent } = useContent('landing.detail')
  const itemId = item.id ?? item.cartItemId
  const ext = item.extension
  const name = ext?.name ?? item.name ?? item.extensionName ?? item.title
  const image = ext?.image ?? item.image ?? item.extensionImage ?? item.imageUrl
  const price = ext?.price ?? item.price ?? 0

  const availablePlatformsStr = ext?.platforms || item.platformOptions || item.platform || 'PC, PS5, Xbox'
  const availableLanguagesStr = ext?.languages || item.languageOptions || item.language || 'ES, EN'

  const platformOptions = parsePlatforms(
    availablePlatformsStr,
    item.ownedPlatforms || [],
    detailContent.already_owned_option || '(Ya adquirida)'
  )
  const languageOptions = parseLanguages(availableLanguagesStr)

  return (
    <div className="flex gap-3 py-4 border-b border-border/50 last:border-b-0">
      {image && (
        <img
          src={image}
          alt={name}
          className="h-16 w-24 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-main truncate">{name}</h4>
        
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-text-dim">
          <div className="flex items-center gap-1">
            <span>{cartContent.platform_label}:</span>
            {platformOptions.length > 1 ? (
              <select
                value={item.platform || ''}
                onChange={(e) => onUpdateItem?.(itemId, { platform: e.target.value })}
                className="max-w-[85px] sm:max-w-[110px] truncate bg-surface border border-border/50 rounded px-1 py-0.5 text-text-main focus:outline-none focus:border-plumbob cursor-pointer"
              >
                {platformOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="max-w-[85px] sm:max-w-[110px] truncate font-medium text-text-main">
                {item.platform}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span>{cartContent.language_label}:</span>
            {languageOptions.length > 1 ? (
              <select
                value={item.language || ''}
                onChange={(e) => onUpdateItem?.(itemId, { language: e.target.value })}
                className="max-w-[85px] sm:max-w-[110px] truncate bg-surface border border-border/50 rounded px-1 py-0.5 text-text-main focus:outline-none focus:border-plumbob cursor-pointer"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="max-w-[85px] sm:max-w-[110px] truncate font-medium text-text-main">
                {item.language}
              </span>
            )}
          </div>
        </div>

        <span className="text-sm font-bold text-plumbob mt-1">
          ${Number(price).toLocaleString('es-CO')}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(itemId)}
        disabled={removing}
        aria-label={cartContent.remove_aria}
        className="self-start p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default CartItem
