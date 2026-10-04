// src/components/production/modules/HydroAssetHealthVibrationLab.tsx
// EPEDE D01 - Hydro Asset Health, ISO 10816-5 Vibration Diagnostic & Cavitation Monitor
// Machine sets in hydraulic power generating and pumping plants

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Sparkles,
  Waves,
  Cpu,
  Info,
  RotateCw,
  Zap
} from 'lucide-react';

interface HydroAssetHealthVibrationLabProps {
  locale: 'fr' | 'en';
  plantName?: string;
  ratedMw?: number;
}

export const HydroAssetHealthVibrationLab: React.FC<HydroAssetHealthVibrationLabProps> = ({
  locale,
  plantName = 'Nachtigal (Groupe 1 - Francis 60 MW)',
  ratedMw = 60
}) => {
  // Interactive operational sliders
  const [turbineBearingVibMms, setTurbineBearingVibMms] = useState<number>(2.1);
  const [genLowerBearingVibMms, setGenLowerBearingVibMms] = useState<number>(1.8);
  const [genUpperBearingVibMms, setGenUpperBearingVibMms] = useState<number>(1.4);
  const [thrustBearingOilTempC, setThrustBearingOilTempC] = useState<number>(58);
  const [draftTubeVortexPressureKpa, setDraftTubeVortexPressureKpa] = useState<number>(18);
  const [statorCoreTempC, setStatorCoreTempC] = useState<number>(78);

  // ISO 10816-5 Vibration Zones Evaluator:
  // Zone A: < 1.6 mm/s (Excellent)
  // Zone B: 1.6 - 3.5 mm/s (Acceptable / Continuous operation)
  // Zone C: 3.5 - 7.0 mm/s (Alarm / Restricted operation)
  // Zone D: > 7.0 mm/s (Danger / Immediate Trip threshold)
  const maxVib = Math.max(turbineBearingVibMms, genLowerBearingVibMms, genUpperBearingVibMms);

  const isoZone = useMemo(() => {
    if (maxVib < 1.6) {
      return {
        zone: 'A',
        labelFr: 'Zone A · Groupe Neuf ou Rénové (Excellent)',
        labelEn: 'Zone A · New or Refurbished Unit (Excellent)',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        textColor: 'text-emerald-400',
        actionFr: 'Fonctionnement illimité sans aucune restriction.',
        actionEn: 'Unrestricted long-term continuous operation.'
      };
    } else if (maxVib <= 3.5) {
      return {
        zone: 'B',
        labelFr: 'Zone B · Exploitation Normale Continue',
        labelEn: 'Zone B · Normal Continuous Operation',
        color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        textColor: 'text-sky-400',
        actionFr: 'Fonctionnement acceptable et stable pour exploitation commerciale continue.',
        actionEn: 'Normal commercial continuous operation allowable.'
      };
    } else if (maxVib <= 7.0) {
      return {
        zone: 'C',
        labelFr: 'Zone C · Seuil d’Alarme / Surveillance Rapprochée',
        labelEn: 'Zone C · Alarm Condition / Restricted Operation',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        textColor: 'text-amber-400',
        actionFr: 'Planifier une inspection d’équilibrage ou vérification des coussinets de palier.',
        actionEn: 'Plan dynamic balancing inspection or check babbitt bearing clearances.'
      };
    } else {
      return {
        zone: 'D',
        labelFr: 'Zone D · DANGER CRITIQUE / Déclenchement d’Urgence',
        labelEn: 'Zone D · CRITICAL DANGER / Immediate Emergency Trip',
        color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        textColor: 'text-rose-400',
        actionFr: 'DÉCLENCHEMENT IMMÉDIAT (ANSI 38 / 39) pour éviter l’arrachement de la butée !',
        actionEn: 'IMMEDIATE TRIP (ANSI 38 / 39) required to prevent catastrophic bearing wipe!'
      };
    }
  }, [maxVib]);

  // Thrust bearing oil film health (critical above 75°C, trip above 85°C)
  const thrustStatus = useMemo(() => {
    if (thrustBearingOilTempC < 65) {
      return { statusFr: 'Optimal', statusEn: 'Optimal', color: 'text-emerald-400' };
    } else if (thrustBearingOilTempC < 75) {
      return { statusFr: 'Échauffement Modéré', statusEn: 'Moderate Warm', color: 'text-amber-400' };
    } else {
      return { statusFr: 'SURCHAUFFE CRITIQUE BUTÉE', statusEn: 'CRITICAL OVERHEAT', color: 'text-rose-400' };
    }
  }, [thrustBearingOilTempC]);

  // Draft tube vortex surge assessment (Rheingans frequency 0.2 - 0.4 * f_rot)
  const draftTubeVortexStatus = useMemo(() => {
    if (draftTubeVortexPressureKpa < 25) {
      return {
        levelFr: 'Faible pulsation (Zone calme)',
        levelEn: 'Low surge pulsation (Quiet zone)',
        color: 'text-emerald-400'
      };
    } else if (draftTubeVortexPressureKpa < 45) {
      return {
        levelFr: 'Torche vortex développée (Zone de charge partielle 40-60%)',
        levelEn: 'Vortex rope surge active (Part load 40-60% zone)',
        color: 'text-amber-400'
      };
    } else {
      return {
        levelFr: 'Résonance hydraulique violente (Risque rupture coude)',
        levelEn: 'Violent hydraulic resonance (Draft tube fatigue risk)',
        color: 'text-rose-400'
      };
    }
  }, [draftTubeVortexPressureKpa]);

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Diagnostic d’État Vibratoire & Santé Actifs Hydro (ISO 10816-5)' : 'Hydro Asset Health & Vibration Diagnostics (ISO 10816-5)'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Surveillance O&M
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Surveillance en temps réel des vitesses efficaces vibratoires (mm/s RMS), de la butée axiale et de la torche vortex de l’aspirateur.'
              : 'Real-time monitoring of bearing RMS vibration velocities (mm/s), thrust bearing oil film temperature, and draft tube surge.'}
          </p>
        </div>

        {/* Global Health Status Badge */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 ${isoZone.color}`}>
          <Radio className="w-5 h-5 shrink-0 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {locale === 'fr' ? 'Diagnostic Global ISO' : 'Global ISO Verdict'}
            </div>
            <div className="font-black text-sm text-white">
              {locale === 'fr' ? isoZone.labelFr : isoZone.labelEn}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Telemetry Controls & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sliders Input Panel */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Capteurs Capteurs Ligne d’Arbre' : 'Shaft Line Sensors Input'}
            </span>
          </div>

          {/* Palier Turbine Guide Bearing */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Vibrations Palier Turbine (TGB) :' : 'Turbine Guide Bearing (TGB):'}</span>
              <span className="font-bold text-sky-300 font-mono">{turbineBearingVibMms} mm/s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={10.0}
              step={0.1}
              value={turbineBearingVibMms}
              onChange={(e) => setTurbineBearingVibMms(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 mm/s (Neuf)</span>
              <span>3.5 mm/s (Alarme)</span>
              <span>10.0 mm/s (Trip)</span>
            </div>
          </div>

          {/* Palier Inférieur Alternateur */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Palier Inférieur Alternateur (LGB) :' : 'Lower Gen Bearing (LGB):'}</span>
              <span className="font-bold text-cyan-300 font-mono">{genLowerBearingVibMms} mm/s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={10.0}
              step={0.1}
              value={genLowerBearingVibMms}
              onChange={(e) => setGenLowerBearingVibMms(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Température Huile Butée Axiale */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Température Huile Butée Axiale :' : 'Thrust Bearing Oil Temp:'}</span>
              <span className={`font-bold font-mono ${thrustStatus.color}`}>{thrustBearingOilTempC} °C</span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={1}
              value={thrustBearingOilTempC}
              onChange={(e) => setThrustBearingOilTempC(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>45 °C</span>
              <span>65 °C</span>
              <span>85 °C (Déclenchement)</span>
            </div>
          </div>

          {/* Pulsation de Pression Aspirateur */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Pulsation Torche Vortex Aspirateur :' : 'Draft Tube Surge Pulsation:'}</span>
              <span className="font-bold text-purple-300 font-mono">{draftTubeVortexPressureKpa} kPa p-p</span>
            </div>
            <input
              type="range"
              min={5}
              max={70}
              step={1}
              value={draftTubeVortexPressureKpa}
              onChange={(e) => setDraftTubeVortexPressureKpa(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 kPa (Stable)</span>
              <span>30 kPa</span>
              <span>70 kPa (Cavitation)</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Breakdown Matrix */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Évaluation Normative ISO 10816-5' : 'ISO 10816-5 Conformity'}
            </span>
          </div>

          {/* Max Vib Reading */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Vibration Maximale Mesurée' : 'Peak Measured Vibration'}
              </span>
              <span className={`text-sm font-bold font-mono ${isoZone.textColor}`}>
                {maxVib.toFixed(1)} mm/s RMS
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {locale === 'fr' ? isoZone.actionFr : isoZone.actionEn}
            </div>
          </div>

          {/* Zones Color Scale Reference */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {locale === 'fr' ? 'Échelle des 4 Zones ISO Hydro :' : 'ISO Hydro 4-Zone Scale:'}
            </span>
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px] font-bold">
              <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                A: &lt; 1.6
              </div>
              <div className="p-1.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                B: 1.6–3.5
              </div>
              <div className="p-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                C: 3.5–7.0
              </div>
              <div className="p-1.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                D: &gt; 7.0
              </div>
            </div>
          </div>

          {/* Thrust Bearing Health */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Santé Patins Butée (Régule)' : 'Babbitt Thrust Bearing Pads'}
              </span>
              <span className={`text-xs font-bold ${thrustStatus.color}`}>
                {locale === 'fr' ? thrustStatus.statusFr : thrustStatus.statusEn}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Épaisseur film d’huile hydrodynamique estimée : ~ 42 µm
            </div>
          </div>
        </div>

        {/* Cavitation & Vortex Surge Diagnostics */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Cavitation & Torche Vortex Aspirateur' : 'Cavitation & Draft Tube Surge'}
            </span>
          </div>

          {/* Vortex Rope Assessment */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Diagnostic Acoustique Torche' : 'Acoustic Surge Diagnostics'}
              </span>
              <span className={`text-xs font-bold ${draftTubeVortexStatus.color}`}>
                {draftTubeVortexPressureKpa} kPa
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {locale === 'fr' ? draftTubeVortexStatus.levelFr : draftTubeVortexStatus.levelEn}
            </p>
          </div>

          {/* Mitigation Strategy */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2">
            <span className="text-[10px] uppercase text-sky-400 font-bold block">
              {locale === 'fr' ? 'Actions Recommandées (O&M Cameroun) :' : 'Recommended Actions (Cameroon Fleet):'}
            </span>
            <ul className="list-disc pl-4 text-[10px] text-slate-400 space-y-1">
              <li>
                {locale === 'fr'
                  ? 'Injection d’air comprimé sous la roue (dépression centrale) pour casser la torche hélicoïdale.'
                  : 'Compressed air injection below runner hub to break helical vortex rope surge.'}
              </li>
              <li>
                {locale === 'fr'
                  ? 'Contrôle magnétoscopique et ressuage sur le bord de fuite des aubes Francis (Song Loulou / Nachtigal).'
                  : 'Magnetic particle & dye penetrant testing on Francis blade trailing edges.'}
              </li>
              <li>
                {locale === 'fr'
                  ? 'Vérification du centrage rotor/stator (entrefer 14 mm ± 5%).'
                  : 'Check generator rotor-to-stator air gap concentricity (14 mm ± 5%).'}
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
