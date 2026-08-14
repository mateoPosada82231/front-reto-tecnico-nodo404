import React from 'react'
import Card from './Card'
import Skeleton from '../../../shared/components/Skeleton'
import ExtensionSearch from '../../../shared/components/ExtensionSearch'
import useExpansionGrid from '../hooks/useExpansionGrid'
import useExtensionSearch from '../../../shared/hooks/useExtensionSearch'
import useContent from '../../../shared/hooks/useContent'

export default function ExpansionGrid() {
  const { extensions, loading, error } = useExpansionGrid()
  const { content } = useContent('landing.grid')
  const { content: searchContent } = useContent('extensions.search')
  const { query, setQuery, results, isSearching } = useExtensionSearch(extensions)

  if (loading) {
    return (
      <section className="w-full max-w-[150rem] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 overflow-hidden">
              <Skeleton className="aspect-video rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-2.5 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full max-w-[150rem] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          {content.title}
        </h2>
        <p className="text-red-400 text-sm">{content.error_prefix}{error}</p>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[150rem] mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight mb-2">
          {content.title}
        </h2>
        <div className="h-1 w-16 rounded-full bg-plumbob/60" />

        <div className="mt-6 max-w-md">
          <ExtensionSearch value={query} onChange={setQuery} />
        </div>
      </div>

      {isSearching && results.length === 0 ? (
        <p className="text-sm text-text-sub">
          {(searchContent.empty_results || '').replace('{{query}}', query.trim())}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6 gap-6">
          {results.map((pack, index) => (
            <div key={pack.id} style={{ animationDelay: `${index * 60}ms` }} className="animate-slide-up">
              <Card
                image={pack.image || pack.imagen || ''}
                category={pack.category}
                title={pack.name}
                description={pack.description || pack.aboutGame || ''}
                price={pack.price ? pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : ''}
                ctaLabel={content.cta_text}
                href={`/expansion/${pack.id}`}
                isBeta={pack.isPublic === false}
                betaBadgeLabel={content.beta_badge_label}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
