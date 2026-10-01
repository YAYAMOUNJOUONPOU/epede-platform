// src/components/home/SchematicLoadDistributionCard.tsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
} from 'lucide-react';

interface SchematicLoadDistributionCardProps {
  locale: 'fr' | 'en';
  onLaunchSld: () => void;
  onLaunchSimLab: () => void;
}

type LoadScenario = 'nominal' | 'peak' | 'contingency';

interface BayTelemetry {
  id: string;
  name_fr: string;
  name_en: string;
  voltage: string;
  p_mw: number;
  q_mvar: number;
  i_amps: number;
  cos_phi: number;
  status: 'online' | 'boost' | 'rerouted';
}

export const SchematicLoadDistributionCard: React.FC<SchematicLoadDistributionCardProps> = ({
  locale,
  onLaunchSld,
  onLaunchSimLab,
}) => {
  const [scenario, setScenario] = useState<LoadScenario>('nominal');
  const [selectedBayId, setSelectedBayId] = useState<string>('gsu_trafo');

  // Scenario-dependent telemetry
  const telemetryData: Record<LoadScenario, {
    totalGeneration: number;
    totalDemand: number;
    losses: number;
    busVoltage225: number;
    busVoltage30: number;
    cosPhiGlobal: number;
    systemFrequency: number;
    bays: Record<string, BayTelemetry>;
  }> = {
    nominal: {
      totalGeneration: 680,
      totalDemand: 662,
      losses: 18,
      busVoltage225: 225.4,
      busVoltage30: 30.1,
      cosPhiGlobal: 0.96,
      systemFrequency: 50.01,
      bays: {
        nachtigal: {
          id: 'nachtigal',
          name_fr: 'Centrale Hydro Nachtigal',
          name_en: 'Nachtigal Hydro Station',
          voltage: '225 kV',
          p_mw: 420,
          q_mvar: 112,
          i_amps: 1115,
          cos_phi: 0.96,
          status: 'online',
        },
        songloulou: {
          id: 'songloulou',
          name_fr: 'Centrale Hydro Songloulou',
          name_en: 'Songloulou Hydro Station',
          voltage: '225 kV',
          p_mw: 260,
          q_mvar: 78,
          i_amps: 705,
          cos_phi: 0.95,
          status: 'online',
        },
        gsu_trafo: {
          id: 'gsu_trafo',
          name_fr: 'Poste Source TR1 225/30 kV',
          name_en: 'Bulk Transformer TR1 225/30 kV',
          voltage: '225 / 30 kV',
          p_mw: 380,
          q_mvar: 98,
          i_amps: 1010,
          cos_phi: 0.96,
          status: 'online',
        },
        feeder_yaounde: {
          id: 'feeder_yaounde',
          name_fr: 'Départ Ligne Yaoundé Nyom II',
          name_en: 'Feeder Yaoundé Nyom II',
          voltage: '225 kV',
          p_mw: 210,
          q_mvar: 55,
          i_amps: 556,
          cos_phi: 0.96,
          status: 'online',
        },
        feeder_douala: {
          id: 'feeder_douala',
          name_fr: 'Départ Ligne Douala Bekoko',
          name_en: 'Feeder Douala Bekoko',
          voltage: '225 kV',
          p_mw: 280,
          q_mvar: 72,
          i_amps: 742,
          cos_phi: 0.96,
          status: 'online',
        },
        feeder_alucam: {
          id: 'feeder_alucam',
          name_fr: 'Départ Ligne Alucam Edéa',
          name_en: 'Feeder Alucam Edéa',
          voltage: '90 kV',
          p_mw: 190,
          q_mvar: 52,
          i_amps: 1260,
          cos_phi: 0.96,
          status: 'online',
        },
      },
    },
    peak: {
      totalGeneration: 840,
      totalDemand: 816,
      losses: 24,
      busVoltage225: 223.8,
      busVoltage30: 29.8,
      cosPhiGlobal: 0.94,
      systemFrequency: 49.97,
      bays: {
        nachtigal: {
          id: 'nachtigal',
          name_fr: 'Centrale Hydro Nachtigal (Plein Régime)',
          name_en: 'Nachtigal Hydro Station (Full Load)',
          voltage: '225 kV',
          p_mw: 420,
          q_mvar: 135,
          i_amps: 1145,
          cos_phi: 0.95,
          status: 'boost',
        },
        songloulou: {
          id: 'songloulou',
          name_fr: 'Centrale Hydro Songloulou (Pointe)',
          name_en: 'Songloulou Hydro Station (Peak Boost)',
          voltage: '225 kV',
          p_mw: 384,
          q_mvar: 110,
          i_amps: 1040,
          cos_phi: 0.94,
          status: 'boost',
        },
        gsu_trafo: {
          id: 'gsu_trafo',
          name_fr: 'Poste Source TR1 (Surcharge Maîtrisée)',
          name_en: 'Bulk Transformer TR1 (Monitored)',
          voltage: '225 / 30 kV',
          p_mw: 460,
          q_mvar: 128,
          i_amps: 1240,
          cos_phi: 0.94,
          status: 'boost',
        },
        feeder_yaounde: {
          id: 'feeder_yaounde',
          name_fr: 'Départ Yaoundé (Pointe Soirée)',
          name_en: 'Feeder Yaoundé (Evening Peak)',
          voltage: '225 kV',
          p_mw: 270,
          q_mvar: 75,
          i_amps: 720,
          cos_phi: 0.95,
          status: 'boost',
        },
        feeder_douala: {
          id: 'feeder_douala',
          name_fr: 'Départ Douala (Transit Maximal)',
          name_en: 'Feeder Douala (Max Transit)',
          voltage: '225 kV',
          p_mw: 350,
          q_mvar: 94,
          i_amps: 935,
          cos_phi: 0.95,
          status: 'boost',
        },
        feeder_alucam: {
          id: 'feeder_alucam',
          name_fr: 'Départ Alucam (Effacement Partiel)',
          name_en: 'Feeder Alucam (Demand Response)',
          voltage: '90 kV',
          p_mw: 150,
          q_mvar: 40,
          i_amps: 1000,
          cos_phi: 0.96,
          status: 'online',
        },
      },
    },
    contingency: {
      totalGeneration: 720,
      totalDemand: 703,
      losses: 17,
      busVoltage225: 224.9,
      busVoltage30: 29.9,
      cosPhiGlobal: 0.95,
      systemFrequency: 50.00,
      bays: {
        nachtigal: {
          id: 'nachtigal',
          name_fr: 'Centrale Hydro Nachtigal (Régulation)',
          name_en: 'Nachtigal Hydro Station (Governing)',
          voltage: '225 kV',
          p_mw: 410,
          q_mvar: 110,
          i_amps: 1090,
          cos_phi: 0.96,
          status: 'online',
        },
        songloulou: {
          id: 'songloulou',
          name_fr: 'Centrale Hydro Songloulou (Délester Secours)',
          name_en: 'Songloulou Hydro Station (Backup)',
          voltage: '225 kV',
          p_mw: 310,
          q_mvar: 88,
          i_amps: 830,
          cos_phi: 0.95,
          status: 'online',
        },
        gsu_trafo: {
          id: 'gsu_trafo',
          name_fr: 'Poste Source TR1 (Bypass Coupler Actif)',
          name_en: 'Bulk Transformer TR1 (Bypass Active)',
          voltage: '225 / 30 kV',
          p_mw: 420,
          q_mvar: 105,
          i_amps: 1120,
          cos_phi: 0.96,
          status: 'rerouted',
        },
        feeder_yaounde: {
          id: 'feeder_yaounde',
          name_fr: 'Départ Yaoundé (Routé sur Jeu de Barres B)',
          name_en: 'Feeder Yaoundé (Rerouted to Bus B)',
          voltage: '225 kV',
          p_mw: 240,
          q_mvar: 62,
          i_amps: 640,
          cos_phi: 0.96,
          status: 'rerouted',
        },
        feeder_douala: {
          id: 'feeder_douala',
          name_fr: 'Départ Ligne Douala (Transit Nominal)',
          name_en: 'Feeder Douala (Nominal Transit)',
          voltage: '225 kV',
          p_mw: 290,
          q_mvar: 76,
          i_amps: 770,
          cos_phi: 0.96,
          status: 'online',
        },
        feeder_alucam: {
          id: 'feeder_alucam',
          name_fr: 'Départ Industriel Alucam (Stable)',
          name_en: 'Industrial Feeder Alucam (Stable)',
          voltage: '90 kV',
          p_mw: 173,
          q_mvar: 50,
          i_amps: 1155,
          cos_phi: 0.95,
          status: 'online',
        },
      },
    },
  };

  const current = telemetryData[scenario];
  const activeBay = current.bays[selectedBayId] || current.bays['gsu_trafo'];

  return (
    <div className="rounded-2xl bg-white/95 border border-slate-200/90 p-6 sm:p-7 backdrop-blur-xl relative group hover:border-sky-400 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between">
      {/* Ambient glass sheen on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                {locale === 'fr' ? 'SCHÉMATHÈQUE VECTORIELLE // RÉPARTITION DES TRANSITS' : 'VECTOR SCHEMATIC // BULK LOAD DISTRIBUTION'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 font-mono">
              {locale === 'fr' ? 'Nœud National 225 kV & Évacuation Énergie' : 'National 225 kV Bulk Power Grid Node'}
            </h2>
          </div>

          {/* Scenario Selector Pills */}
          <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 font-mono text-xs">
            <button
              type="button"
              onClick={() => setScenario('nominal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scenario === 'nominal'
                  ? 'bg-white text-sky-800 border border-sky-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'fr' ? 'Nominal' : 'Nominal'}
            </button>
            <button
              type="button"
              onClick={() => setScenario('peak')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scenario === 'peak'
                  ? 'bg-white text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'fr' ? 'Pointe Soir' : 'Peak Hour'}
            </button>
            <button
              type="button"
              onClick={() => setScenario('contingency')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scenario === 'contingency'
                  ? 'bg-white text-purple-900 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'fr' ? 'N-1 Bypass' : 'N-1 Coupler'}
            </button>
          </div>
        </div>

        {/* Dynamic Vector Schematic Area */}
        <div className="relative rounded-xl bg-slate-50/90 border border-slate-200 p-4 overflow-hidden mb-5">
          {/* Subtle schematic grid background */}
          <div className="absolute inset-0 cad-grid-dense opacity-40 pointer-events-none" />

          {/* Top Live Bar Telemetry */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs font-mono">
            <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                {locale === 'fr' ? 'Production Totale' : 'Total Generation'}
              </span>
              <span className="text-sky-700 font-black text-sm">
                {current.totalGeneration} MW
              </span>
            </div>
            <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                {locale === 'fr' ? 'Tension Barre HTB' : 'HV Busbar Voltage'}
              </span>
              <span className="text-sky-800 font-black text-sm">
                {current.busVoltage225} kV
              </span>
            </div>
            <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                {locale === 'fr' ? 'Facteur de Puissance' : 'Power Factor cos φ'}
              </span>
              <span className="text-emerald-700 font-black text-sm">
                {current.cosPhiGlobal}
              </span>
            </div>
            <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                {locale === 'fr' ? 'Fréquence Réseau' : 'Grid Frequency'}
              </span>
              <span className="text-amber-700 font-black text-sm">
                {current.systemFrequency} Hz
              </span>
            </div>
          </div>

          {/* Interactive SVG Single-Line Schematic */}
          <div className="relative z-10 w-full overflow-x-auto">
            <svg
              viewBox="0 0 740 220"
              className="w-full h-auto min-w-[620px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Flow markers */}
                <linearGradient id="busA_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="50%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="busB_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>

              {/* Busbar A 225 kV */}
              <line x1="60" y1="50" x2="680" y2="50" stroke="url(#busA_grad)" strokeWidth="4.5" strokeLinecap="round" />
              <text x="70" y="42" fill="#0369A1" fontSize="11" fontWeight="bold" fontFamily="monospace">
                JEU DE BARRES A · 225 kV HTB ({current.busVoltage225} kV)
              </text>

              {/* Busbar B 225 kV */}
              <line x1="60" y1="90" x2="680" y2="90" stroke="url(#busB_grad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="10 4" />
              <text x="70" y="82" fill="#4F46E5" fontSize="10" fontWeight="bold" fontFamily="monospace">
                JEU DE BARRES B · 225 kV (RÉSERVE / BYPASS)
              </text>

              {/* Incomer Bay 1: Nachtigal Hydro */}
              <g
                className="cursor-pointer group/bay"
                onClick={() => setSelectedBayId('nachtigal')}
              >
                <line x1="120" y1="10" x2="120" y2="50" stroke="#059669" strokeWidth="2.5" strokeDasharray="4 3" />
                <circle cx="120" cy="18" r="12" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
                <text x="120" y="22" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="bold" fontFamily="monospace">G1</text>
                <rect x="112" y="32" width="16" height="12" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" rx="2" />
                <text x="120" y="118" textAnchor="middle" fill={selectedBayId === 'nachtigal' ? '#047857' : '#64748B'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Nachtigal
                </text>
                <text x="120" y="132" textAnchor="middle" fill="#047857" fontSize="11" fontFamily="monospace" fontWeight="black">
                  {current.bays.nachtigal.p_mw} MW
                </text>
              </g>

              {/* Incomer Bay 2: Songloulou Hydro */}
              <g
                className="cursor-pointer group/bay"
                onClick={() => setSelectedBayId('songloulou')}
              >
                <line x1="230" y1="10" x2="230" y2="50" stroke="#059669" strokeWidth="2.5" strokeDasharray="4 3" />
                <circle cx="230" cy="18" r="12" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
                <text x="230" y="22" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="bold" fontFamily="monospace">G2</text>
                <rect x="222" y="32" width="16" height="12" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" rx="2" />
                <text x="230" y="118" textAnchor="middle" fill={selectedBayId === 'songloulou' ? '#047857' : '#64748B'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Songloulou
                </text>
                <text x="230" y="132" textAnchor="middle" fill="#047857" fontSize="11" fontFamily="monospace" fontWeight="black">
                  {current.bays.songloulou.p_mw} MW
                </text>
              </g>

              {/* Bus Coupler Bay */}
              <g className="cursor-pointer">
                <line x1="330" y1="50" x2="330" y2="90" stroke={scenario === 'contingency' ? '#D97706' : '#94A3B8'} strokeWidth="2.5" />
                <rect x="323" y="64" width="14" height="12" fill={scenario === 'contingency' ? '#FEF3C7' : '#F1F5F9'} stroke={scenario === 'contingency' ? '#D97706' : '#94A3B8'} strokeWidth="1.5" rx="2" />
                <text x="330" y="118" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                  Coupler
                </text>
                <text x="330" y="130" textAnchor="middle" fill={scenario === 'contingency' ? '#B45309' : '#64748B'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {scenario === 'contingency' ? 'FERMÉ' : 'OUVERT'}
                </text>
              </g>

              {/* Step-Down Substation Transformer Bay TR1 */}
              <g
                className="cursor-pointer group/bay"
                onClick={() => setSelectedBayId('gsu_trafo')}
              >
                <line x1="430" y1="50" x2="430" y2="150" stroke="#0284C7" strokeWidth="2.5" />
                {/* Transformer 2 concentric circles */}
                <circle cx="430" cy="115" r="10" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2" />
                <circle cx="430" cy="128" r="10" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2" />
                <text x="430" y="170" textAnchor="middle" fill={selectedBayId === 'gsu_trafo' ? '#0369A1' : '#64748B'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                  TR1 225/30 kV
                </text>
                <text x="430" y="184" textAnchor="middle" fill="#0369A1" fontSize="11" fontFamily="monospace" fontWeight="black">
                  {current.bays.gsu_trafo.p_mw} MW
                </text>
              </g>

              {/* Outgoing Feeder 1: Yaoundé Nyom II */}
              <g
                className="cursor-pointer group/bay"
                onClick={() => setSelectedBayId('feeder_yaounde')}
              >
                <line x1="530" y1="50" x2="530" y2="150" stroke="#0284C7" strokeWidth="2.5" />
                <rect x="522" y="70" width="16" height="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" rx="2" />
                <polygon points="530,158 524,148 536,148" fill="#0284C7" />
                <text x="530" y="170" textAnchor="middle" fill={selectedBayId === 'feeder_yaounde' ? '#0369A1' : '#64748B'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Yaoundé
                </text>
                <text x="530" y="184" textAnchor="middle" fill="#0369A1" fontSize="11" fontFamily="monospace" fontWeight="black">
                  {current.bays.feeder_yaounde.p_mw} MW
                </text>
              </g>

              {/* Outgoing Feeder 2: Douala Bekoko */}
              <g
                className="cursor-pointer group/bay"
                onClick={() => setSelectedBayId('feeder_douala')}
              >
                <line x1="630" y1="50" x2="630" y2="150" stroke="#0284C7" strokeWidth="2.5" />
                <rect x="622" y="70" width="16" height="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" rx="2" />
                <polygon points="630,158 624,148 636,148" fill="#0284C7" />
                <text x="630" y="170" textAnchor="middle" fill={selectedBayId === 'feeder_douala' ? '#0369A1' : '#64748B'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Douala
                </text>
                <text x="630" y="184" textAnchor="middle" fill="#0369A1" fontSize="11" fontFamily="monospace" fontWeight="black">
                  {current.bays.feeder_douala.p_mw} MW
                </text>
              </g>
            </svg>
          </div>

          {/* Active Bay Telemetry Drawer */}
          <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-sky-600">⚡</span>
              <div>
                <span className="font-bold text-slate-900 block">
                  {locale === 'fr' ? activeBay.name_fr : activeBay.name_en}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Tension Nominale : <span className="text-amber-700 font-bold">{activeBay.voltage}</span> · Statut : <span className="text-emerald-700 uppercase font-bold">{activeBay.status}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-700">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">P (Actif)</span>
                <span className="font-black text-sky-800">{activeBay.p_mw} MW</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Q (Réactif)</span>
                <span className="font-black text-purple-800">{activeBay.q_mvar} Mvar</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Courant I</span>
                <span className="font-black text-sky-800">{activeBay.i_amps} A</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">cos φ</span>
                <span className="font-black text-emerald-800">{activeBay.cos_phi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls & Direct Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>{locale === 'fr' ? 'Supervision SCADA CEI 61850 & Verrouillages CEI 62271' : 'IEC 61850 SCADA & IEC 62271 Interlocks'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLaunchSimLab}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            {locale === 'fr' ? 'Laboratoires' : 'Sim Labs'}
          </button>
          <button
            type="button"
            onClick={onLaunchSld}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>{locale === 'fr' ? 'Ouvrir Poste SLD' : 'Open Full SLD'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
