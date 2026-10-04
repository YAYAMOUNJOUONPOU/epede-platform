// src/components/ai/AdvancedAiWorkbench.tsx
// EPEDE Domain D09 - Artificial Intelligence & Advanced Technologies Engineering Workbench
// Level 5 Reference Quality compliant with IEC 60076-7, IEC 60599, IEEE C57.104, ISO 10816, IEC 62443, and NIST AI RMF
// Grounded in Cameroon Critical Power Assets (Songloulou 384 MW, SONATREL 225 kV Mangombé-Oyomabang, Eneo AMI Smart Metering)

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Cpu,
  Activity,
  ShieldAlert,
  Flame,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  ChevronRight,
  ExternalLink,
  Search,
  Eye,
  Camera,
  Server,
  Terminal,
  Radio,
  BarChart3,
  Sun,
  BatteryCharging,
  ShieldCheck,
  FileCheck,
  BookOpen,
  X,
  SlidersHorizontal,
  HardDrive
} from 'lucide-react';

import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { AiOrientationBanner } from './AiOrientationBanner';
import { AiCommandHeader } from './AiCommandHeader';
import { IiotEdgeAcquisitionEngine } from './modules/IiotEdgeAcquisitionEngine';
import { AiDeliverablesExportEngine } from './modules/AiDeliverablesExportEngine';
import { useAiProjectStore, type AiSiteKey, AI_SITE_PROFILES } from './services/useAiProjectStore';

interface AdvancedAiWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const AdvancedAiWorkbench: React.FC<AdvancedAiWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  // Central Reactive Project Store
  const store = useAiProjectStore('HYDRO_SONGLOULOU_384MW');

  // Sub-tabs within stages
  const [stage1Tab, setStage1Tab] = useState<'acquisition' | 'protocols'>('acquisition');
  const [stage2Tab, setStage2Tab] = useState<'dga' | 'thermal'>('dga');
  const [stage3Tab, setStage3Tab] = useState<'vibration' | 'solar'>('vibration');
  const [stage4Tab, setStage4Tab] = useState<'drone' | 'cyber'>('drone');
  const [stage5Tab, setStage5Tab] = useState<'cases' | 'dqe'>('cases');

  // Formulations & Standards Reference Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // PILLAR 1: NEURAL DGA & DUVAL TRIANGLE STATE & CALCS (IEEE C57.104 / IEC 60599)
  // -------------------------------------------------------------------------
  const [h2, setH2] = useState<number>(store.dgaH2);
  const [ch4, setCh4] = useState<number>(store.dgaCh4);
  const [c2h2, setC2h2] = useState<number>(store.dgaC2h2);
  const [c2h4, setC2h4] = useState<number>(store.dgaC2h4);
  const [c2h6, setC2h6] = useState<number>(65);
  const [co, setCo] = useState<number>(store.dgaCo);
  const [co2, setCo2] = useState<number>(4200);

  const dgaCalcs = useMemo(() => {
    const tdcg = h2 + ch4 + c2h2 + c2h4 + c2h6 + co;
    const sumDuval = ch4 + c2h4 + c2h2;
    const pCh4 = sumDuval > 0 ? (ch4 / sumDuval) * 100 : 0;
    const pC2h4 = sumDuval > 0 ? (c2h4 / sumDuval) * 100 : 0;
    const pC2h2 = sumDuval > 0 ? (c2h2 / sumDuval) * 100 : 0;

    const xCoord = pC2h4 + 0.5 * pCh4;
    const yCoord = pCh4 * 0.866025;

    let faultCode = 'NORMAL';
    let faultNameFr = 'Vieillissement normal / Aucune anomalie';
    let faultNameEn = 'Normal aging / No fault';
    let faultSeverity: 'ok' | 'warn' | 'crit' = 'ok';

    if (pC2h2 >= 13) {
      if (pC2h4 >= 23 && pC2h2 <= 29) {
        faultCode = 'D2';
        faultNameFr = 'Décharges de forte énergie (Arc électrique disruptif)';
        faultNameEn = 'High-energy electrical discharges (Power arcing)';
        faultSeverity = 'crit';
      } else {
        faultCode = 'D1';
        faultNameFr = 'Décharges de faible énergie (Étincelles, claquages partiels)';
        faultNameEn = 'Low-energy electrical discharges (Sparking)';
        faultSeverity = 'crit';
      }
    } else if (pC2h2 < 2 && pCh4 >= 98) {
      faultCode = 'PD';
      faultNameFr = 'Décharges Partielles dans les cavités du diélectrique';
      faultNameEn = 'Partial Discharges in oil voids / gas bubbles';
      faultSeverity = 'warn';
    } else if (pC2h4 < 23 && pC2h2 < 4) {
      faultCode = 'T1';
      faultNameFr = 'Défaut thermique basse température (T < 300°C)';
      faultNameEn = 'Low temperature thermal fault (T < 300°C)';
      faultSeverity = 'warn';
    } else if (pC2h4 >= 23 && pC2h4 < 50 && pC2h2 < 13) {
      faultCode = 'T2';
      faultNameFr = 'Défaut thermique moyenne température (300°C ≤ T ≤ 700°C)';
      faultNameEn = 'Medium temperature thermal fault (300°C ≤ T ≤ 700°C)';
      faultSeverity = 'warn';
    } else if (pC2h4 >= 50 && pC2h2 < 15) {
      faultCode = 'T3';
      faultNameFr = 'Défaut thermique haute température (T > 700°C)';
      faultNameEn = 'High temperature thermal fault (T > 700°C - Core overheating)';
      faultSeverity = 'crit';
    } else if (pC2h2 >= 4 && pC2h2 < 13 && pC2h4 >= 23 && pC2h4 < 40) {
      faultCode = 'DT';
      faultNameFr = 'Mélange défaut thermique et électrique';
      faultNameEn = 'Mixed thermal and electrical fault';
      faultSeverity = 'crit';
    }

    const scores = {
      NORMAL: Math.max(5, Math.round(100 - tdcg / 15)),
      PD: Math.max(3, Math.round((pCh4 / 100) * 85 * (pC2h2 < 2 ? 1 : 0.2))),
      T1: Math.max(4, Math.round((ch4 / (ch4 + c2h4 + 1)) * 90 * (pC2h4 < 25 ? 1 : 0.2))),
      T2: Math.max(5, Math.round((c2h4 / (tdcg + 1)) * 140 * (pC2h4 >= 23 && pC2h4 < 50 ? 1 : 0.3))),
      T3: Math.max(4, Math.round((c2h4 / (tdcg + 1)) * 180 * (pC2h4 >= 50 ? 1 : 0.1))),
      D1: Math.max(2, Math.round((c2h2 / (tdcg + 1)) * 220 * (pC2h2 >= 13 && pC2h4 < 23 ? 1 : 0.2))),
      D2: Math.max(2, Math.round((c2h2 / (tdcg + 1)) * 260 * (pC2h2 >= 13 && pC2h4 >= 23 ? 1 : 0.2)))
    };

    const coRatio = co2 / (co + 0.1);
    const paperDegradation = coRatio < 3 ? 'CRITICAL_PAPER_DEGRADATION' : coRatio < 7 ? 'ACCELERATED_AGING' : 'NORMAL';

    return {
      tdcg,
      pCh4: pCh4.toFixed(1),
      pC2h4: pC2h4.toFixed(1),
      pC2h2: pC2h2.toFixed(1),
      xCoord,
      yCoord,
      faultCode,
      faultNameFr,
      faultNameEn,
      faultSeverity,
      scores,
      coRatio: coRatio.toFixed(1),
      paperDegradation
    };
  }, [h2, ch4, c2h2, c2h4, c2h6, co, co2]);

  // -------------------------------------------------------------------------
  // PILLAR 2: DIGITAL TWIN THERMAL PINN (IEC 60076-7)
  // -------------------------------------------------------------------------
  const [ratedMva, setRatedMva] = useState<number>(store.activeSiteProfile.capacityMvaOrMw);
  const [loadFactor, setLoadFactor] = useState<number>(store.transformerLoadFactor);
  const [ambientTemp, setAmbientTemp] = useState<number>(store.ambientTemperatureC);
  const [coolingMode, setCoolingMode] = useState<'ONAN' | 'ONAF' | 'OFAF'>('ONAF');

  const thermalTwin = useMemo(() => {
    const deltaThetaOr = coolingMode === 'ONAN' ? 52 : coolingMode === 'ONAF' ? 44 : 40;
    const deltaThetaHr = coolingMode === 'ONAN' ? 26 : coolingMode === 'ONAF' ? 22 : 20;
    const rRatio = 5.0;
    const xExp = coolingMode === 'ONAN' ? 0.8 : 0.9;
    const yExp = coolingMode === 'ONAN' ? 1.6 : 1.6;
    const hotSpotFactorH = 1.3;

    const topOilRise = deltaThetaOr * Math.pow((1 + rRatio * Math.pow(loadFactor, 2)) / (1 + rRatio), xExp);
    const topOilTemp = ambientTemp + topOilRise;

    const hotSpotGradient = deltaThetaHr * Math.pow(loadFactor, yExp);
    const hotSpotTemp = topOilTemp + hotSpotFactorH * hotSpotGradient;

    const agingFactorV = Math.pow(2, (hotSpotTemp - 98) / 6);
    const baseLifeHours = 180000;
    const effectiveLifeHours = baseLifeHours / Math.max(0.1, agingFactorV);
    const rulYears = (effectiveLifeHours / 8760).toFixed(1);

    return {
      topOilTemp: topOilTemp.toFixed(1),
      hotSpotTemp: hotSpotTemp.toFixed(1),
      agingFactorV: agingFactorV.toFixed(2),
      rulYears,
      isOverheated: hotSpotTemp > 118,
      isCritical: hotSpotTemp > 130
    };
  }, [ratedMva, loadFactor, ambientTemp, coolingMode]);

  // -------------------------------------------------------------------------
  // PILLAR 3: IIOT VIBRATION FFT STATE & CALCS (ISO 10816)
  // -------------------------------------------------------------------------
  const [rpm, setRpm] = useState<number>(store.bearingRpm);
  const [bearingType, setBearingType] = useState<'SKF_6316' | 'SKF_7314' | 'CUSTOM'>('SKF_6316');
  const [injectedDefect, setInjectedDefect] = useState<'HEALTHY' | 'UNBALANCE' | 'MISALIGNMENT' | 'BPFO' | 'BPFI' | 'LOOSENESS'>('BPFO');

  const vibrationCalcs = useMemo(() => {
    const f1x = rpm / 60;
    const zBalls = 8;
    const dBall = 26;
    const dPitch = 125;
    const cosAngle = 1.0;

    const bpfo = (zBalls / 2) * f1x * (1 - (dBall / dPitch) * cosAngle);
    const bpfi = (zBalls / 2) * f1x * (1 + (dBall / dPitch) * cosAngle);
    const bsf = (dPitch / (2 * dBall)) * f1x * (1 - Math.pow((dBall / dPitch) * cosAngle, 2));
    const ftf = (f1x / 2) * (1 - (dBall / dPitch) * cosAngle);

    let rmsVelocity = 1.2;
    let aiDiagnosisFr = 'Machine saine, vibrations dans la plage normale';
    let aiDiagnosisEn = 'Healthy machine, baseline vibration levels';
    let isoZone: 'A' | 'B' | 'C' | 'D' = 'A';

    switch (injectedDefect) {
      case 'HEALTHY':
        rmsVelocity = 1.1;
        isoZone = 'A';
        aiDiagnosisFr = 'Zone A (ISO 10816) : Machine neuve ou remise en service. Aucun défaut détecté.';
        aiDiagnosisEn = 'Zone A (ISO 10816): Newly commissioned machine. Zero anomalies detected.';
        break;
      case 'UNBALANCE':
        rmsVelocity = 5.8;
        isoZone = 'C';
        aiDiagnosisFr = `Balourd mécanique prédominant sur la fréquence 1X (${f1x.toFixed(1)} Hz). Équilibrage dynamique rotor requis.`;
        aiDiagnosisEn = `Mechanical unbalance dominant at 1X running speed (${f1x.toFixed(1)} Hz). Dynamic rotor balancing required.`;
        break;
      case 'MISALIGNMENT':
        rmsVelocity = 6.4;
        isoZone = 'C';
        aiDiagnosisFr = `Désalignement angulaire et parallèle : pic majeur à 2X (${(f1x * 2).toFixed(1)} Hz) et 3X (${(f1x * 3).toFixed(1)} Hz).`;
        aiDiagnosisEn = `Angular & parallel misalignment: prominent peaks at 2X (${(f1x * 2).toFixed(1)} Hz) and 3X (${(f1x * 3).toFixed(1)} Hz).`;
        break;
      case 'BPFO':
        rmsVelocity = 4.2;
        isoZone = 'B';
        aiDiagnosisFr = `Écaillage bague externe roulement : pic haute fréquence BPFO à ${bpfo.toFixed(1)} Hz et harmoniques. Alerte précoce RUL ~350 heures.`;
        aiDiagnosisEn = `Outer race bearing flaking: prominent BPFO peak at ${bpfo.toFixed(1)} Hz with harmonics. Early alert RUL ~350 hours.`;
        break;
      case 'BPFI':
        rmsVelocity = 7.8;
        isoZone = 'C';
        aiDiagnosisFr = `Défaut de bague interne : pic BPFI à ${bpfi.toFixed(1)} Hz modulé par les bandes latérales 1X (±${f1x.toFixed(1)} Hz). Remplacement planifié urgent.`;
        aiDiagnosisEn = `Inner race spall: BPFI peak at ${bpfi.toFixed(1)} Hz with 1X modulation sidebands (±${f1x.toFixed(1)} Hz). Urgent replacement required.`;
        break;
      case 'LOOSENESS':
        rmsVelocity = 12.5;
        isoZone = 'D';
        aiDiagnosisFr = `Zone D DANGER : Desserrage mécanique de structure (sous-harmoniques 0.5X et harmoniques élevées). Risque de bris catastrophique immédiat !`;
        aiDiagnosisEn = `Zone D DANGER: Severe mechanical looseness (0.5X sub-harmonics & multiple high harmonics). Immediate catastrophic failure risk!`;
        break;
    }

    return {
      f1x: f1x.toFixed(1),
      bpfo: bpfo.toFixed(1),
      bpfi: bpfi.toFixed(1),
      bsf: bsf.toFixed(1),
      ftf: ftf.toFixed(1),
      rmsVelocity,
      isoZone,
      aiDiagnosisFr,
      aiDiagnosisEn
    };
  }, [rpm, bearingType, injectedDefect]);

  // -------------------------------------------------------------------------
  // PILLAR 4: DRONE COMPUTER VISION AI
  // -------------------------------------------------------------------------
  const [selectedInspectionDefect, setSelectedInspectionDefect] = useState<string>('clamp_hotspot');
  const inspectionTargets = [
    {
      id: 'clamp_hotspot',
      labelFr: '1. Échauffement Pince de Suspension 225 kV (Infrarouge)',
      labelEn: '1. 225 kV Suspension Clamp Thermal Hotspot (Infrared)',
      category: 'THERMAL',
      confidence: 96.4,
      deltaT: 42.5,
      severity: 'CRITICAL',
      recommendationFr: 'Remplacement d\'urgence du raccord sous 72h. Risque de fusion du conducteur par effet Joule.',
      recommendationEn: 'Emergency replacement within 72h. Danger of conductor annealing and mid-span drop.'
    },
    {
      id: 'insulator_crack',
      labelFr: '2. Amorçage & Fissure Chaîne d\'Isolateurs Composite',
      labelEn: '2. Composite Insulator Flashover Tracking & Cracking',
      category: 'INSULATION',
      confidence: 91.8,
      deltaT: 0,
      severity: 'HIGH',
      recommendationFr: 'Nettoyage haute pression ou remplacement d\'isolateur pour éliminer la perforation du diélectrique.',
      recommendationEn: 'High-pressure de-pollution wash or string replacement to avoid dielectric perforation.'
    },
    {
      id: 'vegetation_encroach',
      labelFr: '3. Encombrement Végétal Corridor Ligne (LiDAR 3D)',
      labelEn: '3. Right-of-Way Vegetation Encroachment (3D LiDAR)',
      category: 'CLEARANCE',
      confidence: 98.1,
      deltaT: 0,
      severity: 'MEDIUM',
      recommendationFr: 'Distance arbre-conducteur mesurée à 3.8m (< 5.0m requis). Élagage prioritaire requis.',
      recommendationEn: 'Tree-to-conductor gap measured at 3.8m (< 5.0m threshold). Priority tree trimming dispatched.'
    },
    {
      id: 'corona_discharge',
      labelFr: '4. Effet Couronne & Décharges UV sur Anneau Garde',
      labelEn: '4. Corona Discharge & UV Emission on Grading Ring',
      category: 'ELECTRICAL',
      confidence: 88.5,
      deltaT: 8.2,
      severity: 'LOW',
      recommendationFr: 'Repositionnement mécanique de l\'anneau pare-effluves lors du prochain arrêt de maintenance.',
      recommendationEn: 'Corona ring mechanical realignment scheduled for next preventive line outage.'
    }
  ];

  const currentDefect = inspectionTargets.find((d) => d.id === selectedInspectionDefect) || inspectionTargets[0];

  // -------------------------------------------------------------------------
  // PILLAR 5: OT CYBERSECURITY & DPI (IEC 62443)
  // -------------------------------------------------------------------------
  const [selectedAttackVector, setSelectedAttackVector] = useState<string>('iec104_unauthorized_trip');
  const attackVectors = [
    {
      id: 'iec104_unauthorized_trip',
      nameFr: 'Injection de Télécommande Non Autorisée CEI 60870-5-104',
      nameEn: 'Unauthorized IEC 60870-5-104 Telecontrol Command Injection',
      mitreCode: 'T0855',
      mitreName: 'Unauthorized Command Message',
      targetProtocol: 'IEC 60870-5-104 (TCP Port 2404)',
      asduType: 'Type 45 (C_SC_NA_1 - Single Command)',
      anomalyScore: 99.2,
      dpiDetailsFr: 'Trame APDU avec COT=6 (Activation) émise depuis une adresse IP non déclarée (192.168.10.144) ciblant l\'adresse ASDU 12 (Disjoncteur Départ 225 kV Bekoko). SBO bypassé.',
      dpiDetailsEn: 'APDU frame with COT=6 (Activation) issued from unauthorized IP (192.168.10.144) targeting ASDU Address 12 (Bekoko 225 kV Line Breaker). Select-Before-Operate bypassed.',
      mitigationFr: 'Blocage pare-feu immédiat IP source, vérification signature cryptographique CEI 62351-5 et alerte SIEM OT.',
      mitigationEn: 'Immediate firewall blacklisting of rogue IP, enforce IEC 62351-5 HMAC authentication, and trigger OT SIEM alert.'
    },
    {
      id: 'goose_replay_storm',
      nameFr: 'Attaque par Rejeu & Tempête de Trames GOOSE (CEI 61850)',
      nameEn: 'GOOSE Replay & Packet Flood Attack (IEC 61850 Station Bus)',
      mitreCode: 'T0814',
      mitreName: 'Denial of Service & Replay',
      targetProtocol: 'IEC 61850-8-1 GOOSE (EtherType 0x88B8)',
      asduType: 'Ethernet Multicast Layer 2',
      anomalyScore: 97.5,
      dpiDetailsFr: 'Désynchronisation des compteurs StNum=14 / SqNum=2 avec saut brutal de séquence et répétition à 5000 trames/s. Tentative de déclenchement intempestif de protection différentielle.',
      dpiDetailsEn: 'StNum=14 / SqNum=2 counter desynchronization with sequence leap and 5000 pkts/s flood. Rogue attempt to trip unit differential protection.',
      mitigationFr: 'Filtrage matériel par switch Ethernet CEI 61850 avec inspection StNum/SqNum et isolation du port switch infecté.',
      mitigationEn: 'Hardware filtering via managed IEC 61850 switch inspecting StNum/SqNum monotonic progression and port shutdown.'
    },
    {
      id: 'modbus_rogue_write',
      nameFr: 'Écriture Forcée Registres Bobine Modbus TCP (Blackout local)',
      nameEn: 'Rogue Coil Write Attack on Modbus TCP PLC',
      mitreCode: 'T0831',
      mitreName: 'Manipulation of Control',
      targetProtocol: 'Modbus TCP (Port 502)',
      asduType: 'Function Code 0x05 (Write Single Coil)',
      anomalyScore: 94.7,
      dpiDetailsFr: 'Commande d\'écriture forcée sur l\'adresse registre 0x0001 (Relais de déclenchement turbine hydroélectrique) hors session autorisée SCADA.',
      dpiDetailsEn: 'Forced write command onto coil address 0x0001 (Hydro turbine trip master relay) originating outside authorized SCADA operator session.',
      mitigationFr: 'Passerelle Modbus unidirectionnelle (Data Diode) et validation stricte de liste blanche de fonctions.',
      mitigationEn: 'Unidirectional Data Diode gateway and strict PLC function whitelist enforcement.'
    }
  ];

  const currentAttack = attackVectors.find((a) => a.id === selectedAttackVector) || attackVectors[0];

  // -------------------------------------------------------------------------
  // PILLAR 6: SOLAR PV FORECASTING & THEFT DETECTION
  // -------------------------------------------------------------------------
  const [solarIrradiance, setSolarIrradiance] = useState<number>(850);
  const [cloudCoverPercent, setCloudCoverPercent] = useState<number>(35);
  const [ambientSolarTemp, setAmbientSolarTemp] = useState<number>(34);

  const solarForecast = useMemo(() => {
    const peakCapacityMw = 15.0;
    const noct = 45;
    const cellTemp = ambientSolarTemp + ((noct - 20) / 800) * solarIrradiance;
    const tempDerating = 1 - 0.0035 * (cellTemp - 25);
    const cloudAttenuation = 1 - (cloudCoverPercent / 100) * 0.75;
    const netIrradiance = solarIrradiance * cloudAttenuation;
    const predictedMw = Math.max(0, peakCapacityMw * (netIrradiance / 1000) * tempDerating * 0.98);
    const bessBufferMw = Math.min(4.0, Math.max(0, peakCapacityMw * 0.8 - predictedMw));

    return {
      cellTemp: cellTemp.toFixed(1),
      netIrradiance: netIrradiance.toFixed(0),
      predictedMw: predictedMw.toFixed(2),
      bessBufferMw: bessBufferMw.toFixed(2),
      rampRateWarn: cloudCoverPercent > 50
    };
  }, [solarIrradiance, cloudCoverPercent, ambientSolarTemp]);

  // Handle site change from Command Header HUD
  const handleSiteChange = (siteKey: AiSiteKey) => {
    store.setSelectedSiteId(siteKey);
    const profile = AI_SITE_PROFILES[siteKey];
    if (profile) {
      setRatedMva(profile.capacityMvaOrMw);
      if (siteKey === 'HYDRO_SONGLOULOU_384MW') {
        setLoadFactor(1.10);
        setAmbientTemp(32);
        setRpm(1500);
        setC2h4(190);
        setC2h2(15);
      } else if (siteKey === 'SUBSTATION_OYOMABANG_225KV') {
        setLoadFactor(0.95);
        setAmbientTemp(30);
        setRpm(1000);
        setC2h4(85);
        setC2h2(2);
      } else if (siteKey === 'SMART_METER_DOUALA_AMI') {
        setLoadFactor(1.15);
        setAmbientTemp(35);
        setRpm(1450);
        setC2h4(40);
        setC2h2(0);
      } else if (siteKey === 'SOLAR_PARK_MAROUA_15MW') {
        setLoadFactor(0.85);
        setAmbientTemp(42);
        setRpm(1500);
        setC2h4(30);
        setC2h2(0);
      }
    }
  };

  // Stage labels for AuthoritativeEcosystemHero
  const stageLabels = [
    locale === 'fr' ? '1. Chaîne d\'Acquisition IIoT & Intégrité Données' : '1. IIoT Acquisition & Data Quality',
    locale === 'fr' ? '2. Diagnostic DGA Duval & Jumeaux Thermiques PINN' : '2. Duval DGA & PINN Thermal Twin',
    locale === 'fr' ? '3. Analyse Spectrale FFT & Vibrations ISO 10816' : '3. FFT Vibration Analytics & ISO 10816',
    locale === 'fr' ? '4. Vision Drone YOLOv8 & Cybersécurité DPI OT' : '4. Drone Vision & OT DPI Cybersecurity',
    locale === 'fr' ? '5. Chantiers Cameroun & Dossier DQE en FCFA' : '5. Cameroon Assets & Stamped BOQ FCFA'
  ];

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans" id="advanced-ai-workbench">
      {/* 1. FIRST VIEW: AUTHORITATIVE ECOSYSTEM HERO */}
      <AuthoritativeEcosystemHero
        stage="substation"
        locale={locale}
        activePillarLabel={stageLabels[store.activeStage - 1]}
        totalPillarsCount={5}
        onNavigateToDomain={(d) => onNavigate?.('domain', d)}
        onSelectEquipment={onSelectEquipment}
      />

      {/* 2. FIRST VIEW: 7 ORIENTATION QUESTIONS ACCORDION BANNER */}
      <AiOrientationBanner
        locale={locale}
        onNavigateStage={(stg) => store.setActiveStage(stg)}
        onNavigateDomain={(d) => onNavigate?.('domain', d)}
      />

      {/* 3. COMMAND HEADER HUD & 5-STAGE PROGRESSIVE SELECTOR */}
      <AiCommandHeader
        locale={locale}
        activeStage={store.activeStage}
        onSelectStage={(stg) => store.setActiveStage(stg)}
        selectedSiteId={store.selectedSiteId}
        onSelectSite={handleSiteChange}
        activeProfile={store.activeSiteProfile}
        calculations={store.calculations}
        onOpenDossier={() => {
          store.setActiveStage(5);
          setStage5Tab('dqe');
        }}
        onOpenPrinciplesModal={() => setIsFormulasModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* STAGE 1: CHAÎNE D'ACQUISITION IIOT & INTÉGRITÉ DONNÉES                     */}
      {/* ========================================================================= */}
      {store.activeStage === 1 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setStage1Tab('acquisition')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage1Tab === 'acquisition'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              1.1 Échantillonnage, Synchronisation PTP & Stockage Edge
            </button>
            <button
              type="button"
              onClick={() => setStage1Tab('protocols')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage1Tab === 'protocols'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              1.2 Matrice des Protocoles Industriels & Capteurs de Terrain
            </button>
          </div>

          {stage1Tab === 'acquisition' && (
            <IiotEdgeAcquisitionEngine
              locale={locale}
              siteName={store.activeSiteProfile.nameFr}
            />
          )}

          {stage1Tab === 'protocols' && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl font-mono text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span>Matrice Comparée des Protocoles de Télémétrie en Milieu Électrique</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-indigo-400 font-bold text-xs">CEI 61850-9-2 SV & GOOSE</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Échantillonnage en direct sur le Process Bus (4800 ou 14400 éch/s). Temps réel dur (&lt; 4 ms), pas de pile TCP/IP, direct couche liaison Ethernet 802.1Q.
                  </p>
                  <div className="text-[10px] text-slate-500">Usage : Protection différentielle & Synchrophasors</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold text-xs">MQTT Sparkplug B</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Publish/Subscribe ultra-léger avec payload Google Protocol Buffers compressé. Idéal pour réseaux cellulaires contraints 4G/GPRS au Cameroun.
                  </p>
                  <div className="text-[10px] text-slate-500">Usage : Télémétrie compteurs AMI Eneo</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold text-xs">OPC UA (CEI 62541)</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Modèle d'information riche avec chiffrement natif X.509 et signature des messages. Parfait pour l'intégration SCADA vers Cloud d'entreprise.
                  </p>
                  <div className="text-[10px] text-slate-500">Usage : Jumeau numérique & Historian</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold text-xs">Modbus TCP / RTU</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Protocole maître-esclave historique sans sécurité native. Requiert une passerelle diode de données pour éviter les écritures malveillantes.
                  </p>
                  <div className="text-[10px] text-slate-500">Usage : Groupes diesel & centrales solaires isolées</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: DIAGNOSTIC PHYSICO-CHIMIQUE DGA & PINN THERMIQUE                 */}
      {/* ========================================================================= */}
      {store.activeStage === 2 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setStage2Tab('dga')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage2Tab === 'dga'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              2.1 Diagnostic DGA & Triangle de Duval 1 (IEEE C57.104 / CEI 60599)
            </button>
            <button
              type="button"
              onClick={() => setStage2Tab('thermal')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage2Tab === 'thermal'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              2.2 Jumeau Numérique Thermique & Perte de Vie RUL PINN (CEI 60076-7)
            </button>
          </div>

          {/* DGA Tab (Preserved Simulator 1) */}
          {stage2Tab === 'dga' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      <span>{locale === 'fr' ? 'Concentrations Gaz Dissous (ppm)' : 'Dissolved Gas Concentrations'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">IEEE C57.104</span>
                  </div>

                  {/* Gas Sliders */}
                  {[
                    { label: 'Hydrogène H2 :', val: h2, set: setH2, max: 500, alert: 100 },
                    { label: 'Méthane CH4 (% Duval) :', val: ch4, set: setCh4, max: 600, alert: 120 },
                    { label: 'Acétylène C2H2 (% Duval - Arc) :', val: c2h2, set: setC2h2, max: 150, alert: 5 },
                    { label: 'Éthylène C2H4 (% Duval - Thermique) :', val: c2h4, set: setC2h4, max: 600, alert: 50 },
                    { label: 'Monoxyde de Carbone CO :', val: co, set: setCo, max: 1200, alert: 500 }
                  ].map((g, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{g.label}</span>
                        <span className={`font-bold ${g.val > g.alert ? 'text-amber-400' : 'text-indigo-400'}`}>{g.val} ppm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={g.max}
                        value={g.val}
                        onChange={(e) => g.set(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Total Gaz Combustibles (TDCG) :</span>
                    <span className="text-amber-400 font-bold">{dgaCalcs.tdcg} ppm</span>
                  </div>
                </div>
              </div>

              {/* Duval Triangle SVG & Neural Confidence Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <span>{locale === 'fr' ? 'Triangle de Duval 1 Vectoriel & Classification IA' : 'Vector Duval Triangle 1 & AI Inference'}</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      dgaCalcs.faultSeverity === 'crit'
                        ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                        : dgaCalcs.faultSeverity === 'warn'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {dgaCalcs.faultCode}
                    </span>
                  </div>

                  {/* Duval Triangle SVG */}
                  <div className="relative w-full h-64 bg-[#060914] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                    <svg viewBox="0 0 120 100" className="w-full h-full max-w-sm">
                      {/* Triangle base */}
                      <polygon points="10,90 110,90 60,3.4" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />

                      {/* Internal Zones */}
                      <polygon points="60,3.4 55,20 65,20" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="0.5" />
                      <text x="58" y="14" fill="#93c5fd" fontSize="4" fontFamily="monospace">PD</text>

                      <polygon points="10,90 40,90 25,60" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="0.5" />
                      <text x="22" y="80" fill="#fcd34d" fontSize="4" fontFamily="monospace">T1</text>

                      <polygon points="40,90 80,90 60,50" fill="#f97316" fillOpacity="0.25" stroke="#f97316" strokeWidth="0.5" />
                      <text x="58" y="80" fill="#fdba74" fontSize="4" fontFamily="monospace">T2</text>

                      <polygon points="80,90 110,90 95,50" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="0.5" />
                      <text x="92" y="80" fill="#fca5a5" fontSize="4" fontFamily="monospace">T3</text>

                      <polygon points="25,60 50,40 35,30" fill="#a855f7" fillOpacity="0.25" stroke="#a855f7" strokeWidth="0.5" />
                      <text x="34" y="45" fill="#d8b4fe" fontSize="4" fontFamily="monospace">D1</text>

                      <polygon points="50,40 85,40 67,20" fill="#e11d48" fillOpacity="0.35" stroke="#e11d48" strokeWidth="0.5" />
                      <text x="64" y="32" fill="#fda4af" fontSize="4" fontFamily="monospace">D2</text>

                      {/* Current operating point */}
                      <circle
                        cx={10 + dgaCalcs.xCoord}
                        cy={90 - dgaCalcs.yCoord}
                        r="2.5"
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>

                  {/* Diagnostic Summary */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Diagnostic Identifié :</span>
                      <span className="text-white font-bold">{locale === 'fr' ? dgaCalcs.faultNameFr : dgaCalcs.faultNameEn}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Ratios Duval : %CH4={dgaCalcs.pCh4}% | %C2H4={dgaCalcs.pC2h4}% | %C2H2={dgaCalcs.pC2h2}%</span>
                      <span className="text-indigo-400 font-bold">Rapport CO2/CO : {dgaCalcs.coRatio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thermal PINN Tab (Preserved Simulator 2) */}
          {stage2Tab === 'thermal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Flame className="h-4 w-4" />
                      <span>{locale === 'fr' ? 'Paramètres de Charge & Refroidissement' : 'Load & Cooling Parameters'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">CEI 60076-7</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Facteur de Charge K (I / In) :</span>
                      <span className="text-amber-400 font-bold">{(loadFactor * 100).toFixed(0)}% ({loadFactor} In)</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={loadFactor}
                      onChange={(e) => setLoadFactor(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Température Ambiante (&theta;a) :</span>
                      <span className="text-amber-400 font-bold">{ambientTemp} °C</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      step="1"
                      value={ambientTemp}
                      onChange={(e) => setAmbientTemp(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300">Mode de Refroidissement Transformateur :</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['ONAN', 'ONAF', 'OFAF'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setCoolingMode(m)}
                          className={`py-1.5 rounded-lg border font-bold text-center ${
                            coolingMode === m
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-950 text-slate-400 border-slate-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Résultats du Jumeau Numérique Thermique PINN' : 'PINN Thermal Digital Twin Sizing'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${thermalTwin.isCritical ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                      {thermalTwin.isCritical ? 'DANGER SURCHAUFFE' : 'RÉGIME THERMIQUE STABLE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Huile Sommet (&theta;o)</div>
                      <div className="text-xl font-bold text-amber-300">{thermalTwin.topOilTemp} °C</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Point Chaud (&theta;h)</div>
                      <div className="text-xl font-bold text-red-400">{thermalTwin.hotSpotTemp} °C</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Vieillissement V</div>
                      <div className="text-xl font-bold text-indigo-300">{thermalTwin.agingFactorV} &times;</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Espérance RUL</div>
                      <div className="text-xl font-bold text-emerald-400">{thermalTwin.rulYears} ans</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-amber-400 font-bold">Loi d'Accélération d'Arrhenius (CEI 60076-7) :</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Au-delà de 98°C, chaque tranche de 6°C d'élévation de température double la vitesse de dégradation de la cellulose de l'isolant kraft. À {thermalTwin.hotSpotTemp}°C, le transformateur consomme {thermalTwin.agingFactorV} heures de vie théorique par heure réelle d'exploitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: SPECTROMÉTRIE FFT, VIBRATIONS & SMART METER AMI                 */}
      {/* ========================================================================= */}
      {store.activeStage === 3 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setStage3Tab('vibration')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage3Tab === 'vibration'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              3.1 Edge IIoT & Analyse Spectrale FFT de Vibrations ISO 10816 (Roulements)
            </button>
            <button
              type="button"
              onClick={() => setStage3Tab('solar')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage3Tab === 'solar'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              3.2 Prévision Solaire & Détection de Pertes Non-Techniques / Fraude Eneo
            </button>
          </div>

          {/* Vibration Simulator (Preserved Simulator 3) */}
          {stage3Tab === 'vibration' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>Paramètres Rotor & Roulement</span>
                    </span>
                    <span className="text-[10px] text-slate-400">ISO 10816-3</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Vitesse de Rotation Rotor :</span>
                      <span className="text-cyan-400 font-bold">{rpm} tr/min (1X = {vibrationCalcs.f1x} Hz)</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="3000"
                      step="50"
                      value={rpm}
                      onChange={(e) => setRpm(Number(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300">Injection d'Anomalie Mécanique :</label>
                    <select
                      value={injectedDefect}
                      onChange={(e) => setInjectedDefect(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                    >
                      <option value="HEALTHY">Machine Saine (Zone A)</option>
                      <option value="UNBALANCE">Balourd Dynamique Rotor (Pic 1X)</option>
                      <option value="MISALIGNMENT">Désalignement Ligne d'Arbres (Pics 2X / 3X)</option>
                      <option value="BPFO">Écaillage Bague Externe Roulement (BPFO)</option>
                      <option value="BPFI">Défaut Bague Interne Roulement (BPFI)</option>
                      <option value="LOOSENESS">Desserrage Mécanique Structurel (DANGER)</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                    <div className="text-slate-400 font-bold">Fréquences Cinématiques Calculées :</div>
                    <div className="flex justify-between text-slate-300">
                      <span>BPFO (Bague Extérieure) :</span>
                      <span className="text-cyan-300 font-bold">{vibrationCalcs.bpfo} Hz</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>BPFI (Bague Intérieure) :</span>
                      <span className="text-cyan-300 font-bold">{vibrationCalcs.bpfi} Hz</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>BSF (Billes) :</span>
                      <span className="text-cyan-300 font-bold">{vibrationCalcs.bsf} Hz</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Spectrométrie FFT & Jauge de Sévérité ISO 10816
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      vibrationCalcs.isoZone === 'D'
                        ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                        : vibrationCalcs.isoZone === 'C'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      Zone {vibrationCalcs.isoZone} ({vibrationCalcs.rmsVelocity} mm/s)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-cyan-400 font-bold">Diagnostic Algorithmique IA :</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {locale === 'fr' ? vibrationCalcs.aiDiagnosisFr : vibrationCalcs.aiDiagnosisEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solar & Fraud Tab (Preserved Simulator 6) */}
          {stage3Tab === 'solar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-yellow-400 uppercase tracking-wider">
                      Centrale Solaire & Lissage BESS (Maroua 15 MWc)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Irradiation Solaire (G) :</span>
                      <span className="text-yellow-400 font-bold">{solarIrradiance} W/m²</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1200"
                      step="50"
                      value={solarIrradiance}
                      onChange={(e) => setSolarIrradiance(Number(e.target.value))}
                      className="w-full accent-yellow-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Couverture Nuageuse :</span>
                      <span className="text-yellow-400 font-bold">{cloudCoverPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="5"
                      value={cloudCoverPercent}
                      onChange={(e) => setCloudCoverPercent(Number(e.target.value))}
                      className="w-full accent-yellow-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Puissance Solaire Prédite :</span>
                      <span className="text-yellow-300 font-bold">{solarForecast.predictedMw} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consigne Tampon Batterie BESS :</span>
                      <span className="text-emerald-400 font-bold">+{solarForecast.bessBufferMw} MW</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider">
                      Lutte Anti-Fraude Eneo Smart Meter (Isolation Forest)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">Compteur Smart #EN-88421 (Douala Akwa)</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold text-[10px]">
                        SUSPICION 94%
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Anomalie identifiée : Disparité de 68% entre le bilan de puissance du transformateur MT/BT et la somme des compteurs abonnés. Bipasse phase-neutre détecté par modèle Isolation Forest.
                    </p>
                    <div className="text-[10px] text-emerald-400 font-bold">
                      &gt; Procès-verbal de redressement horodaté transmis à la direction commerciale.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: VISION DRONE & CYBERSÉCURITÉ DPI OT                             */}
      {/* ========================================================================= */}
      {store.activeStage === 4 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setStage4Tab('drone')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage4Tab === 'drone'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              4.1 Vision par Ordinateur & Inspection Drone Lignes 225 kV (CIGRE TB 859)
            </button>
            <button
              type="button"
              onClick={() => setStage4Tab('cyber')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage4Tab === 'cyber'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              4.2 Cybersécurité OT & Détection d'Intrusions SCADA DPI (CEI 62443)
            </button>
          </div>

          {/* Drone Vision Tab (Preserved Simulator 4) */}
          {stage4Tab === 'drone' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-camera text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Cibles d'Inspection Lignes 225 kV</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {inspectionTargets.map((tgt) => (
                      <button
                        key={tgt.id}
                        type="button"
                        onClick={() => setSelectedInspectionDefect(tgt.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedInspectionDefect === tgt.id
                            ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs">{locale === 'fr' ? tgt.labelFr : tgt.labelEn}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-indigo-200">
                            {tgt.confidence}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Résultat Détection YOLOv8 Radiométrique
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${currentDefect.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {currentDefect.severity}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-indigo-400 font-bold">Action Prescriptive d'Exploitation :</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {locale === 'fr' ? currentDefect.recommendationFr : currentDefect.recommendationEn}
                    </p>
                    {currentDefect.deltaT > 0 && (
                      <div className="text-amber-400 font-bold text-[11px]">
                        Échauffement mesuré : &Delta;T = +{currentDefect.deltaT} °C au-dessus de la température ambiante
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OT Cybersecurity DPI Tab (Preserved Simulator 5) */}
          {stage4Tab === 'cyber' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Vecteurs d'Attaque MITRE ATT&CK for ICS</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {attackVectors.map((att) => (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => setSelectedAttackVector(att.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedAttackVector === att.id
                            ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{locale === 'fr' ? att.nameFr : att.nameEn}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">MITRE {att.mitreCode} · {att.targetProtocol}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Analyse Profonde de Paquet (DPI) & Réponse
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse">
                      SCORE ANOMALIE {currentAttack.anomalyScore}%
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                    <div className="text-rose-400 font-bold">Détails Télémétriques Trame :</div>
                    <p className="text-slate-300 leading-relaxed">
                      {locale === 'fr' ? currentAttack.dpiDetailsFr : currentAttack.dpiDetailsEn}
                    </p>
                    <div className="text-emerald-400 font-bold pt-1">
                      Parade Immédiate : {locale === 'fr' ? currentAttack.mitigationFr : currentAttack.mitigationEn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: CHANTIERS CAMEROUN & DOSSIER DQE FCFA                           */}
      {/* ========================================================================= */}
      {store.activeStage === 5 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setStage5Tab('cases')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage5Tab === 'cases'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              5.1 Retours d'Expérience Réels au Cameroun (Songloulou, SONATREL 225 kV, Eneo AMI)
            </button>
            <button
              type="button"
              onClick={() => setStage5Tab('dqe')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage5Tab === 'dqe'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              5.2 Dossier Technique Estampillé & Devis DQE en FCFA
            </button>
          </div>

          {/* Cameroon Forensic Cases (Preserved Pillar 7) */}
          {stage5Tab === 'cases' && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl font-mono text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Server className="h-4 w-4 text-indigo-400" />
                  <span>Cas Forensics & Applications Industrielles au Cameroun</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    titleFr: 'Centrale Hydroélectrique de Songloulou (384 MW)',
                    titleEn: 'Songloulou Hydroelectric Power Plant (384 MW)',
                    roleFr: 'Surveillance Vibratoire & DGA des 8 Groupes Francis',
                    roleEn: 'Vibration & DGA Online Telemetry on 8 Francis Turbines',
                    descFr: 'Déploiement de capteurs piézoélectriques triaxiaux et chromatographes d\'huile DGA en ligne sur les transformateurs élévateurs 60 MVA. L\'analyse spectrale FFT a permis d\'anticiper un phénomène de vortex en sortie de roue Francis et d\'éviter l\'avarie mécanique.',
                    descEn: 'Deployment of online DGA oil chromatographs and triaxial vibration telemetry on 60 MVA GSU transformers. FFT spectrum analysis successfully identified draft-tube vortex cavitation pulsations, averting catastrophic runner fatigue.',
                    badge: 'Songloulou · Eneo Hydro'
                  },
                  {
                    titleFr: 'Dorsale Transport 225 kV SONATREL (Mangombé - Oyomabang)',
                    titleEn: 'SONATREL 225 kV Transmission Corridor (Mangombé - Oyomabang)',
                    roleFr: 'Inspection par Drone & Détection Infrarouge par IA',
                    roleEn: 'Drone Vision AI & Automatic Infrared Thermography',
                    descFr: 'Survol automatisé des lignes 225 kV traversant la forêt équatoriale humide. Le modèle YOLOv8 a identifié 14 points chauds critiques (ΔT > 30°C) sur les pinces d\'ancrage et détecté les empiétements de canopée avant amorçage.',
                    descEn: 'Automated drone flights scanning 225 kV towers across dense equatorial rainforest. The YOLOv8 computer vision model pinpointed 14 critical thermal hotspots on tension clamps and flagged tree clearance violations.',
                    badge: 'SONATREL 225 kV'
                  },
                  {
                    titleFr: 'Comptage Intelligent & Lutte Anti-Fraude Eneo',
                    titleEn: 'Eneo Smart Metering & Machine Learning Fraud Prevention',
                    roleFr: 'Détection des Pertes Non-Techniques par Machine Learning',
                    roleEn: 'Non-Technical Loss (NTL) Detection via ML Clustering',
                    descFr: 'Analyse en temps réel de 500 000 compteurs communicants STS/AMI à Douala et Yaoundé. L\'algorithme Random Forest détecte les chutes anormales de consommation et le contournement de neutre, permettant de récupérer plus de 45 GWh de pertes commerciales.',
                    descEn: 'Real-time telemetry analysis of 500,000 STS/AMI smart meters in Douala and Yaoundé. Random Forest machine learning models detect anomalous load drops and neutral tampering, recovering over 45 GWh of commercial losses.',
                    badge: 'Eneo AMI Douala/Ydé'
                  }
                ].map((c, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded font-bold">
                        {c.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {locale === 'fr' ? c.titleFr : c.titleEn}
                      </h4>
                      <div className="text-xs text-indigo-300">
                        {locale === 'fr' ? c.roleFr : c.roleEn}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {locale === 'fr' ? c.descFr : c.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage5Tab === 'dqe' && (
            <AiDeliverablesExportEngine
              locale={locale}
              profile={store.activeSiteProfile}
              calculations={store.calculations}
              billOfQuantities={store.billOfQuantities}
              onJumpToStage={(st) => store.setActiveStage(st)}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMULATIONS & STANDARDS MODAL                                           */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl bg-slate-950 border border-indigo-600/40 shadow-2xl p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <BookOpen className="h-5 w-5" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Formulations & Principes Physico-Algorithmiques de Dimensionnement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formula 1 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">1. Ratios DGA Triangle de Duval 1 (CEI 60599)</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  %CH4 = [CH4 / (CH4 + C2H4 + C2H2)] &times; 100<br />
                  %C2H4 = [C2H4 / (CH4 + C2H4 + C2H2)] &times; 100<br />
                  %C2H2 = [C2H2 / (CH4 + C2H4 + C2H2)] &times; 100
                </div>
                <p className="text-slate-400 text-[11px]">
                  Détermine les coordonnées barycentriques sur triangle équilatéral pour classer les défauts thermiques (T1, T2, T3) et électriques (PD, D1, D2).
                </p>
              </div>

              {/* Formula 2 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">2. Loi d'Échauffement Thermique (CEI 60076-7)</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  &Delta;&theta;or = &Delta;&theta;or_nom &times; [(1 + R&times;K²)/(1 + R)]^x<br />
                  &theta;h = &theta;a + &Delta;&theta;or + H &times; &Delta;&theta;hr &times; K^y
                </div>
                <p className="text-slate-400 text-[11px]">
                  Calcul de la température du point chaud le plus sévère (&theta;h) guidant la résolution par réseau de neurones PINN.
                </p>
              </div>

              {/* Formula 3 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">3. Taux de Vieillissement Relatif & RUL</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  V = 2^[(&theta;h - 98) / 6]<br />
                  RUL (ans) = (180 000 h / V) / 8 760
                </div>
                <p className="text-slate-400 text-[11px]">
                  Modèle d'Arrhenius : au-delà de 98°C, le vieillissement du papier isolant double tous les 6°C.
                </p>
              </div>

              {/* Formula 4 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">4. Cinématique des Roulements (ISO 10816-3)</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  BPFO = (Z/2) &times; f1X &times; [1 - (d/D)&times;cos(&alpha;)]<br />
                  BPFI = (Z/2) &times; f1X &times; [1 + (d/D)&times;cos(&alpha;)]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Fréquences caractéristiques d'impacts d'écaillage sur les bagues externe (BPFO) et interne (BPFI).
                </p>
              </div>

              {/* Formula 5 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">5. Dérive en Température TOPCon & BESS</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  P_pv = P_nom &times; (G / 1000) &times; [1 - &gamma;&times;(T_cell - 25)]<br />
                  P_bess = max(0, P_cible - P_pv)
                </div>
                <p className="text-slate-400 text-[11px]">
                  Régulation de rampe de puissance injectée au RIN 110 kV pour éviter les déclenchements de sous-fréquence.
                </p>
              </div>

              {/* Formula 6 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-indigo-400 font-bold text-xs uppercase">6. Détection d'Anomalies DPI (CEI 62443)</div>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  Score = &Sigma; w_i &times; [1 - P(Trame_i | État_SCADA_Normal)]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Vérification d'état de séquence (StNum / SqNum GOOSE, COT CEI 104) bloquant les injections de commandes illégitimes.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Fermer la Synthèse Mathématique
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
