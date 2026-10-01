// src/components/journey/InteractiveHouseLamp.tsx
import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  Power, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Activity,
  Zap,
  Info,
  Layers,
  Droplets,
  Gauge,
  Flame
} from 'lucide-react';
import { StageId } from './types';

interface InteractiveHouseLampProps {
  locale: 'fr' | 'en';
  isLampOn: boolean;
  onToggleLamp: () => void;
  onTraceUpstream: () => void;
  onJumpToStage: (stage: StageId) => void;
}

type ApplianceId = 'led' | 'kettle' | 'heatpump' | 'ev_charger';

interface ApplianceConfig {
  id: ApplianceId;
  name: { fr: string; en: string };
  pWatts: number;
  cosPhi: number;
  desc: { fr: string; en: string };
}

const APPLIANCES: Record<ApplianceId, ApplianceConfig> = {
  led: {
    id: 'led',
    name: { fr: 'Ampoule LED Basse Conso', en: 'Low-Power LED Bulb' },
    pWatts: 10,
    cosPhi: 0.95,
    desc: {
      fr: 'Éclairage résidentiel moderne ultra-efficace.',
      en: 'Modern ultra-efficient residential lighting.',
    },
  },
  kettle: {
    id: 'kettle',
    name: { fr: 'Bouilloire Électrique 2.2 kW', en: 'Electric Kettle 2.2 kW' },
    pWatts: 2200,
    cosPhi: 1.0,
    desc: {
      fr: 'Résistance pure chauffant 1.5 L d\'eau en 3 minutes.',
      en: 'Pure resistance element boiling 1.5 L of water in 3 minutes.',
    },
  },
  heatpump: {
    id: 'heatpump',
    name: { fr: 'Pompe à Chaleur Inverter 3.5 kW', en: 'Inverter Heat Pump 3.5 kW' },
    pWatts: 3500,
    cosPhi: 0.92,
    desc: {
      fr: 'Compresseur thermodynamique à variation de vitesse.',
      en: 'Variable-speed thermodynamic compressor.',
    },
  },
  ev_charger: {
    id: 'ev_charger',
    name: { fr: 'Borne Véhicule Électrique 7.4 kW (32 A)', en: '7.4 kW EV Fast Charger (32 A)' },
    pWatts: 7400,
    cosPhi: 0.98,
    desc: {
      fr: 'Recharge rapide monophasée 32A à pleine puissance du tableau.',
      en: 'Fast 32A single-phase residential charging at full panel rating.',
    },
  },
};

export const InteractiveHouseLamp: React.FC<InteractiveHouseLampProps> = ({
  locale,
  isLampOn,
  onToggleLamp,
  onTraceUpstream,
  onJumpToStage,
}) => {
  const [showFullAha, setShowFullAha] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceId>('led');

  const activeAppliance = APPLIANCES[selectedAppliance];

  // Electromechanical calculation:
  // Current I = P / (V_nom * cosPhi)
  // Voltage drop on branch circuit (R_feeder ≈ 0.12 ohm)
  // Upstream water flow Delta Q = P / (rho * g * H * eta) with H=110m, eta=0.90 => ~971.2 W per L/s
  // Mechanical counter-torque Delta Te = P / omega with omega = 2*pi*375/60 = 39.27 rad/s
  const telemetry = useMemo(() => {
    if (!isLampOn) {
      return {
        voltage: '230.2 V',
        current: '0.000 A',
        power: '0.0 W',
        waterFlowDelta: '0.00 L/s',
        counterTorque: '0.0 N·m',
      };
    }

    const p = activeAppliance.pWatts;
    const pf = activeAppliance.cosPhi;
    const nominalV = 230.0;
    const currentA = p / (nominalV * pf);
    const vDrop = currentA * 0.12;
    const terminalV = (nominalV - vDrop).toFixed(1);

    // Delta Q in Litres/second
    const deltaQ = (p / 971.2).toFixed(2);
    // Delta Te in N*m
    const deltaTe = (p / 39.27).toFixed(1);

    return {
      voltage: `${terminalV} V`,
      current: `${currentA.toFixed(2)} A`,
      power: `${p >= 1000 ? (p / 1000).toFixed(2) + ' kW' : p + ' W'}`,
      waterFlowDelta: `${deltaQ} L/s`,
      counterTorque: `${deltaTe} N·m`,
    };
  }, [isLampOn, activeAppliance]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
      {/* Decorative ambient background glow when lamp is ON */}
      <div 
        className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isLampOn ? 'bg-amber-400/20 opacity-100' : 'bg-transparent opacity-0'
        }`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Visual Room, Wall Switch & Glowing Lamp */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl relative">
          {/* Ceiling hanging wire */}
          <div className="w-0.5 h-16 bg-slate-400 mb-2 relative">
            <span className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-slate-500" />
          </div>

          {/* Lamp Assembly */}
          <div className="relative flex flex-col items-center mb-8">
            {/* Lamp Fixture Cap */}
            <div className="w-12 h-4 bg-slate-600 rounded-t-lg border-b border-slate-500" />
            
            {/* Lamp Bulb */}
            <div 
              onClick={onToggleLamp}
              className={`cursor-pointer transition-all duration-500 relative flex items-center justify-center rounded-full p-6 ${
                isLampOn
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_80px_rgba(251,191,36,0.6)] scale-105'
                  : 'bg-slate-200 text-slate-500 border border-slate-300'
              }`}
            >
              <Lightbulb className={`h-16 w-16 transition-transform duration-300 ${isLampOn ? 'scale-110' : ''}`} />
            </div>

            {/* Glowing Light Ray Pool on Floor */}
            {isLampOn && (
              <div className="w-48 h-8 rounded-full bg-amber-400/40 blur-md mt-6 transition-all animate-pulse" />
            )}
          </div>

          {/* Wall Switch Control */}
          <div className="flex flex-col items-center gap-3 bg-white p-5 rounded-xl border border-slate-200/90 w-full max-w-xs shadow-xs">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono font-bold text-slate-700">
                {locale === 'fr' ? 'INTERRUPTEUR MURAL' : 'WALL LIGHT SWITCH'}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isLampOn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {isLampOn ? 'CIRCUIT FERMÉ (ON)' : 'CIRCUIT OUVERT (OFF)'}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleLamp}
              className={`w-full py-3 rounded-xl font-mono text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xs ${
                isLampOn
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Power className="h-4 w-4" />
              <span>
                {isLampOn 
                  ? (locale === 'fr' ? 'ÉTEINDRE LA LAMPE' : 'SWITCH OFF LAMP')
                  : (locale === 'fr' ? 'ALLUMER LA LAMPE' : 'SWITCH ON LAMP')}
              </span>
            </button>

            {/* Appliance Selector Pills */}
            <div className="w-full space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 block font-bold">
                {locale === 'fr' ? 'APPAREIL RÉSIDENTIEL CONNECTÉ :' : 'CONNECTED RESIDENTIAL APPLIANCE :'}
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {(Object.keys(APPLIANCES) as ApplianceId[]).map((appKey) => {
                  const item = APPLIANCES[appKey];
                  const isSelected = selectedAppliance === appKey;
                  return (
                    <button
                      key={appKey}
                      type="button"
                      onClick={() => setSelectedAppliance(appKey)}
                      className={`p-1.5 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className="truncate">{item.name[locale]}</div>
                      <div className="text-[9px] text-sky-700 font-semibold">
                        {item.pWatts >= 1000 ? `${item.pWatts / 1000} kW` : `${item.pWatts} W`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Domestic Telemetry */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-100 text-center font-mono">
              <div>
                <span className="text-[9px] text-slate-400 block">TENSION</span>
                <span className="text-xs font-bold text-sky-700">{telemetry.voltage}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">COURANT</span>
                <span className="text-xs font-bold text-amber-700">{telemetry.current}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">PUISSANCE</span>
                <span className="text-xs font-bold text-emerald-700">{telemetry.power}</span>
              </div>
            </div>

            {/* Upstream Hydro-Mechanical Reaction Telemetry */}
            <div className="w-full p-2.5 rounded-xl bg-sky-50/70 border border-sky-200/80 font-mono text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-sky-800 font-bold">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <Droplets className="h-3 w-3 text-sky-600" />
                  <span>{locale === 'fr' ? 'RÉACTION MÉCANIQUE BARRAGE' : 'DAM MECHANICAL REACTION'}</span>
                </span>
                <span className="text-[9px] text-slate-500">H=110m · 375 tr/min</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-sky-100">
                <div className="bg-white p-1.5 rounded-lg border border-sky-100">
                  <span className="text-[9px] text-slate-500 block">DÉBIT D'EAU (ΔQ)</span>
                  <span className="text-xs font-bold text-sky-700">{telemetry.waterFlowDelta}</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-sky-100">
                  <span className="text-[9px] text-slate-500 block">COUPLE (ΔTe)</span>
                  <span className="text-xs font-bold text-amber-700">{telemetry.counterTorque}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Narrative Mystery & Upstream Tracing */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span>{locale === 'fr' ? 'L\'ÉCOSYSTÈME INVISIBLE' : 'THE INVISIBLE ECOSYSTEM'}</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight font-mono">
              {locale === 'fr' 
                ? '« Vous allumez une lampe. Comment l\'électricité est-elle arrivée ici ? »'
                : '“You switched on a light. How did the electricity get here?”'}
            </h2>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'En appuyant sur cet interrupteur, la lampe s\'allume instantanément. Mais cette énergie ne provient pas du mur de votre maison. Elle est le fruit d\'un gigantesque écosystème technologique en temps réel, reliant une rivière de montagne, des turbines monumentales, des transformateurs à 225 000 Volts, des lignes à haute tension et des systèmes de protection ultra-rapides.'
                : 'When you flick this switch, light appears instantly. But that energy does not come from the wall. It is the real-time result of an immense technical ecosystem linking mountain rivers, massive turbines, 225,000 Volt step-up transformers, transmission towers, and millisecond protection relays.'}
            </p>
          </div>

          {/* Primary Call to Action: Trace the Electricity */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onTraceUpstream}
              className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-5 w-5 text-amber-400" />
              <span>
                {locale === 'fr' 
                  ? 'REMONTER LE COURANT JUSQU\'À LA CENTRALE' 
                  : 'TRACE THE ELECTRICITY UPSTREAM'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowFullAha(!showFullAha)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <Info className="h-4 w-4 text-sky-600" />
              <span>
                {showFullAha 
                  ? (locale === 'fr' ? 'Masquer la révélation complète' : 'Hide full revelation')
                  : (locale === 'fr' ? 'Découvrir la révélation finale EPEDE' : 'Discover the final EPEDE revelation')}
              </span>
            </button>
          </div>

          {/* The Final Revelation Accordion / Card */}
          {showFullAha && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3 font-mono text-xs text-slate-700 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>{locale === 'fr' ? 'LE MESSAGE FONDAMENTAL EPEDE' : 'THE CORE EPEDE MESSAGE'}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {locale === 'fr' ? '« Vous avez allumé une lumière. »' : '“You switched on a light.”'}
              </p>
              <p className="text-sm font-semibold text-amber-800">
                {locale === 'fr' 
                  ? '« Mais la lumière ne vient pas du mur. »' 
                  : '“But the light did not come from the wall.”'}
              </p>
              <p className="text-sm font-semibold text-sky-800">
                {locale === 'fr'
                  ? '« Elle vient d\'un écosystème électrique interconnecté tout entier. »'
                  : '“It came from an entire interconnected electrical ecosystem.”'}
              </p>
              <p className="text-xs text-emerald-800 font-bold pt-2 border-t border-amber-200/80">
                {locale === 'fr'
                  ? '« EPEDE rend cet écosystème invisible visible. »'
                  : '“EPEDE makes that invisible ecosystem visible.”'}
              </p>
            </div>
          )}

          {/* Quick Stage Jump Links */}
          <div className="pt-3 border-t border-slate-200/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
              {locale === 'fr' ? 'Accès direct aux maillons du parcours :' : 'Direct access to ecosystem links:'}
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => onJumpToStage('generation')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors"
              >
                1. {locale === 'fr' ? 'Barrage & Turbine' : 'Dam & Turbine'}
              </button>
              <button
                type="button"
                onClick={() => onJumpToStage('switchyard')}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 transition-colors"
              >
                2. {locale === 'fr' ? 'Transfo GSU 225kV' : '225kV GSU Trafo'}
              </button>
              <button
                type="button"
                onClick={() => onJumpToStage('transmission')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 transition-colors"
              >
                3. {locale === 'fr' ? 'Pylônes & Câbles' : 'Towers & Lines'}
              </button>
              <button
                type="button"
                onClick={() => onJumpToStage('substation')}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition-colors"
              >
                4. {locale === 'fr' ? 'Poste 225/30kV' : '225/30kV Substation'}
              </button>
              <button
                type="button"
                onClick={() => onJumpToStage('distribution')}
                className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/80 transition-colors"
              >
                5. {locale === 'fr' ? 'Transfo 400V Dyn11' : 'Dyn11 400V Trafo'}
              </button>
              <button
                type="button"
                onClick={() => onJumpToStage('consumption')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 transition-colors"
              >
                6. {locale === 'fr' ? 'Maison & Lampe 230V' : 'Home & 230V Lamp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
