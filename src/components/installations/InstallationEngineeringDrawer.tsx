// src/components/installations/InstallationEngineeringDrawer.tsx
// EPEDE D06 - Electrotechnical Formulas & International Normative Reference Drawer

import React from 'react';
import {
  X,
  BookOpen,
  Scale,
  Zap,
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';

interface InstallationEngineeringDrawerProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onOpenKnowledgeMap?: () => void;
}

export const InstallationEngineeringDrawer: React.FC<InstallationEngineeringDrawerProps> = ({
  locale,
  isOpen,
  onClose,
  onOpenKnowledgeMap
}) => {
  if (!isOpen) return null;

  const formulas = [
    {
      title_fr: '1. Puissances Triphasées Équilibrées (Active, Réactive, Apparente)',
      title_en: '1. Balanced 3-Phase Powers (Active, Reactive, Apparent)',
      formula: 'P = √3 · U · I · cosφ   |   Q = √3 · U · I · sinφ   |   S = √3 · U · I = √(P² + Q²)',
      desc_fr: 'U = tension composée entre phases (400 V), I = courant de ligne (A), cosφ = facteur de puissance.',
      desc_en: 'U = line-to-line voltage (400 V), I = line current (A), cosφ = power factor.'
    },
    {
      title_fr: '2. Formule Approchée de Chute de Tension de Kapp (ΔU)',
      title_en: '2. Kapp Voltage Drop Approximation (ΔU)',
      formula: 'ΔU = b · [ (ρ₁ · (L / S) · cosφ) + (λ · L · sinφ) ] · I',
      desc_fr: 'b = √3 en triphasé (ou 2 en monophasé), ρ₁ = résistivité du conducteur chaud (0.0225 Ω·mm²/m Cuivre), λ = réactance linéique (~0.08 mΩ/m), L = longueur (m), S = section (mm²).',
      desc_en: 'b = √3 in three-phase (or 2 in single-phase), ρ₁ = operating resistivity (0.0225 Ω·mm²/m for Cu), λ = line reactance (~0.08 mΩ/m), L = length, S = cross-section.'
    },
    {
      title_fr: '3. Condition de Sécurité en Régime TT (Tension Limite UL = 50 V)',
      title_en: '3. TT System Safety Condition (Touch Limit UL = 50 V)',
      formula: 'RA · IΔn ≤ UL (50 V en milieu sec, 25 V en milieu humide)',
      desc_fr: 'RA = résistance de la prise de terre des masses d\'abonné (Ω), IΔn = sensibilité du dispositif différentiel (ex. 30 mA ou 500 mA). Pour IΔn = 500 mA, RA doit être ≤ 100 Ω.',
      desc_en: 'RA = earth electrode resistance of installation frames (Ω), IΔn = residual device rating. For 500 mA, RA must be ≤ 100 Ω.'
    },
    {
      title_fr: '4. Condition de Déclenchement Magnétique en Régime TN',
      title_en: '4. TN System Magnetic Trip Condition',
      formula: 'Zs · Ia ≤ U₀   ou   Lmax = (0.8 · U₀ · S) / (2 · ρ · Ia)',
      desc_fr: 'Zs = impédance totale de la boucle de défaut phase-PE, Ia = courant assurant le déclenchement instantané du disjoncteur (ex. 10 · In pour courbe C), U₀ = 230 V.',
      desc_en: 'Zs = total earth fault loop impedance, Ia = current causing instant magnetic trip (e.g. 10 · In for Curve C), U₀ = 230 V.'
    },
    {
      title_fr: '5. Contrainte Thermique Admissible des Câbles en Court-Circuit',
      title_en: '5. Cable Thermal Withstand Constraint During Fault',
      formula: 'I² · t ≤ k² · S²',
      desc_fr: 'I = courant de court-circuit efficace présumé (A), t = temps de coupure de l\'appareil (s), S = section du conducteur (mm²), k = constante matière (115 pour Cu/PVC, 143 pour Cu/PR/XLPE).',
      desc_en: 'I = rms short-circuit current, t = fault duration (s), S = conductor size (mm²), k = material constant (115 for Cu/PVC, 143 for Cu/XLPE).'
    },
    {
      title_fr: '6. Pertes Joules Calorifiques Triphasées',
      title_en: '6. Three-Phase Joule Heat Dissipation',
      formula: 'Pjoule = 3 · R · I² = 3 · [ ρ · (L / S) ] · I²',
      desc_fr: 'Quantité d\'énergie dissipée sous forme de chaleur le long des conducteurs de distribution ou jeux de barres.',
      desc_en: 'Total caloric energy wasted as heat along distribution cables and busbar trunks.'
    }
  ];

  const standards = [
    { code: 'CEI 60364 / NF C 15-100', title: 'Installations électriques à basse tension (Règles fondamentales, dimensionnement des câbles & protection)' },
    { code: 'CEI 61439-1 & 2', title: 'Ensembles d\'appareillage à basse tension (TGBT, formes de séparation 1 à 4b, Icw & tenue thermique)' },
    { code: 'CEI 60909 / NF EN 60909', title: 'Calcul des courants de court-circuit dans les réseaux triphasés à courant alternatif (Méthode des impédances)' },
    { code: 'CEI 60947-2', title: 'Appareillage industriel : Disjoncteurs de puissance (ACB, MCCB, sélectivité & filiation)' },
    { code: 'CEI 60898-1', title: 'Disjoncteurs modulaires pour installations domestiques et analogues (MCB Courbes B, C, D)' },
    { code: 'CEI 61008 / 61009', title: 'Interrupteurs et disjoncteurs différentiels résiduels (RCCB & RCBO, types AC, A, B, F)' },
    { code: 'CEI 61643-11', title: 'Parafoudres basse tension connectés aux réseaux de distribution (SPDs Types 1, 2, 3)' },
    { code: 'CEI 61851-1 / NF C 15-722', title: 'Système de charge conductive pour véhicules électriques (IRVE & DDR Type B)' },
    { code: 'CEI 60364-7-712', title: 'Installations solaires photovoltaïques (PV) et systèmes de stockage d\'énergie (BESS)' },
    { code: 'CEI 62040-1 / 3', title: 'Alimentations sans interruption (Onduleurs statiques UPS, VFI-SS-111, batteries VRLA/LiFePO4)' },
    { code: 'ISO 8528 / NF C 15-100 §551', title: 'Groupes électrogènes à courant alternatif entraînés par moteurs à combustion interne & délestage' },
    { code: 'CEI 60831-1 & 2', title: 'Condensateurs de puissance shunts autorégénérateurs (Compensation de facteur de puissance cos φ)' },
    { code: 'CEI 61439-6', title: 'Systèmes de canalisations préfabriquées (Canalis / Busbar Trunking Systems)' },
    { code: 'IEEE 1584-2018 / NFPA 70E', title: 'Guide for Performing Arc-Flash Hazard Calculations & Electrical Safety in the Workplace' },
    { code: 'CEI 60947-4-1 / CEI 61800-3', title: 'Contacteurs, démarreurs de moteurs, et variateurs de vitesse électroniques (VFD)' },
    { code: 'CEI 60890', title: 'Méthode d\'évaluation par calcul de l\'échauffement des ensembles d\'appareillage BT fermés' },
    { code: 'CEI 60529 / CEI 62262', title: 'Degrés de protection procurés par les enveloppes (Code IP & Code IK)' },
    { code: 'CEI 60038 / NF C 14-100', title: 'Tensions normales de la CEI & Branchements d\'abonnés basse tension' },
    { code: 'NF C 18-510 / CEI 60900', title: 'Opérations sur les ouvrages électriques & Consignation de sécurité LOTO' },
    { code: 'NF C 15-100 Partie 6 / Consuel', title: 'Vérifications initiales et périodiques, rapports d\'essais et conformité Consuel' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-mono text-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-[#0A0E17] border-l border-[#20293A] shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1E2638] flex items-center justify-between bg-[#080B12]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">
              {locale === 'fr'
                ? 'Formules Électrotechniques & Normes Internationales'
                : 'Electrotechnical Formulas & International Standards'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#141C2B] text-slate-400 hover:text-white border border-[#20293A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20">
          {/* Section 1: Electrotechnical Formulas */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {locale === 'fr'
                ? 'Formules Fondamentales de Dimensionnement Basse Tension :'
                : 'Core Low-Voltage Sizing Engineering Formulas:'}
            </span>

            <div className="space-y-3">
              {formulas.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0E1522] border border-[#1E2738] space-y-1.5">
                  <h3 className="text-xs font-bold text-white">
                    {locale === 'fr' ? f.title_fr : f.title_en}
                  </h3>
                  <div className="p-2 rounded-lg bg-[#06090F] border border-amber-900/40 text-amber-300 font-bold text-[11px] overflow-x-auto">
                    <code>{f.formula}</code>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    {locale === 'fr' ? f.desc_fr : f.desc_en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Normative Standards Matrix */}
          <div className="space-y-3 pt-4 border-t border-[#1E2638]">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
              {locale === 'fr'
                ? 'Matrice des Normes Internationales de Référence :'
                : 'International Reference Standards Matrix:'}
            </span>

            <div className="grid grid-cols-1 gap-2">
              {standards.map((std, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#0E1522] border border-[#1E2738] flex items-center justify-between gap-3 text-[11px]"
                >
                  <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800 text-[10px] shrink-0">
                    {std.code}
                  </span>
                  <span className="text-slate-300 text-right font-sans text-[10px]">{std.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Knowledge Explorer link */}
        <div className="p-4 border-t border-[#1E2638] bg-[#080B12] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
          <span className="text-slate-500">
            EPEDE D06 · Electrical Installations & Utilization Engineering Knowledge Base
          </span>
          {onOpenKnowledgeMap && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenKnowledgeMap();
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Ouvrir la Carte Cognitive D06' : 'Open D06 Knowledge Map'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
