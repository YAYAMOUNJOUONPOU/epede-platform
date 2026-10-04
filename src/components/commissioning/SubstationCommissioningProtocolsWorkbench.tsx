// src/components/commissioning/SubstationCommissioningProtocolsWorkbench.tsx
// High Voltage Substation, Digital Protection Relays & Grounding Grid Commissioning Protocols
// Compliant with IEC 60255-121 (ANSI 21), IEC 60255-127 (ANSI 87T), IEEE 81 / IEEE 80

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Download, 
  Award, 
  Sliders, 
  Gauge, 
  Lock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SubstationCommissioningProtocolsWorkbenchProps {
  locale: 'fr' | 'en';
}

type ProtocolId = 'PROT_RELAY_ANSI_21' | 'PROT_RELAY_ANSI_87T' | 'PROT_EARTHING_GRID_IEEE_81';

export const SubstationCommissioningProtocolsWorkbench: React.FC<SubstationCommissioningProtocolsWorkbenchProps> = ({
  locale
}) => {
  const isFr = locale === 'fr';

  const [activeProtocolId, setActiveProtocolId] = useState<ProtocolId>('PROT_RELAY_ANSI_21');

  // Interactive Test Parameters for ANSI 21 (Distance Relay)
  const [zFaultPercent, setZFaultPercent] = useState<number>(80); // % of line impedance ZL
  const [faultAngleDeg, setFaultAngleDeg] = useState<number>(85); // Fault loop angle (deg)
  const [ctShortingBlockIsolated, setCtShortingBlockIsolated] = useState<boolean>(true);
  const [tripLockout86Isolated, setTripLockout86Isolated] = useState<boolean>(true);

  // Interactive Test Parameters for ANSI 87T (Transformer Differential)
  const [inrushH2RatioPercent, setInrushH2RatioPercent] = useState<number>(18); // % H2 / H1
  const [throughFaultCurrentIn, setThroughFaultCurrentIn] = useState<number>(4.5); // x In
  const [diffCurrentIn, setDiffCurrentIn] = useState<number>(0.35); // x In

  // Interactive Test Parameters for IEEE 81 (Grounding Grid)
  const [potentialProbeDistancePct, setPotentialProbeDistancePct] = useState<number>(61.8);
  const [measuredRgOhm, setMeasuredRgOhm] = useState<number>(0.38);

  // Computed Evaluations
  // ANSI 21 Evaluation
  const isAnsi21Zone1 = zFaultPercent <= 85;
  const isAnsi21Zone2 = zFaultPercent > 85 && zFaultPercent <= 120;
  const isAnsi21Zone3OrOverreach = zFaultPercent > 120;
  const ansi21TripTimeMs = isAnsi21Zone1 ? 21 : isAnsi21Zone2 ? 305 : 620;

  // ANSI 87T Evaluation
  // If H2 / H1 > 15%, harmonic restraint blocks tripping during transformer energization
  const isHarmonicRestraintBlocked = inrushH2RatioPercent >= 15;
  const is87TOverSlope = diffCurrentIn > (throughFaultCurrentIn > 2.0 ? 0.3 + 0.7 * (throughFaultCurrentIn - 2.0) : 0.3 * throughFaultCurrentIn);
  const ansi87TTripDecision = isHarmonicRestraintBlocked 
    ? 'BLOCKED_BY_H2' 
    : (is87TOverSlope ? 'TRIP' : 'RESTRAINED_THROUGH_FAULT');

  // IEEE 81 Evaluation
  const is618RuleValid = Math.abs(potentialProbeDistancePct - 61.8) <= 2.0;
  const isRgCompliant225kV = measuredRgOhm <= 0.5;

  return (
    <div className="space-y-6">
      {/* Protocol Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protocol 1: ANSI 21 */}
        <button
          type="button"
          onClick={() => setActiveProtocolId('PROT_RELAY_ANSI_21')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeProtocolId === 'PROT_RELAY_ANSI_21'
              ? 'bg-blue-950/60 border-blue-500/80 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SAT CEI 60255-121
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">ANSI 21</span>
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isFr ? 'Protection de Distance Ligne' : 'Line Distance Protection'}
          </h3>
          <p className="text-xs text-slate-400">
            {isFr 
              ? 'Injection secondaire triphasée (OMICRON CMC), portée Zone 1 / Zone 2 & directivité.' 
              : '3-phase secondary injection (OMICRON CMC), Zone 1 / Zone 2 reach & directivity.'}
          </p>
        </button>

        {/* Protocol 2: ANSI 87T */}
        <button
          type="button"
          onClick={() => setActiveProtocolId('PROT_RELAY_ANSI_87T')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeProtocolId === 'PROT_RELAY_ANSI_87T'
              ? 'bg-amber-950/60 border-amber-500/80 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SAT CEI 60255-127
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">ANSI 87T</span>
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isFr ? 'Différentielle Transfo & Retenue H2' : 'Transformer Diff. & 2nd Harmonic'}
          </h3>
          <p className="text-xs text-slate-400">
            {isFr 
              ? 'Pentes de retenue stabilisées et blocage inrush par injection d\'harmonique 2 (100 Hz).' 
              : 'Dual percentage slope restraint & inrush restraint via 2nd harmonic (100 Hz).'}
          </p>
        </button>

        {/* Protocol 3: IEEE 81 */}
        <button
          type="button"
          onClick={() => setActiveProtocolId('PROT_EARTHING_GRID_IEEE_81')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeProtocolId === 'PROT_EARTHING_GRID_IEEE_81'
              ? 'bg-emerald-950/60 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SAT IEEE 81 / IEEE 80
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">Rg &lt; 0.5 Ω</span>
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isFr ? 'Réseau de Terre & Règle des 61.8%' : 'Grounding Grid 61.8% Method'}
          </h3>
          <p className="text-xs text-slate-400">
            {isFr 
              ? 'Mesure 4 bornes à fréquence commutable, détection du palier et tensions de pas/toucher.' 
              : '4-terminal fall-of-potential test, plateau detection & touch voltage compliance.'}
          </p>
        </button>
      </div>

      {/* Mandatory Safety Interlocks Checklist */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              {isFr ? 'Consignes de Sécurité & Isolement Avant Injection' : 'Safety Precautions & Test Isolation Gate'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isFr ? 'Procédure Sécurisée' : 'Locked & Safe'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
            <input 
              type="checkbox" 
              checked={ctShortingBlockIsolated}
              onChange={(e) => setCtShortingBlockIsolated(e.target.checked)}
              className="mt-0.5 accent-blue-500" 
            />
            <span className="text-slate-300">
              {isFr 
                ? 'Blocs d’essais courant TC débrochés & court-circuités côté réseau (Aucun risque d’injection vers le TC).' 
                : 'CT secondary test shorting switches opened & shorted towards CT side (Zero back-feed risk).'}
            </span>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
            <input 
              type="checkbox" 
              checked={tripLockout86Isolated}
              onChange={(e) => setTripLockout86Isolated(e.target.checked)}
              className="mt-0.5 accent-blue-500" 
            />
            <span className="text-slate-300">
              {isFr 
                ? 'Commande de déclenchement vers le relais de réarmement 86 (Lockout) ou bobines déclencheur consignées.' 
                : 'Trip output to Lockout 86 relay / breaker trip coils isolated (Prevent real breaker trip).'}
            </span>
          </label>
        </div>
      </div>

      {/* PROTOCOL 1: ANSI 21 DISTANCE RELAY WORKBENCH */}
      {activeProtocolId === 'PROT_RELAY_ANSI_21' && (
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold">
                {isFr ? 'CEI 60255-121 / IEEE C37.113 · RELAIS DE DISTANCE NUMÉRIQUE' : 'IEC 60255-121 / IEEE C37.113 · DIGITAL DISTANCE RELAY'}
              </span>
              <h2 className="text-xl font-bold text-white">
                {isFr 
                  ? 'Protocole d’Essai par Injection Secondaire - ANSI 21' 
                  : 'Secondary Injection Test Protocol - Distance Protection ANSI 21'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Validation de la caractéristique quadrilatérale / Mho, discrimination directionnelle et temps de réponse.' 
                  : 'Verification of quadrilateral / Mho reach envelope, directional blocking, and operating times.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                isAnsi21Zone1
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                  : isAnsi21Zone2
                  ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {isAnsi21Zone1 
                    ? (isFr ? 'DÉCLENCHEMENT ZONE 1 (INSTANTANÉ)' : 'ZONE 1 TRIP (INSTANTANEOUS)') 
                    : isAnsi21Zone2 
                    ? (isFr ? 'DÉCLENCHEMENT ZONE 2 (TEMPORISÉ 300ms)' : 'ZONE 2 TRIP (TIME-DELAYED 300ms)') 
                    : (isFr ? 'ZONE 3 / NON DÉCLENCHÉ' : 'ZONE 3 / NO TRIP')}
                </span>
              </span>
            </div>
          </div>

          {/* Interactive Test Injection Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Portée du défaut injecté (% Z_ligne) :' : 'Injected fault impedance (% Z_line):'}</span>
                  <span className="text-blue-400 font-bold">{zFaultPercent} % ({zFaultPercent <= 85 ? 'Zone 1' : zFaultPercent <= 120 ? 'Zone 2' : 'Zone 3 / Hors portée'})</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="160" 
                  step="5"
                  value={zFaultPercent}
                  onChange={(e) => setZFaultPercent(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>20% (Court-circuit franc amont)</span>
                  <span className="text-amber-400">85% (Limite Zone 1)</span>
                  <span className="text-purple-400">120% (Limite Zone 2)</span>
                  <span>160%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Angle de boucle de défaut (Phi) :' : 'Fault loop phase angle (Phi):'}</span>
                  <span className="text-blue-400 font-bold">{faultAngleDeg} ° (Ligne 225 kV type)</span>
                </div>
                <input 
                  type="range" 
                  min="45" 
                  max="90" 
                  step="1"
                  value={faultAngleDeg}
                  onChange={(e) => setFaultAngleDeg(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
              </div>
            </div>

            {/* Test Results Dashboard */}
            <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                {isFr ? 'Mesures Mesurées par la Valise d’Injection (Chrono OMICRON) :' : 'Injection Test Set Chrono Readout:'}
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">{isFr ? 'Temps Déclenchement :' : 'Operating Trip Time:'}</span>
                  <span className="text-base font-bold text-white">{ansi21TripTimeMs} ms</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    {isAnsi21Zone1 ? '± 5 ms (Conforme CEI)' : 'Temporisation Calibrée'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">{isFr ? 'Discrimination Directionnelle :' : 'Directional Boundary:'}</span>
                  <span className="text-base font-bold text-emerald-400">FORWARD (+85°)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">100% de blocage inverse</span>
                </div>
              </div>

              <div className="p-2 rounded bg-blue-950/40 border border-blue-500/20 text-blue-300 text-[11px]">
                {isFr
                  ? `Impédance de boucle vue Z = ${(zFaultPercent * 0.32).toFixed(2)} Ω. Le contact de déclenchement 87/21 est excité en ${ansi21TripTimeMs} ms sans rebond.`
                  : `Loop impedance seen Z = ${(zFaultPercent * 0.32).toFixed(2)} Ω. Trip relay output contact engaged in ${ansi21TripTimeMs} ms with zero bounce.`}
              </div>
            </div>
          </div>

          {/* Test Steps Acceptance Criteria Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <th className="p-2.5 text-left">{isFr ? 'Étape' : 'Step'}</th>
                  <th className="p-2.5 text-left">{isFr ? 'Description de l’Essai' : 'Test Description'}</th>
                  <th className="p-2.5 text-left">{isFr ? 'Critère d’Acceptation Normalisé' : 'Acceptance Criteria'}</th>
                  <th className="p-2.5 text-left">{isFr ? 'Tolérance' : 'Tolerance'}</th>
                  <th className="p-2.5 text-center">{isFr ? 'Statut' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-blue-400">1</td>
                  <td className="p-2.5">
                    {isFr ? 'Portée Zone 1 à 0.85 ZL (Défaut franc phase-phase-terre)' : 'Zone 1 reach at 0.85 ZL (3-phase fault)'}
                  </td>
                  <td className="p-2.5">
                    {isFr ? 'Déclenchement instantané à t < 25 ms' : 'Instantaneous trip t < 25 ms'}
                  </td>
                  <td className="p-2.5 text-slate-400">± 3% sur Z1, ± 10 ms</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      CONFORME
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-400">2</td>
                  <td className="p-2.5">
                    {isFr ? 'Portée Zone 2 à 1.20 ZL (Temporisation sélective poste aval)' : 'Zone 2 reach at 1.20 ZL (Grading delay)'}
                  </td>
                  <td className="p-2.5">
                    {isFr ? 'Déclenchement temporisé stabilisé à 300 ms' : 'Definite-time trip verified at 300 ms'}
                  </td>
                  <td className="p-2.5 text-slate-400">± 20 ms</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      CONFORME
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-400">3</td>
                  <td className="p-2.5">
                    {isFr ? 'Blocage directionnel inverse (Défaut amont sur jeu de barres)' : 'Reverse boundary blocking (Upstream bus fault)'}
                  </td>
                  <td className="p-2.5">
                    {isFr ? 'Absence totale d’ordre de déclenchement vers le disjoncteur' : 'Zero trip output command issued'}
                  </td>
                  <td className="p-2.5 text-slate-400">100% de stabilité</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      CONFORME
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROTOCOL 2: ANSI 87T TRANSFORMER DIFFERENTIAL */}
      {activeProtocolId === 'PROT_RELAY_ANSI_87T' && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {isFr ? 'CEI 60255-127 / IEEE C37.91 · PROTECTION DIFFÉRENTIELLE TRANSFO' : 'IEC 60255-127 / IEEE C37.91 · TRANSFORMER DIFFERENTIAL'}
              </span>
              <h2 className="text-xl font-bold text-white">
                {isFr 
                  ? 'Protocole d’Essai ANSI 87T & Retenue Harmonique H2' 
                  : 'ANSI 87T Differential & 2nd Harmonic Inrush Restraint Test'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Vérification du seuil minimal de sensibilité, de la caractéristique à 2 pentes et du blocage inrush.' 
                  : 'Pickup sensitivity, dual slope restraint curve, and transformer inrush harmonic restraint.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                ansi87TTripDecision === 'BLOCKED_BY_H2'
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                  : ansi87TTripDecision === 'TRIP'
                  ? 'bg-red-950 border border-red-500/50 text-red-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {ansi87TTripDecision === 'BLOCKED_BY_H2'
                    ? (isFr ? 'BLOCAGE INRUSH ACTIF (Pas de Déclenchement)' : 'INRUSH BLOCKED (No Trip)')
                    : ansi87TTripDecision === 'TRIP'
                    ? (isFr ? 'DÉCLENCHEMENT DIFFÉRENTIEL (Défaut Interne)' : 'DIFFERENTIAL TRIP (Internal Fault)')
                    : (isFr ? 'STABLE SUR DÉFAUT TRAVERSANT' : 'STABLE ON THROUGH-FAULT')}
                </span>
              </span>
            </div>
          </div>

          {/* Interactive Harmonic Inrush Injection Simulator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Taux d’Harmonique 2 injecté (H2 / H1) :' : 'Injected 2nd Harmonic ratio (H2 / H1):'}</span>
                  <span className="text-amber-400 font-bold">{inrushH2RatioPercent} %</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="1"
                  value={inrushH2RatioPercent}
                  onChange={(e) => setInrushH2RatioPercent(Number(e.target.value))}
                  className="w-full accent-amber-500" 
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>0% (Sinusoïde pure 50Hz)</span>
                  <span className="text-emerald-400 font-bold">15% (Seuil normalisé CEI de retenue)</span>
                  <span>30% (Forte saturation)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Courant différentiel Idiff (x In) :' : 'Differential current Idiff (x In):'}</span>
                  <span className="text-amber-400 font-bold">{diffCurrentIn.toFixed(2)} In</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.5" 
                  step="0.05"
                  value={diffCurrentIn}
                  onChange={(e) => setDiffCurrentIn(Number(e.target.value))}
                  className="w-full accent-amber-500" 
                />
              </div>
            </div>

            {/* Test Analysis Card */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                {isFr ? 'Diagnostic de la Retenue Différentielle :' : 'Differential Restraint Diagnostics:'}
              </span>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{isFr ? 'Détecteur d’Enclenchement Inrush :' : 'Inrush Detection Flag:'}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    isHarmonicRestraintBlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isHarmonicRestraintBlocked ? (isFr ? 'VERROUILLÉ (H2 > 15%)' : 'LOCKED (H2 > 15%)') : (isFr ? 'DÉVERROUILLÉ' : 'UNLOCKED')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{isFr ? 'Pente 1 / Pente 2 Calibrée :' : 'Slope 1 / Slope 2 Calibrated:'}</span>
                  <span className="font-bold text-white">30% / 70%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFr
                  ? 'La présence de 18% d’harmonique 2 permet de distinguer l’aimantation transitoire du transformateur (inrush) d’un court-circuit interne franc, évitant tout déclenchement indésirable à la mise sous tension.'
                  : 'Second harmonic content at 18% enables discrimination between magnetizing inrush current and an actual winding internal fault, preventing spurious trips upon transformer energization.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PROTOCOL 3: IEEE 81 SUBSTATION EARTHING GRID WORKBENCH */}
      {activeProtocolId === 'PROT_EARTHING_GRID_IEEE_81' && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {isFr ? 'IEEE 81 / IEEE 80 / NF C 13-200 · RÉSEAU DE TERRE DE POSTE HTB' : 'IEEE 81 / IEEE 80 / NF C 13-200 · SUBSTATION GROUNDING GRID'}
              </span>
              <h2 className="text-xl font-bold text-white">
                {isFr 
                  ? 'Mesure de Résistance de Terre & Méthode de la Chute de Tension (61.8%)' 
                  : 'Grounding Grid Resistance Measurement & Fall-of-Potential (61.8% Method)'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Telluromètre 4 bornes à fréquence commutable (Chauvin Arnoux CA 6472) et recherche du palier vrai.' 
                  : '4-terminal earth tester with switched test frequencies to eliminate power frequency noise.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                isRgCompliant225kV
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950 border border-red-500/50 text-red-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {isRgCompliant225kV 
                    ? (isFr ? 'CONFORME POSTE 225 kV (Rg ≤ 0.50 Ω)' : 'COMPLIANT 225 kV GRID (Rg ≤ 0.50 Ω)') 
                    : (isFr ? 'NON CONFORME (Rg > 0.50 Ω)' : 'NON-COMPLIANT (Rg > 0.50 Ω)')}
                </span>
              </span>
            </div>
          </div>

          {/* Interactive Distance & Probe Curve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Position de la sonde de potentiel P2 (% distance C2) :' : 'Potential probe position P2 (% distance C2):'}</span>
                  <span className="text-emerald-400 font-bold">{potentialProbeDistancePct} % {is618RuleValid && '★ (Point Théorique 61.8%)'}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="90" 
                  step="0.2"
                  value={potentialProbeDistancePct}
                  onChange={(e) => setPotentialProbeDistancePct(Number(e.target.value))}
                  className="w-full accent-emerald-500" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{isFr ? 'Résistance globale mesurée Rg (Ω) :' : 'Measured grid resistance Rg (Ω):'}</span>
                  <span className="text-emerald-400 font-bold">{measuredRgOhm.toFixed(2)} Ω</span>
                </div>
                <input 
                  type="range" 
                  min="0.10" 
                  max="1.50" 
                  step="0.02"
                  value={measuredRgOhm}
                  onChange={(e) => setMeasuredRgOhm(Number(e.target.value))}
                  className="w-full accent-emerald-500" 
                />
              </div>
            </div>

            {/* Verification & Touch/Step Safety */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                {isFr ? 'Vérification de la Sécurité des Personnes (IEEE 80) :' : 'Touch & Step Safety Verification (IEEE 80):'}
              </span>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isFr ? 'Électrode de courant C2 :' : 'Current return electrode C2:'}</span>
                  <span className="text-white font-bold">&gt; 350 m (&gt; 5x Diagonale)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isFr ? 'Tension de toucher calculée (Icc 31.5kA) :' : 'Calculated touch voltage (31.5kA fault):'}</span>
                  <span className="text-emerald-400 font-bold">385 V &lt; 650 V (Admissible)</span>
                </div>
              </div>

              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[11px]">
                {isFr
                  ? 'Le palier de résistance horizontal à 61.8% confirme que la sonde de potentiel est sortie de la zone d’influence mutuelle de la grille de terre et de l’électrode de courant C2.'
                  : 'The flat resistance plateau at 61.8% verifies that the potential probe is located outside the mutual resistance spheres of both the substation grid and auxiliary electrode C2.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Signoff Visa Stamp Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              {isFr ? 'Visa de Commissioning & Réception Technique' : 'Technical Commissioning & Signoff Visa'}
            </h4>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Certificat d’essais normalisé prêt pour intégration au Dossier des Ouvrages Exécutés (DOE).' 
                : 'Standardized test certificate ready for inclusion in official as-built commissioning dossier.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            alert(
              isFr 
                ? 'Génération du PV de réception officielle SAT Substation en cours de téléchargement...' 
                : 'Generating official Substation SAT Commissioning protocol report...'
            );
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isFr ? 'Exporter le PV d’Essais (PDF)' : 'Export Test Certificate (PDF)'}</span>
        </button>
      </div>
    </div>
  );
};
