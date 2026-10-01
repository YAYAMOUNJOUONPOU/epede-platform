// src/components/installations/ProjectThermalDissipationEngine.tsx
// EPEDE Deep Engineering Module — Domain D06: Electrical Installations & Switchboards
// Module 22: Switchboard Thermal Dissipation & Enclosure Cooling Engine (IEC 61439-1 / IEC TR 60890)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Thermometer, 
  Wind, 
  Snowflake, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  Cpu, 
  Sun, 
  Activity, 
  Info,
  Fan,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

// Enclosure installation types according to IEC TR 60890 calculation of effective cooling surface Ae
export type EnclosureInstallationType = 
  | 'FREE_STANDING'       // Single free-standing enclosure exposed on all sides
  | 'AGAINST_WALL'        // Enclosure against wall (back surface covered)
  | 'START_OF_ROW'        // First enclosure of row (back covered, one side covered)
  | 'MIDDLE_OF_ROW'       // Central enclosure in a suite (back covered, both sides covered)
  | 'CORNER'              // Enclosure in corner (back and one side covered)
  | 'WALL_MOUNTED_RECESS';// Recessed into wall (only front and top exposed)

// Enclosure ventilation arrangement per IEC TR 60890
export type VentilationOpeningType = 
  | 'SEALED_IP54_IP65'    // Natural cooling without openings (IP54 / IP65)
  | 'NATURAL_VENTILATION' // Natural ventilation openings (IP31 / IP41 with louvres / filters)
  | 'FORCED_VENTILATION'  // Enclosure exhaust fan / filter fan unit
  | 'AIR_CONDITIONING';   // Active AC chiller / air conditioner unit

interface EquipmentDissipationRow {
  id: string;
  name: string;
  category: 'BREAKER' | 'BUSBAR' | 'VFD_SOFTSTARTER' | 'TRANSFORMER_UPS' | 'INTERNAL_CABLES' | 'RELAYS_AUXILIARY';
  ratedQuantity: number;
  unitHeatLossW: number;
  loadingFactor: number;
  totalLossW: number;
}

export const ProjectThermalDissipationEngine: React.FC<Props> = ({ project, locale }) => {
  const isFr = locale === 'fr';

  // 1. Switchboard Enclosure Dimensions (Height, Width, Depth in mm)
  const [enclosureHeight, setEnclosureHeight] = useState<number>(2000); // mm
  const [enclosureWidth, setEnclosureWidth] = useState<number>(1000);  // mm (single column / section)
  const [enclosureDepth, setEnclosureDepth] = useState<number>(600);   // mm
  const [columnCount, setColumnCount] = useState<number>(2);           // 2 vertical columns suite

  // 2. Installation conditions & environmental temperatures
  const [installationType, setInstallationType] = useState<EnclosureInstallationType>('AGAINST_WALL');
  const [ventilationType, setVentilationType] = useState<VentilationOpeningType>('NATURAL_VENTILATION');
  
  const [ambientTempC, setAmbientTempC] = useState<number>(35);        // External ambient temperature (°C)
  const [maxPermissibleTempC, setMaxPermissibleTempC] = useState<number>(55); // Internal target max temp (°C) per IEC 61439-1 (typically 50-60°C for modern electronic trips)
  const [solarRadiationW_m2, setSolarRadiationW_m2] = useState<number>(0);   // Solar radiation (0 for indoor switchroom)
  const [enclosureMaterial, setEnclosureMaterial] = useState<'PAINTED_STEEL' | 'STAINLESS_STEEL' | 'ALUMINUM' | 'POLYESTER'>('PAINTED_STEEL');

  // 3. User adjusters for specific heat-emitting equipment
  const [vfdRatedPowerKw, setVfdRatedPowerKw] = useState<number>(37); // Installed VFD/Softstarter kW
  const [upsAuxKva, setUpsAuxKva] = useState<number>(10);            // Internal auxiliary UPS kVA
  const [additionalAuxW, setAdditionalAuxW] = useState<number>(120); // Measuring units, meters, pilot lights, coils

  // Power balance to deduce main busbar and circuit breaker current
  const balance = useMemo(() => computeProjectPowerBalance(project), [project]);
  const tgbtCurrentA = Math.round(balance.tgbtIncomerAmperes || 630);

  // Enclosure heat transfer coefficient k [W/(m²·K)] per IEC TR 60890
  const heatTransferCoeffK = useMemo(() => {
    switch (enclosureMaterial) {
      case 'PAINTED_STEEL': return 5.5;
      case 'STAINLESS_STEEL': return 4.5;
      case 'ALUMINUM': return 12.0;
      case 'POLYESTER': return 3.5;
      default: return 5.5;
    }
  }, [enclosureMaterial]);

  // Surface calculation per IEC TR 60890:
  // Dimensions converted to meters
  const H = (enclosureHeight / 1000);
  const W = (enclosureWidth * columnCount / 1000);
  const D = (enclosureDepth / 1000);

  // Effective cooling surface area Ae [m²] calculation per IEC TR 60890
  // Based on which surfaces can exchange heat with ambient air
  const { totalGeometricSurfaceA, effectiveCoolingSurfaceAe, surfaceBreakdown } = useMemo(() => {
    const topArea = W * D;
    const frontArea = H * W;
    const backArea = H * W;
    const sideArea = H * D; // one side
    const bothSidesArea = 2 * sideArea;

    const totalGeom = topArea + frontArea + backArea + bothSidesArea; // floor is never counted for convection

    let Ae = 0;
    switch (installationType) {
      case 'FREE_STANDING':
        // Top, front, back, and both sides exposed:
        // IEC TR 60890 formula: Ae = 1.8 * H * (W + D) + 1.4 * W * D
        Ae = 1.8 * H * (W + D) + 1.4 * (W * D);
        break;
      case 'AGAINST_WALL':
        // Back covered: Ae = 1.4 * W * D + 0.9 * H * D + 1.8 * H * W
        Ae = 1.4 * (W * D) + 0.9 * (H * D) + 1.8 * (H * W);
        break;
      case 'START_OF_ROW':
        // Back covered, one side covered: Ae = 1.4 * W * D + 0.9 * H * (W + D)
        Ae = 1.4 * (W * D) + 0.9 * H * (W + D);
        break;
      case 'MIDDLE_OF_ROW':
        // Back covered, both sides covered: Ae = 1.4 * W * D + 1.8 * H * W
        Ae = 1.4 * (W * D) + 1.8 * (H * W);
        break;
      case 'CORNER':
        // Back and one side covered: Ae = 1.4 * W * D + 0.9 * H * (W + D)
        Ae = 1.4 * (W * D) + 0.9 * H * (W + D);
        break;
      case 'WALL_MOUNTED_RECESS':
        // Only front and top exposed: Ae = 1.4 * W * D + 0.9 * H * W
        Ae = 1.4 * (W * D) + 0.9 * (H * W);
        break;
      default:
        Ae = 1.8 * H * (W + D) + 1.4 * (W * D);
    }

    return {
      totalGeometricSurfaceA: totalGeom,
      effectiveCoolingSurfaceAe: Math.max(1.0, Ae),
      surfaceBreakdown: { topArea, frontArea, backArea, bothSidesArea }
    };
  }, [H, W, D, installationType]);

  // Detailed Heat Dissipation Itemization (P_loss)
  const dissipationList: EquipmentDissipationRow[] = useMemo(() => {
    // 1. Incomer ACB / MCCB power loss (approx 3 * R * I² + electronics ~ 30-35 W per 100 A at nominal load)
    const incomerRating = tgbtCurrentA <= 630 ? 630 : tgbtCurrentA <= 1250 ? 1250 : tgbtCurrentA <= 2500 ? 2500 : 4000;
    const incomerLossNominalW = incomerRating <= 630 ? 75 : incomerRating <= 1250 ? 180 : incomerRating <= 2500 ? 420 : 750;
    const incomerLoadRatio = Math.min(1.0, tgbtCurrentA / incomerRating);
    const incomerLossW = Math.round(incomerLossNominalW * Math.pow(incomerLoadRatio, 2));

    // 2. Outgoing branch breakers (MCCBs and MCBs)
    const outgoingBreakersCount = project.distributionBoards.reduce((acc, db) => acc + db.outgoingCircuits.length, 0) || 12;
    const avgOutgoingLossW = 12; // average dissipation per loaded 3P circuit breaker
    const outgoingLoading = 0.75;
    const outgoingLossW = Math.round(outgoingBreakersCount * avgOutgoingLossW * Math.pow(outgoingLoading, 2));

    // 3. Main Copper Busbars (Cu 30x10 or Cu 50x10) - ~25-45 W/meter per phase at full load
    const busbarLengthM = W * 1.2; // across the width + drops
    const busbarLossNominalW = 90 * busbarLengthM;
    const busbarLossW = Math.round(busbarLossNominalW * Math.pow(incomerLoadRatio, 2));

    // 4. Internal cabling and connection terminations (~15-20% of busbar and breaker loss)
    const internalCablesLossW = Math.round((incomerLossW + outgoingLossW) * 0.18);

    // 5. VFD or Softstarter internal semiconductor losses (approx 2.5% to 3% for VFD, 1% for soft starter)
    // VFD: 3% of rated kW = 30 W per kW
    const vfdLossW = Math.round(vfdRatedPowerKw * 28);

    // 6. Internal control transformers & UPS auxiliary inverter loss (approx 7% of kVA)
    const upsLossW = Math.round(upsAuxKva * 1000 * 0.07);

    // 7. Auxiliary components, relays, multimeters, pilot lights, contactor coils
    const auxLossW = additionalAuxW;

    return [
      {
        id: 'incomer-cb',
        name: isFr ? `Disjoncteur Général d'Arrivée (${incomerRating} A)` : `Main Incomer Circuit Breaker (${incomerRating} A)`,
        category: 'BREAKER',
        ratedQuantity: 1,
        unitHeatLossW: incomerLossW,
        loadingFactor: incomerLoadRatio,
        totalLossW: incomerLossW
      },
      {
        id: 'outgoing-cbs',
        name: isFr ? `Départs Divisionnaires (${outgoingBreakersCount} disjoncteurs)` : `Outgoing Feeders (${outgoingBreakersCount} breakers)`,
        category: 'BREAKER',
        ratedQuantity: outgoingBreakersCount,
        unitHeatLossW: avgOutgoingLossW,
        loadingFactor: outgoingLoading,
        totalLossW: outgoingLossW
      },
      {
        id: 'main-busbars',
        name: isFr ? `Jeu de Barres Cuivre Principal (${(busbarLengthM).toFixed(1)} m)` : `Main Copper Busbars (${(busbarLengthM).toFixed(1)} m)`,
        category: 'BUSBAR',
        ratedQuantity: 1,
        unitHeatLossW: busbarLossW,
        loadingFactor: incomerLoadRatio,
        totalLossW: busbarLossW
      },
      {
        id: 'internal-wiring',
        name: isFr ? 'Câblage Interne & Échauffement Bornes' : 'Internal Wiring & Terminal Dissipation',
        category: 'INTERNAL_CABLES',
        ratedQuantity: 1,
        unitHeatLossW: internalCablesLossW,
        loadingFactor: 1.0,
        totalLossW: internalCablesLossW
      },
      {
        id: 'vfd-softstarter',
        name: isFr ? `Variateur de Vitesse / Démarreur (${vfdRatedPowerKw} kW)` : `Variable Speed Drive / Starter (${vfdRatedPowerKw} kW)`,
        category: 'VFD_SOFTSTARTER',
        ratedQuantity: 1,
        unitHeatLossW: vfdLossW,
        loadingFactor: 0.9,
        totalLossW: vfdLossW
      },
      {
        id: 'ups-aux',
        name: isFr ? `Onduleur ASI Auxiliaires (${upsAuxKva} kVA)` : `Auxiliary UPS & Inverter (${upsAuxKva} kVA)`,
        category: 'TRANSFORMER_UPS',
        ratedQuantity: 1,
        unitHeatLossW: upsLossW,
        loadingFactor: 0.8,
        totalLossW: upsLossW
      },
      {
        id: 'aux-relays',
        name: isFr ? 'Centrales de Mesure, Relais, Bobines & Voyants' : 'Multifunction Meters, Relays, Coils & Indicators',
        category: 'RELAYS_AUXILIARY',
        ratedQuantity: 1,
        unitHeatLossW: auxLossW,
        loadingFactor: 1.0,
        totalLossW: auxLossW
      }
    ];
  }, [tgbtCurrentA, project.distributionBoards, W, vfdRatedPowerKw, upsAuxKva, additionalAuxW, isFr]);

  // Total internal heat generation P_internal [W]
  const totalHeatDissipationW = useMemo(() => {
    return dissipationList.reduce((sum, item) => sum + item.totalLossW, 0);
  }, [dissipationList]);

  // Solar heat gain (if outdoor or window switchroom) [W]
  const solarHeatGainW = useMemo(() => {
    if (solarRadiationW_m2 <= 0) return 0;
    // Absorption coefficient ~0.7 for painted steel
    return Math.round((surfaceBreakdown.topArea + surfaceBreakdown.frontArea) * solarRadiationW_m2 * 0.7);
  }, [solarRadiationW_m2, surfaceBreakdown]);

  const totalHeatLoadW = totalHeatDissipationW + solarHeatGainW;

  // Maximum permissible temperature rise ΔT_allowable [K or °C]
  const allowableDeltaTC = Math.max(5, maxPermissibleTempC - ambientTempC);

  // Natural Heat Dissipation Capacity of the Enclosure P_natural [W]
  // According to IEC TR 60890: P_natural = k * Ae * ΔT
  const naturalDissipationCapacityW = useMemo(() => {
    return Math.round(heatTransferCoeffK * effectiveCoolingSurfaceAe * allowableDeltaTC);
  }, [heatTransferCoeffK, effectiveCoolingSurfaceAe, allowableDeltaTC]);

  // Resulting internal temperature under purely natural cooling
  const naturalInternalTempC = useMemo(() => {
    const deltaTNatural = totalHeatLoadW / (heatTransferCoeffK * effectiveCoolingSurfaceAe);
    return Math.round(ambientTempC + deltaTNatural);
  }, [totalHeatLoadW, heatTransferCoeffK, effectiveCoolingSurfaceAe, ambientTempC]);

  // Deficit of heat dissipation to be removed by active ventilation or AC
  const excessHeatW = Math.max(0, totalHeatLoadW - naturalDissipationCapacityW);

  // Required airflow for forced ventilation (V in m³/h)
  // Formula: V = (f * P_excess) / ΔT
  // with air density and specific heat: f ≈ 3.1 m³·K/(W·h)
  const requiredAirflowM3h = useMemo(() => {
    if (excessHeatW <= 0) return 0;
    // For forced ventilation, air entered is at ambientTempC, air leaves at maxPermissibleTempC
    // Air specific heat c = 1.005 kJ/(kg·K), density ρ = 1.2 kg/m³ => V = 3.1 * P / ΔT
    return Math.round((3.1 * excessHeatW) / allowableDeltaTC);
  }, [excessHeatW, allowableDeltaTC]);

  // Recommended standard fan airflow with 20% safety margin for filter clogging
  const recommendedFanAirflowM3h = Math.round(requiredAirflowM3h * 1.2);

  // Required cooling power for Air Conditioning (in Watts and BTU/h)
  // When sealed or ambient temp >= internal target, AC is mandatory
  const requiredCoolingPowerWatts = useMemo(() => {
    // Safety factor of 1.15 per IEC 61439-1
    return Math.round(totalHeatLoadW * 1.15);
  }, [totalHeatLoadW]);

  const requiredCoolingPowerBtu = Math.round(requiredCoolingPowerWatts * 3.412);

  // Recommended thermal solution assessment
  const thermalDiagnostic = useMemo(() => {
    if (ambientTempC >= maxPermissibleTempC) {
      return {
        status: 'CRITICAL_AC_REQUIRED',
        severity: 'CRITICAL',
        title: isFr ? 'Climatiseur Industriel Obligatoire' : 'Industrial Enclosure AC Required',
        message: isFr 
          ? `La température ambiante du local (${ambientTempC}°C) est supérieure ou égale à la consigne interne (${maxPermissibleTempC}°C). La ventilation naturelle ou forcée ne peut pas refroidir l'armoire.`
          : `Ambient switchroom temperature (${ambientTempC}°C) reaches or exceeds internal maximum target (${maxPermissibleTempC}°C). Ambient ventilation cannot cool the switchboard.`
      };
    } else if (excessHeatW <= 0) {
      return {
        status: 'NATURAL_CONVECTION_ADEQUATE',
        severity: 'SUCCESS',
        title: isFr ? 'Convection Naturelle Suffisante' : 'Natural Convection Adequate',
        message: isFr 
          ? `La surface de l'armoire (${effectiveCoolingSurfaceAe.toFixed(2)} m²) dissipe naturellement ${naturalDissipationCapacityW} W, supérieur aux ${totalHeatLoadW} W de pertes. Température interne estimée : ${naturalInternalTempC}°C.`
          : `Effective enclosure surface (${effectiveCoolingSurfaceAe.toFixed(2)} m²) naturally evacuates ${naturalDissipationCapacityW} W, exceeding ${totalHeatLoadW} W total losses. Estimated internal temperature: ${naturalInternalTempC}°C.`
      };
    } else if (ventilationType === 'SEALED_IP54_IP65' || requiredAirflowM3h > 1200) {
      return {
        status: 'AC_CHILLER_RECOMMENDED',
        severity: 'WARNING',
        title: isFr ? 'Groupe de Climatisation Recommandé' : 'Cabinet Air Conditioner Recommended',
        message: isFr
          ? `L'excédent thermique de ${excessHeatW} W en enveloppe étanche nécessite un climatiseur de ${requiredCoolingPowerWatts} W (${(requiredCoolingPowerWatts/1000).toFixed(2)} kW / ${requiredCoolingPowerBtu} BTU/h).`
          : `Thermal excess of ${excessHeatW} W in sealed enclosure requires a cooling unit rated at ${requiredCoolingPowerWatts} W (${(requiredCoolingPowerWatts/1000).toFixed(2)} kW / ${requiredCoolingPowerBtu} BTU/h).`
      };
    } else {
      return {
        status: 'FORCED_VENTILATION_REQUIRED',
        severity: 'WARNING',
        title: isFr ? 'Ventilation Forcée par Ventilateur Recommandée' : 'Forced Filter Fan Required',
        message: isFr 
          ? `L'enveloppe nécessite une ventilation forcée d'au moins ${recommendedFanAirflowM3h} m³/h pour évacuer les ${excessHeatW} W excédentaires et limiter l'échauffement à ${maxPermissibleTempC}°C.`
          : `The switchboard requires forced filter fan ventilation of at least ${recommendedFanAirflowM3h} m³/h to remove the ${excessHeatW} W excess heat and keep internal temperature under ${maxPermissibleTempC}°C.`
      };
    }
  }, [ambientTempC, maxPermissibleTempC, excessHeatW, naturalDissipationCapacityW, totalHeatLoadW, effectiveCoolingSurfaceAe, naturalInternalTempC, ventilationType, requiredAirflowM3h, recommendedFanAirflowM3h, requiredCoolingPowerWatts, requiredCoolingPowerBtu, isFr]);

  return (
    <div className="space-y-6" id="project-thermal-dissipation-engine">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 rounded-xl text-rose-400">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {isFr 
                    ? '22. Dissipation Thermique TGBT & Refroidissement d\'Enveloppe'
                    : '22. Switchboard Thermal Dissipation & Enclosure Cooling Engine'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  IEC 61439-1 / IEC TR 60890
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Bilan des pertes Joule (Ploss) des appareils, surface efficace d\'échange Ae, échauffement admissible ΔT et dimensionnement de la ventilation ou climatisation.'
                  : 'Joule loss power balance (Ploss), effective heat exchange surface Ae, allowable temperature rise ΔT, and ventilation or air conditioning sizing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Pertes Totales (Ploss)' : 'Total Joule Losses'}
              </span>
              <span className="text-base font-bold font-mono text-rose-400">
                {totalHeatLoadW} W
              </span>
            </div>
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'T° Interne Estimée' : 'Est. Internal Temp'}
              </span>
              <span className={`text-base font-bold font-mono ${naturalInternalTempC > maxPermissibleTempC ? 'text-rose-400' : 'text-emerald-400'}`}>
                {naturalInternalTempC}°C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Diagnostic Summary Alert */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-lg ${
        thermalDiagnostic.severity === 'CRITICAL'
          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          : thermalDiagnostic.severity === 'WARNING'
          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
      }`}>
        {thermalDiagnostic.severity === 'CRITICAL' ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : thermalDiagnostic.severity === 'WARNING' ? (
          <Wind className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs">
          <span className="font-bold text-sm tracking-wide block">
            {thermalDiagnostic.title}
          </span>
          <p className="leading-relaxed opacity-90">
            {thermalDiagnostic.message}
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Parameter Controls and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Physical & Environmental Setup (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* A. Dimensions & Layout */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-cyan-400" />
                {isFr ? 'DIMENSIONS DE L\'ENVELOPPE TGBT' : 'SWITCHBOARD ENCLOSURE GEOMETRY'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Ae = {effectiveCoolingSurfaceAe.toFixed(2)} m²
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Hauteur (H)' : 'Height (H)'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={enclosureHeight}
                    step={100}
                    min={1200}
                    max={2400}
                    onChange={(e) => setEnclosureHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-500">mm</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Largeur (W)' : 'Width/Col (W)'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={enclosureWidth}
                    step={100}
                    min={400}
                    max={1400}
                    onChange={(e) => setEnclosureWidth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-500">mm</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Profondeur (D)' : 'Depth (D)'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={enclosureDepth}
                    step={50}
                    min={400}
                    max={1000}
                    onChange={(e) => setEnclosureDepth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-500">mm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Nombre de Colonnes' : 'Column Sections'}
                </label>
                <input 
                  type="number"
                  value={columnCount}
                  min={1}
                  max={12}
                  onChange={(e) => setColumnCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Matériau d\'Enveloppe' : 'Enclosure Material'}
                </label>
                <select 
                  value={enclosureMaterial}
                  onChange={(e) => setEnclosureMaterial(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                >
                  <option value="PAINTED_STEEL">{isFr ? 'Tôle d\'Acier Peinte (k=5.5)' : 'Painted Sheet Steel (k=5.5)'}</option>
                  <option value="STAINLESS_STEEL">{isFr ? 'Inox 304/316 (k=4.5)' : 'Stainless Steel (k=4.5)'}</option>
                  <option value="ALUMINUM">{isFr ? 'Aluminium Anodisé (k=12.0)' : 'Aluminum (k=12.0)'}</option>
                  <option value="POLYESTER">{isFr ? 'Polyester Chargé Verre (k=3.5)' : 'Polyester GRP (k=3.5)'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isFr ? 'Type d\'Implantation (IEC TR 60890)' : 'Mounting Arrangement (IEC TR 60890)'}
              </label>
              <select 
                value={installationType}
                onChange={(e) => setInstallationType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              >
                <option value="FREE_STANDING">{isFr ? 'Enveloppe isolée accessible tous côtés (Ae max)' : 'Free-standing single enclosure (Max Ae)'}</option>
                <option value="AGAINST_WALL">{isFr ? 'Adossée au mur (face arrière couverte)' : 'Against wall (Rear face covered)'}</option>
                <option value="START_OF_ROW">{isFr ? 'Tête de rangée de tableaux' : 'Start/End of suite row'}</option>
                <option value="MIDDLE_OF_ROW">{isFr ? 'Colonne centrale de rangée TGBT' : 'Middle of suite row (Sides covered)'}</option>
                <option value="CORNER">{isFr ? 'En angle de local (arrière et un côté couverts)' : 'Corner mounted (Rear & side covered)'}</option>
                <option value="WALL_MOUNTED_RECESS">{isFr ? 'Encastrée en niche murale' : 'Recessed into wall alcove'}</option>
              </select>
            </div>
          </div>

          {/* B. Temperatures and Environmental Limits */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                {isFr ? 'CONDITIONS THERMIQUES DU LOCAL' : 'AMBIENT & TEMPERATURE LIMITS'}
              </span>
              <span className="text-[10px] font-mono text-amber-400">
                ΔT_max = {allowableDeltaTC} K
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">{isFr ? 'Température Ambiante du Local (Tamb)' : 'Switchroom Ambient Temp (Tamb)'}</span>
                  <span className="font-mono font-bold text-amber-400">{ambientTempC} °C</span>
                </div>
                <input 
                  type="range"
                  min={15}
                  max={50}
                  step={1}
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>15°C (Climatisé)</span>
                  <span>35°C (Standard CEI)</span>
                  <span>45°C+ (Tropicalisé)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">{isFr ? 'Température Interne Cible Maximale (Ti_max)' : 'Max Target Internal Temp (Ti_max)'}</span>
                  <span className="font-mono font-bold text-rose-400">{maxPermissibleTempC} °C</span>
                </div>
                <input 
                  type="range"
                  min={35}
                  max={65}
                  step={1}
                  value={maxPermissibleTempC}
                  onChange={(e) => setMaxPermissibleTempC(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-slate-800 h-1.5 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>45°C (Électronique Sensible)</span>
                  <span>55°C (Standard TGBT)</span>
                  <span>65°C (Appareillage Brut)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {isFr ? 'Mode de Ventilation Cible' : 'Ventilation Strategy'}
                  </label>
                  <select 
                    value={ventilationType}
                    onChange={(e) => setVentilationType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  >
                    <option value="NATURAL_VENTILATION">{isFr ? 'Grilles Naturelles (IP31/41)' : 'Natural Louvres (IP31/41)'}</option>
                    <option value="SEALED_IP54_IP65">{isFr ? 'Enveloppe Étanche (IP54/65)' : 'Sealed Enclosure (IP54/65)'}</option>
                    <option value="FORCED_VENTILATION">{isFr ? 'Ventilateur Filtrant Forcé' : 'Forced Filter Fan Unit'}</option>
                    <option value="AIR_CONDITIONING">{isFr ? 'Climatiseur Réfrigérant' : 'Air Conditioner Unit'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {isFr ? 'Rayonnement Solaire Direct' : 'Solar Radiation Exposure'}
                  </label>
                  <select 
                    value={solarRadiationW_m2}
                    onChange={(e) => setSolarRadiationW_m2(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  >
                    <option value={0}>{isFr ? 'Intérieur (0 W/m²)' : 'Indoor switchroom (0 W/m²)'}</option>
                    <option value={300}>{isFr ? 'Extérieur Ombragé (300 W/m²)' : 'Outdoor with sunshield (300 W/m²)'}</option>
                    <option value={750}>{isFr ? 'Plein Soleil Tropical (750 W/m²)' : 'Direct Tropical Sun (750 W/m²)'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* C. Major Heat-Producing Equipment Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              {isFr ? 'COMPOSANTS ÉMETTEURS PARTICULIERS' : 'HIGH HEAT EMITTING APPARATUS'}
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Variateur / Démarreur VFD' : 'Installed VFD Rating'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    min={0}
                    max={250}
                    value={vfdRatedPowerKw}
                    onChange={(e) => setVfdRatedPowerKw(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-500">kW</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Onduleur ASI Auxiliaire' : 'Auxiliary UPS Inverter'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    min={0}
                    max={60}
                    value={upsAuxKva}
                    onChange={(e) => setUpsAuxKva(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-500">kVA</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Heat Loss Breakdown & Cooling Sizing Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Heat Loss Breakdown Table (Ploss per component) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                {isFr ? 'VENTILATION DÉTAILLÉE DES PERTES JOULE (Ploss)' : 'DETAILED JOULE LOSS BREAKDOWN (Ploss)'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Incomer = {tgbtCurrentA} A
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                    <th className="py-2">{isFr ? 'Équipement / Organe' : 'Apparatus / Component'}</th>
                    <th className="py-2 text-center">{isFr ? 'Facteur Charge' : 'Load Factor'}</th>
                    <th className="py-2 text-right">{isFr ? 'Pertes (W)' : 'Losses (W)'}</th>
                    <th className="py-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dissipationList.map((item) => {
                    const pct = totalHeatDissipationW > 0 
                      ? ((item.totalLossW / totalHeatDissipationW) * 100).toFixed(1) 
                      : '0';
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-2 text-slate-200">
                          {item.name}
                        </td>
                        <td className="py-2 text-center text-slate-400">
                          {(item.loadingFactor * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 text-right font-bold text-rose-400">
                          {item.totalLossW} W
                        </td>
                        <td className="py-2 text-right text-slate-500">
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                  {solarHeatGainW > 0 && (
                    <tr className="bg-amber-950/20 text-amber-300">
                      <td className="py-2 font-bold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        {isFr ? 'Apport Solaire Extérieur' : 'External Solar Radiation Gain'}
                      </td>
                      <td className="py-2 text-center font-mono">-</td>
                      <td className="py-2 text-right font-bold font-mono">+{solarHeatGainW} W</td>
                      <td className="py-2 text-right font-mono">-</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-700 font-bold bg-slate-950/40">
                    <td className="py-2.5 text-white">
                      {isFr ? 'PUISSANCE THERMIQUE TOTALE À ÉVACUER' : 'TOTAL THERMAL LOAD TO REMOVE'}
                    </td>
                    <td className="py-2.5 text-center text-cyan-400">-</td>
                    <td className="py-2.5 text-right text-rose-400 text-sm">
                      {totalHeatLoadW} W
                    </td>
                    <td className="py-2.5 text-right text-white">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Sizing Results: Natural vs Forced vs Air Conditioning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Natural Dissipation Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  {isFr ? 'DISSIPATION NATURELLE' : 'NATURAL DISSIPATION'}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  excessHeatW === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {excessHeatW === 0 ? (isFr ? 'SUFFISANT' : 'SUFFICIENT') : (isFr ? 'DÉFICIT' : 'DEFICIT')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Surface efficace (Ae) :' : 'Effective surface (Ae):'}</span>
                  <span className="font-mono text-white font-bold">{effectiveCoolingSurfaceAe.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Capacité naturelle (P_nat) :' : 'Natural capacity (P_nat):'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{naturalDissipationCapacityW} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Excédent thermique :' : 'Excess thermal power:'}</span>
                  <span className={`font-mono font-bold ${excessHeatW > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {excessHeatW > 0 ? `+${excessHeatW} W` : '0 W'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">{isFr ? 'Temp. interne sans ventilation :' : 'Internal temp without cooling:'}</span>
                  <span className={`font-mono font-bold ${naturalInternalTempC > maxPermissibleTempC ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {naturalInternalTempC} °C
                  </span>
                </div>
              </div>
            </div>

            {/* Forced Ventilation & AC Sizing Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-amber-300 flex items-center gap-1.5">
                  <Fan className="w-4 h-4" />
                  {isFr ? 'DIMENSIONNEMENT ACTIF' : 'ACTIVE COOLING SIZING'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  IEC TR 60890
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Débit d\'air ventilateur requis :' : 'Required fan airflow:'}</span>
                  <span className="font-mono text-amber-400 font-bold">{requiredAirflowM3h} m³/h</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Ventilateur recommandé (+20%) :' : 'Recommended fan unit (+20%):'}</span>
                  <span className="font-mono text-amber-300 font-bold">{recommendedFanAirflowM3h} m³/h</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{isFr ? 'Puissance frigorifique Climatiseur :' : 'AC Cooling Power (Watts):'}</span>
                  <span className="font-mono text-cyan-300 font-bold">{requiredCoolingPowerWatts} W ({(requiredCoolingPowerWatts/1000).toFixed(2)} kW)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">{isFr ? 'Puissance frigorifique (BTU) :' : 'AC Cooling Power (BTU/h):'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{requiredCoolingPowerBtu.toLocaleString()} BTU/h</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Engineering Recommendations & Standards Compliance Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isFr 
                ? 'RECOMMANDATIONS DE CONCEPTION SELON CEI 61439-1 / GUIDE TECHNIQUE'
                : 'ENGINEERING GUIDELINES PER IEC 61439-1 & THERMAL DESIGN'}
            </div>

            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">{isFr ? 'Emplacement des points chauds :' : 'Hot spot arrangement:'}</strong>{' '}
                {isFr 
                  ? 'Placer les variateurs VFD, démarreurs et onduleurs dans la partie supérieure de l\'armoire pour favoriser la convection naturelle ou installer une gaine d\'extraction directe au refoulement.'
                  : 'Locate VFDs, soft starters, and UPS in the upper compartment or provide direct top exhaust ducting to prevent heating lower tier switchgear.'}
              </li>
              <li>
                <strong className="text-white">{isFr ? 'Déclassement des disjoncteurs :' : 'Circuit breaker derating:'}</strong>{' '}
                {isFr 
                  ? `Si la température interne dépasse 40°C, les déclencheurs magnéto-thermiques ou électroniques subissent un déclassement en courant (In_derated ≈ In * √(1 - (T_int - 40)/60)). Température actuelle : ${naturalInternalTempC}°C.`
                  : `Thermal-magnetic trips require current derating when internal temperature exceeds 40°C. Estimated current internal temp: ${naturalInternalTempC}°C.`}
              </li>
              <li>
                <strong className="text-white">{isFr ? 'Condensation et régulation hygrométrique :' : 'Anti-condensation heaters:'}</strong>{' '}
                {isFr 
                  ? 'Prévoir des résistances chauffantes de 50-100 W asservies par hygrostat réglé à 70% HR pour prévenir la formation de rosée lors des arrêts nocturnes du TGBT.'
                  : 'Install 50-100 W anti-condensation space heaters controlled by humidistat (set to 70% RH) to avoid dew point condensation during shutdown.'}
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
