// src/components/home/WhatIsEpedeSection.tsx
import React, { useState } from 'react';
import { 
  Compass, 
  GitMerge, 
  ShieldCheck, 
  Layers, 
  Network, 
  ArrowRight,
  Cpu,
  Sliders,
  Radio,
  FileCheck,
  UserCheck,
  RotateCcw,
  Boxes,
  Maximize2
} from 'lucide-react';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

interface WhatIsEpedeSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: any) => void;
  onSelectDomain?: (code: any) => void;
}

const ENTRY_POINTS = [
  { fr: 'Source d\'Énergie', en: 'Energy Source', icon: '💧', view: 'journey' },
  { fr: 'Technologie', en: 'Technology', icon: '⚙️', view: 'hydropower' },
  { fr: 'Centrale', en: 'Plant', icon: '🏭', view: 'hydropower' },
  { fr: 'Système', en: 'System', icon: '🌐', view: 'cameroon-grid' },
  { fr: 'Équipement', en: 'Equipment', icon: '⚡', view: 'equipment' },
  { fr: 'Fonction', en: 'Function', icon: '🔧', view: 'context-stack' },
  { fr: 'Protection', en: 'Protection', icon: '🛡️', view: 'diagrams' },
  { fr: 'Contrôle-Commande', en: 'Control', icon: '🎛️', view: 'diagrams' },
  { fr: 'Communication', en: 'Communication', icon: '📡', view: 'diagrams' },
  { fr: 'Norme CEI/IEEE', en: 'Standard', icon: '📜', view: 'standards' },
  { fr: 'Rôle d\'Ingénieur', en: 'Engineering Role', icon: '👷', view: 'roles' },
  { fr: 'Cycle de Vie', en: 'Lifecycle', icon: '🔄', view: 'lifecycle' },
  { fr: 'Application', en: 'Application', icon: '💡', view: 'regulatory' },
];

export const WhatIsEpedeSection: React.FC<WhatIsEpedeSectionProps> = ({
  locale,
  onNavigateView,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDiagramId, setModalDiagramId] = useState('power_systems_engineering');

  const handleOpenModal = (id: string) => {
    setModalDiagramId(id);
    setIsModalOpen(true);
  };

  return (
    <section 
      id="what-is-epede" 
      aria-label="What is Electrical Power Engineering Digital Environment"
      className="relative rounded-3xl bg-gradient-to-b from-[#060B18]/95 via-[#040813]/95 to-[#02050D]/95 border border-white/[0.08] p-6 sm:p-10 space-y-9 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Specular top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* Top Header */}
      <div className="max-w-4xl space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-pulse" />
          <h2 className="font-tech font-bold text-xs uppercase tracking-widest text-amber-400/90">
            {locale === 'fr' 
              ? 'ENVIRONNEMENT NUMÉRIQUE CONNECTÉ · EPEDE ARCHITECTURE' 
              : 'CONNECTED DIGITAL ENVIRONMENT · EPEDE ARCHITECTURE'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
          {locale === 'fr' 
            ? 'Un modèle d\'ingénierie connecté, pas une encyclopédie statique.'
            : 'A connected engineering model, not a disconnected article collection.'}
        </h3>
        <p className="text-sm text-slate-300/90 max-w-3xl leading-relaxed">
          {locale === 'fr'
            ? 'EPEDE structure l\'intégralité des flux d\'énergie, des appareillages de coupure et des normes réglementaires en un système interactif rigoureux.'
            : 'EPEDE models energy flows, switching apparatus, and regulatory standards into an interconnected engineering architecture.'}
        </p>
      </div>

      {/* FOUNDATIONAL INFOGRAPHIC 1: What is Power Systems Engineering */}
      <div className="w-full">
        <EngineeringInfographicCard
          infographicId="power_systems_engineering"
          locale={locale}
          onOpenModal={handleOpenModal}
        />
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Explore */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#091122]/90 to-[#050A14]/90 border border-white/[0.08] shadow-lg space-y-3 hover:border-amber-500/50 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)] transition-all group overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-bold text-white font-display tracking-tight">
            {locale === 'fr' ? '1. Explorer' : '1. Explore'}
          </h4>
          <p className="text-sm text-slate-400/90 leading-relaxed font-sans">
            {locale === 'fr'
              ? 'Naviguez de la source d\'énergie primaire (eau, soleil, vent) jusqu\'au consommateur final à travers tous les paliers de tension (225 kV, 30 kV, 400 V).'
              : 'Navigate from primary energy sources down to the final consumer across all voltage levels (225 kV, 30 kV, 400 V).'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors group/btn"
            >
              <span>{locale === 'fr' ? 'Parcours d\'énergie' : 'Energy Journey'}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Pillar 2: Connect */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#091122]/90 to-[#050A14]/90 border border-white/[0.08] shadow-lg space-y-3 hover:border-sky-500/50 hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.15)] transition-all group overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner group-hover:scale-110 transition-transform">
            <GitMerge className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-bold text-white font-display tracking-tight">
            {locale === 'fr' ? '2. Connecter' : '2. Connect'}
          </h4>
          <p className="text-sm text-slate-400/90 leading-relaxed font-sans">
            {locale === 'fr'
              ? 'Visualisez les relations multidimensionnelles entre systèmes, appareillages, fonctions, contraintes physiques et disciplines d\'ingénierie.'
              : 'Trace multidimensional relationships between systems, equipment, functions, physical constraints and engineering disciplines.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateView('context-stack')}
              className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors group/btn"
            >
              <span>{locale === 'fr' ? 'Graphe de relations' : 'Relationship Stack'}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Pillar 3: Understand */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#091122]/90 to-[#050A14]/90 border border-white/[0.08] shadow-lg space-y-3 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)] transition-all group overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-bold text-white font-display tracking-tight">
            {locale === 'fr' ? '3. Comprendre' : '3. Understand'}
          </h4>
          <p className="text-sm text-slate-400/90 leading-relaxed font-sans">
            {locale === 'fr'
              ? 'Maîtrisez comment la protection (87T, 50/51), le contrôle-commande (CEI 61850), la sécurité (consignation), les normes et le cycle de vie interagissent.'
              : 'Understand how protection, automation, earthing safety, standards compliance, and asset lifecycle interact in practice.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateView('diagrams')}
              className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group/btn"
            >
              <span>{locale === 'fr' ? 'Poste unifilaire' : 'SLD Workbench'}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

      </div>

      {/* Central Differentiator Statement Box */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#080E1C]/90 via-[#060B18]/90 to-[#080E1C]/90 border border-white/[0.08] border-l-4 border-l-amber-400 shadow-xl space-y-3 overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wider block">
            {locale === 'fr' ? 'DIFFÉRENCIATEUR ARCHITECTURAL MAJEUR' : 'CORE ARCHITECTURAL DIFFERENTIATOR'}
          </span>
        </div>
        <blockquote className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed italic">
          {locale === 'fr' ? (
            <>
              « <strong>Electrical Power Engineering Digital Environment</strong> n'est pas une collection d'articles d'ingénierie déconnectés. C'est une représentation numérique connectée de l'écosystème de l'énergie électrique. Elle aide l'utilisateur à comprendre non seulement quel équipement existe, mais aussi où il se situe, à quoi il est relié, comment il est protégé, comment il est commandé, ce qui peut tomber en panne, et quelles disciplines d'ingénierie sont impliquées. »
            </>
          ) : (
            <>
              “<strong>Electrical Power Engineering Digital Environment</strong> is not a collection of disconnected engineering articles. It is a connected digital representation of the electrical-energy ecosystem. It helps users understand not only what equipment exists, but also where it belongs, what it connects to, how it is protected, how it is controlled, what can fail, and which engineering disciplines are involved.”
            </>
          )}
        </blockquote>
      </div>

      {/* Progressive Multi-Angle Entry Points Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-tech text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {locale === 'fr' 
              ? 'POINTS D\'ENTRÉE MULTIPLES DANS LE SYSTÈME' 
              : 'MULTIPLE SYSTEM ENTRY POINTS'}
          </span>
          <span className="font-mono text-xs text-amber-400/90 font-bold">13 Perspectives Normalisées</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-xs">
          {ENTRY_POINTS.map((pt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onNavigateView(pt.view)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-amber-400/40 text-left transition-all flex flex-col justify-between group active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-base group-hover:scale-110 transition-transform">{pt.icon}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-bold font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <span className="font-sans font-bold text-xs text-slate-200 group-hover:text-white leading-tight">
                {locale === 'fr' ? pt.fr : pt.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal View for Infographics */}
      <EngineeringInfographicsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialInfographicId={modalDiagramId}
        locale={locale}
      />
    </section>
  );
};
