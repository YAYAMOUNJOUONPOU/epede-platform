// src/components/installations/InteractivePanelBuilder.tsx
// EPEDE D06 - Interactive Electrical Distribution Board (Panel Builder & DIN-Rail Configurator)
// Allows engineers and technicians to visually construct, organize, wire, and test modular distribution boards.

import React, { useState, useMemo } from 'react';
import {
  Box,
  Zap,
  Shield,
  ShieldCheck,
  Plus,
  Trash2,
  RotateCcw,
  Activity,
  Sliders,
  Layers,
  Power,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Info,
  Scale,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type ModularDeviceType =
  | 'MCB'
  | 'RCD_RCCB'
  | 'RCBO'
  | 'SPD_SURGE'
  | 'CONTACTOR'
  | 'IMPULSE_RELAY'
  | 'ENERGY_METER'
  | 'TIMER';

export interface ModularCircuitItem {
  id: string;
  tag: string;
  name: { fr: string; en: string };
  type: ModularDeviceType;
  ratingAmps: number;
  curve?: 'B' | 'C' | 'D';
  rcdSensitivityMa?: number; // 30, 300
  rcdType?: 'AC' | 'A' | 'F' | 'B';
  modulesWidth: number; // 1 to 4 DIN modules (18mm each)
  phase: 'L1' | 'L2' | 'L3' | 'TRI';
  wireSectionMm2: number; // 1.5, 2.5, 6, 10, 16
  assignedLoadWatts: number;
  railRow: 1 | 2 | 3 | 4;
  isClosed: boolean;
  isTripped: boolean;
  tripReason?: 'OVERLOAD' | 'SHORT_CIRCUIT' | 'RCD_LEAKAGE';
  iconEmoji: string;
}

interface InteractivePanelBuilderProps {
  locale: 'fr' | 'en';
  onExportPanelDossier?: (panelSpec: any) => void;
  className?: string;
}

export const InteractivePanelBuilder: React.FC<InteractivePanelBuilderProps> = ({
  locale,
  onExportPanelDossier,
  className = ''
}) => {
  const [railCount, setRailCount] = useState<number>(3);
  const [panelIncomerType, setPanelIncomerType] = useState<'ISOLATOR_63A' | 'MCB_40A' | 'RCD_300MA_S'>('RCD_300MA_S');
  const [activeView, setActiveView] = useState<'PHYSICAL_RACK' | 'SLD_SCHEMATIC' | 'PHASE_BALANCE'>('PHYSICAL_RACK');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>('cir-01');

  // Initial Panel Circuits
  const [circuits, setCircuits] = useState<ModularCircuitItem[]>([
    // Rail 1: Éclairage & Parafoudre
    {
      id: 'cir-01',
      tag: 'SPD1',
      name: { fr: 'Parafoudre Modulaire Type 2 (In 20 kA)', en: 'Modular Type 2 SPD (In 20 kA)' },
      type: 'SPD_SURGE',
      ratingAmps: 20,
      modulesWidth: 2,
      phase: 'L1',
      wireSectionMm2: 6,
      assignedLoadWatts: 0,
      railRow: 1,
      isClosed: true,
      isTripped: false,
      iconEmoji: '🛡️'
    },
    {
      id: 'cir-02',
      tag: 'Q1',
      name: { fr: 'Éclairage Séjour & Salle à Manger (8 DALI)', en: 'Living & Dining Room DALI Lighting' },
      type: 'MCB',
      ratingAmps: 10,
      curve: 'C',
      modulesWidth: 1,
      phase: 'L1',
      wireSectionMm2: 1.5,
      assignedLoadWatts: 240,
      railRow: 1,
      isClosed: true,
      isTripped: false,
      iconEmoji: '💡'
    },
    {
      id: 'cir-03',
      tag: 'Q2',
      name: { fr: 'Éclairage Chambres & Couloirs', en: 'Bedrooms & Hallway LED Lighting' },
      type: 'MCB',
      ratingAmps: 10,
      curve: 'C',
      modulesWidth: 1,
      phase: 'L2',
      wireSectionMm2: 1.5,
      assignedLoadWatts: 180,
      railRow: 1,
      isClosed: true,
      isTripped: false,
      iconEmoji: '💡'
    },
    // Rail 2: Prises de Courant & Chauffage
    {
      id: 'cir-04',
      tag: 'RCD_R2',
      name: { fr: 'Interrupteur Différentiel 30 mA Type A 63A', en: '30 mA Type A 63A RCCB Head' },
      type: 'RCD_RCCB',
      ratingAmps: 63,
      rcdSensitivityMa: 30,
      rcdType: 'A',
      modulesWidth: 2,
      phase: 'L2',
      wireSectionMm2: 10,
      assignedLoadWatts: 0,
      railRow: 2,
      isClosed: true,
      isTripped: false,
      iconEmoji: '⚡'
    },
    {
      id: 'cir-05',
      tag: 'Q3',
      name: { fr: 'Prises de Courant Cuisine (8 socles)', en: 'Kitchen Worktop Socket Outlets' },
      type: 'MCB',
      ratingAmps: 20,
      curve: 'C',
      modulesWidth: 1,
      phase: 'L2',
      wireSectionMm2: 2.5,
      assignedLoadWatts: 2200,
      railRow: 2,
      isClosed: true,
      isTripped: false,
      iconEmoji: '🔌'
    },
    {
      id: 'cir-06',
      tag: 'Q4',
      name: { fr: 'Lave-Linge & Sèche-Linge Dédié', en: 'Washing Machine & Dryer Dedicated' },
      type: 'MCB',
      ratingAmps: 20,
      curve: 'C',
      modulesWidth: 1,
      phase: 'L3',
      wireSectionMm2: 2.5,
      assignedLoadWatts: 2400,
      railRow: 2,
      isClosed: true,
      isTripped: false,
      iconEmoji: '🧺'
    },
    // Rail 3: Spécialisés & Force Motrice
    {
      id: 'cir-07',
      tag: 'RCD_R3',
      name: { fr: 'Interrupteur Différentiel 30 mA Type F 63A', en: '30 mA Type F 63A RCCB Head' },
      type: 'RCD_RCCB',
      ratingAmps: 63,
      rcdSensitivityMa: 30,
      rcdType: 'F',
      modulesWidth: 2,
      phase: 'L3',
      wireSectionMm2: 10,
      assignedLoadWatts: 0,
      railRow: 3,
      isClosed: true,
      isTripped: false,
      iconEmoji: '⚡'
    },
    {
      id: 'cir-08',
      tag: 'Q5',
      name: { fr: 'Plaque de Cuisson Induction 32 A', en: 'Induction Cooktop Hob 32 A' },
      type: 'MCB',
      ratingAmps: 32,
      curve: 'C',
      modulesWidth: 1,
      phase: 'L3',
      wireSectionMm2: 6,
      assignedLoadWatts: 5800,
      railRow: 3,
      isClosed: true,
      isTripped: false,
      iconEmoji: '🍳'
    },
    {
      id: 'cir-09',
      tag: 'Q6',
      name: { fr: 'Pompe à Chaleur / Climatisation Inverter', en: 'Inverter Heat Pump / Air Conditioning' },
      type: 'RCBO',
      ratingAmps: 16,
      curve: 'D',
      rcdSensitivityMa: 30,
      rcdType: 'F',
      modulesWidth: 2,
      phase: 'L1',
      wireSectionMm2: 2.5,
      assignedLoadWatts: 2200,
      railRow: 3,
      isClosed: true,
      isTripped: false,
      iconEmoji: '❄️'
    }
  ]);

  // Phase Load Balancing Calculations
  const phaseLoadsWatts = useMemo(() => {
    const loads = { L1: 0, L2: 0, L3: 0 };
    circuits.forEach((c) => {
      if (!c.isClosed || c.isTripped) return;
      if (c.phase === 'L1') loads.L1 += c.assignedLoadWatts;
      else if (c.phase === 'L2') loads.L2 += c.assignedLoadWatts;
      else if (c.phase === 'L3') loads.L3 += c.assignedLoadWatts;
      else if (c.phase === 'TRI') {
        loads.L1 += c.assignedLoadWatts / 3;
        loads.L2 += c.assignedLoadWatts / 3;
        loads.L3 += c.assignedLoadWatts / 3;
      }
    });
    return loads;
  }, [circuits]);

  const totalPanelWatts = phaseLoadsWatts.L1 + phaseLoadsWatts.L2 + phaseLoadsWatts.L3;

  const phaseUnbalancePercent = useMemo(() => {
    const maxP = Math.max(phaseLoadsWatts.L1, phaseLoadsWatts.L2, phaseLoadsWatts.L3);
    const minP = Math.min(phaseLoadsWatts.L1, phaseLoadsWatts.L2, phaseLoadsWatts.L3);
    if (maxP === 0) return 0;
    return Math.round(((maxP - minP) / maxP) * 100);
  }, [phaseLoadsWatts]);

  // Toggle Breaker State (Open / Closed)
  const handleToggleBreaker = (id: string) => {
    soundEffects.playSwitchClick();
    setCircuits(
      circuits.map((c) => {
        if (c.id === id) {
          if (c.isTripped) {
            return { ...c, isTripped: false, isClosed: true, tripReason: undefined };
          }
          return { ...c, isClosed: !c.isClosed };
        }
        return c;
      })
    );
  };

  // Simulate Trip
  const handleSimulateTrip = (id: string, reason: 'OVERLOAD' | 'SHORT_CIRCUIT' | 'RCD_LEAKAGE') => {
    soundEffects.playWarningBuzzer();
    setCircuits(
      circuits.map((c) => {
        if (c.id === id) {
          return { ...c, isClosed: false, isTripped: true, tripReason: reason };
        }
        return c;
      })
    );
  };

  // Add a new circuit to a rail
  const handleAddCircuit = (railRow: 1 | 2 | 3 | 4) => {
    soundEffects.playSwitchClick();
    const newIdx = circuits.length + 1;
    const newCir: ModularCircuitItem = {
      id: `cir-${Date.now()}`,
      tag: `Q${newIdx}`,
      name: {
        fr: `Nouveau Circuit Modulaire N°${newIdx}`,
        en: `New Modular Branch Circuit No.${newIdx}`
      },
      type: 'MCB',
      ratingAmps: 16,
      curve: 'C',
      modulesWidth: 1,
      phase: (railRow === 1 ? 'L1' : railRow === 2 ? 'L2' : 'L3'),
      wireSectionMm2: 2.5,
      assignedLoadWatts: 1500,
      railRow,
      isClosed: true,
      isTripped: false,
      iconEmoji: '🔌'
    };
    setCircuits([...circuits, newCir]);
    setSelectedCircuitId(newCir.id);
  };

  const handleRemoveCircuit = (id: string) => {
    soundEffects.playSwitchClick();
    setCircuits(circuits.filter((c) => c.id !== id));
    if (selectedCircuitId === id) setSelectedCircuitId(null);
  };

  const selectedCircuit = circuits.find((c) => c.id === selectedCircuitId);

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Sliders className="h-4 w-4" />
            <span>{locale === 'fr' ? 'CONSTRUCTEUR DE TABLEAU MODULAIRE & COFFRET DIVISIONNAIRE (RAIL DIN)' : 'INTERACTIVE MODULAR DISTRIBUTION PANEL BUILDER'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Concepteur de Tableau Électrique Modulaire' : 'DIN-Rail Consumer Unit & Panel Canvas'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Organisez vos rails DIN, ajoutez disjoncteurs MCB, différentiels 30 mA, parafoudres et contacteurs, et visualisez l\'équilibrage des phases.'
              : 'Configure DIN rails, place MCBs, 30 mA RCDs, SPDs, and contactors, and evaluate real-time phase balancing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 61439-3 / NF C 15-100" />
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
            {circuits.length} {locale === 'fr' ? 'Modules Câblés' : 'Wired Circuits'}
          </span>
        </div>
      </div>

      {/* Top Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
        
        {/* Rail Count */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Nombre de Rails DIN (Hauteur Coffret) :' : 'Number of DIN Rails (Enclosure Size):'}
          </label>
          <select
            value={railCount}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setRailCount(Number(e.target.value));
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
          >
            <option value={1}>1 Rail (18 Modules · Petit Coffret)</option>
            <option value={2}>2 Rails (36 Modules · Logement T2/T3)</option>
            <option value={3}>3 Rails (54 Modules · Logement T4/T5 & Petit Tertiaire)</option>
            <option value={4}>4 Rails (72 Modules · Tertiaire & Bâtiment)</option>
          </select>
        </div>

        {/* Panel Incomer */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Appareil de Tête / Incomer :' : 'Main Panel Incomer:'}
          </label>
          <select
            value={panelIncomerType}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setPanelIncomerType(e.target.value as any);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-xs focus:border-cyan-400 focus:outline-none font-bold"
          >
            <option value="RCD_300MA_S">{locale === 'fr' ? 'Différentiel 300 mA Sélectif (S) 63 A' : '300 mA Selective (S) RCD 63 A'}</option>
            <option value="ISOLATOR_63A">{locale === 'fr' ? 'Interrupteur-Sectionneur 63 A' : 'Main Switch Disconnector 63 A'}</option>
            <option value="MCB_40A">{locale === 'fr' ? 'Disjoncteur Général 40 A Courbe C' : 'Main MCB 40 A Curve C'}</option>
          </select>
        </div>

        {/* Total Load & Phase Balance Metric */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Puissance Installée :' : 'Connected Power:'}</span>
            <span className="text-base font-black text-white">{Math.round(totalPanelWatts / 1000 * 10) / 10} kW</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{locale === 'fr' ? 'Déséquilibre Phases :' : 'Phase Unbalance:'}</span>
            <span className={`font-bold ${phaseUnbalancePercent > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {phaseUnbalancePercent}% {phaseUnbalancePercent > 25 ? '⚠️' : '✓'}
            </span>
          </div>
        </div>

      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setActiveView('PHYSICAL_RACK');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeView === 'PHYSICAL_RACK'
              ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Box className="h-3.5 w-3.5" />
          <span>{locale === 'fr' ? 'Vue Coffret sur Rail DIN (Rack Physique)' : 'Physical DIN-Rail Rack View'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setActiveView('PHASE_BALANCE');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeView === 'PHASE_BALANCE'
              ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          <span>{locale === 'fr' ? 'Équilibrage des Phases L1/L2/L3' : 'Phase Load Balancing'}</span>
        </button>
      </div>

      {/* Main Rack View Canvas */}
      {activeView === 'PHYSICAL_RACK' ? (
        <div className="space-y-4">
          
          {/* DIN Rails Chassis */}
          <div className="p-5 rounded-2xl bg-[#070A12] border-2 border-slate-700 space-y-6 shadow-2xl">
            
            {/* Top Neutral & Earth Bars */}
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800 text-[10px]">
              <div className="p-2 rounded bg-blue-950/40 border border-blue-600/40 flex items-center justify-between text-blue-300 font-bold">
                <span>BORNIER NEUTRE (N) · Cuivre Étamé</span>
                <span>230 V</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between text-emerald-300 font-bold">
                <span>BORNIER DE TERRE (PE) · Vert/Jaune</span>
                <span>0 V (BEP)</span>
              </div>
            </div>

            {/* Individual DIN Rails */}
            {Array.from({ length: railCount }, (_, rIdx) => {
              const rowNumber = (rIdx + 1) as 1 | 2 | 3 | 4;
              const rowCircuits = circuits.filter((c) => c.railRow === rowNumber);
              return (
                <div key={rowNumber} className="space-y-2 p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>RAIL DIN #{rowNumber}</span>
                      <span className="text-slate-500 font-normal">· Profilé Oméga 35 mm</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddCircuit(rowNumber)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{locale === 'fr' ? 'Ajouter Module' : 'Add Module'}</span>
                    </button>
                  </div>

                  {/* Modular Breakers Row */}
                  <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin">
                    {rowCircuits.length > 0 ? (
                      rowCircuits.map((cir) => {
                        const isSelected = selectedCircuitId === cir.id;
                        return (
                          <div
                            key={cir.id}
                            onClick={() => {
                              soundEffects.playSwitchClick();
                              setSelectedCircuitId(cir.id);
                            }}
                            className={`p-2.5 rounded-lg border flex flex-col justify-between min-w-[120px] max-w-[150px] min-h-[140px] transition-all cursor-pointer relative ${
                              cir.isTripped
                                ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500 shadow-lg'
                                : !cir.isClosed
                                ? 'bg-slate-900/60 border-slate-800 opacity-60'
                                : isSelected
                                ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-md'
                                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Breaker Top Label */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-300">{cir.tag}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-slate-400 font-bold">{cir.phase}</span>
                            </div>

                            {/* Device Specs */}
                            <div className="my-1.5 text-center">
                              <div className="text-lg">{cir.iconEmoji}</div>
                              <span className="text-[11px] font-black text-white block">
                                {cir.type} {cir.ratingAmps}A {cir.curve && `(${cir.curve})`}
                              </span>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5">{cir.name[locale]}</p>
                            </div>

                            {/* Breaker Switch Toggle */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBreaker(cir.id);
                                }}
                                className={`px-2 py-0.5 rounded text-[9px] font-extrabold transition-all ${
                                  cir.isTripped
                                    ? 'bg-rose-500 text-white animate-pulse'
                                    : cir.isClosed
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {cir.isTripped ? 'DÉCLENCHÉ' : cir.isClosed ? 'I (ON)' : 'O (OFF)'}
                              </button>

                              <span className="text-[9px] text-slate-500 font-mono">{cir.assignedLoadWatts} W</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-slate-600 text-xs italic w-full">
                        {locale === 'fr' ? 'Rail vide · Cliquez sur "Ajouter Module" pour câbler un départ.' : 'Empty DIN rail · Click "Add Module" to add breakers.'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Selected Circuit Inspector & Fault Injection Workbench */}
          {selectedCircuit && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase font-mono">
                    {selectedCircuit.tag} · {selectedCircuit.name[locale]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-bold">
                    {selectedCircuit.type} {selectedCircuit.ratingAmps} A
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateTrip(selectedCircuit.id, 'SHORT_CIRCUIT')}
                    className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Flame className="h-3 w-3" />
                    <span>{locale === 'fr' ? 'Simuler Court-Circuit' : 'Inject Short-Circuit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveCircuit(selectedCircuit.id)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800"
                    title={locale === 'fr' ? 'Supprimer ce circuit' : 'Delete circuit'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Section de Câble :' : 'Conductor Size:'}</span>
                  <span className="text-white font-bold">{selectedCircuit.wireSectionMm2} mm² Cuivre</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Phase Assignée :' : 'Phase Allocation:'}</span>
                  <span className="text-amber-300 font-bold">{selectedCircuit.phase}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Puissance Raccordée :' : 'Connected Load:'}</span>
                  <span className="text-cyan-300 font-bold">{selectedCircuit.assignedLoadWatts} Watts</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Statut Disjoncteur :' : 'Breaker State:'}</span>
                  <span className={`font-bold ${selectedCircuit.isTripped ? 'text-rose-400' : selectedCircuit.isClosed ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {selectedCircuit.isTripped ? 'DÉCLENCHÉ' : selectedCircuit.isClosed ? 'EN SERVICE (FERMÉ)' : 'OUVERT (HORS SERVICE)'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Phase Load Balancing View */
        <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-mono">
                {locale === 'fr' ? 'Équilibrage Triphasé des Charges (L1 / L2 / L3)' : 'Three-Phase Load Balancing Matrix'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {locale === 'fr'
                  ? 'Un bon équilibrage réduit le courant dans le conducteur neutre (IN) et minimise les pertes Joule et chutes de tension.'
                  : 'Symmetrical balancing minimizes neutral return current (IN) and mitigates Joule losses and voltage drops.'}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-lg border font-bold text-xs ${
              phaseUnbalancePercent <= 15 ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-rose-950 text-rose-300 border-rose-700'
            }`}>
              {phaseUnbalancePercent <= 15 ? (locale === 'fr' ? 'Équilibrage Conforme (<15%)' : 'Balanced (<15%)') : (locale === 'fr' ? 'Déséquilibre Excessif' : 'Unbalanced')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phase L1 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <span className="text-xs font-bold text-amber-300 uppercase block">Phase L1 (Marron)</span>
              <div className="text-2xl font-black text-white">{Math.round(phaseLoadsWatts.L1)} W</div>
              <span className="text-[10px] text-slate-400 block">{Math.round((phaseLoadsWatts.L1 / 230) * 10) / 10} A sous 230 V</span>
            </div>

            {/* Phase L2 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <span className="text-xs font-bold text-cyan-300 uppercase block">Phase L2 (Noir)</span>
              <div className="text-2xl font-black text-white">{Math.round(phaseLoadsWatts.L2)} W</div>
              <span className="text-[10px] text-slate-400 block">{Math.round((phaseLoadsWatts.L2 / 230) * 10) / 10} A sous 230 V</span>
            </div>

            {/* Phase L3 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <span className="text-xs font-bold text-emerald-300 uppercase block">Phase L3 (Gris)</span>
              <div className="text-2xl font-black text-white">{Math.round(phaseLoadsWatts.L3)} W</div>
              <span className="text-[10px] text-slate-400 block">{Math.round((phaseLoadsWatts.L3 / 230) * 10) / 10} A sous 230 V</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
