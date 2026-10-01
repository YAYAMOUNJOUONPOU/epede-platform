// src/components/journey/DisciplinesModal.tsx
import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Layers, 
  Wrench, 
  ShieldCheck, 
  Radio, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { ENGINEERING_DISCIPLINES } from './data/ecosystemData';

interface DisciplinesModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export const DisciplinesModal: React.FC<DisciplinesModalProps> = ({
  locale,
  isOpen,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<string>(ENGINEERING_DISCIPLINES[0].id);

  if (!isOpen) return null;

  const activeDiscipline = ENGINEERING_DISCIPLINES.find((d) => d.id === selectedId) || ENGINEERING_DISCIPLINES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'LES MÉTIERS DE L\'INGÉNIERIE ÉLECTRIQUE' : 'ENGINEERING DISCIPLINES ECOSYSTEM'}</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                  7 DISCIPLINES
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Aucun ingénieur ne conçoit un réseau seul : synergie pluridisciplinaire' 
                  : 'No single engineer builds a grid alone : multidisciplinary collaboration'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Discipline list pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {ENGINEERING_DISCIPLINES.map((d) => {
              const isSelected = d.id === selectedId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedId(d.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">{d.name[locale]}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{d.shortDesc[locale]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Discipline Detail */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 uppercase">{activeDiscipline.name[locale]}</h4>
                <p className="text-xs text-indigo-700 mt-0.5 font-medium">{activeDiscipline.shortDesc[locale]}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-700 font-bold block mb-1">
                {locale === 'fr' ? 'PÉRIMÈTRE & ÉQUIPEMENTS CONÇUS :' : 'SCOPE & DESIGNED ASSETS:'}
              </span>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                {activeDiscipline.shortDesc[locale]}
              </p>
            </div>

            {/* Norms & Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block mb-1">
                  {locale === 'fr' ? 'NORMES & CODES STANDARDS' : 'STANDARDS & CODES'}
                </span>
                <span className="text-xs text-amber-800 font-bold">
                  {(activeDiscipline.standards ?? ['IEC 60034', 'IEC 60076', 'IEEE 80', 'NF C 15-100']).join(' · ')}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block mb-1">
                  {locale === 'fr' ? 'OUTILS LOGICIELS UTILISÉS' : 'ENGINEERING SOFTWARE TOOLS'}
                </span>
                <span className="text-xs text-sky-700 font-bold">
                  {(activeDiscipline.tools ?? ['ETAP', 'AutoCAD Electrical', 'MATLAB/Simulink', 'DigSILENT PowerFactory']).join(' · ')}
                </span>
              </div>
            </div>

            {/* Key Deliverables */}
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 block mb-1.5 font-bold">
                {locale === 'fr' ? 'LIVRABLES TYPIQUES D\'INGÉNIERIE :' : 'KEY ENGINEERING DELIVERABLES:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {activeDiscipline.keyDeliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>{item[locale]}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
