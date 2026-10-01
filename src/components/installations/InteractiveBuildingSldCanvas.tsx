// src/components/installations/InteractiveBuildingSldCanvas.tsx
// EPEDE D06 - Interactive Building SLD & Physical/Functional Canvas

import React, { useState } from 'react';
import {
  Zap,
  Power,
  Shield,
  Layers,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Server,
  Wind,
  Lightbulb,
  Building,
  RefreshCw,
  Info
} from 'lucide-react';
import type {
  FacilityArchetype,
  InstallationViewMode,
  EarthingSystemType,
  OperatingRegime
} from './data/installationCatalog';

interface InteractiveBuildingSldCanvasProps {
  locale: 'fr' | 'en';
  archetype: FacilityArchetype;
  viewMode: InstallationViewMode;
  earthing: EarthingSystemType;
  regime: OperatingRegime;
  onSelectComponent: (componentId: string) => void;
}

interface CircuitBreakerState {
  id: string;
  label_fr: string;
  label_en: string;
  isClosed: boolean;
  rating: string;
  type: 'ACB' | 'MCCB' | 'MCB' | 'RCBO' | 'ATS_SWITCH';
}

export const InteractiveBuildingSldCanvas: React.FC<InteractiveBuildingSldCanvasProps> = ({
  locale,
  archetype,
  viewMode,
  earthing,
  regime,
  onSelectComponent
}) => {
  // State for interactive breakers
  const [breakers, setBreakers] = useState<Record<string, CircuitBreakerState>>({
    mainIncomer: {
      id: 'eq-acb-incomer-3200a',
      label_fr: 'Disjoncteur Général TGBT (Q0)',
      label_en: 'Main Incoming ACB (Q0)',
      isClosed: true,
      rating: '3200 A',
      type: 'ACB'
    },
    feederCapacitor: {
      id: 'eq-apfc-capacitor-bank',
      label_fr: 'Gradin Condensateurs 300 kvar (Q_cap)',
      label_en: 'Capacitor Bank 300 kvar (Q_cap)',
      isClosed: true,
      rating: '400 A',
      type: 'MCCB'
    },
    feederFloor1: {
      id: 'eq-mccb-feeder-400a',
      label_fr: 'Départ Étage 1 & Bureaux (Q1)',
      label_en: 'Floor 1 Feeder (Q1)',
      isClosed: true,
      rating: '250 A',
      type: 'MCCB'
    },
    feederFloor2: {
      id: 'eq-floor-distribution-board',
      label_fr: 'Départ Étage 2 & Ateliers (Q2)',
      label_en: 'Floor 2 Feeder (Q2)',
      isClosed: true,
      rating: '250 A',
      type: 'MCCB'
    },
    feederHvac: {
      id: 'eq-local-motor-isolator',
      label_fr: 'Départ Climatisation & Pompes CVC (Q_cvc)',
      label_en: 'HVAC & Chillers Feeder (Q_cvc)',
      isClosed: true,
      rating: '160 A',
      type: 'MCCB'
    },
    feederUpsCritical: {
      id: 'eq-ups-online-double-conv',
      label_fr: 'Départ Voie Ondulée Serveurs (Q_ups)',
      label_en: 'Critical UPS Infeed (Q_ups)',
      isClosed: true,
      rating: '400 A',
      type: 'MCCB'
    },
    branchLighting: {
      id: 'eq-led-luminaire-commercial',
      label_fr: 'Circuit Éclairage DALI (F1)',
      label_en: 'Lighting Circuit DALI (F1)',
      isClosed: true,
      rating: '16 A',
      type: 'MCB'
    },
    branchSockets: {
      id: 'eq-rcbo-device-16a',
      label_fr: 'Circuit Prises Bureaux 30mA (F2)',
      label_en: 'Office Socket Circuit 30mA (F2)',
      isClosed: true,
      rating: '16 A',
      type: 'RCBO'
    },
    branchMotor: {
      id: 'eq-hvac-water-pump-motor',
      label_fr: 'Circuit Moteur Pompe 15kW (F3)',
      label_en: 'Pump Motor Circuit 15kW (F3)',
      isClosed: true,
      rating: '32 A',
      type: 'MCB'
    }
  });

  const toggleBreaker = (key: string) => {
    setBreakers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isClosed: !prev[key].isClosed
      }
    }));
  };

  const resetAllBreakers = () => {
    setBreakers((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        updated[k].isClosed = true;
      });
      return updated;
    });
  };

  // Upstream-downstream energization propagation logic
  const isGridAvailable = regime !== 'ISLANDED_EMERGENCY';
  const isMainBusLive = isGridAvailable && breakers.mainIncomer.isClosed;
  const isFloor1Live = isMainBusLive && breakers.feederFloor1.isClosed;
  const isFloor2Live = isMainBusLive && breakers.feederFloor2.isClosed;
  const isHvacLive = isMainBusLive && breakers.feederHvac.isClosed;
  const isUpsInputLive = isMainBusLive && breakers.feederUpsCritical.isClosed;
  const isUpsOutputLive = isUpsInputLive || regime === 'ONLINE_UPS'; // battery backup
  const isCapacitorLive = isMainBusLive && breakers.feederCapacitor.isClosed;

  const isLightingLive = isFloor1Live && breakers.branchLighting.isClosed;
  const isSocketsLive = isFloor1Live && breakers.branchSockets.isClosed;
  const isMotorLive = isHvacLive && breakers.branchMotor.isClosed;

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Title bar with controls & status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800 text-[10px]">
                {viewMode === 'PHYSICAL'
                  ? 'VUE PHYSIQUE / ENCLOSURES'
                  : viewMode === 'ELECTRICAL_SLD'
                  ? 'SCHÉMA UNIFILAIRE ÉLECTRIQUE (SLD)'
                  : 'VUE FONCTIONNELLE & ZONES'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                RÉGIME : <span className="text-emerald-400">{earthing.replace('_', '-')}</span> · SOURCE :{' '}
                <span className="text-amber-400">{regime.replace('_', ' ')}</span>
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {locale === 'fr'
                ? 'Synoptique Dynamique Basse Tension & État des Disjoncteurs'
                : 'Interactive LV Single-Line Diagram & Circuit Breakers State'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAllBreakers}
            className="px-2.5 py-1 rounded-lg bg-[#141C2B] text-slate-300 hover:text-white border border-[#20293A] flex items-center gap-1.5 cursor-pointer text-[10px] font-bold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{locale === 'fr' ? 'Réarmer Tout' : 'Reset All'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="relative p-6 rounded-xl bg-[#06090F] border border-[#182234] overflow-x-auto min-h-[460px]">
        {/* Source Tier (Top) */}
        <div className="flex items-center justify-between max-w-4xl mx-auto pb-4 border-b border-[#1A2333]">
          {/* Main Utility Feed */}
          <div
            onClick={() => onSelectComponent('stage-01-network-interface')}
            className="p-3 rounded-xl bg-[#0E1522] border border-[#222E42] hover:border-amber-400 cursor-pointer transition-all w-56 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
              <Building className="h-4 w-4" />
              <span className="font-bold text-[10px]">
                {locale === 'fr' ? 'POSTE SOURCE MT/BT' : 'MV/LV SUBSTATION'}
              </span>
            </div>
            <div className="text-[10px] text-slate-300">20 kV / 400 V · 1250 kVA</div>
            <div className="text-[9px] text-emerald-400 font-bold mt-0.5">
              {isGridAvailable ? '✓ SOURCE ACTIVE' : '✗ RÉSEAU DÉFAILLANT'}
            </div>
          </div>

          {/* Generator / ATS Link */}
          {(archetype === 'CRITICAL_FACILITY' || archetype === 'TERTIARY_COMMERCIAL') && (
            <div
              onClick={() => onSelectComponent('eq-ats-automatic-transfer')}
              className="p-3 rounded-xl bg-[#0E1522] border border-[#222E42] hover:border-amber-400 cursor-pointer transition-all w-56 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
                <RefreshCw className="h-4 w-4" />
                <span className="font-bold text-[10px]">
                  {locale === 'fr' ? 'GROUPE DIESEL & ATS' : 'GENSET & ATS PANEL'}
                </span>
              </div>
              <div className="text-[10px] text-slate-300">800 kVA · Démarrage Auto</div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {regime === 'STANDBY_GENERATOR' ? '⚡ EN CHARGE (ACTIF)' : 'Veille Prêt'}
              </div>
            </div>
          )}
        </div>

        {/* Incomer Breaker (Q0) */}
        <div className="flex justify-center my-4">
          <div className="relative flex flex-col items-center">
            {/* Vertical Line */}
            <div
              className={`w-1 h-6 transition-colors ${
                isGridAvailable ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-700'
              }`}
            />

            {/* Breaker Card Toggle */}
            <div
              onClick={() => toggleBreaker('mainIncomer')}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                breakers.mainIncomer.isClosed
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950'
              }`}
            >
              <Power className="h-4 w-4" />
              <div className="text-left">
                <div className="text-[10px] font-bold">
                  {locale === 'fr' ? breakers.mainIncomer.label_fr : breakers.mainIncomer.label_en}
                </div>
                <div className="text-[9px] text-slate-400">
                  ACB · 3200 A ·{' '}
                  <strong className={breakers.mainIncomer.isClosed ? 'text-emerald-400' : 'text-rose-400'}>
                    {breakers.mainIncomer.isClosed
                      ? locale === 'fr'
                        ? 'FERMÉ (ENERGIZED)'
                        : 'CLOSED (LIVE)'
                      : locale === 'fr'
                      ? 'OUVERT (ISOLÉ)'
                      : 'OPEN (ISOLATED)'}
                  </strong>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {locale === 'fr' ? 'Clic: basculer' : 'Click: toggle'}
              </span>
            </div>

            {/* Vertical Line to Main Busbar */}
            <div
              className={`w-1 h-6 transition-colors ${
                isMainBusLive ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-700'
              }`}
            />
          </div>
        </div>

        {/* Main Copper Busbar Spine (TGBT Barres Cuivre) */}
        <div className="max-w-4xl mx-auto my-1">
          <div
            onClick={() => onSelectComponent('eq-main-copper-busbar')}
            className={`p-3 rounded-xl border transition-all cursor-pointer text-center relative ${
              isMainBusLive
                ? 'bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900/50 border-slate-700 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-black uppercase tracking-wider">
                {locale === 'fr'
                  ? 'JEU DE BARRES PRINCIPAL CUIVRE TGBT (400 V - 3200 A - Forme 4b)'
                  : 'MAIN TGBT COPPER BUSBAR TRUNK (400 V - 3200 A - Form 4b)'}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  isMainBusLive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isMainBusLive ? '400 V AC · 50 Hz SOUS TENSION' : 'HORS TENSION (0 V)'}
              </span>
            </div>
          </div>
        </div>

        {/* Branch Lines from Main Busbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-4">
          {/* Branch 1: Floor 1 Distribution Board */}
          <div className="flex flex-col items-center">
            <div
              className={`w-0.5 h-4 ${isFloor1Live ? 'bg-amber-400' : 'bg-slate-700'}`}
            />
            {/* Feeder Breaker Q1 */}
            <div
              onClick={() => toggleBreaker('feederFloor1')}
              className={`w-full p-2 rounded-lg border text-center cursor-pointer transition-all ${
                breakers.feederFloor1.isClosed && isMainBusLive
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold truncate">
                {locale === 'fr' ? 'Départ Étage 1 (Q1)' : 'Floor 1 (Q1)'}
              </div>
              <div className="text-[9px]">
                MCCB 250 A ·{' '}
                <strong className={breakers.feederFloor1.isClosed ? 'text-emerald-400' : 'text-rose-400'}>
                  {breakers.feederFloor1.isClosed ? 'ON' : 'OFF'}
                </strong>
              </div>
            </div>

            <div
              className={`w-0.5 h-4 ${isFloor1Live ? 'bg-amber-400' : 'bg-slate-700'}`}
            />

            {/* Sub-Panel: Floor 1 DB */}
            <div
              onClick={() => onSelectComponent('eq-floor-distribution-board')}
              className={`w-full p-2.5 rounded-xl border text-center cursor-pointer transition-all space-y-1 ${
                isFloor1Live
                  ? 'bg-[#0E1522] border-sky-500/50 text-sky-200 shadow-md'
                  : 'bg-[#090D15] border-slate-800 text-slate-600'
              }`}
            >
              <div className="text-[10px] font-bold">
                {locale === 'fr' ? 'Tableau TD1 Bureaux' : 'Floor 1 DB'}
              </div>
              <div className="text-[9px] text-slate-400">Rail DIN · DDR 30mA</div>

              {/* Sub-circuits inside Floor 1 */}
              <div className="pt-2 border-t border-[#1C2538] space-y-1">
                {/* Circuit Lighting */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBreaker('branchLighting');
                  }}
                  className={`p-1 rounded text-[9px] flex items-center justify-between cursor-pointer border ${
                    isLightingLive
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    <span>Éclairage LED</span>
                  </span>
                  <span className="font-bold">{breakers.branchLighting.isClosed ? 'ON' : 'OFF'}</span>
                </div>

                {/* Circuit Sockets */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBreaker('branchSockets');
                  }}
                  className={`p-1 rounded text-[9px] flex items-center justify-between cursor-pointer border ${
                    isSocketsLive
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>Prises 30mA</span>
                  </span>
                  <span className="font-bold">{breakers.branchSockets.isClosed ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch 2: HVAC & Water Pump */}
          <div className="flex flex-col items-center">
            <div
              className={`w-0.5 h-4 ${isHvacLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />
            {/* Feeder Breaker HVAC */}
            <div
              onClick={() => toggleBreaker('feederHvac')}
              className={`w-full p-2 rounded-lg border text-center cursor-pointer transition-all ${
                breakers.feederHvac.isClosed && isMainBusLive
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold truncate">
                {locale === 'fr' ? 'Départ CVC Force (Q_cvc)' : 'HVAC Main (Q_cvc)'}
              </div>
              <div className="text-[9px]">
                MCCB 160 A ·{' '}
                <strong className={breakers.feederHvac.isClosed ? 'text-emerald-400' : 'text-rose-400'}>
                  {breakers.feederHvac.isClosed ? 'ON' : 'OFF'}
                </strong>
              </div>
            </div>

            <div
              className={`w-0.5 h-4 ${isHvacLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />

            {/* Terminal Motor & Pump */}
            <div
              onClick={() => onSelectComponent('eq-hvac-water-pump-motor')}
              className={`w-full p-2.5 rounded-xl border text-center cursor-pointer transition-all space-y-1 ${
                isMotorLive
                  ? 'bg-[#0E1522] border-cyan-500/50 text-cyan-200 shadow-md'
                  : 'bg-[#090D15] border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-cyan-400">
                <Wind className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold">
                  {locale === 'fr' ? 'Groupe Pompe CVC 15kW' : 'HVAC Pump 15 kW'}
                </span>
              </div>
              <div className="text-[9px] text-slate-400">
                Cos φ = 0.86 · IE3 Premium
              </div>
              <div className="pt-1 text-[9px] font-bold">
                {isMotorLive ? (
                  <span className="text-cyan-300 animate-pulse">⚡ EN ROTATION (60 m³/h)</span>
                ) : (
                  <span className="text-slate-500">ARRÊTÉ</span>
                )}
              </div>
            </div>
          </div>

          {/* Branch 3: Critical UPS & Server Room */}
          <div className="flex flex-col items-center">
            <div
              className={`w-0.5 h-4 ${isUpsInputLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />
            {/* Feeder Breaker UPS */}
            <div
              onClick={() => toggleBreaker('feederUpsCritical')}
              className={`w-full p-2 rounded-lg border text-center cursor-pointer transition-all ${
                breakers.feederUpsCritical.isClosed && isMainBusLive
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold truncate">
                {locale === 'fr' ? 'Départ Onduleur (Q_ups)' : 'UPS Infeed (Q_ups)'}
              </div>
              <div className="text-[9px]">
                MCCB 400 A ·{' '}
                <strong className={breakers.feederUpsCritical.isClosed ? 'text-emerald-400' : 'text-rose-400'}>
                  {breakers.feederUpsCritical.isClosed ? 'ON' : 'OFF'}
                </strong>
              </div>
            </div>

            <div
              className={`w-0.5 h-4 ${isUpsOutputLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />

            {/* UPS & Servers */}
            <div
              onClick={() => onSelectComponent('eq-ups-online-double-conv')}
              className={`w-full p-2.5 rounded-xl border text-center cursor-pointer transition-all space-y-1 ${
                isUpsOutputLive
                  ? 'bg-[#0E1522] border-emerald-500/50 text-emerald-200 shadow-md'
                  : 'bg-[#090D15] border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-emerald-400">
                <Server className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold">
                  {locale === 'fr' ? 'Onduleur 200 kVA' : 'UPS 200 kVA (VFI)'}
                </span>
              </div>
              <div className="text-[9px] text-slate-400">
                Double Conversion 0 ms
              </div>
              <div className="pt-1 text-[9px] font-bold">
                {isUpsOutputLive ? (
                  <span className="text-emerald-300">✓ BAIES SERVEURS ONLINE</span>
                ) : (
                  <span className="text-rose-400">PANNE CRITIQUE</span>
                )}
              </div>
            </div>
          </div>

          {/* Branch 4: Capacitor Bank (APFC) */}
          <div className="flex flex-col items-center">
            <div
              className={`w-0.5 h-4 ${isCapacitorLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />
            {/* Feeder Breaker Capacitor */}
            <div
              onClick={() => toggleBreaker('feederCapacitor')}
              className={`w-full p-2 rounded-lg border text-center cursor-pointer transition-all ${
                breakers.feederCapacitor.isClosed && isMainBusLive
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold truncate">
                {locale === 'fr' ? 'Condensateurs (Q_cap)' : 'Capacitor (Q_cap)'}
              </div>
              <div className="text-[9px]">
                MCCB 400 A ·{' '}
                <strong className={breakers.feederCapacitor.isClosed ? 'text-emerald-400' : 'text-rose-400'}>
                  {breakers.feederCapacitor.isClosed ? 'ON' : 'OFF'}
                </strong>
              </div>
            </div>

            <div
              className={`w-0.5 h-4 ${isCapacitorLive ? 'bg-amber-400' : 'bg-slate-700'}`}
            />

            {/* APFC Bank */}
            <div
              onClick={() => onSelectComponent('eq-apfc-capacitor-bank')}
              className={`w-full p-2.5 rounded-xl border text-center cursor-pointer transition-all space-y-1 ${
                isCapacitorLive
                  ? 'bg-[#0E1522] border-amber-500/50 text-amber-200 shadow-md'
                  : 'bg-[#090D15] border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold">
                  {locale === 'fr' ? 'Batterie APFC 300 kvar' : 'APFC Bank 300 kvar'}
                </span>
              </div>
              <div className="text-[9px] text-slate-400">
                Selfs anti-harmoniques 189 Hz
              </div>
              <div className="pt-1 text-[9px] font-bold text-amber-400">
                {isCapacitorLive ? 'Cos φ compensé : 0.98' : 'Cos φ naturel : 0.81'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
