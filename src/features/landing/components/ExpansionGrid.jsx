import { useState, useMemo } from 'react'
import Card from './Card'
import Skeleton from '../../../shared/components/Skeleton'
import ExtensionSearch from '../../../shared/components/ExtensionSearch'
import useExpansionGrid from '../hooks/useExpansionGrid'
import useExtensionSearch from '../../../shared/hooks/useExtensionSearch'
import useContent from '../../../shared/hooks/useContent'
import useOwnedPlatforms from '../../../shared/hooks/useOwnedPlatforms'

export default function ExpansionGrid() {
  const { extensions, loading, error } = useExpansionGrid()
  const { content } = useContent('landing.grid')
  const { content: detailContent } = useContent('landing.detail')
  const { content: searchContent } = useContent('extensions.search')
  const { query, setQuery, results } = useExtensionSearch(extensions)

  const { ownedMap } = useOwnedPlatforms()

  const [showPurchased, setShowPurchased] = useState(true)
  const [showNotPurchased, setShowNotPurchased] = useState(true)

  const togglePurchased = () => {
    if (showPurchased && !showNotPurchased) {
      setShowPurchased(false)
      setShowNotPurchased(true)
    } else {
      setShowPurchased(!showPurchased)
    }
  }

  const toggleNotPurchased = () => {
    if (showNotPurchased && !showPurchased) {
      setShowNotPurchased(false)
      setShowPurchased(true)
    } else {
      setShowNotPurchased(!showNotPurchased)
    }
  }

  const filteredResults = useMemo(() => {
    if (showPurchased && showNotPurchased) return results
    return results.filter((pack) => {
      const ownedPlatforms = ownedMap[pack.id] || []
      const isOwned = ownedPlatforms.length > 0
      if (showPurchased && isOwned) return true
      if (showNotPurchased && !isOwned) return true
      return false
    })
  }, [results, showPurchased, showNotPurchased, ownedMap])

  if (loading) {
    return (
      <section className="w-full max-w-[150rem] 3xl:max-w-[200rem] 4k:max-w-[250rem] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl font-extrabold text-text-main mb-10 tracking-tight">
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
      <section className="w-full max-w-[150rem] 3xl:max-w-[200rem] 4k:max-w-[250rem] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl font-extrabold text-text-main mb-10 tracking-tight">
          {content.title}
        </h2>
        <p className="text-red-400 text-sm">{content.error_prefix}{error}</p>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[150rem] 3xl:max-w-[200rem] 4k:max-w-[250rem] mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl font-extrabold text-text-main tracking-tight mb-2">
          {content.title}
        </h2>
        <div className="h-1 w-16 rounded-full bg-plumbob/60" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="max-w-md flex-1">
            <ExtensionSearch value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePurchased}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 cursor-pointer ${
                showPurchased
                  ? 'bg-azure/20 border-azure/40 text-azure shadow-sm shadow-azure/10'
                  : 'bg-transparent border-border/40 text-text-dim hover:border-border/60 hover:text-text-sub'
              }`}
            >
              {content.filter_purchased}
            </button>
            <button
              type="button"
              onClick={toggleNotPurchased}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 cursor-pointer ${
                showNotPurchased
                  ? 'bg-plumbob/20 border-plumbob/40 text-plumbob shadow-sm shadow-plumbob/10'
                  : 'bg-transparent border-border/40 text-text-dim hover:border-border/60 hover:text-text-sub'
            }`}
          >
            {content.filter_not_purchased}
          </button>
          </div>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-border/40 rounded-2xl bg-surface/50 p-8">
          <p className="text-sm text-text-dim max-w-sm">
            {query.trim()
              ? (searchContent.empty_results || '').replace('{{query}}', query.trim())
              : content.filter_empty}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6 gap-6">
          {filteredResults.map((pack, index) => {
            const ownedPlatforms = ownedMap[pack.id] || []

            const inLibraryText =
              ownedPlatforms.length > 0
                ? detailContent.in_library_badge || 'En biblioteca'
                : null

            return (
              <div
                key={pack.id}
                style={{ animationDelay: `${index * 60}ms` }}
                className="animate-slide-up"
              >
                <Card
                  image={pack.image || pack.imagen || ''}
                  category={pack.category}
                  title={pack.name}
                  description={pack.description || pack.aboutGame || ''}
                  price={
                    pack.price
                      ? pack.price.toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                        })
                      : ''
                  }
                  ctaLabel={content.cta_text}
                  href={`/expansion/${pack.id}`}
                  isBeta={pack.isPublic === false}
                  betaBadgeLabel={content.beta_badge_label}
                  ownedPlatforms={ownedPlatforms}
                  inLibraryBadgeLabel={inLibraryText}
                />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
