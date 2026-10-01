// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 18 DATA ENGINE
// STEP 18: Pumped Storage (STEP/PSH), Synchronous Condenser & Subsea ROV
// ============================================================================

import type {
  PshSystemParams,
  SynchronousCondenserParams,
  SubseaRovInspectionSystem,
  PshOperatingMode,
  PshSimulationPoint,
} from '../types/hydropowerPshStorage';

// ============================================================================
// 1. PSH SYSTEM DEFAULT PARAMETERS (REVERSIBLE DFIG FRANCIS PUMP-TURBINE)
// ============================================================================

export const DEFAULT_PSH_PARAMS: PshSystemParams = {
  architecture: 'reversible_francis',
  ratedTurbineCapacityMw: 200, // 2 x 100 MW reversible units
  ratedPumpCapacityMw: 190,
  upperReservoirCapacityMm3: 14.5, // 14.5 million m3 storage (approx. 8.2 hours of full turbining)
  lowerReservoirCapacityMm3: 65.0, // Nachtigal headpond / Sanaga river
  grossHeadMeters: 110, // Head between upper perched reservoir and Sanaga
  roundTripEfficiencyPercent: 79.4, // Turbining n=91.5%, Pumping n=88.2%, Penstock n=98.5%
  variableSpeedDriveType: 'DFIG', // Doubly-Fed Induction Generator (+/- 10% speed regulation in pump mode)
  transitionTimeTurbineToPumpSec: 90,
  transitionTimeStandbyToFullGenSec: 65,
};

// ============================================================================
// 2. SYNCHRONOUS CONDENSER (DÉNOIEMENT D'AUBE PAR AIR COMPRIMÉ)
// ============================================================================

export const DEFAULT_SYNC_CONDENSER_PARAMS: SynchronousCondenserParams = {
  ratedReactivePowerMaxMvar: 160, // Capacitive boost at 225 kV
  ratedReactivePowerMinMvar: -90, // Inductive absorption (Ferranti effect)
  tailwaterDepressionAirPressureBar: 4.8, // Compressed air injected into runner housing
  airDepressionBlowdownTimeSec: 42,
  activePowerLossesMw: 1.8, // Windage & bearing losses in compressed air (vs ~7.5 MW in water)
  inertiaConstantHSeconds: 4.2, // Rotational inertia constant H (840 MW.s physical kinetic energy)
  subtransientReactanceXdpdPercent: 18.5, // X"d reactance for short-circuit grid support
};

// ============================================================================
// 3. SUBSEA ROV / AUV UNDERWATER INSPECTION SYSTEM (ICOLD BULLETIN 180)
// ============================================================================

export const DEFAULT_ROV_SYSTEM: SubseaRovInspectionSystem = {
  rovModel: 'Hydrone-X3 DeepSub Inspection ROV',
  maxOperatingDepthMeters: 250,
  payloadSensors: [
    'Norbit Multi-Beam Dual 3D Bathymetric Sonar',
    'SubC Imaging 4K Photogrammetry Stereo Rig',
    'Laser Cavitation Profilometer (0.1 mm resolution)',
    'USBL Hydro-Acoustic Underwater Positioning Transponder',
  ],
  batteryAutonomyHours: 8.5,
  acousticPositioningType: 'USBL',
  targetZones: [
    {
      id: 'trashrack_intake',
      nameFr: 'Grilles de Prise d\'Eau Amont & Dégrilleur',
      nameEn: 'Upstream Intake Trashracks & Cleaner',
      depthM: 35,
      inspectionType: 'HD_Photogrammetry',
      integrityScorePercent: 96.2,
      status: 'normal',
      findingsFr: 'Aucune déformation structurelle. Absence de colmatage par débris végétaux. Anodes sacrificielles en zinc usées à 28%.',
      findingsEn: 'No structural deformation. No vegetative debris fouling. Zinc sacrificial anodes depleted by 28%.',
    },
    {
      id: 'penstock_lining',
      nameFr: 'Blindage Acier de Conduite Forcée & Coudes',
      nameEn: 'Steel Penstock Lining & Bends',
      depthM: 58,
      inspectionType: 'Laser_Cavitation',
      integrityScorePercent: 94.8,
      status: 'normal',
      findingsFr: 'Épaisseur résiduelle mesurée 24.2 mm (nominale 25.0 mm). Aucune trace de décollement du béton de calage.',
      findingsEn: 'Residual thickness 24.2 mm (nominal 25.0 mm). No voids detected behind steel liner.',
    },
    {
      id: 'bottom_outlet_gate',
      nameFr: 'Pertuis de Vidange de Fond & Vannes Wagons',
      nameEn: 'Bottom Outlet Sluice & Wagon Gates',
      depthM: 46,
      inspectionType: 'Sonar_3D',
      integrityScorePercent: 88.5,
      status: 'watch',
      findingsFr: 'Dépôt sédimentaire sableux de 0.85 m au droit du seuil amont. Joint néoprène inférieur présentant une abrasion superficielle.',
      findingsEn: 'Sand sediment siltation 0.85 m near sill. Lower neoprene seal showing superficial abrasion.',
    },
    {
      id: 'stilling_basin',
      nameFr: 'Radier du Bassin de Dissipation d\'Énergie',
      nameEn: 'Spillway Stilling Basin Slab & Baffle Blocks',
      depthM: 22,
      inspectionType: 'Sonar_3D',
      integrityScorePercent: 91.0,
      status: 'normal',
      findingsFr: 'Dalles de béton haute performance intactes. Blocs déflecteurs sans cavitation majeure après la crue décennale.',
      findingsEn: 'High-performance concrete slabs intact. Baffle impact blocks free of major cavitation after 10-year flood.',
    },
    {
      id: 'dam_upstream_toe',
      nameFr: 'Pied Amont du Barrage BCR & Voile d\'Étanchéité',
      nameEn: 'RCC Dam Upstream Toe & Grout Curtain',
      depthM: 42,
      inspectionType: 'Sediment_Profiling',
      integrityScorePercent: 98.0,
      status: 'normal',
      findingsFr: 'Aucune fissure détectée sur le parement amont. Tête des forages de drainage subaquatiques dégagée.',
      findingsEn: 'No cracks detected on upstream face. Subaquatic relief drain hole heads clear of obstructions.',
    },
  ],
};

// ============================================================================
// 4. METRICS CALCULATION ENGINE
// ============================================================================

export function calculatePshOperatingMetrics(
  mode: PshOperatingMode,
  ratedTurbineMw: number,
  ratedPumpMw: number,
  dfigSpeedOffsetPercent: number, // -10% to +10%
  reactiveSetpointMvar: number,
  grossHeadM: number
): {
  activePowerMw: number;
  reactivePowerMvar: number;
  waterDischargeM3s: number; // Positive = turbined, Negative = pumped
  activeLossesMw: number;
  dynamicInertiaH: number;
  noiseDb: number;
} {
  const g = 9.81;
  const waterDensity = 1000; // kg/m3

  if (mode === 'generating') {
    const turbineEfficiency = 0.915;
    const powerMw = ratedTurbineMw * (1 + (dfigSpeedOffsetPercent / 100) * 0.4);
    // P = rho * g * Q * H * eta => Q = P / (rho * g * H * eta)
    const discharge = (powerMw * 1e6) / (waterDensity * g * grossHeadM * turbineEfficiency);
    return {
      activePowerMw: Number(powerMw.toFixed(1)),
      reactivePowerMvar: reactiveSetpointMvar,
      waterDischargeM3s: Number(discharge.toFixed(1)),
      activeLossesMw: Number((powerMw * (1 - turbineEfficiency)).toFixed(1)),
      dynamicInertiaH: 4.2,
      noiseDb: 88,
    };
  }

  if (mode === 'pumping') {
    const pumpEfficiency = 0.882;
    // DFIG enables regulating pump power consumption
    const pumpPowerMw = ratedPumpMw * (1 + (dfigSpeedOffsetPercent / 100) * 0.7);
    // P_elec = rho * g * Q * H / eta => Q = (P * eta) / (rho * g * H)
    const discharge = (pumpPowerMw * 1e6 * pumpEfficiency) / (waterDensity * g * grossHeadM);
    return {
      activePowerMw: Number((-pumpPowerMw).toFixed(1)), // Negative power indicates load
      reactivePowerMvar: reactiveSetpointMvar,
      waterDischargeM3s: Number((-discharge).toFixed(1)), // Negative indicates pumping up
      activeLossesMw: Number((pumpPowerMw * (1 - pumpEfficiency)).toFixed(1)),
      dynamicInertiaH: 4.2,
      noiseDb: 92,
    };
  }

  if (mode === 'sync_condenser') {
    // Tailwater depressed runner spinning in compressed air
    return {
      activePowerMw: -1.8, // Motorized windage losses drawn from grid
      reactivePowerMvar: reactiveSetpointMvar, // High reactive power capability
      waterDischargeM3s: 0.0, // Zero water consumed
      activeLossesMw: 1.8,
      dynamicInertiaH: 4.2, // Full physical rotating inertia supplied to 225 kV grid
      noiseDb: 72,
    };
  }

  if (mode === 'hydraulic_short') {
    // Both turbine and pump connected to penstock simultaneously for ultra-fine frequency control
    return {
      activePowerMw: 15.0, // Net difference
      reactivePowerMvar: reactiveSetpointMvar,
      waterDischargeM3s: 12.0,
      activeLossesMw: 18.5,
      dynamicInertiaH: 8.4, // Dual machine inertia
      noiseDb: 96,
    };
  }

  // Standby
  return {
    activePowerMw: 0,
    reactivePowerMvar: 0,
    waterDischargeM3s: 0,
    activeLossesMw: 0,
    dynamicInertiaH: 0,
    noiseDb: 40,
  };
}

// ============================================================================
// 5. 24-HOUR DISPATCH SIMULATION GENERATOR
// ============================================================================

export function generate24HourPshDispatch(): PshSimulationPoint[] {
  const points: PshSimulationPoint[] = [];

  // Typical modes across 24h:
  // 00h-06h: Pumping (absorbing excess night power / filling upper basin)
  // 07h-11h: Standby / Frequency regulation
  // 12h-15h: Synchronous Condenser (supporting voltage with FPV peak)
  // 16h-17h: Standby
  // 18h-22h: Turbining (evening peak generation 200 MW)
  // 23h: Transition to Pumping

  let currentStorageMm3 = 6.2; // Start with half storage

  for (let h = 0; h < 24; h++) {
    let mode: PshOperatingMode = 'standby';
    let netP = 0;
    let qMvar = 0;
    let freq = 50.0 + Math.sin(h * 0.5) * 0.08;
    let inertia = 12.4; // Base system inertia GVA.s

    if (h >= 1 && h <= 5) {
      mode = 'pumping';
      netP = -185.0;
      qMvar = -20; // light inductive
      currentStorageMm3 = Math.min(14.5, currentStorageMm3 + 1.25);
      inertia = 16.6;
    } else if (h >= 12 && h <= 15) {
      mode = 'sync_condenser';
      netP = -1.8;
      qMvar = 140; // Heavy capacitive boost for solar injection
      inertia = 16.6;
      freq = 50.02;
    } else if (h >= 18 && h <= 21) {
      mode = 'generating';
      netP = 200.0;
      qMvar = 60;
      currentStorageMm3 = Math.max(2.0, currentStorageMm3 - 1.85);
      inertia = 16.6;
      freq = 49.95;
    } else if (h === 7 || h === 17) {
      mode = 'hydraulic_short';
      netP = 25.0;
      qMvar = 15;
      inertia = 20.8;
    }

    points.push({
      hour: h,
      operatingMode: mode,
      netPowerMw: Number(netP.toFixed(1)),
      reactivePowerMvar: Number(qMvar.toFixed(1)),
      upperStorageVolumeMm3: Number(currentStorageMm3.toFixed(2)),
      gridFrequencyHz: Number(freq.toFixed(3)),
      systemInertiaGvaS: Number(inertia.toFixed(1)),
    });
  }

  return points;
}
