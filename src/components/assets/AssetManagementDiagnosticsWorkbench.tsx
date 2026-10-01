// src/components/assets/AssetManagementDiagnosticsWorkbench.tsx
// EPEDE Engineering Workbench — Domain D15: Asset Management, Transformer Diagnostics & Smart Grid Digitalization
// (Gestion d'Actifs HTB/HTA, Diagnostic Transformateur DGA CEI 60599 / Triangle de Duval,
// Health Index Composite ISO 55000, Décharges Partielles UHF/Acoustiques, SFRA & Smart Metering AMI / MDM)
// Grounded in IEC 60599, IEC 60076-18 (SFRA), IEC 60270 (Partial Discharges), ISO 55000, IEC 62056 (DLMS/COSEM)
// and authentic Cameroon power assets (Songloulou 60 MVA GSU transformers, Mangombé 225/90 kV autotransformers, Eneo prepaid AMI rollout).

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  RotateCcw,
  Eye,
  Info,
  Flame,
  FileText,
  TrendingUp,
  Cpu,
  MapPin,
  ExternalLink,
  Layers,
  Gauge,
  Zap,
  Radio,
  BarChart3,
  Search,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { FieldCausalDiagnosisWorkbench } from '../diagnostics/FieldCausalDiagnosisWorkbench';

interface AssetManagementDiagnosticsWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarId =
  | 'DUVAL_TRIANGLE_DGA'
  | 'HEALTH_INDEX_ISO55000'
  | 'PARTIAL_DISCHARGE_PD'
  | 'SFRA_WINDING_ANALYSIS'
  | 'AMI_SMART_METERING'
  | 'FLEET_RISK_MATRIX'
  | 'CAMEROON_ASSET_CASES'
  | 'GUIDED_FIELD_DIAGNOSIS';

export const AssetManagementDiagnosticsWorkbench: React.FC<AssetManagementDiagnosticsWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarId>('DUVAL_TRIANGLE_DGA');

  // ==========================================
  // PILLAR 1: DUVAL'S TRIANGLE 1 (IEC 60599) DGA DIAGNOSTIC SOLVER
  // ==========================================
  // Gas concentrations in ppm (parts per million) in transformer mineral oil
  const [gasCH4, setGasCH4] = useState<number>(85);   // Methane (ppm)
  const [gasC2H4, setGasC2H4] = useState<number>(145); // Ethylene (ppm)
  const [gasC2H2, setGasC2H2] = useState<number>(18);  // Acetylene (ppm)
  const [gasH2, setGasH2] = useState<number>(110);    // Hydrogen (ppm)
  const [gasCO, setGasCO] = useState<number>(320);    // Carbon monoxide (ppm)
  const [gasCO2, setGasCO2] = useState<number>(2900); // Carbon dioxide (ppm)
  const [gasC2H6, setGasC2H6] = useState<number>(45);  // Ethane (ppm)

  // Presets for Duval Triangle DGA
  const dgaPresets = [
    {
      label_fr: 'Cas 1: Décharge de basse énergie (PD / Couronne)',
      label_en: 'Case 1: Partial Discharge (PD / Corona)',
      ch4: 120,
      c2h4: 8,
      c2h2: 2,
      h2: 250,
      co: 180,
      co2: 1200,
      c2h6: 15
    },
    {
      label_fr: 'Cas 2: Arc de forte énergie D2 (Rupture diélectrique)',
      label_en: 'Case 2: High Energy Arcing D2 (Flashover)',
      ch4: 95,
      c2h4: 160,
      c2h2: 180,
      h2: 450,
      co: 410,
      co2: 2300,
      c2h6: 35
    },
    {
      label_fr: 'Cas 3: Défaut thermique T3 > 700°C (Surchauffe enroulement)',
      label_en: 'Case 3: Thermal Fault T3 > 700°C (Winding hotspot)',
      ch4: 180,
      c2h4: 520,
      c2h2: 8,
      h2: 85,
      co: 550,
      co2: 4500,
      c2h6: 120
    },
    {
      label_fr: 'Cas 4: Sain / Dérive modérée (Songloulou GSU)',
      label_en: 'Case 4: Normal Aging (Songloulou 60 MVA GSU)',
      ch4: 45,
      c2h4: 35,
      c2h2: 1,
      h2: 30,
      co: 280,
      co2: 1900,
      c2h6: 22
    }
  ];

  // Duval Triangle 1 calculations:
  // %CH4 = 100 * CH4 / (CH4 + C2H4 + C2H2)
  // %C2H4 = 100 * C2H4 / (CH4 + C2H4 + C2H2)
  // %C2H2 = 100 * C2H2 / (CH4 + C2H4 + C2H2)
  const duvalStats = useMemo(() => {
    const sumTernary = gasCH4 + gasC2H4 + gasC2H2;
    const safeSum = sumTernary > 0 ? sumTernary : 1;
    const pctCH4 = (gasCH4 / safeSum) * 100;
    const pctC2H4 = (gasC2H4 / safeSum) * 100;
    const pctC2H2 = (gasC2H2 / safeSum) * 100;

    // Determine Duval Zone:
    // PD: Partial discharge (%CH4 >= 98)
    // T1: Thermal fault < 300°C (%CH4 > 64 and %C2H4 < 20 and %C2H2 < 4)
    // T2: Thermal fault 300°C - 700°C (%C2H4 >= 20 and %C2H4 < 50 and %C2H2 < 4 and %CH4 > 46)
    // T3: Thermal fault > 700°C (%C2H4 >= 50 and %C2H2 < 15)
    // D1: Discharge of low energy (Sparking) (%C2H2 >= 13 and %C2H4 < 23) or (%C2H2 >= 4 and %C2H2 <= 13 and %C2H4 < 40)
    // D2: Discharge of high energy (Arcing) (%C2H2 >= 29 and %C2H4 >= 23) or other high C2H2 regions
    // DT: Mixed thermal and electrical fault
    let zoneCode: 'PD' | 'T1' | 'T2' | 'T3' | 'D1' | 'D2' | 'DT' = 'DT';
    let zoneTitleFr = '';
    let zoneTitleEn = '';
    let zoneDescFr = '';
    let zoneDescEn = '';
    let severityLevel: 'normal' | 'watch' | 'critical' = 'watch';

    if (pctCH4 >= 98) {
      zoneCode = 'PD';
      zoneTitleFr = 'PD — Décharges Partielles (Couronne / Cavités gazeuses)';
      zoneTitleEn = 'PD — Partial Discharges (Corona / Gas cavities)';
      zoneDescFr = 'Décharges électriques froides de faible énergie dans des bulles de gaz ou des cavités de l\'isolation solide papier-carton.';
      zoneDescEn = 'Low-energy cold electrical discharges occurring in gas bubbles or solid cellulose paper cavities.';
      severityLevel = 'watch';
    } else if (pctC2H2 < 4 && pctC2H4 < 20 && pctCH4 >= 64) {
      zoneCode = 'T1';
      zoneTitleFr = 'T1 — Défaut Thermique < 300 °C (Échauffement modéré)';
      zoneTitleEn = 'T1 — Thermal Fault < 300 °C (Moderate overheating)';
      zoneDescFr = 'Échauffement localisé du cuivre ou du circuit magnétique < 300°C. Dégradation initiale de la cellulose.';
      zoneDescEn = 'Localized copper winding or magnetic core hotspot < 300°C. Initial cellulose insulation deterioration.';
      severityLevel = 'watch';
    } else if (pctC2H2 < 4 && pctC2H4 >= 20 && pctC2H4 < 50) {
      zoneCode = 'T2';
      zoneTitleFr = 'T2 — Défaut Thermique 300 °C à 700 °C (Point chaud marqué)';
      zoneTitleEn = 'T2 — Thermal Fault 300 °C to 700 °C (Pronounced hotspot)';
      zoneDescFr = 'Carbonisation du papier isolant, point chaud sur connexions internes ou courants de circulation dans les armatures.';
      zoneDescEn = 'Carbonization of paper insulation, connection hotspot, or circulating stray currents in core clamps.';
      severityLevel = 'critical';
    } else if (pctC2H2 < 15 && pctC2H4 >= 50) {
      zoneCode = 'T3';
      zoneTitleFr = 'T3 — Défaut Thermique > 700 °C (Surchauffe sévère)';
      zoneTitleEn = 'T3 — Thermal Fault > 700 °C (Severe thermal runaway)';
      zoneDescFr = 'Température extrême détruisant les isolants solides, carbonisation profonde de l\'huile minérale, fusion locale du métal.';
      zoneDescEn = 'Extreme hotspot destroying solid insulation, severe mineral oil cracking, and localized copper fusing.';
      severityLevel = 'critical';
    } else if (pctC2H2 >= 13 && pctC2H4 < 23) {
      zoneCode = 'D1';
      zoneTitleFr = 'D1 — Décharges de Basse Énergie (Étincelage / Flashover)';
      zoneTitleEn = 'D1 — Low Energy Discharges (Sparking / Dielectric puncture)';
      zoneDescFr = 'Étincelles entre spires, décharges rampantes le long des barrières de carton isolant sous contrainte diélectrique.';
      zoneDescEn = 'Inter-turn sparking or tracking across pressboard barriers under high dielectric electrical stress.';
      severityLevel = 'critical';
    } else if (pctC2H2 >= 29 && pctC2H4 >= 23) {
      zoneCode = 'D2';
      zoneTitleFr = 'D2 — Décharges de Forte Énergie (Arc Électrique Franc)';
      zoneTitleEn = 'D2 — High Energy Discharges (Power Arcing)';
      zoneDescFr = 'Arc électrique de puissance franc entre enroulements ou traversée-cuve, formation abondante d\'acétylène (C2H2), risque d\'explosion cuve !';
      zoneDescEn = 'Violent power arc between winding turns or bushing-to-tank, massive acetylene (C2H2) production, critical tank explosion risk!';
      severityLevel = 'critical';
    } else {
      zoneCode = 'DT';
      zoneTitleFr = 'DT — Défauts Mixtes Thermiques & Électriques';
      zoneTitleEn = 'DT — Mixed Thermal and Electrical Faults';
      zoneDescFr = 'Combinaison simultanée d\'un point chaud et de micro-arcs ou d\'étincelage sur les plots de régleur en charge (OLTC).';
      zoneDescEn = 'Simultaneous combination of high thermal heating and localized sparking or On-Load Tap Changer (OLTC) wear.';
      severityLevel = 'critical';
    }

    // Rogers Ratios (IEC 60599):
    // R1 = C2H2 / C2H4
    // R2 = CH4 / H2
    // R5 = C2H4 / C2H6
    const r1 = gasC2H4 > 0 ? gasC2H2 / gasC2H4 : 0;
    const r2 = gasH2 > 0 ? gasCH4 / gasH2 : 0;
    const r5 = gasC2H6 > 0 ? gasC2H4 / gasC2H6 : 0;

    // CO2 / CO ratio (Paper insulation degradation):
    // Normal: 3 < CO2/CO < 10
    // Excessive paper aging / thermal fault: CO2/CO < 3
    const co2_co_ratio = gasCO > 0 ? gasCO2 / gasCO : 0;

    // Total Combustible Gases (TDCG):
    const tdcg = gasH2 + gasCH4 + gasC2H4 + gasC2H2 + gasCO + gasC2H6;

    // TDCG Condition per IEEE C57.104:
    // Cond 1: <= 720 ppm (Normal)
    // Cond 2: 721 - 1920 ppm (Caution)
    // Cond 3: 1921 - 4630 ppm (High risk)
    // Cond 4: > 4630 ppm (Excessive)
    let tdcgCondition = 1;
    if (tdcg > 4630) tdcgCondition = 4;
    else if (tdcg > 1920) tdcgCondition = 3;
    else if (tdcg > 720) tdcgCondition = 2;

    // Equilateral triangle coordinate conversion for visual SVG plotting:
    // Top vertex (C2H2): (200, 40)
    // Bottom-left vertex (CH4): (50, 300)
    // Bottom-right vertex (C2H4): (350, 300)
    // Point coordinate: P = (pctCH4 * BL + pctC2H4 * BR + pctC2H2 * TOP) / 100
    const xCoord = (pctCH4 * 50 + pctC2H4 * 350 + pctC2H2 * 200) / 100;
    const yCoord = (pctCH4 * 300 + pctC2H4 * 300 + pctC2H2 * 40) / 100;

    return {
      sumTernary,
      pctCH4,
      pctC2H4,
      pctC2H2,
      zoneCode,
      zoneTitleFr,
      zoneTitleEn,
      zoneDescFr,
      zoneDescEn,
      severityLevel,
      r1,
      r2,
      r5,
      co2_co_ratio,
      tdcg,
      tdcgCondition,
      xCoord,
      yCoord
    };
  }, [gasCH4, gasC2H4, gasC2H2, gasH2, gasCO, gasCO2, gasC2H6]);

  // ==========================================
  // PILLAR 2: COMPOSITE ASSET HEALTH INDEX (HI) ISO 55000 SOLVER
  // ==========================================
  // Parameters for calculating Power Transformer Health Index (0 - 100%)
  const [breakdownVoltage, setBreakdownVoltage] = useState<number>(58); // kV / 2.5 mm (IEC 60156)
  const [moistureInOil, setMoistureInOil] = useState<number>(16);       // ppm (Karl Fischer IEC 60814)
  const [acidityMgKOH, setAcidityMgKOH] = useState<number>(0.08);       // mg KOH/g oil (IEC 62021)
  const [interfacialTension, setInterfacialTension] = useState<number>(34); // mN/m (ASTM D971)
  const [furan2FAL, setFuran2FAL] = useState<number>(0.65);             // mg/kg (2-Furfuraldehyde IEC 61198)
  const [dissipationFactorTanDelta, setDissipationFactorTanDelta] = useState<number>(0.006); // at 90°C
  const [assetAgeYears, setAssetAgeYears] = useState<number>(24);       // years in service
  const [ratedMva, setRatedMva] = useState<number>(60);                 // MVA

  const healthIndexStats = useMemo(() => {
    // 1. Dielectric Oil Sub-Score (0-100):
    // Breakdown voltage: > 60kV -> 100, 50-60 -> 80, 40-50 -> 60, 30-40 -> 30, < 30 -> 10
    let sVbd = 100;
    if (breakdownVoltage < 30) sVbd = 15;
    else if (breakdownVoltage < 40) sVbd = 40;
    else if (breakdownVoltage < 50) sVbd = 65;
    else if (breakdownVoltage < 60) sVbd = 85;

    // Moisture in oil: < 15 ppm -> 100, 15-25 ppm -> 75, 25-35 ppm -> 50, > 35 ppm -> 20
    let sMoist = 100;
    if (moistureInOil > 35) sMoist = 20;
    else if (moistureInOil > 25) sMoist = 50;
    else if (moistureInOil > 15) sMoist = 75;

    // Acidity: < 0.05 -> 100, 0.05-0.10 -> 80, 0.10-0.20 -> 50, > 0.20 -> 20
    let sAcid = 100;
    if (acidityMgKOH > 0.20) sAcid = 20;
    else if (acidityMgKOH > 0.10) sAcid = 50;
    else if (acidityMgKOH > 0.05) sAcid = 80;

    // Interfacial tension (IFT): > 35 -> 100, 28-35 -> 80, 20-28 -> 50, < 20 -> 20
    let sIft = 100;
    if (interfacialTension < 20) sIft = 20;
    else if (interfacialTension < 28) sIft = 50;
    else if (interfacialTension < 35) sIft = 80;

    const oilScore = (sVbd * 0.35 + sMoist * 0.25 + sAcid * 0.20 + sIft * 0.20);

    // 2. Paper Insulation Degree of Polymerization (DP) estimation from 2-FAL (Chendong equation):
    // DP = (log10(2FAL) - 1.51) / (-0.0035)  or simplified empirical formula
    // New paper: DP ~ 1000 - 1200
    // Moderate aging: DP ~ 500 - 700
    // Critical degradation: DP ~ 250 - 400
    // End-of-life: DP < 200 (Paper is brittle, mechanical collapse under fault stress)
    const estimatedDP = Math.max(150, Math.min(1100, Math.round(710 - 280 * Math.log(Math.max(0.01, furan2FAL)))));
    let sPaper = 100;
    if (estimatedDP < 250) sPaper = 15;
    else if (estimatedDP < 400) sPaper = 40;
    else if (estimatedDP < 600) sPaper = 70;
    else if (estimatedDP < 800) sPaper = 85;

    // 3. DGA Gas Score based on TDCG condition and Duval zone:
    let sDga = 90;
    if (duvalStats.zoneCode === 'D2' || duvalStats.zoneCode === 'T3') sDga = 20;
    else if (duvalStats.zoneCode === 'D1' || duvalStats.zoneCode === 'T2') sDga = 45;
    else if (duvalStats.zoneCode === 'PD' || duvalStats.zoneCode === 'T1') sDga = 65;
    else if (duvalStats.tdcgCondition >= 3) sDga = 55;

    // 4. Overall Health Index (HI) weighted aggregation:
    // HI = 0.35 * DGA + 0.30 * Paper + 0.25 * Oil + 0.10 * AgeFactor
    const ageFactor = Math.max(20, 100 - assetAgeYears * 2.5);
    const compositeHI = Math.round(sDga * 0.35 + sPaper * 0.30 + oilScore * 0.25 + ageFactor * 0.10);

    // Classification per ISO 55000 / CIGRE:
    // 85 - 100: Excellent (Very low probability of failure)
    // 70 - 84: Good (Normal aging, routine maintenance)
    // 50 - 69: Fair (Requires close monitoring, planned refurbishment)
    // 30 - 49: Poor (High risk, immediate investigation and testing)
    // < 30: Very Poor (Critical failure imminent, consider derating or replacement)
    let hiGrade = 'Good';
    let hiColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
    let pof = 'Low (< 1.5% / yr)';
    let recommendationFr = 'Maintien de la périodicité standard de maintenance et surveillance DGA semestrielle.';
    let recommendationEn = 'Maintain standard maintenance schedule with bi-annual DGA sampling.';

    if (compositeHI < 30) {
      hiGrade = 'Very Poor / Critical';
      hiColor = 'text-red-400 bg-red-950/40 border-red-800';
      pof = 'Extreme (> 25% / yr)';
      recommendationFr = 'DANGER D\'AVARIE IMMINENT : Déclassement de charge immédiat, analyse SFRA d\'urgence et préparation au remplacement d\'actif.';
      recommendationEn = 'IMMINENT FAILURE DANGER: Immediate load derating, emergency SFRA sweep, and activate replacement reserve asset.';
    } else if (compositeHI < 50) {
      hiGrade = 'Poor';
      hiColor = 'text-orange-400 bg-orange-950/40 border-orange-800';
      pof = 'High (8 - 15% / yr)';
      recommendationFr = 'Traitement d\'huile sous vide requis, surveillance DGA mensuelle et inspection thermographique des traversées.';
      recommendationEn = 'High-vacuum oil filtration required, monthly online DGA logging, and bushing thermal imaging.';
    } else if (compositeHI < 70) {
      hiGrade = 'Fair';
      hiColor = 'text-amber-400 bg-amber-950/40 border-amber-800';
      pof = 'Moderate (3 - 7% / yr)';
      recommendationFr = 'Planifier un dégazage d\'huile et régénération, surveillance trimestrielle des furanes.';
      recommendationEn = 'Schedule oil degassing and reclamation, quarterly furan trending.';
    } else if (compositeHI >= 85) {
      hiGrade = 'Excellent';
      pof = 'Very Low (< 0.5% / yr)';
    }

    return {
      oilScore: Math.round(oilScore),
      estimatedDP,
      sPaper,
      sDga,
      compositeHI,
      hiGrade,
      hiColor,
      pof,
      recommendationFr,
      recommendationEn
    };
  }, [breakdownVoltage, moistureInOil, acidityMgKOH, interfacialTension, furan2FAL, assetAgeYears, duvalStats]);

  // ==========================================
  // PILLAR 3: PARTIAL DISCHARGE (PD) & ACOUSTIC UHF MONITORING
  // ==========================================
  const [pdAmplitudePC, setPdAmplitudePC] = useState<number>(420); // picoCoulombs (pC)
  const [pdPulseRatePerSec, setPdPulseRatePerSec] = useState<number>(180); // pulses/second
  const [pdSensorType, setPdSensorType] = useState<'UHF' | 'HFCT' | 'Acoustic'>('UHF');
  const [pdPhaseResolvedPattern, setPdPhaseResolvedPattern] = useState<'Internal Cavity' | 'Corona Surface' | 'Floating Metal' | 'Tracking'>('Internal Cavity');

  const pdDiagnostic = useMemo(() => {
    // Severity assessment:
    // < 100 pC: Normal baseline for oil-filled equipment (IEC 60270 acceptance often < 100-300 pC)
    // 100 - 500 pC: Moderate PD, requires trending
    // 500 - 2000 pC: Severe PD, localized active degradation
    // > 2000 pC: Critical PD, imminent dielectric puncture
    let riskLevel = 'Low';
    let riskBadgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-700';
    if (pdAmplitudePC > 2000) {
      riskLevel = 'CRITICAL';
      riskBadgeColor = 'text-red-400 bg-red-950/40 border-red-700';
    } else if (pdAmplitudePC > 500) {
      riskLevel = 'ELEVATED';
      riskBadgeColor = 'text-amber-400 bg-amber-950/40 border-amber-700';
    }

    const energyPerPulseUJ = (0.5 * pdAmplitudePC * 1e-12 * 30000 * 1e6); // Micro-joules approximation
    return {
      riskLevel,
      riskBadgeColor,
      energyPerPulseUJ: energyPerPulseUJ.toFixed(2)
    };
  }, [pdAmplitudePC]);

  // ==========================================
  // PILLAR 4: SWEEP FREQUENCY RESPONSE ANALYSIS (SFRA IEC 60076-18)
  // ==========================================
  const [selectedSubBand, setSelectedSubBand] = useState<'LOW_CORE' | 'MID_WINDING' | 'HIGH_LEADS'>('MID_WINDING');
  const [sfraAnomalyPresent, setSfraAnomalyPresent] = useState<boolean>(true);

  // ==========================================
  // PILLAR 5: SMART METERING AMI & PREPAYMENT MDM PLATFORM
  // ==========================================
  // Simulation of utility prepaid meters (STS / DLMS COSEM)
  const [totalMetersInstalled, setTotalMetersInstalled] = useState<number>(350000);
  const [tokenType, setTokenType] = useState<'STS_20_DIGIT' | 'DLMS_IP_AMI'>('STS_20_DIGIT');
  const [dailyVendingVolumeXaf, setDailyVendingVolumeXaf] = useState<number>(185000000); // FCFA
  const [nonTechnicalLossesPct, setNonTechnicalLossesPct] = useState<number>(18.5); // % theft & tampering

  const amiStats = useMemo(() => {
    // Loss reduction simulation:
    // With smart AMI tamper detection, non-technical losses can drop from 18.5% down to 6.5%
    const currentLostRevenueDailyXaf = dailyVendingVolumeXaf * (nonTechnicalLossesPct / 100);
    const potentialSavingsDailyXaf = dailyVendingVolumeXaf * ((nonTechnicalLossesPct - 6.5) / 100);
    const annualSavingsMillionXaf = (potentialSavingsDailyXaf * 365) / 1e6;

    return {
      currentLostRevenueDailyXaf: Math.round(currentLostRevenueDailyXaf),
      potentialSavingsDailyXaf: Math.round(potentialSavingsDailyXaf),
      annualSavingsMillionXaf: Math.round(annualSavingsMillionXaf)
    };
  }, [dailyVendingVolumeXaf, nonTechnicalLossesPct]);

  return (
    <div className="space-y-6">
      {/* Workbench Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-slate-950 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DOMAIN D15 · ASSET MANAGEMENT & SMART GRIDS
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO 55000 · CEI 60599 · CEI 60076-18 · STS/DLMS
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {locale === 'fr'
                ? 'Station Expert Gestion d\'Actifs, Diagnostic Transformateurs & Smart Grid'
                : 'Asset Management, Transformer Diagnostics & Smart Grid Workbench'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              {locale === 'fr'
                ? 'Solveur interactif du Triangle de Duval 1 (CEI 60599), calcul de l\'Indice de Santé (Health Index ISO 55000), diagnostic des décharges partielles UHF, analyse mécanique SFRA et architecture AMI / comptage communicant.'
                : 'Interactive Duval Triangle 1 (IEC 60599) solver, ISO 55000 Composite Health Index, UHF Partial Discharge diagnostics, SFRA mechanical winding integrity, and AMI/MDM smart metering platform.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGasCH4(85);
                setGasC2H4(145);
                setGasC2H2(18);
                setGasH2(110);
                setGasCO(320);
                setGasCO2(2900);
                setGasC2H6(45);
                setBreakdownVoltage(58);
                setMoistureInOil(16);
                setAcidityMgKOH(0.08);
                setInterfacialTension(34);
                setFuran2FAL(0.65);
                setAssetAgeYears(24);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {locale === 'fr' ? 'Réinitialiser' : 'Reset Inputs'}
            </button>
          </div>
        </div>

        {/* 8 Engineering Pillars Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { id: 'DUVAL_TRIANGLE_DGA' as PillarId, icon: Flame, labelFr: '1. Triangle Duval (DGA)', labelEn: '1. Duval Triangle (DGA)' },
            { id: 'HEALTH_INDEX_ISO55000' as PillarId, icon: Activity, labelFr: '2. Health Index (HI)', labelEn: '2. Health Index (HI)' },
            { id: 'PARTIAL_DISCHARGE_PD' as PillarId, icon: Zap, labelFr: '3. Décharges Partielles', labelEn: '3. Partial Discharge (PD)' },
            { id: 'SFRA_WINDING_ANALYSIS' as PillarId, icon: TrendingUp, labelFr: '4. Analyse SFRA Bobinage', labelEn: '4. SFRA Winding Integrity' },
            { id: 'AMI_SMART_METERING' as PillarId, icon: Gauge, labelFr: '5. Smart Metering AMI', labelEn: '5. AMI Smart Metering' },
            { id: 'FLEET_RISK_MATRIX' as PillarId, icon: BarChart3, labelFr: '6. Matrice de Risque Parc', labelEn: '6. Fleet Risk Matrix' },
            { id: 'CAMEROON_ASSET_CASES' as PillarId, icon: MapPin, labelFr: '7. Cas Réels Cameroun', labelEn: '7. Cameroon Real Assets' },
            { id: 'GUIDED_FIELD_DIAGNOSIS' as PillarId, icon: ShieldCheck, labelFr: '8. Diagnostic Terrain FMEA', labelEn: '8. Field Causal & FMEA' }
          ].map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium font-mono transition-all text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{locale === 'fr' ? pillar.labelFr : pillar.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: DUVAL'S TRIANGLE 1 (DGA) INTERACTIVE DIAGNOSTIC ENGINE */}
      {/* ========================================================================= */}
      {activePillar === 'DUVAL_TRIANGLE_DGA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Gas Inputs (5 cols) */}
            <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  {locale === 'fr' ? 'CONCENTRATIONS DES GAZ DISSOUS (DGA CEI 60599)' : 'DISSOLVED GAS CONCENTRATIONS (IEC 60599)'}
                </h3>
                <span className="text-xs font-mono text-slate-400">PPM (vol/vol)</span>
              </div>

              {/* Presets dropdown/buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">
                  {locale === 'fr' ? 'Scénarios Préréglés / Cas Typiques :' : 'Standard Fault Presets:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {dgaPresets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setGasCH4(p.ch4);
                        setGasC2H4(p.c2h4);
                        setGasC2H2(p.c2h2);
                        setGasH2(p.h2);
                        setGasCO(p.co);
                        setGasCO2(p.co2);
                        setGasC2H6(p.c2h6);
                      }}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/80 transition-colors"
                    >
                      <div className="text-[11px] font-semibold text-slate-200 truncate">
                        {locale === 'fr' ? p.label_fr : p.label_en}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ternary Gas Sliders (CH4, C2H4, C2H2) */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-300">
                  {locale === 'fr' ? '1. Gaz Clés du Triangle de Duval 1 :' : '1. Duval Triangle 1 Key Gases:'}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-300">Méthane (CH4) :</span>
                    <span className="font-bold text-white">{gasCH4} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={gasCH4}
                    onChange={(e) => setGasCH4(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-300">Éthylène (C2H4) :</span>
                    <span className="font-bold text-white">{gasC2H4} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={gasC2H4}
                    onChange={(e) => setGasC2H4(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-red-400 font-bold">Acétylène (C2H2 - Traceur d'Arc) :</span>
                    <span className="font-bold text-red-400">{gasC2H2} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={gasC2H2}
                    onChange={(e) => setGasC2H2(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
              </div>

              {/* Secondary Gases (H2, CO, CO2, C2H6) */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-slate-300">
                  {locale === 'fr' ? '2. Gaz Secondaires & Dégradation Papier :' : '2. Secondary Gases & Paper Aging:'}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Hydrogène (H2) :</span>
                      <span className="text-white font-bold">{gasH2}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="1500"
                      value={gasH2}
                      onChange={(e) => setGasH2(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Éthane (C2H6) :</span>
                      <span className="text-white font-bold">{gasC2H6}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={gasC2H6}
                      onChange={(e) => setGasC2H6(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Monoxyde (CO) :</span>
                      <span className="text-white font-bold">{gasCO}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1500"
                      value={gasCO}
                      onChange={(e) => setGasCO(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Dioxyde (CO2) :</span>
                      <span className="text-white font-bold">{gasCO2}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="15000"
                      step="100"
                      value={gasCO2}
                      onChange={(e) => setGasCO2(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Duval Triangle Graphical Visualization (7 cols) */}
            <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    {locale === 'fr' ? 'DIAGRAMME TERNAIRE DE DUVAL 1 (CEI 60599)' : 'DUVAL 1 TERNARY DIAGRAM (IEC 60599)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    %CH4 = {duvalStats.pctCH4.toFixed(1)}% · %C2H4 = {duvalStats.pctC2H4.toFixed(1)}% · %C2H2 = {duvalStats.pctC2H2.toFixed(1)}%
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  duvalStats.severityLevel === 'critical'
                    ? 'text-red-400 bg-red-950/60 border-red-800 animate-pulse'
                    : 'text-amber-300 bg-amber-950/60 border-amber-800'
                }`}>
                  ZONE {duvalStats.zoneCode}
                </div>
              </div>

              {/* Triangle SVG Canvas */}
              <div className="relative w-full aspect-[4/3] max-h-[360px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                <svg viewBox="0 0 400 340" className="w-full h-full">
                  {/* Grid Lines and Triangle Boundary */}
                  <polygon
                    points="200,40 50,300 350,300"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="2"
                  />

                  {/* Zone polygons approximating Duval Triangle 1 zones */}
                  {/* PD Zone (near top-left) */}
                  <polygon points="50,300 60,285 70,300" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1" />
                  <text x="65" y="295" fill="#93c5fd" fontSize="9" fontWeight="bold">PD</text>

                  {/* T1 Zone (< 300°C) */}
                  <polygon points="70,300 160,300 140,240 60,285" fill="#eab308" fillOpacity="0.25" stroke="#eab308" strokeWidth="1" />
                  <text x="95" y="275" fill="#fef08a" fontSize="11" fontWeight="bold">T1 (&lt;300°C)</text>

                  {/* T2 Zone (300 - 700°C) */}
                  <polygon points="160,300 240,300 210,230 140,240" fill="#f97316" fillOpacity="0.25" stroke="#f97316" strokeWidth="1" />
                  <text x="175" y="270" fill="#fed7aa" fontSize="11" fontWeight="bold">T2</text>

                  {/* T3 Zone (> 700°C) */}
                  <polygon points="240,300 350,300 270,170 210,230" fill="#dc2626" fillOpacity="0.30" stroke="#dc2626" strokeWidth="1" />
                  <text x="265" y="260" fill="#fca5a5" fontSize="12" fontWeight="bold">T3 (&gt;700°C)</text>

                  {/* D1 Zone (Low energy spark) */}
                  <polygon points="200,40 120,170 170,180 200,120" fill="#a855f7" fillOpacity="0.25" stroke="#a855f7" strokeWidth="1" />
                  <text x="155" y="140" fill="#d8b4fe" fontSize="11" fontWeight="bold">D1</text>

                  {/* D2 Zone (High energy arc) */}
                  <polygon points="200,40 200,120 270,170 250,110" fill="#ef4444" fillOpacity="0.35" stroke="#ef4444" strokeWidth="1" />
                  <text x="215" y="110" fill="#fecaca" fontSize="12" fontWeight="bold">D2 (Arc)</text>

                  {/* DT Zone (Mixed) */}
                  <polygon points="120,170 210,230 170,180" fill="#14b8a6" fillOpacity="0.25" stroke="#14b8a6" strokeWidth="1" />
                  <text x="155" y="195" fill="#99f6e4" fontSize="10" fontWeight="bold">DT</text>

                  {/* Corner Labels */}
                  <text x="200" y="28" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                    %C2H2 (Acétylène 100%)
                  </text>
                  <text x="40" y="320" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                    %CH4 (Méthane 100%)
                  </text>
                  <text x="350" y="320" fill="#06b6d4" fontSize="11" fontWeight="bold" textAnchor="middle">
                    %C2H4 (Éthylène 100%)
                  </text>

                  {/* Operating Coordinate Point */}
                  <circle
                    cx={duvalStats.xCoord}
                    cy={duvalStats.yCoord}
                    r="8"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="animate-pulse"
                  />
                  <line
                    x1={duvalStats.xCoord}
                    y1={duvalStats.yCoord}
                    x2={duvalStats.xCoord}
                    y2="300"
                    stroke="#10b981"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Diagnosis Verdict Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {locale === 'fr' ? 'DIAGNOSTIC CEI 60599 & RECOMMANDATION TECHNIQUE :' : 'IEC 60599 DIAGNOSTIC VERDICT:'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    TDCG: {duvalStats.tdcg} ppm (Cond. {duvalStats.tdcgCondition})
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  {locale === 'fr' ? duvalStats.zoneTitleFr : duvalStats.zoneTitleEn}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {locale === 'fr' ? duvalStats.zoneDescFr : duvalStats.zoneDescEn}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">R1 (C2H2/C2H4): </span>
                    <span className="text-white font-bold">{duvalStats.r1.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">R2 (CH4/H2): </span>
                    <span className="text-white font-bold">{duvalStats.r2.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">CO2/CO Papier: </span>
                    <span className={`font-bold ${duvalStats.co2_co_ratio < 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {duvalStats.co2_co_ratio.toFixed(1)} {duvalStats.co2_co_ratio < 3 ? '(Dégradation papier)' : '(Normal)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 2: COMPOSITE ASSET HEALTH INDEX (HI) ISO 55000 SOLVER */}
      {/* ========================================================================= */}
      {activePillar === 'HEALTH_INDEX_ISO55000' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Parameter Inputs (6 cols) */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {locale === 'fr' ? 'PARAMÈTRES PHYSICO-CHIMIQUES & DIÉLECTRIQUES' : 'PHYSICOCHEMICAL & DIELECTRIC PARAMETERS'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Tension de Claquage (Vbd) :</span>
                    <span className="text-emerald-400 font-bold">{breakdownVoltage} kV</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={breakdownVoltage}
                    onChange={(e) => setBreakdownVoltage(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">CEI 60156 (Seuil critique &lt; 40 kV)</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Humidité dans l'Huile (W) :</span>
                    <span className="text-amber-400 font-bold">{moistureInOil} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={moistureInOil}
                    onChange={(e) => setMoistureInOil(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Karl Fischer (Idéal &lt; 20 ppm)</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Indice d'Acidité (TAN) :</span>
                    <span className="text-cyan-400 font-bold">{acidityMgKOH} mg KOH/g</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.40"
                    step="0.01"
                    value={acidityMgKOH}
                    onChange={(e) => setAcidityMgKOH(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">CEI 62021 (Seuil d'alerte &gt; 0.15)</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Tension Interfaciale (IFT) :</span>
                    <span className="text-purple-400 font-bold">{interfacialTension} mN/m</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={interfacialTension}
                    onChange={(e) => setInterfacialTension(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">ASTM D971 (Bon si &gt; 30 mN/m)</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Dérivés Furaniques (2-FAL) :</span>
                    <span className="text-red-400 font-bold">{furan2FAL} mg/kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="6.0"
                    step="0.05"
                    value={furan2FAL}
                    onChange={(e) => setFuran2FAL(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Traceur direct de polymérisation papier</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Âge en Exploitation :</span>
                    <span className="text-white font-bold">{assetAgeYears} ans</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={assetAgeYears}
                    onChange={(e) => setAssetAgeYears(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Durée de vie nominale standard : 35-40 ans</div>
                </div>
              </div>
            </div>

            {/* Right Health Index Score Card (6 cols) */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    {locale === 'fr' ? 'INDICE DE SANTÉ COMPOSITE (HEALTH INDEX ISO 55000)' : 'COMPOSITE HEALTH INDEX SCORE (ISO 55000)'}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${healthIndexStats.hiColor}`}>
                    {healthIndexStats.hiGrade}
                  </span>
                </div>

                {/* Big Score Dial */}
                <div className="flex items-center justify-center my-6">
                  <div className="relative w-44 h-44 rounded-full bg-slate-950 border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl shadow-emerald-950/40">
                    <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                      {healthIndexStats.compositeHI}
                      <span className="text-xl text-slate-500">/100</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 mt-1 uppercase">Health Index</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">PoF: {healthIndexStats.pof}</span>
                  </div>
                </div>

                {/* Sub-Components Progress Bars */}
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Qualité Diélectrique de l'Huile :</span>
                      <span className="text-white font-bold">{healthIndexStats.oilScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${healthIndexStats.oilScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Intégrité Papier Isolant (DP estimé {healthIndexStats.estimatedDP}) :</span>
                      <span className="text-white font-bold">{healthIndexStats.sPaper}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className={`h-full rounded-full ${healthIndexStats.estimatedDP < 250 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${healthIndexStats.sPaper}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Sous-Score Gaz Dissous DGA :</span>
                      <span className="text-white font-bold">{healthIndexStats.sDga}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${healthIndexStats.sDga}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Strategy Recommendation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 mt-4">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === 'fr' ? 'STRATÉGIE DE MAINTENANCE RECOMMANDÉE (RCM) :' : 'RECOMMENDED ASSET STRATEGY (RCM):'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {locale === 'fr' ? healthIndexStats.recommendationFr : healthIndexStats.recommendationEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 3: PARTIAL DISCHARGE (PD) & ACOUSTIC UHF MONITORING */}
      {/* ========================================================================= */}
      {activePillar === 'PARTIAL_DISCHARGE_PD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {locale === 'fr' ? 'DÉTECTION DES DÉCHARGES PARTIELLES (CEI 60270)' : 'PARTIAL DISCHARGE TELEMETRY (IEC 60270)'}
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Type de Capteur de Décharge :</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UHF', 'HFCT', 'Acoustic'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPdSensorType(s)}
                        className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                          pdSensorType === s
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Amplitude de Décharge (Qapp) :</span>
                    <span className="text-emerald-400 font-bold">{pdAmplitudePC} pC</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="5000"
                    step="20"
                    value={pdAmplitudePC}
                    onChange={(e) => setPdAmplitudePC(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Seuil d'alerte poste blindé GIS / Trafo : &gt; 500 pC</div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Fréquence d'Impulsion (Pulse Rate) :</span>
                    <span className="text-white font-bold">{pdPulseRatePerSec} / sec</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={pdPulseRatePerSec}
                    onChange={(e) => setPdPulseRatePerSec(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Signature PRPD (Phase-Resolved Pattern) :</label>
                  <select
                    value={pdPhaseResolvedPattern}
                    onChange={(e) => setPdPhaseResolvedPattern(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Internal Cavity">Cavité interne solide (Décharges symétriques 45° et 225°)</option>
                    <option value="Corona Surface">Effet couronne en pointe (Décharges au pic négatif 270°)</option>
                    <option value="Floating Metal">Potentiel flottant / Armature lâche (Impulsions répétitives)</option>
                    <option value="Tracking">Cheminement superficiel / Décharge rampante</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right PRPD Graph Simulation (7 cols) */}
            <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    {locale === 'fr' ? 'PATRON RÉSOLU EN PHASE (PRPD - 0° à 360°)' : 'PHASE-RESOLVED PARTIAL DISCHARGE (PRPD)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Signature : {pdPhaseResolvedPattern} · Énergie unitaire : {pdDiagnostic.energyPerPulseUJ} µJ
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${pdDiagnostic.riskBadgeColor}`}>
                  {pdDiagnostic.riskLevel} RISK
                </span>
              </div>

              {/* PRPD Scatter Canvas */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                <svg viewBox="0 0 500 240" className="w-full h-full">
                  {/* Sinusoidal 50 Hz Reference Wave */}
                  <path
                    d="M 50,120 Q 150,20 250,120 T 450,120"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text x="460" y="125" fill="#64748b" fontSize="10" fontFamily="monospace">50 Hz</text>

                  {/* Axis lines */}
                  <line x1="50" y1="20" x2="50" y2="210" stroke="#334155" strokeWidth="1" />
                  <line x1="50" y1="210" x2="450" y2="210" stroke="#334155" strokeWidth="1" />

                  {/* Phase tick marks */}
                  <text x="50" y="225" fill="#64748b" fontSize="9" textAnchor="middle">0°</text>
                  <text x="150" y="225" fill="#64748b" fontSize="9" textAnchor="middle">90°</text>
                  <text x="250" y="225" fill="#64748b" fontSize="9" textAnchor="middle">180°</text>
                  <text x="350" y="225" fill="#64748b" fontSize="9" textAnchor="middle">270°</text>
                  <text x="450" y="225" fill="#64748b" fontSize="9" textAnchor="middle">360°</text>

                  {/* Simulated scattered PD clusters based on pattern */}
                  {Array.from({ length: 45 }).map((_, i) => {
                    let cx = 100 + (i % 10) * 8 + Math.sin(i * 4) * 15;
                    let cy = 120 - (pdAmplitudePC / 5000) * 80 - (i % 5) * 6;
                    if (pdPhaseResolvedPattern === 'Internal Cavity') {
                      if (i % 2 === 0) {
                        cx = 100 + (i * 2.5); // around 45° - 90°
                        cy = 130 - (pdAmplitudePC / 5000) * 70 + (i % 7) * 4;
                      } else {
                        cx = 300 + (i * 2.5); // around 225° - 270°
                        cy = 110 + (pdAmplitudePC / 5000) * 70 - (i % 7) * 4;
                      }
                    } else if (pdPhaseResolvedPattern === 'Corona Surface') {
                      cx = 320 + (i * 2.2); // clustered strongly around negative peak
                      cy = 110 + (pdAmplitudePC / 5000) * 80 - (i % 6) * 5;
                    }
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={pdAmplitudePC > 1000 ? '3.5' : '2'}
                        fill={pdAmplitudePC > 2000 ? '#ef4444' : '#10b981'}
                        fillOpacity="0.75"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="text-xs font-mono text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400">Analyse de Spectre UHF : </span>
                {locale === 'fr'
                  ? 'Les capteurs UHF (300 MHz à 1.5 GHz) installés sur les trappes de visite GIS ou les traversées isolent les décharges sans être perturbés par le bruit électromagnétique externe de cour.'
                  : 'UHF sensors (300 MHz to 1.5 GHz) mounted on GIS inspection hatches capture internal dielectric sparks immune to external substation switchyard noise.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 4: SWEEP FREQUENCY RESPONSE ANALYSIS (SFRA IEC 60076-18) */}
      {/* ========================================================================= */}
      {activePillar === 'SFRA_WINDING_ANALYSIS' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'ANALYSE DE RÉPONSE EN FRÉQUENCE PAR BALAYAGE (SFRA CEI 60076-18)' : 'SWEEP FREQUENCY RESPONSE ANALYSIS (SFRA IEC 60076-18)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {locale === 'fr'
                    ? 'Diagnostic non-invasif de la déformation géométrique des bobinages suite à des courts-circuits traversants violents.'
                    : 'Non-invasive diagnostic detecting mechanical winding displacement and core deformation post heavy through-faults.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSfraAnomalyPresent(!sfraAnomalyPresent)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors border ${
                    sfraAnomalyPresent
                      ? 'bg-red-950/60 text-red-300 border-red-800'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {sfraAnomalyPresent ? '⚠️ Anomalie Déformation Active' : '✅ Courbes Conformes / Baseline'}
                </button>
              </div>
            </div>

            {/* 3 Sub-Band Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'LOW_CORE', labelFr: 'Sous-bande Basse (20 Hz - 2 kHz)', labelEn: 'Low Band (20 Hz - 2 kHz)', descFr: 'Intégrité du circuit magnétique & mise à la masse', descEn: 'Magnetic core integrity & core ground loops' },
                { id: 'MID_WINDING', labelFr: 'Sous-bande Moyenne (2 kHz - 100 kHz)', labelEn: 'Mid Band (2 kHz - 100 kHz)', descFr: 'Déformation axiale & radiale des bobinages', descEn: 'Axial displacement & radial winding buckling' },
                { id: 'HIGH_LEADS', labelFr: 'Sous-bande Haute (100 kHz - 1 MHz)', labelEn: 'High Band (100 kHz - 1 MHz)', descFr: 'Connexions internes, traversées & régleur', descEn: 'Internal lead structures, tap changer & bushings' }
              ].map((band) => (
                <button
                  key={band.id}
                  onClick={() => setSelectedSubBand(band.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedSubBand === band.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{locale === 'fr' ? band.labelFr : band.labelEn}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{locale === 'fr' ? band.descFr : band.descEn}</div>
                </button>
              ))}
            </div>

            {/* SFRA Bode Plot Curve Canvas */}
            <div className="relative w-full aspect-[21/9] max-h-[340px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-3">
              <svg viewBox="0 0 700 240" className="w-full h-full">
                {/* Grid */}
                <line x1="60" y1="20" x2="60" y2="210" stroke="#334155" strokeWidth="1" />
                <line x1="60" y1="210" x2="660" y2="210" stroke="#334155" strokeWidth="1" />
                <line x1="60" y1="120" x2="660" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                {/* Y Axis (dB Attenuation: 0 dB to -80 dB) */}
                <text x="50" y="25" fill="#64748b" fontSize="9" textAnchor="end">0 dB</text>
                <text x="50" y="70" fill="#64748b" fontSize="9" textAnchor="end">-20 dB</text>
                <text x="50" y="120" fill="#64748b" fontSize="9" textAnchor="end">-40 dB</text>
                <text x="50" y="170" fill="#64748b" fontSize="9" textAnchor="end">-60 dB</text>
                <text x="50" y="210" fill="#64748b" fontSize="9" textAnchor="end">-80 dB</text>

                {/* X Axis Logarithmic Frequencies */}
                <text x="60" y="225" fill="#64748b" fontSize="9">20 Hz</text>
                <text x="220" y="225" fill="#64748b" fontSize="9">2 kHz</text>
                <text x="440" y="225" fill="#64748b" fontSize="9">100 kHz</text>
                <text x="640" y="225" fill="#64748b" fontSize="9">1 MHz</text>

                {/* Healthy Baseline Trace (Green) */}
                <path
                  d="M 60,190 Q 140,40 220,130 T 380,80 T 500,140 T 650,50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Measured Trace Post-Fault (Dashed Red or matching Green) */}
                {sfraAnomalyPresent ? (
                  <path
                    d="M 60,190 Q 140,40 220,130 T 360,120 T 480,70 T 650,50"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                  />
                ) : (
                  <path
                    d="M 60,190 Q 140,40 220,130 T 380,80 T 500,140 T 650,50"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
              </svg>
            </div>

            {/* Verdict */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="font-bold text-white">Diagnostic Fréquentiel : </span>
              {sfraAnomalyPresent ? (
                <span className="text-red-400 font-bold">
                  Décalage franc des fréquences de résonance anti-parallèles entre 10 kHz et 80 kHz. Forte suspicion de tassement axial des spires sous l'effet des forces électrodynamiques de court-circuit (Ft ~ I²).
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  Corrélation parfaite Rxy &gt; 0.998 entre la courbe de référence d'usine et la mesure sur site. Aucune déformation géométrique des enroulements détectée.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 5: SMART METERING AMI & PREPAYMENT MDM PLATFORM */}
      {/* ========================================================================= */}
      {activePillar === 'AMI_SMART_METERING' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                {locale === 'fr' ? 'INFRASTRUCTURE DE COMPTAGE AVANCÉ (AMI / STS)' : 'ADVANCED METERING INFRASTRUCTURE (AMI / STS)'}
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Protocole de Comptage :</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTokenType('STS_20_DIGIT')}
                      className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        tokenType === 'STS_20_DIGIT'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      STS 20-Chiffres (IEC 62055)
                    </button>
                    <button
                      onClick={() => setTokenType('DLMS_IP_AMI')}
                      className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        tokenType === 'DLMS_IP_AMI'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      DLMS / COSEM (IEC 62056)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Parc de Compteurs Déployés :</span>
                    <span className="text-white font-bold">{totalMetersInstalled.toLocaleString()} unités</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="25000"
                    value={totalMetersInstalled}
                    onChange={(e) => setTotalMetersInstalled(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Volume de Vente Quotidien :</span>
                    <span className="text-emerald-400 font-bold">{(dailyVendingVolumeXaf / 1e6).toFixed(1)} M FCFA / jour</span>
                  </div>
                  <input
                    type="range"
                    min="50000000"
                    max="500000000"
                    step="5000000"
                    value={dailyVendingVolumeXaf}
                    onChange={(e) => setDailyVendingVolumeXaf(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Pertes Non-Techniques (Fraudes) :</span>
                    <span className="text-red-400 font-bold">{nonTechnicalLossesPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="0.5"
                    value={nonTechnicalLossesPct}
                    onChange={(e) => setNonTechnicalLossesPct(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Financial & Technical Impact (7 cols) */}
            <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'PERFORMANCE MDM & ÉCONOMIE DU COMPTAGE' : 'MDM PERFORMANCE & LOSS RECOVERY ROI'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-red-900/40">
                    <div className="text-xs font-mono text-slate-400">Pertes Frauduleuses Quotidiennes :</div>
                    <div className="text-2xl font-bold font-mono text-red-400 mt-1">
                      {(amiStats.currentLostRevenueDailyXaf / 1e6).toFixed(2)} M FCFA
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">Par jour sans télérelève active</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40">
                    <div className="text-xs font-mono text-slate-400">Gains Annuels AMI (Cible 6.5%) :</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      +{(amiStats.annualSavingsMillionXaf).toLocaleString()} M FCFA
                    </div>
                    <div className="text-[11px] text-emerald-500/80 font-mono mt-0.5">Revenus sécurisés par an</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white">Sécurité Cryptographique STS Edition 2 :</span> Clés de chiffrement TID (Token Identifier) basées sur DES/AES-128 pour contrer le roulement de compteur 2024 (TID Rollover).
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white">Télérelève G3-PLC & NB-IoT :</span> Remontée quotidienne des index de consommation, détection instantanée de shunt de neutre et ouverture de capot compteur.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 6: FLEET RISK MATRIX (ISO 55000 / CIGRE) */}
      {/* ========================================================================= */}
      {activePillar === 'FLEET_RISK_MATRIX' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? 'MATRICE DE RISQUE DU PARC DE TRANSFORMATEURS (ISO 55000 / CIGRE)' : 'TRANSFORMER FLEET RISK MATRIX (ISO 55000 / CIGRE)'}
            </h3>
            <span className="text-xs font-mono text-slate-400">Risque = Probabilité de Défaillance (PoF) × Conséquence (CoF)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {[
              {
                id: 'TR-SONG-01',
                name: 'TR1 60 MVA 10.5/225 kV',
                site: 'Songloulou Hydro',
                hi: 72,
                cof: 'TRÈS ÉLEVÉE (Perte 60 MW)',
                actionFr: 'Filtration d\'huile programmée 2026',
                actionEn: 'Scheduled oil filtration 2026',
                badge: 'text-amber-400 bg-amber-950/40 border-amber-800'
              },
              {
                id: 'AT-MANG-01',
                name: 'ATR1 225/90/15 kV 100 MVA',
                site: 'Mangombé Intertie (Édéa)',
                hi: 58,
                cof: 'CRITIQUE (Alimentation Douala)',
                actionFr: 'Surveillance DGA mensuelle & thermographie',
                actionEn: 'Monthly DGA & IR thermography',
                badge: 'text-orange-400 bg-orange-950/40 border-orange-800'
              },
              {
                id: 'TR-NACH-01',
                name: 'GSU 70 MVA 13.8/225 kV',
                site: 'Nachtigal Hydro (420 MW)',
                hi: 96,
                cof: 'ÉLEVÉE (Évacuation bloc)',
                actionFr: 'Actif neuf sous garantie constructeur',
                actionEn: 'New asset under OEM warranty',
                badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-800'
              },
              {
                id: 'TR-OYOM-01',
                name: 'TR 90/15 kV 36 MVA',
                site: 'Oyomabang (Yaoundé)',
                hi: 42,
                cof: 'MOYENNE (Secours N-1 présent)',
                actionFr: 'Remplacement recommandé sous 18 mois',
                actionEn: 'Replacement recommended within 18 mos',
                badge: 'text-red-400 bg-red-950/40 border-red-800'
              }
            ].map((unit) => (
              <div key={unit.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{unit.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${unit.badge}`}>
                    HI: {unit.hi}/100
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200">{unit.name}</div>
                <div className="text-[11px] font-mono text-emerald-400">{unit.site}</div>
                <div className="text-[10px] text-slate-400 font-mono">Conséquence : {unit.cof}</div>
                <div className="text-[11px] text-slate-300 font-mono pt-2 border-t border-slate-800">
                  {locale === 'fr' ? unit.actionFr : unit.actionEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 7: AUTHENTIC CAMEROON ASSET MANAGEMENT CASES */}
      {/* ========================================================================= */}
      {activePillar === 'CAMEROON_ASSET_CASES' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {locale === 'fr' ? 'CAS D\'INGÉNIERIE & GESTION D\'ACTIFS AU CAMEROUN' : 'CAMEROON POWER ASSET CASES'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                PRODUCTION HYDROÉLECTRIQUE
              </span>
              <h4 className="text-sm font-bold text-white">
                Rénovation & Traitement d'Huile des Transformateurs Élévateurs de Songloulou (384 MW)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Les 8 transformateurs élévateurs 60 MVA de Songloulou opèrent dans des conditions d'humidité tropicale extrême (&gt; 90% HR). Eneo et Alstom ont déployé des unités mobiles de dégazage sous vide poussé pour extraire l'humidité dissoute du papier sans interrompre la production de base de la centrale.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                DISTRIBUTION & COMPTAGE COMMUNICANT
              </span>
              <h4 className="text-sm font-bold text-white">
                Déploiement Massif des Compteurs Prépaiement STS & Plateforme MDM Eneo
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Avec plus de 500 000 compteurs communicants déployés à Douala et Yaoundé, la migration vers les compteurs intelligents anti-fraude avec disjoncteur interne télécommandé et tokens 20-chiffres STS a permis d'assainir la trésorerie et d'éliminer les litiges de facturation estimée.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 8: GUIDED FIELD CAUSAL DIAGNOSIS & FMEA WORKBENCH */}
      {/* ========================================================================= */}
      {activePillar === 'GUIDED_FIELD_DIAGNOSIS' && (
        <div className="pt-2">
          <FieldCausalDiagnosisWorkbench locale={locale} embedded={true} />
        </div>
      )}
    </div>
  );
};
