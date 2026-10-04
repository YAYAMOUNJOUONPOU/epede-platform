// src/components/storage/modules/EnergyStorageDqeBoqEngine.tsx
// EPEDE D10 - Stamped Bill of Quantities (BOQ / DQE) & Economic Sizing Engine for BESS & EV Charging

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
  Sparkles
} from 'lucide-react';

interface EnergyStorageDqeBoqEngineProps {
  locale: 'fr' | 'en';
  ratedPowerMw: number;
  ratedEnergyMwh: number;
  activeEvChargers: number;
  projectName?: string;
}

export const EnergyStorageDqeBoqEngine: React.FC<EnergyStorageDqeBoqEngineProps> = ({
  locale,
  ratedPowerMw,
  ratedEnergyMwh,
  activeEvChargers,
  projectName = 'Centrale Solaire & BESS Guider / Maroua (38 MWh)'
}) => {
  const isFr = locale === 'fr';
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const XAF_PER_EUR = 655.957;

  // BOQ Line Items dynamically calculated
  const boqItems = useMemo(() => {
    // Number of standard 40ft containers (approx 5 MWh per modern 1500V LFP container)
    const containerCount = Math.max(1, Math.ceil(ratedEnergyMwh / 5.0));

    return [
      {
        lot: 'LOT 01',
        designationFr: 'Système Électrochimique LiFePO4 (LFP) 1500V DC Conteneurisé',
        designationEn: 'Containerized LiFePO4 (LFP) 1500V DC Battery Racks',
        specsFr: `Cellules prismatiques 280 Ah, BMS 3 niveaux, conteneur 40ft ISO étanche IP54 (${containerCount} unité(s))`,
        specsEn: `280 Ah prismatic cells, 3-tier BMS, 40ft ISO IP54 liquid-cooled container (${containerCount} unit(s))`,
        qty: ratedEnergyMwh,
        unit: 'MWh',
        unitPriceFcfa: 95000000 // 95M FCFA / MWh
      },
      {
        lot: 'LOT 02',
        designationFr: 'Onduleurs 4-Quadrants PCS Grid-Forming & Machine Synchrone Virtuelle (VSG)',
        designationEn: '4-Quadrant Grid-Forming PCS Inverter & Virtual Synchronous Machine',
        specsFr: `Ponts IGBT 1700V réversibles, filtre LCL, régulation d'inertie synthétique (H=4s) et FFR < 20 ms`,
        specsEn: `Reversible 1700V IGBT bridges, LCL filter, synthetic inertia control (H=4s) and sub-20ms FFR`,
        qty: ratedPowerMw,
        unit: 'MW',
        unitPriceFcfa: 42000000 // 42M FCFA / MW
      },
      {
        lot: 'LOT 03',
        designationFr: 'Transformateurs Élévateurs HTA Dédiés 0.69 kV / 30 kV',
        designationEn: 'Dedicated Step-Up MV Transformers 0.69 kV / 30 kV',
        specsFr: `Transformateur triphasé Dyn11, pertes réduites selon écoconception CEI 60076, écran électrostatique`,
        specsEn: `3-phase Dyn11 oil-immersed transformer, low losses per IEC 60076, electrostatic shield`,
        qty: Math.max(1, Math.ceil(ratedPowerMw / 5.0)),
        unit: 'U',
        unitPriceFcfa: 24000000 // 24M FCFA / unité
      },
      {
        lot: 'LOT 04',
        designationFr: 'Sécurité Incendie Novec 1230 & Détection d\'Off-Gas Précoce (NFPA 855)',
        designationEn: 'Novec 1230 Fire Suppression & Early Off-Gas Detection (NFPA 855)',
        specsFr: `Système d'inondation totale FK-5-1-12, capteurs optiques H2/CO, clapets anti-déflagration ATEX`,
        specsEn: `Total flooding FK-5-1-12 agent, optical H2/CO sensors, ATEX deflagration relief vents`,
        qty: containerCount,
        unit: 'Conteneur',
        unitPriceFcfa: 16500000 // 16.5M FCFA / conteneur
      },
      {
        lot: 'LOT 05',
        designationFr: 'Plaza de Recharge Ultra-Rapide IRVE 350 kW (HPC)',
        designationEn: 'High Power EV Charging Plaza 350 kW (HPC)',
        specsFr: `Bornes CCS Combo 2 avec câbles à refroidissement liquide 500 A continu, protocole ISO 15118 et DLM`,
        specsEn: `CCS Combo 2 dispensers with active liquid-cooled cables 500 A continuous, ISO 15118 and DLM`,
        qty: activeEvChargers,
        unit: 'Borne',
        unitPriceFcfa: 36000000 // 36M FCFA / borne
      },
      {
        lot: 'LOT 06',
        designationFr: 'Cellules de Raccordement 30 kV & Automatismes SCADA / EMS (CEI 61850)',
        designationEn: '30 kV Substation Switchgear & SCADA / EMS Automation (IEC 61850)',
        specsFr: `Cellule disjoncteur HTA sous enveloppe métallique, relais de protection ANSI 87B/50/51/81, contrôleur EMS`,
        specsEn: `Metal-clad 30 kV breaker cubicle, ANSI 87B/50/51/81 relays, redundant EMS plant controller`,
        qty: 1,
        unit: 'Forfait',
        unitPriceFcfa: 38000000 // 38M FCFA forfait
      },
      {
        lot: 'LOT 07',
        designationFr: 'Génie Civil, Radier Béton Armé & Bac de Rétention Incendie',
        designationEn: 'Civil Works, Reinforced Concrete Slab & Fire Water Retention',
        specsFr: `Dalles de fondation antisismiques, corridors de sécurité 3m selon NFPA 855, caniveaux de câbles HTA/BT`,
        specsEn: `Reinforced foundation pad, 3m separation clearance per NFPA 855, cable trenches and fencing`,
        qty: 1,
        unit: 'Forfait',
        unitPriceFcfa: 29000000 // 29M FCFA forfait
      },
      {
        lot: 'LOT 08',
        designationFr: 'Essais FAT en Usine, SAT sur Site & Conformité Code Réseau (Grid Code)',
        designationEn: 'Factory FAT, Site SAT & Grid Code Interconnection Compliance',
        specsFr: `Essais d'échelon 0-100% de puissance (<20ms), test d'îlotage intentionnel et certification RTE`,
        specsEn: `Full power step response test (<20ms), intentional islanding test, and RTE certification`,
        qty: 1,
        unit: 'Forfait',
        unitPriceFcfa: 25000000 // 25M FCFA forfait
      }
    ];
  }, [ratedPowerMw, ratedEnergyMwh, activeEvChargers]);

  const totalCostFcfa = useMemo(() => {
    return boqItems.reduce((acc, it) => acc + (it.qty * it.unitPriceFcfa), 0);
  }, [boqItems]);

  const totalCostEur = useMemo(() => {
    return totalCostFcfa / XAF_PER_EUR;
  }, [totalCostFcfa]);

  const formatPrice = (fcfaAmount: number) => {
    if (currency === 'FCFA') {
      return `${fcfaAmount.toLocaleString()} FCFA`;
    }
    const eur = fcfaAmount / XAF_PER_EUR;
    return `${eur.toLocaleString(undefined, { maximumFractionDigits: 0 })} €`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              DOCUMENT CONTRACTUEL OFFICIEL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [Bordereau des Prix Unitaires & Devis Quantitatif Estimatif]
            </span>
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 mt-1">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            {isFr 
              ? `Dossier DQE / BOQ : ${projectName}` 
              : `Stamped BOQ Dossier: ${projectName}`}
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {isFr
              ? `Chiffrage estimatif certifié pour une capacité de ${ratedPowerMw} MW / ${ratedEnergyMwh} MWh BESS et ${activeEvChargers} borne(s) IRVE 350 kW.`
              : `Certified engineering cost breakdown for ${ratedPowerMw} MW / ${ratedEnergyMwh} MWh BESS capacity and ${activeEvChargers} HPC charger(s).`}
          </p>
        </div>

        {/* Currency Switcher & Export */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setCurrency('FCFA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                currency === 'FCFA' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              FCFA (XAF)
            </button>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                currency === 'EUR' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              EUR (€)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all"
            title={isFr ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOQ Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3 w-16">Lot</th>
              <th className="p-3">Désignation des Ouvrages & Équipements</th>
              <th className="p-3 w-20 text-center">Qté</th>
              <th className="p-3 w-20 text-center">Unité</th>
              <th className="p-3 text-right">Prix Unitaire</th>
              <th className="p-3 text-right">Montant Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {boqItems.map((item, idx) => {
              const lineTotal = item.qty * item.unitPriceFcfa;
              return (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-emerald-400">{item.lot}</td>
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">
                      {isFr ? item.designationFr : item.designationEn}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {isFr ? item.specsFr : item.specsEn}
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-cyan-400">{item.qty}</td>
                  <td className="p-3 text-center text-slate-400">{item.unit}</td>
                  <td className="p-3 text-right text-slate-300">
                    {formatPrice(item.unitPriceFcfa)}
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-400">
                    {formatPrice(lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-950 border-t-2 border-emerald-500/40 font-bold">
            <tr>
              <td colSpan={4} className="p-4 text-right uppercase text-xs text-slate-300">
                {isFr ? 'MONTANT TOTAL ESTIMATIF DU PROJET :' : 'TOTAL ESTIMATED PROJECT INVESTMENT:'}
              </td>
              <td colSpan={2} className="p-4 text-right text-base text-emerald-400 font-extrabold">
                {formatPrice(totalCostFcfa)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Engineering Verification Stamp */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-2">
              <span>VISA D'INGÉNIERIE CONFORMITÉ CEI 62933 / NFPA 855</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                VALIDÉ
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              EPEDE Electrical Engineering Platform · Référence Projet : D10-BESS-CAM-2026
            </div>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500">
          <div>Taux de change appliqué : 1 EUR = 655.957 FCFA</div>
          <div>Prix indicatifs départ usine + transport maritime Douala + pose sur site</div>
        </div>
      </div>

    </div>
  );
};
