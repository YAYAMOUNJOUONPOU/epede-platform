// src/components/substations/SubstationFireAndControlBuilding.tsx
// EPEDE D04 - Substation Control Building Architecture, Oil Retention & Transformer Fire Safety
// REI 240 Blast Firewall Matrix, NF C 13-200 / IEEE 980 Oil Containment & Quenching Grate, Technical Rooms & VESDA/IG-55

import React, { useState } from 'react';
import {
  Building2,
  Flame,
  ShieldAlert,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Zap,
  Activity,
  Gauge,
  Droplets,
  Server,
  Wind,
  BatteryCharging,
  Radio,
  Lock
} from 'lucide-react';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import { TransformerFireContainmentDelugeSimulator } from './modules/TransformerFireContainmentDelugeSimulator';

interface SubstationFireAndControlBuildingProps {
  locale: 'fr' | 'en';
}

type BuildingTab = 'TECHNICAL_ROOMS' | 'TRANSFORMER_FIRE_PIT' | 'FIREWALL_BLAST' | 'FIRE_SUPPRESSION';

export const SubstationFireAndControlBuilding: React.FC<SubstationFireAndControlBuildingProps> = ({
  locale
}) => {
  const [activeTab, setActiveTab] = useState<BuildingTab>('TECHNICAL_ROOMS');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('RELAY_ROOM');
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);

  // Transformer Fire Pit Simulation State
  const [transformerMva, setTransformerMva] = useState<number>(100); // 100 MVA
  const [oilVolumeLitres, setOilVolumeLitres] = useState<number>(35000); // 35,000 Liters mineral oil
  const [rainfallAllowanceMm, setRainfallAllowanceMm] = useState<number>(150); // 150 mm 24h storm
  const [firefightingWaterLitres, setFirefightingWaterLitres] = useState<number>(20000); // 20,000 L water deluge

  // IEEE 980 / NF C 13-200 Calculations
  // Total retention bund capacity required = 100% oil volume + 100% firefighting water + rainfall
  const bundAreaM2 = 120; // 12m x 10m bund footprint
  const rainfallVolumeLitres = bundAreaM2 * rainfallAllowanceMm; // 120 * 150 = 18,000 L
  const totalContainmentVolumeLitres = oilVolumeLitres + firefightingWaterLitres + rainfallVolumeLitres;
  const minimumPitDepthM = Number((totalContainmentVolumeLitres / (bundAreaM2 * 1000)).toFixed(2));

  // Technical rooms layout data
  const technicalRooms = [
    {
      id: 'RELAY_ROOM',
      name_fr: 'Salle des Relais & SAS (IED / BCU)',
      name_en: 'Relay & Automation Room (IED / BCU)',
      badge: 'CŒUR NUMÉRIQUE',
      color: 'sky',
      icon: Cpu,
      tempRequirement: '21°C ± 2°C (Clim redondante N+1)',
      hvacFilter: 'Filtration F7 / H13 salle propre',
      fireClass: 'Détection VESDA + Extinction Gaz Inerte IG-55',
      raisedFloor: 'Faux-plancher 600 mm antistatique (câbles cuivre + fibres optiques)',
      description_fr: "Héberge les armoires de contrôle-commande numérique, les baies de protection différentielle et de distance (Main 1 & Main 2), les passerelles de téléconduite RTU et les switchs Ethernet HSR/PRP de l'IEC 61850.",
      description_en: "Houses digital control cubicles, differential and distance protection racks (Main 1 & Main 2), SCADA RTU telecontrol gateways, and IEC 61850 Station Bus HSR/PRP redundant Ethernet switches."
    },
    {
      id: 'BATTERY_ROOM',
      name_fr: 'Local Batteries 110 Vcc Sécurisé',
      name_en: '110 V DC Secure Battery Room',
      badge: 'ATEX ZONE 1',
      color: 'emerald',
      icon: BatteryCharging,
      tempRequirement: '20°C - 25°C (Optimisation durée de vie VRLA)',
      hvacFilter: 'Extraction d\'air forcée antidéflagrante Ex-d',
      fireClass: 'Détecteurs d\'hydrogène H2 seuils 1% & 2% LIE',
      raisedFloor: 'Carrelage anti-acide en céramique + cuvette de rétention électrolyte',
      description_fr: "Héberge les bancs d'accumulateurs 110 Vcc du Train A et du Train B. L'hydrogène émis en phase d'égalisation est évacué en toiture par extracteur Ex-d pour éviter toute atmosphère explosive.",
      description_en: "Houses 110 V DC dual-train battery racks. Hydrogen generated during boost equalizing is continuously evacuated through an Ex-d roof extractor to eliminate explosive gas buildup."
    },
    {
      id: 'AC_DC_ROOM',
      name_fr: 'Local Tableaux Basse Tension (ACDB & DCDB)',
      name_en: 'LV Switchgear & Distribution Room',
      badge: 'SERVICES AUXILIAIRES',
      color: 'amber',
      icon: Zap,
      tempRequirement: '25°C maxi',
      hvacFilter: 'Ventilation mécanique contrôlée',
      fireClass: 'Extincteurs CO2 portatifs + Détecteurs optiques',
      raisedFloor: 'Caniveaux béton avec dalles coupe-feu amovibles',
      description_fr: "Contient le tableau général basse tension 400 Vca (ACDB), les armoires de distribution 110 Vcc, les redresseurs-chargeurs statiques à thyristors et l'inverseur automatique Normal/Secours (ATS).",
      description_en: "Contains the 400 V AC station service switchboard, 110 V DC distribution panels, dual thyristor battery chargers, and the automatic transfer switch (ATS) with standby diesel sequencing."
    },
    {
      id: 'TELECOM_ROOM',
      name_fr: 'Local Télécoms & Fibre Optique OPGW',
      name_en: 'Telecom & OPGW Demarcation Room',
      badge: 'TRANSMISSION',
      color: 'cyan',
      icon: Radio,
      tempRequirement: '20°C - 24°C',
      hvacFilter: 'Air sec déshumidifié',
      fireClass: 'Extinction automatique au gaz propre',
      raisedFloor: 'Chemins de câbles optiques haute densité jaunes',
      description_fr: "Tiroirs optiques de tête de ligne OPGW 225 kV, multiplexeurs SDH / MPLS-TP pour communication avec le dispatching national (SONATREL), horloges Grandmaster GPS PTP IEEE 1588.",
      description_en: "Optical fiber distribution frames for 225 kV overhead line OPGW cables, SDH / MPLS-TP transport multiplexers connecting national grid dispatching, and IEEE 1588 PTP GPS grandmasters."
    },
    {
      id: 'CONTROL_ROOM',
      name_fr: 'Salle de Conduite Locale & Pupitre IHM',
      name_en: 'Local Dispatch & HMI Operating Room',
      badge: 'POSTE DE GARDE',
      color: 'purple',
      icon: Building2,
      tempRequirement: 'Confort humain 22°C',
      hvacFilter: 'Climatisation split réversible',
      fireClass: 'Alarme sonore + Répétiteur synoptique incendie',
      raisedFloor: 'Sol antistatique',
      description_fr: "Écrans synoptiques du poste complet, tableau de commande de secours à clés de consignation LOTO, enregistreur d'événements SOE (résolution 1 ms) et bureau d'exploitation.",
      description_en: "Complete substation graphic HMI consoles, hardwired emergency trip console with LOTO key interlocks, 1 ms Sequence of Events recorder, and local engineering workstations."
    }
  ];

  const currentRoom = technicalRooms.find(r => r.id === selectedRoomId) || technicalRooms[0];

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Header & Navigation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Génie Civil, Bâtiment de Commande & Sécurité Incendie"
                    : "Substation Civil Architecture, Oil Containment & Fire Safety"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 text-[10px] font-bold border border-rose-700/50">
                  REI 240 / IEEE 980 / NF C 13-200
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Cloisonnement pare-feu 4 heures, fosse d'extinction d'huile sous galets, et aménagement ATEX des salles techniques."
                  : "4-hour blast firewall separation, hydrocarbon retention bund with flame-quenching pebbles, and technical room architectures."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold">
              ● NORMES ENVIRONNEMENTALES CONFORMES
            </span>
          </div>
        </div>

        {/* 4 Civil & Fire Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('TECHNICAL_ROOMS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'TECHNICAL_ROOMS'
                ? 'bg-rose-500 text-slate-950 font-bold border-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-rose-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'TECHNICAL_ROOMS' ? 'bg-slate-950 text-rose-300' : 'bg-slate-800 text-slate-400'
              }`}>
                BÂTIMENT RELAIS
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'TECHNICAL_ROOMS' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '1. Salles Techniques & ATEX' : '1. Technical Rooms & ATEX'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'TECHNICAL_ROOMS' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Batteries Ex-d · Faux-plancher 60cm
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TRANSFORMER_FIRE_PIT')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'TRANSFORMER_FIRE_PIT'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'TRANSFORMER_FIRE_PIT' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                SIMULATEUR COMPLET
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'TRANSFORMER_FIRE_PIT' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '2. Rétention, Pare-Feu & Déluge' : '2. Containment, Blast & Deluge'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'TRANSFORMER_FIRE_PIT' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              IEEE 980 · NFPA 850 · NIFPS / SERGI
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FIREWALL_BLAST')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'FIREWALL_BLAST'
                ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-sky-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'FIREWALL_BLAST' ? 'bg-slate-950 text-sky-300' : 'bg-slate-800 text-slate-400'
              }`}>
                REI 120 / REI 240
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'FIREWALL_BLAST' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '3. Murs Pare-Feu & Anti-Souffle' : '3. Blast Firewalls'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'FIREWALL_BLAST' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Béton armé 4h &middot; Distance &lt; 15m
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FIRE_SUPPRESSION')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'FIRE_SUPPRESSION'
                ? 'bg-purple-500 text-slate-950 font-bold border-purple-400 shadow-md shadow-purple-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-purple-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'FIRE_SUPPRESSION' ? 'bg-slate-950 text-purple-300' : 'bg-slate-800 text-slate-400'
              }`}>
                DÉLUGES & GAZ
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'FIRE_SUPPRESSION' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '4. Extinction & VESDA' : '4. Deluge & VESDA Detection'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'FIRE_SUPPRESSION' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              IG-55 · Dépressurisation Transfo
            </div>
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Volume Huile Transformateur</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-amber-400">
                {(oilVolumeLitres / 1000).toFixed(1)} m³
              </span>
              <span className="text-[10px] text-slate-500">({oilVolumeLitres.toLocaleString()} L)</span>
            </div>
            <span className="text-[9px] text-slate-500">Huile minérale naphténique</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Capacité Rétention Fosse</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-emerald-400">
                {(totalContainmentVolumeLitres / 1000).toFixed(1)} m³
              </span>
              <span className="text-[10px] text-slate-500">Requis min.</span>
            </div>
            <span className="text-[9px] text-slate-500">Profondeur cuve : {minimumPitDepthM} m</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Résistance Mur Pare-Feu</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-rose-400">REI 240</span>
              <span className="text-[10px] text-slate-500">(4 Heures)</span>
            </div>
            <span className="text-[9px] text-slate-500">Béton armé d'épaisseur 30 cm</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Protection Salle Batteries</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-teal-400">Ex-d IIB+H2</span>
              <span className="text-[10px] text-slate-500">&lt; 1% LIE H2</span>
            </div>
            <span className="text-[9px] text-slate-500">Ventilation forcée antidéflagrante</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TECHNICAL ROOMS ARCHITECTURE & ATEX VENTILATION */}
      {/* ========================================================================= */}
      {activeTab === 'TECHNICAL_ROOMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 5 Cols: Technical Rooms Selector */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block px-1">
              {locale === 'fr' ? 'Salles Techniques du Bâtiment de Commande :' : 'Technical Substation Rooms:'}
            </span>
            {technicalRooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const IconComponent = room.icon;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#121B29] border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-[#090D14] border-[#1E2634] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {locale === 'fr' ? room.name_fr : room.name_en}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {room.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 7 Cols: Detailed Engineering Specs of Selected Room */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-white uppercase">
                  {locale === 'fr' ? currentRoom.name_fr : currentRoom.name_en}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                {currentRoom.badge}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? currentRoom.description_fr : currentRoom.description_en}
            </p>

            {/* Engineering Parameters Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                  <Wind className="h-3.5 w-3.5 text-sky-400" />
                  Régulation Thermique / CVC :
                </span>
                <span className="text-sky-300 font-bold font-mono text-xs block">
                  {currentRoom.tempRequirement}
                </span>
                <span className="text-[10px] text-slate-500 font-sans block">
                  {currentRoom.hvacFilter}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  Sécurité & Protection Incendie :
                </span>
                <span className="text-rose-300 font-bold font-mono text-xs block">
                  {currentRoom.fireClass}
                </span>
                <span className="text-[10px] text-slate-500 font-sans block">
                  Arrêt d'urgence CVC couplé centrale incendie
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1 sm:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  Revêtement de Sol & Planchers Techniques :
                </span>
                <span className="text-slate-200 font-medium font-sans text-[11px] block">
                  {currentRoom.raisedFloor}
                </span>
              </div>
            </div>

            {/* Special ATEX Battery Room Callout */}
            {selectedRoomId === 'BATTERY_ROOM' && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                  <AlertTriangle className="h-4 w-4" />
                  <span>RÈGLE NORMATIVE NF C 15-100 / EN 50272-2 (DÉGAGEMENT H2) :</span>
                </div>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  En fin de charge d'égalisation (2,38 V/él.), les batteries dégagent de l'hydrogène gazeux (H2). L'air doit être extrait au point le plus haut du plafond par une turbine antidéflagrante avec débit d'air Q = 0.05 × N × I_charge (m³/h), maintenant la concentration sous 1% de la LIE (Limite Inférieure d'Explosivité = 4%).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OIL RETENTION BUND, BLAST WALL & ACTIVE FIRE SUPPRESSION SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'TRANSFORMER_FIRE_PIT' && (
        <TransformerFireContainmentDelugeSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BLAST-RESISTANT FIREWALL SEPARATION MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'FIREWALL_BLAST' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? "Critères d'Espacement & Murs Coupe-Feu en Béton Armé REI 240"
                  : "Transformer Separation Distances & REI 240 Blast Firewall Matrix"}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800">
              CEI 61936-1 / NFPA 850
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <span className="text-rose-400 font-bold text-xs block">
                Distance &lt; 10 mètres : Mur REI 240 Obligatoire
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? "Si la distance libre entre deux transformateurs de plus de 1000 litres d'huile est inférieure à 10 m, un mur pare-feu en béton armé REI 240 (résistance 4 heures à 1100°C) est obligatoire. Le mur doit dépasser la cuve de 1 mètre en hauteur et sur les côtés."
                  : "When separation clearance between adjacent transformers exceeding 1,000 L of oil is below 10 meters, a reinforced concrete firewall with REI 240 rating (4-hour hydrocarbon endurance) is mandatory. It must project 1 m above tank height and beyond side margins."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <span className="text-amber-400 font-bold text-xs block">
                Distance 10 à 15 mètres : Déluge Eau ou Mur REI 120
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? "Entre 10 et 15 mètres d'espacement, la norme permet soit un mur REI 120 (2 heures), soit l'installation d'un rideau d'eau deluge à pulvérisation haute vélocité protégeant le transformateur voisin pour éviter la propagation thermique par rayonnement."
                  : "Between 10 and 15 meters separation, standards allow either an REI 120 concrete wall or an automatic high-velocity water deluge curtain shielding the adjacent transformer against radiative thermal ignition."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <span className="text-emerald-400 font-bold text-xs block">
                Distance &gt; 15 mètres : Espacement Libre Sécurisé
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? "Au-delà de 15 mètres, le flux thermique radiatif d'un incendie majeur d'huile (< 12.5 kW/m²) est insuffisant pour auto-enflammer la peinture ou détruire les joints d'un transformateur voisin. Aucun mur n'est requis."
                  : "Beyond 15 meters, the radiative heat flux from an open oil fire (< 12.5 kW/m²) is insufficient to cause auto-ignition or compromise gaskets on adjacent equipment. No firewall barrier is required."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ADVANCED FIRE SUPPRESSION & VESDA */}
      {/* ========================================================================= */}
      {activeTab === 'FIRE_SUPPRESSION' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <Wind className="h-4 w-4 text-purple-400" />
              <span>Système d'Extinction à Gaz Inerte IG-55 (Argonite)</span>
            </h3>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Déployé dans la salle des relais et serveurs SCADA. L'Argonite (50% Argon, 50% Azote N2) abaisse la concentration en oxygène de 21% à 12,5%, suffisant pour étouffer toute combustion sans danger immédiat pour la vie humaine (pas de toxicité, visibilité préservée, zéro résidu corrosif sur l'électronique)."
                : "Engineered for relay rooms and SCADA server halls. Argonite (50% Ar, 50% N2) reduces room oxygen concentration from 21% to 12.5%, extinguishing electrical fires while remaining safe for personnel egress with zero corrosive residue on sensitive silicon boards."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <Activity className="h-4 w-4 text-rose-400" />
              <span>Détection Précoce par Aspiration VESDA LaserFocus</span>
            </h3>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Prélève continuellement des échantillons d'air à l'intérieur des armoires de protection IED. Détecte les particules microscopiques de pyrolyse d'un composant électronique qui surchauffe (fil, condensateur) des dizaines de minutes avant l'apparition de toute flamme ou fumée visible."
                : "Aspirates air continuously through sampling pipes inside protection cubicles. Detects sub-micron pyrolysis particles from overheating resistors or insulation breakdown tens of minutes prior to visible smoke or open flame generation."}
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}
    </div>
  );
};
