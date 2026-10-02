import React, { useState } from 'react';
import { 
  Scale, 
  ArrowRight, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Landmark, 
  Zap, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Layers
} from 'lucide-react';

interface ActorNode {
  id: string;
  name: string;
  shortName: string;
  role: string;
  legalBase: string;
  revenueModel: string;
  tariffShareFCFA: number; // typical share per kWh
  category: 'REGULATEUR' | 'GESTIONNAIRE_EAU' | 'PRODUCTEUR_IPP' | 'TRANSPORTEUR' | 'DISTRIBUTEUR' | 'CONSOMMATEURS';
  description: string;
}

export const ContractualGovernanceFlowViewer: React.FC = () => {
  const [selectedActorId, setSelectedActorId] = useState<string>('sonatrel');
  const [activeFlowTab, setActiveFlowTab] = useState<'FINANCIAL' | 'ENERGY' | 'REGULATORY'>('FINANCIAL');

  const actors: ActorNode[] = [
    {
      id: 'minee',
      name: 'Ministère de l\'Eau et de l\'Énergie',
      shortName: 'MINEE',
      role: 'Tutelle Institutionnelle & Stratégie Énergétique',
      legalBase: 'Loi N° 2011/022 du 14 décembre 2011 (Art. 4-6)',
      revenueModel: 'Budget de l\'État & Redevances de concession',
      tariffShareFCFA: 0.5,
      category: 'REGULATEUR',
      description: 'Définit la politique sectorielle, octroie les concessions de production et de transport, et pilote les grands programmes structurants.'
    },
    {
      id: 'arsel',
      name: 'Agence de Régulation du Secteur de l\'Électricité',
      shortName: 'ARSEL',
      role: 'Régulation Économique, Tarifs & Arbitrage',
      legalBase: 'Loi 2011/022 (Art. 60-75) & Décret N° 2013/217',
      revenueModel: 'Redevance réglementaire sur le kWh facturé (1.5%)',
      tariffShareFCFA: 1.2,
      category: 'REGULATEUR',
      description: 'Fixe les tarifs d\'accès au réseau (péage de transport SONATREL), les tarifs de vente au détail, protège les consommateurs et instruit les litiges contractuels.'
    },
    {
      id: 'edc',
      name: 'Electricity Development Corporation',
      shortName: 'EDC',
      role: 'Gestionnaire du Patrimoine Public & Régulateur de Bassin',
      legalBase: 'Décret N° 2006/406 & Gestion Lom Pangar',
      revenueModel: 'Redevance de stockage hydrologique perçue sur les centrales de la Sanaga',
      tariffShareFCFA: 3.5,
      category: 'GESTIONNAIRE_EAU',
      description: 'Gère les 6 milliards de m³ de Lom Pangar et les réservoirs de Mbakaou, Bamendjin et Mapé pour garantir 1 000 m³/s à l\'aval en saison sèche.'
    },
    {
      id: 'nhpc',
      name: 'Nachtigal Hydro Power Company (NHPC)',
      shortName: 'NHPC',
      role: 'Producteur Indépendant (IPP) Nachtigal (420 MW)',
      legalBase: 'Contrat de Concession & PPA 35 ans (take-or-pay)',
      revenueModel: 'Vente ferme d\'énergie PPA à Eneo/SONATREL (~ 42 FCFA/kWh)',
      tariffShareFCFA: 42.0,
      category: 'PRODUCTEUR_IPP',
      description: 'Consortium EDF (40%), IFC (20%), État du Cameroun (15%), Africa50 (15%), STOA (10%) exploitant la plus grande centrale du pays.'
    },
    {
      id: 'sonatrel',
      name: 'Société Nationale de Transport de l\'Électricité',
      shortName: 'SONATREL',
      role: 'Gestionnaire Unique du Réseau de Transport (GRT / TSO)',
      legalBase: 'Décret N° 2015/442 du 8 octobre 2015',
      revenueModel: 'Tarif de péage d\'accès au réseau de transport (wheeling fee)',
      tariffShareFCFA: 10.8,
      category: 'TRANSPORTEUR',
      description: 'Assure l\'exploitation, la maintenance et l\'extension du réseau 225/110/90 kV, la conduite du dispatching national (Mangombé) et la sécurité d\'approvisionnement.'
    },
    {
      id: 'eneo',
      name: 'Eneo Cameroon S.A.',
      shortName: 'Eneo',
      role: 'Distributeur Concessionnaire & Fournisseur d\'Énergie',
      legalBase: 'Contrat de Concession Distribution / Commercialisation',
      revenueModel: 'Vente d\'électricité aux usagers MT/BT & Grands Comptes',
      tariffShareFCFA: 22.0,
      category: 'DISTRIBUTEUR',
      description: 'Exploite le réseau de distribution MT/BT, assure le comptage, la facturation et le recouvrement auprès de plus de 1,8 million de ménages et d\'entreprises.'
    },
    {
      id: 'clients',
      name: 'Consommateurs Finaux (Ménages, Tertiaire & PME)',
      shortName: 'Usagers Finaux',
      role: 'Source Principale de Revenus du Secteur Électrique',
      legalBase: 'Barème tarifaire homologué par ARSEL',
      revenueModel: 'Paiement des factures (Tarif moyen pondéré: ~ 80 FCFA/kWh)',
      tariffShareFCFA: 80.0,
      category: 'CONSOMMATEURS',
      description: 'Injectent les flux financiers dans le secteur à travers le paiement mensuel de leurs consommations électriques.'
    }
  ];

  const selectedActor = actors.find(a => a.id === selectedActorId) || actors[4];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                <Scale className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                    Cadre Institutionnel • Loi N° 2011/022
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Modèle de Marché Dégroupé (Unbundling)
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Gouvernance Institutionnelle & Chaîne Contractuelle des Flux
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Cartographie exhaustive des interactions juridiques, contractuelles et financières régissant le secteur électrique camerounais : 
              mécanisme de <strong className="text-purple-300">Péage de transport SONATREL</strong>, contrats PPA (NHPC, KPDC), redevances d'eau EDC et régulation ARSEL.
            </p>
          </div>

          {/* Quick tab switcher for flow type */}
          <div className="flex bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            {[
              { id: 'FINANCIAL', label: 'Flux Financiers (FCFA)' },
              { id: 'ENERGY', label: 'Flux d\'Énergie (MWh)' },
              { id: 'REGULATORY', label: 'Cadre Juridique' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFlowTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFlowTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contractual Value Chain Diagram */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-sm">
              {activeFlowTab === 'FINANCIAL' ? 'Cascade des Règlements Financiers (Cash Clearing Waterfall)' :
               activeFlowTab === 'ENERGY' ? 'Chaîne Physique de l\'Énergie (De la Sanaga aux Prises Domestiques)' :
               'Architecture Réglementaire & Concessions de l\'État'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-purple-300">Tarif Moyen Référence: ~ 80 FCFA / kWh</span>
        </div>

        {/* Visual Cascade Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* 1. Usagers */}
          <div 
            onClick={() => setSelectedActorId('clients')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedActorId === 'clients' ? 'bg-purple-950/40 border-purple-500 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>1. Usagers Finaux</span>
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">80 FCFA</div>
            <div className="text-[10px] text-slate-400 mt-1">Facturation mensuelle Eneo (1.8M clients)</div>
            <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Encaissement Cash
            </div>
          </div>

          {/* 2. Eneo Distribution */}
          <div 
            onClick={() => setSelectedActorId('eneo')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedActorId === 'eneo' ? 'bg-purple-950/40 border-purple-500 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>2. Eneo Distribution</span>
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">22 FCFA</div>
            <div className="text-[10px] text-slate-400 mt-1">Marge distribution, comptage, recouvrement MT/BT</div>
            <div className="mt-3 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Péage Transport
            </div>
          </div>

          {/* 3. SONATREL Transport */}
          <div 
            onClick={() => setSelectedActorId('sonatrel')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedActorId === 'sonatrel' ? 'bg-purple-950/40 border-purple-500 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3. SONATREL (TSO)</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">10.8 FCFA</div>
            <div className="text-[10px] text-slate-400 mt-1">Péage de transport homologué ARSEL & dispatching</div>
            <div className="mt-3 text-[10px] font-mono text-amber-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Évacuation HT
            </div>
          </div>

          {/* 4. Producteurs IPP (NHPC / Globeleq) */}
          <div 
            onClick={() => setSelectedActorId('nhpc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedActorId === 'nhpc' ? 'bg-purple-950/40 border-purple-500 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>4. Producteurs / IPPs</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">42 FCFA</div>
            <div className="text-[10px] text-slate-400 mt-1">PPA Take-or-Pay Nachtigal (420 MW), Kribi Gaz</div>
            <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Redevance Eau
            </div>
          </div>

          {/* 5. EDC Régulation Eau & ARSEL */}
          <div 
            onClick={() => setSelectedActorId('edc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedActorId === 'edc' ? 'bg-purple-950/40 border-purple-500 shadow-md' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
              <Landmark className="w-4 h-4 text-indigo-400" />
              <span>5. EDC & ARSEL</span>
            </div>
            <div className="text-xl font-bold font-mono text-indigo-300 mt-1">5.2 FCFA</div>
            <div className="text-[10px] text-slate-400 mt-1">Redevance de stockage Lom Pangar + taxe régulation</div>
            <div className="mt-3 text-[10px] font-mono text-indigo-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Équilibre Sectoriel
            </div>
          </div>
        </div>
      </div>

      {/* Deep Actor Dossier & Statutory Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Selected Actor Technical Card */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">{selectedActor.category}</div>
              <h3 className="text-xl font-black text-white">{selectedActor.name}</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {selectedActor.shortName}
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {selectedActor.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Fondement Juridique</div>
              <div className="text-white font-bold mt-0.5">{selectedActor.legalBase}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Modèle de Rémunération</div>
              <div className="text-purple-300 font-bold mt-0.5">{selectedActor.revenueModel}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Part Moyenne dans le Tarif Final</div>
              <div className="text-emerald-400 font-bold font-mono mt-0.5 text-base">
                ~ {selectedActor.tariffShareFCFA} FCFA / kWh
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Interface de Compensation</div>
              <div className="text-cyan-400 font-bold mt-0.5">Compte Séquestre / Escrow & Clearing</div>
            </div>
          </div>

          {/* Legislative Articles Highlights */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>Extrait Clé de la Loi 2011/022 relative au secteur de l'électricité :</span>
            </div>
            <blockquote className="italic text-slate-300 pl-3 border-l-2 border-purple-500/60 text-[11px] leading-relaxed">
              « L'activité de transport de l'électricité est assurée à titre exclusif par une société à capital public (SONATREL). 
              Le gestionnaire du réseau de transport garantit un droit d'accès non discriminatoire aux tiers (producteurs, distributeurs et clients éligibles) 
              moyennant le paiement d'un tarif de péage approuvé par l'organisme de régulation (ARSEL). »
            </blockquote>
          </div>
        </div>

        {/* Right: Key Sector Bottlenecks & Clearing Mechanisms */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Garanties & Sécurisation Financière</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Garantie IDA / Banque Mondiale</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  PRG (Partial Risk Guarantee) de 200 M$ couvrant les obligations de paiement de l'acheteur d'électricité (Offtaker Eneo/SONATREL) envers NHPC pour Nachtigal.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Compte Séquestre (Escrow Account)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300">Sécurisé</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Mécanisme de cascade automatique (waterfall) prélevant en priorité les encaissements des gros clients industriels (ALUCAM, Port de Kribi) pour servir la dette.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Tarif Social Tranche 1 (0-110 kWh)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">Subventionné</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Tarif bloqué à 50 FCFA/kWh sans TVA pour les ménages modestes, compensé par péréquation tarifaire nationale gérée par le MINEE/ARSEL.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>Code Réseau SONATREL v2024</span>
            <span className="text-emerald-400 font-semibold">100% Conforme Loi 2011</span>
          </div>
        </div>
      </div>
    </div>
  );
};
