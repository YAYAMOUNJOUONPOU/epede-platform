// src/components/safety/SubstationEarthingLightningWorkbench.tsx
// EPEDE Engineering Workbench — Domain D16: Electrical Safety, Earthing & Lightning
// (Sécurité Électrique, Prises de Terre, Grilles Postes IEEE 80, Risque d'Arc IEEE 1584 & Protection Foudre CEI 62305)
// Grounded in IEEE Std 80-2013, IEEE 1584-2018 / NFPA 70E, IEC 62305-1..4, IEC 60099-4 (ZnO Surge Arresters),
// and authentic Cameroon high-keraunic soil challenges (Oyomabang, Mangombé, Bekoko, Nachtigal).

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  RotateCcw,
  Waves,
  Eye,
  Info,
  Flame,
  FileText,
  TrendingUp,
  Cpu,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface SubstationEarthingLightningWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarId =
  | 'IEEE80_GRID_SOLVER'
  | 'ARC_FLASH_IEEE1584'
  | 'LIGHTNING_ROLLING_SPHERE'
  | 'SURGE_ARRESTER_ZNO'
  | 'EARTHING_SCHEMES_TT_TN_IT'
  | 'EQUIPOTENTIAL_MAP_2D'
  | 'CAMEROON_SAFETY_CASES';

export const SubstationEarthingLightningWorkbench: React.FC<SubstationEarthingLightningWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarId>('IEEE80_GRID_SOLVER');

  // ==========================================
  // PILLAR 1: IEEE 80 SUBSTATION GROUND GRID SOLVER
  // ==========================================
  // Parameters for IEEE Std 80-2013 analytical equations
  const [soilResistivity, setSoilResistivity] = useState<number>(180); // ohm-m (native soil)
  const [surfaceResistivity, setSurfaceResistivity] = useState<number>(3000); // ohm-m (crushed rock)
  const [surfaceThickness, setSurfaceThickness] = useState<number>(0.15); // meters (15 cm)
  const [gridLengthX, setGridLengthX] = useState<number>(60); // meters
  const [gridWidthY, setGridWidthY] = useState<number>(40); // meters
  const [gridDepth, setGridDepth] = useState<number>(0.6); // meters
  const [numConductorsX, setNumConductorsX] = useState<number>(7); // parallel conductors X
  const [numConductorsY, setNumConductorsY] = useState<number>(5); // parallel conductors Y
  const [groundRodsCount, setGroundRodsCount] = useState<number>(16); // vertical rods
  const [groundRodLength, setGroundRodLength] = useState<number>(3.0); // meters per rod
  const [faultCurrentIf, setFaultCurrentIf] = useState<number>(18.5); // kA (ground fault)
  const [faultClearingTime, setFaultClearingTime] = useState<number>(0.25); // seconds (ts)
  const [bodyWeight, setBodyWeight] = useState<'50kg' | '70kg'>('50kg');
  const [currentDivisionFactorSf, setCurrentDivisionFactorSf] = useState<number>(0.65); // Split factor Sf

  // IEEE 80 Calculations
  const ieee80Results = useMemo(() => {
    // 1. Surface reflection factor K and derating factor Cs
    const K = (soilResistivity - surfaceResistivity) / (soilResistivity + surfaceResistivity);
    // Empirical IEEE 80 Cs formula:
    const Cs = Math.max(0.6, Math.min(1.0, 1 - (0.09 * (1 - soilResistivity / surfaceResistivity)) / (2 * surfaceThickness + 0.09)));

    // 2. Tolerable Touch and Step Voltages
    // 50kg body: E_touch = (1000 + 1.5 * Cs * rho_s) * 0.116 / sqrt(ts)
    // 70kg body: E_touch = (1000 + 1.5 * Cs * rho_s) * 0.157 / sqrt(ts)
    const factorK = bodyWeight === '50kg' ? 0.116 : 0.157;
    const tolerableTouch = ((1000 + 1.5 * Cs * surfaceResistivity) * factorK) / Math.sqrt(faultClearingTime);
    const tolerableStep = ((1000 + 6.0 * Cs * surfaceResistivity) * factorK) / Math.sqrt(faultClearingTime);

    // 3. Conductor Geometry & Total Length
    const areaA = gridLengthX * gridWidthY; // m²
    const perimeterLp = 2 * (gridLengthX + gridWidthY); // m
    const horizontalLengthLc = numConductorsX * gridWidthY + numConductorsY * gridLengthX; // m
    const verticalLengthLr = groundRodsCount * groundRodLength; // m
    const totalLengthLt = horizontalLengthLc + verticalLengthLr; // m

    // Spacing between conductors
    const D = Math.sqrt(areaA / Math.max(1, (numConductorsX - 1) * (numConductorsY - 1)));

    // 4. Ground Grid Resistance (Sverak formula per IEEE 80-2013 §14.2)
    // Rg = rho * [ 1/Lt + 1/sqrt(20*A) * (1 + 1/(1 + h*sqrt(20/A))) ]
    const term1 = 1 / Math.max(1, totalLengthLt);
    const term2 = 1 / Math.sqrt(20 * areaA);
    const term3 = 1 + 1 / (1 + gridDepth * Math.sqrt(20 / areaA));
    const Rg = soilResistivity * (term1 + term2 * term3);

    // 5. Grid Current (Ig) and Ground Potential Rise (GPR)
    const gridCurrentIg = faultCurrentIf * 1000 * currentDivisionFactorSf; // Amps
    const GPR = gridCurrentIg * Rg; // Volts

    // 6. Mesh Voltage (Em) and Step Voltage (Es)
    // Geometric factors
    const n = Math.sqrt(numConductorsX * numConductorsY);
    const h0 = 1.0;
    const K_h = Math.sqrt(1 + gridDepth / h0);
    // simplified Km & Ki per IEEE 80:
    const Km = (1 / (2 * Math.PI)) * (
      Math.log((D * D) / (16 * gridDepth * 0.012)) +
      (1 / K_h) * Math.log(8 / (Math.PI * (2 * n - 1)))
    );
    const Ki = 0.644 + 0.148 * n;
    const Lm = horizontalLengthLc + (1.55 + 1.22 * (groundRodLength / Math.sqrt(gridLengthX * gridLengthX + gridWidthY * gridWidthY))) * verticalLengthLr;
    const meshVoltageEm = (soilResistivity * Km * Ki * gridCurrentIg) / Math.max(10, Lm);

    // Step voltage factor Ks
    const Ks = (1 / Math.PI) * (1 / (2 * gridDepth) + 1 / (D + gridDepth) + (1 / D) * (1 - Math.pow(0.5, n - 2)));
    const Ls = 0.75 * horizontalLengthLc + 0.85 * verticalLengthLr;
    const stepVoltageEs = (soilResistivity * Ks * Ki * gridCurrentIg) / Math.max(10, Ls);

    // Safety Compliance Check
    const touchCompliant = meshVoltageEm <= tolerableTouch;
    const stepCompliant = stepVoltageEs <= tolerableStep;
    const overallCompliant = touchCompliant && stepCompliant;

    return {
      Cs,
      tolerableTouch,
      tolerableStep,
      totalLengthLt,
      Rg,
      gridCurrentIg,
      GPR,
      meshVoltageEm,
      stepVoltageEs,
      touchCompliant,
      stepCompliant,
      overallCompliant,
      D,
      areaA
    };
  }, [
    soilResistivity,
    surfaceResistivity,
    surfaceThickness,
    gridLengthX,
    gridWidthY,
    gridDepth,
    numConductorsX,
    numConductorsY,
    groundRodsCount,
    groundRodLength,
    faultCurrentIf,
    faultClearingTime,
    bodyWeight,
    currentDivisionFactorSf
  ]);

  // ==========================================
  // PILLAR 2: IEEE 1584 / NFPA 70E ARC FLASH SOLVER
  // ==========================================
  const [arcNominalVoltage, setArcNominalVoltage] = useState<number>(400); // Volts
  const [arcFaultCurrentIbf, setArcFaultCurrentIbf] = useState<number>(25); // kA bolted
  const [arcClearingTime, setArcClearingTime] = useState<number>(0.12); // seconds
  const [workingDistanceD, setWorkingDistanceD] = useState<number>(457); // mm (18 inches)
  const [enclosureType, setEnclosureType] = useState<'VCB' | 'VCBB' | 'HCB' | 'OPEN_AIR'>('VCB');
  const [gapBetweenElectrodes, setGapBetweenElectrodes] = useState<number>(25); // mm

  const arcFlashResults = useMemo(() => {
    // IEEE 1584-2018 model empirical approximation
    // Arcing Current Iarc
    const logIarc = 0.00402 + 0.983 * Math.log10(arcFaultCurrentIbf) + (arcNominalVoltage < 1000 ? 0.024 : 0.08);
    const Iarc = Math.pow(10, logIarc);

    // Enclosure correction factor
    let kEnc = 1.0;
    if (enclosureType === 'VCB') kEnc = 1.25;
    else if (enclosureType === 'VCBB') kEnc = 1.45;
    else if (enclosureType === 'HCB') kEnc = 1.35;
    else kEnc = 0.85; // OPEN_AIR

    // Incident Energy at working distance E (cal/cm²)
    // Standard empirical scaling: E ~ 4.184 * 10^(k1 + k2*logIarc) * (t/0.2) * (610/D)^x
    const expDistance = enclosureType === 'OPEN_AIR' ? 2.0 : 1.47;
    const baseEnergy = (4.184 * 0.55 * Math.pow(Iarc / 20, 1.2) * (arcClearingTime / 0.1) * kEnc * (gapBetweenElectrodes / 25)) / 4.184;
    const distanceCorrection = Math.pow(610 / Math.max(100, workingDistanceD), expDistance);
    const incidentEnergy = Math.max(0.1, Number((baseEnergy * distanceCorrection).toFixed(2)));

    // Arc Flash Boundary (AFB) for 1.2 cal/cm² (onset of 2nd degree burn)
    const AFB = Math.round(610 * Math.pow(incidentEnergy / 1.2, 1 / expDistance));

    // NFPA 70E PPE Category
    let ppeCategory = 'Cat 1';
    let ppeRating = 'Minimum 4 cal/cm²';
    let ppeColor = 'text-blue-400 border-blue-800 bg-blue-950/40';
    if (incidentEnergy > 40) {
      ppeCategory = 'DANGER EXTREME';
      ppeRating = 'NO PPE SUFFICIENT (> 40 cal/cm² - TRAVAIL INTERDIT SOUS TENSION)';
      ppeColor = 'text-red-400 border-red-800 bg-red-950/60 animate-pulse';
    } else if (incidentEnergy > 25) {
      ppeCategory = 'Cat 4';
      ppeRating = 'Scaphandre d\'arc 40 cal/cm² avec cagoule intégrale ventilée';
      ppeColor = 'text-orange-400 border-orange-800 bg-orange-950/40';
    } else if (incidentEnergy > 8) {
      ppeCategory = 'Cat 3';
      ppeRating = 'Combinaison Arc Flash 25 cal/cm² + Écran facial teinté';
      ppeColor = 'text-amber-400 border-amber-800 bg-amber-950/40';
    } else if (incidentEnergy > 4) {
      ppeCategory = 'Cat 2';
      ppeRating = 'Vêtements ignifuges 8 cal/cm² + Visière de protection arc';
      ppeColor = 'text-yellow-400 border-yellow-800 bg-yellow-950/40';
    }

    return {
      Iarc: Number(Iarc.toFixed(2)),
      incidentEnergy,
      AFB,
      ppeCategory,
      ppeRating,
      ppeColor
    };
  }, [arcNominalVoltage, arcFaultCurrentIbf, arcClearingTime, workingDistanceD, enclosureType, gapBetweenElectrodes]);

  // ==========================================
  // PILLAR 3: IEC 62305 LIGHTNING ROLLING SPHERE
  // ==========================================
  const [lpsLevel, setLpsLevel] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [mastHeightH, setMastHeightH] = useState<number>(24); // meters (pylone / paratonnerre)
  const [substationLength, setSubstationLength] = useState<number>(80); // meters
  const [substationWidth, setSubstationWidth] = useState<number>(50); // meters
  const [keraunicLevelTd, setKeraunicLevelTd] = useState<number>(140); // thunderstorm days/yr (high in Cameroon)

  const lightningResults = useMemo(() => {
    // Rolling sphere radius R per IEC 62305-1
    const sphereRadius = lpsLevel === 'I' ? 20 : lpsLevel === 'II' ? 30 : lpsLevel === 'III' ? 45 : 60; // meters
    const peakCurrentI = lpsLevel === 'I' ? 200 : lpsLevel === 'II' ? 150 : lpsLevel === 'III' ? 100 : 100; // kA (10/350 us)

    // Flash density Ng per km²/year: Ng ~ 0.04 * Td^1.25 (empirical IEC 62305-2)
    const flashDensityNg = Number((0.04 * Math.pow(keraunicLevelTd, 1.25)).toFixed(2));

    // Protection radius at ground level r = sqrt(h * (2R - h)) if h < R
    const effectiveH = Math.min(mastHeightH, sphereRadius);
    const groundProtectionRadius = Math.round(Math.sqrt(effectiveH * (2 * sphereRadius - effectiveH)));

    // Substation equivalent collection area Ad (km²)
    // Ad = L*W + 2*(L+W)*sqrt(H*(2R-H)) + pi*H*(2R-H) (approx for structure)
    const subAreaM2 = substationLength * substationWidth + 2 * (substationLength + substationWidth) * 3 * mastHeightH;
    const collectionAreaKm2 = subAreaM2 / 1_000_000;
    const expectedDirectStrikesNd = Number((collectionAreaKm2 * flashDensityNg).toFixed(4));
    const returnPeriodYears = expectedDirectStrikesNd > 0 ? Math.round(1 / expectedDirectStrikesNd) : 999;

    // Minimum number of air terminals / masts needed to cover substation area
    const protectedAreaPerMast = Math.PI * groundProtectionRadius * groundProtectionRadius * 0.7; // overlapping factor
    const minMastsNeeded = Math.max(1, Math.ceil((substationLength * substationWidth) / protectedAreaPerMast));

    return {
      sphereRadius,
      peakCurrentI,
      flashDensityNg,
      groundProtectionRadius,
      expectedDirectStrikesNd,
      returnPeriodYears,
      minMastsNeeded
    };
  }, [lpsLevel, mastHeightH, substationLength, substationWidth, keraunicLevelTd]);

  // ==========================================
  // PILLAR 4: SURGE ARRESTER ZnO SIZING (IEC 60099-4)
  // ==========================================
  const [gridNominalVoltageUs, setGridNominalVoltageUs] = useState<number>(225); // kV
  const [earthFaultFactorK, setEarthFaultFactorK] = useState<number>(1.4); // Effective grounded (1.3-1.4) or isolated (1.73)
  const [temporaryOvervoltageDuration, setTemporaryOvervoltageDuration] = useState<number>(1.0); // seconds (Tov)
  const [arresterClass, setArresterClass] = useState<'DH' | 'SL' | 'SM' | 'SH'>('SM'); // IEC 60099-4 thermal energy class

  const arresterResults = useMemo(() => {
    // 1. Continuous Operating Voltage (Uc / MCOV)
    // Uc >= Us_max / sqrt(3)
    const UsMax = gridNominalVoltageUs * 1.15; // 15% tolerance
    const minUc = Number((UsMax / Math.sqrt(3)).toFixed(1));

    // 2. Rated Voltage (Ur) based on TOV capability
    // Utov = k * (UsMax / sqrt(3))
    const Utov = Number((earthFaultFactorK * (UsMax / Math.sqrt(3))).toFixed(1));
    // ZnO arrester TOV capability curve: Ur >= Utov / Ktov(t) where Ktov(1s) ~ 1.15
    const Ktov = temporaryOvervoltageDuration <= 1.0 ? 1.15 : 1.05;
    const calculatedUr = Math.max(Math.round(minUc * 1.25), Math.round(Utov / Ktov));

    // 3. Lightning Impulse Protective Level (LIPL / Upl) @ 10 kA (8/20 us)
    // Typically Upl ~ 2.4 - 2.6 * Ur
    const Upl = Math.round(calculatedUr * 2.45);

    // 4. Basic Lightning Insulation Level (BIL) of protected transformer
    // Standard IEC 60071 BIL: for 225 kV, BIL is typically 950 kV or 1050 kV; for 90 kV it is 450 kV
    let transformerBil = 950;
    if (gridNominalVoltageUs <= 33) transformerBil = 170;
    else if (gridNominalVoltageUs <= 90) transformerBil = 450;
    else if (gridNominalVoltageUs <= 110) transformerBil = 550;
    else if (gridNominalVoltageUs <= 225) transformerBil = 1050;
    else transformerBil = 1425;

    // 5. Protective Margin (PM)
    // PM = (BIL - Upl) / Upl * 100% (mandated >= 15% to 20% by IEC 60071-2)
    const protectiveMargin = Number((((transformerBil - Upl) / Upl) * 100).toFixed(1));
    const marginSatisfactory = protectiveMargin >= 20.0;

    // 6. Thermal Energy Rating Wth (kJ/kV of Ur)
    const energyRating = arresterClass === 'DH' ? 3.0 : arresterClass === 'SL' ? 5.5 : arresterClass === 'SM' ? 8.0 : 12.0;
    const totalEnergyCapacityKj = Math.round(calculatedUr * energyRating);

    return {
      UsMax,
      minUc,
      Utov,
      calculatedUr,
      Upl,
      transformerBil,
      protectiveMargin,
      marginSatisfactory,
      energyRating,
      totalEnergyCapacityKj
    };
  }, [gridNominalVoltageUs, earthFaultFactorK, temporaryOvervoltageDuration, arresterClass]);

  // ==========================================
  // PILLAR 5: EARTHING SYSTEM COMPARATOR (TT / TN-S / TN-C / IT)
  // ==========================================
  const [selectedScheme, setSelectedScheme] = useState<'TT' | 'TN_S' | 'TN_C' | 'IT'>('TN_S');

  // Selected Cameroon case
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE_OYOMABANG_HIGH_RES');

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                DOMAIN D16 · WORKBENCH EXPERT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">
                SAFETY CRITICAL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-amber-400" />
              <span>{locale === 'fr' ? 'Sécurité Électrique, Grilles de Terre & Foudre' : 'Electrical Safety, Earthing & Lightning Systems'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Conception conforme IEEE 80-2013, analyse d\'arc électrique IEEE 1584 / NFPA 70E, sphère fictive CEI 62305, parafoudres ZnO CEI 60099-4 et retours d\'expérience haute kéraunique au Cameroun.'
                : 'Engineering compliant with IEEE Std 80-2013 ground grids, IEEE 1584 arc flash, IEC 62305 rolling sphere, IEC 60099-4 ZnO arresters, and high-keraunic African soil mitigation.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSoilResistivity(180);
                setGridLengthX(60);
                setGridWidthY(40);
                setFaultCurrentIf(18.5);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-700/50 text-amber-300 font-mono text-xs font-bold">
              IEEE 80 / 1584
            </span>
          </div>
        </div>
      </div>

      {/* PILLARS NAVIGATOR TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'IEEE80_GRID_SOLVER', label_fr: '1. Grille IEEE 80 (Pas & Toucher)', label_en: '1. IEEE 80 Grid Solver', icon: ShieldCheck },
          { id: 'EQUIPOTENTIAL_MAP_2D', label_fr: '2. Cartographie 2D Tensions', label_en: '2. 2D Voltage Field Map', icon: Layers },
          { id: 'ARC_FLASH_IEEE1584', label_fr: '3. Risque d\'Arc IEEE 1584 / NFPA', label_en: '3. Arc Flash Hazard (NFPA 70E)', icon: Flame },
          { id: 'LIGHTNING_ROLLING_SPHERE', label_fr: '4. Foudre & Sphère CEI 62305', label_en: '4. Lightning Rolling Sphere', icon: Zap },
          { id: 'SURGE_ARRESTER_ZNO', label_fr: '5. Parafoudres ZnO CEI 60099-4', label_en: '5. ZnO Surge Arresters', icon: Waves },
          { id: 'EARTHING_SCHEMES_TT_TN_IT', label_fr: '6. Régimes TT / TN / IT', label_en: '6. Grounding Schemes TT/TN/IT', icon: Cpu },
          { id: 'CAMEROON_SAFETY_CASES', label_fr: '7. Retours d\'Expérience Cameroun', label_en: '7. Cameroon Real Cases', icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePillar === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePillar(tab.id as PillarId)}
              className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{locale === 'fr' ? tab.label_fr : tab.label_en}</span>
            </button>
          );
        })}
      </div>

      {/* PILLAR CONTENT PANELS */}

      {/* PILLAR 1: IEEE 80 SUBSTATION GROUND GRID SOLVER */}
      {activePillar === 'IEEE80_GRID_SOLVER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Paramètres Géométriques & Sol' : 'Grid & Soil Parameters'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">IEEE Std 80-2013</span>
              </div>

              {/* Soil Resistivity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Résistivité du sol natif (ρ) :' : 'Native soil resistivity (ρ):'}</span>
                  <span className="text-amber-400 font-bold">{soilResistivity} Ω·m</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1200"
                  step="10"
                  value={soilResistivity}
                  onChange={(e) => setSoilResistivity(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>20 Ω·m (Humide / Littoral)</span>
                  <span>500 Ω·m (Granite / Oyomabang)</span>
                </div>
              </div>

              {/* Crushed Rock Layer */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Gravier de surface (ρs) :' : 'Crushed stone layer (ρs):'}</span>
                  <span className="text-amber-400 font-bold">{surfaceResistivity} Ω·m</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="250"
                  value={surfaceResistivity}
                  onChange={(e) => setSurfaceResistivity(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Surface Thickness hs */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Épaisseur gravier concassé (hs) :' : 'Surface layer thickness (hs):'}</span>
                  <span className="text-amber-400 font-bold">{surfaceThickness * 100} cm</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={surfaceThickness}
                  onChange={(e) => setSurfaceThickness(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Grid Dimensions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Longueur X (m)' : 'Length X (m)'}</label>
                  <input
                    type="number"
                    value={gridLengthX}
                    onChange={(e) => setGridLengthX(Math.max(10, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Largeur Y (m)' : 'Width Y (m)'}</label>
                  <input
                    type="number"
                    value={gridWidthY}
                    onChange={(e) => setGridWidthY(Math.max(10, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Meshing Conductors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Conducteurs en X' : 'Conductors in X'}</label>
                  <input
                    type="number"
                    min="3"
                    max="25"
                    value={numConductorsX}
                    onChange={(e) => setNumConductorsX(Math.max(2, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Conducteurs en Y' : 'Conductors in Y'}</label>
                  <input
                    type="number"
                    min="3"
                    max="25"
                    value={numConductorsY}
                    onChange={(e) => setNumConductorsY(Math.max(2, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Vertical Ground Rods */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Piquets verticaux' : 'Vertical Ground Rods'}</label>
                  <input
                    type="number"
                    min="0"
                    max="64"
                    value={groundRodsCount}
                    onChange={(e) => setGroundRodsCount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Longueur piquet (m)' : 'Rod length (m)'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={groundRodLength}
                    onChange={(e) => setGroundRodLength(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Electrical Fault Parameters */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{locale === 'fr' ? 'Courant de défaut à la terre (If) :' : 'Ground fault current (If):'}</span>
                    <span className="text-red-400 font-bold">{faultCurrentIf} kA</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="0.5"
                    value={faultCurrentIf}
                    onChange={(e) => setFaultCurrentIf(Number(e.target.value))}
                    className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Temps élimination ts (s)' : 'Clearing time ts (s)'}</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="1.5"
                      value={faultClearingTime}
                      onChange={(e) => setFaultClearingTime(Math.max(0.04, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Poids corporel' : 'Body weight'}</label>
                    <select
                      value={bodyWeight}
                      onChange={(e) => setBodyWeight(e.target.value as '50kg' | '70kg')}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                    >
                      <option value="50kg">50 kg (Conservateur)</option>
                      <option value="70kg">70 kg (Standard)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Verification Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Compliance Status Box */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                ieee80Results.overallCompliant
                  ? 'bg-emerald-950/40 border-emerald-700/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-red-950/50 border-red-700/80 shadow-lg shadow-red-950/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {ieee80Results.overallCompliant ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                  <h3 className="font-mono text-sm sm:text-base font-bold text-white uppercase">
                    {ieee80Results.overallCompliant
                      ? locale === 'fr' ? 'CONFORME AUX CRITÈRES DE SÉCURITÉ IEEE 80' : 'IEEE 80 SAFETY CRITERIA COMPLIANT'
                      : locale === 'fr' ? 'DANGER : CRITÈRES DE TENSION DÉPASSÉS' : 'CRITICAL HAZARD : THRESHOLDS EXCEEDED'}
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white">
                  GPR = {(ieee80Results.GPR / 1000).toFixed(1)} kV
                </span>
              </div>

              <p className="font-mono text-xs text-slate-300 leading-relaxed">
                {ieee80Results.overallCompliant
                  ? locale === 'fr'
                    ? 'Les tensions maximales calculées de maille (toucher) et de pas sont strictement inférieures aux seuils tolérables de fibrillation ventriculaire humaine.'
                    : 'Calculated mesh (touch) and step potentials remain safely below human ventricular fibrillation thresholds.'
                  : locale === 'fr'
                    ? 'Attention : La tension de maille ou de pas dépasse la limite admissible. Réduisez l\'espacement des mailles, ajoutez des piquets verticaux ou augmentez l\'épaisseur de gravier concassé.'
                    : 'Hazard: Calculated potentials exceed allowable limits. Reduce conductor spacing, install deep vertical rods, or increase crushed stone depth.'}
              </p>
            </div>

            {/* Core Calculations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Résistance Terre (Rg)' : 'Ground Resistance (Rg)'}</div>
                <div className="text-xl font-mono font-bold text-amber-400">{ieee80Results.Rg.toFixed(2)} Ω</div>
                <div className="text-[10px] font-mono text-slate-500">Objectif poste: &lt; 1.0 Ω</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Longueur Totale Cuivre' : 'Total Conductor Length'}</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{Math.round(ieee80Results.totalLengthLt)} m</div>
                <div className="text-[10px] font-mono text-slate-500">Grille + {groundRodsCount} piquets</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Facteur Déréflexion Cs' : 'Surface Derating Cs'}</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{ieee80Results.Cs.toFixed(3)}</div>
                <div className="text-[10px] font-mono text-slate-500">hs = {surfaceThickness * 100} cm</div>
              </div>
            </div>

            {/* Comparison Table: Calculated vs Tolerable */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{locale === 'fr' ? 'Contrôle des Tensions de Pas et Toucher' : 'Touch and Step Potentials Verification'}</span>
                <span className="text-[10px] text-slate-500">IEEE Std 80 §8</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Touch Voltage Comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Tension de maille (Toucher Em) :' : 'Mesh Voltage (Touch Em):'}</span>
                    <span className={`font-bold ${ieee80Results.touchCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {Math.round(ieee80Results.meshVoltageEm)} V
                      <span className="text-slate-500 text-[10px] ml-1">/ max {Math.round(ieee80Results.tolerableTouch)} V</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${ieee80Results.touchCompliant ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (ieee80Results.meshVoltageEm / ieee80Results.tolerableTouch) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0 V</span>
                    <span>Marge: {Math.round(ieee80Results.tolerableTouch - ieee80Results.meshVoltageEm)} V</span>
                    <span>{Math.round(ieee80Results.tolerableTouch)} V (Limite)</span>
                  </div>
                </div>

                {/* Step Voltage Comparison */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Tension de pas (Step Es) :' : 'Step Voltage (Step Es):'}</span>
                    <span className={`font-bold ${ieee80Results.stepCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {Math.round(ieee80Results.stepVoltageEs)} V
                      <span className="text-slate-500 text-[10px] ml-1">/ max {Math.round(ieee80Results.tolerableStep)} V</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${ieee80Results.stepCompliant ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (ieee80Results.stepVoltageEs / ieee80Results.tolerableStep) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0 V</span>
                    <span>Marge: {Math.round(ieee80Results.tolerableStep - ieee80Results.stepVoltageEs)} V</span>
                    <span>{Math.round(ieee80Results.tolerableStep)} V (Limite)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Recommendations Panel */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Recommandations d\'Ingénierie de Poste :' : 'Substation Engineering Design Rules:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>
                  {locale === 'fr'
                    ? 'Section minimale du conducteur en cuivre recuit étamé selon Onderdonk : Akcmil = I × Kf × √ts.'
                    : 'Minimum tinned copper conductor cross-section per Onderdonk sizing formula: Akcmil = I × Kf × √ts.'}
                </li>
                <li>
                  {locale === 'fr'
                    ? 'Ceinture équipotentielle périphérique obligatoire à 1.0 m au-delà de la clôture métallique avec liaisons équipotentielles tous les 15 m.'
                    : 'Outer peripheral loop conductor mandated 1.0 m beyond substation perimeter fence with bonding jump every 15 m.'}
                </li>
                <li>
                  {locale === 'fr'
                    ? 'En sol latéritique à haute résistivité (ex: Yaoundé/Oyomabang > 600 Ω·m), forages profonds (30 m) avec ciment conducteur bentonite.'
                    : 'In high-resistivity lateritic granite soils (e.g. Oyomabang > 600 Ω·m), utilize 30 m deep ground boreholes with bentonite backfill.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 2: 2D EQUIPOTENTIAL VOLTAGE MAP */}
      {activePillar === 'EQUIPOTENTIAL_MAP_2D' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-400" />
                <span>{locale === 'fr' ? 'Cartographie 2D du Profil de Tension de Surface' : '2D Surface Voltage Profile & Equipotential Contours'}</span>
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {locale === 'fr'
                  ? 'Visualisation de la montée en potentiel du sol (GPR), des pics de maille et des gradients de bordure'
                  : 'Ground Potential Rise (GPR) distribution, corner mesh peaks, and perimeter step gradient visualization'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-red-500 inline-block" /> High Potential (GPR)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" /> Remote Earth (0 V)
              </span>
            </div>
          </div>

          {/* SVG 2D Grid Representation */}
          <div className="relative w-full h-80 bg-[#070b12] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 600 320" className="w-full h-full">
              {/* Radial Equipotential Gradients */}
              <defs>
                <radialGradient id="gprGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                  <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.30" />
                  <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Equipotential field */}
              <rect x="40" y="20" width="520" height="280" rx="16" fill="url(#gprGradient)" />

              {/* Substation outer fence */}
              <rect x="80" y="40" width="440" height="240" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="6,4" />
              <text x="90" y="60" fill="#94a3b8" fontSize="10" fontFamily="monospace">Clôture du Poste / Perimeter Fence</text>

              {/* Copper Grounding Mesh */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`gx-${i}`}
                  x1={120 + i * 45}
                  y1={70}
                  x2={120 + i * 45}
                  y2={250}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
              ))}
              {Array.from({ length: 5 }).map((_, j) => (
                <line
                  key={`gy-${j}`}
                  x1={120}
                  y1={70 + j * 45}
                  x2={480}
                  y2={70 + j * 45}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
              ))}

              {/* Ground Rods at Corners and Crossings */}
              {[
                { x: 120, y: 70 }, { x: 480, y: 70 }, { x: 120, y: 250 }, { x: 480, y: 250 },
                { x: 300, y: 70 }, { x: 300, y: 250 }, { x: 120, y: 160 }, { x: 480, y: 160 }
              ].map((pt, idx) => (
                <circle
                  key={`rod-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}

              {/* Fault Injection Point */}
              <circle cx="300" cy="160" r="10" fill="#ef4444" className="animate-ping" opacity="0.75" />
              <circle cx="300" cy="160" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="315" y="165" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Point d'Injection If = {faultCurrentIf} kA
              </text>

              {/* Step voltage measurement vector */}
              <line x1="500" y1="210" x2="550" y2="210" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="495" y="235" fill="#fb7185" fontSize="10" fontFamily="monospace">
                Tension de Pas (1 m) : {Math.round(ieee80Results.stepVoltageEs)} V
              </text>
            </svg>
          </div>

          {/* Voltage Profile Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold">{locale === 'fr' ? 'GPR Centre de Grille :' : 'Grid Center GPR:'}</span>
              <div className="text-lg text-white font-bold">{(ieee80Results.GPR / 1000).toFixed(2)} kV</div>
              <p className="text-[11px] text-slate-400">Potentiel uniforme si le maillage est dense (&lt; 5m).</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-red-400 font-bold">{locale === 'fr' ? 'Pic de Maille en Coin :' : 'Corner Mesh Voltage:'}</span>
              <div className="text-lg text-white font-bold">{Math.round(ieee80Results.meshVoltageEm)} V</div>
              <p className="text-[11px] text-slate-400">Zone la plus sévère pour la tension de toucher (Em).</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold">{locale === 'fr' ? 'Gradient Extérieur (Pas) :' : 'Perimeter Step Gradient:'}</span>
              <div className="text-lg text-white font-bold">{Math.round(ieee80Results.stepVoltageEs)} V</div>
              <p className="text-[11px] text-slate-400">Atténué par le gravier et la ceinture périphérique.</p>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 3: IEEE 1584 / NFPA 70E ARC FLASH SOLVER */}
      {activePillar === 'ARC_FLASH_IEEE1584' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Paramètres d\'Arc Électrique' : 'Arc Flash Configuration'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">IEEE 1584-2018</span>
              </div>

              {/* System Voltage */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">{locale === 'fr' ? 'Tension nominale tableau :' : 'Nominal bus voltage:'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[400, 690, 15000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setArcNominalVoltage(v)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-xs border ${
                        arcNominalVoltage === v
                          ? 'bg-orange-500 text-slate-950 font-bold border-orange-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}
                    >
                      {v >= 1000 ? `${v / 1000} kV (MT)` : `${v} V (BT)`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bolted Fault Current Ibf */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Courant court-circuit franc (Ibf) :' : 'Bolted fault current (Ibf):'}</span>
                  <span className="text-orange-400 font-bold">{arcFaultCurrentIbf} kA</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="65"
                  step="1"
                  value={arcFaultCurrentIbf}
                  onChange={(e) => setArcFaultCurrentIbf(Number(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Arc Clearing Time */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Temps d\'élimination protection :' : 'Protection clearing time:'}</span>
                  <span className="text-orange-400 font-bold">{arcClearingTime} s ({Math.round(arcClearingTime * 1000)} ms)</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="1.0"
                  step="0.02"
                  value={arcClearingTime}
                  onChange={(e) => setArcClearingTime(Number(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>40 ms (Relais d'arc optique)</span>
                  <span>250 ms (Disjoncteur classique)</span>
                </div>
              </div>

              {/* Working Distance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Distance de travail D :' : 'Working distance D:'}</span>
                  <span className="text-orange-400 font-bold">{workingDistanceD} mm ({Math.round(workingDistanceD / 25.4)} in)</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="25"
                  value={workingDistanceD}
                  onChange={(e) => setWorkingDistanceD(Number(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Enclosure Configuration */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">{locale === 'fr' ? 'Orientation électrodes (IEEE 1584) :' : 'Electrode configuration:'}</label>
                <select
                  value={enclosureType}
                  onChange={(e) => setEnclosureType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                >
                  <option value="VCB">VCB (Vertical dans armoire fermée)</option>
                  <option value="VCBB">VCBB (Vertical avec barrière isolante - Pire cas)</option>
                  <option value="HCB">HCB (Horizontal vers l'opérateur)</option>
                  <option value="OPEN_AIR">OPEN AIR (Air libre extérieur)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Flash Hazard Label Simulation */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-orange-600/80 shadow-2xl relative overflow-hidden font-mono space-y-4">
              <div className="flex items-center justify-between border-b-2 border-orange-500 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-7 w-7 text-orange-400" />
                  <div>
                    <div className="text-sm font-black text-orange-400 tracking-widest uppercase">AVERTISSEMENT / WARNING</div>
                    <div className="text-lg font-black text-white">ARC FLASH & SHOCK HAZARD</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">STANDARD DE CONFORMITÉ</div>
                  <div className="text-xs font-bold text-slate-200">NFPA 70E / IEEE 1584</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Énergie Incidente / Incident Energy</div>
                  <div className="text-2xl font-black text-orange-400">{arcFlashResults.incidentEnergy} cal/cm²</div>
                  <div className="text-[10px] text-slate-500">à distance {workingDistanceD} mm</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Frontière d'Arc (AFB)</div>
                  <div className="text-2xl font-black text-yellow-400">{(arcFlashResults.AFB / 1000).toFixed(2)} m</div>
                  <div className="text-[10px] text-slate-500">Seuil 1.2 cal/cm² (brûlure 2e degré)</div>
                </div>
              </div>

              {/* PPE Category Alert Box */}
              <div className={`p-4 rounded-xl border ${arcFlashResults.ppeColor} space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {locale === 'fr' ? 'CATÉGORIE D\'ÉQUIPEMENT DE PROTECTION INDIVIDUELLE (EPI) :' : 'REQUIRED PPE CATEGORY :'}
                  </span>
                  <span className="text-base font-black uppercase">{arcFlashResults.ppeCategory}</span>
                </div>
                <div className="text-xs font-bold text-white">{arcFlashResults.ppeRating}</div>
              </div>

              {/* Shock boundary data */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block">Courant d'arc Iarc :</span>
                  <span className="font-bold text-white">{arcFlashResults.Iarc} kA</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Frontière d'approche limitée :</span>
                  <span className="font-bold text-white">{arcNominalVoltage >= 1000 ? '1.5 m' : '1.0 m'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Frontière restreinte (gants isolants) :</span>
                  <span className="font-bold text-white">{arcNominalVoltage >= 1000 ? '0.7 m' : '0.3 m'}</span>
                </div>
              </div>
            </div>

            {/* Engineering Mitigation Strategies */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-orange-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Techniques de Réduction du Risque d\'Arc (Hierarchy of Controls) :' : 'Arc Flash Risk Reduction Techniques:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>
                  <strong className="text-white">Détection optique d'arc (Arc Flash Optical Relay) :</strong> Réduit le temps d'élimination de 200 ms à moins de 35 ms via fibre optique et capteur pointuel, divisant l'énergie incidente par 5.
                </li>
                <li>
                  <strong className="text-white">Commutateur de maintenance (ARMS - Maintenance Switch) :</strong> Abaisse temporairement les seuils magnétiques instantanés du disjoncteur lors des interventions sous tension.
                </li>
                <li>
                  <strong className="text-white">Commande et embrochage motorisé à distance (Remote Racking) :</strong> Éloigne l'opérateur au-delà de la frontière d'arc (AFB) lors de la manœuvre d'embrochage d'un disjoncteur débrochable.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 4: IEC 62305 LIGHTNING ROLLING SPHERE */}
      {activePillar === 'LIGHTNING_ROLLING_SPHERE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Paramètres Foudre CEI 62305' : 'Lightning Parameters'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">CEI 62305-1..4</span>
              </div>

              {/* Protection Level LPS */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">{locale === 'fr' ? 'Niveau de protection foudre (NPF / LPS) :' : 'Lightning Protection Level (LPL):'}</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['I', 'II', 'III', 'IV'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLpsLevel(lvl)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-xs border ${
                        lpsLevel === lvl
                          ? 'bg-yellow-500 text-slate-950 font-bold border-yellow-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}
                    >
                      Classe {lvl}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Classe I : Postes HTB critiques (Rayon sphère R = 20 m, I = 200 kA)
                </div>
              </div>

              {/* Mast Height H */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Hauteur mât / paratonnerre (h) :' : 'Air terminal mast height (h):'}</span>
                  <span className="text-yellow-400 font-bold">{mastHeightH} m</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  step="1"
                  value={mastHeightH}
                  onChange={(e) => setMastHeightH(Number(e.target.value))}
                  className="w-full accent-yellow-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Substation Footprint */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Longueur poste (m)' : 'Substation length (m)'}</label>
                  <input
                    type="number"
                    value={substationLength}
                    onChange={(e) => setSubstationLength(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">{locale === 'fr' ? 'Largeur poste (m)' : 'Substation width (m)'}</label>
                  <input
                    type="number"
                    value={substationWidth}
                    onChange={(e) => setSubstationWidth(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Keraunic Level Td */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Niveau kéraunique Td (jours/an) :' : 'Keraunic level Td (days/yr):'}</span>
                  <span className="text-amber-400 font-bold">{keraunicLevelTd} j/an</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="180"
                  step="5"
                  value={keraunicLevelTd}
                  onChange={(e) => setKeraunicLevelTd(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>30 j/an (Europe tempérée)</span>
                  <span>140-160 j/an (Cameroun / Golfe de Guinée)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Rayon Sphère Fictive' : 'Rolling Sphere Radius'}</div>
                <div className="text-2xl font-mono font-bold text-yellow-400">{lightningResults.sphereRadius} m</div>
                <div className="text-[10px] font-mono text-slate-500">CEI 62305 Classe {lpsLevel}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Rayon Protection Sol' : 'Ground Protection Radius'}</div>
                <div className="text-2xl font-mono font-bold text-cyan-400">{lightningResults.groundProtectionRadius} m</div>
                <div className="text-[10px] font-mono text-slate-500">Par mât de {mastHeightH} m</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Densité Foudroiement Ng' : 'Flash Density Ng'}</div>
                <div className="text-2xl font-mono font-bold text-red-400">{lightningResults.flashDensityNg}</div>
                <div className="text-[10px] font-mono text-slate-500">impacts / km² / an</div>
              </div>
            </div>

            {/* Risk Assessment Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white uppercase">{locale === 'fr' ? 'Évaluation du Risque de Coup Direct (Nd)' : 'Direct Strike Frequency Assessment (Nd)'}</span>
                <span className="px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800 text-[10px]">
                  Période de retour : {lightningResults.returnPeriodYears} ans
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p>
                  Pour l'empreinte du poste ({substationLength} m × {substationWidth} m) sous un kéraunique de {keraunicLevelTd} jours/an :
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Nombre estimé d\'impacts directs par an :' : 'Estimated direct strikes per year:'}</span>
                    <span className="text-amber-400 font-bold">{lightningResults.expectedDirectStrikesNd} coups / an</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Nombre minimal de mâts / pointes paratonnerres :' : 'Minimum lightning masts required:'}</span>
                    <span className="text-cyan-400 font-bold">{lightningResults.minMastsNeeded} mâts disposés en maillage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rolling Sphere Diagram SVG */}
            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Principe de la Sphère Roulante (Electro-Geometric Model)' : 'Rolling Sphere Electrogeometric Principle'}</div>
              <div className="h-44 flex items-center justify-center">
                <svg viewBox="0 0 500 160" className="w-full h-full">
                  {/* Ground */}
                  <line x1="20" y1="140" x2="480" y2="140" stroke="#475569" strokeWidth="2" />
                  {/* Masts */}
                  <line x1="140" y1="140" x2="140" y2="60" stroke="#f59e0b" strokeWidth="4" />
                  <line x1="360" y1="140" x2="360" y2="60" stroke="#f59e0b" strokeWidth="4" />
                  <circle cx="140" cy="60" r="3" fill="#ffffff" />
                  <circle cx="360" cy="60" r="3" fill="#ffffff" />
                  {/* Rolling sphere arc */}
                  <path d="M 140 60 Q 250 110 360 60" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                  {/* Protected equipment box below arc */}
                  <rect x="210" y="100" width="80" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="220" y="125" fill="#38bdf8" fontSize="10" fontFamily="monospace">TR HTB</text>
                  <text x="190" y="90" fill="#4ade80" fontSize="9" fontFamily="monospace">✓ Zone Protégée</text>
                  <text x="145" y="50" fill="#f59e0b" fontSize="9" fontFamily="monospace">Mât 1</text>
                  <text x="365" y="50" fill="#f59e0b" fontSize="9" fontFamily="monospace">Mât 2</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 5: ZnO SURGE ARRESTER SIZING (IEC 60099-4) */}
      {activePillar === 'SURGE_ARRESTER_ZNO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Sélection Parafoudre ZnO' : 'ZnO Arrester Sizing'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">CEI 60099-4 / 60071</span>
              </div>

              {/* Voltage Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">{locale === 'fr' ? 'Tension nominale réseau (Us) :' : 'Nominal grid voltage (Us):'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 90, 225].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGridNominalVoltageUs(v)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-xs border ${
                        gridNominalVoltageUs === v
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}
                    >
                      {v} kV
                    </button>
                  ))}
                </div>
              </div>

              {/* Earth Fault Factor Ke */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{locale === 'fr' ? 'Facteur de défaut à la terre (Ke) :' : 'Earth fault factor (Ke):'}</span>
                  <span className="text-cyan-400 font-bold">{earthFaultFactorK}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="1.73"
                  step="0.05"
                  value={earthFaultFactorK}
                  onChange={(e) => setEarthFaultFactorK(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1.3 - 1.4 (Neutre directement à la terre)</span>
                  <span>1.73 (Neutre isolé)</span>
                </div>
              </div>

              {/* Thermal Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">{locale === 'fr' ? 'Classe d\'énergie thermique (CEI 60099-4) :' : 'Thermal energy class:'}</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['DH', 'SL', 'SM', 'SH'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setArresterClass(cls)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-xs border ${
                        arresterClass === cls
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  SM (Station Medium) : 8.0 kJ/kV pour sous-stations HTB de transport.
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Coordination Result */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'Plaque Signalétique Parafoudre Recommandée' : 'Recommended Arrester Rating'}
                </span>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${arresterResults.marginSatisfactory ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                  {arresterResults.marginSatisfactory ? '✓ COORDINATION VALIDÉE' : '⚠️ MARGE INSUFFISANTE'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Tension Continue Uc (MCOV)</div>
                  <div className="text-xl font-bold text-cyan-400">{arresterResults.minUc} kV</div>
                  <div className="text-[10px] text-slate-400">Us_max / √3</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Tension Assignée Ur</div>
                  <div className="text-xl font-bold text-amber-400">{arresterResults.calculatedUr} kV</div>
                  <div className="text-[10px] text-slate-400">Tenue TOV 1s</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Niveau Protection Foudre Upl</div>
                  <div className="text-xl font-bold text-red-400">{arresterResults.Upl} kV</div>
                  <div className="text-[10px] text-slate-400">Onde 8/20 µs @ 10 kA</div>
                </div>
              </div>

              {/* Insulation Coordination Margin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">{locale === 'fr' ? 'Niveau d\'isolement transformateur (BIL) :' : 'Transformer Lightning BIL:'}</span>
                  <span className="text-white font-bold">{arresterResults.transformerBil} kV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">{locale === 'fr' ? 'Marge de protection (BIL - Upl) / Upl :' : 'Protective Margin (PM):'}</span>
                  <span className={`font-bold ${arresterResults.marginSatisfactory ? 'text-emerald-400' : 'text-red-400'}`}>
                    {arresterResults.protectiveMargin}% (Min requis: ≥ 20.0%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${arresterResults.marginSatisfactory ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (arresterResults.protectiveMargin / 40) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 6: EARTHING SCHEMES COMPARATOR (TT, TN, IT) */}
      {activePillar === 'EARTHING_SCHEMES_TT_TN_IT' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'TT', label: 'Régime TT (Distribution Publique Eneo)' },
              { id: 'TN_S', label: 'Régime TN-S (Industriel & Tertiaire Sécurisé)' },
              { id: 'TN_C', label: 'Régime TN-C (Économique / Conducteur PEN)' },
              { id: 'IT', label: 'Régime IT (Continuité de Service / Hôpitaux & Mines)' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScheme(s.id as any)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                  selectedScheme === s.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Principe & Écoulement du Courant de Défaut</span>
              </h4>
              {selectedScheme === 'TT' && (
                <p className="text-slate-300 leading-relaxed">
                  Le neutre du transformateur HTA/BT est relié à une prise de terre (Rn), et les masses de l'installation sont raccordées à une prise de terre séparée (Ra). Le courant de premier défaut est limité par la somme des résistances de terre (Id = U0 / (Ra + Rn) ~ 10-30 A). La coupure automatique est <strong>obligatoirement assurée par un disjoncteur différentiel résiduel (DDR)</strong> selon la condition Ra × IΔn ≤ 50 V.
                </p>
              )}
              {selectedScheme === 'TN_S' && (
                <p className="text-slate-300 leading-relaxed">
                  Le neutre est directement à la terre et les masses métalliques sont reliées au conducteur de protection PE séparé du neutre N. Tout défaut d'isolement phase-masse se transforme en un <strong>court-circuit phase-neutre franc de forte intensité (Id &gt; 1000 A)</strong>. La coupure est assurée instantanément par les disjoncteurs magnétothermiques ou fusibles sans nécessiter de DDR.
                </p>
              )}
              {selectedScheme === 'TN_C' && (
                <p className="text-slate-300 leading-relaxed">
                  Les fonctions de neutre et de conducteur de protection sont combinées en un seul conducteur PEN. Interdit en section inférieure à 10 mm² Cuivre et interdit en aval d'un conducteur PE/N séparé. Attention : circulation de courants harmoniques de rang 3 dans le PEN provoquant des élévations de potentiel des carcasses.
                </p>
              )}
              {selectedScheme === 'IT' && (
                <p className="text-slate-300 leading-relaxed">
                  Le neutre du transformateur est totalement isolé de la terre ou relié par une impédance élevée (Zn ~ 1000-2000 Ω). Au premier défaut d'isolement, le courant est négligeable (&lt; 2 A) et <strong>aucune coupure n'est déclenchée</strong>. Un Contrôleur Permanent d'Isolement (CPI) signale le défaut pour permettre une recherche sans interrompre la production.
                </p>
              )}
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-cyan-400 text-sm">Avantages, Limites & Domaines d'Application</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {selectedScheme === 'TT' && (
                  <>
                    <li><strong className="text-white">Usage standard :</strong> Réseau de distribution publique basse tension (ménages, petits commerces Eneo).</li>
                    <li><strong className="text-white">Avantage majeur :</strong> Indépendance complète de l'installation par rapport aux défauts du réseau de distribution.</li>
                    <li><strong className="text-white">Exigence critique :</strong> Entretien rigoureux de la prise de terre Ra (&lt; 100 Ω sous DDR 500 mA).</li>
                  </>
                )}
                {selectedScheme === 'TN_S' && (
                  <>
                    <li><strong className="text-white">Usage standard :</strong> Bâtiments tertiaires, data centers, industrie avec poste de livraison privé.</li>
                    <li><strong className="text-white">Avantage majeur :</strong> Pas de courants de fuite sur le conducteur PE, compatibilité CEM optimale.</li>
                    <li><strong className="text-white">Exigence critique :</strong> Calcul rigoureux des longueurs maximales de câbles sous déclenchement magnétique.</li>
                  </>
                )}
                {selectedScheme === 'TN_C' && (
                  <>
                    <li><strong className="text-white">Usage :</strong> Lignes de transport internes industrielles lourdes d'anciens sites.</li>
                    <li><strong className="text-white">Inconvénient critique :</strong> Risque mortel d'électrocution en cas de rupture mécanique du conducteur PEN.</li>
                  </>
                )}
                {selectedScheme === 'IT' && (
                  <>
                    <li><strong className="text-white">Usage standard :</strong> Blocs opératoires d'hôpitaux, sites miniers, sidérurgie, salles de commande.</li>
                    <li><strong className="text-white">Avantage majeur :</strong> Continuité absolue d'alimentation sans arrêt brutal des processus vitaux.</li>
                    <li><strong className="text-white">Exigence critique :</strong> Équipe d'électriciens qualifiés pour éliminer le 1er défaut avant qu'un 2nd défaut ne provoque un court-circuit biphasé.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 7: CAMEROON REAL CASES & FORENSIC STUDIES */}
      {activePillar === 'CAMEROON_SAFETY_CASES' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'CASE_OYOMABANG_HIGH_RES', label: 'Poste 225/90 kV d\'Oyomabang (Sol Granitique Résistant)' },
              { id: 'CASE_MANGOMBE_LIGHTNING', label: 'Nœud 225 kV de Mangombé (Densité Foudre Exceptionnelle)' },
              { id: 'CASE_BEKOKO_EARTHING', label: 'Poste 225/90 kV de Bekoko (Interconnexion Douala Ouest)' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                  selectedCaseId === c.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-4">
            {selectedCaseId === 'CASE_OYOMABANG_HIGH_RES' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-white">Poste 225/90 kV d'Oyomabang (Yaoundé) — Défi de la Résistivité du Sol Granitique</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                    SONATREL · Yaoundé
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Le poste d'interconnexion stratégique d'Oyomabang, qui alimente la capitale politique Yaoundé depuis Songloulou et Nachtigal, est bâti sur une colline latéritique rocheuse avec une résistivité naturelle du sol dépassant <strong>650 à 900 Ω·m</strong> en saison sèche. Une simple grille maillée superficielle ne parvenait pas à descendre sous l'exigence des 1.0 Ω.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold">Solutions d'Ingénierie Mises en Œuvre :</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Réalisation de 24 forages verticaux profonds de 30 mètres équipés de câbles cuivre 95 mm² et injectés au coulis bentonitique conductif.</li>
                    <li>Augmentation de l'épaisseur de la couche de gravier de granit concassé à 20 cm (ρs = 3500 Ω·m) pour relever la tension de toucher admissible à plus de 780 V.</li>
                    <li>Raccordement équipotentiel des massifs de pylônes d'arrivée des lignes 225 kV Songloulou et Nachtigal à la terre générale du poste.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedCaseId === 'CASE_MANGOMBE_LIGHTNING' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-white">Carrefour 225 kV de Mangombé (Édéa) — Protection Foudre en Climat Équatorial</span>
                  <span className="px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800 text-[10px]">
                    Bassin de la Sanaga · 140 j/an
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Situé au cœur du bassin fluvial de la Sanaga, le poste de Mangombé subit l'un des niveaux kérauniques les plus élevés d'Afrique centrale (140 à 150 jours d'orage par an). Les décharges de foudre sur les portiques et les lignes 225 kV provoquaient historiquement des amorçages en retour (backflashover) sur les chaînes d'isolateurs.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-yellow-400 font-bold">Mesures Techniques de Sécurisation :</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Remplacement systématique des anciens parafoudres SiC par des parafoudres à oxyde métallique (ZnO) de classe station SM à forte capacité d'absorption thermique (8 kJ/kV).</li>
                    <li>Installation de câbles de garde OPGW sur double flèche avec angle de protection négatif (-5°) au sommet des portiques de ligne.</li>
                    <li>Surveillance continue par compteurs de décharges de foudre connectés au SCADA pour évaluer le vieillissement des blocs varistances.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedCaseId === 'CASE_BEKOKO_EARTHING' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-white">Poste 225/90 kV de Bekoko (Douala Ouest) — Coordination d'Isolement & Terre Humide</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                    Boucle 225 kV Douala · SONATREL
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Le poste de Bekoko assure le bouclage 225 kV de la métropole économique de Douala et le départ de l'interconnexion Ouest. Implanté en zone côtière alluvionnaire humide, la résistivité du sol y est très basse (~45 Ω·m), mais le courant de court-circuit symétrique maximal Ik" atteint <strong>31.5 kA</strong>.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold">Résultats Techniques :</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Résistance de terre globale obtenue : <strong>0.18 Ω</strong> (largement inférieure au plafond de 0.5 Ω).</li>
                    <li>Dimensionnement du conducteur de grille en cuivre recuit 120 mm² pour supporter un défaut 31.5 kA pendant 0.5 s sans échauffement supérieur à 250°C.</li>
                    <li>Équipotentialité intégrale des chemins de câbles et blindages des câbles optiques de téléprotection CEI 61850.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
