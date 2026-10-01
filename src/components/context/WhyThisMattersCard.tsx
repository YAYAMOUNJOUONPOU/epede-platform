// src/components/context/WhyThisMattersCard.tsx
// EPEDE Phase 4 - Why This Matters in Engineering Panel
// Explains the electrotechnical significance of any equipment or system beyond basic definitions.

import React from 'react';
import {
  Lightbulb,
  Zap,
  Activity,
  ShieldCheck,
  Flame,
  Wrench,
  DollarSign,
  Leaf,
  Layers,
  ChevronRight
} from 'lucide-react';
import { resolveCanonicalEquipment } from '../../data/equipment/canonicalEquipmentRegistry';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface WhyThisMattersCardProps {
  equipmentId?: string;
  domainCode?: string;
  locale?: 'fr' | 'en';
  customHeadlineFr?: string;
  customHeadlineEn?: string;
  customImpactPoints?: Array<{
    area: 'fault_current' | 'voltage_regulation' | 'protection_coordination' | 'earthing' | 'reliability' | 'maintenance' | 'safety' | 'cost';
    labelFr: string;
    labelEn: string;
    consequenceFr: string;
    consequenceEn: string;
  }>;
}

export const WhyThisMattersCard: React.FC<WhyThisMattersCardProps> = ({
  equipmentId = 'eq-trafo-hta-01',
  domainCode = 'D04',
  locale = 'fr',
  customHeadlineFr,
  customHeadlineEn,
  customImpactPoints
}) => {
  const isFr = locale === 'fr';
  const equipment = resolveCanonicalEquipment(equipmentId);

  // Default impact points tailored to equipment family or domain
  const defaultImpacts: Array<{
    area: 'fault_current' | 'voltage_regulation' | 'protection_coordination' | 'earthing' | 'reliability' | 'maintenance' | 'safety' | 'cost';
    labelFr: string;
    labelEn: string;
    consequenceFr: string;
    consequenceEn: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      area: 'fault_current',
      labelFr: 'Courants de Court-Circuit & Tenue Électrodynamique',
      labelEn: 'Fault Currents & Electrodynamic Withstand',
      consequenceFr: 'L\'impédance (%Uk) détermine directement l\'amplitude du courant de court-circuit Ik\" (CEI 60909) et les contraintes de dimensionnement des disjoncteurs aval.',
      consequenceEn: 'The impedance (%Uk) directly governs the short-circuit level Ik\" (IEC 60909) and the sizing constraints of all downstream switchgear.',
      icon: Zap,
      color: 'text-amber-400 bg-amber-950/40 border-amber-900/50'
    },
    {
      area: 'voltage_regulation',
      labelFr: 'Stabilité de la Tension & Régulation en Charge',
      labelEn: 'Voltage Stability & On-Load Regulation',
      consequenceFr: 'La plage du régleur en charge (OLTC ±10%) et le facteur de puissance compensent les chutes de tension en ligne pour maintenir les départs clients à Un ±5%.',
      consequenceEn: 'On-load tap changer range (OLTC ±10%) and reactive power flow regulate feeder voltages within statutory Un ±5% tolerances.',
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50'
    },
    {
      area: 'protection_coordination',
      labelFr: 'Coordination & Sélectivité des Protections',
      labelEn: 'Protection Coordination & Discrimination',
      consequenceFr: 'Le couplage des enroulements (Dyn11) bloque les harmoniques de rang 3 et isole les défauts homopolaires entre réseaux HTB et HTA.',
      consequenceEn: 'Vector group (Dyn11) traps 3rd harmonic zero-sequence currents and isolates earth faults between HV and MV networks.',
      icon: ShieldCheck,
      color: 'text-rose-400 bg-rose-950/40 border-rose-900/50'
    },
    {
      area: 'reliability',
      labelFr: 'Disponibilité & Continuité de Service Réseau',
      labelEn: 'Network Reliability & Supply Continuity',
      consequenceFr: 'Le mode de refroidissement (ONAN/ONAF) et la surveillance des gaz dissous (DGA) évitent les déclenchements d\'urgence non programmés.',
      consequenceEn: 'Cooling stage redundancy (ONAN/ONAF) and dissolved gas monitoring (DGA) prevent catastrophic unforced outages.',
      icon: Flame,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50'
    }
  ];

  const impacts = customImpactPoints || defaultImpacts;

  return (
    <div className="rounded-2xl border border-sky-900/40 bg-[#090E17] overflow-hidden shadow-xl font-sans text-slate-200">
      
      {/* Top Banner */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#0E1624] via-[#101B2B] to-[#0A121E] border-b border-sky-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60">
                {isFr ? 'PERSPECTIVE D\'INGÉNIERIE APPLIQUÉE' : 'APPLIED ENGINEERING PERSPECTIVE'}
              </span>
              <EvidenceTrustBadge level="ENGINEERING_REFERENCE" locale={locale} size="xs" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              {isFr ? 'Pourquoi cet Équipement est Stratégique pour le Réseau' : 'Why This Equipment Matters in Power Engineering'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {customHeadlineFr
                ? (isFr ? customHeadlineFr : customHeadlineEn)
                : equipment?.purpose
                ? (isFr ? equipment.purpose.fr : equipment.purpose.en)
                : (isFr
                  ? 'Au-delà de sa fonction élémentaire, son dimensionnement régit la sécurité globale, la sélectivité, l\'écoulement des puissances et la résilience du poste.'
                  : 'Beyond basic definitions, its electrotechnical sizing governs short-circuit levels, protection discrimination, voltage regulation, and grid resilience.')}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Multi-Disciplinary Engineering Impact Pillars */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {impacts.map((imp, idx) => {
          const Icon = imp.area === 'fault_current' ? Zap :
                       imp.area === 'voltage_regulation' ? Activity :
                       imp.area === 'protection_coordination' ? ShieldCheck :
                       imp.area === 'reliability' ? Flame :
                       imp.area === 'maintenance' ? Wrench :
                       imp.area === 'safety' ? ShieldCheck :
                       imp.area === 'cost' ? DollarSign : Layers;

          return (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-[#0E1522] border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-900/50">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs font-bold text-white font-mono">
                    {isFr ? imp.labelFr : imp.labelEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr ? imp.consequenceFr : imp.consequenceEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{isFr ? 'Impact Système :' : 'System Impact :'}</span>
                <span className="font-bold text-sky-400 uppercase">
                  {imp.area.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
