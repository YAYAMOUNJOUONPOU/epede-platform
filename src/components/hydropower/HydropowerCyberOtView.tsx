// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 11 : CYBERSÉCURITÉ OT & RÉSEAU CEI 61850
// IEC 62443 Security Zones, IEC 61850 Process Bus, Cyber-Physical Defense & BESS
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Network,
  Lock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Activity,
  Layers,
  Sun,
  BatteryCharging,
  Cpu,
  Server,
  Play,
  Terminal,
} from 'lucide-react';
import {
  IEC_62443_SECURITY_ZONES,
  IEC_61850_NETWORK_STREAMS,
  CYBER_PHYSICAL_ATTACK_SCENARIOS,
  calculateHybridBessBenefits,
} from '../../data/hydropowerCyberOtData';
import type {
  SimulatedCyberAttackType,
  Iec62443Zone,
} from '../../types/hydropowerCyberOt';

interface HydropowerCyberOtViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerCyberOtView: React.FC<HydropowerCyberOtViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'network' | 'iec62443' | 'attacks' | 'hybrid'>('network');

  // Sub-Tab 1: Network & PRP Ring Simulation
  const [isFiberCutSimulated, setIsFiberCutSimulated] = useState<boolean>(false);

  // Sub-Tab 2: IEC 62443 Zone Selector
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZONE-02');

  // Sub-Tab 3: Attack Scenario Simulator State
  const [selectedAttackId, setSelectedAttackId] = useState<SimulatedCyberAttackType>('goose_replay_spoofing');
  const [isAttackRunning, setIsAttackRunning] = useState<boolean>(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);

  // Sub-Tab 4: Hybrid BESS / Floating Solar State
  const [bessPowerMW, setBessPowerMW] = useState<number>(50);
  const [floatingSolarMWp, setFloatingSolarMWp] = useState<number>(40);

  const activeZone = IEC_62443_SECURITY_ZONES.find((z) => z.id === selectedZoneId) || IEC_62443_SECURITY_ZONES[0];
  const activeAttack = CYBER_PHYSICAL_ATTACK_SCENARIOS[selectedAttackId];

  const hybridResult = useMemo(() => {
    return calculateHybridBessBenefits(bessPowerMW, floatingSolarMWp);
  }, [bessPowerMW, floatingSolarMWp]);

  const handleLaunchAttack = () => {
    setIsAttackRunning(true);
    setAttackLog([
      `[T+0.0ms] ${locale === 'fr' ? 'DÉBUT ATTAQUE' : 'ATTACK TRIGGERED'} : ${activeAttack.title[locale]}`,
      `[T+0.2ms] MITRE ATT&CK ICS: ${activeAttack.mitreAttckId}`,
      `[T+0.8ms] ${locale === 'fr' ? 'Inspection en coupure par pare-feu industriel CEI 62443' : 'IEC 62443 industrial deep packet inspection active'}`,
      `[T+${activeAttack.detectionTimeMs}ms] ${locale === 'fr' ? 'ANOMALIE DÉTECTÉE' : 'ANOMALY DETECTED'} : Signature non-conforme`,
      `[T+${(activeAttack.detectionTimeMs + 0.5).toFixed(1)}ms] ${locale === 'fr' ? 'RIPORTE AUTOMATISÉE' : 'AUTOMATED DEFENSE'} : ${activeAttack.mitigationAction[locale]}`,
      `[T+${(activeAttack.detectionTimeMs + 1.2).toFixed(1)}ms] ${locale === 'fr' ? 'STATUT POST-INCIDENT' : 'POST-INCIDENT STATUS'} : ${activeAttack.postIncidentIntegrity[locale]}`,
    ]);
    setTimeout(() => {
      setIsAttackRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0B1424] via-[#0E1B30] to-[#0A1220] border border-blue-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 11 • CYBERSÉCURITÉ INDUSTRIELLE & RÉSEAUX OT' : 'STEP 11 • INDUSTRIAL CYBERSECURITY & OT NETWORKS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">CEI 62443 / CEI 61850 / NIST CSF</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-blue-400" />
              <span>
                {locale === 'fr'
                  ? 'Cybersécurité Industrielle (CEI 62443), Process Bus & Résilience'
                  : 'Industrial OT Cybersecurity (IEC 62443), Process Bus & Hybrid Resilience'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Architecture réseau optique déterministe CEI 61850 (Sampled Values, GOOSE, double anneau PRP), segmentation Purdue Modèle CEI 62443, laboratoire d\'attaques cyber-physiques et stockage BESS de soutien rapide.'
                : 'Deterministic IEC 61850 optical networks (SV, GOOSE, zero-loss PRP ring), IEC 62443 Purdue zones & conduits, cyber-physical intrusion defense lab, and hybrid BESS fast-frequency response.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC-62443')}
                className="px-3 py-2 rounded-xl bg-[#142338] hover:bg-[#1C3250] border border-blue-500/40 text-xs font-mono font-bold text-blue-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>CEI 62443-3-3</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C2634]">
          <button
            type="button"
            onClick={() => setActiveSubTab('network')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'network'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#142338] text-neutral-300 hover:text-white border border-[#233852]'
            }`}
          >
            <Network className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Process Bus & Double Anneau PRP (CEI 61850)' : '1. IEC 61850 Process Bus & PRP'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('iec62443')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'iec62443'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#142338] text-neutral-300 hover:text-white border border-[#233852]'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Zones & Conduits Purdue (CEI 62443)' : '2. Purdue Model Zones & Conduits'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('attacks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'attacks'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#142338] text-neutral-300 hover:text-white border border-[#233852]'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Défense Cyber-Physique (MITRE ICS)' : '3. Cyber-Physical Defense Lab'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hybrid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'hybrid'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#142338] text-neutral-300 hover:text-white border border-[#233852]'
            }`}
          >
            <BatteryCharging className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Résilience Hybride BESS & FPV' : '4. Hybrid BESS & Floating Solar'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: IEC 61850 PROCESS BUS & PRP/HSR ZERO-FAILOVER             */}
      {/* ==================================================================== */}
      {activeSubTab === 'network' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PRP Redundancy Simulator Diagram (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Network className="h-4 w-4 text-blue-400" />
                    <span>{locale === 'fr' ? 'Architecture Déterministe Double Anneau PRP / HSR' : 'Deterministic Dual PRP / HSR Optical Ring'}</span>
                  </h3>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    CEI 62439-3 : Zéro temps de basculement (Bumpless 0 ms) pour GOOSE et SV
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFiberCutSimulated(!isFiberCutSimulated)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isFiberCutSimulated
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-[#142338] text-neutral-300 border border-[#233852]'
                  }`}
                >
                  {isFiberCutSimulated
                    ? (locale === 'fr' ? 'Rétablir Fibre Anneau A' : 'Restore Fiber Ring A')
                    : (locale === 'fr' ? 'Couper Fibre Anneau A' : 'Simulate Cut on Ring A')}
                </button>
              </div>

              {/* Vectorial Topology Visualization */}
              <div className="w-full bg-[#070B0F] border border-[#252E38] rounded-xl p-4 relative select-none">
                <svg viewBox="0 0 460 220" className="w-full h-auto" style={{ minHeight: '190px' }}>
                  {/* Station Bus Top */}
                  <rect x="40" y="20" width="380" height="28" rx="6" fill="#0E1B30" stroke="#3B82F6" strokeWidth="1.5" />
                  <text x="230" y="38" textAnchor="middle" fill="#93C5FD" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Station Bus CEI 61850 (MMS / SCADA HMI / Gateway 104)
                  </text>

                  {/* Dual Rings PRP A & B */}
                  {/* Ring A */}
                  <path
                    d="M 90 48 L 90 140 L 370 140 L 370 48"
                    fill="none"
                    stroke={isFiberCutSimulated ? '#EF4444' : '#10B981'}
                    strokeWidth="2"
                    strokeDasharray={isFiberCutSimulated ? '5,5' : 'none'}
                  />
                  <text x="140" y="132" fill={isFiberCutSimulated ? '#EF4444' : '#10B981'} fontSize="9" fontFamily="monospace">
                    Anneau A (LAN A) {isFiberCutSimulated ? '— FIBRE ROMPUE' : '— NOMINAL'}
                  </text>

                  {/* Ring B */}
                  <path
                    d="M 120 48 L 120 165 L 340 165 L 340 48"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <text x="170" y="158" fill="#10B981" fontSize="9" fontFamily="monospace">
                    Anneau B (LAN B) — ACTIF 100%
                  </text>

                  {/* Bay Level Devices (IEDs) */}
                  <rect x="70" y="80" width="80" height="35" rx="5" fill="#141E2C" stroke="#2563EB" strokeWidth="1" />
                  <text x="110" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Relais 87G
                  </text>
                  <text x="110" y="108" textAnchor="middle" fill="#93C5FD" fontSize="7" fontFamily="monospace">
                    RedBox PRP
                  </text>

                  <rect x="190" y="80" width="80" height="35" rx="5" fill="#141E2C" stroke="#2563EB" strokeWidth="1" />
                  <text x="230" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    BCU Travée
                  </text>
                  <text x="230" y="108" textAnchor="middle" fill="#93C5FD" fontSize="7" fontFamily="monospace">
                    RedBox PRP
                  </text>

                  <rect x="310" y="80" width="80" height="35" rx="5" fill="#141E2C" stroke="#2563EB" strokeWidth="1" />
                  <text x="350" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Merging Unit
                  </text>
                  <text x="350" y="108" textAnchor="middle" fill="#93C5FD" fontSize="7" fontFamily="monospace">
                    Sampled Values
                  </text>

                  {/* Clock IEEE 1588 */}
                  <circle cx="230" cy="195" r="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="230" y="199" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    PTP
                  </text>
                </svg>
              </div>

              {/* Status Note */}
              <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20 text-neutral-300 text-[11px] leading-relaxed">
                <div className="text-blue-400 font-bold uppercase text-[10px] mb-1">
                  {locale === 'fr' ? 'Comportement Redondance PRP :' : 'PRP Redundancy Behavior:'}
                </div>
                {isFiberCutSimulated
                  ? (locale === 'fr'
                      ? 'L\'anneau A est coupé. Grâce au protocole PRP (CEI 62439-3), les trames GOOSE et Sampled Values sont reçues instantanément via l\'anneau B sans aucune perte de paquet (0 ms) ni temps de reconvergence.'
                      : 'Ring A fiber disrupted. Parallel Redundancy Protocol (IEC 62439-3) delivers identical duplicate frames over Ring B with zero packet loss (bumpless 0 ms failover), ensuring absolute relay protection continuity.')
                  : (locale === 'fr'
                      ? 'Les deux anneaux optiques A et B acheminent les paquets en parallèle. Le récepteur consomme la première trame arrivée et détruit le doublon sans surcharge processeur.'
                      : 'Dual optical networks LAN A and LAN B transmit duplicate packets concurrently. Relays consume whichever packet arrives first and drop duplicates with zero CPU overhead.')}
              </div>
            </div>

            {/* Right Telemetries List (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Flux Réseau Temps Réel' : 'Live Bus Traffic Streams'}</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                    5 FLUX ACTIFS
                  </span>
                </div>

                <div className="space-y-2.5">
                  {IEC_61850_NETWORK_STREAMS.map((stream) => (
                    <div
                      key={stream.id}
                      className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{stream.protocol}</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px]">
                          {stream.networkBus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
                        <div>
                          Bande passante : <span className="text-cyan-300 font-bold">{stream.bandwidthUsageMbps} Mbps</span>
                        </div>
                        <div>
                          Latence mesurée : <span className="text-emerald-300 font-bold">{stream.measuredLatencyMs} ms</span>
                        </div>
                      </div>

                      <div className="text-[9px] text-neutral-500 truncate">
                        Chiffrement : {stream.encryptionStandard}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: IEC 62443 PURDUE ZONES & SECURITY LEVELS                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'iec62443' && (
        <div className="space-y-6">
          {/* Purdue Zones Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono text-xs">
            {IEC_62443_SECURITY_ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedZoneId === zone.id
                    ? 'border-blue-500 bg-blue-950/30 shadow-md'
                    : 'border-[#252E38] bg-[#0A0E14] hover:bg-[#141A23]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-400 text-[9px] font-bold">PURDUE L{zone.purdueLevel}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                      zone.securityLevelTarget === 'SL-4'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {zone.securityLevelTarget}
                  </span>
                </div>
                <div className="font-bold text-white text-xs truncate">{zone.id}</div>
                <div className="text-[10px] text-neutral-300 mt-1 line-clamp-1">{zone.name[locale]}</div>
              </button>
            ))}
          </div>

          {/* Detailed Zone Card */}
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-[#0A0E14] space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                    Purdue Niveau {activeZone.purdueLevel}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {activeZone.name[locale]}
                  </h3>
                </div>
                <div className="text-neutral-400 text-xs mt-1">
                  Cible de Sécurité : <span className="text-amber-400 font-bold">{activeZone.securityLevelTarget}</span> | Atteint : <span className="text-emerald-400 font-bold">{activeZone.securityLevelAchieved}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-[10px] uppercase">
                {activeZone.complianceStatus === 'compliant' ? 'CONFORME CEI 62443' : 'VIGILANCE AUDIT'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">Équipements & Actifs de Zone :</span>
                <p className="text-neutral-200 leading-relaxed">{activeZone.primaryAssets[locale]}</p>

                <div className="pt-2">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Protocoles Autorisés :</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeZone.inboundProtocols.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#0A0E14] text-cyan-300 text-[10px] border border-[#252E38]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">Protection Périmétrique & Conduits :</span>
                <p className="text-neutral-200 leading-relaxed">{activeZone.perimeterProtection[locale]}</p>

                <div className="pt-2">
                  <span className="text-emerald-400 block text-[9px] uppercase font-bold">Vulnérabilités Neutralisées :</span>
                  <p className="text-neutral-300 text-[10px] leading-relaxed">{activeZone.vulnerabilitiesMitigated[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: CYBER-PHYSICAL ATTACK LAB & MITRE ICS                     */}
      {/* ==================================================================== */}
      {activeSubTab === 'attacks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Left Scenarios Selector (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Menaces Cyber-Physiques (MITRE ICS)' : 'Cyber-Physical Threat Vectors'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300">
                  RED TEAM SIM
                </span>
              </div>

              <div className="space-y-2">
                {(Object.keys(CYBER_PHYSICAL_ATTACK_SCENARIOS) as SimulatedCyberAttackType[]).map((key) => {
                  const item = CYBER_PHYSICAL_ATTACK_SCENARIOS[key];
                  const isSelected = selectedAttackId === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedAttackId(key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-950/20'
                          : 'border-[#252E38] bg-[#141A23] hover:bg-[#1A2330]'
                      }`}
                    >
                      <div className="font-bold text-white text-xs mb-1">{item.title[locale]}</div>
                      <div className="text-[10px] text-red-400 truncate">{item.mitreAttckId}</div>
                    </button>
                  );
                })}
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={handleLaunchAttack}
                disabled={isAttackRunning}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>
                  {isAttackRunning
                    ? (locale === 'fr' ? 'Attaque en cours...' : 'Injecting Attack...')
                    : (locale === 'fr' ? 'Lancer la Simulation d\'Attaque' : 'Execute Attack Simulation')}
                </span>
              </button>
            </div>

            {/* Right Defense Mechanism & Terminal Log (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Journal d\'Interception & Riposte SOC' : 'SOC Interception & Defense Trace'}</span>
                  </h4>
                  <span className="text-[10px] text-cyan-400">
                    Détection : {activeAttack.detectionTimeMs} ms
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070B0F] border border-[#252E38] text-[11px] font-mono space-y-1.5 min-h-[160px]">
                  {attackLog.length > 0 ? (
                    attackLog.map((line, idx) => (
                      <div
                        key={idx}
                        className={`${
                          line.includes('DÉBUT') || line.includes('ATTACK')
                            ? 'text-red-400 font-bold'
                            : line.includes('RIPORTE') || line.includes('DEFENSE')
                            ? 'text-emerald-400 font-bold'
                            : 'text-neutral-300'
                        }`}
                      >
                        {line}
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-500 italic py-10 text-center">
                      {locale === 'fr'
                        ? 'Cliquez sur "Lancer la Simulation d\'Attaque" pour observer la réaction défensive du système CEI 62443.'
                        : 'Click "Execute Attack Simulation" to inspect real-time IEC 62443 automated mitigation.'}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-[11px]">
                  <div className="text-amber-400 font-bold text-[10px] uppercase">
                    {locale === 'fr' ? 'Impact Physique Évité :' : 'Mitigated Physical Damage:'}
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    {activeAttack.physicalImpactWithoutDefense[locale]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: HYBRID RESILIENCE (BESS BATTERIES & FLOATING SOLAR)        */}
      {/* ==================================================================== */}
      {activeSubTab === 'hybrid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Sizing Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <BatteryCharging className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Configuration BESS & Solaire Flottant' : 'BESS & Floating Solar Sizing'}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  FAST FREQUENCY
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Batterie BESS :' : 'Battery Inverter Power:'}</span>
                  <span className="text-emerald-400 font-bold">{bessPowerMW} MW</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={bessPowerMW}
                  onChange={(e) => setBessPowerMW(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="text-[10px] text-neutral-500 mt-0.5">Capacité 2 heures : {hybridResult.batteryCapacityMWh} MWh LiFePO4</div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Solaire Flottant sur Retenue :' : 'Floating Solar PV Capacity:'}</span>
                  <span className="text-amber-400 font-bold">{floatingSolarMWp} MWp</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={floatingSolarMWp}
                  onChange={(e) => setFloatingSolarMWp(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="text-[10px] text-neutral-500 mt-0.5">Occupe {hybridResult.reservoirSurfaceCoveredPercent}% du plan d'eau Nachtigal</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  Évaporation d'Eau Économisée
                </div>
                <div className="text-xl font-bold text-cyan-300">
                  {hybridResult.waterEvaporationSavedM3PerYear.toLocaleString()} m³/an
                </div>
                <div className="text-[10px] text-neutral-400">
                  L'ombrage des flotteurs solaires préserve la ressource hydrique de la Sanaga pour le turbinage.
                </div>
              </div>
            </div>

            {/* Grid Fast Frequency Response (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Soutien Ultra-Rapide de Fréquence (FFR < 150 ms)' : 'Fast Frequency Response (FFR < 150 ms)'}</span>
                  </h4>
                  <span className="text-[10px] text-neutral-400">RÉSEAU RIS SONATREL</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-emerald-500/30">
                    <div className="text-[10px] text-neutral-400 uppercase">Temps d'Injection FFR</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {hybridResult.fastFrequencyResponseTimeMs} ms
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      40x plus rapide que les vérins de directrices hydro
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-cyan-500/30">
                    <div className="text-[10px] text-neutral-400 uppercase">Nadir de Fréquence Rehaussé</div>
                    <div className="text-2xl font-black text-cyan-300 mt-1">
                      {hybridResult.gridFrequencyNadirStabilizationHz} Hz
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Évite le seuil de délestage automatique (48.8 Hz)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300 space-y-1 leading-relaxed">
                  <div className="text-emerald-400 font-bold uppercase text-[10px]">
                    {locale === 'fr' ? 'Synergie Hydro-Solaire-Batterie :' : 'Hydro-Solar-Storage Synergy:'}
                  </div>
                  <p>
                    {locale === 'fr'
                      ? 'Pendant les heures de fort ensoleillement, le solaire flottant injecte 40 MW, permettant de stocker l\'eau dans la retenue de Nachtigal. Le BESS compense instantanément les passages nuageux, offrant au réseau interconnecté camerounais une stabilité d\'alimentation inédite.'
                      : 'During midday peak insolation, floating solar injects 40 MW directly onto the substation bus, conserving hydro water in the reservoir. The BESS buffers cloud transients within 140 ms, providing unmatched grid resilience.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
