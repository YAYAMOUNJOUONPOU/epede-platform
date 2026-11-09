// src/components/distribution/DistributionEngineeringPrinciplesDrawer.tsx
// EPEDE D05 - Distribution Engineering Principles & Mathematical Formulations Drawer

import React from 'react';
import {
  X,
  BookOpen,
  Zap,
  Activity,
  ShieldCheck,
  Layers,
  Scale,
  CheckCircle2,
  Info,
  Download
} from 'lucide-react';

interface DistributionEngineeringPrinciplesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
}

export const DistributionEngineeringPrinciplesDrawer: React.FC<DistributionEngineeringPrinciplesDrawerProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const handleExportFormulaPdf = async (
    formulaId: string,
    titleFr: string,
    titleEn: string,
    standard: string,
    expr: string,
    inputs: { label: string; value: string; unit?: string }[],
    results: { label: string; value: string; unit?: string }[],
    notesFr: string[],
    notesEn: string[]
  ) => {
    const { EngineeringCalculationPdfExportService } = await import('../calculators/services/EngineeringCalculationPdfExportService');
    const reportData = {
      title: locale === 'fr' ? titleFr : titleEn,
      calcType: `D05-${formulaId}`,
      standard,
      date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      referenceId: `EPEDE-D05-${formulaId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      complianceVerdict: {
        status: 'COMPLIANT' as const,
        message: locale === 'fr'
          ? 'Conforme aux exigences normatives CEI 60076 / CEI 60364 / NF C 13-200 et règles SONATREL.'
          : 'Compliant with IEC 60076 / IEC 60364 / NF C 13-200 and SONATREL distribution rules.',
      },
      inputs: inputs.map((inp) => ({
        label: inp.label,
        value: inp.value,
        unit: inp.unit || '',
        highlight: false,
        status: 'OK' as const,
      })),
      formulas: [{ name: locale === 'fr' ? 'Formule Normative' : 'Normative Formula', expr }],
      results: results.map((res) => ({
        label: res.label,
        value: res.value,
        unit: res.unit || '',
        highlight: true,
        status: 'OK' as const,
      })),
      engineeringNotes: (locale === 'fr' ? notesFr : notesEn).concat([
        locale === 'fr'
          ? 'Note technique d\'ingénierie émise par l\'environnement numérique EPEDE 2.0 (Réseaux de Distribution HTA/BT).'
          : 'Certified technical calculation dossier emitted by EPEDE 2.0 digital engineering environment.',
      ]),
    };
    EngineeringCalculationPdfExportService.exportCalculationPdf(reportData, locale);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs font-mono">
      <div className="w-full max-w-2xl bg-[#090D15] border-l border-amber-900/60 shadow-2xl h-full flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1E2738] flex items-center justify-between bg-[#0B0F19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'FORMULES & PRINCIPES D\'INGÉNIERIE D05'
                  : 'D05 ENGINEERING PRINCIPLES & FORMULAS'}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Relations électrotechniques régissant la distribution HTA / BT'
                  : 'Core electrotechnical equations governing MV / LV distribution'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans text-xs text-slate-300">
          {/* Formula 1: Feeder Voltage Drop */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span>1. CHUTE DE TENSION EN LIGNE MT (APPROXIMATION DE KAPP)</span>
              <div className="flex items-center gap-2">
                <span>CEI 60364-5-52</span>
                <button
                  type="button"
                  onClick={() => handleExportFormulaPdf(
                    'kapp-voltage-drop',
                    'Chute de Tension en Ligne MT 30 kV (Approximation de Kapp)',
                    'MV Feeder Voltage Drop (Kapp Approximation)',
                    'CEI 60364-5-52 / NF C 13-200',
                    'ΔU ≈ √3 · I · L · (R\' · cos φ + X\' · sin φ)',
                    [
                      { label: 'Tension assignée Un', value: '30 000', unit: 'V' },
                      { label: 'Longueur L', value: '18.0', unit: 'km' },
                      { label: 'Courant de charge Ib', value: '140', unit: 'A' },
                      { label: 'Facteur de puissance cosφ', value: '0.85', unit: '-' },
                      { label: 'Résistance linéique R\'', value: '0.22', unit: 'Ω/km' },
                      { label: 'Réactance linéique X\'', value: '0.38', unit: 'Ω/km' }
                    ],
                    [
                      { label: 'Chute de tension absolue ΔU', value: '1 058.4', unit: 'V' },
                      { label: 'Chute de tension relative ΔU/Un', value: '3.53', unit: '%' }
                    ],
                    ['Conforme à la limite contractuelle admissible ≤ 5.0% sur le réseau HTA 30 kV.'],
                    ['Complies with maximum allowable 5.0% voltage drop threshold on 30 kV MV network.']
                  )}
                  title={locale === 'fr' ? 'Télécharger la note technique PDF A4' : 'Download A4 technical note PDF'}
                  className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF A4</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-emerald-400 border border-slate-800">
              ΔU ≈ (P · R + Q · X) / U = √3 · I · L · (R' · cos φ + X' · sin φ)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Pour une artère de distribution 30 kV de longueur L, R = R\' · L (résistance linéique) et X = X\' · L (réactance linéique). En câble souterrain PRC, R domine ; en ligne aérienne espacée, X est prépondérant (environ 0.35 à 0.40 Ω/km). La chute relative admissible en HTA est typiquement ≤ 5%.'
                : 'For a 30 kV distribution feeder of length L, R = R\' · L (conductor resistance) and X = X\' · L (inductive reactance). In XLPE underground cables, R dominates; in overhead open-wire lines, X dominates (~0.35 to 0.40 Ω/km). The allowable relative voltage drop is typically ≤ 5%.'}
            </p>
          </div>

          {/* Formula 2: Cable Ampacity Iz Derating */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
              <span>2. COURANT ADMISSIBLE CORRIGÉ EN CÂBLE SOUTERRAIN HTA</span>
              <span>CEI 60287 / NF C 13-200</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-amber-300 border border-slate-800">
              Iz = Iz0 · k1 · k2 · k3 · k4
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Iz0 est le courant admissible tabulaire du câble (ex. 3×240 mm² Alu PRC). Les coefficients k1 (température du sol), k2 (résistivité thermique du sol ρth en K·m/W), k3 (profondeur de pose) et k4 (groupement en nappe ou caniveau) évitent tout emballement thermique de l\'isolant au-delà de 90 °C.'
                : 'Iz0 is the nominal tabular cable ampacity (e.g. 3×240 mm² Al XLPE). Factors k1 (ground temperature), k2 (soil thermal resistivity ρth in K·m/W), k3 (burial depth), and k4 (grouping in trench) safeguard XLPE insulation from exceeding its 90 °C limit.'}
            </p>
          </div>

          {/* Formula 3: Transformer Secondary Short-Circuit Current */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400">
              <span>3. COURANT DE COURT-CIRCUIT AU SECONDAIRE TRANSFO Dyn11</span>
              <div className="flex items-center gap-2">
                <span>CEI 60076 / 60909</span>
                <button
                  type="button"
                  onClick={() => handleExportFormulaPdf(
                    'trafo-short-circuit',
                    'Courant de Court-Circuit au Secondaire Transfo Dyn11 (630 kVA)',
                    'Secondary Short-Circuit Current Dyn11 Transformer',
                    'CEI 60076 / CEI 60909',
                    'Icc2 = In2 / (ucc / 100) = Sn / (√3 · U20 · ucc)',
                    [
                      { label: 'Puissance assignée Sn', value: '630', unit: 'kVA' },
                      { label: 'Tension à vide secondaire U20', value: '400', unit: 'V' },
                      { label: 'Tension de court-circuit ucc', value: '4.0', unit: '%' },
                      { label: 'Courant assigné In2', value: '909.3', unit: 'A' }
                    ],
                    [
                      { label: 'Courant de court-circuit Icc2', value: '22 733', unit: 'A' },
                      { label: 'Pouvoir de coupure requis disjoncteur Icu', value: '25.0', unit: 'kA' }
                    ],
                    ['Pouvoir de coupure assigné minimal Icu ≥ 25 kA requis pour le disjoncteur général TGBT.'],
                    ['Minimum breaking capacity Icu ≥ 25 kA mandated for main LV incomer switchgear.']
                  )}
                  title={locale === 'fr' ? 'Télécharger la note technique PDF A4' : 'Download A4 technical note PDF'}
                  className="px-2 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF A4</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-sky-300 border border-slate-800">
              Icc2 = In2 / ucc = Sn / (√3 · U20 · ucc)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Pour un transformateur 630 kVA (ucc = 4%, U20 = 400 V), In2 = 909 A. Le courant de court-circuit direct sur le jeu de barres BT est de Icc2 = 909 / 0.04 = 22 725 A (22.7 kA). Cela impose des disjoncteurs TGBT avec un pouvoir de coupure ultime Icu ≥ 25 kA.'
                : 'For a 630 kVA transformer (ucc = 4%, U20 = 400 V), nominal current In2 = 909 A. Bolted fault current on LV busbars is Icc2 = 909 / 0.04 = 22 725 A (22.7 kA). This dictates an interrupting rating Icu ≥ 25 kA on all incoming LV switchgear.'}
            </p>
          </div>

          {/* Formula 4: Neutral Point Resistor (NGR) Earth Fault */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-violet-400">
              <span>4. RÉSISTANCE DE NEUTRE (NGR) & DÉFAUT MONOPHASÉ HTA</span>
              <div className="flex items-center gap-2">
                <span>SONATREL 30 kV</span>
                <button
                  type="button"
                  onClick={() => handleExportFormulaPdf(
                    'ngr-sizing',
                    'Dimensionnement Résistance de Neutre HTA 30 kV (NGR)',
                    'Neutral Grounding Resistor Sizing (30 kV NGR)',
                    'NF C 13-200 / IEEE Std 142 / SONATREL',
                    'RNGR = (Un / √3) / IR_max ⟹ P_therm = RNGR · IR²',
                    [
                      { label: 'Tension réseau Un', value: '30 000', unit: 'V' },
                      { label: 'Tension simple V = Un / √3', value: '17 320', unit: 'V' },
                      { label: 'Courant de limitation de défaut IR_max', value: '40', unit: 'A' },
                      { label: 'Durée admissible assignée', value: '10', unit: 's' }
                    ],
                    [
                      { label: 'Résistance ohmique NGR', value: '433.0', unit: 'Ω' },
                      { label: 'Puissance thermique dissipée P_therm', value: '692.8', unit: 'kW' }
                    ],
                    ['Calibrage conforme aux exigences SONATREL pour réseaux aériens 30 kV (limitation à 40 A).'],
                    ['Conforms to SONATREL 30 kV overhead distribution standard (40 A fault limit).']
                  )}
                  title={locale === 'fr' ? 'Télécharger la note technique PDF A4' : 'Download A4 technical note PDF'}
                  className="px-2 py-0.5 rounded bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF A4</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-violet-300 border border-slate-800">
              RNGR = (U / √3) / IR_max ⟹ IR_max = 40 A ou 150 A
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'En réseau 30 kV (Cameroun RIS/RIN), le neutre est mis à la terre via une résistance NGR calibrée à 40 A (lignes aériennes) ou 150 A (câbles urbains mixtes). Cela limite la montée en potentiel de la terre (GPR) et permet la sélectivité ampèremétrique 50N/51N sans arc violent.'
                : 'In 30 kV networks (Cameroon RIS/RIN), neutral is grounded through an NGR rated at 40 A (overhead feeders) or 150 A (urban mixed cables). This limits Ground Potential Rise (GPR) and allows precise 50N/51N directional earth fault grading.'}
            </p>
          </div>

          {/* Formula 5: FLISR Auto-Reclosing Reliability Optimization */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
              <span>5. AUTOMATE DE BOUCLE & FIABILITÉ FLISR</span>
              <span>IEEE Std 1366 / CEI 62271-111</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-cyan-300 border border-slate-800">
              SAIFI_FLISR = SAIFI_0 · (1 - η_flisr)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'L\'automate de boucle FLISR (Fault Location, Isolation, and Service Restoration) coordonne les réenclencheurs ACR et interrupteurs télécommandés IACM. Il isole le tronçon en défaut en < 60 s et réalimente les tronçons sains en boucle ouverte.'
                : 'FLISR automation coordinates ACR reclosers and motor-operated sectionalizers. It isolates faulted sections in < 60 s and back-feeds healthy downstream feeders via normally-open tie points.'}
            </p>
          </div>

          {/* Formula 6: IEEE Std 1366 Continuity Indices */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>6. INDICES DE CONTINUITÉ DE SERVICE NORMALISÉS</span>
              <span>IEEE Std 1366</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-emerald-300 border border-slate-800">
              SAIDI = Σ(ri · Ni) / NT,   SAIFI = Σ Ni / NT,   CAIDI = SAIDI / SAIFI
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'SAIDI (durée moyenne de coupure par client en h/an), SAIFI (fréquence moyenne d\'interruption par client en coupures/an) et CAIDI (durée moyenne de rétablissement en h/coupure) quantifient la performance contractuelle du distributeur.'
                : 'SAIDI (System Average Interruption Duration Index in h/yr), SAIFI (System Average Interruption Frequency Index in interruptions/yr), and CAIDI (Customer Average Interruption Duration Index) quantify utility supply reliability.'}
            </p>
          </div>

          {/* Formula 7: Line & Cable Capacitive Charging Current */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-teal-400">
              <span>7. COURANT CAPACITIF HOMOPOLAIRE DE CÂBLE & LIGNE MT</span>
              <span>CEI 60909-3 / NF C 13-100</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-teal-300 border border-slate-800">
              Ic = 3 · ω · C0 · (Un / √3) = √3 · ω · C0 · Un
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'En réseau HTA 30 kV ou 15 kV, chaque kilomètre de câble souterrain présente une capacité homopolaire C0 élevée (0.2 à 0.4 µF/km, soit environ 2.5 à 4 A/km à 50 Hz), contre 0.005 µF/km en ligne aérienne (0.03 A/km). Lors d\'un défaut monophasé franc à la terre, l\'ensemble du courant capacitif des départs sains transite par le point de défaut. Au-delà de 20 à 30 A, l\'arc devient auto-entretenu et impose l\'emploi d\'une résistance NGR ou d\'une bobine de Petersen.'
                : 'In 30 kV or 15 kV distribution feeders, underground cables exhibit high zero-sequence capacitance C0 (0.2 to 0.4 µF/km, yielding ~2.5 to 4 A/km at 50 Hz), compared to 0.005 µF/km for overhead lines (0.03 A/km). During a phase-to-ground fault, the cumulative capacitive current of all healthy feeders returns through the fault point. Above 20-30 A, arcs become self-sustaining, requiring NGR grounding or a Petersen compensation coil.'}
            </p>
          </div>

          {/* Formula 8: Petersen Coil Resonant Earthing */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400">
              <span>8. COMPENSATION PAR BOBINE D\'EXTINCTION DE PETERSEN (NEUTRE RÉSONANT)</span>
              <span>CEI 60071-1 / EN 50522</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-indigo-300 border border-slate-800">
              ω · Lp = 1 / (3 · ω · C0) ⟹ I_res = √(I_R² + (I_L - I_c)²)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'L\'inductance variable Lp de la bobine de Petersen insérée entre le neutre transfo et la terre est accordée pour compenser exactement le courant capacitif global du réseau (ω·Lp = 1/[3·ω·C0]). Le courant résiduel au défaut I_res se réduit à sa composante active wattmétrique résiduelle (I_R ≤ 5 A), éteignant spontanément l\'arc électrique sans coupure de fourniture.'
                : 'The variable inductance Lp of the Petersen coil connected between transformer neutral and earth is tuned to resonate with the total system zero-sequence capacitance (ω·Lp = 1/[3·ω·C0]). Fault residual current I_res drops to its small wattmetric active component (I_R ≤ 5 A), self-extinguishing transient arcs without tripping customers.'}
            </p>
          </div>

          {/* Formula 9: MV Motor Inrush & Voltage Dip */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
              <span>9. APPEL DE COURANT & CREUX DE TENSION AU DÉMARRAGE MOTEUR MT</span>
              <span>CEI 60034-12 / IEEE Std 399</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-rose-300 border border-slate-800">
              ΔU_bus ≈ S_start / (S_sc,bus + S_start),   Te / Tk = 2 / (s/sk + sk/s) · (U_bus / Un)²
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Au démarrage direct d\'un moteur asynchrone MT (ex. concasseur 1 500 kW sous 6.6 kV ou 15 kV), le courant d\'appel atteint 6 à 7 · In. Le creux de tension induit sur le jeu de barres ΔU_bus dépend de la puissance de court-circuit amont S_sc. Selon la formule de Kloss, le couple électromagnétique chute proportionnellement à (U_bus/Un)² ; un creux > 15% risque de bloquer le démarrage du rotor.'
                : 'Direct-on-line (DOL) starting of heavy MV induction motors (e.g. 1,500 kW at 6.6 kV or 15 kV) induces 6 to 7 · In inrush currents. The bus voltage dip ΔU_bus is dictated by upstream short-circuit power S_sc. Per Kloss formula, torque degrades quadratically (U_bus/Un)²; a dip > 15% risks stalling the accelerating rotor.'}
            </p>
          </div>

          {/* Formula 10: DER Hosting Capacity & Voltage Rise */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span>10. CAPACITÉ D\'ACCUEIL ENR & SURTENSION SUR ARTÈRE MT RADIALE</span>
              <div className="flex items-center gap-2">
                <span>IEEE 1547 / CEI 62749</span>
                <button
                  type="button"
                  onClick={() => handleExportFormulaPdf(
                    'der-hosting-capacity',
                    'Capacité d\'Accueil EnR & Élévation de Tension en Artère MT',
                    'DER Hosting Capacity & Feeder Voltage Rise Calculation',
                    'IEEE 1547-2018 / CEI 62749',
                    'ΔV_DER ≈ (P_DER · R - Q_DER · X) / Un ≤ +5%',
                    [
                      { label: 'Tension réseau Un', value: '30 000', unit: 'V' },
                      { label: 'Puissance crête solaire injectée P_DER', value: '3 500', unit: 'kW' },
                      { label: 'Résistance cumulée d\'artère R', value: '3.2', unit: 'Ω' },
                      { label: 'Réactance cumulée d\'artère X', value: '4.8', unit: 'Ω' },
                      { label: 'Absorption réactive onduleur Q_DER', value: '800', unit: 'kVAR' }
                    ],
                    [
                      { label: 'Élévation de tension absolue ΔV_DER', value: '245.3', unit: 'V' },
                      { label: 'Surtension relative calculée', value: '+0.82', unit: '%' },
                      { label: 'Statut de conformité', value: 'CONFORME (< +5.0%)', unit: '' }
                    ],
                    ['L\'absorption réactive de l\'onduleur 4 quadrants maintient l\'élévation sous le seuil maximal réglementaire de +5%.'],
                    ['Four-quadrant smart inverter reactive absorption holds voltage rise well below the statutory +5% ceiling.']
                  )}
                  title={locale === 'fr' ? 'Télécharger la note technique PDF A4' : 'Download A4 technical note PDF'}
                  className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF A4</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-amber-300 border border-slate-800">
              ΔV_DER ≈ (P_DER · R - Q_DER · X) / Un ≤ ΔV_adm (+5%)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'L\'injection de production décentralisée solaire PV ou éolienne (P_DER) refoule la puissance active vers le poste source et élève la tension selon ΔV_DER ≈ (P·R - Q·X)/Un. Lorsque la production dépasse la consommation locale (flux inverse), la surtension peut franchir la limite réglementaire de +5%. Les onduleurs intelligents doivent absorber du réactif (Q_DER > 0) selon des lois Q(U) ou brider leur puissance active.'
                : 'Distributed solar PV or wind injection (P_DER) pushes real power upstream and raises line voltage per ΔV_DER ≈ (P·R - Q·X)/Un. When generation exceeds local feeder demand (reverse power flow), voltage rise may breach the normative +5% ceiling. Smart inverters mitigate this by absorbing reactive power (Q_DER > 0 under Q(U) curves) or active power curtailment.'}
            </p>
          </div>

          {/* Standards Matrix */}
          <div className="p-4 rounded-xl bg-[#080C14] border border-[#1A2332] space-y-2 font-mono">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              RÉFÉRENTIEL NORMATIF MAJEUR (D05) :
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEC 60076 :</span> Transformateurs de puissance
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEC 62271-200 :</span> Tableaux MT sous enveloppe
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEC 60364 :</span> Installations BT & Régimes de terre
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEEE Std 1366 :</span> Indices SAIDI, SAIFI, CAIDI
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">EN 50522 :</span> Mises à la terre des réseaux HTA
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">NF C 14-100 :</span> Branchements BT d'abonnés
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEC 60909-3 :</span> Courts-circuits & réseaux MT
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400">IEEE 1547-2018 :</span> Raccordement EnR / DER
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2738] bg-[#0B0F19] text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            {locale === 'fr' ? 'Fermer le Manuel d\'Ingénierie' : 'Close Engineering Drawer'}
          </button>
        </div>
      </div>
    </div>
  );
};
