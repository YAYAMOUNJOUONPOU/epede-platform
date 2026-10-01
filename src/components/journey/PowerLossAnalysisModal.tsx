// src/components/journey/PowerLossAnalysisModal.tsx
// EPEDE - Interactive Power Flow, Loss Waterfall & "Why 225 kV?" Physical Demonstration
import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  Sliders, 
  TrendingDown, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface PowerLossAnalysisModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export const PowerLossAnalysisModal: React.FC<PowerLossAnalysisModalProps> = ({
  locale,
  isOpen,
  onClose,
}) => {
  // Configurable parameters
  const [powerMw, setPowerMw] = useState<number>(100);
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [powerFactor, setPowerFactor] = useState<number>(0.90);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Physical calculations
  // Current at 15 kV (MV generation voltage)
  const current15kV = (powerMw * 1e6) / (Math.sqrt(3) * 15000 * powerFactor);
  // Current at 225 kV (HV transmission voltage)
  const current225kV = (powerMw * 1e6) / (Math.sqrt(3) * 225000 * powerFactor);

  // Linear resistance per km: typical HV transmission ACSR/Almelec ~0.06 ohm/km per phase
  const rPhase225 = 0.06 * distanceKm;
  // If forced to transmit at 15 kV, huge conductor resistance still at best ~0.04 ohm/km
  const rPhase15 = 0.04 * distanceKm;

  // Joule Losses: P_loss = 3 * R * I^2
  const loss225kWMw = (3 * rPhase225 * Math.pow(current225kV, 2)) / 1e6;
  const loss15kWMw = (3 * rPhase15 * Math.pow(current15kV, 2)) / 1e6;

  // Ratio of currents & loss reduction factor
  const currentRatio = current15kV / current225kV;
  const lossRatio = Math.pow(225 / 15, 2); // 225x less losses theoretically!

  // Required cable cross-section (current density J ~ 1.5 A/mm2)
  const section15mm2 = Math.round(current15kV / 1.5);
  const section225mm2 = Math.round(current225kV / 1.5);

  // Conductor mass per km (aluminum density ~2700 kg/m3)
  const mass15Tons = ((section15mm2 * 1e-6 * 1000 * 2700 * 3 * distanceKm) / 1000).toFixed(0);
  const mass225Tons = ((section225mm2 * 1e-6 * 1000 * 2700 * 3 * distanceKm) / 1000).toFixed(0);

  // 6-Stage Waterfall calculations
  const pGen = powerMw;
  const pGsuLoss = +(pGen * 0.006).toFixed(2); // GSU trafo ~99.4%
  const pAfterGsu = +(pGen - pGsuLoss).toFixed(2);
  const pLineLoss = +(Math.min(loss225kWMw, pAfterGsu * 0.08)).toFixed(2);
  const pAfterLine = +(pAfterGsu - pLineLoss).toFixed(2);
  const pSubLoss = +(pAfterLine * 0.007).toFixed(2); // Substation 225/30 trafo ~99.3%
  const pAfterSub = +(pAfterLine - pSubLoss).toFixed(2);
  const pDistLoss = +(pAfterSub * 0.025).toFixed(2); // MV distribution & HTA/BT trafo ~97.5%
  const pDelivered = +(pAfterSub - pDistLoss).toFixed(2);
  const totalEfficiency = +((pDelivered / pGen) * 100).toFixed(1);

  const handleCopySummary = () => {
    const text = `=== EPEDE : BILAN ÉNERGÉTIQUE & POURQUOI 225 kV ? ===
Puissance Transportée: ${powerMw} MW sur ${distanceKm} km (cos φ = ${powerFactor})
1. En 15 kV (Génération directe sans élévation) :
   - Courant en ligne : ${current15kV.toFixed(0)} A
   - Pertes Joule par effet Joule : ${loss15kWMw.toFixed(1)} MW (${((loss15kWMw / powerMw) * 100).toFixed(0)} % de la production !)
   - Section conducteur requise : ${section15mm2} mm² (~${mass15Tons} tonnes d'Aluminium)
2. En 225 kV (Après élévateur GSU) :
   - Courant en ligne : ${current225kV.toFixed(0)} A (divisé par 15)
   - Pertes Joule : ${loss225kWMw.toFixed(2)} MW (${((loss225kWMw / powerMw) * 100).toFixed(1)} % seulement)
   - Section conducteur : ${section225mm2} mm² (~${mass225Tons} tonnes d'Aluminium)
   - Gain sur les pertes : facteur ${lossRatio.toFixed(0)}x !
Rendement global chaîne 6 étapes : ${totalEfficiency} %`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'BILAN DE PUISSANCE & ANALYSE 225 kV' : 'POWER FLOW & 225 kV PHYSICAL DEMONSTRATION'}</span>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-bold">
                  {locale === 'fr' ? 'PHYSIQUE DU TRANSPORT' : 'TRANSMISSION PHYSICS'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Démonstration mathématique : pourquoi élève-t-on la tension à 225 000 V ?' 
                  : 'Mathematical proof: why step up voltage to 225,000 V for long distances?'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Copier le bilan"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Bilan' : 'Copy Report')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Controls Bar: Sliders for Power, Distance, and Cos Phi */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-600" />
                <span>{locale === 'fr' ? 'PARAMÈTRES D\'EXPLOITATION DU RÉSEAU' : 'GRID OPERATING PARAMETERS'}</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Loi de Joule : P_pertes = 3 · R · I²
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Power Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Puissance Électrique (P)' : 'Active Power (P)'}</span>
                  <span className="text-amber-800 font-bold">{powerMw} MW</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={powerMw}
                  onChange={(e) => setPowerMw(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Distance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Distance de Ligne (L)' : 'Line Distance (L)'}</span>
                  <span className="text-sky-700 font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Power Factor Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Facteur de Puissance (cos φ)' : 'Power Factor (cos φ)'}</span>
                  <span className="text-emerald-700 font-bold">{powerFactor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="0.99"
                  step="0.01"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Direct Comparative Demonstration: 15 kV vs 225 kV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct 15 kV (Catastrophic without step-up) */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span className="text-rose-800 font-bold uppercase">
                    {locale === 'fr' ? 'OPTION A : TRANSPORT EN 15 kV' : 'OPTION A : TRANSMISSION AT 15 kV'}
                  </span>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300 font-bold">
                  {locale === 'fr' ? 'PHYSIQUEMENT IMPOSSIBLE' : 'PHYSICALLY IMPOSSIBLE'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-rose-200/80 pb-1">
                  <span className="text-slate-600">Courant dans les câbles (I) :</span>
                  <span className="text-rose-700 font-bold">{current15kV.toFixed(0)} A</span>
                </div>
                <div className="flex justify-between border-b border-rose-200/80 pb-1">
                  <span className="text-slate-600">Pertes par effet Joule (3·R·I²) :</span>
                  <span className="text-rose-700 font-bold">{loss15kWMw.toFixed(1)} MW</span>
                </div>
                <div className="flex justify-between border-b border-rose-200/80 pb-1">
                  <span className="text-slate-600">% de la puissance perdue :</span>
                  <span className="text-rose-800 font-bold">
                    {loss15kWMw >= powerMw ? '100% (La ligne fond !)' : `${((loss15kWMw / powerMw) * 100).toFixed(0)} %`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-rose-200/80 pb-1">
                  <span className="text-slate-600">Section de cuivre minimale :</span>
                  <span className="text-slate-900 font-bold">{section15mm2} mm²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Masse de métal requise :</span>
                  <span className="text-rose-800 font-bold">{mass15Tons} tonnes</span>
                </div>
              </div>

              <p className="text-[11px] font-sans text-rose-900 leading-relaxed pt-1">
                {locale === 'fr'
                  ? 'Pour faire passer 4 000+ A, il faudrait des câbles aussi épais que des troncs d\'arbres. Les pertes Joule dépassent la production entière du barrage et le câble fondrait en quelques secondes.'
                  : 'To carry 4,000+ A, cables would need to be as thick as tree trunks. Joule losses exceed total dam output, melting the conductors instantly.'}
              </p>
            </div>

            {/* Elevated 225 kV (Efficient Engineering) */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-800 font-bold uppercase">
                    {locale === 'fr' ? 'OPTION B : TRANSPORT EN 225 kV' : 'OPTION B : TRANSMISSION AT 225 kV'}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                  {locale === 'fr' ? 'STANDARD MONDIAL HTB' : 'HV STANDARD'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-emerald-200/80 pb-1">
                  <span className="text-slate-600">Courant dans les câbles (I) :</span>
                  <span className="text-emerald-700 font-bold">{current225kV.toFixed(0)} A (÷ 15)</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200/80 pb-1">
                  <span className="text-slate-600">Pertes par effet Joule (3·R·I²) :</span>
                  <span className="text-emerald-700 font-bold">{loss225kWMw.toFixed(2)} MW</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200/80 pb-1">
                  <span className="text-slate-600">% de la puissance perdue :</span>
                  <span className="text-emerald-800 font-bold">
                    {((loss225kWMw / powerMw) * 100).toFixed(2)} % seulement
                  </span>
                </div>
                <div className="flex justify-between border-b border-emerald-200/80 pb-1">
                  <span className="text-slate-600">Section d\'Almélec requise :</span>
                  <span className="text-slate-900 font-bold">{section225mm2} mm² (Câble aérien léger)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Masse de métal requise :</span>
                  <span className="text-emerald-800 font-bold">{mass225Tons} tonnes (÷ 15)</span>
                </div>
              </div>

              <p className="text-[11px] font-sans text-emerald-900 leading-relaxed pt-1">
                {locale === 'fr'
                  ? `Multiplier la tension par 15 divise le courant par 15. Comme les pertes dépendent de I², les pertes sont divisées par 15² = 225 ! On économise ${((loss15kWMw - loss225kWMw)).toFixed(1)} MW d'énergie propre.`
                  : `Stepping voltage up 15-fold divides current by 15. Because Joule losses depend on I², losses drop by 15² = 225 times! Saving ${((loss15kWMw - loss225kWMw)).toFixed(1)} MW of clean energy.`}
              </p>
            </div>
          </div>

          {/* 6-Stage Waterfall of Power Flow (From Generator to Lamp) */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-600" />
                <span>{locale === 'fr' ? 'CASCADE DES FLUX & RENDEMENT DES 6 ÉTAPES' : '6-STAGE POWER WATERFALL & EFFICIENCY'}</span>
              </span>
              <span className="text-xs text-amber-800 font-bold">
                {locale === 'fr' ? 'Rendement Global' : 'Overall Efficiency'} : {totalEfficiency} %
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {/* Step 1: Hydro Dam */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">1. BARRAGE</span>
                  <span className="text-xs text-slate-700 block font-bold">Alternateur 15 kV</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-slate-900">{pGen.toFixed(1)} MW</span>
                  <span className="text-[10px] text-slate-500 block">100% injecté</span>
                </div>
              </div>

              {/* Step 2: GSU Transformateur */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">2. GSU TRAFO</span>
                  <span className="text-xs text-slate-700 block font-bold">15 kV → 225 kV</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-slate-900">{pAfterGsu.toFixed(1)} MW</span>
                  <span className="text-[10px] text-rose-600 block font-medium">- {pGsuLoss} MW (Fer+Cu)</span>
                </div>
              </div>

              {/* Step 3: 225 kV Line */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">3. LIGNE 225 kV</span>
                  <span className="text-xs text-slate-700 block font-bold">{distanceKm} km Aérien</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-slate-900">{pAfterLine.toFixed(1)} MW</span>
                  <span className="text-[10px] text-rose-600 block font-medium">- {pLineLoss} MW (Joule)</span>
                </div>
              </div>

              {/* Step 4: Substation */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">4. POSTE SOURCE</span>
                  <span className="text-xs text-slate-700 block font-bold">225 kV → 30 kV</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-slate-900">{pAfterSub.toFixed(1)} MW</span>
                  <span className="text-[10px] text-rose-600 block font-medium">- {pSubLoss} MW (Autotransfo)</span>
                </div>
              </div>

              {/* Step 5: Distribution */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">5. DISTRIBUTION</span>
                  <span className="text-xs text-slate-700 block font-bold">30 kV → 400 V / 230 V</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-slate-900">{pDelivered.toFixed(1)} MW</span>
                  <span className="text-[10px] text-rose-600 block font-medium">- {pDistLoss} MW (Réseau MV/LV)</span>
                </div>
              </div>

              {/* Step 6: Consumers */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">6. CONSOMMATEURS</span>
                  <span className="text-xs text-emerald-900 block font-bold">Habitations & Lampes</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-black text-emerald-700">{pDelivered.toFixed(1)} MW</span>
                  <span className="text-[10px] text-emerald-800 block font-medium">{totalEfficiency}% reçus utiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
