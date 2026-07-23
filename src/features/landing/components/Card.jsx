import Button from '../../../shared/components/Button'

function Card({ image, category, title, description, price, ctaLabel, onCtaClick, href }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <img src={image} alt={title} className="aspect-video w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {category}
          </span>
        )}
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-600">{description}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          {price && <span className="text-sm font-semibold text-slate-900">{price}</span>}
          {ctaLabel && (
            <Button variant="secondary" href={href} onClick={onCtaClick} target="_blank" rel="noopener noreferrer">
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Card
