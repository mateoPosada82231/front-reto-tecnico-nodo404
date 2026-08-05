import { X } from 'lucide-react'
import useContent from '../../../shared/hooks/useContent'

function CartItem({ item, onRemove, removing }) {
  const { content: cartContent } = useContent('cart')
  const itemId = item.id ?? item.cartItemId
  const ext = item.extension
  const name = ext?.name ?? item.name ?? item.extensionName ?? item.title
  const image = ext?.image ?? item.image ?? item.extensionImage ?? item.imageUrl
  const price = ext?.price ?? item.price ?? 0

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
        <p className="text-xs text-text-dim">
          {cartContent.platform_label}: {item.platform} · {cartContent.language_label}: {item.language}
        </p>
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
