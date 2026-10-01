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
          U: domainCode === 'D02' ? 225000 : domainCode === 'D06' ? 400 : 30000,
          I: domainCode === 'D02' ? 500 : domainCode === 'D06' ? 250 : 150,
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
