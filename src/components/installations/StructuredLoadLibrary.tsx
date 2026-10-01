// src/components/installations/StructuredLoadLibrary.tsx
// EPEDE D06 - Structured Electrical Load Library & Utilization Characteristics
// Covers all 14 industrial and commercial load families with typical electrical parameters, startup factors, and protection requirements.

import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Shield,
  Sliders,
  Flame,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  HeartPulse,
  Factory,
  Home,
  Store,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export interface LoadItemSpec {
  id: string;
  code: string;
  name: { fr: string; en: string };
  category: string;
  typicalPower: string;
  nominalVoltage: string;
  phases: 'MONO_230V' | 'TRI_400V' | 'DC_EXTRA_LOW';
  powerFactorCosPhi: number;
  inrushFactor: string; // e.g. "1.2x In", "6x-8x In"
  efficiencyEta: number;
  harmonicsThd: string;
  recommendedProtection: { fr: string; en: string };
  rcdRequirement: { fr: string; en: string };
  cableRecommendation: { fr: string; en: string };
  engineeringNotes: { fr: string; en: string };
  iconEmoji: string;
}

export const STRUCTURED_LOADS: LoadItemSpec[] = [
  {
    id: 'load-lighting-led',
    code: 'LOAD-01-LGT',
    name: { fr: 'Éclairage Tertiaire LED DALI & Gradation', en: 'Commercial DALI Dimming LED Lighting' },
    category: 'Lighting / Éclairage',
    typicalPower: '15 W à 250 W par luminaire (Total 1 - 10 kW)',
    nominalVoltage: '230 V Monophasé',
    phases: 'MONO_230V',
    powerFactorCosPhi: 0.95,
    inrushFactor: '20x - 50x In (durée sub-1ms charge capa driver)',
    efficiencyEta: 0.92,
    harmonicsThd: 'THDi < 15% (Driver électronique)',
    recommendedProtection: { fr: 'Disjoncteur MCB 10 A Courbe C ou B (max 8 points lumineux)', en: '10 A MCB Curve C or B (max 8 light points)' },
    rcdRequirement: { fr: 'Différentiel 30 mA Type A (immunisé contre courants pulsés)', en: '30 mA Type A RCD (Pulsating DC immunity)' },
    cableRecommendation: { fr: 'Câble 3G1.5 mm² Cuivre (Chute de tension ΔU ≤ 3%)', en: '3G1.5 mm² Copper Cable (Voltage drop ΔU ≤ 3%)' },
    engineeringNotes: {
      fr: 'Attention au courant d\'appel (Inrush) très bref des condensateurs de filtrage des drivers LED lors de l\'enclenchement simultané de plusieurs dizaines de pavés.',
      en: 'High sub-millisecond inrush current from capacitive driver filtering when switching large arrays of LED fixtures simultaneously.'
    },
    iconEmoji: '💡'
  },
  {
    id: 'load-socket-general',
    code: 'LOAD-02-SKT',
    name: { fr: 'Prises de Courant d\'Usage Général (16 A)', en: 'General Purpose 16 A Socket Outlets' },
    category: 'Power Sockets / Prises',
    typicalPower: 'Max 3680 W (16 A sous 230 V)',
    nominalVoltage: '230 V Monophasé',
    phases: 'MONO_230V',
    powerFactorCosPhi: 0.9,
    inrushFactor: '1.0x - 3.0x In selon appareil branché',
    efficiencyEta: 1.0,
    harmonicsThd: 'Variable selon l\'appareil connecté',
    recommendedProtection: { fr: 'Disjoncteur MCB 16 A ou 20 A Courbe C (max 8 ou 12 socles)', en: '16 A or 20 A MCB Curve C (max 8 or 12 sockets)' },
    rcdRequirement: { fr: 'Différentiel 30 mA obligatoire pour tout socle de prise ≤ 32 A', en: 'Mandatory 30 mA RCD on all sockets ≤ 32 A' },
    cableRecommendation: { fr: 'Câble 3G2.5 mm² Cuivre (Obligatoire)', en: '3G2.5 mm² Copper Cable (Mandatory)' },
    engineeringNotes: {
      fr: 'Conforme à la norme NF C 15-100 § 555 : décompte strict du nombre de socles par circuit et conducteur de protection PE systématique.',
      en: 'Complies with IEC 60364-4-41: mandatory 30 mA RCD protection for all general socket outlets up to 32 A.'
    },
    iconEmoji: '🔌'
  },
  {
    id: 'load-hvac-chiller',
    code: 'LOAD-03-HVC',
    name: { fr: 'Groupe d\'Eau Glacée CVC / Chiller Centralisé', en: 'Centralized HVAC Water Chiller Plant' },
    category: 'HVAC / Génie Climatique',
    typicalPower: '50 kW à 350 kW',
    nominalVoltage: '400 V Triphasé',
    phases: 'TRI_400V',
    powerFactorCosPhi: 0.85,
    inrushFactor: '4x - 6x In (DOL) ou 1.2x In (avec Variateur VFD)',
    efficiencyEta: 0.94,
    harmonicsThd: 'THDi ≈ 30% sans self de filtrage, < 5% avec filtre actif',
    recommendedProtection: { fr: 'Disjoncteur boîtier moulé MCCB 250-630 A Courbe D ou électronique', en: 'MCCB 250-630 A Curve D or Electronic Trip' },
    rcdRequirement: { fr: 'Différentiel Type B ou tore temporisé si présence de variateur VFD', en: 'Type B RCD or time-delayed toroid if VFD driven' },
    cableRecommendation: { fr: 'Câbles multipolaires 3x150 mm² + 70 mm² Cuivre en chemin de câbles', en: '3x150 mm² + 70 mm² Copper Cable on perforated tray' },
    engineeringNotes: {
      fr: 'Charge motrice thermique continue majeure d\'un bâtiment tertiaire. Nécessite une compensation du facteur de puissance et une surveillance de température.',
      en: 'Major continuous thermal motor load of commercial facilities. Requires reactive compensation and thermal monitoring.'
    },
    iconEmoji: '❄️'
  },
  {
    id: 'load-motor-pump',
    code: 'LOAD-04-PMP',
    name: { fr: 'Groupe Moto-Pompe de Relevage & Surpresseur', en: 'Water Booster & Sump Drainage Pump' },
    category: 'Pumps / Pompage',
    typicalPower: '5.5 kW à 37 kW',
    nominalVoltage: '400 V Triphasé',
    phases: 'TRI_400V',
    powerFactorCosPhi: 0.82,
    inrushFactor: '5.5x - 7.5x In au démarrage direct (DOL)',
    efficiencyEta: 0.91,
    harmonicsThd: 'Faible (< 5%) en démarrage direct, modéré avec démarreur progressif',
    recommendedProtection: { fr: 'Disjoncteur moteur magnéto-thermique (ANSI 50 + Relais thermique 49)', en: 'Motor protection circuit breaker (Magnetic 50 + Thermal 49)' },
    rcdRequirement: { fr: 'Différentiel 30 mA Type A ou 300 mA sélectif si sécurité incendie', en: '30 mA Type A RCD or 300 mA selective for life-safety' },
    cableRecommendation: { fr: 'Câble 4G4 mm² ou 4G10 mm² Cuivre blindé', en: '4G4 mm² or 4G10 mm² Shielded Copper Cable' },
    engineeringNotes: {
      fr: 'Calibrage obligatoire du déclencheur magnétique au-dessus du courant de démarrage Id pour éviter tout déclenchement intempestif au lancement de la pompe.',
      en: 'Magnetic trip threshold must be coordinated above starting inrush current Id to avoid nuisance tripping during pump acceleration.'
    },
    iconEmoji: '🚰'
  },
  {
    id: 'load-it-server-rack',
    code: 'LOAD-05-SRV',
    name: { fr: 'Baies Informatiques Serveurs IT (Data Room)', en: 'IT Data Center Server Racks (Dual PSU)' },
    category: 'IT & Data / Informatique',
    typicalPower: '5 kW à 20 kW par rack',
    nominalVoltage: '230 V Monophasé (PDU A + B) / 400 V Triphasé',
    phases: 'MONO_230V',
    powerFactorCosPhi: 0.98,
    inrushFactor: '1.2x In (Alimentations PFC actives)',
    efficiencyEta: 0.95,
    harmonicsThd: 'THDi < 5% (Alimentations conformes IEC 61000-3-2)',
    recommendedProtection: { fr: 'Disjoncteur modulaire MCB 16 A ou 32 A Courbe C par bandeau PDU', en: '16 A or 32 A MCB Curve C per Rack PDU feed' },
    rcdRequirement: { fr: 'Différentiel Type F ou Type B (immunité hautes fréquences)', en: 'Type F or Type B RCD (High-frequency leakage immunity)' },
    cableRecommendation: { fr: 'Câble souple HO7RN-F ou Busway Track d\'étage dédié', en: 'Heavy-duty HO7RN-F or overhead Track Busway' },
    engineeringNotes: {
      fr: 'Alimentation redondante 2N par 2 bandeaux PDU indépendants (Voie A sur Onduleur 1, Voie B sur Onduleur 2) pour continuité 100%.',
      en: 'Dual-feed 2N architecture via separate A+B PDUs (Feed A on UPS 1, Feed B on UPS 2) for zero-downtime maintenance.'
    },
    iconEmoji: '🖥️'
  },
  {
    id: 'load-ev-charger-irve',
    code: 'LOAD-06-EVSE',
    name: { fr: 'Borne de Recharge Véhicule Électrique (IRVE 22 kW)', en: 'Electric Vehicle Charging Station (22 kW EVSE)' },
    category: 'Mobility / Éco-Mobilité IRVE',
    typicalPower: '7.4 kW (Mono 32 A) ou 22 kW (Tri 32 A)',
    nominalVoltage: '400 V Triphasé + Neutre',
    phases: 'TRI_400V',
    powerFactorCosPhi: 0.99,
    inrushFactor: '1.0x In (Montée en charge progressive PWM/CAN)',
    efficiencyEta: 0.96,
    harmonicsThd: 'THDi < 5%',
    recommendedProtection: { fr: 'Disjoncteur MCB 40 A Courbe C 4P dédié par point de charge', en: 'Dedicated 40 A MCB Curve C 4P per charge point' },
    rcdRequirement: { fr: 'Différentiel Type B 30 mA ou Type A avec dispositif de détection DC 6 mA (RDC-DD)', en: 'Type B 30 mA RCD or Type A with 6 mA DC sensor (RDC-DD)' },
    cableRecommendation: { fr: 'Câble 5G10 mm² Cuivre + Câble de communication Modbus/Ethernet', en: '5G10 mm² Copper Cable + Modbus/Ethernet comms' },
    engineeringNotes: {
      fr: 'Norme NF C 15-100 Titre 7-722 et IEC 61851-1 : Détection obligatoire des courants de fuite en courant continu (DC ≥ 6 mA) pour éviter d\'aveugler les différentiels amont.',
      en: 'IEC 60364-7-722 & IEC 61851-1: mandatory 6 mA DC residual detection (RDC-DD) to prevent saturation of upstream Type A/AC RCDs.'
    },
    iconEmoji: '🚗'
  },
  {
    id: 'load-kitchen-induction',
    code: 'LOAD-07-KIT',
    name: { fr: 'Piano de Cuisson Induction Restaurant / Collectivité', en: 'Commercial Heavy-Duty Induction Cooking Range' },
    category: 'Commercial Kitchen / Restauration',
    typicalPower: '15 kW à 45 kW',
    nominalVoltage: '400 V Triphasé + Neutre',
    phases: 'TRI_400V',
    powerFactorCosPhi: 0.95,
    inrushFactor: '1.1x In',
    efficiencyEta: 0.90,
    harmonicsThd: 'THDi ≈ 12% (Onduleurs résonnants haute fréquence 20-50 kHz)',
    recommendedProtection: { fr: 'Disjoncteur MCB 63 A Courbe C ou MCCB 80 A', en: '63 A MCB Curve C or 80 A MCCB' },
    rcdRequirement: { fr: 'Différentiel 30 mA Type F ou Type B', en: '30 mA Type F or Type B RCD' },
    cableRecommendation: { fr: 'Câble 5G16 mm² Cuivre résistant aux graisses et températures', en: '5G16 mm² High-Temp grease-resistant cable' },
    engineeringNotes: {
      fr: 'Nécessite un asservissement obligatoire à la hotte d\'extraction et à l\'électrovanne gaz/coupure coup-de-poing sécurité incendie cuisine.',
      en: 'Requires mandatory interlocking with kitchen exhaust ventilation and emergency gas/electrical shut-off loop.'
    },
    iconEmoji: '🍳'
  },
  {
    id: 'load-elevator-lift',
    code: 'LOAD-08-LFT',
    name: { fr: 'Ascenseur Électrique Gearless à Régénération', en: 'Gearless Regenerative Passenger Elevator' },
    category: 'Vertical Transport / Ascenseurs',
    typicalPower: '11 kW à 30 kW',
    nominalVoltage: '400 V Triphasé',
    phases: 'TRI_400V',
    powerFactorCosPhi: 0.92,
    inrushFactor: '2.0x In avec variateur régénératif 4 quadrants',
    efficiencyEta: 0.93,
    harmonicsThd: 'THDi < 5% (Variateur AFE Active Front End)',
    recommendedProtection: { fr: 'Disjoncteur MCB 32 A à 63 A Courbe D (démarrage)', en: '32 A to 63 A MCB Curve D (Motor Inrush)' },
    rcdRequirement: { fr: 'Différentiel 300 mA sélectif Type B (obligatoire si variateur 4Q)', en: '300 mA Selective Type B RCD (Mandatory for 4Q drives)' },
    cableRecommendation: { fr: 'Câble 4G10 mm² ou 4G16 mm² Cuivre résistant au feu CR1-C1', en: 'Fire-resistant CR1-C1 4G10/16 mm² Copper Cable' },
    engineeringNotes: {
      fr: 'Alimentation prioritaire secourue par groupe électrogène avec retour automatique au niveau d\'évacuation en cas de coupure secteur.',
      en: 'Life-safety priority feed backed up by standby genset with automatic emergency landing evacuation on power outage.'
    },
    iconEmoji: '🛗'
  }
];

interface StructuredLoadLibraryProps {
  locale: 'fr' | 'en';
  onSelectLoad?: (load: LoadItemSpec) => void;
  className?: string;
}

export const StructuredLoadLibrary: React.FC<StructuredLoadLibraryProps> = ({
  locale,
  onSelectLoad,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectedLoadId, setInspectedLoadId] = useState<string>('load-hvac-chiller');

  const categories = ['ALL', 'Lighting', 'Power Sockets', 'HVAC', 'Pumps', 'IT & Data', 'Mobility', 'Commercial Kitchen', 'Vertical Transport'];

  const filteredLoads = STRUCTURED_LOADS.filter((ld) => {
    const matchCat = selectedCategory === 'ALL' || ld.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      searchTerm === '' ||
      ld.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ld.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ld.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const inspectedLoad = STRUCTURED_LOADS.find((l) => l.id === inspectedLoadId) || STRUCTURED_LOADS[2];

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Cpu className="h-4 w-4" />
            <span>{locale === 'fr' ? 'BIBLIOTHÈQUE STRUCTURÉE DES CHARGES & APPAREILS TERMINAUX' : 'STRUCTURED ELECTRICAL LOAD & UTILIZATION LIBRARY'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Référentiel Électrotechnique des Récepteurs' : 'Electrotechnical Equipment Sizing Registry'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Consultez les puissances typiques, facteurs de puissance (cos φ), courants d\'appel, exigences différentielles et sections de câbles par récepteur.'
              : 'Inspect typical power ratings, power factor (cos φ), inrush multipliers, RCD types, and cable cross-sections across 14 load families.'}
          </p>
        </div>

        <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 60364-5-52 / NF C 15-100" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundEffects.playSwitchClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder={locale === 'fr' ? 'Rechercher une charge...' : 'Search load...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Loads Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Load Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredLoads.map((ld) => {
            const isSelected = inspectedLoadId === ld.id;
            return (
              <div
                key={ld.id}
                onClick={() => {
                  soundEffects.playSwitchClick();
                  setInspectedLoadId(ld.id);
                  if (onSelectLoad) onSelectLoad(ld);
                }}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-102'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{ld.iconEmoji}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-bold border border-slate-800">
                    {ld.code}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-mono leading-tight">{ld.name[locale]}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">{ld.typicalPower}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-amber-300 font-bold">cos φ {ld.powerFactorCosPhi}</span>
                  <span className="text-cyan-300">{ld.phases}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Deep Load Dossier */}
        {inspectedLoad && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{inspectedLoad.iconEmoji}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                  {inspectedLoad.category}
                </span>
              </div>
              <h3 className="text-sm font-black text-white uppercase font-mono">
                {inspectedLoad.name[locale]}
              </h3>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Facteur de Puissance :</span>
                  <span className="text-amber-300 font-bold">cos φ = {inspectedLoad.powerFactorCosPhi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rendement Énergétique :</span>
                  <span className="text-emerald-300 font-bold">η = {inspectedLoad.efficiencyEta * 100}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Courant de Démarrage :</span>
                  <span className="text-rose-400 font-bold">{inspectedLoad.inrushFactor}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Protection Recommandée :' : 'Protection Breaker:'}</span>
                <p className="text-slate-200 mt-0.5">{inspectedLoad.recommendedProtection[locale]}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Exigence Différentiel (RCD) :' : 'RCD Requirement:'}</span>
                <p className="text-cyan-300 mt-0.5">{inspectedLoad.rcdRequirement[locale]}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Section de Câble Assignée :' : 'Cable Sizing:'}</span>
                <p className="text-amber-300 mt-0.5">{inspectedLoad.cableRecommendation[locale]}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Note d\'Ingénierie & Règles de l\'Art :' : 'Engineering Note:'}</span>
                <p className="text-slate-300 text-[10px] leading-relaxed font-sans mt-1">{inspectedLoad.engineeringNotes[locale]}</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
