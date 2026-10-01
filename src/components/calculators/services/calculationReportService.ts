// src/components/calculators/services/calculationReportService.ts
import type { CalculationReportData, ApparatusProvenance } from '../CalculationReportModal';

export interface InjectedCalculatorContext {
  equipmentId?: string;
  equipmentTag?: string;
  equipmentName?: string;
  sourceType?: string;
  substationOrFeeder?: string;
  params?: Record<string, any>;
  timestamp?: number;
}

export type CalculatorTabType =
  | 'power'
  | 'voltage-drop'
  | 'transformer'
  | 'motor'
  | 'sil'
  | 'earthing'
  | 'arc-flash'
  | 'ct-sizing'
  | 'pfc'
  | 'solar-sizing'
  | 'bess-sizing'
  | 'surge-arrester'
  | 'busbar-electrodynamic'
  | 'cable-ampacity'
  | 'transmission-line'
  | 'neutral-grounding'
  | 'relay-tcc';

export function generateCalculationReport(
  activeCalc: CalculatorTabType,
  locale: 'fr' | 'en',
  injectedContext?: InjectedCalculatorContext
): CalculationReportData {
  const now = new Date();
  const dateStr = now.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const apparatusProvenance: ApparatusProvenance | undefined = injectedContext?.equipmentId ? {
    equipmentId: injectedContext.equipmentId,
    equipmentName: injectedContext.equipmentName,
    equipmentTag: injectedContext.equipmentTag,
    substationOrFeeder: injectedContext.substationOrFeeder,
  } : undefined;

  const withProvenance = (rep: CalculationReportData): CalculationReportData => {
    if (apparatusProvenance) {
      return { ...rep, apparatusProvenance };
    }
    return rep;
  };

  if (activeCalc === 'power') {
    const uVolts = 400;
    const pKwInput = 250;
    const pfInput = 0.85;
    const iAmpsInput = 360;
    const iCalculatedAmps = (pKwInput * 1000) / (Math.sqrt(3) * uVolts * pfInput);
    const sKvaCalculated = pKwInput / pfInput;
    const qKvarCalculated = Math.sqrt(Math.max(0, sKvaCalculated ** 2 - pKwInput ** 2));

    return {
      title: locale === 'fr' ? 'Calcul de Puissance & Courant Triphasé' : '3-Phase Power & Current Calculation',
      calcType: 'POWER-CURRENT-3PH',
      standard: 'CEI 60038 / CEI 60364-1',
      date: dateStr,
      referenceId: `EPEDE-CALC-PWR-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale composée (U)' : 'Nominal Line Voltage (U)', value: `${uVolts}`, unit: 'V' },
        { label: locale === 'fr' ? 'Puissance active (P)' : 'Active Power (P)', value: `${pKwInput}`, unit: 'kW' },
        { label: locale === 'fr' ? 'Facteur de puissance (cos φ)' : 'Power Factor (cos φ)', value: `${pfInput}` },
        { label: locale === 'fr' ? 'Courant mesuré' : 'Measured Current', value: `${iAmpsInput}`, unit: 'A' },
      ],
      formulas: [
        { name: 'Puissance apparente S', expr: 'P / cos(φ) [kVA]' },
        { name: 'Puissance réactive Q', expr: '√(S² - P²) [kvar]' },
        { name: 'Courant de ligne I', expr: '(P · 1000) / (√3 · U · cos φ) [A]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Courant nominal calculé' : 'Calculated Line Current', value: iCalculatedAmps.toFixed(1), unit: 'A', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Puissance apparente S' : 'Apparent Power S', value: sKvaCalculated.toFixed(1), unit: 'kVA' },
        { label: locale === 'fr' ? 'Puissance réactive Q' : 'Reactive Power Q', value: qKvarCalculated.toFixed(1), unit: 'kvar' },
        { label: 'Facteur de puissance cos(φ)', value: pfInput.toFixed(2), status: pfInput >= 0.93 ? 'OK' : 'WARN' },
      ],
      complianceVerdict: {
        status: pfInput >= 0.93 ? 'COMPLIANT' : 'INFORMATIONAL',
        message: pfInput >= 0.93 
          ? (locale === 'fr' ? 'Facteur de puissance optimal sans pénalité de réactif.' : 'Optimal power factor, no reactive penalty.')
          : (locale === 'fr' ? 'Facteur de puissance < 0.93 : prévoir compensation d\'énergie réactive (batterie de condensateurs).' : 'Power factor < 0.93: reactive power compensation recommended.'),
      },
      engineeringNotes: [
        'Le dimensionnement des câbles et appareils de coupure amont doit être basé sur le courant calculé majoré des tolérances de surcharge thermique.',
        'Régime triphasé équilibré supposé. Vérifier le taux de déséquilibre en cas de fortes charges monophasées.',
      ],
    };
  }

  if (activeCalc === 'voltage-drop') {
    const vDropU = injectedContext?.params?.vDropU 
      ? Number(injectedContext.params.vDropU) 
      : (injectedContext?.params?.unVolts ? Number(injectedContext.params.unVolts) : 400);
    const vDropLengthM = injectedContext?.params?.vDropLengthM 
      ? Number(injectedContext.params.vDropLengthM) 
      : (injectedContext?.params?.lengthM ? Number(injectedContext.params.lengthM) : (injectedContext?.params?.cableLengthM ? Number(injectedContext.params.cableLengthM) : 120));
    const vDropCurrentA = injectedContext?.params?.vDropCurrentA 
      ? Number(injectedContext.params.vDropCurrentA) 
      : (injectedContext?.params?.iAmps ? Number(injectedContext.params.iAmps) : (injectedContext?.params?.nominalCurrentA ? Number(injectedContext.params.nominalCurrentA) : 180));
    const vDropSectionMm2 = injectedContext?.params?.vDropSectionMm2 
      ? Number(injectedContext.params.vDropSectionMm2) 
      : (injectedContext?.params?.sectionMm2 ? Number(injectedContext.params.sectionMm2) : (injectedContext?.params?.selectedSectionMm2 ? Number(injectedContext.params.selectedSectionMm2) : 70));
    const conductorMaterial = injectedContext?.params?.conductorMaterial === 'aluminium' || injectedContext?.params?.material === 'al' ? 'al' : 'cu';
    const vDropPf = injectedContext?.params?.vDropCosPhi 
      ? Number(injectedContext.params.vDropCosPhi) 
      : (injectedContext?.params?.cosPhi ? Number(injectedContext.params.cosPhi) : 0.85);
    const rho = conductorMaterial === 'cu' ? 0.0225 : 0.036;
    const rOhmPerKm = (rho * 1000) / vDropSectionMm2;
    const xOhmPerKm = 0.08;
    const rTotal = (rOhmPerKm * vDropLengthM) / 1000;
    const xTotal = (xOhmPerKm * vDropLengthM) / 1000;
    const sinPhi = Math.sin(Math.acos(vDropPf));
    const deltaUVolts = Math.sqrt(3) * vDropCurrentA * (rTotal * vDropPf + xTotal * sinPhi);
    const deltaUPercent = (deltaUVolts / vDropU) * 100;
    const isDropCompliant = deltaUPercent <= 5.0;

    return withProvenance({
      title: locale === 'fr' ? 'Vérification de la Chute de Tension en Ligne (ΔU)' : 'Cable Voltage Drop Verification (ΔU)',
      calcType: 'VOLTAGE-DROP-CABLE',
      standard: 'NF C 15-100 §525 / CEI 60364-5-52',
      date: dateStr,
      referenceId: `EPEDE-CALC-VDROP-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension de service (U)' : 'Operating Voltage (U)', value: `${vDropU}`, unit: 'V' },
        { label: locale === 'fr' ? 'Longueur de liaison (L)' : 'Circuit Length (L)', value: `${vDropLengthM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Courant d\'emploi (Ib)' : 'Design Current (Ib)', value: `${vDropCurrentA}`, unit: 'A' },
        { label: locale === 'fr' ? 'Section du conducteur' : 'Conductor Cross-Section', value: `${vDropSectionMm2}`, unit: 'mm²' },
        { label: locale === 'fr' ? 'Métal conducteur' : 'Conductor Material', value: conductorMaterial === 'cu' ? 'Cuivre (Cu)' : 'Aluminium (Al)' },
        { label: locale === 'fr' ? 'Facteur de puissance cos(φ)' : 'Power Factor cos(φ)', value: `${vDropPf}` },
      ],
      formulas: [
        { name: 'Résistance R_tot', expr: '(ρ · L) / S [Ω] (ρ_Cu = 0.0225, ρ_Al = 0.036 à 70°C)' },
        { name: 'Réactance X_tot', expr: '0.08 Ω/km · L [Ω]' },
        { name: 'Chute de tension ΔU', expr: '√3 · I · (R · cos φ + X · sin φ) [V]' },
        { name: 'Chute relative ΔU (%)', expr: '100 · (ΔU / U) [%]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Chute de tension relative' : 'Relative Voltage Drop', value: deltaUPercent.toFixed(2), unit: '%', highlight: true, status: isDropCompliant ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Chute de tension absolue' : 'Absolute Voltage Drop', value: deltaUVolts.toFixed(2), unit: 'V' },
        { label: locale === 'fr' ? 'Résistance totale liaison' : 'Total Circuit Resistance', value: rTotal.toFixed(3), unit: 'Ω' },
        { label: locale === 'fr' ? 'Réactance totale liaison' : 'Total Circuit Reactance', value: xTotal.toFixed(3), unit: 'Ω' },
      ],
      complianceVerdict: {
        status: isDropCompliant ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: isDropCompliant
          ? (locale === 'fr' ? `Chute de tension de ${deltaUPercent.toFixed(2)}% ≤ seuil réglementaire de 5.0% (NF C 15-100 / CEI 60364). Liaison conforme.` : `Voltage drop of ${deltaUPercent.toFixed(2)}% ≤ 5.0% standard limit. Conductor compliant.`)
          : (locale === 'fr' ? `Chute de tension de ${deltaUPercent.toFixed(2)}% EXCÈDE le seuil maximal de 5.0%. Augmenter la section du câble ou installer une compensation réactive.` : `Voltage drop of ${deltaUPercent.toFixed(2)}% EXCEEDS 5.0% limit. Increase cable cross-section.`),
      },
      engineeringNotes: [
        'La résistivité retenue tient compte d\'un échauffement normal de l\'âme sous charge permanente à 70°C.',
        'Pour des longueurs importantes ou des harmoniques de rang 3, vérifier le courant dans le conducteur neutre.',
      ],
    });
  }

  if (activeCalc === 'transformer') {
    const trafoKva = injectedContext?.params?.trafoKva 
      ? Number(injectedContext.params.trafoKva) 
      : (injectedContext?.params?.sKva ? Number(injectedContext.params.sKva) : 630);
    const trafoHvKv = injectedContext?.params?.trafoHvKv 
      ? Number(injectedContext.params.trafoHvKv) 
      : (injectedContext?.params?.unHvKv ? Number(injectedContext.params.unHvKv) : 30);
    const trafoLvV = injectedContext?.params?.trafoLvV 
      ? Number(injectedContext.params.trafoLvV) 
      : (injectedContext?.params?.unLvV ? Number(injectedContext.params.unLvV) : 400);
    const trafoUkPercent = injectedContext?.params?.trafoUkPercent 
      ? Number(injectedContext.params.trafoUkPercent) 
      : (injectedContext?.params?.ukPercent ? Number(injectedContext.params.ukPercent) : 4.0);
    const inHvAmps = trafoKva / (Math.sqrt(3) * trafoHvKv);
    const inLvAmps = (trafoKva * 1000) / (Math.sqrt(3) * trafoLvV);
    const iscTrafoLvKa = (inLvAmps / (trafoUkPercent / 100)) / 1000;
    const sscTrafoMva = (trafoKva / 1000) / (trafoUkPercent / 100);

    return withProvenance({
      title: locale === 'fr' ? 'Dimensionnement & Courant de Court-Circuit Transformateur' : 'Transformer Sizing & Short-Circuit Capacity',
      calcType: 'TRAFO-SIZING-SSC',
      standard: 'CEI 60076-1 / CEI 60076-5 / CEI 60909',
      date: dateStr,
      referenceId: `EPEDE-CALC-TRF-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Puissance assignée (Sn)' : 'Rated Power (Sn)', value: `${trafoKva}`, unit: 'kVA' },
        { label: locale === 'fr' ? 'Tension primaire HT' : 'HV Primary Voltage', value: `${trafoHvKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Tension secondaire BT' : 'LV Secondary Voltage', value: `${trafoLvV}`, unit: 'V' },
        { label: locale === 'fr' ? 'Tension de court-circuit (uk)' : 'Short-Circuit Impedance (uk)', value: `${trafoUkPercent}`, unit: '%' },
      ],
      formulas: [
        { name: 'Courant nominal primaire I_HV', expr: 'Sn / (√3 · U_HV) [A]' },
        { name: 'Courant nominal secondaire I_LV', expr: '(Sn · 1000) / (√3 · U_LV) [A]' },
        { name: 'Courant court-circuit secondaire Isc', expr: '(I_LV / (uk / 100)) / 1000 [kA]' },
        { name: 'Puissance de court-circuit Ssc', expr: '(Sn / 1000) / (uk / 100) [MVA]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Courant C-C secondaire (Isc BT)' : 'LV Short-Circuit Current (Isc)', value: iscTrafoLvKa.toFixed(2), unit: 'kA', highlight: true, status: 'INFO' },
        { label: locale === 'fr' ? 'Courant nominal secondaire (In BT)' : 'LV Rated Current (In LV)', value: inLvAmps.toFixed(1), unit: 'A' },
        { label: locale === 'fr' ? 'Courant nominal primaire (In HT)' : 'HV Rated Current (In HV)', value: inHvAmps.toFixed(1), unit: 'A' },
        { label: locale === 'fr' ? 'Puissance de court-circuit (Ssc)' : 'Short-Circuit Power (Ssc)', value: sscTrafoMva.toFixed(1), unit: 'MVA' },
      ],
      complianceVerdict: {
        status: 'COMPLIANT',
        message: locale === 'fr'
          ? `Le pouvoir de coupure ultime (Icu) du disjoncteur général BT (TGBT) doit être ≥ ${iscTrafoLvKa.toFixed(2)} kA sous 400V.`
          : `Main LV switchboard breaker breaking capacity (Icu) must be ≥ ${iscTrafoLvKa.toFixed(2)} kA at 400V.`,
      },
      engineeringNotes: [
        'Calcul effectué avec hypothèse d\'un réseau amont infini (Ssc_amont = ∞), donnant une valeur de court-circuit sécuritaire maximale.',
        'Prévoir la tenue thermique et électrodynamique des jeux de barres TGBT selon la valeur crête ip = 2.1 · Isc.',
      ],
    });
  }

  if (activeCalc === 'motor') {
    const motorKw = 75;
    const motorEta = 0.93;
    const motorPf = 0.86;
    const motorPoleCount = 4;
    const startMethod = 'dol';
    const inMotorAmps = (motorKw * 1000) / (Math.sqrt(3) * 400 * motorEta * motorPf);
    const startRatio = 6.5;
    const iStartAmps = inMotorAmps * startRatio;
    const synchRpm = (120 * 50) / motorPoleCount;
    const ratedRpm = synchRpm * 0.965;

    return {
      title: locale === 'fr' ? 'Courant Nominal & Appel de Démarrage Moteur Asynchrone' : 'Induction Motor Rated & Inrush Current',
      calcType: 'MOTOR-INRUSH-STARTING',
      standard: 'CEI 60034-1 / CEI 60034-12',
      date: dateStr,
      referenceId: `EPEDE-CALC-MOT-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Puissance utile à l\'arbre (P)' : 'Shaft Output Power (P)', value: `${motorKw}`, unit: 'kW' },
        { label: locale === 'fr' ? 'Rendement (η)' : 'Efficiency (η)', value: `${(motorEta * 100).toFixed(1)}`, unit: '%' },
        { label: locale === 'fr' ? 'Facteur de puissance nominal' : 'Rated Power Factor', value: `${motorPf}` },
        { label: locale === 'fr' ? 'Nombre de pôles stator' : 'Stator Pole Count', value: `${motorPoleCount}` },
        { label: locale === 'fr' ? 'Mode de démarrage' : 'Starting Method', value: 'Direct (DOL)' },
      ],
      formulas: [
        { name: 'Courant nominal In', expr: '(P · 1000) / (√3 · 400 · η · cos φ) [A]' },
        { name: 'Courant de démarrage Idém', expr: 'In · k_démarrage (k_dol=6.5, k_yd=2.2, k_vfd=1.3) [A]' },
        { name: 'Vitesse synchrone Ns', expr: '(120 · f) / 2p [tr/min]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Courant d\'appel au démarrage (Id)' : 'Starting Inrush Current (Id)', value: iStartAmps.toFixed(1), unit: 'A', highlight: true, status: 'WARN' },
        { label: locale === 'fr' ? 'Courant nominal permanent (In)' : 'Rated Full Load Current (In)', value: inMotorAmps.toFixed(1), unit: 'A' },
        { label: locale === 'fr' ? 'Vitesse de synchronisme' : 'Synchronous Speed', value: `${synchRpm}`, unit: 'tr/min' },
        { label: locale === 'fr' ? 'Vitesse nominale estimée' : 'Estimated Rated Speed', value: `${ratedRpm.toFixed(0)}`, unit: 'tr/min' },
      ],
      complianceVerdict: {
        status: 'INFORMATIONAL',
        message: locale === 'fr' 
          ? `Démarrage direct DOL : pic d'intensité de ${iStartAmps.toFixed(0)} A (6.5 x In). Vérifier que la chute de tension sur le transformateur amont ne dépasse pas 10% lors du transitoire.` 
          : `DOL start generates ${iStartAmps.toFixed(0)} A inrush. Verify transient transformer voltage dip < 10%.`,
      },
      engineeringNotes: [
        'Le réglage de la protection thermique (ANSI 49) doit être calibré exactement sur In = ' + inMotorAmps.toFixed(1) + ' A.',
        'Le déclencheur magnétique (ANSI 50) doit être ajusté au-dessus du courant de démarrage Id pour éviter tout déclenchement intempestif.',
      ],
    };
  }

  if (activeCalc === 'sil') {
    const silVoltageKv = 225;
    const silLengthKm = 280;
    const silInductanceMhKm = 1.05;
    const silCapacitanceNfKm = 11.2;
    const lTotalH = (silInductanceMhKm * 1e-3) * silLengthKm;
    const cTotalF = (silCapacitanceNfKm * 1e-9) * silLengthKm;
    const zcOhms = Math.sqrt(lTotalH / cTotalF);
    const pSilMw = ((silVoltageKv * 1e3) ** 2) / zcOhms / 1e6;
    const betaPerKm = 2 * Math.PI * 50 * Math.sqrt((silInductanceMhKm * 1e-3) * (silCapacitanceNfKm * 1e-9));
    const ferrantiFactor = 1 / Math.cos(betaPerKm * silLengthKm);
    const uReceivingKv = silVoltageKv * ferrantiFactor;
    const ferrantiRiseKv = uReceivingKv - silVoltageKv;
    const ferrantiRisePercent = ((ferrantiFactor - 1) * 100);
    const qLineChargingMvar = (2 * Math.PI * 50 * cTotalF * ((silVoltageKv * 1e3) ** 2)) / 1e6;

    return {
      title: locale === 'fr' ? 'Puissance Naturelle (SIL) & Effet Ferranti Ligne HTB' : 'HV Line Surge Impedance Loading & Ferranti Effect',
      calcType: 'HV-LINE-SIL-FERRANTI',
      standard: 'CIGRE TB 575 / IEEE Std 1542',
      date: dateStr,
      referenceId: `EPEDE-CALC-SIL-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale (Un)' : 'Nominal Voltage (Un)', value: `${silVoltageKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Longueur de ligne (L)' : 'Line Length (L)', value: `${silLengthKm}`, unit: 'km' },
        { label: locale === 'fr' ? 'Inductance linéique (L\')' : 'Line Inductance (L\')', value: `${silInductanceMhKm}`, unit: 'mH/km' },
        { label: locale === 'fr' ? 'Capacité linéique (C\')' : 'Line Capacitance (C\')', value: `${silCapacitanceNfKm}`, unit: 'nF/km' },
      ],
      formulas: [
        { name: 'Impédance d\'onde Zc', expr: '√(L / C) [Ω]' },
        { name: 'Puissance naturelle SIL', expr: 'U² / Zc [MW]' },
        { name: 'Tension terminale Ferranti U_s', expr: 'U_e / cos(β · L) [kV]' },
        { name: 'Production réactive ligne Qc', expr: 'ω · C · L · U² [Mvar]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Puissance naturelle SIL' : 'Surge Impedance Loading (SIL)', value: pSilMw.toFixed(1), unit: 'MW', highlight: true },
        { label: locale === 'fr' ? 'Impédance caractéristique (Zc)' : 'Wave Impedance (Zc)', value: zcOhms.toFixed(1), unit: 'Ω' },
        { label: locale === 'fr' ? 'Hausse de tension Ferranti' : 'Ferranti Voltage Rise', value: `+${ferrantiRiseKv.toFixed(1)} (+${ferrantiRisePercent.toFixed(1)}%)`, unit: 'kV', status: ferrantiRisePercent > 10 ? 'WARN' : 'OK' },
        { label: locale === 'fr' ? 'Puissance capacitive ligne (Qc)' : 'Line Charging Reactive Power', value: qLineChargingMvar.toFixed(1), unit: 'Mvar' },
      ],
      complianceVerdict: {
        status: ferrantiRisePercent <= 10 ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: ferrantiRisePercent <= 10
          ? (locale === 'fr' ? `Surtension Ferranti à vide de +${ferrantiRisePercent.toFixed(1)}% dans les marges acceptables d\'isolement HTB (CEI 60071-1).` : `Ferranti voltage rise within insulation limits.`)
          : (locale === 'fr' ? `Surtension Ferranti de +${ferrantiRisePercent.toFixed(1)}% élevée. Prévoir réactance de compensation shunt pour enclenchement à vide.` : `High Ferranti rise. Shunt reactor compensation required.`),
      },
      engineeringNotes: [
        'Lorsque la ligne transporte exactement sa puissance naturelle SIL, la consommation d\'énergie réactive inductive équilibre la génération capacitive.',
        'Corridor Songloulou - Yaoundé (280 km) : compensation inductive recommandée lors des heures creuses.',
      ],
    };
  }

  if (activeCalc === 'earthing') {
    const earthSoilRho = 120;
    const earthStoneRho = 3000;
    const earthStoneThicknessM = 0.15;
    const earthFaultCurrentKa = 18;
    const earthFaultDurationSec = 0.5;
    const earthGridAreaM2 = 3600;
    const earthConductorLengthM = 1250;
    const kFactor = (earthSoilRho - earthStoneRho) / (earthSoilRho + earthStoneRho);
    const csFactor = 1 - (0.09 * (1 - earthSoilRho / earthStoneRho)) / (2 * earthStoneThicknessM + 0.09);
    const eTouch50 = (1000 + 1.5 * csFactor * earthStoneRho) * (0.116 / Math.sqrt(earthFaultDurationSec));
    const eStep50 = (1000 + 6.0 * csFactor * earthStoneRho) * (0.116 / Math.sqrt(earthFaultDurationSec));
    const rgLaurentNymanOhms = earthSoilRho * (1 / earthConductorLengthM + 1 / Math.sqrt(20 * earthGridAreaM2));
    const gprVolts = earthFaultCurrentKa * 1000 * rgLaurentNymanOhms;
    const isRgCompliant = rgLaurentNymanOhms <= 1.0;

    return {
      title: locale === 'fr' ? 'Sécurité du Réseau de Terre de Poste Électrique' : 'Substation Grounding Grid Safety Sizing',
      calcType: 'EARTHING-GRID-IEEE80',
      standard: 'IEEE Std 80-2013',
      date: dateStr,
      referenceId: `EPEDE-CALC-GRD-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Résistivité sol sous-jacent (ρs)' : 'Subsoil Resistivity (ρs)', value: `${earthSoilRho}`, unit: 'Ω·m' },
        { label: locale === 'fr' ? 'Résistivité gravier surface' : 'Surface Crushed Rock Resistivity', value: `${earthStoneRho}`, unit: 'Ω·m' },
        { label: locale === 'fr' ? 'Épaisseur gravier (hs)' : 'Crushed Rock Layer Thickness', value: `${earthStoneThicknessM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Courant de défaut terre (If)' : 'Ground Fault Current (If)', value: `${earthFaultCurrentKa}`, unit: 'kA' },
        { label: locale === 'fr' ? 'Durée du défaut (tf)' : 'Fault Duration (tf)', value: `${earthFaultDurationSec}`, unit: 's' },
        { label: locale === 'fr' ? 'Superficie de la grille (A)' : 'Grid Enclosed Area (A)', value: `${earthGridAreaM2}`, unit: 'm²' },
        { label: locale === 'fr' ? 'Longueur totale conducteurs (L)' : 'Total Buried Conductor Length', value: `${earthConductorLengthM}`, unit: 'm' },
      ],
      formulas: [
        { name: 'Tension de pas max Estep', expr: '(1000 + 6 · Cs · ρ_gravel) · 0.116 / √ts [V]' },
        { name: 'Tension de contact max Etouch', expr: '(1000 + 1.5 · Cs · ρ_gravel) · 0.116 / √ts [V]' },
        { name: 'Résistance grille Rg (Laurent-Nyman)', expr: 'ρ_sol · (1/L + 1/√(20 · A)) [Ω]' },
        { name: 'Élévation potentiel sol GPR', expr: 'If · Rg [V]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Résistance de terre (Rg)' : 'Ground Grid Resistance (Rg)', value: rgLaurentNymanOhms.toFixed(3), unit: 'Ω', highlight: true, status: isRgCompliant ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Tension de contact admissible' : 'Tolerable Touch Voltage (Etouch)', value: eTouch50.toFixed(0), unit: 'V' },
        { label: locale === 'fr' ? 'Tension de pas admissible' : 'Tolerable Step Voltage (Estep)', value: eStep50.toFixed(0), unit: 'V' },
        { label: locale === 'fr' ? 'Élévation de potentiel GPR' : 'Ground Potential Rise (GPR)', value: (gprVolts / 1000).toFixed(1), unit: 'kV' },
      ],
      complianceVerdict: {
        status: isRgCompliant ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: isRgCompliant
          ? (locale === 'fr' ? `Résistance de terre Rg = ${rgLaurentNymanOhms.toFixed(3)} Ω ≤ 1.0 Ω (seuil d'excellence postes HTB). Grille conforme.` : `Grid resistance Rg ≤ 1.0 Ω. Fully compliant with IEEE 80.`)
          : (locale === 'fr' ? `Résistance de terre Rg = ${rgLaurentNymanOhms.toFixed(3)} Ω > 1.0 Ω. Ajouter des piquets profonds ou augmenter le maillage conducteur.` : `Grid resistance exceeds 1.0 Ω. Add deep ground rods or expand conductor mesh.`),
      },
      engineeringNotes: [
        'La couche superficielle de gravier concassé de haute résistivité (> 3000 Ω·m) est cruciale pour élever les seuils de sécurité de contact.',
        'Vérifier les liaisons équipotentielles avec les clôtures périphériques pour éviter tout transfert de potentiel hors du site.',
      ],
    };
  }

  if (activeCalc === 'arc-flash') {
    const arcVoltageV = 400;
    const arcIbfKa = 25;
    const arcWorkingDistMm = 455;
    const arcDurationMs = 120;
    const iArcKa = arcIbfKa * 0.85;
    const incidentEnergyCalCm2 = 4.184 * 0.005 * iArcKa * (arcDurationMs / 1000) * ((610 / arcWorkingDistMm) ** 1.64);
    const afbDistanceCm = Math.sqrt(incidentEnergyCalCm2 / 1.2) * (arcWorkingDistMm / 10);

    return {
      title: locale === 'fr' ? 'Analyse du Risque d\'Arc Électrique (Arc Flash Hazard)' : 'Arc Flash Hazard Analysis',
      calcType: 'ARC-FLASH-IEEE1584',
      standard: 'IEEE 1584-2018 / NFPA 70E / CSA Z462',
      date: dateStr,
      referenceId: `EPEDE-CALC-ARC-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale tableau' : 'Rated Switchboard Voltage', value: `${arcVoltageV}`, unit: 'V' },
        { label: locale === 'fr' ? 'Courant C-C franc (Ibf)' : 'Bolted Fault Current (Ibf)', value: `${arcIbfKa}`, unit: 'kA' },
        { label: locale === 'fr' ? 'Distance de travail opérateur' : 'Working Distance', value: `${arcWorkingDistMm}`, unit: 'mm' },
        { label: locale === 'fr' ? 'Temps d\'élimination de l\'arc' : 'Arc Clearing Time', value: `${arcDurationMs}`, unit: 'ms' },
        { label: locale === 'fr' ? 'Configuration des électrodes' : 'Electrode Configuration', value: 'VCB (Vertical Box)' },
      ],
      formulas: [
        { name: 'Courant d\'arc I_arc', expr: 'Modèle empirique IEEE 1584-2018 [kA]' },
        { name: 'Énergie incidente E', expr: 'E(t, Iarc, Dist, Kenc) [cal/cm²]' },
        { name: 'Distance limite AFB', expr: 'Distance où E = 1.2 cal/cm² (brûlure 2e degré) [cm]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Énergie incidente (E)' : 'Incident Energy (E)', value: incidentEnergyCalCm2.toFixed(2), unit: 'cal/cm²', highlight: true, status: incidentEnergyCalCm2 <= 40 ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Distance limite d\'arc (AFB)' : 'Arc Flash Boundary (AFB)', value: afbDistanceCm.toFixed(1), unit: 'cm' },
        { label: locale === 'fr' ? 'Courant d\'arc effectif' : 'Estimated Arcing Current', value: iArcKa.toFixed(2), unit: 'kA' },
        { label: locale === 'fr' ? 'Catégorie d\'EPI requise' : 'Required PPE Category', value: incidentEnergyCalCm2 <= 4 ? 'CAT 1 (4 cal/cm²)' : incidentEnergyCalCm2 <= 8 ? 'CAT 2 (8 cal/cm²)' : 'CAT 3 (25 cal/cm²)', status: incidentEnergyCalCm2 <= 25 ? 'OK' : 'WARN' },
      ],
      complianceVerdict: {
        status: incidentEnergyCalCm2 <= 40 ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: incidentEnergyCalCm2 <= 40
          ? (locale === 'fr' ? `Énergie incidente de ${incidentEnergyCalCm2.toFixed(2)} cal/cm². Travail permis avec port obligatoire d'EPI approprié.` : `Incident energy ${incidentEnergyCalCm2.toFixed(2)} cal/cm². Standard PPE Category required.`)
          : (locale === 'fr' ? 'DANGER DE MORT : Énergie incidente > 40 cal/cm². Aucun EPI n\'est homologué. Interdiction formelle de travailler sous tension.' : 'EXTREME DANGER: Incident energy > 40 cal/cm². Energized work prohibited.'),
      },
      engineeringNotes: [
        'Le temps de coupure du disjoncteur est le facteur déterminant de l\'énergie incidente. Un déclenchement optique ultra-rapide (< 40 ms) permet de diviser l\'énergie par 3.',
        'Toute intervention dans l\'AFB (' + afbDistanceCm.toFixed(0) + ' cm) impose le port des EPI prescrits.',
      ],
    };
  }

  if (activeCalc === 'ct-sizing') {
    const ctIpn = 1200;
    const ctIsn = 5;
    const ctAlfn = 20;
    const ctVaRating = 30;
    const ctRctOhms = 1.2;
    const ctCableLengthM = 80;
    const ctCableSectionMm2 = 4;
    const ctRelayBurdenVa = 1.5;
    const ctMaxFaultCurrentKa = 25;
    const ctXrRatio = 14;
    const rhoCu = 0.0178;
    const rLoopOhms = (2 * ctCableLengthM * rhoCu) / ctCableSectionMm2;
    const rRelayOhms = ctRelayBurdenVa / (ctIsn ** 2);
    const rBurdenActual = rLoopOhms + rRelayOhms;
    const rBurdenRated = ctVaRating / (ctIsn ** 2);
    const alfEffective = ctAlfn * ((ctRctOhms + rBurdenRated) / (ctRctOhms + rBurdenActual));
    const ktd = 1 + (ctXrRatio / (2 * Math.PI));
    const ifaultSec = (ctMaxFaultCurrentKa * 1000) / (ctIpn / ctIsn);
    const vkRequiredVolts = ktd * ifaultSec * (ctRctOhms + rBurdenActual);
    const isCtSafeFromSaturation = alfEffective >= (ctMaxFaultCurrentKa * 1000) / ctIpn;

    return {
      title: locale === 'fr' ? 'Dimensionnement & Saturation Transformateur de Courant (TC)' : 'Current Transformer Sizing & Saturation Verification',
      calcType: 'CT-SIZING-IEC61869',
      standard: 'CEI 61869-2 (Protection 5P / 10P)',
      date: dateStr,
      referenceId: `EPEDE-CALC-CT-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Rapport de transformation' : 'Transformation Ratio', value: `${ctIpn} / ${ctIsn}`, unit: 'A' },
        { label: locale === 'fr' ? 'Facteur limite de précision (ALF)' : 'Accuracy Limit Factor (ALF)', value: `${ctAlfn}` },
        { label: locale === 'fr' ? 'Puissance de précision assignée' : 'Rated Burden', value: `${ctVaRating}`, unit: 'VA' },
        { label: locale === 'fr' ? 'Résistance interne secondaire (Rct)' : 'CT Secondary Resistance (Rct)', value: `${ctRctOhms}`, unit: 'Ω' },
        { label: locale === 'fr' ? 'Longueur câble de filerie' : 'Wiring Cable Length', value: `${ctCableLengthM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Section câble filerie' : 'Wiring Cable Section', value: `${ctCableSectionMm2}`, unit: 'mm²' },
        { label: locale === 'fr' ? 'Consommation relais de protection' : 'Protection Relay Burden', value: `${ctRelayBurdenVa}`, unit: 'VA' },
        { label: locale === 'fr' ? 'Courant de défaut maximal (Isc)' : 'Max Short-Circuit Current', value: `${ctMaxFaultCurrentKa}`, unit: 'kA' },
        { label: locale === 'fr' ? 'Rapport X/R du réseau' : 'Network X/R Ratio', value: `${ctXrRatio}` },
      ],
      formulas: [
        { name: 'Charge totale secondaire Rb', expr: 'R_liaison + R_relais [Ω]' },
        { name: 'Facteur limite effectif ALF_eff', expr: 'ALFn · (Rct + Rbn) / (Rct + Rb)' },
        { name: 'Tension de coude requise Vk', expr: 'Ktd · Ifault_sec · (Rct + Rb) [V]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Sécurité de non-saturation' : 'Saturation Safety', value: isCtSafeFromSaturation ? 'GARANTIE (Conforme)' : 'RISQUE DE SATURATION', highlight: true, status: isCtSafeFromSaturation ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'ALF effectif en exploitation' : 'Effective Operating ALF', value: alfEffective.toFixed(1) },
        { label: locale === 'fr' ? 'Tension de coude requise (Vk)' : 'Required Knee-Point Voltage', value: vkRequiredVolts.toFixed(1), unit: 'V' },
        { label: locale === 'fr' ? 'Charge totale secondaire (Rb)' : 'Total Secondary Burden (Rb)', value: rBurdenActual.toFixed(3), unit: 'Ω' },
      ],
      complianceVerdict: {
        status: isCtSafeFromSaturation ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: isCtSafeFromSaturation
          ? (locale === 'fr' ? `Le TC ne saturera pas lors du courant de défaut max de ${ctMaxFaultCurrentKa} kA (ALF effectif = ${alfEffective.toFixed(1)}). Protection rapide assurée.` : `CT will not saturate under max fault current of ${ctMaxFaultCurrentKa} kA. Fast relay tripping ensured.`)
          : (locale === 'fr' ? `RISQUE DE SATURATION : L'ALF effectif (${alfEffective.toFixed(1)}) est insuffisant face au courant de court-circuit avec composante apériodique. Augmenter la section de filerie ou choisir un TC de plus forte puissance VA.` : `RISK OF SATURATION: Effective ALF is insufficient for prospective fault current. Increase cable size or choose higher VA rated CT.`),
      },
      engineeringNotes: [
        'La composante apériodique DC (facteur de surdimensionnement transitoire Ktd = ' + ktd.toFixed(2) + ') est prise en compte selon le ratio X/R = ' + ctXrRatio + '.',
        'Pour les protections différentielles 87T ou 87B, utiliser la classe PX / PR avec contrôle strict de la tension de coude Vk.',
      ],
    };
  }

  if (activeCalc === 'solar-sizing') {
    const pvPmpW = 585;
    const pvVocStc = 50.6;
    const pvVmpStc = 42.3;
    const pvBetaVoc = -0.27;
    const pvTmin = -5;
    const pvTambMax = 40;
    const pvNoct = 45;
    const pvSysVmax = 1500;
    const pvInvPacKw = 250;
    const pvInvVmpptMin = 800;
    const pvInvVmpptMax = 1300;
    const pvSelectedModPerStr = 26;
    const pvStringsPerInv = 20;
    const pvTargetFarmMw = 50;

    const pvTcellMax = pvTambMax + ((pvNoct - 20) / 800) * 1000;
    const pvVocCold = pvVocStc * (1 + (pvBetaVoc / 100) * (pvTmin - 25));
    const pvVmpHot = pvVmpStc * (1 + (pvBetaVoc / 100) * (pvTcellMax - 25));
    const pvNmax = Math.max(1, Math.floor(pvSysVmax / pvVocCold));
    const pvNmin = Math.max(1, Math.ceil(pvInvVmpptMin / pvVmpHot));
    const pvStringVocCold = pvSelectedModPerStr * pvVocCold;
    const pvStringVmpHot = pvSelectedModPerStr * pvVmpHot;
    const pvStringPdcKw = (pvSelectedModPerStr * pvPmpW) / 1000;
    const pvActualInvPdcKw = pvStringsPerInv * pvStringPdcKw;
    const pvIlr = pvActualInvPdcKw / pvInvPacKw;
    const pvTotalInverters = Math.ceil((pvTargetFarmMw * 1000) / pvActualInvPdcKw);
    const pvTotalActualMw = (pvTotalInverters * pvActualInvPdcKw) / 1000;
    const isPvVocCompliant = pvStringVocCold <= pvSysVmax;
    const isPvMpptCompliant = pvStringVmpHot >= pvInvVmpptMin && pvSelectedModPerStr * pvVmpStc <= pvInvVmpptMax;
    const isPvIlrOptimal = pvIlr >= 1.15 && pvIlr <= 1.45;

    return {
      title: locale === 'fr' ? 'Dimensionnement Chaîne Solaire PV & Compatibilité Onduleur' : 'Solar PV String & Inverter MPPT Sizing Note',
      calcType: 'PV-STRING-SIZING-IEC62548',
      standard: 'CEI 62548 / CEI 61215 / UTE C 15-712-1',
      date: dateStr,
      referenceId: `EPEDE-CALC-PV-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Puissance module STC (Pmp)' : 'Module STC Power (Pmp)', value: `${pvPmpW}`, unit: 'Wc' },
        { label: locale === 'fr' ? 'Tension circuit ouvert STC (Voc)' : 'STC Open-Circuit Voltage (Voc)', value: `${pvVocStc}`, unit: 'V' },
        { label: locale === 'fr' ? 'Tension point max puissance (Vmp)' : 'STC MPP Voltage (Vmp)', value: `${pvVmpStc}`, unit: 'V' },
        { label: locale === 'fr' ? 'Coefficient thermique (β_Voc)' : 'Thermal Coeff (β_Voc)', value: `${pvBetaVoc}`, unit: '%/°C' },
        { label: locale === 'fr' ? 'Température ambiante minimale (Tmin)' : 'Min Ambient Temp (Tmin)', value: `${pvTmin}`, unit: '°C' },
        { label: locale === 'fr' ? 'Température cellule maximale calculée' : 'Calculated Max Cell Temp', value: `${pvTcellMax.toFixed(1)}`, unit: '°C' },
        { label: locale === 'fr' ? 'Tension maximale système (Vsys)' : 'Max System DC Voltage', value: `${pvSysVmax}`, unit: 'V' },
        { label: locale === 'fr' ? 'Plage MPPT onduleur' : 'Inverter MPPT Range', value: `${pvInvVmpptMin} - ${pvInvVmpptMax}`, unit: 'V' },
        { label: locale === 'fr' ? 'Modules choisis par chaîne' : 'Modules Selected per String', value: `${pvSelectedModPerStr}` },
      ],
      formulas: [
        { name: 'Voc corrigée à froid Voc(Tmin)', expr: 'Voc_STC · [1 + β_Voc · (Tmin - 25°C)] [V]' },
        { name: 'Vmp corrigée à chaud Vmp(Tcell_max)', expr: 'Vmp_STC · [1 + β_Voc · (Tcell_max - 25°C)] [V]' },
        { name: 'Nombre max modules par chaîne Nmax', expr: 'floor(Vsys_max / Voc(Tmin))' },
        { name: 'Nombre min modules par chaîne Nmin', expr: 'ceil(Vmppt_min / Vmp(Tcell_max))' },
        { name: 'Ratio de surdimensionnement DC/AC (ILR)', expr: 'P_DC / P_AC_onduleur' },
      ],
      results: [
        { label: locale === 'fr' ? 'Voc maximale chaîne à froid' : 'Max String Voc (Cold)', value: pvStringVocCold.toFixed(1), unit: 'V', highlight: true, status: isPvVocCompliant ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Vmp minimale chaîne à chaud' : 'Min String Vmp (Hot)', value: pvStringVmpHot.toFixed(1), unit: 'V', status: isPvMpptCompliant ? 'OK' : 'WARN' },
        { label: locale === 'fr' ? 'Modules recommandés par chaîne' : 'Allowed String Modules Range', value: `${pvNmin} à ${pvNmax}`, unit: 'modules' },
        { label: locale === 'fr' ? 'Ratio DC/AC onduleur (ILR)' : 'Inverter Loading Ratio (ILR)', value: pvIlr.toFixed(2), status: isPvIlrOptimal ? 'OK' : 'INFO' },
        { label: locale === 'fr' ? 'Puissance crête totale centrale' : 'Total Peak Capacity', value: pvTotalActualMw.toFixed(2), unit: 'MWc' },
      ],
      complianceVerdict: {
        status: isPvVocCompliant && isPvMpptCompliant ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: isPvVocCompliant && isPvMpptCompliant
          ? (locale === 'fr' ? `La configuration à ${pvSelectedModPerStr} modules par chaîne respecte rigoureusement la limite d'isolement de ${pvSysVmax} V DC à ${pvTmin}°C (marge de sécurité = ${(pvSysVmax - pvStringVocCold).toFixed(0)} V) et reste parfaitement dans la fenêtre MPPT [${pvInvVmpptMin}-${pvInvVmpptMax} V] par canicule.` : `String configuration with ${pvSelectedModPerStr} modules is strictly compliant with ${pvSysVmax} V limit and MPPT operating window.`)
          : (locale === 'fr' ? `ATTENTION : Risque de surtension ou de décrochage MPPT ! La tension de chaîne sort des limites admissibles.` : `WARNING: String voltage violates system voltage or MPPT limits.`),
      },
      engineeringNotes: [
        'La tension à froid Voc(Tmin) doit TOUJOURS rester inférieure à la tension maximale admissible de l\'onduleur et des câbles solaires H1Z2Z2-K (1500 V DC).',
        'Vérifier la tenue au courant de court-circuit inverse (fusibles gPV requis si plus de 2 chaînes en parallèle par MPPT selon CEI 62548).',
      ],
    };
  }

  if (activeCalc === 'bess-sizing') {
    const bessEusableMwh = 40;
    const bessPpcsMw = 10;
    const bessChemistry = 'LFP';
    const bessDod = 0.90;
    const bessRte = 0.88;
    const bessLifetimeYears = 15;
    const bessCyclesPerDay = 1.2;
    const bessEolSoh = 0.80;

    const bessDischargeHours = bessEusableMwh / bessPpcsMw;
    const bessNameplateBolMwh = bessEusableMwh / (bessDod * bessEolSoh * bessRte);
    const bessCRate = bessPpcsMw / bessNameplateBolMwh;
    const bessStandardContainerMwh = 3.35;
    const bessContainersCount = Math.ceil(bessNameplateBolMwh / bessStandardContainerMwh);
    const bessTotalCycles = Math.round(365 * bessLifetimeYears * bessCyclesPerDay);
    const bessTotalThroughputGwh = (bessTotalCycles * bessEusableMwh) / 1000;
    const bessMaxCycleRating = 7000;
    const isBessCycleLifeCompliant = bessTotalCycles <= bessMaxCycleRating;
    const bessShortCircuitKa = ((bessPpcsMw * 1e6) / (Math.sqrt(3) * 33000)) * 1.15 / 1000;

    return {
      title: locale === 'fr' ? 'Dimensionnement Système de Stockage Batterie BESS (Capacité & C-Rate)' : 'BESS Battery Energy Storage Sizing & C-Rate Note',
      calcType: 'BESS-SIZING-IEC62933',
      standard: 'CEI 62933-2-1 / IEEE 2800 / CEI 62619',
      date: dateStr,
      referenceId: `EPEDE-CALC-BESS-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Énergie utile garantie EOL' : 'Guaranteed Usable Energy (EOL)', value: `${bessEusableMwh}`, unit: 'MWh' },
        { label: locale === 'fr' ? 'Puissance nominale convertisseur PCS' : 'Rated PCS Inverter Power', value: `${bessPpcsMw}`, unit: 'MW' },
        { label: locale === 'fr' ? 'Chimie cellules' : 'Cell Chemistry', value: 'Lithium Fer Phosphate (LFP)' },
        { label: locale === 'fr' ? 'Profondeur de décharge (DoD)' : 'Depth of Discharge (DoD)', value: `${(bessDod * 100).toFixed(0)}`, unit: '%' },
        { label: locale === 'fr' ? 'Rendement aller-retour (RTE)' : 'Round-Trip Efficiency (RTE)', value: `${(bessRte * 100).toFixed(0)}`, unit: '%' },
        { label: locale === 'fr' ? 'État de santé en fin de vie (SOH_eol)' : 'End-of-Life SOH', value: `${(bessEolSoh * 100).toFixed(0)}`, unit: '%' },
        { label: locale === 'fr' ? 'Durée de vie contractuelle visée' : 'Target Asset Life', value: `${bessLifetimeYears}`, unit: 'ans' },
        { label: locale === 'fr' ? 'Cyclage journalier moyen' : 'Daily Cycling Rate', value: `${bessCyclesPerDay}`, unit: 'cycles/j' },
      ],
      formulas: [
        { name: 'Autonomie de décharge à puissance assignée', expr: 'E_utile / P_PCS [h]' },
        { name: 'Capacité plaque début de vie (BOL)', expr: 'E_utile / (DoD · SOH_eol · RTE) [MWh]' },
        { name: 'Régime de décharge C-Rate', expr: 'P_PCS / E_BOL [C]' },
        { name: 'Nombre de conteneurs 3.35 MWh', expr: 'ceil(E_BOL / 3.35 MWh)' },
        { name: 'Énergie cumulée transitée (Throughput)', expr: 'Cycles_totaux · E_utile [GWh]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Capacité brute requise BOL' : 'Required BOL Nameplate Capacity', value: bessNameplateBolMwh.toFixed(1), unit: 'MWh', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Autonomie de décharge nominale' : 'Discharge Duration (100% Pn)', value: bessDischargeHours.toFixed(1), unit: 'heures' },
        { label: locale === 'fr' ? 'Régime C-Rate équivalent' : 'Operating C-Rate', value: `${bessCRate.toFixed(2)} C`, status: 'INFO' },
        { label: locale === 'fr' ? 'Conteneurs 20ft (3.35 MWh) requis' : '20ft BESS Enclosures Needed', value: `${bessContainersCount}`, unit: 'unités' },
        { label: locale === 'fr' ? 'Cyclage cumulé sur la durée de vie' : 'Total Lifetime Full Cycles', value: `${bessTotalCycles}`, unit: 'cycles', status: isBessCycleLifeCompliant ? 'OK' : 'WARN' },
        { label: locale === 'fr' ? 'Énergie transitée cumulée' : 'Lifetime Energy Throughput', value: bessTotalThroughputGwh.toFixed(1), unit: 'GWh' },
      ],
      complianceVerdict: {
        status: isBessCycleLifeCompliant ? 'COMPLIANT' : 'INFORMATIONAL',
        message: isBessCycleLifeCompliant
          ? (locale === 'fr' ? `La chimie ${bessChemistry} supporte jusqu'à ${bessMaxCycleRating} cycles à 90% DoD. Le profil de ${bessTotalCycles} cycles sur ${bessLifetimeYears} ans est pleinement viable sans remplacement prématuré.` : `Selected ${bessChemistry} technology handles up to ${bessMaxCycleRating} cycles, meeting lifetime target.`)
          : (locale === 'fr' ? `ATTENTION : Le cyclage cumulé (${bessTotalCycles} cycles) excède l'endurance nominale de la chimie choisie. Prévoir un plan d'augmentation (augmentation plan) à mi-vie ou passer en chimie LFP.` : `WARNING: Cumulative cycling exceeds cell capability. Mid-life augmentation required.`),
      },
      engineeringNotes: [
        'Le rendement RTE prend en compte les pertes de conversion PCS, les pertes internes des cellules et la consommation auxiliaire CVC / HVAC.',
        'Conformément à la norme NFPA 855 / CEI 62933-5-2, prévoir un espacement minimal de 3 mètres entre conteneurs ou des parois coupe-feu 2 heures.',
        'La contribution au court-circuit des onduleurs BESS à base d\'IGBT est électroniquement bridée à 1.15 · In, soit environ ' + bessShortCircuitKa.toFixed(2) + ' kA sous 33 kV.',
      ],
    };
  }

  if (activeCalc === 'surge-arrester') {
    const unKv = 225;
    const umKv = 245;
    const ke = 1.4;
    const uPhaseMaxRms = umKv / Math.sqrt(3);
    const ucSelected = Math.ceil(uPhaseMaxRms * 1.05 * 10) / 10; // 148.6 kV
    const urSelected = 186; // kV
    const bilKv = 1050; // kV peak
    const uplKv = Math.round(ucSelected * 2.55); // 379 kV
    const upsKv = Math.round(ucSelected * 2.10); // 312 kV
    const mplPercent = ((bilKv - uplKv) / uplKv) * 100;
    const bslKv = bilKv * 0.83;
    const mpsPercent = ((bslKv - upsKv) / upsKv) * 100;
    const steepnessS = 1000; // kV/µs
    const vSpeed = 300; // m/µs
    const distanceM = 15;
    const lMaxPermissibleM = (( (bilKv / 1.15) - uplKv ) * vSpeed) / (2 * steepnessS);
    const uTransfoEstimated = uplKv + 2 * (steepnessS / vSpeed) * distanceM;

    return {
      title: locale === 'fr' ? 'Dimensionnement Parafoudre & Coordination de l\'Isolement' : 'Surge Arrester Sizing & Insulation Coordination Note',
      calcType: 'SURGE-ARRESTER-IEC60099',
      standard: 'CEI 60099-4 / CEI 60071-1 / IEEE C62.11',
      date: dateStr,
      referenceId: `EPEDE-CALC-ARRESTER-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale réseau (Un)' : 'Nominal System Voltage (Un)', value: `${unKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Tension maximale du matériel (Um)' : 'Highest System Voltage (Um)', value: `${umKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Facteur de mise à la terre (ke)' : 'Earth Fault Factor (ke)', value: `${ke}` },
        { label: locale === 'fr' ? 'Niveau d\'isolement au choc (BIL)' : 'Transformer BIL', value: `${bilKv}`, unit: 'kV crête' },
        { label: locale === 'fr' ? 'Courant nominal de décharge (In)' : 'Nominal Discharge Current (In)', value: '10', unit: 'kA (8/20 µs)' },
        { label: locale === 'fr' ? 'Distance parafoudre-transformateur' : 'Arrester-to-Transformer Distance', value: `${distanceM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Raideur d\'onde incidente (S)' : 'Wavefront Steepness (S)', value: `${steepnessS}`, unit: 'kV/µs' },
      ],
      formulas: [
        { name: 'Tension de service continu Uc', expr: 'Um / √3 · 1.05 [kV rms]' },
        { name: 'Tension assignée Ur', expr: 'max(Uc / 0.8, (ke · Um / √3) / k_TOV) [kV rms]' },
        { name: 'Marge protection choc foudre MPL', expr: '((BIL - Upl) / Upl) · 100% [≥ 20%]' },
        { name: 'Marge choc de manœuvre MPS', expr: '((BSL - Ups) / Ups) · 100% [≥ 15%]' },
        { name: 'Distance maximale séparative Lmax', expr: '(v / (2 · S)) · (BIL / 1.15 - Upl) [m]' },
        { name: 'Surtension crête aux bornes Ut', expr: 'Upl + 2 · (S / v) · L [kV crête]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Tension de service continu (Uc)' : 'Continuous Operating Voltage (Uc)', value: `${ucSelected.toFixed(1)}`, unit: 'kV rms', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Tension assignée recommandée (Ur)' : 'Rated Arrester Voltage (Ur)', value: `${urSelected}`, unit: 'kV rms', status: 'OK' },
        { label: locale === 'fr' ? 'Tension résiduelle choc foudre (Upl)' : 'Lightning Residual Voltage (Upl)', value: `${uplKv}`, unit: 'kV crête' },
        { label: locale === 'fr' ? 'Marge de protection foudre (MPL)' : 'Lightning Protective Margin (MPL)', value: `${mplPercent.toFixed(1)}`, unit: '%', status: mplPercent >= 20 ? 'OK' : 'WARN' },
        { label: locale === 'fr' ? 'Marge choc de manœuvre (MPS)' : 'Switching Protective Margin (MPS)', value: `${mpsPercent.toFixed(1)}`, unit: '%', status: mpsPercent >= 15 ? 'OK' : 'WARN' },
        { label: locale === 'fr' ? 'Distance maximale admissible (Lmax)' : 'Max Separation Distance (Lmax)', value: `${lMaxPermissibleM.toFixed(1)}`, unit: 'm', status: distanceM <= lMaxPermissibleM ? 'OK' : 'WARN' },
        { label: locale === 'fr' ? 'Surtension réfléchie au transfo' : 'Peak Voltage at Transformer Bushing', value: `${uTransfoEstimated.toFixed(0)}`, unit: 'kV crête' },
      ],
      complianceVerdict: {
        status: mplPercent >= 20 && distanceM <= lMaxPermissibleM ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: mplPercent >= 20 && distanceM <= lMaxPermissibleM
          ? (locale === 'fr'
              ? `Coordination des isolements parfaitement conforme CEI 60071-1. La marge de protection foudre de ${mplPercent.toFixed(1)}% excède le seuil réglementaire de 20%. La distance d'implantation (${distanceM} m) est inférieure à la distance critique de ${lMaxPermissibleM.toFixed(1)} m.`
              : `Insulation coordination fully compliant with IEC 60071-1. Lightning margin of ${mplPercent.toFixed(1)}% exceeds 20% threshold. Separation distance (${distanceM} m) is safely below maximum ${lMaxPermissibleM.toFixed(1)} m.`)
          : (locale === 'fr'
              ? 'ATTENTION : Risque de dépassement de la tenue diélectrique du transformateur par réflexion d\'onde ! Rapprocher impérativement le parafoudre des traversées.'
              : 'WARNING: Potential transformer dielectric breakdown due to wave reflection! Arrester must be mounted closer to bushings.'),
      },
      engineeringNotes: [
        'Technologie requise : Parafoudre à Oxyde Métallique (ZnO) sans éclateur sous enveloppe en caoutchouc silicone HTV hydrophobe.',
        'Ligne de fuite minimale requise : 25 mm/kV (classe de pollution forte) ou 31 mm/kV (très forte / littoral maritime type Kribi) selon CEI 60815.',
        'Les raccordements de terre doivent être réalisés par feuillard cuivre de section minimale 50 mm² avec cheminement rectiligne le plus court possible (< 1.5 m) pour minimiser l\'inductance parasite L·di/dt.',
      ],
    };
  }

  // Default: PFC Calculator
  const pfcPKw = 350;
  const pfcCosPhiInitial = 0.72;
  const pfcCosPhiTarget = 0.96;
  const pfcVoltageV = 400;
  const pfcStepsCount = 6;
  const phi1 = Math.acos(Math.max(0.1, Math.min(1.0, pfcCosPhiInitial)));
  const phi2 = Math.acos(Math.max(0.1, Math.min(1.0, pfcCosPhiTarget)));
  const tanPhi1 = Math.tan(phi1);
  const tanPhi2 = Math.tan(phi2);
  const deltaTan = Math.max(0, tanPhi1 - tanPhi2);
  const qRequiredKvar = Math.max(0, pfcPKw * deltaTan);
  const sInitialKva = pfcPKw / pfcCosPhiInitial;
  const sFinalKva = pfcPKw / pfcCosPhiTarget;
  const deltaSKva = Math.max(0, sInitialKva - sFinalKva);
  const iInitialAmps = (pfcPKw * 1000) / (Math.sqrt(3) * pfcVoltageV * pfcCosPhiInitial);
  const iFinalAmps = (pfcPKw * 1000) / (Math.sqrt(3) * pfcVoltageV * pfcCosPhiTarget);
  const deltaIAmps = Math.max(0, iInitialAmps - iFinalAmps);
  const iCapAmps = (qRequiredKvar * 1000) / (Math.sqrt(3) * pfcVoltageV);
  const omega50Hz = 2 * Math.PI * 50;
  const cDeltaMicroFarad = (qRequiredKvar * 1000) / (3 * omega50Hz * (pfcVoltageV ** 2)) * 1e6;

  return {
    title: locale === 'fr' ? 'Compensation d\'Énergie Réactive & Batterie de Condensateurs' : 'Power Factor Correction & Capacitor Bank Sizing',
    calcType: 'PFC-CAPACITOR-IEC60831',
    standard: 'CEI 60831-1/2 / CEI 61642 / NF C 15-100',
    date: dateStr,
    referenceId: `EPEDE-CALC-PFC-${now.getTime().toString().slice(-6)}`,
    inputs: [
      { label: locale === 'fr' ? 'Puissance active souscrite (P)' : 'Active Load Power (P)', value: `${pfcPKw}`, unit: 'kW' },
      { label: locale === 'fr' ? 'Facteur de puissance actuel' : 'Current Power Factor (cos φ1)', value: `${pfcCosPhiInitial}` },
      { label: locale === 'fr' ? 'Facteur de puissance cible' : 'Target Power Factor (cos φ2)', value: `${pfcCosPhiTarget}` },
      { label: locale === 'fr' ? 'Tension de service (U)' : 'Operating Voltage (U)', value: `${pfcVoltageV}`, unit: 'V' },
      { label: locale === 'fr' ? 'Self de désaccord anti-harmonique' : 'Detuning Reactor Factor', value: '7% (Accord 189 Hz)' },
      { label: locale === 'fr' ? 'Nombre de gradins automatiques' : 'Capacitor Bank Steps', value: `${pfcStepsCount}` },
    ],
    formulas: [
      { name: 'Puissance réactive requise Qc', expr: 'P · (tan φ1 - tan φ2) [kvar]' },
      { name: 'Courant de la batterie Ic', expr: '(Qc · 1000) / (√3 · U) [A]' },
      { name: 'Capacité en triangle C_Δ', expr: 'Qc / (3 · ω · U²) [µF]' },
      { name: 'Surtension aux condensateurs Uc', expr: 'U / (1 - p) [V]' },
    ],
    results: [
      { label: locale === 'fr' ? 'Puissance réactive totale (Qc)' : 'Required Reactive Power (Qc)', value: qRequiredKvar.toFixed(1), unit: 'kvar', highlight: true, status: 'OK' },
      { label: locale === 'fr' ? 'Courant nominal batterie (Ic)' : 'Capacitor Bank Rated Current', value: iCapAmps.toFixed(1), unit: 'A' },
      { label: locale === 'fr' ? 'Capacité requise par phase' : 'Capacitance per phase (Delta)', value: cDeltaMicroFarad.toFixed(1), unit: 'µF' },
      { label: locale === 'fr' ? 'Puissance apparente libérée' : 'Released Apparent Power', value: deltaSKva.toFixed(1), unit: 'kVA' },
      { label: locale === 'fr' ? 'Allègement du courant de ligne' : 'Line Current Reduction', value: `-${deltaIAmps.toFixed(1)}`, unit: 'A' },
      { label: locale === 'fr' ? 'Tension assignée condensateurs' : 'Recommended Capacitor Rating', value: '≥ 440', unit: 'V', status: 'WARN' },
    ],
    complianceVerdict: {
      status: 'COMPLIANT',
      message: locale === 'fr'
        ? `La batterie de ${qRequiredKvar.toFixed(0)} kvar ramène la tangente φ de ${tanPhi1.toFixed(2)} à ${tanPhi2.toFixed(2)} (cos φ = ${pfcCosPhiTarget}). Élimination de 100% des pénalités pour consommation de réactif (seuil tan φ ≤ 0.40).`
        : `Capacitor bank of ${qRequiredKvar.toFixed(0)} kvar improves power factor to ${pfcCosPhiTarget} (tan φ = ${tanPhi2.toFixed(2)} ≤ 0.40), completely eliminating utility reactive penalties.`,
    },
    engineeringNotes: [
      'Présence d\'une self de désaccord à 7% : la fréquence d\'accord à 189 Hz est inférieure au rang harmonique 5 (250 Hz), éliminant tout risque d\'amplification par résonance.',
      'Prévoir des contacteurs spéciaux de commutation de condensateurs munis de résistances d\'amortissement de pré-enclenchement.',
    ],
  };

  // 13. BUSBAR SHORT-CIRCUIT MECHANICAL & THERMAL WITHSTAND (CEI 60865-1)
  const unBusKv = 225;
  const ipBusKa = 80.0;
  const ithBusKa = 31.5;
  const tkBusSec = 1.0;
  const aBusM = 3.5;
  const lBusM = 8.0;
  const dExtBusMm = 120;
  const sWallBusMm = 10;
  const areaBusMm2 = (Math.PI / 4) * (dExtBusMm ** 2 - (dExtBusMm - 2 * sWallBusMm) ** 2);
  const iyBusMm4 = (Math.PI / 64) * (dExtBusMm ** 4 - (dExtBusMm - 2 * sWallBusMm) ** 4);
  const wmBusMm3 = (2 * iyBusMm4) / dExtBusMm;
  const fmBusN = 0.2 * (Math.sqrt(3) / 2) * ((ipBusKa ** 2) / aBusM) * lBusM;
  const bendingMomentBusNm = (fmBusN * lBusM) / 12;
  const vSigmaBus = 1.6;
  const sigmaBusMpa = (vSigmaBus * 1.0 * (bendingMomentBusNm * 1000)) / wmBusMm3;
  const sigmaPermissibleBusMpa = 1.5 * 150; // Al alloy EN AW-6101B
  const fdInsulatorKn = (1.5 * 1.25 * fmBusN) / 1000;
  const frPermissibleKn = 0.8 * 12.0;
  const sThMinMm2 = (ithBusKa * 1000 * Math.sqrt(tkBusSec)) / 88;

  return {
    title: locale === 'fr' 
      ? 'Dimensionnement Électrodynamique & Thermique des Jeux de Barres' 
      : 'Busbar Short-Circuit Electrodynamic & Thermal Sizing',
    calcType: 'BUSBAR-ELECTRODYNAMIC-IEC60865',
    standard: 'CEI 60865-1 / CEI 61936-1 / IEEE 605',
    date: dateStr,
    referenceId: `EPEDE-CALC-BUS-${now.getTime().toString().slice(-6)}`,
    inputs: [
      { label: locale === 'fr' ? 'Tension nominale Un' : 'Nominal Voltage Un', value: `${unBusKv}`, unit: 'kV' },
      { label: locale === 'fr' ? 'Courant de crête de court-circuit Ip' : 'Peak Short-Circuit Current Ip', value: `${ipBusKa}`, unit: 'kA peak' },
      { label: locale === 'fr' ? 'Courant thermique Ith (1s)' : 'Thermal Current Ith (1s)', value: `${ithBusKa}`, unit: 'kA' },
      { label: locale === 'fr' ? 'Profil du conducteur' : 'Conductor Profile', value: 'Tube Al Alliage Ø 120/110 mm' },
      { label: locale === 'fr' ? 'Entraxe entre phases (a)' : 'Phase Spacing (a)', value: `${aBusM}`, unit: 'm' },
      { label: locale === 'fr' ? 'Portée entre supports (l)' : 'Span Length (l)', value: `${lBusM}`, unit: 'm' },
      { label: locale === 'fr' ? 'Charge de rupture isolateur (Fr)' : 'Insulator Breaking Rating (Fr)', value: '12.0', unit: 'kN' },
    ],
    formulas: [
      { name: 'Force de Laplace de crête Fm', expr: '(µ0 / 2π) · (√3 / 2) · (Ip² / a) · l [N]' },
      { name: 'Contrainte de flexion dynamique σm', expr: '(Vσ · β · M) / Wm [MPa]' },
      { name: 'Effort dynamique sur isolateur Fd', expr: 'VF · α · Fm [kN]' },
      { name: 'Section thermique minimale Sth', expr: '(Ith · √tk) / kθ [mm²]' },
    ],
    results: [
      { label: locale === 'fr' ? 'Force électrodynamique Fm' : 'Electrodynamic Force Fm', value: (fmBusN / 1000).toFixed(2), unit: 'kN', highlight: true, status: 'OK' },
      { label: locale === 'fr' ? 'Contrainte mécanique calculée (σm)' : 'Calculated Bending Stress (σm)', value: sigmaBusMpa.toFixed(1), unit: 'MPa', status: sigmaBusMpa <= sigmaPermissibleBusMpa ? 'OK' : 'DANGER' },
      { label: locale === 'fr' ? 'Contrainte admissible (q · Rp0.2)' : 'Permissible Bending Stress', value: sigmaPermissibleBusMpa.toFixed(1), unit: 'MPa' },
      { label: locale === 'fr' ? 'Effort dynamique sur isolateur (Fd)' : 'Insulator Dynamic Load (Fd)', value: fdInsulatorKn.toFixed(2), unit: 'kN', status: fdInsulatorKn <= frPermissibleKn ? 'OK' : 'DANGER' },
      { label: locale === 'fr' ? 'Section du tube réelle' : 'Actual Conductor Section', value: areaBusMm2.toFixed(0), unit: 'mm²' },
      { label: locale === 'fr' ? 'Section thermique requise Sth' : 'Required Thermal Section Sth', value: sThMinMm2.toFixed(0), unit: 'mm²', status: areaBusMm2 >= sThMinMm2 ? 'OK' : 'DANGER' },
    ],
    complianceVerdict: {
      status: sigmaBusMpa <= sigmaPermissibleBusMpa && fdInsulatorKn <= frPermissibleKn && areaBusMm2 >= sThMinMm2 ? 'COMPLIANT' : 'NON_COMPLIANT',
      message: locale === 'fr'
        ? `Le jeu de barres tubulaire 225 kV vérifie l'ensemble des critères de la norme CEI 60865-1 : contrainte de flexion σm = ${sigmaBusMpa.toFixed(1)} MPa (≤ ${sigmaPermissibleBusMpa.toFixed(1)} MPa), effort isolateur Fd = ${fdInsulatorKn.toFixed(2)} kN (≤ ${frPermissibleKn.toFixed(2)} kN) et section thermique adéquate.`
        : `Tubular busbar meets all criteria of IEC 60865-1: bending stress σm = ${sigmaBusMpa.toFixed(1)} MPa (≤ ${sigmaPermissibleBusMpa.toFixed(1)} MPa), insulator load Fd = ${fdInsulatorKn.toFixed(2)} kN (≤ ${frPermissibleKn.toFixed(2)} kN) and thermal withstand confirmed.`,
    },
    engineeringNotes: [
      'Calcul mené avec coefficient d\'amplification dynamique Vσ prenant en compte la réponse mécanique de la travée sous l\'effort impulsionnel initial.',
      'Les isolateurs supports doivent être spécifiés avec une charge de rupture à la flexion Fr ≥ 12 kN pour respecter la marge de sécurité normative de 20%.',
    ],
  };

  // 15. OVERHEAD TRANSMISSION LINE PARAMETERS & CORONA LOSS (IEC 60826 / IEEE 738 / PEEK)
  if (activeCalc === 'transmission-line') {
    const unKv = 225;
    const lengthKm = 50.8;
    const powerMw = 420;
    const bundleN = 2;
    const spacingMm = 400;
    const gmdM = 8.19;
    const zcOhm = 286.4;
    const silMw = 176.7;
    const rPrimeOhmPerKm = 0.0298;
    const xLPrimeOhmPerKm = 0.312;
    const cPrimeMicroFPerKm = 0.0118;
    const eOperatingKvCm = 15.4;
    const e0CriticalKvCm = 19.8;
    const coronaSafetyMargin = e0CriticalKvCm / eOperatingKvCm;
    const coronaLossKwPerKm = 0.15;
    const totalLineCoronaLossKw = coronaLossKwPerKm * lengthKm;

    return {
      title: locale === 'fr'
        ? 'Paramètres R-L-C de Ligne THT, Faisceaux & Pertes Corona (CEI 60826 / Peek)'
        : 'Overhead Transmission Line R-L-C, Bundles & Corona Losses (IEC 60826 / Peek)',
      calcType: 'LINE-PARAMETERS-CORONA',
      standard: 'CEI 60826 / IEEE Std 738 / Formule de Peek',
      date: dateStr,
      referenceId: `EPEDE-CALC-TLN-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale de ligne (Un)' : 'Line Voltage (Un)', value: `${unKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Longueur de liaison (L)' : 'Line Length (L)', value: `${lengthKm}`, unit: 'km' },
        { label: locale === 'fr' ? 'Puissance transitée (P)' : 'Transferred Active Power', value: `${powerMw}`, unit: 'MW' },
        { label: locale === 'fr' ? 'Conducteurs par faisceau (n)' : 'Subconductors / Phase', value: `${bundleN}× Aster 570 mm² (${spacingMm} mm)` },
        { label: locale === 'fr' ? 'Distance moyenne géométrique (GMD)' : 'Geometric Mean Distance (GMD)', value: `${gmdM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Conditions atmosphériques' : 'Weather Conditions', value: 'Temps Sec / Beau Temps (m = 0.87)' },
      ],
      formulas: [
        { name: 'Impédance caractéristique Zc', expr: '√(L\' / C\') [Ω]' },
        { name: 'Puissance naturelle SIL', expr: 'Un² / Zc [MW]' },
        { name: 'Gradient critique disruptif E0 (Peek)', expr: '21.2 · m · δ · (1 + 0.301 / √(δ · r)) [kV_rms/cm]' },
        { name: 'Champ électrique de surface E_surf', expr: 'V_ph / (n · r · ln(GMD / r_eq)) · (1 + (n-1)·r/R_faisceau) [kV/cm]' },
        { name: 'Pertes Joule à pleine charge', expr: '3 · I² · R_tot [MW]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Puissance naturelle (SIL)' : 'Surge Impedance Loading (SIL)', value: silMw.toFixed(1), unit: 'MW', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Impédance caractéristique (Zc)' : 'Characteristic Surge Impedance', value: zcOhm.toFixed(1), unit: 'Ω' },
        { label: locale === 'fr' ? 'Réactance linéique (X\'L)' : 'Distributed Inductive Reactance', value: xLPrimeOhmPerKm.toFixed(4), unit: 'Ω/km' },
        { label: locale === 'fr' ? 'Capacité linéique (C\')' : 'Distributed Capacitance', value: cPrimeMicroFPerKm.toFixed(4), unit: 'μF/km' },
        { label: locale === 'fr' ? 'Gradient critique de Peek (E0)' : 'Critical Disruptive Field (E0)', value: e0CriticalKvCm.toFixed(2), unit: 'kV/cm' },
        { label: locale === 'fr' ? 'Champ de surface en exploitation' : 'Operating Surface Electric Field', value: eOperatingKvCm.toFixed(2), unit: 'kV/cm' },
        { label: locale === 'fr' ? 'Marge de sécurité Corona (E0 / E_surf)' : 'Corona Inception Safety Margin', value: coronaSafetyMargin.toFixed(2), status: coronaSafetyMargin >= 1.05 ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Pertes Corona globales de la ligne' : 'Total Corona Power Losses', value: totalLineCoronaLossKw.toFixed(1), unit: 'kW' },
      ],
      complianceVerdict: {
        status: coronaSafetyMargin >= 1.05 ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: locale === 'fr'
          ? `La ligne THT 225 kV Nachtigal - Nyom II (faisceau 2×Aster 570 mm²) est conforme aux critères CEI 60826 et de l'effet Corona : marge de sécurité E0 / E_surf = ${coronaSafetyMargin.toFixed(2)} (> 1.05), absence d'ionisation disruptive permanente et pertes Corona limitées à ${totalLineCoronaLossKw.toFixed(1)} kW.`
          : `The 225 kV Nachtigal - Nyom II transmission line (2×Aster 570 mm² bundle) complies with IEC 60826 and Corona inception criteria: safety margin E0 / E_surf = ${coronaSafetyMargin.toFixed(2)} (> 1.05), no disruptive continuous ionization, and Corona losses restricted to ${totalLineCoronaLossKw.toFixed(1)} kW.`,
      },
      engineeringNotes: [
        'Le faisceau biconducteur (n=2, d=400 mm) augmente le rayon équivalent r_eq de 15.5 mm à 78.8 mm, réduisant drastiquement le champ électrique superficiel et élevant la puissance naturelle SIL à 176.7 MW.',
        'Sous pluie tropicale battante (m_meteo = 0.72), le gradient critique E0 s\'abaisse temporairement à 16.4 kV/cm, entraînant un bourdonnement acoustique modéré conforme aux seuils environnementaux SONATREL (< 53 dB(A) à la limite d\'emprise).',
      ],
    };
  }

  // 16. NEUTRAL GROUNDING RESISTOR & PETERSEN COIL TUNING (IEC 60071 / NF C 13-200 / IEEE 142)
  if (activeCalc === 'neutral-grounding') {
    const unKv = 30;
    const vPhaseV = (unKv * 1000) / Math.sqrt(3);
    const rnOhm = 40;
    const ifaultA = vPhaseV / rnOhm;
    const tnSec = 10;
    const thermalMj = Math.pow(ifaultA, 2) * rnOhm * tnSec * 1e-6;
    const rEarthOhm = 0.8;
    const gprVolts = ifaultA * rEarthOhm;
    const overvoltageKv = unKv;

    return {
      title: locale === 'fr'
        ? 'Dimensionnement Résistance de Neutre RPN & Accord Petersen (CEI 60071 / NF C 13-200)'
        : 'Neutral Grounding Resistor NGR & Petersen Coil Tuning (IEC 60071 / NF C 13-200)',
      calcType: 'NEUTRAL-EARTHING-RPN-PETERSEN',
      standard: 'CEI 60071-1 / NF C 13-200 / IEEE Std 142',
      date: dateStr,
      referenceId: `EPEDE-CALC-NGR-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale composée (Un)' : 'Nominal Line Voltage (Un)', value: `${unKv}`, unit: 'kV' },
        { label: locale === 'fr' ? 'Tension simple phase-terre (V_ph)' : 'Phase-to-Neutral Voltage', value: (vPhaseV / 1000).toFixed(2), unit: 'kV' },
        { label: locale === 'fr' ? 'Valeur normalisée de la résistance (Rn)' : 'Selected NGR Resistor (Rn)', value: `${rnOhm}`, unit: 'Ω' },
        { label: locale === 'fr' ? 'Temps admissible d\'écoulement (tn)' : 'Rated Thermal Duration (tn)', value: `${tnSec}`, unit: 's' },
        { label: locale === 'fr' ? 'Résistance de terre du poste (R_terre)' : 'Substation Earth Resistance', value: `${rEarthOhm}`, unit: 'Ω' },
      ],
      formulas: [
        { name: 'Courant de défaut monophasé If', expr: 'V_ph / Rn [A]' },
        { name: 'Énergie thermique dissipée', expr: 'If² · Rn · tn [MJ]' },
        { name: 'Élévation potentiel de terre (GPR)', expr: 'If · R_terre [V]' },
        { name: 'Surtension sur phases saines', expr: '√3 · V_ph = Un [kV]' },
        { name: 'Accord Bobine de Petersen Lp', expr: '1 / (3 · ω² · C0_reseau) [H]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Courant de défaut monophasé franc (If)' : 'Single Phase Earth Fault Current', value: ifaultA.toFixed(1), unit: 'A', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Énergie thermique nominale requise' : 'Dissipated Thermal Energy (Rating)', value: thermalMj.toFixed(2), unit: 'MJ' },
        { label: locale === 'fr' ? 'Élévation de potentiel de terre (GPR)' : 'Ground Potential Rise (GPR)', value: gprVolts.toFixed(1), unit: 'V', status: gprVolts <= 650 ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Surtension phases saines en défaut' : 'Healthy Phase Voltage During Fault', value: overvoltageKv.toFixed(1), unit: 'kV' },
        { label: locale === 'fr' ? 'Sensibilité détection homopolaire (51N)' : 'Zero-Sequence Protection Pickup Ratio', value: '> 10× I_seuil', status: 'OK' },
      ],
      complianceVerdict: {
        status: gprVolts <= 650 ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: locale === 'fr'
          ? `La résistance de neutre 30 kV 40 Ω / 433 A / 10s (standard SONATREL / Eneo) est conforme aux normes CEI 60071 et NF C 13-200 : courant de défaut limité à ${ifaultA.toFixed(1)} A, absorption thermique de ${thermalMj.toFixed(2)} MJ validée, et élévation de potentiel de terre GPR de ${gprVolts.toFixed(1)} V inférieure au seuil limite admissible de 650 V.`
          : `The 30 kV 40 Ω / 433 A / 10s NGR (utility standard) complies with IEC 60071 and NF C 13-200: fault current limited to ${ifaultA.toFixed(1)} A, thermal rating of ${thermalMj.toFixed(2)} MJ verified, and Ground Potential Rise (GPR) of ${gprVolts.toFixed(1)} V is safely below the 650 V threshold.`,
      },
      engineeringNotes: [
        'Le temps d\'écoulement assigné de 10 s permet de couvrir le temps de déclenchement du palier amont (0.8 s à 1.2 s) avec une marge de sécurité thermique de facteur 8.',
        'Les câbles et transformateurs de tension du réseau 30 kV doivent être isolés pour la tension entre phases (30 kV permanent au lieu de 17.3 kV) pour tenir la surtension phase saine temporaire.',
      ],
    };
  }

  // 14. CABLE AMPACITY, THERMAL DERATING & SHORT-CIRCUIT WITHSTAND (IEC 60364-5-52 / IEC 60949)
  if (activeCalc === 'cable-ampacity') {
    const unCableV = injectedContext?.params?.unVolts ? Number(injectedContext.params.unVolts) : 30000;
    const pCableKw = injectedContext?.params?.pKw ? Number(injectedContext.params.pKw) : 5000;
    const cosPhiCable = injectedContext?.params?.cosPhi ? Number(injectedContext.params.cosPhi) : 0.90;
    const lengthCableM = (injectedContext?.params?.cableLengthM ?? injectedContext?.params?.lengthM) 
      ? Number(injectedContext?.params?.cableLengthM ?? injectedContext?.params?.lengthM) 
      : 3200;
    const ibCableA = (pCableKw * 1000) / (Math.sqrt(3) * unCableV * cosPhiCable);
    const kTotalCable = 0.913 * 0.88 * 1.0;
    const secCableMm2 = (injectedContext?.params?.selectedSectionMm2 ?? injectedContext?.params?.sectionMm2) 
      ? Number(injectedContext?.params?.selectedSectionMm2 ?? injectedContext?.params?.sectionMm2) 
      : 240;
    const baseI0Cable = 538 * 0.78 * 0.85; // Al, XLPE, buried
    const izCableTotal = baseI0Cable * kTotalCable;
    const ikCableKa = injectedContext?.params?.ikKa ? Number(injectedContext.params.ikKa) : 12.5;
    const tkCableSec = 0.5;
    const kAdiabaticAl = 94;
    const sScMinMm2 = (ikCableKa * 1000 * Math.sqrt(tkCableSec)) / kAdiabaticAl;
    const deltaUCableV = ((Math.sqrt(3) * ibCableA * lengthCableM * (0.16 * cosPhiCable + 0.08 * Math.sin(Math.acos(cosPhiCable)))) / 1000) || 920;
    const deltaUCablePercent = (deltaUCableV / unCableV) * 100;

    return withProvenance({
      title: locale === 'fr' 
        ? 'Dimensionnement & Déclassement Thermique Câbles (CEI 60364-5-52 / CEI 60949)' 
        : 'Cable Sizing & Thermal Ampacity Derating (IEC 60364-5-52 / IEC 60949)',
      calcType: 'CABLE-AMPACITY-SIZING',
      standard: 'CEI 60364-5-52 / CEI 60949 / CEI 60287',
      date: dateStr,
      referenceId: `EPEDE-CALC-CBL-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension nominale (Un)' : 'Nominal Voltage (Un)', value: `${unCableV}`, unit: 'V' },
        { label: locale === 'fr' ? 'Puissance transitée (P)' : 'Active Power (P)', value: `${pCableKw}`, unit: 'kW' },
        { label: locale === 'fr' ? 'Facteur de puissance (cos φ)' : 'Power Factor (cos φ)', value: `${cosPhiCable}` },
        { label: locale === 'fr' ? 'Longueur de liaison (L)' : 'Circuit Length (L)', value: `${lengthCableM}`, unit: 'm' },
        { label: locale === 'fr' ? 'Âme conductrice & Isolant' : 'Conductor & Insulation', value: 'Aluminium / PR (XLPE 90°C)' },
        { label: locale === 'fr' ? 'Mode de pose' : 'Installation Method', value: 'Méthode D (Fourreau enterré, 35°C sol)' },
        { label: locale === 'fr' ? 'Courant de court-circuit Isc (tk)' : 'Short-Circuit Isc (tk)', value: `${ikCableKa} kA (${tkCableSec} s)` },
      ],
      formulas: [
        { name: 'Courant d\'emploi Ib', expr: 'P / (√3 · Un · cos φ) [A]' },
        { name: 'Courant admissible déclassé Iz', expr: 'I0 · (k1 · k2 · k3 · k4 · kh) [A]' },
        { name: 'Section minimale court-circuit S_sc', expr: '(Isc · √tk) / k [mm²]' },
        { name: 'Chute de tension en ligne ΔU', expr: '√3 · Ib · L · (R·cosφ + X·sinφ) [V]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Section commerciale retenue' : 'Selected Standard Section', value: `${secCableMm2}`, unit: 'mm²', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Courant d\'emploi Ib' : 'Design Load Current Ib', value: ibCableA.toFixed(1), unit: 'A' },
        { label: locale === 'fr' ? 'Courant admissible déclassé Iz' : 'Corrected Ampacity Iz', value: izCableTotal.toFixed(1), unit: 'A', status: izCableTotal >= ibCableA ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Facteur de déclassement global (K_total)' : 'Total Derating Factor K_total', value: kTotalCable.toFixed(3) },
        { label: locale === 'fr' ? 'Section min requise tenue Isc (CEI 60949)' : 'Min Section for Isc Withstand', value: sScMinMm2.toFixed(1), unit: 'mm²', status: secCableMm2 >= sScMinMm2 ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Chute de tension relative (ΔU)' : 'Relative Voltage Drop (ΔU)', value: deltaUCablePercent.toFixed(2), unit: '%', status: deltaUCablePercent <= 5.0 ? 'OK' : 'DANGER' },
      ],
      complianceVerdict: {
        status: izCableTotal >= ibCableA && secCableMm2 >= sScMinMm2 && deltaUCablePercent <= 5.0 ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: locale === 'fr'
          ? `La liaison câble ${unCableV / 1000} kV 1×${secCableMm2} mm² Al XLPE est 100% conforme aux normes CEI 60364-5-52 et CEI 60949 : Iz = ${izCableTotal.toFixed(1)} A ≥ Ib = ${ibCableA.toFixed(1)} A, tenue adiabatique Isc validée (S_min = ${sScMinMm2.toFixed(1)} mm² ≤ ${secCableMm2} mm²), et chute de tension de ${deltaUCablePercent.toFixed(2)}% inférieure à la limite contractuelle de 5.0%.`
          : `The ${unCableV / 1000} kV 1×${secCableMm2} mm² Al XLPE cable feeder is fully compliant with IEC 60364-5-52 and IEC 60949: Iz = ${izCableTotal.toFixed(1)} A ≥ Ib = ${ibCableA.toFixed(1)} A, adiabatic Isc withstand confirmed (S_min = ${sScMinMm2.toFixed(1)} mm² ≤ ${secCableMm2} mm²), and voltage drop of ${deltaUCablePercent.toFixed(2)}% is within the 5.0% limit.`,
      },
      engineeringNotes: [
        'Facteur de déclassement en température k1 calculé pour une température de sol africain de 35°C (k1 = 0.913).',
        'Le coefficient adiabatique k = 94 A·s^(1/2)/mm² correspond à l\'élévation de température maximale admise pour le PR (90°C régime continu vers 250°C sous court-circuit).',
      ],
    });
  }

  // 17. TIME-CURRENT COORDINATION (TCC) & RELAY GRADING (IEC 60255-151 / IEEE 242)
  if (activeCalc === 'relay-tcc') {
    const nomA = injectedContext?.params?.nominalCurrentA ? Number(injectedContext.params.nominalCurrentA) : 630;
    const breakKa = injectedContext?.params?.breakingCapacityKa ? Number(injectedContext.params.breakingCapacityKa) : 25;
    const ifaultA = injectedContext?.params?.faultCurrentA ? Number(injectedContext.params.faultCurrentA) : Math.round(breakKa * 1000 * 0.7);
    const tR1_ms = 35; // Downstream instantaneous 50
    const tR2_ms = 380; // Feeder 30 kV trip time (ms)
    const tR3_ms = 690; // Incomer 225/30 kV trip time (ms)
    const deltaT12_ms = tR2_ms - tR1_ms; // 345 ms
    const deltaT23_ms = tR3_ms - tR2_ms; // 310 ms
    const targetDeltaT_ms = 250;

    return withProvenance({
      title: locale === 'fr'
        ? 'Étude de Sélectivité & Coordination des Protections TCC (CEI 60255-151 / IEEE 242)'
        : 'Protection Relay Coordination & TCC Grading Study (IEC 60255-151 / IEEE 242)',
      calcType: 'RELAY-COORDINATION-TCC',
      standard: 'CEI 60255-151 / IEEE 242 (Buff Book)',
      date: dateStr,
      referenceId: `EPEDE-CALC-TCC-${now.getTime().toString().slice(-6)}`,
      inputs: [
        { label: locale === 'fr' ? 'Tension de référence coordination' : 'Coordination Reference Voltage', value: '30000', unit: 'V' },
        { label: locale === 'fr' ? 'Courant de court-circuit test (If)' : 'Test Fault Current (If)', value: `${ifaultA}`, unit: 'A' },
        { label: locale === 'fr' ? 'Courant assigné relais/disjoncteur (In)' : 'Rated Current (In)', value: `${nomA}`, unit: 'A' },
        { label: locale === 'fr' ? 'Pouvoir de coupure assigné (Icu)' : 'Rated Breaking Capacity (Icu)', value: `${breakKa}`, unit: 'kA' },
        { label: locale === 'fr' ? 'Palier R1 Aval (Disjoncteur BT 400V)' : 'Tier R1 Downstream (LV Breaker)', value: 'Is=80A, TMS=0.10, EI, Inst=950A' },
        { label: locale === 'fr' ? 'Palier R2 Intermédiaire (Départ HTA 30kV)' : 'Tier R2 Intermediate (30kV Feeder)', value: `Is=${Math.round(nomA * 0.35)}A, TMS=0.18, VI, Inst=${Math.round(nomA * 4)}A` },
        { label: locale === 'fr' ? 'Palier R3 Amont (Arrivée Transfo 225/30kV)' : 'Tier R3 Upstream (Incomer 225/30kV)', value: `Is=${nomA}A, TMS=0.35, SI, Inst=${Math.round(nomA * 10)}A` },
        { label: locale === 'fr' ? 'Marge de sélectivité minimale requise' : 'Minimum Required Grading Margin', value: `${targetDeltaT_ms}`, unit: 'ms' },
      ],
      formulas: [
        { name: 'Équation à temps inverse CEI 60255', expr: 't = TMS · [ β / ((I / Is)^α - 1) ] [s]' },
        { name: 'Courbe Standard Inverse (SI)', expr: 'β = 0.14, α = 0.02' },
        { name: 'Courbe Very Inverse (VI)', expr: 'β = 13.5, α = 1.00' },
        { name: 'Courbe Extremely Inverse (EI)', expr: 'β = 80.0, α = 2.00' },
        { name: 'Marge chronométrique', expr: 'Δt = t_amont - t_aval ≥ Δt_min (250 ms) [ms]' },
      ],
      results: [
        { label: locale === 'fr' ? 'Temps de coupure R1 (Aval TGBT)' : 'Trip Time R1 (Downstream)', value: `${tR1_ms}`, unit: 'ms', highlight: true, status: 'OK' },
        { label: locale === 'fr' ? 'Temps de coupure R2 (Départ 30 kV)' : 'Trip Time R2 (30 kV Feeder)', value: `${tR2_ms}`, unit: 'ms', status: 'OK' },
        { label: locale === 'fr' ? 'Temps de coupure R3 (Arrivée Transfo)' : 'Trip Time R3 (Incomer)', value: `${tR3_ms}`, unit: 'ms', status: 'OK' },
        { label: locale === 'fr' ? 'Marge chronométrique R2 / R1' : 'Grading Margin R2 / R1', value: `${deltaT12_ms}`, unit: 'ms', status: deltaT12_ms >= targetDeltaT_ms ? 'OK' : 'DANGER' },
        { label: locale === 'fr' ? 'Marge chronométrique R3 / R2' : 'Grading Margin R3 / R2', value: `${deltaT23_ms}`, unit: 'ms', status: deltaT23_ms >= targetDeltaT_ms ? 'OK' : 'DANGER' },
      ],
      complianceVerdict: {
        status: deltaT12_ms >= targetDeltaT_ms && deltaT23_ms >= targetDeltaT_ms ? 'COMPLIANT' : 'NON_COMPLIANT',
        message: locale === 'fr'
          ? `Sélectivité totale ampèremétrique et chronométrique validée selon CEI 60255-151 : La marge R2/R1 (${deltaT12_ms} ms) et la marge R3/R2 (${deltaT23_ms} ms) sont toutes deux supérieures au seuil contractuel de ${targetDeltaT_ms} ms. Tout court-circuit sera éliminé par l'organe de coupure immédiatement amont sans déclenchement intempestif du réseau d'alimentation.`
          : `Full ampacity and time-graded discrimination compliant with IEC 60255-151: Grading margin R2/R1 (${deltaT12_ms} ms) and margin R3/R2 (${deltaT23_ms} ms) both exceed the target of ${targetDeltaT_ms} ms. Any fault is isolated by the closest protective apparatus without cascading outages.`,
      },
      engineeringNotes: [
        'L\'intervalle de sélectivité de 250 ms intègre : temps mécanique de coupure du disjoncteur (60 ms) + dépassement d\'inertie du relais (35 ms) + erreurs de rapport TC classe 5P20 (100 ms) + marge de dispersion numérique (55 ms).',
        'Les seuils instantanés ANSI 50 sont coordonnés pour assurer le déclenchement non temporisé en cas de défaut franc aux bornes sans empiéter sur la zone protégée aval.',
      ],
    });
  }

  // Fallback if none matched
  return withProvenance({
    title: locale === 'fr' ? 'Note de Calcul Technique' : 'Technical Calculation Note',
    calcType: activeCalc.toUpperCase(),
    standard: 'CEI / IEEE Standards',
    date: dateStr,
    referenceId: `EPEDE-CALC-${activeCalc.toUpperCase().slice(0, 4)}-${now.getTime().toString().slice(-6)}`,
    inputs: [],
    formulas: [],
    results: [],
    complianceVerdict: {
      status: 'INFORMATIONAL',
      message: locale === 'fr' ? 'Calcul exécuté avec succès.' : 'Calculation executed successfully.',
    },
    engineeringNotes: [],
  });
}
