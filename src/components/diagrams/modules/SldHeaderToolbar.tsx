// src/components/diagrams/modules/SldHeaderToolbar.tsx
import React from 'react';
import { Activity, Lock, Unlock, Download, RotateCcw, Radio, Layers, Zap, Sun, AlertTriangle, Compass, ShieldCheck, Shield, Cpu } from 'lucide-react';

export type SldTopologyType = 'single_bus' | 'double_bus' | 'breaker_and_half' | 'rmu_distribution' | 'solar_bess' | 'cim_graph' | 'geo_substation_3d';

interface SldHeaderToolbarProps {
  locale: 'fr' | 'en';
  activeTopology: SldTopologyType;
  setActiveTopology: (topology: SldTopologyType) => void;
  bypassInterlocks: boolean;
  setBypassInterlocks: (bypass: boolean) => void;
  interlockAlert: string | null;
  onExportSvg: () => void;
  onResetProtections: () => void;
  onOpenSubstationDossier?: () => void;
  onOpenTcc?: () => void;
  onOpenAtsTransfer?: () => void;
  onOpenOscillogram?: () => void;
  onOpenIec61850?: () => void;
  onOpenSampledValues?: () => void;
  onOpenCyberSecurity?: () => void;
  onOpenLotoPlaybook?: () => void;
  onOpenArchitectures?: () => void;
  onOpenBreakerCutaway?: () => void;
  onOpenCaeExport?: () => void;
}

export const SldHeaderToolbar: React.FC<SldHeaderToolbarProps> = ({
  locale,
  activeTopology,
  setActiveTopology,
  bypassInterlocks,
  setBypassInterlocks,
  interlockAlert,
  onExportSvg,
  onResetProtections,
  onOpenSubstationDossier,
  onOpenTcc,
  onOpenAtsTransfer,
  onOpenOscillogram,
  onOpenIec61850,
  onOpenSampledValues,
  onOpenCyberSecurity,
  onOpenLotoPlaybook,
  onOpenArchitectures,
  onOpenBreakerCutaway,
  onOpenCaeExport,
}) => {
  return (
    <div className="space-y-4 text-[#F4F1E8]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#151C1E] border border-[#567A87]/35 shadow-xl">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D7A64A] mb-1 font-bold">
            <Activity className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">
              {locale === 'fr' ? 'SCHÉMAS & POSTES HTB · SLD INTERACTIF & TOPOLOGIES' : 'INTERACTIVE SINGLE-LINE DIAGRAMS (SLD) & SUBSTATION TOPOLOGIES'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] font-mono tracking-tight uppercase">
            {locale === 'fr' 
              ? 'Schémas Unifilaires Interactifs & Postes Électriques HTB/HTA' 
              : 'Interactive Single-Line Diagrams (SLD) & HV/MV Substations'}
          </h1>
          <p className="text-sm text-[#A9ADA5] mt-1 max-w-3xl font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Modélisation vectorielle dynamique des flux de puissance, positions d\'appareillage, asservissements CEI 62271-102, automatisme de couplage et déclenchements de protection ANSI.'
              : 'Dynamic vector power flow modeling, switchgear positions, IEC 62271-102 mechanical/electrical interlocking rules, bus coupler automation, and ANSI protection trips.'}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Consolidated Substation Batch Compliance Dossier */}
          {onOpenSubstationDossier && (
            <button
              type="button"
              onClick={onOpenSubstationDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#D7A64A] text-[#0B0F12] hover:bg-[#e3b55a] transition-colors shadow-xs"
              title={locale === 'fr' ? 'Générer le dossier d\'homologation complet de tous les organes du poste' : 'Generate consolidated compliance dossier for all substation apparatuses'}
            >
              <ShieldCheck className="h-4 w-4 text-[#0B0F12]" />
              <span>{locale === 'fr' ? 'DOSSIER POSTE COMPLET' : 'SUBSTATION DOSSIER'}</span>
            </button>
          )}

          {/* Substation Architectures & TCO (AIS / GIS / Topologies) */}
          {onOpenArchitectures && (
            <button
              type="button"
              onClick={onOpenArchitectures}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Comparateur d\'architectures AIS vs GIS, topologies de jeux de barres et TCO sur 30 ans' : 'AIS vs GIS architectures, busbar topologies and 30-year TCO comparator'}
            >
              <Layers className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'ARCHITECTURES AIS/GIS' : 'AIS/GIS ARCHITECTURES'}</span>
            </button>
          )}

          {/* Electromechanical Circuit Breaker Cutaway Workbench */}
          {onOpenBreakerCutaway && (
            <button
              type="button"
              onClick={onOpenBreakerCutaway}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#D7A64A] hover:bg-[#D7A64A]/15 border border-[#D7A64A]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Écorché électromécanique disjoncteur SF6 & physique de coupure d’arc' : 'SF6 circuit breaker electromechanical cutaway & arc quenching physics'}
            >
              <Zap className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'COUPE DISJONCTEUR SF₆' : 'BREAKER SF₆ CUTAWAY'}</span>
            </button>
          )}

          {/* Oscillography Replayer & DFR */}
          {onOpenOscillogram && (
            <button
              type="button"
              onClick={onOpenOscillogram}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs"
              title={locale === 'fr' ? 'Rejouer les ondes transitoires de défaut cycle par cycle (COMTRADE / CEI 60255)' : 'Replay transient fault oscillograms cycle-by-cycle (COMTRADE)'}
            >
              <Activity className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'RELECTEUR DFR' : 'OSCILLOGRAMS'}</span>
            </button>
          )}

          {/* Protection Selectivity (TCC) Curves */}
          {onOpenTcc && (
            <button
              type="button"
              onClick={onOpenTcc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#D7A64A] hover:bg-[#D7A64A]/15 border border-[#D7A64A]/40 transition-colors shadow-xs"
              title={locale === 'fr' ? 'Courbes de coordination sélective temps-courant TCC (CEI 60255)' : 'Protection coordination time-current characteristic (TCC) curves'}
            >
              <Zap className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'SÉLECTIVITÉ TCC' : 'TCC SELECTIVITY'}</span>
            </button>
          )}

          {/* Automatic Bus Transfer (ATS / P.A.S. - Permutation Automatique de Sources) */}
          {onOpenAtsTransfer && (
            <button
              type="button"
              onClick={onOpenAtsTransfer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Automatisme de Permutation de Sources P.A.S. / ATS (ANSI 27/25/86) et transfert rapide/résiduel' : 'Automatic Bus Transfer ATS (ANSI 27/25/86) and fast/residual voltage transfer'}
            >
              <Activity className="h-4 w-4 text-[#567A87]" />
              <span>{locale === 'fr' ? 'PERMUTATION P.A.S.' : 'ATS TRANSFER'}</span>
            </button>
          )}

          {/* IEC 61850 SCL Engineering & GOOSE Matrix */}
          {onOpenIec61850 && (
            <button
              type="button"
              onClick={onOpenIec61850}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Ingénierie CEI 61850, matrices GOOSE et export SCL (.SCD / .CID)' : 'IEC 61850 engineering, GOOSE matrices and SCL export (.SCD / .CID)'}
            >
              <Cpu className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'CONFIG CEI 61850' : 'IEC 61850 SCL'}</span>
            </button>
          )}

          {/* Sampled Values (SV 9-2LE / 61869-9) Test Bench */}
          {onOpenSampledValues && (
            <button
              type="button"
              onClick={onOpenSampledValues}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Banc d’essai d’injection virtuelle Sampled Values (CEI 61850-9-2LE / CEI 61869-9)' : 'Sampled Values virtual injection test bench (IEC 61850-9-2LE / IEC 61869-9)'}
            >
              <Activity className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'BANC SV 9-2LE' : 'SV 9-2LE BENCH'}</span>
            </button>
          )}

          {/* Cyber Security OT / IEC 62351 IDS */}
          {onOpenCyberSecurity && (
            <button
              type="button"
              onClick={onOpenCyberSecurity}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Moniteur de cybersécurité OT & IDS réseau (CEI 62351-7 / CEI 62351-9)' : 'OT Cybersecurity monitor & network IDS (IEC 62351-7 / IEC 62351-9)'}
            >
              <Shield className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'CYBER CEI 62351' : 'CYBER IEC 62351'}</span>
            </button>
          )}

          {/* LOTO Lockout/Tagout Safety Playbook */}
          {onOpenLotoPlaybook && (
            <button
              type="button"
              onClick={onOpenLotoPlaybook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#D7A64A] hover:bg-[#D7A64A]/15 border border-[#D7A64A]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Consignation d\'équipements, verrouillages LOTO & protocoles de sécurité' : 'LOTO equipment lockout, tagging & safety switching protocols'}
            >
              <Lock className="h-4 w-4 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'PLAYBOOK LOTO' : 'LOTO PLAYBOOK'}</span>
            </button>
          )}

          {/* Interlock Bypass Toggle */}
          <button
            type="button"
            onClick={() => setBypassInterlocks(!bypassInterlocks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors shadow-xs cursor-pointer ${
              bypassInterlocks
                ? 'bg-red-950/60 border-red-500/60 text-red-200'
                : 'bg-[#0B0F12] border-[#567A87]/40 text-[#F4F1E8] hover:border-[#D7A64A]/50'
            }`}
            title={
              bypassInterlocks
                ? (locale === 'fr' ? 'Verrouillages by-passés (DANGER)' : 'Interlocks bypassed (DANGER)')
                : (locale === 'fr' ? 'Verrouillages CEI 62271-102 actifs' : 'IEC 62271-102 interlocks active')
            }
          >
            {bypassInterlocks ? <Unlock className="h-3.5 w-3.5 text-red-400" /> : <Lock className="h-3.5 w-3.5 text-[#D7A64A]" />}
            <span>
              {bypassInterlocks
                ? (locale === 'fr' ? 'BY-PASS VERROUILLAGE' : 'INTERLOCK BYPASSED')
                : (locale === 'fr' ? 'VERROUILLAGE CEI ACTIF' : 'IEC INTERLOCK ACTIVE')}
            </span>
          </button>

          {/* Export SVG */}
          <button
            type="button"
            onClick={onExportSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs"
            title={locale === 'fr' ? 'Télécharger le schéma vectoriel SVG' : 'Download vector SVG schematic'}
          >
            <Download className="h-3.5 w-3.5 text-[#D7A64A]" />
            <span>EXPORT SVG</span>
          </button>

          {/* Export CAE (DIgSILENT / ETAP / MATPOWER / Python) */}
          {onOpenCaeExport && (
            <button
              type="button"
              onClick={onOpenCaeExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#F4F1E8] hover:border-[#D7A64A]/50 border border-[#567A87]/40 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Exporter vers DIgSILENT PowerFactory, ETAP, MATPOWER et Python' : 'Export to DIgSILENT PowerFactory, ETAP, MATPOWER, and Python'}
            >
              <Cpu className="h-3.5 w-3.5 text-[#D7A64A]" />
              <span>EXPORT CAE</span>
            </button>
          )}

          {/* Reset Switches */}
          <button
            type="button"
            onClick={onResetProtections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0B0F12] text-[#D7A64A] hover:bg-[#D7A64A]/15 border border-[#D7A64A]/40 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'RÉINITIALISER' : 'RESET'}</span>
          </button>
        </div>
      </div>

      {/* Topology Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTopology('single_bus')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'single_bus'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Radio className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '1. Poste 225/30 kV (Simple Jeu de Barres)' : '1. 225/30 kV Substation (Single Bus)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('double_bus')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'double_bus'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Layers className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '2. Poste 225 kV (Double Jeu de Barres & Couplage)' : '2. 225 kV Substation (Double Bus & Coupler)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('breaker_and_half')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'breaker_and_half'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Radio className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '3. Poste 225 kV (Un Disjoncteur et Demi 1-1/2 CB)' : '3. 225 kV Substation (Breaker-and-a-Half 1-1/2 CB)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('rmu_distribution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'rmu_distribution'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Zap className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '4. Poste Distribution HTA 30 kV (Boucle RMU & TGBT)' : '4. 30 kV MV Distribution Substation (RMU & LV)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('solar_bess')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'solar_bess'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Sun className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '5. Centrale Solaire 100 MWc & Stockage BESS 50 MWh (33/225 kV)' : '5. 100 MWp Solar PV & 50 MWh BESS Substation (33/225 kV)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('cim_graph')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'cim_graph'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Layers className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '6. Graphe Sémantique & Topologie CIM (IEC 61970 / GraphRAG)' : '6. CIM Semantic Graph & Topology (IEC 61970 / GraphRAG)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopology('geo_substation_3d')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTopology === 'geo_substation_3d'
              ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
              : 'border-[#567A87]/35 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#D7A64A]/40'
          }`}
        >
          <Compass className="h-4 w-4 text-[#D7A64A]" />
          <span>{locale === 'fr' ? '7. Jumeau Géospatial 3D & Baie HTB (GeoTwin 3D & DLR)' : '7. 3D Geospatial & Substation Bay (GeoTwin 3D & DLR)'}</span>
        </button>
      </div>

      {/* Interlock Safety Warning Banner (IEC 62271-102) */}
      {interlockAlert && (
        <div className="bg-[#151C1E] border-2 border-[#D7A64A] rounded-xl p-3.5 flex items-center gap-3 text-xs font-mono font-bold text-[#F4F1E8] shadow-xs">
          <AlertTriangle className="h-5 w-5 text-[#D7A64A] shrink-0" />
          <span>{interlockAlert}</span>
        </div>
      )}
    </div>
  );
};
