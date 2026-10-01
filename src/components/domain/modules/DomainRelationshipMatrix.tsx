// src/components/domain/modules/DomainRelationshipMatrix.tsx
import React, { useState } from 'react';
import { 
  Share2, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  Info,
  CheckCircle2
} from 'lucide-react';
import type { DomainCode } from '../../../types/epede';
import { DOMAINS } from '../../../data/epedeData';

interface DomainRelationshipMatrixProps {
  locale: 'fr' | 'en';
  activeDomainCode?: DomainCode;
  onSelectDomain: (code: DomainCode) => void;
}

type InteractionType = 'ENERGY_FLOW' | 'PROTECTION' | 'SCADA_CONTROL' | 'EARTHING_SAFETY' | 'STANDARDS';

interface DomainLink {
  source: DomainCode;
  target: DomainCode;
  type: InteractionType;
  labelFr: string;
  labelEn: string;
}

const DOMAIN_LINKS: DomainLink[] = [
  // Energy Flow Links (The Physical Backbone)
  { source: 'D01', target: 'D04', type: 'ENERGY_FLOW', labelFr: 'Évacuation 15/225 kV', labelEn: '15/225 kV GSU Step-Up' },
  { source: 'D04', target: 'D03', type: 'ENERGY_FLOW', labelFr: 'Injection Réseau THT', labelEn: '225 kV THT Grid Injection' },
  { source: 'D03', target: 'D04', type: 'ENERGY_FLOW', labelFr: 'Arrivée Ligne Poste Source', labelEn: 'Transmission Substation Feeder' },
  { source: 'D04', target: 'D05', type: 'ENERGY_FLOW', labelFr: 'Abaissement 225/30 kV vers HTA', labelEn: '225/30 kV Step-Down to MV' },
  { source: 'D05', target: 'D06', type: 'ENERGY_FLOW', labelFr: 'Poste HTA/BT 30 kV / 400 V', labelEn: 'MV/LV 30 kV / 400 V Substation' },
  { source: 'D05', target: 'D08', type: 'ENERGY_FLOW', labelFr: 'Alimentation Industrielle HTA', labelEn: 'Dedicated Industrial Feeder' },
  { source: 'D09', target: 'D05', type: 'ENERGY_FLOW', labelFr: 'Injection Décentralisée Solaire/Éolien', labelEn: 'DER Solar/Wind Feed-in' },
  { source: 'D10', target: 'D05', type: 'ENERGY_FLOW', labelFr: 'Stockage BESS Écrêtage Pointe', labelEn: 'BESS Peak Shaving & Support' },

  // Protection Links (D11 Interlocks)
  { source: 'D11', target: 'D01', type: 'PROTECTION', labelFr: 'Déclenchement 87G / 40 / 46', labelEn: '87G / 40 / 46 Generator Trip' },
  { source: 'D11', target: 'D04', type: 'PROTECTION', labelFr: 'Protection 87T, 50/51, Buchholz', labelEn: '87T, 50/51, Buchholz Trip' },
  { source: 'D11', target: 'D03', type: 'PROTECTION', labelFr: 'Téléprotection Distance 21 / 87L', labelEn: 'Line Distance 21 / 87L' },
  { source: 'D11', target: 'D05', type: 'PROTECTION', labelFr: 'Maximum de courant 50/51 & 67N', labelEn: 'Overcurrent 50/51 & 67N' },
  { source: 'D11', target: 'D08', type: 'PROTECTION', labelFr: 'Protection Moteurs 49 / 51LR', labelEn: 'Motor Protection 49 / 51LR' },
  { source: 'D11', target: 'D10', type: 'PROTECTION', labelFr: 'Protection BESS ANSI 49B / 50DC / 81U', labelEn: 'BESS Protection ANSI 49B / 50DC / 81U' },
  { source: 'D11', target: 'D12', type: 'SCADA_CONTROL', labelFr: 'Trames GOOSE & Enregistrement Comtrade', labelEn: 'GOOSE Telegrams & Comtrade Archive' },

  // SCADA & Automation Links (D12 & D13)
  { source: 'D12', target: 'D04', type: 'SCADA_CONTROL', labelFr: 'Supervision SAS CEI 61850', labelEn: 'SAS Control IEC 61850' },
  { source: 'D12', target: 'D02', type: 'SCADA_CONTROL', labelFr: 'Flux Télémesures & Estimation d\'État Dispatching', labelEn: 'Telemetries & State Estimation Feeds' },
  { source: 'D12', target: 'D10', type: 'SCADA_CONTROL', labelFr: 'Téléconduite Régulation FFR / P-Q BESS', labelEn: 'BESS FFR & P-Q Telecontrol Dispatch' },
  { source: 'D13', target: 'D03', type: 'SCADA_CONTROL', labelFr: 'Câble OPGW en Tête de Pylônes 225 kV', labelEn: 'OPGW Cable on 225 kV Towers' },
  { source: 'D13', target: 'D11', type: 'PROTECTION', labelFr: 'Canal Déterministe IEEE C37.94 (Différentielle 87L)', labelEn: 'Deterministic IEEE C37.94 Pipe (87L Differential)' },
  { source: 'D13', target: 'D12', type: 'SCADA_CONTROL', labelFr: 'Backbone WAN CEI 60870-5-104 & Horloge PTP', labelEn: 'WAN Backbone IEC 60870-5-104 & PTP Clock' },
  { source: 'D13', target: 'D02', type: 'SCADA_CONTROL', labelFr: 'Liaison Télécom Dispatching National CNC Yaoundé', labelEn: 'Telecom Link to National Dispatch CNC Yaoundé' },
  { source: 'D13', target: 'D04', type: 'SCADA_CONTROL', labelFr: 'Répartiteur ODF & Atelier Énergie 48 V DC', labelEn: 'ODF Rack & 48 V DC Power System' },
  { source: 'D12', target: 'D05', type: 'SCADA_CONTROL', labelFr: 'Télécommande Interrupteurs IACM', labelEn: 'Feeder Recloser Automation' },
  
  // Smart Metering & Digitalization Links (D15)
  { source: 'D15', target: 'D06', type: 'SCADA_CONTROL', labelFr: 'Télérelève Compteurs AMI (DLMS/COSEM)', labelEn: 'Smart Metering AMI Infrastructure (DLMS/COSEM)' },
  { source: 'D15', target: 'D05', type: 'ENERGY_FLOW', labelFr: 'Balance de Masse d\'Énergie & Détection Fraude', labelEn: 'Substation Mass Energy Balance & Non-Technical Loss' },
  { source: 'D15', target: 'D12', type: 'SCADA_CONTROL', labelFr: 'Passerelle MDMS / ADMS pour Conduite Distribution', labelEn: 'MDMS / ADMS Gateway for Distribution Automation' },
  { source: 'D15', target: 'D13', type: 'SCADA_CONTROL', labelFr: 'Collecte Télécoms CPL G3 / 4G LTE-M vers HES', labelEn: 'Telecom Ingestion G3-PLC / 4G LTE-M to HES' },
  { source: 'D15', target: 'D14', type: 'PROTECTION', labelFr: 'Cartographie Qualité d\'Onde & Creux de Tension Terminaux', labelEn: 'Endpoint Power Quality & Voltage Sag Mapping' },
  { source: 'D15', target: 'D16', type: 'EARTHING_SAFETY', labelFr: 'Surveillance Tension Neutre & Rupture de Terre Client', labelEn: 'Neutral Potential & Broken Earth Supervision' },

  // Power Quality & EMC Links (D14)
  { source: 'D14', target: 'D08', type: 'ENERGY_FLOW', labelFr: 'Dépollution Harmonique Active APF (H5, H7, H11)', labelEn: 'Active Harmonic Filter APF Cancellation (H5, H7, H11)' },
  { source: 'D14', target: 'D04', type: 'ENERGY_FLOW', labelFr: 'Filtrage Shunt & Risque Résonance Banc Condensateur', labelEn: 'Shunt Filtering & Capacitor Bank Resonance Risk' },
  { source: 'D14', target: 'D02', type: 'ENERGY_FLOW', labelFr: 'Soutien Dynamique de Tension STATCOM ±Q Mvar', labelEn: 'Dynamic Voltage Support STATCOM ±Q Mvar' },
  { source: 'D14', target: 'D07', type: 'PROTECTION', labelFr: 'Limitation Échauffement Harmonique Alternateurs/Moteurs', labelEn: 'Harmonic Heating Derating on Turbogenerators' },
  { source: 'D14', target: 'D16', type: 'EARTHING_SAFETY', labelFr: 'Blindage Électrostatique & Masse Haute Fréquence CEM', labelEn: 'Electrostatic Shielding & High-Frequency EMC Earth' },

  // Earthing & Safety Links (D16)
  { source: 'D16', target: 'D04', type: 'EARTHING_SAFETY', labelFr: 'Grille de Terre < 0.5 Ω & Maillage Équipotentiel', labelEn: 'Substation Earth Mesh < 0.5 Ω & Bonding Grid' },
  { source: 'D16', target: 'D05', type: 'EARTHING_SAFETY', labelFr: 'Résistance de Neutre RPN 30 kV (300 A / 10 s)', labelEn: 'Neutral Grounding Resistor (300 A / 10 s)' },
  { source: 'D16', target: 'D06', type: 'EARTHING_SAFETY', labelFr: 'Régimes de Neutre TT / TN-S / IT & Schémas de Liaison', labelEn: 'Earthing Schemes TT / TN / IT & Protection' },
  { source: 'D16', target: 'D03', type: 'EARTHING_SAFETY', labelFr: 'Prises de Terre Pieds de Pylônes & Câbles de Garde', labelEn: 'Tower Footing Grounding & Shield Wires' },
  { source: 'D16', target: 'D11', type: 'PROTECTION', labelFr: 'Protection Terre Sensible ANSI 50N/51N & 67N', labelEn: 'Sensitive Ground Fault Relaying ANSI 50N/51N & 67N' },
  { source: 'D16', target: 'D04', type: 'PROTECTION', labelFr: 'Détection Optique Ultra-Rapide Arc Flash (< 2 ms)', labelEn: 'Ultra-Fast Optical Arc Flash Detection (< 2 ms)' },
  { source: 'D16', target: 'D01', type: 'EARTHING_SAFETY', labelFr: 'Mise à la Terre Subaquatique Lit du Fleuve & Usine Hydro', labelEn: 'Subaquatic River Bed Ground Grid & Hydro Powerhouse' }
];

export const DomainRelationshipMatrix: React.FC<DomainRelationshipMatrixProps> = ({
  locale,
  activeDomainCode = 'D04',
  onSelectDomain,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainCode>(activeDomainCode);
  const [activeFilter, setActiveFilter] = useState<InteractionType | 'ALL'>('ALL');

  const currentDomainInfo = DOMAINS.find((d) => d.code === selectedDomain) || DOMAINS[0];

  // Inbound and Outbound links for the selected domain
  const relatedLinks = DOMAIN_LINKS.filter((l) => {
    const involvesSelected = l.source === selectedDomain || l.target === selectedDomain;
    if (!involvesSelected) return false;
    if (activeFilter !== 'ALL' && l.type !== activeFilter) return false;
    return true;
  });

  return (
    <div 
      id="domain-relationship-matrix-root"
      className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-xl font-sans"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              {locale === 'fr' 
                ? 'MATRICE D\'INTERCONNEXION DES 21 DOMAINES' 
                : '21-DOMAIN INTERCONNECTION MATRIX'}
            </h3>
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {locale === 'fr' 
              ? 'L\'Écosystème Électrique Entièrement Interconnecté' 
              : 'The Fully Interconnected Power Ecosystem'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {locale === 'fr'
              ? 'Aucun domaine électrique n\'existe en vase clos. Cliquez sur n\'importe quel domaine pour visualiser ses flux d\'énergie, ses signaux de protection, ses liaisons SCADA et sa sécurité.'
              : 'No electrical domain exists in isolation. Select any domain to reveal its energy flows, protection interlocks, SCADA controls, and earthing paths.'}
          </p>
        </div>

        {/* Interaction Type Filters */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px] self-start md:self-auto">
          {[
            { id: 'ALL' as const, labelFr: 'Tous les Flux', labelEn: 'All Flows' },
            { id: 'ENERGY_FLOW' as const, labelFr: 'Énergie (MW/Mvar)', labelEn: 'Energy (MW)' },
            { id: 'PROTECTION' as const, labelFr: 'Protections', labelEn: 'Protections' },
            { id: 'SCADA_CONTROL' as const, labelFr: 'SCADA / Téléconduite', labelEn: 'SCADA' },
            { id: 'EARTHING_SAFETY' as const, labelFr: 'Terre & Sécurité', labelEn: 'Earthing' },
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setActiveFilter(flt.id)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                activeFilter === flt.id
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-xs'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {locale === 'fr' ? flt.labelFr : flt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Quick-Selector Grid */}
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-slate-400 uppercase block">
          {locale === 'fr' ? '1. Sélectionnez le domaine de référence :' : '1. Select reference domain:'}
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {DOMAINS.map((d) => {
            const isSelected = d.code === selectedDomain;
            return (
              <button
                key={d.code}
                type="button"
                onClick={() => setSelectedDomain(d.code)}
                className={`p-2 rounded-xl text-left font-mono text-xs border transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-sm ring-2 ring-cyan-400/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="block font-bold text-[11px]">{d.code}</span>
                <span className="block text-[10px] truncate font-sans">
                  {locale === 'fr' ? d.short_fr : d.short_en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Domain Relational Cards */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400 font-bold">{selectedDomain}</span>
            <span className="text-slate-400">—</span>
            <span className="text-white font-bold font-sans">
              {locale === 'fr' ? currentDomainInfo.name_fr : currentDomainInfo.name_en}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectDomain(selectedDomain)}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>{locale === 'fr' ? `Ouvrir ${selectedDomain}` : `Open ${selectedDomain}`}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Links Cards */}
        {relatedLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedLinks.map((link, idx) => {
              const isOutbound = link.source === selectedDomain;
              const counterpartCode = isOutbound ? link.target : link.source;
              const counterpartDomain = DOMAINS.find((d) => d.code === counterpartCode);

              let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              if (link.type === 'PROTECTION') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              if (link.type === 'SCADA_CONTROL') badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
              if (link.type === 'EARTHING_SAFETY') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border uppercase ${badgeColor}`}>
                        {link.type.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">
                        {isOutbound ? '→ SORTANT' : '← ENTRANT'}
                      </span>
                    </div>

                    <h5 className="font-sans font-bold text-sm text-white">
                      {locale === 'fr' ? link.labelFr : link.labelEn}
                    </h5>

                    <p className="font-mono text-xs text-slate-400">
                      {isOutbound ? (
                        <>Vers <strong className="text-white">{counterpartCode}</strong> ({locale === 'fr' ? counterpartDomain?.short_fr : counterpartDomain?.short_en})</>
                      ) : (
                        <>Depuis <strong className="text-white">{counterpartCode}</strong> ({locale === 'fr' ? counterpartDomain?.short_fr : counterpartDomain?.short_en})</>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDomain(counterpartCode)}
                    className="pt-2 border-t border-slate-800/80 font-mono text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>{locale === 'fr' ? `Voir domaine ${counterpartCode}` : `Jump to ${counterpartCode}`}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 font-mono text-xs">
            {locale === 'fr' 
              ? 'Aucune liaison filtrée trouvée pour ce domaine avec ce filtre.' 
              : 'No filtered interconnections found for this domain under this filter.'}
          </div>
        )}
      </div>
    </div>
  );
};
