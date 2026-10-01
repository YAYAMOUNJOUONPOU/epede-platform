// src/components/phase2/modules/GovernanceProtocolView.tsx
import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface GovernanceProtocolViewProps {
  locale: 'fr' | 'en';
}

export const GovernanceProtocolView: React.FC<GovernanceProtocolViewProps> = ({ locale }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h3 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            {locale === 'fr'
              ? 'Protocole de Gouvernance d\'Ingénierie & Critères de Qualité (Section 58)'
              : 'Engineering Governance Protocol & Quality Criteria (Section 58)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-sky-800 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? '1. Structure Immuable en 43 Points' : '1. Immutable 43-Point Structure'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm">
              Chaque objet de connaissance en Phase 2 respecte rigoureusement les 43 sections canoniques :
              de l'Identité (1) aux Équations physiques (7), Systèmes (8), Protections ANSI (15), Normes CEI/IEEE (21),
              Calculs & Études (22-23), Rôles (26), Défaillances (31), Relations (36) jusqu'au Contrôle Qualité (43).
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-sky-800 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? '2. Règle Zéro-Hallucination' : '2. Zero-Hallucination Mandate'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm">
              Toutes les valeurs techniques (tensions, courants de court-circuit, constantes d'inertie H,
              impédances Uk%, codes ANSI, temps de déclenchement) sont ancrées dans la physique électrotechnique réelle
              et validées sur les réseaux de transport et de distribution (ex. corridor 225 kV SONATREL, Nachtigal 420 MW).
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-sky-800 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? '3. Étiquetage Transparent des Données' : '3. Transparent Data Stamping'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm">
              Chaque paramètre est explicitement étiqueté selon 4 statuts formels :
              <span className="text-emerald-700 font-bold font-mono"> [VERIFIED]</span> (mesure de terrain / norme constructeur),
              <span className="text-sky-700 font-bold font-mono"> [REFERENCE]</span> (standard international CEI/IEEE),
              <span className="text-amber-700 font-bold font-mono"> [ESTIMATED]</span> (calcul théorique standard), ou
              <span className="text-rose-700 font-bold font-mono"> [SOURCE GAP]</span> (nécessite validation d'essais site).
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-sky-800 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? '4. Traçabilité & Graphe de Connaissances' : '4. Traceability & Knowledge Graph'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm">
              Les 16 domaines sont interconnectés par des arêtes typées (feeds_power_to, protected_by, governed_by,
              regulated_by) reliant équipements physiques, schémas de protection, études de réseau et métiers d'ingénierie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
