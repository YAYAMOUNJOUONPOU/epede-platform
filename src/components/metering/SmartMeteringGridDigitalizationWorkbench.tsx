// src/components/metering/SmartMeteringGridDigitalizationWorkbench.tsx
// EPEDE Engineering Workbench — Domain D15: Metering, Smart Grids & Grid Digitalization
// (Comptage Intelligent AMI, Prépaiement STS CEI 62055, DLMS/COSEM CEI 62056, Balance Énergétique Poste & Anti-Fraude)
// Grounded in IEC 62052-11, IEC 62053-21 (0.5S/1.0), IEC 62055-41/51 (STS), IEC 62056 (DLMS/COSEM),
// and authentic Cameroon grid deployments (Eneo prepayment rollout in Douala, Yaoundé, Garoua & HTA metering).

import React, { useState } from 'react';
import {
  Gauge,
  Radio,
  Sliders,
  RotateCcw,
  Eye,
  Info,
  Flame,
  FileText,
  TrendingUp,
  Cpu,
  MapPin,
  ExternalLink,
  Layers,
  BarChart3,
  Waves,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Sparkles,
  BookOpen,
  X,
  Lock,
  Unlock,
  Building
} from 'lucide-react';

import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { MeteringOrientationBanner } from './MeteringOrientationBanner';
import { MeteringCommandHeader } from './MeteringCommandHeader';
import { MeteringAmiProtocolEngine } from './modules/MeteringAmiProtocolEngine';
import { MeteringDeliverablesExportEngine } from './modules/MeteringDeliverablesExportEngine';
import { useMeteringProjectStore } from './services/useMeteringProjectStore';

interface SmartMeteringGridDigitalizationWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const SmartMeteringGridDigitalizationWorkbench: React.FC<
  SmartMeteringGridDigitalizationWorkbenchProps
> = ({ locale, onNavigate, onSelectEquipment }) => {
  // Central Reactive Project Store for Smart Metering
  const store = useMeteringProjectStore('ENEO_DOUALA_BASSA_URBAN');

  // Mathematical Formulations & Protocols Reference Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-24">
      {/* 1. Authoritative Ecosystem Hero Header */}
      <AuthoritativeEcosystemHero
        stage="distribution"
        locale={locale}
        onNavigateStage={(stg) => {
          if (onNavigate) onNavigate(stg);
        }}
        onNavigateToDomain={(dom) => {
          if (onNavigate) onNavigate('domain', dom);
        }}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={
          locale === 'fr'
            ? 'Comptage Intelligent & Smart Grids'
            : 'Smart Metering & Grid Digitalization'
        }
        totalPillarsCount={5}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 space-y-6">
        {/* 2. Executive 7 Orientation Questions Banner */}
        <MeteringOrientationBanner
          locale={locale}
          onNavigateStage={(stg) => store.setActiveStage(stg)}
          onNavigateDomain={(dom) => onNavigate?.('domain', dom)}
        />

        {/* 3. Reactive Master Command Cockpit */}
        <MeteringCommandHeader
          locale={locale}
          store={store}
          onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
        />

        {/* ========================================================================= */}
        {/* STAGES 1 & 2: METROLOGY, DLMS/COSEM OBIS REGISTERS & STS PREPAYMENT */}
        {/* ========================================================================= */}
        {(store.activeStage === 1 || store.activeStage === 2) && (
          <MeteringAmiProtocolEngine locale={locale} store={store} />
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: SUBSTATION ENERGY BALANCE & ANTI-TAMPER / FRAUD DETECTION */}
        {/* ========================================================================= */}
        {store.activeStage === 3 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    ANTI-FRAUDE & BALANCE ÉNERGÉTIQUE POSTE HTA/BT
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [Bilan de Masse Télé-relevé : Compteur Maître vs Compteurs Clients]
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Détection Algorithmique des Pertes Non-Techniques & Anti-Fraude'
                    : 'Algorithmic Non-Technical Loss Detection & Anti-Tamper Telemetry'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {locale === 'fr'
                    ? 'Comparez en temps réel les kWh injectés par le transformateur HTA/BT avec la somme des consommations facturées pour isoler instantanément les dérivations sauvages et fraudes sur le neutre.'
                    : 'Compare real-time energy injected by the MV/LV substation with the aggregated sum of client billed meters to instantly detect unmetered bypasses and neutral tampering.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Statut Balance :</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    store.energyBalanceAnalytics.fraudAlertLevel === 'NORMAL'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700'
                      : store.energyBalanceAnalytics.fraudAlertLevel === 'ELEVATED'
                      ? 'text-amber-400 bg-amber-950/60 border-amber-700'
                      : 'text-rose-400 bg-rose-950/60 border-rose-700'
                  }`}
                >
                  {store.energyBalanceAnalytics.lossPercentage}% ÉCART ({store.energyBalanceAnalytics.fraudAlertLevel})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Substation Energy Sliders (5 cols) */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  {locale === 'fr' ? 'BILAN D’ÉNERGIE AU POSTE HTA/BT' : 'MV/LV SUBSTATION ENERGY INPUTS'}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Énergie Injectée au Poste (Tête de Départ) :</span>
                      <span className="text-emerald-400 font-bold">{store.substationFeederEnergyKwh.toLocaleString()} kWh/j</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="30000"
                      step="200"
                      value={store.substationFeederEnergyKwh}
                      onChange={(e) => store.setSubstationFeederEnergyKwh(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Somme des Compteurs Clients Relevés :</span>
                      <span className="text-cyan-400 font-bold">{store.sumClientMetersEnergyKwh.toLocaleString()} kWh/j</span>
                    </div>
                    <input
                      type="range"
                      min="3000"
                      max="28000"
                      step="200"
                      value={store.sumClientMetersEnergyKwh}
                      onChange={(e) => store.setSumClientMetersEnergyKwh(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  {/* Physical Tamper Toggles */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                      Capteurs Anti-Effraction Compteurs :
                    </span>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <span className="text-slate-300">Aimant Néodyme Externe Détecté (Effet Hall) :</span>
                      <button
                        onClick={() => store.setMagneticTamperDetected(!store.magneticTamperDetected)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          store.magneticTamperDetected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {store.magneticTamperDetected ? 'ALERTE HALL' : 'NORMAL'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <span className="text-slate-300">Inversion / Contournement Shunt de Neutre :</span>
                      <button
                        onClick={() => store.setNeutralBypassDetected(!store.neutralBypassDetected)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          store.neutralBypassDetected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {store.neutralBypassDetected ? 'BYPASS NEUTRE' : 'NORMAL'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Energy Balance Bar & Loss Recovery (7 cols) */}
              <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    {locale === 'fr'
                      ? 'DISSOCIATION DES PERTES TECHNIQUES vs PERTES PAR FRAUDE'
                      : 'TECHNICAL JOULE LOSSES vs UNBILLED FRAUD ANALYSIS'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Modélisation thermodynamique des câbles BT et identification des piquages pirates
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Énergie Non Facturée :</span>
                    <div className="text-xl font-bold text-rose-400 mt-1">
                      {store.energyBalanceAnalytics.deltaLossKwh.toLocaleString()} kWh/j
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Écart total : {store.energyBalanceAnalytics.lossPercentage}%
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Pertes Joule Techniques :</span>
                    <div className="text-xl font-bold text-amber-400 mt-1">
                      {store.energyBalanceAnalytics.expectedTechnicalLossKwh.toLocaleString()} kWh/j
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Lignes BT (RI² ~ 4.0%)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Fraudes Réelles Estimées :</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {store.energyBalanceAnalytics.estimatedFraudKwh.toLocaleString()} kWh/j
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Recouvrable par coffret perché
                    </div>
                  </div>
                </div>

                {/* Algorithmic Loss Bar Visual */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-bold">Répartition Énergétique du Départ BT :</span>
                    <span className="text-emerald-400 font-bold">100% Ingestion</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, (store.sumClientMetersEnergyKwh / store.substationFeederEnergyKwh) * 100))}%`
                      }}
                      title="Énergie Facturée"
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `4%` }}
                      title="Pertes Joule Câbles"
                    />
                    <div
                      className="bg-rose-500 h-full flex-1"
                      title="Pertes par Fraude"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Facturé
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Pertes Joule (4%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Fraudes / Dérivations
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-emerald-400 font-bold">Diagnostic Automatisé MDM : </span>
                  L'écart résiduel entre le compteur de départ de poste et la télé-relève des compteurs clients déclenche automatiquement un ordre de mission géo-localisé pour inspection des lignes BT suspectes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: MDM PLATFORM, REMOTE LATCHING RELAY CONTROL & DEMAND RESPONSE */}
        {/* ========================================================================= */}
        {store.activeStage === 4 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    MDM PLATFORM & TÉLÉ-COMMANDE RELAIS (CEI 62056-5-3)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [Contrôle Bidirectionnel à Distance du Relais Interne 100A]
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Plateforme MDM, Télé-conduite & Pilotage Dynamique de la Demande'
                    : 'MDM Platform, Remote Relay Tele-Control & Dynamic Demand Response'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {locale === 'fr'
                    ? 'Supervisez la courbe de charge en temps réel, exécutez les ordres de coupure/rétablissement à distance et configurez les seuils de limitation de puissance souscrite contractuelle (kW).'
                    : 'Supervise real-time load curves, trigger remote connect/disconnect switching, and configure contractual peak demand power limitation thresholds (kW).'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Position Relais :</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    store.remoteRelayState === 'CONNECTED'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700'
                      : 'text-rose-400 bg-rose-950/60 border-rose-700'
                  }`}
                >
                  {store.remoteRelayState === 'CONNECTED' ? 'FERMÉ (CLIENT ALIMENTÉ)' : 'OUVERT (COUPURE ACTIVE)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Relay Control & Demand Limits (5 cols) */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  {locale === 'fr' ? 'COMMANDE À DISTANCE DU RELAIS BISTABLE' : 'REMOTE LATCHING RELAY CONTROL'}
                </h3>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-slate-300 font-bold">
                      Ordre HES Télécommandé (CEI 62056 Disconnect Script) :
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => store.setRemoteRelayState('CONNECTED')}
                        className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                          store.remoteRelayState === 'CONNECTED'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Rétablir (ON)</span>
                      </button>
                      <button
                        onClick={() => store.setRemoteRelayState('DISCONNECTED_CREDIT_EXHAUSTED')}
                        className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                          store.remoteRelayState !== 'CONNECTED'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Couper (OFF)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Puissance Souscrite Max Contractuelle :</span>
                      <span className="text-amber-400 font-bold">{store.loadLimitKw} kW</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      step="0.5"
                      value={store.loadLimitKw}
                      onChange={(e) => store.setLoadLimitKw(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Appel de Puissance Actuel du Client :</span>
                      <span className="text-cyan-400 font-bold">{store.activeDemandKw} kW</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="35"
                      step="0.5"
                      value={store.activeDemandKw}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        store.setActiveDemandKw(val);
                        if (val > store.loadLimitKw) {
                          store.setRemoteRelayState('DISCONNECTED_OVERLOAD');
                        }
                      }}
                      className="w-full accent-cyan-500"
                    />
                    <div className="text-[10px] text-slate-500 font-mono">
                      Déclenchement automatique si P &gt; Pcontrat pendant &gt; 60 secondes
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 24h Load Curve Simulation (7 cols) */}
              <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    {locale === 'fr'
                      ? 'COURBE DE CHARGE 24H & GABARIT DE POINTE (DEMAND RESPONSE)'
                      : '24-HOUR LOAD PROFILE & PEAK DEMAND SHAVING'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Horodatage RTC synchronisé par serveur NTP / GSM toutes les 24h
                  </p>
                </div>

                {/* SVG 24-Hour Profile Canvas */}
                <div className="relative w-full aspect-[16/9] max-h-[300px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-3">
                  <svg viewBox="0 0 520 220" className="w-full h-full">
                    {/* Grid */}
                    <line x1="45" y1="20" x2="45" y2="185" stroke="#334155" strokeWidth="1" />
                    <line x1="45" y1="185" x2="490" y2="185" stroke="#334155" strokeWidth="1" />
                    <line x1="45" y1="100" x2="490" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Y Labels */}
                    <text x="40" y="25" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">30 kW</text>
                    <text x="40" y="100" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">15 kW</text>
                    <text x="40" y="185" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0 kW</text>

                    {/* X Labels (Hours) */}
                    <text x="50" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">00h</text>
                    <text x="160" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">06h</text>
                    <text x="270" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">12h</text>
                    <text x="380" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">18h</text>
                    <text x="480" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">24h</text>

                    {/* Contractual Limit Line */}
                    {(() => {
                      const yLimit = 185 - (store.loadLimitKw / 30) * 165;
                      return (
                        <g>
                          <line x1="45" y1={yLimit} x2="490" y2={yLimit} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
                          <text x="485" y={yLimit - 4} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">
                            Seuil Contrat ({store.loadLimitKw} kW)
                          </text>
                        </g>
                      );
                    })()}

                    {/* Typical Residential Load Profile Trace */}
                    <path
                      d="M 50,165 Q 120,175 160,150 T 270,140 T 360,120 T 420,60 T 460,90 T 490,165"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    {/* Shaded Area under curve */}
                    <polygon
                      points="50,185 50,165 160,150 270,140 360,120 420,60 460,90 490,165 490,185"
                      fill="#10b981"
                      fillOpacity="0.12"
                    />

                    {/* Peak Point Alert */}
                    <circle cx="420" cy="60" r="5" fill="#f43f5e" className="animate-pulse" />
                    <text x="420" y="50" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                      Pointe 20h
                    </text>
                  </svg>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold">Gestion des Pointes (Peak Shaving) : </span>
                  La plateforme MDM permet d'envoyer des commandes de limitation de puissance temporaires aux compteurs communicants lors des pointes de demande sur le Réseau Interconnecté Sud (RIS), évitant ainsi le délestage massif de quartiers entiers.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: CAMEROON SITES ROLLOUTS & STAMPED BOQ/DQE IN FCFA */}
        {/* ========================================================================= */}
        {store.activeStage === 5 && (
          <MeteringDeliverablesExportEngine locale={locale} store={store} />
        )}
      </div>

      {/* ========================================================================= */}
      {/* MATHEMATICAL FORMULATIONS & NORMATIVE STANDARDS MODAL */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Normes de Comptage, Formulations & Codes OBIS'
                    : 'Metering Standards, Formulations & OBIS Codes'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">1. Précision Métrologique CEI 62053-21 :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  Erreur % = (E_mesuré - E_vrai) / E_vrai &times; 100%
                </div>
                <p className="text-[11px] text-slate-400">
                  Classe 1.0 : Erreur absolue &le; 1.0% de 0.1 In à Imax sous cos &phi; = 1.0.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">2. Balance Énergétique de Poste HTA/BT :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  &Delta;E_fraude = E_poste - &sum; E_clients - E_joule_câbles
                </div>
                <p className="text-[11px] text-slate-400">
                  Isole mathématiquement les dérivations clandestines et shunts pirates sur le neutre.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">3. Chiffrement STS 20-Digits (CEI 62055-41) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  Token = Encrypt_DKGA(TID || Credit_Value || Tariff_Index || CRC16)
                </div>
                <p className="text-[11px] text-slate-400">
                  Chiffrement par algorithme DES / Triple DES ou AES-128 avec identifiant temporel TID 2024.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">4. Structure OBIS DLMS/COSEM (CEI 62056-61) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  A.B.C.D.E.F = Média . Voie . Grandeur . Type . Tarif . Historique
                </div>
                <p className="text-[11px] text-slate-400">
                  Exemple : 1.0.1.8.0.255 = Énergie active positive totale instantanée (kWh).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
