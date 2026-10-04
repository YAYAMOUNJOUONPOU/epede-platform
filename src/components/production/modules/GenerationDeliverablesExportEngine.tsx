// src/components/production/modules/GenerationDeliverablesExportEngine.tsx
// EPEDE D01 - Generation Project Stamped Engineering Dossier & Professional Cameroon BOQ (DQE) Export Engine

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
  Compass,
  Cpu
} from 'lucide-react';
import {
  CAMEROON_GENERATION_FLEET,
  type CameroonPowerPlant
} from '../data/cameroonGenerationFleet';

interface GenerationDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  selectedPlantId: string;
  technology: string;
  headM: number;
  flowM3s: number;
  voltageKv: number;
  stepUpKv: number;
  calculations: {
    hydraulicPowerMw: number;
    mechanicalShaftPowerMw: number;
    electricalActivePowerMw: number;
    apparentPowerMva: number;
    statorNominalCurrentAmps: number;
    reactivePowerCapacityMvar: number;
    annualGenerationGwh: number;
    capacityFactorPct: number;
    avoidedCo2TonnesPerYear: number;
    estimatedProjectCostFcfa: number;
    estimatedProjectCostEur: number;
  };
}

export const GenerationDeliverablesExportEngine: React.FC<GenerationDeliverablesExportEngineProps> = ({
  locale,
  selectedPlantId,
  technology,
  headM,
  flowM3s,
  voltageKv,
  stepUpKv,
  calculations
}) => {
  const activePlant = CAMEROON_GENERATION_FLEET.find(p => p.id === selectedPlantId) || CAMEROON_GENERATION_FLEET[0];
  const [activeTab, setActiveTab] = useState<'DOSSIER' | 'BOQ'>('DOSSIER');

  // Realistic generation plant BOQ breakdown (tailored to active plant sizing)
  const unitsCount = activePlant.unitsCount || 1;
  const unitCapacityMw = Math.round(calculations.electricalActivePowerMw / unitsCount);

  const boqSections = [
    {
      title_fr: '1. Aménagements Génie Civil Hydraulique & Ouvrages de Retenue',
      title_en: '1. Civil Hydraulic Structures & Water Retention Works',
      items: [
        {
          ref: 'GC-01',
          desc_fr: `Barrage déversoir en béton compacté au rouleau (BCR) avec vannes segments de crue`,
          desc_en: `Roller Compacted Concrete (RCC) weir dam with radial spillway gates`,
          qty: 1,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.28)
        },
        {
          ref: 'GC-02',
          desc_fr: `Prise d'eau usinière, grilles fines de dégrillage et dégrilleur oléohydraulique automatisé`,
          desc_en: `Power water intake structure, fine trash racks and automated hydraulic trash rake`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.05 / unitsCount)
        },
        {
          ref: 'GC-03',
          desc_fr: `Conduites forcées en acier haute résistance et massif d’ancrage béton armé`,
          desc_en: `High-tensile steel surface penstocks with reinforced concrete thrust anchor blocks`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.08 / unitsCount)
        }
      ]
    },
    {
      title_fr: '2. Équipements Électromécaniques & Turbines de Puissance',
      title_en: '2. Electromechanical Powertrain & Hydraulic Turbines',
      items: [
        {
          ref: 'EM-01',
          desc_fr: `Turbines hydrauliques Francis à axe vertical (${unitCapacityMw} MW / unité) avec bâche spirale et avant-distributeur`,
          desc_en: `Vertical Francis hydraulic turbines (${unitCapacityMw} MW / unit) with spiral casing and stay ring`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.18 / unitsCount)
        },
        {
          ref: 'EM-02',
          desc_fr: `Vannes de pied d'usine (Vannes papillon ou sphériques biplan DN 3200 mm) avec contrepoids de sécurité`,
          desc_en: `Main inlet valves (spherical or biplane butterfly DN 3200 mm) with gravity counterweight closing`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.04 / unitsCount)
        },
        {
          ref: 'EM-03',
          desc_fr: `Régulateurs électroniques de vitesse à commande oléohydraulique HP (160 bar) avec accumulateurs à azote`,
          desc_en: `Electronic speed governing systems with high-pressure hydraulic power unit (160 bar) and N2 accumulators`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.03 / unitsCount)
        }
      ]
    },
    {
      title_fr: '3. Alternateurs Synchrones, Excitation & Évacuation Électrique',
      title_en: '3. Synchronous Generators, Excitation & Electrical Evacuation',
      items: [
        {
          ref: 'EL-01',
          desc_fr: `Alternateurs synchrones triphasés à pôles saillants (${voltageKv} kV, 50 Hz, cos φ = 0.90, classe d'isolement F/B)`,
          desc_en: `Three-phase salient-pole synchronous generators (${voltageKv} kV, 50 Hz, cos phi = 0.90, insulation class F/B)`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.16 / unitsCount)
        },
        {
          ref: 'EL-02',
          desc_fr: `Systèmes d'excitation statique à thyristors avec régulateur automatique de tension (AVR double canal)`,
          desc_en: `Static thyristor excitation systems with dual-channel Automatic Voltage Regulator (AVR)`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.025 / unitsCount)
        },
        {
          ref: 'EL-03',
          desc_fr: `Disjoncteurs de générateur (GCB ${voltageKv} kV, coupure SF6, tenue courant asymétrique) et gaines IPB`,
          desc_en: `Generator Circuit Breakers (GCB ${voltageKv} kV, SF6 interruption, delayed zero withstand) and IPB ducts`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.035 / unitsCount)
        },
        {
          ref: 'EL-04',
          desc_fr: `Transformateurs élévateurs principaux de groupe (GSU ${voltageKv}/${stepUpKv} kV, refroidissement ONAF/OFAF)`,
          desc_en: `Generator Step-Up Transformers (GSU ${voltageKv}/${stepUpKv} kV, ONAF/OFAF cooling, on-load tap changer)`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.06 / unitsCount)
        }
      ]
    },
    {
      title_fr: '4. Auxiliaires de Centrale (BoP), Protections & Essais de Mise en Service',
      title_en: '4. Plant Auxiliaries (BoP), Protection Relays & Commissioning Tests',
      items: [
        {
          ref: 'AUX-01',
          desc_fr: `Services propres alternatifs (400V TGBT secouru, transformateurs TAG/TSG) et continus (110 Vcc / 48 Vcc)`,
          desc_en: `AC station service distribution (400V emergency switchboard) and DC battery backup (110 Vdc / 48 Vdc)`,
          qty: 1,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.02)
        },
        {
          ref: 'AUX-02',
          desc_fr: `Groupe électrogène diesel de secours 1500 kVA pour réamorçage autonome (Black Start)`,
          desc_en: `Emergency diesel generator 1500 kVA for autonomous plant Black Start restoration`,
          qty: 1,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.015)
        },
        {
          ref: 'AUX-03',
          desc_fr: `Armoires de protection numérique redondantes de tranche (ANSI 87G, 64S, 64R, 40, 24, 51V) et SCADA/DCS`,
          desc_en: `Redundant digital unit protection cubicles (ANSI 87G, 64S, 64R, 40, 24, 51V) and plant SCADA/DCS`,
          qty: unitsCount,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.02 / unitsCount)
        },
        {
          ref: 'AUX-04',
          desc_fr: `Campagne d'essais SAT, premier remplissage, survitesse, délestage à 100% Pn et synchronisation réseau`,
          desc_en: `SAT commissioning campaign, water filling, runaway speed, 100% load rejection and grid synchronization`,
          qty: 1,
          unitCostFcfa: Math.round(calculations.estimatedProjectCostFcfa * 0.015)
        }
      ]
    }
  ];

  // Calculate sum of itemized BOQ
  const calculatedTotalBoqFcfa = boqSections.reduce((accSec, sec) => {
    return accSec + sec.items.reduce((accItem, item) => accItem + (item.qty * item.unitCostFcfa), 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-6 font-mono text-xs shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222B38] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold uppercase">
              {locale === 'fr' ? 'Dossier d’Ingénierie & DQE Conforme CEI' : 'Engineering Dossier & BOQ (IEC Compliant)'}
            </span>
            <span className="text-[10px] text-slate-500">Réf : EPEDE-D01-GEN-{selectedPlantId.toUpperCase()}</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>
              {locale === 'fr' ? `Dossier Technique & Devis Quantitatif Estimatif : ${activePlant.name}` : `Technical Dossier & Bill of Quantities: ${activePlant.name}`}
            </span>
          </h3>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl p-1 bg-[#0E141F] border border-[#222B38]">
            <button
              type="button"
              onClick={() => setActiveTab('DOSSIER')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'DOSSIER' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? '1. Fiche de Synthèse' : '1. Summary Sheet'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BOQ')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'BOQ' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? '2. Devis DQE (FCFA)' : '2. BOQ Schedule (FCFA)'}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl bg-[#0E141F] hover:bg-[#161F2E] border border-[#222B38] text-slate-300 hover:text-white transition-all cursor-pointer"
            title={locale === 'fr' ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW 1: STAMPED ENGINEERING DOSSIER SUMMARY */}
      {activeTab === 'DOSSIER' && (
        <div className="space-y-6">
          {/* Engineering Stamped Header Block */}
          <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Ouvrage de Production' : 'Generation Asset'}</div>
              <div className="text-sm font-bold text-white">{activePlant.name}</div>
              <div className="text-[11px] text-slate-400">{activePlant.location} ({activePlant.region}, Cameroun)</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Opérateur & Réseau' : 'Operator & Grid'}</div>
              <div className="text-sm font-bold text-sky-400">{activePlant.operator}</div>
              <div className="text-[11px] text-slate-400">Zone : {activePlant.gridZone} (Évacuation {stepUpKv} kV)</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Statut d’Homologation' : 'Engineering Approval'}</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>EPEDE MASTER ENGINEERING VERIFIED</span>
              </div>
              <div className="text-[10px] text-slate-400">Normes CEI 60034 / CEI 61362 / IEEE C37.102</div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Installée' : 'Installed Capacity'}</div>
              <div className="text-lg font-bold text-sky-400">{calculations.electricalActivePowerMw} MW</div>
              <div className="text-[10px] text-slate-400">{unitsCount} groupe(s) unitaire(s)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Apparente S' : 'Apparent Power S'}</div>
              <div className="text-lg font-bold text-amber-400">{calculations.apparentPowerMva} MVA</div>
              <div className="text-[10px] text-slate-400">@ cos φ = 0.90, In = {calculations.statorNominalCurrentAmps.toLocaleString()} A</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Chute Nette & Débit' : 'Net Head & Discharge'}</div>
              <div className="text-lg font-bold text-emerald-400">
                {headM > 0 ? `${headM} m • ${flowM3s} m³/s` : 'Thermique/PV'}
              </div>
              <div className="text-[10px] text-slate-400">Rendement usine : 91.5%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Productible Annuel' : 'Annual Generation'}</div>
              <div className="text-lg font-bold text-violet-400">{calculations.annualGenerationGwh.toLocaleString()} GWh/an</div>
              <div className="text-[10px] text-slate-400">Facteur charge : {calculations.capacityFactorPct}%</div>
            </div>
          </div>

          {/* Plant Systems Architecture Summary */}
          <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Synthèse des Sous-Systèmes Constructifs' : 'Constructive Subsystems Synthesis'}</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>{locale === 'fr' ? 'Ouvrages de Retenue & Prise d’Eau' : 'Dam & Water Intake'}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  {locale === 'fr'
                    ? 'Barrage régulateur avec évacuateur de crues dimensionné pour la crue décamillénale (Q10000). Prise d’eau usinière équipée de vannes wagon et de grilles fines anti-embâcles (espacement 50 mm).'
                    : 'Regulating dam with radial spillway designed for 10,000-year flood event (Q10000). Power intake with wagon stoplog gates and 50 mm trash racks.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{locale === 'fr' ? 'Turbine & Régulateur de Vitesse' : 'Turbine & Speed Governor'}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  {locale === 'fr'
                    ? 'Roue Francis en acier inoxydable 13Cr-4Ni résistant à l’érosion par cavitation. Régulateur de vitesse PID à commande oléohydraulique haute pression (160 bar) avec temps de fermeture vannage Ta = 4.5 s.'
                    : 'Francis runner cast in cavitation-resistant 13Cr-4Ni stainless steel. High-pressure PID speed governor (160 bar) with 4.5 s wicket gate closing time.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{locale === 'fr' ? 'Alternateur & Système d’Excitation' : 'Generator & Excitation System'}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  {locale === 'fr'
                    ? 'Alternateur synchrone vertical à pôles saillants (15 kV, 50 Hz, 24 paires de pôles). Excitation statique à thyristors avec plafond de tension 2.0 Un et régulateur automatique de tension (AVR/PSS).'
                    : 'Vertical salient-pole synchronous generator (15 kV, 50 Hz, 24 pole pairs). Static thyristor excitation with 2.0 pu ceiling voltage and digital AVR/PSS.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>{locale === 'fr' ? 'Protections ANSI & Services Auxiliaires' : 'ANSI Protection & Auxiliary Services'}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  {locale === 'fr'
                    ? 'Double chaîne de protection différentielle 87G et terre statorique 100% 64S/59N. Services propres secourus par groupe diesel 1500 kVA à démarrage automatique en < 15 s (Black Start).'
                    : 'Dual redundant 87G differential and 100% 64S/59N stator ground protection. Station auxiliaries backed up by 1500 kVA emergency diesel genset (Black Start).' }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ITEMIZED BOQ / DQE SCHEDULE */}
      {activeTab === 'BOQ' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#222B38]">
            <span>{locale === 'fr' ? 'Bordereau des Prix Unitaires & Détail Quantitatif Estimatif (DQE)' : 'Unit Price Schedule & Detailed Bill of Quantities'}</span>
            <span className="text-sky-400 font-bold">{locale === 'fr' ? 'Devise : Franc CFA (XAF)' : 'Currency: CFA Franc (XAF)'}</span>
          </div>

          <div className="space-y-4">
            {boqSections.map((sec, idx) => (
              <div key={idx} className="rounded-xl border border-[#222B38] overflow-hidden bg-[#0E141F]">
                <div className="p-3 bg-[#131A26] border-b border-[#222B38] font-bold text-sky-300 text-xs">
                  {locale === 'fr' ? sec.title_fr : sec.title_en}
                </div>
                <div className="divide-y divide-[#1F2937]">
                  {sec.items.map((item) => (
                    <div key={item.ref} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 sm:max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                            {item.ref}
                          </span>
                          <span className="text-slate-200 font-bold">
                            {locale === 'fr' ? item.desc_fr : item.desc_en}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 sm:text-right">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Quantité</div>
                          <div className="font-bold text-white">{item.qty}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Montant Total FCFA</div>
                          <div className="font-bold text-amber-400">
                            {(item.qty * item.unitCostFcfa).toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-[#0E141F] to-[#090D14] border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">{locale === 'fr' ? 'Montant Total Estimatif du Projet d’Usine' : 'Total Plant Project Estimated Cost'}</div>
              <div className="text-[11px] text-slate-500">
                {locale === 'fr' ? 'Inclut Génie Civil, Électromécanique, Évacuation HTB et Essais SAT' : 'Includes Civil Works, Electromechanical, Substation & Commissioning'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {calculatedTotalBoqFcfa.toLocaleString()} FCFA
              </div>
              <div className="text-xs text-slate-400">
                ≈ {Math.round(calculatedTotalBoqFcfa / 655.957).toLocaleString()} € EUR
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
