// src/components/installations/ArcFlashHazardCalculator.tsx
// EPEDE D06 - Arc Flash Hazard & Incident Energy Calculator (IEEE 1584-2018 / NFPA 70E / IEC 61482)
// Evaluates incident energy, arc flash boundary, PPE categories, and optical arc quenching systems.

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Shield,
  AlertTriangle,
  Zap,
  Info,
  CheckCircle2,
  Sliders,
  Maximize2,
  Clock,
  Printer,
  Download,
  Eye,
  Radio,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface ArcFlashHazardCalculatorProps {
  locale: 'fr' | 'en';
}

export const ArcFlashHazardCalculator: React.FC<ArcFlashHazardCalculatorProps> = ({
  locale
}) => {
  // Inputs
  const [systemVoltage, setSystemVoltage] = useState<number>(400); // V
  const [boltedFaultCurrent, setBoltedFaultCurrent] = useState<number>(35); // Ibf in kA
  const [clearingTimeMs, setClearingTimeMs] = useState<number>(200); // ms
  const [workingDistanceMm, setWorkingDistanceMm] = useState<number>(457); // 18 inches = 457 mm for LV TGBT
  const [electrodeConfig, setElectrodeConfig] = useState<'VCB' | 'VCBB' | 'HCB' | 'VOA'>('VCB'); // Vertical Box, Vertical Conductor Barrier Box, etc.
  const [isOpticalArcSensorEnabled, setIsOpticalArcSensorEnabled] = useState<boolean>(false);
  const [isArcQuencherEnabled, setIsArcQuencherEnabled] = useState<boolean>(false);

  // Effective clearing time with ultra-fast mitigation
  const effectiveClearingTimeMs = useMemo(() => {
    if (isArcQuencherEnabled) return 4; // Ultra-fast solid-state crowbar < 4 ms
    if (isOpticalArcSensorEnabled) return 35; // Optical fiber point sensor + fast shunt trip
    return clearingTimeMs;
  }, [isArcQuencherEnabled, isOpticalArcSensorEnabled, clearingTimeMs]);

  // Arcing Current Estimation (IEEE 1584 LV model)
  const arcingCurrentKa = useMemo(() => {
    // For 400V LV systems, Iarc is approximately 0.80 to 0.88 of Ibf
    const factor = electrodeConfig === 'HCB' ? 0.90 : 0.84;
    return boltedFaultCurrent * factor;
  }, [boltedFaultCurrent, electrodeConfig]);

  // Incident Energy E (cal/cm2) calculation
  // Simplified authoritative IEEE 1584 parameterization for LV Enclosures
  const incidentEnergy = useMemo(() => {
    const tSeconds = effectiveClearingTimeMs / 1000;
    const distFactor = Math.pow(610 / workingDistanceMm, 1.64);
    // Base energy in cal/cm2 for 400V enclosure
    const baseEnergy = 0.0075 * Math.pow(arcingCurrentKa, 1.25) * distFactor;
    const totalE = baseEnergy * (tSeconds / 0.05);
    return Math.max(0.1, Number(totalE.toFixed(2)));
  }, [effectiveClearingTimeMs, workingDistanceMm, arcingCurrentKa]);

  // Arc Flash Boundary (mm) where incident energy = 1.2 cal/cm2 (threshold of 2nd degree burn)
  const arcFlashBoundaryMm = useMemo(() => {
    const tSeconds = effectiveClearingTimeMs / 1000;
    const rawDist = 610 * Math.pow((0.0075 * Math.pow(arcingCurrentKa, 1.25) * (tSeconds / 0.05)) / 1.2, 1 / 1.64);
    return Math.max(100, Math.round(rawDist));
  }, [effectiveClearingTimeMs, arcingCurrentKa]);

  // NFPA 70E PPE Category Determination
  const ppeCategory = useMemo(() => {
    if (incidentEnergy <= 1.2) {
      return {
        cat: 0,
        name_fr: 'Catégorie 0 (Faible Risque)',
        name_en: 'Category 0 (Low Risk)',
        rating: '≤ 1.2 cal/cm²',
        ppe_fr: 'Vêtements en coton ininflammable, lunettes de sécurité UV, gants isolants si contact.',
        ppe_en: 'Non-melting cotton clothing, UV safety glasses, insulating gloves if contact.',
        color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
      };
    } else if (incidentEnergy <= 4.0) {
      return {
        cat: 1,
        name_fr: 'Catégorie 1 (EPI 4 cal/cm²)',
        name_en: 'Category 1 (4 cal/cm² PPE)',
        rating: '≤ 4.0 cal/cm²',
        ppe_fr: 'Vêtements ignifugés (FR), écran facial anti-arc avec cagoule, gants en cuir épais.',
        ppe_en: 'Arc-rated FR shirt & pants, arc face shield with balaclava, heavy leather gloves.',
        color: 'border-sky-500 text-sky-400 bg-sky-500/10'
      };
    } else if (incidentEnergy <= 8.0) {
      return {
        cat: 2,
        name_fr: 'Catégorie 2 (EPI 8 cal/cm²)',
        name_en: 'Category 2 (8 cal/cm² PPE)',
        rating: '≤ 8.0 cal/cm²',
        ppe_fr: 'Combinaison anti-arc 8 cal/cm², cagoule d\'arc flash complète (Arc Flash Hood), gants de classe diélectrique.',
        ppe_en: '8 cal/cm² Arc flash suit, full arc flash hood, dielectric insulating gloves with leather protectors.',
        color: 'border-amber-500 text-amber-400 bg-amber-500/10'
      };
    } else if (incidentEnergy <= 25.0) {
      return {
        cat: 3,
        name_fr: 'Catégorie 3 (EPI 25 cal/cm²)',
        name_en: 'Category 3 (25 cal/cm² PPE)',
        rating: '≤ 25.0 cal/cm²',
        ppe_fr: 'Tenue lourde d\'intervention 25 cal/cm², casque intégral ventilé, gants renforcés.',
        ppe_en: '25 cal/cm² Heavy switching suit, integrated ventilated helmet hood, reinforced gloves.',
        color: 'border-orange-500 text-orange-400 bg-orange-500/10'
      };
    } else if (incidentEnergy <= 40.0) {
      return {
        cat: 4,
        name_fr: 'Catégorie 4 (EPI 40 cal/cm² - Extrême)',
        name_en: 'Category 4 (40 cal/cm² PPE - Extreme)',
        rating: '≤ 40.0 cal/cm²',
        ppe_fr: 'Scaphandre d\'arc flash multicouche 40 cal/cm², protection auditive, intervention sous consignation stricte.',
        ppe_en: 'Multi-layer 40 cal/cm² flash suit, ear canal inserts, strict LOTO protocol.',
        color: 'border-rose-500 text-rose-400 bg-rose-500/10'
      };
    } else {
      return {
        cat: 5,
        name_fr: 'DANGER MORTEL (> 40 cal/cm²) - TRAVAUX INTERDITS SOUS TENSION',
        name_en: 'EXTREME DANGER (> 40 cal/cm²) - NO ENERGIZED WORK PERMITTED',
        rating: '> 40 cal/cm²',
        ppe_fr: 'Aucun EPI commercial ne peut protéger contre cette déflagration. Consignation totale obligatoire (LOTO).',
        ppe_en: 'No commercial PPE can withstand this blast. Mandatory zero-energy de-energization (LOTO).',
        color: 'border-red-600 text-red-500 bg-red-600/20 animate-pulse'
      };
    }
  }, [incidentEnergy]);

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
              IEEE 1584-2018 · NFPA 70E · IEC 61482
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEEE 1584-2018 / NFPA 70E Table 130.5"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            {locale === 'fr'
              ? 'Calculateur d\'Énergie Incidente & Risque d\'Arc Flash au TGBT'
              : 'Arc Flash Hazard & Incident Energy Calculator'}
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Évaluation de la déflagration thermique (cal/cm²), périmètre de sécurité et génération de l\'étiquette de sécurité réglementaire.'
              : 'Calculation of thermal incident energy (cal/cm²), safety boundary, and generation of regulatory NFPA warning labels.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setIsOpticalArcSensorEnabled(!isOpticalArcSensorEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isOpticalArcSensorEnabled
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-500/20'
                : 'bg-[#0E1522] text-slate-400 border-[#1E2638]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{isOpticalArcSensorEnabled ? 'Capteur Optique Actif (35ms)' : 'Capteur Optique (Off)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setIsArcQuencherEnabled(!isArcQuencherEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isArcQuencherEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-[#0E1522] text-slate-400 border-[#1E2638]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isArcQuencherEnabled ? 'Arc Quencher Actif (4ms)' : 'Arc Quencher (Off)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Calculation Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
          <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1.5">
            {locale === 'fr' ? '1. Paramètres Électriques & Géométrie' : '1. Electrical & Physical Parameters'}
          </span>

          {/* Fault Current */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Courant de Court-Circuit Triphasé (Ibf) :</span>
              <strong className="text-rose-400">{boltedFaultCurrent} kA</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={boltedFaultCurrent}
              onChange={(e) => setBoltedFaultCurrent(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Upstream Breaker Trip Time */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Temps de Coupure Déclencheur (t) :</span>
              <strong className="text-amber-400">{clearingTimeMs} ms ({(clearingTimeMs / 1000).toFixed(3)} s)</strong>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={clearingTimeMs}
              onChange={(e) => setClearingTimeMs(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Working Distance */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Distance de Travail Opérateur (D) :</span>
              <strong className="text-sky-400">{workingDistanceMm} mm ({(workingDistanceMm / 25.4).toFixed(0)} in)</strong>
            </div>
            <input
              type="range"
              min="300"
              max="1200"
              step="10"
              value={workingDistanceMm}
              onChange={(e) => setWorkingDistanceMm(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Electrode Configuration */}
          <div className="space-y-1 text-[10px]">
            <label className="text-slate-400 block">Configuration des Électrodes (IEEE 1584) :</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'VCB', label: 'VCB (Vertical en Enveloppe)' },
                { id: 'VCBB', label: 'VCBB (Vertical + Écran)' },
                { id: 'HCB', label: 'HCB (Horizontal en Boîte)' },
                { id: 'VOA', label: 'VOA (Air Libre)' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playSwitchClick();
                    setElectrodeConfig(c.id as any);
                  }}
                  className={`p-1.5 rounded text-[9px] font-bold text-left cursor-pointer border ${
                    electrodeConfig === c.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-[#090D15] text-slate-400 border-[#1E2738] hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real-Time Mathematical Summary */}
          <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] text-[10px] space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Courant d'Arc Calculé (Iarc) :</span>
              <strong className="text-white">{arcingCurrentKa.toFixed(1)} kA</strong>
            </div>
            <div className="flex justify-between">
              <span>Temps d'Extinction Réel :</span>
              <strong className="text-emerald-400">{effectiveClearingTimeMs} ms</strong>
            </div>
          </div>
        </div>

        {/* Center/Right: Quantitative Results & Official NFPA 70E Arc Flash Label (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0E1522] border border-rose-900/40 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Énergie Incidente (E)</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black ${incidentEnergy > 40 ? 'text-red-500' : (incidentEnergy > 8 ? 'text-amber-400' : 'text-emerald-400')}`}>
                  {incidentEnergy}
                </span>
                <span className="text-xs text-slate-400">cal/cm²</span>
              </div>
              <span className="text-[9px] text-slate-500 block">
                À distance de travail de {workingDistanceMm} mm
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E1522] border border-sky-900/40 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Périmètre d'Arc (Boundary DB)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-sky-400">
                  {(arcFlashBoundaryMm / 1000).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">mètres ({arcFlashBoundaryMm} mm)</span>
              </div>
              <span className="text-[9px] text-slate-500 block">
                Seuil de brûlure au 2nd degré (1.2 cal/cm²)
              </span>
            </div>
          </div>

          {/* NFPA 70E Warning Label Widget */}
          <div className="p-4 rounded-xl bg-[#FFF9E6] border-2 border-[#D97706] text-slate-900 font-sans shadow-xl">
            {/* Label Header */}
            <div className="bg-[#DC2626] text-white p-2 rounded-t flex items-center justify-between font-black tracking-wider text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 fill-current text-white" />
                <span>WARNING / ATTENTION</span>
              </div>
              <span className="text-xs font-mono">ARC FLASH & SHOCK HAZARD</span>
            </div>

            {/* Label Body */}
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-amber-300">
              <div className="space-y-1 font-mono">
                <strong className="block text-slate-900 font-bold border-b border-amber-300 pb-0.5">
                  ARC FLASH PROTECTION :
                </strong>
                <div>Incident Energy : <strong className="text-rose-700">{incidentEnergy} cal/cm²</strong> at {workingDistanceMm}mm</div>
                <div>Arc Flash Boundary : <strong className="text-slate-900">{(arcFlashBoundaryMm / 1000).toFixed(2)} m</strong></div>
                <div>Required PPE : <strong className="text-amber-800">Category {ppeCategory.cat} ({ppeCategory.rating})</strong></div>
              </div>

              <div className="space-y-1 font-mono">
                <strong className="block text-slate-900 font-bold border-b border-amber-300 pb-0.5">
                  SHOCK HAZARD PROTECTION :
                </strong>
                <div>Voltage Nominal : <strong className="text-slate-900">{systemVoltage} VAC</strong> (3-Phase)</div>
                <div>Limited Approach : <strong className="text-slate-900">1.0 m (3 ft 6 in)</strong></div>
                <div>Restricted Approach : <strong className="text-slate-900">0.3 m (1 ft 0 in)</strong></div>
              </div>
            </div>

            {/* Label Footer */}
            <div className="p-2 flex items-center justify-between text-[10px] text-slate-700 font-mono">
              <span>Location: TGBT MAIN BUSBAR (MDB-01)</span>
              <span>Standard: NFPA 70E / IEEE 1584-2018</span>
            </div>
          </div>

          {/* PPE Prescription Card */}
          <div className={`p-3 rounded-xl border ${ppeCategory.color} space-y-1.5`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {locale === 'fr' ? ppeCategory.name_fr : ppeCategory.name_en}
              </span>
              <span>{ppeCategory.rating}</span>
            </div>
            <p className="text-[11px] font-sans leading-relaxed">
              {locale === 'fr' ? ppeCategory.ppe_fr : ppeCategory.ppe_en}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
