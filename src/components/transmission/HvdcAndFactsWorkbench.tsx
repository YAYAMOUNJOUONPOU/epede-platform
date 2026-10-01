// src/components/transmission/HvdcAndFactsWorkbench.tsx
// EPEDE D03 - High-Voltage Direct Current (VSC-HVDC) & FACTS (Flexible AC Transmission Systems)

import React, { useState } from 'react';
import {
  Zap,
  Cpu,
  Layers,
  Activity,
  Sliders,
  TrendingUp,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sparkles,
  RefreshCw,
  Scale,
  ShieldCheck
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
}

type TechnologyMode = 'VSC_HVDC' | 'STATCOM' | 'SVC' | 'PST' | 'TCSC';

interface FactsDevice {
  id: TechnologyMode;
  code: string;
  name_fr: string;
  name_en: string;
  category: 'HVDC' | 'SHUNT_FACTS' | 'SERIES_FACTS' | 'HYBRID';
  connectionType: 'Parallèle (Shunt)' | 'Série' | 'Bipolaire DC Point-à-Point' | 'Série/Shunt Combiné';
  responseSpeedMs: string;
  mainSemiconductor: string;
  primaryApplication_fr: string;
  primaryApplication_en: string;
  cameroonContext_fr: string;
  cameroonContext_en: string;
}

const FACTS_CATALOG: FactsDevice[] = [
  {
    id: 'VSC_HVDC',
    code: 'VSC-MMC',
    name_fr: 'Courant Continu Haute Tension VSC-MMC',
    name_en: 'Voltage Source Converter HVDC (Modular Multilevel)',
    category: 'HVDC',
    connectionType: 'Bipolaire DC Point-à-Point',
    responseSpeedMs: '< 10 ms (Contrôle 4 Quadrants)',
    mainSemiconductor: 'IGBT 4.5 kV / 3 kA Press-Pack',
    primaryApplication_fr: 'Transit massif de puissance sur très longues distances (> 600 km), câbles sous-marins/souterrains, interconnexions asynchrones et capacité de black-start.',
    primaryApplication_en: 'Bulk power transfer across long distances (> 600 km), underground/subsea cables, asynchronous interconnections, and synthetic inertia / black-start.',
    cameroonContext_fr: 'Corridor d\'interconnexion Grand Inga (RDC) → Cameroun → Nigéria (WAPP/PEAC), permettant le transfert asynchrone de 1 000+ MW sans propagation d\'oscillations de fréquence.',
    cameroonContext_en: 'Regional Grand Inga (DRC) → Cameroon → Nigeria (PEAC/WAPP) interconnector, enabling 1,000+ MW bulk transfer without inter-area frequency instability.'
  },
  {
    id: 'STATCOM',
    code: 'STATCOM',
    name_fr: 'Compensateur Synchrone Statique (STATCOM)',
    name_en: 'Static Synchronous Compensator (STATCOM)',
    category: 'SHUNT_FACTS',
    connectionType: 'Parallèle (Shunt)',
    responseSpeedMs: '2 - 5 ms (Sub-cycle)',
    mainSemiconductor: 'IGBT haute puissance en pont H',
    primaryApplication_fr: 'Soutien dynamique instantané de tension, régulation ultra-rapide du réactif inductif ou capacitif symétrique, et maintien de la tension même à basse tension résiduelle.',
    primaryApplication_en: 'Instantaneous dynamic voltage support, symmetric capacitive/inductive reactive power regulation, and sustained current injection even during deep voltage dips.',
    cameroonContext_fr: 'Poste de Bekoko 225 kV (Douala) pour stabiliser le réseau face aux appels de charge brutaux des aciéries (Prometal) et des laminoirs sans affaissement de tension.',
    cameroonContext_en: 'Bekoko 225 kV substation (Douala industrial hub) to mitigate violent load swings from rolling mills and steel electric arc furnaces.'
  },
  {
    id: 'SVC',
    code: 'SVC',
    name_fr: 'Compensateur Statique de Puissance Réactive (SVC)',
    name_en: 'Static Var Compensator (SVC - TCR / TSC)',
    category: 'SHUNT_FACTS',
    connectionType: 'Parallèle (Shunt)',
    responseSpeedMs: '20 - 40 ms (1 à 2 cycles)',
    mainSemiconductor: 'Thyristors haute tension (SCR)',
    primaryApplication_fr: 'Combinaison de réactances commandées par thyristors (TCR) et condensateurs commutés par thyristors (TSC) pour équilibrer la tension globale du réseau.',
    primaryApplication_en: 'Combination of thyristor-controlled reactors (TCR) and thyristor-switched capacitors (TSC) for steady-state grid-wide voltage regulation.',
    cameroonContext_fr: 'Réseau Interconnecté Nord (RIN) à Garoua / Maroua pour gérer la variabilité de la centrale hydroélectrique de Lagdo et les parcs solaires PV de Maroua.',
    cameroonContext_en: 'Northern Interconnected Grid (RIN) at Garoua/Maroua to balance the Lagdo hydro plant variability and Maroua large-scale solar farms.'
  },
  {
    id: 'PST',
    code: 'PST',
    name_fr: 'Transformateur Déphaseur (PST / Quadrature Booster)',
    name_en: 'Phase Shifting Transformer (PST)',
    category: 'SERIES_FACTS',
    connectionType: 'Série',
    responseSpeedMs: '100 - 500 ms (Régleur en charge)',
    mainSemiconductor: 'Mécanique OLTC ou Hybride Thyristors',
    primaryApplication_fr: 'Routage forcé des flux de puissance active entre lignes parallèles en insérant une composante de tension en quadrature, évitant la surcharge d\'une ligne plus courte.',
    primaryApplication_en: 'Forced routing of active power loop flows across parallel corridors by injecting quadrature voltage, eliminating unscheduled cross-border loop flows.',
    cameroonContext_fr: 'Boucle 225 kV / 90 kV Yaoundé - Douala pour forcer le transit prioritaire sur la ligne 225 kV neuve plutôt que de saturer les anciennes artères 90 kV.',
    cameroonContext_en: 'Yaoundé - Douala 225 kV / 90 kV loop to force bulk power through the new 225 kV corridor and relieve older parallel 90 kV lines.'
  },
  {
    id: 'TCSC',
    code: 'TCSC',
    name_fr: 'Condensateur Série Commandé par Thyristors (TCSC)',
    name_en: 'Thyristor-Controlled Series Capacitor (TCSC)',
    category: 'SERIES_FACTS',
    connectionType: 'Série',
    responseSpeedMs: '10 - 20 ms',
    mainSemiconductor: 'Thyristors bidirectionnels antiparallèles',
    primaryApplication_fr: 'Compensation série variable en continu, amortissement des oscillations de puissance inter-zones (POD) et élimination des résonances subsynchrones (SSR).',
    primaryApplication_en: 'Continuously variable series compensation, inter-area power oscillation damping (POD), and subsynchronous resonance (SSR) mitigation.',
    cameroonContext_fr: 'Interconnexion Cameroun - Tchad (225 kV) sur plus de 1 000 km pour amortir les oscillations de puissance entre les alternateurs de Nachtigal et le réseau de N\'Djamena.',
    cameroonContext_en: 'Cameroon - Chad 225 kV cross-border trunk (1,000+ km) to damp inter-area low-frequency power swings between Nachtigal hydro units and N\'Djamena grid.'
  }
];

export const HvdcAndFactsWorkbench: React.FC<Props> = ({ locale }) => {
  const isFr = locale === 'fr';

  const [selectedTech, setSelectedTech] = useState<TechnologyMode>('VSC_HVDC');

  // VSC-HVDC Simulation Controls
  const [hvdcActivePowerMw, setHvdcActivePowerMw] = useState<number>(600); // 600 MW transfer
  const [terminal1ReactiveMvar, setTerminal1ReactiveMvar] = useState<number>(50); // Terminal 1 Q
  const [terminal2ReactiveMvar, setTerminal2ReactiveMvar] = useState<number>(-40); // Terminal 2 Q
  const [dcVoltageBipolarKv, setDcVoltageBipolarKv] = useState<number>(320); // +/- 320 kV DC
  const [cableLengthKm, setCableLengthKm] = useState<number>(450); // 450 km

  // Calculations for VSC-HVDC
  const dcCurrentA = Math.round((hvdcActivePowerMw * 1000) / (2 * dcVoltageBipolarKv));
  const cableLossesMw = Math.round(2 * Math.pow(dcCurrentA, 2) * (0.015 * cableLengthKm) * 1e-6 * 10) / 10;
  const converterEfficiencyPercent = 98.8; // MMC losses ~1.2% per station
  const netDeliveredPowerMw = Math.round(hvdcActivePowerMw - cableLossesMw - 2 * (hvdcActivePowerMw * (1 - converterEfficiencyPercent / 100)));

  const currentFacts = FACTS_CATALOG.find((f) => f.id === selectedTech) || FACTS_CATALOG[0];

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                PILLIER 15 · ÉLECTRONIQUE DE PUISSANCE & INTERCONNEXIONS RÉGIONALES
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                VSC-HVDC MMC · FACTS · PEAC / WAPP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-emerald-400" />
              <span>
                {isFr
                  ? 'Interconnexions HVDC & Systèmes FACTS (STATCOM, SVC, PST)'
                  : 'HVDC Interconnections & FACTS Systems (STATCOM, SVC, PST)'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl font-sans">
              {isFr
                ? 'Ingénierie avancée des liaisons à courant continu (VSC-HVDC avec convertisseurs modulaires multiniveaux MMC) et des dispositifs FACTS. Contrôle découplé 4 quadrants P-Q, amortissement des oscillations et stabilité des grands corridors régionaux africains.'
                : 'Advanced engineering for HVDC links (VSC-HVDC Modular Multilevel Converters) and FACTS controllers. Decoupled 4-quadrant P-Q control, inter-area oscillation damping, and cross-border pool stability across Africa.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Technologie Active' : 'Active Tech'}</span>
              <span className="text-sm font-bold text-emerald-400">{currentFacts.code}</span>
              <span className="text-[10px] text-slate-500 block">{currentFacts.responseSpeedMs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {FACTS_CATALOG.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedTech(f.id)}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedTech === f.id
                ? 'bg-emerald-500/20 text-white border-emerald-500 font-bold shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{f.code}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {f.category}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-1">{isFr ? f.name_fr : f.name_en}</div>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Tech Deep Dive & Architecture (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-lg">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>{isFr ? 'Fiche Technique de l\'Équipement' : 'Technical Specifications'}</span>
              <span className="text-[10px] text-slate-500">{currentFacts.connectionType}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">{isFr ? 'Temps de Réponse :' : 'Response Time:'}</span>
                <span className="text-white font-bold">{currentFacts.responseSpeedMs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isFr ? 'Semiconducteur de Puissance :' : 'Power Semiconductor:'}</span>
                <span className="text-sky-400 font-bold">{currentFacts.mainSemiconductor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isFr ? 'Mode de Raccordement :' : 'Topology:'}</span>
                <span className="text-amber-400 font-bold">{currentFacts.connectionType}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-white block">{isFr ? 'Principe & Fonctionnement :' : 'Operating Principle:'}</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {isFr ? currentFacts.primaryApplication_fr : currentFacts.primaryApplication_en}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isFr ? 'Déploiement Stratégique CEMAC / Cameroun :' : 'Strategic African Grid Deployment:'}</span>
              </span>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed font-sans">
                {isFr ? currentFacts.cameroonContext_fr : currentFacts.cameroonContext_en}
              </p>
            </div>
          </div>

          {/* FACTS Family Comparison Matrix */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-400" />
              <span>{isFr ? 'Arbre Décisionnel d\'Intégration FACTS' : 'FACTS Integration Decision Matrix'}</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1.5 font-sans">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Affaissement de tension rapide</strong> (aciéries, moteurs) → <em>STATCOM</em> (sub-cycle).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <span><strong>Surcharge d'une ligne parallèle</strong> → <em>PST</em> (déphasage de flux actif).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>Oscillations de puissance inter-zones</strong> → <em>TCSC</em> (compensation série adaptative).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span><strong>Liaison longue &gt; 600 km ou asynchrone</strong> → <em>VSC-HVDC</em> (liaison DC).</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive VSC-HVDC MMC 4-Quadrant Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {selectedTech === 'VSC_HVDC' ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>{isFr ? 'Simulateur Bipolaire VSC-HVDC MMC (4 Quadrants P-Q)' : 'VSC-HVDC MMC 4-Quadrant Simulator'}</span>
                </span>
                <span className="text-[10px] text-slate-500">PEAC / WAPP Interco</span>
              </div>

              {/* Sliders: Active Power, Cable Distance, DC Voltage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{isFr ? 'Puissance Transférée (P)' : 'Active Power (P)'} :</span>
                    <span className="text-emerald-400 font-bold">{hvdcActivePowerMw} MW</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={hvdcActivePowerMw}
                    onChange={(e) => setHvdcActivePowerMw(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{isFr ? 'Tension DC Bipolaire (±Vdc)' : 'Bipolar DC Voltage (±Vdc)'} :</span>
                    <span className="text-sky-400 font-bold">±{dcVoltageBipolarKv} kV ({2 * dcVoltageBipolarKv} kV p-p)</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="525"
                    step="25"
                    value={dcVoltageBipolarKv}
                    onChange={(e) => setDcVoltageBipolarKv(parseInt(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{isFr ? 'Longueur de Liaison DC' : 'DC Link Length'} :</span>
                    <span className="text-indigo-400 font-bold">{cableLengthKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="50"
                    value={cableLengthKm}
                    onChange={(e) => setCableLengthKm(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{isFr ? 'Soutien Réactif Terminal 1' : 'Terminal 1 Q Support'} :</span>
                    <span className="text-amber-400 font-bold">{terminal1ReactiveMvar > 0 ? `+${terminal1ReactiveMvar}` : terminal1ReactiveMvar} Mvar</span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    step="10"
                    value={terminal1ReactiveMvar}
                    onChange={(e) => setTerminal1ReactiveMvar(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Telemetry Dashboard for VSC-HVDC Link */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">{isFr ? 'Courant DC (Idc)' : 'DC Current (Idc)'}</span>
                  <span className="text-base font-bold text-white">{dcCurrentA} A</span>
                  <span className="text-[9px] text-slate-500 block">P / (2·Vdc)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">{isFr ? 'Pertes Joule Ligne DC' : 'DC Cable Losses'}</span>
                  <span className="text-base font-bold text-rose-400">{cableLossesMw} MW</span>
                  <span className="text-[9px] text-slate-500 block">{Math.round((cableLossesMw / hvdcActivePowerMw) * 1000) / 10}% du transit</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">{isFr ? 'Rendement Global' : 'Overall Efficiency'}</span>
                  <span className="text-base font-bold text-emerald-400">
                    {Math.round((netDeliveredPowerMw / hvdcActivePowerMw) * 1000) / 10}%
                  </span>
                  <span className="text-[9px] text-slate-500 block">Convertisseurs + Ligne</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">{isFr ? 'Puissance Livrée' : 'Delivered Power'}</span>
                  <span className="text-base font-bold text-sky-400">{netDeliveredPowerMw} MW</span>
                  <span className="text-[9px] text-slate-500 block">Extrémité Réception</span>
                </div>
              </div>

              {/* VSC Modular Multilevel Converter (MMC) Visual Architecture */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{isFr ? 'Architecture Modulaire Multiveaux (MMC) & P-Q Indépendants' : 'MMC Modular Architecture & Decoupled P-Q'}</span>
                  <span className="text-emerald-400 text-[10px]">Black-Start Disponible</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  {/* Station 1 */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 w-full sm:w-1/3 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">POSTE 1 : ÉMISSION (AC/DC)</span>
                    <span className="text-emerald-400 font-bold block">{hvdcActivePowerMw} MW injectés</span>
                    <span className="text-amber-400 text-[10px] block">Q = {terminal1ReactiveMvar} Mvar (Local)</span>
                    <span className="text-[9px] text-slate-500 block">MMC 400 sous-modules / bras</span>
                  </div>

                  {/* DC Cable with bidirectional arrows */}
                  <div className="flex flex-col items-center gap-1 w-full sm:w-1/3">
                    <div className="text-[10px] text-slate-400 text-center font-bold">
                      CÂBLE BIPOLAIRE ±{dcVoltageBipolarKv} kV
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 rounded-full" />
                    <div className="text-[9px] text-slate-500 text-center">
                      {cableLengthKm} km · Idc = {dcCurrentA} A
                    </div>
                  </div>

                  {/* Station 2 */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 w-full sm:w-1/3 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">POSTE 2 : RÉCEPTION (DC/AC)</span>
                    <span className="text-sky-400 font-bold block">{netDeliveredPowerMw} MW reçus</span>
                    <span className="text-amber-400 text-[10px] block">Q = {terminal2ReactiveMvar} Mvar (Local)</span>
                    <span className="text-[9px] text-slate-500 block">Formation de Réseau (Grid-Forming)</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Non-HVDC FACTS View (STATCOM, SVC, PST, TCSC) */
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                <span>{isFr ? `Simulation Électrotechnique du ${currentFacts.name_fr}` : `${currentFacts.name_en} Electrical Model`}</span>
                <span className="text-[10px] text-slate-500">Norme CEI 62501</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'Bénéfices Système Clés pour le Transport Électrique' : 'Core Grid Operating Benefits'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">1. Augmentation de Transit Stable</span>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Permet d'exploiter les corridors existants jusqu'à 95% de leur limite thermique sans violer les critères N-1 de stabilité transitoire.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-sky-400 font-bold block">2. Amortissement des Oscillations (POD)</span>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Injection en quadrature dynamique pour éteindre les modes d'oscillation inter-zones basse fréquence (0.2 Hz - 0.8 Hz) en moins de 3 secondes.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold block">3. Contrôle Rapide de Tension</span>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Supprime le flicker et les creux de tension induits par l'enclenchement de gros moteurs ou fours électriques d'aciéries.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-indigo-400 font-bold block">4. Économie de CAPEX Ligne Neuve</span>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Un STATCOM ou PST de 40 millions d'euros évite la construction d'une nouvelle ligne 225/400 kV à 180 millions d'euros avec ses emprises foncières.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interconnection Regional Spotlight */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>{isFr ? 'Projets Majeurs d\'Interconnexion en Afrique Centrale (PEAC / CEEAC)' : 'Major Central African Interconnection Corridors (PEAC)'}</span>
                </span>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Le projet phare <strong>Interconnexion Électrique Cameroun - Tchad (PISECT)</strong> financé par la Banque Mondiale et la BAD relie le barrage de Nachtigal (420 MW) à N'Djamena via 1 024 km de lignes 225 kV. L'utilisation d'équipements de compensation réactive dynamique et l'option HVDC sur les tronçons ultérieurs constituent l'épine dorsale de l'intégration énergétique régionale du bassin du Lac Tchad.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
