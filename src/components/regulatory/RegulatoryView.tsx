// src/components/regulatory/RegulatoryView.tsx
// EPEDE Layer L06: Geographic & Regulatory Context, Power Sector Governance,
// Cameroon National Grid Code, Electricity Law 2011/022, Tariffs and Regional Interconnections (PEAC/WAPP).

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Building2,
  FileText,
  Zap,
  Globe,
  Compass,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  Check,
  Activity,
  Layers,
  MapPin,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  REGULATORY_INSTITUTIONS,
  CAMEROON_GRID_CODE_RULES,
  CAMEROON_UFLS_STAGES,
  ARSEL_TARIFF_FRAMEWORK,
  REGIONAL_INTERCONNECTION_PROJECTS,
  ENVIRONMENTAL_RIGHT_OF_WAYS,
  type RegulatoryInstitution,
  type GridCodeRule,
  type TariffCategory
} from '../../data/regulatoryData';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface RegulatoryViewProps {
  locale: 'fr' | 'en';
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateStandards?: () => void;
  onNavigateContextStack?: (nodeId?: string) => void;
}

type TabKey = 'overview' | 'institutions' | 'grid-code' | 'tariffs' | 'regional' | 'environment';

export const RegulatoryView: React.FC<RegulatoryViewProps> = ({
  locale,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateCameroonGrid,
  onNavigateStandards,
  onNavigateContextStack
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedInstCode, setSelectedInstCode] = useState<string>('ARSEL');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  
  // Interactive Grid Code Compliance Checker State
  const [testVoltageLevel, setTestVoltageLevel] = useState<'225' | '90' | '30'>('225');
  const [testMeasuredVoltage, setTestMeasuredVoltage] = useState<number>(221);
  const [testFrequency, setTestFrequency] = useState<number>(49.92);
  const [testCosPhi, setTestCosPhi] = useState<number>(0.92);
  const [testThd, setTestThd] = useState<number>(1.6);

  // Interactive Tariff Estimator State (MV Industrial Profile)
  const [subscribedKw, setSubscribedKw] = useState<number>(500);
  const [peakKwh, setPeakKwh] = useState<number>(25000);
  const [dayKwh, setDayKwh] = useState<number>(65000);
  const [nightKwh, setNightKwh] = useState<number>(30000);
  const [industrialCosPhi, setIndustrialCosPhi] = useState<number>(0.86);

  // Selected Institution
  const activeInstitution = useMemo(() => {
    return REGULATORY_INSTITUTIONS.find(i => i.code === selectedInstCode) || REGULATORY_INSTITUTIONS[0];
  }, [selectedInstCode]);

  // Grid Code Compliance Evaluation
  const complianceResults = useMemo(() => {
    // 1. Voltage check
    let nominalV = 225;
    let minNormV = 202.5;
    let maxNormV = 247.5;
    let minExcV = 190.0;
    let maxExcV = 253.0;
    let thdLimit = 2.0;

    if (testVoltageLevel === '90') {
      nominalV = 90;
      minNormV = 81.0;
      maxNormV = 99.0;
      minExcV = 76.5;
      maxExcV = 100.0;
      thdLimit = 3.0;
    } else if (testVoltageLevel === '30') {
      nominalV = 30;
      minNormV = 28.5;
      maxNormV = 31.5;
      minExcV = 27.0;
      maxExcV = 33.0;
      thdLimit = 5.0;
    }

    const voltDeviationPct = ((testMeasuredVoltage - nominalV) / nominalV) * 100;
    let voltStatus: 'NORMAL' | 'EXCEPTIONAL' | 'VIOLATION' = 'NORMAL';
    if (testMeasuredVoltage < minExcV || testMeasuredVoltage > maxExcV) {
      voltStatus = 'VIOLATION';
    } else if (testMeasuredVoltage < minNormV || testMeasuredVoltage > maxNormV) {
      voltStatus = 'EXCEPTIONAL';
    }

    // 2. Frequency check
    let freqStatus: 'NORMAL' | 'ALERT' | 'UFLS' | 'CRITICAL' = 'NORMAL';
    if (testFrequency >= 49.50 && testFrequency <= 50.50) {
      freqStatus = 'NORMAL';
    } else if (testFrequency >= 49.00 && testFrequency < 49.50) {
      freqStatus = 'ALERT';
    } else if (testFrequency < 49.00 && testFrequency >= 47.80) {
      freqStatus = 'UFLS';
    } else {
      freqStatus = 'CRITICAL';
    }

    // 3. Power factor & tan phi
    const tanPhi = testCosPhi > 0 ? Math.tan(Math.acos(Math.min(1, Math.max(0.1, testCosPhi)))) : 0;
    const isReactivePenalty = tanPhi > 0.40;

    // 4. THD check
    const isThdCompliant = testThd <= thdLimit;

    return {
      nominalV,
      voltDeviationPct,
      voltStatus,
      freqStatus,
      tanPhi,
      isReactivePenalty,
      thdLimit,
      isThdCompliant,
      allPassed: voltStatus === 'NORMAL' && freqStatus === 'NORMAL' && !isReactivePenalty && isThdCompliant
    };
  }, [testVoltageLevel, testMeasuredVoltage, testFrequency, testCosPhi, testThd]);

  // Tariff Billing Calculation
  const tariffBill = useMemo(() => {
    const fixedChargeRate = 3750; // FCFA / kW
    const dayRate = 70; // FCFA / kWh
    const peakRate = 85; // FCFA / kWh
    const nightRate = 55; // FCFA / kWh
    const reactiveRate = 14.5; // FCFA / kvarh excédentaire

    const fixedCost = subscribedKw * fixedChargeRate;
    const energyDayCost = dayKwh * dayRate;
    const energyPeakCost = peakKwh * peakRate;
    const energyNightCost = nightKwh * nightRate;
    const totalEnergyCost = energyDayCost + energyPeakCost + energyNightCost;

    const totalActiveKwh = dayKwh + peakKwh + nightKwh;
    const tanPhi = industrialCosPhi > 0 ? Math.tan(Math.acos(Math.min(1, Math.max(0.1, industrialCosPhi)))) : 0;
    const totalReactiveKvarh = totalActiveKwh * tanPhi;
    const allowedReactiveKvarh = totalActiveKwh * 0.40;
    const excessReactiveKvarh = Math.max(0, totalReactiveKvarh - allowedReactiveKvarh);
    const reactivePenaltyCost = excessReactiveKvarh * reactiveRate;

    const subtotalHt = fixedCost + totalEnergyCost + reactivePenaltyCost;
    const vatRate = 0.1925; // 19.25%
    const vatAmount = subtotalHt * vatRate;
    const totalTtc = subtotalHt + vatAmount;

    // Potential savings if power factor corrected to 0.95 (tan phi = 0.33)
    const potentialSaving = reactivePenaltyCost * (1 + vatRate);

    return {
      fixedCost,
      energyDayCost,
      energyPeakCost,
      energyNightCost,
      totalEnergyCost,
      totalActiveKwh,
      tanPhi,
      excessReactiveKvarh,
      reactivePenaltyCost,
      subtotalHt,
      vatAmount,
      totalTtc,
      potentialSaving
    };
  }, [subscribedKw, peakKwh, dayKwh, nightKwh, industrialCosPhi]);

  // Filtered Grid Code Rules
  const filteredGridCodeRules = useMemo(() => {
    if (selectedDomainFilter === 'ALL') return CAMEROON_GRID_CODE_RULES;
    return CAMEROON_GRID_CODE_RULES.filter(r => r.domain_code === selectedDomainFilter);
  }, [selectedDomainFilter]);

  // JSON Export for Engineering Dossier
  const handleExportRegulatoryDossier = () => {
    const dossier = {
      export_date: new Date().toISOString(),
      framework: "EPEDE Layer L06 - Cameroon Geographic, Legal & Regulatory Framework",
      applicable_law: "Loi N° 2011/022 du 14 décembre 2011 régissant le secteur de l'électricité au Cameroun",
      institutions: REGULATORY_INSTITUTIONS,
      grid_code_rules: CAMEROON_GRID_CODE_RULES,
      ufls_defense_plan: CAMEROON_UFLS_STAGES,
      tariff_framework: ARSEL_TARIFF_FRAMEWORK,
      regional_interconnections: REGIONAL_INTERCONNECTION_PROJECTS,
      environmental_servitudes: ENVIRONMENTAL_RIGHT_OF_WAYS,
      last_simulation_compliance: complianceResults
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EPEDE-L06-Regulatory-Framework-Cameroon.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 p-6 lg:p-8 border border-slate-800 shadow-xl cad-grid-dense">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-xs">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-300 tracking-wider uppercase bg-amber-500/15 px-2 py-0.5 rounded border border-amber-400/40">
                    LAYER L06 · CADRE RÉGLEMENTAIRE & ÉCOSYSTÈME
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    Loi 2011/022 · ARSEL · SONATREL
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-1 font-mono uppercase">
                  {locale === 'fr'
                    ? 'Gouvernance, Code de Réseau & Écosystème Institutionnel'
                    : 'Governance, Grid Code & Regulatory Ecosystem'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateContextStack && (
                <button
                  type="button"
                  onClick={() => onNavigateContextStack('node-line-225-bekoko')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-mono font-bold text-white transition-all shadow-xs"
                >
                  <Zap className="h-3.5 w-3.5 text-sky-200" />
                  <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleExportRegulatoryDossier}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-amber-300 border border-slate-800 hover:border-amber-400 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Exporter Dossier Réglementaire (JSON)' : 'Export Regulatory Dossier (JSON)'}</span>
              </button>
              {onNavigateCameroonGrid && (
                <button
                  type="button"
                  onClick={onNavigateCameroonGrid}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-emerald-400 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xs"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Observatoire Réseau RIS/RIN' : 'RIS/RIN Grid Observatory'}</span>
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-4xl leading-relaxed font-medium">
            {locale === 'fr'
              ? "Cadre juridique et technique officiel du secteur électrique camerounais : Loi N° 2011/022, attributions institutionnelles (ARSEL, SONATREL, Eneo, EDC, AER, MINEE), Code de Réseau technique, plan de délestage UFLS, grilles tarifaires approuvées et corridors régionaux du PEAC."
              : 'Official legal and technical framework of the Cameroon power sector: Law No. 2011/022, statutory institutional mandates (ARSEL, SONATREL, Eneo, EDC, AER, MINEE), National Grid Code, UFLS defense scheme, approved electricity tariffs and regional PEAC interconnectors.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 shadow-xs">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">{locale === 'fr' ? 'TEXTE FONDAMENTAL' : 'PRIMARY STATUTE'}</span>
              <span className="text-amber-400 font-bold text-sm">Loi N° 2011/022</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 shadow-xs">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">{locale === 'fr' ? 'GESTIONNAIRE TRANSPORT (GRT)' : 'TRANSMISSION OPERATOR'}</span>
              <span className="text-sky-400 font-bold text-sm">SONATREL (Décret 2015/442)</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 shadow-xs">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">{locale === 'fr' ? 'RÉGULATEUR ÉCONOMIQUE' : 'ECONOMIC REGULATOR'}</span>
              <span className="text-purple-400 font-bold text-sm">ARSEL (Tarifs & Licences)</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 shadow-xs">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">{locale === 'fr' ? 'INTÉGRATION RÉGIONALE' : 'REGIONAL POOL'}</span>
              <span className="text-emerald-400 font-bold text-sm">PEAC / CEEAC (PIMERT 225 kV)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-thin">
        {[
          { id: 'overview' as const, label: locale === 'fr' ? 'Vue d\'Ensemble & Loi 2011' : 'Overview & Legal Framework', icon: FileText },
          { id: 'institutions' as const, label: locale === 'fr' ? 'Acteurs Institutionnels (7)' : 'Sector Entities (7)', icon: Building2 },
          { id: 'grid-code' as const, label: locale === 'fr' ? 'Code de Réseau & Conformité' : 'Grid Code & Compliance', icon: Zap },
          { id: 'tariffs' as const, label: locale === 'fr' ? 'Tarifs & Péage SONATREL' : 'Tariffs & Wheeling', icon: Calculator },
          { id: 'regional' as const, label: locale === 'fr' ? 'Interconnexions PEAC / PIMERT' : 'PEAC Interconnectors', icon: Globe },
          { id: 'environment' as const, label: locale === 'fr' ? 'Servitudes & Sécurité Foncière' : 'Right-of-Way & Environment', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border-amber-400 shadow-xs ring-1 ring-amber-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border-slate-800 bg-slate-950'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & LEGAL FRAMEWORK */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Law 2011/022 Structure */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? "Loi N° 2011/022 du 14 décembre 2011 régissant le secteur de l'électricité"
                    : 'Law No. 2011/022 of December 14, 2011 Governing the Electricity Sector'}
                </h2>
              </div>
              <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                STATUTE LAW
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#11161D] border border-[#252E38]">
                <div className="font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'DÉGROUPAGE DES ACTIVITÉS' : 'UNBUNDLING PRINCIPLE'}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {locale === 'fr'
                    ? "Séparation juridique et comptable des segments : Production (concession ou licence), Transport (monopole public confié à la SONATREL), Distribution et Commercialisation (concession Eneo)."
                    : 'Legal and accounting unbundling across segments: Generation (concessions and licenses), Transmission (public monopoly assigned to SONATREL), Distribution and Retail (Eneo concession).'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#11161D] border border-[#252E38]">
                <div className="font-mono font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'LIBRE ACCÈS DES TIERS (TPA)' : 'THIRD-PARTY ACCESS (TPA)'}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {locale === 'fr'
                    ? "Droit d'accès transparent, objectif et non-discriminatoire aux réseaux publics de transport et de distribution pour tout producteur indépendant (IPP) et client éligible, contre acquittement du péage approuvé par l'ARSEL."
                    : 'Transparent, objective and non-discriminatory right of access to transmission and distribution grids for any IPP and eligible customer against payment of the ARSEL-approved wheeling fee.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#11161D] border border-[#252E38]">
                <div className="font-mono font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'RÉGULATION & TARIFS' : 'REGULATORY PRICING'}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {locale === 'fr'
                    ? "Pouvoir réglementaire confié à l'ARSEL pour fixer les méthodologies tarifaires, contrôler les charges d'exploitation, pénaliser les interruptions non-programmées (SAIDI/SAIFI) et protéger les abonnés."
                    : 'Statutory powers vested in ARSEL to set tariff indexing formulas, audit utility opex/capex, penalize unplanned outages (SAIDI/SAIFI) and protect consumer rights.'}
                </p>
              </div>
            </div>

            {/* Regulatory Regimes Table */}
            <div className="mt-6 border-t border-[#252E38] pt-5">
              <h3 className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                {locale === 'fr' ? 'RÉGIMES JURIDIQUES D\'EXPLOITATION (LOI 2011/022)' : 'LEGAL REGIMES OF OPERATION'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#252E38] text-neutral-400 font-mono text-[11px]">
                      <th className="pb-2">{locale === 'fr' ? 'Régime' : 'Regime'}</th>
                      <th className="pb-2">{locale === 'fr' ? 'Champs d\'Application' : 'Scope'}</th>
                      <th className="pb-2">{locale === 'fr' ? 'Acteur / Titulaire Type' : 'Typical Operator'}</th>
                      <th className="pb-2">{locale === 'fr' ? 'Autorité Compétente' : 'Granting Authority'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252E38]/60 text-neutral-300">
                    <tr>
                      <td className="py-2.5 font-mono font-bold text-amber-400">CONCESSION</td>
                      <td className="py-2.5">Ouvrages hydroélectriques &gt; 5 MW, Réseau public de transport HTB, Distribution publique</td>
                      <td className="py-2.5">SONATREL (Transport), Eneo (Distribution), NHPC (Nachtigal 420 MW)</td>
                      <td className="py-2.5 font-mono text-neutral-400">Gouvernement (Décret PM / MINEE)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono font-bold text-cyan-400">LICENCE</td>
                      <td className="py-2.5">Production thermique &gt; 1 MW, centrales EnR privées (solaire, biomasse) de vente au réseau</td>
                      <td className="py-2.5">Producteurs Indépendants (IPPs), KPDC (Gaz Kribi), DPDC (Dibamba)</td>
                      <td className="py-2.5 font-mono text-neutral-400">MINEE après avis conforme ARSEL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono font-bold text-emerald-400">AUTORISATION</td>
                      <td className="py-2.5">Production d'énergie de 100 kW à 1 MW, mini-réseaux ruraux décentralisés</td>
                      <td className="py-2.5">Collectivités territoriales, AER, opérateurs privés de mini-grids</td>
                      <td className="py-2.5 font-mono text-neutral-400">ARSEL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono font-bold text-purple-400">DÉCLARATION / LIBRE</td>
                      <td className="py-2.5">Autoproduction de secours ou d'appoint &le; 100 kW (groupes électrogènes résidentiels, solaire en toiture)</td>
                      <td className="py-2.5">Particuliers, hôpitaux, centres commerciaux</td>
                      <td className="py-2.5 font-mono text-neutral-400">Simple déclaration MINEE / ARSEL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sector Governance Org Chart Visualizer */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-mono">
                {locale === 'fr' ? 'Architecture Institutionnelle du Secteur' : 'Sector Institutional Architecture'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40">
                <span className="font-mono text-[10px] font-bold text-purple-400 block mb-1">TUTELLE GOUVERNEMENTALE</span>
                <span className="font-bold text-sm text-white block">MINEE</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  {locale === 'fr' ? 'Politique énergétique, PDSE 2035, signatures de conventions de concession.' : 'National energy policy, masterplans (PDSE 2035), concession agreements.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <span className="font-mono text-[10px] font-bold text-amber-400 block mb-1">RÉGULATION & TARIFS</span>
                <span className="font-bold text-sm text-white block">ARSEL</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  {locale === 'fr' ? 'Fixation des grilles tarifaires, respect des cahiers des charges, conciliation.' : 'Tariff setting, contractual compliance, consumer protection & arbitration.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                <span className="font-mono text-[10px] font-bold text-cyan-400 block mb-1">GESTION TRANSPORT (GRT)</span>
                <span className="font-bold text-sm text-white block">SONATREL</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  {locale === 'fr' ? 'Réseau 225/90 kV, CNO Dispatching national, équilibre 50 Hz, interconnexions.' : '225/90 kV grid, National Dispatch CNO, 50 Hz balance, regional links.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-800/40">
                <span className="font-mono text-[10px] font-bold text-orange-400 block mb-1">DISTRIBUTION & CLIENTÈLE</span>
                <span className="font-bold text-sm text-white block">Eneo Cameroon</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  {locale === 'fr' ? 'Réseaux MT 30 kV / BT 400V, compteurs prépayés STS, commercialisation.' : '30 kV MV / 400V LV networks, STS prepayment, metering & billing.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTOR INSTITUTIONS */}
      {activeTab === 'institutions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Institutions List Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 px-1">
              {locale === 'fr' ? 'ORGANISMES RÉGLEMENTAIRES & OPÉRATEURS' : 'SECTOR ENTITIES'}
            </span>
            {REGULATORY_INSTITUTIONS.map((inst) => {
              const isSelected = selectedInstCode === inst.code;
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => setSelectedInstCode(inst.code)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#161C24] border-amber-400/80 shadow-md translate-x-1'
                      : 'bg-[#0E131A] border-[#252E38] hover:border-neutral-600 hover:bg-[#11161D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm text-white">{inst.code}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      inst.category === 'REGULATOR'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : inst.category === 'TSO'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : inst.category === 'ASSET_HOLDER'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : inst.category === 'DSO'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : inst.category === 'RURAL_AGENCY'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {inst.category}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 font-medium truncate">
                    {locale === 'fr' ? inst.name_fr : inst.name_en}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1 font-mono">
                    <MapPin className="h-3 w-3" />
                    <span>{inst.headquarters}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Institution Detail Panel */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0E131A] border border-[#252E38] space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#252E38] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-amber-400">{activeInstitution.code}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#161C24] text-neutral-300 border border-[#252E38]">
                    {activeInstitution.creation_legal_basis}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {locale === 'fr' ? activeInstitution.full_title_fr : activeInstitution.full_title_en}
                </h3>
              </div>
              <div className="text-right font-mono text-xs text-neutral-400">
                <span className="block font-bold text-neutral-200">{activeInstitution.headquarters}</span>
                <span className="text-cyan-400">{activeInstitution.website_or_contact}</span>
              </div>
            </div>

            {/* Mandate Summary */}
            <div>
              <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                {locale === 'fr' ? 'MANDAT LÉGAL & ATTRIBUTIONS' : 'STATUTORY MANDATE'}
              </h4>
              <p className="text-xs text-neutral-200 leading-relaxed bg-[#11161D] p-3.5 rounded-xl border border-[#252E38]">
                {locale === 'fr' ? activeInstitution.mandate_summary_fr : activeInstitution.mandate_summary_en}
              </p>
            </div>

            {/* Core Missions */}
            <div>
              <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                {locale === 'fr' ? 'MISSIONS FONDAMENTALES' : 'CORE STRATEGIC MISSIONS'}
              </h4>
              <ul className="space-y-2">
                {(locale === 'fr' ? activeInstitution.core_missions_fr : activeInstitution.core_missions_en).map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{mission}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Administered Regulations & Interfaces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#252E38] text-xs">
              <div>
                <span className="font-mono font-bold text-neutral-400 text-[11px] block mb-1">
                  {locale === 'fr' ? 'RÈGLEMENTS ADMINISTRÉS' : 'ADMINISTERED REGULATIONS'}
                </span>
                <ul className="space-y-1">
                  {activeInstitution.key_regulations_administered.map((reg, idx) => (
                    <li key={idx} className="text-neutral-300 font-mono text-[11px] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>{reg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono font-bold text-neutral-400 text-[11px] block mb-1">
                  {locale === 'fr' ? 'INTERFACES OPÉRATIONNELLES' : 'OPERATIONAL INTERFACES'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeInstitution.interfaces_with.map((inter, idx) => (
                    <span key={idx} className="font-mono text-[11px] bg-[#161C24] text-neutral-300 px-2 py-0.5 rounded border border-[#252E38]">
                      {inter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NATIONAL GRID CODE & COMPLIANCE */}
      {activeTab === 'grid-code' && (
        <div className="space-y-6">
          {/* Interactive Compliance Diagnostic Simulator */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38] shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-[#252E38] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Simulateur de Conformité Technique - Code de Réseau SONATREL'
                    : 'Technical Compliance Simulator - SONATREL Grid Code'}
                </h3>
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                complianceResults.allPassed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {complianceResults.allPassed
                  ? (locale === 'fr' ? 'CONFORME AU CODE RÉSEAU' : 'FULLY COMPLIANT')
                  : (locale === 'fr' ? 'NON-CONFORMITÉ DÉTECTÉE' : 'NON-COMPLIANCE DETECTED')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
              {/* Voltage Level Selection */}
              <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                <label className="text-neutral-400 block mb-1.5 text-[11px]">
                  {locale === 'fr' ? 'NIVEAU DE TENSION' : 'VOLTAGE LEVEL'}
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['225', '90', '30'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setTestVoltageLevel(lvl);
                        if (lvl === '225') setTestMeasuredVoltage(221);
                        else if (lvl === '90') setTestMeasuredVoltage(89);
                        else setTestMeasuredVoltage(29.8);
                      }}
                      className={`py-1.5 rounded text-xs font-bold border transition-colors ${
                        testVoltageLevel === lvl
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                          : 'bg-[#161C24] text-neutral-400 border-[#252E38]'
                      }`}
                    >
                      {lvl} kV
                    </button>
                  ))}
                </div>
              </div>

              {/* Measured Voltage Input */}
              <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-neutral-400 text-[11px]">
                    {locale === 'fr' ? 'TENSION MESURÉE (kV)' : 'MEASURED VOLTAGE (kV)'}
                  </label>
                  <span className="font-bold text-white">{testMeasuredVoltage} kV</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={testMeasuredVoltage}
                  onChange={(e) => setTestMeasuredVoltage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs"
                />
                <span className={`text-[10px] mt-1 block font-bold ${
                  complianceResults.voltStatus === 'NORMAL' ? 'text-emerald-400' : complianceResults.voltStatus === 'EXCEPTIONAL' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {complianceResults.voltDeviationPct >= 0 ? `+${complianceResults.voltDeviationPct.toFixed(1)}%` : `${complianceResults.voltDeviationPct.toFixed(1)}%`} ({complianceResults.voltStatus})
                </span>
              </div>

              {/* Grid Frequency Input */}
              <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-neutral-400 text-[11px]">
                    {locale === 'fr' ? 'FRÉQUENCE RÉSEAU (Hz)' : 'SYSTEM FREQUENCY (Hz)'}
                  </label>
                  <span className="font-bold text-white">{testFrequency} Hz</span>
                </div>
                <input
                  type="number"
                  step="0.05"
                  value={testFrequency}
                  onChange={(e) => setTestFrequency(parseFloat(e.target.value) || 50)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs"
                />
                <span className={`text-[10px] mt-1 block font-bold ${
                  complianceResults.freqStatus === 'NORMAL' ? 'text-emerald-400' : complianceResults.freqStatus === 'ALERT' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {complianceResults.freqStatus} (Nominal: 50.00 Hz)
                </span>
              </div>

              {/* Power Factor (cos phi) */}
              <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-neutral-400 text-[11px]">
                    {locale === 'fr' ? 'FACTEUR DE PUISSANCE' : 'POWER FACTOR (cos φ)'}
                  </label>
                  <span className="font-bold text-white">{testCosPhi}</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="1.0"
                  value={testCosPhi}
                  onChange={(e) => setTestCosPhi(parseFloat(e.target.value) || 0.9)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs"
                />
                <span className={`text-[10px] mt-1 block font-bold ${
                  complianceResults.isReactivePenalty ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  tan φ = {complianceResults.tanPhi.toFixed(2)} {complianceResults.isReactivePenalty ? '(Pénalité > 0.40)' : '(OK)'}
                </span>
              </div>

              {/* Harmonic THD */}
              <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-neutral-400 text-[11px]">
                    {locale === 'fr' ? 'THD TENSION MESURÉ' : 'VOLTAGE THD (%)'}
                  </label>
                  <span className="font-bold text-white">{testThd}%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={testThd}
                  onChange={(e) => setTestThd(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs"
                />
                <span className={`text-[10px] mt-1 block font-bold ${
                  complianceResults.isThdCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  Limite: ≤ {complianceResults.thdLimit}% ({complianceResults.isThdCompliant ? 'OK' : 'Dépassement'})
                </span>
              </div>
            </div>

            {/* Diagnostic Interpretation Banner */}
            <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 border ${
              complianceResults.allPassed
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
            }`}>
              {complianceResults.allPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              )}
              <div>
                <span className="font-bold font-mono">
                  {complianceResults.allPassed
                    ? (locale === 'fr' ? 'Installation en pleine conformité réglementaire :' : 'Facility fully compliant with grid code :')
                    : (locale === 'fr' ? 'Mesures correctives requises selon le Code de Réseau :' : 'Corrective engineering actions required :')}
                </span>
                <span className="ml-1 text-neutral-300">
                  {complianceResults.voltStatus === 'VIOLATION' && (locale === 'fr' ? " Tension hors des limites admissibles ! Déclenchement ou régulation OLTC requis." : " Voltage outside allowable limits! OLTC tap adjustment required.")}
                  {complianceResults.freqStatus === 'UFLS' && (locale === 'fr' ? " Fréquence critique sous 49.00 Hz : Activation des étages de délestage automatique !" : " Critical frequency below 49.00 Hz: Automated UFLS load shedding triggered!")}
                  {complianceResults.isReactivePenalty && (locale === 'fr' ? " tan φ > 0.40 : Risque de pénalité réactive ARSEL (14.5 FCFA/kvarh). Déployer des gradins de condensateurs." : " tan phi > 0.40: Reactive surcharge applies. Deploy power factor correction capacitor banks.")}
                  {!complianceResults.isThdCompliant && (locale === 'fr' ? ` THDu (${testThd}%) dépasse la norme CEI 61000-3-6 (${complianceResults.thdLimit}%). Filtres harmoniques obligatoires.` : ` THDu exceeds standard limit (${complianceResults.thdLimit}%). Install harmonic filters.`)}
                  {complianceResults.allPassed && (locale === 'fr' ? " Tous les paramètres physiques sont stabilisés dans les bandes contractuelles SONATREL." : " All physical electrical parameters are within standard contractual bands.")}
                </span>
              </div>
            </div>
          </div>

          {/* Under-Frequency Load Shedding (UFLS) Defense Plan */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? "Plan de Défense du Réseau : Délestage Fréquencemétrique Automatique (UFLS)"
                    : 'System Defense Plan: Under-Frequency Load Shedding (UFLS)'}
                </h3>
              </div>
              <span className="font-mono text-xs text-neutral-400">SONATREL · CNO Mangombé</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {CAMEROON_UFLS_STAGES.map((stage) => (
                <div key={stage.stage} className="p-4 rounded-xl bg-[#11161D] border border-[#252E38] text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-amber-400">ÉTAGE {stage.stage}</span>
                    <span className="font-mono font-black text-white text-sm bg-neutral-800 px-2 py-0.5 rounded">
                      {stage.frequency_threshold_hz.toFixed(2)} Hz
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] mb-2 text-neutral-300">
                    <div>{locale === 'fr' ? 'Temporisation' : 'Delay'} : <span className="text-white font-bold">{stage.time_delay_ms} ms</span></div>
                    <div>{locale === 'fr' ? 'Délestage' : 'Shedding'} : <span className="text-amber-400 font-bold">-{stage.load_shedding_percentage}%</span> ({locale === 'fr' ? 'Cumul' : 'Total'} : -{stage.cumulative_percentage}%)</div>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    {locale === 'fr' ? stage.description_fr : stage.description_en}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#252E38] text-[10px] text-cyan-400 font-mono">
                    {stage.targeted_substations.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Code Rules Table */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-white font-mono">
                {locale === 'fr' ? 'Règles Techniques du Code de Réseau' : 'Grid Code Operating Standards'}
              </h3>
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-neutral-400" />
                <select
                  value={selectedDomainFilter}
                  onChange={(e) => setSelectedDomainFilter(e.target.value)}
                  className="bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1 text-xs font-mono text-neutral-200"
                >
                  <option value="ALL">{locale === 'fr' ? 'Toutes les catégories' : 'All categories'}</option>
                  <option value="VOLTAGE">{locale === 'fr' ? 'Tension (Voltage)' : 'Voltage'}</option>
                  <option value="FREQUENCY">{locale === 'fr' ? 'Fréquence (50 Hz)' : 'Frequency'}</option>
                  <option value="POWER_FACTOR">{locale === 'fr' ? 'Facteur de Puissance' : 'Power Factor'}</option>
                  <option value="HARMONICS">{locale === 'fr' ? 'Harmoniques (THD)' : 'Harmonics'}</option>
                  <option value="PROTECTION">{locale === 'fr' ? 'Traversée de Creux (LVRT)' : 'LVRT Protection'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredGridCodeRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-[#11161D] border border-[#252E38] text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {rule.code}
                      </span>
                      <span className="font-bold text-sm text-white">
                        {locale === 'fr' ? rule.title_fr : rule.title_en}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-neutral-400">{rule.standard_reference}</span>
                      <span className="px-2 py-0.5 rounded bg-[#161C24] text-cyan-400 font-bold border border-[#252E38]">
                        {rule.voltage_level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono bg-[#161C24]/60 p-2.5 rounded-lg border border-[#252E38]">
                    <div>
                      <span className="text-neutral-400 block">{locale === 'fr' ? 'Plage Normale Continue :' : 'Normal Operating Band :'}</span>
                      <span className="text-emerald-400 font-bold">{rule.normal_range}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">{locale === 'fr' ? 'Plage Exceptionnelle / Tolérance :' : 'Exceptional Band :'}</span>
                      <span className="text-amber-400 font-bold">{rule.exceptional_range} ({rule.time_tolerance})</span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {locale === 'fr' ? rule.compliance_condition_fr : rule.compliance_condition_en}
                  </p>

                  <div className="text-[11px] text-neutral-400 pt-1 border-t border-[#252E38] flex items-center gap-1.5 font-mono">
                    <span className="text-red-400 font-bold">{locale === 'fr' ? 'Action / Pénalité :' : 'Action / Penalty :'}</span>
                    <span>{locale === 'fr' ? rule.penalty_or_action_fr : rule.penalty_or_action_en}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TARIFFS & WHEELING CHARGES */}
      {activeTab === 'tariffs' && (
        <div className="space-y-6">
          {/* Interactive Industrial Electricity Bill & Reactive Surcharge Calculator */}
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center gap-2 mb-4 border-b border-[#252E38] pb-3">
              <Calculator className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Calculatrice Tarifaire Moyenne Tension (HTA 30 kV) & Pénalité Réactive'
                    : 'Medium Voltage Tariff & Reactive Energy Surcharge Calculator'}
                </h3>
                <span className="text-xs text-neutral-400">
                  {locale === 'fr' ? 'Formule binôme ARSEL (Prime fixe + Tranches horaires Heures Pleines / Pointe / Creuses + Pénalité tan φ > 0.40)' : 'Two-part ARSEL TOU tariff + tan phi > 0.40 reactive penalty model'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-3 text-xs font-mono">
                <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-neutral-300">
                      {locale === 'fr' ? 'PUISSANCE SOUSCRITE (kW)' : 'SUBSCRIBED DEMAND (kW)'}
                    </label>
                    <span className="font-bold text-white">{subscribedKw} kW</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={subscribedKw}
                    onChange={(e) => setSubscribedKw(parseInt(e.target.value) || 500)}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>100 kW</span>
                    <span>Prime: 3 750 FCFA/kW/mois</span>
                    <span>5 000 kW</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#11161D] p-2.5 rounded-xl border border-[#252E38]">
                    <label className="text-[10px] text-neutral-400 block mb-1">
                      {locale === 'fr' ? 'Heures Pleines (70 F)' : 'Day Hours (70 F)'}
                    </label>
                    <input
                      type="number"
                      value={dayKwh}
                      onChange={(e) => setDayKwh(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs font-bold"
                    />
                    <span className="text-[9px] text-neutral-500 mt-0.5 block">06h - 18h</span>
                  </div>

                  <div className="bg-[#11161D] p-2.5 rounded-xl border border-[#252E38]">
                    <label className="text-[10px] text-amber-400 block mb-1">
                      {locale === 'fr' ? 'Pointe (85 F)' : 'Peak Hours (85 F)'}
                    </label>
                    <input
                      type="number"
                      value={peakKwh}
                      onChange={(e) => setPeakKwh(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs font-bold"
                    />
                    <span className="text-[9px] text-neutral-500 mt-0.5 block">18h - 23h</span>
                  </div>

                  <div className="bg-[#11161D] p-2.5 rounded-xl border border-[#252E38]">
                    <label className="text-[10px] text-cyan-400 block mb-1">
                      {locale === 'fr' ? 'Creuses (55 F)' : 'Night Hours (55 F)'}
                    </label>
                    <input
                      type="number"
                      value={nightKwh}
                      onChange={(e) => setNightKwh(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs font-bold"
                    />
                    <span className="text-[9px] text-neutral-500 mt-0.5 block">23h - 06h</span>
                  </div>
                </div>

                <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-neutral-300">
                      {locale === 'fr' ? 'FACTEUR DE PUISSANCE MOYEN (cos φ)' : 'POWER FACTOR (cos φ)'}
                    </label>
                    <span className="font-bold text-white">{industrialCosPhi}</span>
                  </div>
                  <input
                    type="range"
                    min="0.70"
                    max="0.99"
                    step="0.01"
                    value={industrialCosPhi}
                    onChange={(e) => setIndustrialCosPhi(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-red-400">0.70 (Mauvais)</span>
                    <span className={tariffBill.tanPhi > 0.40 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      tan φ = {tariffBill.tanPhi.toFixed(2)} (Seuil: 0.40)
                    </span>
                    <span className="text-emerald-400">0.99 (Optimal)</span>
                  </div>
                </div>
              </div>

              {/* Bill Output Simulation Card */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-[#11161D] border border-[#252E38] flex flex-col justify-between text-xs font-mono">
                <div className="space-y-2.5">
                  <span className="font-bold text-neutral-300 uppercase tracking-wider block border-b border-[#252E38] pb-2">
                    {locale === 'fr' ? 'DÉCOMPTE MENSUEL ESTIMATIF' : 'MONTHLY BILL SUMMARY'}
                  </span>

                  <div className="flex justify-between">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Prime fixe mensuelle' : 'Monthly demand charge'} :</span>
                    <span className="text-white font-bold">{tariffBill.fixedCost.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Énergie active totale' : 'Active energy charges'} ({tariffBill.totalActiveKwh.toLocaleString()} kWh) :</span>
                    <span className="text-white font-bold">{tariffBill.totalEnergyCost.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#161C24] p-2 rounded border border-[#252E38]">
                    <div>
                      <span className="text-neutral-300 block">{locale === 'fr' ? 'Pénalité réactive (tan φ > 0.40)' : 'Reactive surcharge'} :</span>
                      <span className="text-[10px] text-neutral-500">
                        {tariffBill.excessReactiveKvarh > 0 ? `${Math.round(tariffBill.excessReactiveKvarh).toLocaleString()} kvarh excédentaires @ 14.5 F` : locale === 'fr' ? 'Aucun dépassement réactif' : 'No reactive penalty'}
                      </span>
                    </div>
                    <span className={`font-bold text-sm ${tariffBill.reactivePenaltyCost > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {tariffBill.reactivePenaltyCost.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#252E38] pt-2 text-neutral-400">
                    <span>{locale === 'fr' ? 'Total Hors Taxes (HT)' : 'Subtotal HT'} :</span>
                    <span className="text-neutral-200 font-bold">{tariffBill.subtotalHt.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span>{locale === 'fr' ? 'TVA (19.25%)' : 'VAT (19.25%)'} :</span>
                    <span className="text-neutral-200 font-bold">{Math.round(tariffBill.vatAmount).toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#252E38] bg-[#0E131A] p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white uppercase">{locale === 'fr' ? 'TOTAL FACTURE TTC' : 'TOTAL BILL (TTC)'}</span>
                    <span className="font-black text-lg text-amber-400">{Math.round(tariffBill.totalTtc).toLocaleString()} FCFA</span>
                  </div>
                  {tariffBill.potentialSaving > 0 && (
                    <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {locale === 'fr'
                          ? `Économie mensuelle de ${Math.round(tariffBill.potentialSaving).toLocaleString()} FCFA en compensant le facteur de puissance (cos φ ≥ 0.93) !`
                          : `Monthly saving of ${Math.round(tariffBill.potentialSaving).toLocaleString()} FCFA by installing a power factor correction capacitor bank!`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Official ARSEL Tariff Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-mono">
              {locale === 'fr' ? 'Grilles Tarifaires Officielles en Vigueur (Décisions ARSEL)' : 'Official Electricity Tariff Schedules (ARSEL Decisions)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ARSEL_TARIFF_FRAMEWORK.map((tar) => (
                <div key={tar.id} className="p-5 rounded-2xl bg-[#0E131A] border border-[#252E38] text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {tar.code}
                      </span>
                      <span className="font-mono text-neutral-400 font-bold">{tar.voltage_class}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-2">
                      {locale === 'fr' ? tar.name_fr : tar.name_en}
                    </h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed mb-3">
                      {locale === 'fr' ? tar.description_fr : tar.description_en}
                    </p>

                    <div className="font-mono text-[11px] mb-3 text-cyan-400 bg-[#11161D] p-2 rounded border border-[#252E38]">
                      {tar.fixed_charge_fcfa}
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block font-bold">
                        {locale === 'fr' ? 'TRANCHES DE PRIX (FCFA/kWh)' : 'PRICE BRACKETS'}
                      </span>
                      {tar.rates.map((r, i) => (
                        <div key={i} className="p-2 rounded bg-[#11161D] border border-[#252E38]/80 flex items-center justify-between font-mono">
                          <span className="text-neutral-300 text-[11px] truncate pr-2">
                            {locale === 'fr' ? r.bracket_name_fr : r.bracket_name_en}
                          </span>
                          <span className="text-amber-400 font-bold shrink-0">
                            {r.rate_fcfa_per_kwh} F
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#252E38] text-[10px] text-neutral-400 font-mono">
                    <span className="text-neutral-300 font-bold block">{locale === 'fr' ? 'Règle Réactive :' : 'Reactive Rule :'}</span>
                    {tar.power_factor_penalty_condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REGIONAL INTERCONNECTIONS (PEAC) */}
      {activeTab === 'regional' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {locale === 'fr'
                      ? 'Pool Énergétique d\'Afrique Centrale (PEAC) & Corridors Régionaux'
                      : 'Central Africa Power Pool (PEAC) & Regional Interconnectors'}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {locale === 'fr' ? 'Intégration énergétique de la zone CEEAC et valorisation des excédents hydroélectriques nationaux' : 'ECCAS regional energy integration and export of clean national hydro capacity'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {REGIONAL_INTERCONNECTION_PROJECTS.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-[#11161D] border border-[#252E38] text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {proj.voltage_kv} kV
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        {locale === 'fr' ? proj.name_fr : proj.name_en}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-neutral-400">{proj.regional_pool}</span>
                      <span className={`px-2 py-0.5 rounded font-bold border ${
                        proj.current_status === 'UNDER_CONSTRUCTION'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : proj.current_status === 'STUDIES_COMPLETED'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}>
                        {proj.current_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">{locale === 'fr' ? 'Tracé & Longueur :' : 'Route & Length :'}</span>
                      <span className="text-white font-semibold">{proj.route_and_length}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">{locale === 'fr' ? 'Capacité de Transit :' : 'Transmission Capacity :'}</span>
                      <span className="text-emerald-400 font-bold">{proj.transmission_capacity_mw} MW</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">{locale === 'fr' ? 'Mise en Service Cible :' : 'Target Commissioning :'}</span>
                      <span className="text-amber-400 font-bold">{proj.commissioning_target}</span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {locale === 'fr' ? proj.strategic_objective_fr : proj.strategic_objective_en}
                  </p>

                  <div className="pt-2 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                    <div>
                      <span className="text-neutral-300 font-bold">{locale === 'fr' ? 'Partenaires Financiers :' : 'Financiers :'} </span>
                      <span>{proj.financing_partners.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-neutral-300 font-bold">{locale === 'fr' ? 'Pays :' : 'Countries :'} </span>
                      <span>{proj.participating_countries.join(' · ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RIGHT-OF-WAY & ENVIRONMENTAL SERVITUDES */}
      {activeTab === 'environment' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0E131A] border border-[#252E38]">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Servitudes de Passage & Couloirs de Sécurité Foncière (Lignes Aériennes)'
                    : 'Right-of-Way (ROW) Safety Corridors & Land Clearance Regulations'}
                </h3>
                <span className="text-xs text-neutral-400">
                  {locale === 'fr' ? 'Loi 2011/022 et Décret N° 2013/0171/PM régissant les distances de sécurité et les zones non-aedificandi' : 'Statutory clearances, ground sags and non-building strips along overhead high-voltage lines'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ENVIRONMENTAL_RIGHT_OF_WAYS.map((row) => (
                <div key={row.voltage_level} className="p-5 rounded-2xl bg-[#11161D] border border-[#252E38] text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                    <span className="font-mono font-black text-sm text-amber-400">{row.voltage_level}</span>
                    <span className="font-mono text-[10px] text-neutral-400">{row.legal_reference}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-[#161C24] p-2.5 rounded-lg border border-[#252E38]">
                      <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Largeur Couloir' : 'Corridor Width'}</span>
                      <span className="text-white font-bold text-base">{row.right_of_way_width_m} m</span>
                      <span className="text-[9px] text-neutral-500 block">(±{row.half_corridor_m} m {locale === 'fr' ? 'axe' : 'axis'})</span>
                    </div>

                    <div className="bg-[#161C24] p-2.5 rounded-lg border border-[#252E38]">
                      <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Garde au Sol Min.' : 'Min. Ground Sag'}</span>
                      <span className="text-cyan-400 font-bold text-base">{row.clearance_ground_m} m</span>
                      <span className="text-[9px] text-neutral-500 block">{locale === 'fr' ? 'à 75°C max' : 'at 75°C max'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      {locale === 'fr' ? 'PRESCRIPTIONS STRICTES' : 'STATUTORY RULES'}
                    </span>
                    {(locale === 'fr' ? row.rules_fr : row.rules_en).map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
