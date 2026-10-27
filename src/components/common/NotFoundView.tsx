// src/components/common/NotFoundView.tsx
// EPEDE - High-Contrast Technical 404 View
// Displays technical diagnostic message, breadcrumb, and quick doors

import React from 'react';
import { AlertTriangle, Home, BookOpen, Calculator, Cpu, ArrowRight } from 'lucide-react';

interface NotFoundViewProps {
  locale: 'fr' | 'en';
  currentPath: string;
  onNavigateHome: () => void;
  onNavigateJourney: () => void;
  onNavigateCalculators: () => void;
  onNavigateEquipment: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  locale,
  currentPath,
  onNavigateHome,
  onNavigateJourney,
  onNavigateCalculators,
  onNavigateEquipment,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-black uppercase text-amber-400 tracking-widest px-3 py-1 rounded bg-amber-950/60 border border-amber-800/40 inline-block">
            {locale === 'fr' ? 'ANOMALIE ROUTAGE · NŒUD DÉSAFFECTÉ (404)' : 'ROUTING ERROR · OPEN CIRCUIT BUS (404)'}
          </span>
          <h1 className="text-3xl font-black text-white font-mono tracking-tight">
            {locale === 'fr' ? 'Circuit Introuvable ou Hors Tension' : 'Route Not Found or Node De-Energized'}
          </h1>
          <p className="text-xs font-mono text-slate-400 max-w-lg mx-auto">
            {locale === 'fr'
              ? `L'adresse demandée « ${currentPath || '/'} » ne correspond à aucun équipement, calculateur ou schéma actif de la topologie EPEDE.`
              : `The requested address "${currentPath || '/'}" does not match any active equipment, calculator, or schematic in the EPEDE network topology.`}
          </p>
        </div>

        {/* Suggested Core Doors */}
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-3 font-bold">
            {locale === 'fr' ? 'Rejoindre une travée principale :' : 'Reroute to a primary bay:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 hover:bg-slate-900 transition-all font-mono text-xs font-bold text-white flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateJourney}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-400 hover:bg-slate-900 transition-all font-mono text-xs font-bold text-white flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{locale === 'fr' ? 'Apprendre' : 'Learn'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateCalculators}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 hover:bg-slate-900 transition-all font-mono text-xs font-bold text-white flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Calculer' : 'Calculators'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateEquipment}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-400 hover:bg-slate-900 transition-all font-mono text-xs font-bold text-white flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>{locale === 'fr' ? 'Matériel' : 'Equipment'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
