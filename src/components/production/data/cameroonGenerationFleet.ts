// src/components/production/data/cameroonGenerationFleet.ts
// Benchmark generation assets and fleet data in Cameroon (RIS & RIN grids)

export interface CameroonPowerPlant {
  id: string;
  name: string;
  technology: 'hydro' | 'gas_thermal' | 'oil_thermal' | 'solar_pv';
  installedCapacityMw: number;
  guaranteedCapacityMw: number;
  commissionYear: number;
  location: string;
  region: string;
  basinOrResource: string;
  gridZone: 'RIS' | 'RIN' | 'ISOLATED';
  operator: string;
  unitsCount: number;
  unitSpecs: string;
  voltageInjectionKv: number;
  annualGenerationGwh?: number;
  keyRole: string;
  notes: string;
}

export const CAMEROON_GENERATION_FLEET: CameroonPowerPlant[] = [
  {
    id: 'nachtigal',
    name: 'Centrale Hydroélectrique de Nachtigal',
    technology: 'hydro',
    installedCapacityMw: 420,
    guaranteedCapacityMw: 400,
    commissionYear: 2024,
    location: 'Nachtigal / Batchenga',
    region: 'Centre',
    basinOrResource: 'Fleuve Sanaga (Au fil de l\'eau régulé par Mbakaou/Lom Pangar)',
    gridZone: 'RIS',
    operator: 'NHPC (EDF, IFC, État du Cameroun, STOA, Africa50)',
    unitsCount: 7,
    unitSpecs: '7 x 60 MW Turbines Francis à axe vertical, chute nette 50.5 m, débit d\'armement 980 m³/s',
    voltageInjectionKv: 225,
    annualGenerationGwh: 2970,
    keyRole: 'Base et régulation majeure du RIS (~30% de la production nationale)',
    notes: 'Plus grand aménagement hydroélectrique contemporain du Cameroun. Évacuation par 2 lignes 225 kV vers le poste de Nyom 2.'
  },
  {
    id: 'songloulou',
    name: 'Centrale Hydroélectrique de Song Loulou',
    technology: 'hydro',
    installedCapacityMw: 384,
    guaranteedCapacityMw: 360,
    commissionYear: 1981,
    location: 'Massock-Songloulou',
    region: 'Littoral',
    basinOrResource: 'Fleuve Sanaga (Moyenne Sanaga)',
    gridZone: 'RIS',
    operator: 'ENEO Cameroun',
    unitsCount: 8,
    unitSpecs: '8 x 48 MW Turbines Francis (Phase 1: 4x48 MW en 1981, Phase 2: 4x48 MW en 1988), chute nette 40 m',
    voltageInjectionKv: 225,
    annualGenerationGwh: 2500,
    keyRole: 'Pilier historique de base du réseau interconnecté Sud (RIS)',
    notes: 'Comporte un barrage poids et digue en enrochement. Réhabilitation majeure des bétons et passes déversoir réalisée.'
  },
  {
    id: 'edea',
    name: 'Centrale Hydroélectrique d\'Edéa (I, II & III)',
    technology: 'hydro',
    installedCapacityMw: 276,
    guaranteedCapacityMw: 250,
    commissionYear: 1953,
    location: 'Edéa',
    region: 'Littoral',
    basinOrResource: 'Fleuve Sanaga (Basse Sanaga)',
    gridZone: 'RIS',
    operator: 'ENEO Cameroun',
    unitsCount: 14,
    unitSpecs: '14 groupes (Francis & Kaplan) : Edéa I (3x11 MW), Edéa II (6x19.7 MW), Edéa III (5x20.8 MW), chute 24 m',
    voltageInjectionKv: 225,
    annualGenerationGwh: 2100,
    keyRole: 'Alimentation historique de l\'électrométallurgie ALUCAM et du bassin industriel de Douala',
    notes: 'Premier grand aménagement hydroélectrique du Cameroun (1953). Rénovations successives et automates modernes.'
  },
  {
    id: 'memveele',
    name: 'Centrale Hydroélectrique de Memve\'ele',
    technology: 'hydro',
    installedCapacityMw: 211,
    guaranteedCapacityMw: 190,
    commissionYear: 2019,
    location: 'Nyakabom',
    region: 'Sud',
    basinOrResource: 'Fleuve Ntem',
    gridZone: 'RIS',
    operator: 'EDC (Electricity Development Corporation)',
    unitsCount: 4,
    unitSpecs: '4 x 52.75 MW Turbines Francis, chute nominale 67 m',
    voltageInjectionKv: 225,
    annualGenerationGwh: 1100,
    keyRole: 'Énergie de pointe et renforcement du réseau Sud et frontière',
    notes: 'Évacuation 225 kV vers Ahala (Yaoundé) via Ebolowa. Régime hydrologique dépendant des crues équatoriales du Ntem.'
  },
  {
    id: 'lagdo',
    name: 'Centrale Hydroélectrique de Lagdo',
    technology: 'hydro',
    installedCapacityMw: 72,
    guaranteedCapacityMw: 50,
    commissionYear: 1982,
    location: 'Lagdo / Garoua',
    region: 'Nord',
    basinOrResource: 'Fleuve Bénoué (Grande retenue de régulation pluri-annuelle)',
    gridZone: 'RIN',
    operator: 'ENEO Cameroun',
    unitsCount: 4,
    unitSpecs: '4 x 18 MW Turbines Kaplan, chute nominale 22 m, retenue de 7.7 milliards de m³',
    voltageInjectionKv: 110,
    annualGenerationGwh: 320,
    keyRole: 'Épine dorsale exclusive de production hydroélectrique du Réseau Interconnecté Nord (RIN)',
    notes: 'Retenue polyvalente (irrigation, crue, hydroélectricité). Travaux de réhabilitation engagés.'
  },
  {
    id: 'kribi_gas',
    name: 'Centrale Thermique Gaz de Kribi (KPDC)',
    technology: 'gas_thermal',
    installedCapacityMw: 216,
    guaranteedCapacityMw: 210,
    commissionYear: 2013,
    location: 'Mpolongwé / Kribi',
    region: 'Sud',
    basinOrResource: 'Gaz naturel offshore champ Sanaga Sud (Perenco / SNH)',
    gridZone: 'RIS',
    operator: 'Globeleq (Kribi Power Development Company)',
    unitsCount: 13,
    unitSpecs: '13 x Moteurs alternateurs gaz Wärtsilä 18V50DF (dual-fuel gaz/HFO)',
    voltageInjectionKv: 225,
    annualGenerationGwh: 1200,
    keyRole: 'Génération thermique de base et flexibilité pour compenser l\'étiage de la Sanaga',
    notes: 'Plus grande centrale thermique gaz de la région Afrique Centrale. Ligne d\'évacuation 225 kV vers le poste de Mangombé (Edéa).'
  },
  {
    id: 'dibamba_hfo',
    name: 'Centrale Thermique Fioul Lourd de Dibamba (DPDC)',
    technology: 'oil_thermal',
    installedCapacityMw: 86,
    guaranteedCapacityMw: 80,
    commissionYear: 2009,
    location: 'Yassa / Dibamba (Douala)',
    region: 'Littoral',
    basinOrResource: 'Fuel Lourd HFO (Heavy Fuel Oil)',
    gridZone: 'RIS',
    operator: 'Globeleq (Dibamba Power Development Company)',
    unitsCount: 8,
    unitSpecs: '8 x Moteurs Wärtsilä 18V38B et alternateurs 11 kV',
    voltageInjectionKv: 90,
    annualGenerationGwh: 350,
    keyRole: 'Centrale d\'écrêtage de pointe et réserve tournante pour le pôle économique de Douala',
    notes: 'Démarrage rapide pour soutenir la tension et compenser les pics de consommation du pôle industriel.'
  },
  {
    id: 'maroua_guider_solar',
    name: 'Centrales Solaires PV de Maroua & Guider (avec BESS)',
    technology: 'solar_pv',
    installedCapacityMw: 30,
    guaranteedCapacityMw: 28,
    commissionYear: 2023,
    location: 'Maroua (Salak) & Guider',
    region: 'Extrême-Nord & Nord',
    basinOrResource: 'Gisement Solaire Sahélien (GHI > 2 150 kWh/m²/an)',
    gridZone: 'RIN',
    operator: 'Release by Scatec / ENEO',
    unitsCount: 2,
    unitSpecs: '2 x 15 MWc panneaux PV bifaciaux monocristallins avec trackers 1 axe + 19 MWh stockage BESS lithium-ion',
    voltageInjectionKv: 30,
    annualGenerationGwh: 48,
    keyRole: 'Soulagement critique de la centrale de Lagdo et suppression des délestages diurnes dans le RIN',
    notes: 'Première installation solaire d\'envergure industrielle avec stockage batterie connectée au réseau au Cameroun.'
  }
];

export const CAMEROON_NATIONAL_ENERGY_STATS = {
  totalInstalledCapacityMw: 1665,
  hydroPercentage: 73.5,
  thermalGasPercentage: 15.0,
  thermalFuelPercentage: 9.5,
  solarPercentage: 2.0,
  sanagaRiverRegulationDam: 'Barrage Réservoir de Lom Pangar (6 milliards de m³) + Mbakaou (2.6 milliards de m³) + Bamendjin (1.8 milliards de m³)',
  target2030Mw: 3000
};
