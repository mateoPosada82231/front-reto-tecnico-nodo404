import React from 'react'
import Card from './Card'
import useExpansionGrid from '../hooks/useExpansionGrid'

export default function ExpansionGrid() {
  const { extensions, loading, error } = useExpansionGrid()

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          Paquetes de Expansión
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border/30 overflow-hidden bg-surface">
              <div className="aspect-video bg-hover" />
              <div className="p-5 space-y-3">
                <div className="h-2.5 bg-hover rounded w-1/3" />
                <div className="h-4 bg-hover rounded w-3/4" />
                <div className="h-3 bg-hover rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          Paquetes de Expansión
        </h2>
        <p className="text-red-400 text-sm">Error al cargar extensiones: {error}</p>
      </section>
    )
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight mb-2">
          Paquetes de Expansión
        </h2>
        <div className="h-1 w-16 rounded-full bg-plumbob/60" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {extensions.map((pack, index) => (
          <div key={pack.id} style={{ animationDelay: `${index * 60}ms` }} className="animate-slide-up">
            <Card
              image={pack.image || pack.imagen || ''}
              category={pack.category}
              title={pack.name}
              description={pack.description || pack.aboutGame || ''}
              price={pack.price ? pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : ''}
              ctaLabel="Ver más"
              href={pack.link || '#'}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
