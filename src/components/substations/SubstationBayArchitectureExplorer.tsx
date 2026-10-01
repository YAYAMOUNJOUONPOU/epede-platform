// src/components/substations/SubstationBayArchitectureExplorer.tsx
// EPEDE D04 - Substation Bay Architecture & Electromechanical Apparatus Explorer

import React, { useState } from 'react';
import {
  FolderTree,
  Zap,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ChevronRight,
  Info,
  Activity,
  Cpu,
  ArrowDown,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { SUBSTATION_BAYS_CATALOG, SubstationBayDefinition } from './data/substationBaysData';
import { HvDisconnectorKinematicsInterlockSimulator } from './modules/HvDisconnectorKinematicsInterlockSimulator';

interface SubstationBayArchitectureExplorerProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const SubstationBayArchitectureExplorer: React.FC<SubstationBayArchitectureExplorerProps> = ({
  locale,
  onSelectEquipment
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'BAY_ARCHITECTURE' | 'DISCONNECTOR_KINEMATICS'>('BAY_ARCHITECTURE');
  const [selectedBayId, setSelectedBayId] = useState<string>('BAY_LINE_225');
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  // Interactive bay switch states for Interlocking Simulator
  // Default: Normal live operation (Breaker closed, Line DS closed, Bus1 DS closed, Bus2 DS open, Earth open)
  const [breakerClosed, setBreakerClosed] = useState<boolean>(true);
  const [lineDsClosed, setLineDsClosed] = useState<boolean>(true);
  const [bus1DsClosed, setBus1DsClosed] = useState<boolean>(true);
  const [bus2DsClosed, setBus2DsClosed] = useState<boolean>(false);
  const [earthDsClosed, setEarthDsClosed] = useState<boolean>(false);
  const [couplerBreakerClosed, setCouplerBreakerClosed] = useState<boolean>(false);
  const [interlockMessage, setInterlockMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    text: locale === 'fr' 
      ? "État normal d'exploitation : Ligne alimentée via Barre 1." 
      : 'Normal operating state: Line energized via Busbar 1.',
    type: 'info'
  });

  const currentBay = SUBSTATION_BAYS_CATALOG.find((b) => b.id === selectedBayId) || SUBSTATION_BAYS_CATALOG[0];

  // Interlocking rules enforcement (IEC 62271-102 & IEC 62271-100)
  const handleToggleBreaker = () => {
    const newState = !breakerClosed;
    setBreakerClosed(newState);
    if (newState) {
      // Closing breaker: ensure earth switch is open!
      if (earthDsClosed) {
        setInterlockMessage({
          text: locale === 'fr'
            ? '⚠️ DANGER ABSOLU : Enclenchement sur sectionneur de mise à la terre FERMÉ ! Déclenchement instantané 50/51.'
            : '⚠️ CRITICAL DANGER: Breaker closed onto CLOSED earth switch! Instantaneous 50/51 trip.',
          type: 'error'
        });
      } else {
        setInterlockMessage({
          text: locale === 'fr'
            ? '✓ Disjoncteur Q0 enclenché. Transit de charge et coupure assurés par autosoufflage SF6.'
            : '✓ Breaker Q0 closed. Continuous load and short-circuit capability active via SF6.',
          type: 'success'
        });
      }
    } else {
      setInterlockMessage({
        text: locale === 'fr'
          ? '✓ Disjoncteur Q0 déclenché. Le circuit est hors charge. Les sectionneurs peuvent maintenant être manœuvrés en sécurité.'
          : '✓ Breaker Q0 opened. Circuit de-energized. Disconnectors may now be safely operated.',
        type: 'info'
      });
    }
  };

  const handleToggleLineDs = () => {
    // Cannot operate disconnector under load (breaker must be OPEN)
    if (breakerClosed) {
      setInterlockMessage({
        text: locale === 'fr'
          ? "⛔ INTERLOCK BLOQUÉ (CEI 62271-102) : Impossible de manœuvrer le sectionneur de ligne Q9 avec le disjoncteur Q0 FERMÉ ! Risque d'arc explosif de coupure sous charge."
          : '⛔ INTERLOCK BLOCKED (IEC 62271-102): Cannot operate line disconnector Q9 with circuit breaker Q0 CLOSED! Severe flashover hazard.',
        type: 'error'
      });
      return;
    }
    // Cannot close line disconnector if earth switch is closed
    if (!lineDsClosed && earthDsClosed) {
      setInterlockMessage({
        text: locale === 'fr'
          ? '⛔ INTERLOCK BLOQUÉ : Impossible de fermer Q9 tant que le sectionneur de terre Q8 est FERMÉ (Verrouillage électromécanique 12).'
          : '⛔ INTERLOCK BLOCKED: Cannot close Q9 while line earthing switch Q8 is CLOSED (Safety interlock 12).',
        type: 'error'
      });
      return;
    }

    setLineDsClosed(!lineDsClosed);
    setInterlockMessage({
      text: locale === 'fr'
        ? `✓ Sectionneur de ligne Q9 ${!lineDsClosed ? 'FERMÉ' : 'OUVERT'} (Coupure visible et distance diélectrique d'isolement assurée).`
        : `✓ Line disconnector Q9 ${!lineDsClosed ? 'CLOSED' : 'OPENED'} (Visible dielectric isolation confirmed).`,
      type: 'success'
    });
  };

  const handleToggleEarthDs = () => {
    // Interlock: Cannot close earth switch if line DS is closed OR breaker is closed
    if (!earthDsClosed && (lineDsClosed || breakerClosed)) {
      setInterlockMessage({
        text: locale === 'fr'
          ? "⛔ INTERLOCK SÉCURITÉ CRITIQUE : Interdiction absolue de fermer le sectionneur de terre Q8 tant que Q9 est FERMÉ ! Risque de mise à la terre d'une ligne sous tension."
          : '⛔ CRITICAL SAFETY INTERLOCK: Prohibited from closing earth switch Q8 while Q9 is CLOSED! Risk of earthing energized circuit.',
        type: 'error'
      });
      return;
    }

    setEarthDsClosed(!earthDsClosed);
    setInterlockMessage({
      text: locale === 'fr'
        ? `✓ Sectionneur de mise à la terre Q8 ${!earthDsClosed ? 'FERMÉ (Consignation LOTO active, potentiel 0V garanti)' : 'OUVERT'}.`
        : `✓ Line earthing switch Q8 ${!earthDsClosed ? 'CLOSED (LOTO grounding applied, 0V verified)' : 'OPENED'}.`,
      type: !earthDsClosed ? 'warning' : 'info'
    });
  };

  const handleToggleBus1Ds = () => {
    // Cannot toggle under load unless bus coupler is closed for on-load bus transfer!
    if (breakerClosed && !couplerBreakerClosed) {
      setInterlockMessage({
        text: locale === 'fr'
          ? "⛔ INTERLOCK BLOQUÉ : Manœuvre du sectionneur Barre 1 interdit sous charge. Pour un transfert de barres sous tension, fermez d'abord le disjoncteur de couplage !"
          : '⛔ INTERLOCK BLOCKED: Operating Bus 1 disconnector under load prohibited. For on-load transfer, close bus coupler first!',
        type: 'error'
      });
      return;
    }
    setBus1DsClosed(!bus1DsClosed);
    setInterlockMessage({
      text: locale === 'fr'
        ? `✓ Sectionneur Barre 1 (Q1) ${!bus1DsClosed ? 'FERMÉ' : 'OUVERT'}.`
        : `✓ Bus 1 disconnector (Q1) ${!bus1DsClosed ? 'CLOSED' : 'OPENED'}.`,
      type: 'success'
    });
  };

  const handleToggleBus2Ds = () => {
    // Cannot toggle under load unless bus coupler is closed for on-load bus transfer!
    if (breakerClosed && !couplerBreakerClosed) {
      setInterlockMessage({
        text: locale === 'fr'
          ? "⛔ INTERLOCK BLOQUÉ : Manœuvre du sectionneur Barre 2 interdit sous charge. Pour un transfert de barres sous tension, fermez d'abord le disjoncteur de couplage !"
          : '⛔ INTERLOCK BLOCKED: Operating Bus 2 disconnector under load prohibited. For on-load transfer, close bus coupler first!',
        type: 'error'
      });
      return;
    }
    setBus2DsClosed(!bus2DsClosed);
    setInterlockMessage({
      text: locale === 'fr'
        ? `✓ Sectionneur Barre 2 (Q2) ${!bus2DsClosed ? 'FERMÉ' : 'OUVERT'}.`
        : `✓ Bus 2 disconnector (Q2) ${!bus2DsClosed ? 'CLOSED' : 'OPENED'}.`,
      type: 'success'
    });
  };

  const handleResetBay = () => {
    setBreakerClosed(true);
    setLineDsClosed(true);
    setBus1DsClosed(true);
    setBus2DsClosed(false);
    setEarthDsClosed(false);
    setCouplerBreakerClosed(false);
    setInterlockMessage({
      text: locale === 'fr' ? "Configuration de la travée réinitialisée à l'état nominal d'exploitation." : 'Bay configuration reset to nominal operating condition.',
      type: 'info'
    });
  };

  // Determine line power flow status
  const isLineEnergized = (bus1DsClosed || bus2DsClosed) && breakerClosed && lineDsClosed && !earthDsClosed;
  const isBayGrounded = earthDsClosed;

  return (
    <div className="space-y-4 font-mono">
      {/* View Switcher: Bay Pipeline vs Disconnector Kinematics Simulator */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-lg">
        <button
          type="button"
          onClick={() => setActiveViewTab('BAY_ARCHITECTURE')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeViewTab === 'BAY_ARCHITECTURE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 ring-1 ring-sky-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>{locale === 'fr' ? '1. Travées Normalisées & Schéma Unifilaire' : '1. Standardized Bay Pipelines & SLD'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('DISCONNECTOR_KINEMATICS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeViewTab === 'DISCONNECTOR_KINEMATICS'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-1 ring-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{locale === 'fr' ? '2. Sectionneurs THT, Commande MOM & Verrouillages (CEI 62271-102)' : '2. HV Disconnectors, Motor Drive & Interlocking (IEC 62271-102)'}</span>
        </button>
      </div>

      {activeViewTab === 'DISCONNECTOR_KINEMATICS' ? (
        <HvDisconnectorKinematicsInterlockSimulator locale={locale} />
      ) : (
        <>
          {/* 1. Header & Bay Selector Tabs */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <FolderTree className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {locale === 'fr' ? 'Architecture des Travées Électrotechniques (Bays)' : 'Electrotechnical Bay Architecture'}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans font-normal">
                {locale === 'fr'
                  ? 'La travée est l\'unité modulaire d\'un poste : enchaînement normalisé coupure, sectionnement, mesure et mise à la terre.'
                  : 'The bay is the foundational building block of a substation: standardized switching, isolation, instrumentation, and earthing.'}
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold self-start sm:self-auto">
            CEI 62271-100 / CEI 62271-102
          </span>
        </div>

        {/* Bay Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {SUBSTATION_BAYS_CATALOG.map((bay) => {
            const isSelected = bay.id === selectedBayId;
            return (
              <button
                key={bay.id}
                type="button"
                onClick={() => {
                  setSelectedBayId(bay.id);
                  setActiveStageIdx(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-sky-300'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:text-white hover:border-slate-500'
                }`}
              >
                <span>{locale === 'fr' ? bay.name_fr : bay.name_en}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-slate-950 text-sky-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {bay.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Conceptual Flow Chain (The Golden Bay Pipeline) */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Pipeline Fonctionnel Normalisé de la Travée :' : 'Standardized Bay Functional Pipeline:'}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-normal font-sans">
            {locale === 'fr' ? 'Cliquez sur une étape pour inspecter l\'appareillage' : 'Click any stage to inspect apparatus'}
          </span>
        </div>

        {/* Pipeline Stepper Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {currentBay.flow_stages.map((st, idx) => {
            const isSelected = idx === activeStageIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStageIdx(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
                }`}
              >
                <div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {st.apparatus_code}
                  </span>
                  <div className={`text-[11px] font-bold mt-1.5 leading-tight ${
                    isSelected ? 'text-slate-950' : 'text-white group-hover:text-amber-300'
                  }`}>
                    {locale === 'fr' ? st.title_fr : st.title_en}
                  </div>
                </div>
                <div className={`text-[9px] mt-1 font-sans ${
                  isSelected ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {locale === 'fr' ? st.apparatus_name_fr : st.apparatus_name_en}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Banner */}
        {currentBay.flow_stages[activeStageIdx] && (
          <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-[11px]">
                  {currentBay.flow_stages[activeStageIdx].apparatus_code}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-white font-bold">
                  {locale === 'fr'
                    ? currentBay.flow_stages[activeStageIdx].apparatus_name_fr
                    : currentBay.flow_stages[activeStageIdx].apparatus_name_en}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans font-normal">
                {locale === 'fr'
                  ? currentBay.flow_stages[activeStageIdx].role_fr
                  : currentBay.flow_stages[activeStageIdx].role_en}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectEquipment && onSelectEquipment(currentBay.flow_stages[activeStageIdx].apparatus_code)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>{locale === 'fr' ? 'Fiche 30 Sections' : '30-Section Sheet'}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Interactive Bay Interlocking & Switching Simulator (IEC 62271-100 / IEC 62271-102) */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'Simulateur Interactif de Verrouillages & Manœuvres (IEC 62271-102)'
                  : 'Interactive Bay Interlocking & Switching Simulator (IEC 62271-102)'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans font-normal">
                {locale === 'fr'
                  ? 'Testez les règles de sécurité : interdiction de manœuvre de sectionneur sous charge et blocage de fermeture de terre sur ligne sous tension.'
                  : 'Test real safety interlocks: disconnector switching forbidden under load and earthing blade lockout while energized.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetBay}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset Bay'}</span>
            </button>
            <span className={`text-[10px] px-2.5 py-1 rounded font-bold border flex items-center gap-1.5 ${
              isLineEnergized
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : isBayGrounded
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Activity className="h-3 w-3" />
              <span>
                {isLineEnergized
                  ? (locale === 'fr' ? 'LIGNE SOUS TENSION (225 kV)' : 'LINE ENERGIZED (225 kV)')
                  : isBayGrounded
                  ? (locale === 'fr' ? 'LIGNE CONSIGNÉE / TERRE (0 V)' : 'LINE GROUNDED / LOTO (0 V)')
                  : (locale === 'fr' ? 'HORS TENSION NON MISE À LA TERRE' : 'DE-ENERGIZED FLOATING')}
              </span>
            </span>
          </div>
        </div>

        {/* Dynamic Single-Line Electrical Schematic View */}
        <div className="p-4 rounded-xl bg-[#06090F] border border-[#1E2634] space-y-3">
          <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>{locale === 'fr' ? 'Schéma Unifilaire Dynamique de la Travée :' : 'Dynamic Bay Single-Line Schematic:'}</span>
            <span className="text-[10px] text-slate-500 font-sans">
              {locale === 'fr' ? 'Cliquez sur les commandes pour changer d\'état' : 'Click controls below to operate apparatus'}
            </span>
          </div>

          {/* Interactive Switchgear Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            {/* 1. Busbar Disconnectors Q1 & Q2 */}
            <div className="p-3 rounded-xl bg-[#0B1019] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-sky-400">Q1 / Q2 (Barres)</span>
                <span className="text-[10px] text-slate-500">Sélecteurs</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={handleToggleBus1Ds}
                  className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all flex items-center justify-between cursor-pointer ${
                    bus1DsClosed
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>Q1 (Barre 1) :</span>
                  <span className={bus1DsClosed ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                    {bus1DsClosed ? 'FERMÉ' : 'OUVERT'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleBus2Ds}
                  className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all flex items-center justify-between cursor-pointer ${
                    bus2DsClosed
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>Q2 (Barre 2) :</span>
                  <span className={bus2DsClosed ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                    {bus2DsClosed ? 'FERMÉ' : 'OUVERT'}
                  </span>
                </button>
              </div>
              <div className="text-[9px] text-slate-500 font-sans">
                {locale === 'fr' ? 'Permet l\'aiguillage sur le jeu de barres 1 ou 2.' : 'Directs power from bus 1 or 2.'}
              </div>
            </div>

            {/* 2. Bus Coupler Bypass Simulator */}
            <div className="p-3 rounded-xl bg-[#0B1019] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400">Q0-CPL (Couplage)</span>
                <span className="text-[10px] text-slate-500">Poste</span>
              </div>
              <button
                type="button"
                onClick={() => setCouplerBreakerClosed(!couplerBreakerClosed)}
                className={`w-full py-2 px-2 rounded-lg text-[11px] font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  couplerBreakerClosed
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Disj Couplage :</span>
                <span className={couplerBreakerClosed ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {couplerBreakerClosed ? 'BOUCLÉ (ON)' : 'OUVERT (OFF)'}
                </span>
              </button>
              <div className="text-[9px] text-slate-500 font-sans">
                {locale === 'fr'
                  ? 'Fermé pour autoriser le transfert de barre sous charge sans coupure.'
                  : 'Closed to permit on-load busbar transfer without interruption.'}
              </div>
            </div>

            {/* 3. Main Circuit Breaker Q0 */}
            <div className="p-3 rounded-xl bg-[#0B1019] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-red-400">Q0 (Disjoncteur)</span>
                <span className="text-[10px] text-slate-500">SF6 40kA</span>
              </div>
              <button
                type="button"
                onClick={handleToggleBreaker}
                className={`w-full py-2 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  breakerClosed
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>État Q0 :</span>
                <span className={`font-bold ${breakerClosed ? 'text-red-400' : 'text-emerald-400'}`}>
                  {breakerClosed ? 'FERMÉ (I > 0)' : 'OUVERT (0 A)'}
                </span>
              </button>
              <div className="text-[9px] text-slate-500 font-sans">
                {locale === 'fr'
                  ? 'Seul appareil habilité à couper le courant de charge ou de défaut.'
                  : 'Only apparatus certified to interrupt load & short-circuit currents.'}
              </div>
            </div>

            {/* 4. Line Disconnector Q9 */}
            <div className="p-3 rounded-xl bg-[#0B1019] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-sky-400">Q9 (Sectionneur)</span>
                <span className="text-[10px] text-slate-500">Ligne</span>
              </div>
              <button
                type="button"
                onClick={handleToggleLineDs}
                className={`w-full py-2 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  lineDsClosed
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>État Q9 :</span>
                <span className={lineDsClosed ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                  {lineDsClosed ? 'FERMÉ' : 'ISOLÉ (Ouvert)'}
                </span>
              </button>
              <div className="text-[9px] text-slate-500 font-sans">
                {locale === 'fr'
                  ? 'Coupure visible. Ne coupe JAMAIS de courant.'
                  : 'Visible isolation gap. NEVER breaks current.'}
              </div>
            </div>

            {/* 5. Line Earthing Switch Q8 */}
            <div className="p-3 rounded-xl bg-[#0B1019] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400">Q8 (Terre Ligne)</span>
                <span className="text-[10px] text-slate-500">IEEE 80</span>
              </div>
              <button
                type="button"
                onClick={handleToggleEarthDs}
                className={`w-full py-2 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  earthDsClosed
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Sectionneur Q8 :</span>
                <span className={earthDsClosed ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {earthDsClosed ? 'TERRE MISE (0V)' : 'OUVERT'}
                </span>
              </button>
              <div className="text-[9px] text-slate-500 font-sans">
                {locale === 'fr'
                  ? 'Écoulement des charges résiduelles & mise en sécurité LOTO.'
                  : 'Grounds residual charges & ensures LOTO safety.'}
              </div>
            </div>

          </div>

          {/* Interlocking Diagnostic Console / Warning Banner */}
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 transition-all ${
            interlockMessage.type === 'error'
              ? 'bg-red-950/30 border-red-500/50 text-red-300'
              : interlockMessage.type === 'warning'
              ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
              : interlockMessage.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0B1019] border-[#222B38] text-slate-300'
          }`}>
            {interlockMessage.type === 'error' ? (
              <AlertOctagon className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            ) : interlockMessage.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            ) : interlockMessage.type === 'success' ? (
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="font-sans text-[11px] leading-relaxed">
              <strong className="font-bold font-mono mr-1">
                {interlockMessage.type === 'error'
                  ? 'ALERTE VERROUILLAGE ÉLECTRIQUE :'
                  : interlockMessage.type === 'warning'
                  ? 'STATUT CONSIGNATION :'
                  : 'CONTRÔLE DE SÉCURITÉ :'}
              </strong>
              {interlockMessage.text}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Technical Breakdown: Apparatus Table & Dependencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Apparatus Register & Interlocking Physics */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'Registre des Appareils Primaires & Verrouillages' : 'Primary Apparatus & Interlocks'}</span>
            </h4>
            <span className="text-[10px] text-slate-400">
              {currentBay.primary_apparatus.length} {locale === 'fr' ? 'Appareils' : 'Devices'}
            </span>
          </div>

          {/* Apparatus Grid Cards */}
          <div className="space-y-2.5">
            {currentBay.primary_apparatus.map((app, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-sky-400 font-bold text-xs border border-sky-500/30">
                      {app.code}
                    </span>
                    <span className="text-xs font-bold text-white">{app.type}</span>
                    <span className="text-[10px] text-slate-500">({app.symbol_iec})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      {app.normal_state === 'CLOSED'
                        ? (locale === 'fr' ? 'FERMÉ (Normal)' : 'CLOSED (Normal)')
                        : (locale === 'fr' ? 'OUVERT (Normal)' : 'OPEN (Normal)')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectEquipment && onSelectEquipment(app.code)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
                      title={locale === 'fr' ? `Consulter la Fiche 30 Sections de ${app.code}` : `View 30-Section Sheet for ${app.code}`}
                    >
                      <span className="hidden sm:inline">{locale === 'fr' ? 'Dossier 30 Sections' : '30-Sec Dossier'}</span>
                      <span className="sm:hidden">{locale === 'fr' ? 'Fiche' : 'Sheet'}</span>
                      <ChevronRight className="h-3 w-3 text-amber-400" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  <strong className="text-slate-500">{locale === 'fr' ? 'Spécifications Assignées :' : 'Rated Specifications:'}</strong> {app.rated_specs}
                </div>

                <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 font-sans leading-relaxed">
                  <strong className="font-bold text-amber-300 mr-1">{locale === 'fr' ? 'Règle de Verrouillage :' : 'Interlocking Rule:'}</strong>
                  {locale === 'fr' ? app.interlocking_rule_fr : app.interlocking_rule_en}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Protection Relays List */}
          <div className="pt-2 border-t border-[#222B38]">
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>{locale === 'fr' ? 'Chaîne de Protection Dédiée (Relais IED) :' : 'Dedicated IED Protection Chain:'}</span>
            </h5>
            <div className="space-y-1.5">
              {(locale === 'fr' ? currentBay.protection_ieds_fr : currentBay.protection_ieds_en).map((ied, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-[#070A10] border border-[#1E2634] text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="font-sans font-normal leading-snug">{ied}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Auxiliaries Dependencies & Safety Earthing */}
        <div className="space-y-4">
          
          {/* Auxiliary Power Dependencies Box */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Dépendances Auxiliaires' : 'Auxiliary Supplies'}</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                <span className="text-[10px] text-slate-500 block">{locale === 'fr' ? 'Bobine Déclenchement 1 :' : 'Trip Coil 1 (110V DC):'}</span>
                <span className="text-[11px] text-amber-300 font-bold">{currentBay.auxiliary_dependencies.dc_trip_1}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                <span className="text-[10px] text-slate-500 block">{locale === 'fr' ? 'Bobine Déclenchement 2 :' : 'Trip Coil 2 (110V DC):'}</span>
                <span className="text-[11px] text-amber-300 font-bold">{currentBay.auxiliary_dependencies.dc_trip_2}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                <span className="text-[10px] text-slate-500 block">{locale === 'fr' ? 'Moteurs Armement & Sectionneurs :' : 'Motor Mechanism Supply:'}</span>
                <span className="text-[11px] text-sky-300 font-bold">{currentBay.auxiliary_dependencies.ac_motor_drive}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                <span className="text-[10px] text-slate-500 block">{locale === 'fr' ? 'Alimentation Télécoms & Horloge :' : 'Telecom & Clock Supply:'}</span>
                <span className="text-[11px] text-emerald-300 font-bold">{currentBay.auxiliary_dependencies.ups_telecom}</span>
              </div>
            </div>
          </div>

          {/* Safety Earthing & Failure Mitigation */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Mise à la Terre & Sécurité' : 'Safety Earthing'}</span>
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
            </h4>

            <p className="text-[11px] text-slate-300 font-sans font-normal leading-relaxed p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
              {locale === 'fr' ? currentBay.earthing_safety_fr : currentBay.earthing_safety_en}
            </p>

            {/* Failure Modes & Mitigations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{locale === 'fr' ? 'Modes de Défaillance & Réponses :' : 'Failure Modes & Mitigations:'}</span>
              {currentBay.failure_modes.map((fm, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs space-y-1">
                  <div className="font-bold text-red-300 text-[11px]">
                    ⚠️ {locale === 'fr' ? fm.mode_fr : fm.mode_en}
                  </div>
                  <div className="text-slate-300 text-[10px] font-sans font-normal leading-snug">
                    <strong className="text-emerald-400">{locale === 'fr' ? 'Remède :' : 'Remedy:'}</strong> {locale === 'fr' ? fm.mitigation_fr : fm.mitigation_en}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  )}

</div>
);
};
