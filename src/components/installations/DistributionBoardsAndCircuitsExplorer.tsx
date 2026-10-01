// src/components/installations/DistributionBoardsAndCircuitsExplorer.tsx
// EPEDE D06 - Sub-Distribution Boards, Final Circuits, Cables & Containment Systems

import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Sliders,
  ShieldCheck,
  Activity,
  Calculator,
  Compass,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import { InteractiveDistributionBoardRack } from './InteractiveDistributionBoardRack';

interface DistributionBoardsAndCircuitsExplorerProps {
  locale: 'fr' | 'en';
  onSelectEquipment: (equipmentId: string) => void;
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

export const DistributionBoardsAndCircuitsExplorer: React.FC<DistributionBoardsAndCircuitsExplorerProps> = ({
  locale,
  onSelectEquipment,
  onNavigateToWorkbenchTab
}) => {
  // Sub-view tab state
  const [boardViewMode, setBoardViewMode] = useState<'board_rack' | 'cable_sizing' | 'circuits_catalog'>('board_rack');

  // Cable sizing interactive calculator state
  const [calcPowerKw, setCalcPowerKw] = useState<number>(11);
  const [calcLengthM, setCalcLengthM] = useState<number>(45);
  const [calcCosPhi, setCalcCosPhi] = useState<number>(0.85);
  const [calcIsThreePhase, setCalcIsThreePhase] = useState<boolean>(true);
  const [selectedConductor, setSelectedConductor] = useState<'COPPER' | 'ALUMINUM'>('COPPER');

  // Calculations
  const voltage = calcIsThreePhase ? 400 : 230;
  const currentA = calcIsThreePhase
    ? (calcPowerKw * 1000) / (Math.sqrt(3) * voltage * calcCosPhi)
    : (calcPowerKw * 1000) / (voltage * calcCosPhi);

  // Approximate section recommendation based on standard derated ampacity (Table IEC 60364-5-52)
  const getRecommendedSection = (amps: number, material: 'COPPER' | 'ALUMINUM') => {
    if (material === 'COPPER') {
      if (amps <= 15) return 1.5;
      if (amps <= 21) return 2.5;
      if (amps <= 28) return 4.0;
      if (amps <= 36) return 6.0;
      if (amps <= 50) return 10.0;
      if (amps <= 68) return 16.0;
      if (amps <= 89) return 25.0;
      if (amps <= 110) return 35.0;
      if (amps <= 134) return 50.0;
      if (amps <= 171) return 70.0;
      return 95.0;
    } else {
      if (amps <= 26) return 4.0;
      if (amps <= 33) return 6.0;
      if (amps <= 44) return 10.0;
      if (amps <= 59) return 16.0;
      if (amps <= 78) return 25.0;
      if (amps <= 96) return 35.0;
      if (amps <= 117) return 50.0;
      if (amps <= 150) return 70.0;
      return 120.0;
    }
  };

  const recommendedSectionMm2 = getRecommendedSection(currentA, selectedConductor);

  // Voltage drop estimation (Kapp approximation: dU = b * (rho * L/S * cosPhi + X * L * sinPhi) * I)
  const rho = selectedConductor === 'COPPER' ? 0.0225 : 0.036; // ohm.mm²/m at operating temp
  const bFactor = calcIsThreePhase ? Math.sqrt(3) : 2;
  const resistance = (rho * calcLengthM) / recommendedSectionMm2;
  const reactance = 0.00008 * calcLengthM; // typical 0.08 mOhm/m
  const sinPhi = Math.sqrt(Math.max(0, 1 - calcCosPhi * calcCosPhi));
  const deltaUVolts = bFactor * (resistance * calcCosPhi + reactance * sinPhi) * currentA;
  const deltaUPercent = (deltaUVolts / voltage) * 100;
  const isDropAcceptable = deltaUPercent <= (calcIsThreePhase ? 5.0 : 3.0);

  // Typical Final Circuits Catalog
  const circuits = [
    {
      id: 'circ-lighting',
      name_fr: 'Circuit Éclairage Tertiaire LED DALI',
      name_en: 'Commercial LED Lighting DALI',
      section: '1.5 mm² Cuivre (H07V-U)',
      breaker: 'Disjoncteur 10 A ou 16 A Courbe C',
      rcd: 'DDR 30 mA Type AC ou A',
      containment: 'Goulotte PVC ou faux-plafond sur filin',
      power_va: '1200 VA (8 luminaires 45W)',
      max_points: '8 points lumineux max par circuit'
    },
    {
      id: 'circ-sockets',
      name_fr: 'Circuit Prises de Courant Usage Général',
      name_en: 'General Purpose Sockets (PC 16A)',
      section: '2.5 mm² Cuivre (H07V-R)',
      breaker: 'Disjoncteur 16 A ou 20 A Courbe C',
      rcd: 'DDR 30 mA Type A ou F Haute Sensibilité',
      containment: 'Goulotte plinthe ou chemin de câbles perforé',
      power_va: '3680 VA max',
      max_points: '8 prises max par disjoncteur (12 selon NF C 15-100)'
    },
    {
      id: 'circ-it-servers',
      name_fr: 'Circuit Informatique Ondulé Haute Disponibilité',
      name_en: 'Dedicated Clean IT / Server Socket Feeder',
      section: '4.0 mm² ou 6.0 mm² Cuivre',
      breaker: 'Disjoncteur 20 A ou 32 A Courbe C',
      rcd: 'DDR 30 mA Type B ou F Super-Immunisé (SI)',
      containment: 'Chemin de câbles dédié avec écran métallique CEM',
      power_va: '4600 VA par baie serveur',
      max_points: 'Alimentation PDU en double dérivation A+B'
    },
    {
      id: 'circ-hvac-heavy',
      name_fr: 'Circuit Force Motrice Pompe CVC / CTA',
      name_en: 'HVAC Air Handling Unit & Chilled Pump Motor',
      section: '10.0 mm² Cuivre (U-1000 R2V)',
      breaker: 'Disjoncteur 40 A Courbe D (fort appel Id/In)',
      rcd: 'Relais différentiel temporisé réglable 300 mA',
      containment: 'Chemin de câbles en échelle acier galvanisé',
      power_va: '15 000 W (Cos φ 0.86)',
      max_points: 'Départ moteur dédié avec sectionneur de proximité'
    }
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px]">
              SUB-DISTRIBUTION & CIRCUITS
            </span>
            <span className="text-slate-400 text-xs">IEC 60364-5-52 · Câbles & Canalisations</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Tableaux Divisionnaires Modulaires, Circuits & Dimensionnement'
              : 'Sub-Distribution Boards, Final Circuits & Cable Sizing Engine'}
          </h2>
        </div>

        {/* View Switcher: Board Rack vs Cable Sizing vs Circuits Catalog */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080B12] border border-[#1C2538]">
          <button
            type="button"
            onClick={() => setBoardViewMode('board_rack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              boardViewMode === 'board_rack'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Tableau DIN Rail' : 'Modular Board Rack'}</span>
          </button>
          <button
            type="button"
            onClick={() => setBoardViewMode('cable_sizing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              boardViewMode === 'cable_sizing'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Calcul Chute ΔU' : 'Cable Sizing (ΔU)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setBoardViewMode('circuits_catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              boardViewMode === 'circuits_catalog'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Normes Circuits' : 'Circuits Catalog'}</span>
          </button>
        </div>
      </div>

      {/* 1. Sub-View: Physical Modular Board Rack */}
      {boardViewMode === 'board_rack' && (
        <InteractiveDistributionBoardRack
          locale={locale}
          onSelectEquipment={onSelectEquipment}
        />
      )}

      {/* 2. Sub-View: Cable Sizing Engine */}
      {boardViewMode === 'cable_sizing' && (
        <div className="space-y-4">
      {/* Interactive Cable Sizing & Voltage Drop Calculator */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-white">
              {locale === 'fr'
                ? 'Moteur de Calcul Électrotechnique : Courant d\'Emploi & Chute de Tension (ΔU)'
                : 'Electrotechnical Sizing Engine: Operating Current & Voltage Drop (ΔU)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Formule de Kapp : ΔU = b · (R·cosφ + X·sinφ) · I
          </span>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Power Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 block font-bold">
              {locale === 'fr' ? 'Puissance Récepteur (kW) :' : 'Load Power (kW):'}
            </label>
            <input
              type="number"
              min="0.5"
              max="150"
              step="0.5"
              value={calcPowerKw}
              onChange={(e) => setCalcPowerKw(Math.max(0.1, parseFloat(e.target.value) || 1))}
              className="w-full p-2 rounded-lg bg-[#080B12] border border-[#1C2538] text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Length Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 block font-bold">
              {locale === 'fr' ? 'Longueur de Câble (m) :' : 'Cable Length (m):'}
            </label>
            <input
              type="number"
              min="5"
              max="500"
              step="5"
              value={calcLengthM}
              onChange={(e) => setCalcLengthM(Math.max(1, parseInt(e.target.value) || 10))}
              className="w-full p-2 rounded-lg bg-[#080B12] border border-[#1C2538] text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Cos Phi */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 block font-bold">
              {locale === 'fr' ? 'Facteur de Puissance (Cos φ) :' : 'Power Factor (Cos φ):'}
            </label>
            <select
              value={calcCosPhi}
              onChange={(e) => setCalcCosPhi(parseFloat(e.target.value))}
              className="w-full p-2 rounded-lg bg-[#080B12] border border-[#1C2538] text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="1.0">1.00 (Résistif pur / Chauffage)</option>
              <option value="0.95">0.95 (Éclairage LED DALI)</option>
              <option value="0.85">0.85 (Bureaux & Informatique)</option>
              <option value="0.80">0.80 (Moteurs Asynchrones CVC)</option>
            </select>
          </div>

          {/* System Phase */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 block font-bold">
              {locale === 'fr' ? 'Réseau d\'Alimentation :' : 'Supply System:'}
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setCalcIsThreePhase(true)}
                className={`py-2 rounded-lg text-center border font-bold cursor-pointer transition-all text-[10px] ${
                  calcIsThreePhase
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-[#080B12] text-slate-400 border-[#1C2538]'
                }`}
              >
                3P 400V
              </button>
              <button
                type="button"
                onClick={() => setCalcIsThreePhase(false)}
                className={`py-2 rounded-lg text-center border font-bold cursor-pointer transition-all text-[10px] ${
                  !calcIsThreePhase
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-[#080B12] text-slate-400 border-[#1C2538]'
                }`}
              >
                1P 230V
              </button>
            </div>
          </div>

          {/* Conductor Material */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 block font-bold">
              {locale === 'fr' ? 'Âme Conductrice :' : 'Conductor Material:'}
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setSelectedConductor('COPPER')}
                className={`py-2 rounded-lg text-center border font-bold cursor-pointer transition-all text-[10px] ${
                  selectedConductor === 'COPPER'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-[#080B12] text-slate-400 border-[#1C2538]'
                }`}
              >
                Cuivre
              </button>
              <button
                type="button"
                onClick={() => setSelectedConductor('ALUMINUM')}
                className={`py-2 rounded-lg text-center border font-bold cursor-pointer transition-all text-[10px] ${
                  selectedConductor === 'ALUMINUM'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-[#080B12] text-slate-400 border-[#1C2538]'
                }`}
              >
                Aluminium
              </button>
            </div>
          </div>
        </div>

        {/* Calculation Result Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#080B12] border border-[#1C2538]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Courant d'emploi assigné (Ib) :</span>
            <strong className="text-amber-400 text-sm font-black">{currentA.toFixed(1)} A</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Section normalisée recommandée :</span>
            <strong className="text-sky-300 text-sm font-black">{recommendedSectionMm2} mm²</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Chute de tension calculée (ΔU) :</span>
            <strong className={`text-sm font-black ${isDropAcceptable ? 'text-emerald-400' : 'text-rose-400'}`}>
              {deltaUVolts.toFixed(1)} V ({deltaUPercent.toFixed(2)}%)
            </strong>
          </div>
          <div className="flex items-center gap-1.5">
            {isDropAcceptable ? (
              <div className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>CONFORME (Limite ≤ 5% respectée)</span>
              </div>
            ) : (
              <div className="text-rose-400 text-[10px] font-bold flex items-center gap-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>NON CONFORME (Surdimensionner la section)</span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      )}

      {/* 3. Sub-View: Typical Final Circuits Architecture */}
      {boardViewMode === 'circuits_catalog' && (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">
            {locale === 'fr'
              ? 'Classification des Circuits Terminaux & Règles de Protection :'
              : 'Final Circuits Classification & Protection Rules:'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">NF C 15-100 / IEC 60364-4-41</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {circuits.map((circ) => (
            <div
              key={circ.id}
              className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-2 hover:border-amber-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-300">
                  {locale === 'fr' ? circ.name_fr : circ.name_en}
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold">
                  {circ.power_va}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div>
                  <span className="text-slate-400 block text-[9px]">Section Conducteurs :</span>
                  <strong className="text-slate-200">{circ.section}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Protection Surintensité :</span>
                  <strong className="text-sky-300">{circ.breaker}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Protection Différentielle :</span>
                  <strong className="text-emerald-300">{circ.rcd}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Mode de Pose :</span>
                  <strong className="text-slate-200">{circ.containment}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2538] text-[10px] text-slate-400">
                Limite normative : <strong className="text-slate-300">{circ.max_points}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Direct Gateway to Workbench Cable Checks & BOQ */}
      {onNavigateToWorkbenchTab && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300">
              {locale === 'fr'
                ? 'Générer le carnet de câbles complet et vérifier les chutes de tension dans l\'Atelier :'
                : 'Generate full cable schedule and verify voltage drops in the Design Workbench:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToWorkbenchTab('CHECKS_SCHEDULES')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{locale === 'fr' ? '3. Vérifications Câbles & Bordereaux' : '3. Cable Checks & Schedules'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateToWorkbenchTab('BOQ_COSTING')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{locale === 'fr' ? '13. Carnet de Câbles & Chiffrage' : '13. Cable Schedule & BOQ'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
