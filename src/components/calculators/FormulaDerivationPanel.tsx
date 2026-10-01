// src/components/calculators/FormulaDerivationPanel.tsx
// EPEDE — Formula Derivation Panel: shows IEC/IEEE formula behind each calculator
// Displays step-by-step derivation, variable table, sensitivity analysis, and unit converter

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, ChevronRight, RefreshCw,
  Sliders, ArrowLeftRight, Info, CheckCircle2, AlertTriangle
} from 'lucide-react';
import type { CalculatorTabType } from './services/calculationReportService';

// ─────────────────────────────────────────────────────────────────────────────
// Formula database: one entry per calculator tab
// ─────────────────────────────────────────────────────────────────────────────

interface FormulaStep {
  label: { fr: string; en: string };
  formula: string;        // LaTeX-style but displayed as plain text
  explanation: { fr: string; en: string };
}

interface VariableRow {
  symbol: string;
  name: { fr: string; en: string };
  unit: string;
  typical?: string;
}

interface SensitivityParam {
  key: string;
  label: { fr: string; en: string };
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  label: string;
}

interface FormulaEntry {
  title: { fr: string; en: string };
  standard: string;
  overview: { fr: string; en: string };
  steps: FormulaStep[];
  variables: VariableRow[];
  sensitivity?: SensitivityParam[];
  unitConversions?: UnitConversion[];
  warnings?: { fr: string; en: string }[];
}

const FORMULA_DB: Partial<Record<CalculatorTabType, FormulaEntry>> = {
  power: {
    title: { fr: 'Puissance Active / Réactive / Apparente — Triphasé', en: 'Active / Reactive / Apparent Power — Three-Phase' },
    standard: 'CEI 60038 / IEEE 1459',
    overview: {
      fr: 'Dans un réseau triphasé équilibré, la puissance active P (kW) représente l\'énergie réelle consommée, Q (kvar) la puissance réactive échangée avec les inductances/condensateurs, et S (kVA) la puissance apparente totale fournie par le réseau.',
      en: 'In a balanced three-phase system, active power P (kW) is the real energy consumed, Q (kvar) is the reactive power exchanged with inductors/capacitors, and S (kVA) is the total apparent power supplied by the network.',
    },
    steps: [
      {
        label: { fr: 'Courant de ligne', en: 'Line current' },
        formula: 'I = S / (√3 × U_L)',
        explanation: { fr: 'La puissance apparente triphasée S = √3 × U_L × I, donc I = S / (√3 × U_L)', en: 'Three-phase apparent power S = √3 × U_L × I, therefore I = S / (√3 × U_L)' },
      },
      {
        label: { fr: 'Puissance active', en: 'Active power' },
        formula: 'P = √3 × U_L × I × cos φ   [kW]',
        explanation: { fr: 'cos φ est le facteur de puissance. Pour une charge résistive pure cos φ = 1.', en: 'cos φ is the power factor. For a purely resistive load cos φ = 1.' },
      },
      {
        label: { fr: 'Puissance réactive', en: 'Reactive power' },
        formula: 'Q = √3 × U_L × I × sin φ   [kvar]',
        explanation: { fr: 'sin φ = √(1 - cos²φ). Q > 0 pour une charge inductive (moteur), Q < 0 pour une charge capacitive.', en: 'sin φ = √(1 - cos²φ). Q > 0 for inductive loads (motors), Q < 0 for capacitive loads.' },
      },
      {
        label: { fr: 'Puissance apparente', en: 'Apparent power' },
        formula: 'S = √(P² + Q²)   [kVA]',
        explanation: { fr: 'Le triangle des puissances. S est l\'hypoténuse, P la base et Q le côté vertical.', en: 'The power triangle. S is the hypotenuse, P the base and Q the vertical side.' },
      },
    ],
    variables: [
      { symbol: 'U_L', name: { fr: 'Tension de ligne', en: 'Line voltage' }, unit: 'kV', typical: '0.4 / 6.6 / 30 / 225' },
      { symbol: 'I', name: { fr: 'Courant de ligne', en: 'Line current' }, unit: 'A', typical: 'calculé' },
      { symbol: 'cos φ', name: { fr: 'Facteur de puissance', en: 'Power factor' }, unit: '—', typical: '0.80 – 0.95' },
      { symbol: 'P', name: { fr: 'Puissance active', en: 'Active power' }, unit: 'kW', typical: '—' },
      { symbol: 'Q', name: { fr: 'Puissance réactive', en: 'Reactive power' }, unit: 'kvar', typical: '—' },
      { symbol: 'S', name: { fr: 'Puissance apparente', en: 'Apparent power' }, unit: 'kVA', typical: '—' },
    ],
    sensitivity: [
      { key: 'pf', label: { fr: 'Facteur de puissance (cos φ)', en: 'Power factor (cos φ)' }, min: 0.5, max: 1.0, step: 0.01, default: 0.85, unit: '—' },
      { key: 'voltage', label: { fr: 'Tension de ligne (kV)', en: 'Line voltage (kV)' }, min: 0.4, max: 230, step: 0.1, default: 30, unit: 'kV' },
    ],
    unitConversions: [
      { from: 'kW', to: 'MW', factor: 0.001, label: '1 kW = 0.001 MW' },
      { from: 'kVA', to: 'kW', factor: 0.85, label: '1 kVA × cos φ = kW (at pf=0.85)' },
      { from: 'HP', to: 'kW', factor: 0.7457, label: '1 HP = 0.7457 kW' },
    ],
    warnings: [
      { fr: 'Valable uniquement pour un réseau triphasé équilibré. Pour des réseaux déséquilibrés appliquer IEEE 1459-2010.', en: 'Valid only for balanced three-phase systems. For unbalanced networks apply IEEE 1459-2010.' },
    ],
  },

  'voltage-drop': {
    title: { fr: 'Chute de Tension Câble — ΔU (CEI 60364-5-52)', en: 'Cable Voltage Drop — ΔU (IEC 60364-5-52)' },
    standard: 'CEI 60364-5-52 / NF C 15-105',
    overview: {
      fr: 'La chute de tension dans un câble est causée par les résistances (R) et réactances (X) de l\'âme conductrice. Elle est limitée à 3% pour l\'éclairage et 5% pour les autres usages par CEI 60364.',
      en: 'Voltage drop in a cable is caused by the conductor resistance (R) and reactance (X). It is limited to 3% for lighting and 5% for other uses by IEC 60364.',
    },
    steps: [
      {
        label: { fr: 'Résistance linéique', en: 'Linear resistance' },
        formula: 'r = ρ / S   [mΩ/m]',
        explanation: { fr: 'ρ = résistivité du conducteur (1/56 Ω·mm²/m pour cuivre, 1/35 pour aluminium). S = section en mm².', en: 'ρ = conductor resistivity (1/56 Ω·mm²/m for copper, 1/35 for aluminium). S = cross-section in mm².' },
      },
      {
        label: { fr: 'Chute de tension absolue (monophasé)', en: 'Absolute voltage drop (single-phase)' },
        formula: 'ΔU = 2 × I × L × (R×cosφ + X×sinφ)   [V]',
        explanation: { fr: 'Le facteur 2 tient compte de l\'aller-retour du courant (phase + neutre). L est la longueur en mètres.', en: 'Factor 2 accounts for both outgoing and return conductors (phase + neutral). L is length in metres.' },
      },
      {
        label: { fr: 'Chute de tension absolue (triphasé)', en: 'Absolute voltage drop (three-phase)' },
        formula: 'ΔU = √3 × I × L × (R×cosφ + X×sinφ)   [V]',
        explanation: { fr: 'Pour un circuit triphasé équilibré le facteur √3 remplace 2 (pas de courant de neutre dans le calcul aller-retour).', en: 'For a balanced three-phase circuit the √3 factor replaces 2 (no neutral return current in calculation).' },
      },
      {
        label: { fr: 'Chute de tension relative', en: 'Relative voltage drop' },
        formula: 'ΔU% = (ΔU / U_n) × 100   [%]',
        explanation: { fr: 'U_n = tension nominale du réseau. CEI 60364 limite ΔU% ≤ 3% (éclairage) et ΔU% ≤ 5% (autres).', en: 'U_n = nominal network voltage. IEC 60364 limits ΔU% ≤ 3% (lighting) and ΔU% ≤ 5% (others).' },
      },
    ],
    variables: [
      { symbol: 'ρ', name: { fr: 'Résistivité conducteur', en: 'Conductor resistivity' }, unit: 'Ω·mm²/m', typical: '1/56 (Cu) / 1/35 (Al)' },
      { symbol: 'S', name: { fr: 'Section câble', en: 'Cable cross-section' }, unit: 'mm²', typical: '35 / 95 / 240 mm²' },
      { symbol: 'L', name: { fr: 'Longueur', en: 'Length' }, unit: 'm', typical: '50 – 500' },
      { symbol: 'I', name: { fr: 'Courant de charge', en: 'Load current' }, unit: 'A', typical: '—' },
      { symbol: 'cos φ', name: { fr: 'Facteur de puissance', en: 'Power factor' }, unit: '—', typical: '0.85' },
      { symbol: 'X', name: { fr: 'Réactance linéique', en: 'Linear reactance' }, unit: 'mΩ/m', typical: '0.08 – 0.12' },
    ],
    unitConversions: [
      { from: 'mm²', to: 'AWG', factor: 1, label: '240 mm² ≈ AWG 500 kcmil' },
      { from: 'mΩ/m', to: 'Ω/km', factor: 1, label: '1 mΩ/m = 1 Ω/km' },
    ],
    warnings: [
      { fr: 'La réactance X est négligeable pour des câbles < 35 mm² ou des longueurs < 50 m.', en: 'Reactance X is negligible for cables < 35 mm² or lengths < 50 m.' },
      { fr: 'À 90°C, la résistivité du cuivre augmente de ~20% par rapport à 20°C.', en: 'At 90°C, copper resistivity increases by ~20% compared to 20°C.' },
    ],
  },

  transformer: {
    title: { fr: 'Courant de Court-Circuit Transformateur — Isc (CEI 60909)', en: 'Transformer Short-Circuit Current — Isc (IEC 60909)' },
    standard: 'CEI 60909 / CEI 60076',
    overview: {
      fr: 'Le courant de court-circuit au secondaire d\'un transformateur est déterminé par sa puissance nominale Sn, sa tension de court-circuit Ucc%, et la tension nominale secondaire U2n. CEI 60909 est la norme de référence mondiale pour le calcul des courants de défaut.',
      en: 'The short-circuit current at the secondary of a transformer is determined by its rated power Sn, short-circuit voltage Ucc%, and secondary rated voltage U2n. IEC 60909 is the world reference standard for fault current calculations.',
    },
    steps: [
      {
        label: { fr: 'Courant nominal secondaire', en: 'Rated secondary current' },
        formula: 'I2n = Sn / (√3 × U2n)   [A]',
        explanation: { fr: 'Courant de plein charge au secondaire à la tension nominale U2n.', en: 'Full-load secondary current at rated voltage U2n.' },
      },
      {
        label: { fr: 'Impédance de court-circuit', en: 'Short-circuit impedance' },
        formula: 'Zcc = Ucc% × U2n² / Sn   [Ω]',
        explanation: { fr: 'Ucc% est la tension de court-circuit exprimée en %. Elle est inscrite sur la plaque signalétique du transformateur.', en: 'Ucc% is the short-circuit voltage in %. It is listed on the transformer nameplate.' },
      },
      {
        label: { fr: 'Courant de court-circuit triphasé (symétrique)', en: 'Three-phase short-circuit current (symmetrical)' },
        formula: 'Isc3 = I2n / (Ucc% / 100) = Sn / (√3 × U2n × Ucc%)   [kA]',
        explanation: { fr: 'C\'est le courant maximal pour un court-circuit triphasé franc en bornes secondaires. Multiplier par le facteur c de CEI 60909 (c=1.0 ou c=1.1 selon tension).', en: 'Maximum current for a bolted three-phase fault at secondary terminals. Multiply by IEC 60909 voltage factor c (c=1.0 or c=1.1 depending on voltage level).' },
      },
    ],
    variables: [
      { symbol: 'Sn', name: { fr: 'Puissance nominale', en: 'Rated power' }, unit: 'kVA', typical: '1600 / 10 000 / 63 000' },
      { symbol: 'U2n', name: { fr: 'Tension secondaire nominale', en: 'Secondary rated voltage' }, unit: 'kV', typical: '0.4 / 6.6 / 30' },
      { symbol: 'Ucc%', name: { fr: 'Tension de court-circuit', en: 'Short-circuit voltage' }, unit: '%', typical: '4% (BT/MT) / 8–12% (THT)' },
      { symbol: 'Isc3', name: { fr: 'Courant Icc triphasé', en: 'Three-phase Isc' }, unit: 'kA', typical: '—' },
      { symbol: 'c', name: { fr: 'Facteur de tension CEI 60909', en: 'IEC 60909 voltage factor' }, unit: '—', typical: '1.0 (BT) / 1.1 (HTA/HTB)' },
    ],
    warnings: [
      { fr: 'Le courant de court-circuit réel inclut l\'impédance amont du réseau. Sans réseau infini, Isc réel < Isc calculé ici.', en: 'The actual short-circuit current includes upstream network impedance. Without an infinite busbar, actual Isc < calculated Isc here.' },
      { fr: 'CEI 60909 impose c=1.0 pour BT et c=1.1 pour HTA/HTB dans les calculs de courant maximum.', en: 'IEC 60909 mandates c=1.0 for LV and c=1.1 for MV/HV in maximum current calculations.' },
    ],
  },

  motor: {
    title: { fr: 'Démarrage Moteur Asynchrone & Courant d\'Appel (CEI 60034-12)', en: 'Induction Motor Starting & Inrush Current (IEC 60034-12)' },
    standard: 'CEI 60034-12 / IEEE 399 (Brown Book)',
    overview: {
      fr: 'Lors du démarrage direct (DOL) d\'un moteur asynchrone triphasé, le courant d\'appel atteint 5 à 8 fois le courant nominal, provoquant une chute de tension transitoire sur le jeu de barres d\'alimentation pouvant perturber les autres équipements connectés.',
      en: 'During direct-on-line (DOL) starting of a three-phase induction motor, inrush current reaches 5 to 8 times the rated current, causing a transient bus voltage drop that can impact other connected loads.',
    },
    steps: [
      {
        label: { fr: 'Courant nominal moteur', en: 'Rated motor current' },
        formula: 'In = Pn / (√3 × Un × η × cos φ)   [A]',
        explanation: { fr: 'Pn = puissance mécanique utile à l\'arbre (kW), η = rendement électromécanique, cos φ = facteur de puissance nominal.', en: 'Pn = shaft mechanical power (kW), η = electromechanical efficiency, cos φ = rated power factor.' },
      },
      {
        label: { fr: 'Courant de démarrage direct (DOL)', en: 'Direct-on-line start current' },
        formula: 'Id = k_dem × In   [A]',
        explanation: { fr: 'k_dem = ratio de courant de démarrage (généralement 6.0 à 7.5 pour moteurs classe N selon CEI 60034-12).', en: 'k_dem = starting current ratio (typically 6.0 to 7.5 for Design N motors per IEC 60034-12).' },
      },
      {
        label: { fr: 'Puissance apparente au démarrage', en: 'Apparent power at starting' },
        formula: 'S_dem = √3 × Un × Id   [kVA]',
        explanation: { fr: 'Puissance apparente transitoire appelée au réseau pendant la phase d\'accélération rotorique.', en: 'Transient apparent power drawn from the grid during rotor acceleration.' },
      },
      {
        label: { fr: 'Chute de tension transitoire au jeu de barres', en: 'Transient busbar voltage drop' },
        formula: 'ΔU_dem% = [S_dem / (Ssc_reseau + S_dem)] × 100   [%]',
        explanation: { fr: 'Ssc_reseau = puissance de court-circuit au jeu de barres. La norme limite généralement cette chute à 10% (ou 15% cas exceptionnel).', en: 'Ssc_reseau = busbar short-circuit power. Standards typically limit transient dip to 10% (15% exceptional).' },
      },
    ],
    variables: [
      { symbol: 'Pn', name: { fr: 'Puissance utile moteur', en: 'Motor shaft power' }, unit: 'kW', typical: '15 / 75 / 250 / 1200' },
      { symbol: 'Un', name: { fr: 'Tension assignée', en: 'Rated voltage' }, unit: 'V', typical: '400 / 690 / 6600' },
      { symbol: 'k_dem', name: { fr: 'Ratio courant démarrage Id/In', en: 'Starting current ratio Id/In' }, unit: '—', typical: '5.5 – 7.5' },
      { symbol: 'η', name: { fr: 'Rendement moteur', en: 'Motor efficiency' }, unit: '—', typical: '0.92 – 0.96' },
      { symbol: 'cos φ', name: { fr: 'Facteur de puissance nominal', en: 'Rated power factor' }, unit: '—', typical: '0.84 – 0.89' },
    ],
    sensitivity: [
      { key: 'k_dem', label: { fr: 'Ratio Id/In', en: 'Id/In ratio' }, min: 4.0, max: 8.5, step: 0.1, default: 6.5, unit: '—' },
      { key: 'power', label: { fr: 'Puissance (kW)', en: 'Power (kW)' }, min: 5, max: 500, step: 5, default: 110, unit: 'kW' },
    ],
    unitConversions: [
      { from: 'kW', to: 'HP', factor: 1.341, label: '1 kW = 1.341 HP' },
      { from: 'HP', to: 'kW', factor: 0.746, label: '1 HP = 0.746 kW' },
    ],
    warnings: [
      { fr: 'Pour un démarrage étoile-triangle, le courant et le couple sont divisés par 3 par rapport au démarrage direct.', en: 'For star-delta starting, both inrush current and starting torque are divided by 3 compared to DOL.' },
      { fr: 'Vérifier la tenue thermique du câble pendant le temps de démarrage (temps rotor bloqué).', en: 'Verify cable thermal withstand during starting acceleration time (locked-rotor time).' },
    ],
  },

  sil: {
    title: { fr: 'Surge Impedance Loading (SIL) & Effet Ferranti (CIGRE TB 575)', en: 'Surge Impedance Loading & Ferranti Effect (CIGRE TB 575)' },
    standard: 'CIGRE TB 575 / CEI 60826',
    overview: {
      fr: 'La puissance naturelle d\'une ligne de transport (SIL) correspond à la charge pour laquelle la production de puissance réactive capacitive par les isolants équilibre exactement la consommation réactive inductive des conducteurs.',
      en: 'Surge Impedance Loading (SIL) of a transmission line is the load at which line capacitive reactive generation exactly balances inductive reactive consumption.',
    },
    steps: [
      {
        label: { fr: 'Impédance caractéristique d\'onde', en: 'Surge characteristic impedance' },
        formula: 'Zc = √(L / C)   [Ω]',
        explanation: { fr: 'L = inductance linéique (H/km), C = capacité linéique (F/km). Ligne aérienne : Zc ≈ 250–400 Ω. Câble souterrain : Zc ≈ 30–50 Ω.', en: 'L = line inductance (H/km), C = line capacitance (F/km). Overhead lines: Zc ≈ 250–400 Ω. Underground cables: Zc ≈ 30–50 Ω.' },
      },
      {
        label: { fr: 'Puissance naturelle de transit (SIL)', en: 'Surge Impedance Loading (SIL)' },
        formula: 'SIL = Un² / Zc   [MW]',
        explanation: { fr: 'À P = SIL, le profil de tension est parfaitement plat le long de la ligne, sans échange de réactif avec les extrémités.', en: 'At P = SIL, voltage profile is flat along the line, with zero net reactive exchange with terminals.' },
      },
      {
        label: { fr: 'Surélévation de tension Ferranti à vide', en: 'No-load Ferranti voltage rise' },
        formula: 'ΔU_ferranti% ≈ [(ω² × L_total × C_total) / 2] × 100   [%]',
        explanation: { fr: 'À vide ou faible charge, la capacité shunt de la ligne THT élève la tension au bout de ligne (phénomène critique sur le réseau 225 kV RIS).', en: 'At no load, line charging shunt capacitance raises terminal voltage (critical phenomenon on 225 kV RIS corridor).' },
      },
    ],
    variables: [
      { symbol: 'Un', name: { fr: 'Tension assignée ligne', en: 'Rated line voltage' }, unit: 'kV', typical: '90 / 225 / 400' },
      { symbol: 'Zc', name: { fr: 'Impédance caractéristique', en: 'Surge impedance' }, unit: 'Ω', typical: '280 – 380 (aérien)' },
      { symbol: 'L_km', name: { fr: 'Longueur de la ligne', en: 'Line length' }, unit: 'km', typical: '120 – 350' },
      { symbol: 'SIL', name: { fr: 'Puissance naturelle', en: 'Surge impedance load' }, unit: 'MW', typical: '135 MW (225 kV)' },
    ],
    sensitivity: [
      { key: 'voltage', label: { fr: 'Tension ligne (kV)', en: 'Line voltage (kV)' }, min: 63, max: 400, step: 1, default: 225, unit: 'kV' },
      { key: 'zc', label: { fr: 'Impédance d\'onde Zc (Ω)', en: 'Surge impedance Zc (Ω)' }, min: 200, max: 450, step: 5, default: 350, unit: 'Ω' },
    ],
    warnings: [
      { fr: 'Pour les lignes 225 kV longues (> 150 km comme Songloulou-Mangombé), des réactances shunt sont indispensables pour absorber les Mvar à vide.', en: 'For long 225 kV corridors (> 150 km), shunt reactors are required to absorb capacitive Mvars during light load.' },
    ],
  },

  earthing: {
    title: { fr: 'Mise à la Terre Poste — IEEE Std 80 / CEI 61936-1', en: 'Substation Grounding — IEEE Std 80 / IEC 61936-1' },
    standard: 'IEEE Std 80-2013 / CEI 61936-1',
    overview: {
      fr: 'Le calcul de la mise à la terre d\'un poste vise à garantir que les tensions de contact (Vc) et de pas (Vp) restent inférieures aux valeurs tolérables pour un corps humain de 50 kg ou 70 kg lors d\'un défaut monophasé à la terre.',
      en: 'Substation grounding design ensures that touch voltage (Vc) and step voltage (Vp) remain below tolerable values for a 50 kg or 70 kg human body during a single-phase-to-ground fault.',
    },
    steps: [
      {
        label: { fr: 'Tension de contact tolérable (70 kg)', en: 'Tolerable touch voltage (70 kg)' },
        formula: 'Vtouche = (1000 + 1.5 × ρs) × 0.157 / √t_f   [V]',
        explanation: { fr: 'ρs = résistivité de la couche de surface (gravier, asphalte). t_f = durée du défaut en secondes. 0.157 = constante pour 70 kg selon IEEE 80 Table 4.', en: 'ρs = surface layer resistivity (gravel, asphalt). t_f = fault duration in seconds. 0.157 = constant for 70 kg per IEEE 80 Table 4.' },
      },
      {
        label: { fr: 'Résistance de la grille de terre', en: 'Ground grid resistance' },
        formula: 'Rg ≈ ρ × (1/L + 1/√(20×A))   [Ω]',
        explanation: { fr: 'Formule de Schwarz simplifiée. ρ = résistivité du sol (Ω·m). L = longueur totale des conducteurs (m). A = surface du poste (m²).', en: 'Simplified Schwarz formula. ρ = soil resistivity (Ω·m). L = total conductor length (m). A = substation area (m²).' },
      },
      {
        label: { fr: 'Élévation de potentiel de terre (GPR)', en: 'Ground potential rise (GPR)' },
        formula: 'GPR = Ig × Rg   [V]',
        explanation: { fr: 'Ig = courant de défaut à la terre (A). GPR peut atteindre plusieurs kV dans les postes HTB.', en: 'Ig = ground fault current (A). GPR can reach several kV in HV substations.' },
      },
    ],
    variables: [
      { symbol: 'ρ', name: { fr: 'Résistivité du sol', en: 'Soil resistivity' }, unit: 'Ω·m', typical: '50 – 500' },
      { symbol: 'A', name: { fr: 'Surface du poste', en: 'Substation area' }, unit: 'm²', typical: '5 000 – 50 000' },
      { symbol: 'L', name: { fr: 'Longueur totale conducteurs grille', en: 'Total grid conductor length' }, unit: 'm', typical: '500 – 5 000' },
      { symbol: 'Ig', name: { fr: 'Courant de défaut à la terre', en: 'Ground fault current' }, unit: 'kA', typical: '5 – 40' },
      { symbol: 't_f', name: { fr: 'Durée du défaut', en: 'Fault duration' }, unit: 's', typical: '0.1 – 0.5' },
    ],
    warnings: [
      { fr: 'La résistivité du sol varie avec l\'humidité et la saison. Effectuer les mesures à la saison sèche pour le cas défavorable.', en: 'Soil resistivity varies with moisture and season. Measure during dry season for worst-case design.' },
    ],
  },

  'arc-flash': {
    title: { fr: 'Énergie Incidente Arc Flash & Périmètres (IEEE 1584-2018)', en: 'Arc Flash Incident Energy & Boundaries (IEEE 1584-2018)' },
    standard: 'IEEE 1584-2018 / NFPA 70E',
    overview: {
      fr: 'Calcule l\'énergie incidente thermique (cal/cm²) dégagée lors d\'un arc électrique de court-circuit selon le modèle IEEE 1584-2018, déterminant la frontière de protection et la catégorie d\'EPI (Équipement de Protection Individuelle) requise.',
      en: 'Calculates incident thermal energy (cal/cm²) released during an arcing fault per IEEE 1584-2018, establishing the arc flash boundary and required PPE category.',
    },
    steps: [
      {
        label: { fr: 'Courant d\'arc estimé', en: 'Estimated arcing current' },
        formula: 'I_arc = f(Ibf, V, G, CF)   [kA]',
        explanation: { fr: 'Ibf = courant de court-circuit franc, G = écartement des électrodes (mm), CF = configuration des électrodes (VCB, VCBB, HCB, VOA).', en: 'Ibf = bolted fault current, G = electrode gap (mm), CF = electrode configuration (VCB, VCBB, HCB, VOA).' },
      },
      {
        label: { fr: 'Énergie incidente à la distance de travail', en: 'Incident energy at working distance' },
        formula: 'E = 4.184 × Cf × En × (t_arc / 0.2) × (610^x / D^x)   [cal/cm²]',
        explanation: { fr: 'D = distance de travail (mm, typ. 455 mm pour TGBT), t_arc = temps d\'élimination par la protection amont (s), x = exposant de distance.', en: 'D = working distance (mm, typ. 455 mm for LV switchboard), t_arc = clearing time of upstream protection (s), x = distance exponent.' },
      },
      {
        label: { fr: 'Frontière d\'éclair d\'arc (Périmètre de sécurité)', en: 'Arc flash boundary' },
        formula: 'AFB = [4.184 × Cf × En × (t_arc / 0.2) × (610^x / 1.2)]^(1/x)   [mm]',
        explanation: { fr: 'Distance à laquelle l\'énergie incidente chute à 1.2 cal/cm² (seuil de brûlure au 2ème degré sans EPI).', en: 'Distance at which incident energy drops to 1.2 cal/cm² (threshold for 2nd degree burn without PPE).' },
      },
    ],
    variables: [
      { symbol: 'Ibf', name: { fr: 'Courant de court-circuit franc', en: 'Bolted fault current' }, unit: 'kA', typical: '15 – 65' },
      { symbol: 't_arc', name: { fr: 'Temps d\'élimination protection', en: 'Arc clearing time' }, unit: 's', typical: '0.05 – 0.40' },
      { symbol: 'D', name: { fr: 'Distance de travail', en: 'Working distance' }, unit: 'mm', typical: '455 (BT) / 610 (HTA)' },
      { symbol: 'E', name: { fr: 'Énergie incidente', en: 'Incident energy' }, unit: 'cal/cm²', typical: '—' },
      { symbol: 'AFB', name: { fr: 'Frontière Arc Flash', en: 'Arc flash boundary' }, unit: 'mm', typical: '—' },
    ],
    sensitivity: [
      { key: 't_arc', label: { fr: 'Temps déclenchement (s)', en: 'Clearing time (s)' }, min: 0.03, max: 1.0, step: 0.01, default: 0.15, unit: 's' },
      { key: 'distance', label: { fr: 'Distance travail (mm)', en: 'Working distance (mm)' }, min: 300, max: 1200, step: 25, default: 455, unit: 'mm' },
    ],
    unitConversions: [
      { from: 'cal/cm²', to: 'J/cm²', factor: 4.184, label: '1 cal/cm² = 4.184 J/cm²' },
    ],
    warnings: [
      { fr: 'NFPA 70E classe en 4 catégories : Cat 1 (≤ 4 cal/cm²), Cat 2 (≤ 8 cal/cm²), Cat 3 (≤ 25 cal/cm²), Cat 4 (≤ 40 cal/cm²). Au-delà de 40 cal/cm², travail sous tension formellement interdit !', en: 'NFPA 70E specifies 4 PPE categories: Cat 1 (≤ 4), Cat 2 (≤ 8), Cat 3 (≤ 25), Cat 4 (≤ 40 cal/cm²). Above 40 cal/cm², energized work is strictly prohibited!' },
    ],
  },

  'ct-sizing': {
    title: { fr: 'Dimensionnement TC & Saturation Coude Vk (CEI 61869-2)', en: 'CT Sizing & Knee-Point Saturation (IEC 61869-2)' },
    standard: 'CEI 61869-2 / ANSI C37.110',
    overview: {
      fr: 'Vérifie que la tension de coude Vk du transformateur de courant de protection (classe 5P, 10P ou PX) est suffisante pour éviter la saturation magnétique sous le courant de court-circuit maximal incluant la composante apériodique continue (facteur Ktd).',
      en: 'Verifies that the knee-point voltage Vk of the protective current transformer (Class 5P, 10P, or PX) is sufficient to prevent saturation under maximum fault current including DC offset (Ktd factor).',
    },
    steps: [
      {
        label: { fr: 'Facteur de surintensité nominal (ALF)', en: 'Accuracy limit factor (ALF)' },
        formula: 'ALF_reel = ALF_nom × [(Rct + Rburden_nom) / (Rct + Rburden_reel)]',
        explanation: { fr: 'Le facteur limite de précision effectif augmente lorsque le fardeau réel est inférieur au fardeau nominal.', en: 'Effective accuracy limit factor increases when actual secondary burden is lower than rated burden.' },
      },
      {
        label: { fr: 'Tension de coude minimale requise (Vk)', en: 'Required knee-point voltage' },
        formula: 'Vk ≥ Ktd × Isc_max × (Isn / Ipn) × (Rct + 2×Rfils + Rrelais)   [V]',
        explanation: { fr: 'Ktd = facteur transitoire de dimensionnement (1.0 pour protection surintensité temporisée, 2.0–5.0 pour protection différentielle rapide).', en: 'Ktd = transient dimensioning factor (1.0 for time-overcurrent, 2.0–5.0 for fast differential protection).' },
      },
    ],
    variables: [
      { symbol: 'Isc_max', name: { fr: 'Icc primaire maximal', en: 'Max primary fault current' }, unit: 'kA', typical: '12.5 / 25 / 31.5' },
      { symbol: 'Ipn / Isn', name: { fr: 'Rapport de transformation', en: 'CT transformation ratio' }, unit: 'A/A', typical: '600/5 ou 1000/1' },
      { symbol: 'Rct', name: { fr: 'Résistance secondaire TC', en: 'Secondary winding resistance' }, unit: 'Ω', typical: '0.2 – 5.0' },
      { symbol: 'Rburden', name: { fr: 'Résistance fardeau boucle', en: 'Total loop burden resistance' }, unit: 'Ω', typical: '0.1 – 2.5' },
      { symbol: 'Ktd', name: { fr: 'Facteur transitoire DC', en: 'Transient factor Ktd' }, unit: '—', typical: '1.0 à 4.0' },
    ],
    sensitivity: [
      { key: 'isc', label: { fr: 'Icc Max (kA)', en: 'Max fault current (kA)' }, min: 5, max: 50, step: 1, default: 25, unit: 'kA' },
      { key: 'ktd', label: { fr: 'Facteur Ktd', en: 'Ktd factor' }, min: 1.0, max: 6.0, step: 0.5, default: 2.0, unit: '—' },
    ],
    warnings: [
      { fr: 'Ne jamais laisser le secondaire d\'un TC en circuit ouvert sous tension : risque de surtension mortelle de plusieurs kilovolts.', en: 'Never open-circuit the secondary of an energized CT: risk of fatal multi-kilovolt voltage spikes.' },
    ],
  },

  pfc: {
    title: { fr: 'Compensation Réactive & Batterie Condensateurs (CEI 60831)', en: 'Power Factor Correction & Capacitor Bank Sizing (IEC 60831)' },
    standard: 'CEI 60831 / IEEE 18',
    overview: {
      fr: 'Détermine la puissance réactive capacitive Qc (kvar) nécessaire pour relever le facteur de puissance d\'une installation d\'une valeur initiale cos φ1 vers un objectif cos φ2 (typiquement 0.95 ou 0.98), évitant les pénalités pour consommation excessive d\'énergie réactive.',
      en: 'Determines the capacitive reactive power Qc (kvar) needed to raise the power factor from initial cos φ1 to target cos φ2 (typically 0.95 or 0.98), avoiding utility reactive energy penalties.',
    },
    steps: [
      {
        label: { fr: 'Puissance réactive de compensation', en: 'Required reactive compensation power' },
        formula: 'Qc = P × (tan φ1 - tan φ2)   [kvar]',
        explanation: { fr: 'P = puissance active consommée (kW). tan φ = √(1 - cos²φ) / cos φ.', en: 'P = active power consumed (kW). tan φ = √(1 - cos²φ) / cos φ.' },
      },
      {
        label: { fr: 'Courant capacitif nominal', en: 'Rated capacitor current' },
        formula: 'Ic = Qc / (√3 × Un)   [A]',
        explanation: { fr: 'Courant assigné absorbé par les gradins de condensateurs à la tension de réseau Un.', en: 'Rated current drawn by the capacitor steps at grid voltage Un.' },
      },
      {
        label: { fr: 'Fréquence de résonance parallèle avec le réseau', en: 'Parallel harmonic resonance frequency' },
        formula: 'f_res = fn × √(Ssc / Qc)   [Hz]',
        explanation: { fr: 'Ssc = puissance de court-circuit au jeu de barres. Si f_res est proche d\'un rang harmonique présent (rang 5 ou 7), installer des selfs anti-harmoniques.', en: 'Ssc = short-circuit MVA at bus. If f_res aligns with harmonic orders (5th or 7th), detuning reactors must be added.' },
      },
    ],
    variables: [
      { symbol: 'P', name: { fr: 'Puissance active de charge', en: 'Active load power' }, unit: 'kW', typical: '100 – 2500' },
      { symbol: 'cos φ1', name: { fr: 'Facteur de puissance initial', en: 'Initial power factor' }, unit: '—', typical: '0.70 – 0.82' },
      { symbol: 'cos φ2', name: { fr: 'Facteur de puissance cible', en: 'Target power factor' }, unit: '—', typical: '0.95 – 0.98' },
      { symbol: 'Qc', name: { fr: 'Puissance batterie de condensateurs', en: 'Capacitor bank rating' }, unit: 'kvar', typical: 'calculé' },
    ],
    sensitivity: [
      { key: 'target_pf', label: { fr: 'cos φ cible', en: 'Target cos φ' }, min: 0.90, max: 0.99, step: 0.01, default: 0.95, unit: '—' },
      { key: 'active_p', label: { fr: 'Puissance P (kW)', en: 'Active P (kW)' }, min: 50, max: 2000, step: 50, default: 400, unit: 'kW' },
    ],
    warnings: [
      { fr: 'Si le taux d\'harmoniques en tension THDu > 3%, une batterie avec réactance de désaccordage (self anti-harmonique à 7% ou 14%) est obligatoire.', en: 'If voltage total harmonic distortion THDu > 3%, detuned reactors (7% or 14% detuning) are mandatory.' },
    ],
  },

  'solar-sizing': {
    title: { fr: 'Dimensionnement Centrale Solaire PV & Onduleur (CEI 62548)', en: 'Solar PV Array & Inverter Sizing (IEC 62548)' },
    standard: 'CEI 62548 / CEI 61215 / IEEE 2800',
    overview: {
      fr: 'Calcule le nombre de modules en série par chaîne (string) pour respecter la plage MPPT de l\'onduleur entre les températures extrêmes, ainsi que le dimensionnement de la puissance crête DC/AC.',
      en: 'Calculates the number of PV modules per string to ensure voltage stays within inverter MPPT window across extreme ambient temperatures, and establishes DC/AC oversizing ratio.',
    },
    steps: [
      {
        label: { fr: 'Tension circuit ouvert maximale (froid)', en: 'Max open-circuit voltage (cold)' },
        formula: 'Voc_max = Voc_stc × [1 + γ_voc × (Tmin - 25)]   [V]',
        explanation: { fr: 'γ_voc = coefficient de température de Voc (%/°C, typ. -0.28%/°C). Tmin = température ambiante minimale de site.', en: 'γ_voc = temperature coefficient of Voc (%/°C, typ. -0.28%/°C). Tmin = site minimum ambient temperature.' },
      },
      {
        label: { fr: 'Nombre maximal de modules en série', en: 'Max modules in series' },
        formula: 'N_max = Floor(Vdc_max_onduleur / Voc_max)',
        explanation: { fr: 'Garantit que la chaîne ne dépasse jamais la tension maximale absolue admissible par l\'onduleur (1000 V ou 1500 V).', en: 'Ensures the string never exceeds the inverter maximum DC input voltage rating (1000 V or 1500 V).' },
      },
      {
        label: { fr: 'Ratio de surdimensionnement DC/AC (ILR)', en: 'Inverter Loading Ratio (ILR)' },
        formula: 'ILR = Pdc_crete / Pac_nom',
        explanation: { fr: 'Ratio typique entre 1.15 et 1.35 pour optimiser le facteur de charge de l\'onduleur sans écrêtage excessif.', en: 'Typical ratio between 1.15 and 1.35 to maximize inverter capacity factor with minimal clipping.' },
      },
    ],
    variables: [
      { symbol: 'Pdc_module', name: { fr: 'Puissance unitaire module', en: 'Module rated power' }, unit: 'Wc', typical: '450 – 650' },
      { symbol: 'Voc_stc', name: { fr: 'Tension circuit ouvert STC', en: 'STC open-circuit voltage' }, unit: 'V', typical: '41 – 50' },
      { symbol: 'Vmp_stc', name: { fr: 'Tension MPP STC', en: 'STC MPP voltage' }, unit: 'V', typical: '34 – 42' },
      { symbol: 'Vdc_max', name: { fr: 'Tension max onduleur', en: 'Inverter max DC voltage' }, unit: 'V', typical: '1000 ou 1500' },
    ],
    sensitivity: [
      { key: 'tmin', label: { fr: 'Température min (°C)', en: 'Min temperature (°C)' }, min: -10, max: 25, step: 1, default: 15, unit: '°C' },
    ],
    warnings: [
      { fr: 'Au Cameroun (Maroua/Guider), les fortes températures réduisent la tension Vmp en journée : vérifier que Vmp_min > Vmppt_min de l\'onduleur.', en: 'In Northern Cameroon (Maroua/Guider), high daytime temperatures lower Vmp: verify Vmp_min remains above inverter Vmppt_min.' },
    ],
  },

  'bess-sizing': {
    title: { fr: 'Dimensionnement Stockage BESS & C-Rate (CEI 62933)', en: 'BESS Battery Energy Storage Sizing & C-Rate (IEC 62933)' },
    standard: 'CEI 62933 / IEEE 2800 / NFPA 855',
    overview: {
      fr: 'Dimensionne la puissance (MW) et la capacité énergétique utile (MWh) d\'un système BESS en tenant compte de la profondeur de décharge (DoD), du rendement de conversion (RTE) et du régime de décharge C-rate.',
      en: 'Sizes BESS power (MW) and usable energy capacity (MWh) considering Depth of Discharge (DoD), Round-Trip Efficiency (RTE), and discharge C-rate.',
    },
    steps: [
      {
        label: { fr: 'Capacité nominale brute de batterie', en: 'Gross battery installed capacity' },
        formula: 'E_nom = E_utile / (DoD × RTE_batt × SOH_eol)   [MWh]',
        explanation: { fr: 'DoD = profondeur de décharge (typ. 80–90%), RTE = rendement aller-retour (typ. 88%), SOH_eol = santé en fin de vie (typ. 80%).', en: 'DoD = depth of discharge (typ. 80–90%), RTE = round-trip efficiency (typ. 88%), SOH_eol = end-of-life state of health (typ. 80%).' },
      },
      {
        label: { fr: 'Régime de décharge C-Rate', en: 'Discharge C-Rate' },
        formula: 'C_rate = P_decharge / E_nom   [1/h]',
        explanation: { fr: 'Exemple : décharge de 10 MW pendant 2h sur 20 MWh correspond à un régime 0.5C.', en: 'Example: 10 MW output for 2h from 20 MWh battery corresponds to a 0.5C rate.' },
      },
    ],
    variables: [
      { symbol: 'P_bess', name: { fr: 'Puissance onduleur BESS', en: 'BESS converter power' }, unit: 'MW', typical: '5 / 15 / 50' },
      { symbol: 'E_nom', name: { fr: 'Capacité énergétique brute', en: 'Gross storage capacity' }, unit: 'MWh', typical: '10 / 30 / 100' },
      { symbol: 'DoD', name: { fr: 'Profondeur de décharge', en: 'Depth of discharge' }, unit: '%', typical: '80 – 90%' },
      { symbol: 'RTE', name: { fr: 'Rendement aller-retour', en: 'Round-trip efficiency' }, unit: '%', typical: '85 – 92%' },
    ],
    warnings: [
      { fr: 'NFPA 855 impose un système anti-emballement thermique certifié UL 9540A et un espacement de 1 m entre racks batterie.', en: 'NFPA 855 mandates UL 9540A thermal runaway mitigation and 1 m separation between battery enclosures.' },
    ],
  },

  'surge-arrester': {
    title: { fr: 'Coordination Parafoudres ZnO (CEI 60099-4 / CEI 60071-2)', en: 'ZnO Surge Arrester Sizing (IEC 60099-4 / IEC 60071-2)' },
    standard: 'CEI 60099-4 / CEI 60071-1 & 2',
    overview: {
      fr: 'Calcule la tension continue maximale de service Uc, la tension assignée Ur, le niveau de protection Up et la classe de décharge thermique des parafoudres à oxyde de zinc (ZnO) sans éclateur pour la protection des transformateurs et appareillages.',
      en: 'Calculates maximum continuous operating voltage Uc, rated voltage Ur, protection level Up, and thermal energy capability of gapless ZnO surge arresters protecting transformers and GIS.',
    },
    steps: [
      {
        label: { fr: 'Tension continue de service minimale (Uc)', en: 'Minimum continuous voltage (Uc)' },
        formula: 'Uc ≥ Us / √3   [kV]',
        explanation: { fr: 'Us = tension maximale du réseau (ex. 245 kV pour un réseau 225 kV, soit Uc ≥ 141.5 kV).', en: 'Us = maximum network voltage (e.g., 245 kV for a 225 kV grid, yielding Uc ≥ 141.5 kV).' },
      },
      {
        label: { fr: 'Tension assignée au sursaut TOV (Ur)', en: 'Rated TOV voltage (Ur)' },
        formula: 'Ur ≥ (Us / √3) × Ke / Ktov   [kV]',
        explanation: { fr: 'Ke = facteur de défaut à la terre (1.4 pour réseau à neutre directement à la terre, 1.73 pour neutre impédant). Ktov = facteur de tenue thermique temporaire.', en: 'Ke = earth fault factor (1.4 for solidly grounded grid, 1.73 for isolated/impedant neutral). Ktov = TOV withstand capability.' },
      },
      {
        label: { fr: 'Marge de protection à l\'onde de foudre', en: 'Lightning protection margin' },
        formula: 'Marge_choc% = [(BIL - Up_choc) / Up_choc] × 100   [%]',
        explanation: { fr: 'BIL = tenue au choc de foudre de l\'équipement protégé (ex. 1050 kV pour transfo 225 kV). CEI 60071 recommande une marge ≥ 20%.', en: 'BIL = basic lightning impulse insulation level (e.g. 1050 kV for 225 kV transformer). IEC 60071 recommends margin ≥ 20%.' },
      },
    ],
    variables: [
      { symbol: 'Us', name: { fr: 'Tension max de service', en: 'Max service voltage' }, unit: 'kV', typical: '36 / 100 / 245' },
      { symbol: 'BIL', name: { fr: 'Niveau choc de foudre', en: 'Basic impulse level' }, unit: 'kV', typical: '170 / 450 / 1050' },
      { symbol: 'In_choc', name: { fr: 'Courant nominal de décharge', en: 'Nominal discharge current' }, unit: 'kA', typical: '10 ou 20 kA (8/20 µs)' },
    ],
    warnings: [
      { fr: 'Placer le parafoudre au plus près des traversées du transformateur pour limiter l\'onde réfléchie due à la distance de séparation.', en: 'Install surge arrester as close as possible to transformer bushings to minimize separation distance reflection peak.' },
    ],
  },

  'busbar-electrodynamic': {
    title: { fr: 'Efforts Électrodynamiques Jeu de Barres (CEI 60865-1)', en: 'Busbar Electrodynamic Forces & Stress (IEC 60865-1)' },
    standard: 'CEI 60865-1 / CEI 61936-1',
    overview: {
      fr: 'Calcule les efforts mécaniques crête d\'attraction/répulsion électrodynamique (loi de Laplace) s\'exerçant entre conducteurs rigides lors d\'un court-circuit triphasé ou biphasé, et vérifie la contrainte de flexion sur les barres et les isolateurs supports.',
      en: 'Calculates peak electrodynamic forces (Laplace law) between rigid conductors during three-phase or two-phase short-circuits, and verifies bending stresses on conductors and post insulators.',
    },
    steps: [
      {
        label: { fr: 'Force électrodynamique linéaire maximale', en: 'Peak electrodynamic force per unit length' },
        formula: 'F_m = (µ0 / 2π) × (√3 / 2) × (ip² / a) × l   [N]',
        explanation: { fr: 'ip = courant de court-circuit de crête (kA), a = entraxe entre phases (m), l = portée entre deux isolateurs supports (m), µ0 = 4π×10⁻⁷ H/m.', en: 'ip = peak short-circuit current (kA), a = phase center-to-center distance (m), l = span between post insulators (m).' },
      },
      {
        label: { fr: 'Contrainte maximale de flexion dans la barre', en: 'Bending stress in conductor' },
        formula: 'σ_m = (F_m × l) / (16 × W_mod)   [N/mm²]',
        explanation: { fr: 'W_mod = module d\'inertie élastique de la section du conducteur (mm³). σ_m doit rester inférieure à la limite élastique Rp0.2 du cuivre ou aluminium.', en: 'W_mod = section modulus of busbar (mm³). σ_m must remain below material 0.2% proof stress Rp0.2.' },
      },
    ],
    variables: [
      { symbol: 'ip', name: { fr: 'Courant de crête Icc', en: 'Peak fault current' }, unit: 'kA', typical: '31.5 – 100' },
      { symbol: 'a', name: { fr: 'Entraxe entre phases', en: 'Center spacing' }, unit: 'mm', typical: '150 – 800' },
      { symbol: 'l', name: { fr: 'Portée entre isolateurs', en: 'Span length' }, unit: 'm', typical: '0.8 – 2.5' },
    ],
    warnings: [
      { fr: 'Pour les barres en cuivre Cu-ETP, Rp0.2 ≈ 200–250 N/mm² ; pour aluminium Al-6101, Rp0.2 ≈ 170 N/mm².', en: 'For Cu-ETP copper bars, Rp0.2 ≈ 200–250 N/mm²; for Al-6101 aluminium alloy, Rp0.2 ≈ 170 N/mm².' },
    ],
  },

  'cable-ampacity': {
    title: { fr: 'Courant Admissible & Facteurs de Déclassement (CEI 60287)', en: 'Cable Ampacity & Thermal Derating (IEC 60287 / IEC 60364-5-52)' },
    standard: 'CEI 60287 / CEI 60364-5-52',
    overview: {
      fr: 'Calcule le courant admissible corrigé Iz d\'un câble d\'énergie en fonction du mode de pose, de la température ambiante ou du sol, du groupement de câbles et de la résistance thermique du terrain.',
      en: 'Calculates corrected cable continuous ampacity Iz based on installation method, ambient or ground temperature, grouping proximity factors, and soil thermal resistivity.',
    },
    steps: [
      {
        label: { fr: 'Courant admissible corrigé', en: 'Corrected ampacity' },
        formula: 'Iz = I0 × k_temp × k_groupe × k_pose × k_terre   [A]',
        explanation: { fr: 'I0 = courant admissible de base (tableau CEI 60364-5-52), k_temp = facteur température, k_groupe = groupement, k_terre = résistivité thermique du sol.', en: 'I0 = baseline ampacity table value, k_temp = temperature factor, k_groupe = grouping factor, k_terre = soil thermal resistivity factor.' },
      },
      {
        label: { fr: 'Contrainte thermique minimale de court-circuit', en: 'Thermal short-circuit withstand' },
        formula: 'S_min = (Isc × √t_k) / k_matiere   [mm²]',
        explanation: { fr: 'k_matiere = 143 A·s^(1/2)/mm² pour cuivre isolé XLPE (température initiale 90°C, finale 250°C), 94 pour aluminium.', en: 'k_matiere = 143 for XLPE copper (initial 90°C, final 250°C), 94 for aluminium per IEC 60364-5-54.' },
      },
    ],
    variables: [
      { symbol: 'I0', name: { fr: 'Courant de base tableau', en: 'Base table ampacity' }, unit: 'A', typical: '120 – 600' },
      { symbol: 'k_temp', name: { fr: 'Facteur température', en: 'Temperature factor' }, unit: '—', typical: '0.82 – 1.0' },
      { symbol: 'k_groupe', name: { fr: 'Facteur de groupement', en: 'Grouping factor' }, unit: '—', typical: '0.65 – 1.0' },
    ],
    warnings: [
      { fr: 'Pour les câbles enterrés au Cameroun où la température du sol peut atteindre 30°C à 1 m de profondeur, appliquer un facteur de déclassement sol de 0.93.', en: 'For buried cables in tropical soils (30°C at 1 m depth), apply a ground thermal derating factor of 0.93.' },
    ],
  },

  'transmission-line': {
    title: { fr: 'Paramètres Ligne & Matrice ABCD (CEI 60826 / CIGRE)', en: 'Transmission Line ABCD Parameters (IEC 60826 / CIGRE TB 384)' },
    standard: 'CEI 60826 / CIGRE TB 384',
    overview: {
      fr: 'Modélise une ligne électrique de transport en schéma en Pi équivalent à constantes réparties, calculant la matrice de transmission ABCD, la tension réceptrice, les pertes joules et la limite de stabilité.',
      en: 'Models transmission lines using distributed parameters equivalent Pi network, computing ABCD transmission matrix, receiving end voltage, Joule losses, and stability margins.',
    },
    steps: [
      {
        label: { fr: 'Constante de propagation gamma', en: 'Propagation constant' },
        formula: 'γ = √[(r + jωl) × (g + jωc)] = α + jβ',
        explanation: { fr: 'α = constante d\'atténuation (Np/km), β = constante de phase (rad/km) avec longueur d\'onde λ = 2π/β ≈ 6000 km à 50 Hz.', en: 'α = attenuation constant (Np/km), β = phase constant (rad/km) with wavelength λ = 2π/β ≈ 6000 km at 50 Hz.' },
      },
      {
        label: { fr: 'Coefficients matriciels ABCD', en: 'ABCD matrix coefficients' },
        formula: 'A = D = ch(γ·l)  ;  B = Zc·sh(γ·l)  ;  C = (1/Zc)·sh(γ·l)',
        explanation: { fr: 'Équation fondamentale : [Vs ; Is] = [A B ; C D] × [Vr ; Ir]. Pour une ligne sans pertes, A = cos(β·l) et B = j·Zc·sin(β·l).', en: 'Fundamental equation: [Vs ; Is] = [A B ; C D] × [Vr ; Ir]. For lossless line, A = cos(β·l) and B = j·Zc·sin(β·l).' },
      },
    ],
    variables: [
      { symbol: 'l', name: { fr: 'Longueur de ligne', en: 'Line length' }, unit: 'km', typical: '80 – 350' },
      { symbol: 'Un', name: { fr: 'Tension assignée', en: 'Rated voltage' }, unit: 'kV', typical: '90 / 225 / 400' },
      { symbol: 'A', name: { fr: 'Facteur de tension A', en: 'Voltage coefficient A' }, unit: '—', typical: '0.90 – 0.99' },
    ],
    warnings: [
      { fr: 'Pour les lignes > 200 km, les équations hyperboliques à constantes réparties sont obligatoires ; les modèles en Pi simplifiés sous-estiment l\'effet Ferranti.', en: 'For lines > 200 km, distributed parameter hyperbolic equations are mandatory; lumped Pi models underestimate Ferranti voltage rise.' },
    ],
  },

  'neutral-grounding': {
    title: { fr: 'Résistance de Neutre RPN & Bobine de Petersen (CEI 60071)', en: 'Neutral Grounding Resistor (NGR) & Petersen Coil (IEC 60071)' },
    standard: 'CEI 60071 / NF C 13-200 / IEEE 142',
    overview: {
      fr: 'Calcule la valeur ohmique de la résistance de mise à la terre du neutre (RPN) limitant le courant de défaut monophasé à une valeur admissible (ex. 300 A ou 1000 A), sa tenue thermique en énergie (kW/s) et l\'accord de la bobine d\'inductance de compensation Petersen.',
      en: 'Calculates the ohmic rating of the neutral grounding resistor (NGR) limiting earth fault current (e.g. 300 A or 1000 A), thermal energy withstand, and Petersen coil resonance tuning.',
    },
    steps: [
      {
        label: { fr: 'Valeur de la résistance de neutre RPN', en: 'Neutral grounding resistor value' },
        formula: 'Rn = (Un / √3) / In_defaut   [Ω]',
        explanation: { fr: 'Un = tension entre phases (V). In_defaut = courant de défaut à la terre recherché (ex. 300 A en réseau HTA 20 kV ou 30 kV).', en: 'Un = phase-to-phase voltage (V). In_defaut = targeted ground fault current (e.g. 300 A for 20 kV/30 kV MV network).' },
      },
      {
        label: { fr: 'Puissance thermique dissipée pendant le défaut', en: 'Thermal power dissipated' },
        formula: 'P_rpn = Rn × In_defaut²   [kW]   (pendant t_defaut typ. 5 à 10s)',
        explanation: { fr: 'La résistance doit absorber cette énergie thermique sans dépasser la température maximale admissible (350°C à 760°C selon inox).', en: 'Resistor must absorb this thermal energy without exceeding max alloy operating temperature (350°C to 760°C).' },
      },
    ],
    variables: [
      { symbol: 'Un', name: { fr: 'Tension réseau HTA', en: 'MV system voltage' }, unit: 'kV', typical: '15 / 20 / 30' },
      { symbol: 'In_defaut', name: { fr: 'Courant de défaut consigne', en: 'Target earth fault current' }, unit: 'A', typical: '150 – 1000' },
      { symbol: 'Rn', name: { fr: 'Résistance RPN', en: 'NGR resistance' }, unit: 'Ω', typical: '17 – 115' },
    ],
    warnings: [
      { fr: 'Associer impérativement une protection wattmétrique 67N ou directionnelle de terre pour déclencher le départ défaillant en réseau à neutre impédant.', en: 'Always coordinate with 67N directional earth fault protection to trip the faulted feeder in impedance-grounded systems.' },
    ],
  },

  'relay-tcc': {
    title: { fr: 'Courbes à Temps Inverse CEI & Sélectivité TCC (CEI 60255-151)', en: 'IEC Inverse Time Relay Curves & TCC Grading (IEC 60255-151)' },
    standard: 'CEI 60255-151 / IEEE 242 (Buff Book)',
    overview: {
      fr: 'Génère les courbes caractéristiques temps-courant (TCC) selon la norme internationale CEI 60255-151 pour les fonctions de surintensité phase (51) et terre (51N) : Standard Inverse (SI), Very Inverse (VI), Extremely Inverse (EI) et Long-Time Inverse (LTI).',
      en: 'Generates time-current characteristic (TCC) curves per IEC 60255-151 for phase (51) and ground (51N) overcurrent functions: Standard Inverse (SI), Very Inverse (VI), Extremely Inverse (EI), and Long-Time Inverse (LTI).',
    },
    steps: [
      {
        label: { fr: 'Équation universelle CEI 60255-151', en: 'IEC 60255-151 standard formula' },
        formula: 't(I) = TMS × [ k / ((I / Is)^α - 1) ]   [s]',
        explanation: { fr: 'TMS = Time Multiplier Setting, Is = courant de réglage de seuil (pickup), k et α = constantes normalisées de la famille de courbe.', en: 'TMS = Time Multiplier Setting, Is = pickup current threshold, k and α = standardized curve parameters.' },
      },
      {
        label: { fr: 'Paramètres par famille de courbe CEI', en: 'Parameters by IEC curve family' },
        formula: 'SI : k=0.14, α=0.02  |  VI : k=13.5, α=1.0  |  EI : k=80.0, α=2.0',
        explanation: { fr: 'La courbe Extremely Inverse (EI, α=2) reproduit exactement la contrainte thermique I²t des câbles et fusibles amont.', en: 'Extremely Inverse (EI, α=2) matches the I²t thermal heating characteristic of cables and upstream fuses.' },
      },
      {
        label: { fr: 'Intervalle sélectif de coordination (CTI)', en: 'Coordination Time Interval (CTI)' },
        formula: 'CTI = t_amont - t_aval ≥ 250 à 300 ms',
        explanation: { fr: 'Comprend : temps d\'ouverture disjoncteur (50–80 ms) + dépassement inertiel relais (30 ms) + marge d\'erreur de mesure TC et relais (150 ms).', en: 'Includes: breaker opening time (50–80 ms) + relay overshoot (30 ms) + CT & relay measurement tolerance (150 ms).' },
      },
    ],
    variables: [
      { symbol: 'Is', name: { fr: 'Seuil de courant (pickup)', en: 'Pickup current' }, unit: 'A', typical: '100 – 1200' },
      { symbol: 'TMS', name: { fr: 'Facteur multiplicateur de temps', en: 'Time multiplier setting' }, unit: '—', typical: '0.05 – 1.0' },
      { symbol: 'CTI', name: { fr: 'Intervalle de coordination', en: 'Grading margin' }, unit: 'ms', typical: '250 – 350' },
    ],
    sensitivity: [
      { key: 'tms', label: { fr: 'Réglage TMS', en: 'TMS Setting' }, min: 0.05, max: 1.2, step: 0.05, default: 0.20, unit: '—' },
      { key: 'pickup', label: { fr: 'Seuil Is (A)', en: 'Pickup Is (A)' }, min: 50, max: 2000, step: 25, default: 400, unit: 'A' },
    ],
    warnings: [
      { fr: 'Toujours vérifier que le temps de déclenchement au courant Icc maximal est supérieur au temps d\'ouverture du disjoncteur aval + CTI.', en: 'Always ensure upstream trip time at max fault current maintains at least CTI margin above downstream breaker total clearing time.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface FormulaDerivationPanelProps {
  calcTab: CalculatorTabType;
  locale: 'fr' | 'en';
  defaultOpen?: boolean;
}

export const FormulaDerivationPanel: React.FC<FormulaDerivationPanelProps> = ({
  calcTab, locale, defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [activeSection, setActiveSection] = useState<'derivation' | 'variables' | 'sensitivity' | 'units'>('derivation');
  const [sensitivityValues, setSensitivityValues] = useState<Record<string, number>>({});

  const entry = FORMULA_DB[calcTab];

  if (!entry) {
    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-500 font-mono">
        {locale === 'fr'
          ? 'Dérivation de formule non disponible pour ce calculateur.'
          : 'Formula derivation not available for this calculator.'}
      </div>
    );
  }

  const handleSensChange = (key: string, val: number) => {
    setSensitivityValues(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black text-white">
              {locale === 'fr' ? entry.title.fr : entry.title.en}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {entry.standard} · {locale === 'fr' ? 'Dérivation & Traçabilité' : 'Derivation & Traceability'}
            </div>
          </div>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800 p-4 space-y-4">
              {/* Overview */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {locale === 'fr' ? entry.overview.fr : entry.overview.en}
              </p>

              {/* Section Nav */}
              <div className="flex gap-1.5 flex-wrap">
                {(['derivation', 'variables', ...(entry.sensitivity ? ['sensitivity'] : []), ...(entry.unitConversions ? ['units'] : [])] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setActiveSection(sec as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      activeSection === sec
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {sec === 'derivation' ? (locale === 'fr' ? 'Dérivation' : 'Derivation')
                     : sec === 'variables' ? (locale === 'fr' ? 'Variables' : 'Variables')
                     : sec === 'sensitivity' ? (locale === 'fr' ? 'Sensibilité' : 'Sensitivity')
                     : (locale === 'fr' ? 'Unités' : 'Units')}
                  </button>
                ))}
              </div>

              {/* DERIVATION STEPS */}
              {activeSection === 'derivation' && (
                <div className="space-y-3">
                  {entry.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {i + 1}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-black text-white">
                          {locale === 'fr' ? step.label.fr : step.label.en}
                        </div>
                        <div className="font-mono text-xs text-amber-300 bg-amber-950/30 px-2.5 py-1.5 rounded-lg border border-amber-800/30">
                          {step.formula}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
                          {locale === 'fr' ? step.explanation.fr : step.explanation.en}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Warnings */}
                  {entry.warnings?.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[10px] text-amber-300 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{locale === 'fr' ? w.fr : w.en}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* VARIABLES TABLE */}
              {activeSection === 'variables' && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <div className="grid grid-cols-4 gap-0 bg-slate-800/80 p-2 text-[10px] font-black uppercase text-slate-300 tracking-wider">
                    <div>{locale === 'fr' ? 'Symbole' : 'Symbol'}</div>
                    <div>{locale === 'fr' ? 'Grandeur' : 'Quantity'}</div>
                    <div>{locale === 'fr' ? 'Unité' : 'Unit'}</div>
                    <div>{locale === 'fr' ? 'Valeur type' : 'Typical'}</div>
                  </div>
                  {entry.variables.map((v, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-4 gap-0 p-2 ${i % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/40'}`}
                    >
                      <div className="font-mono font-black text-amber-400">{v.symbol}</div>
                      <div className="text-slate-200">{locale === 'fr' ? v.name.fr : v.name.en}</div>
                      <div className="font-mono text-slate-400">{v.unit}</div>
                      <div className="font-mono text-slate-500 text-[10px]">{v.typical || '—'}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* SENSITIVITY ANALYSIS */}
              {activeSection === 'sensitivity' && entry.sensitivity && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'fr' ? 'Analyse de Sensibilité — Déplacez les curseurs pour voir l\'impact sur le résultat' : 'Sensitivity Analysis — Move sliders to see impact on result'}</span>
                  </div>
                  {entry.sensitivity.map((param) => {
                    const val = sensitivityValues[param.key] ?? param.default;
                    const pct = ((val - param.min) / (param.max - param.min)) * 100;
                    return (
                      <div key={param.key} className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-bold">
                            {locale === 'fr' ? param.label.fr : param.label.en}
                          </span>
                          <span className="font-mono font-black text-amber-400">
                            {val.toFixed(param.step < 1 ? 2 : 1)} {param.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={val}
                          onChange={e => handleSensChange(param.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-full bg-slate-700 accent-amber-400 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                          <span>{param.min} {param.unit}</span>
                          <span style={{ marginLeft: `${pct}%`, transform: 'translateX(-50%)' }}
                            className="text-amber-400 font-bold">▲</span>
                          <span>{param.max} {param.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* UNIT CONVERSIONS */}
              {activeSection === 'units' && entry.unitConversions && (
                <div className="space-y-2">
                  {entry.unitConversions.map((uc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-amber-400 font-black">{uc.from}</span>
                        <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                        <span className="text-sky-400 font-black">{uc.to}</span>
                      </div>
                      <span className="text-slate-400">{uc.label}</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-2 text-[10px] text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      {locale === 'fr'
                        ? 'Toutes les conversions sont conformes aux définitions SI (Système International d\'Unités) et CEI 80000.'
                        : 'All conversions conform to SI (International System of Units) and IEC 80000 definitions.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
