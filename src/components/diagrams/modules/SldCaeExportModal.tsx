// src/components/diagrams/modules/SldCaeExportModal.tsx
// EPEDE — CAE Export Modal for Power System Simulation Tools
// Allows exporting the active SLD topology into DIgSILENT PowerFactory, ETAP/PSS-E, MATPOWER, or Python pandapower

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Cpu, 
  FileCode, 
  ExternalLink, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Info,
  Terminal
} from 'lucide-react';
import type { SldTopologyType } from './SldHeaderToolbar';
import { 
  buildCaeExportPayload, 
  CaeFormat, 
  CaeExportPayload 
} from '../services/CaeSimulationExportService';

interface SldCaeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topology: SldTopologyType;
  locale: 'fr' | 'en';
}

export const SldCaeExportModal: React.FC<SldCaeExportModalProps> = ({
  isOpen,
  onClose,
  topology,
  locale,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<CaeFormat>('digsilent_dgs');
  const [copied, setCopied] = useState(false);

  const isFr = locale === 'fr';

  const payload: CaeExportPayload = useMemo(() => {
    return buildCaeExportPayload(selectedFormat, {
      topology,
      locale,
    });
  }, [selectedFormat, topology, locale]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(payload.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([payload.content], { type: payload.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = payload.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formats: Array<{
    id: CaeFormat;
    name: string;
    ext: string;
    toolBadge: string;
    descFr: string;
    descEn: string;
    accentColor: string;
  }> = [
    {
      id: 'digsilent_dgs',
      name: 'DIgSILENT PowerFactory',
      ext: '.dgs',
      toolBadge: 'PowerFactory 2024+',
      descFr: 'Format standard DGS ASCII / XML pour études de court-circuit CEI 60909 et transit de puissance.',
      descEn: 'Standard DGS ASCII / XML exchange format for IEC 60909 short-circuit and load flow simulations.',
      accentColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
    },
    {
      id: 'etap_raw',
      name: 'ETAP / PSS®E RAW',
      ext: '.raw',
      toolBadge: 'ETAP / Siemens PSS®E',
      descFr: 'Format IEEE Common Data Format (CDF) / PSS/E RAW pour calcul de répartition et stabilité transitoire.',
      descEn: 'IEEE Common Data Format (CDF) / PSS/E RAW file for power flow, arc flash, and transient stability.',
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    },
    {
      id: 'matpower_m',
      name: 'MATPOWER / MATLAB',
      ext: '.m',
      toolBadge: 'MATLAB / Octave',
      descFr: 'Structure de cas MATPOWER standard pour résolution Newton-Raphson et Fast-Decoupled.',
      descEn: 'Standard MATPOWER case struct for Newton-Raphson and Fast-Decoupled power flow solving.',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      id: 'pandapower_py',
      name: 'Python pandapower / PyPSA',
      ext: '.py',
      toolBadge: 'Open-Source Python CAE',
      descFr: 'Script Python exécutable autonome avec création de réseau pandapower et solveur Newton-Raphson.',
      descEn: 'Executable standalone Python script with pandapower network model and Newton-Raphson solver.',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#070D18] border border-slate-800 shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#030712]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {isFr ? 'Export Simulateurs & CAE Réseau' : 'CAE & Grid Simulation Export Engine'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                  {topology.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {isFr 
                  ? 'Génération de fichiers d’échange pour DIgSILENT PowerFactory, ETAP, MATPOWER & Python' 
                  : 'Direct exchange file generator for DIgSILENT PowerFactory, ETAP, MATPOWER & Python'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 border-b border-slate-800/80 bg-[#070D18]/90">
          {formats.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${fmt.accentColor} ring-1 ring-sky-400 shadow-md`
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-sky-400" />
                    {fmt.ext}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {fmt.toolBadge}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate">{fmt.name}</div>
              </button>
            );
          })}
        </div>

        {/* Instructions Banner */}
        <div className="flex items-start gap-2.5 px-6 py-3 bg-sky-950/20 border-b border-sky-800/30 text-xs text-sky-300">
          <Info className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
          <p className="leading-relaxed">
            {isFr ? payload.instructions.fr : payload.instructions.en}
          </p>
        </div>

        {/* Code Content Viewport */}
        <div className="flex-1 overflow-auto p-4 bg-[#030712] font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500">
            <span>{payload.filename}</span>
            <span>{payload.content.split('\n').length} {isFr ? 'lignes' : 'lines'}</span>
          </div>
          <pre className="text-emerald-400 selection:bg-emerald-900/60 leading-relaxed overflow-x-auto whitespace-pre">
            {payload.content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#030712]/90">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{isFr ? 'Conformité normative CEI 60909 / CEI 60076' : 'Normative Compliance IEC 60909 / IEC 60076'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? (isFr ? 'COPIÉ !' : 'COPIED !') : (isFr ? 'COPIER LE CODE' : 'COPY CODE')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>{isFr ? `TÉLÉCHARGER (${payload.filename})` : `DOWNLOAD (${payload.filename})`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
