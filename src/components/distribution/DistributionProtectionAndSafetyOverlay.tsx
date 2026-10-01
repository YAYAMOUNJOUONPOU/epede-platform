// src/components/distribution/DistributionProtectionAndSafetyOverlay.tsx
// EPEDE D05 - Distribution Protection, Earthing Schemes & Life Safety Overlay

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Info,
  Scale
} from 'lucide-react';

interface DistributionProtectionAndSafetyOverlayProps {
  locale: 'fr' | 'en';
}

export const DistributionProtectionAndSafetyOverlay: React.FC<DistributionProtectionAndSafetyOverlayProps> = ({
  locale
}) => {
  const [selectedNeutralScheme, setSelectedNeutralScheme] = useState<'COMPENSATED' | 'RESISTANCE' | 'ISOLATED' | 'DIRECT'>('COMPENSATED');
  const [faultDurationMs, setFaultDurationMs] = useState<number>(200);

  const neutralSchemes = {
    COMPENSATED: {
      name_fr: 'Neutre Compensé (Bobine de Petersen / Raccordement Accordé)',
      name_en: 'Compensated Neutral (Petersen Coil / Resonant Grounding)',
      principle_fr: 'Une inductance réglable connectée entre le neutre du transformateur et la terre entre en résonance avec la capacité homopolaire du réseau ($L \\cdot C_0 \\cdot \\omega^2 \\approx 1$).',
      principle_en: 'A continuously tuned variable inductor between neutral and earth resonates with total network zero-sequence capacitance ($L \\cdot C_0 \\cdot \\omega^2 \\approx 1$).',
      fault_current: 'I_f < 20 à 35 A (Courant résiduel actif résiduel minimal)',
      self_extinction: 'Auto-extinction quasi-systématique des défauts fugitifs sans déclenchement du disjoncteur.',
      relay_standard: 'ANSI 67NC / PWH (Protection Wattmétrique Homopolaire)',
      application: 'Réseaux mixtes et ruraux étendus avec forte proportion de câbles souterrains'
    },
    RESISTANCE: {
      name_fr: 'Neutre Mis à la Terre par Résistance (BPN / RPN)',
      name_en: 'Resistance Grounded Neutral (Neutral Grounding Resistor - NGR)',
      principle_fr: 'Une résistance métallique limite le courant de défaut phase-terre à une valeur contrôlée (généralement 150 A à 300 A en souterrain, 40 A en aérien).',
      principle_en: 'A stainless-steel grid resistor constrains single phase-to-ground fault current to a deterministic rating (150 A to 300 A for cables, 40 A for overhead).',
      fault_current: 'I_f = 150 A à 300 A (Durée maximale admissible 1 à 2 s)',
      self_extinction: 'Pas d\'auto-extinction : impose le déclenchement sélectif de l\'artère en défaut.',
      relay_standard: 'ANSI 51N (Maximum de courant homopolaire temporisé)',
      application: 'Standard historique des réseaux urbains souterrains (postes sources HTA)'
    },
    ISOLATED: {
      name_fr: 'Neutre Isolé de la Terre (Réseau Flottant)',
      name_en: 'Isolated / Ungrounded Neutral (Floating Grid)',
      principle_fr: 'Aucune liaison galvanique intentionnelle avec la terre. Le courant de défaut se referme uniquement par la capacité répartie des deux phases saines.',
      principle_en: 'Zero intentional physical bonding to earth. Single ground-fault currents loop exclusively through healthy phase line-to-ground distributed capacitances.',
      fault_current: 'I_f = 2 A à 15 A (Courant purement capacitif $3 \\cdot C_0 \\cdot \\omega \\cdot V$)',
      self_extinction: 'Permet la poursuite temporaire de l\'exploitation en présence d\'un premier défaut d\'isolement.',
      relay_standard: 'ANSI 59N (Maximum de tension résiduelle / homopolaire U0)',
      application: 'Réseaux industriels fermés, mines, et anciennes distributions italiennes/espagnoles'
    },
    DIRECT: {
      name_fr: 'Neutre Directement à la Terre (Régime Rigide)',
      name_en: 'Solidly Grounded Neutral',
      principle_fr: 'Le neutre est raccordé directement au collecteur de terre sans impédance intercalée.',
      principle_en: 'The neutral point is bolted directly to the earth electrode grid with zero intentionally added impedance.',
      fault_current: 'I_f = 3 kA à 15 kA (Comparable à un court-circuit triphasé franc)',
      self_extinction: 'Déclenchement instantané obligatoire pour éviter l\'explosion des équipements.',
      relay_standard: 'ANSI 50N/51N rapide',
      application: 'Standard Nord-Américain (IEEE/ANSI 4-fils multiground) et réseaux basse tension 400 V'
    }
  };

  const activeScheme = neutralSchemes[selectedNeutralScheme];

  // Touch voltage calculation according to EN 50522 / IEC 61936-1 curve
  // Indicative safe touch voltage limit Utouch_limit approx = 50V for long duration, ~75V at 1s, ~200V at 0.2s
  const safeTouchLimitVolts = faultDurationMs <= 100 ? 350 : faultDurationMs <= 200 ? 210 : faultDurationMs <= 500 ? 120 : 65;

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {locale === 'fr'
              ? 'PROTECTIONS HTA, RÉGIMES DE NEUTRE & TENSIONS DE SÉCURITÉ'
              : 'MV PROTECTION, NEUTRE GROUNDING SCHEMES & TOUCH SAFETY'}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Bobine de Petersen, Neutre Résistant, Neutre Isolé & Calcul des tensions de pas et de toucher'
              : 'Petersen coils, Resistor grounding, Isolated neutral & Step/Touch voltage safety math'}
          </p>
        </div>
      </div>

      {/* 2. Neutral Scheme Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {(['COMPENSATED', 'RESISTANCE', 'ISOLATED', 'DIRECT'] as const).map((schemeKey) => {
          const isSelected = selectedNeutralScheme === schemeKey;
          const s = neutralSchemes[schemeKey];
          return (
            <button
              key={schemeKey}
              type="button"
              onClick={() => setSelectedNeutralScheme(schemeKey)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-[#090D15] text-slate-300 border-[#20293A] hover:border-amber-500/50 hover:text-white'
              }`}
            >
              <div className="text-[10px] opacity-80 uppercase tracking-wider mb-1">
                {schemeKey}
              </div>
              <div className="text-xs font-bold truncate">
                {s.name_fr.split(' (')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Deep Technical Breakdown of the Neutral Grounding Strategy */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2533]">
          <div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
              RÉGIME DE NEUTRE SÉLECTIONNÉ
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              {locale === 'fr' ? activeScheme.name_fr : activeScheme.name_en}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Courant de Défaut Terre Typique
            </span>
            <span className="text-xs font-bold text-amber-400">{activeScheme.fault_current}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Principe Physique & Électrotechnique :' : 'Physical Principle:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeScheme.principle_fr : activeScheme.principle_en}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Relais de Détection & Extinction :' : 'Relay Algorithm & Arc Extinction:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              <span className="font-bold text-white block mb-1">Relais : {activeScheme.relay_standard}</span>
              {activeScheme.self_extinction}
            </p>
          </div>
        </div>

        {/* Life Safety: Touch & Step Voltage Simulator */}
        <div className="p-4 rounded-xl bg-[#070A10] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'Limites Normalisées de Tension de Toucher (EN 50522 / IEC 61936-1)'
                  : 'Normalized Touch Voltage Safety Limits (EN 50522 / IEC 61936-1)'}
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              U_touch admissible : ≤ {safeTouchLimitVolts} V eff
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs text-slate-400">
              {locale === 'fr' ? 'Temps d\'élimination du défaut (t_f) :' : 'Fault Clearance Time (t_f):'}
            </span>
            <div className="flex items-center gap-2">
              {[100, 200, 500, 1000].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFaultDurationMs(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    faultDurationMs === t
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {t} ms
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            {locale === 'fr'
              ? `Pour un défaut éliminé en ${faultDurationMs} ms, la tension de contact maximale tolérable par le corps humain sans risque de fibrillation cardiaque est de ${safeTouchLimitVolts} V. Cela impose une résistance de prise de terre de poste $R_{terre} \\le U_{touch} / I_f$.`
              : `For a fault cleared in ${faultDurationMs} ms, statutory maximum human touch voltage without ventricular fibrillation is ${safeTouchLimitVolts} V. This dictates a kiosk grounding resistance constraint $R_{earth} \\le U_{touch} / I_f$.`}
          </p>
        </div>
      </div>
    </div>
  );
};
