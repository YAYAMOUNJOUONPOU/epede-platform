// src/components/installations/SurgeProtectionDeviceLab.tsx
// EPEDE D06 - Interactive Surge Protective Device (SPD / Parafoudre) Laboratory
// Demonstrates impulse waveforms (10/350 µs vs 8/20 µs), Type 1/2/3 coordination, the 50 cm lead length rule, and cartridge health.

import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Sliders,
  Scale,
  Flame,
  Info,
  Radio,
  Layers
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type SpdTypeCategory = 'TYPE_1' | 'TYPE_2' | 'TYPE_3';

interface SurgeProtectionDeviceLabProps {
  locale: 'fr' | 'en';
  className?: string;
}

export const SurgeProtectionDeviceLab: React.FC<SurgeProtectionDeviceLabProps> = ({
  locale,
  className = ''
}) => {
  const [spdType, setSpdType] = useState<SpdTypeCategory>('TYPE_2');
  const [surgeWaveform, setSurgeWaveform] = useState<'8_20' | '10_350'>('8_20');
  const [leadLengthCm, setLeadLengthCm] = useState<number>(35);
  const [cartridgeHealth, setCartridgeHealth] = useState<'HEALTHY' | 'DEGRADED' | 'END_OF_LIFE'>('HEALTHY');
  const [injectedSurgeKa, setInjectedSurgeKa] = useState<number>(15);
  const [isSurgeTriggered, setIsSurgeTriggered] = useState<boolean>(false);

  // Induced Overvoltage Calculation: ΔU_lead = L * (di/dt) ≈ 1 V/cm for 8/20µs wave
  const leadOvervoltageVolts = Math.round(leadLengthCm * (injectedSurgeKa / 15) * 12);
  const residualUpVolts = spdType === 'TYPE_1' ? 2500 : spdType === 'TYPE_2' ? 1400 : 900;
  const totalStressVolts = residualUpVolts + leadOvervoltageVolts;
  const isCompliantLeadLength = leadLengthCm <= 50;
  const isEquipmentProtected = totalStressVolts <= 2500 && cartridgeHealth !== 'END_OF_LIFE';

  const handleInjectSurge = () => {
    soundEffects.playWarningBuzzer();
    setIsSurgeTriggered(true);
    setTimeout(() => {
      if (injectedSurgeKa >= 25 && surgeWaveform === '10_350') {
        setCartridgeHealth('END_OF_LIFE');
      } else if (injectedSurgeKa >= 20) {
        setCartridgeHealth('DEGRADED');
      }
      setIsSurgeTriggered(false);
    }, 600);
  };

  const handleReplaceCartridge = () => {
    soundEffects.playSuccessChime();
    setCartridgeHealth('HEALTHY');
  };

  const spdSpecs: Record<
    SpdTypeCategory,
    { title: string; location_fr: string; location_en: string; discharge_fr: string; discharge_en: string; standards: string }
  > = {
    TYPE_1: {
      title: 'Type 1 (Onde Foudre Directe 10/350 µs)',
      location_fr: 'Tête d\'installation TGBT obligatoire si présence de paratonnerre extérieur.',
      location_en: 'Main incoming service switchboard mandatory when building has external lightning rod.',
      discharge_fr: 'Courant impulsionnel Iimp ≥ 12.5 kA (10/350 µs) par pôle (Éclateur à gaz / Varistance lourde).',
      discharge_en: 'Impulse discharge current Iimp ≥ 12.5 kA (10/350 µs) per pole (Gas spark gap / Heavy MOV).',
      standards: 'IEC 61643-11 / NF C 15-100 § 443'
    },
    TYPE_2: {
      title: 'Type 2 (Onde Surtension 8/20 µs)',
      location_fr: 'Tableaux divisionnaires et TGBT sans paratonnerre (protection contre surtensions indirectes).',
      location_en: 'Sub-distribution boards and consumer units against indirect switching and distant lightning surges.',
      discharge_fr: 'Courant nominal In = 20 kA / Imax = 40 kA (8/20 µs) avec cartouches débrochables.',
      discharge_en: 'Nominal discharge In = 20 kA / Imax = 40 kA (8/20 µs) with plug-in MOV cartridges.',
      standards: 'IEC 61643-11 / EN 61643-11'
    },
    TYPE_3: {
      title: 'Type 3 (Protection Terminale Fine)',
      location_fr: 'À proximité immédiate des équipements électroniques sensibles (distance < 5 mètres).',
      location_en: 'In close proximity to sensitive electronics, servers, and medical equipment (< 5 meters).',
      discharge_fr: 'Onde combinée 1.2/50 µs - 8/20 µs avec niveau de protection fin Up ≤ 1.0 kV.',
      discharge_en: 'Combined wave 1.2/50 µs - 8/20 µs with ultra-low protection level Up ≤ 1.0 kV.',
      standards: 'IEC 61643-11 / IEEE C62.41'
    }
  };

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Shield className="h-4 w-4" />
            <span>{locale === 'fr' ? 'LABORATOIRE DES PARAFOUDRES & COORDINATION CONTRE LES SURTENSIONS' : 'SURGE PROTECTIVE DEVICE (SPD) COORDINATION LAB'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Simulateur d\'Ondes Transitoires & Règle des 50 cm' : 'Transient Impulse Simulator & 50 cm Rule'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Analysez l\'écrêtage des surtensions foudre, testez l\'impact de la longueur des conducteurs de raccordement et contrôlez l\'état des cartouches.'
              : 'Analyze lightning surge suppression, evaluate connecting lead inductance overvoltages, and inspect cartridge end-of-life status.'}
          </p>
        </div>

        <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 61643-11 / NF C 15-100" />
      </div>

      {/* SPD Control Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
        
        {/* SPD Type Category */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Classe de Parafoudre :' : 'SPD Class Category:'}
          </label>
          <select
            value={spdType}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              const newType = e.target.value as SpdTypeCategory;
              setSpdType(newType);
              if (newType === 'TYPE_1') setSurgeWaveform('10_350');
              else setSurgeWaveform('8_20');
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none font-bold"
          >
            <option value="TYPE_1">Type 1 (Onde directe 10/350 µs · Tête de réseau)</option>
            <option value="TYPE_2">Type 2 (Onde indirecte 8/20 µs · Tableaux)</option>
            <option value="TYPE_3">Type 3 (Protection fine · Prises & Racks)</option>
          </select>
        </div>

        {/* Surge Waveform Type */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Forme d\'Onde d\'Impulsion :' : 'Surge Waveform Model:'}
          </label>
          <select
            value={surgeWaveform}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setSurgeWaveform(e.target.value as any);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-cyan-300 font-mono text-xs focus:border-amber-400 focus:outline-none font-bold"
          >
            <option value="8_20">Onde 8/20 µs (Surtension indirecte & manœuvre)</option>
            <option value="10_350">Onde 10/350 µs (Coup de foudre direct paratonnerre)</option>
          </select>
        </div>

        {/* Lead Length Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Longueur Liaisons (L1+L2+L3) :' : 'Total Lead Length (L1+L2+L3):'}</span>
            <span className={`font-bold ${isCompliantLeadLength ? 'text-emerald-400' : 'text-rose-400'}`}>
              {leadLengthCm} cm {isCompliantLeadLength ? '✓' : '⚠️ (> 50cm)'}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={leadLengthCm}
            onChange={(e) => setLeadLengthCm(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

      </div>

      {/* Interactive Impulse & Lead Inductance Canvas */}
      <div className="p-5 rounded-2xl bg-[#060911] border-2 border-slate-700 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
          <span className="font-bold text-amber-400 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>{locale === 'fr' ? 'SIMULATEUR DE DÉCHARGE TRANSITOIRE & COMPORTEMENT DE LA CARTOUCHE' : 'TRANSIENT SURGE SUPPRESSION & CARTRIDGE MONITOR'}</span>
          </span>
          <span className="text-slate-400 font-mono">
            {locale === 'fr' ? 'Règle normative : L1 + L2 + L3 ≤ 50 cm (NF C 15-100)' : 'Rule: L1 + L2 + L3 ≤ 50 cm (IEC 60364-5-534)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left: Physical SPD Cartridge View */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            
            <div className="flex items-center justify-center gap-4 py-4">
              {/* Cartridge Phase 1 */}
              <div className="p-3 rounded-lg bg-slate-900 border-2 border-slate-700 w-24 flex flex-col items-center space-y-2">
                <span className="text-[10px] text-amber-300 font-bold">L1 / 230V</span>
                <div className={`w-8 h-4 rounded border flex items-center justify-center text-[8px] font-bold ${
                  cartridgeHealth === 'HEALTHY'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : cartridgeHealth === 'DEGRADED'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-rose-600 text-white border-rose-500 animate-pulse'
                }`}>
                  {cartridgeHealth === 'HEALTHY' ? 'VERT' : cartridgeHealth === 'DEGRADED' ? 'JAUNE' : 'ROUGE'}
                </div>
                <span className="text-[8px] text-slate-400">Varistance MOV</span>
              </div>

              {/* Cartridge Phase 2 */}
              <div className="p-3 rounded-lg bg-slate-900 border-2 border-slate-700 w-24 flex flex-col items-center space-y-2">
                <span className="text-[10px] text-cyan-300 font-bold">L2 / 230V</span>
                <div className={`w-8 h-4 rounded border flex items-center justify-center text-[8px] font-bold ${
                  cartridgeHealth === 'HEALTHY' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}>
                  {cartridgeHealth === 'HEALTHY' ? 'VERT' : 'ROUGE'}
                </div>
                <span className="text-[8px] text-slate-400">Varistance MOV</span>
              </div>

              {/* Cartridge Neutral */}
              <div className="p-3 rounded-lg bg-slate-900 border-2 border-slate-700 w-24 flex flex-col items-center space-y-2">
                <span className="text-[10px] text-blue-300 font-bold">N / PE</span>
                <div className="w-8 h-4 rounded bg-emerald-500 text-slate-950 border border-emerald-400 flex items-center justify-center text-[8px] font-bold">
                  VERT
                </div>
                <span className="text-[8px] text-slate-400">Éclateur GDT</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleInjectSurge}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Injecter Surtension Foudre' : 'Inject Lightning Surge'}</span>
              </button>

              {cartridgeHealth !== 'HEALTHY' && (
                <button
                  type="button"
                  onClick={handleReplaceCartridge}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Remplacer Cartouche' : 'Replace Cartridge'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right: Overvoltage Stress Calculations & Health Card */}
          <div className="space-y-4">
            
            {/* Surge Injected Current Slider */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">{locale === 'fr' ? 'Courant de Foudre Crête Injecté :' : 'Peak Surge Current Injected:'}</span>
                <span className="text-amber-400 font-mono font-black text-sm">{injectedSurgeKa} kA ({surgeWaveform} µs)</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={injectedSurgeKa}
                onChange={(e) => setInjectedSurgeKa(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Overvoltage Summary Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{locale === 'fr' ? 'Niveau de protection assigné (Up) :' : 'Rated Protection Level (Up):'}</span>
                <span className="text-cyan-300 font-bold">{residualUpVolts} V</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{locale === 'fr' ? 'Sur-tension inductive des câbles (ΔU = L·di/dt) :' : 'Lead Inductive Overvoltage (L·di/dt):'}</span>
                <span className={`font-bold ${isCompliantLeadLength ? 'text-amber-300' : 'text-rose-400 font-black'}`}>
                  +{leadOvervoltageVolts} V ({leadLengthCm} cm)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-white">{locale === 'fr' ? 'Tension Totale Appliquée à l\'Équipement :' : 'Total Voltage Stress at Equipment:'}</span>
                <span className={`font-black ${isEquipmentProtected ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalStressVolts} V {isEquipmentProtected ? '✓ (Protégé ≤ 2.5 kV)' : '⚠️ (RISQUE DESTRUCTIF)'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
