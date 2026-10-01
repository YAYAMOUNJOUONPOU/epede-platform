// src/components/common/EngineeringInfographicsGallerySection.tsx
import React, { useState } from 'react';
import { INFOGRAPHICS_LIST, EngineeringInfographic } from '../../data/engineeringInfographics';
import { EngineeringInfographicCard } from './EngineeringInfographicCard';
import { EngineeringInfographicsModal } from './EngineeringInfographicsModal';
import { Sparkles, Layers, Filter } from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  filterCategory?: 'OVERVIEW' | 'SUBSTATION' | 'TRANSMISSION' | 'PROTECTION' | 'SAFETY' | 'GENERATION' | 'DISTRIBUTION' | 'ALL';
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const EngineeringInfographicsGallerySection: React.FC<Props> = ({
  locale,
  filterCategory = 'ALL',
  title,
  subtitle,
  limit
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(filterCategory);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label_fr: `Toutes les Infographies (${INFOGRAPHICS_LIST.length})`, label_en: `All Infographics (${INFOGRAPHICS_LIST.length})` },
    { id: 'OVERVIEW', label_fr: 'Système Global', label_en: 'Power Systems' },
    { id: 'GENERATION', label_fr: 'Production & Centrales', label_en: 'Generation' },
    { id: 'TRANSMISSION', label_fr: 'Transport & Lignes', label_en: 'Transmission' },
    { id: 'SUBSTATION', label_fr: 'Postes Haute Tension', label_en: 'Substations' },
    { id: 'DISTRIBUTION', label_fr: 'Distribution MT/BT', label_en: 'Distribution' },
    { id: 'PROTECTION', label_fr: 'Protections Réseau', label_en: 'Protections' },
    { id: 'SAFETY', label_fr: 'Sécurité & Terre', label_en: 'Safety & Earthing' },
  ];

  const filteredItems = INFOGRAPHICS_LIST.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  }).slice(0, limit || INFOGRAPHICS_LIST.length);

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              {locale === 'fr' ? 'Bibliothèque Visuelle d\'Ingénierie' : 'Engineering Infographics Library'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title || (locale === 'fr' ? 'Schémas Techniques & Infographies Normalisées' : 'Standardized Technical Schematics & Infographics')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {subtitle || (locale === 'fr'
              ? 'Intégration vectorielle haute définition des 8 infographies clés du réseau électrique, couplées aux normes CEI, IEEE et au code de réseau national.'
              : 'Interactive high-definition vector integration of all 8 core power system infographics with IEC and IEEE standard references.')}
          </p>
        </div>

        {/* Filter Pills if filterCategory === 'ALL' */}
        {filterCategory === 'ALL' && (
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Infographics */}
      <div className="grid grid-cols-1 gap-8">
        {filteredItems.map((item) => (
          <EngineeringInfographicCard
            key={item.id}
            infographicId={item.id}
            locale={locale}
            onOpenModal={(id) => setModalInfographicId(id)}
          />
        ))}
      </div>

      {/* Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}
    </div>
  );
};
