// src/components/elv/ExtraLowVoltageWorkbench.tsx
// EPEDE Domain D08 - Extra Low Voltage & Special Systems Engineering Workbench
// Level 5 Reference Quality compliant with TIA-568.2-D, ISO/IEC 11801, EN 54, NF S 61-936, EN 62676, IEC 60839-11, IEC 60849 & BACnet

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
  ShieldAlert
} from 'lucide-react';

interface ExtraLowVoltageWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarKey =
  | 'OPTICAL_FIBER_BUDGET'
  | 'CCTV_BANDWIDTH_RAID'
  | 'FIRE_ALARM_SSI'
  | 'ACCESS_CONTROL_INTERLOCK'
  | 'UPS_BATTERY_AUTONOMY'
  | 'BMS_GTB_BACNET'
  | 'CAMEROON_FORENSIC_CASES';

export const ExtraLowVoltageWorkbench: React.FC<ExtraLowVoltageWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('OPTICAL_FIBER_BUDGET');

  const pillars = useMemo(
    () => [
      {
        id: 'OPTICAL_FIBER_BUDGET' as PillarKey,
        num: 'P1',
        titleFr: 'Fibre Optique & Bilan de Liaison (TIA-568 / ISO 11801)',
        titleEn: 'Optical Fiber & Link Power Budget (TIA-568 / ISO 11801)',
        icon: Network,
        badgeFr: 'OS2 / OM4 · Épissures & Marge Optique',
        badgeEn: 'OS2 / OM4 · Splices & Power Margin'
      },
      {
        id: 'CCTV_BANDWIDTH_RAID' as PillarKey,
        num: 'P2',
        titleFr: 'Vidéosurveillance IP, Débit & Stockage RAID (EN 62676)',
        titleEn: 'IP CCTV Bandwidth, RAID & DORI Optics (EN 62676)',
        icon: Video,
        badgeFr: 'H.265+ · RAID 5/6 · Critères DORI',
        badgeEn: 'H.265+ · RAID 5/6 · DORI Criteria'
      },
      {
        id: 'FIRE_ALARM_SSI' as PillarKey,
        num: 'P3',
        titleFr: 'Sécurité Incendie SSI Cat. A & Évacuation Vocale (EN 54 / NFS 61-936)',
        titleEn: 'Fire Alarm SSI Cat. A & Voice Evacuation (EN 54 / NFS 61-936)',
        icon: Flame,
        badgeFr: 'Détection Adressable & Pression Acoustique',
        badgeEn: 'Addressable Loops & Sound Pressure dB'
      },
      {
        id: 'ACCESS_CONTROL_INTERLOCK' as PillarKey,
        num: 'P4',
        titleFr: 'Contrôle d\'Accès Sécurisé & Sas d\'Interverrouillage',
        titleEn: 'Access Control, Biometrics & Airlock Interlocks',
        icon: ShieldCheck,
        badgeFr: 'RFID MIFARE · Ventouses 12/24V · Sas Sas',
        badgeEn: 'RFID MIFARE · 12/24V Maglocks · Interlocks'
      },
      {
        id: 'UPS_BATTERY_AUTONOMY' as PillarKey,
        num: 'P5',
        titleFr: 'Bilan d\'Énergie & Autonomie Batteries de Sécurité',
        titleEn: 'Life Safety Battery Autonomy & UPS Sizing',
        icon: BatteryCharging,
        badgeFr: 'Norme EN 54-4 · 72h Veille + 30min Alarme',
        badgeEn: 'EN 54-4 Standard · 72h Standby + 30m Alarm'
      },
      {
        id: 'BMS_GTB_BACNET' as PillarKey,
        num: 'P6',
        titleFr: 'Gestion Technique du Bâtiment (GTB / BACnet & KNX)',
        titleEn: 'Building Management System (BMS / BACnet & KNX)',
        icon: Building2,
        badgeFr: 'Supervision CVC · Éclairage · Énergie',
        badgeEn: 'HVAC Supervision · Lighting · Energy'
      },
      {
        id: 'CAMEROON_FORENSIC_CASES' as PillarKey,
        num: 'P7',
        titleFr: 'Retours d\'Expérience Réels & Chantiers au Cameroun',
        titleEn: 'Cameroon High-Profile ELV Forensic Case Studies',
        icon: HardDrive,
        badgeFr: 'Aéroport Nsimalen · Douala Port · Hilton Ydé',
        badgeEn: 'Nsimalen Airport · Douala Port · Hilton Ydé'
      }
    ],
    []
  );

  // =========================================================================
  // PILLAR 1: OPTICAL FIBER LINK BUDGET CALCULATOR
  // =========================================================================
  const [fiberType, setFiberType] = useState<'OS2_SINGLEMODE' | 'OM4_MULTIMODE' | 'OM3_MULTIMODE'>('OS2_SINGLEMODE');
  const [wavelengthNm, setWavelengthNm] = useState<number>(1310);
  const [linkDistanceKm, setLinkDistanceKm] = useState<number>(4.5);
  const [fusionSpliceCount, setFusionSpliceCount] = useState<number>(6);
  const [connectorPairsCount, setConnectorPairsCount] = useState<number>(4);
  const [txOpticalPowerDbm, setTxOpticalPowerDbm] = useState<number>(-3.0); // e.g., 10GBASE-LR SFP+ min output
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
  const [cameraCount, setCameraCount] = useState<number>(32);
  const [cameraResolution, setCameraResolution] = useState<'2MP_1080P' | '4MP_2K' | '8MP_4K'>('4MP_2K');
  const [videoCodec, setVideoCodec] = useState<'H264' | 'H265' | 'H265_PLUS'>('H265_PLUS');
  const [recordingHoursPerDay, setRecordingHoursPerDay] = useState<number>(24);
  const [retentionDays, setRetentionDays] = useState<number>(30); // 30 days mandatory for commercial/hospitality
  const [raidConfig, setRaidConfig] = useState<'RAID0' | 'RAID1' | 'RAID5' | 'RAID6'>('RAID5');
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
  // Sensor 1/2.8" (width ~ 5.38 mm, height ~ 3.02 mm)
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
  const [detectorsPerLoop, setDetectorsPerLoop] = useState<number>(64); // max 128 per EN 54 addressable loop
  const [speakerTapWatts, setSpeakerTapWatts] = useState<number>(6.0); // 1.5W, 3W, 6W on 100V line
  const [speakerSensitivityDb, setSpeakerSensitivityDb] = useState<number>(92); // dB SPL @ 1W / 1m
  const [listenerDistanceMeters, setListenerDistanceMeters] = useState<number>(6.0);
  const [ambientNoiseLevelDb, setAmbientNoiseLevelDb] = useState<number>(65); // dB SPL

  // Sound Pressure Level at listener position:
  // Lp = Ls + 10 * log10(Power) - 20 * log10(Distance)
  const receivedSoundPressureDb = useMemo(() => {
    const val = speakerSensitivityDb + 10 * Math.log10(speakerTapWatts) - 20 * Math.log10(listenerDistanceMeters);
    return parseFloat(val.toFixed(1));
  }, [speakerSensitivityDb, speakerTapWatts, listenerDistanceMeters]);

  const soundSignalToNoiseRatioDb = parseFloat((receivedSoundPressureDb - ambientNoiseLevelDb).toFixed(1));
  const isAlarmAcousticCompliant = receivedSoundPressureDb >= 65 && soundSignalToNoiseRatioDb >= 10;

  // =========================================================================
  // PILLAR 4: ELECTRONIC ACCESS CONTROL & AIRLOCK INTERLOCKS
  // =========================================================================
  const [doorLockType, setDoorLockType] = useState<'MAGNETIC_LOCK_300KG' | 'MAGNETIC_LOCK_600KG' | 'ELECTRIC_STRIKE_FAIL_SECURE' | 'MOTORIZED_BOLT'>('MAGNETIC_LOCK_300KG');
  const [airlockInterlockEnabled, setAirlockInterlockEnabled] = useState<boolean>(true);
  const [door1Open, setDoor1Open] = useState<boolean>(false);
  const [door2Open, setDoor2Open] = useState<boolean>(false);
  const [badgeSwipeAuthorized, setBadgeSwipeAuthorized] = useState<boolean>(false);
  const [fireEsdTripActive, setFireEsdTripActive] = useState<boolean>(false);

  const lockPowerSpecs = useMemo(() => {
    if (doorLockType === 'MAGNETIC_LOCK_300KG') return { holdingForceKg: 300, currentMa: 480, voltageV: 12, failMode: 'Fail-Safe (Déverrouillé sans courant)' };
    if (doorLockType === 'MAGNETIC_LOCK_600KG') return { holdingForceKg: 600, currentMa: 600, voltageV: 12, failMode: 'Fail-Safe (Déverrouillé sans courant)' };
    if (doorLockType === 'ELECTRIC_STRIKE_FAIL_SECURE') return { holdingForceKg: 450, currentMa: 250, voltageV: 12, failMode: 'Fail-Secure (Verrouillé sans courant)' };
    return { holdingForceKg: 1000, currentMa: 900, voltageV: 24, failMode: 'Motorisé temporisé' };
  }, [doorLockType]);

  // Interlock logic
  const canOpenDoor2 = useMemo(() => {
    if (fireEsdTripActive) return true; // Fire emergency opens all security exits
    if (!airlockInterlockEnabled) return true;
    return !door1Open; // Cannot open if Door 1 is currently open (anti-passback airlock)
  }, [door1Open, airlockInterlockEnabled, fireEsdTripActive]);

  const canOpenDoor1 = useMemo(() => {
    if (fireEsdTripActive) return true;
    if (!airlockInterlockEnabled) return true;
    return !door2Open;
  }, [door2Open, airlockInterlockEnabled, fireEsdTripActive]);

  // =========================================================================
  // PILLAR 5: UPS & CENTRALIZED SAFETY BATTERY AUTONOMY (EN 54-4)
  // =========================================================================
  const [quiescentCurrentA, setQuiescentCurrentA] = useState<number>(1.85); // Standby quiescent current (I1)
  const [standbyHoursRequired, setStandbyHoursRequired] = useState<number>(72); // 72 hours per EN 54-4 (unattended sites) or 24h
  const [alarmCurrentA, setAlarmCurrentA] = useState<number>(8.50); // Full alarm load current (I2: sirens + beacons + relays)
  const [alarmTimeMinutes, setAlarmTimeMinutes] = useState<number>(30); // 30 minutes alarm duration requirement
  const [batteryAgingFactor, setBatteryAgingFactor] = useState<number>(1.25); // 25% aging reserve margin

  // Battery capacity formula per EN 54-4 / NF S 61-936:
  // C_min = 1.25 * [ (I_quiescent * T_standby) + (I_alarm * (T_alarm_min / 60)) ]
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
  const [bmsRefreshRateSec, setBmsRefreshRateSec] = useState<number>(2.0);

  const totalBmsPoints = (hvacUnitsSupervised * 18) + (energyMetersModbus * 12) + (lightingDaliGateways * 64);

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans">
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#1a1400] via-[#241c00] to-[#0d121c] border-b-4 border-amber-400 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-amber-400/[0.06] pointer-events-none select-none font-mono">
          D08
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-amber-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              EPEDE Engineering Station · Domain D08 · Level 5 Reference Quality
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
              Courants Faibles &amp; <span className="text-amber-400">Systèmes Spéciaux</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-amber-200/90 font-bold">
              Bilan Optique TIA-568 · CCTV H.265+ &amp; RAID · SSI EN 54 &amp; Évacuation Vocale · Contrôle d'Accès · Autonomie 72h · GTB BACnet
            </p>
          </div>

          <div className="self-start sm:self-auto bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <Network className="w-4 h-4 text-amber-400" />
            7 Piliers Techniques Opérationnels
          </div>
        </div>
      </div>

      {/* 2. PILLAR NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`flex flex-col items-start p-3 rounded-xl text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-300'}`}>
                  {pillar.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              </div>
              <div className="text-xs font-bold leading-snug line-clamp-2">
                {locale === 'fr' ? pillar.titleFr : pillar.titleEn}
              </div>
              <div className={`text-[9px] font-mono mt-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {locale === 'fr' ? pillar.badgeFr : pillar.badgeEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: OPTICAL FIBER POWER BUDGET & CABLING CERTIFICATION              */}
      {/* ========================================================================= */}
      {activePillar === 'OPTICAL_FIBER_BUDGET' && (
        <div className="space-y-6">
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
                {isFiberLinkPass ? 'LIEN CERTIFIE CONFORME (PASS)' : 'ATTENUATION EXCESSIVE (FAIL)'}
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

            {/* OPTICAL POWER METRICS SUMMARY */}
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

                  {/* OTDR trace with initial Fresnel reflection, slope, splice drop and end reflection */}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 2: CCTV BANDWIDTH, RAID & DORI OPTICAL SIZING                       */}
      {/* ========================================================================= */}
      {activePillar === 'CCTV_BANDWIDTH_RAID' && (
        <div className="space-y-6">
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
                  <span className="text-slate-400">Rétention Enregistrement</span>
                  <span className="text-amber-400 font-bold">{retentionDays} jours</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="90"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Exigence légale Cameroun : 30 j</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400">Architecture RAID NVR</span>
                <select
                  value={raidConfig}
                  onChange={(e) => setRaidConfig(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                >
                  <option value="RAID1">RAID 1 (Miroir - 50% de perte)</option>
                  <option value="RAID5">RAID 5 (Parité simple - 1 disque)</option>
                  <option value="RAID6">RAID 6 (Double parité - 2 disques)</option>
                  <option value="RAID0">RAID 0 (Aucune redondance)</option>
                </select>
                <div className="text-[10px] font-mono text-slate-500">Taille disque unitaire : {hddUnitCapacityTb} To</div>
              </div>
            </div>

            {/* RESULTS METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Bande Passante Ingress NVR</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{totalAggregatedBandwidthMbps} Mbps</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Liaison Gigabit Ethernet requise</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Stockage Net Requis (To)</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{netRequiredStorageTb} To</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Avec 15% de marge FS / index</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Nombre de Disques Requis</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                  {requiredDiskCount} × {hddUnitCapacityTb} To
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Format baie NVR : {requiredDiskCount <= 8 ? '2U Rack' : '3U / 4U Enterprise'}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Capacité Utile Réelle</div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-2">{grossUsableStorageTb} To</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Conforme rétention {retentionDays}j</div>
              </div>
            </div>

            {/* DORI CRITERIA OPTICAL SECTION */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-300 uppercase">
                    Vérificateur Optique DORI (CEI 62676-4) · Identification &amp; Reconnaissance
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Détermine si la caméra permet l'identification juridique formelle d'un individu à la distance choisie.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border border-current ${doriCategory.color}`}>
                    {doriCategory.label} ({doriCategory.badge})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Focale Objectif</span>
                    <span className="text-amber-400 font-bold">{lensFocalLengthMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="2.8"
                    max="12.0"
                    step="0.4"
                    value={lensFocalLengthMm}
                    onChange={(e) => setLensFocalLengthMm(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Angle horizontal : {horizontalFovDeg}°</div>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 3: FIRE ALARM SSI CAT. A & VOICE EVACUATION (EN 54 / NF S 61-936) */}
      {/* ========================================================================= */}
      {activePillar === 'FIRE_ALARM_SSI' && (
        <div className="space-y-6">
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

            {/* ACOUSTIC AND FIRE SIZING GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400">Catégorie SSI (ERP/IGH)</span>
                <select
                  value={ssiCategory}
                  onChange={(e) => setSsiCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                >
                  <option value="CAT_A">SSI Catégorie A (SDI Adressable + CMSI)</option>
                  <option value="CAT_B">SSI Catégorie B (CMSI B + Déclencheurs)</option>
                  <option value="CAT_C">SSI Catégorie C (Dispositif Évacuation)</option>
                  <option value="CAT_D">SSI Catégorie D (Blocs Autonomes BAAS)</option>
                </select>
                <div className="text-[10px] font-mono text-slate-500">Exigé pour Hôtels, Malls &amp; Hôpitaux</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Puissance Diffuseur (100V)</span>
                  <span className="text-amber-400 font-bold">{speakerTapWatts} W</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="12.0"
                  step="1.5"
                  value={speakerTapWatts}
                  onChange={(e) => setSpeakerTapWatts(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Haut-parleur plafonnier EN 54-24</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Distance à l'Occupant</span>
                  <span className="text-amber-400 font-bold">{listenerDistanceMeters} m</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="15.0"
                  step="0.5"
                  value={listenerDistanceMeters}
                  onChange={(e) => setListenerDistanceMeters(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Atténuation géométrique : -{ (20 * Math.log10(listenerDistanceMeters)).toFixed(1) } dB</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Bruit Ambiant Local</span>
                  <span className="text-amber-400 font-bold">{ambientNoiseLevelDb} dB SPL</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="80"
                  value={ambientNoiseLevelDb}
                  onChange={(e) => setAmbientNoiseLevelDb(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Restaurant / hall d'accueil actif</div>
              </div>
            </div>

            {/* ACOUSTIC CHECK REPORT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Pression Acoustique Reçue (Lp)</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">
                  {receivedSoundPressureDb} dB SPL
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Seuil minimal absolu : 65 dB SPL</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Émergence Sonore / Bruit Ambiant</div>
                <div className={`text-3xl font-extrabold font-mono mt-2 ${soundSignalToNoiseRatioDb >= 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +{soundSignalToNoiseRatioDb} dB
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Exigence normative : ≥ +10 dB au-dessus du bruit</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Capacité SDI Adressable</div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
                  {detectorLoopsCount * detectorsPerLoop} points
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {detectorLoopsCount} boucles rebouclées avec isolateurs court-circuit
                </div>
              </div>
            </div>

            {/* CMSI ACTUATOR SCENARIO MATRIX */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                Matrice des Asservissements de Sécurité CMSI (Scénario de Feu Détecté)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">1. Compartimentage</div>
                  <div className="text-slate-200">Fermeture des portes coupe-feu magnétiques par rupture de courant 24V.</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">2. Désenfumage</div>
                  <div className="text-slate-200">Ouverture des volets de désenfumage de la zone sinistrée et démarrage des moto-ventilateurs 400°C/2h.</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">3. Arrêt CVC</div>
                  <div className="text-slate-200">Coupure des centrales de traitement d'air (CTA) pour stopper la propagation des gaz toxiques.</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">4. Évacuation &amp; Accès</div>
                  <div className="text-slate-200">Déverrouillage instantané de toutes les ventouses de contrôle d'accès sur les issues de secours.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 4: ELECTRONIC ACCESS CONTROL & AIRLOCK INTERLOCKS                   */}
      {/* ========================================================================= */}
      {activePillar === 'ACCESS_CONTROL_INTERLOCK' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  {locale === 'fr' ? 'Banc de Contrôle d\'Accès Sécurisé & Sas d\'Interverrouillage' : 'Secure Access Control & Airlock Interlock Engine'}
                </h2>
                <p className="text-xs text-slate-400">
                  Simulation logique d'un sas sécurisé haute sûreté (banque / data room). Règle stricte d'interverrouillage physique (Porte 1 fermée avant ouverture Porte 2) et déclenchement d'urgence SSI.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFireEsdTripActive(!fireEsdTripActive)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                    fireEsdTripActive
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  {fireEsdTripActive ? 'DEVERROUILLAGE URGENCE FEU ACTIF' : 'TEST URGENCE INCENDIE'}
                </button>
              </div>
            </div>

            {/* AIRLOCK SIMULATOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Door 1 Card */}
              <div className={`p-5 rounded-xl border transition-all ${
                door1Open ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">Porte 1 — Accès Extérieur</span>
                  <span className="text-[10px] font-mono text-slate-500">Lecteur RFID MIFARE DESFire EV3</span>
                </div>

                <div className="py-4 space-y-2">
                  <div className="text-xs text-slate-400">État de la Porte :</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {door1Open ? 'OUVERTE (PASSAGE EN COURS)' : 'VERROUILLEE (FERMEE)'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Ventouse : {lockPowerSpecs.holdingForceKg} kg · {lockPowerSpecs.currentMa} mA @ {lockPowerSpecs.voltageV}V
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={!canOpenDoor1 && !door1Open}
                    onClick={() => setDoor1Open(!door1Open)}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                      door1Open
                        ? 'bg-rose-500 text-white'
                        : canOpenDoor1
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {door1Open ? 'Refermer Porte 1' : canOpenDoor1 ? 'Badger & Ouvrir Porte 1' : 'Verrouillé par Sas (Porte 2 ouverte)'}
                  </button>
                </div>
              </div>

              {/* Door 2 Card */}
              <div className={`p-5 rounded-xl border transition-all ${
                door2Open ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Porte 2 — Entrée Salle Forte / DataRoom</span>
                  <span className="text-[10px] font-mono text-slate-500">Biométrie Empreinte + Code PIN</span>
                </div>

                <div className="py-4 space-y-2">
                  <div className="text-xs text-slate-400">État de la Porte :</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {door2Open ? 'OUVERTE (PASSAGE EN COURS)' : 'VERROUILLEE (FERMEE)'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Interverrouillage sas : {airlockInterlockEnabled ? 'ACTIF (Règle Anti-Passback)' : 'DÉSACTIVÉ'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={!canOpenDoor2 && !door2Open}
                    onClick={() => setDoor2Open(!door2Open)}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                      door2Open
                        ? 'bg-rose-500 text-white'
                        : canOpenDoor2
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {door2Open ? 'Refermer Porte 2' : canOpenDoor2 ? 'Authentifier & Ouvrir Porte 2' : 'Verrouillé par Sas (Porte 1 ouverte)'}
                  </button>
                </div>
              </div>
            </div>

            {/* LOCK SELECTION & ARCHITECTURE */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Type de Verrouillage Physique Sélectionné</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{lockPowerSpecs.failMode}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'MAGNETIC_LOCK_300KG', label: 'Ventouse 300 kg (Bureaux)' },
                  { id: 'MAGNETIC_LOCK_600KG', label: 'Ventouse 600 kg (Périphérie)' },
                  { id: 'ELECTRIC_STRIKE_FAIL_SECURE', label: 'Gâche Électrique 12V' },
                  { id: 'MOTORIZED_BOLT', label: 'Pêne Motorisé 1000 kg' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDoorLockType(item.id as any)}
                    className={`p-2.5 rounded-lg text-xs font-mono border text-left transition-all ${
                      doorLockType === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 5: UPS & SAFETY BATTERY AUTONOMY SIZING (EN 54-4)                   */}
      {/* ========================================================================= */}
      {activePillar === 'UPS_BATTERY_AUTONOMY' && (
        <div className="space-y-6">
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
                <div className="text-[10px] font-mono text-slate-500">Centrale + détecteurs au repos</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400">Autonomie Veille Requise</span>
                <select
                  value={standbyHoursRequired}
                  onChange={(e) => setStandbyHoursRequired(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:border-amber-400 outline-none"
                >
                  <option value={72}>72 Heures (Site sans gardiennage / non surveillé)</option>
                  <option value={48}>48 Heures (Bâtiment avec astreinte technique)</option>
                  <option value={24}>24 Heures (Site avec Groupe Électrogène secouru)</option>
                  <option value={12}>12 Heures (Installation secondaire)</option>
                </select>
                <div className="text-[10px] font-mono text-slate-500">Norme EN 54-4 &amp; NFS 61-936</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Courant Pleine Alarme (I2)</span>
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
                <div className="text-[10px] font-mono text-slate-500">Sirènes, flashs, déclencheurs CMSI</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Durée Alarme Minimale</span>
                  <span className="text-amber-400 font-bold">{alarmTimeMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={alarmTimeMinutes}
                  onChange={(e) => setAlarmTimeMinutes(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Exigence légale ERP : 30 min</div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Capacité Théorique Nette</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">
                  {(quiescentCurrentA * standbyHoursRequired + alarmCurrentA * (alarmTimeMinutes / 60)).toFixed(1)} Ah
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">Énergie brute consommée</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Capacité Réglementaire (+25% marge vieillissement)</div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
                  {requiredBatteryCapacityAh} Ah
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">Conforme EN 54-4 et NF S 61-936</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Choix Commercial Recommandé</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-2">
                  {commercialBatteryRecommendation}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">Tension totale : 24 V DC</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 6: BUILDING MANAGEMENT SYSTEM (BMS / GTB BACNET & KNX)              */}
      {/* ========================================================================= */}
      {activePillar === 'BMS_GTB_BACNET' && (
        <div className="space-y-6">
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

            {/* BMS CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Centrales Traitement d'Air (CTA/CVC)</span>
                  <span className="text-amber-400 font-bold">{hvacUnitsSupervised} unités</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={hvacUnitsSupervised}
                  onChange={(e) => setHvacUnitsSupervised(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Points d'E/S physiques : ~{hvacUnitsSupervised * 18} variables</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Centrales de Mesure Énergie (Modbus)</span>
                  <span className="text-amber-400 font-bold">{energyMetersModbus} compteurs</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={energyMetersModbus}
                  onChange={(e) => setEnergyMetersModbus(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Suivi kWh, cos φ, harmoniques THD</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Passerelles Éclairage DALI / KNX</span>
                  <span className="text-amber-400 font-bold">{lightingDaliGateways} passerelles</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={lightingDaliGateways}
                  onChange={(e) => setLightingDaliGateways(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Luminaires adressables : {lightingDaliGateways * 64}</div>
              </div>
            </div>

            {/* LIVE SUPERVISION STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Total Objets / Variables BACnet</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">{totalBmsPoints} points</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Analog Input, Binary Output &amp; Multi-state</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Trafic Polling Réseau</div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
                  {(totalBmsPoints / bmsRefreshRateSec).toFixed(0)} msg/s
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Sur bande passante Ethernet 100 Mbps</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Asservissement Incendie SSI</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                  {fireIntegrationTripOk ? 'RELIE PAR CONTACT SEC NF' : 'ERREUR LIAISON'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Coupure hardwired prioritaire</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 7: CAMEROON REAL-WORLD FORENSIC CASES                              */}
      {/* ========================================================================= */}
      {activePillar === 'CAMEROON_FORENSIC_CASES' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* FOOTER */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Ingénierie Courants Faibles conforme TIA-568, EN 54, EN 62676 &amp; BACnet</span>
        </div>
        <div>EPEDE Platform · Niveau de Maturité 5 (98%)</div>
      </div>
    </div>
  );
};
