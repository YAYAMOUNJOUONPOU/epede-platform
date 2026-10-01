// src/components/equipment/modules/SystemBoundaryResponsibilityCard.tsx
// EPEDE - System Boundary, Responsibility Context & Interface Matrix (Priorities 6 & 8)
// Clarifies asset ownership, operator handovers, and physical/electrical/SCADA interfaces

import React, { useState } from 'react';
import {
  Layers,
  Network,
  Cpu,
  Building,
  Shield,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  ChevronRight,
  X
} from 'lucide-react';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';
import { MultiDisciplinaryInterfaceMatrixViewer } from '../../grid/MultiDisciplinaryInterfaceMatrixViewer';

export interface SystemBoundaryProps {
  equipmentId?: string;
  domainCode?: string;
  locale: 'fr' | 'en';
}

interface InterfaceDefinition {
  type: 'PHYSICAL' | 'ELECTRICAL' | 'SCADA_CONTROL' | 'CIVIL_ENV';
  title_fr: string;
  title_en: string;
  upstreamEntity_fr: string;
  upstreamEntity_en: string;
  downstreamEntity_fr: string;
  downstreamEntity_en: string;
  boundaryDescription_fr: string;
  boundaryDescription_en: string;
  governingStandard: string;
  testVerificationCriterion_fr: string;
  testVerificationCriterion_en: string;
}

export const SystemBoundaryResponsibilityCard: React.FC<SystemBoundaryProps> = ({
  equipmentId = '',
  domainCode = 'D04',
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const interfaces: InterfaceDefinition[] = [
    {
      type: 'PHYSICAL',
      title_fr: 'Interface Mécanique & Traversées HTB',
      title_en: 'Mechanical & HV Bushing Interface',
      upstreamEntity_fr: 'Cuve Transformateur de Puissance',
      upstreamEntity_en: 'Power Transformer Tank',
      downstreamEntity_fr: 'Jeu de Barres Blindé / Aérien 225 kV',
      downstreamEntity_en: '225 kV Busbar (GIS or AIS)',
      boundaryDescription_fr: 'Plages de raccordement en cuivre étamé ou aluminium à 4 ou 8 trous selon norme DIN 43675. Serrage au couple contrôlé (80 N·m) avec rondelles Belleville.',
      boundaryDescription_en: 'Tinned copper or aluminum terminal palm with 4 or 8 holes per DIN 43675. Controlled torque tightening (80 N·m) with Belleville spring washers.',
      governingStandard: 'DIN 43675 / IEC 60137',
      testVerificationCriterion_fr: 'Thermographie infrarouge en charge (ΔT < 5 °C entre phases) et test de résistance de contact (< 20 μΩ).',
      testVerificationCriterion_en: 'Online thermal imaging (ΔT < 5 °C between phases) and contact resistance micro-ohmmeter test (< 20 μΩ).'
    },
    {
      type: 'ELECTRICAL',
      title_fr: 'Interface Électrotechnique & Tenue Diélectrique',
      title_en: 'Electrotechnical & Dielectric Withstand Interface',
      upstreamEntity_fr: 'Réseau de Transport 225 kV (SONATREL)',
      upstreamEntity_en: '225 kV Transmission Grid (SONATREL)',
      downstreamEntity_fr: 'Enroulement Primaire HTB',
      downstreamEntity_en: 'HV Primary Winding',
      boundaryDescription_fr: 'Niveau d\'isolement assigné 225 kV : tension assignée de tenue aux chocs de foudre (BIL) 1050 kV crête, tension de tenue à fréquence industrielle 460 kV RMS.',
      boundaryDescription_en: '225 kV insulation level: 1050 kV peak lightning impulse (BIL), 460 kV RMS power-frequency withstand voltage.',
      governingStandard: 'IEC 60071-1 / IEC 60076-3',
      testVerificationCriterion_fr: 'Essai de décharges partielles (PD < 100 pC à 1.5 Um/√3) et essai de choc plein/tronqué en laboratoire d\'usine.',
      testVerificationCriterion_en: 'Partial discharge test (PD < 100 pC at 1.5 Um/√3) and full/chopped lightning impulse FAT test.'
    },
    {
      type: 'SCADA_CONTROL',
      title_fr: 'Interface Téléconduite, SCADA & Contrôle-Commande',
      title_en: 'SCADA, Telemetry & Automation Interface',
      upstreamEntity_fr: 'Automate de Travée & IED de Protection (Poste)',
      upstreamEntity_en: 'Bay Controller Unit (BCU) & Protection IED',
      downstreamEntity_fr: 'Dispatching National SONATREL (EMS/SCADA)',
      downstreamEntity_en: 'National Dispatch Center (EMS/SCADA)',
      boundaryDescription_fr: 'Protocole IEC 60870-5-104 sur lien IP sécurisé et bus de sous-station IEC 61850 (messages GOOSE pour verrouillage rapide, MMS pour télémesures).',
      boundaryDescription_en: 'IEC 60870-5-104 over redundant IP link and IEC 61850 substation bus (GOOSE for interlock trips, MMS for supervisory telemetry).',
      governingStandard: 'IEC 61850 / IEC 60870-5-104',
      testVerificationCriterion_fr: 'Test de transmission point-à-point (SAT) : temps de transmission télécommande < 500 ms, horodatage synchronisé GPS IEEE 1588 (PTP) à 1 ms.',
      testVerificationCriterion_en: 'Point-to-point telemetry SAT: command execution time < 500 ms, GPS PTP IEEE 1588 time sync accuracy < 1 ms.'
    },
    {
      type: 'CIVIL_ENV',
      title_fr: 'Interface Génie Civil & Environnement',
      title_en: 'Civil Engineering & Environmental Interface',
      upstreamEntity_fr: 'Massif Fondation Béton Armé',
      upstreamEntity_en: 'Reinforced Concrete Foundation Pad',
      downstreamEntity_fr: 'Fosse de Rétention Totale d\'Huile & Sol',
      downstreamEntity_en: 'Oil Containment Pit & Ground Soil',
      boundaryDescription_fr: 'Fosse de rétention étanche d\'un volume égal à 100% de l\'huile du plus gros appareil + 10% de pluie décennale (NF C 17-300), avec étouffoir de flammes à lit de galets calibrés (40/60 mm).',
      boundaryDescription_en: 'Impervious retention bund sized to 100% of largest oil volume + 10% 10-year rain allowance (NF C 17-300), fitted with calibrated gravel fire extinguisher bed (40/60 mm).',
      governingStandard: 'NF C 17-300 / IEC 61936-1 Cl. 8',
      testVerificationCriterion_fr: 'Épreuve d\'étanchéité à l\'eau 24h et vanne coupe-feu automatique avec filtre séparateur hydrocarbures testé.',
      testVerificationCriterion_en: '24-hour water tightness test and automatic fire shutoff valve with certified hydrocarbon filter.'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F14] overflow-hidden shadow-lg font-sans">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0E141D] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Network className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{isFr ? 'FRONTIÈRES SYSTÈME, RESPONSABILITÉS & MATRICE DES INTERFACES' : 'SYSTEM BOUNDARIES, RESPONSIBILITIES & INTERFACE MATRIX'}</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              {isFr
                ? 'Délégation d\'autorité, points de démarcation et interfaces physique / électrique / SCADA'
                : 'Delegation of authority, demarcation boundaries and physical/electrical/SCADA interfaces'}
            </p>
          </div>
        </div>

        <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="sm" />
      </div>

      {/* Responsibility Handover Banner */}
      <div className="p-3 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isFr ? 'PROPRIÉTAIRE D\'ACTIF :' : 'ASSET OWNER :'}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 font-bold">
            SONATREL (Transporteur National)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isFr ? 'AUTORITÉ DE CONDUITE :' : 'DISPATCHING AUTHORITY :'}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 font-bold">
            Centre de Conduite Réseau (CCR Mangombé)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isFr ? 'MAINTENANCE SUR SITE :' : 'SITE MAINTENANCE :'}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-bold">
            Équipes Spécialisées Lignes & Postes HTB
          </span>
        </div>
      </div>

      {/* Interfaces Table / Cards */}
      <div className="p-4 space-y-3">
        {interfaces.map((itf, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-800/80 bg-[#0E131A] p-3 space-y-2 hover:border-slate-700/80 transition-all font-sans"
          >
            {/* Interface Type & Standard */}
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  {itf.type}
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {isFr ? itf.title_fr : itf.title_en}
                </span>
              </div>

              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] font-mono text-slate-300 font-bold">
                {itf.governingStandard}
              </span>
            </div>

            {/* Demarcation Nodes */}
            <div className="flex items-center gap-2 text-[11px] font-mono py-1 px-2.5 rounded bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Amont : <strong className="text-cyan-300">{isFr ? itf.upstreamEntity_fr : itf.upstreamEntity_en}</strong></span>
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-400">Aval : <strong className="text-amber-300">{isFr ? itf.downstreamEntity_fr : itf.downstreamEntity_en}</strong></span>
            </div>

            {/* Boundary Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {isFr ? itf.boundaryDescription_fr : itf.boundaryDescription_en}
            </p>

            {/* Verification Criterion */}
            <div className="text-[11px] text-emerald-300 flex items-start gap-1.5 pt-1 border-t border-slate-800/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-emerald-200">{isFr ? 'Critère de recette / essai de raccordement :' : 'Commissioning acceptance test criterion :'} </strong>
                {isFr ? itf.testVerificationCriterion_fr : itf.testVerificationCriterion_en}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action: Open Full Multidisciplinary & Contractual Demarcation Matrix */}
      <div className="p-3 bg-[#0E141D] border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          {isFr ? 'Matrice inter-métiers (8 disciplines) & convention de raccordement' : 'Cross-discipline matrix (8 fields) & interconnection agreement'}
        </span>

        <button
          type="button"
          onClick={() => setIsMatrixModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
        >
          <span>{isFr ? 'Ouvrir Matrice Complète (8 Métiers & Cameroun)' : 'Open Full Cross-Discipline Matrix'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Master Matrix Modal */}
      {isMatrixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-700 bg-[#0A0E15] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-[#0E131A] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Network className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase">
                    {isFr ? 'MATRICE DES 8 DISCIPLINES D\'INGÉNIERIE & FRONTIÈRES CONTRACTUELLES' : '8-DISCIPLINE ENGINEERING MATRIX & CONTRACTUAL BOUNDARIES'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isFr ? 'Points de coupure, passations techniques et cadre réglementaire camerounais' : 'Cutoff points, technical handovers and Cameroon regulatory framework'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMatrixModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <MultiDisciplinaryInterfaceMatrixViewer locale={locale} embedded={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
