// src/components/equipment/modules/AssumptionsLimitationsCard.tsx
// EPEDE - Assumptions & Limitations Engineering Panel (Priority 3)
// States explicit design boundaries, valid operating envelopes, derating factors, and extrapolation limits

import React from 'react';
import {
  Compass,
  AlertTriangle,
  Thermometer,
  Mountain,
  Zap,
  Globe,
  CheckCircle2,
  FileText,
  Info
} from 'lucide-react';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';

export interface AssumptionsLimitationsProps {
  equipmentId?: string;
  domainCode?: string;
  locale: 'fr' | 'en';
}

interface BoundaryCondition {
  parameter_fr: string;
  parameter_en: string;
  standardValue: string;
  cameroonFieldCondition: string;
  deratingFormulaOrImpact: string;
  standardRef: string;
}

export const AssumptionsLimitationsCard: React.FC<AssumptionsLimitationsProps> = ({
  equipmentId = '',
  domainCode = 'D04',
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';

  const boundaryConditions: BoundaryCondition[] = [
    {
      parameter_fr: 'Température Ambiante Maximale',
      parameter_en: 'Maximum Ambient Temperature',
      standardValue: '40 °C (Moyenne 30 °C sur 24h)',
      cameroonFieldCondition: '45 °C en saison sèche (Grand Nord / Garoua)',
      deratingFormulaOrImpact: 'Déclassement puissance : -1.2% par °C au-delà de 40 °C (CEI 60076-1)',
      standardRef: 'IEC 60076-1 Cl. 5.1 / IEC 60034-1'
    },
    {
      parameter_fr: 'Altitude d\'Exploitation & Rigidité Diélectrique',
      parameter_en: 'Operating Altitude & Dielectric Withstand',
      standardValue: '≤ 1000 m au-dessus du niveau de la mer',
      cameroonFieldCondition: 'Plateau Bamiléké & Ouest : 1200 - 1500 m',
      deratingFormulaOrImpact: 'Facteur correctif d\'isolation ka = e^(m·(H-1000)/8150) (CEI 60071-2)',
      standardRef: 'IEC 60071-2 Cl. 4.2 / IEC 62271-1'
    },
    {
      parameter_fr: 'Rapport R/X & Facteur de Crête de Court-Circuit',
      parameter_en: 'R/X Ratio & Short-Circuit Peak Factor',
      standardValue: 'R/X = 0.05 à 0.10 (Hypothèse réseau infini)',
      cameroonFieldCondition: 'Réseau interconnecté RIS étendu : R/X jusqu\'à 0.18',
      deratingFormulaOrImpact: 'Facteur κ = 1.02 + 0.98·e^(-3·R/X) pour calcul ipk (CEI 60909)',
      standardRef: 'IEC 60909-0 Cl. 4.3'
    },
    {
      parameter_fr: 'Résistivité du Sol & Prise de Terre',
      parameter_en: 'Soil Resistivity & Substation Earthing',
      standardValue: '100 Ω·m (Sol limoneux tempéré standard)',
      cameroonFieldCondition: 'Socle granitique / latérite : 500 à 1500 Ω·m',
      deratingFormulaOrImpact: 'Tension de pas/toucher sévère : forage profond obligatoire (CEI 61936-1)',
      standardRef: 'IEEE 80 / IEC 61936-1 Cl. 10'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F14] overflow-hidden shadow-lg font-sans">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0E141D] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{isFr ? 'HYPOTHÈSES, LIMITES DE VALIDITÉ & DÉCLASSEMENT' : 'ASSUMPTIONS, LIMITATIONS & DERATING'}</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              {isFr
                ? 'Conditions aux limites d\'ingénierie et coefficients de sécurité applicables'
                : 'Engineering boundary conditions and applicable safety factors'}
            </p>
          </div>
        </div>

        <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="sm" />
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Boundary Conditions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-slate-950/60">
                <th className="py-2 px-3">{isFr ? 'Paramètre Critique' : 'Critical Parameter'}</th>
                <th className="py-2 px-3">{isFr ? 'Valeur Nominale Standard' : 'Standard Rating'}</th>
                <th className="py-2 px-3">{isFr ? 'Contrainte Terrain Cameroun' : 'Cameroon Grid Condition'}</th>
                <th className="py-2 px-3">{isFr ? 'Règle de Déclassement / Impact' : 'Derating Rule / Impact'}</th>
                <th className="py-2 px-3">{isFr ? 'Référence Normative' : 'Standard Ref'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {boundaryConditions.map((cond, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-200">
                    {isFr ? cond.parameter_fr : cond.parameter_en}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {cond.standardValue}
                  </td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">
                    {cond.cameroonFieldCondition}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 text-[11px]">
                    {cond.deratingFormulaOrImpact}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300">
                      {cond.standardRef}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning Banner: Scope & Extrapolation Limits */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono font-bold uppercase tracking-wider text-amber-300">
              {isFr ? 'AVERTISSEMENT D\'EXTRAPOLATION NON AUTORISÉE :' : 'UNAUTHORIZED EXTRAPOLATION WARNING :'}
            </span>
            <p className="leading-relaxed font-sans text-slate-300 text-[11px]">
              {isFr
                ? 'Les modèles électrotechniques présentés sont valables pour un régime permanent à fréquence assignée (50 Hz ± 1%) et sous réserve d\'un taux d\'harmoniques THD-u < 3%. Toute extension à des régimes hautement saturés ou transitoires HF (coupure capacitive, foudre directe) requiert une simulation EMT détaillée (ex. ATP-EMTP).'
                : 'The electrotechnical models shown are valid for steady-state operation at nominal frequency (50 Hz ± 1%) and THD-u < 3%. Any extension to heavily saturated or high-frequency transient regimes (capacitive switching, direct lightning) requires detailed EMT study (e.g. ATP-EMTP).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
