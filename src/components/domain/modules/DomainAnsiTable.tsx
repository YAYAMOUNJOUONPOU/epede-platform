// src/components/domain/modules/DomainAnsiTable.tsx
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ANSI_CODES } from '../../../data/epedeData';

interface DomainAnsiTableProps {
  locale: 'fr' | 'en';
}

export const DomainAnsiTable: React.FC<DomainAnsiTableProps> = ({ locale }) => {
  return (
    <section className="rounded-2xl border border-red-200 dark:border-red-500/40 bg-white dark:bg-[#160D12] overflow-hidden shadow-sm dark:shadow-2xl">
      <div className="bg-red-50 dark:bg-[#240F16] border-b border-red-200 dark:border-red-500/30 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>{locale === 'fr' ? 'MATRICE DES CODES ANSI DE PROTECTION' : 'ANSI PROTECTION CODES MATRIX'}</span>
              <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-red-200 dark:border-red-500/40 font-bold">
                CEI 60255 / IEEE C37.2
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 font-mono mt-0.5">
              {locale === 'fr'
                ? 'Fonctions de protection de déclenchement rapide et sélectivité chronométrique'
                : 'Rapid trip protection functions and time-graded selectivity'}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 dark:bg-[#080B10] text-slate-700 dark:text-neutral-400 border-b border-slate-200 dark:border-[#252E38] uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-cyan-700 dark:text-cyan-400 font-bold w-16">CODE</th>
              <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">{locale === 'fr' ? 'DÉSIGNATION' : 'NAME'}</th>
              <th className="px-4 py-3 text-slate-700 dark:text-neutral-300">{locale === 'fr' ? 'APPAREILS COUVERTS' : 'TARGET EQUIPMENT'}</th>
              <th className="px-4 py-3 text-cyan-700 dark:text-cyan-400 font-bold">{locale === 'fr' ? 'TEMPS' : 'TIME'}</th>
              <th className="px-4 py-3 font-medium text-slate-700 dark:text-neutral-400">{locale === 'fr' ? 'PORTÉE & IMPORTANCE CRITIQUE' : 'SIGNIFICANCE'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#252E38]/50">
            {ANSI_CODES.map((ansi) => (
              <tr key={ansi.code} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-400 text-sm">{ansi.code}</td>
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                  {locale === 'fr' ? ansi.name_fr : ansi.name_en}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-neutral-300">{ansi.target_equipment}</td>
                <td className="px-4 py-3 text-cyan-600 dark:text-cyan-400 font-bold">{ansi.operating_time}</td>
                <td className="px-4 py-3 text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {ansi.significance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
