// src/components/substations/SubstationEngineeringPrinciplesDrawer.tsx
// EPEDE D04 - Mathematical Principles & Advanced Engineering Formulations Drawer for High-Voltage Substations

import React, { useState } from 'react';
import {
  X,
  Calculator,
  Layers,
  ChevronRight,
  Zap,
  ShieldCheck,
  Activity,
  Info,
  Scale,
  Flame,
  BatteryCharging,
  Radio,
  Sliders,
  CheckCircle2,
  RefreshCw,
  BookOpen
} from 'lucide-react';

interface SubstationEngineeringPrinciplesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
}

interface FormulaItem {
  id: string;
  category: 'PROTECTION' | 'ELECTROTECHNICAL' | 'SAFETY' | 'AUXILIARY' | 'TRANSFORMER' | 'SURGE_INSULATION';
  title_fr: string;
  title_en: string;
  standard: string;
  formula: string;
  variables: { sym: string; desc_fr: string; desc_en: string; unit: string }[];
  explanation_fr: string;
  explanation_en: string;
  practical_example_fr: string;
  practical_example_en: string;
  interactiveParams?: {
    key: string;
    label_fr: string;
    label_en: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
    unit: string;
  }[];
  computeInteractiveResult?: (params: Record<string, number>) => {
    resultLabel_fr: string;
    resultLabel_en: string;
    value: string;
    status: 'OPTIMAL' | 'ACCEPTABLE' | 'CRITICAL';
    note_fr: string;
    note_en: string;
  };
}

export const SubstationEngineeringPrinciplesDrawer: React.FC<SubstationEngineeringPrinciplesDrawerProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const [activeFormulaId, setActiveFormulaId] = useState<string>('FORMULA_87T');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Interactive formula dynamic state
  const [userParams, setUserParams] = useState<Record<string, number>>({
    // 87T params
    ihv: 250,
    ilv: 246,
    k1: 25,
    // Short-circuit params
    sn: 100,
    un: 90,
    ucc: 12,
    kappa: 1.8,
    // IEEE 80 Touch
    rhos: 3000,
    cs: 0.78,
    ts: 0.20,
    // IEEE 80 Step
    // Battery
    iperm: 32,
    taut: 10,
    ipointe: 80,
    // Transfo thermal
    tamb: 30,
    loadRatio: 1.15,
    // Surge arrester
    slewRate: 1000,
    separationDist: 25
  });

  const formulas: FormulaItem[] = [
    {
      id: 'FORMULA_87T',
      category: 'PROTECTION',
      standard: 'IEC 60255-13 / IEEE C37.91',
      title_fr: 'Protection Différentielle Transformateur (87T) & Pentes Stabilisatrices',
      title_en: 'Transformer Differential Protection (87T) & Dual-Slope Restraint',
      formula: 'I_diff = |I_HV + I_LV|   ≥   I_bias · K1   (avec I_bias = (|I_HV| + |I_LV|) / 2)',
      variables: [
        { sym: 'I_diff', desc_fr: 'Courant différentiel vectoriel instantané résiduel', desc_en: 'Instantaneous vectorial differential current', unit: 'A ou pu' },
        { sym: 'I_bias', desc_fr: 'Courant de retenue / stabilisation', desc_en: 'Through bias / restraint current', unit: 'A ou pu' },
        { sym: 'K1 (Pente 1)', desc_fr: 'Pente de retenue pour régimes de charge normaux (typiquement 20-35%)', desc_en: 'Restraint slope for normal load & tap-changer variations (20-35%)', unit: '%' },
        { sym: 'K2 (Pente 2)', desc_fr: 'Pente de saturation TC pour courts-circuits externes traversants (50-80%)', desc_en: 'Heavy through-fault slope compensating severe CT saturation (50-80%)', unit: '%' }
      ],
      explanation_fr: 'La protection 87T effectue la somme vectorielle des courants primaire et secondaire après compensation d\'amplitude et déphasage horaire (YNyd11). Lors d\'un transit sain ou d\'un défaut extérieur, Idiff ≈ 0 A. Lors d\'un court-circuit entre spires ou spires-masse, Idiff s\'élève au-dessus du seuil de pente et provoque le déclenchement instantané en < 25 ms.',
      explanation_en: 'Biased differential protection performs vectorial summation of primary and secondary currents after digital vector group alignment. On external faults, Idiff is nullified. An internal turn-to-turn fault produces high Idiff crossing the restraint boundary, tripping in < 25 ms.',
      practical_example_fr: 'Sur un transfo 100 MVA 225/90 kV, si IHV = 250 A et ILV équivalent = 246 A, Idiff = 4 A pour Ibias = 248 A. Le seuil K1 (25%) exige Idiff > 62 A : déclenchement bloqué en régime sain.',
      practical_example_en: 'On 100 MVA transformer, IHV = 250 A and ILV = 246 A yield Idiff = 4 A. With 25% bias slope, threshold is 62 A: system remains rock-solid and stable.',
      interactiveParams: [
        { key: 'ihv', label_fr: 'Courant Primaire IHV (ramené)', label_en: 'Primary Current IHV (referred)', min: 50, max: 600, step: 5, defaultVal: 250, unit: 'A' },
        { key: 'ilv', label_fr: 'Courant Secondaire ILV (ramené)', label_en: 'Secondary Current ILV (referred)', min: 50, max: 600, step: 5, defaultVal: 246, unit: 'A' },
        { key: 'k1', label_fr: 'Pente Stabilisatrice K1', label_en: 'Bias Restraint Slope K1', min: 10, max: 50, step: 1, defaultVal: 25, unit: '%' }
      ],
      computeInteractiveResult: (p) => {
        const ihv = p.ihv ?? 250;
        const ilv = p.ilv ?? 246;
        const k1 = (p.k1 ?? 25) / 100;
        const idiff = Math.abs(ihv - ilv);
        const ibias = (ihv + ilv) / 2;
        const threshold = ibias * k1;
        const willTrip = idiff >= threshold;
        return {
          resultLabel_fr: `Idiff = ${idiff.toFixed(1)} A (Seuil = ${threshold.toFixed(1)} A)`,
          resultLabel_en: `Idiff = ${idiff.toFixed(1)} A (Threshold = ${threshold.toFixed(1)} A)`,
          value: willTrip ? 'TRIP IMMÉDIAT (DÉFAUT INTERNE)' : 'STABILITÉ CONFIRMÉE (AUCUN DÉCLENCHEMENT)',
          status: willTrip ? 'CRITICAL' : 'OPTIMAL',
          note_fr: willTrip
            ? 'Le différentiel dépasse le seuil de pente : le relais 87T envoie l\'ordre de déclenchement aux disjoncteurs HTB et BTB.'
            : 'Le courant différentiel résiduel reste dans la zone de retenue : fonctionnement normal sans déclenchement intempestif.',
          note_en: willTrip
            ? 'Differential current exceeds restraint threshold: 87T initiates fast trip to both HV and LV circuit breakers.'
            : 'Residual differential remains below bias threshold: secure through-fault and load stability.'
        };
      }
    },
    {
      id: 'FORMULA_SHORT_CIRCUIT',
      category: 'ELECTROTECHNICAL',
      standard: 'IEC 60909-0 / NF EN 60909',
      title_fr: 'Courant de Court-Circuit Triphasé et Crête Asymétrique',
      title_en: 'Three-Phase Symmetrical Short-Circuit & Asymmetrical Peak Current',
      formula: 'I_sc = S_n / (√3 · U_n · u_cc%)   et   I_peak = κ · √2 · I_sc',
      variables: [
        { sym: 'I_sc', desc_fr: 'Courant de court-circuit symétrique efficace initial', desc_en: 'Initial symmetrical short-circuit current RMS', unit: 'kA' },
        { sym: 'S_n', desc_fr: 'Puissance apparente assignée du transformateur', desc_en: 'Transformer rated apparent capacity', unit: 'MVA' },
        { sym: 'U_n', desc_fr: 'Tension nominale entre phases sur le jeu de barres', desc_en: 'Nominal line-to-line busbar voltage', unit: 'kV' },
        { sym: 'u_cc%', desc_fr: 'Tension de court-circuit normalisée du transformateur', desc_en: 'Transformer short-circuit impedance percentage', unit: '%' },
        { sym: 'κ (kappa)', desc_fr: 'Facteur d\'asymétrie dépendant du rapport R/X (1.02 + 0.98 · e^(-3·R/X))', desc_en: 'Peak asymmetry factor dependent on grid R/X ratio', unit: '-' },
        { sym: 'I_peak', desc_fr: 'Courant de crête maximal admissible (effort électrodynamique max)', desc_en: 'Maximum peak current (Laplace electrodynamic burst force)', unit: 'kA crête' }
      ],
      explanation_fr: 'Dimensionne le pouvoir de coupure assigné en court-circuit (Icu) des disjoncteurs et définit l\'effort électrodynamique maximal de Laplace (F ~ I_peak²) subi par les jeux de barres tubulaires rigides et leurs isolateurs supports.',
      explanation_en: 'Sizes the rated short-circuit breaking capacity (Icu) of high-voltage circuit breakers and governs electrodynamic Laplace mechanical stresses (F ~ I_peak²) on tubular busbars and post insulators.',
      practical_example_fr: 'Transfo 100 MVA 225/90 kV avec ucc = 12% : Isc = 100 / (√3 · 90 · 0.12) = 5.34 kA. Si κ = 1.8, Ipeak = 1.8 · 1.414 · 5.34 = 13.6 kA crête.',
      practical_example_en: '100 MVA 225/90 kV trafo with ucc = 12%: Isc = 5.34 kA RMS. With peak factor κ = 1.8, Ipeak reaches 13.6 kA peak.',
      interactiveParams: [
        { key: 'sn', label_fr: 'Puissance Transfo (Sn)', label_en: 'Transformer Rating (Sn)', min: 20, max: 300, step: 10, defaultVal: 100, unit: 'MVA' },
        { key: 'un', label_fr: 'Tension Secondaire (Un)', label_en: 'Secondary Voltage (Un)', min: 20, max: 225, step: 5, defaultVal: 90, unit: 'kV' },
        { key: 'ucc', label_fr: 'Impédance Court-Circuit (ucc)', label_en: 'Impedance Voltage (ucc)', min: 8, max: 20, step: 0.5, defaultVal: 12, unit: '%' },
        { key: 'kappa', label_fr: 'Facteur de Crête (κ)', label_en: 'Peak Factor (κ)', min: 1.5, max: 2.0, step: 0.05, defaultVal: 1.8, unit: '-' }
      ],
      computeInteractiveResult: (p) => {
        const sn = p.sn ?? 100;
        const un = p.un ?? 90;
        const ucc = (p.ucc ?? 12) / 100;
        const kappa = p.kappa ?? 1.8;
        const isckA = sn / (Math.sqrt(3) * un * ucc);
        const ipeakkA = kappa * Math.SQRT2 * isckA;
        return {
          resultLabel_fr: `Isc = ${isckA.toFixed(2)} kA eff | Ipeak = ${ipeakkA.toFixed(2)} kA crête`,
          resultLabel_en: `Isc = ${isckA.toFixed(2)} kA RMS | Ipeak = ${ipeakkA.toFixed(2)} kA Peak`,
          value: `DISJONCTEUR REQUIS: ≥ ${(Math.ceil(isckA / 5) * 5 + 5)} kA`,
          status: 'OPTIMAL',
          note_fr: `Effort mécanique électrodynamique sur barres ~ ${(ipeakkA * ipeakkA * 0.2).toFixed(0)} daN/m. Pouvoir de coupure standardisé à prescrire : ${(Math.ceil(isckA / 5) * 5 + 5)} kA.`,
          note_en: `Electrodynamic mechanical stress on busbars ~ ${(ipeakkA * ipeakkA * 0.2).toFixed(0)} daN/m. Recommended standardized breaker rating: ${(Math.ceil(isckA / 5) * 5 + 5)} kA.`
        };
      }
    },
    {
      id: 'FORMULA_IEEE80_TOUCH',
      category: 'SAFETY',
      standard: 'IEEE Std 80-2013',
      title_fr: 'Tension de Toucher Admissible (Touch Voltage Limit)',
      title_en: 'Tolerable Touch Voltage Limit (Human Body Weight 70 kg)',
      formula: 'E_touch = (1000 + 1.5 · C_s · ρ_s) · 0.157 / √t_s',
      variables: [
        { sym: 'E_touch', desc_fr: 'Tension de toucher maximale admissible sans risque de fibrillation', desc_en: 'Maximum tolerable touch potential limit', unit: 'V' },
        { sym: 'ρ_s', desc_fr: 'Résistivité de la couche de surface (gravier concassé ou terre)', desc_en: 'Surface layer resistivity (crushed granite vs bare soil)', unit: 'Ω·m' },
        { sym: 'C_s', desc_fr: 'Facteur de détarage d\'épaisseur de gravier (typiquement 0.75 - 0.85 pour 15 cm)', desc_en: 'Surface layer derating factor for 15 cm thickness', unit: '-' },
        { sym: 't_s', desc_fr: 'Durée d\'élimination du défaut à la terre par les protections', desc_en: 'Fault clearing time duration of primary protection', unit: 'secondes' }
      ],
      explanation_fr: 'Loi reine de la sécurité du personnel dans les postes HTB. Elle démontre rigoureusement l\'impérieuse nécessité de la couche de 15 cm de gravier concassé de granit (ρs = 3000 Ω·m) qui multiplie par 3 à 4 la tension de toucher admissible par le corps humain (modélisé par 1000 Ω) par rapport au sol nu.',
      explanation_en: 'Fundamental substation life-safety equation. Mathematically proves why 15 cm of crushed granite gravel (ρs = 3000 Ω·m) is mandatory across all outdoor yards: it increases tolerable touch voltages by 300% to 400% compared to wet bare earth.',
      practical_example_fr: 'Pour ts = 0.20 s avec gravier (Cs·ρs = 2340 Ω·m) : Etouch = (1000 + 1.5 · 2340) · 0.157 / √0.20 = 4510 · 0.351 = 1583 V. Sans gravier (sol 100 Ω·m), la limite chuterait mortellement à 403 V !',
      practical_example_en: 'At 200 ms with gravel: Etouch limit is 1583 V. Without gravel, safe threshold drops fatally to 403 V.',
      interactiveParams: [
        { key: 'rhos', label_fr: 'Résistivité Surface (ρs)', label_en: 'Surface Resistivity (ρs)', min: 100, max: 4000, step: 100, defaultVal: 3000, unit: 'Ω·m' },
        { key: 'cs', label_fr: 'Facteur Détarage (Cs)', label_en: 'Derating Factor (Cs)', min: 0.5, max: 1.0, step: 0.02, defaultVal: 0.78, unit: '-' },
        { key: 'ts', label_fr: 'Temps Déclenchement (ts)', label_en: 'Fault Duration (ts)', min: 0.08, max: 1.0, step: 0.02, defaultVal: 0.20, unit: 's' }
      ],
      computeInteractiveResult: (p) => {
        const rhos = p.rhos ?? 3000;
        const cs = p.cs ?? 0.78;
        const ts = p.ts ?? 0.20;
        const etouch = (1000 + 1.5 * cs * rhos) * (0.157 / Math.sqrt(ts));
        const isSafeWithGravel = rhos >= 2000;
        return {
          resultLabel_fr: `Etouch Limite = ${Math.round(etouch)} V`,
          resultLabel_en: `Etouch Limit = ${Math.round(etouch)} V`,
          value: isSafeWithGravel ? 'PROTECTION HAUTE (GRAVIER CONFORMÉ)' : 'SEUIL CRITIQUE DANGEREUX (SOL NU)',
          status: isSafeWithGravel ? 'OPTIMAL' : 'CRITICAL',
          note_fr: `Avec ts = ${(ts * 1000).toFixed(0)} ms et Cs·ρs = ${(cs * rhos).toFixed(0)} Ω·m, un opérateur en contact avec un châssis peut supporter ${Math.round(etouch)} V sans fibrillation ventriculaire.`,
          note_en: `With ts = ${(ts * 1000).toFixed(0)} ms and Cs·ρs = ${(cs * rhos).toFixed(0)} Ω·m, an operator touching an earthed frame survives up to ${Math.round(etouch)} V without heart fibrillation.`
        };
      }
    },
    {
      id: 'FORMULA_IEEE80_STEP',
      category: 'SAFETY',
      standard: 'IEEE Std 80-2013',
      title_fr: 'Tension de Pas Admissible (Step Voltage Limit)',
      title_en: 'Tolerable Step Voltage Limit Between Feet (1 Pace = 1 m)',
      formula: 'E_step = (1000 + 6.0 · C_s · ρ_s) · 0.157 / √t_s',
      variables: [
        { sym: 'E_step', desc_fr: 'Tension de pas maximale tolérable entre les deux pieds distants de 1 m', desc_en: 'Maximum tolerable potential difference between feet spaced 1 m apart', unit: 'V' },
        { sym: 'ρ_s', desc_fr: 'Résistivité surfacique du revêtement de sol', desc_en: 'Surface material resistivity', unit: 'Ω·m' },
        { sym: 'C_s', desc_fr: 'Facteur de détarage de couche', desc_en: 'Thickness correction derating factor', unit: '-' },
        { sym: 't_s', desc_fr: 'Temps d\'élimination du court-circuit', desc_en: 'Fault clearing duration', unit: 'secondes' }
      ],
      explanation_fr: 'Lors de l\'injection du courant de court-circuit dans le réseau de terre, un gradient de potentiel se crée à la surface du sol. Le facteur 6.0 (contre 1.5 pour le toucher) traduit le passage du courant à travers les deux jambes en série sans traverser directement la cage thoracique.',
      explanation_en: 'During earth fault discharge, ground potential gradients develop. The 6.0 multiplier (versus 1.5 for touch) reflects that current travels foot-to-foot across both legs in series without direct myocardial heart passage.',
      practical_example_fr: 'Pour ts = 0.20 s avec gravier : Estep = (1000 + 6.0 · 2340) · 0.351 = 15040 · 0.351 = 5279 V. Le seuil de pas est toujours 3 à 4 fois plus tolérant que le seuil de toucher.',
      practical_example_en: 'At 200 ms with gravel: Estep threshold is 5279 V (approx 3.3x higher than touch potential limit).',
      interactiveParams: [
        { key: 'rhos', label_fr: 'Résistivité Surface (ρs)', label_en: 'Surface Resistivity (ρs)', min: 100, max: 4000, step: 100, defaultVal: 3000, unit: 'Ω·m' },
        { key: 'cs', label_fr: 'Facteur Détarage (Cs)', label_en: 'Derating Factor (Cs)', min: 0.5, max: 1.0, step: 0.02, defaultVal: 0.78, unit: '-' },
        { key: 'ts', label_fr: 'Temps Déclenchement (ts)', label_en: 'Fault Duration (ts)', min: 0.08, max: 1.0, step: 0.02, defaultVal: 0.20, unit: 's' }
      ],
      computeInteractiveResult: (p) => {
        const rhos = p.rhos ?? 3000;
        const cs = p.cs ?? 0.78;
        const ts = p.ts ?? 0.20;
        const estep = (1000 + 6.0 * cs * rhos) * (0.157 / Math.sqrt(ts));
        return {
          resultLabel_fr: `Estep Limite = ${Math.round(estep)} V`,
          resultLabel_en: `Estep Limit = ${Math.round(estep)} V`,
          value: 'TOLÉRANCE DE GRADIENT CONFIRMÉE',
          status: 'OPTIMAL',
          note_fr: `La limite de tension de pas (${Math.round(estep)} V) est largement supérieure à la tension de toucher grâce au trajet bipodal sans passage cardiaque.`,
          note_en: `Step voltage limit (${Math.round(estep)} V) provides substantial safety headroom compared to touch limit.`
        };
      }
    },
    {
      id: 'FORMULA_TRANSFO_THERMAL',
      category: 'TRANSFORMER',
      standard: 'IEC 60076-7 / IEEE C57.91',
      title_fr: 'Échauffement Point Chaud & Vieillissement de l\'Huile',
      title_en: 'Hot-Spot Temperature Rise & Insulation Aging (Arrhenius Law)',
      formula: 'θ_hs = θ_amb + Δθ_oil + H · g · (I / I_n)^2m   et   V = 2^((θ_hs - 98) / 6)',
      variables: [
        { sym: 'θ_hs', desc_fr: 'Température absolue du point chaud diélectrique', desc_en: 'Absolute hot-spot temperature', unit: '°C' },
        { sym: 'θ_amb', desc_fr: 'Température ambiante de l\'air extérieur', desc_en: 'Ambient air cooling temperature', unit: '°C' },
        { sym: 'Δθ_oil', desc_fr: 'Échauffement moyen de l\'huile diélectrique en cuve', desc_en: 'Top-oil steady-state temperature rise', unit: 'K' },
        { sym: 'V', desc_fr: 'Facteur de vitesse relative de vieillissement (base 98 °C = 1.0)', desc_en: 'Relative loss-of-life acceleration factor', unit: '-' }
      ],
      explanation_fr: 'Modèle thermique de l\'IEC 60076-7 : pour chaque tranche de 6 °C au-dessus de la température de référence de 98 °C, la vitesse de dégradation de la cellulose de papier imprégné double (V = 2, 4, 8...), réduisant drastiquement l\'espérance de vie du transformateur.',
      explanation_en: 'IEC 60076-7 thermal aging principle: every 6 °C increment above 98 °C doubles cellulose paper insulation depolymerization rate (V = 2, 4, 8...), slashing asset lifespan.',
      practical_example_fr: 'À 110 °C de point chaud (surcharge prolongée) : V = 2^((110 - 98)/6) = 2^2 = 4. Une journée à cette charge consomme 4 jours d\'espérance de vie nominale du transformateur.',
      practical_example_en: 'At 110 °C hot-spot: V = 2^((110 - 98)/6) = 4.0. One hour at this loading consumes 4 hours of normal insulation lifespan.',
      interactiveParams: [
        { key: 'tamb', label_fr: 'T° Ambiante (θamb)', label_en: 'Ambient Air Temp (θamb)', min: 10, max: 45, step: 1, defaultVal: 30, unit: '°C' },
        { key: 'loadRatio', label_fr: 'Taux de Charge (I/In)', label_en: 'Load Ratio (I/In)', min: 0.5, max: 1.5, step: 0.05, defaultVal: 1.15, unit: 'pu' }
      ],
      computeInteractiveResult: (p) => {
        const tamb = p.tamb ?? 30;
        const load = p.loadRatio ?? 1.15;
        // Approximation: deltaOil = 40 * load^1.6, deltaGrad = 20 * load^1.6
        const deltaOil = 40 * Math.pow(load, 1.6);
        const grad = 20 * Math.pow(load, 1.6);
        const ths = tamb + deltaOil + grad;
        const vAge = Math.pow(2, (ths - 98) / 6);
        const isCritical = ths > 115;
        return {
          resultLabel_fr: `T° Point Chaud = ${ths.toFixed(1)} °C | Vieillissement V = ${vAge.toFixed(2)}x`,
          resultLabel_en: `Hot-Spot Temp = ${ths.toFixed(1)} °C | Aging Factor V = ${vAge.toFixed(2)}x`,
          value: isCritical ? 'SURCHAUFFE CRITIQUE (DÉLESTAGE RECOMMANDÉ)' : 'FONCTIONNEMENT MAÎTRISÉ',
          status: isCritical ? 'CRITICAL' : vAge > 1.5 ? 'ACCEPTABLE' : 'OPTIMAL',
          note_fr: isCritical
            ? `À ${ths.toFixed(1)} °C, le papier isolant vieillit ${vAge.toFixed(1)} fois plus vite que la normale. Enclencher l'étage aéro-réfrigérant forcé ONAF2 immédiatement.`
            : `À ce niveau de charge, le vieillissement thermique est de ${vAge.toFixed(2)}x la valeur de référence de 98 °C.`,
          note_en: isCritical
            ? `At ${ths.toFixed(1)} °C, paper insulation ages ${vAge.toFixed(1)}x faster. Trigger forced ONAF2 cooling fans immediately.`
            : `Under this load, insulation loss-of-life is ${vAge.toFixed(2)}x baseline at 98 °C.`
        };
      }
    },
    {
      id: 'FORMULA_SURGE_DISTANCE',
      category: 'SURGE_INSULATION',
      standard: 'IEC 60071-1 / IEC 60099-4',
      title_fr: 'Distance Maximale de Protection du Parafoudre (ZnO)',
      title_en: 'Surge Arrester Maximum Protective Distance (Coordination)',
      formula: 'U_max = U_res + 2 · (du / dt) · (l / v)',
      variables: [
        { sym: 'U_max', desc_fr: 'Tension maximale atteinte sur les bornes du transformateur', desc_en: 'Maximum overvoltage at transformer terminals', unit: 'kV' },
        { sym: 'U_res', desc_fr: 'Tension résiduelle résiduelle du parafoudre pour 10 kA (8/20 µs)', desc_en: 'Arrester residual discharge voltage at 10 kA', unit: 'kV' },
        { sym: 'du / dt', desc_fr: 'Raideur de l\'onde de choc atmosphérique de foudre incidente', desc_en: 'Rate-of-rise (steepness) of incoming lightning surge', unit: 'kV/µs' },
        { sym: 'l', desc_fr: 'Distance physique de liaison entre parafoudre et traversée HTB', desc_en: 'Physical conductor distance from arrester to bushing', unit: 'mètres' },
        { sym: 'v', desc_fr: 'Vitesse de propagation de l\'onde le long des conducteurs (≈ 300 m/µs)', desc_en: 'Surge wave propagation velocity in air (≈ 300 m/µs)', unit: 'm/µs' }
      ],
      explanation_fr: 'L\'onde de foudre se réfléchit avec coefficient +1 sur la forte impédance d\'entrée du transformateur, doublant la surtension si le parafoudre est éloigné. La règle d\'art impose d\'implanter le parafoudre à moins de 5 à 15 mètres des traversées.',
      explanation_en: 'The lightning surge encounters open-circuit impedance at the transformer bushing and reflects with +1 reflection coefficient. If the arrester is too far away, voltage doubles at the transformer terminals, risking insulation breakdown.',
      practical_example_fr: 'Pour Ures = 520 kV, raideur 1000 kV/µs et distance l = 25 m : Umax = 520 + 2 · 1000 · (25 / 300) = 520 + 167 = 687 kV. Pour un transfo avec BIL = 650 kV, le diélectrique claque ! Rapprocher le parafoudre à 8 m (Umax = 573 kV < 650 kV).',
      practical_example_en: 'With Ures = 520 kV, steepness 1000 kV/µs and l = 25 m: Umax reaches 687 kV, exceeding a 650 kV BIL transformer! Shortening distance to 8 m lowers Umax to 573 kV, ensuring full protection margin.',
      interactiveParams: [
        { key: 'separationDist', label_fr: 'Distance Parafoudre-Transfo (l)', label_en: 'Distance Arrester-Trafo (l)', min: 2, max: 40, step: 1, defaultVal: 25, unit: 'm' },
        { key: 'slewRate', label_fr: 'Raideur Onde Foudre (du/dt)', label_en: 'Surge Steepness (du/dt)', min: 400, max: 2000, step: 100, defaultVal: 1000, unit: 'kV/µs' }
      ],
      computeInteractiveResult: (p) => {
        const l = p.separationDist ?? 25;
        const dudt = p.slewRate ?? 1000;
        const ures = 520;
        const v = 300;
        const umax = ures + 2 * dudt * (l / v);
        const bilTransformer = 650;
        const margin = ((bilTransformer - umax) / bilTransformer) * 100;
        const isProtected = umax <= bilTransformer;
        return {
          resultLabel_fr: `Umax Traversée = ${Math.round(umax)} kV (BIL Transfo = ${bilTransformer} kV)`,
          resultLabel_en: `Umax Terminal = ${Math.round(umax)} kV (Trafo BIL = ${bilTransformer} kV)`,
          value: isProtected ? 'MARGE D\'ISOLEMENT CONFORME' : 'RISQUE DE CLAQUAGE DIÉLECTRIQUE !',
          status: isProtected ? 'OPTIMAL' : 'CRITICAL',
          note_fr: isProtected
            ? `Marge de coordination = +${margin.toFixed(1)}%. Le parafoudre à ${l} m protège efficacement les traversées contre l'onde incidente.`
            : `À ${l} m, la surtension réfléchie (${Math.round(umax)} kV) dépasse la tenue au choc BIL (${bilTransformer} kV). Rapprocher le parafoudre à ≤ 12 m.`,
          note_en: isProtected
            ? `Coordination safety margin = +${margin.toFixed(1)}%. Arrester positioned at ${l} m successfully protects the bushing.`
            : `At ${l} m, reflected surge (${Math.round(umax)} kV) breaches 650 kV BIL. Relocate arrester to ≤ 12 m.`
        };
      }
    },
    {
      id: 'FORMULA_BATTERY',
      category: 'AUXILIARY',
      standard: 'IEEE Std 485 / IEC 60896',
      title_fr: 'Dimensionnement de la Batterie 110 Vcc en Capacité',
      title_en: 'Station Battery Capacity Sizing for 10-Hour Autonomy',
      formula: 'C_Ah = (∑ I_perm · t_autonomie + ∑ I_pointe · t_choc) / (K_t · K_d · K_e)',
      variables: [
        { sym: 'C_Ah', desc_fr: 'Capacité nominale requise en régime de décharge 10h (C10)', desc_en: 'Required battery capacity in 10-hour rate (C10)', unit: 'Ah' },
        { sym: 'I_perm', desc_fr: 'Courant de décharge permanent continu (relais, voyants, calculateurs SAS)', desc_en: 'Continuous steady-state discharge load', unit: 'A' },
        { sym: 't_autonomie', desc_fr: 'Autonomie obligatoire en absence d\'alimentation auxiliaire alternative', desc_en: 'Required blackout backup duration (typically 8 to 10 hours)', unit: 'heures' },
        { sym: 'I_pointe', desc_fr: 'Courant d\'enclenchement / déclenchement simultané des bobines disjoncteurs', desc_en: 'Momentary breaker trip/close coil impulse', unit: 'A' },
        { sym: 'K_t / K_d / K_e', desc_fr: 'Coefficients de température (0.9), vieillissement (0.8) et marge (1.1)', desc_en: 'Temperature derating (0.9), aging (0.8), and design factor (1.1)', unit: '-' }
      ],
      explanation_fr: 'Garantit que même après 10 heures de panne totale du réseau alternatif (perte des TSA), la batterie 110 Vcc dispose encore de l\'énergie nécessaire pour déclencher simultanément tous les disjoncteurs du poste pour isoler un défaut ultime.',
      explanation_en: 'Ensures that even after a 10-hour total grid blackout (complete loss of station AC auxiliaries), the 110 V DC battery system retains enough electrochemical energy to trip all bay circuit breakers simultaneously.',
      practical_example_fr: 'Pour 32 A permanent sur 10 h (320 Ah) + 5 bobines à 80 A (0.5 Ah), avec facteur global de marge 1.35 : Capacité minimale C10 = 320.5 · 1.35 = 432 Ah.',
      practical_example_en: 'For 32 A continuous over 10 hours with 1.35 global design factor: minimum station battery capacity is 432 Ah.',
      interactiveParams: [
        { key: 'iperm', label_fr: 'Courant Permanent (Iperm)', label_en: 'Continuous Load (Iperm)', min: 10, max: 80, step: 2, defaultVal: 32, unit: 'A' },
        { key: 'taut', label_fr: 'Autonomie Requise (t)', label_en: 'Backup Hours (t)', min: 4, max: 24, step: 1, defaultVal: 10, unit: 'h' },
        { key: 'ipointe', label_fr: 'Courant Bobines Déclenchement', label_en: 'Trip Coil Impulse', min: 20, max: 150, step: 10, defaultVal: 80, unit: 'A' }
      ],
      computeInteractiveResult: (p) => {
        const iperm = p.iperm ?? 32;
        const taut = p.taut ?? 10;
        const ipointe = p.ipointe ?? 80;
        const baseAh = iperm * taut + ipointe * 0.01;
        const totalCapacity = baseAh / (0.9 * 0.8 * 0.9); // margin factors
        const roundedAh = Math.ceil(totalCapacity / 25) * 25;
        return {
          resultLabel_fr: `Capacité Requise C10 = ${roundedAh} Ah`,
          resultLabel_en: `Required C10 Rating = ${roundedAh} Ah`,
          value: `BANQUE BATTERIE: ${roundedAh} Ah (55 ÉLÉMENTS PLOMB-ACIDE)`,
          status: 'OPTIMAL',
          note_fr: `Avec ${iperm} A permanent sur ${taut} h et marge de vieillissement de 25%, la batterie 110 Vcc doit être calibrée à ${roundedAh} Ah.`,
          note_en: `With ${iperm} A steady load over ${taut} h and 25% aging reserve, specify an industrial ${roundedAh} Ah battery bank.`
        };
      }
    }
  ];

  const filteredFormulas = categoryFilter === 'ALL' 
    ? formulas 
    : formulas.filter((f) => f.category === categoryFilter);

  const currentFormula = formulas.find((f) => f.id === activeFormulaId) || formulas[0];

  const handleParamChange = (key: string, val: number) => {
    setUserParams((prev) => ({ ...prev, [key]: val }));
  };

  if (!isOpen) return null;

  const currentCalculation = currentFormula.computeInteractiveResult 
    ? currentFormula.computeInteractiveResult(userParams)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#090D14] border-l border-[#222B38] h-full overflow-y-auto p-6 space-y-6 font-mono shadow-2xl flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222B38] pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Calculator className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-wide">
                    {locale === 'fr' ? 'Formulaire & Principes Mathématiques du Poste' : 'Substation Engineering Principles & Laws'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    6 FORMULES CEI / IEEE
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans font-normal block mt-0.5">
                  {locale === 'fr' 
                    ? 'Lois physiques électrotechniques, calculs interactifs temps réel et cas concrets' 
                    : 'Governing physical formulations, live interactive calculations, and utility standards'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-bold mr-1 text-[10px] uppercase">
              {locale === 'fr' ? 'Domaines :' : 'Domains:'}
            </span>
            {[
              { id: 'ALL', label_fr: 'Toutes', label_en: 'All' },
              { id: 'PROTECTION', label_fr: 'Protection 87T', label_en: 'Protection 87T' },
              { id: 'ELECTROTECHNICAL', label_fr: 'Court-Circuit', label_en: 'Short-Circuit' },
              { id: 'SAFETY', label_fr: 'Sécurité IEEE 80', label_en: 'Safety IEEE 80' },
              { id: 'TRANSFORMER', label_fr: 'Thermique Transfo', label_en: 'Transformer Thermal' },
              { id: 'SURGE_INSULATION', label_fr: 'Parafoudres & BIL', label_en: 'Surge Arresters' },
              { id: 'AUXILIARY', label_fr: 'Batteries 110V', label_en: 'Batteries 110V' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-[#0E141F] text-slate-400 border-[#222B38] hover:text-white'
                }`}
              >
                {locale === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            ))}
          </div>

          {/* Formula Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {filteredFormulas.map((f) => {
              const isSelected = f.id === activeFormulaId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFormulaId(f.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-bold">{f.standard}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px] border border-slate-800">
                      {f.category}
                    </span>
                  </div>
                  <span className="font-bold text-[11px] leading-snug line-clamp-2">
                    {locale === 'fr' ? f.title_fr : f.title_en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Formula Detailed Deep-Dive Card */}
          <div className="p-5 rounded-2xl bg-[#05070B] border border-[#1E2634] space-y-5 shadow-inner">
            
            {/* Title & Standard Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400/80 font-bold tracking-wider uppercase block">
                  {currentFormula.standard}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {locale === 'fr' ? currentFormula.title_fr : currentFormula.title_en}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 font-bold shrink-0 self-start sm:self-auto">
                {currentFormula.category}
              </span>
            </div>

            {/* Core Mathematical Formulation Equation */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {locale === 'fr' ? 'ÉQUATION FONDAMENTALE :' : 'GOVERNING EQUATION:'}
              </span>
              <div className="p-4 rounded-xl bg-[#0D121B] border border-amber-500/40 text-amber-300 font-bold text-sm sm:text-base text-center select-all shadow-md tracking-wide">
                {currentFormula.formula}
              </div>
            </div>

            {/* Interactive Calculator Simulator (If Available) */}
            {currentFormula.interactiveParams && currentFormula.computeInteractiveResult && (
              <div className="p-4 rounded-xl bg-[#080D17] border border-sky-500/30 space-y-3.5">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                    <Sliders className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'Simulateur Numérique Interactif' : 'Interactive Parametric Calculator'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {locale === 'fr' ? 'Modifiez les curseurs en temps réel' : 'Adjust sliders in real time'}
                  </span>
                </div>

                {/* Slider Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentFormula.interactiveParams.filter(Boolean).map((param) => {
                    const fallbackVal = param.defaultVal ?? param.min ?? 0;
                    const val = userParams[param.key] ?? fallbackVal;
                    return (
                      <div key={param.key} className="p-2.5 rounded-lg bg-[#05070B] border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 font-sans">
                            {locale === 'fr' ? param.label_fr : param.label_en} :
                          </span>
                          <span className="font-mono font-bold text-amber-400">
                            {val} {param.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={val}
                          onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Dynamic Computed Output */}
                {currentCalculation && (
                  <div className={`p-3 rounded-xl border flex flex-col gap-1.5 text-xs ${
                    currentCalculation.status === 'OPTIMAL'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : currentCalculation.status === 'ACCEPTABLE'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/25 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] uppercase tracking-wider">
                        {locale === 'fr' ? currentCalculation.resultLabel_fr : currentCalculation.resultLabel_en}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-extrabold bg-slate-950/80 border border-current">
                        {currentCalculation.value}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans font-normal leading-relaxed opacity-90">
                      {locale === 'fr' ? currentCalculation.note_fr : currentCalculation.note_en}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Variables & Units Table */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {locale === 'fr' ? 'Grandeurs & Unités Normalisées :' : 'Standardized Physical Quantities & Units:'}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {currentFormula.variables.map((v, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#070A10] border border-slate-800/90 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-mono text-xs">{v.sym} :</strong>
                      <span className="text-slate-300 font-sans font-normal">
                        {locale === 'fr' ? v.desc_fr : v.desc_en}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-3 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      [{v.unit}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Mechanism & Utility Rules */}
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-[11px]">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">
                  {locale === 'fr' ? 'Signification Physique & Règle Métier' : 'Physical Mechanism & Utility Best Practices'}
                </span>
              </div>
              <p className="text-slate-300 font-sans font-normal leading-relaxed text-[11px]">
                {locale === 'fr' ? currentFormula.explanation_fr : currentFormula.explanation_en}
              </p>
            </div>

            {/* Real Substation Numerical Benchmark */}
            <div className="p-3.5 rounded-xl bg-amber-950/15 border border-amber-500/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                <Activity className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">
                  {locale === 'fr' ? 'Étude de Cas Réseau (Poste 225/90 kV)' : 'Grid Benchmark Study (225/90 kV Substation)'}
                </span>
              </div>
              <p className="text-amber-200/90 font-mono text-[11px] leading-relaxed">
                {locale === 'fr' ? currentFormula.practical_example_fr : currentFormula.practical_example_en}
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-[#222B38] flex items-center justify-between text-[11px] text-slate-400">
          <span>Normes CEI 60909 / 60076 / IEEE Std 80</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            {locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
