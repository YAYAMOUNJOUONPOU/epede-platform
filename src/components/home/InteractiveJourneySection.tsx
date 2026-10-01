// src/components/home/InteractiveJourneySection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Sliders,
  ExternalLink,
  Cpu
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

interface InteractiveJourneySectionProps {
  locale: 'fr' | 'en';
  onNavigateJourney: (stageId?: any) => void;
  onSelectDomain: (code: DomainCode) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateView: (view: any) => void;
}

interface JourneyStageItem {
  stageNumber: string;
  stageId: string;
  titleFr: string;
  titleEn: string;
  voltage: string;
  summaryFr: string;
  summaryEn: string;
  subsystemListFr: string;
  subsystemListEn: string;
  upstreamFr: string;
  upstreamEn: string;
  downstreamFr: string;
  downstreamEn: string;
  crossCuttingFr: string;
  crossCuttingEn: string;
  functionFr: string;
  functionEn: string;
  connectedToFr: string;
  connectedToEn: string;
  domainCode: DomainCode;
  equipmentSampleId: string;
  targetView: 'hydropower' | 'diagrams' | 'cameroon-grid' | 'journey' | 'domains';
}

const STAGES: JourneyStageItem[] = [
  {
    stageNumber: '01',
    stageId: 'energy-resources',
    titleFr: 'Ressources Énergétiques',
    titleEn: 'Energy Resources',
    voltage: 'Énergie Primaire',
    summaryFr: 'Capture des gisements primaires : eau, soleil, vent, biomasse, combustible et géothermie.',
    summaryEn: 'Harnessing primary energy reservoirs: water, sun, wind, fuel, biomass, and heat.',
    subsystemListFr: 'Eau · Soleil · Vent · Combustible · Biomasse · Chaleur',
    subsystemListEn: 'Water · Sun · Wind · Fuel · Biomass · Heat',
    upstreamFr: 'Bassin versant hydrologique, cycle solaire, réserve thermique naturelle.',
    upstreamEn: 'Hydrological watershed, solar irradiance cycle, natural fuel reserves.',
    downstreamFr: 'Centrale de conversion électromécanique ou photovoltaïque (Stage 02).',
    downstreamEn: 'Electromechanical or PV power conversion plant (Stage 02).',
    crossCuttingFr: 'Impact environnemental, prévisions météorologiques, débit réservé écologique.',
    crossCuttingEn: 'Environmental footprint, weather forecast models, ecological minimum flow.',
    functionFr: 'Fournir l\'énergie brute sous forme potentielle ou cinétique pour amorcer la conversion.',
    functionEn: 'Deliver raw potential or kinetic energy to initiate power conversion.',
    connectedToFr: 'Barrage-poids → Prise d\'eau → Galerie d\'amenée → Conduite forcée.',
    connectedToEn: 'Gravity dam → Water intake → Head race tunnel → Penstock pipe.',
    domainCode: 'D01',
    equipmentSampleId: 'eq-exp-hydro-gen-01',
    targetView: 'hydropower',
  },
  {
    stageNumber: '02',
    stageId: 'generation',
    titleFr: 'Production & Alternateurs',
    titleEn: 'Generation & Plant',
    voltage: '15 kV AC',
    summaryFr: 'Conversion mécanique/électrique via turbines Francis et alternateurs synchrones triphasés 50 Hz.',
    summaryEn: 'Electromechanical conversion via Francis hydro-turbines and 50 Hz synchronous generators.',
    subsystemListFr: 'Centrale · Turbine · Alternateur · Onduleur · Auxiliaires',
    subsystemListEn: 'Plant · Turbine · Generator · Inverter · Auxiliaries',
    upstreamFr: 'Ressource hydrologique (Stage 01 : hauteur de chute H et débit Q).',
    upstreamEn: 'Hydrological resource (Stage 01: head H and flow rate Q).',
    downstreamFr: 'Transformateur élévateur GSU 15/225 kV et transport THT (Stage 03).',
    downstreamEn: 'GSU 15/225 kV step-up transformer and HV transmission (Stage 03).',
    crossCuttingFr: 'Régulation de vitesse (P-f), régulation de tension AVR (Q-U), protection générateur.',
    crossCuttingEn: 'Speed governor (P-f), automatic voltage regulator AVR (Q-U), generator protection.',
    functionFr: 'Produire la tension triphasée régulée à fréquence synchrone constante (50.00 Hz).',
    functionEn: 'Produce regulated 3-phase AC voltage at locked synchronous frequency (50.00 Hz).',
    connectedToFr: 'Roue de turbine → Arbre d\'accouplement → Alternateur 15 kV → Disjoncteur générateur.',
    connectedToEn: 'Turbine runner → Drive shaft → 15 kV Generator → Generator circuit breaker.',
    domainCode: 'D01',
    equipmentSampleId: 'eq-exp-hydro-gen-01',
    targetView: 'hydropower',
  },
  {
    stageNumber: '03',
    stageId: 'transmission',
    titleFr: 'Transport Très Haute Tension (THT)',
    titleEn: 'HV Transmission Networks',
    voltage: '225 kV / 90 kV HTB',
    summaryFr: 'Évacuation massive d\'énergie sur de longues distances par lignes aériennes et câbles HTB pour minimiser les pertes.',
    summaryEn: 'Bulk power transfer over long corridors via overhead lines and HV cables to minimize transmission losses.',
    subsystemListFr: 'Transfo élévateur · Ligne HTB · Câble · Poste de couplage',
    subsystemListEn: 'Step-up transformer · HV line · Cable · Switchyard',
    upstreamFr: 'Jeux de barres 15 kV et disjoncteur alternateur de la centrale (Stage 02).',
    upstreamEn: '15 kV generator busbar and plant output circuit breaker (Stage 02).',
    downstreamFr: 'Poste source de transformation HTB/HTA (Stage 04).',
    downstreamEn: 'HV/MV step-down transmission/distribution substation (Stage 04).',
    crossCuttingFr: 'Stabilité d\'angle δ, puissance naturelle SIL, protection de distance ANSI 21, OPGW.',
    crossCuttingEn: 'Rotor angle stability δ, surge impedance loading (SIL), ANSI 21 distance protection.',
    functionFr: 'Transporter l\'énergie en réduisant les pertes par effet Joule I²R à très haute tension.',
    functionEn: 'Evacuate bulk energy with minimized I²R thermal losses at extra-high voltage.',
    connectedToFr: 'Transfo GSU 225 kV → Pylône treillis Aster 570 mm² → Câble de garde OPGW → Poste d\'interconnexion.',
    connectedToEn: 'GSU 225 kV transformer → Lattice tower Aster 570 mm² → OPGW skywire → Interconnection substation.',
    domainCode: 'D03',
    equipmentSampleId: 'eq-exp-tower-225kv',
    targetView: 'cameroon-grid',
  },
  {
    stageNumber: '04',
    stageId: 'substations',
    titleFr: 'Postes Sources & Nœuds Électriques',
    titleEn: 'Substations & Grid Nodes',
    voltage: '225 kV → 30 kV',
    summaryFr: 'Transformation HTB/HTA, coupure par disjoncteurs SF6, régulation sous charge OLTC et protection différentielle.',
    summaryEn: 'HV/MV transformation, SF6 breaker clearing, OLTC tap changing, and differential protection.',
    subsystemListFr: 'Travée · Disjoncteur · Jeu de barres · Transformateur · Protection',
    subsystemListEn: 'Bay · Breaker · Busbar · Transformer · Protection',
    upstreamFr: 'Arrivée ligne 225 kV, sectionneur de ligne et parafoudres (Stage 03).',
    upstreamEn: 'Incoming 225 kV transmission line, line disconnector and surge arresters (Stage 03).',
    downstreamFr: 'Départs moyenne tension HTA 30 kV vers les boucles de distribution (Stage 05).',
    downstreamEn: '30 kV MV distribution feeders to urban/rural loops (Stage 05).',
    crossCuttingFr: 'CEI 61850 (GOOSE/MMS), ANSI 87T, services auxiliaires 110 V DC/400 V AC, terre de poste.',
    crossCuttingEn: 'IEC 61850 (GOOSE/MMS), ANSI 87T, station 110 V DC / 400 V AC auxiliaries, earthing grid.',
    functionFr: 'Adapter la tension, commuter les flux d\'énergie et isoler sélectivement les défauts réseau.',
    functionEn: 'Transform voltage levels, route power flows, and selectively clear network faults.',
    connectedToFr: 'Jeu de barres 225 kV → Disjoncteur 52 → Transfo 63 MVA → RPN 300A → Jeu de barres 30 kV.',
    connectedToEn: '225 kV Busbar → Breaker 52 → 63 MVA Transformer → 300A Resistor → 30 kV Busbar.',
    domainCode: 'D04',
    equipmentSampleId: 'eq-exp-sub-trafo-225-30',
    targetView: 'diagrams',
  },
  {
    stageNumber: '05',
    stageId: 'distribution',
    titleFr: 'Distribution Moyenne Tension (HTA)',
    titleEn: 'MV Distribution Networks',
    voltage: '30 kV / 15 kV',
    summaryFr: 'Réseaux maillés ou bouclés ouverts, cellules sous enveloppe métallique RMU et transformateurs de distribution H61.',
    summaryEn: 'Open-loop urban rings, metal-enclosed RMU switchgear, and H61 pole distribution transformers.',
    subsystemListFr: 'Départ HTA · Cellule RMU · Transfo distribution · Réseau BT',
    subsystemListEn: 'MV feeder · RMU · Distribution transformer · LV network',
    upstreamFr: 'Rames de cellules 30 kV au poste source abaisseur (Stage 04).',
    upstreamEn: '30 kV switchgear incomer board at step-down substation (Stage 04).',
    downstreamFr: 'Tableaux généraux basse tension TGBT et branchements abonnés (Stage 06).',
    downstreamEn: 'Main LV switchboards (TGBT) and service delivery points (Stage 06).',
    crossCuttingFr: 'Indicateurs de passage de défaut (FPI), réenclencheurs automatiques (ACR), UTE C 13-100.',
    crossCuttingEn: 'Fault passage indicators (FPI), auto-reclosers (ACR), distribution automation.',
    functionFr: 'Distribuer l\'énergie au plus près des agglomérations et zones industrielles.',
    functionEn: 'Deliver medium-voltage power close to urban centers, towns, and industrial clusters.',
    connectedToFr: 'Départ câble HTA → Cellule Schneider SM6 → Transfo H61 160 kVA → Réseau aérien BT torsadé.',
    connectedToEn: 'MV cable feeder → Schneider SM6 RMU → 160 kVA H61 trafo → Bundled aerial LV lines.',
    domainCode: 'D05',
    equipmentSampleId: 'eq-exp-cell-mv-30k',
    targetView: 'domains',
  },
  {
    stageNumber: '06',
    stageId: 'installations',
    titleFr: 'Installations Basse Tension (TGBT)',
    titleEn: 'Electrical Installations & TGBT',
    voltage: '400 V Tri / 230 V Mono',
    summaryFr: 'Point de livraison, comptage tarifaire, tableau TGBT Forme 4b, régimes de neutre TT/TN/IT et disjoncteurs différentiels.',
    summaryEn: 'Point of delivery, metering, Form 4b TGBT switchboard, TT/TN/IT earthing, and RCD protection.',
    subsystemListFr: 'Branchement · Comptage · TGBT · Tableaux div. · Circuits finaux',
    subsystemListEn: 'Service connection · Meter · TGBT · DB · Final circuits',
    upstreamFr: 'Secondaire 400 V du transformateur de distribution HTA/BT (Stage 05).',
    upstreamEn: '400 V secondary of distribution transformer (Stage 05).',
    downstreamFr: 'Appareils d\'utilisation, moteurs, climatiseurs, prises et luminaires (Stage 07).',
    downstreamEn: 'End-use appliances, motors, HVAC, receptacles, and luminaires (Stage 07).',
    crossCuttingFr: 'NF C 15-100 / CEI 60364, sélectivité ampèremétrique et chronométrique, risque Arc Flash IEEE 1584.',
    crossCuttingEn: 'IEC 60364 / NF C 15-100, RCD selectivity, Arc Flash hazard IEEE 1584.',
    functionFr: 'Sécuriser les personnes contre les contacts directs/indirects et distribuer les circuits finaux.',
    functionEn: 'Protect persons against direct/indirect electric shock and feed final branch circuits.',
    connectedToFr: 'Disjoncteur général TGBT → Jeu de barres peigné → Différentiel 30 mA → Disjoncteur divisionnaire.',
    connectedToEn: 'Incomer breaker → Copper busbar comb → 30 mA RCD → Branch circuit breakers.',
    domainCode: 'D06',
    equipmentSampleId: 'eq-exp-tgbt-main-400v',
    targetView: 'journey',
  },
  {
    stageNumber: '07',
    stageId: 'utilization',
    titleFr: 'Usage Final de l\'Électricité',
    titleEn: 'Utilization & Useful Work',
    voltage: '230 V / 400 V',
    summaryFr: 'Conversion finale en travail utile : force motrice industrielle, flux lumineux LED, froid, chaleur et serveurs IT.',
    summaryEn: 'Final conversion into useful work: industrial motor torque, LED lumen flux, HVAC cooling, heat, and IT loads.',
    subsystemListFr: 'Éclairage · CVC · Moteurs · Pompes · IT · Charges critiques',
    subsystemListEn: 'Lighting · HVAC · Motors · Pumps · IT · Critical loads',
    upstreamFr: 'Circuits finaux et disjoncteurs divisionnaires du tableau de distribution (Stage 06).',
    upstreamEn: 'Final branch circuits and miniature breakers of distribution board (Stage 06).',
    downstreamFr: 'Production manufacturière, bien-être humain, puissance de calcul, photons lumineux.',
    downstreamEn: 'Manufacturing output, human comfort, compute capacity, and physical photons.',
    crossCuttingFr: 'Efficacité énergétique ISO 50001, harmoniques THD injectées, facteur de puissance cos φ.',
    crossCuttingEn: 'Energy efficiency ISO 50001, injected harmonic THD, power factor cos φ correction.',
    functionFr: 'Produire le service rendu : lumière, mouvement mécanique, puissance thermique ou calcul.',
    functionEn: 'Deliver the final service: illumination, torque, cooling/heating, or data processing.',
    connectedToFr: 'Prise de courant / Bornier moteur → Boîte à bornes → Enroulements statoriques / Driver LED.',
    connectedToEn: 'Outlet / Motor terminal box → Stator windings / LED electronic driver.',
    domainCode: 'D06',
    equipmentSampleId: 'eq-exp-motor-ind-250kw',
    targetView: 'journey',
  }
];

export const InteractiveJourneySection: React.FC<InteractiveJourneySectionProps> = ({
  locale,
  onNavigateJourney,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(3); // Default to Substations (04)
  const currentStage = STAGES[selectedStageIndex];

  return (
    <section 
      id="interactive-electrical-journey" 
      aria-label="The Interactive Electrical Journey"
      className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase">
              {locale === 'fr' ? 'Étape 01 à 07 · Zoom Sémantique' : 'Stages 01 to 07 · Semantic Zoom'}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="font-mono text-xs text-slate-500 font-bold uppercase">
              {locale === 'fr' ? 'DORSALE MAÎTRESSE DU SYSTÈME' : 'MASTER SYSTEM BACKBONE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
            {locale === 'fr' 
              ? 'Le Parcours Électrique Interactif' 
              : 'The Interactive Electrical Journey'}
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl">
            {locale === 'fr'
              ? 'Une carte connectée avec traçage amont/aval et zoom sémantique progressif. Sélectionnez une étape pour révéler son contexte technique.'
              : 'One connected map with upstream/downstream tracing and progressive semantic zoom. Select any stage to reveal its engineering context.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateJourney(currentStage.stageId)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-xs"
        >
          <span>{locale === 'fr' ? 'Ouvrir Vue Complète' : 'Open Full Journey'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progressive Stage Stepper Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
        {STAGES.map((stage, idx) => {
          const isSelected = idx === selectedStageIndex;
          const isUpstream = idx < selectedStageIndex;
          const isDownstream = idx > selectedStageIndex;

          return (
            <button
              key={stage.stageId}
              type="button"
              onClick={() => setSelectedStageIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                  : isUpstream
                  ? 'bg-slate-50/80 border-slate-200/90 hover:border-slate-300'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
                  <span className={isSelected ? 'text-amber-800' : 'text-slate-500'}>
                    {stage.stageNumber}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold truncate max-w-[70px]">
                    {stage.voltage.split(' ')[0]}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                  {locale === 'fr' ? stage.titleFr : stage.titleEn}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 font-semibold">{stage.domainCode}</span>
                {isSelected ? (
                  <span className="text-amber-800 font-bold">● ACTIF</span>
                ) : isUpstream ? (
                  <span className="text-sky-700 font-medium">← Amont</span>
                ) : (
                  <span className="text-emerald-700 font-medium">Aval →</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Semantic Zoom & Context Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 space-y-6">
        
        {/* Top Header of Selected Stage */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
              <span className="px-2.5 py-1 rounded bg-amber-500 text-white">
                STAGE {currentStage.stageNumber}
              </span>
              <span className="px-2.5 py-1 rounded bg-sky-100 text-sky-900 border border-sky-300">
                {currentStage.voltage}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800">
                DOMAIN: {currentStage.domainCode}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-sans">
              {locale === 'fr' ? currentStage.titleFr : currentStage.titleEn}
            </h3>
            <p className="text-sm text-slate-700 max-w-3xl">
              {locale === 'fr' ? currentStage.summaryFr : currentStage.summaryEn}
            </p>
          </div>

          {/* Direct Action Links */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onSelectDomain(currentStage.domainCode)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold transition-colors"
            >
              {locale === 'fr' ? 'Vue Domaine' : 'Domain View'}
            </button>
            <button
              type="button"
              onClick={() => onSelectEquipment(currentStage.equipmentSampleId)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold transition-colors"
            >
              {locale === 'fr' ? 'Vue Appareillage' : 'Equipment View'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentStage.targetView === 'domains') {
                  onSelectDomain(currentStage.domainCode);
                } else {
                  onNavigateView(currentStage.targetView);
                }
              }}
              className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <span>{locale === 'fr' ? 'Atelier Interactif' : 'Interactive Workbench'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Technical Context Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          
          {/* Block 1: Function */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">
              {locale === 'fr' ? 'FONCTION SYSTÈME' : 'SYSTEM FUNCTION'}
            </span>
            <p className="text-slate-900 font-sans text-xs leading-relaxed font-medium">
              {locale === 'fr' ? currentStage.functionFr : currentStage.functionEn}
            </p>
          </div>

          {/* Block 2: Connected To Chain */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">
              {locale === 'fr' ? 'CHAÎNE DE CONNEXION' : 'PHYSICAL CONNECTION'}
            </span>
            <p className="text-slate-900 font-sans text-xs leading-relaxed font-medium">
              {locale === 'fr' ? currentStage.connectedToFr : currentStage.connectedToEn}
            </p>
          </div>

          {/* Block 3: Upstream & Downstream Tracing */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">
              {locale === 'fr' ? 'TRAÇABILITÉ AMONT / AVAL' : 'UPSTREAM / DOWNSTREAM TRACE'}
            </span>
            <div className="space-y-1 font-sans text-[11px] text-slate-800">
              <div>
                <span className="font-bold text-sky-800">▲ Amont : </span>
                <span>{locale === 'fr' ? currentStage.upstreamFr : currentStage.upstreamEn}</span>
              </div>
              <div>
                <span className="font-bold text-emerald-800">▼ Aval : </span>
                <span>{locale === 'fr' ? currentStage.downstreamFr : currentStage.downstreamEn}</span>
              </div>
            </div>
          </div>

          {/* Block 4: Cross-Cutting Systems */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">
              {locale === 'fr' ? 'SYSTÈMES TRANSVERSAUX' : 'CROSS-CUTTING SYSTEMS'}
            </span>
            <p className="text-slate-900 font-sans text-xs leading-relaxed font-medium">
              {locale === 'fr' ? currentStage.crossCuttingFr : currentStage.crossCuttingEn}
            </p>
          </div>

        </div>

        {/* Step Navigation Controls (Prev / Next) */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={selectedStageIndex === 0}
            onClick={() => setSelectedStageIndex((prev) => Math.max(0, prev - 1))}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Étape Précédente' : 'Previous Stage'}</span>
          </button>

          <span className="font-mono text-xs text-slate-500">
            {selectedStageIndex + 1} / {STAGES.length}
          </span>

          <button
            type="button"
            disabled={selectedStageIndex === STAGES.length - 1}
            onClick={() => setSelectedStageIndex((prev) => Math.min(STAGES.length - 1, prev + 1))}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Stage'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
