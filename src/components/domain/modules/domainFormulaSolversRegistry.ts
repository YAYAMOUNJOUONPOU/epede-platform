// src/components/domain/modules/domainFormulaSolversRegistry.ts
// EPEDE - Domain-Specific Engineering Formula Solvers Registry
// Provides rigorously contextualized formulas, variables, standards and units for all 16 domains.

import type { DomainCode } from '../../../types/epede';

export interface DomainFormulaConfig {
  id: string;
  titleFr: string;
  titleEn: string;
  expression: string;
  standardRef: string;
  assumptionsFr: string[];
  assumptionsEn: string[];
  variables: {
    symbol: string;
    nameFr: string;
    nameEn: string;
    unit: string;
    typicalRange: string;
  }[];
  defaultValues: Record<string, number>;
  calculateResult: (values: Record<string, number>) => {
    resultValue: number;
    unit: string;
    explanationFr: string;
    explanationEn: string;
  };
}

export function getDomainFormulaConfig(domainCode: DomainCode): DomainFormulaConfig {
  switch (domainCode) {
    // D01: Energy Production - Hydro Turbine Sizing
    case 'D01':
      return {
        id: 'solver-d01-hydro',
        titleFr: 'Puissance Électrique d\'une Centrale Hydroélectrique',
        titleEn: 'Hydroelectric Power Station Output Equation',
        expression: 'P_éléc = η_globale · ρ_eau · g · Q · H_nette',
        standardRef: 'CEI 60041 / CEI 60034-1',
        assumptionsFr: [
          'Régime hydraulique stationnaire à débit constant Q (m³/s)',
          'Chute nette déduite des pertes de charge linéaires et singulières de la conduite forcée',
          'Rendement global combiné turbine Francis (92%) + alternateur synchrone (98%)'
        ],
        assumptionsEn: [
          'Steady hydraulic flow rate Q (m³/s)',
          'Net head accounting for penstock friction and minor hydraulic head losses',
          'Combined overall efficiency: Francis turbine (92%) + synchronous generator (98%)'
        ],
        variables: [
          { symbol: 'Q', nameFr: 'Débit turbiné', nameEn: 'Turbine water flow rate', unit: 'm³/s', typicalRange: '10 - 200 m³/s' },
          { symbol: 'H', nameFr: 'Hauteur de chute nette', nameEn: 'Net hydraulic head', unit: 'm', typicalRange: '20 - 450 m' },
          { symbol: 'eta', nameFr: 'Rendement global (turbine + alternateur)', nameEn: 'Overall efficiency (turbine + gen)', unit: '%', typicalRange: '82 - 94%' }
        ],
        defaultValues: { Q: 135, H: 40, eta: 90 },
        calculateResult: (vals) => {
          const q = vals.Q || 135;
          const h = vals.H || 40;
          const eta = (vals.eta || 90) / 100;
          const pWatts = eta * 1000 * 9.81 * q * h;
          const pMw = pWatts / 1e6;
          return {
            resultValue: pMw,
            unit: 'MW',
            explanationFr: `Puissance électrique nette injectée P = ${pMw.toFixed(2)} MW (Énergie annuelle estimée à 80% de facteur de charge : ${(pMw * 8760 * 0.8 / 1000).toFixed(1)} GWh/an).`,
            explanationEn: `Net electric power delivered P = ${pMw.toFixed(2)} MW (Estimated annual energy at 80% capacity factor: ${(pMw * 8760 * 0.8 / 1000).toFixed(1)} GWh/year).`
          };
        }
      };

    // D03: Transmission Networks - Surge Impedance Loading (SIL)
    case 'D03':
      return {
        id: 'solver-d03-sil',
        titleFr: 'Puissance Naturelle (SIL) & Impédance Caractéristique de Ligne',
        titleEn: 'Transmission Line Surge Impedance Loading (SIL)',
        expression: 'P_SIL = U_L² / Z_c   avec   Z_c = √(L / C)',
        standardRef: 'CEI 60826 / CIGRE TB 322',
        assumptionsFr: [
          'Ligne aérienne triphasée sans pertes (R ≈ 0, G ≈ 0)',
          'Tension nominale composée U_L (kV eff)',
          'À P = P_SIL, la puissance réactive capacitive générée équilibre exactement la puissance réactive inductive consommée (Q_net = 0)'
        ],
        assumptionsEn: [
          'Lossless 3-phase overhead transmission line (R ≈ 0, G ≈ 0)',
          'Nominal phase-to-phase voltage U_L (kV rms)',
          'At P = P_SIL, line reactive capacitance balances reactive series inductance (Q_net = 0)'
        ],
        variables: [
          { symbol: 'U', nameFr: 'Tension nominale de la ligne', nameEn: 'Line nominal voltage', unit: 'kV', typicalRange: '90 - 400 kV' },
          { symbol: 'Zc', nameFr: 'Impédance caractéristique d\'onde Zc', nameEn: 'Surge impedance Zc', unit: 'Ω', typicalRange: '250 - 420 Ω' }
        ],
        defaultValues: { U: 225, Zc: 380 },
        calculateResult: (vals) => {
          const u = vals.U || 225;
          const zc = vals.Zc || 380;
          const sil = (u * u) / zc;
          return {
            resultValue: sil,
            unit: 'MW',
            explanationFr: `Puissance naturelle de la ligne P_SIL = ${sil.toFixed(1)} MW. Si le transit dépasse ${sil.toFixed(1)} MW, la ligne consomme du réactif et fait chuter la tension. En dessous, elle génère du réactif (effet Ferranti).`,
            explanationEn: `Surge Impedance Loading P_SIL = ${sil.toFixed(1)} MW. Transits exceeding ${sil.toFixed(1)} MW consume reactive power causing voltage sag; below SIL, the line behaves capacitively (Ferranti effect).`
          };
        }
      };

    // D04 & D16: Substations & Safety - IEEE 80 Touch Voltage Limit
    case 'D04':
    case 'D16':
      return {
        id: 'solver-d04-d16-touch',
        titleFr: 'Tension de Toucher Maximale Admissible (Norme IEEE 80)',
        titleEn: 'IEEE 80 Maximum Tolerable Touch Voltage (E_touch)',
        expression: 'E_touch = (1000 + 1.5 · C_s · ρ_s) · (0.116 / √t_s)',
        standardRef: 'IEEE Std 80-2013 / IEEE Std 81',
        assumptionsFr: [
          'Poids corporel de référence : 50 kg (facteur 0.116 / √ts)',
          'Couche de gravier superficiel d\'épaisseur 10 à 15 cm avec coefficient de réduction Cs',
          'Temps ts correspondant à la durée maximale d\'élimination du court-circuit par la protection primaire'
        ],
        assumptionsEn: [
          'Standard human body weight: 50 kg criteria (factor 0.116 / √ts)',
          'Surface crushed rock layer thickness 10-15 cm with derating factor Cs',
          'Fault clearing time ts matching primary breaker + relay clearing duration'
        ],
        variables: [
          { symbol: 'rho_s', nameFr: 'Résistivité du gravier en surface', nameEn: 'Surface rock resistivity', unit: 'Ω·m', typicalRange: '1000 - 5000 Ω·m' },
          { symbol: 'Cs', nameFr: 'Facteur de réduction de couche superficielle', nameEn: 'Surface layer derating factor', unit: '-', typicalRange: '0.65 - 0.90' },
          { symbol: 'ts', nameFr: 'Temps d\'élimination du défaut', nameEn: 'Fault clearing time', unit: 's', typicalRange: '0.1 - 1.0 s' }
        ],
        defaultValues: { rho_s: 3000, Cs: 0.75, ts: 0.2 },
        calculateResult: (vals) => {
          const rhoS = vals.rho_s || 3000;
          const cs = vals.Cs || 0.75;
          const ts = Math.max(0.05, vals.ts || 0.2);
          const rBodyPlusFoot = 1000 + 1.5 * cs * rhoS;
          const eTouch = rBodyPlusFoot * (0.116 / Math.sqrt(ts));
          return {
            resultValue: eTouch,
            unit: 'V',
            explanationFr: `Tension de toucher limite E_touch = ${eTouch.toFixed(1)} V eff. La tension de contact calculée sur le maillage de terre doit impérativement rester sous ce seuil pour garantir la survie des opérateurs.`,
            explanationEn: `Tolerable touch voltage E_touch = ${eTouch.toFixed(1)} V rms. The grid ground potential rise mesh touch voltage must remain strictly below this limit to ensure operator safety.`
          };
        }
      };

    // D05: Distribution Networks - Line Voltage Drop
    case 'D05':
      return {
        id: 'solver-d05-vdrop',
        titleFr: 'Chute de Tension en Ligne Triphasée HTA / BT',
        titleEn: '3-Phase Line Voltage Drop Calculation',
        expression: 'ΔU = √3 · I · (R\' · cos φ + X\' · sin φ) · L',
        standardRef: 'CEI 60364-5-52 / CEI 60038',
        assumptionsFr: [
          'Liaison triphasée équilibrée en régime permanent',
          'Résistance linéique R\' et réactance linéique X\' dépendant de la section et de la nature de l\'âme (Aluminium/Cuivre)',
          'Chute de tension maximale admissible selon norme : 5% en HTA et 3% en éclairage BT'
        ],
        assumptionsEn: [
          'Balanced 3-phase steady-state circuit',
          'Linear resistance R\' and reactance X\' determined by conductor material and cable layout',
          'Standard maximum allowable drop: 5% on MV feeders and 3% on LV lighting'
        ],
        variables: [
          { symbol: 'U_nom', nameFr: 'Tension nominale entre phases', nameEn: 'Line nominal voltage', unit: 'V', typicalRange: '400 V - 33 kV' },
          { symbol: 'I', nameFr: 'Courant de charge', nameEn: 'Load current', unit: 'A', typicalRange: '20 - 500 A' },
          { symbol: 'L', nameFr: 'Longueur du câble / ligne', nameEn: 'Circuit length', unit: 'km', typicalRange: '0.1 - 40 km' },
          { symbol: 'R_prime', nameFr: 'Résistance linéique (R\')', nameEn: 'Linear resistance (R\')', unit: 'Ω/km', typicalRange: '0.10 - 1.20 Ω/km' },
          { symbol: 'X_prime', nameFr: 'Réactance linéique (X\')', nameEn: 'Linear reactance (X\')', unit: 'Ω/km', typicalRange: '0.08 - 0.35 Ω/km' },
          { symbol: 'cosPhi', nameFr: 'Facteur de puissance (cos φ)', nameEn: 'Power factor (cos φ)', unit: '-', typicalRange: '0.70 - 0.95' }
        ],
        defaultValues: { U_nom: 30000, I: 180, L: 15, R_prime: 0.165, X_prime: 0.110, cosPhi: 0.85 },
        calculateResult: (vals) => {
          const un = vals.U_nom || 30000;
          const i = vals.I || 180;
          const l = vals.L || 15;
          const r = vals.R_prime || 0.165;
          const x = vals.X_prime || 0.110;
          const pf = vals.cosPhi || 0.85;
          const sinPhi = Math.sqrt(Math.max(0, 1 - pf * pf));
          const deltaU = Math.sqrt(3) * i * (r * pf + x * sinPhi) * l;
          const deltaPct = (deltaU / un) * 100;
          return {
            resultValue: deltaPct,
            unit: '%',
            explanationFr: `Chute de tension ΔU = ${deltaU.toFixed(1)} V soit ${deltaPct.toFixed(2)} % de ${un} V (${deltaPct <= 5 ? 'CONFORME ≤ 5%' : 'NON CONFORME > 5% - Augmenter la section'}).`,
            explanationEn: `Voltage drop ΔU = ${deltaU.toFixed(1)} V, representing ${deltaPct.toFixed(2)} % of ${un} V (${deltaPct <= 5 ? 'COMPLIANT ≤ 5%' : 'NON-COMPLIANT > 5% - Upsize conductor'}).`
          };
        }
      };

    // D09 & D10: BESS & Energy Storage - Usable Energy & C-Rate Sizing
    case 'D09':
    case 'D10':
      return {
        id: 'solver-d09-bess',
        titleFr: 'Autonomie & Décharge d\'un Système BESS (C-Rate)',
        titleEn: 'BESS Battery Sizing & Discharge Duration at C-Rate',
        expression: 't_décharge = (E_nominale · DoD · SoH · η_PCS) / P_appelée',
        standardRef: 'CEI 62933-2-1 / CEI 62619',
        assumptionsFr: [
          'Profondeur de décharge (DoD) recommandée : 80% pour préserver la durée de vie cyclique',
          'État de santé (SoH) résiduel de la batterie LFP',
          'Rendement de conversion de l\'onduleur bidirectionnel PCS (96% à 98%)'
        ],
        assumptionsEn: [
          'Depth of Discharge (DoD) set to 80% for cycle life preservation',
          'Battery State of Health (SoH) accounting for calendar and cycling aging',
          'Bidirectional PCS inverter conversion efficiency (96% - 98%)'
        ],
        variables: [
          { symbol: 'E_nom', nameFr: 'Capacité énergétique nominale', nameEn: 'Rated energy capacity', unit: 'MWh', typicalRange: '1 - 100 MWh' },
          { symbol: 'P_out', nameFr: 'Puissance de décharge demandée', nameEn: 'Discharge power request', unit: 'MW', typicalRange: '0.5 - 50 MW' },
          { symbol: 'DoD', nameFr: 'Profondeur de décharge autorisée', nameEn: 'Allowed Depth of Discharge', unit: '%', typicalRange: '60 - 95%' },
          { symbol: 'SoH', nameFr: 'État de santé de la batterie (SoH)', nameEn: 'State of Health (SoH)', unit: '%', typicalRange: '70 - 100%' }
        ],
        defaultValues: { E_nom: 10, P_out: 5, DoD: 80, SoH: 95 },
        calculateResult: (vals) => {
          const e = vals.E_nom || 10;
          const p = Math.max(0.1, vals.P_out || 5);
          const dod = (vals.DoD || 80) / 100;
          const soh = (vals.SoH || 95) / 100;
          const eta = 0.96;
          const eUsable = e * dod * soh * eta;
          const hours = eUsable / p;
          const minutes = hours * 60;
          return {
            resultValue: minutes,
            unit: 'min',
            explanationFr: `Énergie utile disponible = ${eUsable.toFixed(2)} MWh. Autonomie à ${p} MW continus : ${Math.floor(hours)} h ${Math.round(minutes % 60)} min (Régime C-rate effectif : ${(p / e).toFixed(2)} C).`,
            explanationEn: `Net usable energy = ${eUsable.toFixed(2)} MWh. Discharge duration at ${p} MW continuous: ${Math.floor(hours)} h ${Math.round(minutes % 60)} min (Effective C-rate: ${(p / e).toFixed(2)} C).`
          };
        }
      };

    // D11: Power Quality & Harmonics - Resonance Frequency
    case 'D11':
      return {
        id: 'solver-d11-harmonics',
        titleFr: 'Fréquence de Résonance Parallèle Réseau / Condensateurs',
        titleEn: 'Harmonic Parallel Resonance Frequency (f_res)',
        expression: 'f_res = f_fond · √(S_cc / Q_cap)   |   Rang n_res = √(S_cc / Q_cap)',
        standardRef: 'IEEE 519-2022 / CEI 61000-4-30',
        assumptionsFr: [
          'Puissance de court-circuit amont S_cc en MVA au point de raccordement',
          'Puissance réactive de la batterie de condensateurs Q_cap en Mvar',
          'Si le rang n_res est proche d\'un rang harmonique émis (5, 7, 11), il y a risque de surtension destructrice et explosion des condensateurs'
        ],
        assumptionsEn: [
          'Upstream grid short-circuit capability S_cc in MVA at Point of Common Coupling',
          'Power factor correction capacitor bank reactive power Q_cap in Mvar',
          'If resonant harmonic rank n_res aligns with load harmonics (5th, 7th, 11th), severe voltage amplification occurs'
        ],
        variables: [
          { symbol: 'S_cc', nameFr: 'Puissance de court-circuit réseau (S_cc)', nameEn: 'Grid short-circuit capacity (S_cc)', unit: 'MVA', typicalRange: '50 - 2500 MVA' },
          { symbol: 'Q_cap', nameFr: 'Puissance batterie de condensateurs (Q_c)', nameEn: 'Capacitor bank rating (Q_c)', unit: 'Mvar', typicalRange: '0.5 - 50 Mvar' },
          { symbol: 'f_0', nameFr: 'Fréquence fondamentale du réseau', nameEn: 'Fundamental grid frequency', unit: 'Hz', typicalRange: '50 ou 60 Hz' }
        ],
        defaultValues: { S_cc: 450, Q_cap: 12, f_0: 50 },
        calculateResult: (vals) => {
          const scc = vals.S_cc || 450;
          const qc = Math.max(0.1, vals.Q_cap || 12);
          const f0 = vals.f_0 || 50;
          const rank = Math.sqrt(scc / qc);
          const fres = f0 * rank;
          const isDanger = Math.abs(rank - 5) < 0.4 || Math.abs(rank - 7) < 0.4;
          return {
            resultValue: fres,
            unit: 'Hz',
            explanationFr: `Rang de résonance n_res = ${rank.toFixed(2)} (Fréquence f_res = ${fres.toFixed(1)} Hz). ${isDanger ? '⚠️ DANGER CRITIQUE : Accord proche du rang 5 ou 7 ! Installer obligatoirement une self anti-harmonique d\'au moins 7%.' : '✅ Zone de sécurité relative.'}`,
            explanationEn: `Harmonic resonance rank n_res = ${rank.toFixed(2)} (Frequency f_res = ${fres.toFixed(1)} Hz). ${isDanger ? '⚠️ CRITICAL WARNING: Resonance near 5th or 7th harmonic! An anti-resonance detuning reactor (e.g. 7%) is mandatory.' : '✅ Safe operating zone.'}`
          };
        }
      };

    // D12 & D15: Asset Management - Transformer Insulation Thermal Aging
    case 'D12':
    case 'D15':
      return {
        id: 'solver-d12-aging',
        titleFr: 'Vitesse de Vieillissement Thermique du Papier Isolant Transfo',
        titleEn: 'Transformer Solid Insulation Relative Aging Rate (IEC 60076-7)',
        expression: 'V = 2^((θ_hotspot - 98) / 6)',
        standardRef: 'CEI 60076-7 / IEEE Std C57.91',
        assumptionsFr: [
          'Papier cellulosique Kraft standard non thermiquement amélioré dans huile minérale',
          'Température de point chaud de référence nominale : 98 °C (V = 1.0)',
          'Règle de Montsinger / Arrhenius : La vitesse de dégradation du papier double tous les 6 °C d\'augmentation du point chaud'
        ],
        assumptionsEn: [
          'Standard non-thermally upgraded Kraft paper in mineral transformer oil',
          'Reference design hot-spot temperature: 98 °C corresponding to unity aging rate (V = 1.0)',
          'Montsinger Arrhenius law: Insulation loss-of-life doubles for every 6 °C temperature rise'
        ],
        variables: [
          { symbol: 'T_hotspot', nameFr: 'Température du point chaud des enroulements (θ_h)', nameEn: 'Winding hot-spot temperature (θ_h)', unit: '°C', typicalRange: '60 - 150 °C' }
        ],
        defaultValues: { T_hotspot: 110 },
        calculateResult: (vals) => {
          const tH = vals.T_hotspot || 110;
          const vAging = Math.pow(2, (tH - 98) / 6);
          const lifeExpectancyYears = 30 / vAging;
          return {
            resultValue: vAging,
            unit: 'x V_nom',
            explanationFr: `Vitesse de vieillissement relatif V = ${vAging.toFixed(2)} fois le taux normal. À ce régime thermique permanent, l\'espérance de vie du transformateur chute de 30 ans à ${lifeExpectancyYears.toFixed(1)} ans.`,
            explanationEn: `Relative aging rate V = ${vAging.toFixed(2)}x nominal. Under sustained operation at this hot-spot, paper life expectancy is reduced from 30 years to ${lifeExpectancyYears.toFixed(1)} years.`
          };
        }
      };

    // D02: Solar & Renewable Generation - PV Temperature Derating & Output
    case 'D02':
      return {
        id: 'solver-d02-solar',
        titleFr: 'Puissance DC d\'un Champ Solaire PV avec Dérive Thermique',
        titleEn: 'Photovoltaic Array DC Power with Temperature Derating',
        expression: 'P_dc = P_stc · [1 + (γ / 100) · (T_cell - 25)] · (G / 1000)',
        standardRef: 'CEI 61215 / CEI 61724-1',
        assumptionsFr: [
          'Conditions STC de référence : Irradiance 1000 W/m², Température de jonction 25 °C, Spectre AM 1.5',
          'Coefficient de température de puissance négatif γ_pmp typique silicium monocristallin (-0.35 %/°C)',
          'Pertes angulaires (IAM) et encrassement pris en compte au ratio de performance globale'
        ],
        assumptionsEn: [
          'Standard Test Conditions (STC): 1000 W/m², Cell junction temperature 25 °C, AM 1.5 spectrum',
          'Negative power temperature coefficient γ_pmp typical for mono-Si (-0.35 %/°C)',
          'Incidence angle modifier (IAM) and soiling losses accounted for in performance ratio'
        ],
        variables: [
          { symbol: 'P_stc', nameFr: 'Puissance crête installée (P_stc)', nameEn: 'Installed peak DC power (P_stc)', unit: 'kWc', typicalRange: '50 - 5000 kWc' },
          { symbol: 'G', nameFr: 'Irradiance solaire globale dans le plan (G)', nameEn: 'Plane-of-array solar irradiance (G)', unit: 'W/m²', typicalRange: '200 - 1200 W/m²' },
          { symbol: 'T_cell', nameFr: 'Température effective des cellules (T_cell)', nameEn: 'Operating cell temperature (T_cell)', unit: '°C', typicalRange: '20 - 75 °C' },
          { symbol: 'gamma', nameFr: 'Coefficient thermique de puissance (γ)', nameEn: 'Power temperature coefficient (γ)', unit: '%/°C', typicalRange: '-0.45 à -0.28 %/°C' }
        ],
        defaultValues: { P_stc: 500, G: 950, T_cell: 55, gamma: -0.35 },
        calculateResult: (vals) => {
          const pstc = vals.P_stc || 500;
          const g = vals.G || 950;
          const tcell = vals.T_cell || 55;
          const gamma = vals.gamma !== undefined ? vals.gamma : -0.35;
          const tempFactor = 1 + (gamma / 100) * (tcell - 25);
          const pdcKw = pstc * Math.max(0, tempFactor) * (g / 1000);
          const thermalLossPct = Math.abs((gamma) * (tcell - 25));
          return {
            resultValue: pdcKw,
            unit: 'kW',
            explanationFr: `Puissance DC délivrée P_dc = ${pdcKw.toFixed(1)} kW (Perte thermique par échauffement des cellules : -${thermalLossPct.toFixed(1)} % à ${tcell}°C).`,
            explanationEn: `Operating DC power output P_dc = ${pdcKw.toFixed(1)} kW (Thermal derating loss: -${thermalLossPct.toFixed(1)}% at ${tcell}°C cell temperature).`
          };
        }
      };

    // D06: LV Installations - Normalized Cable Voltage Drop
    case 'D06':
      return {
        id: 'solver-d06-volt-drop',
        titleFr: 'Chute de Tension en Ligne Triphasée Basse Tension (NF C 15-105)',
        titleEn: 'Three-Phase Low Voltage Cable Voltage Drop (IEC 60364-5-52)',
        expression: 'ΔU = √3 · I_b · L · [(ρ / S) · cos φ + λ · sin φ]',
        standardRef: 'NF C 15-105 / CEI 60364-5-52',
        assumptionsFr: [
          'Réseau triphasé 400 V - 50 Hz avec conducteurs cuivre en régime de pleine charge',
          'Résistivité du cuivre en service chaud ρ = 0.0225 Ω·mm²/m (à 70 °C isolation PVC ou 90 °C XLPE)',
          'Réactance linéique standard des câbles multiconducteurs λ = 0.08 mΩ/m (0.00008 Ω/m)'
        ],
        assumptionsEn: [
          'Three-phase 400 V - 50 Hz network with copper conductors at thermal operating condition',
          'Copper resistivity at operational temperature ρ = 0.0225 Ω·mm²/m',
          'Standard multi-core cable inductive reactance λ = 0.08 mΩ/m'
        ],
        variables: [
          { symbol: 'L', nameFr: 'Longueur de la canalisation (L)', nameEn: 'Cable run length (L)', unit: 'm', typicalRange: '10 - 250 m' },
          { symbol: 'S', nameFr: 'Section des conducteurs de phase (S)', nameEn: 'Conductor cross-section (S)', unit: 'mm²', typicalRange: '2.5 - 300 mm²' },
          { symbol: 'Ib', nameFr: 'Courant d\'emploi assigné du circuit (I_b)', nameEn: 'Circuit design load current (I_b)', unit: 'A', typicalRange: '10 - 630 A' },
          { symbol: 'cosPhi', nameFr: 'Facteur de puissance de la charge (cos φ)', nameEn: 'Load power factor (cos φ)', unit: '-', typicalRange: '0.70 - 0.99' }
        ],
        defaultValues: { L: 85, S: 50, Ib: 120, cosPhi: 0.85 },
        calculateResult: (vals) => {
          const l = vals.L || 85;
          const s = vals.S || 50;
          const ib = vals.Ib || 120;
          const pf = vals.cosPhi || 0.85;
          const sinPhi = Math.sqrt(Math.max(0, 1 - pf * pf));
          const rho = 0.0225; // ohm*mm2/m for copper at 70C
          const lambda = 0.00008; // ohm/m
          const rL = (rho * l) / s;
          const xL = lambda * l;
          const deltaU = Math.sqrt(3) * ib * (rL * pf + xL * sinPhi);
          const deltaUPct = (deltaU / 400) * 100;
          const isCompliant = deltaUPct <= 5.0;
          return {
            resultValue: deltaU,
            unit: 'V',
            explanationFr: `Chute de tension ΔU = ${deltaU.toFixed(2)} V (${deltaUPct.toFixed(2)} % sous 400 V). ${isCompliant ? '✅ Conforme à la norme NF C 15-100 (seuil max 5% en force motrice).' : '⚠️ NON CONFORME : Dépasse le seuil max de 5% ! Augmenter la section S.'}`,
            explanationEn: `Voltage drop ΔU = ${deltaU.toFixed(2)} V (${deltaUPct.toFixed(2)}% on 400 V). ${isCompliant ? '✅ Compliant with IEC 60364-5-52 (below 5% power limit).' : '⚠️ NON-COMPLIANT: Exceeds 5% max threshold! Upsize cross-section S.'}`
          };
        }
      };

    // D07: Industrial Automation - Induction Motor Acceleration Starting Time
    case 'D07':
      return {
        id: 'solver-d07-motor-start',
        titleFr: 'Temps de Démarrage d\'un Moteur Asynchrone & Couple Accélérateur',
        titleEn: 'Induction Motor Direct Starting Time & Accelerating Torque',
        expression: 't_dém = [J_tot · (2π · N_syn / 60)] / C_acc',
        standardRef: 'CEI 60034-12 / CEI 60947-4-1',
        assumptionsFr: [
          'Démarrage direct ou étoile-triangle sous tension nominale constante',
          'Inertie globale ramenée à l\'arbre comprenant rotor moteur + machine entraînée (pompe/ventilateur)',
          'Couple accélérateur moyen net C_acc = C_moyen_moteur - C_résistant_moyen'
        ],
        assumptionsEn: [
          'Direct-on-line (DOL) or star-delta starting under rated voltage',
          'Total moment of inertia reflected to shaft: motor rotor + driven load inertia',
          'Net mean accelerating torque C_acc = C_mean_motor - C_mean_load'
        ],
        variables: [
          { symbol: 'J_tot', nameFr: 'Inertie totale ramenée à l\'arbre (J)', nameEn: 'Total moment of inertia (J)', unit: 'kg·m²', typicalRange: '0.2 - 20 kg·m²' },
          { symbol: 'N_syn', nameFr: 'Vitesse synchrone du moteur (N_syn)', nameEn: 'Synchronous speed (N_syn)', unit: 'tr/min', typicalRange: '750 - 3000 tr/min' },
          { symbol: 'C_acc', nameFr: 'Couple accélérateur moyen net (C_acc)', nameEn: 'Net accelerating torque (C_acc)', unit: 'N·m', typicalRange: '20 - 600 N·m' }
        ],
        defaultValues: { J_tot: 2.5, N_syn: 1500, C_acc: 120 },
        calculateResult: (vals) => {
          const j = vals.J_tot || 2.5;
          const n = vals.N_syn || 1500;
          const cacc = vals.C_acc || 120;
          const omega = (2 * Math.PI * n) / 60;
          const tStart = (j * omega) / Math.max(1, cacc);
          const isStallRisk = tStart > 10;
          return {
            resultValue: tStart,
            unit: 's',
            explanationFr: `Temps de démarrage t_dém = ${tStart.toFixed(2)} s (Vitesse angulaire ω = ${omega.toFixed(1)} rad/s). ${isStallRisk ? '⚠️ ATTENTION : Démarrage long (> 10s) ! Risque d\'échauffement rotorique et déclenchement thermique intempestif.' : '✅ Démarrage franc et sécurisé pour les enroulements statoriques.'}`,
            explanationEn: `Starting time t_start = ${tStart.toFixed(2)} s (Angular velocity ω = ${omega.toFixed(1)} rad/s). ${isStallRisk ? '⚠️ WARNING: Long starting duration (> 10s)! Risk of rotor overheating and thermal overload tripping.' : '✅ Fast and safe starting cycle for motor stator windings.'}`
          };
        }
      };

    // D08: Extra Low Voltage / Fire Safety - Battery Autonomy Sizing
    case 'D08':
      return {
        id: 'solver-d08-fire-battery',
        titleFr: 'Autonomie de Batterie pour Centrale SSI / Alarme Incendie (EN 54-4)',
        titleEn: 'Fire Alarm Control Panel Battery Autonomy Sizing (EN 54-4)',
        expression: 'C_bat = 1.25 · [I_veille · t_veille + I_alarme · t_alarme]',
        standardRef: 'EN 54-4 / NF S 61-936',
        assumptionsFr: [
          'Alimentation électrique de sécurité (AES) selon EN 54-4 avec coefficient de vieillissement de 1.25 (+25% de réserve)',
          'Autonomie réglementaire en veille : typiquement 24 h ou 72 h en cas d\'absence de personnel qualifié',
          'Autonomie en état d\'alarme générale : 30 minutes (0.5 h) à pleine charge des diffuseurs sonores/visuels'
        ],
        assumptionsEn: [
          'Fire power supply equipment (PSE) per EN 54-4 with 1.25 battery aging factor (+25% margin)',
          'Standby autonomy: typically 24 h (or 72 h for unmanned facilities)',
          'Alarm autonomy: 30 minutes (0.5 h) under full evacuation sounder and flash strobe load'
        ],
        variables: [
          { symbol: 'I_standby', nameFr: 'Courant de veille permanent (I_veille)', nameEn: 'Quiescent standby current (I_standby)', unit: 'A', typicalRange: '0.1 - 4.0 A' },
          { symbol: 't_standby', nameFr: 'Durée de veille exigée (t_veille)', nameEn: 'Standby duration required (t_standby)', unit: 'h', typicalRange: '12 - 72 h' },
          { symbol: 'I_alarm', nameFr: 'Courant total en état d\'alarme (I_alarme)', nameEn: 'Full alarm load current (I_alarm)', unit: 'A', typicalRange: '0.8 - 15.0 A' },
          { symbol: 't_alarm', nameFr: 'Durée d\'alarme requise (t_alarme)', nameEn: 'Alarm duration required (t_alarm)', unit: 'h', typicalRange: '0.25 - 1.0 h' }
        ],
        defaultValues: { I_standby: 0.65, t_standby: 24, I_alarm: 3.8, t_alarm: 0.5 },
        calculateResult: (vals) => {
          const iv = vals.I_standby || 0.65;
          const tv = vals.t_standby || 24;
          const ia = vals.I_alarm || 3.8;
          const ta = vals.t_alarm || 0.5;
          const qStandby = iv * tv;
          const qAlarm = ia * ta;
          const cBatAh = 1.25 * (qStandby + qAlarm);
          return {
            resultValue: cBatAh,
            unit: 'Ah',
            explanationFr: `Capacité normalisée requise C_bat = ${cBatAh.toFixed(1)} Ah à C20 (Veille : ${qStandby.toFixed(1)} Ah, Alarme : ${qAlarm.toFixed(2)} Ah, avec marge de vieillissement x1.25).`,
            explanationEn: `Required standard battery capacity C_bat = ${cBatAh.toFixed(1)} Ah at C20 (Standby: ${qStandby.toFixed(1)} Ah, Alarm: ${qAlarm.toFixed(2)} Ah, with x1.25 aging factor).`
          };
        }
      };

    // D13: Industrial Telecom & IEC 61850 - Sampled Values (SV) Network Bandwidth
    case 'D13':
      return {
        id: 'solver-d13-iec61850-bw',
        titleFr: 'Bande Passante Réseau Bus de Process CEI 61850-9-2 LE (Sampled Values)',
        titleEn: 'IEC 61850-9-2 LE Process Bus Sampled Values (SV) Bandwidth',
        expression: 'BW = N_streams · (N_samples · f_réseau) · FrameSize · 8 / 10⁶',
        standardRef: 'CEI 61850-9-2 LE / CEI 61850-8-1',
        assumptionsFr: [
          'Trame Ethernet Sampled Values (SV) normalisée 9-2 LE : 154 octets par trame (Ethertype 0x88BA)',
          'Taux d\'échantillonnage de référence : 80 échantillons/période pour la protection (4000 trames/s à 50 Hz)',
          'Débit calculé sur la couche physique Ethernet 802.3 (Preamble + IFG inclus)'
        ],
        assumptionsEn: [
          'Standardized 9-2 LE SV Ethernet frame size: 154 bytes per packet (Ethertype 0x88BA)',
          'Reference sampling rate: 80 samples/cycle for protection (4000 packets/s at 50 Hz)',
          'Throughput computed on physical layer including preamble and inter-frame gap'
        ],
        variables: [
          { symbol: 'N_streams', nameFr: 'Nombre de Merging Units (Flux SV)', nameEn: 'Number of Merging Unit (SV) streams', unit: 'flux', typicalRange: '1 - 16 flux' },
          { symbol: 'samples_per_cycle', nameFr: 'Échantillons par période (80 ou 256)', nameEn: 'Samples per electrical cycle', unit: 'ech/pér', typicalRange: '80 ou 256' },
          { symbol: 'f_net', nameFr: 'Fréquence nominale du réseau', nameEn: 'Nominal grid frequency', unit: 'Hz', typicalRange: '50 ou 60 Hz' }
        ],
        defaultValues: { N_streams: 4, samples_per_cycle: 80, f_net: 50 },
        calculateResult: (vals) => {
          const nStreams = vals.N_streams || 4;
          const sPerCycle = vals.samples_per_cycle || 80;
          const f = vals.f_net || 50;
          const packetsPerSec = sPerCycle * f;
          const frameBytesWithOverhead = 154 + 20; // 154 data + 8 preamble + 12 inter-frame gap
          const bitsPerStreamSec = packetsPerSec * frameBytesWithOverhead * 8;
          const totalMbps = (nStreams * bitsPerStreamSec) / 1e6;
          const isOver100Mb = totalMbps > 80;
          return {
            resultValue: totalMbps,
            unit: 'Mbit/s',
            explanationFr: `Débit total bus de process = ${totalMbps.toFixed(2)} Mbit/s (${packetsPerSec} trames/s par flux). ${isOver100Mb ? '⚠️ Dépasse la capacité d\'un lien 100Base-TX ! Passer impérativement sur un lien Gigabit Ethernet 1000Base-X.' : '✅ Compatible réseau Ethernet 100Base-TX avec VLAN prioritaire IEEE 802.1Q (priorité 4 pour SV).' }`,
            explanationEn: `Total process bus throughput = ${totalMbps.toFixed(2)} Mbit/s (${packetsPerSec} frames/s per stream). ${isOver100Mb ? '⚠️ Exceeds 100Base-TX line rate! Gigabit Ethernet (1000Base-X) switch uplink is mandatory.' : '✅ Safe for 100Base-TX switches with IEEE 802.1Q prioritized VLAN (priority tag 4 for SV).' }`
          };
        }
      };

    // D14: Power Quality & EMC - Capacitor Bank Sizing for Power Factor Correction
    case 'D14':
      return {
        id: 'solver-d14-pfc-sizing',
        titleFr: 'Dimensionnement de Batterie de Condensateurs (Compensation Réactive)',
        titleEn: 'Capacitor Bank Sizing for Power Factor Correction (IEEE 519 / IEC 60831)',
        expression: 'Q_c = P · [tan(arccos φ₁) - tan(arccos φ₂)]',
        standardRef: 'CEI 60831-1 / IEEE 519-2022',
        assumptionsFr: [
          'Charge triphasée équilibrée à composante fondamentale 50 Hz prédominante',
          'Relèvement du facteur de puissance de cos φ₁ (actuel) vers cos φ₂ (cible)',
          'Réduction proportionnelle du courant de ligne et des pertes par effet Joule'
        ],
        assumptionsEn: [
          'Three-phase balanced system dominated by 50 Hz fundamental power',
          'Target power factor correction from cos φ₁ (initial) to cos φ₂ (target)',
          'Proportional reduction in line feeder current and cable Joule losses'
        ],
        variables: [
          { symbol: 'P_kw', nameFr: 'Puissance active totale installée (P)', nameEn: 'Total active load power (P)', unit: 'kW', typicalRange: '50 - 5000 kW' },
          { symbol: 'cosPhi_initial', nameFr: 'Facteur de puissance initial (cos φ₁)', nameEn: 'Initial power factor (cos φ₁)', unit: '-', typicalRange: '0.60 - 0.88' },
          { symbol: 'cosPhi_target', nameFr: 'Facteur de puissance visé (cos φ₂)', nameEn: 'Target power factor (cos φ₂)', unit: '-', typicalRange: '0.90 - 1.00' }
        ],
        defaultValues: { P_kw: 400, cosPhi_initial: 0.75, cosPhi_target: 0.96 },
        calculateResult: (vals) => {
          const p = vals.P_kw || 400;
          const pf1 = Math.min(0.99, Math.max(0.4, vals.cosPhi_initial || 0.75));
          const pf2 = Math.min(1.0, Math.max(pf1, vals.cosPhi_target || 0.96));
          const phi1 = Math.acos(pf1);
          const phi2 = Math.acos(pf2);
          const tanPhi1 = Math.tan(phi1);
          const tanPhi2 = Math.tan(phi2);
          const qcKvar = p * (tanPhi1 - tanPhi2);
          const iReductionPct = (1 - (pf1 / pf2)) * 100;
          return {
            resultValue: qcKvar,
            unit: 'kvar',
            explanationFr: `Puissance réactive capacitive nécessaire Q_c = ${qcKvar.toFixed(1)} kvar. Cette compensation réduit le courant de ligne de ${iReductionPct.toFixed(1)} % et supprime les pénalités pour dépassement de tangente phi.`,
            explanationEn: `Required capacitor bank rating Q_c = ${qcKvar.toFixed(1)} kvar. This compensation reduces feeder current by ${iReductionPct.toFixed(1)}% and eliminates utility reactive power penalties.`
          };
        }
      };

    // Default: General 3-Phase Power
    default:
      return {
        id: 'solver-default-power',
        titleFr: 'Puissance Électrique Triphasée & Courant de Ligne',
        titleEn: 'Three-Phase Electric Power & Full Load Current',
        expression: 'S = √3 · U · I   |   P = √3 · U · I · cos φ',
        standardRef: 'CEI 60038 / CEI 60076',
        assumptionsFr: [
          'Système triphasé équilibré en régime sinusoïdal permanent',
          'Tension composée U entre phases (Veff)',
          'Facteur de puissance inductif (charge usuelle)'
        ],
        assumptionsEn: [
          'Balanced 3-phase sinusoidal steady-state system',
          'Phase-to-phase line voltage U (Vrms)',
          'Lagging inductive power factor (typical grid load)'
        ],
        variables: [
          { symbol: 'U', nameFr: 'Tension composée entre phases', nameEn: 'Line-to-line voltage', unit: 'V', typicalRange: '400V - 225kV' },
          { symbol: 'I', nameFr: 'Courant de ligne par phase', nameEn: 'Line current per phase', unit: 'A', typicalRange: '10A - 2000A' },
          { symbol: 'cosPhi', nameFr: 'Facteur de puissance (cos φ)', nameEn: 'Power factor (cos φ)', unit: '-', typicalRange: '0.70 - 0.98' }
        ],
        defaultValues: {
          U: 400,
          I: 100,
          cosPhi: 0.85
        },
        calculateResult: (vals) => {
          const u = vals.U || 400;
          const i = vals.I || 100;
          const pf = vals.cosPhi || 0.85;
          const sVa = Math.sqrt(3) * u * i;
          const pW = sVa * pf;
          const pMw = pW / 1e6;
          return {
            resultValue: pMw < 0.1 ? pW / 1000 : pMw,
            unit: pMw < 0.1 ? 'kW' : 'MW',
            explanationFr: `Puissance active P = ${pMw < 0.1 ? (pW / 1000).toFixed(1) + ' kW' : pMw.toFixed(2) + ' MW'} (Puissance apparente S = ${(sVa / 1e6).toFixed(2)} MVA).`,
            explanationEn: `Active power P = ${pMw < 0.1 ? (pW / 1000).toFixed(1) + ' kW' : pMw.toFixed(2) + ' MW'} (Apparent power S = ${(sVa / 1e6).toFixed(2)} MVA).`
          };
        }
      };
  }
}
