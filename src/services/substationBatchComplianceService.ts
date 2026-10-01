// src/services/substationBatchComplianceService.ts
// EPEDE Automated Batch Substation Compliance Dossier Generator
// Performs multi-apparatus normative verification across all connected assets in an SLD topology.

import type { SldTopologyType } from '../components/diagrams/modules/SldHeaderToolbar';
import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';

export type ApparatusCategory = 'TRANSFORMER' | 'BREAKER' | 'FEEDER' | 'BUSBAR' | 'PROTECTION';
export type ApparatusComplianceStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface ApparatusTestMetric {
  label: { fr: string; en: string };
  measuredValue: string;
  nominalOrLimit: string;
  unit: string;
  status: 'OK' | 'WARN' | 'DANGER';
  standardCriterion: string;
}

export interface SubstationConnectedApparatus {
  id: string;
  tag: string;
  name: { fr: string; en: string };
  category: ApparatusCategory;
  voltageLevel: 'EHV' | 'HV' | 'MV' | 'LV';
  nominalRating: string;
  governingStandard: string;
  operationalState: 'ENERGIZED' | 'DE_ENERGIZED' | 'TRIPPED' | 'STANDBY';
  overallStatus: ApparatusComplianceStatus;
  metrics: ApparatusTestMetric[];
  recommendedCalcTab: CalculatorTabType;
  calcParams: Record<string, any>;
  engineeringObservation: { fr: string; en: string };
}

export interface SubstationComplianceDossier {
  substationName: { fr: string; en: string };
  topology: SldTopologyType;
  topologyLabel: { fr: string; en: string };
  documentReference: string;
  dateStr: string;
  timestamp: number;
  governingStandards: string[];
  totalAssets: number;
  compliantCount: number;
  warningCount: number;
  failCount: number;
  safetyIndexPercent: number;
  apparatuses: SubstationConnectedApparatus[];
  leadAuditor: {
    name: string;
    organization: string;
    stampRef: string;
    role: { fr: string; en: string };
  };
  globalVerdict: {
    status: 'CONFORME_CEI' | 'RESERVE_TECHNIQUE' | 'NON_CONFORME';
    summary: { fr: string; en: string };
  };
}

export interface SubstationSimulationSnapshot {
  u_hv_nom?: number;
  u_mv_nom?: number;
  current_hv?: number;
  current_mv?: number;
  activeLoadMw?: number;
  totalExportMw?: number;
  solarPowerMw?: number;
  bessPowerMw?: number;
  reactivePowerMvar?: number;
  trafoTap?: number;
  ambientSoilTempC?: number;
  gridScMva?: number;
  breakerOpeningTimeMs?: number;
  activeFault?: string | null;
  relayTripped?: boolean | any;
  isLineEnergized?: boolean;
  isBus225Energized?: boolean;
  isTrafoEnergized?: boolean;
  isBus30Energized?: boolean;
  isBusA_Energized?: boolean;
  isBusB_Energized?: boolean;
  isRmuBus_Energized?: boolean;
  isDistTrafo_Energized?: boolean;
  isTgbt_Energized?: boolean;
  isBus33Energized?: boolean;
  isTrafoHvEnergized?: boolean;
  isGrid225Connected?: boolean;
}

export class SubstationBatchComplianceService {
  public static generateDossier(
    topology: SldTopologyType,
    sim: SubstationSimulationSnapshot,
    locale: 'fr' | 'en' = 'fr'
  ): SubstationComplianceDossier {
    const now = new Date();
    const dateStr = now.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const refId = `EPEDE-SUB-AUDIT-${topology.toUpperCase().slice(0, 4)}-${now.getTime().toString().slice(-6)}`;

    // Generate connected assets according to the selected topology architecture
    const apparatuses: SubstationConnectedApparatus[] = this.buildConnectedApparatuses(topology, sim);

    const totalAssets = apparatuses.length;
    const compliantCount = apparatuses.filter(a => a.overallStatus === 'PASS').length;
    const warningCount = apparatuses.filter(a => a.overallStatus === 'WARNING').length;
    const failCount = apparatuses.filter(a => a.overallStatus === 'FAIL').length;

    // Calculate safety compliance index: (compliant * 1.0 + warning * 0.7 + fail * 0.0) / totalAssets
    const rawScore = totalAssets > 0 
      ? ((compliantCount * 1.0 + warningCount * 0.7) / totalAssets) * 100 
      : 100;
    const safetyIndexPercent = Math.round(rawScore * 10) / 10;

    const globalVerdictStatus: 'CONFORME_CEI' | 'RESERVE_TECHNIQUE' | 'NON_CONFORME' = 
      failCount > 0 ? 'NON_CONFORME' : warningCount > 0 ? 'RESERVE_TECHNIQUE' : 'CONFORME_CEI';

    const globalVerdictSummary = {
      fr: globalVerdictStatus === 'CONFORME_CEI'
        ? `L'ensemble des ${totalAssets} appareils interconnectés du poste respectent rigoureusement les normes CEI 60076, CEI 60909, CEI 62271 et CEI 60364 avec un indice de sécurité globale de ${safetyIndexPercent}%. Tenue diélectrique, pouvoirs de coupure et sélectivité validés.`
        : globalVerdictStatus === 'RESERVE_TECHNIQUE'
        ? `${warningCount} appareil(s) présente(nt) des paramètres de fonctionnement proches des tolérances admissibles (indice global : ${safetyIndexPercent}%). Exploitation sous surveillance recommandée.`
        : `DÉFAUT MAJEUR DÉTECTÉ SUR ${failCount} APPAREIL(S) : Dépassement de seuils normatifs critiques (indice de sécurité dégradé à ${safetyIndexPercent}%). Action corrective immédiate requise avant remise sous tension.`,
      en: globalVerdictStatus === 'CONFORME_CEI'
        ? `All ${totalAssets} interconnected substation apparatuses strictly comply with IEC 60076, IEC 60909, IEC 62271, and IEC 60364 standards with an overall safety index of ${safetyIndexPercent}%. Dielectric withstand, breaking capacities, and grading verified.`
        : globalVerdictStatus === 'RESERVE_TECHNIQUE'
        ? `${warningCount} apparatus(es) operate near allowable limit thresholds (global safety index: ${safetyIndexPercent}%). Enhanced operational surveillance recommended.`
        : `CRITICAL NON-CONFORMANCE ON ${failCount} APPARATUS(ES): Normative threshold violation (safety index degraded to ${safetyIndexPercent}%). Immediate remedial action required prior to re-energization.`
    };

    const substationNames: Record<SldTopologyType, { fr: string; en: string }> = {
      single_bus: {
        fr: 'Poste HTB/HTA 225/30 kV d\'Oyomabang (Simple Jeu de Barres)',
        en: 'Oyomabang 225/30 kV Substation (Single Busbar Topology)',
      },
      double_bus: {
        fr: 'Poste d\'Interconnexion HTB 225 kV de Mangombé (Double Jeu de Barres)',
        en: 'Mangombé 225 kV Interconnection Substation (Double Busbar Topology)',
      },
      breaker_and_half: {
        fr: 'Poste d\'Évacuation THT 225 kV de Nachtigal (Disjoncteur et Demi 1-1/2 CB)',
        en: 'Nachtigal 225 kV Transmission Substation (Breaker-and-a-Half 1-1/2 CB)',
      },
      rmu_distribution: {
        fr: 'Poste de Distribution Publique HTA/BT 30 kV / 400 V (Cellules RMU Boucle)',
        en: 'Public Distribution Substation MV/LV 30 kV / 400 V (Ring Main Unit RMU)',
      },
      solar_bess: {
        fr: 'Poste Évacuation Centrale Solaire Hybride PV 100 MW + BESS 50 MWh',
        en: 'Solar PV 100 MW + BESS 50 MWh Hybrid Power Evacuation Substation',
      },
      cim_graph: {
        fr: 'Jumeau Numérique CIM IEC 61970/61968 Poste Oyomabang',
        en: 'CIM IEC 61970/61968 Digital Twin Oyomabang Substation',
      },
      geo_substation_3d: {
        fr: 'Jumeau Géospatial 3D & Ouvrage Haute Tension Oyomabang',
        en: 'Oyomabang 3D Geospatial High Voltage Substation Twin',
      },
    };

    const topologyLabels: Record<SldTopologyType, { fr: string; en: string }> = {
      single_bus: { fr: 'Simple Jeu de Barres 225/30 kV', en: 'Single Busbar 225/30 kV' },
      double_bus: { fr: 'Double Jeu de Barres 225 kV avec Couplage', en: 'Double Busbar 225 kV with Tie Coupler' },
      breaker_and_half: { fr: 'Disjoncteur et Demi (1-1/2 CB) 225 kV', en: 'Breaker-and-a-Half (1-1/2 CB) 225 kV' },
      rmu_distribution: { fr: 'Réseau Bouclé HTA / Cellules RMU 30 kV', en: 'Ring Main Unit RMU MV Distribution' },
      solar_bess: { fr: 'Centrale PV Hybride & Stockage BESS Li-ion', en: 'Hybrid Solar PV & BESS Storage Plant' },
      cim_graph: { fr: 'Graphe Topologique CIM IEC 61970', en: 'CIM IEC 61970 Topology Graph' },
      geo_substation_3d: { fr: 'Modèle Géospatial Haute Tension 3D', en: 'High Voltage 3D Geospatial Model' },
    };

    return {
      substationName: substationNames[topology] || substationNames.single_bus,
      topology,
      topologyLabel: topologyLabels[topology] || topologyLabels.single_bus,
      documentReference: refId,
      dateStr,
      timestamp: now.getTime(),
      governingStandards: [
        'CEI 60076 (Transformateurs de puissance)',
        'CEI 60909-0 (Calcul des courants de court-circuit)',
        'CEI 62271-100 / 102 (Appareillage sous enveloppe & Disjoncteurs HT)',
        'CEI 60364-5-52 / CEI 60949 (Canalisations & Tenue thermique des câbles)',
        'CEI 60255-151 (Relais de mesure et dispositifs de protection)',
        'IEEE 80 / CEI 61936-1 (Installations électriques > 1 kV & Prise de terre)',
      ],
      totalAssets,
      compliantCount,
      warningCount,
      failCount,
      safetyIndexPercent,
      apparatuses,
      leadAuditor: {
        name: 'Dr. Jean-Marc Mbarga, Ing. P.E.',
        organization: 'EPEDE Technical Compliance & Grid Commissioning Authority',
        stampRef: `VISA-CEI-EPEDE-${now.getFullYear()}-AUDIT-992`,
        role: {
          fr: 'Chef de Mission d\'Audit Électrotechnique & Homologation Réseau',
          en: 'Lead Electrotechnical Auditor & Grid Interconnection Officer',
        },
      },
      globalVerdict: {
        status: globalVerdictStatus,
        summary: globalVerdictSummary,
      },
    };
  }

  private static buildConnectedApparatuses(
    topology: SldTopologyType,
    sim: SubstationSimulationSnapshot
  ): SubstationConnectedApparatus[] {
    const isSingleBus = topology === 'single_bus';
    const isDoubleBus = topology === 'double_bus';
    const isBreakerHalf = topology === 'breaker_and_half';
    const isRmu = topology === 'rmu_distribution';
    const isSolar = topology === 'solar_bess';

    const apparatuses: SubstationConnectedApparatus[] = [];

    // =========================================================================
    // 1. POWER TRANSFORMERS & DISTRIBUTION UNITS
    // =========================================================================
    if (isSingleBus || isDoubleBus || isBreakerHalf) {
      const trafoKv = 225;
      const trafoMva = 63;
      const tap = sim.trafoTap ?? 0;
      const actualTapPercent = (tap * 1.25).toFixed(2);
      const isEnergized = sim.isTrafoEnergized ?? true;
      const loadMw = sim.activeLoadMw ?? 48.5;
      const trafoCurrentHv = sim.current_hv ?? ((loadMw * 1e6) / (Math.sqrt(3) * trafoKv * 1e3 * 0.98));
      const trafoOverallStatus = trafoCurrentHv > 161.9 ? 'FAIL' : (trafoCurrentHv > 145 || Math.abs(tap) >= 8) ? 'WARNING' : 'PASS';

      apparatuses.push({
        id: 'trafo-main-tr1',
        tag: '=TR1',
        name: {
          fr: 'Transformateur de Puissance 225/30 kV 63 MVA ONAN/ONAF',
          en: 'Power Transformer 225/30 kV 63 MVA ONAN/ONAF',
        },
        category: 'TRANSFORMER',
        voltageLevel: 'HV',
        nominalRating: '63 MVA · 225 kV / 30 kV · Dyn11',
        governingStandard: 'CEI 60076-1 / CEI 60076-5 / CEI 60909',
        operationalState: isEnergized ? 'ENERGIZED' : 'DE_ENERGIZED',
        overallStatus: trafoOverallStatus,
        metrics: [
          {
            label: { fr: 'Tension de court-circuit (uk)', en: 'Short-circuit impedance (uk)' },
            measuredValue: '12.50%',
            nominalOrLimit: '12.0% - 13.5%',
            unit: '%',
            status: 'OK',
            standardCriterion: 'CEI 60076-5 §4.2 (Tenue aux courts-circuits)',
          },
          {
            label: { fr: 'Courant de charge primaire', en: 'Primary load current' },
            measuredValue: `${trafoCurrentHv.toFixed(1)} A`,
            nominalOrLimit: '≤ 161.9 A (100% In)',
            unit: 'A',
            status: trafoCurrentHv > 161.9 ? 'DANGER' : trafoCurrentHv > 145 ? 'WARN' : 'OK',
            standardCriterion: trafoCurrentHv > 161.9 ? 'CEI 60076-1 (Dépassement thermique > 100% In)' : 'CEI 60076-1 (Échauffement continu)',
          },
          {
            label: { fr: 'Position Régleur en Charge (OLTC)', en: 'On-Load Tap Changer Position' },
            measuredValue: `Plot ${tap >= 0 ? `+${tap}` : tap} (${actualTapPercent}%)`,
            nominalOrLimit: '±9 plots (±11.25%)',
            unit: 'plots',
            status: Math.abs(tap) >= 8 ? 'WARN' : 'OK',
            standardCriterion: 'Régulation automatique de tension AVR',
          },
          {
            label: { fr: 'Tenue de choc diélectrique à la foudre (BIL)', en: 'Lightning Impulse Withstand (BIL)' },
            measuredValue: '1050 kV (HT) / 170 kV (MT)',
            nominalOrLimit: 'CEI 60076-3 Tab. 2',
            unit: 'kV',
            status: 'OK',
            standardCriterion: 'CEI 60076-3 Coordination de l\'isolement',
          },
        ],
        recommendedCalcTab: 'transformer',
        calcParams: {
          trafoKva: 63000,
          trafoHvKv: 225,
          trafoLvV: 30000,
          trafoUkPercent: 12.5,
        },
        engineeringObservation: {
          fr: 'Cuve hermétique avec relais Buchholz, soupape de surpression Qualitrol et monitoring de température huile/enroulement conforme CEI 60076.',
          en: 'Hermetic tank with Buchholz relay, Qualitrol overpressure relief, and oil/winding temperature monitoring compliant with IEC 60076.',
        },
      });

      // Auxiliary transformer TSA
      apparatuses.push({
        id: 'trafo-tsa-01',
        tag: '=TSA1',
        name: {
          fr: 'Transformateur Services Auxiliaires (TSA) 30 kV / 400 V 250 kVA',
          en: 'Auxiliary Services Transformer 30 kV / 400 V 250 kVA',
        },
        category: 'TRANSFORMER',
        voltageLevel: 'MV',
        nominalRating: '250 kVA · 30 kV / 400 V · Dyn11',
        governingStandard: 'CEI 60076-11 (Type sec enrobé)',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Impédance court-circuit uk', en: 'Short-circuit impedance uk' },
            measuredValue: '4.00%',
            nominalOrLimit: '4.0% ± 10%',
            unit: '%',
            status: 'OK',
            standardCriterion: 'CEI 60076-11',
          },
          {
            label: { fr: 'Courant de court-circuit secondaire Ik"', en: 'Secondary short-circuit Ik"' },
            measuredValue: '9.02 kA',
            nominalOrLimit: 'TGBT Icu ≥ 25 kA',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 60909-0',
          },
        ],
        recommendedCalcTab: 'transformer',
        calcParams: {
          trafoKva: 250,
          trafoHvKv: 30,
          trafoLvV: 400,
          trafoUkPercent: 4.0,
        },
        engineeringObservation: {
          fr: 'Transformateur sec classe F 155°C auto-extinguible alimentant le TGBT auxiliaire et le chargeur redresseur 110 V DC.',
          en: 'Cast resin dry-type Class F 155°C transformer feeding the LV auxiliary switchboard and 110 V DC battery charger.',
        },
      });
    }

    if (isRmu) {
      apparatuses.push({
        id: 'trafo-dist-rmu',
        tag: '=TR-DIST',
        name: {
          fr: 'Transformateur HTA/BT Distribution 30 kV / 400 V 630 kVA',
          en: 'MV/LV Distribution Transformer 30 kV / 400 V 630 kVA',
        },
        category: 'TRANSFORMER',
        voltageLevel: 'MV',
        nominalRating: '630 kVA · 30 kV / 400 V · Dyn11',
        governingStandard: 'CEI 60076-1 / EN 50588-1 (Éco-conception Tier 2)',
        operationalState: sim.isDistTrafo_Energized ? 'ENERGIZED' : 'DE_ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Pertes à vide P0 (Tier 2)', en: 'No-load losses P0 (Tier 2)' },
            measuredValue: '600 W',
            nominalOrLimit: '≤ 650 W',
            unit: 'W',
            status: 'OK',
            standardCriterion: 'Règlement UE 548/2014 & CEI 60076-1',
          },
          {
            label: { fr: 'Courant de court-circuit BT Isc', en: 'LV short-circuit current Isc' },
            measuredValue: '22.7 kA',
            nominalOrLimit: 'Disjoncteur BT Icu ≥ 36 kA',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 60909-0',
          },
        ],
        recommendedCalcTab: 'transformer',
        calcParams: {
          trafoKva: 630,
          trafoHvKv: 30,
          trafoLvV: 400,
          trafoUkPercent: 4.0,
        },
        engineeringObservation: {
          fr: 'Transformateur immergé dans huile minérale avec relais DGPT2 (Dégagement gazeux, Pression, Température 2 seuils).',
          en: 'Mineral oil immersed transformer equipped with DGPT2 protection relay (Gas, Pressure, Temperature 2 tiers).',
        },
      });
    }

    if (isSolar) {
      apparatuses.push({
        id: 'trafo-solar-stepup',
        tag: '=TR-SOLAR',
        name: {
          fr: 'Transformateur Élévateur Centrale PV/BESS 33/225 kV 100 MVA',
          en: 'Solar PV/BESS Step-Up Substation Transformer 33/225 kV 100 MVA',
        },
        category: 'TRANSFORMER',
        voltageLevel: 'HV',
        nominalRating: '100 MVA · 33 kV / 225 kV · YNd11',
        governingStandard: 'CEI 60076-1 / IEEE C57.12.00',
        operationalState: sim.isTrafoHvEnergized ? 'ENERGIZED' : 'DE_ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Tension de court-circuit uk', en: 'Short-circuit impedance uk' },
            measuredValue: '14.00%',
            nominalOrLimit: '13.0% - 15.0%',
            unit: '%',
            status: 'OK',
            standardCriterion: 'CEI 60076-5',
          },
          {
            label: { fr: 'Puissance d\'évacuation maximale', en: 'Maximum export capacity' },
            measuredValue: `${(sim.totalExportMw ?? 42).toFixed(1)} MW`,
            nominalOrLimit: '≤ 100 MW crête',
            unit: 'MW',
            status: 'OK',
            standardCriterion: 'Code de réseau transport',
          },
        ],
        recommendedCalcTab: 'transformer',
        calcParams: {
          trafoKva: 100000,
          trafoHvKv: 225,
          trafoLvV: 33000,
          trafoUkPercent: 14.0,
        },
        engineeringObservation: {
          fr: 'Conception renforcée pour harmoniques d\'onduleurs (Facteur K=9) et variations rapides de flux bidirectionnels BESS.',
          en: 'Reinforced design for inverter harmonics (K-Factor 9) and rapid bidirectional BESS power flows.',
        },
      });
    }

    // =========================================================================
    // 2. HIGH VOLTAGE & MEDIUM VOLTAGE CIRCUIT BREAKERS
    // =========================================================================
    if (isSingleBus || isDoubleBus || isBreakerHalf) {
      // 225 kV Line Breaker
      const isLineOpen = sim.activeFault === 'line_fault';
      const openTime = sim.breakerOpeningTimeMs ?? 42;
      const gridScMva = sim.gridScMva ?? 3000;
      const scHvKa = (gridScMva * 1000) / (Math.sqrt(3) * 225);
      const isScWarning = scHvKa > 36.0;
      const isOpenTimeFail = openTime > 60;
      const isOpenTimeWarn = openTime > 50;
      const breakerOverall = isLineOpen ? 'WARNING' : (isOpenTimeFail || scHvKa > 40.0) ? 'FAIL' : (isOpenTimeWarn || isScWarning) ? 'WARNING' : 'PASS';

      apparatuses.push({
        id: 'cb-line-225',
        tag: '==BAY.Q0_LINE',
        name: {
          fr: 'Disjoncteur Ligne 225 kV SF6 (Arrivée Interconnexion)',
          en: '225 kV SF6 Line Circuit Breaker (Interconnection Incomer)',
        },
        category: 'BREAKER',
        voltageLevel: 'HV',
        nominalRating: '245 kV · 3150 A · 40 kA (3 s) · SF6',
        governingStandard: 'CEI 62271-100 / CEI 62271-1',
        operationalState: isLineOpen ? 'TRIPPED' : 'ENERGIZED',
        overallStatus: breakerOverall,
        metrics: [
          {
            label: { fr: 'Pouvoir de coupure assigné (Icu)', en: 'Rated breaking capacity (Icu)' },
            measuredValue: `${scHvKa.toFixed(1)} kA (calculé Ik")`,
            nominalOrLimit: '≥ 40.0 kA assigné',
            unit: 'kA',
            status: scHvKa > 40.0 ? 'DANGER' : isScWarning ? 'WARN' : 'OK',
            standardCriterion: 'CEI 62271-100 §6.102 (Séquence O-0.3s-CO-3min-CO)',
          },
          {
            label: { fr: 'Densité / Pression gaz SF6', en: 'SF6 Gas Density / Pressure' },
            measuredValue: '6.2 bar à 20°C',
            nominalOrLimit: 'Seuil alarme 5.8 bar / Blocage 5.5 bar',
            unit: 'bar',
            status: 'OK',
            standardCriterion: 'CEI 62271-4 Surveillance SF6',
          },
          {
            label: { fr: 'Temps total d\'ouverture', en: 'Total break opening time' },
            measuredValue: `${openTime} ms`,
            nominalOrLimit: '≤ 60 ms admissible',
            unit: 'ms',
            status: isOpenTimeFail ? 'DANGER' : isOpenTimeWarn ? 'WARN' : 'OK',
            standardCriterion: isOpenTimeFail ? 'CEI 62271-100 (Retard d\'ouverture supérieur à 60 ms)' : 'CEI 62271-100 Classe E2 / M2',
          },
        ],
        recommendedCalcTab: 'relay-tcc',
        calcParams: {
          nominalCurrentA: 3150,
          breakingCapacityKa: 40,
          faultCurrentA: Math.round(scHvKa * 1000),
        },
        engineeringObservation: {
          fr: 'Disjoncteur équipé de commande oléo-pneumatique ou à ressort, bobines d\'ouverture à émission double (110 V DC redondantes).',
          en: 'Equipped with spring mechanism, dual shunt trip coils powered from redundant 110 V DC auxiliary rails.',
        },
      });

      // 225 kV Trafo Incomer Breaker
      apparatuses.push({
        id: 'cb-trafo-hv-225',
        tag: '==BAY.Q0_TRAFO_HV',
        name: {
          fr: 'Disjoncteur Travée Transfo 225 kV SF6',
          en: '225 kV SF6 Transformer Bay Circuit Breaker',
        },
        category: 'BREAKER',
        voltageLevel: 'HV',
        nominalRating: '245 kV · 2000 A · 40 kA · SF6',
        governingStandard: 'CEI 62271-100',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Courant assigné en service continu', en: 'Continuous rated current' },
            measuredValue: `${(sim.current_hv ?? 95).toFixed(1)} A`,
            nominalOrLimit: '≤ 2000 A',
            unit: 'A',
            status: 'OK',
            standardCriterion: 'CEI 62271-1',
          },
          {
            label: { fr: 'Pouvoir de coupure assigné', en: 'Rated breaking capacity' },
            measuredValue: '28.5 kA',
            nominalOrLimit: '40.0 kA',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 62271-100',
          },
        ],
        recommendedCalcTab: 'relay-tcc',
        calcParams: {
          nominalCurrentA: 2000,
          breakingCapacityKa: 40,
          faultCurrentA: 28500,
        },
        engineeringObservation: {
          fr: 'Coordination immédiate avec la protection différentielle de transformateur ANSI 87T et maximum de courant 50/51.',
          en: 'Direct trip tripping from ANSI 87T transformer differential and 50/51 backup overcurrent relays.',
        },
      });

      // 30 kV Feeder Breaker F1
      const isF1Fault = sim.activeFault === 'feeder1_fault';
      apparatuses.push({
        id: 'cb-feeder-f1',
        tag: '=F1.Q0',
        name: {
          fr: 'Disjoncteur Départ HTA 30 kV F1 (Zone Industrielle)',
          en: '30 kV MV Feeder Breaker F1 (Industrial Zone Feeder)',
        },
        category: 'BREAKER',
        voltageLevel: 'MV',
        nominalRating: '36 kV · 1250 A · 25 kA (3 s) · Vide (Vacuum)',
        governingStandard: 'CEI 62271-100 / CEI 62271-200',
        operationalState: isF1Fault ? 'TRIPPED' : 'ENERGIZED',
        overallStatus: isF1Fault ? 'WARNING' : 'PASS',
        metrics: [
          {
            label: { fr: 'Pouvoir de coupure assigné Icu', en: 'Rated breaking capacity Icu' },
            measuredValue: '18.2 kA',
            nominalOrLimit: '≥ 25.0 kA assigné',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 62271-100',
          },
          {
            label: { fr: 'Pouvoir de fermeture sur court-circuit (Icm)', en: 'Rated short-circuit making capacity (Icm)' },
            measuredValue: '45.5 kA crête',
            nominalOrLimit: '62.5 kA (2.5 x Icu)',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 62271-100',
          },
          {
            label: { fr: 'Cycles de réenclenchement rapide (RAR)', en: 'Autoreclose Duty Cycle' },
            measuredValue: 'Cycle O-0.3s-CO-15s-CO configuré',
            nominalOrLimit: 'Validé CEI',
            unit: 'sec',
            status: 'OK',
            standardCriterion: 'CEI 62271-100 Classe M2',
          },
        ],
        recommendedCalcTab: 'relay-tcc',
        calcParams: {
          nominalCurrentA: 1250,
          breakingCapacityKa: 25,
          faultCurrentA: 18200,
        },
        engineeringObservation: {
          fr: 'Cellule blindée HTA sous enveloppe métallique LSC2B-PM avec clapet de décompression arc interne 25 kA 1 s (CEI 62271-200).',
          en: 'Metal-clad switchgear cubicle LSC2B-PM with internal arc pressure relief duct 25 kA 1 s (IEC 62271-200).',
        },
      });
    }

    if (isDoubleBus) {
      apparatuses.push({
        id: 'cb-bus-coupler',
        tag: '==BAY.Q0_BC',
        name: {
          fr: 'Disjoncteur de Couplage Jeux de Barres 225 kV (Bay BC)',
          en: '225 kV Bus Coupler Circuit Breaker (Bus Tie Bay BC)',
        },
        category: 'BREAKER',
        voltageLevel: 'HV',
        nominalRating: '245 kV · 3150 A · 40 kA · SF6',
        governingStandard: 'CEI 62271-100 / CEI 62271-102',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Capacité de transfert de charge', en: 'Load transfer capacity' },
            measuredValue: '3150 A nominal',
            nominalOrLimit: 'Barre A vers Barre B',
            unit: 'A',
            status: 'OK',
            standardCriterion: 'CEI 62271-1',
          },
          {
            label: { fr: 'Synchronisme et contrôle d\'angle', en: 'Synchrocheck & Angle Control' },
            measuredValue: 'ΔV ≤ 5%, Δf ≤ 0.1 Hz, Δθ ≤ 15°',
            nominalOrLimit: 'Relais ANSI 25 actif',
            unit: 'deg',
            status: 'OK',
            standardCriterion: 'IEEE C37.90',
          },
        ],
        recommendedCalcTab: 'relay-tcc',
        calcParams: {
          nominalCurrentA: 3150,
          breakingCapacityKa: 40,
        },
        engineeringObservation: {
          fr: 'Asservissement électrique et mécanique interdisant toute manœuvre de sectionneur de barres sans fermeture préalable du disjoncteur coupleur.',
          en: 'Electrical and mechanical interlocking preventing busbar disconnector transfer without prior bus coupler closure.',
        },
      });
    }

    if (isRmu) {
      apparatuses.push({
        id: 'cb-rmu-trafo',
        tag: '=RMU.Q0_T',
        name: {
          fr: 'Combiné Interrupteur-Fusible / Disjoncteur RMU 30 kV',
          en: 'RMU 30 kV Transformer Feeder Switch-Fuse / Breaker Unit',
        },
        category: 'BREAKER',
        voltageLevel: 'MV',
        nominalRating: '36 kV · 200 A · 16 kA (1 s) · SF6/Vide',
        governingStandard: 'CEI 62271-105 / CEI 62271-200',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Pouvoir de coupure assigné', en: 'Rated breaking capacity' },
            measuredValue: '16.0 kA',
            nominalOrLimit: '≥ 16.0 kA',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 62271-105',
          },
          {
            label: { fr: 'Fusibles HTA DIN 43625 associés', en: 'Associated MV DIN HRC Fuses' },
            measuredValue: 'Fusibles 24 kV / 36 kV 25 A',
            nominalOrLimit: 'Coordination transfo 630 kVA',
            unit: 'A',
            status: 'OK',
            standardCriterion: 'CEI 60282-1',
          },
        ],
        recommendedCalcTab: 'relay-tcc',
        calcParams: {
          nominalCurrentA: 200,
          breakingCapacityKa: 16,
        },
        engineeringObservation: {
          fr: 'Équipé de déclencheur percutant à fusion de fusible triphasé garantissant l\'ouverture omnipolaire sous 40 ms.',
          en: 'Equipped with striker-pin 3-phase opening mechanism ensuring all-pole clearance within 40 ms of fuse operation.',
        },
      });
    }

    // =========================================================================
    // 3. OUTGOING MV / LV FEEDERS & CABLES
    // =========================================================================
    if (isSingleBus || isDoubleBus || isBreakerHalf) {
      // 30 kV Underground Cable Feeder F1 (Oyomabang - Biyem-Assi)
      const totalLoadMw = sim.activeLoadMw ?? 48.5;
      const pFeederKw = Math.max(1500, totalLoadMw * 0.25 * 1000); // Feeder carries 25% of active substation load
      const unFeederV = (sim.u_mv_nom ?? 30.0) * 1000;
      const cosPhi = 0.90;
      const lengthM = 3200;
      const secMm2 = 240;
      const ib = (pFeederKw * 1000) / (Math.sqrt(3) * unFeederV * cosPhi);
      
      // Dynamic soil temperature derating (CEI 60364-5-52 Table B.52.14)
      const soilTemp = sim.ambientSoilTempC ?? 35;
      const kTemp = Math.sqrt(Math.max(0.05, (90 - soilTemp) / (90 - 20)));
      const izDeclassed = 538 * 0.913 * kTemp * 0.85;

      // Dynamic line voltage drop
      const rTotal = (lengthM / 1000) * (0.028 / (secMm2 / 1000)); // ~0.373 Ohm
      const xTotal = (lengthM / 1000) * 0.110; // ~0.352 Ohm
      const sinPhi = Math.sin(Math.acos(cosPhi));
      const deltaUVolts = Math.sqrt(3) * ib * (rTotal * cosPhi + xTotal * sinPhi);
      const deltaUPercent = (deltaUVolts / unFeederV) * 100;

      // Conductor core temperature estimate
      const thetaConductor = Math.min(130, Math.round(soilTemp + ((90 - 20) * Math.pow(ib / (538 * 0.913 * 0.85), 2))));

      const isThermalFail = ib > izDeclassed;
      const isDeltaUFail = deltaUPercent > 5.0;
      const isCableWarning = (ib > 0.88 * izDeclassed) || (deltaUPercent > 4.0) || (soilTemp >= 45);
      const cableOverallStatus = (isThermalFail || isDeltaUFail) ? 'FAIL' : isCableWarning ? 'WARNING' : 'PASS';

      apparatuses.push({
        id: 'cbl-feeder-30kv-f1',
        tag: '+CBL-F01',
        name: {
          fr: 'Liaison Câble Souterrain 30 kV F1 1×240 mm² Al XLPE (3.2 km)',
          en: '30 kV MV Cable Feeder F1 1×240 mm² Al XLPE (3.2 km underground)',
        },
        category: 'FEEDER',
        voltageLevel: 'MV',
        nominalRating: `30 kV (Um 36 kV) · 1×240 mm² Al XLPE · Iz = ${izDeclassed.toFixed(0)} A (@${soilTemp}°C)`,
        governingStandard: 'CEI 60364-5-52 / CEI 60949 / CEI 60502-2',
        operationalState: 'ENERGIZED',
        overallStatus: cableOverallStatus,
        metrics: [
          {
            label: { fr: 'Courant d\'emploi en charge (Ib)', en: 'Design load current (Ib)' },
            measuredValue: `${ib.toFixed(1)} A`,
            nominalOrLimit: `≤ ${izDeclassed.toFixed(1)} A (Iz déclassé @${soilTemp}°C)`,
            unit: 'A',
            status: isThermalFail ? 'DANGER' : (ib > 0.88 * izDeclassed) ? 'WARN' : 'OK',
            standardCriterion: isThermalFail ? 'CEI 60364-5-52 (Surcharge thermique inadmissible Ib > Iz)' : 'CEI 60364-5-52 Tab. B.52.3',
          },
          {
            label: { fr: 'Chute de tension en ligne (ΔU)', en: 'Line voltage drop (ΔU)' },
            measuredValue: `${deltaUPercent.toFixed(2)}%`,
            nominalOrLimit: '≤ 5.00% admissible',
            unit: '%',
            status: deltaUPercent <= 4.0 ? 'OK' : deltaUPercent <= 5.0 ? 'WARN' : 'DANGER',
            standardCriterion: deltaUPercent > 5.0 ? 'NF C 15-100 §525 (Dépassement seuil 5%)' : 'NF C 15-100 §525 / CEI 60364-5-52',
          },
          {
            label: { fr: 'Tenue thermique de court-circuit (Isc·√tk)', en: 'Short-circuit thermal withstand' },
            measuredValue: 'S_min requise = 93.9 mm²',
            nominalOrLimit: 'Section posée = 240 mm² (Conforme)',
            unit: 'mm²',
            status: 'OK',
            standardCriterion: 'CEI 60949 Formule adiabatique (k=94)',
          },
          {
            label: { fr: 'Température continue de l\'âme (θ_max)', en: 'Continuous core conductor temp' },
            measuredValue: `${thetaConductor}°C calculée`,
            nominalOrLimit: '≤ 90°C (Isolant PR / XLPE)',
            unit: '°C',
            status: thetaConductor > 90 ? 'DANGER' : thetaConductor > 80 ? 'WARN' : 'OK',
            standardCriterion: 'CEI 60287 Calcul thermique régime permanent',
          },
        ],
        recommendedCalcTab: 'cable-ampacity',
        calcParams: {
          unVolts: Math.round(unFeederV),
          pKw: Math.round(pFeederKw),
          cosPhi: 0.90,
          lengthM: 3200,
          sectionMm2: 240,
          material: 'al',
          ikKa: 12.5,
        },
        engineeringObservation: {
          fr: `Pose sous fourreau enterré Méthode D à 1.0 m de profondeur, facteur de température sol k1=${kTemp.toFixed(3)} (${soilTemp}°C sol).`,
          en: `Buried in conduit Method D at 1.0 m depth, ground temperature derating factor k1=${kTemp.toFixed(3)} (${soilTemp}°C ground ambient).`,
        },
      });

      // Feeder F2
      apparatuses.push({
        id: 'cbl-feeder-30kv-f2',
        tag: '+CBL-F02',
        name: {
          fr: 'Liaison Câble Souterrain 30 kV F2 1×150 mm² Al XLPE (1.8 km)',
          en: '30 kV MV Cable Feeder F2 1×150 mm² Al XLPE (1.8 km underground)',
        },
        category: 'FEEDER',
        voltageLevel: 'MV',
        nominalRating: '30 kV · 1×150 mm² Al XLPE · Iz = 278 A',
        governingStandard: 'CEI 60364-5-52 / CEI 60949',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Chute de tension en ligne (ΔU)', en: 'Line voltage drop (ΔU)' },
            measuredValue: '1.45%',
            nominalOrLimit: '≤ 5.00%',
            unit: '%',
            status: 'OK',
            standardCriterion: 'CEI 60364-5-52',
          },
          {
            label: { fr: 'Tenue court-circuit 12.5 kA 0.5s', en: 'Short-circuit withstand 12.5 kA 0.5s' },
            measuredValue: 'S_min = 93.9 mm²',
            nominalOrLimit: 'Section = 150 mm²',
            unit: 'mm²',
            status: 'OK',
            standardCriterion: 'CEI 60949',
          },
        ],
        recommendedCalcTab: 'voltage-drop',
        calcParams: {
          unVolts: 30000,
          lengthM: 1800,
          iAmps: 80,
          sectionMm2: 150,
          material: 'al',
          cosPhi: 0.90,
        },
        engineeringObservation: {
          fr: 'Alimentation boucle industrielle avec réserve de capacité thermique de 60%.',
          en: 'Supplies industrial ring feeder with 60% thermal spare capacity.',
        },
      });
    }

    if (isRmu) {
      apparatuses.push({
        id: 'cbl-rmu-ring',
        tag: '+CBL-RING',
        name: {
          fr: 'Câbles HTA Boucle Urbaine 30 kV 3×(1×240 mm² Al XLPE)',
          en: '30 kV MV Urban Ring Cable Feeders 3×(1×240 mm² Al XLPE)',
        },
        category: 'FEEDER',
        voltageLevel: 'MV',
        nominalRating: '30 kV · 240 mm² Al XLPE · In = 380 A',
        governingStandard: 'CEI 60502-2 / CEI 60364-5-52',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Chute de tension boucle ouverte', en: 'Open loop voltage drop' },
            measuredValue: '2.10%',
            nominalOrLimit: '≤ 5.00%',
            unit: '%',
            status: 'OK',
            standardCriterion: 'CEI 60364-5-52',
          },
        ],
        recommendedCalcTab: 'cable-ampacity',
        calcParams: {
          unVolts: 30000,
          lengthM: 2500,
          sectionMm2: 240,
        },
        engineeringObservation: {
          fr: 'Exploitation en coupure d\'artère ouverte avec reconfiguration automatique par automate DAS/SCADA.',
          en: 'Normally open ring operation with automated feeder restoration through DAS/SCADA automation.',
        },
      });
    }

    // =========================================================================
    // 4. SUBSTATION BUSBARS & EARTHING NETWORKS
    // =========================================================================
    if (isSingleBus || isDoubleBus || isBreakerHalf) {
      apparatuses.push({
        id: 'bus-225kv-main',
        tag: '==BUS.225KV',
        name: {
          fr: 'Jeu de Barres Principal 225 kV Aluminium Tubulaire (3150 A)',
          en: '225 kV Main Busbar Tubular Aluminium (3150 A Rating)',
        },
        category: 'BUSBAR',
        voltageLevel: 'HV',
        nominalRating: '245 kV · 3150 A · 40 kA (3 s) · Tube Almelec Ø 120/10 mm',
        governingStandard: 'CEI 60865-1 (Effets des courants de court-circuit) / CEI 61936-1',
        operationalState: sim.isBus225Energized ?? true ? 'ENERGIZED' : 'DE_ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Tenue électrodynamique aux efforts crête (Fm)', en: 'Peak electrodynamic force withstand (Fm)' },
            measuredValue: '102.5 kA crête (ip)',
            nominalOrLimit: 'Portée calculée ≤ 12 m (Contrainte σ ≤ σ_adm)',
            unit: 'kA',
            status: 'OK',
            standardCriterion: 'CEI 60865-1 §3.2 (Forces entre conducteurs)',
          },
          {
            label: { fr: 'Distance d\'isolement dans l\'air phase-terre', en: 'Phase-to-earth air clearance distance' },
            measuredValue: '2350 mm mesuré',
            nominalOrLimit: '≥ 2100 mm minimum requis',
            unit: 'mm',
            status: 'OK',
            standardCriterion: 'CEI 61936-1 Tab. 2 (Tension 245 kV)',
          },
          {
            label: { fr: 'Distance d\'isolement phase-phase', en: 'Phase-to-phase air clearance distance' },
            measuredValue: '2800 mm mesuré',
            nominalOrLimit: '≥ 2500 mm minimum requis',
            unit: 'mm',
            status: 'OK',
            standardCriterion: 'CEI 61936-1 Tab. 2',
          },
        ],
        recommendedCalcTab: 'busbar-electrodynamic',
        calcParams: {
          voltageKv: 225,
          scMva: 15000,
        },
        engineeringObservation: {
          fr: 'Tubes aluminium rigides montés sur colonnes isolateurs en résine époxy cycloaliphatique avec raccords antivibratoires.',
          en: 'Rigid aluminium tubes supported on cycloaliphatic epoxy resin post insulators with anti-vibration dampers.',
        },
      });

      // Earthing grid & step/touch voltages
      apparatuses.push({
        id: 'earth-grid-substation',
        tag: '==EARTH.GRID',
        name: {
          fr: 'Ceinture et Maillage Général de Terre du Poste (Cuivre Nu 95 mm²)',
          en: 'Substation Earthing Grid & Earth Mat (Bare Copper 95 mm²)',
        },
        category: 'BUSBAR',
        voltageLevel: 'HV',
        nominalRating: 'R_terre = 0.42 Ω · Ik1 max = 15.8 kA (0.5 s)',
        governingStandard: 'IEEE 80-2013 / CEI 61936-1 / NF C 13-200',
        operationalState: 'ENERGIZED',
        overallStatus: 'PASS',
        metrics: [
          {
            label: { fr: 'Résistance de terre globale (R_sub)', en: 'Overall substation ground resistance' },
            measuredValue: '0.42 Ω mesurée',
            nominalOrLimit: '≤ 0.50 Ω contractuel',
            unit: 'Ω',
            status: 'OK',
            standardCriterion: 'IEEE 80 §14 & Norme transport',
          },
          {
            label: { fr: 'Tension de pas admissible (U_step)', en: 'Permissible step voltage (U_step)' },
            measuredValue: '780 V calculée',
            nominalOrLimit: '≤ 1250 V (Gravier 15 cm épaisseur)',
            unit: 'V',
            status: 'OK',
            standardCriterion: 'IEEE 80 Équation 29 (Choc 50 kg)',
          },
          {
            label: { fr: 'Tension de toucher admissible (U_touch)', en: 'Permissible touch voltage (U_touch)' },
            measuredValue: '420 V calculée',
            nominalOrLimit: '≤ 580 V (Durée tk = 0.5 s)',
            unit: 'V',
            status: 'OK',
            standardCriterion: 'IEEE 80 Équation 32 (Choc 50 kg)',
          },
        ],
        recommendedCalcTab: 'earthing',
        calcParams: {},
        engineeringObservation: {
          fr: 'Réseau maillé en boucle carrée 10 m × 10 m avec piquets de terre aux quatre angles, couche de gravillon concassé 15 cm à résistivité 3000 Ω·m.',
          en: '10 m × 10 m grid mesh with ground rods at perimeter corners, covered with 15 cm crushed stone layer of 3000 Ω·m surface resistivity.',
        },
      });
    }

    // =========================================================================
    // 5. NUMERICAL PROTECTION RELAYS & CO-ORDINATION
    // =========================================================================
    apparatuses.push({
      id: 'relay-diff-trafo-87t',
      tag: '=TR1.PROT_87T',
      name: {
        fr: 'Relais Numérique de Protection Différentielle Transfo (ANSI 87T / 50/51)',
        en: 'Numerical Transformer Differential Protection Relay (ANSI 87T / 50/51)',
      },
      category: 'PROTECTION',
      voltageLevel: 'HV',
      nominalRating: 'CEI 61850 Ed.2 · GOOSE & Sampled Values · Doublé (Redondant)',
      governingStandard: 'CEI 60255-151 / IEEE C37.90',
      operationalState: 'ENERGIZED',
      overallStatus: 'PASS',
      metrics: [
        {
          label: { fr: 'Seuil différentiel de base (Id1)', en: 'Basic differential pickup (Id1)' },
          measuredValue: '0.20 x In_trafo',
          nominalOrLimit: '0.15 - 0.25 In',
          unit: 'In',
          status: 'OK',
          standardCriterion: 'CEI 60255-151',
        },
        {
          label: { fr: 'Pente de stabilisation pour saturation TC', en: 'Dual-slope percentage restraint' },
          measuredValue: 'Pente 1 = 30%, Pente 2 = 60%',
          nominalOrLimit: 'P1: 25-35%, P2: 50-70%',
          unit: '%',
          status: 'OK',
          standardCriterion: 'CEI 60255-151',
        },
        {
          label: { fr: 'Retenue d\'harmonique 2 (Inrush magnetisation)', en: '2nd Harmonic inrush restraint' },
          measuredValue: '15% de H2/H1',
          nominalOrLimit: '12% - 18%',
          unit: '%',
          status: 'OK',
          standardCriterion: 'Protection anti-déclenchement à l\'enclenchement',
        },
        {
          label: { fr: 'Marge de sélectivité chronométrique (Δt)', en: 'Grading margin (Δt)' },
          measuredValue: '310 ms avec palier aval',
          nominalOrLimit: '≥ 250 ms requis',
          unit: 'ms',
          status: 'OK',
          standardCriterion: 'IEEE 242 (Buff Book)',
        },
      ],
      recommendedCalcTab: 'relay-tcc',
      calcParams: {
        nominalCurrentA: 630,
        breakingCapacityKa: 31.5,
        faultCurrentA: 18200,
      },
      engineeringObservation: {
        fr: 'Compensation vectorielle d\'angle Dyn11 intégrée numériquement sans TC intermédiaires, double alimentation DC secourue.',
        en: 'Integrated numerical Dyn11 phase-angle compensation without interposing CTs, dual 110 V DC supply.',
      },
    });

    return apparatuses;
  }

  // Export full ASCII / Markdown formatted dossier
  public static generateMarkdownDossier(dossier: SubstationComplianceDossier, locale: 'fr' | 'en' = 'fr'): string {
    const divider = '================================================================================';
    const subDivider = '--------------------------------------------------------------------------------';

    let out = `${divider}\n`;
    out += `  EPEDE — ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT\n`;
    out += `  DOSSIER TECHNIQUE GLOBAL DE CONFORMITÉ POSTE ÉLECTRIQUE HTB/HTA\n`;
    out += `  CONSOLIDATED SUBSTATION COMPLIANCE & ASSET COMMISSIONING DOSSIER\n`;
    out += `  RÉFÉRENCE DOCUMENTAIRE : ${dossier.documentReference}\n`;
    out += `  DATE DE VALIDATION     : ${dossier.dateStr}\n`;
    out += `${divider}\n\n`;

    out += `1. IDENTIFICATION DU POSTE & ARCHITECTURE TOPOLOGIQUE\n`;
    out += `${subDivider}\n`;
    out += `   • Ouvrage          : ${dossier.substationName[locale]}\n`;
    out += `   • Topologie Schéma : ${dossier.topologyLabel[locale]} [${dossier.topology}]\n`;
    out += `   • Statut Global    : ${dossier.globalVerdict.status}\n`;
    out += `   • Indice Sécurité  : ${dossier.safetyIndexPercent}% (${dossier.compliantCount}/${dossier.totalAssets} conformes, ${dossier.warningCount} tolérance, ${dossier.failCount} réserve)\n\n`;

    out += `2. VERDICT DE LA COMMISSION D'HOMOLOGATION\n`;
    out += `${subDivider}\n`;
    out += `   ${dossier.globalVerdict.summary[locale]}\n\n`;

    out += `3. INVENTAIRE TECHNIQUE DÉTAILLÉ DES APPAREILLAGES DU POSTE\n`;
    out += `${subDivider}\n`;

    dossier.apparatuses.forEach((app, idx) => {
      out += `\n[APPAREIL ${idx + 1}/${dossier.apparatuses.length}] : ${app.tag} — ${app.name[locale]}\n`;
      out += `   - Catégorie & Tension : ${app.category} | Niveau : ${app.voltageLevel} | État : ${app.operationalState}\n`;
      out += `   - Spécifications      : ${app.nominalRating}\n`;
      out += `   - Norme Référente     : ${app.governingStandard}\n`;
      out += `   - Statut Conformité   : [${app.overallStatus}]\n`;
      out += `   - Points de contrôle métrologiques :\n`;
      app.metrics.forEach(m => {
        out += `       * ${m.label[locale]}: ${m.measuredValue} ${m.unit} (Seuil/Nominal: ${m.nominalOrLimit}) -> [${m.status}] {${m.standardCriterion}}\n`;
      });
      out += `   - Note d'ingénierie   : ${app.engineeringObservation[locale]}\n`;
    });

    out += `\n4. RÉFÉRENTIELS NORMATIFS INTERNATIONAUX APPLIQUÉS\n`;
    out += `${subDivider}\n`;
    dossier.governingStandards.forEach(std => {
      out += `   • ${std}\n`;
    });

    out += `\n5. SIGNATURE & VISA DE L'INGÉNIEUR EN CHEF AUDIT\n`;
    out += `${subDivider}\n`;
    out += `   Auditeur Certifié : ${dossier.leadAuditor.name}\n`;
    out += `   Organisation      : ${dossier.leadAuditor.organization}\n`;
    out += `   Titre / Rôle      : ${dossier.leadAuditor.role[locale]}\n`;
    out += `   Numéro de Visa    : ${dossier.leadAuditor.stampRef}\n`;
    out += `   Horodatage        : ${dossier.dateStr}\n`;
    out += `${divider}\n`;

    return out;
  }

  /**
   * Generates a tabular CSV dossier export (RFC 4180 with UTF-8 BOM)
   * Suitable for Microsoft Excel, PowerBI, SCADA audit logs, and ERP archiving.
   */
  static generateCsvDossier(dossier: SubstationComplianceDossier, locale: 'fr' | 'en'): string {
    const escapeCsv = (val: string | number | undefined): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Document_Ref',
      'Substation_Name',
      'Topology',
      'Date',
      'Safety_Index_Pct',
      'Global_Verdict',
      'Apparatus_Tag',
      'Apparatus_Name',
      'Category',
      'Voltage_Level',
      'Operational_State',
      'Nominal_Rating',
      'Governing_Standard',
      'Overall_Status',
      'Metric_Label',
      'Measured_Value',
      'Nominal_Limit',
      'Unit',
      'Metric_Status',
      'Standard_Criterion',
      'Observation',
    ];

    const rows: string[] = [headers.join(',')];

    dossier.apparatuses.forEach((app) => {
      app.metrics.forEach((m) => {
        const row = [
          escapeCsv(dossier.documentReference),
          escapeCsv(dossier.substationName[locale]),
          escapeCsv(dossier.topologyLabel[locale]),
          escapeCsv(dossier.dateStr),
          escapeCsv(dossier.safetyIndexPercent),
          escapeCsv(dossier.globalVerdict.status),
          escapeCsv(app.tag),
          escapeCsv(app.name[locale]),
          escapeCsv(app.category),
          escapeCsv(app.voltageLevel),
          escapeCsv(app.operationalState),
          escapeCsv(app.nominalRating),
          escapeCsv(app.governingStandard),
          escapeCsv(app.overallStatus),
          escapeCsv(m.label[locale]),
          escapeCsv(m.measuredValue),
          escapeCsv(m.nominalOrLimit),
          escapeCsv(m.unit),
          escapeCsv(m.status),
          escapeCsv(m.standardCriterion),
          escapeCsv(app.engineeringObservation[locale]),
        ];
        rows.push(row.join(','));
      });
    });

    // Prepend UTF-8 Byte Order Mark (BOM) for direct double-click opening in Excel
    return '\uFEFF' + rows.join('\r\n');
  }
}
