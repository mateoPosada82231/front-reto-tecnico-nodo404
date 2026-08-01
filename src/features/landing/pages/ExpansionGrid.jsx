import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../../shared/components/molecules/Card.jsx';
import { expansionPacks } from '../../../data/expansionPacks.js';

export default function ExpansionGrid() {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
        {t('grid.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {expansionPacks.map((pack) => (
          <Card
            key={pack.id}
            image={pack.image}
            category={t(`packs.${pack.id}.category`, pack.category)}
            title={t(`packs.${pack.id}.name`, pack.name)}
            description={t(`packs.${pack.id}.description`, pack.description)}
            price={pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            ctaLabel={t('grid.seeMore')}
            href={pack.link}
          />
        ))}
      </div>
    </section>
  );
}
