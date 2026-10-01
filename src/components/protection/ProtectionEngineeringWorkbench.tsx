// src/components/protection/ProtectionEngineeringWorkbench.tsx
// EPEDE D11 - Protection, Measurements & Power System Studies Engineering Workbench
// 7-Pillar Architecture: TCC Selective Coordination (IEC 60255), CT Saturation & Sizing (IEC 61869-2),
// Distance 21/21N R-X Plane, Differential 87T/87L Dual-Slope, IEC 60909 Short-Circuit, IEC 61850 Digital Substation,
// and Cameroon Grid Grounding & Forensic Case Studies.

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Sliders,
  Cpu,
  Layers,
  Radio,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Gauge,
  Clock,
  ArrowRight,
  Flame,
  FileText,
  Compass,
  Check,
  XCircle,
  Network,
  Share2,
  TrendingDown,
  Layers2,
  Download
} from 'lucide-react';

import { NumericalDistanceProtectionRxSimulator } from '../substations/modules/NumericalDistanceProtectionRxSimulator';
import { DifferentialProtectionDualSlopeSaturationSimulator } from '../substations/modules/DifferentialProtectionDualSlopeSaturationSimulator';
import { Iec61850GoosePtpClockSimulator } from '../substations/modules/Iec61850GoosePtpClockSimulator';
import { TccCoordinationEngine, TccCurveDefinition } from '../../data/tccCoordinationEngine';
import { Iec60909Engine, Iec60909FaultResult } from '../../data/iec60909Engine';
import { DomainAnsiTable } from '../domain/modules/DomainAnsiTable';
import { EarthingRegime } from '../../types/epede';

interface ProtectionEngineeringWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarKey =
  | 'TCC_COORDINATION'
  | 'CT_SATURATION'
  | 'DISTANCE_21'
  | 'DIFFERENTIAL_87'
  | 'IEC60909_FAULTS'
  | 'IEC61850_DIGITAL'
  | 'FORENSIC_CASES';

export const ProtectionEngineeringWorkbench: React.FC<ProtectionEngineeringWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('TCC_COORDINATION');

  // =========================================================================
  // PILLAR 1: TCC SELECTIVE COORDINATION STATE & ENGINE
  // =========================================================================
  const [tccFaultCurrentA, setTccFaultCurrentA] = useState<number>(8500);
  const [feederCurveFamily, setFeederCurveFamily] = useState<'iec_ni' | 'iec_vi' | 'iec_ei'>('iec_ni');
  const [feederTms, setFeederTms] = useState<number>(0.18);
  const [feederPickupA, setFeederPickupA] = useState<number>(1200);
  const [feederInstPickupA, setFeederInstPickupA] = useState<number>(14000);

  const [trafoCurveFamily, setTrafoCurveFamily] = useState<'iec_ni' | 'iec_vi' | 'iec_ei'>('iec_vi');
  const [trafoTms, setTrafoTms] = useState<number>(0.28);
  const [trafoPickupA, setTrafoPickupA] = useState<number>(2400);

  const [lvAcbIrA, setLvAcbIrA] = useState<number>(630);
  const [lvAcbIsdA, setLvAcbIsdA] = useState<number>(2520);
  const [lvAcbTsdSec, setLvAcbTsdSec] = useState<number>(0.15);
  const [lvAcbIiA, setLvAcbIiA] = useState<number>(6300);

  // Dynamic TCC curves configuration
  const dynamicTccCurves: TccCurveDefinition[] = useMemo(() => {
    return [
      {
        id: 'curve-motor',
        name: { fr: 'Moteur 250 kW (Démarrage & Échauffement)', en: '250 kW Motor (Start & Damage)' },
        role: 'motor_withstand',
        deviceTag: '--M01-PROT',
        color: '#F59E0B',
        voltageRefKv: 0.4,
        pickupAmperes: 450,
        curveFamily: 'motor_start'
      },
      {
        id: 'curve-lv-acb',
        name: { fr: 'Disjoncteur BT Général TGBT (ACB 1600 A)', en: 'Main LV ACB Incomer (1600 A)' },
        role: 'lv_breaker',
        deviceTag: '==BT.QA1',
        color: '#10B981',
        voltageRefKv: 0.4,
        pickupAmperes: lvAcbIrA,
        curveFamily: 'lv_electronic',
        shortTimePickup: lvAcbIsdA,
        shortTimeDelaySec: lvAcbTsdSec,
        instantaneousPickup: lvAcbIiA
      },
      {
        id: 'curve-mv-feeder',
        name: { fr: 'Relais Départ 30 kV HTA Feeder 4 (ANSI 51)', en: '30 kV Feeder 4 Relay (ANSI 51)' },
        role: 'mv_feeder',
        deviceTag: '==HTA.FC4',
        color: '#38BDF8',
        voltageRefKv: 0.4,
        pickupAmperes: feederPickupA,
        curveFamily: feederCurveFamily,
        tms: feederTms,
        instantaneousPickup: feederInstPickupA
      },
      {
        id: 'curve-hv-substation',
        name: { fr: 'Relais Amont Transfo 225/30 kV (ANSI 51)', en: 'Substation Incomer 225/30 kV (ANSI 51)' },
        role: 'hv_incomer',
        deviceTag: '==SUB.TR2',
        color: '#A855F7',
        voltageRefKv: 0.4,
        pickupAmperes: trafoPickupA,
        curveFamily: trafoCurveFamily,
        tms: trafoTms,
        instantaneousPickup: 28000
      }
    ];
  }, [lvAcbIrA, lvAcbIsdA, lvAcbTsdSec, lvAcbIiA, feederPickupA, feederCurveFamily, feederTms, feederInstPickupA, trafoPickupA, trafoCurveFamily, trafoTms]);

  // Sample points for TCC log-log plotting
  const logCurrents = useMemo(() => {
    const arr: number[] = [];
    // From 50 A to 40,000 A logarithmically spaced
    for (let exp = 1.7; exp <= 4.6; exp += 0.05) {
      arr.push(Math.round(Math.pow(10, exp)));
    }
    return arr;
  }, []);

  const plottedCurves = useMemo(() => {
    return dynamicTccCurves.map((curve) => ({
      ...curve,
      points: TccCoordinationEngine.generateCurvePoints(curve, logCurrents)
    }));
  }, [dynamicTccCurves, logCurrents]);

  // Operating times at prospective fault current
  const tccEvaluation = useMemo(() => {
    const pts = dynamicTccCurves.map((c) => {
      const p = TccCoordinationEngine.generateCurvePoints(c, [tccFaultCurrentA]);
      return {
        id: c.id,
        name: c.name,
        color: c.color,
        timeSec: p.length > 0 ? p[0].timeSec : 999
      };
    });

    const tLv = pts.find((p) => p.id === 'curve-lv-acb')?.timeSec ?? 999;
    const tFeeder = pts.find((p) => p.id === 'curve-mv-feeder')?.timeSec ?? 999;
    const tTrafo = pts.find((p) => p.id === 'curve-hv-substation')?.timeSec ?? 999;

    const margin1 = tFeeder - tLv; // Feeder vs LV ACB
    const margin2 = tTrafo - tFeeder; // Trafo vs Feeder

    return {
      pts,
      tLv,
      tFeeder,
      tTrafo,
      margin1,
      margin2,
      isSelective1: margin1 >= 0.250,
      isSelective2: margin2 >= 0.250
    };
  }, [dynamicTccCurves, tccFaultCurrentA]);

  const handleExportTccReport = () => {
    const isFr = locale === 'fr';
    const lines = [
      '========================================================================================',
      isFr ? 'EPEDE D11 — FICHE TECHNIQUE DE COORDINATION SELECTIVE TEMPS-COURANT (TCC) — CEI 60255' : 'EPEDE D11 — TIME-CURRENT CHARACTERISTIC (TCC) COORDINATION REPORT — IEC 60255',
      '========================================================================================',
      `DATE: ${new Date().toLocaleString(isFr ? 'fr-FR' : 'en-US')}`,
      `RESEAU / PROJET: SONATREL / Eneo — Interconnexion Poste Oyomabang 225/30 kV`,
      `COURANT DE DEFAUT PRESUME (Ik): ${tccFaultCurrentA.toLocaleString()} A (Base 400 V)`,
      '----------------------------------------------------------------------------------------',
      isFr ? 'REGLAGES DES DISPOSITIFS DE PROTECTION:' : 'PROTECTION DEVICE SETTINGS:',
      `1. Moteur 250 kW: Demarrage 6x In, t_start=4s, Tenue thermique stator t_damage=12s`,
      `2. Disjoncteur BT (ACB Masterpact): Ir=${lvAcbIrA} A, Isd=${lvAcbIsdA} A, tsd=${(lvAcbTsdSec*1000).toFixed(0)} ms, Ii=${lvAcbIiA} A`,
      `3. Depart HTA 30 kV (ANSI 51): Courbe ${feederCurveFamily.toUpperCase()}, TMS=${feederTms}, Pickup=${feederPickupA} A, Inst=${feederInstPickupA} A`,
      `4. Transformateur 225/30 kV Amont (ANSI 51): Courbe ${trafoCurveFamily.toUpperCase()}, TMS=${trafoTms}, Pickup=${trafoPickupA} A`,
      '----------------------------------------------------------------------------------------',
      isFr ? 'VERDICT DE DISCRIMINATION ET MARGES DE TEMPS:' : 'DISCRIMINATION VERDICT & TIME MARGINS:',
      `- Marge HTA Feeder <-> Disjoncteur BT: dt = ${(tccEvaluation.margin1 * 1000).toFixed(0)} ms [Critere: >= 250 ms] -> ${tccEvaluation.isSelective1 ? 'CONFORME / COMPLIANT' : 'NON-CONFORME / BREACH'}`,
      `- Marge Transfo 225/30 kV <-> Feeder HTA: dt = ${(tccEvaluation.margin2 * 1000).toFixed(0)} ms [Critere: >= 300 ms] -> ${tccEvaluation.isSelective2 ? 'CONFORME / COMPLIANT' : 'NON-CONFORME / BREACH'}`,
      '========================================================================================',
      isFr ? 'Certifie conforme CEI 60255-151 / IEEE C37.112 pour etudes de selectivite reseau.' : 'Certified compliant with IEC 60255-151 / IEEE C37.112 for grid selectivity studies.',
      '========================================================================================'
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPEDE_TCC_Coordination_Sheet_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // =========================================================================
  // PILLAR 2: CT SIZING & SATURATION SOLVER (IEC 61869-2 & IEEE C57.13)
  // =========================================================================
  const [ctRating, setCtRating] = useState<'1000/1' | '1000/5' | '2000/1'>('1000/1');
  const [ctAlfRated, setCtAlfRated] = useState<number>(20); // 5P20
  const [ctSnRatedVa, setCtSnRatedVa] = useState<number>(30); // 30 VA
  const [ctRctOhms, setCtRctOhms] = useState<number>(3.8); // internal CT winding resistance
  const [ctCableLengthM, setCtCableLengthM] = useState<number>(120); // meters
  const [ctCableSectionMm2, setCtCableSectionMm2] = useState<number>(4.0); // mm2
  const [ctRelayBurdenOhms, setCtRelayBurdenOhms] = useState<number>(0.10); // numerical relay internal impedance
  const [ctFaultCurrentKa, setCtFaultCurrentKa] = useState<number>(25); // kA primary fault
  const [ctSystemXrRatio, setCtSystemXrRatio] = useState<number>(18); // X/R ratio of system

  const ctCalculation = useMemo(() => {
    const isPrimary1000 = ctRating.startsWith('1000');
    const primaryA = isPrimary1000 ? 1000 : 2000;
    const secondaryA = ctRating.endsWith('1') ? 1 : 5;
    const ctRatio = primaryA / secondaryA;

    // Cable loop resistance (copper rho = 0.0185 Ohm*mm2/m at 75°C)
    // 2-wire loop: Rw = 2 * rho * L / S
    const rhoCu = 0.0185;
    const rwOhms = (2 * rhoCu * ctCableLengthM) / ctCableSectionMm2;

    // Actual burden connected to CT secondary
    const rbActualOhms = rwOhms + ctRelayBurdenOhms;

    // Rated burden resistance Rb_rated = Sn / Isn^2
    const rbRatedOhms = ctSnRatedVa / Math.pow(secondaryA, 2);

    // Effective operational Accuracy Limit Factor ALF_actual
    // ALF_actual = ALF_rated * (Rct + Rb_rated) / (Rct + Rb_actual)
    const alfActual = ctAlfRated * ((ctRctOhms + rbRatedOhms) / (ctRctOhms + rbActualOhms));

    // Secondary fault current
    const ifaultSecA = (ctFaultCurrentKa * 1000) / ctRatio;

    // Fault current in multiple of rated secondary
    const ifaultMultiple = ifaultSecA / secondaryA;

    // Symmetrical knee-point voltage required
    const vkSymmetrical = ifaultSecA * (ctRctOhms + rbActualOhms);

    // DC offset time constant Tp = (X/R) / (2 * pi * 50)
    const tpSec = ctSystemXrRatio / (2 * Math.PI * 50);

    // Transient dimensioning factor Ktd (simplified IEEE/IEC for t_trip = 40 ms)
    // Ktd = 1 + (omega * Tp)
    const ktd = 1 + 2 * Math.PI * 50 * tpSec;

    // Total required knee point voltage under full asymmetrical DC offset
    const vkTransientRequired = vkSymmetrical * ktd;

    // Saturation assessment
    const isSteadyStateSafe = alfActual >= ifaultMultiple;
    const saturationRiskRatio = ifaultMultiple / alfActual;

    let status: 'SAFE' | 'BORDERLINE' | 'SATURATING';
    if (saturationRiskRatio <= 0.85) status = 'SAFE';
    else if (saturationRiskRatio <= 1.05) status = 'BORDERLINE';
    else status = 'SATURATING';

    return {
      secondaryA,
      ctRatio,
      rwOhms,
      rbActualOhms,
      rbRatedOhms,
      alfActual,
      ifaultSecA,
      ifaultMultiple,
      vkSymmetrical,
      tpSec,
      ktd,
      vkTransientRequired,
      isSteadyStateSafe,
      saturationRiskRatio,
      status
    };
  }, [ctRating, ctAlfRated, ctSnRatedVa, ctRctOhms, ctCableLengthM, ctCableSectionMm2, ctRelayBurdenOhms, ctFaultCurrentKa, ctSystemXrRatio]);

  // =========================================================================
  // PILLAR 5: IEC 60909 SHORT-CIRCUIT CALCULATOR STATE
  // =========================================================================
  const [iecNodeId, setIecNodeId] = useState<string>('node-bus-30-oyomabang');
  const [iecEarthingRegime, setIecEarthingRegime] = useState<EarthingRegime>('NGR');
  const [iecNgrResistance, setIecNgrResistance] = useState<number>(433.0); // 433 Ohms limits Ik1 to 40 A at 30 kV

  const iecFaultResult: Iec60909FaultResult = useMemo(() => {
    const kv = iecNodeId.includes('225') ? 225 : iecNodeId.includes('90') ? 90 : iecNodeId.includes('10.5') ? 10.5 : 30;
    return Iec60909Engine.calculateFault(iecNodeId, kv, iecEarthingRegime, iecNgrResistance);
  }, [iecNodeId, iecEarthingRegime, iecNgrResistance]);

  // =========================================================================
  // PILLARS NAVIGATION TABS CONFIG
  // =========================================================================
  const pillars = [
    {
      id: 'TCC_COORDINATION' as PillarKey,
      name_fr: '1. Coordination Sélective TCC (CEI 60255)',
      name_en: '1. TCC Selectivity (IEC 60255)',
      icon: TrendingDown,
      desc_fr: 'Courbes log-log, calage de déclenchement & marges Δt ≥ 300 ms',
      desc_en: 'Log-log curves, trip grading & discrimination margin Δt ≥ 300 ms'
    },
    {
      id: 'CT_SATURATION' as PillarKey,
      name_fr: '2. Dimensionnement & Saturation TC (CEI 61869-2)',
      name_en: '2. CT Sizing & Saturation (IEC 61869-2)',
      icon: Gauge,
      desc_fr: 'Facteur ALF, tension de coude Vk, fardeau de boucle & composante apériodique',
      desc_en: 'ALF factor, knee-point Vk, loop burden & transient DC offset'
    },
    {
      id: 'DISTANCE_21' as PillarKey,
      name_fr: '3. Protection de Distance 21 (Plan R-X)',
      name_en: '3. Distance Protection 21 (R-X Plane)',
      icon: Compass,
      desc_fr: 'Zones d\'impédance Mho/Quad, oscillations de puissance & téléprotection',
      desc_en: 'Mho/Quad reach zones, power swing blocking & teleprotection'
    },
    {
      id: 'DIFFERENTIAL_87' as PillarKey,
      name_fr: '4. Protection Différentielle 87T/87L',
      name_en: '4. Differential 87T/87L (Dual-Slope)',
      icon: ShieldAlert,
      desc_fr: 'Plan à pourcentage double pente, blocage harmonique 2 & compensation vectorielle',
      desc_en: 'Dual-slope percentage restraint, 2nd harmonic inrush & vector compensation'
    },
    {
      id: 'IEC60909_FAULTS' as PillarKey,
      name_fr: '5. Calculs Court-Circuit CEI 60909 & SLT',
      name_en: '5. IEC 60909 Faults & Neutral Earthing',
      icon: Zap,
      desc_fr: 'Courants Ik\'\', ip, Ib, Ik1\'\' & surtensions saines selon régime de neutre',
      desc_en: 'Ik\'\', peak ip, breaking Ib, Ik1\'\' & healthy phase displacement'
    },
    {
      id: 'IEC61850_DIGITAL' as PillarKey,
      name_fr: '6. Sous-Station Numérique CEI 61850',
      name_en: '6. IEC 61850 Digital Substation',
      icon: Network,
      desc_fr: 'Process Bus SV, ordres GOOSE sub-3 ms, redondance PRP & PTP 1588',
      desc_en: 'Process Bus SV, sub-3 ms GOOSE trips, PRP dual redundancy & PTP 1588'
    },
    {
      id: 'FORENSIC_CASES' as PillarKey,
      name_fr: '7. Retours d\'Expérience & Cas Cameroun',
      name_en: '7. Field Cases & Cameroon Grounding',
      icon: FileText,
      desc_fr: 'SONATREL 225 kV, neutre HTA 40 A Eneo & analyse d\'incidents réels',
      desc_en: 'SONATREL 225 kV, Eneo 40 A NGR earthing & real incident forensics'
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER HERO BANNER */}
      <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-[#1A0A10] via-[#0E121A] to-[#0A0D14] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span>DOMAINE D11 • INGENIERIE DES PROTECTIONS & ÉTUDES DE RÉSEAU</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {locale === 'fr'
                ? 'Station Expert Protections Numériques, Mesures & Sélectivité'
                : 'Digital Protection, Instrument Transformers & Power System Studies Workbench'}
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Plateforme intégrée de simulation conforme aux normes CEI 60255, CEI 61869-2, CEI 60909, CEI 61850 et IEEE C37. Modélisation rigoureuse de la sélectivité TCC, dimensionnement de tores TC, plans d\'impédance R-X, différentielle à pourcentage et schémas de mise à la terre.'
                : 'Integrated protection simulation workbench certified to IEC 60255, IEC 61869-2, IEC 60909, IEC 61850, and IEEE C37. Rigorous TCC selectivity curves, CT saturation solvers, complex R-X planes, dual-slope differential, and substation neutral regimes.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs font-mono text-neutral-400 uppercase">STANDARDS</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">CEI / IEEE C37</div>
              <div className="text-[10px] text-red-400 font-mono">60255 • 60909 • 61850</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'MARGE SÉLECTIVE' : 'GRADING MARGIN'}</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">Δt ≥ 300 ms</div>
              <div className="text-[10px] text-neutral-500 font-mono">Chronometric CCT</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-xs font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'RÉSEAU TERRAIN' : 'FIELD GRID'}</div>
              <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">SONATREL / Eneo</div>
              <div className="text-[10px] text-neutral-500 font-mono">225 kV & 30 kV HTA</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 PILLARS HORIZONTAL SELECTOR TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isSelected = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActivePillar(pillar.id)}
              className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-red-500 bg-red-500/10 text-white shadow-lg ring-1 ring-red-500/50'
                  : 'border-slate-800 bg-slate-900/70 text-neutral-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isSelected ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-neutral-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono whitespace-nowrap">
                  {locale === 'fr' ? pillar.name_fr : pillar.name_en}
                </div>
                <div className="text-[10px] text-neutral-500 font-sans truncate max-w-[220px]">
                  {locale === 'fr' ? pillar.desc_fr : pillar.desc_en}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* PILLAR 1: TCC SELECTIVE COORDINATION SOLVER */}
      {/* ===================================================================== */}
      {activePillar === 'TCC_COORDINATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CONTROLS & DEVICE PARAMETERS (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0D1117] p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Réglages des Relais de la Chaîne' : 'Protection Chain Relay Settings'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFeederCurveFamily('iec_ni');
                      setFeederTms(0.18);
                      setFeederPickupA(1200);
                      setFeederInstPickupA(14000);
                      setTrafoCurveFamily('iec_vi');
                      setTrafoTms(0.28);
                      setTrafoPickupA(2400);
                      setLvAcbIrA(630);
                      setLvAcbIsdA(2520);
                      setLvAcbTsdSec(0.15);
                      setLvAcbIiA(6300);
                      setTccFaultCurrentA(8500);
                    }}
                    className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Prospective fault current slider */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      {locale === 'fr' ? 'Courant de Court-Circuit Présumé (Ik) :' : 'Prospective Fault Current (Ik):'}
                    </span>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {tccFaultCurrentA.toLocaleString()} A (Base 400V)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={35000}
                    step={250}
                    value={tccFaultCurrentA}
                    onChange={(e) => setTccFaultCurrentA(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                    <span>500 A (Défaut éloigné)</span>
                    <span>15 kA</span>
                    <span>35 kA (Barres TGBT)</span>
                  </div>
                </div>

                {/* DEVICE 1: RELAIS DEPART 30 kV FEEDER 4 (ANSI 51) */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-sky-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {locale === 'fr' ? 'Départ 30 kV HTA (ANSI 51) [==HTA.FC4]' : '30 kV MV Feeder (ANSI 51) [==HTA.FC4]'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      t = {tccEvaluation.tFeeder < 100 ? `${(tccEvaluation.tFeeder * 1000).toFixed(0)} ms` : '> 100 s'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Courbe CEI :' : 'IEC Curve:'}</label>
                      <select
                        value={feederCurveFamily}
                        onChange={(e) => setFeederCurveFamily(e.target.value as any)}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="iec_ni">IEC Normal Inverse</option>
                        <option value="iec_vi">IEC Very Inverse</option>
                        <option value="iec_ei">IEC Extremely Inverse</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">TMS (Time Multiplier) : {feederTms}</label>
                      <input
                        type="range"
                        min={0.05}
                        max={1.0}
                        step={0.01}
                        value={feederTms}
                        onChange={(e) => setFeederTms(Number(e.target.value))}
                        className="w-full mt-2 accent-sky-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Is (Seuil) : {feederPickupA} A</label>
                      <input
                        type="range"
                        min={300}
                        max={3000}
                        step={50}
                        value={feederPickupA}
                        onChange={(e) => setFeederPickupA(Number(e.target.value))}
                        className="w-full mt-2 accent-sky-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Instant. 50 (I&gt;&gt;) : {feederInstPickupA} A</label>
                      <input
                        type="range"
                        min={5000}
                        max={30000}
                        step={500}
                        value={feederInstPickupA}
                        onChange={(e) => setFeederInstPickupA(Number(e.target.value))}
                        className="w-full mt-2 accent-sky-400 h-1 bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* DEVICE 2: DISJONCTEUR BT GENERAL TGBT (ACB 1600 A) */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {locale === 'fr' ? 'Disjoncteur BT Général (ACB) [==BT.QA1]' : 'Main LV Incomer (ACB) [==BT.QA1]'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      t = {tccEvaluation.tLv < 100 ? `${(tccEvaluation.tLv * 1000).toFixed(0)} ms` : '> 100 s'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Ir (Long Time) : {lvAcbIrA} A</label>
                      <input
                        type="range"
                        min={400}
                        max={1600}
                        step={25}
                        value={lvAcbIrA}
                        onChange={(e) => setLvAcbIrA(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Isd (Short Time) : {lvAcbIsdA} A</label>
                      <input
                        type="range"
                        min={1000}
                        max={8000}
                        step={100}
                        value={lvAcbIsdA}
                        onChange={(e) => setLvAcbIsdA(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">tsd (Délai Isd) : {(lvAcbTsdSec * 1000).toFixed(0)} ms</label>
                      <input
                        type="range"
                        min={0.05}
                        max={0.40}
                        step={0.05}
                        value={lvAcbTsdSec}
                        onChange={(e) => setLvAcbTsdSec(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Ii (Inst. Crête) : {lvAcbIiA} A</label>
                      <input
                        type="range"
                        min={4000}
                        max={20000}
                        step={500}
                        value={lvAcbIiA}
                        onChange={(e) => setLvAcbIiA(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* DEVICE 3: POSTE TRANSFO 225/30 kV INCOMER */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="text-xs font-mono font-bold text-purple-300">
                        {locale === 'fr' ? 'Transfo 225/30 kV Amont (ANSI 51) [==SUB.TR2]' : '225/30 kV Trafo Upstream (ANSI 51) [==SUB.TR2]'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      t = {tccEvaluation.tTrafo < 100 ? `${(tccEvaluation.tTrafo * 1000).toFixed(0)} ms` : '> 100 s'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Courbe CEI :' : 'IEC Curve:'}</label>
                      <select
                        value={trafoCurveFamily}
                        onChange={(e) => setTrafoCurveFamily(e.target.value as any)}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="iec_ni">IEC Normal Inverse</option>
                        <option value="iec_vi">IEC Very Inverse</option>
                        <option value="iec_ei">IEC Extremely Inverse</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block">TMS : {trafoTms}</label>
                      <input
                        type="range"
                        min={0.10}
                        max={1.0}
                        step={0.02}
                        value={trafoTms}
                        onChange={(e) => setTrafoTms(Number(e.target.value))}
                        className="w-full mt-2 accent-purple-400 h-1 bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LOG-LOG TCC INTERACTIVE CURVES VIEWER & MARGIN SUMMARY (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* DISCRIMINATION VERDICT BANNER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    tccEvaluation.isSelective1
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-red-500/40 bg-red-950/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase">
                      {locale === 'fr' ? 'Sélectivité HTA Feeder ↔ TGBT' : 'Feeder MV ↔ LV ACB Margin'}
                    </span>
                    {tccEvaluation.isSelective1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">
                    Δt = {(tccEvaluation.margin1 * 1000).toFixed(0)} ms
                  </div>
                  <div className="text-[11px] font-sans text-neutral-300 mt-1">
                    {tccEvaluation.isSelective1
                      ? locale === 'fr'
                        ? 'Sélectivité garantie (≥ 250 ms standard CEI 60255)'
                        : 'Certified selectivity (≥ 250 ms IEC 60255 standard)'
                      : locale === 'fr'
                      ? 'DÉFAILLANCE SÉLECTIVITÉ : Chevauchement de courbe ou intervalle < 250 ms !'
                      : 'SELECTIVITY BREACH: Curve overlap or grading interval < 250 ms!'}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    tccEvaluation.isSelective2
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase">
                      {locale === 'fr' ? 'Sélectivité Transfo ↔ HTA Feeder' : 'Substation Trafo ↔ MV Feeder'}
                    </span>
                    {tccEvaluation.isSelective2 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">
                    Δt = {(tccEvaluation.margin2 * 1000).toFixed(0)} ms
                  </div>
                  <div className="text-[11px] font-sans text-neutral-300 mt-1">
                    {tccEvaluation.isSelective2
                      ? locale === 'fr'
                        ? 'Discrimination chronométrique assurée (≥ 300 ms)'
                        : 'Chronometric discrimination certified (≥ 300 ms)'
                      : locale === 'fr'
                      ? 'Intervalle critique amont : ajuster TMS du transfo.'
                      : 'Critical upstream margin: tune transformer TMS.'}
                  </div>
                </div>
              </div>

              {/* LOG-LOG COORDINATION CURVES PLOT (SVG) */}
              <div className="rounded-2xl border border-slate-800 bg-[#080B10] p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Graphique Log-Log TCC Temps-Courant (CEI 60255)' : 'Log-Log TCC Time-Current Characteristic (IEC 60255)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Moteur 250 kW
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> BT ACB
                    </span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2 h-2 rounded-full bg-sky-400" /> HTA 51
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <span className="w-2 h-2 rounded-full bg-purple-400" /> Transfo 51
                    </span>

                    <button
                      type="button"
                      onClick={handleExportTccReport}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition-all ml-2"
                      title={locale === 'fr' ? 'Télécharger la fiche TCC CEI 60255' : 'Download IEC 60255 TCC Sheet'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Export TCC' : 'Export TCC'}</span>
                    </button>
                  </div>
                </div>

                {/* SVG PLOT */}
                <div className="relative w-full h-[360px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  <svg viewBox="0 0 700 360" className="w-full h-full select-none">
                    {/* Log Grid Lines X (Current: 100 A to 40,000 A) */}
                    {/* Log10(100) = 2 -> x=60, Log10(40000) = 4.602 -> x=660. dx = 600 / 2.602 = 230 px/decade */}
                    {/* Y: Time 0.01 s to 100 s. Log10(0.01) = -2 (y=320), Log10(100) = 2 (y=40). dy = 280 / 4 = 70 px/decade */}
                    {[100, 200, 500, 1000, 2000, 5000, 10000, 20000, 40000].map((curr) => {
                      const logVal = Math.log10(curr);
                      const x = 60 + ((logVal - 2) / 2.6) * 600;
                      return (
                        <g key={curr}>
                          <line x1={x} y1={40} x2={x} y2={320} stroke="#1E293B" strokeWidth="1" strokeDasharray={curr.toString().startsWith('1') ? 'none' : '2,2'} />
                          <text x={x} y={335} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">
                            {curr >= 1000 ? `${curr / 1000}k` : curr}A
                          </text>
                        </g>
                      );
                    })}

                    {/* Log Grid Lines Y (Time: 0.01 s, 0.1 s, 1 s, 10 s, 100 s) */}
                    {[0.01, 0.1, 1.0, 10.0, 100.0].map((t) => {
                      const logVal = Math.log10(t); // -2, -1, 0, 1, 2
                      const y = 320 - ((logVal - (-2)) / 4) * 280;
                      return (
                        <g key={t}>
                          <line x1={60} y1={y} x2={660} y2={y} stroke="#1E293B" strokeWidth="1" />
                          <text x={52} y={y + 3} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">
                            {t}s
                          </text>
                        </g>
                      );
                    })}

                    {/* AXES LABELS */}
                    <text x={360} y={355} fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      {locale === 'fr' ? 'Courant ramené à 400 V (A efficases)' : 'Current referred to 400 V base (A rms)'}
                    </text>
                    <text x={20} y={180} fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 20 180)">
                      {locale === 'fr' ? 'Temps d\'élimination (secondes)' : 'Operating Time (seconds)'}
                    </text>

                    {/* FAULT CURRENT CURSOR LINE */}
                    {(() => {
                      const logF = Math.log10(Math.max(100, Math.min(40000, tccFaultCurrentA)));
                      const xF = 60 + ((logF - 2) / 2.6) * 600;
                      return (
                        <g>
                          <line x1={xF} y1={40} x2={xF} y2={320} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,4" />
                          <circle cx={xF} cy={320} r="4" fill="#EF4444" />
                          <text x={xF} y={35} fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                            Ik = {tccFaultCurrentA} A
                          </text>
                        </g>
                      );
                    })()}

                    {/* CURVE PLOTS */}
                    {plottedCurves.map((c) => {
                      if (!c.points || c.points.length < 2) return null;
                      const pathD = c.points
                        .filter((p) => p.currentA >= 100 && p.currentA <= 40000 && p.timeSec >= 0.01 && p.timeSec <= 100)
                        .map((p, idx) => {
                          const logX = Math.log10(p.currentA);
                          const x = 60 + ((logX - 2) / 2.6) * 600;
                          const logY = Math.log10(p.timeSec);
                          const y = 320 - ((logY - (-2)) / 4) * 280;
                          return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(' ');

                      return (
                        <g key={c.id}>
                          <path d={pathD} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* SELECTIVITY TIMELINE BAR BREAKDOWN */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {locale === 'fr'
                        ? 'Décomposition de la Marge de Sélectivité Chronométrique (Δt = 300 ms) :'
                        : 'Chronometric Grading Margin Anatomy (Δt = 300 ms Standard):'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                      <div className="text-cyan-400 font-bold">50 ms</div>
                      <div className="text-neutral-400 mt-0.5">{locale === 'fr' ? 'Coupure Disjoncteur' : 'Breaker Opening'}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                      <div className="text-cyan-400 font-bold">30 ms</div>
                      <div className="text-neutral-400 mt-0.5">{locale === 'fr' ? 'Dépassement Relais' : 'Relay Overshoot'}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                      <div className="text-cyan-400 font-bold">70 ms</div>
                      <div className="text-neutral-400 mt-0.5">{locale === 'fr' ? 'Erreurs Ratio TC' : 'CT Ratio Tolerance'}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                      <div className="text-cyan-400 font-bold">150 ms</div>
                      <div className="text-neutral-400 mt-0.5">{locale === 'fr' ? 'Marge de Sécurité' : 'Safety Buffer'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 2: CT SIZING & SATURATION SOLVER */}
      {/* ===================================================================== */}
      {activePillar === 'CT_SATURATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* INPUTS (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0D1117] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Paramètres du Tore TC & Boucle' : 'CT Core & Loop Parameters'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">CEI 61869-2</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-neutral-400 block">{locale === 'fr' ? 'Rapport Primaire/Secondaire :' : 'CT Transformation Ratio:'}</label>
                    <select
                      value={ctRating}
                      onChange={(e) => setCtRating(e.target.value as any)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5"
                    >
                      <option value="1000/1">1000 / 1 A (Standard Transport 225 kV SONATREL)</option>
                      <option value="1000/5">1000 / 5 A (Standard Distribution HTA courte distance)</option>
                      <option value="2000/1">2000 / 1 A (Forte Puissance / Groupes Songloulou)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block">{locale === 'fr' ? 'Classe Protection :' : 'Accuracy Class:'}</label>
                      <select
                        value={ctAlfRated}
                        onChange={(e) => setCtAlfRated(Number(e.target.value))}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1"
                      >
                        <option value={20}>5P20 (ALF = 20)</option>
                        <option value={10}>5P10 (ALF = 10)</option>
                        <option value={30}>5P30 (ALF = 30)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-neutral-400 block">Puissance Sn : {ctSnRatedVa} VA</label>
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={ctSnRatedVa}
                        onChange={(e) => setCtSnRatedVa(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block">Résistance Rct : {ctRctOhms} Ω</label>
                      <input
                        type="range"
                        min={0.5}
                        max={10.0}
                        step={0.1}
                        value={ctRctOhms}
                        onChange={(e) => setCtRctOhms(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block">Fardeau Relais Rb : {ctRelayBurdenOhms} Ω</label>
                      <input
                        type="range"
                        min={0.02}
                        max={1.0}
                        step={0.02}
                        value={ctRelayBurdenOhms}
                        onChange={(e) => setCtRelayBurdenOhms(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-400 h-1 bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <span className="text-neutral-300 font-bold block">
                      {locale === 'fr' ? 'Liaison Filaire Cour HTB ↔ Bâtiment Relais :' : 'Outdoor Switchyard Cable Run to Relay House:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 block">Longueur L : {ctCableLengthM} m</label>
                        <input
                          type="range"
                          min={10}
                          max={300}
                          step={10}
                          value={ctCableLengthM}
                          onChange={(e) => setCtCableLengthM(Number(e.target.value))}
                          className="w-full mt-2 accent-cyan-400 h-1 bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block">Section Cuivre : {ctCableSectionMm2} mm²</label>
                        <select
                          value={ctCableSectionMm2}
                          onChange={(e) => setCtCableSectionMm2(Number(e.target.value))}
                          className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                        >
                          <option value={2.5}>2.5 mm²</option>
                          <option value={4.0}>4.0 mm² (Standard Poste)</option>
                          <option value={6.0}>6.0 mm²</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold block">
                      {locale === 'fr' ? 'Sévérité du Défaut Primaire :' : 'Primary Fault Severity:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 block">Isc Primaire : {ctFaultCurrentKa} kA</label>
                        <input
                          type="range"
                          min={5}
                          max={50}
                          step={1}
                          value={ctFaultCurrentKa}
                          onChange={(e) => setCtFaultCurrentKa(Number(e.target.value))}
                          className="w-full mt-2 accent-amber-400 h-1 bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block">Ratio X/R : {ctSystemXrRatio}</label>
                        <input
                          type="range"
                          min={2}
                          max={40}
                          step={1}
                          value={ctSystemXrRatio}
                          onChange={(e) => setCtSystemXrRatio(Number(e.target.value))}
                          className="w-full mt-2 accent-amber-400 h-1 bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS & SATURATION ANALYSIS (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* VERDICT CARD */}
              <div
                className={`p-5 rounded-2xl border ${
                  ctCalculation.status === 'SAFE'
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : ctCalculation.status === 'BORDERLINE'
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                    : 'border-red-500/40 bg-red-950/30 text-red-300'
                } shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm uppercase">
                    {ctCalculation.status === 'SAFE' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {ctCalculation.status === 'BORDERLINE' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {ctCalculation.status === 'SATURATING' && <Flame className="w-5 h-5 text-red-400" />}
                    <span>
                      {ctCalculation.status === 'SAFE'
                        ? locale === 'fr' ? 'TORE CONFORME SANS SATURATION' : 'ADEQUATE CT CORE - NO SATURATION'
                        : ctCalculation.status === 'BORDERLINE'
                        ? locale === 'fr' ? 'MARGE LIMITE - RISQUE DE SATURATION TRANSITOIRE' : 'BORDERLINE MARGIN - TRANSIENT SATURATION RISK'
                        : locale === 'fr' ? 'SATURATION SÉVÈRE - RISQUE DÉFAILLANCE PROTECTION' : 'SEVERE CT SATURATION - RELAY MISOPERATION RISK'}
                    </span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-black/40 border border-current font-bold">
                    ALF_eff = {ctCalculation.alfActual.toFixed(1)}
                  </span>
                </div>

                <p className="text-xs font-sans text-neutral-300 mt-2 leading-relaxed">
                  {locale === 'fr'
                    ? `Le courant de court-circuit secondaire atteint ${ctCalculation.ifaultSecA.toFixed(1)} A (${ctCalculation.ifaultMultiple.toFixed(1)} × In). Le facteur limite réel ALF_eff calculé avec la filerie (${ctCalculation.rwOhms.toFixed(2)} Ω) est de ${ctCalculation.alfActual.toFixed(1)}. ${
                        ctCalculation.status === 'SAFE'
                          ? 'Le tore magnétique transmettra fidèlement le courant sans distorsion de crête.'
                          : 'Attention : le fardeau excessif réduit drastiquement la précision du TC lors du défaut franc.'
                      }`
                    : `Secondary short-circuit current reaches ${ctCalculation.ifaultSecA.toFixed(1)} A (${ctCalculation.ifaultMultiple.toFixed(1)} × In). Effective operational ALF with cable loop (${ctCalculation.rwOhms.toFixed(2)} Ω) is ${ctCalculation.alfActual.toFixed(1)}. ${
                        ctCalculation.status === 'SAFE'
                          ? 'The magnetic core will faithfully reproduce fault waveforms without flat-topping.'
                          : 'Warning: excessive burden severely impairs CT accuracy during bolted faults.'
                      }`}
                </p>
              </div>

              {/* CALCULATION DETAILED METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Fardeau Câbles (Rw)' : 'Cable Resistance (Rw)'}</div>
                  <div className="text-base font-bold font-mono text-white mt-1">{ctCalculation.rwOhms.toFixed(3)} Ω</div>
                  <div className="text-[10px] text-neutral-500 font-mono">2 × L × ρ / S</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Fardeau Total (Rb)' : 'Total Burden (Rb)'}</div>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-1">{ctCalculation.rbActualOhms.toFixed(3)} Ω</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Rw + Rb_relais</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Fardeau Nominal (Rbn)' : 'Rated Burden (Rbn)'}</div>
                  <div className="text-base font-bold font-mono text-white mt-1">{ctCalculation.rbRatedOhms.toFixed(2)} Ω</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Sn / Isn²</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Tension Coude Sym. (Vk)' : 'Symmetrical Vk'}</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1">{ctCalculation.vkSymmetrical.toFixed(1)} V</div>
                  <div className="text-[10px] text-neutral-500 font-mono">If_sec × (Rct + Rb)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Facteur Ktd (DC Offset)</div>
                  <div className="text-base font-bold font-mono text-purple-400 mt-1">{ctCalculation.ktd.toFixed(1)}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">1 + ω·Tp (Tp = {(ctCalculation.tpSec * 1000).toFixed(1)} ms)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Vk Transitoire Requise' : 'Transient Vk Required'}</div>
                  <div className="text-base font-bold font-mono text-red-400 mt-1">{ctCalculation.vkTransientRequired.toFixed(0)} V</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Ktd × Vk_sym</div>
                </div>
              </div>

              {/* SECONDARY WAVEFORM VISUALIZER (SVG) */}
              <div className="rounded-2xl border border-slate-800 bg-[#080B10] p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Forme d\'Onde Secondaire Répliquée (Simulation Saturation)' : 'Replicated Secondary Waveform (Core Saturation Simulation)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {ctCalculation.status === 'SAFE' ? 'Sinusoïde Pure 50 Hz' : 'Écrêtage par Saturation du Fer'}
                  </span>
                </div>

                <div className="w-full h-44 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
                  <svg viewBox="0 0 600 160" className="w-full h-full select-none">
                    <line x1={0} y1={80} x2={600} y2={80} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

                    {/* Linear reference wave (cyan dotted) */}
                    {(() => {
                      let d = 'M 0 80 ';
                      for (let x = 0; x <= 600; x += 5) {
                        const t = (x / 600) * 0.08; // 4 cycles of 20 ms
                        const primaryWave = Math.sin(2 * Math.PI * 50 * t);
                        const y = 80 - primaryWave * 55;
                        d += `L ${x} ${y.toFixed(1)} `;
                      }
                      return <path d={d} fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />;
                    })()}

                    {/* Actual secondary wave (with saturation flat-topping if saturating) */}
                    {(() => {
                      let d = 'M 0 80 ';
                      const isSat = ctCalculation.status !== 'SAFE';
                      const clipLimit = isSat ? (ctCalculation.status === 'SATURATING' ? 32 : 45) : 55;

                      for (let x = 0; x <= 600; x += 5) {
                        const t = (x / 600) * 0.08;
                        // include DC decaying offset
                        const dcOffset = Math.exp(-t / ctCalculation.tpSec) * 0.6;
                        let wave = Math.sin(2 * Math.PI * 50 * t) + dcOffset;
                        let amp = wave * 50;

                        // Non-linear iron saturation clipping
                        if (amp > clipLimit) amp = clipLimit + (amp - clipLimit) * 0.15;
                        if (amp < -clipLimit) amp = -clipLimit + (amp + clipLimit) * 0.15;

                        const y = 80 - amp;
                        d += `L ${x} ${y.toFixed(1)} `;
                      }
                      return (
                        <path
                          d={d}
                          fill="none"
                          stroke={ctCalculation.status === 'SAFE' ? '#10B981' : ctCalculation.status === 'BORDERLINE' ? '#F59E0B' : '#EF4444'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 3: DISTANCE PROTECTION ANSI 21/21N R-X PLANE */}
      {/* ===================================================================== */}
      {activePillar === 'DISTANCE_21' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-white uppercase">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Simulateur d\'Impédance de Ligne Haute Tension (ANSI 21/21N)' : 'HV Transmission Line Distance Protection Simulator (ANSI 21/21N)'}</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                {locale === 'fr'
                  ? 'Plan complexe R-X avec caractéristiques Quadrilatérale & Mho décentrée, Zone 1 (80% instantanée), Zone 2 (120% temporisée 300 ms), Zone 3 et compensation de terre k0.'
                  : 'Complex R-X impedance plane with Quadrilateral & Offset Mho shapes, Zone 1 (80% instantaneous), Zone 2 (120% 300 ms delayed), Zone 3 and k0 ground factor.'}
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              CEI 60255-121 / IEEE C37.113
            </div>
          </div>

          <NumericalDistanceProtectionRxSimulator locale={locale} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 4: DIFFERENTIAL PROTECTION ANSI 87T/87L DUAL-SLOPE */}
      {/* ===================================================================== */}
      {activePillar === 'DIFFERENTIAL_87' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-white uppercase">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>{locale === 'fr' ? 'Simulateur Différentielle Transformateur & Ligne (ANSI 87T / 87L)' : 'Transformer & Line Differential Protection Simulator (ANSI 87T / 87L)'}</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                {locale === 'fr'
                  ? 'Caractéristique à pourcentage double pente (Slope 1 & Slope 2), seuil instantané non retenu, blocage harmonique 2 d\'enclenchement (Inrush) et harmonique 5 de surfluxage.'
                  : 'Dual-slope percentage restraint characteristic, unrestrained instantaneous high-set, 2nd harmonic inrush restraint and 5th harmonic overexcitation blocking.'}
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              IEEE C37.91 / CEI 60255-13
            </div>
          </div>

          <DifferentialProtectionDualSlopeSaturationSimulator locale={locale} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 5: IEC 60909 SHORT-CIRCUIT & EARTHING SCHEME SOLVER */}
      {/* ===================================================================== */}
      {activePillar === 'IEC60909_FAULTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* NODE & EARTHING REGIME SELECTION (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0D1117] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Nœud Réseau & Régime de Neutre' : 'Grid Node & Neutral Earthing'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">CEI 60909</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-neutral-400 block">{locale === 'fr' ? 'Nœud Réseau Analysé :' : 'Target Network Node:'}</label>
                    <select
                      value={iecNodeId}
                      onChange={(e) => setIecNodeId(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5"
                    >
                      <option value="node-bus-30-oyomabang">Jeu de Barres HTA 30 kV Oyomabang (Poste Source Yaoundé)</option>
                      <option value="node-sub-songloulou">Poste Évacuation 225 kV Centrale Hydro Songloulou</option>
                      <option value="node-sub-oyomabang">Jeu de Barres 225 kV Poste Oyomabang</option>
                      <option value="node-feeder-30-ind">Départ Câble 30 kV Zone Industrielle Bassa (Douala)</option>
                      <option value="node-gen-g1">Bornes Alternateur G1 10.5 kV Songloulou</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 block">{locale === 'fr' ? 'Schéma de Liaison à la Terre (SLT) :' : 'System Earthing Regime:'}</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {(['Solid', 'NGR', 'Isolated'] as EarthingRegime[]).map((regime) => (
                        <button
                          key={regime}
                          type="button"
                          onClick={() => setIecEarthingRegime(regime)}
                          className={`px-3 py-2 rounded-xl text-center font-bold text-xs transition-all ${
                            iecEarthingRegime === regime
                              ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400'
                              : 'bg-slate-800 text-neutral-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {regime === 'Solid' ? (locale === 'fr' ? 'Neutre Direct' : 'Solidly Grounded') : regime === 'NGR' ? (locale === 'fr' ? 'Résistance (NGR)' : 'NGR Resistor') : (locale === 'fr' ? 'Neutre Isolé' : 'Isolated Neutral')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {iecEarthingRegime === 'NGR' && (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300 font-bold">{locale === 'fr' ? 'Résistance de Neutre Rn :' : 'NGR Resistance Rn:'}</span>
                        <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/20">{iecNgrResistance} Ω</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={1000}
                        step={10}
                        value={iecNgrResistance}
                        onChange={(e) => setIecNgrResistance(Number(e.target.value))}
                        className="w-full accent-amber-400 h-1 bg-slate-800"
                      />
                      <div className="text-[10px] text-neutral-400">
                        {locale === 'fr'
                          ? `Limite le courant d'erreur phase-terre Ik1'' à ${(
                              (iecFaultResult.voltageLevelKv * 1000) /
                              (Math.sqrt(3) * iecNgrResistance)
                            ).toFixed(1)} A.`
                          : `Caps single phase-to-ground fault current Ik1'' to ${(
                              (iecFaultResult.voltageLevelKv * 1000) /
                              (Math.sqrt(3) * iecNgrResistance)
                            ).toFixed(1)} A.`}
                      </div>
                    </div>
                  )}

                  {/* IMPEDANCE PROFILE */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-neutral-400 font-bold block uppercase">
                      {locale === 'fr' ? 'Composantes Symétriques Équivalentes :' : 'Equivalent Symmetrical Components:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>Z1 (Directe) : {iecFaultResult.zPositiveOhms.z.toFixed(2)} Ω (R1={iecFaultResult.zPositiveOhms.r.toFixed(2)}, X1={iecFaultResult.zPositiveOhms.x.toFixed(2)})</div>
                      <div>Z0 (Homopolaire) : {iecFaultResult.zZeroOhms.z.toFixed(2)} Ω</div>
                      <div>Ratio R/X : {iecFaultResult.rxRatio.toFixed(2)}</div>
                      <div>Facteur Crête κ : {iecFaultResult.kappaFactor.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS DASHBOARD (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#0D1117] border border-red-500/40 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Court-Circuit Triphasé Ik\'\'' : '3-Phase Symmetrical Ik\'\''}</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-1">{iecFaultResult.ik3PhaseKa.toFixed(2)} kA</div>
                  <div className="text-[10px] text-neutral-500 font-mono">I_sym = c·Un / (√3·Z1)</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D1117] border border-amber-500/40 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Courant de Crête Dynamique ip' : 'Dynamic Peak Current ip'}</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">{iecFaultResult.ipPeakKa.toFixed(2)} kA</div>
                  <div className="text-[10px] text-neutral-500 font-mono">ip = κ·√2·Ik''</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D1117] border border-sky-500/40 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Puissance de Court-Circuit Sk\'\'' : 'Short-Circuit Power Sk\'\''}</div>
                  <div className="text-xl font-bold font-mono text-sky-400 mt-1">{iecFaultResult.skMva.toFixed(0)} MVA</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Sk'' = √3·Un·Ik''</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D1117] border border-purple-500/40 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Défaut Biphasé Isolé Ik2\'\'' : 'Phase-to-Phase Fault Ik2\'\''}</div>
                  <div className="text-xl font-bold font-mono text-purple-400 mt-1">{iecFaultResult.ik2PhaseKa.toFixed(2)} kA</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Ik2'' = (√3/2)·Ik''</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D1117] border border-emerald-500/40 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Défaut Phase-Terre Ik1\'\'' : 'Single Phase-to-Ground Ik1\'\''}</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{iecFaultResult.ik1EarthKa.toFixed(2)} kA</div>
                  <div className="text-[10px] text-neutral-500 font-mono">{iecEarthingRegime === 'NGR' ? 'Limité par Rn' : '3·c·Un / (√3·|2Z1+Z0|)'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D1117] border border-slate-700 shadow-xl">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Surtension Phases Saines Ke' : 'Healthy Phase Overvoltage Ke'}</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">{iecFaultResult.healthyPhaseOvervoltageFactor.toFixed(2)} × V_ph</div>
                  <div className="text-[10px] text-neutral-500 font-mono">{iecEarthingRegime === 'Isolated' ? 'Surtension √3 = 1.73' : 'Quasi unitaire'}</div>
                </div>
              </div>

              {/* SAFETY & PROTECTION IMPLICATION NOTE */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-white uppercase">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Prescriptions de Protection Associées' : 'Governing Protection Schemes'}</span>
                </div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {locale === 'fr' ? iecFaultResult.safetyImplication.fr : iecFaultResult.safetyImplication.en}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {iecFaultResult.governingProtections.map((prot) => (
                    <span key={prot} className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                      {prot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 6: IEC 61850 DIGITAL SUBSTATION & PROCESS BUS */}
      {/* ===================================================================== */}
      {activePillar === 'IEC61850_DIGITAL' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-white uppercase">
                <Network className="w-4 h-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Architecture Sous-Station Numérique CEI 61850 (Process Bus & GOOSE)' : 'IEC 61850 Digital Substation Architecture (Process Bus & GOOSE Engine)'}</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                {locale === 'fr'
                  ? 'Échange sub-milliseconde de messages GOOSE (déclenchement disjoncteur), synchronisation PTP IEEE 1588v2, redondance PRP/HSR et bus de processus Sampled Values (CEI 61869-9).'
                  : 'Sub-millisecond GOOSE trip messaging, IEEE 1588v2 PTP time synchronization, PRP/HSR zero-packet-loss dual LAN and Sampled Values Process Bus (IEC 61869-9).'}
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              CEI 61850-8-1 / 9-2LE
            </div>
          </div>

          <Iec61850GoosePtpClockSimulator locale={locale} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 7: REAL CASES & FORENSIC INCIDENT ANALYSIS */}
      {/* ===================================================================== */}
      {activePillar === 'FORENSIC_CASES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CASE 1: SONATREL 225 kV TRANSMISSION PROTECTION PHILOSOPHY */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  {locale === 'fr' ? 'CAS RÉSEAU CAMEROUN #1' : 'CAMEROON GRID CASE #1'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">SONATREL 225 kV</span>
              </div>
              <h4 className="font-mono font-bold text-base text-white">
                {locale === 'fr'
                  ? 'Plan de Protection Double Indépendante des Lignes 225 kV (RIS)'
                  : 'Double Independent Protection Scheme for 225 kV Lines (RIS)'}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'Sur les axes 225 kV Mangombé - Oyomabang (120 km) et Bekoko - Logbaba, chaque travée départ intègre une redondance physique intégrale : Protection 1 (Distance numérique ANSI 21 avec téléaction PUTT via fibres optiques OPGW) et Protection 2 (Différentielle de ligne numérique ANSI 87L avec voie de télécommunication dédiée). L\'élimination des défauts proches s\'effectue en moins de 60 ms disjoncteur compris.'
                  : 'Across 225 kV corridors Mangombé - Oyomabang (120 km) and Bekoko - Logbaba, every transmission bay deploys complete hardware redundancy: Main 1 (Numerical Distance ANSI 21 with PUTT permissive scheme over OPGW fiber) and Main 2 (87L current differential relaying). Bolted in-zone faults clear in under 60 ms total breaker clearing time.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">ANSI 21 (Distance)</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">ANSI 87L (Ligne Diff)</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">OPGW 48 Fibres</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">ANSI 50BF (Refus Disjoncteur)</span>
              </div>
            </div>

            {/* CASE 2: ENEO 30 kV NGR GROUNDING & DIRECTIONAL RELAYING */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  {locale === 'fr' ? 'CAS RÉSEAU CAMEROUN #2' : 'CAMEROON GRID CASE #2'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Eneo HTA 30 kV</span>
              </div>
              <h4 className="font-mono font-bold text-base text-white">
                {locale === 'fr'
                  ? 'Mise à la Terre HTA par Résistance de Neutre 40 A & Relais Directionnel 67N'
                  : 'MV Neutral Grounding Resistor 40 A & Directional Earth Fault 67N'}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'Pour prévenir les montées en potentiel dangereuses en milieu urbain dense à Douala et Yaoundé, les neutres 30 kV des transformateurs sources 225/30 kV sont reliés à la terre via une résistance NGR calibrée à 433 Ω (limitant le courant de défaut phase-terre Ik1 à 40 A). Les départs sont équipés de relais homopolaires directionnels ANSI 67N mesurant la tension résiduelle V0 par tores sommateurs ferrites.'
                  : 'To prevent hazardous touch/step voltages across dense urban corridors in Douala and Yaoundé, the 30 kV neutrals of 225/30 kV substations are grounded via a 433 Ω NGR resistor capping ground fault current Ik1 to 40 A. Feeders deploy directional earth fault relays (ANSI 67N) measuring zero-sequence residual voltage V0 via toroidal core-balance current transformers.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">SLT : NGR 433 Ω</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">If_max = 40 A</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">ANSI 67N (Directionnel)</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-neutral-300">Tore Ferrite Homopolaire</span>
              </div>
            </div>

            {/* FORENSIC FAILURE MODE 1: SYMPATHETIC TRIP & INRUSH HARMONICS */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-red-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">
                  {locale === 'fr' ? 'ANALYSE D\'INCIDENT FORENSIC #1' : 'FORENSIC INCIDENT ANALYSIS #1'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">Déclenchement Intempestif</span>
              </div>
              <h4 className="font-mono font-bold text-base text-white">
                {locale === 'fr'
                  ? 'Déclenchement Sympathique 87T lors de l\'Enclenchement d\'un Transformateur Parallèle'
                  : '87T Sympathetic Tripping during Parallel Transformer Energization'}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'Lors de la mise sous tension à vide du transformateur T2 à Oyomabang, le transformateur T1 déjà en service a déclenché sur protection 87T. Cause racine : le courant d\'appel asymétrique de T2 a traversé l\'impédance de source commune, créant une chute de tension saturant légèrement le noyau de T1. Solution normative : activation du blocage croisé inter-phases (Cross-Blocking) et abaissement du seuil de détection harmonique 2 à 15%.'
                  : 'During no-load energization of transformer T2 at Oyomabang substation, pre-existing transformer T1 unexpectedly tripped on 87T differential. Root cause: heavy inrush current of T2 circulated through shared source impedance, inducing voltage sags that lightly saturated T1. Engineering resolution: enabling cross-blocking and setting 2nd harmonic inrush restraint threshold to 15%.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Résolution : Réglage Cross-Blocking 2nd Harmonic Restraint 15%' : 'Mitigation: Cross-Blocking 2nd Harmonic Restraint set to 15%'}</span>
              </div>
            </div>

            {/* FORENSIC FAILURE MODE 2: CT THROUGH-FAULT SATURATION */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-red-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">
                  {locale === 'fr' ? 'ANALYSE D\'INCIDENT FORENSIC #2' : 'FORENSIC INCIDENT ANALYSIS #2'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">Erreur Discrimination</span>
              </div>
              <h4 className="font-mono font-bold text-base text-white">
                {locale === 'fr'
                  ? 'Déclenchement Différentiel 87B sur Court-Circuit Externe Aval par Saturation TC'
                  : '87B Busbar Differential Trip on External Through-Fault due to CT Saturation'}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'Un court-circuit franc triphasé sur un départ ligne 225 kV a provoqué le déclenchement intempestif de la protection différentielle de barres 87B. Cause racine : le TC du départ en défaut a saturé sous la composante apériodique (X/R = 24), générant un faux courant différentiel non retenu. Solution normative : mise en place de relais différentiels numériques à algorithme de détection de saturation (saturation detector) figeant la zone de maintien pendant le premier cycle.'
                  : 'A bolted three-phase fault on a 225 kV feeder triggered an accidental tripping of the 87B busbar differential protection. Root cause: the fault feeder CT saturated due to long DC offset decay (X/R = 24), generating a spurious differential current. Engineering resolution: deploying numerical relays with CT saturation detection algorithms locking the restraint during the initial cycle.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Résolution : Détection Numérique de Saturation TC & Double Pente Slope 2' : 'Mitigation: Digital CT Saturation Detection & Dual-Slope 2 Restraint'}</span>
              </div>
            </div>
          </div>

          {/* QUICK ANSI CODES REFERENCE TABLE */}
          <div className="pt-2">
            <DomainAnsiTable locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
};
