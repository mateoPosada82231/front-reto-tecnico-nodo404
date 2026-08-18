import Button from '../../../shared/components/Button'
import { Beaker, CheckCircle } from 'lucide-react'

function Card({
  image,
  category,
  title,
  description,
  price,
  ctaLabel,
  onCtaClick,
  href,
  isBeta,
  betaBadgeLabel,
  ownedPlatforms = [],
  isInCart = false,
  inLibraryBadgeLabel,
  buyAnotherPlatformLabel,
  viewInCartLabel,
  onAddToCart,
}) {
  const hasOwnedPlatforms = ownedPlatforms && ownedPlatforms.length > 0

  let activeCtaLabel = ctaLabel
  if (isInCart) {
    activeCtaLabel = viewInCartLabel
  } else if (hasOwnedPlatforms) {
    activeCtaLabel = buyAnotherPlatformLabel
  }

  const handleActionClick = (e) => {
    if (isInCart) {
      if (onCtaClick) onCtaClick(e)
    } else if (hasOwnedPlatforms && onAddToCart) {
      e.preventDefault()
      onAddToCart()
    } else if (onCtaClick) {
      onCtaClick(e)
    }
  }

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
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {category && (
            <span className="text-[0.6875rem] font-semibold uppercase tracking-widest text-plumbob">
              {category}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-1.5 ml-auto">
            {hasOwnedPlatforms && inLibraryBadgeLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-azure/15 border border-azure/30 px-2.5 py-0.5 text-xs font-semibold text-azure">
                <CheckCircle className="w-3 h-3" />
                {inLibraryBadgeLabel}
              </span>
            )}
            {isBeta && (
              <span className="inline-flex items-center gap-1 rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
                <Beaker className="w-3 h-3" />
                {betaBadgeLabel}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-text-main leading-snug">{title}</h3>
        {description && (
          <p className="text-sm text-text-dim leading-relaxed line-clamp-2">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30 gap-2">
          {price && (
            <span className="text-sm font-bold text-plumbob">{price}</span>
          )}
          {activeCtaLabel && (
            <Button
              variant={isInCart || hasOwnedPlatforms ? 'secondary' : 'ghost'}
              href={!hasOwnedPlatforms || isInCart ? href : undefined}
              onClick={handleActionClick}
              className="text-xs shrink-0"
            >
              {activeCtaLabel} &rarr;
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Card
