// src/components/production/OtherGenerationsJourney.tsx
import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Flame, 
  TreePine, 
  RotateCw, 
  Grid, 
  Layers, 
  Cpu, 
  Box, 
  Radio, 
  Activity, 
  Zap, 
  Filter, 
  Info, 
  ArrowRight,
  Sparkles,
  Atom,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { 
  SOLAR_STAGES, 
  SOLAR_EQUIPMENT_MAP, 
  WIND_STAGES, 
  WIND_EQUIPMENT_MAP,
  THERMAL_STAGES,
  THERMAL_EQUIPMENT_MAP,
  BIOMASS_STAGES,
  BIOMASS_EQUIPMENT_MAP,
  NUCLEAR_STAGES,
  NUCLEAR_EQUIPMENT_MAP
} from './data/otherTechnologiesData';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import type { GenerationTechnologyId, ProcessStageNode, ProductionEquipment } from './types';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

interface OtherGenerationsJourneyProps {
  technologyId: GenerationTechnologyId;
  onSelectTechnology: (techId: GenerationTechnologyId) => void;
  onBackToOverview?: () => void;
  locale?: 'fr' | 'en';
  onSelectGlobalEquipment?: (equipmentId: string) => void;
}

const TECH_META = {
  solar: {
    titleFr: 'Solaire Photovoltaïque (PV)',
    titleEn: 'Solar Photovoltaic Generation',
    taglineFr: 'Conversion quantique photon-électron statique sans pièces mobiles.',
    taglineEn: 'Static quantum photon-electron conversion with no moving parts.',
    stages: SOLAR_STAGES,
    equipmentMap: SOLAR_EQUIPMENT_MAP,
    accentColor: 'from-amber-950 via-slate-900 to-yellow-950',
    borderColor: 'border-amber-700/40',
    icon: Sun
  },
  wind: {
    titleFr: 'Énergie Éolienne (Onshore / Offshore)',
    titleEn: 'Wind Power Generation',
    taglineFr: 'Conversion aérodynamique de l\'énergie cinétique atmosphérique.',
    taglineEn: 'Aerodynamic conversion of atmospheric kinetic wind power.',
    stages: WIND_STAGES,
    equipmentMap: WIND_EQUIPMENT_MAP,
    accentColor: 'from-cyan-950 via-slate-900 to-sky-950',
    borderColor: 'border-cyan-700/40',
    icon: Wind
  },
  thermal: {
    titleFr: 'Centrales Thermiques & Cycles Combinés (CCGT)',
    titleEn: 'Thermal CCGT & Gas/Steam Turbines',
    taglineFr: 'Combustion continue, cycle Brayton gaz et cycle Rankine vapeur.',
    taglineEn: 'Continuous combustion, Brayton gas cycle and Rankine steam cycle.',
    stages: THERMAL_STAGES,
    equipmentMap: THERMAL_EQUIPMENT_MAP,
    accentColor: 'from-orange-950 via-slate-900 to-red-950',
    borderColor: 'border-orange-700/40',
    icon: Flame
  },
  biomass: {
    titleFr: 'Biomasse & Cogénération Industrielle',
    titleEn: 'Biomass & Industrial Cogeneration',
    taglineFr: 'Valorisation thermique de sous-produits agricoles et forestiers.',
    taglineEn: 'Thermal recovery of agricultural and forestry by-products.',
    stages: BIOMASS_STAGES,
    equipmentMap: BIOMASS_EQUIPMENT_MAP,
    accentColor: 'from-emerald-950 via-slate-900 to-teal-950',
    borderColor: 'border-emerald-700/40',
    icon: TreePine
  },
  nuclear: {
    titleFr: 'Énergie Nucléaire & Réacteurs à Eau Pressurisée (PWR / EPR)',
    titleEn: 'Nuclear Power Generation (PWR / EPR)',
    taglineFr: 'Fission contrôlée de l\'Uranium-235, cycle vapeur sous 155 bar et 4 barrières de sûreté.',
    taglineEn: 'Controlled fission of U-235, pressurized water cycle at 155 bar and 4 safety containment barriers.',
    stages: NUCLEAR_STAGES,
    equipmentMap: NUCLEAR_EQUIPMENT_MAP,
    accentColor: 'from-violet-950 via-slate-900 to-indigo-950',
    borderColor: 'border-violet-700/40',
    icon: Atom
  }
};

const CONVERSION_CHAINS: Record<GenerationTechnologyId, { fr: string[]; en: string[] }> = {
  hydro: {
    fr: [
      'Énergie Potentielle (Retenue d\'eau & barrage)',
      'Énergie Cinétique (Conduite forcée à haute vitesse)',
      'Énergie Mécanique (Turbine Francis / Pelton / Kaplan)',
      'Énergie Électrique AC (Alternateur synchrone triphasé)'
    ],
    en: [
      'Potential Energy (Water Reservoir & Dam Head)',
      'Kinetic Energy (High-Velocity Penstock Flow)',
      'Mechanical Torque (Hydraulic Runner)',
      'Electrical AC Energy (Synchronous Alternator)'
    ]
  },
  solar: {
    fr: [
      'Rayonnement Solaire (Flux de photons)',
      'Énergie Électrique DC (Cellules PV silicium P-N)',
      'Conversion Électronique (Onduleur IGBT / MPPT)',
      'Énergie Électrique AC (Poste élévateur & injection réseau)'
    ],
    en: [
      'Solar Radiation (Photon Radiative Flux)',
      'Electrical DC Energy (Silicon P-N Junctions)',
      'Power Electronics Conversion (IGBT Inverter / MPPT)',
      'Electrical AC Energy (Step-up Transformer & Grid Injection)'
    ]
  },
  wind: {
    fr: [
      'Énergie Cinétique Atmosphérique (Vitesse du vent)',
      'Couple Mécanique Aérodynamique (Pales & moyeu asservi)',
      'Conversion Électrique (Génératrice DFIG / PMSG & convertisseur)',
      'Énergie Électrique AC (Transformateur nacelle & réseau HTB)'
    ],
    en: [
      'Atmospheric Kinetic Energy (Wind Velocity)',
      'Aerodynamic Mechanical Torque (Pitch-Controlled Blades & Hub)',
      'Electrical Power Conversion (DFIG / PMSG & Full Converter)',
      'Electrical AC Energy (Nacelle Step-Up & HV Grid)'
    ]
  },
  thermal: {
    fr: [
      'Énergie Chimique Combustible (Gaz naturel / Fioul lourd)',
      'Énergie Thermique de Combustion (Cycle Brayton / Rankine)',
      'Détente Thermomécanique (Turbine à gaz & turbine à vapeur)',
      'Énergie Électrique AC (Alternateur 3 000 tr/min)'
    ],
    en: [
      'Chemical Fuel Energy (Natural Gas / Heavy Fuel Oil)',
      'Thermal Combustion Energy (Brayton / Rankine Heat Cycles)',
      'Thermomechanical Expansion (Gas Turbine & Steam Turbine)',
      'Electrical AC Energy (3,000 rpm Alternator)'
    ]
  },
  biomass: {
    fr: [
      'Énergie Chimique Biomasse (Résidus agricoles / bagasse / bois)',
      'Énergie Thermique (Chaudière à lit fluidisé 65 bar)',
      'Détente Vapeur (Turbine à condensation ou contre-pression)',
      'Énergie Électrique AC (Alternateur synchrone)'
    ],
    en: [
      'Chemical Biomass Enthalpy (Forestry / Agri Residues)',
      'Thermal Steam Energy (Fluidized Bed Boiler 65 bar)',
      'Steam Expansion (Condensing / Backpressure Turbine)',
      'Electrical AC Energy (Synchronous Alternator)'
    ]
  },
  nuclear: {
    fr: [
      'Énergie de Liaison Nucléaire (Fission contrôlée U-235)',
      'Chaleur Primaire Haute Pression (Cuve réacteur 155 bar / 325 °C)',
      'Enthalpie Vapeur Secondaire (Générateurs de vapeur 70 bar)',
      'Couple Mécanique (Ligne d\'arbres HP & BP 1 500 tr/min)',
      'Énergie Électrique AC (Alternateur 1 650 MWe / 400 kV)'
    ],
    en: [
      'Nuclear Binding Energy (Controlled U-235 Fission)',
      'High-Pressure Primary Heat (RPV Core at 155 bar / 325 °C)',
      'Secondary Steam Enthalpy (Steam Generators at 70 bar)',
      'Mechanical Torque (HP & Triple LP Shaft at 1,500 rpm)',
      'Electrical AC Energy (1,650 MWe Alternator / 400 kV)'
    ]
  }
};

const TECH_CHARACTERISTICS: Record<GenerationTechnologyId, {
  advantagesFr: string[];
  advantagesEn: string[];
  limitationsFr: string[];
  limitationsEn: string[];
  challengesFr: string[];
  challengesEn: string[];
  gridRoleFr: string;
  gridRoleEn: string;
}> = {
  hydro: {
    advantagesFr: ['Énergie renouvelable programmable et stockable', 'Démarrage rapide (quelques minutes) pour le réglage fréquence', 'Rendement global très élevé (> 90%)', 'Apport d\'inertie synchrone naturelle'],
    advantagesEn: ['Dispatchable, renewable and energy-storing capability', 'Black-start and rapid ramp-up in minutes for frequency regulation', 'Highest overall conversion efficiency (> 90%)', 'Substantial natural synchronous inertia'],
    limitationsFr: ['Investissement initial de génie civil très lourd', 'Dépendance hydrologique aux saisons sèches', 'Impact environnemental et submersion de vallées'],
    limitationsEn: ['High initial capital cost for dam and civil structures', 'Seasonal hydrological dependency on dry-season river discharge', 'Environmental impact and valley inundation'],
    challengesFr: ['Sédimentation des retenues et érosion des turbines par le sable', 'Gestion des crues extrêmes et sécurité des barrages', 'Coups de bélier hydrauliques lors des variations brusques'],
    challengesEn: ['Reservoir sedimentation and abrasive runner silt erosion', 'Extreme flood management and dam structural safety', 'Hydraulic water hammer transients during fast governor trips'],
    gridRoleFr: 'Pilier fondamental de base et de réglage de fréquence primaire/secondaire (ex. Nachtigal 420 MW et Song Loulou 384 MW au Cameroun).',
    gridRoleEn: 'Core backbone for baseload and primary/secondary frequency containment (e.g. Nachtigal 420 MW and Song Loulou 384 MW in Cameroon).'
  },
  solar: {
    advantagesFr: ['Ressource inépuisable et universelle', 'Coût marginal de production nul (OPEX très bas)', 'Installation modulaire et rapide', 'Zéro émission de gaz à effet de serre en exploitation'],
    advantagesEn: ['Abundant and globally available natural resource', 'Zero marginal generation cost with minimal operational OPEX', 'Modular, scalable and rapid construction timelines', 'Zero greenhouse gas emissions during operation'],
    limitationsFr: ['Intermittence diurne et absence de production nocturne', 'Faible densité énergétique au sol (1 à 2 ha par MWc)', 'Nécessite des stockages BESS pour le report de charge'],
    limitationsEn: ['Diurnal intermittency with zero nighttime production', 'Low land power density requiring 1-2 hectares per MWp', 'Requires BESS battery storage for evening peak matching'],
    challengesFr: ['Effet de rampe rapide au passage nuageux (dI/dt élevé)', 'Absence d\'inertie mécanique naturelle (convertisseurs statiques)', 'Gestion de la tension en bout de ligne MT par injection d\'énergie réactive'],
    challengesEn: ['Cloud-cover fast generation ramp transients (high dP/dt)', 'Zero inherent mechanical inertia (inverter-based resources)', 'Feeder tail voltage rise requiring dynamic reactive control'],
    gridRoleFr: 'Production d\'appoint en journée délestant les centrales hydroélectriques de stockage (ex. Maroua et Guider 30 MWc dans le Grand Nord du Cameroun).',
    gridRoleEn: 'Midday solar generation displacing seasonal hydro storage (e.g. Maroua and Guider 30 MWp in Northern Cameroon).'
  },
  wind: {
    advantagesFr: ['Excellente complémentarité saisonnière avec le solaire', 'Empreinte au sol réduite (terres agricoles préservées)', 'Facteurs de charge élevés en offshore (> 45%)', 'Zéro consommation d\'eau de refroidissement'],
    advantagesEn: ['Strong seasonal complementarity with solar generation', 'Small tower ground footprint leaving farming land usable', 'High capacity factor in offshore locations (> 45%)', 'Zero freshwater consumption for thermal cooling'],
    limitationsFr: ['Variabilité stochastique du vent nécessitant des réserves tournantes', 'Impact visuel et sonore sur les riverains', 'Efforts mécaniques extrêmes de fatigue sur les pales et la tour'],
    limitationsEn: ['Stochastic wind variability requiring spinning reserves', 'Visual and acoustic landscape constraints', 'Severe mechanical fatigue loading on blades, hub and tower'],
    challengesFr: ['Traversée des creux de tension réseau (FRT / Fault Ride Through)', 'Stabilité subsynchrone (SSO) lors du raccordement sur lignes compensées', 'Gestion de l\'inertie synthétique par les convertisseurs de puissance'],
    challengesEn: ['Fault Ride Through (FRT) compliance during grid short-circuits', 'Subsynchronous oscillation (SSO) risk near series capacitors', 'Grid-forming synthetic inertia provision via modern converters'],
    gridRoleFr: 'Injection de puissance renouvelable massive en réseau HTB avec régulation active de pente P(f) et Q(U).',
    gridRoleEn: 'Bulk renewable power injection into HV transmission with active P(f) frequency and Q(U) voltage support.'
  },
  thermal: {
    advantagesFr: ['Disponibilité totale à la demande (dispatchable à 100%)', 'Indépendance vis-à-vis des conditions météorologiques', 'Inertie synchrone très élevée contribuant à la tenue de fréquence', 'Démarrage rapide pour les turbines à gaz simples (OCGT)'],
    advantagesEn: ['Fully dispatchable firm capacity available on demand', 'Complete independence from weather and climate variations', 'Substantial synchronous inertia bolstering grid frequency', 'Rapid open-cycle gas turbine (OCGT) peaker starting in 15 min'],
    limitationsFr: ['Émissions de CO2, NOx et gaz à effet de serre', 'Coût d\'exploitation directement dépendant du prix du combustible', 'Rendement thermodynamique limité par le cycle de Carnot'],
    limitationsEn: ['CO2, NOx and greenhouse gas atmospheric emissions', 'OPEX heavily exposed to global fossil fuel price volatility', 'Thermodynamic efficiency bounded by Carnot cycle temperatures'],
    challengesFr: ['Optimisation du rendement du cycle combiné gaz/vapeur (jusqu\'à 60%)', 'Refroidissement des aubes de turbine à gaz au-delà de 1 400 °C', 'Conformité aux normes antipollution strictes (filtres catalytiques SCR)'],
    challengesEn: ['Maximizing CCGT combined-cycle efficiency up to 60%', 'Advanced blade cooling under gas firing temperatures > 1,400 °C', 'Meeting stringent environmental emission limits (SCR deNOx)'],
    gridRoleFr: 'Centrale de base ou de pointe indispensable pour la garantie de fourniture lors des étiages (ex. Kribi Gaz 216 MW au Cameroun).',
    gridRoleEn: 'Firm baseload and peaking capacity safeguarding security of supply during dry seasons (e.g. Kribi Gas 216 MW in Cameroon).'
  },
  biomass: {
    advantagesFr: ['Bilan carbone neutre par absorption photosynthétique du CO2', 'Valorisation de déchets industriels et agricoles locaux', 'Fourniture combinée de vapeur industrielle et d\'électricité (cogénération)', 'Production pilotable non intermittente'],
    advantagesEn: ['Carbon-neutral lifecycle via biological CO2 sequestration', 'Valuable reuse of agricultural and industrial residues', 'Combined heat and power (CHP) industrial cogeneration', 'Firm dispatchable power immune to weather intermittency'],
    limitationsFr: ['Chaîne logistique complexe de collecte et de séchage du combustible', 'Pouvoir calorifique inférieur (PCI) variable et humide', 'Taille unitaire modeste (10 à 50 MW)'],
    limitationsEn: ['Logistical complexity of seasonal biomass collection and drying', 'Variable moisture content and lower heating value (LHV)', 'Smaller unit scale constrained by transport distances (10-50 MW)'],
    challengesFr: ['Corrosion des tubes de surchauffeur par les sels de potassium et chlore', 'Formation de mâchefers et agglomération dans le lit fluidisé', 'Efficacité de filtration des particules fines dans les fumées'],
    challengesEn: ['Superheater tube corrosion from alkaline potassium chlorides', 'Ash slagging and sand agglomeration in fluidized bed boilers', 'High-efficiency baghouse dust removal for clean flue gas'],
    gridRoleFr: 'Alimentation autonome de complexes agro-industriels avec réinjection de surplus sur le réseau de distribution.',
    gridRoleEn: 'Self-generation for agro-industrial estates with surplus export injected into the local distribution grid.'
  },
  nuclear: {
    advantagesFr: ['Zéro émission de CO2 en exploitation', 'Facteur de charge exceptionnel (> 90% en base continue)', 'Inertie synchrone réseau titanesque (H = 5.5 s pour 1 650 MWe)', 'Grande autonomie de combustible (18 mois sans rechargement)'],
    advantagesEn: ['Zero greenhouse gas and CO2 emissions in operation', 'Unmatched capacity factor (> 90% baseload continuous run)', 'Gigantic synchronous grid inertia stabilizing grid frequency', 'Long fuel autonomy with 18-month refueling cycles'],
    limitationsFr: ['Coût d\'investissement initial et durée de construction très longs', 'Gestion à long terme des déchets hautement radioactifs', 'Besoin impératif d\'une source froide thermique majeure (fleuve ou mer)'],
    limitationsEn: ['High initial capital outlay and lengthy construction licensing', 'Long-term disposal requirements for high-level radioactive waste', 'Massive cold heat-sink requirements (large river or sea coast)'],
    challengesFr: ['Garantie absolue des 4 barrières de sûreté et évacuation de la puissance résiduelle', 'Vieillissement sous flux neutronique des aciers de cuve', 'Sécurité passive en cas de perte totale des alimentations électriques (station blackout)'],
    challengesEn: ['Absolute integrity of 4 safety barriers and decay heat removal', 'Neutron embrittlement monitoring of reactor pressure vessel steel', 'Passive safety under complete station blackout (SBO) conditions'],
    gridRoleFr: 'Fourniture de la charge de base massive ultra-stable avec participation active aux réglages de fréquence et de tension THT 400 kV.',
    gridRoleEn: 'Dominant baseload energy supply anchor with active participation in 400 kV primary/secondary voltage and frequency control.'
  }
};

export const OtherGenerationsJourney: React.FC<OtherGenerationsJourneyProps> = ({
  technologyId,
  onSelectTechnology,
  onBackToOverview,
  locale = 'fr',
  onSelectGlobalEquipment
}) => {
  if (technologyId === 'hydro') {
    return null;
  }

  const meta = TECH_META[technologyId];
  const [activeStageId, setActiveStageId] = useState<string>(meta.stages[1]?.id || meta.stages[0].id);
  const [selectedEquipment, setSelectedEquipment] = useState<ProductionEquipment | null>(null);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);

  const activeStage = meta.stages.find(s => s.id === activeStageId) || meta.stages[0];
  const activeEquipment = meta.equipmentMap[activeStage.equipmentId] || Object.values(meta.equipmentMap)[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${meta.accentColor} border ${meta.borderColor} p-6 sm:p-8 shadow-xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {onBackToOverview && (
                <button
                  onClick={onBackToOverview}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
                >
                  ← {locale === 'en' ? 'Generation Overview' : 'Domaine Production'}
                </button>
              )}
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-slate-700 font-semibold">
                {locale === 'en' ? `Sector: ${meta.titleEn}` : `Filière : ${meta.titleFr}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {locale === 'en' ? `Technical Journey: ${meta.titleEn}` : `Parcours Technique : ${meta.titleFr}`}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {locale === 'en'
                ? `${meta.taglineEn} Complete energy conversion chain from raw primary resource to grid interconnection.`
                : `${meta.taglineFr} Processus complet depuis la ressource primaire jusqu'au raccordement au réseau électrique.`}
            </p>
          </div>

          {/* Quick Technology Switcher */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {(['hydro', 'solar', 'wind', 'thermal', 'biomass', 'nuclear'] as GenerationTechnologyId[]).map((tId) => (
              <button
                key={tId}
                onClick={() => onSelectTechnology(tId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left capitalize ${
                  technologyId === tId
                    ? 'bg-white text-slate-950 font-bold shadow'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {tId === 'hydro' ? '💧 Hydroélectricité' :
                 tId === 'solar' ? '☀️ Solaire PV' :
                 tId === 'wind' ? '💨 Éolien' :
                 tId === 'thermal' ? '🔥 Thermique & Gaz' :
                 tId === 'biomass' ? '🌿 Biomasse' :
                 '⚛️ Nucléaire PWR'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. VISUAL ENERGY CONVERSION PROCESS BANNER (Phase 4 Specification) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-amber-400">
              {locale === 'en' ? 'Energy Conversion Process Chain' : 'Chaîne de Conversion Énergétique'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {locale === 'en' ? 'Physics → Mechanics → Electrotechnics' : 'Physique → Mécanique → Électrotechnique'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(locale === 'en' ? CONVERSION_CHAINS[technologyId]?.en || [] : CONVERSION_CHAINS[technologyId]?.fr || []).map((step, idx, arr) => (
            <div
              key={idx}
              className="relative p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-2 group hover:border-sky-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 font-mono text-xs font-bold flex items-center justify-center border border-sky-800/60">
                  {idx + 1}
                </span>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block -mr-1" />
                )}
              </div>
              <p className="text-xs font-medium text-slate-200 leading-snug">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIAL INFOGRAPHIC: Thermal Power Plant Energy Conversion */}
      {technologyId === 'thermal' && (
        <div className="w-full">
          <EngineeringInfographicCard
            infographicId="thermal_power_conversion"
            locale={locale || 'fr'}
            onOpenModal={(id) => setModalInfographicId(id)}
          />
        </div>
      )}

      {/* Ribbon current state */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider font-mono shrink-0">
          <Sparkles className="w-4 h-4" />
          État Actuel de l'Énergie :
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full py-1 text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 text-white border border-slate-700 font-medium whitespace-nowrap">
            Étape {activeStage.stepNumber} : {activeStage.labelFr}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium whitespace-nowrap">
            {activeStage.energyStateFr}
          </span>
          {activeStage.voltageLevel && (
            <>
              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/60 font-bold whitespace-nowrap font-mono">
                {activeStage.voltageLevel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* The Horizontal Chain Navigator */}
      <div className="space-y-2">
        <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {meta.stages.map((stage, idx) => {
              const isCurrent = stage.id === activeStageId;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveStageId(stage.id)}
                    className={`group relative p-3.5 rounded-xl border text-left transition-all w-48 flex flex-col justify-between h-32 ${
                      isCurrent
                        ? 'bg-slate-800 border-white shadow-lg scale-105 z-10 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCurrent ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {stage.stepNumber}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold line-clamp-2">
                        {stage.labelFr}
                      </div>
                      {stage.voltageLevel && (
                        <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                          {stage.voltageLevel}
                        </span>
                      )}
                    </div>
                  </button>

                  {idx < meta.stages.length - 1 && (
                    <div className="w-4 h-0.5 bg-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Equipment spotlight card */}
      {activeEquipment ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  {activeEquipment.tag}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {activeEquipment.subsystem}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activeEquipment.name}
              </h3>
              <p className="text-xs text-slate-400 italic">
                {activeEquipment.nameEn}
              </p>
            </div>

            <button
              onClick={() => setSelectedEquipment(activeEquipment)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/20 shrink-0"
            >
              <Info className="w-4 h-4" />
              Ouvrir le Dossier Technique Complet (24 Points)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-cyan-400 font-semibold">Définition & Fonction</h4>
              <p className="leading-relaxed">{activeEquipment.purpose}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-emerald-400 font-semibold">Flux & Rendement</h4>
              <p className="leading-relaxed">{activeEquipment.energyFlow.outflow}</p>
              <div className="text-emerald-300 font-bold pt-1">
                Rendement typique : {activeEquipment.energyFlow.efficiencyTypical}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-amber-400 font-semibold">Rôle dans la Centrale</h4>
              <p className="leading-relaxed">{activeEquipment.electricalRole}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
          Équipement de cette étape en cours de restitution. Cliquez sur une autre étape pour afficher la fiche technique.
        </div>
      )}

      {/* 2. ENGINEERING CHARACTERISTICS, CHALLENGES & GRID INTEGRATION (Phase 4 Specification) */}
      {TECH_CHARACTERISTICS[technologyId] && (
        <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#222B38] pb-3">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              {locale === 'en' ? 'Engineering Synthesis: Operational Characteristics & Grid Integration' : 'Synthèse d’Ingénierie : Caractéristiques d’Exploitation & Intégration Réseau'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Advantages */}
            <div className="p-4 rounded-xl bg-[#0E141F] border border-emerald-900/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>{locale === 'en' ? 'Advantages' : 'Avantages & Atouts'}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {(locale === 'en' ? TECH_CHARACTERISTICS[technologyId].advantagesEn : TECH_CHARACTERISTICS[technologyId].advantagesFr).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations & Operational Challenges */}
            <div className="p-4 rounded-xl bg-[#0E141F] border border-amber-900/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>{locale === 'en' ? 'Limitations & Challenges' : 'Contraintes & Défis Métier'}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {(locale === 'en' ? TECH_CHARACTERISTICS[technologyId].challengesEn : TECH_CHARACTERISTICS[technologyId].challengesFr).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grid Integration Role */}
            <div className="p-4 rounded-xl bg-[#0E141F] border border-sky-900/30 space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase">
                <Zap className="w-4 h-4" />
                <span>{locale === 'en' ? 'Grid Integration & Inertia' : 'Rôle dans le Réseau & Inertie'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'en' ? TECH_CHARACTERISTICS[technologyId].gridRoleEn : TECH_CHARACTERISTICS[technologyId].gridRoleFr}
              </p>
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[11px] font-mono text-sky-300">
                {locale === 'en' ? 'Grid Code: IEC 60034 / ENTSO-E / SONATREL' : 'Code Réseau : CEI 60034 / ARSEL / SONATREL'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment detail modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onSelectEquipment={onSelectGlobalEquipment}
          allEquipmentMap={meta.equipmentMap}
          locale={locale}
        />
      )}

      {/* Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale || 'fr'}
        />
      )}
    </div>
  );
};
