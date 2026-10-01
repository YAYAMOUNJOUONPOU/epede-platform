// src/components/calculators/SavedStudiesDrawer.tsx
import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  ExternalLink,
  X,
  FolderOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Calculator,
  Search
} from 'lucide-react';
import { useAuth, UserCalculationNote } from '../../services/AuthContext';
import { CalculationReportModal, CalculationReportData } from './CalculationReportModal';

interface SavedStudiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onLoadStudy?: (calculatorType: string, params: any) => void;
}

export const SavedStudiesDrawer: React.FC<SavedStudiesDrawerProps> = ({
  isOpen,
  onClose,
  locale,
  onLoadStudy,
}) => {
  const { user, calculationNotes, deleteCalculationNote, signInWithGoogle } = useAuth();
  const [selectedNote, setSelectedNote] = useState<UserCalculationNote | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  const filteredNotes = calculationNotes.filter((n) => {
    const term = filterText.toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.calculatorType.toLowerCase().includes(term)
    );
  });

  const getParsedNoteData = (note: UserCalculationNote): CalculationReportData | null => {
    try {
      const parsed = JSON.parse(note.parameters);
      return {
        title: note.title,
        calcType: note.calculatorType,
        standard: parsed.standard || 'CEI / IEEE',
        date: parsed.date || new Date().toLocaleDateString(),
        referenceId: parsed.referenceId || note.id,
        apparatusProvenance: parsed.apparatusProvenance,
        inputs: parsed.inputs || [],
        formulas: parsed.formulas || [],
        results: parsed.results || [],
        complianceVerdict: parsed.complianceVerdict || {
          status: 'INFORMATIONAL',
          message: 'Étude d\'ingénierie enregistrée.',
        },
        engineeringNotes: parsed.engineeringNotes || [],
      };
    } catch {
      return null;
    }
  };

  const activeReportData = selectedNote ? getParsedNoteData(selectedNote) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl h-full bg-[#0B0F17] border-l border-slate-800 shadow-2xl flex flex-col z-50 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0F141F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <span>{locale === 'fr' ? 'Mes Études & Notes de Calcul' : 'My Engineering Studies'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  {calculationNotes.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {locale === 'fr' ? 'Synchronisé avec votre compte Firestore' : 'Cloud synchronized with your Firestore account'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User state / Search */}
        <div className="p-4 border-b border-slate-800/80 bg-[#0B0F17] space-y-3">
          {!user ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="text-amber-200">
                {locale === 'fr' ? 'Connectez-vous pour synchroniser vos études de réseau.' : 'Sign in with Google to synchronize your studies.'}
              </div>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shrink-0"
              >
                {locale === 'fr' ? 'Connexion' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder={locale === 'fr' ? 'Rechercher une étude par titre ou norme...' : 'Search study by title or standard...'}
                className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full font-mono"
              />
            </div>
          )}
        </div>

        {/* List of notes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {filteredNotes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 space-y-3">
              <Calculator className="h-10 w-10 text-slate-600" />
              <div>
                <p className="font-bold text-slate-400">
                  {locale === 'fr' ? 'Aucune étude enregistrée' : 'No saved studies found'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  {locale === 'fr' 
                    ? 'Ouvrez n\'importe quel calculateur, cliquez sur "Générer Note de Calcul", puis enregistrez votre étude.'
                    : 'Open any calculator, click "Technical Calculation Note", and save your study to Firestore.'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isCompliant = note.status === 'validated';
              return (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl bg-[#111722] border border-slate-800/90 hover:border-amber-500/50 transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {note.calculatorType}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {note.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">
                        {note.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCalculationNote(note.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title={locale === 'fr' ? 'Supprimer l\'étude' : 'Delete study'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{note.id.substring(0, 16)}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNote(note);
                          setInspectModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <FileText className="h-3 w-3 text-cyan-400" />
                        <span>{locale === 'fr' ? 'Visualiser' : 'View Note'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspect Note Modal */}
      {activeReportData && (
        <CalculationReportModal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          locale={locale}
          data={activeReportData}
        />
      )}
    </div>
  );
};
