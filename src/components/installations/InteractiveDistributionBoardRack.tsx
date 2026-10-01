// src/components/installations/InteractiveDistributionBoardRack.tsx
// EPEDE D06 - Realistic Modular Distribution Board (Tableau Divisionnaire Modulaire sur Rail DIN)

import React, { useState } from 'react';
import {
  Zap,
  Power,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Activity,
  Layers,
  Info,
  Sliders,
  Sparkles,
  Gauge,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface CircuitBreakerModule {
  id: string;
  nameFr: string;
  nameEn: string;
  ratingA: number; // 10, 16, 20, 32
  curve: 'B' | 'C' | 'D';
  sectionMm2: number; // 1.5, 2.5, 6
  phase: 'L1' | 'L2' | 'L3';
  nominalLoadW: number;
  maxPoints: string;
  icon: string;
  isClosed: boolean; // Closed = breaker ON, Open = breaker OFF
  isTripped: boolean;
  tripReason?: 'OVERLOAD' | 'SHORT_CIRCUIT' | 'RCD_TRIP';
  railRow: 1 | 2 | 3;
}

interface InteractiveDistributionBoardRackProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const InteractiveDistributionBoardRack: React.FC<InteractiveDistributionBoardRackProps> = ({
  locale
}) => {
  // Main RCD states for the 3 DIN rails
  const [rcdRail1Tripped, setRcdRail1Tripped] = useState<boolean>(false);
  const [rcdRail2Tripped, setRcdRail2Tripped] = useState<boolean>(false);
  const [rcdRail3Tripped, setRcdRail3Tripped] = useState<boolean>(false);

  // Modular Surge Arrester (Parafoudre Type 2) cartridge state
  const [surgeArresterHealthy, setSurgeArresterHealthy] = useState<boolean>(true);

  // Off-peak water heater contactor mode: 'AUTO' | 'OFF' | 'FORCED'
  const [waterHeaterContactorMode, setWaterHeaterContactorMode] = useState<'AUTO' | 'OFF' | 'FORCED'>('AUTO');
  const [isOffPeakActive, setIsOffPeakActive] = useState<boolean>(true);

  // Circuits initial state
  const [circuits, setCircuits] = useState<CircuitBreakerModule[]>([
    // Rail 1: Éclairage & Parafoudre (Phase L1 predominantly)
    {
      id: 'Q1',
      nameFr: 'Éclairage Séjour & Cuisine LED DALI',
      nameEn: 'Living & Kitchen LED DALI Lighting',
      ratingA: 10,
      curve: 'C',
      sectionMm2: 1.5,
      phase: 'L1',
      nominalLoadW: 240,
      maxPoints: '8 points lumineux (1.5 mm²)',
      icon: '💡',
      isClosed: true,
      isTripped: false,
      railRow: 1
    },
    {
      id: 'Q2',
      nameFr: 'Éclairage Chambres & Salles d\'Eau',
      nameEn: 'Bedrooms & Bathrooms Lighting',
      ratingA: 10,
      curve: 'C',
      sectionMm2: 1.5,
      phase: 'L1',
      nominalLoadW: 180,
      maxPoints: '6 points lumineux (1.5 mm²)',
      icon: '💡',
      isClosed: true,
      isTripped: false,
      railRow: 1
    },
    {
      id: 'Q3',
      nameFr: 'Volets Roulants & Domotique',
      nameEn: 'Motorized Roller Shutters & Automation',
      ratingA: 10,
      curve: 'C',
      sectionMm2: 1.5,
      phase: 'L2',
      nominalLoadW: 350,
      maxPoints: '6 motorisations max',
      icon: '🪟',
      isClosed: true,
      isTripped: false,
      railRow: 1
    },
    {
      id: 'Q4',
      nameFr: 'Alimentation VMC Double Flux',
      nameEn: 'Dual-Flow Mechanical Ventilation (VMC)',
      ratingA: 10,
      curve: 'C',
      sectionMm2: 1.5,
      phase: 'L3',
      nominalLoadW: 65,
      maxPoints: 'Départ ventilation permanent',
      icon: '💨',
      isClosed: true,
      isTripped: false,
      railRow: 1
    },

    // Rail 2: Prises de courant & Spécialisés (Phase L2 predominantly)
    {
      id: 'Q5',
      nameFr: 'Prises Séjour & Multimédia (8 socles)',
      nameEn: 'Living Room General Sockets (8 outlets)',
      ratingA: 16,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L2',
      nominalLoadW: 1450,
      maxPoints: '8 socles max par disjoncteur',
      icon: '🔌',
      isClosed: true,
      isTripped: false,
      railRow: 2
    },
    {
      id: 'Q6',
      nameFr: 'Prises Cuisine & Plan de Travail',
      nameEn: 'Kitchen Worktop Sockets',
      ratingA: 16,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L1',
      nominalLoadW: 2100,
      maxPoints: '6 socles max pour cuisine',
      icon: '☕',
      isClosed: true,
      isTripped: false,
      railRow: 2
    },
    {
      id: 'Q7',
      nameFr: 'Circuit Spécialisé Lave-Linge',
      nameEn: 'Dedicated Washing Machine Feeder',
      ratingA: 20,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L2',
      nominalLoadW: 2200,
      maxPoints: 'Circuit dédié exclusif (1 prise)',
      icon: '🧺',
      isClosed: true,
      isTripped: false,
      railRow: 2
    },
    {
      id: 'Q8',
      nameFr: 'Circuit Spécialisé Lave-Vaisselle',
      nameEn: 'Dedicated Dishwasher Feeder',
      ratingA: 20,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L3',
      nominalLoadW: 1950,
      maxPoints: 'Circuit dédié exclusif (1 prise)',
      icon: '🍽️',
      isClosed: true,
      isTripped: false,
      railRow: 2
    },

    // Rail 3: Gros Électroménager, CVC & Chauffe-Eau (Phase L3 predominantly)
    {
      id: 'Q9',
      nameFr: 'Plaque de Cuisson Induction 7.2 kW',
      nameEn: '7.2 kW Induction Cooking Hob',
      ratingA: 32,
      curve: 'C',
      sectionMm2: 6.0,
      phase: 'L1',
      nominalLoadW: 4200,
      maxPoints: 'Boîte de connexion ou prise 32A',
      icon: '🍳',
      isClosed: true,
      isTripped: false,
      railRow: 3
    },
    {
      id: 'Q10',
      nameFr: 'Climatisation Inverter / Pompe à Chaleur',
      nameEn: 'Inverter Heat Pump / Air Conditioner',
      ratingA: 20,
      curve: 'D',
      sectionMm2: 2.5,
      phase: 'L2',
      nominalLoadW: 2600,
      maxPoints: 'Courbe D pour fort appel Id',
      icon: '❄️',
      isClosed: true,
      isTripped: false,
      railRow: 3
    },
    {
      id: 'Q11',
      nameFr: 'Chauffe-Eau Électrique (Cumulus 300L)',
      nameEn: 'Electric Storage Water Heater (300L)',
      ratingA: 20,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L3',
      nominalLoadW: 2400,
      maxPoints: 'Asservi contacteur Heures Creuses',
      icon: '🚿',
      isClosed: true,
      isTripped: false,
      railRow: 3
    },
    {
      id: 'Q12',
      nameFr: 'Prise de Recharge Véhicule Électrique (IRVE)',
      nameEn: 'EV Charger Dedicated Socket (Green\'Up)',
      ratingA: 20,
      curve: 'C',
      sectionMm2: 2.5,
      phase: 'L3',
      nominalLoadW: 3200,
      maxPoints: 'DDR 30mA Type F / Type B dédié',
      icon: '🚗',
      isClosed: true,
      isTripped: false,
      railRow: 3
    }
  ]);

  // Selected circuit for deep inspection
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('Q9');

  // Toggle individual breaker
  const handleToggleBreaker = (circuitId: string) => {
    setCircuits((prev) =>
      prev.map((c) => {
        if (c.id === circuitId) {
          if (c.isTripped) {
            // Reset breaker
            return { ...c, isTripped: false, isClosed: true, tripReason: undefined };
          }
          return { ...c, isClosed: !c.isClosed };
        }
        return c;
      })
    );
  };

  // Simulate overload or short circuit trip on a breaker
  const handleSimulateFault = (circuitId: string, reason: 'OVERLOAD' | 'SHORT_CIRCUIT') => {
    setCircuits((prev) =>
      prev.map((c) => {
        if (c.id === circuitId) {
          return {
            ...c,
            isClosed: false,
            isTripped: true,
            tripReason: reason
          };
        }
        return c;
      })
    );
  };

  // Test RCD button
  const handleTestRcd = (rail: 1 | 2 | 3) => {
    if (rail === 1) setRcdRail1Tripped(true);
    if (rail === 2) setRcdRail2Tripped(true);
    if (rail === 3) setRcdRail3Tripped(true);
  };

  // Reset all RCDs & breakers
  const handleResetBoard = () => {
    setRcdRail1Tripped(false);
    setRcdRail2Tripped(false);
    setRcdRail3Tripped(false);
    setSurgeArresterHealthy(true);
    setCircuits((prev) =>
      prev.map((c) => ({
        ...c,
        isClosed: true,
        isTripped: false,
        tripReason: undefined
      }))
    );
  };

  // Determine if a circuit is powered
  const isCircuitEnergized = (c: CircuitBreakerModule) => {
    if (!c.isClosed || c.isTripped) return false;
    if (c.railRow === 1 && rcdRail1Tripped) return false;
    if (c.railRow === 2 && rcdRail2Tripped) return false;
    if (c.railRow === 3 && rcdRail3Tripped) return false;
    if (c.id === 'Q11') {
      // Water heater logic
      if (waterHeaterContactorMode === 'OFF') return false;
      if (waterHeaterContactorMode === 'AUTO' && !isOffPeakActive) return false;
    }
    return true;
  };

  // Calculate live phase powers
  let powerL1 = 0;
  let powerL2 = 0;
  let powerL3 = 0;

  circuits.forEach((c) => {
    if (isCircuitEnergized(c)) {
      if (c.phase === 'L1') powerL1 += c.nominalLoadW;
      if (c.phase === 'L2') powerL2 += c.nominalLoadW;
      if (c.phase === 'L3') powerL3 += c.nominalLoadW;
    }
  });

  const totalBoardPowerW = powerL1 + powerL2 + powerL3;
  const currentL1A = powerL1 / 230;
  const currentL2A = powerL2 / 230;
  const currentL3A = powerL3 / 230;

  // Approximate neutral current vector calculation in balanced 120-deg system
  const inRad120 = (2 * Math.PI) / 3;
  const inRad240 = (4 * Math.PI) / 3;
  const realSum = currentL1A + currentL2A * Math.cos(inRad120) + currentL3A * Math.cos(inRad240);
  const imagSum = currentL2A * Math.sin(inRad120) + currentL3A * Math.sin(inRad240);
  const neutralCurrentA = Math.sqrt(realSum * realSum + imagSum * imagSum);

  const selectedCircuit = circuits.find((c) => c.id === selectedCircuitId) || circuits[0];

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px]">
              TABLEAU DIVISIONNAIRE MODULAIRE (TD)
            </span>
            <span className="text-slate-400 text-xs">Coffret IP30 / IK07 · 3 Rails DIN (36 Modules)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Armoire de Répartition Terminale, Disjoncteurs Divisionnaires & DDR'
              : 'Sub-Distribution Board Rack, DIN Rail Breakers & RCD Incomers'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Réarmer Tout le Tableau' : 'Reset All Breakers'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Telemetry Bar: Phase Current & Neutral Balancing */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-xl bg-[#0D131F] border border-[#1E2738]">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Puissance Totale Appelée :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-amber-400">{(totalBoardPowerW / 1000).toFixed(2)}</span>
            <span className="text-[10px] text-slate-400">kW</span>
          </div>
          <span className="text-[9px] text-slate-400">Cos φ = 0.95 global</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-red-400 uppercase font-bold">Courant Phase L1 :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-red-400">{currentL1A.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">A</span>
          </div>
          <span className="text-[9px] text-slate-400">{(powerL1 / 1000).toFixed(2)} kW assigné</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-amber-400 uppercase font-bold">Courant Phase L2 :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-amber-400">{currentL2A.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">A</span>
          </div>
          <span className="text-[9px] text-slate-400">{(powerL2 / 1000).toFixed(2)} kW assigné</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-sky-400 uppercase font-bold">Courant Phase L3 :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-sky-400">{currentL3A.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">A</span>
          </div>
          <span className="text-[9px] text-slate-400">{(powerL3 / 1000).toFixed(2)} kW assigné</span>
        </div>

        <div className="space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-cyan-300 uppercase font-bold">Courant Neutre Résiduel (In) :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-cyan-300">{neutralCurrentA.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">A</span>
          </div>
          <span className="text-[9px] text-emerald-400">
            {neutralCurrentA < 15 ? '✓ Équilibrage Acceptable' : '⚠ Déséquilibre sensible'}
          </span>
        </div>
      </div>

      {/* 3. Physical DIN Rail Enclosure (Le Coffret Électrique) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#06090F] border-2 border-[#1B2333] shadow-inner space-y-6 relative overflow-hidden">
        {/* Subtle screw mounts on corners to look like a real industrial enclosure */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />

        {/* Top Earth & Neutral Terminal Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1A2233]">
          {/* Earth Brass Bar (Bornier de Terre Vert/Jaune) */}
          <div className="p-2.5 rounded-lg bg-[#0C121D] border border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-300">
                {locale === 'fr' ? 'BORNIER DE TERRE PRINCIPAL (PE)' : 'MAIN EARTH TERMINAL (PE)'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Cuivre 16 mm² vers piquet
              </span>
              <span className="text-emerald-400 font-bold">R_A = 12.4 Ω</span>
            </div>
          </div>

          {/* Neutral Brass Bar (Bornier de Neutre Bleu) */}
          <div className="p-2.5 rounded-lg bg-[#0C121D] border border-sky-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="text-[10px] font-bold text-sky-300">
                {locale === 'fr' ? 'BORNIER DE RÉPARTITION NEUTRE (N)' : 'MAIN NEUTRAL TERMINAL (N)'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Cuivre 16 mm² isolé bleu
              </span>
              <span className="text-sky-400 font-bold">230 V / N</span>
            </div>
          </div>
        </div>

        {/* RAIL 1 (Rangée 1 DIN) */}
        <div className="p-3 rounded-xl bg-[#0B101A] border border-[#1B2436] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">RANG 1</span>
              <span className="font-bold text-slate-200">
                {locale === 'fr' ? 'Éclairage, VMC & Protection Parafoudre' : 'Lighting, VMC & Surge Protection'}
              </span>
            </div>
            <span className="text-slate-400">Peigne d'alimentation Phase L1 + Neutre</span>
          </div>

          {/* Physical modules on Rail 1 */}
          <div className="flex flex-wrap items-stretch gap-2 pt-1">
            {/* 1. Incomer RCD 30mA Type AC for Rail 1 */}
            <div className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 transition-all ${
              rcdRail1Tripped
                ? 'bg-red-950/40 border-red-500 text-red-200'
                : 'bg-[#121927] border-[#2A364C] text-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-400">DDR 1</span>
                  <span className={`w-2 h-2 rounded-full ${rcdRail1Tripped ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                </div>
                <div className="text-[10px] font-bold mt-0.5">40A / 30mA</div>
                <div className="text-[8px] text-slate-400">Type AC · 230V</div>
              </div>

              <div className="my-2 text-center">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${
                  rcdRail1Tripped ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {rcdRail1Tripped ? 'DÉCLENCHÉ' : 'ENCLENCHÉ'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#222E42]">
                <button
                  type="button"
                  onClick={() => handleTestRcd(1)}
                  disabled={rcdRail1Tripped}
                  title="Test différentiel mensuel (IΔn)"
                  className="w-full py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-[9px] border border-amber-500/40 transition-colors"
                >
                  TEST [T]
                </button>
                {rcdRail1Tripped && (
                  <button
                    type="button"
                    onClick={() => setRcdRail1Tripped(false)}
                    className="w-full py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] transition-colors"
                  >
                    RÉARMER
                  </button>
                )}
              </div>
            </div>

            {/* 2. Type 2 Modular Surge Arrester (Parafoudre) */}
            <div className="p-2.5 rounded-lg bg-[#121927] border border-[#2A364C] flex flex-col justify-between w-24 shrink-0">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-sky-400">SPD-T2</span>
                  <span className={`w-2 h-2 rounded-full ${surgeArresterHealthy ? 'bg-emerald-400' : 'bg-red-500'}`} />
                </div>
                <div className="text-[9px] font-bold mt-0.5">Parafoudre</div>
                <div className="text-[8px] text-slate-400">Up 1.5kV · In 20kA</div>
              </div>

              <div className="my-1.5 text-center">
                <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${
                  surgeArresterHealthy ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                }`}>
                  {surgeArresterHealthy ? 'CARTOUCHE OK' : 'DÉFECTUEUSE'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSurgeArresterHealthy(!surgeArresterHealthy)}
                className="text-[8px] text-slate-400 hover:text-white underline text-center"
              >
                {surgeArresterHealthy ? 'Simuler foudre' : 'Remplacer'}
              </button>
            </div>

            {/* 3. Breakers Q1, Q2, Q3, Q4 */}
            {circuits.filter((c) => c.railRow === 1).map((c) => {
              const energized = isCircuitEnergized(c);
              const isSelected = c.id === selectedCircuitId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCircuitId(c.id)}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'border-[#222E42] hover:border-slate-500'
                  } ${
                    c.isTripped
                      ? 'bg-red-950/30 text-red-200'
                      : !c.isClosed
                      ? 'bg-[#0E1420] text-slate-500'
                      : energized
                      ? 'bg-[#121927] text-slate-200'
                      : 'bg-[#101622] text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-amber-300">{c.id}</span>
                      <span className="text-[10px]">{c.icon}</span>
                    </div>
                    <div className="text-[10px] font-bold mt-0.5">
                      {c.ratingA}A - {c.curve}
                    </div>
                    <div className="text-[8px] text-slate-400 line-clamp-1">{c.nameFr}</div>
                  </div>

                  {/* Visual Breaker Switch Lever */}
                  <div className="my-2 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBreaker(c.id);
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        c.isTripped
                          ? 'bg-red-700 justify-center'
                          : c.isClosed
                          ? 'bg-emerald-600 justify-end'
                          : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                    <span className="text-[8px] mt-1 font-bold">
                      {c.isTripped ? 'DÉCLENCHÉ' : c.isClosed ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-[#1F2A3D] flex items-center justify-between text-[8px]">
                    <span className="text-slate-400">{c.phase}</span>
                    <span className={energized ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {energized ? `${c.nominalLoadW}W` : '0W'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RAIL 2 (Rangée 2 DIN) */}
        <div className="p-3 rounded-xl bg-[#0B101A] border border-[#1B2436] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">RANG 2</span>
              <span className="font-bold text-slate-200">
                {locale === 'fr' ? 'Prises de Courant & Circuits Spécialisés' : 'General Sockets & Dedicated Outlets'}
              </span>
            </div>
            <span className="text-slate-400">Peigne d'alimentation Phase L2 + Neutre</span>
          </div>

          <div className="flex flex-wrap items-stretch gap-2 pt-1">
            {/* Incomer RCD 30mA Type A for Rail 2 */}
            <div className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 transition-all ${
              rcdRail2Tripped
                ? 'bg-red-950/40 border-red-500 text-red-200'
                : 'bg-[#121927] border-[#2A364C] text-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-400">DDR 2</span>
                  <span className={`w-2 h-2 rounded-full ${rcdRail2Tripped ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                </div>
                <div className="text-[10px] font-bold mt-0.5">40A / 30mA</div>
                <div className="text-[8px] text-amber-300 font-bold">Type A (Courant pulsé)</div>
              </div>

              <div className="my-2 text-center">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${
                  rcdRail2Tripped ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {rcdRail2Tripped ? 'DÉCLENCHÉ' : 'ENCLENCHÉ'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#222E42]">
                <button
                  type="button"
                  onClick={() => handleTestRcd(2)}
                  disabled={rcdRail2Tripped}
                  className="w-full py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-[9px] border border-amber-500/40 transition-colors"
                >
                  TEST [T]
                </button>
                {rcdRail2Tripped && (
                  <button
                    type="button"
                    onClick={() => setRcdRail2Tripped(false)}
                    className="w-full py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] transition-colors"
                  >
                    RÉARMER
                  </button>
                )}
              </div>
            </div>

            {/* Breakers Q5, Q6, Q7, Q8 */}
            {circuits.filter((c) => c.railRow === 2).map((c) => {
              const energized = isCircuitEnergized(c);
              const isSelected = c.id === selectedCircuitId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCircuitId(c.id)}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'border-[#222E42] hover:border-slate-500'
                  } ${
                    c.isTripped
                      ? 'bg-red-950/30 text-red-200'
                      : !c.isClosed
                      ? 'bg-[#0E1420] text-slate-500'
                      : energized
                      ? 'bg-[#121927] text-slate-200'
                      : 'bg-[#101622] text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-amber-300">{c.id}</span>
                      <span className="text-[10px]">{c.icon}</span>
                    </div>
                    <div className="text-[10px] font-bold mt-0.5">
                      {c.ratingA}A - {c.curve}
                    </div>
                    <div className="text-[8px] text-slate-400 line-clamp-1">{c.nameFr}</div>
                  </div>

                  <div className="my-2 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBreaker(c.id);
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        c.isTripped
                          ? 'bg-red-700 justify-center'
                          : c.isClosed
                          ? 'bg-emerald-600 justify-end'
                          : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                    <span className="text-[8px] mt-1 font-bold">
                      {c.isTripped ? 'DÉCLENCHÉ' : c.isClosed ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-[#1F2A3D] flex items-center justify-between text-[8px]">
                    <span className="text-slate-400">{c.phase}</span>
                    <span className={energized ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {energized ? `${c.nominalLoadW}W` : '0W'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RAIL 3 (Rangée 3 DIN) */}
        <div className="p-3 rounded-xl bg-[#0B101A] border border-[#1B2436] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">RANG 3</span>
              <span className="font-bold text-slate-200">
                {locale === 'fr' ? 'Forte Puissance (32A), Pompe à Chaleur, Chauffe-eau & IRVE' : 'High Power (32A), Heat Pump, Water Heater & EV'}
              </span>
            </div>
            <span className="text-slate-400">Peigne d'alimentation Phase L3 + Neutre</span>
          </div>

          <div className="flex flex-wrap items-stretch gap-2 pt-1">
            {/* Incomer RCD 30mA Type A/F for Rail 3 */}
            <div className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 transition-all ${
              rcdRail3Tripped
                ? 'bg-red-950/40 border-red-500 text-red-200'
                : 'bg-[#121927] border-[#2A364C] text-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-400">DDR 3</span>
                  <span className={`w-2 h-2 rounded-full ${rcdRail3Tripped ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                </div>
                <div className="text-[10px] font-bold mt-0.5">63A / 30mA</div>
                <div className="text-[8px] text-amber-300 font-bold">Type F (Super-Immunisé)</div>
              </div>

              <div className="my-2 text-center">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${
                  rcdRail3Tripped ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {rcdRail3Tripped ? 'DÉCLENCHÉ' : 'ENCLENCHÉ'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#222E42]">
                <button
                  type="button"
                  onClick={() => handleTestRcd(3)}
                  disabled={rcdRail3Tripped}
                  className="w-full py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-[9px] border border-amber-500/40 transition-colors"
                >
                  TEST [T]
                </button>
                {rcdRail3Tripped && (
                  <button
                    type="button"
                    onClick={() => setRcdRail3Tripped(false)}
                    className="w-full py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] transition-colors"
                  >
                    RÉARMER
                  </button>
                )}
              </div>
            </div>

            {/* Breakers Q9, Q10, Q11, Q12 */}
            {circuits.filter((c) => c.railRow === 3).map((c) => {
              const energized = isCircuitEnergized(c);
              const isSelected = c.id === selectedCircuitId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCircuitId(c.id)}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between w-28 shrink-0 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'border-[#222E42] hover:border-slate-500'
                  } ${
                    c.isTripped
                      ? 'bg-red-950/30 text-red-200'
                      : !c.isClosed
                      ? 'bg-[#0E1420] text-slate-500'
                      : energized
                      ? 'bg-[#121927] text-slate-200'
                      : 'bg-[#101622] text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-amber-300">{c.id}</span>
                      <span className="text-[10px]">{c.icon}</span>
                    </div>
                    <div className="text-[10px] font-bold mt-0.5">
                      {c.ratingA}A - {c.curve}
                    </div>
                    <div className="text-[8px] text-slate-400 line-clamp-1">{c.nameFr}</div>
                  </div>

                  <div className="my-2 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBreaker(c.id);
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        c.isTripped
                          ? 'bg-red-700 justify-center'
                          : c.isClosed
                          ? 'bg-emerald-600 justify-end'
                          : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                    <span className="text-[8px] mt-1 font-bold">
                      {c.isTripped ? 'DÉCLENCHÉ' : c.isClosed ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-[#1F2A3D] flex items-center justify-between text-[8px]">
                    <span className="text-slate-400">{c.phase}</span>
                    <span className={energized ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {energized ? `${c.nominalLoadW}W` : '0W'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Day/Night Contacteur Jour/Nuit for Cumulus */}
            <div className="p-2.5 rounded-lg bg-[#121927] border border-[#2A364C] flex flex-col justify-between w-28 shrink-0">
              <div>
                <span className="text-[9px] font-bold text-sky-400">CONTACTEUR J/N</span>
                <div className="text-[9px] font-bold mt-0.5">Asservissement HC</div>
                <div className="text-[8px] text-slate-400">Signal EDF/Eneo 175Hz</div>
              </div>

              <div className="my-2 flex flex-col gap-1">
                <div className="grid grid-cols-3 gap-0.5 bg-[#0A0E17] p-0.5 rounded border border-[#202B3D]">
                  <button
                    type="button"
                    onClick={() => setWaterHeaterContactorMode('OFF')}
                    className={`py-1 rounded text-[8px] font-bold ${
                      waterHeaterContactorMode === 'OFF' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterHeaterContactorMode('AUTO')}
                    className={`py-1 rounded text-[8px] font-bold ${
                      waterHeaterContactorMode === 'AUTO' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterHeaterContactorMode('FORCED')}
                    className={`py-1 rounded text-[8px] font-bold ${
                      waterHeaterContactorMode === 'FORCED' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    1
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOffPeakActive(!isOffPeakActive)}
                  className={`text-[8px] py-0.5 rounded text-center font-bold ${
                    isOffPeakActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isOffPeakActive ? '● Signal HC Actif' : '○ Heures Pleines'}
                </button>
              </div>

              <div className="text-[8px] text-slate-400 text-center">
                Cumulus : <strong className={isCircuitEnergized(circuits[10]) ? 'text-emerald-400' : 'text-slate-500'}>
                  {isCircuitEnergized(circuits[10]) ? 'Chauffe en cours' : 'Arrêt'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep Circuit Inspection & Fault Simulation Drawer */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1C2538]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedCircuit.icon}</span>
            <div>
              <span className="text-xs font-black text-amber-300">{selectedCircuit.id} · {selectedCircuit.nameFr}</span>
              <span className="text-[10px] text-slate-400 ml-2 font-mono">
                Courbe {selectedCircuit.curve} · {selectedCircuit.ratingA} A · Section {selectedCircuit.sectionMm2} mm² Cuivre
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isCircuitEnergized(selectedCircuit)
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-red-950 text-red-300 border border-red-800'
            }`}>
              {isCircuitEnergized(selectedCircuit) ? 'CIRCUIT SOUS TENSION' : 'CIRCUIT HORS TENSION'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#1C2538]">
            <span className="text-[9px] text-slate-400 block uppercase">Pouvoir de Coupure (Icn) :</span>
            <strong className="text-white text-sm">4.5 kA / 6 kA</strong>
            <span className="text-[9px] text-slate-400 block mt-0.5">Norme NF EN 60898-1 / 60947-2</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#1C2538]">
            <span className="text-[9px] text-slate-400 block uppercase">Chute de Tension Estimée (ΔU) :</span>
            <strong className="text-emerald-400 text-sm">1.8% (4.1 V)</strong>
            <span className="text-[9px] text-slate-400 block mt-0.5">Pour 25 mètres de câble Cu</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#1C2538]">
            <span className="text-[9px] text-slate-400 block uppercase">Seuil Déclenchement Magnétique :</span>
            <strong className="text-sky-400 text-sm">
              {selectedCircuit.curve === 'B' ? '3 à 5 In' : selectedCircuit.curve === 'C' ? '5 à 10 In (50-100A)' : '10 à 20 In (200-400A)'}
            </strong>
            <span className="text-[9px] text-slate-400 block mt-0.5">Déclenchement instantané court-circuit</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#1C2538]">
            <span className="text-[9px] text-slate-400 block uppercase">Règle Normative NF C 15-100 :</span>
            <strong className="text-slate-200 text-xs">{selectedCircuit.maxPoints}</strong>
            <span className="text-[9px] text-slate-400 block mt-0.5">Protection mécanique par conduit ICTA</span>
          </div>
        </div>

        {/* Fault Injection Simulator Buttons */}
        <div className="pt-2 border-t border-[#1C2538] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] text-slate-400">
            {locale === 'fr'
              ? 'Laboratoire de Déclenchement : injecter une contrainte anormale sur ce départ'
              : 'Fault Simulation Lab: Inject abnormal event on this feeder'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulateFault(selectedCircuit.id, 'OVERLOAD')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'Surcharge Thermique (1.45 In)' : 'Thermal Overload (1.45 In)'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateFault(selectedCircuit.id, 'SHORT_CIRCUIT')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/40 transition-colors"
            >
              <Zap className="h-3.5 w-3.5 text-red-400" />
              <span>{locale === 'fr' ? 'Court-Circuit Phase-Neutre (Ik)' : 'Short Circuit (Ik)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
