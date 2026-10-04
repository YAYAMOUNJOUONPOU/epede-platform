// src/components/elv/services/useElvProjectStore.ts
// EPEDE D08 - Central Reactive Project Store for Extra Low Voltage & Special Systems (Courants Faibles)
// Calibrated to TIA-568.2-D, EN 54, EN 62676, IEC 60839-11 & Cameroon Real-World Building Projects

import { useState, useMemo } from 'react';

export type BuildingTypologyKey =
  | 'OFFICE_TOWER'
  | 'HOSPITAL_REGIONAL'
  | 'HOTEL_COMPLEX_5STAR'
  | 'AIRPORT_TERMINAL';

export interface BuildingTypologyProfile {
  id: BuildingTypologyKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  floorsCount: number;
  totalAreaM2: number;
  occupantsMax: number;
  defaultCctvCameras: number;
  defaultAccessDoors: number;
  defaultSsiLoops: number;
  defaultBmsPoints: number;
}

export const ELV_BUILDING_PROFILES: Record<BuildingTypologyKey, BuildingTypologyProfile> = {
  OFFICE_TOWER: {
    id: 'OFFICE_TOWER',
    nameFr: 'Immeuble de Bureaux & Siège Institutionnel (R+8)',
    nameEn: 'Corporate Office Tower & Headquarters (9 Floors)',
    cameroonReference: 'Immeuble Siège CAMTEL / Tour CNPS Yaoundé',
    floorsCount: 9,
    totalAreaM2: 12500,
    occupantsMax: 1200,
    defaultCctvCameras: 48,
    defaultAccessDoors: 24,
    defaultSsiLoops: 6,
    defaultBmsPoints: 480
  },
  HOSPITAL_REGIONAL: {
    id: 'HOSPITAL_REGIONAL',
    nameFr: 'Centre Hospitalier Régional & Blocs Opératoires',
    nameEn: 'Regional Referral Hospital & Surgical Wings',
    cameroonReference: 'Hôpital Général de Douala / CHR d’Ebolowa',
    floorsCount: 4,
    totalAreaM2: 18000,
    occupantsMax: 850,
    defaultCctvCameras: 64,
    defaultAccessDoors: 36,
    defaultSsiLoops: 12,
    defaultBmsPoints: 720
  },
  HOTEL_COMPLEX_5STAR: {
    id: 'HOTEL_COMPLEX_5STAR',
    nameFr: 'Complexe Hôtelier 5 Étoiles & Centre de Conférences',
    nameEn: '5-Star Hospitality Complex & Conference Center',
    cameroonReference: 'Hôtel Hilton Yaoundé / Kribi Beach Resort',
    floorsCount: 11,
    totalAreaM2: 24000,
    occupantsMax: 2000,
    defaultCctvCameras: 96,
    defaultAccessDoors: 52,
    defaultSsiLoops: 16,
    defaultBmsPoints: 1150
  },
  AIRPORT_TERMINAL: {
    id: 'AIRPORT_TERMINAL',
    nameFr: 'Aérogare Passagers & Plateforme Aéroportuaire',
    nameEn: 'Passenger Airport Terminal & Airside Facility',
    cameroonReference: 'Aéroport International de Yaoundé-Nsimalen / Douala',
    floorsCount: 3,
    totalAreaM2: 32000,
    occupantsMax: 4500,
    defaultCctvCameras: 128,
    defaultAccessDoors: 72,
    defaultSsiLoops: 24,
    defaultBmsPoints: 1800
  }
};

export interface ElvCalculations {
  totalBandwidthMbps: number;
  totalStorageRaidTb: number;
  usableDisksCount: number;
  opticalPowerMarginDb: number;
  isFiberBudgetPass: boolean;
  totalPoePowerWatts: number;
  recommendedPoeSwitchesCount: number;
  batteryAutonomyAh: number;
  isBatteryCompliantEn54: boolean;
  totalBmsPointsCount: number;
  totalEstimatedCapExFcfa: number;
  totalEstimatedCapExEur: number;
}

export interface ElvStoreState {
  activeStage: 1 | 2 | 3 | 4 | 5;
  setActiveStage: (st: 1 | 2 | 3 | 4 | 5) => void;

  selectedBuildingId: BuildingTypologyKey;
  setSelectedBuildingId: (id: BuildingTypologyKey) => void;
  activeBuildingProfile: BuildingTypologyProfile;

  // Key system configuration states
  cameraCount: number;
  setCameraCount: (n: number) => void;
  accessDoorsCount: number;
  setAccessDoorsCount: (n: number) => void;
  ssiLoopsCount: number;
  setSsiLoopsCount: (n: number) => void;
  fiberDistanceKm: number;
  setFiberDistanceKm: (km: number) => void;

  calculations: ElvCalculations;
}

export function useElvProjectStore(initialBuilding: BuildingTypologyKey = 'OFFICE_TOWER'): ElvStoreState {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedBuildingId, setSelectedBuildingId] = useState<BuildingTypologyKey>(initialBuilding);

  const activeBuildingProfile = useMemo(() => {
    return ELV_BUILDING_PROFILES[selectedBuildingId] || ELV_BUILDING_PROFILES.OFFICE_TOWER;
  }, [selectedBuildingId]);

  // Controllable quantities initialized from profile
  const [cameraCount, setCameraCount] = useState<number>(activeBuildingProfile.defaultCctvCameras);
  const [accessDoorsCount, setAccessDoorsCount] = useState<number>(activeBuildingProfile.defaultAccessDoors);
  const [ssiLoopsCount, setSsiLoopsCount] = useState<number>(activeBuildingProfile.defaultSsiLoops);
  const [fiberDistanceKm, setFiberDistanceKm] = useState<number>(1.2);

  // Sync profile when building changes
  const handleSelectBuilding = (id: BuildingTypologyKey) => {
    setSelectedBuildingId(id);
    const prof = ELV_BUILDING_PROFILES[id];
    if (prof) {
      setCameraCount(prof.defaultCctvCameras);
      setAccessDoorsCount(prof.defaultAccessDoors);
      setSsiLoopsCount(prof.defaultSsiLoops);
      setFiberDistanceKm(id === 'AIRPORT_TERMINAL' ? 3.5 : id === 'HOSPITAL_REGIONAL' ? 2.0 : 1.2);
    }
  };

  // Comprehensive Engineering Calculations
  const calculations: ElvCalculations = useMemo(() => {
    // 1. CCTV Bandwidth & Storage (H.265+ Smart Codec, 4MP avg, 2.75 Mbps/cam, 30 days retention, RAID 6)
    const unitBitrateMbps = 2.75;
    const totalBandwidthMbps = Number((cameraCount * unitBitrateMbps).toFixed(1));
    const rawStorageTb = (cameraCount * unitBitrateMbps * 3600 * 24 * 30) / (8 * 1_000_000);
    const totalStorageRaidTb = Number((rawStorageTb * 1.25).toFixed(1)); // 25% RAID & filesystem overhead
    const usableDisksCount = Math.max(4, Math.ceil(totalStorageRaidTb / 8) + 2); // 8TB enterprise drives + 2 parity disks

    // 2. Optical Fiber Budget (OS2 Single Mode @ 1310nm: 0.35 dB/km, 4 splices @ 0.05dB, 2 pairs @ 0.35dB, 3dB margin)
    const linkLossDb = (fiberDistanceKm * 0.35) + (4 * 0.05) + (2 * 0.35);
    const txPowerDbm = -3.0; // SFP+ 10G-LR
    const rxSensDbm = -14.4;
    const totalBudgetDb = txPowerDbm - rxSensDbm; // 11.4 dB
    const opticalPowerMarginDb = Number((totalBudgetDb - linkLossDb - 3.0).toFixed(2));
    const isFiberBudgetPass = opticalPowerMarginDb >= 0;

    // 3. PoE Power Budget (CCTV: 15W/cam, Access UTL: 25W/door, Wi-Fi APs: 20W/AP ~ 1 AP per 250m2)
    const wifiApCount = Math.ceil(activeBuildingProfile.totalAreaM2 / 250);
    const cctvPoeWatts = cameraCount * 15;
    const accessPoeWatts = accessDoorsCount * 25;
    const wifiPoeWatts = wifiApCount * 20;
    const totalPoePowerWatts = cctvPoeWatts + accessPoeWatts + wifiPoeWatts;
    // 24-Port 370W PoE+ switch recommendation
    const recommendedPoeSwitchesCount = Math.ceil(totalPoePowerWatts / 320);

    // 4. Fire Alarm Battery Autonomy EN 54-4 (Quiescent 0.15A per loop + 72h standby, Alarm 1.2A per loop + 30 min alarm)
    const quiescentCurrentA = ssiLoopsCount * 0.15 + 0.8;
    const alarmCurrentA = ssiLoopsCount * 1.2 + 3.5;
    const rawAh = (quiescentCurrentA * 72) + (alarmCurrentA * 0.5);
    const batteryAutonomyAh = Number((rawAh * 1.25).toFixed(1)); // 25% aging reserve margin
    const isBatteryCompliantEn54 = batteryAutonomyAh <= 120.0;

    // 5. Total BMS Points Count
    const totalBmsPointsCount = activeBuildingProfile.defaultBmsPoints;

    // 6. CapEx Benchmark in Cameroon (FCFA / EUR)
    // Structured Cabling + CCTV + Access + Fire SSI + PA-VA + BMS
    const vdiCapEx = activeBuildingProfile.floorsCount * 4_500_000;
    const cctvCapEx = cameraCount * 380_000;
    const accessCapEx = accessDoorsCount * 450_000;
    const ssiCapEx = ssiLoopsCount * 2_200_000 + 4_000_000;
    const bmsCapEx = totalBmsPointsCount * 35_000;
    const subTotalFcfa = vdiCapEx + cctvCapEx + accessCapEx + ssiCapEx + bmsCapEx;
    const totalEstimatedCapExFcfa = Math.round(subTotalFcfa * 1.15); // 15% testing, commissioning & documentation
    const totalEstimatedCapExEur = Math.round(totalEstimatedCapExFcfa / 655.957);

    return {
      totalBandwidthMbps,
      totalStorageRaidTb,
      usableDisksCount,
      opticalPowerMarginDb,
      isFiberBudgetPass,
      totalPoePowerWatts,
      recommendedPoeSwitchesCount,
      batteryAutonomyAh,
      isBatteryCompliantEn54,
      totalBmsPointsCount,
      totalEstimatedCapExFcfa,
      totalEstimatedCapExEur
    };
  }, [
    cameraCount,
    accessDoorsCount,
    ssiLoopsCount,
    fiberDistanceKm,
    activeBuildingProfile
  ]);

  return {
    activeStage,
    setActiveStage,
    selectedBuildingId,
    setSelectedBuildingId: handleSelectBuilding,
    activeBuildingProfile,
    cameraCount,
    setCameraCount,
    accessDoorsCount,
    setAccessDoorsCount,
    ssiLoopsCount,
    setSsiLoopsCount,
    fiberDistanceKm,
    setFiberDistanceKm,
    calculations
  };
}
