// src/components/equipment/modules/EquipmentOperatingRegimeCard.tsx
import React, { useState } from 'react';
import { Activity } from 'lucide-react';

interface EquipmentOperatingRegimeCardProps {
  locale: 'fr' | 'en';
}

export const EquipmentOperatingRegimeCard: React.FC<EquipmentOperatingRegimeCardProps> = ({
  locale
}) => {
  const [operatingCondition, setOperatingCondition] = useState<'nominal' | 'fault'>('nominal');

  return (
    <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
      <div className="flex items-center justify-between border-b border-[#252E38] pb-3 mb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? 'RÉGIME DE FONCTIONNEMENT' : 'OPERATING REGIME'}</span>
        </div>
        <div className="flex rounded-lg border border-[#252E38] p-0.5 bg-[#080B10] font-mono text-xs">
          <button
            type="button"
            onClick={() => setOperatingCondition('nominal')}
            className={`px-2.5 py-1 rounded font-bold uppercase transition-all ${
              operatingCondition === 'nominal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? 'Nominal' : 'Nominal'}
          </button>
          <button
            type="button"
            onClick={() => setOperatingCondition('fault')}
            className={`px-2.5 py-1 rounded font-bold uppercase transition-all ${
              operatingCondition === 'fault'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? 'Court-Circuit' : 'Short-Circuit'}
          </button>
        </div>
      </div>

      <div className="text-xs font-mono space-y-2 text-neutral-300">
        {operatingCondition === 'nominal' ? (
          <div className="space-y-1.5">
            <div className="flex justify-between py-1 border-b border-[#252E38]/40">
              <span className="text-neutral-400">Courant permanent (In) :</span>
              <span className="font-bold text-emerald-400">100% assigné</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#252E38]/40">
              <span className="text-neutral-400">Température de fonctionnement :</span>
              <span className="font-bold text-white">65°C - 85°C (ONAN/ONAF)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Facteur de puissance cos(φ) :</span>
              <span className="font-bold text-cyan-400">0.92 Inductif</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex justify-between py-1 border-b border-[#252E38]/40">
              <span className="text-neutral-400">Courant de crête (Ip) :</span>
              <span className="font-bold text-red-400">102.5 kA (crête max)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#252E38]/40">
              <span className="text-neutral-400">Tenue thermique Ith (1s) :</span>
              <span className="font-bold text-amber-400">40.0 kA rms</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Temps d'élimination max requis :</span>
              <span className="font-bold text-red-400">&lt; 80 ms (Disjoncteur + Relais)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
