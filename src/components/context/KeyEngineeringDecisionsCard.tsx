// src/components/context/KeyEngineeringDecisionsCard.tsx
// EPEDE Phase 4 - Key Engineering Decisions Checklist
// Highlights critical electrotechnical design decisions that project engineers must arbitrate.

import React from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface EngineeringDecision {
  number: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  options: Array<{
    name: string;
    tradeoffFr: string;
    tradeoffEn: string;
  }>;
  governingStandard: string;
}

interface KeyEngineeringDecisionsCardProps {
  equipmentId?: string;
  domainCode?: string;
  locale?: 'fr' | 'en';
  customDecisions?: EngineeringDecision[];
}

export const KeyEngineeringDecisionsCard: React.FC<KeyEngineeringDecisionsCardProps> = ({
  equipmentId = 'eq-trafo-hta-01',
  domainCode = 'D04',
  locale = 'fr',
  customDecisions
}) => {
  const isFr = locale === 'fr';

  const defaultDecisions: EngineeringDecision[] = [
    {
      number: '01',
      titleFr: 'Rapport de Transformation & Régime de Réglage (OLTC vs NLTC)',
      titleEn: 'Voltage Ratio & Tap-Changer Strategy (OLTC vs NLTC)',
      descriptionFr: 'Choix entre un régleur en charge motorisé (OLTC) sous télécommande SCADA ou un commutateur hors tension manuel (NLTC).',
      descriptionEn: 'Selection between automated on-load tap changer (OLTC) with SCADA regulation vs. off-circuit manual tap changer.',
      options: [
        { name: 'OLTC ±10% (17 plots)', tradeoffFr: 'Régulation dynamique continue de tension, mais coût élevé et maintenance d\'huile du commutateur requise.', tradeoffEn: 'Dynamic continuous voltage regulation, higher CAPEX and diverter switch oil maintenance.' },
        { name: 'NLTC ±2×2.5%', tradeoffFr: 'Économique et sans entretien, mais nécessite la coupure complète de l\'alimentation pour changer de plot.', tradeoffEn: 'Cost-effective, zero maintenance, but requires complete substation outage to change taps.' }
      ],
      governingStandard: 'CEI 60214-1 / CEI 60076-1'
    },
    {
      number: '02',
      titleFr: 'Impédance de Court-Circuit (%Uk) & Pouvoir de Coupure',
      titleEn: 'Short-Circuit Impedance (%Uk) & Breaking Capacity',
      descriptionFr: 'Arbitrage électrotechnique entre limitation des courants de court-circuit aval et maintien de la chute de tension interne.',
      descriptionEn: 'Electrotechnical trade-off between limiting downstream short-circuit levels vs. minimizing internal voltage drop.',
      options: [
        { name: 'Uk standard = 11.5% à 12.5%', tradeoffFr: 'Limite le courant de court-circuit Ik\" à 8-10 In, protégeant les jeux de barres 30 kV sans surdimensionnement.', tradeoffEn: 'Limits fault current Ik\" to 8-10 In, protecting 30 kV busbars without excessive breaker ratings.' },
        { name: 'Uk réduite = 8% à 9%', tradeoffFr: 'Excellente tenue de tension lors des démarrages moteurs, mais courant de court-circuit très élevé (> 31.5 kA).', tradeoffEn: 'Minimal voltage drop during heavy motor starts, but results in severe fault levels (> 31.5 kA).' }
      ],
      governingStandard: 'CEI 60076-5 / CEI 60909'
    },
    {
      number: '03',
      titleFr: 'Régime de Neutre (SLT) & Limitation du Défaut à la Terre',
      titleEn: 'Neutral Earthing Scheme & Earth-Fault Limitation',
      descriptionFr: 'Détermination du mode de mise à la terre du point neutre HTA (Solid, NGR, Petersen ou Isolé).',
      descriptionEn: 'Selection of MV neutral grounding regime (Solidly Grounded, NGR, Resonant Petersen, or Isolated).',
      options: [
        { name: 'Résistance Limitrice (NGR 40 A - 1000 A)', tradeoffFr: 'Protège les tôles magnétiques des moteurs/transformateurs et limite la tension de toucher IEEE 80.', tradeoffEn: 'Protects motor/transformer core laminations and controls IEEE 80 touch potentials.' },
        { name: 'Neutre Compensé (Bobine Petersen)', tradeoffFr: 'Extinction automatique des défauts fugitifs, continuité de service, mais réglage d\'accord critique.', tradeoffEn: 'Self-extinction of transient faults, high service continuity, but requires automatic resonance tuning.' }
      ],
      governingStandard: 'IEEE Std 80 / CEI 60364-5-54'
    },
    {
      number: '04',
      titleFr: 'Technologie d\'Isolement & Appareillage (AIS vs GIS)',
      titleEn: 'Insulation Technology & Switchgear Scheme (AIS vs GIS)',
      descriptionFr: 'Choix de la technologie de poste selon l\'emprise foncière, le niveau de pollution saline/industrielle et le coût.',
      descriptionEn: 'Substation technology selection based on footprint, marine/industrial pollution class, and CAPEX/OPEX.',
      options: [
        { name: 'Poste Ouvert Aérien (AIS)', tradeoffFr: 'Coût initial minimal, maintenance visuelle aisée, mais emprise au sol 5× à 10× plus grande et sensibilité à la foudre.', tradeoffEn: 'Lowest initial CAPEX, straightforward visual maintenance, but 5-10x larger footprint and weather exposure.' },
        { name: 'Poste Blindé au SF6 (GIS)', tradeoffFr: 'Emprise compacte idéale en zone urbaine, insensibilité totale à la pollution, mais coût élevé et gaz à effet de serre.', tradeoffEn: 'Ultra-compact urban footprint, zero environmental degradation, but higher initial cost and SF6 handling protocols.' }
      ],
      governingStandard: 'CEI 62271-200 / CEI 62271-203'
    }
  ];

  const decisions = customDecisions || defaultDecisions;

  return (
    <div className="rounded-2xl border border-indigo-900/40 bg-[#090D15] overflow-hidden shadow-xl font-sans text-slate-200">
      
      {/* Top Banner */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#0E1524] via-[#111B2C] to-[#0A111E] border-b border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                {isFr ? 'ARBITRAGES & DÉCISIONS D\'INGÉNIERIE' : 'ENGINEERING DECISIONS & TRADE-OFFS'}
              </span>
              <EvidenceTrustBadge level="APPLICATION_DEPENDENT" locale={locale} size="xs" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              {isFr ? 'Décisions Clés que l\'Ingénieur Doit Trancher' : 'Key Engineering Decisions to Establish'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isFr
                ? 'Ces arbitrages ne sont jamais automatiques : ils nécessitent une note de calcul contractuelle, l\'accord du gestionnaire de réseau et une analyse technico-économique.'
                : 'These design decisions require formal calculation notes, grid code compliance verification, and techno-economic validation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Decisions List Grid */}
      <div className="p-5 space-y-4">
        {decisions.map((dec) => (
          <div 
            key={dec.number} 
            className="p-4 rounded-xl bg-[#0E1522] border border-slate-800 hover:border-indigo-800/60 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {dec.number}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white font-mono">
                  {isFr ? dec.titleFr : dec.titleEn}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{dec.governingStandard}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr ? dec.descriptionFr : dec.descriptionEn}
            </p>

            {/* Options & Trade-offs comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {dec.options.map((opt, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0A0F17] border border-slate-800/80 space-y-1 text-xs">
                  <div className="font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500">Option {i === 0 ? 'A' : 'B'} :</span>
                    <span>{opt.name}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isFr ? opt.tradeoffFr : opt.tradeoffEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
