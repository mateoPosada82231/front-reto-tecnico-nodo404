import { ShoppingBag, ArrowRight, Check } from 'lucide-react'
import Button from '../../../shared/components/Button'
import useContent from '../../../shared/hooks/useContent'

function Card({ image, category, title, description, price, ctaLabel, href, onAddToCart, adding, purchasedPlatforms = [], isInCart }) {
  const { content: detailContent } = useContent('landing.detail')
  const { content: cartContent } = useContent('cart')

  const isPurchased = Array.isArray(purchasedPlatforms) && purchasedPlatforms.length > 0
  const platformLabel = isPurchased ? purchasedPlatforms.join(', ') : ''

  const buyAnotherText = (detailContent.buy_another_platform || 'Comprar otra plataforma').toUpperCase()
  const addToCartText = (detailContent.add_to_cart_confirm || 'Añadir al carrito').toUpperCase()
  const viewInCartText = (detailContent.view_in_cart || 'Ver en carrito').toUpperCase()

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:shadow-2xl hover:shadow-plumbob/5 hover:border-plumbob/30 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {isPurchased && (
          <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            <span>{(detailContent.in_library_badge || 'En biblioteca ({{platforms}})').replace('{{platforms}}', platformLabel)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {category && (
          <span className="text-[0.6875rem] font-semibold uppercase tracking-widest text-plumbob">
            {category}
          </span>
        )}
        <h3 className="text-base font-bold text-text-main leading-snug">{title}</h3>
        {description && (
          <p className="text-sm text-text-dim leading-relaxed line-clamp-2">{description}</p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-3 border-t border-border/30">
          <div className="flex items-center justify-between">
            {price && (
              <span className="text-base font-extrabold text-plumbob">{price}</span>
            )}
            <Button
              variant="ghost"
              href={href}
              className="text-xs text-text-sub hover:text-text-main p-0 hover:bg-transparent"
            >
              <span>{ctaLabel || 'Ver detalles'}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 inline-block" />
            </Button>
          </div>

          {/* Action Button: Fully Internationalized & Platform Aware */}
          {isInCart ? (
            <Button
              variant="secondary"
              onClick={onAddToCart}
              className="w-full text-xs py-2 font-bold flex items-center justify-center gap-1.5 border-plumbob/40 text-plumbob uppercase"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{viewInCartText}</span>
            </Button>
          ) : onAddToCart ? (
            <Button
              variant="primary"
              onClick={onAddToCart}
              loading={adding}
              className="w-full text-xs py-2 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{isPurchased ? buyAnotherText : addToCartText}</span>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default Card
