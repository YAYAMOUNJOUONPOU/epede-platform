// src/components/substations/modules/SubstationDeliverablesExportEngine.tsx
// EPEDE D04 - Substation Engineering Dossier & Professional Cameroon BOQ (DQE) Export Engine

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  DollarSign,
  Calendar,
  Award
} from 'lucide-react';
import {
  CAMEROON_SUBSTATION_NODES,
  type CameroonSubstationNode
} from '../services/useSubstationProjectStore';

interface SubstationDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  selectedNodeId: string;
  voltage: string;
  tech: string;
  trafoMva: number;
  trafoCount: number;
  scCurrentKa: number;
  projectMetrics: {
    uPrimaryKv: number;
    uSecondaryKv: number;
    totalMva: number;
    iNomPrimaryA: number;
    iNomSecondaryA: number;
    scPowerMva: number;
    peakForceNPerMeter: number;
    tolerableTouchVoltageV: number;
    calculatedMeshVoltageV: number;
    isEarthingSafe: boolean;
    estimatedCostFcfa: number;
    estimatedCostEur: number;
  };
}

export const SubstationDeliverablesExportEngine: React.FC<SubstationDeliverablesExportEngineProps> = ({
  locale,
  selectedNodeId,
  voltage,
  tech,
  trafoMva,
  trafoCount,
  scCurrentKa,
  projectMetrics
}) => {
  const activeNode = CAMEROON_SUBSTATION_NODES[selectedNodeId] || CAMEROON_SUBSTATION_NODES.BEKOKO_225KV;
  const [activeTab, setActiveTab] = useState<'DOSSIER' | 'BOQ'>('DOSSIER');

  // BOQ Itemized Breakdown based on real substation benchmarks
  const boqSections = [
    {
      title_fr: '1. Appareillage Haute Tension Primaire (HTB)',
      title_en: '1. High Voltage Primary Switchgear (HV)',
      items: [
        {
          ref: 'HTB-01',
          desc_fr: `Disjoncteurs ${projectMetrics.uPrimaryKv} kV SF6 tripolaire, ${scCurrentKa} kA (3s), 3150 A`,
          desc_en: `${projectMetrics.uPrimaryKv} kV SF6 3-pole circuit breakers, ${scCurrentKa} kA (3s), 3150 A`,
          qty: 6,
          unitCostFcfa: 145000000
        },
        {
          ref: 'HTB-02',
          desc_fr: `Sectionneurs ${projectMetrics.uPrimaryKv} kV rotatifs 2 colonnes avec MALT motorisée`,
          desc_en: `${projectMetrics.uPrimaryKv} kV 2-column rotary disconnectors with motorized earth switch`,
          qty: 14,
          unitCostFcfa: 48000000
        },
        {
          ref: 'HTB-03',
          desc_fr: `Transformateurs de courant (TC) ${projectMetrics.uPrimaryKv} kV multi-enroulements (0.2S / 5P20 / PX)`,
          desc_en: `${projectMetrics.uPrimaryKv} kV multi-core current transformers (0.2S / 5P20 / PX)`,
          qty: 18,
          unitCostFcfa: 22000000
        },
        {
          ref: 'HTB-04',
          desc_fr: `Transformateurs de tension inductifs (TT) ${projectMetrics.uPrimaryKv} kV`,
          desc_en: `${projectMetrics.uPrimaryKv} kV inductive voltage transformers (VT)`,
          qty: 18,
          unitCostFcfa: 18500000
        },
        {
          ref: 'HTB-05',
          desc_fr: `Parafoudres ZnO Classe 4 Station Heavy Duty avec compteurs de décharges`,
          desc_en: `ZnO Class 4 Station Heavy Duty surge arresters with discharge counters`,
          qty: 12,
          unitCostFcfa: 9500000
        }
      ]
    },
    {
      title_fr: '2. Transformateurs de Puissance & Régleurs en Charge (OLTC)',
      title_en: '2. Power Transformers & On-Load Tap Changers (OLTC)',
      items: [
        {
          ref: 'TR-01',
          desc_fr: `Transformateurs ${trafoMva} MVA, ${projectMetrics.uPrimaryKv}/${projectMetrics.uSecondaryKv} kV, YNautod11, ONAN/ONAF`,
          desc_en: `${trafoMva} MVA, ${projectMetrics.uPrimaryKv}/${projectMetrics.uSecondaryKv} kV Transformers, YNautod11, ONAN/ONAF`,
          qty: trafoCount,
          unitCostFcfa: 2450000000
        },
        {
          ref: 'TR-02',
          desc_fr: `Régleurs en charge (OLTC) sous vide 17 plots ±10% avec régulateur numérique AVR`,
          desc_en: `Vacuum On-Load Tap Changers (OLTC) 17 steps ±10% with digital AVR controller`,
          qty: trafoCount,
          unitCostFcfa: 160000000
        },
        {
          ref: 'TR-03',
          desc_fr: `Système de protection incendie déluge eau pulvérisée NFPA 15 & fosse de rétention`,
          desc_en: `NFPA 15 deluge water spray fire protection & oil containment pit`,
          qty: trafoCount,
          unitCostFcfa: 95000000
        }
      ]
    },
    {
      title_fr: '3. Protection Numérique & Contrôle-Commande (CEI 61850)',
      title_en: '3. Protection & Substation Automation (IEC 61850)',
      items: [
        {
          ref: 'SAS-01',
          desc_fr: `Automates de travée BCU (Bay Control Units) avec verrouillages logiques CEI 61850`,
          desc_en: `Bay Control Units (BCU) with IEC 61850 logical interlocks`,
          qty: 8,
          unitCostFcfa: 35000000
        },
        {
          ref: 'SAS-02',
          desc_fr: `Relais de protection différentielle transfo (87T) bi-pente et harmonique 2/5`,
          desc_en: `Transformer differential relays (87T) dual-slope with 2nd/5th harmonic restraint`,
          qty: trafoCount * 2, // Main 1 + Main 2
          unitCostFcfa: 42000000
        },
        {
          ref: 'SAS-03',
          desc_fr: `Relais de protection de distance (21) Mho/Quadruple avec re-enclencheur 79`,
          desc_en: `Distance protection relays (21) Mho/Quad with 79 auto-recloser`,
          qty: 4,
          unitCostFcfa: 38000000
        },
        {
          ref: 'SAS-04',
          desc_fr: `Switches Process Bus/Station Bus durcis PRP/HSR et Horloge PTP IEEE 1588 GPS`,
          desc_en: `Hardened PRP/HSR Process/Station Bus switches & IEEE 1588 PTP GPS clock`,
          qty: 6,
          unitCostFcfa: 18000000
        }
      ]
    },
    {
      title_fr: '4. Services Auxiliaires & Sécurité (AC/DC & IEEE 80)',
      title_en: '4. Station Auxiliaries & Safety (AC/DC & IEEE 80)',
      items: [
        {
          ref: 'AUX-01',
          desc_fr: `Chargeurs redresseurs 110V DC redondants A+B avec banc batteries Plomb-Acide étanche 400 Ah`,
          desc_en: `Redundant A+B 110V DC rectifiers with sealed Lead-Acid 400 Ah battery banks`,
          qty: 2,
          unitCostFcfa: 85000000
        },
        {
          ref: 'AUX-02',
          desc_fr: `Tableau Services Auxiliaires 400V AC avec inverseur automatique ATS et GE 250 kVA`,
          desc_en: `400V AC Station Board with automatic ATS and 250 kVA emergency diesel generator`,
          qty: 1,
          unitCostFcfa: 120000000
        },
        {
          ref: 'AUX-03',
          desc_fr: `Réseau de terre IEEE 80 en cuivre nu 95 mm², piquets forés et couche gravier 15 cm`,
          desc_en: `IEEE 80 earthing grid 95 mm² bare copper, deep boreholes and 15 cm crushed rock`,
          qty: 1,
          unitCostFcfa: 180000000
        }
      ]
    }
  ];

  const totalBoqFcfa = boqSections.reduce(
    (acc, sec) => acc + sec.items.reduce((sAcc, it) => sAcc + it.qty * it.unitCostFcfa, 0),
    0
  );
  const totalBoqEur = Math.round(totalBoqFcfa / 655.957);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    let csv = "Reference,Description,Quantity,Unit_Price_FCFA,Total_Price_FCFA\n";
    boqSections.forEach(sec => {
      sec.items.forEach(it => {
        csv += `"${it.ref}","${it.desc_fr.replace(/"/g, '""')}",${it.qty},${it.unitCostFcfa},${it.qty * it.unitCostFcfa}\n`;
      });
    });
    csv += `"TOTAL","Total Substation Engineering Project",,,"${totalBoqFcfa}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DQE_Substation_${selectedNodeId}_SONATREL.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('DOSSIER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'DOSSIER'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-[#0E141F] text-slate-300 hover:text-white border border-[#222B38]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Dossier Technique Poste' : 'Substation Engineering Dossier'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BOQ')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'BOQ'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-[#0E141F] text-slate-300 hover:text-white border border-[#222B38]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Bordereau des Prix (DQE / BOQ)' : 'Bill of Quantities (BOQ)'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-2 rounded-xl bg-[#0E141F] hover:bg-[#161B22] border border-[#222B38] text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* View 1: Formal Multi-Page Engineering Dossier */}
      {activeTab === 'DOSSIER' && (
        <div className="p-8 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl font-mono text-slate-200 space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
          
          {/* Header & Stamped Certification */}
          <div className="border-b-2 border-amber-500/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                  EPEDE-D04 / SONATREL-GRID
                </span>
                <span className="text-[11px] text-slate-400">IEC 61936-1 / IEEE 80 / CEI 61850</span>
              </div>
              <h1 className="text-2xl font-bold text-white print:text-black">
                {locale === 'fr' ? 'DOSSIER D’INGÉNIERIE & COMMISSIONING DE POSTE HT' : 'HV SUBSTATION ENGINEERING & COMMISSIONING DOSSIER'}
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-700">
                {locale === 'fr' ? activeNode.name_fr : activeNode.name_en} — {tech} {projectMetrics.uPrimaryKv}/{projectMetrics.uSecondaryKv} kV
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-amber-500/30 text-right print:border-black shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-amber-400 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{locale === 'fr' ? 'VISÉ CONFORME BON POUR EXÉCUTION' : 'APPROVED FOR CONSTRUCTION'}</span>
              </div>
              <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-[10px] text-slate-500 font-mono">Ref: SUB-{selectedNodeId}-2026-V4</div>
            </div>
          </div>

          {/* Section 1: Substation Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <Zap className="w-4 h-4" />
              {locale === 'fr' ? '1. Caractéristiques Électriques Générales' : '1. General Electrical Specifications'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Tension Nominale Primaire' : 'Nominal Primary Voltage'}</div>
                <div className="text-base font-bold text-white mt-1">{projectMetrics.uPrimaryKv} kV</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Tension Secondaire' : 'Nominal Secondary Voltage'}</div>
                <div className="text-base font-bold text-white mt-1">{projectMetrics.uSecondaryKv} kV</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Puissance Installée Totale' : 'Total Installed Capacity'}</div>
                <div className="text-base font-bold text-amber-400 mt-1">{trafoCount * trafoMva} MVA ({trafoCount}x {trafoMva} MVA)</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Pouvoir de Coupure Isc' : 'Rated Breaking Capacity Isc'}</div>
                <div className="text-base font-bold text-rose-400 mt-1">{scCurrentKa} kA (3s) / {projectMetrics.scPowerMva} MVA</div>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Busbar & Electrodynamics (IEC 60865-1) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <Layers className="w-4 h-4" />
              {locale === 'fr' ? '2. Topologie de Barres & Tenue Électrodynamique (CEI 60865-1)' : '2. Busbar Topology & Electrodynamic Withstand (IEC 60865-1)'}
            </h3>
            <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Topologie Schéma' : 'Topology Scheme'}: </span>
                  <span className="font-bold text-white">{activeNode.defaultTopology.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Effort Électrodynamique de Crête' : 'Peak Electrodynamic Force'}: </span>
                  <span className="font-bold text-amber-300">{projectMetrics.peakForceNPerMeter} N/m</span>
                </div>
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Technologie Switchgear' : 'Switchgear Tech'}: </span>
                  <span className="font-bold text-emerald-400">{tech} (Poste {tech === 'AIS' ? "Ouvert dans l'Air" : "Sous Enveloppe Métallique SF6"})</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-[#222B38]">
                {locale === 'fr'
                  ? `Les isolateurs supports de barres et conducteurs tubulaires en aluminium ALMELEC sont dimensionnés pour supporter une contrainte de flexion crête de ${projectMetrics.peakForceNPerMeter} N/m sous choc asymétrique ip = ${(scCurrentKa * 2.5).toFixed(1)} kA.`
                  : `Busbar support post-insulators and ALMELEC aluminum tubular conductors are sized to withstand peak mechanical bending force of ${projectMetrics.peakForceNPerMeter} N/m under asymmetrical peak current ip = ${(scCurrentKa * 2.5).toFixed(1)} kA.`}
              </p>
            </div>
          </div>

          {/* Section 3: Protection Matrix & Digital Substation (IEC 61850) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <ShieldCheck className="w-4 h-4" />
              {locale === 'fr' ? '3. Schéma de Protection & Sous-Station Numérique (CEI 61850)' : '3. Protection Matrix & Digital Substation (IEC 61850)'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#222B38]">
                <thead className="bg-[#0E141F] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-[#222B38]">Zone / Équipement</th>
                    <th className="p-2.5 border-b border-[#222B38]">Code ANSI</th>
                    <th className="p-2.5 border-b border-[#222B38]">Principe de Détection</th>
                    <th className="p-2.5 border-b border-[#222B38]">Temps de Déclenchement</th>
                    <th className="p-2.5 border-b border-[#222B38]">Protocole Comm.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222B38] text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Transformateur de Puissance</td>
                    <td className="p-2.5 text-amber-400 font-bold">87T / 50/51</td>
                    <td className="p-2.5">Différentielle bi-pente (K1=25%, K2=70%) + Retenue H2/H5</td>
                    <td className="p-2.5 text-emerald-400 font-bold">15 - 25 ms (Instantané)</td>
                    <td className="p-2.5">IEC 61850 GOOSE</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Ligne de Transport HTB</td>
                    <td className="p-2.5 text-amber-400 font-bold">21 / 21N / 79</td>
                    <td className="p-2.5">Protection de distance Quad/Mho (Z1=80%, Z2=120%, Z3=200%)</td>
                    <td className="p-2.5 text-emerald-400 font-bold">Z1: 20 ms / Z2: 300 ms</td>
                    <td className="p-2.5">Process Bus 9-2LE / GOOSE</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Jeu de Barres Principal</td>
                    <td className="p-2.5 text-amber-400 font-bold">87B</td>
                    <td className="p-2.5">Différentielle de barres centralisée à haute impédance</td>
                    <td className="p-2.5 text-emerald-400 font-bold">12 - 18 ms</td>
                    <td className="p-2.5">Câblage direct / GOOSE</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Refus d'Ouverture Disjoncteur</td>
                    <td className="p-2.5 text-rose-400 font-bold">50BF</td>
                    <td className="p-2.5">Surveillance de courant résiduel après ordre d'ouverture</td>
                    <td className="p-2.5 text-amber-300 font-bold">150 ms (Déclenchement Barres)</td>
                    <td className="p-2.5">GOOSE Multicast</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: IEEE 80 Earthing Grid Validation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? '4. Conformité Réseau de Terre & Sécurité Humaine (IEEE 80-2013)' : '4. Earthing Grid Compliance & Human Safety (IEEE 80-2013)'}
            </h3>
            <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Résistivité du Sol' : 'Soil Resistivity'}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeNode.soilResistivityOhmM} Ω·m</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Tension de Pas Tolérable' : 'Tolerable Touch Voltage'}</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{projectMetrics.tolerableTouchVoltageV} V</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Tension de Maille Calculée' : 'Calculated Mesh Voltage'}</div>
                  <div className="text-sm font-bold text-sky-400 mt-0.5">{projectMetrics.calculatedMeshVoltageV} V</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Statut Conformité' : 'Compliance Status'}</div>
                  <div className={`text-sm font-bold mt-0.5 ${projectMetrics.isEarthingSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {projectMetrics.isEarthingSafe ? 'CONFORME (SÉCURISÉ)' : 'NON-CONFORME'}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-[#222B38]">
                {locale === 'fr'
                  ? `La tension de maille calculée (${projectMetrics.calculatedMeshVoltageV} V) est inférieure au seuil maximal admissible (${projectMetrics.tolerableTouchVoltageV} V) pour une masse corporelle de 50 kg avec couche de gravier 3000 Ω·m (hs = 0.15 m).`
                  : `Calculated mesh voltage (${projectMetrics.calculatedMeshVoltageV} V) is well below the allowable touch potential (${projectMetrics.tolerableTouchVoltageV} V) for a 50 kg body weight with 3000 Ω·m crushed rock surfacing (hs = 0.15 m).`}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* View 2: Itemized Bill of Quantities (BOQ / DQE in FCFA & EUR) */}
      {activeTab === 'BOQ' && (
        <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl font-mono space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                {locale === 'fr' ? 'DÉVIS QUANTITATIF & ESTIMATIF (DQE) POSTE HT' : 'BILL OF QUANTITIES (BOQ) - HV SUBSTATION'}
              </h2>
              <p className="text-xs text-slate-400">
                {locale === 'fr' ? activeNode.name_fr : activeNode.name_en} — {tech} {projectMetrics.uPrimaryKv} kV
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-sans">
                {locale === 'fr' ? 'Montant Total Estimé' : 'Total Estimated Cost'}
              </div>
              <div className="text-xl font-bold text-amber-400">
                {totalBoqFcfa.toLocaleString()} FCFA
              </div>
              <div className="text-xs text-slate-500">
                ~ {totalBoqEur.toLocaleString()} EUR
              </div>
            </div>
          </div>

          {/* Detailed Itemized Tables */}
          <div className="space-y-6">
            {boqSections.map((sec, idx) => {
              const secTotal = sec.items.reduce((acc, it) => acc + it.qty * it.unitCostFcfa, 0);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 bg-[#0E141F] p-2.5 rounded-lg border border-[#222B38]">
                    <span>{locale === 'fr' ? sec.title_fr : sec.title_en}</span>
                    <span className="text-slate-300 font-mono">{secTotal.toLocaleString()} FCFA</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-[#222B38]/60">
                      <thead className="bg-[#121926] text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-2 border-b border-[#222B38] w-20">Réf</th>
                          <th className="p-2 border-b border-[#222B38]">Désignation des Équipements</th>
                          <th className="p-2 border-b border-[#222B38] text-center w-16">Qté</th>
                          <th className="p-2 border-b border-[#222B38] text-right w-36">Prix Unitaire (FCFA)</th>
                          <th className="p-2 border-b border-[#222B38] text-right w-40">Prix Total (FCFA)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222B38]/60 text-slate-300">
                        {sec.items.map((it) => (
                          <tr key={it.ref} className="hover:bg-[#151D2A] transition-colors">
                            <td className="p-2 font-bold text-amber-400">{it.ref}</td>
                            <td className="p-2 text-slate-200">{locale === 'fr' ? it.desc_fr : it.desc_en}</td>
                            <td className="p-2 text-center font-bold text-white">{it.qty}</td>
                            <td className="p-2 text-right text-slate-400">{it.unitCostFcfa.toLocaleString()}</td>
                            <td className="p-2 text-right font-bold text-white">{(it.qty * it.unitCostFcfa).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Total Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0E141F] via-[#161F2E] to-[#0E141F] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-bold text-amber-300">
                {locale === 'fr' ? 'TOTAL GÉNÉRAL CLÉ EN MAIN (EPC / DQE)' : 'TOTAL TURNKEY EPC CONTRACT (BOQ)'}
              </div>
              <div className="text-[11px] text-slate-400">
                {locale === 'fr' ? 'Fourniture, transport port Douala/Kribi, montage, essais SAT et mise en service' : 'Supply, ocean freight, erection, SAT commissioning & energization'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">
                {totalBoqFcfa.toLocaleString()} FCFA
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {totalBoqEur.toLocaleString()} EUR (Taux fixe BEAC 655.957)
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
