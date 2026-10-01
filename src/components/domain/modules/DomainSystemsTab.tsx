// src/components/domain/modules/DomainSystemsTab.tsx
import React from 'react';
import { SafetyBadge } from '../../equipment/SafetyBadge';
import type { Equipment } from '../../../types/epede';

interface DomainSystemsTabProps {
  systems_fr: string;
  systems_en: string;
  domainEquipments: Equipment[];
  locale: 'fr' | 'en';
  onSelectEquipment: (id: string) => void;
}

export const DomainSystemsTab: React.FC<DomainSystemsTabProps> = ({
  systems_fr,
  systems_en,
  domainEquipments,
  locale,
  onSelectEquipment
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono">
        {locale === 'fr' ? '2. Sous-systèmes Principaux & Architecture' : '2. Key Subsystems & Architecture'}
      </h4>
      <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-[#080B10] p-5 rounded-xl border border-[#252E38] font-mono">
        {locale === 'fr' ? systems_fr : systems_en}
      </div>

      {domainEquipments.length > 0 && (
        <div>
          <h5 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
            {locale === 'fr' ? 'Équipements répertoriés dans ce domaine :' : 'Documented equipment in this domain:'}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domainEquipments.map((eq) => (
              <div
                key={eq.id}
                onClick={() => onSelectEquipment(eq.id)}
                className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <SafetyBadge
                    is_safety_critical={eq.is_safety_critical}
                    hazard_level={eq.hazard_level}
                    locale={locale}
                    size="sm"
                  />
                  <h6 className="font-bold uppercase tracking-tight text-sm text-white mt-2 font-mono">
                    {locale === 'fr' ? eq.name_fr : eq.name_en}
                  </h6>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 font-medium">
                    {locale === 'fr' ? eq.description_fr : eq.description_en}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 mt-3">
                  {locale === 'fr' ? 'Consulter la fiche technique →' : 'View technical spec sheet →'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
