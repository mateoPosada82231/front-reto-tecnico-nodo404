import Button from '../../../shared/components/Button'

function Card({ image, category, title, description, price, ctaLabel, onCtaClick, href }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:shadow-2xl hover:shadow-plumbob/5 hover:border-plumbob/30 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {category && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-plumbob">
            {category}
          </span>
        )}
        <h3 className="text-base font-bold text-text-main leading-snug">{title}</h3>
        {description && (
          <p className="text-sm text-text-dim leading-relaxed line-clamp-2">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
          {price && (
            <span className="text-sm font-bold text-plumbob">{price}</span>
          )}
          {ctaLabel && (
            <Button variant="ghost" href={href} onClick={onCtaClick} target="_blank" rel="noopener noreferrer" className="text-xs">
              {ctaLabel} &rarr;
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Card
