// src/components/epede/EarthingSchemesDiagram.tsx
// Interactive Electrical Engineering Schematic of Earthing Systems: TT, TN-S, TN-C, IT
// Compliant with IEC 60364-4-41 / NF C 15-100

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Activity, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
}

type EarthingType = 'TT' | 'TN_S' | 'TN_C' | 'IT';

export const EarthingSchemesDiagram: React.FC<Props> = ({ locale }) => {
  const isFr = locale === 'fr';
  const [selectedScheme, setSelectedScheme] = useState<EarthingType>('TT');
  const [hasFault, setHasFault] = useState<boolean>(true);

  const schemeData: Record<EarthingType, {
    title: string;
    sub: string;
    firstLetter: string;
    secondLetter: string;
    firstLetterDesc: string;
    secondLetterDesc: string;
    sourceEarth: string;
    chassisEarth: string;
    faultLoop: string;
    faultCurrentFormula: string;
    touchVoltageFormula: string;
    typicalId: string;
    typicalUc: string;
    trippingDevice: string;
    application: string;
    standard: string;
    color: string;
  }> = {
    TT: {
      title: isFr ? 'Régime TT (Neutre Terre, Masses Terre)' : 'TT System (Neutral to Earth, Frames to Earth)',
      sub: isFr ? 'Résidentiel & Petit Tertiaire' : 'Residential & Light Commercial',
      firstLetter: 'T',
      secondLetter: 'T',
      firstLetterDesc: isFr ? 'T = Neutre du transformateur relié directement à la terre (Rn ≈ 10 Ω)' : 'T = Transformer neutral directly connected to earth (Rn ≈ 10 Ω)',
      secondLetterDesc: isFr ? 'T = Masses de l\'installation reliées à une prise de terre séparée (Ra ≈ 20 Ω)' : 'T = Equipment exposed-conductive-parts connected to independent earth (Ra ≈ 20 Ω)',
      sourceEarth: 'Rn = 10 Ω',
      chassisEarth: 'Ra = 20 Ω (indépendant)',
      faultLoop: isFr ? 'Phase L1 → Défaut carcasse → Prise de terre Ra → Sol → Prise de terre Rn → Neutre transfo' : 'Phase L1 → Frame fault → Ra earth electrode → Ground earth path → Rn neutral electrode → Transformer neutral',
      faultCurrentFormula: 'I_d = U_0 / (R_a + R_n)',
      touchVoltageFormula: 'U_c = R_a · I_d',
      typicalId: '230 V / (20 + 10) Ω = 7.66 A',
      typicalUc: '20 Ω · 7.66 A = 153.2 V (> 50 V danger!)',
      trippingDevice: isFr ? 'Disjoncteur Différentiel Résiduel (DDR 30 mA / 300 mA) obligatoire' : 'Residual Current Device (RCD 30 mA / 300 mA) mandatory',
      application: isFr ? 'Réseaux de distribution publique BT (NF C 15-100 §411.5)' : 'Public utility low voltage distribution (IEC 60364-4-41 §411.5)',
      standard: 'IEC 60364-4-41 / NF C 15-100',
      color: 'amber',
    },
    TN_S: {
      title: isFr ? 'Régime TN-S (Neutre Terre, Masse au Neutre Séparé)' : 'TN-S System (Neutral to Earth, Separate PE & N)',
      sub: isFr ? 'Grands Bâtiments Tertiaires & Industrie' : 'Commercial Complexes & Data Centers',
      firstLetter: 'T',
      secondLetter: 'N-S',
      firstLetterDesc: isFr ? 'T = Neutre du transformateur relié directement à la terre' : 'T = Transformer neutral directly connected to earth',
      secondLetterDesc: isFr ? 'N-S = Conducteur de protection (PE) et Neutre (N) séparés dans toute l’installation' : 'N-S = Protective conductor (PE) and Neutral (N) strictly separated throughout',
      sourceEarth: 'Rn = 5 Ω',
      chassisEarth: 'Relié au PE (boucle cuivrée fermée)',
      faultLoop: isFr ? 'Phase L1 → Défaut carcasse → Câble PE cuivré → Neutre transfo (Court-circuit franc phase-neutre)' : 'Phase L1 → Frame fault → Copper PE line → Neutral bar (Direct phase-to-neutral short circuit)',
      faultCurrentFormula: 'I_d = U_0 / (Z_L + Z_PE)',
      touchVoltageFormula: 'U_c = (Z_PE / (Z_L + Z_PE)) · U_0 ≈ U_0 / 2',
      typicalId: '230 V / 0.15 Ω = 1 533 A (Court-circuit franc)',
      typicalUc: '≈ 115 V (Coupure instantanée magnétique requise)',
      trippingDevice: isFr ? 'Disjoncteur magnéto-thermique ou fusibles (déclencheur magnétique instantané < 0.4 s)' : 'Circuit breaker instantaneous magnetic release or fast HRC fuses (< 0.4 s per IEC)',
      application: isFr ? 'Industrie, centres de données (immunité CEM optimale, zéro courant dans le PE)' : 'Industry & Data Centers (optimal EMC immunity, no circulating currents on PE)',
      standard: 'IEC 60364-4-41 §411.4',
      color: 'blue',
    },
    TN_C: {
      title: isFr ? 'Régime TN-C (Neutre et PE Confondus en PEN)' : 'TN-C System (Combined PEN Conductor)',
      sub: isFr ? 'Grosses Distributions Industrielles (> 10 mm² Cu)' : 'Heavy Industrial Trunk Feeder (> 10 mm² Cu)',
      firstLetter: 'T',
      secondLetter: 'N-C',
      firstLetterDesc: isFr ? 'T = Neutre transfo relié à la terre' : 'T = Transformer neutral directly connected to earth',
      secondLetterDesc: isFr ? 'N-C = Conducteur PEN unique combinant neutre et conducteur de protection' : 'N-C = Single combined PEN conductor serving both neutral and protection functions',
      sourceEarth: 'Rn = 5 Ω',
      chassisEarth: 'Relié au PEN commun',
      faultLoop: isFr ? 'Phase L1 → Carcasse → Conducteur PEN → Neutre transfo' : 'Phase L1 → Frame → PEN conductor → Transformer neutral',
      faultCurrentFormula: 'I_d = U_0 / (Z_L + Z_PEN)',
      touchVoltageFormula: 'U_c ≈ U_0 / 2',
      typicalId: '230 V / 0.12 Ω = 1 916 A',
      typicalUc: '≈ 115 V (Coupure instantanée disjoncteur)',
      trippingDevice: isFr ? 'Disjoncteur magnéto-thermique. Interdiction stricte de sectionner le PEN !' : 'Circuit breaker. Strict ban on switching or breaking the PEN line !',
      application: isFr ? 'Économie de cuivre en amont (> 10 mm² Cu ou 16 mm² Al). Interdit en aval des petits circuits.' : 'Upstream industrial distribution economy. Forbidden on final small branch circuits.',
      standard: 'NF C 15-100 §543.4 / IEC 60364',
      color: 'sky',
    },
    IT: {
      title: isFr ? 'Régime IT (Neutre Isolé ou Impédant, Continuité)' : 'IT System (Isolated Neutral, Continuous Process)',
      sub: isFr ? 'Hôpitaux, Salles d’Opération & Métallurgie' : 'Hospitals, Operating Theatres & Continuous Plants',
      firstLetter: 'I',
      secondLetter: 'T',
      firstLetterDesc: isFr ? 'I = Neutre du transformateur isolé de la terre (ou relié via forte impédance Z ≈ 1500 Ω)' : 'I = Transformer neutral isolated from earth (or earthed through high impedance Z ≈ 1500 Ω)',
      secondLetterDesc: isFr ? 'T = Masses de l\'installation reliées à la terre' : 'T = Equipment frames earthed locally',
      sourceEarth: 'Isolé ou Z = 1500 Ω',
      chassisEarth: 'Ra = 20 Ω',
      faultLoop: isFr ? 'Premier défaut d\'isolement : très faible courant capacitif (quelques milliampères) circulant par les capacités parasites des câbles.' : 'First insulation fault: only a minute capacitive leakage current flows across network capacitances.',
      faultCurrentFormula: 'I_d1 = U_0 / √(3·Z² + (1 / (3·C·ω))²)',
      touchVoltageFormula: 'U_c1 = R_a · I_d1 ≈ 0 V (< 1 V, aucun danger)',
      typicalId: '≈ 0.05 A à 0.8 A (Premier défaut)',
      typicalUc: '20 Ω · 0.1 A = 2 V (Bien inférieur à la tension limite UL = 50 V ou 25 V)',
      trippingDevice: isFr ? 'NON-DÉCLENCHEMENT au 1er défaut ! Signalisation par Contrôleur Permanent d\'Isolement (CPI).' : 'NO TRIP on first fault! Visual & audible alarm by Permanent Insulation Monitor (IMD/CPI).',
      application: isFr ? 'Continuité de service vitale : blocs opératoires, mines, navires, cimenteries.' : 'Vital process continuity: intensive care units, mines, ships, chemical continuous reactors.',
      standard: 'IEC 60364-4-41 §411.6 / IEC 61557-8',
      color: 'emerald',
    }
  };

  const cur = schemeData[selectedScheme];

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl font-sans">
      {/* Header & Scheme Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {isFr ? 'SCHÉMAS DE LIAISON À LA TERRE (SLT) — CEI 60364' : 'LOW VOLTAGE EARTHING SCHEMES — IEC 60364'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {isFr 
              ? 'Comprendre la boucle de défaut d’isolement, la tension de contact Uc et la protection des personnes'
              : 'Understand insulation fault loop current, touch voltage Uc, and personnel safety protection'}
          </p>
        </div>

        {/* Scheme Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          {(['TT', 'TN_S', 'TN_C', 'IT'] as EarthingType[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedScheme(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedScheme === st
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st.replace('_', '-')}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Electrical Schematic Graphic (SVG / Vector Architecture) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white font-bold">{cur.title}</span>
            <span className="text-slate-500 text-[11px]">({cur.sub})</span>
          </div>

          <button
            type="button"
            onClick={() => setHasFault(!hasFault)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1.5 ${
              hasFault 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{hasFault ? (isFr ? 'Défaut Actif (Phase → Masse)' : 'Fault Active (Phase → Frame)') : (isFr ? 'Isolement Normal' : 'Normal Healthy State')}</span>
          </button>
        </div>

        {/* SVG Schematic Canvas */}
        <div className="w-full bg-slate-900/90 rounded-xl p-4 sm:p-6 border border-slate-800 font-mono text-xs overflow-x-auto">
          <svg viewBox="0 0 740 240" className="w-full min-w-[620px] h-auto text-slate-200">
            {/* Background Grid Accent */}
            <defs>
              <pattern id="grid-schematic" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="740" height="240" fill="url(#grid-schematic)" rx="8" />

            {/* TRANSFORMER SECONDARY (Left Side) */}
            <rect x="30" y="30" width="130" height="180" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="95" y="52" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">TRANSFO HTA/BT</text>
            <text x="95" y="68" fill="#94a3b8" fontSize="9" textAnchor="middle">20 kV / 400 V Dyn11</text>

            {/* Star Windings representation */}
            <circle cx="70" cy="115" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="105" cy="115" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="87" cy="90" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="87" cy="115" r="3" fill="#38bdf8" />
            <text x="87" y="132" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">N</text>

            {/* Source Earth connection */}
            {selectedScheme !== 'IT' ? (
              <>
                <line x1="87" y1="135" x2="87" y2="185" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="87" y1="185" x2="87" y2="200" stroke="#94a3b8" strokeWidth="2" />
                {/* Earth Symbol */}
                <line x1="75" y1="200" x2="99" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="79" y1="205" x2="95" y2="205" stroke="#94a3b8" strokeWidth="2" />
                <line x1="83" y1="210" x2="91" y2="210" stroke="#94a3b8" strokeWidth="2" />
                <text x="105" y="198" fill="#f59e0b" fontSize="9">{cur.sourceEarth}</text>
              </>
            ) : (
              <>
                {/* IT Isolated or High Impedance */}
                <line x1="87" y1="135" x2="87" y2="155" stroke="#10b981" strokeWidth="2" />
                <rect x="75" y="155" width="24" height="25" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                <text x="87" y="172" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">CPI</text>
                <line x1="87" y1="180" x2="87" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="75" y1="200" x2="99" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="79" y1="205" x2="95" y2="205" stroke="#94a3b8" strokeWidth="2" />
                <line x1="83" y1="210" x2="91" y2="210" stroke="#94a3b8" strokeWidth="2" />
                <text x="105" y="198" fill="#10b981" fontSize="9">Z ≈ 1500 Ω (Isolé)</text>
              </>
            )}

            {/* TRANSMISSION CONDUCTORS (Lines L1, L2, L3, N, PE) */}
            {/* L1 */}
            <line x1="160" y1="75" x2="490" y2="75" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="210" y="70" fill="#f43f5e" fontSize="10" fontWeight="bold">L1 (Phase 1)</text>

            {/* N (Neutral) */}
            <line x1="160" y1="110" x2="490" y2="110" stroke="#38bdf8" strokeWidth="2" />
            <text x="210" y="105" fill="#38bdf8" fontSize="10" fontWeight="bold">N (Neutre)</text>

            {/* PE or PEN line depending on scheme */}
            {selectedScheme === 'TN_C' ? (
              <>
                <line x1="160" y1="145" x2="490" y2="145" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="6,4" />
                <text x="210" y="140" fill="#06b6d4" fontSize="10" fontWeight="bold">PEN (Neutre + Terre combinés)</text>
              </>
            ) : (
              <>
                <line x1="160" y1="145" x2="490" y2="145" stroke="#10b981" strokeWidth="2" />
                <text x="210" y="140" fill="#10b981" fontSize="10" fontWeight="bold">
                  {selectedScheme === 'TT' ? 'PE (Masse locale non reliée au transfo)' : 'PE (Conducteur de protection séparé)'}
                </text>
              </>
            )}

            {/* CONSUMER LOAD & METALLIC CHASSIS (Right Side) */}
            <rect x="490" y="45" width="200" height="155" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <text x="590" y="68" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">RÉCEPTEUR ÉLECTRIQUE</text>
            <text x="590" y="82" fill="#94a3b8" fontSize="9" textAnchor="middle">Moteur / Machine industrielle / Armoire</text>

            {/* Internal Load Core */}
            <rect x="525" y="95" width="130" height="50" rx="4" fill="#1e293b" stroke="#475569" />
            <text x="590" y="125" fill="#cbd5e1" fontSize="10" textAnchor="middle">Enroulement Charge (L1-N)</text>

            {/* Internal Connections */}
            <line x1="490" y1="75" x2="525" y2="110" stroke="#f43f5e" strokeWidth="2" />
            <line x1="490" y1="110" x2="525" y2="130" stroke="#38bdf8" strokeWidth="1.5" />

            {/* FAULT ARROW IF ACTIVE */}
            {hasFault && (
              <>
                <path d="M 525 110 L 590 145 L 610 160" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4,2" />
                <polygon points="610,160 600,154 605,150" fill="#ef4444" />
                <circle cx="610" cy="160" r="5" fill="#ef4444" className="animate-ping" />
                <text x="625" y="155" fill="#ef4444" fontSize="10" fontWeight="bold">DÉFAUT D’ISOLEMENT</text>
              </>
            )}

            {/* Consumer Grounding */}
            {selectedScheme === 'TT' ? (
              <>
                {/* Local Earth Rod Ra */}
                <line x1="590" y1="175" x2="590" y2="205" stroke="#10b981" strokeWidth="2.5" />
                <line x1="575" y1="205" x2="605" y2="205" stroke="#10b981" strokeWidth="2" />
                <line x1="580" y1="210" x2="600" y2="210" stroke="#10b981" strokeWidth="2" />
                <line x1="585" y1="215" x2="595" y2="215" stroke="#10b981" strokeWidth="2" />
                <text x="615" y="208" fill="#10b981" fontSize="10" fontWeight="bold">Ra = 20 Ω</text>
                <text x="615" y="220" fill="#94a3b8" fontSize="8">Prise de terre locale</text>
              </>
            ) : selectedScheme === 'TN_S' ? (
              <>
                {/* Connected to PE directly */}
                <line x1="590" y1="175" x2="590" y2="145" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="590" cy="145" r="3.5" fill="#10b981" />
                <text x="600" y="140" fill="#10b981" fontSize="9">Liaison carcasse-PE</text>
              </>
            ) : selectedScheme === 'TN_C' ? (
              <>
                {/* Connected to PEN */}
                <line x1="590" y1="175" x2="590" y2="145" stroke="#06b6d4" strokeWidth="2.5" />
                <circle cx="590" cy="145" r="3.5" fill="#06b6d4" />
                <text x="600" y="140" fill="#06b6d4" fontSize="9">Liaison carcasse-PEN</text>
              </>
            ) : (
              <>
                {/* IT local earth */}
                <line x1="590" y1="175" x2="590" y2="205" stroke="#10b981" strokeWidth="2.5" />
                <line x1="575" y1="205" x2="605" y2="205" stroke="#10b981" strokeWidth="2" />
                <line x1="580" y1="210" x2="600" y2="210" stroke="#10b981" strokeWidth="2" />
                <text x="615" y="208" fill="#10b981" fontSize="10" fontWeight="bold">Ra = 20 Ω</text>
              </>
            )}

            {/* Protective Trip Device Representation (Breaker or RCD) */}
            <rect x="330" y="60" width="80" height="30" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="370" y="78" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              {selectedScheme === 'TT' ? 'DDR 30mA' : selectedScheme === 'IT' ? 'CPI ALARME' : 'DISJONCTEUR'}
            </text>
          </svg>
        </div>

        {/* Physics & Calculation Matrix Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {isFr ? 'Courant de Défaut (Id) :' : 'Fault Current (Id) :'}
            </span>
            <div className="text-amber-400 font-bold">{cur.faultCurrentFormula}</div>
            <div className="text-slate-300 text-[11px]">{cur.typicalId}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {isFr ? 'Tension de Contact (Uc) :' : 'Touch Voltage (Uc) :'}
            </span>
            <div className="text-rose-400 font-bold">{cur.touchVoltageFormula}</div>
            <div className="text-slate-300 text-[11px]">{cur.typicalUc}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {isFr ? 'Organe de Coupure / Protection :' : 'Protection Device :'}
            </span>
            <div className="text-emerald-400 font-bold">{cur.trippingDevice}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {isFr ? 'Domaine d’Application Normatif :' : 'Normative Scope :'}
            </span>
            <div className="text-white font-medium">{cur.application}</div>
            <div className="text-slate-500 text-[10px]">{cur.standard}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
