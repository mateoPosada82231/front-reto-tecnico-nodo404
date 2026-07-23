import React from 'react';
import Card from './Card';
import useExpansionGrid from '../hooks/useExpansionGrid';

export default function ExpansionGrid() {
  const { extensions, loading, error } = useExpansionGrid();

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
          Paquetes de Expansión
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-slate-200 overflow-hidden">
              <div className="aspect-video bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
          Paquetes de Expansión
        </h2>
        <p className="text-red-500 text-sm">Error al cargar extensiones: {error}</p>
      </section>
    );
  }
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
        Paquetes de Expansión
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {extensions.map((pack) => (
          <Card
            key={pack.id}
            image={pack.image || pack.imagen || ''}
            category={pack.category}
            title={pack.name}
            description={pack.description || pack.aboutGame || ''}
            price={pack.price ? pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : ''}
            ctaLabel="Ver más"
            href={pack.link || '#'}
          />
        ))}
      </div>
    </section>
  );
}
