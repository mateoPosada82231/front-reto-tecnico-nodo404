import { Trash2, Package } from 'lucide-react'
import useContent from '../../../shared/hooks/useContent'
import useCartStore from '../../../shared/stores/useCartStore'
import useAuthStore from '../../../shared/stores/useAuthStore'
import { parsePlatforms, parseLanguages } from '../../../shared/utils/extensionOptions'

function CartItem({ item, onRemove, removing, isHighlighted }) {
  const { content: cartContent } = useContent('cart')
  const updateItemOptions = useCartStore((state) => state.updateItemOptions)
  const purchasedItems = useAuthStore((state) => state.purchasedItems) || []

  const itemId = item.id ?? item.cartItemId
  const ext = item.extension
  const extensionId = ext?.id ?? item.extensionId ?? item.id
  const name = ext?.name ?? item.name ?? item.extensionName ?? item.title ?? 'Expansión Sims 4'
  const image = ext?.image ?? item.image ?? item.extensionImage ?? item.imageUrl
  const price = ext?.price ?? item.price ?? 0
  const category = ext?.category ?? item.category
  const platformsStr = ext?.platforms ?? item.platforms
  const languagesStr = ext?.languages ?? item.languages

  // Extract platforms owned for this specific extension
  const ownedPlatforms = purchasedItems
    .filter((pi) => Number(pi.extensionId) === Number(extensionId))
    .map((pi) => pi.platform)

  const platformOptions = parsePlatforms(platformsStr, ownedPlatforms)
  const languageOptions = parseLanguages(languagesStr)

  const handlePlatformChange = (e) => {
    updateItemOptions({ cartItemId: itemId, platform: e.target.value })
  }

  const handleLanguageChange = (e) => {
    updateItemOptions({ cartItemId: itemId, language: e.target.value })
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-border/40 transition-colors ${
        isHighlighted
          ? 'bg-plumbob/10 border-l-4 border-l-plumbob'
          : 'hover:bg-surface/50'
      }`}
    >
      {/* Expansion Image Thumbnail */}
      <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-surface flex items-center justify-center shadow-xs">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-6 w-6 text-azure" />
        )}
      </div>

      {/* Item Details & Dynamic Selectors */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className={`text-sm font-semibold truncate ${
              isHighlighted ? 'text-plumbob font-bold' : 'text-text-main'
            }`}
          >
            {name}
          </h4>
          {category && (
            <span className="px-1.5 py-0.5 rounded-md bg-surface text-[10px] font-medium text-text-sub shrink-0">
              {category}
            </span>
          )}
        </div>

        {/* Dynamic Selectors in Cart Line: Responsive flex-wrap container with truncated selects */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-xs text-text-dim">
          <div className="flex items-center gap-1 min-w-0 shrink-0">
            <span className="text-[11px] text-text-sub shrink-0">{cartContent.platform_label || 'Plataforma'}:</span>
            <select
              value={item.platform || platformOptions[0]?.value || 'PC'}
              onChange={handlePlatformChange}
              className="bg-bg border border-border/80 rounded-md px-1.5 py-0.5 text-xs text-text-main focus:outline-none focus:border-plumbob cursor-pointer max-w-[85px] sm:max-w-[110px] truncate"
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled && item.platform !== opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-text-sub shrink-0">{cartContent.language_label || 'Idioma'}:</span>
            <select
              value={item.language || languageOptions[0]?.value || 'ES'}
              onChange={handleLanguageChange}
              className="bg-bg border border-border/80 rounded-md px-1.5 py-0.5 text-xs text-text-main focus:outline-none focus:border-plumbob cursor-pointer max-w-[85px] sm:max-w-[110px] truncate"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Column */}
      <div className="text-right shrink-0 px-2">
        <span className="text-sm font-bold text-plumbob">
          ${Number(price).toLocaleString('es-CO')}
        </span>
      </div>

      {/* Circular Remove Button */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => onRemove(itemId)}
          disabled={removing}
          aria-label={cartContent.remove_aria}
          title={cartContent.remove_aria || 'Eliminar del carrito'}
          className="h-8 w-8 rounded-full bg-surface border border-border hover:border-red-500/50 hover:bg-red-500/10 text-text-dim hover:text-red-400 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default CartItem
