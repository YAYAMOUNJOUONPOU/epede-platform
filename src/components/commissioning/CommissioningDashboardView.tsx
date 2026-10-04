// src/components/commissioning/CommissioningDashboardView.tsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckSquare, 
  Layers, 
  FileText, 
  Download, 
  Printer, 
  Award, 
  AlertTriangle,
  Zap,
  Building,
  Home,
  Factory
} from 'lucide-react';
import { ProjectCommissioningFatSatEngine } from '../installations/ProjectCommissioningFatSatEngine';
import { STARTER_PROJECT_TEMPLATES } from '../installations/data/installationProjectTemplates';
import { InstallationProject } from '../installations/data/installationProjectModel';
import { SubstationCommissioningProtocolsWorkbench } from './SubstationCommissioningProtocolsWorkbench';

interface CommissioningDashboardViewProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string) => void;
}

export const CommissioningDashboardView: React.FC<CommissioningDashboardViewProps> = ({
  locale,
  onNavigate
}) => {
  const isFr = locale === 'fr';

  // Active Commissioning Domain Pillar
  const [activePillar, setActivePillar] = useState<'LV_INSTALLATIONS' | 'HV_SUBSTATIONS'>('LV_INSTALLATIONS');

  // Selected project template for LV
  const [selectedProjectId, setSelectedProjectId] = useState<string>(STARTER_PROJECT_TEMPLATES[1].id); // Tertiary Commercial default

  const currentProject: InstallationProject = 
    STARTER_PROJECT_TEMPLATES.find(p => p.id === selectedProjectId) || STARTER_PROJECT_TEMPLATES[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0C1322] via-[#0E1A2E] to-[#0A1220] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                  {isFr ? 'INGÉNIERIE D’ESSAIS & RÉCEPTION D’OUVRAGE' : 'TESTING & COMMISSIONING ENGINEERING'}
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {isFr 
                    ? 'Atelier de Contrôle FAT / SAT & Conformité Électrique' 
                    : 'FAT / SAT Inspection Workbench & Electrical Compliance'}
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              {isFr
                ? 'Protocoles normalisés d’essais en usine (FAT selon CEI 61439-1) et de réception sur site (SAT selon NF C 15-100 Partie 6 / CEI 60364-6 & CEI 60255). Tableaux TGBT, injection secondaire protections numériques ANSI 21/87T et contrôle des prises de terre IEEE 81.'
                : 'Standardized factory acceptance testing (FAT per IEC 61439-1) and site acceptance inspection (SAT per IEC 60364-6, NF C 15-100 & IEC 60255). Low voltage switchboards, secondary injection testing for ANSI 21/87T relays, and IEEE 81 grounding grid verification.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>CEI 61439 · CEI 60255 · IEEE 81</span>
            </span>
          </div>
        </div>

        {/* Master Domain Pillar Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePillar('LV_INSTALLATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activePillar === 'LV_INSTALLATIONS'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{isFr ? '⚡ Installations BT & Tableaux TGBT (CEI 61439 / NF C 15-100)' : '⚡ LV Installations & Switchboards (IEC 61439 / 60364)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillar('HV_SUBSTATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activePillar === 'HV_SUBSTATIONS'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-md shadow-blue-950'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Layers className="h-4 w-4 text-blue-400" />
              <span>{isFr ? '🔬 Postes HTB/HTA & Protections Réseau (CEI 60255 / IEEE 81)' : '🔬 HV Substations & Grid Relays (IEC 60255 / IEEE 81)'}</span>
            </button>
          </div>

          {activePillar === 'LV_INSTALLATIONS' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">
                {isFr ? 'Modèle d’ouvrage :' : 'Project Template:'}
              </span>
              {STARTER_PROJECT_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedProjectId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedProjectId(tmpl.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {tmpl.environmentType === 'RESIDENTIAL' && <Home className="h-3 w-3" />}
                    {tmpl.environmentType === 'TERTIARY_COMMERCIAL' && <Building className="h-3 w-3" />}
                    {tmpl.environmentType === 'INDUSTRIAL' && <Factory className="h-3 w-3" />}
                    {tmpl.environmentType === 'LARGE_BUILDING' && <Layers className="h-3 w-3" />}
                    <span>{tmpl.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Commissioning Engine by Selected Pillar */}
      {activePillar === 'LV_INSTALLATIONS' ? (
        <ProjectCommissioningFatSatEngine project={currentProject} locale={locale} />
      ) : (
        <SubstationCommissioningProtocolsWorkbench locale={locale} />
      )}
    </div>
  );
};
