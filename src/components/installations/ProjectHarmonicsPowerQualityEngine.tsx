// src/components/installations/ProjectHarmonicsPowerQualityEngine.tsx
// EPEDE D06 - Electrical Harmonics & Power Quality Analysis Engine
// Compliant with IEC 61000-2-4, IEC 61000-3-2, and NF C 15-100 §523.5 (Neutral Conductor Sizing for Triplen Harmonics)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Info, 
  Layers, 
  HelpCircle,
  Filter,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

// Typical harmonic spectrum profiles by load category (% of fundamental)
const LOAD_HARMONIC_PROFILES: Record<string, {
  name_fr: string;
  name_en: string;
  h3: number; // 150 Hz (Triplen)
  h5: number; // 250 Hz
  h7: number; // 350 Hz
  h9: number; // 450 Hz (Triplen)
  h11: number; // 550 Hz
  h13: number; // 650 Hz
}> = {
  IT_COMPUTING: {
    name_fr: 'Informatique / Serveurs (Alim Découpée SMPS)',
    name_en: 'IT / Data Servers (SMPS Power Supplies)',
    h3: 75,
    h5: 42,
    h7: 20,
    h9: 12,
    h11: 8,
    h13: 5
  },
  LIGHTING: {
    name_fr: 'Éclairage LED avec Drivers Électroniques',
    name_en: 'LED Lighting with Electronic Drivers',
    h3: 28,
    h5: 16,
    h7: 8,
    h9: 5,
    h11: 3,
    h13: 2
  },
  HVAC: {
    name_fr: 'CVC / Pompes à Chaleur (Variateur 6-pulsations)',
    name_en: 'HVAC / Heat Pumps (6-pulse VFD)',
    h3: 2,
    h5: 32,
    h7: 18,
    h9: 2,
    h11: 9,
    h13: 7
  },
  MOTIVE_PUMP: {
    name_fr: 'Moteurs & Pompes avec VFD',
    name_en: 'Motors & Pumps with VFD',
    h3: 2,
    h5: 35,
    h7: 20,
    h9: 2,
    h11: 10,
    h13: 8
  },
  ELEVATOR: {
    name_fr: 'Ascenseurs / Treuils avec Régulateurs',
    name_en: 'Elevators / Lifts with Regulators',
    h3: 4,
    h5: 28,
    h7: 15,
    h9: 3,
    h11: 8,
    h13: 6
  },
  INDUSTRIAL_MACHINE: {
    name_fr: 'Machines Industrielles / Redresseurs',
    name_en: 'Industrial Machines / Rectifiers',
    h3: 5,
    h5: 38,
    h7: 22,
    h9: 4,
    h11: 11,
    h13: 9
  },
  SOCKETS: {
    name_fr: 'Prises de Courant Polyvalentes',
    name_en: 'General Purpose Sockets',
    h3: 18,
    h5: 12,
    h7: 6,
    h9: 3,
    h11: 2,
    h13: 1
  },
  KITCHEN: {
    name_fr: 'Cuisine / Fours & Inductions',
    name_en: 'Kitchen / Induction & Combi Ovens',
    h3: 12,
    h5: 14,
    h7: 7,
    h9: 2,
    h11: 3,
    h13: 2
  },
  EMERGENCY_LIFE_SAFETY: {
    name_fr: 'Sécurité Incendie / Désenfumage (Direct)',
    name_en: 'Life Safety / Fire Extinction (Direct Line)',
    h3: 1,
    h5: 3,
    h7: 2,
    h9: 0.5,
    h11: 1,
    h13: 0.5
  }
};

export const ProjectHarmonicsPowerQualityEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // State for active mitigation filter simulation
  const [activeFilterType, setActiveFilterType] = useState<'NONE' | 'LINE_REACTORS' | 'ACTIVE_FILTER' | 'PASSIVE_TRAP'>('NONE');
  const [activeFilterRatingA, setActiveFilterRatingA] = useState<number>(100);

  // Power Balance baseline
  const powerSummary = computeProjectPowerBalance(project);
  const fundamentalCurrentIb = powerSummary.totalDesignCurrentIbA;

  // -------------------------------------------------------------------------
  // 1. Harmonics Synthesis across all Project Loads
  // -------------------------------------------------------------------------
  const harmonicsData = useMemo(() => {
    let totalWeightedH3 = 0;
    let totalWeightedH5 = 0;
    let totalWeightedH7 = 0;
    let totalWeightedH9 = 0;
    let totalWeightedH11 = 0;
    let totalWeightedH13 = 0;
    let totalPowerNonLinearKw = 0;
    let totalPowerAllKw = 0;

    project.loads.forEach(load => {
      const loadPower = load.unitRatingKw * load.quantity * load.loadFactorKu * load.simultaneityKs;
      totalPowerAllKw += loadPower;
      const profile = LOAD_HARMONIC_PROFILES[load.category] || LOAD_HARMONIC_PROFILES.SOCKETS;

      if (profile.h3 > 5 || profile.h5 > 10) {
        totalPowerNonLinearKw += loadPower;
      }

      totalWeightedH3 += (profile.h3 / 100) * loadPower;
      totalWeightedH5 += (profile.h5 / 100) * loadPower;
      totalWeightedH7 += (profile.h7 / 100) * loadPower;
      totalWeightedH9 += (profile.h9 / 100) * loadPower;
      totalWeightedH11 += (profile.h11 / 100) * loadPower;
      totalWeightedH13 += (profile.h13 / 100) * loadPower;
    });

    const safeTotalPower = totalPowerAllKw > 0 ? totalPowerAllKw : 1;
    let rawPercentH3 = (totalWeightedH3 / safeTotalPower) * 100;
    let rawPercentH5 = (totalWeightedH5 / safeTotalPower) * 100;
    let rawPercentH7 = (totalWeightedH7 / safeTotalPower) * 100;
    let rawPercentH9 = (totalWeightedH9 / safeTotalPower) * 100;
    let rawPercentH11 = (totalWeightedH11 / safeTotalPower) * 100;
    let rawPercentH13 = (totalWeightedH13 / safeTotalPower) * 100;

    // Apply Mitigation Filter Reduction
    if (activeFilterType === 'ACTIVE_FILTER') {
      // Active Harmonic Filter (AHF) mitigates up to 85% of harmonics
      const filterEffect = 0.18; // 82% reduction
      rawPercentH3 *= filterEffect;
      rawPercentH5 *= filterEffect;
      rawPercentH7 *= filterEffect;
      rawPercentH9 *= filterEffect;
      rawPercentH11 *= filterEffect;
      rawPercentH13 *= filterEffect;
    } else if (activeFilterType === 'LINE_REACTORS') {
      // 3% - 5% Line chokes mainly reduce 5th and 7th
      rawPercentH3 *= 0.85;
      rawPercentH5 *= 0.45;
      rawPercentH7 *= 0.55;
      rawPercentH9 *= 0.80;
      rawPercentH11 *= 0.65;
      rawPercentH13 *= 0.70;
    } else if (activeFilterType === 'PASSIVE_TRAP') {
      // Tuned 5th / 7th harmonic trap
      rawPercentH5 *= 0.30;
      rawPercentH7 *= 0.40;
      rawPercentH11 *= 0.80;
    }

    // Amperes for each harmonic rank
    const ih1 = fundamentalCurrentIb;
    const ih3 = (rawPercentH3 / 100) * ih1;
    const ih5 = (rawPercentH5 / 100) * ih1;
    const ih7 = (rawPercentH7 / 100) * ih1;
    const ih9 = (rawPercentH9 / 100) * ih1;
    const ih11 = (rawPercentH11 / 100) * ih1;
    const ih13 = (rawPercentH13 / 100) * ih1;

    // THD-i: Total Harmonic Current Distortion
    const sumSqHarmonics = Math.pow(ih3, 2) + Math.pow(ih5, 2) + Math.pow(ih7, 2) + Math.pow(ih9, 2) + Math.pow(ih11, 2) + Math.pow(ih13, 2);
    const thdI = (Math.sqrt(sumSqHarmonics) / (ih1 > 0 ? ih1 : 1)) * 100;

    // Estimate THD-u (Voltage distortion at TGBT busbar):
    // Uh ≈ Ih * (h * Xtr). Let transformer short-circuit impedance be Uk%
    // At TGBT busbar, THDu is roughly proportional to THDi * (S_load / S_sc)
    const sScKva = project.supplyContext.availableFaultMva * 1000;
    const sLoadKva = powerSummary.demandApparentPowerKva;
    const thdU = Math.min(15, (thdI * 0.35 * (sLoadKva / (project.supplyContext.transformerRatingKva > 0 ? project.supplyContext.transformerRatingKva : 1000))));

    // Triplen Neutral Current (H3, H9, H15 sum in phase in neutral):
    // In balanced 3-phase, In ≈ 3 * sqrt(Ih3^2 + Ih9^2)
    const neutralTriplenCurrentA = 3 * Math.sqrt(Math.pow(ih3, 2) + Math.pow(ih9, 2));

    // IEEE C57.110 K-Factor for Transformer
    // K = sum( (Ih / I1)^2 * h^2 )
    const kFactor = 1 + 
      Math.pow(ih3 / ih1, 2) * 9 +
      Math.pow(ih5 / ih1, 2) * 25 +
      Math.pow(ih7 / ih1, 2) * 49 +
      Math.pow(ih9 / ih1, 2) * 81 +
      Math.pow(ih11 / ih1, 2) * 121 +
      Math.pow(ih13 / ih1, 2) * 169;

    // Transformer Derating required if standard K=1 transformer used:
    // Derating factor Df ≈ 1 / sqrt(1 + 0.1 * (K - 1))
    const transformerDeratingFactor = Math.max(0.65, 1 / Math.sqrt(1 + 0.08 * (kFactor - 1)));

    return {
      totalPowerNonLinearKw,
      nonLinearRatioPercent: (totalPowerNonLinearKw / safeTotalPower) * 100,
      thdI: Number(thdI.toFixed(1)),
      thdU: Number(thdU.toFixed(1)),
      percentH3: Number(rawPercentH3.toFixed(1)),
      percentH5: Number(rawPercentH5.toFixed(1)),
      percentH7: Number(rawPercentH7.toFixed(1)),
      percentH9: Number(rawPercentH9.toFixed(1)),
      percentH11: Number(rawPercentH11.toFixed(1)),
      percentH13: Number(rawPercentH13.toFixed(1)),
      ih1: Math.round(ih1),
      ih3: Math.round(ih3),
      ih5: Math.round(ih5),
      ih7: Math.round(ih7),
      ih9: Math.round(ih9),
      ih11: Math.round(ih11),
      ih13: Math.round(ih13),
      neutralTriplenCurrentA: Math.round(neutralTriplenCurrentA),
      kFactor: Number(kFactor.toFixed(2)),
      transformerDeratingFactor: Number(transformerDeratingFactor.toFixed(2))
    };
  }, [project.loads, fundamentalCurrentIb, activeFilterType, project.supplyContext, powerSummary]);

  // -------------------------------------------------------------------------
  // 2. NF C 15-100 §523.5 Neutral Sizing Classification
  // -------------------------------------------------------------------------
  const neutralSizingCategory = useMemo(() => {
    const h3 = harmonicsData.percentH3;
    if (h3 <= 15) {
      return {
        level: 'LOW',
        rule_fr: 'Rang 3 ≤ 15% (Cas 1) : Conducteur Neutre Standard',
        rule_en: 'Rank 3 ≤ 15% (Case 1) : Standard Neutral Conductor',
        description_fr: 'Dimensionnement conventionnel : conducteur neutre non surdimensionné (Sn = Sph pour Sph ≤ 16 mm² Cu, Sn = Sph/2 possible pour gros calibres). Facteur de déclassement f = 1.00.',
        description_en: 'Conventional sizing: neutral not oversized (Sn = Sph for Sph ≤ 16 mm² Cu, Sn = Sph/2 allowed for larger cables). Derating factor f = 1.00.',
        deratingFactor: 1.00,
        neutralCrossSectionRatio: '1.0 × Sph',
        protectionRequirement: '4P-3D ou 4P-4D (Neutre normal)'
      };
    } else if (h3 <= 33) {
      return {
        level: 'MEDIUM',
        rule_fr: '15% < Rang 3 ≤ 33% (Cas 2) : Neutre Pleine Section Obligatoire',
        rule_en: '15% < Rank 3 ≤ 33% (Case 2) : Full Cross-Section Neutral Required',
        description_fr: 'Courant significatif dans le neutre. Section du neutre obligatoirement égale aux phases (Sn = Sph). Les câbles doivent être déclassés par un coefficient f = 0.84.',
        description_en: 'Significant neutral current. Neutral cross-section must equal phase cross-section (Sn = Sph). Cables must be derated by factor f = 0.84.',
        deratingFactor: 0.84,
        neutralCrossSectionRatio: '1.0 × Sph (Déclassement 0.84)',
        protectionRequirement: '4P-4D (Neutre protégé et surveillé)'
      };
    } else {
      return {
        level: 'HIGH',
        rule_fr: 'Rang 3 > 33% (Cas 3) : Courant Neutre Supérieur à la Phase (In > Iph)',
        rule_en: 'Rank 3 > 33% (Case 3) : Neutral Current Exceeds Phase Current (In > Iph)',
        description_fr: 'Dimensionnement fondé directement sur le courant neutre In = 1.45 × Ib. Section du neutre surdimensionnée (Sn ≥ 1.45 × Sph ou 2.0 × Sph). Protection 4P-4D obligatoire.',
        description_en: 'Sizing based directly on neutral current In = 1.45 × Ib. Neutral conductor oversized (Sn ≥ 1.45 × Sph or 2.0 × Sph). 4P-4D breaker mandatory.',
        deratingFactor: 0.70,
        neutralCrossSectionRatio: '1.45 à 2.0 × Sph (Surdimensionné)',
        protectionRequirement: '4P-4D Déclencheur électronique avec réglage neutre surcalibré (ex. In_neutre = 160% In)'
      };
    }
  }, [harmonicsData.percentH3]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Regulatory Badges                           */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Analyseur Harmoniques & Qualité d\'Énergie (THD)' : 'Harmonics & Power Quality Engine (THD)'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                NF C 15-100 §523.5 / IEC 61000-2-4
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Évaluation des charges déformantes, courants d\'harmoniques de rang 3 (harmoniques homopolaires), dimensionnement du neutre et facteur K.'
                : 'Evaluation of non-linear loads, triplen 3rd harmonic currents, neutral conductor sizing, and transformer K-Factor.'}
            </p>
          </div>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold ${
            harmonicsData.thdI <= 15 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
              : harmonicsData.thdI <= 25 
              ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
          }`}>
            <span>THD-i : {harmonicsData.thdI}%</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold ${
            harmonicsData.thdU <= 5 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
          }`}>
            <span>THD-u : {harmonicsData.thdU}% (≤8%)</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary Metrics Grid                                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Courant Fondamental (H1)' : 'Fundamental Current (H1)'}</span>
          <span className="text-lg font-black text-white">{harmonicsData.ih1} A</span>
          <span className="text-[10px] text-slate-500 block">50 Hz / 400 V</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Taux Harmonique 3 (H3)' : '3rd Harmonic Rate (H3)'}</span>
          <span className={`text-lg font-black ${
            harmonicsData.percentH3 <= 15 ? 'text-emerald-400' : harmonicsData.percentH3 <= 33 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {harmonicsData.percentH3}% ({harmonicsData.ih3} A)
          </span>
          <span className="text-[10px] text-slate-500 block">{isFr ? 'Seuil NF C 15-100 : 15% / 33%' : 'Standard Threshold: 15% / 33%'}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Courant Neutre Estimé (In)' : 'Estimated Neutral (In)'}</span>
          <span className="text-lg font-black text-amber-400">{harmonicsData.neutralTriplenCurrentA} A</span>
          <span className="text-[10px] text-slate-500 block">In ≈ 3 × IH3 (Triplen Sum)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Facteur K Transformateur' : 'Transformer K-Factor'}</span>
          <span className="text-lg font-black text-cyan-400">K = {harmonicsData.kFactor}</span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? `Déclassement requis : ×${harmonicsData.transformerDeratingFactor}` : `Required derating: ×${harmonicsData.transformerDeratingFactor}`}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. NF C 15-100 §523.5 Rule Status Box                              */}
      {/* ------------------------------------------------------------------- */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
        neutralSizingCategory.level === 'LOW'
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : neutralSizingCategory.level === 'MEDIUM'
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <ShieldAlert className="w-5 h-5" />
            <span>{isFr ? neutralSizingCategory.rule_fr : neutralSizingCategory.rule_en}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isFr ? neutralSizingCategory.description_fr : neutralSizingCategory.description_en}
          </p>
        </div>

        <div className="shrink-0 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 min-w-[240px]">
          <div className="text-[10px] text-slate-400 uppercase">{isFr ? 'Recommandation Dimensionnement :' : 'Sizing Recommendation:'}</div>
          <div className="text-white font-bold">{neutralSizingCategory.neutralCrossSectionRatio}</div>
          <div className="text-[10px] text-cyan-400">{neutralSizingCategory.protectionRequirement}</div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Interactive Harmonic Spectrum Bar Chart & Waveform Visualizer    */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Harmonic Bar Chart SVG */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              {isFr ? 'Spectre Harmonique par Rang (% H1)' : 'Harmonic Spectrum by Rank (% H1)'}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">IEC 61000-2-4 Class 2</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 px-2 pt-6 pb-2 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
            {[
              { rank: 'H1', freq: '50Hz', val: 100, color: 'bg-emerald-500', isTriplen: false },
              { rank: 'H3', freq: '150Hz', val: harmonicsData.percentH3, color: 'bg-rose-500', isTriplen: true },
              { rank: 'H5', freq: '250Hz', val: harmonicsData.percentH5, color: 'bg-amber-500', isTriplen: false },
              { rank: 'H7', freq: '350Hz', val: harmonicsData.percentH7, color: 'bg-cyan-500', isTriplen: false },
              { rank: 'H9', freq: '450Hz', val: harmonicsData.percentH9, color: 'bg-rose-400', isTriplen: true },
              { rank: 'H11', freq: '550Hz', val: harmonicsData.percentH11, color: 'bg-indigo-400', isTriplen: false },
              { rank: 'H13', freq: '650Hz', val: harmonicsData.percentH13, color: 'bg-indigo-500', isTriplen: false }
            ].map(item => {
              // Scale height relative to 100%
              const heightPercent = Math.min(100, Math.max(8, item.val));
              return (
                <div key={item.rank} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-300 mb-1 group-hover:text-white">
                    {item.val}%
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${item.color} ${item.isTriplen ? 'ring-1 ring-rose-400/50' : ''}`}
                  />
                  <div className="mt-2 text-center">
                    <span className={`block font-bold text-[11px] ${item.isTriplen ? 'text-rose-400' : 'text-slate-300'}`}>
                      {item.rank}
                    </span>
                    <span className="block text-[8px] text-slate-500">{item.freq}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              <span>{isFr ? 'Harmoniques Homopolaires (Triplen H3, H9)' : 'Triplen Harmonics (H3, H9)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span>{isFr ? 'Harmoniques de VFD (H5, H7)' : 'VFD Harmonics (H5, H7)'}</span>
            </div>
          </div>
        </div>

        {/* Reconstructed Distorted Waveform Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              {isFr ? 'Forme d\'Onde Réelle vs Sinusoïde Pure' : 'Reconstructed Current Waveform vs Pure Sine'}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">i(t) = Σ √2·Ih·sin(hωt)</span>
          </div>

          <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full select-none">
              {/* Center Line (Zero Crossing) */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Pure Fundamental Waveform (Dashed Green) */}
              <path 
                d={Array.from({ length: 100 }).map((_, i) => {
                  const x = (i / 99) * 400;
                  const angle = (i / 99) * 2 * Math.PI;
                  const y = 100 - Math.sin(angle) * 70;
                  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Reconstructed Distorted Waveform (Cyan Solid) */}
              <path 
                d={Array.from({ length: 120 }).map((_, i) => {
                  const x = (i / 119) * 400;
                  const angle = (i / 119) * 2 * Math.PI;
                  // Synthesize Fundamental + H3 + H5 + H7
                  const h1Comp = Math.sin(angle);
                  const h3Comp = (harmonicsData.percentH3 / 100) * Math.sin(3 * angle);
                  const h5Comp = -(harmonicsData.percentH5 / 100) * Math.sin(5 * angle);
                  const h7Comp = (harmonicsData.percentH7 / 100) * Math.sin(7 * angle);
                  const total = (h1Comp + h3Comp + h5Comp + h7Comp) / (1 + (harmonicsData.thdI / 100) * 0.4);
                  const y = 100 - total * 70;
                  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                }).join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1.5 bg-emerald-500 inline-block border-t border-dashed" />
              <span>{isFr ? 'Sinusoïde Fondamentale Pure (50 Hz)' : 'Pure Fundamental Sine (50 Hz)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1.5 bg-cyan-400 inline-block" />
              <span>{isFr ? 'Courant Déformé Réel i(t)' : 'Actual Distorted Current i(t)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Interactive Harmonic Mitigation & Filtering Simulator          */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isFr ? 'Simulateur de Dépollution Harmonique & Filtrage' : 'Harmonic Mitigation & Filtering Simulator'}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">
            {isFr ? 'Impact direct sur THD et courant de neutre' : 'Real-time impact on THD and neutral current'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setActiveFilterType('NONE')}
            className={`p-3 rounded-xl border text-left transition ${
              activeFilterType === 'NONE'
                ? 'bg-slate-800 border-cyan-400 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>{isFr ? 'Aucun Filtrage' : 'No Filtering'}</span>
              {activeFilterType === 'NONE' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {isFr ? 'Pollution brute du site' : 'Raw baseline pollution'}
            </p>
          </button>

          <button
            onClick={() => setActiveFilterType('LINE_REACTORS')}
            className={`p-3 rounded-xl border text-left transition ${
              activeFilterType === 'LINE_REACTORS'
                ? 'bg-slate-800 border-cyan-400 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>{isFr ? 'Selfs de Ligne (3-5%)' : 'Line Reactors (3-5%)'}</span>
              {activeFilterType === 'LINE_REACTORS' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {isFr ? 'Atténue H5/H7 sur variateurs' : 'Attenuates H5/H7 on VFDs'}
            </p>
          </button>

          <button
            onClick={() => setActiveFilterType('PASSIVE_TRAP')}
            className={`p-3 rounded-xl border text-left transition ${
              activeFilterType === 'PASSIVE_TRAP'
                ? 'bg-slate-800 border-cyan-400 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>{isFr ? 'Filtre Passif Accordé' : 'Passive Tuned Trap'}</span>
              {activeFilterType === 'PASSIVE_TRAP' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {isFr ? 'Piège LC rang 5 et 7' : 'LC resonant trap for 5th/7th'}
            </p>
          </button>

          <button
            onClick={() => setActiveFilterType('ACTIVE_FILTER')}
            className={`p-3 rounded-xl border text-left transition ${
              activeFilterType === 'ACTIVE_FILTER'
                ? 'bg-slate-800 border-emerald-400 text-white shadow ring-1 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>{isFr ? 'Filtre Actif (AHF)' : 'Active Filter (AHF)'}</span>
              {activeFilterType === 'ACTIVE_FILTER' && <Check className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {isFr ? 'Annule H3, H5, H7, H9, H11' : 'Cancels H3, H5, H7, H9, H11'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
