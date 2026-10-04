// src/components/telecom/modules/TelecomDqeBoqEngine.tsx
// EPEDE D13 - Stamped Bill of Quantities (BOQ / DQE) & Economic Sizing Engine for Utility Telecom & IEC 61850
// Grounded in Sonatrel / RTE / IEEE / IEC Substation Digitalization & Transmission WAN Standards

import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  DollarSign,
  Layers,
  Zap,
  ShieldCheck,
  Building,
  Activity,
  Sparkles,
  Radio,
  Network,
  Clock,
  Cpu
} from 'lucide-react';

interface TelecomDqeBoqEngineProps {
  locale: 'fr' | 'en';
  substationBays?: number;
  opgwLineLengthKm?: number;
  spliceCount?: number;
  redundancyProtocol?: 'PRP' | 'HSR';
  ptpClockType?: string;
  projectName?: string;
}

export const TelecomDqeBoqEngine: React.FC<TelecomDqeBoqEngineProps> = ({
  locale,
  substationBays = 6,
  opgwLineLengthKm = 115,
  spliceCount = 38,
  redundancyProtocol = 'PRP',
  ptpClockType = 'LOCKED_GNSS',
  projectName = 'Poste Numérique 225/90 kV Mangombé & Dorsale OPGW Oyomabang'
}) => {
  const isFr = locale === 'fr';
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const XAF_PER_EUR = 655.957;

  // BOQ Line Items dynamically calculated
  const boqItems = useMemo(() => {
    // Merging units: 1 per bay + 1 busbar protection MU
    const muCount = substationBays + 1;
    // Managed switches: PRP requires dual independent star (2 per bay group + central backbone)
    const switchCount = redundancyProtocol === 'PRP' ? Math.max(4, Math.ceil(substationBays * 1.5)) : Math.max(3, substationBays);
    // Line traps: 2 terminals per line
    const lineTrapSets = 2;

    return [
      {
        lot: 'LOT 01',
        designationFr: 'Commutateurs Ethernet Industriels CEI 61850-3 & IEEE 1613 (RedBox PRP/HSR)',
        designationEn: 'IEC 61850-3 & IEEE 1613 Industrial Ethernet Switches (PRP/HSR RedBox)',
        specsFr: `Ports 10GbE SFP+ optiques, support PTP Transparent Clock IEEE 1588v2, double alimentation 110/220Vcc redondante (${switchCount} unités)`,
        specsEn: `10GbE SFP+ optical ports, IEEE 1588v2 PTP Transparent Clock, dual redundant 110/220Vdc power supplies (${switchCount} units)`,
        qty: switchCount,
        unit: 'Unité',
        unitPriceFcfa: 4800000 // 4.8M FCFA / switch durci
      },
      {
        lot: 'LOT 02',
        designationFr: 'Horloges PTP Grandmaster IEEE 1588v2 / CEI 61850-9-3 avec Oscillateur Rubidium',
        designationEn: 'IEEE 1588v2 / IEC 61850-9-3 PTP Grandmaster Clocks with Rubidium Oscillator',
        specsFr: `Récepteur multi-constellation GNSS (GPS/Galileo), dérive holdover < 1 μs/24h, sorties IRIG-B, 1PPS et PTP Telecom/Power Profile`,
        specsEn: `Multi-constellation GNSS receiver (GPS/Galileo), holdover drift < 1 μs/24h, IRIG-B, 1PPS and PTP Telecom/Power Profile outputs`,
        qty: 2, // Redundant pair Master/Standby
        unit: 'Paire',
        unitPriceFcfa: 9500000 // 9.5M FCFA / unité
      },
      {
        lot: 'LOT 03',
        designationFr: 'Boîtiers Merging Units (SAMU / NCIT) pour Bus de Processus CEI 61869-9 / 9-2LE',
        designationEn: 'Stand-Alone Merging Units (SAMU / NCIT) for IEC 61869-9 / 9-2LE Process Bus',
        specsFr: `Numérisation 80 et 256 éch./période, 4 courants + 4 tensions, timestamping matériel PTP < 100 ns, boîtier IP65 pour pied de charpente`,
        specsEn: `80 and 256 samples/cycle digitizing, 4 currents + 4 voltages, hardware PTP timestamping < 100 ns, outdoor IP65 enclosure`,
        qty: muCount,
        unit: 'Baie',
        unitPriceFcfa: 6200000 // 6.2M FCFA / MU
      },
      {
        lot: 'LOT 04',
        designationFr: 'Câble de Garde à Fibres Optiques (OPGW) 48 FO ITU-T G.652D & Accessoires',
        designationEn: '48-Fiber ITU-T G.652D Optical Ground Wire (OPGW) & Hardware Accessories',
        specsFr: `Câble mixte garde/télécom 48 fibres monomodes, tube inox étanche central, armure alliage d'aluminium, tension de rupture > 75 kN`,
        specsEn: `Composite ground/telecom cable 48 SM fibers, hermetic central stainless tube, aluminum-alloy armor, breaking load > 75 kN`,
        qty: opgwLineLengthKm,
        unit: 'km',
        unitPriceFcfa: 4200000 // 4.2M FCFA / km fourni-posé
      },
      {
        lot: 'LOT 05',
        designationFr: 'Équipements Courants Porteurs en Ligne (CPL / PLC) & Selfs d\'Arrêt (Line Traps)',
        designationEn: 'Power Line Carrier (PLC) Transceivers & Line Traps (400Ω, 1250A)',
        specsFr: `Selfs d'arrêt de ligne 1250 A / 0.5 mH, condensateurs de couplage 225 kV 4400 pF, filtres d'accord et émetteurs-récepteurs CPL numériques 40-500 kHz`,
        specsEn: `Line traps 1250 A / 0.5 mH, 225 kV coupling capacitors 4400 pF, line tuners, and digital PLC transceivers 40-500 kHz`,
        qty: lineTrapSets,
        unit: 'Extrémité',
        unitPriceFcfa: 14500000 // 14.5M FCFA / extrémité
      },
      {
        lot: 'LOT 06',
        designationFr: 'Passerelles Téléconduite RTU / SCADA & Cybersécurité CEI 62351',
        designationEn: 'SCADA RTU Telecontrol Gateways & IEC 62351 Cybersecurity Security Appliances',
        specsFr: `Conversion CEI 61850 MMS vers CEI 60870-5-104 et DNP3, pare-feu durci avec inspection profonde (DPI) pour GOOSE et SV, VPN IPSec matériel`,
        specsEn: `IEC 61850 MMS to IEC 60870-5-104 & DNP3 conversion, ruggedized deep packet inspection (DPI) firewall for GOOSE/SV, hardware IPSec VPN`,
        qty: 2, // Redundant pair
        unit: 'Ensemble',
        unitPriceFcfa: 12000000 // 12M FCFA / ensemble
      },
      {
        lot: 'LOT 07',
        designationFr: 'Infrastructures Baies 19", Câblage Optique Blindé MPO/LC & Alimentation 48Vdc',
        designationEn: '19" Telecom Racks, Ruggedized MPO/LC Armored Fiber Cabling & 48Vdc Power',
        specsFr: `Baies climatisées 42U avec PDU redondant, tiroirs optiques ODF haute densité, jarretières armées anti-rongeurs et redresseur/chargeur 48Vcc avec batteries`,
        specsEn: `Climate-controlled 42U racks with redundant PDU, high-density ODF drawers, armored rodent-proof patch cords, 48Vdc rectifier & battery bank`,
        qty: 1,
        unit: 'Forfait',
        unitPriceFcfa: 18500000 // 18.5M FCFA forfait
      },
      {
        lot: 'LOT 08',
        designationFr: 'Essais FAT Plateforme, Recette SAT, Réflectométrie OTDR & Certification UCA IUG',
        designationEn: 'Factory FAT, Site SAT, OTDR Reflectometry & IEC 61850 UCA IUG Commissioning',
        specsFr: `Tests de tempête GOOSE (< 3 ms), qualification PTP time drift, réflectométrie bidirectionnelle OTDR 1310/1550 nm, et validation interopérabilité multi-constructeurs`,
        specsEn: `GOOSE storm tests (< 3 ms), PTP time drift verification, dual-wavelength bidirectional OTDR testing, and multi-vendor interoperability sign-off`,
        qty: 1,
        unit: 'Forfait',
        unitPriceFcfa: 15000000 // 15M FCFA forfait
      }
    ];
  }, [substationBays, opgwLineLengthKm, spliceCount, redundancyProtocol]);

  const totalCostFcfa = useMemo(() => {
    return boqItems.reduce((acc, item) => acc + item.qty * item.unitPriceFcfa, 0);
  }, [boqItems]);

  const totalCostEur = useMemo(() => {
    return totalCostFcfa / XAF_PER_EUR;
  }, [totalCostFcfa]);

  const formatPrice = (valFcfa: number) => {
    if (currency === 'EUR') {
      const valEur = valFcfa / XAF_PER_EUR;
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valEur);
    }
    return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(valFcfa) + ' FCFA';
  };

  const handleExportCsv = () => {
    const headers = isFr
      ? 'Lot;Designation;Spécifications Techniques;Quantité;Unité;Prix Unitaire (FCFA);Prix Total (FCFA);Prix Total (EUR)\n'
      : 'Lot;Item Description;Technical Specifications;Quantity;Unit;Unit Price (FCFA);Total Price (FCFA);Total Price (EUR)\n';

    const rows = boqItems.map(item => {
      const totFcfa = item.qty * item.unitPriceFcfa;
      const totEur = (totFcfa / XAF_PER_EUR).toFixed(2);
      const des = isFr ? item.designationFr : item.designationEn;
      const spec = isFr ? item.specsFr : item.specsEn;
      return `"${item.lot}";"${des.replace(/"/g, '""')}";"${spec.replace(/"/g, '""')}";${item.qty};"${item.unit}";${item.unitPriceFcfa};${totFcfa};${totEur}`;
    }).join('\n');

    const totalRow = `\n"TOTAL";"TOTAL PROJET DQE";"";"";"";;${totalCostFcfa};${totalCostEur.toFixed(2)}`;
    const blob = new Blob(['\uFEFF' + headers + rows + totalRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DQE_Telecom_CEI61850_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-100 font-sans shadow-2xl">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {isFr ? 'DEVIS QUANTITATIF ESTIMATIF (DQE / BOQ)' : 'BILL OF QUANTITIES (BOQ / ESTIMATE)'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CEI 61850-3 / IEEE 1613
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-teal-400" />
            {isFr ? 'Bordereau des Prix & Chiffrage Télécom & Poste Numérique' : 'Telecom & Digital Substation Pricing Schedule & BOQ'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFr ? 'Affaire de Référence :' : 'Reference Project:'} <span className="text-teal-300 font-mono font-semibold">{projectName}</span>
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* CURRENCY TOGGLE */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrency('FCFA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'FCFA' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              FCFA (XAF)
            </button>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'EUR' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              EUR (€)
            </button>
          </div>

          {/* EXPORT CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            {isFr ? 'Exporter CSV' : 'Export CSV'}
          </button>

          {/* PRINT */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            {isFr ? 'Imprimer / PDF' : 'Print / PDF'}
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            {isFr ? 'Montant Total Estimé HT' : 'Total Estimated Cost'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-teal-400 font-mono mt-1">
            {formatPrice(totalCostFcfa)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isFr ? 'Parité fixe 1 EUR = 655,957 XAF' : 'Fixed parity 1 EUR = 655.957 XAF'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            {isFr ? 'Ratio Télécom / km OPGW' : 'Telecom Ratio / km OPGW'}
          </span>
          <div className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
            {formatPrice(totalCostFcfa / Math.max(1, opgwLineLengthKm))} / km
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isFr ? `Sur ${opgwLineLengthKm} km de ligne HTB` : `Over ${opgwLineLengthKm} km HV line`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            {isFr ? 'Architecture LAN Poste' : 'Substation LAN Architecture'}
          </span>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            {redundancyProtocol} Dual Star
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isFr ? `${substationBays} travées équipées en bus process` : `${substationBays} bays with process bus`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            {isFr ? 'Niveau de Synchronisation' : 'Synchronization Level'}
          </span>
          <div className="text-lg sm:text-xl font-bold text-blue-400 font-mono mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            PTP 1588v2 Sub-μs
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isFr ? 'Horloge Rubidium de secours' : 'Rubidium holdover backup'}
          </span>
        </div>
      </div>

      {/* BOQ TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3 w-16">{isFr ? 'Lot' : 'Lot'}</th>
              <th className="py-3 px-4">{isFr ? 'Désignation des Équipements & Travaux' : 'Item Description & Scope'}</th>
              <th className="py-3 px-3 text-center w-16">{isFr ? 'Qté' : 'Qty'}</th>
              <th className="py-3 px-2 text-center w-20">{isFr ? 'Unité' : 'Unit'}</th>
              <th className="py-3 px-4 text-right w-36">{isFr ? 'P.U. Estimatif' : 'Unit Price'}</th>
              <th className="py-3 px-4 text-right w-40 text-teal-400">{isFr ? 'Total Montant' : 'Total Amount'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {boqItems.map((item, idx) => {
              const rowTotal = item.qty * item.unitPriceFcfa;
              return (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-teal-400">{item.lot}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {isFr ? item.designationFr : item.designationEn}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {isFr ? item.specsFr : item.specsEn}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-white">{item.qty}</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">{item.unit}</td>
                  <td className="py-3.5 px-4 text-right text-slate-300">
                    {formatPrice(item.unitPriceFcfa)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-teal-300">
                    {formatPrice(rowTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900/90 border-t-2 border-teal-500/40 font-bold text-sm">
              <td colSpan={4} className="py-4 px-4 text-right font-sans uppercase tracking-wider text-slate-300">
                {isFr ? 'Montant Total Estimatif (HT) :' : 'Total Estimated Capex (excl. VAT):'}
              </td>
              <td colSpan={2} className="py-4 px-4 text-right text-base sm:text-lg font-black text-teal-400">
                {formatPrice(totalCostFcfa)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OFFICIAL TECHNICAL STAMP / VISA */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white uppercase tracking-wider">
              {isFr ? 'Visa & Approbation Technique Ingénieur Télécom Réseau' : 'Utility Telecom & OT Lead Engineer Stamp & Approval'}
            </div>
            <div className="text-slate-400 text-[11px]">
              {isFr 
                ? 'Conforme spécifications SONATREL / Eneo / CEI 61850-3 / IEEE 1613 Classe 2'
                : 'Compliant with SONATREL / Eneo / IEC 61850-3 / IEEE 1613 Class 2 standards'}
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <div>Ref: EPEDE-D13-BOQ-{new Date().getFullYear()}</div>
          <div className="text-teal-400 font-bold">STATUS: VALIDÉ POUR CONSULTATION DQE</div>
        </div>
      </div>
    </div>
  );
};
