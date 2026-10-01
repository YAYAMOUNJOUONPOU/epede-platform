// src/components/visual/InteractiveScadaHmiView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Server,
  Radio,
  RefreshCw,
  Power,
  ShieldAlert,
  Layers,
  Cpu,
  Eye,
  Info,
  ChevronRight,
  Terminal,
  Gauge,
  Maximize2
} from 'lucide-react';

export type ScadaDomainMode = 
  | 'substation' 
  | 'generation' 
  | 'distribution' 
  | 'bess' 
  | 'industry';

export interface InteractiveScadaHmiViewProps {
  mode?: ScadaDomainMode;
  locale: 'fr' | 'en';
  compact?: boolean;
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateStandard?: (standardRef: string) => void;
}

interface AlarmRecord {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  tag: string;
  messageFr: string;
  messageEn: string;
  acknowledged: boolean;
}

interface TelemetrySignal {
  tag: string;
  labelFr: string;
  labelEn: string;
  value: number | string;
  unit: string;
  status: 'GOOD' | 'WARNING' | 'ALARM';
  quality: 'VALID' | 'SIMULATED';
}

export const InteractiveScadaHmiView: React.FC<InteractiveScadaHmiViewProps> = ({
  mode: initialMode = 'substation',
  locale,
  compact = false,
  onNavigateEquipment,
  onNavigateStandard,
}) => {
  const [activeMode, setActiveMode] = useState<ScadaDomainMode>(initialMode);
  const [activeViewTab, setActiveViewTab] = useState<'mimic' | 'alarms' | 'iec61850' | 'telemetry'>('mimic');

  // Breaker operational states (true = CLOSED, false = OPEN)
  const [breakerQ0Closed, setBreakerQ0Closed] = useState<boolean>(true);
  const [disconnectorQ1Closed, setDisconnectorQ1Closed] = useState<boolean>(true);
  const [disconnectorQ2Closed, setDisconnectorQ2Closed] = useState<boolean>(true);
  const [earthSwitchQ8Closed, setEarthSwitchQ8Closed] = useState<boolean>(false);
  const [tapChangerStep, setTapChangerStep] = useState<number>(9); // 1 to 17, 9 is nominal 0%
  const [isAutoRegulation, setIsAutoRegulation] = useState<boolean>(true);

  // Fault simulation injection
  const [isFaultActive, setIsFaultActive] = useState<boolean>(false);
  const [tripHistory, setTripHistory] = useState<string[]>([]);
  const [interlockError, setInterlockError] = useState<string | null>(null);

  // Live fluctuating telemetry values
  const [timeCounter, setTimeCounter] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeCounter((prev) => prev + 1);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Compute live fluctuating values based on active mode and breaker state
  const liveTelemetry = useMemo(() => {
    const isPowered = breakerQ0Closed && disconnectorQ1Closed;
    const jitter = Math.sin(timeCounter * 0.5) * 0.8;
    const jitterCurrent = Math.cos(timeCounter * 0.7) * 2.5;

    switch (activeMode) {
      case 'substation': {
        const voltage = isPowered ? (225.4 + jitter).toFixed(1) : '0.0';
        const current = isPowered ? (94.2 + jitterCurrent).toFixed(1) : '0.0';
        const powerMw = isPowered ? ((Number(voltage) * Number(current) * 1.732 * 0.95) / 1000).toFixed(1) : '0.0';
        const powerMvar = isPowered ? ((Number(voltage) * Number(current) * 1.732 * 0.31) / 1000).toFixed(1) : '0.0';
        const oilTemp = (58.4 + Math.sin(timeCounter * 0.2) * 0.5).toFixed(1);
        const sf6Pressure = '6.2'; // bar

        return {
          voltage,
          current,
          powerMw,
          powerMvar,
          frequency: (50.0 + Math.sin(timeCounter * 0.3) * 0.03).toFixed(2),
          oilTemp,
          sf6Pressure,
          tapPosition: `${tapChangerStep >= 9 ? '+' : ''}${((tapChangerStep - 9) * 1.25).toFixed(2)}% (Pos ${tapChangerStep})`,
          busVoltageMv: isPowered ? (30.8 + jitter * 0.1).toFixed(2) : '0.00',
        };
      }
      case 'generation': {
        const speed = isPowered ? (375.0 + Math.sin(timeCounter * 0.4) * 0.2).toFixed(1) : '0.0';
        const mw = isPowered ? (59.4 + Math.sin(timeCounter * 0.6) * 1.2).toFixed(1) : '0.0';
        const mvar = isPowered ? (14.2 + jitter * 0.5).toFixed(1) : '0.0';
        const statorTemp = (84.1 + Math.sin(timeCounter * 0.2) * 0.8).toFixed(1);
        return {
          mw,
          mvar,
          voltage: isPowered ? (15.5 + jitter * 0.05).toFixed(2) : '0.00',
          speed,
          frequency: (50.0 + Math.sin(timeCounter * 0.3) * 0.02).toFixed(2),
          wicketGate: isPowered ? '87.5%' : '0.0%',
          statorTemp,
          bearingVibe: '0.84 mm/s',
        };
      }
      case 'distribution': {
        const vMv = isPowered ? (30.2 + jitter * 0.1).toFixed(2) : '0.00';
        const currentA = isPowered ? (142.0 + jitterCurrent).toFixed(1) : '0.0';
        const vLv = isPowered ? (403 + jitter * 1.5).toFixed(0) : '0';
        return {
          voltageMv: vMv,
          currentA,
          voltageLv: vLv,
          loadKva: isPowered ? (485 + jitterCurrent * 2).toFixed(0) : '0',
          frequency: '50.01',
          cosPhi: '0.94',
          fpiStatus: isFaultActive ? 'TRIPPED (50/51)' : 'NORMAL (No Fault)',
          recloserState: breakerQ0Closed ? 'CLOSED (Ready)' : 'OPEN / LOCKOUT',
        };
      }
      case 'bess': {
        const soc = (78.4 - (timeCounter * 0.02) % 20).toFixed(1);
        const soh = '98.2';
        const batteryP = isPowered ? '+4.85 MW (Discharging)' : '0.00 MW (Standby)';
        const rackTemp = (24.8 + Math.sin(timeCounter * 0.2) * 0.4).toFixed(1);
        return {
          soc,
          soh,
          batteryP,
          dcVoltage: '864.2 V',
          pcsStatus: isPowered ? 'GRID_FORMING' : 'INVERTER_OFF',
          rackTemp,
          cellVoltageSpread: '12 mV',
          insulationResistance: '1.8 MΩ',
        };
      }
      case 'industry': {
        const motorKw = isPowered ? (218.4 + jitterCurrent).toFixed(1) : '0.0';
        const speedRpm = isPowered ? (1485 + Math.sin(timeCounter * 0.5) * 5).toFixed(0) : '0';
        const flowRate = isPowered ? '420 m³/h' : '0 m³/h';
        const pressure = isPowered ? '6.4 bar' : '0.0 bar';
        return {
          motorKw,
          speedRpm,
          flowRate,
          pressure,
          motorCurrent: isPowered ? '382 A' : '0 A',
          bearingTemp: '64.2 °C',
          thdCurrent: '3.8%',
          vfdFreq: isPowered ? '49.8 Hz' : '0.0 Hz',
        };
      }
    }
  }, [activeMode, breakerQ0Closed, disconnectorQ1Closed, timeCounter, tapChangerStep, isFaultActive]);

  // Alarms array
  const [alarms, setAlarms] = useState<AlarmRecord[]>([
    {
      id: 'ALM-001',
      timestamp: '14:28:02.104',
      severity: 'INFO',
      tag: 'IEC61850-SW-01',
      messageFr: 'Station Bus RSTP Anneau Optique Normalisé (Convergence < 12 ms)',
      messageEn: 'Station Bus RSTP Optical Ring Normalized (Convergence < 12 ms)',
      acknowledged: true,
    },
    {
      id: 'ALM-002',
      timestamp: '14:31:18.440',
      severity: 'WARNING',
      tag: 'TR-40MVA-OLTC',
      messageFr: 'Régleur en charge : Manœuvre automatique position 9 exécutée',
      messageEn: 'On-Load Tap Changer: Auto tap step 9 executed successfully',
      acknowledged: true,
    },
  ]);

  // Handle Breaker Command (with Safety Interlocking validation)
  const handleToggleBreaker = () => {
    setInterlockError(null);
    if (!breakerQ0Closed) {
      // Trying to CLOSE breaker
      if (earthSwitchQ8Closed) {
        setInterlockError(
          locale === 'fr'
            ? 'VERROUILLAGE SÉCURITÉ REFUSÉ : Le sectionneur de mise à la terre Q8 est FERMÉ !'
            : 'SAFETY INTERLOCK VIOLATION: Earth switch Q8 is CLOSED!'
        );
        return;
      }
      setBreakerQ0Closed(true);
      addAlarm('INFO', 'Q0-CB', 'Disjoncteur Q0 FERMÉ par télécommande SCADA', 'Circuit Breaker Q0 CLOSED via SCADA command');
    } else {
      // Trying to OPEN breaker
      setBreakerQ0Closed(false);
      addAlarm('WARNING', 'Q0-CB', 'Disjoncteur Q0 OUVERT par opérateur SCADA', 'Circuit Breaker Q0 OPENED by SCADA operator');
    }
  };

  // Handle Disconnector Q1 (Interlocking: Cannot open Q1 while Q0 breaker is closed under load)
  const handleToggleDisconnectorQ1 = () => {
    setInterlockError(null);
    if (breakerQ0Closed) {
      setInterlockError(
        locale === 'fr'
          ? 'INTERVERROUILLAGE INTERDIT : Ouverture d’un sectionneur sous charge impossible ! Ouvrez d’abord le disjoncteur Q0.'
          : 'INTERLOCK INHIBIT: Cannot operate disconnector under load! Open breaker Q0 first.'
      );
      return;
    }
    setDisconnectorQ1Closed((prev) => !prev);
    addAlarm(
      'INFO',
      'Q1-DS',
      `Sectionneur Q1 ${!disconnectorQ1Closed ? 'FERMÉ' : 'OUVERT'} hors charge`,
      `Disconnector Q1 ${!disconnectorQ1Closed ? 'CLOSED' : 'OPENED'} off-load`
    );
  };

  // Handle Earth Switch Q8
  const handleToggleEarthSwitch = () => {
    setInterlockError(null);
    if (breakerQ0Closed || disconnectorQ1Closed) {
      setInterlockError(
        locale === 'fr'
          ? 'DANGER CRITIQUE DE SÉCURITÉ : La ligne/jeu de barres est sous tension ! MALT impossible.'
          : 'CRITICAL SAFETY HAZARD: Circuit is energized! Cannot close earth switch.'
      );
      return;
    }
    setEarthSwitchQ8Closed((prev) => !prev);
    addAlarm(
      'WARNING',
      'Q8-ES',
      `Mise à la Terre Q8 ${!earthSwitchQ8Closed ? 'ENCLENCHÉE' : 'DÉCLENCHÉE'}`,
      `Earthing Switch Q8 ${!earthSwitchQ8Closed ? 'CLOSED' : 'OPENED'}`
    );
  };

  // Handle Tap Changer
  const handleTapChange = (delta: number) => {
    setTapChangerStep((prev) => Math.max(1, Math.min(17, prev + delta)));
  };

  // Fault Injection Test (Simulates real Protection 50/51 or 87T trip)
  const handleInjectFault = () => {
    setIsFaultActive(true);
    setBreakerQ0Closed(false);
    const timeStr = new Date().toISOString().substring(11, 23);
    const newTrip = `SOE [${timeStr}]: RELAY ANSI 50/51 OVERCURRENT TRIP -> Q0 TRIP COIL ENERGIZED (Trip time: 42.6 ms)`;
    setTripHistory((prev) => [newTrip, ...prev.slice(0, 4)]);
    addAlarm(
      'CRITICAL',
      'ANSI-50/51',
      'DÉCLENCHEMENT PROTECTION : Surintensité phase L2 détectée (I_fault = 8.4 kA). Q0 déclenché instantanément.',
      'PROTECTION TRIP: Phase L2 overcurrent detected (I_fault = 8.4 kA). Q0 tripped instantaneously.'
    );
    setTimeout(() => {
      setIsFaultActive(false);
    }, 4000);
  };

  const addAlarm = (
    severity: 'CRITICAL' | 'WARNING' | 'INFO',
    tag: string,
    messageFr: string,
    messageEn: string
  ) => {
    const timeStr = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    const newAlm: AlarmRecord = {
      id: `ALM-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      severity,
      tag,
      messageFr,
      messageEn,
      acknowledged: false,
    };
    setAlarms((prev) => [newAlm, ...prev.slice(0, 7)]);
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#0A0E17] text-slate-100 overflow-hidden shadow-2xl font-mono">
      
      {/* 1. SCADA TOP BAR / OPERATOR TITLE & DOMAIN SELECTOR */}
      <div className="bg-[#050810] border-b border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5" />
                SCADA / IED TELECONTROL
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">CEI 61850-7-4 / CEI 60870-5-104</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-sans">
              {locale === 'fr'
                ? 'Supervision Haute Tension & Téléconduite Opérationnelle'
                : 'High Voltage Supervisory Control & Data Acquisition (HMI)'}
            </h3>
          </div>
        </div>

        {/* Domain Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'substation', labelFr: 'Poste 225/30 kV', labelEn: 'Substation Bay' },
            { id: 'generation', labelFr: 'Centrale Hydro', labelEn: 'Hydro Plant' },
            { id: 'distribution', labelFr: 'Réseau HTA/BT', labelEn: 'MV Feeder' },
            { id: 'bess', labelFr: 'BESS 10 MW', labelEn: 'BESS Storage' },
            { id: 'industry', labelFr: 'MCC Industriel', labelEn: 'Industry MCC' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveMode(item.id as ScadaDomainMode);
                setInterlockError(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeMode === item.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {locale === 'fr' ? item.labelFr : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LIVE TELEMETRY STRIP */}
      <div className="bg-[#080D1A] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
          {activeMode === 'substation' && (
            <>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">U_HTA (225 kV)</span>
                <span className="font-bold text-amber-400">{liveTelemetry.voltage} kV</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">I_PRI (Courant)</span>
                <span className="font-bold text-cyan-400">{liveTelemetry.current} A</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">P_ACTIF</span>
                <span className="font-bold text-emerald-400">{liveTelemetry.powerMw} MW</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Q_RÉACTIF</span>
                <span className="font-bold text-indigo-300">{liveTelemetry.powerMvar} Mvar</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">FRÉQUENCE</span>
                <span className="font-bold text-white">{liveTelemetry.frequency} Hz</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">HUILE TR</span>
                <span className="font-bold text-amber-300">{liveTelemetry.oilTemp} °C</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">RÉGLEUR OLTC</span>
                <span className="font-bold text-sky-400">{liveTelemetry.tapPosition}</span>
              </div>
            </>
          )}

          {activeMode === 'generation' && (
            <>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">PUISSANCE MW</span>
                <span className="font-bold text-emerald-400">{liveTelemetry.mw} MW</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">RÉACTIF MVAR</span>
                <span className="font-bold text-cyan-400">{liveTelemetry.mvar} Mvar</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">VITESSE ROTOR</span>
                <span className="font-bold text-amber-400">{liveTelemetry.speed} RPM</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">DIRECTRICES</span>
                <span className="font-bold text-sky-300">{liveTelemetry.wicketGate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">TEMP STATOR</span>
                <span className="font-bold text-orange-400">{liveTelemetry.statorTemp} °C</span>
              </div>
            </>
          )}

          {activeMode === 'distribution' && (
            <>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">TENSION HTA</span>
                <span className="font-bold text-amber-400">{liveTelemetry.voltageMv} kV</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">COURANT DÉPART</span>
                <span className="font-bold text-cyan-400">{liveTelemetry.currentA} A</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">TENSION BT (400V)</span>
                <span className="font-bold text-emerald-400">{liveTelemetry.voltageLv} V</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">CHARGE TRANSDO</span>
                <span className="font-bold text-white">{liveTelemetry.loadKva} kVA</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">ÉTAT DÉTECTEUR DDI</span>
                <span className={`font-bold ${isFaultActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                  {liveTelemetry.fpiStatus}
                </span>
              </div>
            </>
          )}

          {activeMode === 'bess' && (
            <>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">STATE OF CHARGE (SOC)</span>
                <span className="font-bold text-emerald-400">{liveTelemetry.soc} %</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">STATE OF HEALTH (SOH)</span>
                <span className="font-bold text-cyan-400">{liveTelemetry.soh} %</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">FLUX PUISSANCE</span>
                <span className="font-bold text-amber-400">{liveTelemetry.batteryP}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">TEMP RACKS BATTERIES</span>
                <span className="font-bold text-white">{liveTelemetry.rackTemp} °C</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">MODE PCS</span>
                <span className="font-bold text-sky-400">{liveTelemetry.pcsStatus}</span>
              </div>
            </>
          )}

          {activeMode === 'industry' && (
            <>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">CHARGE MOTEUR</span>
                <span className="font-bold text-emerald-400">{liveTelemetry.motorKw} kW</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">VITESSE VARIATEUR</span>
                <span className="font-bold text-cyan-400">{liveTelemetry.speedRpm} RPM</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">DÉBIT POMPE</span>
                <span className="font-bold text-amber-400">{liveTelemetry.flowRate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">PRESSION PROCÉDÉ</span>
                <span className="font-bold text-sky-400">{liveTelemetry.pressure}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">THD COURANT</span>
                <span className="font-bold text-indigo-300">{liveTelemetry.thdCurrent}</span>
              </div>
            </>
          )}
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center gap-1 shrink-0 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveViewTab('mimic')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeViewTab === 'mimic' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? 'Synoptique (Mimic)' : 'Mimic Bus'}
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('alarms')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeViewTab === 'alarms' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            {locale === 'fr' ? 'Journal Alarmes' : 'Alarms'}
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('iec61850')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeViewTab === 'iec61850' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CEI 61850 GOOSE
          </button>
        </div>
      </div>

      {/* Safety Interlock Warning Banner */}
      {interlockError && (
        <div className="bg-rose-950/80 border-b border-rose-500/50 px-4 py-2 flex items-center gap-3 text-rose-200 text-xs animate-shake">
          <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
          <span className="font-bold">{interlockError}</span>
          <button
            type="button"
            onClick={() => setInterlockError(null)}
            className="ml-auto text-[10px] underline text-rose-400 hover:text-white"
          >
            {locale === 'fr' ? 'Acquitter' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* 3. MAIN WORK AREA: MIMIC / ALARMS / PROTOCOLS */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#0A0E17] via-[#0D1322] to-[#080D1A]">
        
        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE MIMIC SCHEMATIC */}
        {/* ========================================================================= */}
        {activeViewTab === 'mimic' && (
          <div className="space-y-6">
            
            {/* Interactive Vector Mimic Canvas */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 relative overflow-hidden shadow-inner">
              
              {/* Active Substation Scheme */}
              {activeMode === 'substation' && (
                <svg viewBox="0 0 800 320" className="w-full h-auto text-slate-200">
                  <defs>
                    <linearGradient id="busGradient225" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="busGradient30" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>

                  {/* 225 kV Main Busbar (BB1) */}
                  <line x1="60" y1="50" x2="740" y2="50" stroke="url(#busGradient225)" strokeWidth="6" />
                  <text x="70" y="40" fill="#fca5a5" fontSize="12" fontWeight="bold">JEU DE BARRES 225 kV (BB1) — THT</text>

                  {/* Disconnector Q1 Symbol */}
                  <g transform="translate(240, 50)" className="cursor-pointer" onClick={handleToggleDisconnectorQ1}>
                    <line x1="0" y1="0" x2="0" y2="25" stroke={disconnectorQ1Closed ? '#10b981' : '#64748b'} strokeWidth="3" />
                    <line
                      x1="0"
                      y1="25"
                      x2={disconnectorQ1Closed ? '0' : '15'}
                      y2={disconnectorQ1Closed ? '55' : '40'}
                      stroke={disconnectorQ1Closed ? '#10b981' : '#f43f5e'}
                      strokeWidth="3.5"
                    />
                    <circle cx="0" cy="25" r="3" fill="#cbd5e1" />
                    <circle cx="0" cy="55" r="3" fill="#cbd5e1" />
                    <text x="25" y="45" fill="#94a3b8" fontSize="11" fontWeight="bold">Q1 (Sectionneur)</text>
                    <rect x="-10" y="15" width="120" height="45" fill="transparent" />
                  </g>

                  {/* Circuit Breaker Q0 (SF6) */}
                  <g transform="translate(240, 110)" className="cursor-pointer" onClick={handleToggleBreaker}>
                    <rect
                      x="-18"
                      y="10"
                      width="36"
                      height="36"
                      fill={breakerQ0Closed ? '#065f46' : '#881337'}
                      stroke={breakerQ0Closed ? '#34d399' : '#f43f5e'}
                      strokeWidth="2.5"
                      rx="4"
                    />
                    {breakerQ0Closed ? (
                      <path d="M -10 28 L 10 28" stroke="#ffffff" strokeWidth="4" />
                    ) : (
                      <path d="M -10 36 L 10 20" stroke="#f43f5e" strokeWidth="4" />
                    )}
                    <text x="30" y="32" fill="#ffffff" fontSize="12" fontWeight="bold">
                      Q0 — Disjoncteur SF6 (52)
                    </text>
                    <text x="30" y="45" fill={breakerQ0Closed ? '#34d399' : '#f43f5e'} fontSize="10">
                      {breakerQ0Closed ? 'FERMÉ (En service)' : 'OUVERT (Déclenché)'}
                    </text>
                  </g>

                  {/* Current Transformer CT / TC (IEC 61869-2) */}
                  <g transform="translate(240, 165)">
                    <circle cx="0" cy="15" r="9" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="0" cy="22" r="9" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="25" y="24" fill="#38bdf8" fontSize="10">TC 600/1 A (Cl. 0.2S / 5P20)</text>
                  </g>

                  {/* Power Transformer 40 MVA (Dyn11 225/30 kV) */}
                  <g transform="translate(240, 215)">
                    <circle cx="0" cy="15" r="18" fill="none" stroke="#fbbf24" strokeWidth="3" />
                    <circle cx="0" cy="35" r="18" fill="none" stroke="#fbbf24" strokeWidth="3" />
                    <text x="35" y="22" fill="#fbbf24" fontSize="11" fontWeight="bold">T1 — 40 MVA (ONAN/ONAF)</text>
                    <text x="35" y="36" fill="#94a3b8" fontSize="10">Dyn11 · Ucc = 12.5% · OLTC Pos {tapChangerStep}</text>
                  </g>

                  {/* 30 kV MV Busbar */}
                  <line x1="60" y1="285" x2="740" y2="285" stroke="url(#busGradient30)" strokeWidth="5" />
                  <text x="70" y="305" fill="#fde047" fontSize="12" fontWeight="bold">JEU DE BARRES 30 kV (MT) — HTA</text>

                  {/* Earth Switch Q8 (MALT) */}
                  <g transform="translate(480, 75)" className="cursor-pointer" onClick={handleToggleEarthSwitch}>
                    <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="-12" y1="20" x2="12" y2="20" stroke={earthSwitchQ8Closed ? '#eab308' : '#64748b'} strokeWidth="3" />
                    <line x1="-8" y1="25" x2="8" y2="25" stroke={earthSwitchQ8Closed ? '#eab308' : '#64748b'} strokeWidth="2.5" />
                    <line x1="-4" y1="30" x2="4" y2="30" stroke={earthSwitchQ8Closed ? '#eab308' : '#64748b'} strokeWidth="2" />
                    <text x="25" y="24" fill={earthSwitchQ8Closed ? '#eab308' : '#64748b'} fontSize="11" fontWeight="bold">
                      Q8 (MALT) {earthSwitchQ8Closed ? '[FERMÉ]' : '[OUVERT]'}
                    </text>
                  </g>

                  {/* Protective Relay ANSI 87T & 50/51 Badge */}
                  <g transform="translate(560, 160)">
                    <rect x="0" y="0" width="160" height="60" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="6" />
                    <text x="12" y="20" fill="#c7d2fe" fontSize="11" fontWeight="bold">RELAIS NUMÉRIQUE</text>
                    <text x="12" y="36" fill="#a5b4fc" fontSize="10">SEL-487E / MiCOM P643</text>
                    <text x="12" y="50" fill="#38bdf8" fontSize="10">ANSI 87T / 50/51 / 49</text>
                  </g>
                </svg>
              )}

              {/* Active Hydro Generation Scheme */}
              {activeMode === 'generation' && (
                <svg viewBox="0 0 800 300" className="w-full h-auto text-slate-200">
                  {/* Penstock & Water Inlet */}
                  <path d="M 40 100 L 180 100 L 220 180 L 40 180 Z" fill="#0369a1" opacity="0.3" stroke="#0ea5e9" strokeWidth="2" />
                  <text x="50" y="140" fill="#38bdf8" fontSize="12" fontWeight="bold">Conduite d'eau forcée (Débit Q = 68 m³/s)</text>

                  {/* Francis Turbine Wheel */}
                  <circle cx="280" cy="140" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="280" cy="140" r="18" fill="#0284c7" />
                  <text x="255" y="145" fill="#ffffff" fontSize="11" fontWeight="bold">Francis</text>
                  <text x="240" y="205" fill="#94a3b8" fontSize="10">H_chute = 42 m</text>

                  {/* Shaft Coupling to Alternator */}
                  <line x1="325" y1="140" x2="410" y2="140" stroke="#cbd5e1" strokeWidth="8" />

                  {/* Synchronous Generator */}
                  <rect x="410" y="90" width="100" height="100" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" rx="8" />
                  <text x="425" y="125" fill="#c7d2fe" fontSize="12" fontWeight="bold">ALTERNATEUR</text>
                  <text x="430" y="145" fill="#a5b4fc" fontSize="10">60 MVA · 15 kV</text>
                  <text x="430" y="165" fill="#38bdf8" fontSize="10">cosφ = 0.90</text>

                  {/* Generator Circuit Breaker (GCB) */}
                  <g transform="translate(540, 120)" className="cursor-pointer" onClick={handleToggleBreaker}>
                    <rect
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      fill={breakerQ0Closed ? '#065f46' : '#881337'}
                      stroke={breakerQ0Closed ? '#34d399' : '#f43f5e'}
                      strokeWidth="2"
                      rx="4"
                    />
                    <text x="50" y="18" fill="#ffffff" fontSize="11" fontWeight="bold">GCB (Disjoncteur G1)</text>
                    <text x="50" y="32" fill={breakerQ0Closed ? '#34d399' : '#f43f5e'} fontSize="10">
                      {breakerQ0Closed ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                    </text>
                  </g>

                  {/* GSU Step-Up Transformer (15/225 kV) */}
                  <g transform="translate(680, 140)">
                    <circle cx="0" cy="-10" r="22" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <circle cx="0" cy="15" r="22" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <text x="-40" y="55" fill="#fda4af" fontSize="11" fontWeight="bold">GSU 15/225 kV</text>
                  </g>
                </svg>
              )}

              {/* Active Distribution Feeder Scheme */}
              {activeMode === 'distribution' && (
                <svg viewBox="0 0 800 280" className="w-full h-auto text-slate-200">
                  {/* Substation 30 kV Bus */}
                  <line x1="50" y1="40" x2="750" y2="40" stroke="#f59e0b" strokeWidth="5" />
                  <text x="60" y="30" fill="#fcd34d" fontSize="11" fontWeight="bold">POSTE SOURCE — JEU DE BARRES 30 kV</text>

                  {/* Feeder Circuit Breaker */}
                  <g transform="translate(160, 40)" className="cursor-pointer" onClick={handleToggleBreaker}>
                    <line x1="0" y1="0" x2="0" y2="30" stroke="#94a3b8" strokeWidth="3" />
                    <rect
                      x="-16"
                      y="30"
                      width="32"
                      height="32"
                      fill={breakerQ0Closed ? '#065f46' : '#881337'}
                      stroke={breakerQ0Closed ? '#34d399' : '#f43f5e'}
                      strokeWidth="2"
                      rx="4"
                    />
                    <text x="25" y="50" fill="#ffffff" fontSize="11" fontWeight="bold">DÉPART HTA 01</text>
                  </g>

                  {/* Overhead Line Feeder */}
                  <line x1="160" y1="94" x2="400" y2="94" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6,4" />
                  <text x="210" y="85" fill="#94a3b8" fontSize="10">Ligne Aérienne Almélec 148 mm² (18 km)</text>

                  {/* Pole-mounted Recloser / RMU */}
                  <g transform="translate(400, 78)">
                    <rect x="0" y="0" width="36" height="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="4" />
                    <text x="-10" y="-8" fill="#38bdf8" fontSize="10" fontWeight="bold">Recloser (Enclencheur)</text>
                  </g>

                  {/* Distribution Substation (Poste HTA/BT) */}
                  <g transform="translate(560, 94)">
                    <line x1="-120" y1="0" x2="0" y2="0" stroke="#38bdf8" strokeWidth="3" />
                    <circle cx="20" cy="0" r="18" fill="none" stroke="#eab308" strokeWidth="3" />
                    <circle cx="45" cy="0" r="18" fill="none" stroke="#eab308" strokeWidth="3" />
                    <text x="10" y="35" fill="#fde047" fontSize="11" fontWeight="bold">Poste HTA/BT 630 kVA</text>
                    <text x="10" y="48" fill="#94a3b8" fontSize="10">30 kV / 400 V Dyn11</text>
                  </g>

                  {/* LV Customers */}
                  <line x1="625" y1="94" x2="720" y2="94" stroke="#10b981" strokeWidth="4" />
                  <rect x="720" y="74" width="40" height="40" fill="#065f46" stroke="#34d399" strokeWidth="2" rx="4" />
                  <text x="690" y="130" fill="#6ee7b7" fontSize="11" fontWeight="bold">Réseau BT (400 V)</text>
                </svg>
              )}

              {/* Active BESS Scheme */}
              {activeMode === 'bess' && (
                <svg viewBox="0 0 800 280" className="w-full h-auto text-slate-200">
                  {/* Grid 30 kV Connection */}
                  <line x1="50" y1="50" x2="750" y2="50" stroke="#f59e0b" strokeWidth="4" />
                  <text x="60" y="38" fill="#fbbf24" fontSize="11" fontWeight="bold">RÉSEAU DE RACCORDEMENT HTA 30 kV</text>

                  {/* Coupling Transformer */}
                  <g transform="translate(200, 50)">
                    <line x1="0" y1="0" x2="0" y2="30" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="0" cy="45" r="16" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="0" cy="65" r="16" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="25" y="55" fill="#7dd3fc" fontSize="10">Transfo Élévateur 0.69/30 kV</text>
                  </g>

                  {/* PCS 4-Quadrant Inverter */}
                  <g transform="translate(200, 160)" className="cursor-pointer" onClick={handleToggleBreaker}>
                    <rect
                      x="-50"
                      y="-20"
                      width="100"
                      height="50"
                      fill="#1e1b4b"
                      stroke={breakerQ0Closed ? '#34d399' : '#f43f5e'}
                      strokeWidth="2"
                      rx="6"
                    />
                    <path d="M -30 10 L 30 -10" stroke="#818cf8" strokeWidth="2" />
                    <text x="-40" y="-5" fill="#ffffff" fontSize="11" fontWeight="bold">PCS INVERTER</text>
                    <text x="-35" y="20" fill="#a5b4fc" fontSize="10">4-Quadrant 10 MW</text>
                  </g>

                  {/* DC Bus & Battery Containers */}
                  <line x1="200" y1="190" x2="200" y2="240" stroke="#a855f7" strokeWidth="4" />
                  <line x1="100" y1="240" x2="700" y2="240" stroke="#a855f7" strokeWidth="4" />
                  <text x="110" y="232" fill="#d8b4fe" fontSize="10" fontWeight="bold">BUS DC 864 V</text>

                  {/* 4 Battery Racks */}
                  {[200, 350, 500, 650].map((x, i) => (
                    <g key={i} transform={`translate(${x}, 240)`}>
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#a855f7" strokeWidth="2" />
                      <rect x="-30" y="20" width="60" height="30" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="4" />
                      <text x="-25" y="38" fill="#6ee7b7" fontSize="9" fontWeight="bold">RACK LFP {i + 1}</text>
                    </g>
                  ))}
                </svg>
              )}

              {/* Active Industry MCC Scheme */}
              {activeMode === 'industry' && (
                <svg viewBox="0 0 800 280" className="w-full h-auto text-slate-200">
                  {/* Main LV Bus 400V */}
                  <line x1="50" y1="40" x2="750" y2="40" stroke="#10b981" strokeWidth="5" />
                  <text x="60" y="30" fill="#6ee7b7" fontSize="11" fontWeight="bold">TGBT PRINCIPAL — JEU DE BARRES 400 V / 3200 A</text>

                  {/* MCC Motor Feeder 1 with VFD */}
                  <g transform="translate(180, 40)" className="cursor-pointer" onClick={handleToggleBreaker}>
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="2" />
                    <rect
                      x="-20"
                      y="25"
                      width="40"
                      height="30"
                      fill={breakerQ0Closed ? '#065f46' : '#881337'}
                      stroke={breakerQ0Closed ? '#34d399' : '#f43f5e'}
                      strokeWidth="2"
                      rx="4"
                    />
                    <text x="25" y="44" fill="#ffffff" fontSize="11" fontWeight="bold">DISJONCTEUR MOTEUR (NSX)</text>
                  </g>

                  {/* Variable Frequency Drive (VFD) */}
                  <g transform="translate(180, 110)">
                    <line x1="0" y1="-15" x2="0" y2="0" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="-35" y="0" width="70" height="40" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="4" />
                    <text x="-28" y="24" fill="#c7d2fe" fontSize="10" fontWeight="bold">VARIATEUR VFD</text>
                  </g>

                  {/* Electric Induction Motor 250 kW */}
                  <g transform="translate(180, 190)">
                    <line x1="0" y1="-40" x2="0" y2="0" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="0" cy="20" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="-8" y="25" fill="#38bdf8" fontSize="13" fontWeight="bold">M</text>
                    <text x="30" y="25" fill="#ffffff" fontSize="11" fontWeight="bold">M1 — 250 kW (400 V)</text>
                    <text x="30" y="38" fill="#94a3b8" fontSize="10">Pompe Alimentation Chaudière</text>
                  </g>
                </svg>
              )}
            </div>

            {/* Operator Control Panel & Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Toggle Breaker Button */}
              <button
                type="button"
                onClick={handleToggleBreaker}
                className={`p-3.5 rounded-xl border font-bold flex items-center justify-between transition-all ${
                  breakerQ0Closed
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 hover:bg-rose-900/60'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Power className={`h-4 w-4 ${breakerQ0Closed ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span className="text-xs">
                    {breakerQ0Closed
                      ? (locale === 'fr' ? 'OUVRIR DISJONCTEUR' : 'OPEN CIRCUIT BREAKER')
                      : (locale === 'fr' ? 'FERMER DISJONCTEUR' : 'CLOSE CIRCUIT BREAKER')}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${breakerQ0Closed ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'}`}>
                  {breakerQ0Closed ? 'FERMÉ' : 'OUVERT'}
                </span>
              </button>

              {/* Disconnector Q1 Button */}
              <button
                type="button"
                onClick={handleToggleDisconnectorQ1}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-200 font-bold flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'SECTIONNEUR Q1' : 'DISCONNECTOR Q1'}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${disconnectorQ1Closed ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                  {disconnectorQ1Closed ? 'FERMÉ' : 'OUVERT'}
                </span>
              </button>

              {/* Tap Changer Control (OLTC) */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold pl-1">RÉGLEUR T1</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTapChange(-1)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-white"
                    title="Diminuer prise"
                  >
                    - Tap
                  </button>
                  <span className="font-bold text-amber-400 text-xs px-1">P{tapChangerStep}</span>
                  <button
                    type="button"
                    onClick={() => handleTapChange(1)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-white"
                    title="Augmenter prise"
                  >
                    + Tap
                  </button>
                </div>
              </div>

              {/* Fault Injection Test Button */}
              <button
                type="button"
                onClick={handleInjectFault}
                className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-lg"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>{locale === 'fr' ? 'SIMULER DÉFAUT (TRIP 50/51)' : 'SIMULATE FAULT (TRIP 50/51)'}</span>
              </button>
            </div>

            {/* SOE Log Strip */}
            {tripHistory.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-bold block">
                  JOURNAL DE CHRONOLOGIE D’ÉVÉNEMENTS (SOE 1 ms) :
                </span>
                {tripHistory.map((trip, idx) => (
                  <div key={idx} className="text-rose-400 font-mono">
                    {trip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALARMS LIST & EVENT ARCHIVE */}
        {/* ========================================================================= */}
        {activeViewTab === 'alarms' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-bold uppercase">
                {locale === 'fr' ? 'JOURNAL DES ALARMES EN TEMPS RÉEL' : 'REAL-TIME ALARMS BANNER'}
              </span>
              <button
                type="button"
                onClick={() => setAlarms((prev) => prev.map((a) => ({ ...a, acknowledged: true })))}
                className="text-cyan-400 hover:underline"
              >
                {locale === 'fr' ? 'Tout acquitter' : 'Acknowledge All'}
              </button>
            </div>

            <div className="space-y-2">
              {alarms.map((alm) => (
                <div
                  key={alm.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                    alm.severity === 'CRITICAL'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : alm.severity === 'WARNING'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alm.severity === 'CRITICAL'
                          ? 'bg-rose-500 text-slate-950'
                          : alm.severity === 'WARNING'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {alm.severity}
                    </span>
                    <span className="text-slate-400 text-[11px]">{alm.timestamp}</span>
                    <span className="font-bold text-white uppercase">{alm.tag}</span>
                    <span className="text-slate-200">{locale === 'fr' ? alm.messageFr : alm.messageEn}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {alm.acknowledged ? 'ACQUITTÉE' : 'NON-ACQUITTÉE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: IEC 61850 SUBSTATION NETWORK ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeViewTab === 'iec61850' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-indigo-200 text-xs leading-relaxed">
              <div className="font-bold text-indigo-300 uppercase mb-1 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                ARCHITECTURE DE COMMUNICATION NUMÉRIQUE CEI 61850 DU POSTE
              </div>
              <div>
                {locale === 'fr'
                  ? 'Échange horizontal direct entre IED de protection par trames Ethernet non routables GOOSE (temps de transmission garanti < 4 ms). Trames Sampled Values (SV) selon CEI 61869-9 pour numérisation optique des TC/TT.'
                  : 'Direct horizontal peer-to-peer communication between protective IEDs using Layer 2 non-routable GOOSE frames (transfer time < 4 ms). Sampled Values (SV) per IEC 61869-9 for optical CT/VT merging units.'}
              </div>
            </div>

            {/* Protocol Stack Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-indigo-400 font-bold">
                  <span>GOOSE (CEI 61850-8-1)</span>
                  <span className="text-[10px] text-emerald-400">&lt; 3 ms</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Inter-verrouillage rapide, déclenchement sélectif, délestage automatique et refus de disjoncteur (50BF).
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Priorité IEEE 802.1Q VLAN Tagging · EtherType 0x88B8
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>MMS (Client-Serveur)</span>
                  <span className="text-[10px] text-slate-400">&lt; 100 ms</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Téléconduite vers superviseur SCADA, transfert d'événements horodatés (SOE) et téléparamétrage des relais.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  TCP/IP Port 102 · ISO-COTP · Rapport non bufférisé / bufférisé
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>IEEE 1588 PTP (v2)</span>
                  <span className="text-[10px] text-amber-300">&lt; 1 µs</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Synchronisation temporelle absolue par Grandmaster Clock GPS pour horodatage microseconde des grandeurs vectorielles.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Profil Power C37.238 · Transparent Clocks
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <div className="bg-[#050810] border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            RTU / IED ONLINE
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">Port TCP/104 Connecté</span>
        </div>
        <div className="font-mono text-slate-400">
          ScadaCycle: 1000 ms · TimeSync: GPS locked (±0.2 µs)
        </div>
      </div>
    </div>
  );
};
