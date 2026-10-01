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
  Info
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
              <span>1. CHUTE DE TENSION EN LIGNE (APPROXIMATION DE KAPP)</span>
              <span>IEC 60364</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-emerald-400 border border-slate-800">
              ΔU ≈ (P · R + Q · X) / U = √3 · I · (R · cos φ + X · sin φ)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Pour une artère de longueur L, R = ρ · L / S (résistance linéique) et X = ω · L_ind · L (réactance linéique). En câble souterrain, R domine sur X ; en ligne aérienne espacée, X est prépondérant (environ 0.35 à 0.40 Ω/km).'
                : 'For a feeder of length L, R = ρ · L / S (resistance) and X = ω · L_ind · L (reactance). In underground cables, R is dominant; in overhead open-wire lines, X dominates (~0.35 to 0.40 Ω/km).'}
            </p>
          </div>

          {/* Formula 2: Transformer Secondary Short-Circuit Current */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400">
              <span>2. COURANT DE COURT-CIRCUIT AU SECONDAIRE TRANSFO</span>
              <span>IEC 60076</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-sky-300 border border-slate-800">
              Icc2 = In2 / ucc = Sn / (√3 · U20 · ucc)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'Pour un transformateur 630 kVA (ucc = 4%, U20 = 400 V), In2 = 909 A. Le courant de court-circuit direct sur le jeu de barres BT est de Icc2 = 909 / 0.04 = 22 725 A (22.7 kA). Cela impose des appareillages de coupure BT (disjoncteurs ou fusibles NH) avec un pouvoir de coupure Icu ≥ 25 kA.'
                : 'For a 630 kVA transformer (ucc = 4%, U20 = 400 V), nominal current In2 = 909 A. Bolted fault current on LV busbars is Icc2 = 909 / 0.04 = 22 725 A (22.7 kA). This dictates an interrupting rating Icu ≥ 25 kA on all incoming LV switchgear.'}
            </p>
          </div>

          {/* Formula 3: Petersen Coil Tuning */}
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#20293B] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
              <span>3. ACCORD DE LA BOBINE DE PETERSEN (NEUTRE COMPENSÉ)</span>
              <span>IEC 60076-6</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#06080E] font-mono text-center text-sm text-amber-400 border border-slate-800">
              3 · C0 · ω = 1 / (L · ω) ⟹ IL = 3 · C0 · ω · V
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr'
                ? 'La bobine inductance L est ajustée pour que le courant inductif IL injecté au point de défaut soit rigoureusement égal et opposé au courant capacitif Ic des phases saines. L\'arc électrique s\'éteint spontanément au point de défaut.'
                : 'The variable reactor L is tuned so that inductive current IL equals and cancels out total healthy-phase capacitive charging current Ic. The fault arc naturally quenches itself without tripping the feeder breaker.'}
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
