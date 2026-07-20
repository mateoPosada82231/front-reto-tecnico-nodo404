import React from 'react';
import Card from '../../../shared/components/molecules/Card.jsx';
import { expansionPacks } from '../../../data/expansionPacks.js';

export default function ExpansionGrid() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
        Paquetes de Expansión
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {expansionPacks.map((pack) => (
          <Card
            key={pack.id}
            image={pack.image}
            category={pack.category}
            title={pack.name}
            description={pack.description}
            price={pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            ctaLabel="Ver más"
            href={pack.link}
          />
        ))}
      </div>
    </section>
  );
}
