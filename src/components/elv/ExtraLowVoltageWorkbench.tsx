// src/components/elv/ExtraLowVoltageWorkbench.tsx
// EPEDE Domain D08 - Extra Low Voltage & Special Systems Engineering Workbench
// Level 5 Reference Quality compliant with TIA-568.2-D, ISO/IEC 11801, EN 54, NF S 61-936, EN 62676, IEC 60839-11, IEC 60849, IEEE 802.3bt & BACnet

import React, { useState, useMemo } from 'react';
import {
  Network,
  Video,
  Flame,
  ShieldCheck,
  BatteryCharging,
  Layers,
  Building2,
  HardDrive,
  Wifi,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Volume2,
  FileCheck,
  Radio,
  Clock,
  Activity,
  Server,
  KeyRound,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  X,
  BookOpen,
  Calculator,
  Sparkles,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  useElvProjectStore,
  ELV_BUILDING_PROFILES,
  BuildingTypologyKey
} from './services/useElvProjectStore';
import { ElvOrientationBanner } from './ElvOrientationBanner';
import { ElvCommandHeader } from './ElvCommandHeader';
import { PoEPowerBudgetCalculator } from './modules/PoEPowerBudgetCalculator';
import { ElvDeliverablesExportEngine } from './modules/ElvDeliverablesExportEngine';

interface ExtraLowVoltageWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const ExtraLowVoltageWorkbench: React.FC<ExtraLowVoltageWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  // Central Reactive Project Store
  const store = useElvProjectStore('OFFICE_TOWER');

  // Mathematical Principles Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // Sub-tabs per progressive stage
  const [stage1Tab, setStage1Tab] = useState<'FIBER_LINK' | 'POE_BUDGET'>('FIBER_LINK');
  const [stage2Tab, setStage2Tab] = useState<'CCTV_RAID' | 'ACCESS_INTERLOCK'>('CCTV_RAID');
  const [stage3Tab, setStage3Tab] = useState<'FIRE_SSI' | 'BATTERY_EN54'>('FIRE_SSI');
  const [stage4Tab, setStage4Tab] = useState<'BMS_GTB'>('BMS_GTB');
  const [stage5Tab, setStage5Tab] = useState<'CAMEROON_CASES' | 'DELIVERABLES_BOQ'>('CAMEROON_CASES');

  // Stage Meta Information
  const STAGES_CONFIG = useMemo(() => ({
    1: {
      num: locale === 'fr' ? 'Étape 1' : 'Stage 1',
      titleFr: 'Infrastructures VDI, Câblage Structuré & Bilan PoE (Fibre / Cuivre)',
      titleEn: 'VDI Infrastructure, Structured Cabling & PoE Power Budget',
      badgeFr: 'TIA-568.2-D · ISO 11801 · IEEE 802.3bt',
      badgeEn: 'TIA-568.2-D · ISO 11801 · IEEE 802.3bt',
      icon: Network
    },
    2: {
      num: locale === 'fr' ? 'Étape 2' : 'Stage 2',
      titleFr: 'Sûreté Électronique, Vidéosurveillance IP & Contrôle d\'Accès',
      titleEn: 'Electronic Security, IP CCTV & Access Control Interlocks',
      badgeFr: 'H.265+ · RAID 5/6 · EN 62676 DORI · Sas Sas',
      badgeEn: 'H.265+ · RAID 5/6 · EN 62676 DORI · Interlocks',
      icon: Video
    },
    3: {
      num: locale === 'fr' ? 'Étape 3' : 'Stage 3',
      titleFr: 'Sécurité Incendie SSI Cat. A, Évacuation Vocale & Autonomie AES',
      titleEn: 'Fire Alarm SSI Cat. A, Voice Evacuation & AES Battery Autonomy',
      badgeFr: 'EN 54 · NF S 61-936 · SPL dB · Autonomie 72h',
      badgeEn: 'EN 54 · NF S 61-936 · SPL dB · 72h Standby',
      icon: Flame
    },
    4: {
      num: locale === 'fr' ? 'Étape 4' : 'Stage 4',
      titleFr: 'Gestion Technique du Bâtiment (GTB BACnet & KNX) & Smart Building',
      titleEn: 'Building Management System (BMS BACnet & KNX) & Smart Automation',
      badgeFr: 'BACnet/IP · Modbus-TCP · DALI · Régulation CVC',
      badgeEn: 'BACnet/IP · Modbus-TCP · DALI · HVAC Supervision',
      icon: Building2
    },
    5: {
      num: locale === 'fr' ? 'Étape 5' : 'Stage 5',
      titleFr: 'Réception, Chantiers Cameroun & Dossier DQE FCFA',
      titleEn: 'Commissioning, Cameroon Field Cases & Stamped BOQ/DQE in FCFA',
      badgeFr: 'Aéroport Nsimalen · Douala Port · Hilton · DQE FCFA',
      badgeEn: 'Nsimalen Airport · Douala Port · Hilton · BOQ FCFA',
      icon: HardDrive
    }
  }), [locale]);

  // Synchronize facility profile changes
  const handleSelectBuilding = (id: BuildingTypologyKey) => {
    store.setSelectedBuildingId(id);
    const prof = ELV_BUILDING_PROFILES[id];
    if (prof) {
      setCameraCount(prof.defaultCctvCameras);
      setAccessDoorsCount(prof.defaultAccessDoors);
      setDetectorLoopsCount(Math.max(2, Math.floor(prof.defaultSsiLoops / 2)));
      setHvacUnitsSupervised(Math.max(8, Math.floor(prof.floorsCount * 2)));
      if (id === 'AIRPORT_TERMINAL') setLinkDistanceKm(3.5);
      else if (id === 'HOSPITAL_REGIONAL') setLinkDistanceKm(2.0);
      else setLinkDistanceKm(1.2);
    }
  };

  // Direct Jump to Stage 5 DQE
  const handleOpenDossier = () => {
    store.setActiveStage(5);
    setStage5Tab('DELIVERABLES_BOQ');
  };

  // =========================================================================
  // PILLAR 1: OPTICAL FIBER LINK BUDGET CALCULATOR
  // =========================================================================
  const [fiberType, setFiberType] = useState<'OS2_SINGLEMODE' | 'OM4_MULTIMODE' | 'OM3_MULTIMODE'>('OS2_SINGLEMODE');
  const [wavelengthNm, setWavelengthNm] = useState<number>(1310);
  const [linkDistanceKm, setLinkDistanceKm] = useState<number>(1.2);
  const [fusionSpliceCount, setFusionSpliceCount] = useState<number>(4);
  const [connectorPairsCount, setConnectorPairsCount] = useState<number>(4);
  const [txOpticalPowerDbm, setTxOpticalPowerDbm] = useState<number>(-3.0); // 10GBASE-LR SFP+ min output
  const [rxSensitivityDbm, setRxSensitivityDbm] = useState<number>(-14.4); // receiver sensitivity

  const fiberAttenuationDbPerKm = useMemo(() => {
    if (fiberType === 'OS2_SINGLEMODE') {
      return wavelengthNm === 1310 ? 0.35 : 0.22;
    } else if (fiberType === 'OM4_MULTIMODE') {
      return wavelengthNm === 850 ? 3.0 : 1.0;
    } else {
      return wavelengthNm === 850 ? 3.5 : 1.2;
    }
  }, [fiberType, wavelengthNm]);

  const lossCableDb = linkDistanceKm * fiberAttenuationDbPerKm;
  const lossSplicesDb = fusionSpliceCount * 0.05; // 0.05 dB per fusion splice (standard fusion arc)
  const lossConnectorsDb = connectorPairsCount * 0.35; // 0.35 dB per LC/SC connector pair
  const safetyMarginDb = 3.0; // standard 3 dB aging/temperature design margin
  const totalLinkAttenuationDb = lossCableDb + lossSplicesDb + lossConnectorsDb;

  const totalLinkBudgetDb = txOpticalPowerDbm - rxSensitivityDbm;
  const receivedPowerDbm = txOpticalPowerDbm - totalLinkAttenuationDb;
  const netPowerMarginDb = receivedPowerDbm - rxSensitivityDbm - safetyMarginDb;
  const isFiberLinkPass = netPowerMarginDb >= 0;

  // =========================================================================
  // PILLAR 2: IP CCTV BANDWIDTH, RAID STORAGE & DORI OPTICS
  // =========================================================================
  const [cameraCount, setCameraCount] = useState<number>(48);
  const [cameraResolution, setCameraResolution] = useState<'2MP_1080P' | '4MP_2K' | '8MP_4K'>('4MP_2K');
  const [videoCodec, setVideoCodec] = useState<'H264' | 'H265' | 'H265_PLUS'>('H265_PLUS');
  const [recordingHoursPerDay, setRecordingHoursPerDay] = useState<number>(24);
  const [retentionDays, setRetentionDays] = useState<number>(30); // 30 days mandatory
  const [raidConfig, setRaidConfig] = useState<'RAID0' | 'RAID1' | 'RAID5' | 'RAID6'>('RAID6');
  const [hddUnitCapacityTb, setHddUnitCapacityTb] = useState<number>(8); // 8 TB enterprise surveillance drive

  // Target object distance & focal length for DORI calculations
  const [targetDistanceM, setTargetDistanceM] = useState<number>(12);
  const [lensFocalLengthMm, setLensFocalLengthMm] = useState<number>(4.0); // 2.8, 4.0, 6.0, 12.0 mm

  // Bitrate per camera in Mbps
  const unitCameraBitrateMbps = useMemo(() => {
    let base = 4.0;
    if (cameraResolution === '2MP_1080P') base = 3.0;
    if (cameraResolution === '4MP_2K') base = 5.5;
    if (cameraResolution === '8MP_4K') base = 10.0;

    if (videoCodec === 'H264') return base * 1.5;
    if (videoCodec === 'H265') return base * 0.8;
    return base * 0.5; // H.265+ Smart Codec
  }, [cameraResolution, videoCodec]);

  const totalAggregatedBandwidthMbps = parseFloat((cameraCount * unitCameraBitrateMbps).toFixed(1));

  // Net storage formula: Storage (TB) = (N_cam * Bitrate_Mbps * 3600 * Hours * Days) / (8 * 1,000,000)
  const netRequiredStorageTb = useMemo(() => {
    const totalMegabits = cameraCount * unitCameraBitrateMbps * 3600 * recordingHoursPerDay * retentionDays;
    const totalTerabytes = totalMegabits / (8 * 1_000_000);
    return parseFloat((totalTerabytes * 1.15).toFixed(1)); // 15% filesystem and event overhead
  }, [cameraCount, unitCameraBitrateMbps, recordingHoursPerDay, retentionDays]);

  // Disk count required according to RAID parity rules
  const requiredDiskCount = useMemo(() => {
    const rawDisks = Math.ceil(netRequiredStorageTb / hddUnitCapacityTb);
    if (raidConfig === 'RAID0') return Math.max(2, rawDisks);
    if (raidConfig === 'RAID1') return Math.max(2, rawDisks * 2);
    if (raidConfig === 'RAID5') return Math.max(3, rawDisks + 1); // 1 parity disk
    return Math.max(4, rawDisks + 2); // RAID6: 2 parity disks
  }, [netRequiredStorageTb, hddUnitCapacityTb, raidConfig]);

  const grossUsableStorageTb = useMemo(() => {
    if (raidConfig === 'RAID0') return requiredDiskCount * hddUnitCapacityTb;
    if (raidConfig === 'RAID1') return (requiredDiskCount / 2) * hddUnitCapacityTb;
    if (raidConfig === 'RAID5') return (requiredDiskCount - 1) * hddUnitCapacityTb;
    return (requiredDiskCount - 2) * hddUnitCapacityTb;
  }, [requiredDiskCount, hddUnitCapacityTb, raidConfig]);

  // Optical field of view & DORI (Detect, Observe, Recognize, Identify) per IEC 62676-4
  const sensorWidthMm = 5.38;
  const sensorPixelsHorizontal = cameraResolution === '2MP_1080P' ? 1920 : cameraResolution === '4MP_2K' ? 2560 : 3840;
  const horizontalFovDeg = parseFloat((2 * Math.atan(sensorWidthMm / (2 * lensFocalLengthMm)) * (180 / Math.PI)).toFixed(1));
  const sceneWidthAtTargetM = parseFloat((2 * targetDistanceM * Math.tan((horizontalFovDeg * Math.PI) / 360)).toFixed(2));
  const ppmAtTarget = parseFloat((sensorPixelsHorizontal / sceneWidthAtTargetM).toFixed(1)); // Pixels Per Meter

  const doriCategory = useMemo(() => {
    if (ppmAtTarget >= 250) return { label: 'IDENTIFY (Identification Faciale)', color: 'text-emerald-400', badge: '≥ 250 PPM' };
    if (ppmAtTarget >= 125) return { label: 'RECOGNIZE (Reconnaissance Visage)', color: 'text-cyan-400', badge: '≥ 125 PPM' };
    if (ppmAtTarget >= 63) return { label: 'OBSERVE (Observation Détails)', color: 'text-amber-400', badge: '≥ 63 PPM' };
    return { label: 'DETECT (Détection Silhouette)', color: 'text-rose-400', badge: '≥ 25 PPM' };
  }, [ppmAtTarget]);

  // =========================================================================
  // PILLAR 3: FIRE ALARM SSI & SOUND PRESSURE LEVEL (EN 54 / NF S 61-936)
  // =========================================================================
  const [ssiCategory, setSsiCategory] = useState<'CAT_A' | 'CAT_B' | 'CAT_C' | 'CAT_D'>('CAT_A');
  const [detectorLoopsCount, setDetectorLoopsCount] = useState<number>(4);
  const [detectorsPerLoop, setDetectorsPerLoop] = useState<number>(64);
  const [speakerTapWatts, setSpeakerTapWatts] = useState<number>(6.0); // 1.5W, 3W, 6W on 100V line
  const [speakerSensitivityDb, setSpeakerSensitivityDb] = useState<number>(92); // dB SPL @ 1W / 1m
  const [listenerDistanceMeters, setListenerDistanceMeters] = useState<number>(6.0);
  const [ambientNoiseLevelDb, setAmbientNoiseLevelDb] = useState<number>(65); // dB SPL

  // Sound Pressure Level at listener position: Lp = Ls + 10 * log10(Power) - 20 * log10(Distance)
  const receivedSoundPressureDb = useMemo(() => {
    const val = speakerSensitivityDb + 10 * Math.log10(speakerTapWatts) - 20 * Math.log10(listenerDistanceMeters);
    return parseFloat(val.toFixed(1));
  }, [speakerSensitivityDb, speakerTapWatts, listenerDistanceMeters]);

  const soundSignalToNoiseRatioDb = parseFloat((receivedSoundPressureDb - ambientNoiseLevelDb).toFixed(1));
  const isAlarmAcousticCompliant = receivedSoundPressureDb >= 65 && soundSignalToNoiseRatioDb >= 10;

  // =========================================================================
  // PILLAR 4: ELECTRONIC ACCESS CONTROL & AIRLOCK INTERLOCKS
  // =========================================================================
  const [accessDoorsCount, setAccessDoorsCount] = useState<number>(24);
  const [doorLockType, setDoorLockType] = useState<'MAGNETIC_LOCK_300KG' | 'MAGNETIC_LOCK_600KG' | 'ELECTRIC_STRIKE_FAIL_SECURE' | 'MOTORIZED_BOLT'>('MAGNETIC_LOCK_300KG');
  const [airlockInterlockEnabled, setAirlockInterlockEnabled] = useState<boolean>(true);
  const [door1Open, setDoor1Open] = useState<boolean>(false);
  const [door2Open, setDoor2Open] = useState<boolean>(false);
  const [fireEsdTripActive, setFireEsdTripActive] = useState<boolean>(false);

  const lockPowerSpecs = useMemo(() => {
    if (doorLockType === 'MAGNETIC_LOCK_300KG') return { holdingForceKg: 300, currentMa: 480, voltageV: 12, failMode: 'Fail-Safe (Déverrouillé sans courant)' };
    if (doorLockType === 'MAGNETIC_LOCK_600KG') return { holdingForceKg: 600, currentMa: 600, voltageV: 12, failMode: 'Fail-Safe (Déverrouillé sans courant)' };
    if (doorLockType === 'ELECTRIC_STRIKE_FAIL_SECURE') return { holdingForceKg: 450, currentMa: 250, voltageV: 12, failMode: 'Fail-Secure (Verrouillé sans courant)' };
    return { holdingForceKg: 1000, currentMa: 900, voltageV: 24, failMode: 'Motorisé temporisé' };
  }, [doorLockType]);

  const canOpenDoor2 = useMemo(() => {
    if (fireEsdTripActive) return true;
    if (!airlockInterlockEnabled) return true;
    return !door1Open;
  }, [door1Open, airlockInterlockEnabled, fireEsdTripActive]);

  const canOpenDoor1 = useMemo(() => {
    if (fireEsdTripActive) return true;
    if (!airlockInterlockEnabled) return true;
    return !door2Open;
  }, [door2Open, airlockInterlockEnabled, fireEsdTripActive]);

  // =========================================================================
  // PILLAR 5: UPS & CENTRALIZED SAFETY BATTERY AUTONOMY (EN 54-4)
  // =========================================================================
  const [quiescentCurrentA, setQuiescentCurrentA] = useState<number>(1.85);
  const [standbyHoursRequired, setStandbyHoursRequired] = useState<number>(72);
  const [alarmCurrentA, setAlarmCurrentA] = useState<number>(8.50);
  const [alarmTimeMinutes, setAlarmTimeMinutes] = useState<number>(30);
  const [batteryAgingFactor, setBatteryAgingFactor] = useState<number>(1.25);

  const requiredBatteryCapacityAh = useMemo(() => {
    const standbyAh = quiescentCurrentA * standbyHoursRequired;
    const alarmAh = alarmCurrentA * (alarmTimeMinutes / 60);
    const rawTotalAh = standbyAh + alarmAh;
    return parseFloat((rawTotalAh * batteryAgingFactor).toFixed(1));
  }, [quiescentCurrentA, standbyHoursRequired, alarmCurrentA, alarmTimeMinutes, batteryAgingFactor]);

  const commercialBatteryRecommendation = useMemo(() => {
    if (requiredBatteryCapacityAh <= 24) return '2 × 12V 26 Ah (Batteries Plomb Pur VRLA)';
    if (requiredBatteryCapacityAh <= 40) return '2 × 12V 45 Ah (Batteries Gel Étanche)';
    if (requiredBatteryCapacityAh <= 65) return '2 × 12V 65 Ah (Batteries AGM Haute Décharge)';
    if (requiredBatteryCapacityAh <= 100) return '2 × 12V 100 Ah (Armoire Batterie Déportée)';
    return '4 × 12V 120 Ah (Configuration Parallèle-Série avec Surveillance BMS)';
  }, [requiredBatteryCapacityAh]);

  // =========================================================================
  // PILLAR 6: BUILDING MANAGEMENT SYSTEM (BMS / GTB BACNET & KNX)
  // =========================================================================
  const [bmsProtocol, setBmsProtocol] = useState<'BACNET_IP' | 'MODBUS_TCP' | 'KNX_TP' | 'MQTT_IOT'>('BACNET_IP');
  const [hvacUnitsSupervised, setHvacUnitsSupervised] = useState<number>(16);
  const [energyMetersModbus, setEnergyMetersModbus] = useState<number>(24);
  const [lightingDaliGateways, setLightingDaliGateways] = useState<number>(8);
  const [fireIntegrationTripOk, setFireIntegrationTripOk] = useState<boolean>(true);

  const totalBmsPoints = (hvacUnitsSupervised * 18) + (energyMetersModbus * 12) + (lightingDaliGateways * 64);

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans pb-16">
      
      {/* 0. AUTHORITATIVE ECOSYSTEM HERO (DISTRIBUTION & ELV INTEGRATION) */}
      <AuthoritativeEcosystemHero
        stage="distribution"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={locale === 'fr' ? STAGES_CONFIG[store.activeStage].titleFr : STAGES_CONFIG[store.activeStage].titleEn}
        totalPillarsCount={5}
      />

      {/* 1. EXECUTIVE ORIENTATION BANNER (THE 7 FUNDAMENTAL QUESTIONS) */}
      <ElvOrientationBanner
        locale={locale}
        onNavigateStage={(st) => store.setActiveStage(st)}
        onNavigateDomain={(dCode) => onNavigate?.('domain', dCode)}
      />

      {/* 2. COMMAND HEADER HUD & 5-STAGE PROGRESSIVE SIZING ENGINE */}
      <ElvCommandHeader
        locale={locale}
        activeStage={store.activeStage}
        onSelectStage={(st) => store.setActiveStage(st)}
        selectedBuildingId={store.selectedBuildingId}
        onSelectBuilding={handleSelectBuilding}
        activeProfile={store.activeBuildingProfile}
        calculations={store.calculations}
        onOpenDossier={handleOpenDossier}
        onOpenPrinciplesModal={() => setIsFormulasModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* PROGRESSIVE STAGE 1: VDI INFRASTRUCTURE, FIBER LINK BUDGET & POE POWER   */}
      {/* ========================================================================= */}
      {store.activeStage === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Stage Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {STAGES_CONFIG[1].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[1].titleFr : STAGES_CONFIG[1].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage1Tab('FIBER_LINK')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'FIBER_LINK'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                {locale === 'fr' ? '1.1 Bilan Optique TIA-568 & OTDR' : '1.1 Fiber Budget & OTDR Trace'}
              </button>
              <button
                onClick={() => setStage1Tab('POE_BUDGET')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'POE_BUDGET'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {locale === 'fr' ? '1.2 Bilan de Puissance PoE & Thermique' : '1.2 PoE Power & Heat Dissipation'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 1.1: Optical Fiber Link Budget & OTDR Trace */}
          {stage1Tab === 'FIBER_LINK' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                      {locale === 'fr' ? 'Calculateur de Bilan Optique & Budget de Puissance (TIA-568 / ISO 11801)' : 'Optical Fiber Power Budget & Loss Margin Calculator'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Calcul rigoureux de l'atténuation cumulée (câble, épissures à fusion d'arc, connecteurs d'extrémité LC/SC) et marge de sécurité pour liaisons campus et backbones verticaux.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border ${
                  isFiberLinkPass ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                }`}>
                  {isFiberLinkPass ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {isFiberLinkPass ? 'LIEN CERTIFIÉ CONFORME (PASS)' : 'ATTÉNUATION EXCESSIVE (FAIL)'}
                </div>
              </div>

              {/* INPUT PARAMETERS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Type de Fibre Optique</span>
                  <select
                    value={fiberType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFiberType(val);
                      if (val === 'OS2_SINGLEMODE') setWavelengthNm(1310);
                      else setWavelengthNm(850);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                  >
                    <option value="OS2_SINGLEMODE">OS2 Monomode 9/125 µm (Longue distance)</option>
                    <option value="OM4_MULTIMODE">OM4 Multimode 50/125 µm (10G/40G)</option>
                    <option value="OM3_MULTIMODE">OM3 Multimode 50/125 µm (Tertiaire)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">
                    Longueur d'onde : {wavelengthNm} nm · Coeff : {fiberAttenuationDbPerKm} dB/km
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Distance de la Liaison</span>
                    <span className="text-amber-400 font-bold">{linkDistanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="20.0"
                    step="0.1"
                    value={linkDistanceKm}
                    onChange={(e) => setLinkDistanceKm(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Perte câble brut : {lossCableDb.toFixed(2)} dB</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Épissures à Fusion (0.05 dB)</span>
                    <span className="text-amber-400 font-bold">{fusionSpliceCount}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={fusionSpliceCount}
                    onChange={(e) => setFusionSpliceCount(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Perte soudures : {lossSplicesDb.toFixed(2)} dB</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Paires Connecteurs (0.35 dB)</span>
                    <span className="text-amber-400 font-bold">{connectorPairsCount}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={connectorPairsCount}
                    onChange={(e) => setConnectorPairsCount(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Pigtails / Traversées : {lossConnectorsDb.toFixed(2)} dB</div>
                </div>
              </div>

              {/* METRICS SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Puissance Émetteur TX</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{txOpticalPowerDbm.toFixed(1)} dBm</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Transceiver SFP+ 10GBASE</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Atténuation Totale du Lien</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{totalLinkAttenuationDb.toFixed(2)} dB</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Câble + Épissures + Connecteurs</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Puissance Reçue RX</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">{receivedPowerDbm.toFixed(2)} dBm</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Seuil minimal requis : {rxSensitivityDbm} dBm</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Marge Nette (Réserve 3 dB)</div>
                  <div className={`text-2xl font-bold font-mono mt-2 ${netPowerMarginDb >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {netPowerMarginDb.toFixed(2)} dB
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {netPowerMarginDb >= 0 ? 'Marge de sécurité validée' : 'Perte de trames & instabilité'}
                  </div>
                </div>
              </div>

              {/* OTDR REFLECTOMETRY CURVE VISUALIZATION */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-300 uppercase">
                    Profil Réflectométrique Virtuel OTDR (Événements de Perte &amp; Échos Fresnel)
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">Échelle : 0 à {linkDistanceKm} km</span>
                </div>

                <div className="relative h-44 bg-slate-900/70 rounded-lg p-2 border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="2 2" />

                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      points="0,15 15,10 20,40 180,55 185,62 340,78 345,85 480,98 485,75 490,115"
                    />
                    <circle cx="20" cy="40" r="3" fill="#38bdf8" />
                    <circle cx="185" cy="62" r="3" fill="#ec4899" />
                    <circle cx="345" cy="85" r="3" fill="#ec4899" />
                    <circle cx="485" cy="75" r="3" fill="#38bdf8" />
                  </svg>

                  <div className="absolute top-2 left-4 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    Connecteur Départ (TX)
                  </div>
                  <div className="absolute top-12 left-1/3 text-[10px] font-mono text-pink-400 bg-slate-900/80 px-2 py-0.5 rounded border border-pink-500/30">
                    Épissure Fusion (-0.05 dB)
                  </div>
                  <div className="absolute bottom-2 right-4 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    Fin de Fibre / Connecteur RX
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 1.2: PoE Power Budget & Thermal Dissipation */}
          {stage1Tab === 'POE_BUDGET' && (
            <PoEPowerBudgetCalculator locale={locale} />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRESSIVE STAGE 2: ELECTRONIC SECURITY, IP CCTV & ACCESS CONTROL       */}
      {/* ========================================================================= */}
      {store.activeStage === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Stage Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {STAGES_CONFIG[2].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[2].titleFr : STAGES_CONFIG[2].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage2Tab('CCTV_RAID')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'CCTV_RAID'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                {locale === 'fr' ? '2.1 Vidéosurveillance IP & RAID' : '2.1 IP CCTV & RAID 5/6'}
              </button>
              <button
                onClick={() => setStage2Tab('ACCESS_INTERLOCK')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'ACCESS_INTERLOCK'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {locale === 'fr' ? '2.2 Contrôle d\'Accès & Sas Sas' : '2.2 Access Control & Airlocks'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 2.1: IP CCTV Bandwidth, RAID Storage & DORI Optics */}
          {stage2Tab === 'CCTV_RAID' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    {locale === 'fr' ? 'Banc de Dimensionnement Vidéosurveillance IP & Optique DORI' : 'IP CCTV Bandwidth, RAID Storage & DORI Optics Workbench'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Calcul du débit réseau cumulé, modélisation des grappes RAID 5/6 pour enregistreurs NVR et vérification de la résolution focale DORI (IEC 62676-4).
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 px-2">Codec :</span>
                  {(['H264', 'H265', 'H265_PLUS'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setVideoCodec(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        videoCodec === c ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Nombre de Caméras</span>
                    <span className="text-amber-400 font-bold">{cameraCount}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={cameraCount}
                    onChange={(e) => setCameraCount(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Parc caméras tertiaire / hôtel</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Résolution Capteur</span>
                  <select
                    value={cameraResolution}
                    onChange={(e) => setCameraResolution(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                  >
                    <option value="2MP_1080P">2 MP Full HD (1920 × 1080)</option>
                    <option value="4MP_2K">4 MP Super HD (2560 × 1440)</option>
                    <option value="8MP_4K">8 MP Ultra HD 4K (3840 × 2160)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Bitrate unitaire : {unitCameraBitrateMbps} Mbps</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Rétention (Jours)</span>
                    <span className="text-amber-400 font-bold">{retentionDays} j</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    step="1"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Obligation légale standard : 30 jours</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Architecture RAID NVR</span>
                  <select
                    value={raidConfig}
                    onChange={(e) => setRaidConfig(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                  >
                    <option value="RAID0">RAID 0 (Aucune redondance)</option>
                    <option value="RAID1">RAID 1 (Miroir 1:1)</option>
                    <option value="RAID5">RAID 5 (Tolérance 1 disque HS)</option>
                    <option value="RAID6">RAID 6 (Tolérance 2 disques HS - Recommandé)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Disques 8 To Entreprise Surveillance</div>
                </div>
              </div>

              {/* STORAGE METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Bande Passante Cumulée</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{totalAggregatedBandwidthMbps} Mbps</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Flux réseau commuté PoE</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Volume Stockage Brut Requis</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{netRequiredStorageTb} To</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Inclus 15% marge filesystem</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Nombre de Disques 8 To ({raidConfig})</div>
                  <div className="text-2xl font-bold font-mono text-purple-400 mt-2">{requiredDiskCount} Disques</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Capacité utile : {grossUsableStorageTb} To</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Format NVR Recommandé</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-2">
                    {requiredDiskCount <= 4 ? '1U Rack (4 Baies)' : requiredDiskCount <= 8 ? '2U Rack (8 Baies SAS)' : '3U/4U Rack (16 Baies)'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Double alimentation redondante</div>
                </div>
              </div>

              {/* DORI OPTICS SIMULATOR (EN 62676-4) */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-amber-400" />
                      Calculateur Optique DORI (IEC 62676-4)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Densité de pixels au mètre (PPM) en fonction de la distance cible et de la focale de l'objectif.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Niveau Atteint :</span>
                    <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border border-current/30 bg-slate-900 ${doriCategory.color}`}>
                      {doriCategory.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Focale Objectif</span>
                      <span className="text-amber-400 font-bold">{lensFocalLengthMm} mm</span>
                    </div>
                    <select
                      value={lensFocalLengthMm}
                      onChange={(e) => setLensFocalLengthMm(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                    >
                      <option value="2.8">2.8 mm (Grand angle ~ 108°)</option>
                      <option value="4.0">4.0 mm (Angle standard ~ 85°)</option>
                      <option value="6.0">6.0 mm (Angle serré ~ 53°)</option>
                      <option value="12.0">12.0 mm (Téléobjectif ~ 25°)</option>
                    </select>
                    <div className="text-[10px] font-mono text-slate-500">Angle horizontal réel : {horizontalFovDeg}°</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Distance de la Cible</span>
                      <span className="text-amber-400 font-bold">{targetDistanceM} mètres</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={targetDistanceM}
                      onChange={(e) => setTargetDistanceM(parseInt(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="text-[10px] font-mono text-slate-500">Largeur scène au sol : {sceneWidthAtTargetM} m</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-xs font-mono text-slate-400">Densité Pixels au Mètre (PPM)</div>
                    <div className="text-xl font-bold font-mono text-white">{ppmAtTarget} PPM</div>
                    <div className="text-[10px] text-slate-400">
                      Seuil identification judiciaire visage : <span className="text-emerald-400 font-bold">250 PPM</span>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2.2: Electronic Access Control & Airlock Interlocks */}
          {stage2Tab === 'ACCESS_INTERLOCK' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    {locale === 'fr' ? 'Banc de Contrôle d\'Accès Sécurisé & Sas d\'Interverrouillage' : 'Secure Access Control & Airlock Interlock Engine'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Gestion des ventouses électromagnétiques, gâches à rupture (Fail-Safe), alimentation secourue 12V/24V et logique d'interverrouillage sas anti-passback.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFireEsdTripActive(!fireEsdTripActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      fireEsdTripActive
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {fireEsdTripActive ? 'DÉVERROUILLAGE INCENDIE ACTIF' : 'TEST DÉCLENCHEUR INCENDIE'}
                  </button>
                </div>
              </div>

              {/* LOCK CONFIGURATION */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Verrouillage Électronique</span>
                  <select
                    value={doorLockType}
                    onChange={(e) => setDoorLockType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="MAGNETIC_LOCK_300KG">Ventouse Électromagnétique 300 kg (Fail-Safe)</option>
                    <option value="MAGNETIC_LOCK_600KG">Ventouse Électromagnétique 600 kg (Haute Sécurité)</option>
                    <option value="ELECTRIC_STRIKE_FAIL_SECURE">Gâche Électrique (Fail-Secure / Émission)</option>
                    <option value="MOTORIZED_BOLT">Pêne Motorisé Temporisé 1000 kg</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Mode : {lockPowerSpecs.failMode}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">Consommation Unitaire</div>
                  <div className="text-2xl font-bold font-mono text-amber-400">{lockPowerSpecs.currentMa} mA</div>
                  <div className="text-[10px] font-mono text-slate-500">Tension de travail : {lockPowerSpecs.voltageV}V DC</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">Force de Rétention Mécanique</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{lockPowerSpecs.holdingForceKg} kg</div>
                  <div className="text-[10px] font-mono text-slate-500">Résistance à l'effraction certifiée</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">Interverrouillage Sas Actif</div>
                  <button
                    onClick={() => setAirlockInterlockEnabled(!airlockInterlockEnabled)}
                    className={`w-full py-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                      airlockInterlockEnabled
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {airlockInterlockEnabled ? 'SAS ACTIF (ANTI-PASSBACK)' : 'PORTES INDÉPENDANTES'}
                  </button>
                  <div className="text-[10px] font-mono text-slate-500">Interdit l'ouverture simultanée</div>
                </div>
              </div>

              {/* INTERACTIVE AIRLOCK SIMULATION */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                  <span>Simulation Dynamique de Sas d'Accès Sécurisé (Porte 1 ↔ Porte 2)</span>
                  <span className="text-[11px] text-amber-400">Zone Tampon Entre-Deux Portes</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  {/* Door 1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">PORTE 1 (Extérieur ➔ Sas)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${door1Open ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {door1Open ? 'OUVERTE' : 'VERROUILLÉE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        disabled={!canOpenDoor1 && !door1Open}
                        onClick={() => setDoor1Open(!door1Open)}
                        className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                          door1Open
                            ? 'bg-rose-600 text-white'
                            : canOpenDoor1
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-900'
                        }`}
                      >
                        {door1Open ? 'Fermer Porte 1' : canOpenDoor1 ? 'Badge Lecteur 1 (Ouvrir)' : 'Interverrouillée (Bloquée)'}
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      État capteur position : {door1Open ? 'Contact REED Ouvert' : 'Contact REED Aligné'}
                    </div>
                  </div>

                  {/* Door 2 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">PORTE 2 (Sas ➔ Zone Sensible)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${door2Open ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {door2Open ? 'OUVERTE' : 'VERROUILLÉE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        disabled={!canOpenDoor2 && !door2Open}
                        onClick={() => setDoor2Open(!door2Open)}
                        className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                          door2Open
                            ? 'bg-rose-600 text-white'
                            : canOpenDoor2
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-900'
                        }`}
                      >
                        {door2Open ? 'Fermer Porte 2' : canOpenDoor2 ? 'Badge Lecteur 2 (Ouvrir)' : 'Interverrouillée (Bloquée)'}
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      État capteur position : {door2Open ? 'Contact REED Ouvert' : 'Contact REED Aligné'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRESSIVE STAGE 3: FIRE ALARM SSI CAT. A, VOICE ALARM & BATTERY 72H     */}
      {/* ========================================================================= */}
      {store.activeStage === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Stage Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {STAGES_CONFIG[3].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[3].titleFr : STAGES_CONFIG[3].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage3Tab('FIRE_SSI')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'FIRE_SSI'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                {locale === 'fr' ? '3.1 Détection SSI & Décibels EN 54' : '3.1 Fire SSI & Acoustic dB'}
              </button>
              <button
                onClick={() => setStage3Tab('BATTERY_EN54')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'BATTERY_EN54'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                {locale === 'fr' ? '3.2 Autonomie Batteries 72h (EN 54-4)' : '3.2 Battery Autonomy 72h (EN 54-4)'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 3.1: Fire SSI Cat. A & Acoustic SPL dB Calculator */}
          {stage3Tab === 'FIRE_SSI' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500" />
                    {locale === 'fr' ? 'Système de Sécurité Incendie (SSI Cat. A) & Évacuation Vocale' : 'Life Safety Fire Alarm SSI Cat. A & Voice Evacuation'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Conformité NF S 61-936 et EN 54. Boucles de détection rebouclées, asservissements CMSI (désenfumage, portes coupe-feu) et calcul acoustique en ligne 100V.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border ${
                  isAlarmAcousticCompliant ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                }`}>
                  {isAlarmAcousticCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {isAlarmAcousticCompliant ? 'ACOUSTIQUE CONFORME (≥ 65 dB & +10 dB)' : 'NON CONFORME (NIVEAU INSUFFISANT)'}
                </div>
              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Catégorie SSI</span>
                  <select
                    value={ssiCategory}
                    onChange={(e) => setSsiCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="CAT_A">Catégorie A (SDI Adressable + CMSI)</option>
                    <option value="CAT_B">Catégorie B (CMSI sans SDI automatique)</option>
                    <option value="CAT_C">Catégorie C (Dispositif Actionné de Sécurité)</option>
                    <option value="CAT_D">Catégorie D (Alarme Manuelle Simplifiée)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Exigé pour IGH / ERP 1ère catégorie</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Boucles de Détection Rebouclées</span>
                    <span className="text-amber-400 font-bold">{detectorLoopsCount}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={detectorLoopsCount}
                    onChange={(e) => setDetectorLoopsCount(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Isolateurs de court-circuit intégrés</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Bruit Ambiant Normal</span>
                    <span className="text-amber-400 font-bold">{ambientNoiseLevelDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="85"
                    value={ambientNoiseLevelDb}
                    onChange={(e) => setAmbientNoiseLevelDb(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Bureaux : 55 dB · Hall public : 65 dB</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Distance Diffuseur / Occupant</span>
                    <span className="text-amber-400 font-bold">{listenerDistanceMeters} m</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={listenerDistanceMeters}
                    onChange={(e) => setListenerDistanceMeters(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Atténuation acoustique en 1/d²</div>
                </div>
              </div>

              {/* ACOUSTIC METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Sensibilité Haut-Parleur 100V</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{speakerSensitivityDb} dB</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">@ 1W / 1m (EN 54-24)</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Puissance Réglée (Wattage Tap)</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{speakerTapWatts} W</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Ligne 100 Volts transformateur</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Pression Acoustique Reçue (Lp)</div>
                  <div className={`text-2xl font-bold font-mono mt-2 ${receivedSoundPressureDb >= 65 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {receivedSoundPressureDb} dB SPL
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Seuil minimal normalisé : 65 dB</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Émergence Vocale (SNR)</div>
                  <div className={`text-2xl font-bold font-mono mt-2 ${soundSignalToNoiseRatioDb >= 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    +{soundSignalToNoiseRatioDb} dB
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Requis : +10 dB au-dessus du bruit ambiant</div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3.2: Life Safety Battery Autonomy per EN 54-4 */}
          {stage3Tab === 'BATTERY_EN54' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <BatteryCharging className="w-5 h-5 text-amber-400" />
                    {locale === 'fr' ? 'Bilan d\'Énergie & Dimensionnement Batteries de Sécurité (EN 54-4)' : 'Life Safety Battery Sizing & Power Budget (EN 54-4 / NF S 61-936)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Formule normalisée : C_min = 1.25 × [(I_veille × T_veille) + (I_alarme × T_alarme)]. Autonomie obligatoire 72h sans énergie secteur (ou 24h avec groupe électrogène).
                  </p>
                </div>

                <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                  Batteries 24V DC (2 × 12V Plomb Étanche VRLA)
                </div>
              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Courant Veille (I1)</span>
                    <span className="text-amber-400 font-bold">{quiescentCurrentA} A</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.05"
                    value={quiescentCurrentA}
                    onChange={(e) => setQuiescentCurrentA(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Centrale + détecteurs + relais</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Autonomie Veille (T1)</span>
                    <span className="text-amber-400 font-bold">{standbyHoursRequired} h</span>
                  </div>
                  <select
                    value={standbyHoursRequired}
                    onChange={(e) => setStandbyHoursRequired(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="24">24 heures (Bâtiment avec Groupe Secouru)</option>
                    <option value="48">48 heures (Site Semi-Surveillé)</option>
                    <option value="72">72 heures (Site Isolé sans Présence Permanente - EN 54-4)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Exigence stricte EN 54-4</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Courant Alarme Générale (I2)</span>
                    <span className="text-amber-400 font-bold">{alarmCurrentA} A</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="20.0"
                    step="0.5"
                    value={alarmCurrentA}
                    onChange={(e) => setAlarmCurrentA(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Sirènes + flashs + asservissements</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Durée Alarme (T2)</span>
                    <span className="text-amber-400 font-bold">{alarmTimeMinutes} min</span>
                  </div>
                  <select
                    value={alarmTimeMinutes}
                    onChange={(e) => setAlarmTimeMinutes(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="15">15 minutes (Standard ERP léger)</option>
                    <option value="30">30 minutes (Requis IGH / ERP complexe)</option>
                    <option value="60">60 minutes (Aéroports / Sites classés)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Évacuation complète du personnel</div>
                </div>
              </div>

              {/* BATTERY SIZING RESULTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Capacité Mathématique Minimale</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{requiredBatteryCapacityAh} Ah</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Inclus coefficient de vieillissement × 1.25</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Recommandation Commerciale VRLA</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-2">{commercialBatteryRecommendation}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Durée de vie garantie 10 ans @ 20°C</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Courant de Recharge Chargeur AES</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{(requiredBatteryCapacityAh * 0.1).toFixed(1)} A</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Recharge 80% en moins de 24 heures (EN 54-4)</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRESSIVE STAGE 4: BUILDING MANAGEMENT SYSTEM (BMS / GTB)               */}
      {/* ========================================================================= */}
      {store.activeStage === 4 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Stage Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {STAGES_CONFIG[4].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[4].titleFr : STAGES_CONFIG[4].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 bg-amber-500 text-slate-950 shadow-md font-extrabold"
              >
                <Building2 className="w-3.5 h-3.5" />
                {locale === 'fr' ? '4.1 Supervision GTB BACnet & KNX' : '4.1 BMS BACnet & KNX Engine'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  {locale === 'fr' ? 'Gestion Technique du Bâtiment (GTB) & Intégration BACnet' : 'Building Management System (BMS / GTB BACnet IP & KNX)'}
                </h2>
                <p className="text-xs text-slate-400">
                  Supervision énergétique centralisée, régulation CVC multizone, gestion de l'éclairage DALI/KNX et passerelles d'intégration multi-protocoles.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['BACNET_IP', 'MODBUS_TCP', 'KNX_TP', 'MQTT_IOT'] as const).map((proto) => (
                  <button
                    key={proto}
                    onClick={() => setBmsProtocol(proto)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      bmsProtocol === proto ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>

            {/* BMS EQUIPMENT QUANTITIES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Centrales de Traitement d'Air (CTA/VRV)</span>
                  <span className="text-amber-400 font-bold">{hvacUnitsSupervised}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="48"
                  value={hvacUnitsSupervised}
                  onChange={(e) => setHvacUnitsSupervised(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">18 points physiques par centrale CVC</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Compteurs Énergie (Modbus RTU/TCP)</span>
                  <span className="text-amber-400 font-bold">{energyMetersModbus}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={energyMetersModbus}
                  onChange={(e) => setEnergyMetersModbus(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">12 registres (kWh, kVA, PF, U, I, THD)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Passerelles DALI / KNX Éclairage</span>
                  <span className="text-amber-400 font-bold">{lightingDaliGateways}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={lightingDaliGateways}
                  onChange={(e) => setLightingDaliGateways(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">64 ballasts adressables par bus DALI</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400">Total Points GTB I/O</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{totalBmsPoints} Points</div>
                <div className="text-[10px] font-mono text-slate-500">Variables physiques &amp; virtuelles</div>
              </div>
            </div>

            {/* FIELDBUS STATUS TABLE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Architecture Contrôleurs DDC</div>
                <div className="text-sm font-bold font-mono text-white mt-2">
                  {Math.ceil(totalBmsPoints / 64)} Automates DDC BACnet/IP
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Modules d'E/S déportés sur bus RS485</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Taux de Rafraîchissement Scada</div>
                <div className="text-sm font-bold font-mono text-cyan-400 mt-2">2.0 s (Polling haute vitesse)</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Changement d'état (COV - Change of Value)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Arrêt d'Urgence CVC sur Alerte SSI</div>
                <div className={`text-sm font-bold font-mono mt-2 ${fireIntegrationTripOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fireIntegrationTripOk ? 'RELIÉ PAR CONTACT SEC NF' : 'ERREUR LIAISON'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Coupure hardwired prioritaire</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRESSIVE STAGE 5: COMMISSIONING, CAMEROON CASES & STAMPED DQE FCFA    */}
      {/* ========================================================================= */}
      {store.activeStage === 5 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Stage Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {STAGES_CONFIG[5].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[5].titleFr : STAGES_CONFIG[5].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage5Tab('CAMEROON_CASES')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'CAMEROON_CASES'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                {locale === 'fr' ? '5.1 Chantiers & Cas Réels Cameroun' : '5.1 Cameroon Field Cases'}
              </button>
              <button
                onClick={() => setStage5Tab('DELIVERABLES_BOQ')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'DELIVERABLES_BOQ'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {locale === 'fr' ? '5.2 Dossier Technique & Devis DQE' : '5.2 Stamped Technical BOQ/DQE'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 5.1: Cameroon Field Forensic Cases */}
          {stage5Tab === 'CAMEROON_CASES' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  {locale === 'fr' ? 'Retours d\'Expérience & Chantiers Courants Faibles au Cameroun' : 'Cameroon High-Profile ELV & Life Safety Field Engineering Cases'}
                </h2>
                <p className="text-xs text-slate-400">
                  Analyses techniques de grands projets d'infrastructures camerounaises confrontés au climat équatorial humide, aux surtensions kérauniques et aux exigences critiques de disponibilité.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Case 1: Yaoundé Nsimalen Airport */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                      <span>Aéroport International</span>
                      <span>ADC S.A.</span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase">
                      Aéroport International de Yaoundé-Nsimalen (GTB &amp; SSI Cat. A)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Rénovation intégrale du SSI et de la GTB : 850 détecteurs optiques adressables insensibles à la poussière d'harmattan, asservissement automatique des rideaux coupe-feu de la zone fret et boucle fibre optique redondante inter-aérogares.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    Normes : EN 54 · OACI Annexe 14 · NF S 61-936
                  </div>
                </div>

                {/* Case 2: Port Autonome de Douala */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                      <span>Infrastructures Portuaires</span>
                      <span>PAD / ISPS</span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase">
                      Vidéosurveillance &amp; Contrôle d'Accès du Port de Douala (Code ISPS)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Déploiement de 180 caméras PTZ marines longue portée (indice anticorrosion C5-M contre les embruns marins salins de l'estuaire du Wouri), serveurs en cluster RAID 6 et contrôle d'accès biométrique des sas de terminaux à conteneurs.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    Normes : Code ISPS · IEC 62676 · Protection IP67/IK10
                  </div>
                </div>

                {/* Case 3: Hôtel Hilton Yaoundé */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                      <span>Hôtellerie 5 Étoiles</span>
                      <span>Hilton Worldwide</span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase">
                      Câblage Structuré 10G &amp; Évacuation Vocale (Hôtel Hilton Yaoundé)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Câblage structuré Cat 6A blindé F/UTP à faible émission de fumée sans halogène (LSZH), 250 bornes WiFi 6 managées, sonorisation de sécurité 100V avec contrôle d'intelligibilité vocale STI-PA &gt; 0.55 dans les 250 chambres et suites.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    Normes : TIA-568.2-D · ISO 11801 · IEC 60849
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5.2: Stamped Technical Synthesis & Itemized DQE BOQ */}
          {stage5Tab === 'DELIVERABLES_BOQ' && (
            <ElvDeliverablesExportEngine
              locale={locale}
              profile={store.activeBuildingProfile}
              calculations={store.calculations}
              cameraCount={cameraCount}
              accessDoorsCount={accessDoorsCount}
              ssiLoopsCount={detectorLoopsCount}
              fiberDistanceKm={linkDistanceKm}
              onJumpToStage={(st) => store.setActiveStage(st as any)}
            />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATHEMATICAL PRINCIPLES & FORMULATIONS MODAL                              */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#090D14] border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222B38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Formulations Mathématiques & Principes Directeurs' : 'Mathematical Formulations & ELV Standards'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    TIA-568.2-D · IEC 62676-4 · EN 54-4 · IEEE 802.3bt · ISO 7240
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulas Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              {/* Formula 1: Optical Loss */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">1. Bilan Optique &amp; Perte Maximale (TIA-568)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                  A_total (dB) = α · L + N_splice · A_splice + N_conn · A_conn + M_safety
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Où α est le coefficient d'atténuation linéique (0.35 dB/km pour OS2 @ 1310nm), L la longueur en km, A_splice ≤ 0.05 dB par soudure à fusion d'arc, A_conn ≤ 0.35 dB par paire de connecteurs LC/SC, et M_safety = 3.0 dB de réserve thermique et vieillissement.
                </p>
              </div>

              {/* Formula 2: DORI Spatial Resolution */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px]">2. Résolution DORI &amp; PPM (IEC 62676-4)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs">
                  PPM = N_pix / [ 2 · D · tan(θ / 2) ]
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Où PPM est la densité de pixels par mètre sur la cible, N_pix la résolution horizontale du capteur (ex. 2560 px pour 4MP), D la distance de la cible en mètres, et θ l'angle de champ horizontal de l'objectif (FOV). Détection ≥ 25 PPM, Reconnaissance ≥ 125 PPM, Identification ≥ 250 PPM.
                </p>
              </div>

              {/* Formula 3: CCTV Storage RAID 5/6 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold uppercase text-[11px]">3. Stockage Vidéo H.265+ &amp; Grappe RAID</span>
                <div className="p-3 bg-slate-900 rounded-lg text-purple-300 font-mono text-xs">
                  V_stock (To) = [ N_cam · B_mbps · 3600 · H · J ] / (8 × 10^6) × 1.15
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Calcul du volume net avec facteur de surcharge d'indexation système de 15%. En RAID 5, ajouter 1 disque de parité. En RAID 6 (recommandé pour disques &gt; 4 To afin d'éviter la perte lors de reconstruction URE), ajouter 2 disques de parité dédiée.
                </p>
              </div>

              {/* Formula 4: Acoustic SPL Decay */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold uppercase text-[11px]">4. Pression Acoustique &amp; Évacuation Vocale (EN 54-24)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-rose-300 font-mono text-xs">
                  L_p (dB SPL) = L_s + 10 · log10(P_watts) - 20 · log10(d_mètres)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Où L_s est la sensibilité à 1W/1m, P_watts la puissance injectée par le transformateur 100V, et d la distance d'écoute. La norme EN 54 impose L_p ≥ 65 dB SPL et un rapport signal-sur-bruit d'au moins +10 dB au-dessus du bruit ambiant mesuré.
                </p>
              </div>

              {/* Formula 5: EN 54-4 Battery Autonomy */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">5. Autonomie Batteries AES Sécurité (EN 54-4)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-amber-300 font-mono text-xs">
                  C_min (Ah) = 1.25 × [ (I_veille · T_veille) + (I_alarme · T_alarme / 60) ]
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Application stricte du facteur de sécurité 1.25 (compensation du vieillissement des plaques de plomb et décharge à basse température). T_veille = 72h pour sites sans groupe ou non surveillés 24/7, T_alarme = 30 min d'évacuation générale.
                </p>
              </div>

              {/* Formula 6: PoE Joule Loss & Thermal Dissipation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[11px]">6. Pertes Joule PoE &amp; Climatisation Salle Serveurs</span>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                  P_perte (W) = 2 · R_boucle · I^2 · L_câble &amp; BTU/h = P_dissip (W) × 3.412
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Modélisation de l'échauffement des torons de câbles Cat 6A / Cat 7 transportant 90W (PoE++ IEEE 802.3bt Type 4). Chaque Watt dissipé dans la baie VDI nécessite 3.412 BTU/h de puissance frigorifique dédiée dans le local technique.
                </p>
              </div>

            </div>

            {/* Modal Close Button */}
            <div className="flex justify-end pt-4 border-t border-[#222B38]">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                {locale === 'fr' ? 'Fermer le Manuel' : 'Close Reference'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER METADATA */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Ingénierie Courants Faibles conforme TIA-568, EN 54, EN 62676, IEEE 802.3bt &amp; BACnet</span>
        </div>
        <div>EPEDE Platform · Niveau de Maturité 5 (98%) · Cameroun C5-M &amp; Harmattan Compliant</div>
      </div>
    </div>
  );
};
