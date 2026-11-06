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
      <div className="max-w-2xl w-full p-8 sm:p-10 rounded-[6px] bg-[#FFFDF9] border border-[#D8D2C5] text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex p-3 rounded-[6px] bg-[#B8862D]/10 border border-[#B8862D]/30 text-[#B8862D]">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[11px] font-semibold uppercase text-[#B8862D] tracking-[0.14em] px-3 py-1 rounded-[4px] bg-[#B8862D]/10 border border-[#B8862D]/25 inline-block">
            {locale === 'fr' ? 'ANOMALIE ROUTAGE · NŒUD DÉSAFFECTÉ (404)' : 'ROUTING ERROR · OPEN CIRCUIT BUS (404)'}
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#17282C] tracking-tight">
            {locale === 'fr' ? 'Circuit Introuvable ou Hors Tension' : 'Route Not Found or Node De-Energized'}
          </h1>
          <p className="text-sm text-[#3E565B] max-w-lg mx-auto leading-relaxed">
            {locale === 'fr'
              ? `L'adresse demandée « ${currentPath || '/'} » ne correspond à aucun équipement, calculateur ou schéma actif de la topologie EPEDE.`
              : `The requested address "${currentPath || '/'}" does not match any active equipment, calculator, or schematic in the EPEDE network topology.`}
          </p>
        </div>

        {/* Suggested Core Doors */}
        <div className="pt-6 border-t border-[#E6E1D6]">
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#687A7E] block mb-4 font-semibold">
            {locale === 'fr' ? 'Rejoindre une travée principale :' : 'Reroute to a primary bay:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="p-3.5 rounded-[6px] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] hover:bg-[#FFFDF9] transition-colors font-mono text-xs font-semibold text-[#17282C] flex flex-col items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#0F6A6B]" />
              <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateJourney}
              className="p-3.5 rounded-[6px] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] hover:bg-[#FFFDF9] transition-colors font-mono text-xs font-semibold text-[#17282C] flex flex-col items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#0F6A6B]" />
              <span>{locale === 'fr' ? 'Chaîne Électrique' : 'Power Chain'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateCalculators}
              className="p-3.5 rounded-[6px] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] hover:bg-[#FFFDF9] transition-colors font-mono text-xs font-semibold text-[#17282C] flex flex-col items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#B8862D]" />
              <span>{locale === 'fr' ? 'Calculer' : 'Calculators'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateEquipment}
              className="p-3.5 rounded-[6px] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] hover:bg-[#FFFDF9] transition-colors font-mono text-xs font-semibold text-[#17282C] flex flex-col items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#0F6A6B]" />
              <span>{locale === 'fr' ? 'Matériel' : 'Equipment'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
