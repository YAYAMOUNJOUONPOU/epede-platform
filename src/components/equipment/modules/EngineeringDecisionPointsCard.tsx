// src/components/equipment/modules/EngineeringDecisionPointsCard.tsx
// EPEDE - Engineering Decision Points & Tradeoffs Layer (Priority 5)
// Clarifies real-world engineering dilemmas, technology selections, and decision matrices

import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';

export interface DecisionPointsProps {
  equipmentId?: string;
  domainCode?: string;
  locale: 'fr' | 'en';
}

interface DecisionOption {
  label_fr: string;
  label_en: string;
  recommended?: boolean;
  pros_fr: string[];
  pros_en: string[];
  cons_fr: string[];
  cons_en: string[];
  costIndex: '€' | '€€' | '€€€';
  footprintIndex: 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' | 'LOW' | 'MEDIUM' | 'HIGH';
  maintenanceComplexity: 'BASSE' | 'MOYENNE' | 'ÉLEVÉE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

interface DecisionDilemma {
  id: string;
  title_fr: string;
  title_en: string;
  context_fr: string;
  context_en: string;
  standardRef: string;
  decisionRule_fr: string;
  decisionRule_en: string;
  options: [DecisionOption, DecisionOption];
}

export const EngineeringDecisionPointsCard: React.FC<DecisionPointsProps> = ({
  equipmentId = '',
  domainCode = 'D04',
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';

  const dilemmas: DecisionDilemma[] = [
    {
      id: 'dilemma-ais-gis',
      title_fr: 'Poste Ouvert AIS vs Poste Sous Enveloppe Métallique GIS (SF6)',
      title_en: 'Air-Insulated Switchgear (AIS) vs Gas-Insulated Switchgear (GIS)',
      context_fr: 'Arbitrage fondamental lors de la conception d\'un poste d\'évacuation ou d\'interconnexion 225 kV.',
      context_en: 'Fundamental architectural tradeoff when designing a 225 kV generation or transmission substation.',
      standardRef: 'IEC 62271-203 / IEC 61936-1',
      decisionRule_fr: 'Privilégier le GIS si l\'emprise foncière est < 15% du terrain requis ou en zone côtière sévèrement polluée (Douala port). Privilégier l\'AIS si l\'espace est disponible et le CAPEX prioritaire (Songloulou / Nachtigal).',
      decisionRule_en: 'Select GIS if available land is < 15% of required area or in severely polluted coastal zones (Douala port). Select AIS if space is abundant and initial CAPEX is constrained (Songloulou / Nachtigal).',
      options: [
        {
          label_fr: 'AIS (Poste Ouvert Isolé dans l\'Air)',
          label_en: 'AIS (Air-Insulated Outdoor Substation)',
          recommended: true,
          pros_fr: [
            'Coût d\'investissement initial (CAPEX) réduit de 30% à 45%',
            'Visibilité directe des organes mécaniques et coupures',
            'Facilité d\'extension future sans verrouillage constructeur propriétaire'
          ],
          pros_en: [
            'Initial investment cost (CAPEX) 30% to 45% lower',
            'Direct visual inspection of mechanical linkages and break points',
            'Straightforward future bay additions without vendor lock-in'
          ],
          cons_fr: [
            'Emprise au sol très importante (ex. 10 000 m² pour 225 kV)',
            'Sensibilité à la pollution marine, poussière et foudre directe',
            'Maintenance extérieure dépendante des intempéries'
          ],
          cons_en: [
            'Very large land footprint (e.g. 10,000 m² for 225 kV)',
            'High exposure to marine salt fog, dust and direct lightning',
            'Outdoor maintenance constrained by weather conditions'
          ],
          costIndex: '€',
          footprintIndex: isFr ? 'ÉLEVÉ' : 'HIGH',
          maintenanceComplexity: isFr ? 'BASSE' : 'LOW'
        },
        {
          label_fr: 'GIS (Blindé Sous SF6 ou Gaz Éco)',
          label_en: 'GIS (Gas-Insulated Enclosure SF6 / Eco-Gas)',
          pros_fr: [
            'Emprise au sol réduite de 85% à 90% (idéal milieu urbain)',
            'Insensibilité totale à la pollution saline et atmosphérique',
            'Intervalle de maintenance très espacé (> 25 ans sans ouverture des compartiments)'
          ],
          pros_en: [
            'Land footprint reduced by 85% to 90% (ideal for dense urban areas)',
            'Completely impervious to coastal salt mist and environmental dust',
            'Extended maintenance intervals (> 25 years without breaking compartment seals)'
          ],
          cons_fr: [
            'CAPEX élevé (surcoût matériel de 1.8x à 2.5x)',
            'Dépendance étroite au constructeur pour les pièces et extensions',
            'Gestion rigoureuse du gaz SF6 (PRG élevé et risque de fuite)'
          ],
          cons_en: [
            'Higher initial CAPEX (equipment multiplier 1.8x to 2.5x)',
            'Heavy dependency on OEM for spare compartments and extensions',
            'Strict SF6 greenhouse gas management and leak monitoring'
          ],
          costIndex: '€€€',
          footprintIndex: isFr ? 'FAIBLE' : 'LOW',
          maintenanceComplexity: isFr ? 'ÉLEVÉE' : 'HIGH'
        }
      ]
    },
    {
      id: 'dilemma-earthing',
      title_fr: 'Régime de Neutre MT : Neutre à la Terre par Résistance (NER) vs Neutre Compensé (Petersen)',
      title_en: 'MV Neutral Grounding: Resistor Grounded (NER) vs Resonant Petersen Coil',
      context_fr: 'Choix de mise à la terre du réseau de distribution 30 kV / 15 kV alimenté par le poste source.',
      context_en: 'Earthing philosophy selection for the 30 kV / 15 kV distribution network fed by primary substation.',
      standardRef: 'IEC 60076-5 / IEEE 142 (Green Book)',
      decisionRule_fr: 'NER recommandé sur réseaux mixtes ou câbles urbains avec élimination sélective rapide. Bobine de Petersen recommandée sur réseaux ruraux très étendus en lignes aériennes avec fort taux de défauts fugitifs.',
      decisionRule_en: 'NER recommended on mixed or underground cable urban grids with rapid selective tripping. Petersen coil recommended on vast rural overhead line grids with high rates of transient faults.',
      options: [
        {
          label_fr: 'Neutre par Résistance Limitatrice (NER)',
          label_en: 'Neutral Grounding Resistor (NER)',
          recommended: true,
          pros_fr: [
            'Limite le courant de défaut monophasé (ex. 300 A à 1000 A)',
            'Détection et sélectivité ampèremétrique simples et très fiables (ANSI 51N)',
            'Supprime les surtensions transitoires de ferrorésonance'
          ],
          pros_en: [
            'Limits single-phase fault current to safe levels (e.g. 300 A to 1000 A)',
            'Simple and highly reliable overcurrent protection selectivity (ANSI 51N)',
            'Eliminates transient ferroresonant overvoltage spikes'
          ],
          cons_fr: [
            'Déclenchement immédiat au 1er défaut (coupure d\'abonnés)',
            'Échauffement thermique de la résistance sur défaut maintenu',
            'Tension de pas/toucher à maîtriser scrupuleusement au poste'
          ],
          cons_en: [
            'Immediate trip on 1st earth fault (customer outage)',
            'Thermal dissipation in resistor bank if fault persists',
            'Step and touch voltages must be rigorously mitigated at substation'
          ],
          costIndex: '€',
          footprintIndex: isFr ? 'FAIBLE' : 'LOW',
          maintenanceComplexity: isFr ? 'BASSE' : 'LOW'
        },
        {
          label_fr: 'Neutre Compensé par Bobine d\'Extinction (Petersen)',
          label_en: 'Resonant Grounding (Petersen Coil / Arc Suppression)',
          pros_fr: [
            'Permet la continuité de service sur défaut monophasé permanent',
            'Extinction automatique sans coupure de 80% des défauts fugitifs d\'amorçage',
            'Courant résiduel au point de défaut très faible (< 20 A)'
          ],
          pros_en: [
            'Enables continuous operation during sustained single-phase earth fault',
            'Self-extinction without tripping for 80% of transient overhead line arcs',
            'Extremely low residual fault current at contact point (< 20 A)'
          ],
          cons_fr: [
            'Surtension permanente phase-terre de √3 · Un sur phases saines',
            'Système d\'accord automatique d\'inductance (contrôleur REG-D) complexe',
            'Nécessite des protections wattmétriques directionnelles sensibles (ANSI 67N)'
          ],
          cons_en: [
            'Sustained phase-to-ground overvoltage of √3 · Un on healthy phases',
            'Complex automatic motor-driven tuning controller (e.g. REG-D)',
            'Requires sensitive directional residual power relays (ANSI 67N)'
          ],
          costIndex: '€€€',
          footprintIndex: isFr ? 'MOYEN' : 'MEDIUM',
          maintenanceComplexity: isFr ? 'ÉLEVÉE' : 'HIGH'
        }
      ]
    }
  ];

  const [activeDilemmaId, setActiveDilemmaId] = useState<string>(dilemmas[0].id);
  const activeDilemma = dilemmas.find(d => d.id === activeDilemmaId) || dilemmas[0];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F14] overflow-hidden shadow-lg font-sans">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0E141D] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Scale className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{isFr ? 'ARBITRAGES & CHOIX D\'INGÉNIERIE' : 'ENGINEERING DECISION POINTS & TRADEOFFS'}</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              {isFr
                ? 'Dilemmes de conception, matrices multicritères et critères de sélection'
                : 'Design dilemmas, multi-criteria matrices, and decision rules'}
            </p>
          </div>
        </div>

        <EvidenceTrustBadge level="APPLICATION_DEPENDENT" locale={locale} size="sm" />
      </div>

      {/* Dilemma Selector Tabs */}
      <div className="px-4 pt-3 flex gap-2 border-b border-slate-800 bg-slate-950/50 overflow-x-auto scrollbar-none font-mono">
        {dilemmas.map(d => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveDilemmaId(d.id)}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeDilemmaId === d.id
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFr ? d.title_fr : d.title_en}
          </button>
        ))}
      </div>

      {/* Active Dilemma View */}
      <div className="p-4 space-y-4">
        {/* Context & Governing Rule */}
        <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs text-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{isFr ? 'RÈGLE DE DÉCISION MÉTIER :' : 'GOVERNING ENGINEERING DECISION RULE :'}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-purple-700/40 text-[10px] font-mono text-purple-300">
              {activeDilemma.standardRef}
            </span>
          </div>
          <p className="font-sans leading-relaxed text-slate-300 text-[11px]">
            {isFr ? activeDilemma.decisionRule_fr : activeDilemma.decisionRule_en}
          </p>
        </div>

        {/* Side-by-Side Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDilemma.options.map((opt, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-3.5 space-y-3 font-sans ${
                opt.recommended
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              {/* Option Title & Recommendation Tag */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-mono font-bold text-xs text-slate-100">
                  {isFr ? opt.label_fr : opt.label_en}
                </span>
                {opt.recommended && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    {isFr ? 'RECOMMANDÉ COURANT' : 'TYPICAL DEFAULT'}
                  </span>
                )}
              </div>

              {/* Metrics Indices */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                <span>Coût : <strong className="text-amber-300">{opt.costIndex}</strong></span>
                <span>·</span>
                <span>Emprise : <strong className="text-cyan-300">{opt.footprintIndex}</strong></span>
                <span>·</span>
                <span>Maintenance : <strong className="text-purple-300">{opt.maintenanceComplexity}</strong></span>
              </div>

              {/* Pros List */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isFr ? 'Avantages Majeurs :' : 'Key Advantages :'}</span>
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  {(isFr ? opt.pros_fr : opt.pros_en).map((pro, pIdx) => (
                    <li key={pIdx}>{pro}</li>
                  ))}
                </ul>
              </div>

              {/* Cons List */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/60">
                <span className="text-[10px] font-mono font-bold uppercase text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  <span>{isFr ? 'Inconvénients & Contraintes :' : 'Disadvantages & Constraints :'}</span>
                </span>
                <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                  {(isFr ? opt.cons_fr : opt.cons_en).map((con, cIdx) => (
                    <li key={cIdx}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
