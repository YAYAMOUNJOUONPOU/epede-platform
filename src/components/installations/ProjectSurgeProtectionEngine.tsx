// src/components/installations/ProjectSurgeProtectionEngine.tsx
// EPEDE D06 - Low Voltage Surge & Lightning Protection Sizing Engine
// Compliant with IEC 62305, IEC 61643-11, IEC 60364-4-443, and NF C 15-100 §443 & §534

import React, { useState, useMemo } from 'react';
import { InstallationProject } from './data/installationProjectModel';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Info, 
  HelpCircle,
  Building,
  Rss,
  CloudLightning,
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectSurgeProtectionEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Environmental & Exposure Parameters
  // -------------------------------------------------------------------------
  // Keraunic Level (Nk: thunderstorm days per year)
  const [keraunicLevelNk, setKeraunicLevelNk] = useState<number>(25);
  // External Lightning Protection System (LPS / Paratonnerre)
  const [hasExternalLps, setHasExternalLps] = useState<boolean>(
    project.environmentType === 'INDUSTRIAL_MANUFACTURING' || project.environmentType === 'HEALTHCARE_CLINIC'
  );
  // Supply Line Exposure
  const [supplyLineType, setSupplyLineType] = useState<'UNDERGROUND' | 'OVERHEAD'>('UNDERGROUND');
  // Site Environment / Exposure
  const [siteExposure, setSiteExposure] = useState<'URBAN' | 'SUBURBAN' | 'ISOLATED_HILL'>('SUBURBAN');
  // Equipment Sensitivity Level (Impulse Withstand Category per IEC 60364-4-443)
  const [equipmentCategory, setEquipmentCategory] = useState<'CAT_I' | 'CAT_II' | 'CAT_III'>('CAT_II');

  // -------------------------------------------------------------------------
  // 2. Interactive SPD Installation Wiring (50 cm Rule)
  // -------------------------------------------------------------------------
  // Length L1 (Phase busbar to backup disconnector/SPD) in cm
  const [leadL1Cm, setLeadL1Cm] = useState<number>(15);
  // Length L2 (SPD to earth bar / PE) in cm
  const [leadL2Cm, setLeadL2Cm] = useState<number>(20);
  // Selected SPD Model Voltage Protection Level Up (kV)
  const [spdUpKv, setSpdUpKv] = useState<number>(1.5);

  // -------------------------------------------------------------------------
  // 3. Regulatory Sizing & Determination Logic (NF C 15-100 §443 & §534)
  // -------------------------------------------------------------------------
  const spdAssessment = useMemo(() => {
    // Flash density Ng = Nk / 10
    const flashDensityNg = keraunicLevelNk / 10;
    const isHighKeraunic = keraunicLevelNk > 25;

    // Rule 1: LPS presence mandates Type 1 SPD (10/350 µs) at service entrance
    const isType1Mandatory = hasExternalLps;

    // Rule 2: Overhead line in high keraunic zone mandates Type 2 SPD at entrance
    // In low keraunic or underground, Type 2 is recommended for commercial/industrial/safety
    const isType2Mandatory = isType1Mandatory || (supplyLineType === 'OVERHEAD' && isHighKeraunic) || project.environmentType === 'HEALTHCARE_CLINIC';

    // Required Discharge Current:
    let requiredType1Iimp = 0;
    if (isType1Mandatory) {
      requiredType1Iimp = 12.5; // kA per pole (10/350 µs) for Level III/IV LPS, 25 kA for Level I/II
      if (siteExposure === 'ISOLATED_HILL') requiredType1Iimp = 25.0;
    }

    const requiredType2Imax = isHighKeraunic ? 40 : 20; // kA (8/20 µs)
    const requiredType2In = isHighKeraunic ? 20 : 10; // kA (8/20 µs)

    // Equipment Withstand Voltage Uw:
    // Category I (Sensitive electronics/medical): 1.5 kV
    // Category II (Appliances, IT tools, standard equipment): 2.5 kV
    // Category III (Distribution switchgear, busbars, meters): 4.0 kV
    const equipmentUwKv = equipmentCategory === 'CAT_I' ? 1.5 : equipmentCategory === 'CAT_II' ? 2.5 : 4.0;

    // -----------------------------------------------------------------------
    // Lead Length 50 cm Rule Calculation:
    // Inductive voltage drop along leads during 8/20 µs discharge:
    // deltaU ≈ 1 kV / meter (or 0.01 kV / cm)
    // Total effective protection level Up_eff = Up + deltaU(leads)
    // -----------------------------------------------------------------------
    const totalLeadCm = leadL1Cm + leadL2Cm;
    const deltaULeadsKv = Number(((totalLeadCm / 100) * 1.0).toFixed(2));
    const effectiveUpKv = Number((spdUpKv + deltaULeadsKv).toFixed(2));
    const is50CmCompliant = totalLeadCm <= 50;
    const isProtectionEffective = effectiveUpKv <= equipmentUwKv;

    // SPD Mode Configuration depending on Earthing System:
    const isTT = project.supplyContext.earthingSystem === 'TT';
    const spdTopology = isTT 
      ? { mode: '3+1 (CT2)', desc_fr: '3 varistances Ph/N + 1 éclateur N/PE (Évite tout déclenchement intempestif des DDR)', desc_en: '3 Ph/N varistors + 1 N/PE spark gap (Prevents nuisance RCD tripping)' }
      : { mode: '4+0 (CT1)', desc_fr: '4 varistances Ph/PE & N/PE (adapté aux schémas TN-S)', desc_en: '4 varistors Ph/PE & N/PE (standard for TN-S networks)' };

    // Backup Disconnector Sizing:
    const ik3TgbtKa = project.tgbt.shortCircuitIcwKa || 50;
    const backupBreakerRatingA = requiredType2Imax >= 40 ? 50 : 32;

    return {
      flashDensityNg,
      isHighKeraunic,
      isType1Mandatory,
      isType2Mandatory,
      requiredType1Iimp,
      requiredType2Imax,
      requiredType2In,
      equipmentUwKv,
      totalLeadCm,
      deltaULeadsKv,
      effectiveUpKv,
      is50CmCompliant,
      isProtectionEffective,
      spdTopology,
      ik3TgbtKa,
      backupBreakerRatingA
    };
  }, [keraunicLevelNk, hasExternalLps, supplyLineType, siteExposure, equipmentCategory, leadL1Cm, leadL2Cm, spdUpKv, project]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Regulatory Standards                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Protection Contre la Foudre & Surtensions (Parafoudres SPD)' : 'Surge & Lightning Protection Engine (SPD)'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                NF C 15-100 §443 & §534 / IEC 62305
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Dimensionnement rigoureux des parafoudres Type 1 / Type 2 / Type 3, règle des 50 cm, déconnecteur associé et compatibilité SLT.'
                : 'Rigorous sizing of Type 1 / Type 2 / Type 3 SPDs, lead length 50 cm rule, backup disconnector, and earthing compatibility.'}
            </p>
          </div>
        </div>

        {/* Regulatory Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold ${
            spdAssessment.isType1Mandatory 
              ? 'bg-rose-950/40 text-rose-400 border-rose-500/30' 
              : spdAssessment.isType2Mandatory 
              ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
              : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
          }`}>
            <span>
              {spdAssessment.isType1Mandatory 
                ? (isFr ? 'PARAFOUDRE TYPE 1 + 2 OBLIGATOIRE' : 'TYPE 1 + 2 SPD MANDATORY')
                : spdAssessment.isType2Mandatory 
                ? (isFr ? 'PARAFOUDRE TYPE 2 OBLIGATOIRE' : 'TYPE 2 SPD MANDATORY')
                : (isFr ? 'PARAFOUDRE RECOMMANDÉ' : 'SPD RECOMMENDED')}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Environmental & Site Exposure Configuration                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Paramètres d\'Exposition du Site & Bâtiment' : 'Site & Building Exposure Parameters'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* External LPS */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block">{isFr ? 'Paratonnerre (LPS Externe) :' : 'External LPS (Lightning Rod):'}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setHasExternalLps(true)}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  hasExternalLps ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Présent' : 'Installed'}
              </button>
              <button
                onClick={() => setHasExternalLps(false)}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  !hasExternalLps ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Absent' : 'None'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {hasExternalLps ? (isFr ? 'Impressionne Type 1 obligatoire' : 'Mandates Type 1 SPD') : (isFr ? 'Type 2 suffisant' : 'Type 2 standard')}
            </span>
          </div>

          {/* Keraunic Level Nk */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Niveau Kéraunique (Nk) :' : 'Keraunic Level (Nk):'}</span>
              <strong className="text-amber-400">{keraunicLevelNk} j/an</strong>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={keraunicLevelNk}
              onChange={(e) => setKeraunicLevelNk(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Faible (≤25)</span>
              <span>Élevé (&gt;25)</span>
            </div>
          </div>

          {/* Supply Line Infeed */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block">{isFr ? 'Arrivée Électrique :' : 'Infeed Line Exposure:'}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSupplyLineType('UNDERGROUND')}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  supplyLineType === 'UNDERGROUND' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Souterrain' : 'Buried'}
              </button>
              <button
                onClick={() => setSupplyLineType('OVERHEAD')}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  supplyLineType === 'OVERHEAD' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Aérien' : 'Overhead'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {supplyLineType === 'OVERHEAD' ? (isFr ? 'Risque onde propagée' : 'Propagated wave risk') : (isFr ? 'Risque réduit' : 'Attenuated risk')}
            </span>
          </div>

          {/* Equipment Sensitivity Category */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block">{isFr ? 'Sensibilité Récepteurs :' : 'Equipment Sensitivity:'}</span>
            <select
              value={equipmentCategory}
              onChange={(e) => setEquipmentCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-xs"
            >
              <option value="CAT_I">Cat I (Sensible/Médical, Uw=1.5kV)</option>
              <option value="CAT_II">Cat II (Standard/Tertiaire, Uw=2.5kV)</option>
              <option value="CAT_III">Cat III (Armoires/TGBT, Uw=4.0kV)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Tenue diélectrique Uw = {spdAssessment.equipmentUwKv} kV</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. SPD Sizing Matrix & Topology Card                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Type 1 SPD Card */}
        <div className={`border rounded-2xl p-5 shadow-xl space-y-3 font-mono ${
          spdAssessment.isType1Mandatory 
            ? 'bg-slate-900 border-amber-500/50 ring-1 ring-amber-500/30' 
            : 'bg-slate-950/60 border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
              <Zap className="w-4 h-4" />
              <span>Parafoudre Type 1 (T1)</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              spdAssessment.isType1Mandatory ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {spdAssessment.isType1Mandatory ? 'REQUIS' : 'NON REQUIS'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Onde de choc :</span>
              <strong className="text-white">10/350 µs (Coup direct)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Courant Iimp :</span>
              <strong className="text-amber-400">≥ {spdAssessment.requiredType1Iimp || 12.5} kA / pôle</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emplacement :</span>
              <strong className="text-slate-300">Tête d'installation TGBT</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Technologie :</span>
              <strong className="text-cyan-400">Éclateur à étincelles encapsulé</strong>
            </div>
          </div>
        </div>

        {/* Type 2 SPD Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Parafoudre Type 2 (T2)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400">
              STANDARD OBLIGATOIRE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Onde de choc :</span>
              <strong className="text-white">8/20 µs (Surtensions induites)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Courant Imax :</span>
              <strong className="text-cyan-400">≥ {spdAssessment.requiredType2Imax} kA</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Courant In :</span>
              <strong className="text-slate-300">≥ {spdAssessment.requiredType2In} kA</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Niveau de protection Up :</span>
              <strong className="text-emerald-400">≤ 1.5 kV</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Schéma SLT :</span>
              <strong className="text-amber-400">{spdAssessment.spdTopology.mode}</strong>
            </div>
          </div>
        </div>

        {/* Type 3 Fine SPD Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Parafoudre Fin Type 3 (T3)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              RÉCEPTEURS SENSIBLES
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Onde combinée :</span>
              <strong className="text-white">1.2/50 µs - 8/20 µs</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tension Uoc :</span>
              <strong className="text-emerald-400">6 kV à 10 kV</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Niveau Up résiduel :</span>
              <strong className="text-emerald-300">≤ 1.0 kV</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Règle de distance :</span>
              <strong className="text-amber-400">Requis si distance &gt; 10m du T2</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Interactive 50 cm Rule Lead Length Visualizer                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {isFr ? 'Vérification Critique de la Règle des 50 cm (L1 + L2 ≤ 50 cm)' : 'Critical 50 cm Lead Length Rule (L1 + L2 ≤ 50 cm)'}
            </h4>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              {isFr 
                ? 'L\'inductance propre des câbles de raccordement crée une chute inductive ΔU = L × di/dt ≈ 1 kV/m qui s\'ajoute directement au niveau de protection Up.'
                : 'Connection lead self-inductance produces an inductive spike ΔU = L × di/dt ≈ 1 kV/m directly added to the protection level Up.'}
            </p>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto ${
            spdAssessment.is50CmCompliant && spdAssessment.isProtectionEffective
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
          }`}>
            {spdAssessment.is50CmCompliant && spdAssessment.isProtectionEffective ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isFr ? 'CONFORME (L ≤ 50 cm & Up_eff ≤ Uw)' : 'COMPLIANT (L ≤ 50 cm & Up_eff ≤ Uw)'}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>{isFr ? 'NON CONFORME (Surtension destructrice)' : 'NON-COMPLIANT (Destructive overvoltage)'}</span>
              </>
            )}
          </div>
        </div>

        {/* Lead Length Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* L1 Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Longueur L1 (JdB vers Parafoudre) :</span>
              <strong className="text-cyan-400">{leadL1Cm} cm</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={leadL1Cm}
              onChange={(e) => setLeadL1Cm(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* L2 Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Longueur L2 (Parafoudre vers Terre PE) :</span>
              <strong className="text-amber-400">{leadL2Cm} cm</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={leadL2Cm}
              onChange={(e) => setLeadL2Cm(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Real-time Math Synthesis */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Longueur totale L = L1 + L2 :</span>
              <strong className={spdAssessment.totalLeadCm <= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                {spdAssessment.totalLeadCm} cm (Max 50 cm)
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Chute inductive ΔU (1 kV/m) :</span>
              <strong className="text-amber-400">+{spdAssessment.deltaULeadsKv} kV</strong>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1">
              <span className="text-slate-400">Niveau effectif Up_eff (Up + ΔU) :</span>
              <strong className={spdAssessment.effectiveUpKv <= spdAssessment.equipmentUwKv ? 'text-emerald-400' : 'text-rose-400'}>
                {spdAssessment.effectiveUpKv} kV (Tenue Uw = {spdAssessment.equipmentUwKv} kV)
              </strong>
            </div>
          </div>
        </div>

        {/* Warning text if exceeded */}
        {!spdAssessment.is50CmCompliant && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p>
              {isFr
                ? `DÉFAUT D'INSTALLATION : La longueur cumulée des conducteurs de raccordement (${spdAssessment.totalLeadCm} cm) dépasse la limite normative des 50 cm prescrite par la NF C 15-100 §534. La surtension appliquée aux cartes électroniques (${spdAssessment.effectiveUpKv} kV) dépasse leur tenue de choc (${spdAssessment.equipmentUwKv} kV), anéantissant l'efficacité du parafoudre. Action corrective : rapprocher le parafoudre du jeu de barres principal ou opter pour un montage en V (pontage direct).`
                : `INSTALLATION FAULT: Total lead length (${spdAssessment.totalLeadCm} cm) exceeds the 50 cm standard threshold (NF C 15-100 / IEC 60364-5-534). Induced voltage (${spdAssessment.effectiveUpKv} kV) exceeds equipment impulse withstand (${spdAssessment.equipmentUwKv} kV). Corrective action: relocate SPD closer to main busbars or use a V-type pass-through connection.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Backup Disconnector & Earthing Topology Summary                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Déconnecteur Associé & Coordination SLT' : 'Backup Disconnector & Earthing System Coordination'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block font-bold">{isFr ? 'Déconnecteur Associé (Protection Fin de Vie) :' : 'Backup Disconnector:'}</span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? `Disjoncteur courbe C ${spdAssessment.backupBreakerRatingA}A avec pouvoir de coupure Icu ≥ ${spdAssessment.ik3TgbtKa} kA (égal au court-circuit du TGBT). Garantit la séparation en cas de court-circuit interne d'une varistance en fin de vie.`
                : `Curve C ${spdAssessment.backupBreakerRatingA}A MCB with breaking capacity Icu ≥ ${spdAssessment.ik3TgbtKa} kA. Ensures safe fault clearance in case of varistor thermal breakdown.`}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block font-bold">{isFr ? 'Mode de Raccordement selon SLT :' : 'Connection Scheme per Earthing System:'}</span>
            <p className="text-[11px] text-cyan-400 font-bold">
              {spdAssessment.spdTopology.mode} ({project.supplyContext.earthingSystem})
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr ? spdAssessment.spdTopology.desc_fr : spdAssessment.spdTopology.desc_en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
