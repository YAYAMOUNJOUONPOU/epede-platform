// src/components/installations/InteractiveTgbtBuilder.tsx
// EPEDE D06 - Interactive Main Low-Voltage Switchboard (TGBT / MDB) Builder & Architect Canvas
// Allows engineers to interactively construct, size, and validate a custom industrial/commercial TGBT with real-time physical cubicle and SLD synchronization.

import React, { useState, useMemo } from 'react';
import {
  Box,
  Zap,
  Shield,
  ShieldCheck,
  Activity,
  Sliders,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  Scale,
  RefreshCw,
  Eye,
  Settings,
  Download,
  Info
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type TgbtSupplyType =
  | 'SINGLE_GRID'
  | 'DUAL_GRID_COUPLER'
  | 'GRID_GENSET_ATS'
  | 'GRID_GENSET_UPS';

export type TgbtSegregationForm = 'Form 1' | 'Form 2b' | 'Form 3b' | 'Form 4b';

export type OutgoingFeederType =
  | 'MCCB_DISTRIBUTION'
  | 'MCC_MOTOR_STARTER'
  | 'VFD_DRIVE'
  | 'APFC_CAPACITOR'
  | 'UPS_BYPASS'
  | 'SUB_PANEL_FEEDER';

export interface TgbtOutgoingFeeder {
  id: string;
  tag: string;
  name: { fr: string; en: string };
  type: OutgoingFeederType;
  ratingAmps: number;
  poles: '3P' | '4P';
  tripType: 'THERMAL_MAGNETIC' | 'ELECTRONIC_LSI' | 'ELECTRONIC_LSIG';
  hasVigiRcd: boolean;
  vigiSensitivityMa?: number; // 30, 300, 500, 1000
  cubicleColumnIndex: number;
  assignedLoadKw: number;
  powerFactor: number;
}

interface InteractiveTgbtBuilderProps {
  locale: 'fr' | 'en';
  onExportDossier?: (tgbtSpec: any) => void;
  className?: string;
}

export const InteractiveTgbtBuilder: React.FC<InteractiveTgbtBuilderProps> = ({
  locale,
  onExportDossier,
  className = ''
}) => {
  // Configuration State
  const [supplyType, setSupplyType] = useState<TgbtSupplyType>('GRID_GENSET_ATS');
  const [segregationForm, setSegregationForm] = useState<TgbtSegregationForm>('Form 3b');
  const [mainAcbRatingAmps, setMainAcbRatingAmps] = useState<number>(2500);
  const [busbarRatingAmps, setBusbarRatingAmps] = useState<number>(2500);
  const [ipRating, setIpRating] = useState<'IP31' | 'IP42' | 'IP54'>('IP42');
  const [activeTab, setActiveTab] = useState<'PHYSICAL_CUBICLES' | 'SINGLE_LINE_DIAGRAM' | 'SPECIFICATIONS'>('PHYSICAL_CUBICLES');
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(0);

  // Outgoing Feeders List
  const [feeders, setFeeders] = useState<TgbtOutgoingFeeder[]>([
    {
      id: 'fdr-01',
      tag: 'Q_TD_ETAGE1',
      name: { fr: 'Départ Tableau Divisionnaire Étage 1', en: 'Feeder Sub-Distribution Board Floor 1' },
      type: 'MCCB_DISTRIBUTION',
      ratingAmps: 250,
      poles: '4P',
      tripType: 'ELECTRONIC_LSI',
      hasVigiRcd: true,
      vigiSensitivityMa: 300,
      cubicleColumnIndex: 2,
      assignedLoadKw: 110,
      powerFactor: 0.92
    },
    {
      id: 'fdr-02',
      tag: 'Q_TD_ETAGE2',
      name: { fr: 'Départ Tableau Divisionnaire Étage 2', en: 'Feeder Sub-Distribution Board Floor 2' },
      type: 'MCCB_DISTRIBUTION',
      ratingAmps: 250,
      poles: '4P',
      tripType: 'ELECTRONIC_LSI',
      hasVigiRcd: true,
      vigiSensitivityMa: 300,
      cubicleColumnIndex: 2,
      assignedLoadKw: 115,
      powerFactor: 0.92
    },
    {
      id: 'fdr-03',
      tag: 'Q_CHILLER_01',
      name: { fr: 'Départ Groupe Froid CVC N°1 (Chiller)', en: 'HVAC Chiller Unit No.1 Feeder' },
      type: 'MCC_MOTOR_STARTER',
      ratingAmps: 400,
      poles: '3P',
      tripType: 'ELECTRONIC_LSI',
      hasVigiRcd: false,
      cubicleColumnIndex: 2,
      assignedLoadKw: 190,
      powerFactor: 0.85
    },
    {
      id: 'fdr-04',
      tag: 'Q_APFC_300',
      name: { fr: 'Batterie Condensateurs Automatique APFC', en: 'Automatic Power Factor Correction (APFC)' },
      type: 'APFC_CAPACITOR',
      ratingAmps: 500,
      poles: '3P',
      tripType: 'THERMAL_MAGNETIC',
      hasVigiRcd: false,
      cubicleColumnIndex: 3,
      assignedLoadKw: 0,
      powerFactor: 0.0
    },
    {
      id: 'fdr-05',
      tag: 'Q_UPS_DATA',
      name: { fr: 'Départ Onduleur Centralisé UPS Salle IT', en: 'Centralized Online UPS IT Room Feeder' },
      type: 'UPS_BYPASS',
      ratingAmps: 160,
      poles: '4P',
      tripType: 'ELECTRONIC_LSI',
      hasVigiRcd: true,
      vigiSensitivityMa: 300,
      cubicleColumnIndex: 3,
      assignedLoadKw: 75,
      powerFactor: 0.98
    }
  ]);

  // Calculations: Total Power, Current, Busbar Margin
  const totalConnectedKw = useMemo(() => {
    return feeders.reduce((acc, f) => acc + f.assignedLoadKw, 0);
  }, [feeders]);

  const totalCalculatedKva = useMemo(() => {
    // Average power factor estimated at 0.9
    const avgPf = 0.9;
    const simultaneityFactor = 0.85; // ks
    return Math.round((totalConnectedKw * simultaneityFactor) / avgPf);
  }, [totalConnectedKw]);

  const calculatedNominalCurrentAmps = useMemo(() => {
    // I = S / (sqrt(3) * U) where U = 400V
    return Math.round((totalCalculatedKva * 1000) / (Math.sqrt(3) * 400));
  }, [totalCalculatedKva]);

  const busbarLoadRatioPercent = useMemo(() => {
    return Math.min(100, Math.round((calculatedNominalCurrentAmps / busbarRatingAmps) * 100));
  }, [calculatedNominalCurrentAmps, busbarRatingAmps]);

  // Add a new feeder
  const handleAddFeeder = () => {
    soundEffects.playSwitchClick();
    const newIdx = feeders.length + 1;
    const newFdr: TgbtOutgoingFeeder = {
      id: `fdr-${Date.now()}`,
      tag: `Q_DEPART_${newIdx}`,
      name: {
        fr: `Nouveau Départ Divisionnaire N°${newIdx}`,
        en: `New Outgoing Sub-Feeder No.${newIdx}`
      },
      type: 'MCCB_DISTRIBUTION',
      ratingAmps: 160,
      poles: '4P',
      tripType: 'ELECTRONIC_LSI',
      hasVigiRcd: true,
      vigiSensitivityMa: 300,
      cubicleColumnIndex: 2,
      assignedLoadKw: 45,
      powerFactor: 0.9
    };
    setFeeders([...feeders, newFdr]);
  };

  const handleRemoveFeeder = (id: string) => {
    soundEffects.playSwitchClick();
    setFeeders(feeders.filter((f) => f.id !== id));
  };

  // Cubicle Columns Definition
  const cubicleColumns = useMemo(() => {
    const cols = [
      {
        index: 0,
        title: { fr: 'Colonne 1 : Arrivée Réseau 1', en: 'Column 1: Grid Incomer 1' },
        widthMm: 800,
        apparatus: [
          `Disjoncteur ACB ${mainAcbRatingAmps} A Débrochable`,
          'TC de Comptage Classe 0.5S + Centrale PM8000',
          'Parafoudre Débrochable Type 1+2 (Iimp 25 kA)'
        ]
      }
    ];

    if (supplyType === 'DUAL_GRID_COUPLER') {
      cols.push({
        index: 1,
        title: { fr: 'Colonne 2 : Couplage Jeu de Barres', en: 'Column 2: Bus-Tie Coupler' },
        widthMm: 600,
        apparatus: [
          `Disjoncteur de Couplage ACB ${mainAcbRatingAmps} A`,
          'Interverrouillage Mécanique à Clé (Profalux)',
          'Automatisme de Permutation de Source (APS)'
        ]
      });
      cols.push({
        index: 2,
        title: { fr: 'Colonne 3 : Arrivée Réseau 2', en: 'Column 3: Grid Incomer 2' },
        widthMm: 800,
        apparatus: [
          `Disjoncteur ACB ${mainAcbRatingAmps} A Débrochable`,
          'Centrale de Mesure Énergétique PM8000',
          'Parafoudre Type 1+2'
        ]
      });
    } else if (supplyType === 'GRID_GENSET_ATS') {
      cols.push({
        index: 1,
        title: { fr: 'Colonne 2 : Inverseur Source GE (ATS)', en: 'Column 2: Genset ATS Incomer' },
        widthMm: 800,
        apparatus: [
          'Inverseur de Source Motorisé Normal/Secours (ATS)',
          'Disjoncteur Arrivée Groupe Électrogène 1600 A',
          'Automatisme de Démarrage et Délestage'
        ]
      });
    }

    cols.push({
      index: cols.length,
      title: { fr: `Colonne ${cols.length + 1} : Départs Divisionnaires`, en: `Column ${cols.length + 1}: Distribution Feeders` },
      widthMm: 800,
      apparatus: feeders.filter((f) => f.cubicleColumnIndex === 2).map((f) => `${f.tag} · MCCB ${f.ratingAmps} A (${f.assignedLoadKw} kW)`)
    });

    cols.push({
      index: cols.length,
      title: { fr: `Colonne ${cols.length + 1} : Départs CVC & APFC`, en: `Column ${cols.length + 1}: HVAC & Power Factor` },
      widthMm: 800,
      apparatus: feeders.filter((f) => f.cubicleColumnIndex === 3).map((f) => `${f.tag} · ${f.type === 'APFC_CAPACITOR' ? 'Batterie APFC 300 kvar' : `MCCB ${f.ratingAmps} A`}`)
    });

    return cols;
  }, [supplyType, mainAcbRatingAmps, feeders]);

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Box className="h-4 w-4" />
            <span>{locale === 'fr' ? 'ATELIER DE CONCEPTION & DIMENSIONNEMENT TGBT / MDB' : 'INTERACTIVE TGBT / MDB SWITCHBOARD BUILDER'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Configurateur d\'Armoire Forte Puissance' : 'High-Power LV Switchboard Configurator'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Construisez votre TGBT sur mesure : source normale/secours, jeu de barres, formes de séparation (1 à 4b), départs divisionnaires et compensation réactive.'
              : 'Construct a customized Main LV Switchboard: dual supply, bus-tie coupling, segregation forms (1 to 4b), outgoing feeders and APFC banks.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 61439-1/2" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
            {cubicleColumns.length} {locale === 'fr' ? 'Colonnes Armoire' : 'Cubicle Columns'}
          </span>
        </div>
      </div>

      {/* Top Architecture Controls Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
        
        {/* Control 1: Supply Type */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Architecture d\'Alimentation :' : 'Power Supply Architecture:'}
          </label>
          <select
            value={supplyType}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setSupplyType(e.target.value as TgbtSupplyType);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="SINGLE_GRID">{locale === 'fr' ? '1 Source Réseau Simple' : 'Single Grid Supply'}</option>
            <option value="DUAL_GRID_COUPLER">{locale === 'fr' ? '2 Sources Réseau + Couplage Bus-Tie' : 'Dual Grid + Bus-Tie Coupler'}</option>
            <option value="GRID_GENSET_ATS">{locale === 'fr' ? 'Réseau + Groupe Électrogène (ATS)' : 'Grid + Standby Genset (ATS)'}</option>
            <option value="GRID_GENSET_UPS">{locale === 'fr' ? 'Réseau + Groupe + Onduleur (UPS)' : 'Grid + Genset + Clean UPS'}</option>
          </select>
        </div>

        {/* Control 2: Main Incomer ACB Rating */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Calibre Disjoncteur Tête (ACB) :' : 'Main Incomer ACB Rating:'}
          </label>
          <select
            value={mainAcbRatingAmps}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              const val = Number(e.target.value);
              setMainAcbRatingAmps(val);
              setBusbarRatingAmps(val);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none font-bold"
          >
            <option value={800}>800 A (Transfo 500 kVA)</option>
            <option value={1250}>1250 A (Transfo 800 kVA)</option>
            <option value={1600}>1600 A (Transfo 1000 kVA)</option>
            <option value={2500}>2500 A (Transfo 1600 kVA)</option>
            <option value={3200}>3200 A (Transfo 2000 kVA)</option>
            <option value={4000}>4000 A (Transfo 2500 kVA)</option>
          </select>
        </div>

        {/* Control 3: Segregation Form */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Forme de Cloisonnement CEI 61439 :' : 'Segregation Form (IEC 61439):'}
          </label>
          <select
            value={segregationForm}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setSegregationForm(e.target.value as TgbtSegregationForm);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-cyan-300 font-mono text-xs focus:border-amber-400 focus:outline-none font-bold"
          >
            <option value="Form 1">Form 1 (Aucun cloisonnement)</option>
            <option value="Form 2b">Form 2b (Séparation barres)</option>
            <option value="Form 3b">Form 3b (Unités séparées)</option>
            <option value="Form 4b">Form 4b (Cloisonnement total)</option>
          </select>
        </div>

        {/* Control 4: Enclosure Protection Rating */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Indice de Protection Enveloppe :' : 'Enclosure IP / IK Rating:'}
          </label>
          <select
            value={ipRating}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setIpRating(e.target.value as any);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
          >
            <option value="IP31">IP31 / IK08 (Local standard)</option>
            <option value="IP42">IP42 / IK10 (Industrie propre)</option>
            <option value="IP54">IP54 / IK10 (Poussière / Humidité)</option>
          </select>
        </div>

      </div>

      {/* Engineering Power Balance & Busbar Margin Bar */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Metric 1 */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Puissance Connectée Totale :' : 'Total Connected Load:'}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-white">{totalConnectedKw}</span>
            <span className="text-amber-400 font-bold">kW</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Puissance d\'Appel Foisonnée :' : 'Billed Demand (ks=0.85):'}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-cyan-300">{totalCalculatedKva}</span>
            <span className="text-cyan-400 font-bold">kVA</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Courant de Service Calculé :' : 'Calculated Incomer Current:'}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-amber-300">{calculatedNominalCurrentAmps}</span>
            <span className="text-slate-400 font-bold">A / {mainAcbRatingAmps} A</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Taux de Charge Jeu de Barres :' : 'Busbar Thermal Margin:'}</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all ${
                  busbarLoadRatioPercent > 85 ? 'bg-rose-500' : busbarLoadRatioPercent > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${busbarLoadRatioPercent}%` }}
              />
            </div>
            <span className="font-bold text-white text-xs">{busbarLoadRatioPercent}%</span>
          </div>
        </div>

      </div>

      {/* View Switcher Tabs: Physical Cubicles vs Single-Line Diagram */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setActiveTab('PHYSICAL_CUBICLES');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'PHYSICAL_CUBICLES'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Box className="h-3.5 w-3.5" />
          <span>{locale === 'fr' ? 'Vue Physique des Colonnes (Armoire 3D/CAD)' : 'Physical Cubicle Rack View'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setActiveTab('SINGLE_LINE_DIAGRAM');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'SINGLE_LINE_DIAGRAM'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{locale === 'fr' ? 'Schéma Unifilaire Synchronisé (SLD)' : 'Synchronized SLD Canvas'}</span>
        </button>
      </div>

      {/* Main Viewport Content */}
      {activeTab === 'PHYSICAL_CUBICLES' ? (
        <div className="space-y-4">
          
          {/* Physical Cubicles Rack Canvas */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#060910] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="font-bold flex items-center gap-2 text-amber-300">
                <Box className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? `TABLEAU TGBT MODULAIRE · ${segregationForm.toUpperCase()} · ${ipRating} · Icw 50 kA/1s` : `MODULAR TGBT RACK · ${segregationForm.toUpperCase()} · ${ipRating} · Icw 50 kA/1s`}</span>
              </span>
              <span className="text-slate-500 font-mono">Hauteur : 2000 mm · Profondeur : 800 mm</span>
            </div>

            {/* Side-by-Side Cubicles Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cubicleColumns.map((col, idx) => {
                const isSelected = selectedColumnIndex === idx;
                return (
                  <div
                    key={col.index}
                    onClick={() => {
                      soundEffects.playSwitchClick();
                      setSelectedColumnIndex(idx);
                    }}
                    className={`p-4 rounded-xl border flex flex-col justify-between min-h-[380px] transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-slate-900/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                        : 'bg-[#0A0E1A] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {/* Top Busbar Compartment (Form segregation) */}
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-[10px] text-amber-300 font-bold">
                      <span>JEU DE BARRES {busbarRatingAmps} A</span>
                      <span className="text-[9px] px-1 rounded bg-amber-500/20">{segregationForm}</span>
                    </div>

                    {/* Column Body / Apparatus Compartment */}
                    <div className="space-y-3 my-3 flex-1 flex flex-col justify-center">
                      <div className="text-center p-2 border-b border-slate-800/60">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{col.title[locale]}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{col.widthMm} mm</span>
                      </div>

                      <div className="space-y-2">
                        {col.apparatus.map((app, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-200 font-medium flex items-center justify-between"
                          >
                            <span className="truncate">{app}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Cable Entry & Ground Bar */}
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[9px] text-slate-500">
                      <span>Raccordement Câbles</span>
                      <span className="text-emerald-400 font-bold">PE 50x10 mm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outgoing Feeders Management List */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Départs Divisionnaires Configurés sur le TGBT' : 'Configured Outgoing Branch Feeders'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {locale === 'fr'
                    ? 'Ajoutez, modifiez ou supprimez des disjoncteurs divisionnaires MCCB, départs moteurs ou batteries APFC.'
                    : 'Add, modify, or remove outgoing MCCBs, motor starter buckets, or capacitor banks.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFeeder}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md self-start sm:self-center cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Ajouter un Départ' : 'Add Feeder'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {feeders.map((fdr) => (
                <div
                  key={fdr.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-wrap items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono font-bold text-[10px] border border-slate-800">
                      {fdr.tag}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">{fdr.name[locale]}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{fdr.type}</span>
                        <span>•</span>
                        <span className="text-cyan-300">{fdr.ratingAmps} A {fdr.poles}</span>
                        <span>•</span>
                        <span>{fdr.assignedLoadKw} kW (cos φ {fdr.powerFactor})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {fdr.hasVigiRcd && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                        Vigi {fdr.vigiSensitivityMa} mA
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveFeeder(fdr.id)}
                      className="p-1.5 rounded bg-slate-950 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                      title={locale === 'fr' ? 'Supprimer ce départ' : 'Delete feeder'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Single-Line Diagram (SLD) View */
        <div className="p-6 rounded-2xl bg-[#060910] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>{locale === 'fr' ? 'SCHÉMA UNIFILAIRE ÉLECTRIQUE TGBT (SYNCHRONISÉ)' : 'SYNCHRONIZED SINGLE-LINE DIAGRAM (SLD)'}</span>
            </span>
            <span className="text-slate-500 font-mono">CEI 60617 / NF C 15-100</span>
          </div>

          {/* Dynamic Vector SLD Tree */}
          <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
            
            {/* Incomer Section */}
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-center min-w-[280px] shadow-lg">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                  {supplyType === 'GRID_GENSET_ATS' ? 'SOURCE NORMALE (TRANSFO) & SECOURS (GE)' : 'ARRIVÉE RÉSEAU MT/BT 400 V'}
                </span>
                <span className="text-sm font-black text-white">{mainAcbRatingAmps} A · Masterpact ACB 3P/4P</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Icu = 50 kA · Déclencheur Micrologic 5.0X</span>
              </div>
              <div className="w-0.5 h-6 bg-amber-400" />
            </div>

            {/* Main Copper Busbar Line */}
            <div className="relative p-3 rounded-lg bg-amber-950/80 border-2 border-amber-400 text-center shadow-xl">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                ══ JEU DE BARRES PRINCIPAL {busbarRatingAmps} A CUIVRE E-CU (400 V / 230 V · {segregationForm}) ══
              </span>
            </div>

            {/* Branch Feeders Vertical Outgoers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {feeders.map((fdr) => (
                <div key={fdr.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-amber-400" />
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 w-full space-y-1 text-center shadow-md hover:border-amber-400 transition-colors">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">{fdr.tag}</span>
                    <span className="text-xs font-black text-white block">{fdr.ratingAmps} A {fdr.poles}</span>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{fdr.name[locale]}</p>
                    <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] text-cyan-300">
                      <span>P = {fdr.assignedLoadKw} kW</span>
                      {fdr.hasVigiRcd && <span className="text-rose-400 font-bold">Vigi {fdr.vigiSensitivityMa}mA</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
