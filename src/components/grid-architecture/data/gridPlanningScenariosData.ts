// src/components/grid-architecture/data/gridPlanningScenariosData.ts
// EPEDE - Grid Planning & Expansion Scenario Models

import { GridPlanningScenario } from '../types';

export const GRID_PLANNING_SCENARIOS: GridPlanningScenario[] = [
  {
    id: 'scen-01-n1-contingency',
    title: { fr: 'Critère N-1 : Déclenchement d\'un Terne 225 kV Songloulou-Mangombé', en: 'N-1 Criterion: Outage of 225 kV Songloulou-Mangombé Circuit 1' },
    horizonYears: 'Exploitation Temps Réel & Études Saisonnieres',
    objective: {
      fr: 'Vérifier si le réseau 225 kV supporte la perte brutale du terne 1 sans surcharge thermique inadmissible sur le terne 2 et sans effondrement de tension à Douala.',
      en: 'Evaluate whether the grid safely withstands loss of 225 kV circuit 1 without overloading circuit 2 beyond its thermal limit or dropping voltage in Douala.'
    },
    baselineState: {
      demandMw: 1180,
      generationMw: 1220,
      criticalLineLoadingPct: 56,
      voltageLowestKv: 221.4
    },
    intervention: {
      type: 'contingency_n1',
      title: { fr: 'Déclenchement du Terne 1 (Défaut Foudre)', en: 'Circuit 1 Tripping (Lightning Strike)' },
      specs: {
        fr: 'Transit de 240 MW reporté intégralement sur le terne 2 en parallèle et le réseau 90 kV.',
        en: '240 MW transit instantaneously shifts onto parallel circuit 2 and 90 kV paths.'
      }
    },
    postInterventionState: {
      demandMw: 1180,
      generationMw: 1220,
      criticalLineLoadingPct: 92,
      voltageLowestKv: 215.8,
      n1Compliant: true,
      benefitExplanation: {
        fr: 'Le terne 2 absorbe le report sans dépasser sa limite thermique admissible temporaire (105% pendant 20 min). La tension reste au-dessus du seuil critique de 0.90 Un (202.5 kV). Aucune coupure client !',
        en: 'Circuit 2 handles the shifted flow within its emergency thermal rating (92% < 105%). Voltage stabilizes safely above the 0.90 Un threshold (215.8 kV > 202.5 kV). Zero customer outages.'
      }
    },
    technicalNotes: {
      fr: 'Conforme au Code de Réseau SONATREL §4.2 : l\'exploitant dispose de 15 minutes pour ajuster le plan de production d\'Édéa si nécessaire pour ramener le chargement sous 80%.',
      en: 'Compliant with SONATREL Grid Code §4.2: dispatchers have 15 minutes to adjust generation output at Edéa if required to drop line loading below 80% continuous.'
    }
  },
  {
    id: 'scen-02-nachtigal-integration',
    title: { fr: 'Intégration de Nachtigal (420 MW) & Bouclage Nyom II - Nomayos', en: 'Nachtigal 420 MW Hydro Evacuation & Nyom II - Nomayos Looping' },
    horizonYears: 'Horizon 2024 - 2027',
    objective: {
      fr: 'Évacuer la puissance massive des 7 groupes de 60 MW de Nachtigal vers Yaoundé et sécuriser le réseau contre les congestions.',
      en: 'Evacuate 420 MW from Nachtigal hydro plant into Yaoundé metropolitan center without transmission bottlenecks.'
    },
    baselineState: {
      demandMw: 1350,
      generationMw: 1380,
      criticalLineLoadingPct: 88,
      voltageLowestKv: 212.0
    },
    intervention: {
      type: 'generation_addition',
      title: { fr: 'Injection 420 MW + Double Ligne 225 kV Nachtigal-Nyom II', en: '420 MW Generation + Twin 225 kV Line Nachtigal-Nyom II' },
      specs: {
        fr: 'Construction de 52 km de double ligne 225 kV et du poste d\'interconnexion de Nyom II (Yaoundé Nord).',
        en: 'Construction of 52 km double-circuit 225 kV transmission lines and the Nyom II hub substation.'
      }
    },
    postInterventionState: {
      demandMw: 1350,
      generationMw: 1770,
      criticalLineLoadingPct: 52,
      voltageLowestKv: 227.5,
      n1Compliant: true,
      benefitExplanation: {
        fr: 'Augmentation de 30% de la capacité de production nationale d\'énergie propre. Élimination des délestages de pointe à Yaoundé et renforcement du plan de tension.',
        en: 'Expands clean national generation by 30%. Eliminates structural dry-season load shedding in Yaoundé and provides robust voltage support.'
      }
    },
    technicalNotes: {
      fr: 'Le barrage au fil de l\'eau de Nachtigal bénéficie de la régulation en amont de Lom Pangar, garantissant 420 MW même en saison sèche.',
      en: 'Nachtigal run-of-river powerhouse relies on upstream Lom Pangar storage, sustaining full 420 MW dispatch even during low-water dry season.'
    }
  },
  {
    id: 'scen-03-reactive-compensation',
    title: { fr: 'Compensation Réactive : Batterie de Condensateurs 225 kV Oyomabang', en: 'Reactive Compensation: 225 kV Shunt Capacitor Bank at Oyomabang' },
    horizonYears: 'Plan d\'Urgence Qualité de Tension',
    objective: {
      fr: 'Relever le plan de tension dégradé en heure de pointe (208 kV sur le jeu de barres 225 kV) sans surcharger les générateurs en puissance réactive.',
      en: 'Boost sagged peak-hour voltage (208 kV on 225 kV bus) and relieve generator VAR loading.'
    },
    baselineState: {
      demandMw: 1250,
      generationMw: 1290,
      criticalLineLoadingPct: 79,
      voltageLowestKv: 208.2
    },
    intervention: {
      type: 'reactive_compensation',
      title: { fr: 'Installation d\'une Batterie Shunt de 50 MVAR', en: 'Installation of 50 MVAR Shunt Capacitor Bank' },
      specs: {
        fr: 'Batterie de condensateurs à gradins 225 kV avec disjoncteur à insertion de résistance pour limiter les courants d\'enclenchement.',
        en: '225 kV stepped capacitor bank with point-on-wave switching to minimize transient inrush currents.'
      }
    },
    postInterventionState: {
      demandMw: 1250,
      generationMw: 1275,
      criticalLineLoadingPct: 71,
      voltageLowestKv: 226.0,
      n1Compliant: true,
      benefitExplanation: {
        fr: 'La tension remonte de 208.2 kV à 226.0 kV (+8.5%). Les pertes Joule de transport diminuent de 15 MW car le courant réactif est produit localement au nœud de charge !',
        en: 'Nodal voltage recovers from 208.2 kV to 226.0 kV (+8.5%). Transmission losses decrease by 15 MW because VARs are supplied directly at the load node!'
      }
    },
    technicalNotes: {
      fr: 'Selon la formule de chute de tension approchée : ΔU ≈ (R·P + X·Q) / U. Réduire le transit de Q sur la ligne haute réactance (X) réduit directement ΔU.',
      en: 'Grounded in the voltage drop approximation ΔU ≈ (R·P + X·Q) / U. Suppressing inductive reactive flow Q over high-reactance transmission lines directly restores voltage.'
    }
  },
  {
    id: 'scen-04-ris-rin-intertie',
    title: { fr: 'Grande Interconnexion Sud-Nord (RIS - RIN 225 kV)', en: 'RIS - RIN 225 kV South-North Strategic Intertie' },
    horizonYears: 'Horizon Stratégique 2028 - 2030',
    objective: {
      fr: 'Relier le Réseau Interconnecté Sud (RIS, hydro-dominant) au Réseau Interconnecté Nord (RIN, hydro Lagdo + thermique diesel coûteux).',
      en: 'Interconnect southern grid (RIS, hydro rich) with northern grid (RIN, seasonal Lagdo + costly thermal diesels).'
    },
    baselineState: {
      demandMw: 1450,
      generationMw: 1490,
      criticalLineLoadingPct: 82,
      voltageLowestKv: 216.0
    },
    intervention: {
      type: 'transmission_line',
      title: { fr: 'Dorsale 225 kV Nachtigal - Bafoussam - Ngaoundéré - Garoua (700 km)', en: '225 kV Nachtigal - Bafoussam - Ngaoundéré - Garoua Corridor (700 km)' },
      specs: {
        fr: 'Ligne 225 kV double terne de plus de 700 km avec compensation série par condensateurs et postes intermédiaires.',
        en: '700+ km 225 kV double-circuit corridor with series capacitor compensation and intermediate switching stations.'
      }
    },
    postInterventionState: {
      demandMw: 1550,
      generationMw: 1620,
      criticalLineLoadingPct: 64,
      voltageLowestKv: 224.5,
      n1Compliant: true,
      benefitExplanation: {
        fr: 'Permet d\'évacuer 150 à 250 MW d\'hydroélectricité propre du Sud vers le Nord, réduisant les émissions de CO2 et divisant la facture de carburant diesel du septentrion par 4.',
        en: 'Transfers 150 to 250 MW of clean southern hydro into the north, cutting carbon emissions and slashing thermal diesel fuel bills four-fold.'
      }
    },
    technicalNotes: {
      fr: 'Projet structurant national intégré dans le Plan Directeur de Production et de Transport d\'Électricité du Cameroun (PDSTE).',
      en: 'Anchor infrastructure priority in Cameroon\'s Master Plan for Power Generation and Transmission (PDSTE).'
    }
  }
];
