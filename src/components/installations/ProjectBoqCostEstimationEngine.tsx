// src/components/installations/ProjectBoqCostEstimationEngine.tsx
// EPEDE D06/D07 - Cable Schedule, Bill of Materials (BOM/BOQ) & Cost Estimation Engine
// Automated procurement schedule, copper index weighting, switchgear enumeration, and tender budget breakdown

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  FileSpreadsheet, 
  Layers, 
  DollarSign, 
  Download, 
  Sliders, 
  CheckCircle2, 
  Boxes, 
  Cable, 
  Coins, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectBoqCostEstimationEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // Currency selection
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  // Surcharge / Contingency slider (5% to 25%)
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  // Labor rate per hour (€/h)
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(55);
  // Cable scrap / cutting waste factor (5% to 15%)
  const [cableWasteFactorPercent, setCableWasteFactorPercent] = useState<number>(8);

  // Filter category
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CABLES' | 'SWITCHGEAR' | 'ENCLOSURES' | 'COMPENSATION'>('ALL');

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);

  // -------------------------------------------------------------------------
  // 1. Automated Cable Schedule Aggregation & Drum Calculation
  // -------------------------------------------------------------------------
  const cableSchedule = useMemo(() => {
    // Dictionary to accumulate meters by cable type & cross-section
    const crossSectionMap: Record<string, {
      sectionMm2: number;
      material: 'COPPER' | 'ALUMINUM';
      cores: string;
      totalNetMeters: number;
      estimatedWeightKgPerM: number;
      unitPricePerMeter: number;
      laborHoursPerMeter: number;
    }> = {};

    const registerCable = (
      sectionMm2: number,
      material: 'COPPER' | 'ALUMINUM',
      cores: string,
      lengthMeters: number,
      parallelCores: number = 1
    ) => {
      const key = `${material}_${cores}_${sectionMm2}`;
      const totalLength = lengthMeters * parallelCores;

      // Density calculation: Copper 8.96 g/cm3, Alu 2.7 g/cm3
      const density = material === 'COPPER' ? 0.00896 : 0.0027; // kg/(mm2*m)
      const numConductors = cores.startsWith('4G') || cores.startsWith('3P+N') ? 4 : cores.startsWith('3G') || cores.startsWith('1P+N') ? 3 : 5;
      const weightPerMeter = Number((sectionMm2 * numConductors * density * 1.25).toFixed(3)); // 1.25 for sheath/insulation

      // Realistic baseline material unit price (€/m) based on copper market prices
      let unitPrice = 1.5;
      if (sectionMm2 <= 2.5) unitPrice = 1.6;
      else if (sectionMm2 <= 6) unitPrice = 3.5;
      else if (sectionMm2 <= 16) unitPrice = 8.5;
      else if (sectionMm2 <= 35) unitPrice = 18.0;
      else if (sectionMm2 <= 70) unitPrice = 36.0;
      else if (sectionMm2 <= 150) unitPrice = 75.0;
      else if (sectionMm2 <= 240) unitPrice = 120.0;
      else unitPrice = 160.0;

      if (material === 'ALUMINUM') unitPrice *= 0.55;

      // Labor installation hours per meter (pulling, trays, glands, testing)
      let laborHours = 0.08;
      if (sectionMm2 >= 50) laborHours = 0.22;
      if (sectionMm2 >= 150) laborHours = 0.35;

      if (!crossSectionMap[key]) {
        crossSectionMap[key] = {
          sectionMm2,
          material,
          cores,
          totalNetMeters: 0,
          estimatedWeightKgPerM: weightPerMeter,
          unitPricePerMeter: unitPrice,
          laborHoursPerMeter: laborHours
        };
      }

      crossSectionMap[key].totalNetMeters += totalLength;
    };

    // 1. Incomer connection (Transformer to TGBT link)
    // Typically 25 meters, sized according to incomer rating
    const trafoRating = project.supplyContext.transformerRatingKva;
    const incomerCables = trafoRating >= 1600 ? { sec: 240, par: 3 } : trafoRating >= 1000 ? { sec: 240, par: 2 } : { sec: 240, par: 1 };
    registerCable(incomerCables.sec, 'COPPER', '4G (3P+N+PE)', 25, incomerCables.par);

    // 2. TGBT Feeders to Sub-Distribution Boards
    project.tgbt.feeders.forEach(feeder => {
      registerCable(
        feeder.cableLink.crossSectionMm2,
        feeder.cableLink.conductorMaterial,
        '4G (3P+N+PE)',
        feeder.cableLink.lengthMeters,
        feeder.cableLink.parallelCoresPerPhase
      );
    });

    // 3. Final Terminal Branch Circuits
    project.finalCircuits.forEach(circuit => {
      const cores = circuit.phase === 'THREE_PHASE' ? '5G (3P+N+PE)' : '3G (1P+N+PE)';
      registerCable(
        circuit.conductor.crossSectionMm2,
        circuit.conductor.material,
        cores,
        circuit.conductor.lengthMeters,
        1
      );
    });

    // Convert map to array with gross meters (waste factor) and cost totals
    return Object.values(crossSectionMap).map(c => {
      const grossMeters = Math.round(c.totalNetMeters * (1 + cableWasteFactorPercent / 100));
      const totalWeightKg = Math.round(grossMeters * c.estimatedWeightKgPerM);
      const totalMaterialCost = Math.round(grossMeters * c.unitPricePerMeter);
      const totalLaborHours = Number((grossMeters * c.laborHoursPerMeter).toFixed(1));
      const totalLaborCost = Math.round(totalLaborHours * laborHourlyRate);

      return {
        ...c,
        grossMeters,
        totalWeightKg,
        totalMaterialCost,
        totalLaborHours,
        totalLaborCost,
        totalLineCost: totalMaterialCost + totalLaborCost
      };
    }).sort((a, b) => b.sectionMm2 - a.sectionMm2);
  }, [project, cableWasteFactorPercent, laborHourlyRate]);

  // -------------------------------------------------------------------------
  // 2. Switchgear & Equipment BOQ
  // -------------------------------------------------------------------------
  const equipmentBoq = useMemo(() => {
    const items: Array<{
      category: 'SWITCHGEAR' | 'ENCLOSURES' | 'COMPENSATION';
      code: string;
      designation_fr: string;
      designation_en: string;
      quantity: number;
      unitSupplyCost: number;
      laborHours: number;
    }> = [];

    // Main ACB Incomers
    project.tgbt.incomers.forEach((inc, idx) => {
      items.push({
        category: 'SWITCHGEAR',
        code: `ACB-${inc.ratedCurrentA}A`,
        designation_fr: `Disjoncteur Général Ouvert ${inc.deviceType} ${inc.ratedCurrentA}A 4P Débrochable Icu ${inc.breakingCapacityIcuKa}kA avec Déclencheur Électronique`,
        designation_en: `Air Circuit Breaker ${inc.deviceType} ${inc.ratedCurrentA}A 4P Drawout Icu ${inc.breakingCapacityIcuKa}kA Electronic Trip`,
        quantity: 1,
        unitSupplyCost: inc.ratedCurrentA >= 2500 ? 9500 : inc.ratedCurrentA >= 1600 ? 6800 : 4200,
        laborHours: 12
      });
    });

    // Feeder MCCBs
    project.tgbt.feeders.forEach(feeder => {
      items.push({
        category: 'SWITCHGEAR',
        code: `MCCB-${feeder.protectiveDevice.ratingInA}A`,
        designation_fr: `Disjoncteur Boîtier Moulé MCCB ${feeder.protectiveDevice.ratingInA}A 4P Icu ${feeder.protectiveDevice.breakingCapacityKa}kA (${feeder.name})`,
        designation_en: `Molded Case Circuit Breaker MCCB ${feeder.protectiveDevice.ratingInA}A 4P Icu ${feeder.protectiveDevice.breakingCapacityKa}kA (${feeder.name})`,
        quantity: 1,
        unitSupplyCost: feeder.protectiveDevice.ratingInA >= 400 ? 1650 : feeder.protectiveDevice.ratingInA >= 160 ? 850 : 450,
        laborHours: 3.5
      });
    });

    // Sub-distribution MCBs and RCBOs
    const totalCircuits = project.finalCircuits.length;
    items.push({
      category: 'SWITCHGEAR',
      code: 'MCB-RCBO-PACK',
      designation_fr: `Disjoncteurs divisionnaires modulaires MCB / RCBO courbe C (Lots de départs terminaux)`,
      designation_en: `Modular Miniature Circuit Breakers MCB / RCBO Curve C (Final branch lots)`,
      quantity: totalCircuits,
      unitSupplyCost: 65,
      laborHours: 0.75
    });

    // Automatic Capacitor Bank
    if (project.tgbt.compensationBankKvar > 0) {
      items.push({
        category: 'COMPENSATION',
        code: `CAP-BANK-${project.tgbt.compensationBankKvar}kvar`,
        designation_fr: `Batterie automatique de condensateurs ${project.tgbt.compensationBankKvar} kVAR avec selfs anti-harmoniques 189Hz (SAH)`,
        designation_en: `Automatic Capacitor Bank ${project.tgbt.compensationBankKvar} kVAR with detuned reactors 189Hz`,
        quantity: 1,
        unitSupplyCost: project.tgbt.compensationBankKvar * 38,
        laborHours: 8
      });
    }

    // Type 1+2 Surge Protection (SPD)
    items.push({
      category: 'SWITCHGEAR',
      code: 'SPD-T1-T2',
      designation_fr: `Parafoudre T1+T2 Iimp 12.5kA / Imax 40kA avec déconnecteur associé`,
      designation_en: `Surge Protection Device T1+T2 Iimp 12.5kA / Imax 40kA with backup MCB`,
      quantity: 1,
      unitSupplyCost: 580,
      laborHours: 2.5
    });

    // TGBT Modular Enclosure Columns (Form segregation)
    const columnsCount = Math.max(2, Math.ceil(project.tgbt.feeders.length / 4) + 1);
    items.push({
      category: 'ENCLOSURES',
      code: `TGBT-FORM-${project.tgbt.internalForm.replace(' ', '')}`,
      designation_fr: `Armoire modulaire TGBT ${columnsCount} colonnes en ${project.tgbt.internalForm} IP31/54 avec jeu de barres ${project.tgbt.ratedCurrentBusbarA}A`,
      designation_en: `Modular Switchboard Enclosure ${columnsCount} cubicles in ${project.tgbt.internalForm} IP31/54 with ${project.tgbt.ratedCurrentBusbarA}A Busbar`,
      quantity: columnsCount,
      unitSupplyCost: 3200,
      laborHours: 16
    });

    return items;
  }, [project]);

  // -------------------------------------------------------------------------
  // 3. Overall Financial Roll-Up & Totals
  // -------------------------------------------------------------------------
  const financialSummary = useMemo(() => {
    // Total cable supply & labor
    const totalCableSupply = cableSchedule.reduce((acc, c) => acc + c.totalMaterialCost, 0);
    const totalCableLaborHours = cableSchedule.reduce((acc, c) => acc + c.totalLaborHours, 0);
    const totalCableLaborCost = cableSchedule.reduce((acc, c) => acc + c.totalLaborCost, 0);
    const totalCableMeters = cableSchedule.reduce((acc, c) => acc + c.grossMeters, 0);
    const totalCopperWeightKg = cableSchedule.reduce((acc, c) => acc + c.totalWeightKg, 0);

    // Total equipment supply & labor
    const totalEquipmentSupply = equipmentBoq.reduce((acc, item) => acc + item.quantity * item.unitSupplyCost, 0);
    const totalEquipmentLaborHours = equipmentBoq.reduce((acc, item) => acc + item.quantity * item.laborHours, 0);
    const totalEquipmentLaborCost = totalEquipmentLaborHours * laborHourlyRate;

    // Subtotals
    const totalDirectSupply = totalCableSupply + totalEquipmentSupply;
    const totalLaborHours = totalCableLaborHours + totalEquipmentLaborHours;
    const totalDirectLaborCost = totalCableLaborCost + totalEquipmentLaborCost;
    const totalDirectCost = totalDirectSupply + totalDirectLaborCost;

    // Contingency / Margins
    const contingencyAmount = (totalDirectCost * contingencyPercent) / 100;
    const grandTotalTenderBudget = totalDirectCost + contingencyAmount;

    return {
      totalCableMeters,
      totalCopperWeightKg,
      totalCableSupply,
      totalCableLaborCost,
      totalEquipmentSupply,
      totalEquipmentLaborCost,
      totalDirectSupply,
      totalLaborHours: Math.round(totalLaborHours),
      totalDirectLaborCost: Math.round(totalDirectLaborCost),
      totalDirectCost: Math.round(totalDirectCost),
      contingencyAmount: Math.round(contingencyAmount),
      grandTotalTenderBudget: Math.round(grandTotalTenderBudget)
    };
  }, [cableSchedule, equipmentBoq, laborHourlyRate, contingencyPercent]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Export & Currency Selector                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Carnet de Câbles & Chiffrage Estimatif (BOQ / DQE)' : 'Cable Schedule & Bill of Quantities (BOQ / Costing)'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                Linéaires Câbles & Appareillage TGBT
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Extraction automatique des sections de conducteurs, poids cuivre, appareillage de coupure et chiffrage Fourniture & Pose.'
                : 'Automated extraction of conductor cross-sections, copper weight, switchgear bills, and turnkey supply & install estimates.'}
            </p>
          </div>
        </div>

        {/* Currency Toggle & Parameters */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 flex items-center gap-1">
            {(['EUR', 'USD', 'GBP'] as const).map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded font-bold transition ${
                  currency === curr ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr === 'EUR' ? 'EUR (€)' : curr === 'USD' ? 'USD ($)' : 'GBP (£)'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition font-bold"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Imprimer / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards (Financial & Metric Overview)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Budget Global Estimé (TTC)' : 'Grand Total Budget (Turnkey)'}</span>
          <span className="text-lg font-black text-emerald-400">
            {financialSummary.grandTotalTenderBudget.toLocaleString()} {currencySymbol}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? `Dont marge aléas : +${contingencyPercent}%` : `Incl. contingency: +${contingencyPercent}%`}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Fourniture Matériels' : 'Material Supply Cost'}</span>
          <span className="text-lg font-black text-white">
            {financialSummary.totalDirectSupply.toLocaleString()} {currencySymbol}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? `Câbles : ${financialSummary.totalCableSupply.toLocaleString()} ${currencySymbol}` : `Cables: ${financialSummary.totalCableSupply.toLocaleString()} ${currencySymbol}`}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Main d\'Œuvre & Montage' : 'Labor & Installation'}</span>
          <span className="text-lg font-black text-cyan-400">
            {financialSummary.totalDirectLaborCost.toLocaleString()} {currencySymbol}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {financialSummary.totalLaborHours} {isFr ? 'heures à' : 'hours @'} {laborHourlyRate} {currencySymbol}/h
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Linéaire Total & Cuivre' : 'Total Cable & Copper'}</span>
          <span className="text-lg font-black text-amber-400">
            {financialSummary.totalCableMeters} m
          </span>
          <span className="text-[10px] text-slate-500 block">
            ~{financialSummary.totalCopperWeightKg} kg {isFr ? 'de cuivre estimé' : 'copper weight'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Margins & Labor Rates)                       */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Marge Aléas & Imprévus :' : 'Contingency / Margin:'}</span>
              <strong className="text-emerald-400">+{contingencyPercent}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={contingencyPercent}
              onChange={(e) => setContingencyPercent(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Taux Horaire Monteur / Électricien :' : 'Labor Hourly Rate:'}</span>
              <strong className="text-cyan-400">{laborHourlyRate} {currencySymbol}/h</strong>
            </div>
            <input
              type="range"
              min="35"
              max="95"
              step="5"
              value={laborHourlyRate}
              onChange={(e) => setLaborHourlyRate(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Chutes & Découpes Câbles :' : 'Cable Scrap / Cutting Waste:'}</span>
              <strong className="text-amber-400">+{cableWasteFactorPercent}%</strong>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={cableWasteFactorPercent}
              onChange={(e) => setCableWasteFactorPercent(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Automated Cable Schedule Table View                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isFr ? 'Carnet de Câbles Synthétique par Section (Métrés & Tourets)' : 'Cable Schedule by Cross-Section (Quantities & Drums)'}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">
            {isFr ? `Inclus +${cableWasteFactorPercent}% chutes de tirage` : `Incl. +${cableWasteFactorPercent}% cutting waste`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">{isFr ? 'Section (mm²)' : 'Cross-Section'}</th>
                <th className="p-3">{isFr ? 'Type & Conducteurs' : 'Core Topology'}</th>
                <th className="p-3 text-right">{isFr ? 'Linéaire Brut' : 'Gross Length'}</th>
                <th className="p-3 text-right">{isFr ? 'Poids Cuivre' : 'Copper Weight'}</th>
                <th className="p-3 text-right">{isFr ? 'P.U. Fourniture' : 'Supply Rate'}</th>
                <th className="p-3 text-right">{isFr ? 'Total Fourniture' : 'Supply Total'}</th>
                <th className="p-3 text-right">{isFr ? 'M.O. Pose' : 'Labor Total'}</th>
                <th className="p-3 text-right">{isFr ? 'Total Ligne' : 'Line Total'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cableSchedule.map(c => (
                <tr key={`${c.material}_${c.cores}_${c.sectionMm2}`} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-white">
                    {c.sectionMm2} mm²
                  </td>
                  <td className="p-3 text-slate-300">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 mr-2 text-[10px]">
                      {c.material === 'COPPER' ? 'Cu' : 'Al'}
                    </span>
                    {c.cores}
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-bold">
                    {c.grossMeters} m
                  </td>
                  <td className="p-3 text-right text-amber-400">
                    {c.totalWeightKg} kg
                  </td>
                  <td className="p-3 text-right text-slate-300">
                    {c.unitPricePerMeter.toFixed(2)} {currencySymbol}/m
                  </td>
                  <td className="p-3 text-right font-bold text-white">
                    {c.totalMaterialCost.toLocaleString()} {currencySymbol}
                  </td>
                  <td className="p-3 text-right text-cyan-400">
                    {c.totalLaborCost.toLocaleString()} {currencySymbol} ({c.totalLaborHours}h)
                  </td>
                  <td className="p-3 text-right font-black text-emerald-400">
                    {c.totalLineCost.toLocaleString()} {currencySymbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Switchgear, Switchboards & Enclosures BOQ Table                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isFr ? 'Bordereau Quantitatif Appareillage & Armoires (BOQ Switchgear)' : 'Switchgear, Switchboards & Enclosures BOQ'}
            </h4>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">{isFr ? 'Référence / Code' : 'Ref Code'}</th>
                <th className="p-3">{isFr ? 'Désignation Technique' : 'Technical Designation'}</th>
                <th className="p-3 text-center">{isFr ? 'Qté' : 'Qty'}</th>
                <th className="p-3 text-right">{isFr ? 'P.U. Fourniture' : 'Unit Supply'}</th>
                <th className="p-3 text-right">{isFr ? 'M.O. Unitaire' : 'Unit Labor'}</th>
                <th className="p-3 text-right">{isFr ? 'Total Ligne' : 'Total Price'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {equipmentBoq.map((item, idx) => {
                const lineSupply = item.quantity * item.unitSupplyCost;
                const lineLabor = item.quantity * item.laborHours * laborHourlyRate;
                const totalLine = lineSupply + lineLabor;

                return (
                  <tr key={`${item.code}_${idx}`} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-cyan-400 font-bold">
                      {item.code}
                    </td>
                    <td className="p-3 text-slate-300 text-[11px] font-sans">
                      {isFr ? item.designation_fr : item.designation_en}
                    </td>
                    <td className="p-3 text-center text-white font-bold">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right text-slate-300">
                      {item.unitSupplyCost.toLocaleString()} {currencySymbol}
                    </td>
                    <td className="p-3 text-right text-cyan-400">
                      {Math.round(item.laborHours * laborHourlyRate)} {currencySymbol} ({item.laborHours}h)
                    </td>
                    <td className="p-3 text-right font-black text-emerald-400">
                      {totalLine.toLocaleString()} {currencySymbol}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
