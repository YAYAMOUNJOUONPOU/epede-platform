// src/components/elv/modules/ElvDeliverablesExportEngine.tsx
// EPEDE D08 - Extra Low Voltage Stamped BOQ/DQE Engineering Deliverables Engine (FCFA / EUR)
// Calibrated to Cameroon High-Profile Building Infrastructure (Hôtels, Hôpitaux, Aérogares, Sièges)

import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Printer,
  Award,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  BuildingTypologyProfile,
  ElvCalculations
} from '../services/useElvProjectStore';

interface ElvDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  profile: BuildingTypologyProfile;
  calculations: ElvCalculations;
  cameraCount: number;
  accessDoorsCount: number;
  ssiLoopsCount: number;
  fiberDistanceKm: number;
  onJumpToStage?: (st: 1 | 2 | 3 | 4 | 5) => void;
}

export const ElvDeliverablesExportEngine: React.FC<ElvDeliverablesExportEngineProps> = ({
  locale,
  profile,
  calculations,
  cameraCount,
  accessDoorsCount,
  ssiLoopsCount,
  fiberDistanceKm
}) => {
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const rateEur = 655.957;

  const formatMoney = (amountFcfa: number) => {
    if (currency === 'FCFA') {
      return `${amountFcfa.toLocaleString('fr-FR')} FCFA`;
    }
    const eur = Math.round(amountFcfa / rateEur);
    return `${eur.toLocaleString('fr-FR')} €`;
  };

  // Itemized BOQ / DQE across 6 specialized lots
  const dqeLots = [
    {
      code: 'LOT-01',
      titleFr: 'Câblage Structuré VDI & Rocades Fibre Optique',
      titleEn: 'Structured Cabling VDI & Optical Fiber Backbone',
      quantity: `${profile.floorsCount} niveaux (${fiberDistanceKm} km fibre)`,
      unitPriceFcfa: 4_800_000,
      totalFcfa: profile.floorsCount * 4_800_000 + Math.round(fiberDistanceKm * 3_200_000),
      standard: 'ISO/IEC 11801 / TIA-568'
    },
    {
      code: 'LOT-02',
      titleFr: 'Vidéosurveillance IP 4MP/4K & Baie NVR RAID 6',
      titleEn: 'IP CCTV 4MP/4K & RAID 6 NVR Storage Server',
      quantity: `${cameraCount} caméras + ${calculations.usableDisksCount} disques 8TB`,
      unitPriceFcfa: 360_000,
      totalFcfa: cameraCount * 360_000 + 4_500_000,
      standard: 'EN 62676-4'
    },
    {
      code: 'LOT-03',
      titleFr: 'Contrôle d’Accès Biométrique, RFID & Sas d’Interverrouillage',
      titleEn: 'Biometric Access Control, RFID & Interlocked Airlocks',
      quantity: `${accessDoorsCount} portes équipées`,
      unitPriceFcfa: 440_000,
      totalFcfa: accessDoorsCount * 440_000,
      standard: 'IEC 60839-11'
    },
    {
      code: 'LOT-04',
      titleFr: 'Système de Sécurité Incendie SSI Cat. A (ECS/CMSI Adressable)',
      titleEn: 'Cat. A Fire Alarm System SSI (Addressable Panel & Loops)',
      quantity: `${ssiLoopsCount} boucles (${ssiLoopsCount * 64} détecteurs)`,
      unitPriceFcfa: 2_400_000,
      totalFcfa: ssiLoopsCount * 2_400_000 + 5_500_000,
      standard: 'EN 54-2 / NF S 61-936'
    },
    {
      code: 'LOT-05',
      titleFr: 'Alimentation Électrique de Sécurité (AES) & Autonomie 72h',
      titleEn: 'Safety Power Supply (AES) & 72h Battery Autonomy',
      quantity: `${calculations.batteryAutonomyAh} Ah (Armoire VRLA)`,
      unitPriceFcfa: 3_800_000,
      totalFcfa: 3_800_000,
      standard: 'EN 54-4'
    },
    {
      code: 'LOT-06',
      titleFr: 'Gestion Technique du Bâtiment (GTB / BACnet-IP & KNX)',
      titleEn: 'Building Management System (BMS / BACnet-IP & KNX)',
      quantity: `${calculations.totalBmsPointsCount} points I/O`,
      unitPriceFcfa: 38_000,
      totalFcfa: calculations.totalBmsPointsCount * 38_000,
      standard: 'ANSI/ASHRAE 135 (BACnet)'
    }
  ];

  const subTotalFcfa = dqeLots.reduce((acc, it) => acc + it.totalFcfa, 0);
  const commissioningTestingFcfa = Math.round(subTotalFcfa * 0.08); // 8% mise en service et recette Fluke
  const documentationDoeFcfa = Math.round(subTotalFcfa * 0.04); // 4% DOE, plans de récolement et formation
  const totalProjectCapExFcfa = subTotalFcfa + commissioningTestingFcfa + documentationDoeFcfa;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `
EPEDE D08 - DOSSIER TECHNIQUE COURANTS FAIBLES & DEVIS ESTIMATIF DQE
Ouvrage : ${profile.nameFr} (Réf. Cameroun : ${profile.cameroonReference})
Surface Bâtie : ${profile.totalAreaM2} m² | Niveaux : ${profile.floorsCount}
Vidéosurveillance IP : ${cameraCount} caméras | Débit Total : ${calculations.totalBandwidthMbps} Mbps | Stockage RAID 6 : ${calculations.totalStorageRaidTb} TB
Contrôle d'Accès : ${accessDoorsCount} portes (Ventouses Fail-Safe & Sas)
Sécurité Incendie SSI Cat. A : ${ssiLoopsCount} boucles (${ssiLoopsCount * 64} détecteurs) | Autonomie AES : ${calculations.batteryAutonomyAh} Ah (72h veille + 30m alarme EN 54-4)
Bilan Puissance PoE : ${calculations.totalPoePowerWatts} W (${calculations.recommendedPoeSwitchesCount} commutateurs 24P PoE+)
Gestion Technique GTB : ${calculations.totalBmsPointsCount} points I/O BACnet/IP
Montant Total Investissement Clé en Main : ${formatMoney(totalProjectCapExFcfa)}
Référentiel : TIA-568.2-D, EN 54, EN 62676-4, IEC 60839-11
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* 1. Header Toolbar */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Dossier d’Ingénierie Courants Faibles & Devis Estimatif DQE' : 'ELV Engineering Dossier & Stamped CapEx BOQ'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Certifié TIA / EN 54
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Synthèse technico-économique complète du lot Courants Faibles, dimensionnements normatifs et bordereau de prix unitaire.'
              : 'Comprehensive techno-economic synthesis of the ELV package, normative equipment sizing, and unit-rate BOQ schedule.'}
          </p>
        </div>

        {/* Currency Toggle & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-xl border border-[#252E38] bg-[#161B22] p-1 text-xs">
            <button
              type="button"
              onClick={() => setCurrency('FCFA')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'FCFA' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              FCFA
            </button>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'EUR' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              EUR (€)
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-[#0E141F] hover:bg-[#141B26] text-slate-300 border border-[#222B38] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <FileCheck className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isCopied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Synthesis Card */}
      <div className="p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              {locale === 'fr' ? 'Fiche Synthèse d’Exécution & Dimensionnement SSI / VDI' : 'Executive Engineering Synthesis & Life-Safety Sizing'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {profile.nameFr.split('(')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Ouvrage de Référence :</span>
            <span className="text-white font-bold">{profile.cameroonReference}</span>
            <div className="text-[10px] text-slate-400 pt-1">
              Surface : {profile.totalAreaM2.toLocaleString('fr-FR')} m² • {profile.floorsCount} niveaux • {profile.occupantsMax} occupants max
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Vidéosurveillance & Stockage :</span>
            <div className="font-bold font-mono text-cyan-300">
              {cameraCount} Caméras IP • {calculations.totalStorageRaidTb} TB RAID 6
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Bande passante totale : {calculations.totalBandwidthMbps} Mbps (H.265+ Smart Codec)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Sécurité Incendie EN 54-4 :</span>
            <span className="text-purple-300 font-bold font-mono">{ssiLoopsCount} Boucles • Batterie {calculations.batteryAutonomyAh} Ah</span>
            <div className="text-[10px] text-slate-400 pt-1">
              Autonomie garantie : 72h veille + 30 min alarme évacuation
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Itemized DQE Table */}
      <div className="p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#222B38]">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Bordereau des Prix Unitaires & Devis Quantitatif Estimatif (DQE)' : 'Bill of Quantities & Estimated Capital Expenditure'}</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Devise : {currency}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#222B38] text-slate-400 text-[10px] uppercase font-bold bg-[#090D14]">
                <th className="py-2.5 px-3">Lot</th>
                <th className="py-2.5 px-3">Désignation des Équipements & Prestations</th>
                <th className="py-2.5 px-3">Quantité / Base</th>
                <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                <th className="py-2.5 px-3 text-right">Montant Total ({currency})</th>
                <th className="py-2.5 px-3 text-center">Norme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222B38]/60">
              {dqeLots.map((item) => (
                <tr key={item.code} className="hover:bg-[#141B26] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">{item.code}</td>
                  <td className="py-2.5 px-3 text-slate-200">
                    <div>{locale === 'fr' ? item.titleFr : item.titleEn}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">{item.quantity}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-400 whitespace-nowrap">
                    {formatMoney(item.unitPriceFcfa)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-white whitespace-nowrap">
                    {formatMoney(item.totalFcfa)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {item.standard}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-3 border-t border-[#222B38] space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Sous-Total Fournitures Matériels HT :</span>
            <span className="font-mono text-white font-bold">{formatMoney(subTotalFcfa)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Essais de Recette Fluke, Étalonnage & Mise en Service (8%) :</span>
            <span className="font-mono text-slate-300">{formatMoney(commissioningTestingFcfa)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Dossier des Ouvrages Exécutés (DOE), Plans & Formation Exploitant (4%) :</span>
            <span className="font-mono text-slate-300">{formatMoney(documentationDoeFcfa)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#222B38] text-sm">
            <span className="font-bold text-white uppercase">Montant Total Lot Courants Faibles Clé en Main (CapEx) :</span>
            <span className="font-mono font-black text-amber-400 text-base">{formatMoney(totalProjectCapExFcfa)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
