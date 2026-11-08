// src/components/grid-architecture/modules/GridArchitectureComparisonMatrix.tsx
// EPEDE D02 - Authoritative 8-Axis Network Topologies & Substation Busbar Comparative Matrix
// Conforms to IEEE Std 399, IEC 60909, IEC 61936-1, CIGRE TB 577, and SONATREL Grid Code

import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  GitFork,
  Compass,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface GridArchitectureComparisonMatrixProps {
  locale: 'fr' | 'en';
}

interface TopologyRow {
  id: string;
  name: { fr: string; en: string };
  voltageLevel: string;
  resilienceCriterion: string;
  typicalSaidi: { fr: string; en: string };
  protectionComplexity: { fr: string; en: string };
  capexRating: { fr: string; en: string };
  opexComplexity: { fr: string; en: string };
  voltageStability: { fr: string; en: string };
  cameroonExemplar: { fr: string; en: string };
  recommendation: { fr: string; en: string };
}

interface BusbarRow {
  id: string;
  name: { fr: string; en: string };
  code: string;
  breakerCountPerBay: string;
  disconnectorCountPerBay: string;
  maintenanceFlexibility: { fr: string; en: string };
  faultImpact: { fr: string; en: string };
  relativeCost: string;
  typicalApplication: { fr: string; en: string };
  interlockComplexity: { fr: string; en: string };
}

const TOPOLOGIES_DATA: TopologyRow[] = [
  {
    id: 'radial',
    name: { fr: 'Réseau Radial Arborescent', en: 'Radial Tree Feeder' },
    voltageLevel: '15 kV - 30 kV / 400 V BT',
    resilienceCriterion: 'N-0 (Aucune redondance)',
    typicalSaidi: { fr: '> 60 à 250 h/an (Tout défaut coupe l\'aval)', en: '> 60 to 250 h/yr (Any fault cuts downstream)' },
    protectionComplexity: { fr: 'Très simple (50/51 non directionnel)', en: 'Very simple (Non-directional 50/51)' },
    capexRating: { fr: 'Faible (1.0x)', en: 'Low (1.0x)' },
    opexComplexity: { fr: 'Simple (Patrouille visuelle nécessaire)', en: 'Simple (Visual line patrol required)' },
    voltageStability: { fr: 'Faible (Chute de tension cumulative en bout)', en: 'Poor (Cumulative end-of-line voltage drop)' },
    cameroonExemplar: { fr: 'Départs ruraux 30 kV Centre & Ouest (Bafia, Bokito, Obala)', en: 'Rural 30 kV feeders Central & West (Bafia, Bokito, Obala)' },
    recommendation: { fr: 'Réservé aux zones rurales à faible densité où le coût au km prime.', en: 'Reserved for low-density rural sectors where cost per km governs.' }
  },
  {
    id: 'open_ring',
    name: { fr: 'Réseau Bouclé Ouvert (Ring Main)', en: 'Open-Loop / Ring Main (RMU)' },
    voltageLevel: '20 kV - 30 kV MT (Souterrain / Mixte)',
    resilienceCriterion: 'N-1 Reconfigurable (< 3 min)',
    typicalSaidi: { fr: '< 5 à 25 h/an (Reprise rapide via point ouvert)', en: '< 5 to 25 h/yr (Fast restoration via tie switch)' },
    protectionComplexity: { fr: 'Modérée (DPD/FPI communicants & FLISR)', en: 'Moderate (Communicating FPI & FLISR automation)' },
    capexRating: { fr: 'Modéré (1.6x à 2.2x)', en: 'Moderate (1.6x to 2.2x)' },
    opexComplexity: { fr: 'Moyenne (Téléconduite SCADA requise)', en: 'Medium (SCADA remote control required)' },
    voltageStability: { fr: 'Bonne (Possibilité d\'alimenter par deux côtés)', en: 'Good (Dual-end feeding capability)' },
    cameroonExemplar: { fr: 'Boucles 30 kV Yaoundé (Bastos, Plateau) & Douala (Bonanjo)', en: '30 kV urban rings Yaoundé (Bastos) & Douala (Bonanjo)' },
    recommendation: { fr: 'Standard obligatoire pour les centres urbains denses et zones tertiaires.', en: 'Mandatory standard for dense urban districts and business hubs.' }
  },
  {
    id: 'meshed',
    name: { fr: 'Réseau Maillé Haute Tension', en: 'Meshed Transmission Grid' },
    voltageLevel: '90 kV - 225 kV HTB',
    resilienceCriterion: 'N-1 Déterministe Strict (Zéro coupure)',
    typicalSaidi: { fr: '< 0.5 h/an (Transit instantané par lois de Kirchhoff)', en: '< 0.5 h/yr (Instantaneous Kirchhoff rerouting)' },
    protectionComplexity: { fr: 'Élevée (Relais Distance 21 & Différentiel 87L)', en: 'High (Distance 21 & Line Differential 87L)' },
    capexRating: { fr: 'Élevé (3.5x à 5.0x)', en: 'High (3.5x to 5.0x)' },
    opexComplexity: { fr: 'Élevée (Calculs d\'estimateur d\'état et dispatching EMS)', en: 'High (State estimation & EMS dispatching)' },
    voltageStability: { fr: 'Excellente (Maintien de tension multi-sources)', en: 'Excellent (Multi-source voltage support)' },
    cameroonExemplar: { fr: 'Boucle 225 kV RIS (Songloulou - Mangombé - Nyom II - Nachtigal)', en: 'RIS 225 kV loop (Songloulou - Mangombé - Nyom II - Nachtigal)' },
    recommendation: { fr: 'Indispensable pour l\'épine dorsale de grand transport national.', en: 'Essential for the national bulk transmission backbone.' }
  },
  {
    id: 'interconnected',
    name: { fr: 'Super-Réseau Régional Interconnecté', en: 'Transboundary Interconnected Supergrid' },
    voltageLevel: '225 kV - 400 kV AC / HVDC',
    resilienceCriterion: 'N-1 / N-2 Multi-Zones',
    typicalSaidi: { fr: 'Systémique (Effacement des délestages saisonniers)', en: 'Systemic (Eliminates seasonal structural load sheds)' },
    protectionComplexity: { fr: 'Très complexe (WAMS, PMU, PSS, automates de découplage)', en: 'Very high (WAMS, PMU, PSS, islanding relays)' },
    capexRating: { fr: 'Très Élevé (> 8.0x)', en: 'Very High (> 8.0x)' },
    opexComplexity: { fr: 'Avancée (Coordination supranationale & Code commun)', en: 'Advanced (Cross-border dispatch & common grid code)' },
    voltageStability: { fr: 'Robuste sous réserve de compensation réactive (FACTS)', en: 'Robust provided reactive compensation (FACTS) exists' },
    cameroonExemplar: { fr: 'Interconnexion RIS-RIN & Projet PIECT Cameroun-Tchad', en: 'RIS-RIN Intertie & PIECT Cameroon-Chad project' },
    recommendation: { fr: 'Stratégique pour la souveraineté et la complémentarité des bassins.', en: 'Strategic for energy sovereignty and basin complementarity.' }
  },
  {
    id: 'microgrid',
    name: { fr: 'Micro-Réseau Insulaire Hybride', en: 'Isolated Hybrid Microgrid' },
    voltageLevel: '400 V BT - 15/30 kV MT (BESS + PV + Diesel)',
    resilienceCriterion: 'N-1 Local (Formateur de réseau Grid-Forming)',
    typicalSaidi: { fr: '< 15 h/an (Sous réserve de capacité BESS adéquate)', en: '< 15 h/yr (Dependent on BESS storage capacity)' },
    protectionComplexity: { fr: 'Complexe (Faible Icc des onduleurs : 1.2 In)', en: 'Complex (Low inverter fault current: 1.2 In)' },
    capexRating: { fr: 'Modéré à Élevé selon BESS', en: 'Moderate to High based on BESS' },
    opexComplexity: { fr: 'Moyenne (Automate de micro-réseau EMS local)', en: 'Medium (Local microgrid EMS controller)' },
    voltageStability: { fr: 'Sensible aux variations d\'ensoleillement et démarrages moteurs', en: 'Sensitive to solar cloud cover & motor starts' },
    cameroonExemplar: { fr: 'Centrales solaires hybrides du Grand Nord (Maroua, Guider 30 MW)', en: 'Hybrid solar-BESS plants in Northern Cameroon (Maroua, Guider 30 MW)' },
    recommendation: { fr: 'Optimal pour l\'électrification des zones isolées hors réseau interconnecté.', en: 'Optimal for rural off-grid electrification and isolated outposts.' }
  }
];

const BUSBAR_DATA: BusbarRow[] = [
  {
    id: 'single_bus',
    name: { fr: 'Simple Jeu de Barres', en: 'Single Busbar' },
    code: 'S-BB',
    breakerCountPerBay: '1.0',
    disconnectorCountPerBay: '1.0 à 2.0',
    maintenanceFlexibility: { fr: 'Nulle : toute intervention sur la barre exige la mise hors tension complète du poste.', en: 'Zero: any maintenance on the bus requires complete substation shutdown.' },
    faultImpact: { fr: 'Catastrophique : un défaut barre déclenche tous les disjoncteurs et coupe le poste entier.', en: 'Catastrophic: a single bus fault trips all breakers, collapsing the whole station.' },
    relativeCost: '1.0x (Référence minimale)',
    typicalApplication: { fr: 'Postes de distribution MT ou petits postes raccordés en antenne.', en: 'MV distribution kiosks or small radial step-down substations.' },
    interlockComplexity: { fr: 'Basique (Verrouillage classique disjoncteur / sectionneur).', en: 'Basic (Standard breaker / disconnector interlocking).' }
  },
  {
    id: 'single_bus_sectionalized',
    name: { fr: 'Simple Jeu de Barres Tronçonné', en: 'Sectionalized Single Busbar' },
    code: 'SS-BB',
    breakerCountPerBay: '1.0 + 1 tronçonnement',
    disconnectorCountPerBay: '2.0',
    maintenanceFlexibility: { fr: 'Partielle : un demi-jeu de barres peut être consigné pendant que l\'autre reste en service.', en: 'Partial: one half-bus can be de-energized while the other remains active.' },
    faultImpact: { fr: 'Limité à 50% des départs : le disjoncteur de tronçonnement isole la section en défaut.', en: 'Limited to 50% of feeders: bus tie breaker clears the faulted section.' },
    relativeCost: '1.25x',
    typicalApplication: { fr: 'Postes sources industriels avec deux transformateurs d\'arrivée.', en: 'Industrial substations equipped with dual incoming transformers.' },
    interlockComplexity: { fr: 'Moyenne (Coordination des automatismes d\'inversion de source).', en: 'Medium (Automatic source transfer interlock logic).' }
  },
  {
    id: 'double_bus_single_breaker',
    name: { fr: 'Double Jeu de Barres à Un Disjoncteur (Standard HTB)', en: 'Double Busbar Single Breaker (HV Standard)' },
    code: 'DB-SB',
    breakerCountPerBay: '1.0 (+ 1 disjoncteur de couplage)',
    disconnectorCountPerBay: '3.0 (Q1 barre 1, Q2 barre 2, Q9 ligne)',
    maintenanceFlexibility: { fr: 'Excellente : transfert de tous les départs sur la barre 2 sans coupure via le disjoncteur de couplage.', en: 'Excellent: on-load bay transfer to bus 2 with zero outage using the bus coupler.' },
    faultImpact: { fr: 'Très réduit : en cas de défaut sur une barre, seule celle-ci est éliminée, l\'autre reste active.', en: 'Minimal: fault on one bus trips only that bus; the second bus maintains service.' },
    relativeCost: '1.6x',
    typicalApplication: { fr: 'Postes d\'interconnexion 90 kV / 225 kV SONATREL (Oyomabang, Mangombé, Nyom II).', en: 'SONATREL 90 kV / 225 kV transmission nodes (Oyomabang, Mangombé, Nyom II).' },
    interlockComplexity: { fr: 'Élevée : verrouillage croisé électrique/mécanique d\'aiguillage de barres.', en: 'High: electrical/mechanical cross-interlocking for bus transfer.' }
  },
  {
    id: 'breaker_and_a_half',
    name: { fr: 'Schéma à Disjoncteur et Demi (1½ Breaker Scheme)', en: 'Breaker-and-a-Half (1½ CB Scheme)' },
    code: '1.5-CB',
    breakerCountPerBay: '1.5 (3 disjoncteurs pour 2 travées)',
    disconnectorCountPerBay: '6.0 par diamètre',
    maintenanceFlexibility: { fr: 'Maximale : n\'importe quel disjoncteur peut être consigné sans couper aucun départ ni aucune barre.', en: 'Maximum: any breaker can be isolated for overhaul without cutting any circuit or bus.' },
    faultImpact: { fr: 'Zéro coupure départ : un défaut barre n\'entraîne l\'interruption d\'aucun départ de ligne ou groupe.', en: 'Zero circuit interruption: a bus fault trips zero transmission lines or generators.' },
    relativeCost: '2.4x à 2.8x',
    typicalApplication: { fr: 'Grands postes d\'évacuation de centrales de plus de 400 MW (Nachtigal 225 kV, Edéa).', en: 'Critical evacuation switchyards for large >400 MW power plants (Nachtigal 225 kV).' },
    interlockComplexity: { fr: 'Très élevée : protections différentielles barres et défaillance disjoncteur 50BF.', en: 'Very high: bus differential 87B and breaker failure 50BF logic.' }
  },
  {
    id: 'ring_bus',
    name: { fr: 'Jeu de Barres en Anneau (Ring Bus)', en: 'Ring Bus Scheme' },
    code: 'RING-BB',
    breakerCountPerBay: '1.0 (Chaque départ est encadré par 2 disjoncteurs)',
    disconnectorCountPerBay: '2.0 à 4.0',
    maintenanceFlexibility: { fr: 'Très bonne : un disjoncteur peut être consigné en ouvrant l\'anneau sans interrompre de départ.', en: 'Very good: any breaker can be racked out for service while preserving all feeds.' },
    faultImpact: { fr: 'Faible : un défaut sur un tronçon n\'interrompt que le circuit raccordé à ce nœud.', en: 'Low: a line fault only trips the two framing breakers without collapsing the ring.' },
    relativeCost: '1.4x à 1.7x',
    typicalApplication: { fr: 'Postes de transport comprenant 4 à 6 départs de lignes sans espace pour double barre.', en: 'Transmission substations with 4 to 6 circuits where footprint is constrained.' },
    interlockComplexity: { fr: 'Élevée : l\'ouverture de deux disjoncteurs fragilise l\'anneau en deux antennes.', en: 'High: opening two breakers splits the ring into separate radial sections.' }
  }
];

export const GridArchitectureComparisonMatrix: React.FC<GridArchitectureComparisonMatrixProps> = ({ locale }) => {
  const isFr = locale === 'fr';
  const [activeTab, setActiveTab] = useState<'topologies' | 'busbars'>('topologies');
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>('meshed');
  const [selectedBusbarId, setSelectedBusbarId] = useState<string>('double_bus_single_breaker');

  const selectedTopology = TOPOLOGIES_DATA.find((t) => t.id === selectedTopologyId) || TOPOLOGIES_DATA[2];
  const selectedBusbar = BUSBAR_DATA.find((b) => b.id === selectedBusbarId) || BUSBAR_DATA[2];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1B2B] border border-[#1E3347] rounded-2xl p-6 text-white shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SYNTHÈSE ARCHITECTURALE & MATRICE COMPARATIVE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CEI 60909 · IEEE Std 399 · Code de Réseau SONATREL
            </span>
          </div>

          {/* Toggle between Topologies and Busbars */}
          <div className="flex rounded-xl border border-[#2A445C] bg-[#122435] p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('topologies')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'topologies'
                  ? 'bg-[#1F5FAE] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{isFr ? '1. Topologies de Réseaux' : '1. Network Topologies'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('busbars')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'busbars'
                  ? 'bg-[#1F5FAE] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? '2. Topologies de Jeux de Barres Postes' : '2. Substation Busbar Schemes'}</span>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold font-serif-editorial">
          {activeTab === 'topologies'
            ? isFr
              ? 'Matrice Comparative Multi-Axes des Topologies de Réseaux Électriques'
              : 'Multi-Criteria Comparative Matrix of Power Grid Topologies'
            : isFr
            ? 'Architecture des Postes Électriques : Schémas Unifilaires de Jeux de Barres'
            : 'Substation Busbar Topologies: Reliability & Switching Interlocks'}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-sans">
          {activeTab === 'topologies'
            ? isFr
              ? 'Le choix d\'une topologie de réseau résulte d\'un arbitrage strict entre le coût d\'investissement initial (CAPEX), la complexité d\'exploitation (OPEX), les exigences de continuité de service (SAIDI/SAIFI) et le critère déterministe de sécurité N-1 imposé par le régulateur national.'
              : 'The choice of grid topology is a multi-objective trade-off between upfront CAPEX, operational OPEX, service reliability metrics (SAIDI/SAIFI), and regulatory deterministic N-1 security mandates.'
            : isFr
            ? 'Dans les sous-stations haute tension HTB, l\'agencement des jeux de barres détermine la flexibilité de manœuvre, la disponibilité lors des travaux d\'entretien et la propagation des défauts d\'isolement. Voici les 5 schémas normalisés internationaux.'
            : 'In high-voltage substations, busbar topology dictates switching flexibility, maintenance clearance availability, and isolation during bus faults.'}
        </p>
      </div>

      {/* ========================================================
          TAB 1: NETWORK TOPOLOGIES COMPARISON
         ======================================================== */}
      {activeTab === 'topologies' && (
        <div className="space-y-6">
          {/* Quick Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {TOPOLOGIES_DATA.map((top) => {
              const isSelected = top.id === selectedTopologyId;
              return (
                <button
                  key={top.id}
                  type="button"
                  onClick={() => setSelectedTopologyId(top.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F5FAE] text-white border-[#1F5FAE] shadow-md'
                      : 'bg-[#FBFCFD] text-[#5B6B7B] hover:text-[#0B1B2B] border-[#D5E0E8]'
                  }`}
                >
                  {isFr ? top.name.fr : top.name.en}
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Topology Focus Card */}
          <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3EBF0] pb-3">
              <div>
                <span className="text-xs font-mono text-[#1F5FAE] font-bold uppercase tracking-wider">
                  {isFr ? 'TOPOLOGIE EN FOCUS' : 'FEATURED TOPOLOGY'}
                </span>
                <h4 className="text-xl font-bold text-[#0B1B2B]">
                  {isFr ? selectedTopology.name.fr : selectedTopology.name.en}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EEF4F8] text-[#0B1B2B] border border-[#D5E0E8]">
                  {selectedTopology.voltageLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                  {selectedTopology.resilienceCriterion}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Impact SAIDI / Fiabilité :' : 'SAIDI / Reliability Impact:'}</span>
                <p className="text-[#0B1B2B] font-semibold">{isFr ? selectedTopology.typicalSaidi.fr : selectedTopology.typicalSaidi.en}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Protections Requises :' : 'Required Protections:'}</span>
                <p className="text-[#0B1B2B] font-semibold">{isFr ? selectedTopology.protectionComplexity.fr : selectedTopology.protectionComplexity.en}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Exemple Réel au Cameroun :' : 'Real Cameroon Example:'}</span>
                <p className="text-[#1F5FAE] font-bold">{isFr ? selectedTopology.cameroonExemplar.fr : selectedTopology.cameroonExemplar.en}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#0B1B2B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-600" />
                <span>{isFr ? 'Directrice d\'Ingénierie & Recommandation :' : 'Engineering Guideline & Recommendation:'}</span>
              </div>
              <p className="leading-relaxed">
                {isFr ? selectedTopology.recommendation.fr : selectedTopology.recommendation.en}
              </p>
            </div>
          </div>

          {/* Full Multi-Criteria Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#D5E0E8] bg-white shadow-xs">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F0F4F8] text-[#0B1B2B] font-mono font-bold border-b border-[#D5E0E8]">
                <tr>
                  <th className="p-3.5">{isFr ? 'Topologie' : 'Topology'}</th>
                  <th className="p-3.5">{isFr ? 'Tension & Palier' : 'Voltage Band'}</th>
                  <th className="p-3.5">{isFr ? 'Critère N-1' : 'N-1 Criterion'}</th>
                  <th className="p-3.5">{isFr ? 'Indice SAIDI' : 'SAIDI Metric'}</th>
                  <th className="p-3.5">{isFr ? 'Protections' : 'Relaying Scheme'}</th>
                  <th className="p-3.5">{isFr ? 'CAPEX Ratio' : 'CAPEX Ratio'}</th>
                  <th className="p-3.5">{isFr ? 'Cas Cameroun' : 'Cameroon Case'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EDF2]">
                {TOPOLOGIES_DATA.map((t) => {
                  const isSelected = t.id === selectedTopologyId;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTopologyId(t.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-[#F9FBFC]'
                      }`}
                    >
                      <td className="p-3.5 font-bold text-[#0B1B2B] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#1F5FAE]' : 'bg-slate-300'}`} />
                        <span>{isFr ? t.name.fr : t.name.en}</span>
                      </td>
                      <td className="p-3.5 text-[#5B6B7B] font-mono">{t.voltageLevel}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {t.resilienceCriterion.split(' ')[0]}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#5B6B7B] max-w-[200px] truncate">{isFr ? t.typicalSaidi.fr : t.typicalSaidi.en}</td>
                      <td className="p-3.5 text-[#5B6B7B]">{isFr ? t.protectionComplexity.fr : t.protectionComplexity.en}</td>
                      <td className="p-3.5 font-mono font-bold text-[#0B1B2B]">{isFr ? t.capexRating.fr : t.capexRating.en}</td>
                      <td className="p-3.5 text-[#1F5FAE] font-medium">{isFr ? t.cameroonExemplar.fr.split('(')[0] : t.cameroonExemplar.en.split('(')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SUBSTATION BUSBAR SCHEMES COMPARISON
         ======================================================== */}
      {activeTab === 'busbars' && (
        <div className="space-y-6">
          {/* Quick Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {BUSBAR_DATA.map((bb) => {
              const isSelected = bb.id === selectedBusbarId;
              return (
                <button
                  key={bb.id}
                  type="button"
                  onClick={() => setSelectedBusbarId(bb.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F5FAE] text-white border-[#1F5FAE] shadow-md'
                      : 'bg-[#FBFCFD] text-[#5B6B7B] hover:text-[#0B1B2B] border-[#D5E0E8]'
                  }`}
                >
                  {isFr ? bb.name.fr : bb.name.en} ({bb.code})
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Busbar Focus Card */}
          <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3EBF0] pb-3">
              <div>
                <span className="text-xs font-mono text-[#1F5FAE] font-bold uppercase tracking-wider">
                  {isFr ? 'SCHÉMA DE POSTE EN FOCUS' : 'FEATURED BUSBAR SCHEME'}
                </span>
                <h4 className="text-xl font-bold text-[#0B1B2B]">
                  {isFr ? selectedBusbar.name.fr : selectedBusbar.name.en}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EEF4F8] text-[#0B1B2B] border border-[#D5E0E8]">
                  Code : {selectedBusbar.code}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                  Coût relatif : {selectedBusbar.relativeCost}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Appareillage par Travée :' : 'Switchgear Per Bay:'}</span>
                <p className="text-[#0B1B2B] font-mono font-bold">
                  {selectedBusbar.breakerCountPerBay} DJ · {selectedBusbar.disconnectorCountPerBay} SECT
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Flexibilité de Maintenance :' : 'Maintenance Flexibility:'}</span>
                <p className="text-[#0B1B2B]">{isFr ? selectedBusbar.maintenanceFlexibility.fr : selectedBusbar.maintenanceFlexibility.en}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4F7F9] border border-[#D5E0E8] space-y-1">
                <span className="text-[#5B6B7B] font-bold block">{isFr ? 'Conséquence d\'un Défaut Barre :' : 'Busbar Fault Impact:'}</span>
                <p className="text-rose-600 font-bold">{isFr ? selectedBusbar.faultImpact.fr : selectedBusbar.faultImpact.en}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-[#0B1B2B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>{isFr ? 'Application Typique & Logique de Verrouillage :' : 'Typical Application & Interlock Scheme:'}</span>
              </div>
              <p className="leading-relaxed">
                <strong>{isFr ? 'Application :' : 'Application:'}</strong> {isFr ? selectedBusbar.typicalApplication.fr : selectedBusbar.typicalApplication.en}
                <br />
                <strong>{isFr ? 'Verrouillage :' : 'Interlocks:'}</strong> {isFr ? selectedBusbar.interlockComplexity.fr : selectedBusbar.interlockComplexity.en}
              </p>
            </div>
          </div>

          {/* Full Busbar Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#D5E0E8] bg-white shadow-xs">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F0F4F8] text-[#0B1B2B] font-mono font-bold border-b border-[#D5E0E8]">
                <tr>
                  <th className="p-3.5">{isFr ? 'Schéma' : 'Scheme'}</th>
                  <th className="p-3.5">{isFr ? 'Disjoncteurs' : 'Breakers'}</th>
                  <th className="p-3.5">{isFr ? 'Sectionneurs' : 'Disconnectors'}</th>
                  <th className="p-3.5">{isFr ? 'Maintenance Hors Tension' : 'Maintenance Outage'}</th>
                  <th className="p-3.5">{isFr ? 'Impact Défaut Barre' : 'Bus Fault Impact'}</th>
                  <th className="p-3.5">{isFr ? 'Ratio Coût' : 'Cost Ratio'}</th>
                  <th className="p-3.5">{isFr ? 'Postes Typiques' : 'Typical Substations'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EDF2]">
                {BUSBAR_DATA.map((b) => {
                  const isSelected = b.id === selectedBusbarId;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBusbarId(b.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-[#F9FBFC]'
                      }`}
                    >
                      <td className="p-3.5 font-bold text-[#0B1B2B] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#1F5FAE]' : 'bg-slate-300'}`} />
                        <span>{isFr ? b.name.fr : b.name.en} ({b.code})</span>
                      </td>
                      <td className="p-3.5 font-mono text-[#0B1B2B] font-bold">{b.breakerCountPerBay}</td>
                      <td className="p-3.5 font-mono text-[#5B6B7B]">{b.disconnectorCountPerBay}</td>
                      <td className="p-3.5 text-[#5B6B7B] max-w-[200px] truncate">{isFr ? b.maintenanceFlexibility.fr : b.maintenanceFlexibility.en}</td>
                      <td className="p-3.5 text-rose-600 font-medium max-w-[180px] truncate">{isFr ? b.faultImpact.fr : b.faultImpact.en}</td>
                      <td className="p-3.5 font-mono font-bold text-[#0B1B2B]">{b.relativeCost.split(' ')[0]}</td>
                      <td className="p-3.5 text-[#1F5FAE]">{isFr ? b.typicalApplication.fr.split('(')[0] : b.typicalApplication.en.split('(')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

