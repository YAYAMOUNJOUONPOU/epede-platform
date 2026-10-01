// src/components/installations/ProjectFormSeparationIpIkEngine.tsx
// EPEDE Deep Engineering Module — Domain D06: Electrical Installations & Switchboards
// Module 23: Switchboard Forms of Internal Separation (IEC 61439-2) & IP/IK Mechanical Segregation Engine

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Shield, 
  Box, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Maximize2, 
  Sliders, 
  Activity, 
  Info,
  ShieldCheck,
  Zap,
  Wrench,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

// IEC 61439-2 Forms of Internal Separation
export type FormOfSeparationType = 
  | 'FORM_1'
  | 'FORM_2A'
  | 'FORM_2B'
  | 'FORM_3A'
  | 'FORM_3B'
  | 'FORM_4A'
  | 'FORM_4B';

// IP Ingress Protection rating definitions (IEC 60529)
export type IpFirstNumeral = '2' | '3' | '4' | '5' | '6'; // Solid particle & probe protection
export type IpSecondNumeral = '0' | '1' | '2' | '3' | '4' | '5' | '6'; // Liquid ingress protection

// IK Impact resistance ratings (IEC 62262)
export type IkRating = 'IK07' | 'IK08' | 'IK09' | 'IK10';

// Busbar material
export type BusbarMaterial = 'COPPER' | 'ALUMINUM';

export const ProjectFormSeparationIpIkEngine: React.FC<Props> = ({ project, locale }) => {
  const isFr = locale === 'fr';

  // 1. Form of Separation Selection (Default Form 3b for commercial tertiary or Form 4b for industrial)
  const defaultForm = project.environmentType === 'INDUSTRIAL_PROCESS' || project.environmentType === 'HEALTHCARE_CLINIC'
    ? 'FORM_4B' 
    : 'FORM_3B';
  const [selectedForm, setSelectedForm] = useState<FormOfSeparationType>(defaultForm);

  // 2. IP Code Selection (First Numeral: solids, Second Numeral: liquids)
  const [ipSolid, setIpSolid] = useState<IpFirstNumeral>('3');
  const [ipLiquid, setIpLiquid] = useState<IpSecondNumeral>('1');

  // 3. IK Impact Rating Selection
  const [ikRating, setIkRating] = useState<IkRating>('IK08');

  // 4. Short-circuit withstand & Busbar Support Spacing Parameters
  const [busbarMaterial, setBusbarMaterial] = useState<BusbarMaterial>('COPPER');
  const [busbarPhaseSpacingMm, setBusbarPhaseSpacingMm] = useState<number>(100); // Center-to-center distance between phases d (mm)
  const [busbarSupportDistanceMm, setBusbarSupportDistanceMm] = useState<number>(400); // Distance between insulators L (mm)
  const [busbarCrossSectionMm2, setBusbarCrossSectionMm2] = useState<number>(500); // e.g., 50x10 mm bar = 500 mm²
  
  // Power balance to get nominal current and prospective short circuit
  const balance = useMemo(() => computeProjectPowerBalance(project), [project]);
  const tgbtCurrentA = Math.round(balance.tgbtIncomerAmperes || 630);
  
  // Estimated prospective short-circuit current Icw (kA rms 1s) and Ipk (peak kA)
  const prospectiveIscKa = useMemo(() => {
    // Tertiary usually 25-35 kA, industrial 50-65 kA, healthcare 40 kA
    switch (project.environmentType) {
      case 'INDUSTRIAL_PROCESS': return 50;
      case 'HEALTHCARE_CLINIC': return 35;
      case 'TERTIARY_COMMERCIAL': return 25;
      case 'RESIDENTIAL': return 15;
      default: return 30;
    }
  }, [project.environmentType]);

  // Peak short-circuit factor n = Ipk / Icw per IEC 61439-1 (Table 7)
  const peakFactorN = useMemo(() => {
    if (prospectiveIscKa <= 5) return 1.5;
    if (prospectiveIscKa <= 10) return 1.7;
    if (prospectiveIscKa <= 20) return 2.0;
    if (prospectiveIscKa <= 50) return 2.1;
    return 2.2;
  }, [prospectiveIscKa]);

  const prospectivePeakIpkKa = Math.round(prospectiveIscKa * peakFactorN);

  // Electrodynamic force calculation between parallel busbars under peak short circuit (IEC 60865-1):
  // Fm = (μ0 / 2π) * (Ipk² / d) * L = 0.2 * (Ipk_kA)² * (L_m / d_m) [Newtons]
  // With Ipk in kA, L in mm, d in mm: Fm = 0.2 * Ipk² * (L / d) [N]
  const electrodynamicForceFmNewtons = useMemo(() => {
    const dMeters = Math.max(0.02, busbarPhaseSpacingMm / 1000);
    const lMeters = Math.max(0.1, busbarSupportDistanceMm / 1000);
    // Fm = 2 * 10^-7 * (Ipk in Amperes)² * L / d
    const ipkAmperes = prospectivePeakIpkKa * 1000;
    const forceN = (2e-7 * Math.pow(ipkAmperes, 2) * lMeters) / dMeters;
    return Math.round(forceN);
  }, [prospectivePeakIpkKa, busbarPhaseSpacingMm, busbarSupportDistanceMm]);

  // Mechanical stress on busbar material under short circuit:
  // Bending moment M = Fm * L / 16 (for continuous beam over supports)
  // Section modulus W = b * h² / 6
  // Check if force requires closer supports
  const maxAllowableSupportSpanMm = useMemo(() => {
    // Recommended max span to keep mechanical deflection and insulator stress within 12 kN per support
    const targetMaxForceN = 10000; // 10 kN standard insulator breaking load limit
    const dMeters = busbarPhaseSpacingMm / 1000;
    const ipkAmperes = prospectivePeakIpkKa * 1000;
    // targetMaxForceN = (2e-7 * ipk² * L_max) / d => L_max = (targetMaxForceN * d) / (2e-7 * ipk²)
    const calculatedSpanM = (targetMaxForceN * dMeters) / (2e-7 * Math.pow(ipkAmperes, 2));
    const calculatedSpanMm = Math.round(calculatedSpanM * 1000);
    return Math.max(150, Math.min(800, calculatedSpanMm));
  }, [busbarPhaseSpacingMm, prospectivePeakIpkKa]);

  const isSupportSpanSafe = busbarSupportDistanceMm <= maxAllowableSupportSpanMm;

  // Form of Separation Technical Definition per IEC 61439-2
  const formData = useMemo(() => {
    switch (selectedForm) {
      case 'FORM_1':
        return {
          code: 'Form 1',
          nameFr: 'Forme 1 : Aucune séparation interne',
          nameEn: 'Form 1: No internal separation',
          busbarsSeparatedFromUnits: false,
          unitsSeparatedFromEachOther: false,
          terminalsSeparatedFromBusbars: false,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'Petits tableaux de distribution tertiaires légers (< 250 A), armoires murales simples.',
          typicalUseEn: 'Small light commercial distribution boards (< 250 A), basic wall-mounted panels.',
          maintenanceSafety: 'LOW',
          partitionMaterial: 'NONE',
          continuityOfService: 'LOW'
        };
      case 'FORM_2A':
        return {
          code: 'Form 2a',
          nameFr: 'Forme 2a : Séparation jeu de barres / unités (Bornes non séparées du jeu de barres)',
          nameEn: 'Form 2a: Separation of busbars from functional units (Terminals NOT separated from busbars)',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: false,
          terminalsSeparatedFromBusbars: false,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'Tableaux divisionnaires tertiaires jusqu\'à 630 A. Risque au raccordement en présence du jeu de barres.',
          typicalUseEn: 'Sub-distribution boards up to 630 A. Cable connection risks exposure to busbar area.',
          maintenanceSafety: 'MEDIUM_LOW',
          partitionMaterial: 'METALLIC_OR_INSULATING',
          continuityOfService: 'MEDIUM'
        };
      case 'FORM_2B':
        return {
          code: 'Form 2b',
          nameFr: 'Forme 2b : Séparation jeu de barres / unités & bornes séparées du jeu de barres',
          nameEn: 'Form 2b: Busbars separated from units & terminals separated from busbars',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: false,
          terminalsSeparatedFromBusbars: true,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'TGBT tertiaire standard. Permet le câblage des départs sans contact avec le jeu de barres principal sous tension.',
          typicalUseEn: 'Standard commercial LV switchboard. Enables cabling of outgoing lines without touching live busbars.',
          maintenanceSafety: 'MEDIUM',
          partitionMaterial: 'METALLIC_OR_INSULATING',
          continuityOfService: 'MEDIUM'
        };
      case 'FORM_3A':
        return {
          code: 'Form 3a',
          nameFr: 'Forme 3a : Unités séparées entre elles & du jeu de barres (Bornes communes non séparées des barres)',
          nameEn: 'Form 3a: Units separated from each other & busbars (Terminals common, not separated from busbars)',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: true,
          terminalsSeparatedFromBusbars: false,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'Rarement prescrit car les bornes restent dans la zone barres. Forme 3b très préférée.',
          typicalUseEn: 'Rarely specified because terminals remain in busbar zone. Form 3b is heavily preferred.',
          maintenanceSafety: 'MEDIUM',
          partitionMaterial: 'METALLIC_OR_INSULATING',
          continuityOfService: 'MEDIUM_HIGH'
        };
      case 'FORM_3B':
        return {
          code: 'Form 3b',
          nameFr: 'Forme 3b : Unités séparées entre elles & du jeu de barres + Bornes séparées du jeu de barres',
          nameEn: 'Form 3b: Units separated from each other & busbars + Terminals separated from busbars',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: true,
          terminalsSeparatedFromBusbars: true,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'Standard de référence TGBT tertiaire exigeant, hôpitaux, centres commerciaux et data centers.',
          typicalUseEn: 'Industry benchmark for commercial TGBT, healthcare clinics, shopping malls, and data centers.',
          maintenanceSafety: 'HIGH',
          partitionMaterial: 'METALLIC_OR_INSULATING',
          continuityOfService: 'HIGH'
        };
      case 'FORM_4A':
        return {
          code: 'Form 4a',
          nameFr: 'Forme 4a : Séparation totale, bornes dans le même compartiment que l\'unité fonctionnelle',
          nameEn: 'Form 4a: Full separation, terminals in the same compartment as their functional unit',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: true,
          terminalsSeparatedFromBusbars: true,
          terminalsSeparatedFromUnits: true,
          typicalUseFr: 'TGBT process industriel compact avec départs débrochables ou tiroirs extractibles.',
          typicalUseEn: 'Compact industrial process switchboard with withdrawable or plug-in functional units.',
          maintenanceSafety: 'VERY_HIGH',
          partitionMaterial: 'FULL_METALLIC_BARRIERS',
          continuityOfService: 'VERY_HIGH'
        };
      case 'FORM_4B':
        return {
          code: 'Form 4b',
          nameFr: 'Forme 4b : Séparation totale absolue, chaque unité et chaque jeu de bornes dans son propre caisson dédié',
          nameEn: 'Form 4b: Absolute segregation, each unit & terminal set in its own dedicated enclosed cubicle',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: true,
          terminalsSeparatedFromBusbars: true,
          terminalsSeparatedFromUnits: true,
          typicalUseFr: 'Industries lourdes, pétrochimie, centrales électriques, sidérurgie, très haute continuité de service (IS 333).',
          typicalUseEn: 'Heavy industry, petrochemicals, power plants, steel mills, continuous process (IS 333 withdrawable).',
          maintenanceSafety: 'MAXIMUM',
          partitionMaterial: 'FULL_METALLIC_BARRIERS',
          continuityOfService: 'MAXIMUM'
        };
      default:
        return {
          code: 'Form 3b',
          nameFr: 'Forme 3b',
          nameEn: 'Form 3b',
          busbarsSeparatedFromUnits: true,
          unitsSeparatedFromEachOther: true,
          terminalsSeparatedFromBusbars: true,
          terminalsSeparatedFromUnits: false,
          typicalUseFr: 'Standard tertiaire',
          typicalUseEn: 'Commercial standard',
          maintenanceSafety: 'HIGH',
          partitionMaterial: 'METALLIC_OR_INSULATING',
          continuityOfService: 'HIGH'
        };
    }
  }, [selectedForm]);

  // IP Code Analysis (IEC 60529)
  const ipCodeString = `IP${ipSolid}${ipLiquid}`;
  const ipDescription = useMemo(() => {
    let solidText = '';
    switch (ipSolid) {
      case '2': solidText = isFr ? 'Objets > 12.5 mm (doigt d\'épreuve)' : 'Solid objects > 12.5 mm (finger probe)'; break;
      case '3': solidText = isFr ? 'Outils & fils > 2.5 mm' : 'Tools & wires > 2.5 mm'; break;
      case '4': solidText = isFr ? 'Fils fins & corps fins > 1.0 mm' : 'Thin wires & small objects > 1.0 mm'; break;
      case '5': solidText = isFr ? 'Protégé contre les poussières (dépôt non nuisible)' : 'Dust-protected (limited ingress)'; break;
      case '6': solidText = isFr ? 'Totalement étanche aux poussières' : 'Dust-tight (no ingress)'; break;
      default: solidText = '';
    }

    let liquidText = '';
    switch (ipLiquid) {
      case '0': liquidText = isFr ? 'Non protégé' : 'No protection'; break;
      case '1': liquidText = isFr ? 'Gouttes d\'eau verticales (condensation)' : 'Vertical dripping water'; break;
      case '2': liquidText = isFr ? 'Gouttes d\'eau inclinées à 15°' : 'Dripping water tilted up to 15°'; break;
      case '3': liquidText = isFr ? 'Eau en pluie jusqu\'à 60°' : 'Spraying water up to 60°'; break;
      case '4': liquidText = isFr ? 'Projections d\'eau de toutes directions' : 'Splashing water from any direction'; break;
      case '5': liquidText = isFr ? 'Jets d\'eau à la lance (buse 6.3 mm)' : 'Water jets from nozzle (6.3 mm)'; break;
      case '6': liquidText = isFr ? 'Paquets de mer / forts jets d\'eau' : 'Powerful water jets (12.5 mm nozzle)'; break;
      default: liquidText = '';
    }

    return { solidText, liquidText };
  }, [ipSolid, ipLiquid, isFr]);

  // IK Rating Details (IEC 62262)
  const ikDescription = useMemo(() => {
    switch (ikRating) {
      case 'IK07': return { joules: 2.0, massKg: 0.5, heightMm: 400, descFr: 'Résistance aux chocs légers (2 Joules)', descEn: 'Light impact resistance (2 Joules)' };
      case 'IK08': return { joules: 5.0, massKg: 1.7, heightMm: 300, descFr: 'Standard armoire de distribution tertiaire (5 Joules)', descEn: 'Standard commercial enclosure (5 Joules)' };
      case 'IK09': return { joules: 10.0, massKg: 5.0, heightMm: 200, descFr: 'Environnements industriels sévères (10 Joules)', descEn: 'Severe industrial environments (10 Joules)' };
      case 'IK10': return { joules: 20.0, massKg: 5.0, heightMm: 400, descFr: 'Impacts très sévères, vandalisme, industrie lourde (20 Joules)', descEn: 'High impact, anti-vandal, heavy industrial (20 Joules)' };
      default: return { joules: 5.0, massKg: 1.7, heightMm: 300, descFr: 'Standard', descEn: 'Standard' };
    }
  }, [ikRating]);

  return (
    <div className="space-y-6" id="project-form-separation-ip-ik-engine">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {isFr 
                    ? '23. Formes de Séparation & Ségrégation Mécanique IP / IK'
                    : '23. Switchboard Forms of Separation & Mechanical IP/IK Segregation'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  IEC 61439-2 / IEC 60529 / IEC 62262
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Cloisonnement intérieur Forme 1 à 4b (protection contre les contacts fortuits et propagation d\'arc), étanchéité IP, tenue aux chocs IK et tenue électrodynamique des jeux de barres (Icw / Ipk).'
                  : 'Internal separation Forms 1 to 4b (protection against direct touch & internal arc propagation), IP ingress protection, IK impact rating, and electrodynamic busbar short-circuit withstand (Icw / Ipk).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Forme Retenue' : 'Selected Form'}
              </span>
              <span className="text-base font-bold font-mono text-cyan-400">
                {formData.code}
              </span>
            </div>
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Indice Protection' : 'Protection Code'}
              </span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {ipCodeString} / {ikRating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Form Selector Grid (Form 1 to Form 4b) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            {isFr ? 'CHOIX DE LA FORME DE CLOISONNEMENT INTERNE (CEI 61439-2)' : 'SELECT INTERNAL FORM OF SEPARATION (IEC 61439-2)'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {isFr ? 'Recommandé pour votre projet : ' : 'Recommended for your project: '}
            <strong className="text-amber-400">{defaultForm}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {(['FORM_1', 'FORM_2A', 'FORM_2B', 'FORM_3A', 'FORM_3B', 'FORM_4A', 'FORM_4B'] as FormOfSeparationType[]).map((f) => {
            const isSelected = selectedForm === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedForm(f)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-md ring-1 ring-cyan-400/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs uppercase text-cyan-300">
                      {f.replace('_', ' ')}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block line-clamp-2 leading-snug">
                    {f === 'FORM_1' ? (isFr ? 'Sans cloison' : 'No partition') :
                     f === 'FORM_2A' ? (isFr ? 'Barres séparées' : 'Busbars isolated') :
                     f === 'FORM_2B' ? (isFr ? 'Barres & Bornes' : 'Busbars & Terminals') :
                     f === 'FORM_3A' ? (isFr ? 'Unités séparées' : 'Units segregated') :
                     f === 'FORM_3B' ? (isFr ? 'Unités + Bornes' : 'Units + Terminals') :
                     f === 'FORM_4A' ? (isFr ? 'Compartimenté 4a' : 'Compartmented 4a') :
                     (isFr ? 'Ségrégation 4b' : 'Total cubicle 4b')}
                  </span>
                </div>
                <div className="mt-3 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-500">{isFr ? 'Sécurité' : 'Safety'}</span>
                  <span className={
                    f === 'FORM_1' ? 'text-rose-400' :
                    f.startsWith('FORM_2') ? 'text-amber-400' :
                    f.startsWith('FORM_3') ? 'text-cyan-400' : 'text-emerald-400'
                  }>
                    {f === 'FORM_1' ? 'MIN' : f.startsWith('FORM_2') ? 'MED' : f.startsWith('FORM_3') ? 'HIGH' : 'MAX'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Form Visual Architectural Diagram */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Visual Switchboard Cubicle Mockup Schematic */}
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                {isFr ? 'SCHEMA DE CLOISONNEMENT' : 'PARTITION SCHEMATIC'} ({formData.code})
              </span>
              
              {/* SVG Switchboard Column Mockup */}
              <div className="w-full max-w-[260px] aspect-[4/5] bg-slate-950 border-2 border-slate-700 rounded-lg p-2.5 flex flex-col justify-between relative shadow-inner">
                
                {/* 1. Main Busbar Compartment (Top or Back) */}
                <div className={`p-2 rounded border text-center transition-all ${
                  formData.busbarsSeparatedFromUnits 
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300' 
                    : 'bg-slate-900 border-dashed border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{isFr ? 'Jeu de Barres Principal' : 'Main Busbar System'}</span>
                  </div>
                  <span className="text-[9px] opacity-80 block">
                    {formData.busbarsSeparatedFromUnits 
                      ? (isFr ? 'Cloisonné / Séparé' : 'Enclosed / Separated') 
                      : (isFr ? 'Non cloisonné (Zone ouverte)' : 'Not separated (Open)')}
                  </span>
                </div>

                {/* Barrier Indicator */}
                {formData.busbarsSeparatedFromUnits && (
                  <div className="h-1 bg-cyan-500/80 rounded my-1 shadow-sm flex items-center justify-center">
                    <span className="bg-cyan-900 text-cyan-200 text-[7px] font-mono px-1 rounded-sm uppercase tracking-tighter">
                      {isFr ? 'Cloison Métallique / Isolante' : 'Internal Barrier'}
                    </span>
                  </div>
                )}

                {/* 2. Functional Units Section */}
                <div className="flex-1 my-1 grid grid-rows-3 gap-1">
                  {[1, 2, 3].map((u) => (
                    <div 
                      key={u}
                      className={`rounded p-1.5 border flex items-center justify-between text-[10px] font-mono transition-all ${
                        formData.unitsSeparatedFromEachOther
                          ? 'bg-blue-950/40 border-blue-500/60 text-blue-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Box className="w-2.5 h-2.5 text-blue-400" />
                        {isFr ? `Unité Dérivée ${u}` : `Feeder Unit ${u}`}
                      </span>
                      <span className="text-[8px] opacity-70">
                        {formData.unitsSeparatedFromEachOther ? (isFr ? 'Cellule Dédiée' : 'Isolated Cell') : (isFr ? 'Partagée' : 'Shared')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 3. Outgoing Terminals / Cable Compartment */}
                <div className={`p-2 rounded border text-center transition-all ${
                  formData.terminalsSeparatedFromBusbars
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-900 border-dashed border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold">
                    <Wrench className="w-3 h-3 text-emerald-400" />
                    <span>{isFr ? 'Bornes de Raccordement' : 'External Cable Terminals'}</span>
                  </div>
                  <span className="text-[9px] opacity-80 block">
                    {formData.terminalsSeparatedFromUnits && selectedForm.startsWith('FORM_4')
                      ? (isFr ? 'Bornes ségréguées par départ' : 'Terminals dedicated per feeder')
                      : formData.terminalsSeparatedFromBusbars
                      ? (isFr ? 'Gaine à câbles séparée des barres' : 'Cable gland zone isolated from busbars')
                      : (isFr ? 'Bornes situées en zone barres' : 'Terminals within busbar zone')}
                  </span>
                </div>

              </div>
            </div>

            {/* Explanatory Specs & Requirements */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  {isFr ? formData.nameFr : formData.nameEn}
                </h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {isFr ? formData.typicalUseFr : formData.typicalUseEn}
                </p>
              </div>

              {/* Checklist of 4 IEC Separation Criteria */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className={`p-2 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
                  formData.busbarsSeparatedFromUnits ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <span className={formData.busbarsSeparatedFromUnits ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {formData.busbarsSeparatedFromUnits ? '✓' : '✗'}
                  </span>
                  <span>{isFr ? 'Barres / Unités séparées' : 'Busbars / Units isolated'}</span>
                </div>

                <div className={`p-2 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
                  formData.unitsSeparatedFromEachOther ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <span className={formData.unitsSeparatedFromEachOther ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {formData.unitsSeparatedFromEachOther ? '✓' : '✗'}
                  </span>
                  <span>{isFr ? 'Unités séparées entre elles' : 'Units isolated from each other'}</span>
                </div>

                <div className={`p-2 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
                  formData.terminalsSeparatedFromBusbars ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <span className={formData.terminalsSeparatedFromBusbars ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {formData.terminalsSeparatedFromBusbars ? '✓' : '✗'}
                  </span>
                  <span>{isFr ? 'Bornes séparées des barres' : 'Terminals isolated from busbars'}</span>
                </div>

                <div className={`p-2 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
                  formData.terminalsSeparatedFromUnits ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <span className={formData.terminalsSeparatedFromUnits ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {formData.terminalsSeparatedFromUnits ? '✓' : '✗'}
                  </span>
                  <span>{isFr ? 'Bornes séparées de l\'unité' : 'Terminals isolated per unit'}</span>
                </div>
              </div>

              {/* Maintenance & Safety Advice */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">{isFr ? 'Sécurité des intervenants :' : 'Maintenance safety level:'}</span>
                  <span className="text-cyan-400 font-bold">{formData.maintenanceSafety}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">{isFr ? 'Continuité de service (IS) :' : 'Continuity of service index:'}</span>
                  <span className="text-emerald-400 font-bold">{formData.continuityOfService}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* 3. Ingress Protection (IP) & Impact (IK) Sizing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* IP Ingress Protection (IEC 60529) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              {isFr ? 'DEGRÉ DE PROTECTION ÉTANCHÉITÉ (CEI 60529)' : 'INGRESS PROTECTION (IEC 60529)'}
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {ipCodeString}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isFr ? '1er Chiffre : Solides & Poussières' : '1st Numeral: Solids & Dust'}
              </label>
              <select 
                value={ipSolid}
                onChange={(e) => setIpSolid(e.target.value as IpFirstNumeral)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              >
                <option value="2">IP2x - &gt; 12.5 mm ({isFr ? 'Doigt d\'épreuve' : 'Finger probe'})</option>
                <option value="3">IP3x - &gt; 2.5 mm ({isFr ? 'Outil / tournevis' : 'Tool / wire'})</option>
                <option value="4">IP4x - &gt; 1.0 mm ({isFr ? 'Fil mince' : 'Thin wire'})</option>
                <option value="5">IP5x - {isFr ? 'Protégé contre poussières' : 'Dust protected'}</option>
                <option value="6">IP6x - {isFr ? 'Totalement étanche poussière' : 'Dust-tight'}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {isFr ? '2e Chiffre : Eau & Liquides' : '2nd Numeral: Water & Liquids'}
              </label>
              <select 
                value={ipLiquid}
                onChange={(e) => setIpLiquid(e.target.value as IpSecondNumeral)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              >
                <option value="0">IPx0 - {isFr ? 'Aucune protection eau' : 'No protection'}</option>
                <option value="1">IPx1 - {isFr ? 'Gouttes verticales' : 'Vertical dripping'}</option>
                <option value="2">IPx2 - {isFr ? 'Gouttes à 15°' : 'Dripping at 15°'}</option>
                <option value="3">IPx3 - {isFr ? 'Eau en pluie 60°' : 'Spraying water'}</option>
                <option value="4">IPx4 - {isFr ? 'Projections toutes directions' : 'Splashing water'}</option>
                <option value="5">IPx5 - {isFr ? 'Jets d\'eau à la lance' : 'Water jets (6.3mm)'}</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">1er :</span>
              <span className="text-slate-300">{ipDescription.solidText}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">2e :</span>
              <span className="text-slate-300">{ipDescription.liquidText}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              {isFr 
                ? 'Rappel CEI 61439-1 : IP30 minimum pour armoires en local technique fermé, IP54 recommandé en ambiance poussiéreuse/humide.'
                : 'IEC 61439-1 requirement: IP30 minimum inside closed switchrooms; IP54 recommended for dusty/damp environments.'}
            </p>
          </div>
        </div>

        {/* IK Mechanical Impact Resistance (IEC 62262) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              {isFr ? 'RÉSISTANCE AUX CHOCS MÉCANIQUES (CEI 62262)' : 'MECHANICAL IMPACT RATING (IEC 62262)'}
            </span>
            <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {ikRating} ({ikDescription.joules} J)
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {isFr ? 'Indice de Tenue aux Chocs IK' : 'Target IK Rating'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['IK07', 'IK08', 'IK09', 'IK10'] as IkRating[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setIkRating(r)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-mono font-bold transition ${
                    ikRating === r
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">{isFr ? 'Énergie d\'impact :' : 'Impact Energy:'}</span>
              <span className="text-amber-400 font-bold">{ikDescription.joules} Joules</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">{isFr ? 'Masse / Hauteur de chute :' : 'Test Mass / Drop Height:'}</span>
              <span className="text-white font-bold">{ikDescription.massKg} kg d\'une hauteur de {ikDescription.heightMm} mm</span>
            </div>
            <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
              {isFr ? ikDescription.descFr : ikDescription.descEn}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Electrodynamic Busbar Short-Circuit Forces & Support Spacing (IEC 60865-1 / IEC 61439-1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            {isFr 
              ? 'TENUE ÉLECTRODYNAMIQUE & ESPACEMENT DES SUPPORTS DE JEU DE BARRES (CEI 60865-1)' 
              : 'ELECTRODYNAMIC BUSBAR WITHSTAND & SUPPORT SPACING (IEC 60865-1)'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Icw = {prospectiveIscKa} kA (1s) · Ipk = {prospectivePeakIpkKa} kA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {isFr ? 'Entraxe entre Phases (d)' : 'Phase Spacing (d)'}
            </label>
            <div className="relative">
              <input 
                type="number"
                min={50}
                max={250}
                step={10}
                value={busbarPhaseSpacingMm}
                onChange={(e) => setBusbarPhaseSpacingMm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-500">mm</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {isFr ? 'Distance entre Isolateurs Supports (L)' : 'Insulator Support Pitch (L)'}
            </label>
            <div className="relative">
              <input 
                type="number"
                min={150}
                max={800}
                step={25}
                value={busbarSupportDistanceMm}
                onChange={(e) => setBusbarSupportDistanceMm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-500">mm</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {isFr ? 'Matériau des Barres' : 'Busbar Conductor'}
            </label>
            <select 
              value={busbarMaterial}
              onChange={(e) => setBusbarMaterial(e.target.value as BusbarMaterial)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            >
              <option value="COPPER">{isFr ? 'Cuivre Cu-ETP (Rm = 200-250 N/mm²)' : 'Copper Cu-ETP (Rm = 200-250 N/mm²)'}</option>
              <option value="ALUMINUM">{isFr ? 'Aluminium Al-Mg-Si (Rm = 130-180 N/mm²)' : 'Aluminum Alloy (Rm = 130-180 N/mm²)'}</option>
            </select>
          </div>

        </div>

        {/* Calculation Result Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Force Électrodynamique Crête (Fm)' : 'Peak Electrodynamic Force (Fm)'}
            </span>
            <span className="text-base font-bold font-mono text-indigo-400">
              {electrodynamicForceFmNewtons.toLocaleString()} N
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              ≈ {(electrodynamicForceFmNewtons / 9.81).toFixed(0)} kg-force
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Entraxe Max Supports Recommandé' : 'Max Recommended Support Span'}
            </span>
            <span className="text-base font-bold font-mono text-cyan-400">
              ≤ {maxAllowableSupportSpanMm} mm
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {isFr ? 'Pour isolateurs 10 kN standards' : 'For standard 10 kN insulators'}
            </span>
          </div>

          <div className={`border p-3 rounded-xl ${
            isSupportSpanSafe ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            <span className="text-[10px] font-mono block uppercase opacity-80">
              {isFr ? 'Validation Tenue Mécanique' : 'Mechanical Withstand Status'}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold font-mono text-sm">
              {isSupportSpanSafe ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'CONFORME CEI 61439-1' : 'COMPLIANT IEC 61439-1'}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{isFr ? 'ESPACEMENT TROP GRAND' : 'SPAN EXCEEDED'}</span>
                </>
              )}
            </div>
            <span className="text-[10px] opacity-80 block mt-0.5">
              {isSupportSpanSafe 
                ? (isFr ? `Pas de ${busbarSupportDistanceMm} mm validé` : `Pitch ${busbarSupportDistanceMm} mm verified`)
                : (isFr ? `Réduire l'espacement à ≤ ${maxAllowableSupportSpanMm} mm` : `Reduce pitch to ≤ ${maxAllowableSupportSpanMm} mm`)}
            </span>
          </div>
        </div>

      </div>

      {/* 5. Regulatory Engineering Summary Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold font-mono text-white">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          {isFr ? 'RÉCAPITULATIF DE CONCEPTION TGBT CONSUEL / IEC 61439' : 'SWITCHBOARD SPECIFICATION SUMMARY FOR AUDIT'}
        </div>
        <p className="text-slate-400 leading-relaxed">
          {isFr 
            ? `Le tableau général TGBT est spécifié en ${formData.code} (${formData.nameFr}), degré de protection ${ipCodeString}, tenue mécanique aux chocs ${ikRating}. Les jeux de barres principaux sont dimensionnés pour un courant nominal de ${tgbtCurrentA} A, un courant de court-circuit Icw de ${prospectiveIscKa} kA (1s) et un courant de crête Ipk de ${prospectivePeakIpkKa} kA avec supports isolateurs espacés de ${busbarSupportDistanceMm} mm.`
            : `The main switchboard (TGBT) is specified in ${formData.code} (${formData.nameEn}), degree of ingress protection ${ipCodeString}, mechanical impact rating ${ikRating}. The main copper busbar is rated for nominal current ${tgbtCurrentA} A, short-time withstand Icw ${prospectiveIscKa} kA (1s) and peak Ipk ${prospectivePeakIpkKa} kA with insulator pitch of ${busbarSupportDistanceMm} mm.`}
        </p>
      </div>

    </div>
  );
};
