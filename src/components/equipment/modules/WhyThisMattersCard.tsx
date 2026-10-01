// src/components/equipment/modules/WhyThisMattersCard.tsx
// EPEDE - Why This Matters Engineering Intelligence Layer (Priority 4)
// Highlights operational risk, cost of failure, personnel safety, grid stability, and regulatory impacts

import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Zap,
  DollarSign,
  Flame,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';

export interface WhyThisMattersProps {
  equipmentId?: string;
  domainCode?: string;
  locale: 'fr' | 'en';
}

interface ImpactFactor {
  id: string;
  title_fr: string;
  title_en: string;
  category: 'GRID_STABILITY' | 'SAFETY' | 'FINANCIAL' | 'ENVIRONMENTAL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description_fr: string;
  description_en: string;
  quantitativeMetric?: string;
  mitigation_fr: string;
  mitigation_en: string;
}

export const WhyThisMattersCard: React.FC<WhyThisMattersProps> = ({
  equipmentId = '',
  domainCode = 'D04',
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';
  const [expandedId, setExpandedId] = useState<string | null>('factor-1');

  // Grounded real-world impact data tailored to equipment type or domain
  const getImpactFactors = (): ImpactFactor[] => {
    const isTrafo = equipmentId.includes('trafo') || domainCode === 'D04';
    const isBreaker = equipmentId.includes('bay') || equipmentId.includes('gis') || equipmentId.includes('cb');
    const isLine = equipmentId.includes('line') || equipmentId.includes('tower') || domainCode === 'D03';

    if (isTrafo) {
      return [
        {
          id: 'factor-1',
          title_fr: 'Stabilité & Écroulement de Tension du Réseau',
          title_en: 'Grid Stability & Voltage Collapse Risk',
          category: 'GRID_STABILITY',
          severity: 'CRITICAL',
          description_fr: 'La défaillance d\'un transformateur d\'interconnexion 225/30 kV (ex. 63 MVA à Mangombé) entraîne la surcharge immédiate des unités adjacentes, un creux de tension régional et le risque d\'effondrement en cascade par délestage d\'urgence UFLS.',
          description_en: 'Failure of a 225/30 kV intertie transformer (e.g. 63 MVA at Mangombé) immediately overloads parallel units, causing regional voltage dips and cascade trip risks via under-frequency load shedding.',
          quantitativeMetric: 'Tension réseau < 0.85 Un en 180 ms · Décrochage industriel',
          mitigation_fr: 'Redondance N-1 en sous-station, régulateur en charge (OLTC) sous automate AVR et protection différentielle 87T en < 40 ms.',
          mitigation_en: 'N-1 substation redundancy, on-load tap changer with AVR automation and 87T differential protection in < 40 ms.'
        },
        {
          id: 'factor-2',
          title_fr: 'Coût Financier et Délais d\'Indisponibilité Prolongée',
          title_en: 'Financial Loss & Long-Lead Replacement Risk',
          category: 'FINANCIAL',
          severity: 'CRITICAL',
          description_fr: 'Un transformateur de puissance HTB/HTA est un appareil sur mesure ("Engineer-to-Order"). Son approvisionnement après avarie diélectrique majeure nécessite entre 8 et 16 mois de fabrication, transport maritime et essais sur site.',
          description_en: 'A high-voltage power transformer is a custom engineer-to-order asset. Replacement after catastrophic dielectric breakdown takes 8 to 16 months for manufacturing, sea freight and site commissioning.',
          quantitativeMetric: 'Coût matériel : 1.2M€ - 2.8M€ · Énergie non distribuée : 45 000 $/h',
          mitigation_fr: 'Surveillance continue DGA (analyse des gaz dissous en ligne), tests diélectriques périodiques et maintien d\'une réserve froide nationale.',
          mitigation_en: 'Online DGA monitoring, periodic oil breakdown tests and national strategic cold spare reserve.'
        },
        {
          id: 'factor-3',
          title_fr: 'Risque Incendie & Sécurité des Intervenants',
          title_en: 'Fire Hazard & Field Personnel Safety',
          category: 'SAFETY',
          severity: 'HIGH',
          description_fr: 'Un court-circuit interne non éliminé produit un arc électrique sous huile générant de l\'acétylène et de l\'hydrogène, induisant une surpression brutale capable de fissurer la cuve et de projeter jusqu\'à 30 000 litres d\'huile en feu.',
          description_en: 'An uncleared internal fault causes an electric arc under oil generating acetylene and hydrogen, creating pressure waves capable of rupturing the tank and dispersing up to 30,000 liters of burning mineral oil.',
          quantitativeMetric: 'Pression de cuve > 1.2 bar · Flamme diélectrique > 900°C',
          mitigation_fr: 'Relais Buchholz mécanique, clapet de surpression à déclenchement direct (ANSI 63), bac de rétention 110% avec étouffoir à galets (NF C 17-300).',
          mitigation_en: 'Mechanical Buchholz relay, rapid pressure relief device (ANSI 63), 110% retention bund with pebble fire extinguisher (NF C 17-300).'
        }
      ];
    }

    if (isBreaker) {
      return [
        {
          id: 'factor-1',
          title_fr: 'Élimination du Court-Circuit & Préservation du Réseau',
          title_en: 'Short-Circuit Interruption & Grid Preservation',
          category: 'GRID_STABILITY',
          severity: 'CRITICAL',
          description_fr: 'Le disjoncteur est l\'ultime rempart actif. En cas de refus d\'ouverture sur court-circuit franc (31.5 kA), l\'échauffement thermique et les contraintes électrodynamiques détruisent les barres et déclenchent la protection défaillance disjoncteur 50BF.',
          description_en: 'The circuit breaker is the ultimate active barrier. If it fails to open during a bolted fault (31.5 kA), thermal and electrodynamic stresses destroy busbars and trigger 50BF breaker failure protection.',
          quantitativeMetric: 'Courant de coupure : 31.5 kA RMS · Temps d\'arc : 10-18 ms',
          mitigation_fr: 'Redondance double bobine de déclenchement (TC1/TC2 alimentées par batteries 110 Vcc distinctes) et surveillance permanente de la pression SF6.',
          mitigation_en: 'Dual trip coil redundancy (TC1/TC2 fed by separated 110 VDC battery banks) and continuous SF6 density monitoring.'
        },
        {
          id: 'factor-2',
          title_fr: 'Toxicité du Gaz SF6 & Impact Environnemental',
          title_en: 'SF6 Toxicity & Environmental Green House Repercussions',
          category: 'ENVIRONMENTAL',
          severity: 'HIGH',
          description_fr: 'L\'hexafluorure de soufre est un gaz à effet de serre majeur (PRG = 24 300). Lors des coupures d\'arc, il génère des sous-produits de décomposition hautement toxiques et corrosifs (SOF2, SO2, HF) nécessitant des EPI spécialisés.',
          description_en: 'Sulfur hexafluoride is a potent greenhouse gas (GWP = 24,300). Electric arcing generates toxic decomposition byproducts (SOF2, SO2, HF) requiring specialized SCBA PPE during maintenance.',
          quantitativeMetric: 'Potentiel Réchauffement Global : 24 300 x CO2 · Seuil de fuite < 0.5%/an',
          mitigation_fr: 'Pressostats thermostatiques à double seuil (Alarme 5.5 bar / Verrouillage 5.0 bar), recyclage certifié CEI 60480 et migration progressive vers gaz alternatif (Clean Air / C4-FN).',
          mitigation_en: 'Dual-threshold density monitors (Alarm 5.5 bar / Trip lock 5.0 bar), IEC 60480 certified recovery and progressive shift to eco-gas alternatives.'
        }
      ];
    }

    // Default Generation / Transmission items
    return [
      {
        id: 'factor-1',
        title_fr: 'Continuité de Service & Intégrité de la Fréquence',
        title_en: 'Service Continuity & Grid Frequency Integrity',
        category: 'GRID_STABILITY',
        severity: 'CRITICAL',
        description_fr: 'Tout déclenchement intempestif ou défaillance technique sur ce maillon entraîne un déséquilibre immédiat P_méc ≠ P_élec, provoquant une chute brutale de fréquence (ROCOF df/dt) sur le réseau interconnecté RIS.',
        description_en: 'Any unintended trip or technical fault on this link immediately creates a P_mech ≠ P_elec power mismatch, inducing a steep frequency drop (ROCOF df/dt) across the interconnected grid.',
        quantitativeMetric: 'Seuil critique Cameroun : 49.50 Hz (réglage primaire) · 49.00 Hz (délestage UFLS)',
        mitigation_fr: 'Automate de régulation de vitesse (gouverneur) couplé à la réserve tournante primaire (FCR) et protections de sous-fréquence 81U coordonnées.',
        mitigation_en: 'Speed governor with primary frequency containment reserve (FCR) and coordinated 81U under-frequency protections.'
      },
      {
        id: 'factor-2',
        title_fr: 'Sécurité Électrique & Réglementation Sécurité Haute Tension',
        title_en: 'Electrical Safety & High Voltage Safety Compliance',
        category: 'SAFETY',
        severity: 'HIGH',
        description_fr: 'La haute tension présente des distances d\'amorçage diélectrique non négociables (ex. 1.80 m en 225 kV). Toute approche fortuite ou défaillance d\'isolation crée un arc électrique à plusieurs milliers de degrés.',
        description_en: 'High voltage imposes non-negotiable dielectric clearance distances (e.g. 1.80 m at 225 kV). Unintended approach or insulation failure causes electric arc flashover at thousands of degrees.',
        quantitativeMetric: 'Distance minimale d\'approche (DMA 225 kV) : 1.80 m · Rayon d\'arc flash',
        mitigation_fr: 'Consignation normalisée C18-510 en 5 étapes, interverrouillage mécanique par serrures Castell et mise à la terre visible systématique (sectionneurs de terre Q8).',
        mitigation_en: 'Standard 5-step lockout-tagout procedure, Castell mechanical interlocks and visible earthing switch (Q8) bonding.'
      }
    ];
  };

  const factors = getImpactFactors();

  const getCategoryBadge = (cat: ImpactFactor['category']) => {
    switch (cat) {
      case 'GRID_STABILITY':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
          label: isFr ? 'Stabilité Réseau' : 'Grid Stability',
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
        };
      case 'SAFETY':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
          label: isFr ? 'Sécurité des Personnes' : 'Personnel Safety',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/25'
        };
      case 'FINANCIAL':
        return {
          icon: <DollarSign className="w-3.5 h-3.5 text-amber-400" />,
          label: isFr ? 'Impact Financier & Matériel' : 'Financial & Asset Loss',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/25'
        };
      case 'ENVIRONMENTAL':
        return {
          icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
          label: isFr ? 'Environnement & Toxicité' : 'Environmental & Toxic',
          bg: 'bg-orange-500/10 text-orange-300 border-orange-500/25'
        };
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F14] overflow-hidden shadow-lg font-sans">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0E141D] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertOctagon className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{isFr ? 'POURQUOI CET ÉQUIPEMENT EST CRUCIAL' : 'WHY THIS ASSET MATTERS'}</span>
              <span className="text-[10px] text-amber-400/80 font-normal">
                ({isFr ? 'Conséquences d\'une Défaillance' : 'Consequences of Failure'})
              </span>
            </h4>
          </div>
        </div>

        <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="sm" />
      </div>

      {/* Accordion List */}
      <div className="p-3 space-y-2.5">
        {factors.map((factor) => {
          const isExpanded = expandedId === factor.id;
          const badge = getCategoryBadge(factor.category);

          return (
            <div
              key={factor.id}
              className={`rounded-lg border transition-all ${
                isExpanded
                  ? 'border-slate-700 bg-[#121924]'
                  : 'border-slate-800/80 bg-[#0E131A] hover:border-slate-700/60'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : factor.id)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-200 truncate font-mono">
                    {isFr ? factor.title_fr : factor.title_en}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    factor.severity === 'CRITICAL'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                  }`}>
                    {factor.severity}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-slate-800/60 text-xs">
                  {/* Detailed Description */}
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {isFr ? factor.description_fr : factor.description_en}
                  </p>

                  {/* Quantitative Metric */}
                  {factor.quantitativeMetric && (
                    <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] text-amber-300 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>{isFr ? 'Ordre de grandeur :' : 'Quantitative order :'}</strong> {factor.quantitativeMetric}</span>
                    </div>
                  )}

                  {/* Mitigation & Protective Barrier */}
                  <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-mono text-emerald-200">{isFr ? 'Barrière d\'ingénierie & Parade :' : 'Engineering Mitigation Barrier :'} </strong>
                      <span className="font-sans">{isFr ? factor.mitigation_fr : factor.mitigation_en}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
