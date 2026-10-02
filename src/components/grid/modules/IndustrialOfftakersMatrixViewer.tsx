import React, { useState } from 'react';
import { 
  Factory, 
  Zap, 
  ShieldAlert, 
  Waves, 
  Anchor, 
  Building, 
  Gauge, 
  Power, 
  Sliders, 
  CheckCircle, 
  AlertOctagon,
  TrendingDown,
  Info
} from 'lucide-react';

interface IndustrialClient {
  id: string;
  name: string;
  category: 'Métallurgie Lourde' | 'Infrastructure Portuaire' | 'Eau Potable Stratégique' | 'Cimenteries' | 'Agro-Industrie' | 'Mines';
  location: string;
  substationFeed: string;
  voltageKV: number;
  contractCapacityMW: number;
  currentDemandMW: number;
  powerFactorCosPhi: number;
  sheddingPriority: 'Priorité 0 (Exempté)' | 'Priorité 1 (Critique)' | 'Priorité 2 (Délestage Négocié)' | 'Priorité 3 (Interrompible)';
  criticalRisk: string;
  annualConsumptionGWh: number;
  tariffCode: 'HT-B (>50 MW)' | 'HT-A (5-50 MW)' | 'MT Industrie';
  curtailed: boolean;
}

export const IndustrialOfftakersMatrixViewer: React.FC = () => {
  const [clients, setClients] = useState<IndustrialClient[]>([
    {
      id: 'alucam',
      name: 'ALUCAM (Aluminium du Cameroun)',
      category: 'Métallurgie Lourde',
      location: 'Edéa, Région du Littoral',
      substationFeed: 'Poste 90 kV Edéa I & II (Alimentation dédiée)',
      voltageKV: 90,
      contractCapacityMW: 155,
      currentDemandMW: 142,
      powerFactorCosPhi: 0.96,
      sheddingPriority: 'Priorité 2 (Délestage Négocié)',
      criticalRisk: 'Figeage irréversible des cuves d\'électrolyse si coupure > 4h (Pertes > 80 Mds FCFA).',
      annualConsumptionGWh: 1180,
      tariffCode: 'HT-B (>50 MW)',
      curtailed: false
    },
    {
      id: 'camwater-akomnyada',
      name: 'CAMWATER Station d\'Exhaure d\'Akomnyada',
      category: 'Eau Potable Stratégique',
      location: 'Mbalmayo / Fleuve Nyong',
      substationFeed: 'Poste 90/30 kV Ahala & Nomayos (Double antenne)',
      voltageKV: 30,
      contractCapacityMW: 22,
      currentDemandMW: 19.5,
      powerFactorCosPhi: 0.92,
      sheddingPriority: 'Priorité 0 (Exempté)',
      criticalRisk: 'Rupture immédiate de l\'approvisionnement en eau potable de Yaoundé (3,5 millions d\'habitants).',
      annualConsumptionGWh: 155,
      tariffCode: 'HT-A (5-50 MW)',
      curtailed: false
    },
    {
      id: 'camwater-yato',
      name: 'CAMWATER Usine de Traitement de Yato',
      category: 'Eau Potable Stratégique',
      location: 'Békoko / Fleuve Sanaga',
      substationFeed: 'Poste 225/90/30 kV Békoko',
      voltageKV: 30,
      contractCapacityMW: 26,
      currentDemandMW: 23.2,
      powerFactorCosPhi: 0.93,
      sheddingPriority: 'Priorité 0 (Exempté)',
      criticalRisk: 'Interruption de 70% de l\'eau potable alimentant l\'agglomération et le pôle industriel de Douala.',
      annualConsumptionGWh: 185,
      tariffCode: 'HT-A (5-50 MW)',
      curtailed: false
    },
    {
      id: 'pak-kribi',
      name: 'Port Autonome de Kribi (PAK)',
      category: 'Infrastructure Portuaire',
      location: 'Mboro, Kribi, Océan',
      substationFeed: 'Poste 225/30 kV Kribi Ville & Centrale Gaz KPDC',
      voltageKV: 30,
      contractCapacityMW: 38,
      currentDemandMW: 31.0,
      powerFactorCosPhi: 0.95,
      sheddingPriority: 'Priorité 1 (Critique)',
      criticalRisk: 'Arrêt portiques STS conteneurs, rupture de chaîne du froid sur parc de reefers maritimes.',
      annualConsumptionGWh: 240,
      tariffCode: 'HT-A (5-50 MW)',
      curtailed: false
    },
    {
      id: 'dangote-cement',
      name: 'Dangote Cement Cameroon S.A.',
      category: 'Cimenteries',
      location: 'Quai de déchargement Base Elf, Douala',
      substationFeed: 'Poste 90/15 kV Deido / Bassa',
      voltageKV: 15,
      contractCapacityMW: 18,
      currentDemandMW: 16.4,
      powerFactorCosPhi: 0.89,
      sheddingPriority: 'Priorité 3 (Interrompible)',
      criticalRisk: 'Arrêt des broyeurs à boulets; clause d\'effacement tarifaire lors de la pointe du soir.',
      annualConsumptionGWh: 125,
      tariffCode: 'HT-A (5-50 MW)',
      curtailed: false
    },
    {
      id: 'cimencam-nomayos',
      name: 'CIMENCAM Usine de Broyage de Nomayos',
      category: 'Cimenteries',
      location: 'Nomayos, Périphérie Yaoundé',
      substationFeed: 'Poste d\'interconnexion 225/90/15 kV Nomayos',
      voltageKV: 15,
      contractCapacityMW: 15,
      currentDemandMW: 13.8,
      powerFactorCosPhi: 0.90,
      sheddingPriority: 'Priorité 3 (Interrompible)',
      criticalRisk: 'Effacement automatique préprogrammé en heure de pointe (18h-22h).',
      annualConsumptionGWh: 98,
      tariffCode: 'HT-A (5-50 MW)',
      curtailed: false
    },
    {
      id: 'sosucam',
      name: 'SOSUCAM Sucreries du Cameroun',
      category: 'Agro-Industrie',
      location: 'Mbandjock & Nkoteng, Haute-Sanaga',
      substationFeed: 'Ligne 90 kV Edéa-Yaoundé / Oyomabang & Cogénération Biomasse',
      voltageKV: 30,
      contractCapacityMW: 12,
      currentDemandMW: 8.5,
      powerFactorCosPhi: 0.94,
      sheddingPriority: 'Priorité 2 (Délestage Négocié)',
      criticalRisk: 'Arrêt de campagne de broyage canne; injection saisonnière de surplus cogénération bagasse (10 MW).',
      annualConsumptionGWh: 55,
      tariffCode: 'MT Industrie',
      curtailed: false
    }
  ]);

  const [selectedClientId, setSelectedClientId] = useState<string>('alucam');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Toggle curtailment simulation
  const toggleCurtailment = (id: string) => {
    setClients(clients.map(c => {
      if (c.id === id) {
        // Exempt cannot be curtailed easily
        if (c.sheddingPriority === 'Priorité 0 (Exempté)' && !c.curtailed) {
          alert("ATTENTION ARSEL / MINEE : Client classé Priorité 0 Exempté de délestage!");
        }
        return { ...c, curtailed: !c.curtailed };
      }
      return c;
    }));
  };

  // Aggregated calculations
  const totalSubscribedMW = clients.reduce((sum, c) => sum + c.contractCapacityMW, 0);
  const activeIndustrialDemandMW = clients.reduce((sum, c) => sum + (c.curtailed ? 0 : c.currentDemandMW), 0);
  const totalCurtailedMW = clients.filter(c => c.curtailed).reduce((sum, c) => sum + c.currentDemandMW, 0);
  const filteredClients = filterCategory === 'ALL' ? clients : clients.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Factory className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Grands Comptes HT-B & HT-A • SONATREL / Eneo
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Charges Stratégiques & Électro-Intensives
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Matrice des Gros Consommateurs Industriels & Postes Dédiés
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Supervision des charges lourdes structurantes du Cameroun (ALUCAM, Port de Kribi, cimenteries, stations d'eau potable CAMWATER). 
              Gestion de l'effacement de pointe (<strong className="text-amber-300">Peak Shaving</strong>) et des dérogations contractuelles ARSEL.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Appel Industriel Actif</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {activeIndustrialDemandMW.toFixed(1)} MW
              </div>
              <div className="text-[10px] text-slate-500">Souscrit: {totalSubscribedMW} MW</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Volume Effacé (Délesté)</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {totalCurtailedMW.toFixed(1)} MW
              </div>
              <div className="text-[10px] text-slate-500">Soulagement réseau</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Poids dans le RIS</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">~ 28%</div>
              <div className="text-[10px] text-slate-500">De la charge de pointe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {['ALL', 'Métallurgie Lourde', 'Infrastructure Portuaire', 'Eau Potable Stratégique', 'Cimenteries', 'Agro-Industrie'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === cat 
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {cat === 'ALL' ? 'Tous les Offtakers (' + clients.length + ')' : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Client Cards + Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Industrial Offtakers List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredClients.map((client) => {
            const isSelected = selectedClientId === client.id;
            return (
              <div 
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                  isSelected 
                    ? 'bg-slate-900/90 border-amber-500/70 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-2.5 rounded-lg border mt-0.5 ${
                      client.curtailed 
                        ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                        : client.category === 'Métallurgie Lourde' 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : client.category === 'Eau Potable Stratégique'
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                            : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                    }`}>
                      {client.category === 'Eau Potable Stratégique' ? <Waves className="w-5 h-5" /> :
                       client.category === 'Infrastructure Portuaire' ? <Anchor className="w-5 h-5" /> :
                       client.category === 'Cimenteries' ? <Building className="w-5 h-5" /> :
                       <Factory className="w-5 h-5" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-sm">{client.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {client.tariffCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          client.sheddingPriority.includes('Exempté') 
                            ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                            : client.sheddingPriority.includes('Critique')
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {client.sheddingPriority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>{client.location}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-300">{client.substationFeed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Appel Actuel</div>
                      <div className={`text-base font-bold font-mono ${client.curtailed ? 'text-red-400 line-through' : 'text-amber-400'}`}>
                        {client.curtailed ? '0.0 MW' : `${client.currentDemandMW} MW`}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">cos φ = {client.powerFactorCosPhi}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCurtailment(client.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        client.curtailed 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{client.curtailed ? 'EFFACÉ' : 'EN SERVICE'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Technical Inspector for Selected Offtaker */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Fiche Technique & Contrat PPA</h3>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">{selectedClient.voltageKV} kV</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-black text-white">{selectedClient.name}</h4>
                <div className="text-xs text-amber-400/90 font-mono mt-0.5">{selectedClient.category}</div>
              </div>

              {/* Critical Risk Alert Box */}
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Vulnérabilité & Risque Critique d'Interruption</span>
                </div>
                <p className="text-[11px] text-red-200/90 leading-relaxed">
                  {selectedClient.criticalRisk}
                </p>
              </div>

              {/* Parameters Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Poste & Tension d'injection:</span>
                  <span className="font-mono text-slate-200 text-right">{selectedClient.substationFeed}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Puissance Souscrite PPA:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedClient.contractCapacityMW} MW</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Consommation Annuelle:</span>
                  <span className="font-mono text-white">{selectedClient.annualConsumptionGWh} GWh / an</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Facteur de Puissance (cos φ):</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedClient.powerFactorCosPhi}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Régime Tarifaire ARSEL:</span>
                  <span className="font-mono text-slate-200">{selectedClient.tariffCode}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Statut Délestage:</span>
                  <span className="font-mono font-bold text-indigo-400">{selectedClient.sheddingPriority}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Compensation Réactive:</span>
              <span className="text-emerald-400 font-mono font-bold">Batteries de condensateurs 90 kV OK</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Conforme au Code de Réseau Transport SONATREL Article 44 (Facteur de puissance minimal 0.90).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
