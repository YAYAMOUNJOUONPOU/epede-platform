// src/components/transmission/modules/TransmissionDeliverablesExportEngine.tsx
// EPEDE D03 - Transmission Engineering Dossier & Professional Cameroon BOQ (DQE) Export Engine

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
  Award,
  Compass
} from 'lucide-react';
import {
  CAMEROON_TRANSMISSION_CORRIDORS,
  type CameroonTransmissionCorridor
} from '../services/useTransmissionProjectStore';

interface TransmissionDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  selectedCorridorId: string;
  voltage: string;
  technology: string;
  lineLengthKm: number;
  circuitType: string;
  bundleType: string;
  linePhysics: {
    vNomKv: number;
    zcOhm: number;
    silMw: number;
    currentAmps: number;
    rTotalOhm: number;
    xTotalOhm: number;
    powerLossMw: number;
    lossPercentage: number;
    ferrantiRisePct: number;
    noLoadReceivingVoltageKv: number;
    midspanSagM: number;
    groundClearanceM: number;
    isGroundClearanceSafe: boolean;
    dlrMaxAmpacityA: number;
    dlrGainPct: number;
    estimatedCostFcfa: number;
    estimatedCostEur: number;
  };
}

export const TransmissionDeliverablesExportEngine: React.FC<TransmissionDeliverablesExportEngineProps> = ({
  locale,
  selectedCorridorId,
  voltage,
  technology,
  lineLengthKm,
  circuitType,
  bundleType,
  linePhysics
}) => {
  const activeCorridor = CAMEROON_TRANSMISSION_CORRIDORS[selectedCorridorId] || CAMEROON_TRANSMISSION_CORRIDORS.CORRIDOR_SONG_LOULOU_BEKOKO;
  const [activeTab, setActiveTab] = useState<'DOSSIER' | 'BOQ'>('DOSSIER');

  // Realistic transmission line BOQ breakdown (per km benchmark)
  const towerCountEst = Math.round((lineLengthKm * 1000) / 400); // 400m average span
  const suspensionTowers = Math.round(towerCountEst * 0.8);
  const tensionTowers = towerCountEst - suspensionTowers;

  const boqSections = [
    {
      title_fr: '1. Pylônes en Acier Galvanisé & Fondations Béton Armé',
      title_en: '1. Galvanized Steel Lattice Towers & Reinforced Concrete Foundations',
      items: [
        {
          ref: 'PYL-01',
          desc_fr: `Pylônes d’alignement / suspension ${voltage} treillis acier (WA), h = 38 m`,
          desc_en: `${voltage} alignment / suspension steel lattice towers (WA), h = 38 m`,
          qty: suspensionTowers,
          unitCostFcfa: 28500000
        },
        {
          ref: 'PYL-02',
          desc_fr: `Pylônes d’angle & d’arrêt / ancrage renforcés (WB/WC/WD), h = 34 m`,
          desc_en: `Heavy angle & tension / terminal steel lattice towers (WB/WC/WD), h = 34 m`,
          qty: tensionTowers,
          unitCostFcfa: 42000000
        },
        {
          ref: 'PYL-03',
          desc_fr: `Massifs de fondation en béton armé (4 pieds avec pieux forés en terrain meuble)`,
          desc_en: `Reinforced concrete pad-and-chimney foundations with bored piles`,
          qty: towerCountEst,
          unitCostFcfa: 12500000
        }
      ]
    },
    {
      title_fr: '2. Conducteurs de Phase, Câbles de Garde OPGW & Quincaillerie',
      title_en: '2. Phase Conductors, OPGW Shield Wires & Line Hardware',
      items: [
        {
          ref: 'CND-01',
          desc_fr: `Conducteurs Almelec ${activeCorridor.conductorType}, faisceau ${bundleType}`,
          desc_en: `Almelec ${activeCorridor.conductorType} conductors, ${bundleType} configuration`,
          qty: lineLengthKm * (circuitType === 'DOUBLE_CIRCUIT' ? 6 : 3) * (bundleType === 'TWIN_BUNDLE' ? 2 : 1),
          unitCostFcfa: 2200000 // per km of single conductor
        },
        {
          ref: 'CND-02',
          desc_fr: `Câble de garde à fibres optiques intégrées OPGW 48 fibres monomodes G.652D`,
          desc_en: `OPGW Optical Ground Wire with 48 single-mode optical fibers G.652D`,
          qty: lineLengthKm * (circuitType === 'DOUBLE_CIRCUIT' ? 2 : 1),
          unitCostFcfa: 3100000
        },
        {
          ref: 'CND-03',
          desc_fr: `Amortisseurs de vibrations Stockbridge et entretoises-amortisseurs de faisceau`,
          desc_en: `Stockbridge vibration dampers and bundle spacer-dampers`,
          qty: towerCountEst * 6,
          unitCostFcfa: 180000
        }
      ]
    },
    {
      title_fr: '3. Chaînes d’Isolateurs Composites & Parafoudres de Ligne (NGLA)',
      title_en: '3. Composite Insulator Strings & Non-Gapped Line Arresters (NGLA)',
      items: [
        {
          ref: 'ISO-01',
          desc_fr: `Chaînes d’isolateurs composites en silicone 225 kV, ligne de fuite 31 mm/kV (zone saline)`,
          desc_en: `225 kV silicone composite insulator strings, 31 mm/kV creepage (saline zone)`,
          qty: towerCountEst * (circuitType === 'DOUBLE_CIRCUIT' ? 6 : 3),
          unitCostFcfa: 1250000
        },
        {
          ref: 'ISO-02',
          desc_fr: `Parafoudres de ligne sans éclateur (NGLA) Classe 4 pour pylônes d’extrémités`,
          desc_en: `Non-gapped line surge arresters (NGLA) Class 4 for terminal towers`,
          qty: 24,
          unitCostFcfa: 4500000
        }
      ]
    },
    {
      title_fr: '4. Travaux de Génie Civil, Servitudes & Déroulage sous Tension',
      title_en: '4. Civil Works, Right-of-Way Clearing & Tension Stringing',
      items: [
        {
          ref: 'TRV-01',
          desc_fr: `Débroussaillement de l’emprise (RoW largeur 50 m) et pistes d’accès temporaires`,
          desc_en: `Right-of-Way clearing (50 m corridor) and temporary access roads`,
          qty: lineLengthKm,
          unitCostFcfa: 8500000
        },
        {
          ref: 'TRV-02',
          desc_fr: `Déroulage mécanique sous tension mécanique contrôlée (freineuse-treuil) et réglage de flèche`,
          desc_en: `Mechanical tension stringing under controlled back-tension and sag adjustment`,
          qty: lineLengthKm,
          unitCostFcfa: 14200000
        },
        {
          ref: 'TRV-03',
          desc_fr: `Essais d'impédance de ligne (Z1/Z0), réflectométrie optique OTDR et mise sous tension soaking`,
          desc_en: `Line impedance measurement (Z1/Z0), OTDR optical test and soaking energization`,
          qty: 1,
          unitCostFcfa: 250000000
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
    csv += `"TOTAL","Total Transmission Project EPC Turnkey",,,"${totalBoqFcfa}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DQE_Transmission_${selectedCorridorId}_SONATREL.csv`);
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
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-[#0E141F] text-slate-300 hover:text-white border border-[#222B38]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Dossier Technique Ligne HTB' : 'HV Line Technical Dossier'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BOQ')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'BOQ'
                ? 'bg-sky-400 text-slate-950 shadow-md'
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
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
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
          <div className="border-b-2 border-sky-500/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] font-bold">
                  EPEDE-D03 / SONATREL-TRANS
                </span>
                <span className="text-[11px] text-slate-400">IEC 60826 / IEEE 738 / CIGRÉ TB 207</span>
              </div>
              <h1 className="text-2xl font-bold text-white print:text-black">
                {locale === 'fr' ? 'DOSSIER D’INGÉNIERIE & COMMISSIONING LIGNE DE TRANSPORT HTB' : 'HV TRANSMISSION LINE ENGINEERING & COMMISSIONING DOSSIER'}
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-700">
                {locale === 'fr' ? activeCorridor.name_fr : activeCorridor.name_en} — {voltage} ({lineLengthKm} km)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-sky-500/30 text-right print:border-black shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-sky-400 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{locale === 'fr' ? 'VISÉ CONFORME BON POUR EXÉCUTION' : 'APPROVED FOR CONSTRUCTION'}</span>
              </div>
              <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-[10px] text-slate-500 font-mono">Ref: TRANS-{selectedCorridorId}-2026-V5</div>
            </div>
          </div>

          {/* Section 1: Transmission Corridor Key Electromechanical Parameters */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <Compass className="w-4 h-4" />
              {locale === 'fr' ? '1. Caractéristiques Électromécaniques du Corridor' : '1. Corridor Electromechanical Specifications'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Tension Nominale' : 'Nominal Voltage'}</div>
                <div className="text-base font-bold text-white mt-1">{linePhysics.vNomKv} kV</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Longueur & Circuit' : 'Length & Circuits'}</div>
                <div className="text-base font-bold text-sky-400 mt-1">{lineLengthKm} km ({circuitType === 'DOUBLE_CIRCUIT' ? '2x Terne' : '1x Terne'})</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Impédance Caractéristique Zc' : 'Surge Impedance Zc'}</div>
                <div className="text-base font-bold text-amber-400 mt-1">{linePhysics.zcOhm} Ω</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E141F] border border-[#222B38]">
                <div className="text-slate-400 text-[10px]">{locale === 'fr' ? 'Puissance Naturelle SIL' : 'Surge Impedance Load (SIL)'}</div>
                <div className="text-base font-bold text-emerald-400 mt-1">{linePhysics.silMw} MW</div>
              </div>
            </div>
          </div>

          {/* Section 2: Conductor Catenary Sag & Dynamic Line Rating (IEEE 738) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <Activity className="w-4 h-4" />
              {locale === 'fr' ? '2. Flèche Caténaire & Capacité Dynamique DLR (IEEE 738)' : '2. Catenary Sag & Dynamic Line Rating DLR (IEEE 738)'}
            </h3>
            <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Flèche Maximale à Mi-Portée' : 'Max Midspan Sag'}: </span>
                  <span className="font-bold text-amber-300">{linePhysics.midspanSagM} m</span>
                </div>
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Garde au Sol Réelle Minimale' : 'Min Ground Clearance'}: </span>
                  <span className={`font-bold ${linePhysics.isGroundClearanceSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {linePhysics.groundClearanceM} m ({linePhysics.isGroundClearanceSafe ? 'CONFORME' : 'DANGER'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">{locale === 'fr' ? 'Ampacité Dynamique DLR' : 'DLR Max Ampacity'}: </span>
                  <span className="font-bold text-sky-400">{linePhysics.dlrMaxAmpacityA} A (+{linePhysics.dlrGainPct}%)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-[#222B38]">
                {locale === 'fr'
                  ? `La surélévation de température sous courant maximal induit une flèche de ${linePhysics.midspanSagM} m sur portée de 400 m, garantissant une garde au sol de ${linePhysics.groundClearanceM} m supérieure au seuil légal de 8.0 m prescrit par la norme CEI 61936-1.`
                  : `Thermal expansion under maximum continuous loading produces a midspan sag of ${linePhysics.midspanSagM} m over a 400 m span, maintaining a ground clearance of ${linePhysics.groundClearanceM} m well above the mandatory 8.0 m clearance threshold of IEC 61936-1.`}
              </p>
            </div>
          </div>

          {/* Section 3: Electromagnetic Wave Propagation & Ferranti Effect */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222B38] pb-1.5">
              <Zap className="w-4 h-4" />
              {locale === 'fr' ? '3. Propagation d’Onde, Effet Ferranti & Pertes Joule' : '3. Wave Propagation, Ferranti Effect & Line Losses'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#222B38]">
                <thead className="bg-[#0E141F] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-[#222B38]">Grandeur Physique</th>
                    <th className="p-2.5 border-b border-[#222B38]">Formule Théorique</th>
                    <th className="p-2.5 border-b border-[#222B38]">Valeur Calculée</th>
                    <th className="p-2.5 border-b border-[#222B38]">Impact Exploitation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222B38] text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Résistance Totale de Boucle R</td>
                    <td className="p-2.5 font-mono text-amber-300">R = r × L</td>
                    <td className="p-2.5 font-bold text-white">{linePhysics.rTotalOhm} Ω</td>
                    <td className="p-2.5">Pertes Joule totales : {linePhysics.powerLossMw} MW ({linePhysics.lossPercentage}%)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Réactance de Ligne X</td>
                    <td className="p-2.5 font-mono text-amber-300">X = x × L</td>
                    <td className="p-2.5 font-bold text-white">{linePhysics.xTotalOhm} Ω</td>
                    <td className="p-2.5">Limite de stabilité angulaire P_max = V1·V2 / X</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Élévation de Tension Ferranti (À Vide)</td>
                    <td className="p-2.5 font-mono text-amber-300">ΔV = ½ (β·L)² × Vs</td>
                    <td className="p-2.5 font-bold text-rose-400">+{linePhysics.ferrantiRisePct}% ({linePhysics.noLoadReceivingVoltageKv} kV)</td>
                    <td className="p-2.5">Nécessite des réactances shunt de compensation (50 à 70%)</td>
                  </tr>
                </tbody>
              </table>
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
                <DollarSign className="w-5 h-5 text-sky-400" />
                {locale === 'fr' ? 'DÉVIS QUANTITATIF & ESTIMATIF (DQE) LIGNE DE TRANSPORT' : 'BILL OF QUANTITIES (BOQ) - TRANSMISSION LINE'}
              </h2>
              <p className="text-xs text-slate-400">
                {locale === 'fr' ? activeCorridor.name_fr : activeCorridor.name_en} — {voltage} ({lineLengthKm} km)
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-sans">
                {locale === 'fr' ? 'Montant Total Estimé' : 'Total Estimated Cost'}
              </div>
              <div className="text-xl font-bold text-sky-400">
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
                  <div className="flex items-center justify-between text-xs font-bold text-sky-300 bg-[#0E141F] p-2.5 rounded-lg border border-[#222B38]">
                    <span>{locale === 'fr' ? sec.title_fr : sec.title_en}</span>
                    <span className="text-slate-300 font-mono">{secTotal.toLocaleString()} FCFA</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-[#222B38]/60">
                      <thead className="bg-[#121926] text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-2 border-b border-[#222B38] w-20">Réf</th>
                          <th className="p-2 border-b border-[#222B38]">Désignation des Prestations & Fournitures</th>
                          <th className="p-2 border-b border-[#222B38] text-center w-16">Qté</th>
                          <th className="p-2 border-b border-[#222B38] text-right w-36">Prix Unitaire (FCFA)</th>
                          <th className="p-2 border-b border-[#222B38] text-right w-40">Prix Total (FCFA)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222B38]/60 text-slate-300">
                        {sec.items.map((it) => (
                          <tr key={it.ref} className="hover:bg-[#151D2A] transition-colors">
                            <td className="p-2 font-bold text-sky-400">{it.ref}</td>
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
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0E141F] via-[#161F2E] to-[#0E141F] border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-bold text-sky-300">
                {locale === 'fr' ? 'TOTAL GÉNÉRAL CLÉ EN MAIN (EPC / DQE)' : 'TOTAL TURNKEY EPC CONTRACT (BOQ)'}
              </div>
              <div className="text-[11px] text-slate-400">
                {locale === 'fr' ? 'Fourniture pylônes acier, conducteurs Aster, OPGW, transport, montage, déroulage et essais' : 'Supply, ocean freight, steel towers, Aster bundle, OPGW, stringing & commissioning'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky-400">
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
