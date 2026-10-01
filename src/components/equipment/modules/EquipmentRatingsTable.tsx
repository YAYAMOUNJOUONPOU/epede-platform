// src/components/equipment/modules/EquipmentRatingsTable.tsx
import React from 'react';
import { Sliders } from 'lucide-react';

interface EquipmentRatingsTableProps {
  technical: Record<string, string | number | boolean>;
  locale: 'fr' | 'en';
}

export const EquipmentRatingsTable: React.FC<EquipmentRatingsTableProps> = ({
  technical,
  locale
}) => {
  return (
    <div className="rounded-xl border border-[#252E38] bg-[#0D1117] overflow-hidden">
      <div className="border-b border-[#252E38] px-5 py-3.5 bg-[#080B10] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
            {locale === 'fr' ? 'SPÉCIFICATIONS CONSTRUCTEUR & PARAMÈTRES ASSIGNÉS' : 'NAMEPLATE RATINGS & PARAMETERS'}
          </h3>
        </div>
        <span className="font-mono text-[11px] text-cyan-400 font-bold bg-[#0D1117] px-2 py-0.5 rounded border border-[#252E38]">
          CEI 60076 / 62271
        </span>
      </div>

      <div className="divide-y divide-[#252E38]/60 text-xs">
        {Object.entries(technical).map(([key, val]) => (
          <div key={key} className="px-5 py-2.5 flex items-center justify-between gap-4 hover:bg-[#080B10]/50 transition-colors">
            <span className="text-neutral-400 font-medium">{key}</span>
            <span className="font-mono font-bold text-white text-right text-xs sm:text-sm select-all">
              {String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
