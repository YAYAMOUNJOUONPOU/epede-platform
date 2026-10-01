// src/components/equipment/modules/EquipmentCutawaySchematicViewer.tsx
import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Info, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { Equipment } from '../../../types/epede';

export type SchematicViewMode = 'cutaway' | 'kinematics' | 'terminals';

export type EquipmentSchematicType = 
  | 'sf6_breaker'
  | 'power_transformer'
  | 'vacuum_breaker'
  | 'gis_bay'
  | 'surge_arrester'
  | 'instrument_transformer'
  | 'induction_motor'
  | 'lv_switchboard'
  | 'rmu_cable_compartment'
  | 'lightning_faraday_cage'
  | 'xlpe_transition_station'
  | 'gas_turbine_skid'
  | 'lv_abc_service_box'
  | 'solar_inverter_topology'
  | 'wind_dfig_pmsg_converter';

export interface ComponentHotspot {
  id: string;
  tag: string;
  x: number; // SVG coordinate percent (0-100)
  y: number; // SVG coordinate percent (0-100)
  title_fr: string;
  title_en: string;
  role_fr: string;
  role_en: string;
  material_fr: string;
  material_en: string;
  inspection_fr: string;
  inspection_en: string;
  standard_ref: string;
}

interface EquipmentCutawaySchematicViewerProps {
  equipment: Equipment;
  locale: 'fr' | 'en';
  onNavigateStandard?: (ref: string) => void;
}

/**
 * Resolves the appropriate engineering schematic model based on equipment identifiers
 */
export function resolveSchematicType(equipment: Equipment): EquipmentSchematicType {
  const id = equipment.id.toLowerCase();
  const name = (equipment.name_fr + ' ' + equipment.name_en).toLowerCase();

  if (id.includes('sf6') || id.includes('cb-225') || id.includes('q0') || name.includes('disjoncteur sf6')) {
    return 'sf6_breaker';
  }
  if (id.includes('trafo') || id.includes('transfo') || name.includes('transformateur')) {
    return 'power_transformer';
  }
  if (id.includes('rmu') || id.includes('vpis') || id.includes('cable-comp') || name.includes('rmu') || name.includes('ring main unit')) {
    return 'rmu_cable_compartment';
  }
  if (id.includes('cell') || id.includes('vacuum') || id.includes('vide') || id.includes('feeder') || name.includes('cellule') || name.includes('ampoule à vide')) {
    return 'vacuum_breaker';
  }
  if (id.includes('gis') || id.includes('psem') || name.includes('gis') || name.includes('blindé')) {
    return 'gis_bay';
  }
  if (id.includes('xlpe') || id.includes('transition') || id.includes('cross-bonding') || id.includes('jonction') || name.includes('transition') || name.includes('cross-bonding')) {
    return 'xlpe_transition_station';
  }
  if (id.includes('skid') || id.includes('purge') || id.includes('fuel-gas') || id.includes('gasturbine') || name.includes('skid') || name.includes('purge')) {
    return 'gas_turbine_skid';
  }
  if (id.includes('faraday') || id.includes('lightning') || id.includes('foudre') || id.includes('lpz') || name.includes('paratonnerre') || name.includes('faraday')) {
    return 'lightning_faraday_cage';
  }
  if (id.includes('surge') || id.includes('parafoudre') || id.includes('arrester')) {
    return 'surge_arrester';
  }
  if (id.includes('ct') || id.includes('vt') || id.includes('tc') || id.includes('tt') || name.includes('courant') || name.includes('tension')) {
    return 'instrument_transformer';
  }
  if (id.includes('motor') || id.includes('moteur') || name.includes('asynchrone')) {
    return 'induction_motor';
  }
  if (id.includes('solar') || id.includes('pv') || id.includes('inv-solar') || name.includes('solaire') || name.includes('onduleur central') || name.includes('inverter')) {
    return 'solar_inverter_topology';
  }
  if (id.includes('wind') || id.includes('dfig') || id.includes('pmsg') || id.includes('éolien') || name.includes('éolien') || name.includes('wind') || name.includes('aérogénérateur')) {
    return 'wind_dfig_pmsg_converter';
  }
  if (id.includes('abc') || id.includes('torsade') || id.includes('branchment') || id.includes('service-box') || name.includes('torsadé') || name.includes('branchement')) {
    return 'lv_abc_service_box';
  }
  if (id.includes('tgbt') || id.includes('kiosk') || id.includes('switchboard') || name.includes('tgbt') || name.includes('tableau')) {
    return 'lv_switchboard';
  }

  // Domain fallback
  if (equipment.domain_code === 'D04') return 'sf6_breaker';
  if (equipment.domain_code === 'D03') return 'power_transformer';
  if (equipment.domain_code === 'D05') return 'vacuum_breaker';
  if (equipment.domain_code === 'D13') return 'induction_motor';
  if (equipment.domain_code === 'D08') return 'instrument_transformer';

  return 'sf6_breaker';
}

export const EquipmentCutawaySchematicViewer: React.FC<EquipmentCutawaySchematicViewerProps> = ({
  equipment,
  locale,
  onNavigateStandard,
}) => {
  const schematicType = resolveSchematicType(equipment);
  const [activeMode, setActiveMode] = useState<SchematicViewMode>('cutaway');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [kinematicState, setKinematicState] = useState<'closed' | 'arcing' | 'open'>('closed');
  const [activePhase, setActivePhase] = useState<'L1' | 'L2' | 'L3'>('L1');

  // Hotspots definitions per schematic profile
  const hotspotsMap: Record<EquipmentSchematicType, ComponentHotspot[]> = {
    sf6_breaker: [
      {
        id: 'sf6-contact-fixed',
        tag: '01',
        x: 50,
        y: 28,
        title_fr: "Contacts d'arc fixes en Cu-W",
        title_en: 'Copper-Tungsten Fixed Arcing Contacts',
        role_fr: "Encaisse l'arc électrique initial à haute énergie lors de la séparation des contacts sans détériorer la piste conductrice principale.",
        role_en: 'Withstands initial high-energy thermal electric arc during separation without degrading main conducting surface.',
        material_fr: 'Alliage fritté Cuivre-Tungstène (CuW 80/20) réfractaire',
        material_en: 'Sintered refractory Copper-Tungsten alloy (CuW 80/20)',
        inspection_fr: 'Mesure de résistance de contact dynamique (DCRM) < 35 µΩ',
        inspection_en: 'Dynamic contact resistance measurement (DCRM) < 35 µΩ',
        standard_ref: 'IEC 62271-100',
      },
      {
        id: 'sf6-nozzle',
        tag: '02',
        x: 42,
        y: 45,
        title_fr: 'Buse de soufflage en PTFE pur',
        title_en: 'Pure PTFE Gas Blasting Nozzle',
        role_fr: 'Canalise et accélère le flux supersonique de SF6 comprimé directement sur la racine du plasma pour déioniser le canal au passage à zéro du courant.',
        role_en: 'Focuses and accelerates supersonic blast of compressed SF6 onto the arc root to deionize the plasma channel at current zero.',
        material_fr: 'Polytétrafluoroéthylène (PTFE) stabilisé thermiquement à 300°C',
        material_en: 'Thermally stabilized Polytetrafluoroethylene (PTFE) 300°C',
        inspection_fr: 'Contrôle visuel endoscopique d’érosion de col après 20 coupures sous 40 kA',
        inspection_en: 'Endoscopic throat erosion check after 20 breaks at 40 kA',
        standard_ref: 'IEC 62271-4',
      },
      {
        id: 'sf6-puffer',
        tag: '03',
        x: 50,
        y: 60,
        title_fr: 'Cylindre et piston autosouffleur',
        title_en: 'Auto-Puffer Compression Cylinder & Piston',
        role_fr: 'Comprime mécaniquement le gaz SF6 dans le volume thermique pendant la course d’ouverture pour créer la surpression nécessaire à l’extinction.',
        role_en: 'Mechanically compresses SF6 gas inside the thermal volume during opening stroke to generate quenching blast pressure.',
        material_fr: 'Aluminium anodisé à haute résistance mécanique & segments PTFE',
        material_en: 'Hard-anodized aluminum alloy with low-friction PTFE piston rings',
        inspection_fr: 'Vérification de la cinématique et amortissement fin de course',
        inspection_en: 'Kinematic travel recorder & end-stroke damping check',
        standard_ref: 'IEC 62271-100',
      },
      {
        id: 'sf6-burst-disc',
        tag: '04',
        x: 75,
        y: 72,
        title_fr: 'Disque de rupture de surpression',
        title_en: 'Overpressure Bursting Disc',
        role_fr: 'Évite l’explosion de l’enveloppe céramique en cas de défaut d’arc interne non coupé en évacuant les gaz vers un déflecteur sécurisé.',
        role_en: 'Prevents explosive ceramic failure during catastrophic internal unquenched arc by venting gas into a guided deflector.',
        material_fr: 'Membrane calibrée en nickel/inox poinçonnée (rupture à 0.9 MPa rel.)',
        material_en: 'Calibrated pre-scored nickel/stainless steel membrane (rupture @ 0.9 MPa rel.)',
        inspection_fr: 'Inspection de non-corrosion et étanchéité hélium annuelle',
        inspection_en: 'Annual helium sniffer leak detection & corrosion inspection',
        standard_ref: 'IEC 62271-203',
      },
      {
        id: 'sf6-densimeter',
        tag: '05',
        x: 22,
        y: 78,
        title_fr: 'Densimètre SF6 compensé en T°',
        title_en: 'Temperature-Compensated SF6 Density Monitor',
        role_fr: 'Surveille la masse volumique de gaz SF6 indépendamment des fluctuations de température ambiante (-20°C à +50°C) avec contacts d’alarme et de verrouillage.',
        role_en: 'Monitors SF6 density regardless of ambient thermal swings (-20°C to +50°C) triggering alarm (0.58 MPa) and trip lockout (0.55 MPa).',
        material_fr: 'Soufflet métallique de référence scellé hermétiquement avec micro-rupteurs dorés',
        material_en: 'Hermetically sealed reference metal bellows with gold-plated microswitches',
        inspection_fr: 'Étalonnage périodique des seuils alarme / verrouillage déclenchement',
        inspection_en: 'Periodic calibration of alarm and trip lockout pressure setpoints',
        standard_ref: 'IEC 62271-4',
      },
    ],

    power_transformer: [
      {
        id: 'trafo-core',
        tag: '01',
        x: 48,
        y: 52,
        title_fr: 'Circuit magnétique feuilleté Hi-B',
        title_en: 'Grain-Oriented Hi-B Laminated Magnetic Core',
        role_fr: 'Canalise le flux d’induction magnétique alternatif à très faible réluctance pour minimiser les pertes fer (P0) et le courant magnétisant.',
        role_en: 'Directs AC magnetic induction flux with minimal reluctance to suppress no-load core losses (P0) and magnetizing inrush.',
        material_fr: 'Tôles d’acier au silicium laminées à froid à grains orientés (0.23 mm) isolées au Carlite',
        material_en: 'Cold-rolled grain-oriented silicon steel (0.23 mm) Carlite inorganic insulation',
        inspection_fr: 'Mesure de résistance d’isolement du noyau à la masse > 1000 MΩ sous 2.5 kV CC',
        inspection_en: 'Core-to-ground insulation resistance measurement > 1000 MΩ @ 2.5 kV DC',
        standard_ref: 'IEC 60076-1',
      },
      {
        id: 'trafo-windings',
        tag: '02',
        x: 35,
        y: 42,
        title_fr: 'Enroulements HTB en galettes imbriquées',
        title_en: 'HV Interleaved Continuous Disc Windings',
        role_fr: 'Enroulements haute tension 225 kV à distribution capacitive linéaire assurant une tenue exceptionnelle aux ondes de foudre 1.2/50 µs.',
        role_en: '225 kV high-voltage disc windings with linear capacitive surge distribution providing impulse withstand against 1.2/50 µs lightning waves.',
        material_fr: 'Conducteurs en cuivre électrolytique méplat émaillé enveloppé de papier kraft thermo-stabilisé',
        material_en: 'Electrolytic flat copper CTC (Continuously Transposed Cable) wrapped in thermally upgraded kraft paper',
        inspection_fr: 'Analyse par réponse en fréquence de balayage (SFRA) selon IEC 60076-18',
        inspection_en: 'Sweep Frequency Response Analysis (SFRA) per IEC 60076-18',
        standard_ref: 'IEC 60076-3',
      },
      {
        id: 'trafo-buchholz',
        tag: '03',
        x: 70,
        y: 20,
        title_fr: 'Relais Buchholz différentiel double seuil',
        title_en: 'Dual-Stage Buchholz Gas & Surge Relay',
        role_fr: 'Détecte les dégagements gazeux lents (alarme échauffement/effet couronne) et les mouvements violents d’huile > 1.5 m/s (déclenchement instantané court-circuit interne).',
        role_en: 'Detects slow gas accumulation (insulation hotspot/corona alarm) and surge oil velocities > 1.5 m/s (instantaneous trip on internal fault).',
        material_fr: 'Corps en fonte d’aluminium étanche avec volet pendulaire magnétique & contacts Reed',
        material_en: 'Cast weatherproof aluminum casing with magnetic flapper mechanism & dry reed switches',
        inspection_fr: 'Test annuel de déclenchement pneumatique et prélèvement de gaz pour chromatographie DGA',
        inspection_en: 'Annual pneumatic trip test and gas sampling for dissolved gas analysis (DGA)',
        standard_ref: 'IEC 60255 / EN 50216-2',
      },
      {
        id: 'trafo-conservator',
        tag: '04',
        x: 82,
        y: 12,
        title_fr: 'Conservateur avec membrane souple (Air-Cell)',
        title_en: 'Oil Conservator with Flexible Rubber Air-Cell',
        role_fr: 'Absorbe la dilatation thermique de l’huile diélectrique en isolant hermétiquement le fluide de l’oxygène et de l’humidité atmosphérique.',
        role_en: 'Accommodates dielectric oil thermal expansion while hermetically sealing fluid from atmospheric moisture and oxygen.',
        material_fr: 'Enveloppe acier étanche et vessie en élastomère NBR haute résistance aux hydrocarbures',
        material_en: 'Welded steel vessel with high-grade NBR elastomer bladder resistant to transformer oil',
        inspection_fr: 'Contrôle d’étanchéité de la membrane et niveau d’huile magnétique',
        inspection_en: 'Air-cell integrity check and magnetic oil level indicator verification',
        standard_ref: 'IEC 60076-1',
      },
      {
        id: 'trafo-breather',
        tag: '05',
        x: 92,
        y: 28,
        title_fr: 'Assécheur d’air à gel de silice auto-régénérant',
        title_en: 'Dehydrating Silica Gel Breather with Oil Cup',
        role_fr: 'Déshumidifie l’air inhalé par le conservateur lors du refroidissement pour maintenir la rigidité diélectrique de l’huile > 70 kV/2.5 mm.',
        role_en: 'Dehydrates ambient air inhaled during cooling cycles to preserve dielectric breakdown voltage > 70 kV/2.5 mm.',
        material_fr: 'Cristaux de gel de silice sans cobalt (indicateur orange/vert) avec pot à huile piège à poussières',
        material_en: 'Cobalt-free environmentally safe silica gel beads with dust-trap bottom oil bath',
        inspection_fr: 'Remplacement ou régénération dès que 2/3 des billes ont changé de couleur',
        inspection_en: 'Recharge or thermal regeneration when 2/3 of bead height saturates',
        standard_ref: 'EN 50216-3',
      },
      {
        id: 'trafo-retention-pit',
        tag: '06',
        x: 50,
        y: 92,
        title_fr: 'Fosse de rétention déportée & grille coupe-feu',
        title_en: 'Oil Retention Bund & Integrated Flame-Trap Grate',
        role_fr: 'Recueille 100% du volume d’huile diélectrique en cas de fuite ou d’éclatement et étouffe instantanément un incendie par passage à travers un lit de galets calibrés.',
        role_en: 'Captures 100% of transformer dielectric fluid inventory and extinguishes burning oil through calibrated pebble/flame-trap extinguishing grates.',
        material_fr: 'Béton armé étanche hydrofuge avec grille galvanisée caillebotis et lit de galets de silex 40/60 mm',
        material_en: 'Water-impervious reinforced concrete bund with hot-dip galvanized flame-trap grating and 40/60 mm silex gravel layer',
        inspection_fr: 'Nettoyage des siphons coupe-feu et contrôle du niveau de vanne d’évacuation des eaux pluviales',
        inspection_en: 'Flame-trap siphon inspection, rainwater oil-separation filter check per NF C 17-300',
        standard_ref: 'NF C 17-300 / IEEE 980',
      },
      {
        id: 'trafo-firewall',
        tag: '07',
        x: 8,
        y: 65,
        title_fr: 'Mur coupe-feu REI 120 entre transformateurs',
        title_en: 'Blast & Fire Separation Barrier Wall (REI 120)',
        role_fr: 'Évite la propagation thermique et les projections d’éclats vers l’unité adjacente en cas d’explosion de cuve pendant 2 heures minimum.',
        role_en: 'Prevents thermal cascade and blast shrapnel propagation to adjacent substation units for a minimum of 120 minutes.',
        material_fr: 'Béton armé banché de 250 mm d’épaisseur ou panneaux coupe-feu modulaires en silicate de calcium',
        material_en: '250 mm reinforced concrete barrier withstanding projectile impact and 120 min hydrocarbon curve',
        inspection_fr: 'Inspection des joints de dilatation et calfeutrements intumescents des passages de câbles',
        inspection_en: 'Structural crack survey and intumescent penetration seal integrity inspection',
        standard_ref: 'IEC 61936-1',
      },
    ],

    vacuum_breaker: [
      {
        id: 'vac-bottle',
        tag: '01',
        x: 50,
        y: 40,
        title_fr: 'Ampoule de coupure sous vide scellée',
        title_en: 'Hermetically Sealed Vacuum Interrupter Bottle',
        role_fr: 'Enceinte diélectrique étanche sous vide ultra-poussé (< 10⁻⁷ mbar) permettant une coupure de 31.5 kA sous 12 mm de course seulement.',
        role_en: 'Ultra-high vacuum chamber (< 10⁻⁷ mbar) achieving 31.5 kA interruption within a minimal 12 mm contact stroke.',
        material_fr: 'Céramique d’alumine Al₂O₃ frittée brasée sous vide à haute température',
        material_en: 'High-purity alumina ceramic (Al₂O₃) vacuum-brazed assembly',
        inspection_fr: 'Essai de tenue diélectrique diélectrique 70 kV 1 min sous vide (IEC 62271-100)',
        inspection_en: '70 kV 1-min power frequency dielectric withstand test across open gap',
        standard_ref: 'IEC 62271-100',
      },
      {
        id: 'vac-contacts',
        tag: '02',
        x: 50,
        y: 35,
        title_fr: 'Contacts CuCr à champ magnétique axial (AMF)',
        title_en: 'Copper-Chromium Axial Magnetic Field (AMF) Contacts',
        role_fr: 'Génère un champ magnétique axial qui force l’arc sous vide à rester diffus sur toute la surface au lieu de se concentrer en point chaud destructeur.',
        role_en: 'Generates axial magnetic field forcing the vacuum arc into a diffuse uniform mode, preventing anode spot melting.',
        material_fr: 'Matrice frittée Cuivre-Chrome (CuCr 75/25) anti-soudure',
        material_en: 'Sintered Copper-Chromium (CuCr 75/25) anti-welding contact alloy',
        inspection_fr: 'Mesure de l’usure des contacts via vernier d’érosion mécanique',
        inspection_en: 'Mechanical contact erosion indicator vernier check',
        standard_ref: 'IEC 62271-1',
      },
      {
        id: 'vac-bellows',
        tag: '03',
        x: 50,
        y: 55,
        title_fr: 'Soufflet métallique élastique en acier inox',
        title_en: 'Stainless Steel Flexible Bellows',
        role_fr: 'Permet le mouvement alternatif du contact mobile tout en maintenant le vide étanche absolu sur plus de 30 000 manœuvres mécaniques.',
        role_en: 'Transmits linear stroke to moving contact while maintaining hermetic vacuum seal over 30,000 mechanical operations.',
        material_fr: 'Feuillard ondulé multicouche en acier inoxydable austénitique 316L',
        material_en: 'Multi-ply hydroformed austenitic stainless steel 316L',
        inspection_fr: 'Endurance mécanique classe M2 (10 000 manœuvres garanties)',
        inspection_en: 'Class M2 mechanical endurance qualification test (10,000 cycles)',
        standard_ref: 'IEC 62271-100',
      },
      {
        id: 'vac-vpis',
        tag: '04',
        x: 20,
        y: 75,
        title_fr: 'Indicateur de présence de tension (VPIS)',
        title_en: 'Voltage Presence Indicating System (VPIS)',
        role_fr: 'Prélève capacitivement une fraction de tension sur le pôle pour allumer des témoins LED en face avant confirmant la consignation.',
        role_en: 'Capacitively couples fractional pole voltage to illuminate front-panel LED indicators verifying bus de-energization.',
        material_fr: 'Diviseur capacitif intégré dans l’isolateur en résine époxy cycloaliphatique',
        material_en: 'Capacitive coupling electrode embedded in cycloaliphatic epoxy post insulator',
        inspection_fr: 'Contrôle de seuil d’allumage (10% à 45% Un) selon IEC 61958',
        inspection_en: 'Threshold firing test (10% to 45% Un) per IEC 61958',
        standard_ref: 'IEC 61958',
      },
    ],

    gis_bay: [
      {
        id: 'gis-enclosure',
        tag: '01',
        x: 50,
        y: 20,
        title_fr: 'Enveloppe blindée en aluminium soudé',
        title_en: 'Welded Non-Magnetic Aluminum Enclosure',
        role_fr: 'Contient le gaz SF6 sous 0.6 MPa rel., assure le blindage électrostatique total et protège les opérateurs contre tout contact sous tension (sécurité IP65).',
        role_en: 'Contains SF6 gas at 0.6 MPa, provides grounded electrostatic shielding and absolute touch safety for personnel (IP65 envelope).',
        material_fr: 'Alliage d’aluminium coulé et mécano-soudé résistant à la pression et à la corrosion saline',
        material_en: 'High-tensile cast and welded corrosion-resistant aluminum alloy',
        inspection_fr: 'Test d’étanchéité globale avec taux de fuite garanti < 0.5% par an',
        inspection_en: 'Global leak rate sniff testing ensuring < 0.5% loss per year',
        standard_ref: 'IEC 62271-203',
      },
      {
        id: 'gis-spacer',
        tag: '02',
        x: 35,
        y: 50,
        title_fr: 'Cône isolant de compartimentage en résine',
        title_en: 'Gas-Barrier Epoxy Resin Conical Disc Spacer',
        role_fr: 'Soutient mécaniquement les barres conductrices sous tension tout en compartimentant le gaz pour isoler tout défaut de pression localisé.',
        role_en: 'Mechanically centers high-voltage conductor while serving as a hermetic barrier dividing bay into isolated gas compartments.',
        material_fr: 'Résine époxy chargée d’alumine moulée sous vide à gradient de champ optimisé',
        material_en: 'Alumina-filled vacuum-cast epoxy resin shaped for uniform field distribution',
        inspection_fr: 'Mesure de décharges partielles en usine et sur site < 5 pC sous 1.2 Un',
        inspection_en: 'Partial discharge routine and site acceptance test < 5 pC @ 1.2 Un',
        standard_ref: 'IEC 60270 / IEC 62271-203',
      },
      {
        id: 'gis-disconnector',
        tag: '03',
        x: 70,
        y: 45,
        title_fr: 'Sectionneur à 3 positions rotatif',
        title_en: '3-Position Rotary Disconnector & Earth Switch',
        role_fr: 'Combine les fonctions Fermé, Isolé et Mis à la terre sur un seul axe mécanique rotatif, rendant toute fausse manœuvre impossible.',
        role_en: 'Integrates Closed, Disconnected, and Earthed states on a single rotary spindle, mechanically eliminating inadvertent short-circuits.',
        material_fr: 'Contacts en cuivre argenté et tringlerie de verrouillage à commande motorisée',
        material_en: 'Heavy silver-plated copper tulip contacts and motorized mechanical interlocks',
        inspection_fr: 'Contrôle d’alignement des contacts et interverrouillages par hublot optique',
        inspection_en: 'Endoscopic contact visual positioning and interlocking checks',
        standard_ref: 'IEC 62271-102',
      },
    ],

    surge_arrester: [
      {
        id: 'surge-zno',
        tag: '01',
        x: 50,
        y: 45,
        title_fr: 'Empilement de varistances ZnO sans éclateur',
        title_en: 'Gapless Zinc-Oxide (ZnO) Ceramic Varistor Stack',
        role_fr: 'Comportement hautement non-linéaire (I = k.V^α avec α > 30) : isolant quasi-parfait sous tension nominale, conducteur franc lors des surtensions.',
        role_en: 'Highly non-linear V-I characteristic (I = k.V^α with α > 30): insulator under normal voltage, instant conductor during lightning/switching surges.',
        material_fr: 'Céramique polycristalline d’oxyde de zinc dopée aux oxydes de bismuth, cobalt et manganèse',
        material_en: 'Polycrystalline zinc oxide ceramic doped with bismuth, cobalt, and manganese oxides',
        inspection_fr: 'Mesure du courant de fuite résistif continu sous tension de service (< 100 µA)',
        inspection_en: 'Third harmonic resistive leakage current monitoring under continuous operating voltage (< 100 µA)',
        standard_ref: 'IEC 60099-4',
      },
      {
        id: 'surge-housing',
        tag: '02',
        x: 65,
        y: 35,
        title_fr: 'Enveloppe en silicone hydrophobe à ailettes',
        title_en: 'Hydrophobic Silicone Rubber Shed Housing',
        role_fr: 'Fournit la ligne de fuite nécessaire (31 mm/kV en milieu côtier) et empêche la formation de films continus d’eau conductrice lors des pluies tropicales.',
        role_en: 'Provides required creepage distance (31 mm/kV in marine environments) and prevents continuous conductive water film formation.',
        material_fr: 'Élastomère de silicone HTV vulcanisé à chaud moulé sans joint sur tube composite fibre de verre',
        material_en: 'HTV silicone rubber directly vulcanized over high-strength fiberglass winding tube',
        inspection_fr: 'Mesure de l’angle de contact hydrophobe (classe HC1 à HC2 selon IEC 62073)',
        inspection_en: 'Hydrophobicity transfer classification (HC1-HC2 per IEC 62073)',
        standard_ref: 'IEC 60815',
      },
      {
        id: 'surge-counter',
        tag: '03',
        x: 50,
        y: 85,
        title_fr: 'Compteur de décharges & milliampèremètre',
        title_en: 'Surge Discharge Counter & Leakage Microammeter',
        role_fr: 'Enregistre le nombre de coups de foudre et d’ondes de manœuvre écoulés à la terre tout en mesurant en continu le courant de fuite.',
        role_en: 'Registers cumulative strike counts channeled to ground while continuously indicating mA leakage current health.',
        material_fr: 'Transformateur tore d’impulsion avec cellule électromécanique et galvanomètre scellé',
        material_en: 'Current pulse sensing toroid with electromechanical ratchet counter and sealed microammeter',
        inspection_fr: 'Relevé mensuel du compteur et vérification de la dérive du courant capacitif/résistif',
        inspection_en: 'Monthly registry logging and resistive leakage trend tracking',
        standard_ref: 'IEC 60099-5',
      },
    ],

    instrument_transformer: [
      {
        id: 'it-primary',
        tag: '01',
        x: 50,
        y: 20,
        title_fr: 'Barre primaire en U à rapport commutable',
        title_en: 'Primary U-Shaped Conductor Bar with Ratio Links',
        role_fr: 'Traverse les tores de mesure et protection en supportant le courant nominal (jusqu’à 2500 A) et le courant de court-circuit thermique Ith (40 kA 1s).',
        role_en: 'Carries primary power flow through toroidal cores withstanding rated current (up to 2500 A) and thermal short-circuit Ith (40 kA 1s).',
        material_fr: 'Cuivre électrolytique massif étamé avec barrettes de couplage série/parallèle',
        material_en: 'Massive tinned electrolytic copper bar with series/parallel link selection plates',
        inspection_fr: 'Thermographie infrarouge des raccords primaires lors des pointes de charge',
        inspection_en: 'Thermal infrared scanning of primary clamps during peak load',
        standard_ref: 'IEC 61869-2',
      },
      {
        id: 'it-cores',
        tag: '02',
        x: 50,
        y: 45,
        title_fr: 'Tores secondaires de Mesure et Protection',
        title_en: 'Toroidal Secondary Cores (Metering & Protection)',
        role_fr: 'Tores séparés : Tore 1 Classe 0.2S (comptage transactionnel sans saturation précoce), Tore 2 Classe 5P20 (protection différentielle/surintensité sans saturation jusqu’à 20.In).',
        role_en: 'Dedicated cores: Core 1 Class 0.2S (high precision metering), Core 2 Class 5P20 (relaying protection maintaining fidelity up to 20x In).',
        material_fr: 'Alliage fer-nickel nanocristallin pour la mesure, acier silicium Hi-B pour la protection',
        material_en: 'Nanocrystalline iron-nickel core for metering, high-grade silicon steel for protection',
        inspection_fr: 'Tracé de la courbe de magnétisation (tension de coude Vk) selon IEC 61869-2',
        inspection_en: 'Knee-point excitation curve (Vk) and winding resistance verification',
        standard_ref: 'IEC 61869-2',
      },
      {
        id: 'it-terminals',
        tag: '03',
        x: 50,
        y: 80,
        title_fr: 'Boîte à bornes secondaire court-circuitable',
        title_en: 'Secondary Terminal Box with Shorting Links',
        role_fr: 'Regroupe les sorties 1S1-1S2, 2S1-2S2 avec sectionneurs d’essai évitant l’ouverture accidentelle d’un circuit TC (risque mortel de surtension inductive > 5 kV).',
        role_en: 'Houses secondary terminals 1S1-1S2, 2S1-2S2 with test sliding links to prevent lethal open-circuit induced high-voltages (> 5 kV).',
        material_fr: 'Coffret étanche IP66 en aluminium avec presse-étoupes blindés CEM',
        material_en: 'IP66 cast aluminum weatherhead box with EMC-shielded brass cable glands',
        inspection_fr: 'Vérification du point unique de mise à la terre des secondaires TC (terre poste)',
        inspection_en: 'Single-point earthing verification of secondary star point to substation earth',
        standard_ref: 'NF C 13-100 / IEC 61869-1',
      },
    ],

    induction_motor: [
      {
        id: 'mot-stator',
        tag: '01',
        x: 35,
        y: 40,
        title_fr: 'Bobinage statorique imprégné sous vide (VPI)',
        title_en: 'Vacuum Pressure Impregnated (VPI) Stator Windings',
        role_fr: 'Génère le champ magnétique tournant à 1500 tr/min (2 paires de pôles sous 50 Hz). Classe thermique H (180°C) résistant aux harmoniques de variateur.',
        role_en: 'Produces 1500 rpm rotating magnetic field (4 poles @ 50 Hz). Thermal Class H (180°C) with corona-resistant wire for VFD switching surges.',
        material_fr: 'Cuivre double émail classe 200°C imprégné de résine époxy sans solvant',
        material_en: 'Grade 2 dual-coated enamel copper wire impregnated with solventless epoxy resin',
        inspection_fr: 'Mesure de l’indice de polarisation (IP > 2) et décharges partielles',
        inspection_en: 'Polarization Index (PI > 2) and partial discharge online monitoring',
        standard_ref: 'IEC 60034-1',
      },
      {
        id: 'mot-rotor',
        tag: '02',
        x: 50,
        y: 50,
        title_fr: 'Rotor à cage d’écureuil en cuivre injecté',
        title_en: 'Die-Cast High-Efficiency Squirrel Cage Rotor',
        role_fr: 'Les courants induits créent le couple électromécanique moteur en interaction avec le flux statorique. Équilibrage dynamique G2.5.',
        role_en: 'Induced currents develop high starting torque through magnetic rotor flux interaction. ISO 1940 Grade G2.5 dynamic balancing.',
        material_fr: 'Barres de cuivre et bagues de court-circuit brasées à l’argent sur empilement de tôles magnétiques',
        material_en: 'Pure electrolytic copper bars and end rings silver-brazed to low-loss rotor laminations',
        inspection_fr: 'Signature de courant moteur (MCSA) pour détection de barres fissurées',
        inspection_en: 'Motor Current Signature Analysis (MCSA) to identify cracked rotor bars',
        standard_ref: 'IEC 60034-2-1',
      },
      {
        id: 'mot-bearings',
        tag: '03',
        x: 75,
        y: 52,
        title_fr: 'Paliers et roulements isolés céramique',
        title_en: 'Insulated Ceramic Hybrid Bearings',
        role_fr: 'Soutient le rotor avec un frottement minimal tout en bloquant les courants de circulation d’arbre induits par les convertisseurs de fréquence.',
        role_en: 'Supports drive shaft while breaking capacitive circulating shaft currents generated by high-frequency PWM inverter drives.',
        material_fr: 'Billes en nitrure de silicium (Si₃N₄) avec bagues en acier trempé 100Cr6',
        material_en: 'Silicon nitride (Si₃N₄) ceramic rolling elements with 100Cr6 hardened steel raceways',
        inspection_fr: 'Analyse vibratoire spectrale (accélérométrie globale ISO 10816-3)',
        inspection_en: 'Online spectral vibration velocity and peak acceleration shock pulse monitoring',
        standard_ref: 'ISO 10816-3',
      },
    ],

    lv_switchboard: [
      {
        id: 'lv-busbars',
        tag: '01',
        x: 50,
        y: 18,
        title_fr: 'Jeu de barres principal cuivre électrolytique Cu-ETP',
        title_en: 'Main Horizontal Distribution Copper Busbars (Cu-ETP)',
        role_fr: 'Distribue jusqu’à 4000 A sous 400 V avec une tenue électrodynamique Icw garantie de 80 kA 1s lors des courts-circuits en tête de tableau.',
        role_en: 'Distributes up to 4000 A @ 400 V withstanding short-circuit electrodynamic forces (Icw 80 kA 1s) from upstream distribution transformer.',
        material_fr: 'Cuivre électrolytique méplat 100x10 mm étamé avec supports isolants thermodurcissables auto-extinguibles',
        material_en: 'Tinned electrolytic flat copper bars (100x10 mm) clamped on halogen-free self-extinguishing supports',
        inspection_fr: 'Serrage dynamométrique des éclissages vérifié par peinture témoin de couple',
        inspection_en: 'Torque-wrench verification on fishplate joints marked with torque seal varnish',
        standard_ref: 'IEC 61439-2',
      },
      {
        id: 'lv-acb',
        tag: '02',
        x: 50,
        y: 50,
        title_fr: 'Disjoncteur ouvert débrochable (ACB) Forme 4b',
        title_en: 'Withdrawable Air Circuit Breaker (ACB) Form 4b',
        role_fr: 'Organe de coupure principal avec déclencheur électronique LSI (surcharge, court-retard, instantané) et mesure d’énergie classe 1.',
        role_en: 'Main incoming breaker with electronic trip unit featuring LSI settings, ground fault protection, and revenue-grade metering.',
        material_fr: 'Pôles moulés avec chambres de coupure à désioniseurs métalliques et contacts d’arc en argent-oxyde de nickel',
        material_en: 'Molded chassis with multi-plate de-ion arc chutes and silver nickel-oxide main contacts',
        inspection_fr: 'Injection primaire/secondaire pour validation des courbes de sélectivité chronométrique',
        inspection_en: 'Secondary current injection testing to validate time-current coordination trip curves',
        standard_ref: 'IEC 60947-2',
      },
      {
        id: 'lv-segregation',
        tag: '03',
        x: 78,
        y: 65,
        title_fr: 'Cloisonnement de sécurité interne Forme 4b',
        title_en: 'Internal Form 4b Safety Segregation Barriers',
        role_fr: 'Cloisons métalliques séparant hermétiquement le jeu de barres, les unités fonctionnelles et les départs câbles pour garantir la sécurité pendant les interventions.',
        role_en: 'Metallic compartments separating main busbars, apparatus functional units, and external cable terminals for zero-outage safe maintenance.',
        material_fr: 'Tôles d’acier galvanisé 1.5 mm avec joints d’étanchéité et volets automatiques de brochage',
        material_en: '1.5 mm galvanized steel partitions with automatic safety shutter interlocks',
        inspection_fr: 'Vérification de l’indice de protection interne (IP2X portes ouvertes)',
        inspection_en: 'Internal ingress protection testing (IP2X with cubicle door open)',
        standard_ref: 'IEC 61439-1',
      },
    ],

    rmu_cable_compartment: [
      {
        id: 'rmu-bushing-cables',
        tag: '01',
        x: 48,
        y: 28,
        title_fr: 'Traversées embrochables type C (630 A - 24 kV)',
        title_en: 'Outer Cone Type C Interface Bushings (630 A / 24 kV)',
        role_fr: 'Connexion débrochable étanche et blindée reliant le compartiment gaz SF6 étanche de la RMU aux têtes de câbles HTA sèches.',
        role_en: 'Sealed screened separable connector interface coupling the gas-tight tank to MV underground cable terminations.',
        material_fr: 'Résine époxy moulée avec cône de contact en cuivre argenté et cône déflecteur de champ capacitif',
        material_en: 'Epoxy resin molded body with silver-plated copper stud and capacitive field grading cone',
        inspection_fr: 'Test de décharges partielles (< 5 pC sous 1.73 U0) et couple de serrage M16',
        inspection_en: 'Partial discharge factory test (< 5 pC @ 1.73 U0) and M16 torque verification',
        standard_ref: 'EN 50181 / IEC 60137',
      },
      {
        id: 'rmu-vpis',
        tag: '02',
        x: 75,
        y: 35,
        title_fr: 'Indicateur de présence de tension capacitif (VPIS)',
        title_en: 'Voltage Presence Indicating System (VPIS)',
        role_fr: 'Signalisation optique lumineuse permanente (LEDs clignotantes) par diviseur capacitif intégré dans la traversée pour vérifier l’absence ou présence de tension.',
        role_en: 'Integrated capacitive divider displaying continuous visual LED flashing of phase live status without external auxiliary power.',
        material_fr: 'Électrode capacitive noyée dans la résine avec module d’affichage face avant IP54 à connecteur de test',
        material_en: 'Capacitive coupling electrode embedded in resin with front-panel LED indicator and phase comparator sockets',
        inspection_fr: 'Testeur de concordance de phase portable sur prises bananes test VPIS',
        inspection_en: 'Phase concordance tester on front sockets and functional flash threshold check (IEC 62271-206)',
        standard_ref: 'IEC 62271-206',
      },
      {
        id: 'rmu-earth-switch',
        tag: '03',
        x: 25,
        y: 55,
        title_fr: 'Sectionneur de mise à la terre à fermeture brusque',
        title_en: 'Fault-Making Earthing Switch with Mechanical Interlock',
        role_fr: 'Garantit la sécurité des opérateurs en reliant les 3 phases du câble à la terre avec un pouvoir de fermeture sur court-circuit (Ima 50 kA crête).',
        role_en: 'Ensures personnel safety by grounding cable cores with snap-action spring mechanism rated for short-circuit making (50 kA peak).',
        material_fr: 'Lames de contact en alliage de cuivre étamé avec couteaux auto-nettoyants sous cuve scellée',
        material_en: 'Tinned copper alloy knife contacts in sealed stainless steel enclosure',
        inspection_fr: 'Essai de continuité de terre (< 0.1 ohm) et verrouillage mécanique à clé Ronis / cadenas avec porte de câble',
        inspection_en: 'Earth continuity test (< 0.1 ohm) and door-interlock functional verification',
        standard_ref: 'IEC 62271-102',
      },
      {
        id: 'rmu-toroid-ct',
        tag: '04',
        x: 48,
        y: 72,
        title_fr: 'Tore homopolaire de détection de défaut à la terre',
        title_en: 'Ring-Core Zero-Sequence CT for Earth Fault Detection',
        role_fr: 'Mesure le courant résiduel homopolaire 3I0 sur les têtes de câbles pour alimenter le détecteur de passage de défaut (DPD / FPI).',
        role_en: 'Measures residual zero-sequence current 3I0 around the 3-phase cable to trigger directional Fault Passage Indicators (FPI).',
        material_fr: 'Noyau nanocristallin toroïdal fendu avec écran de blindage électrostatique',
        material_en: 'Split nanocrystalline toroidal magnetic core with electrostatic shield',
        inspection_fr: 'Vérification du passage correct de la tresse de mise à la terre du câble à travers le tore avant raccordement',
        inspection_en: 'Inspection of cable earth shield braid returning through the CT core before earthing',
        standard_ref: 'IEC 61869-2',
      },
    ],

    lightning_faraday_cage: [
      {
        id: 'lpz-air-terminals',
        tag: '01',
        x: 50,
        y: 12,
        title_fr: 'Pointes captrices et réseau maillé en toiture (LPZ 0B)',
        title_en: 'Air-Termination Network & Rooftop Mesh (LPZ 0B)',
        role_fr: 'Intercepte directement le coup de foudre selon la méthode de la sphère fictive (rayon R=20m en Classe I) et répartit l’onde de courant 10/350 µs.',
        role_en: 'Directly intercepts cloud-to-ground lightning flashes per rolling sphere method (radius R=20m Class I) and distributes 10/350 µs surge current.',
        material_fr: 'Pointes inox/cuivre 300 mm reliées à un maillage de cuivre étamé 50 mm² (maille 5x5 m en Classe I)',
        material_en: 'Stainless steel air terminals bonded to 50 mm² tinned copper conductor tape (5x5 m mesh Class I)',
        inspection_fr: 'Contrôle visuel de non-oxydation des raccords mécaniques et tenue mécanique aux vents extrêmes',
        inspection_en: 'Visual inspection of mechanical clamp tightness and roof support integrity per IEC 62305-3',
        standard_ref: 'IEC 62305-3',
      },
      {
        id: 'lpz-down-conductors',
        tag: '02',
        x: 18,
        y: 48,
        title_fr: 'Conducteurs de descente équipotentiels (Down-Conductors)',
        title_en: 'External Down-Conductors & Equipotential Routing',
        role_fr: 'Canalise les dizaines de kiloampères de foudre vers le sol le long des façades en minimisant l’inductance propre (dL/dt) et en respectant la distance de séparation s.',
        role_en: 'Channels surge currents to the ground ring along external perimeter walls minimizing inductive voltage drops (L·di/dt) to prevent flashovers.',
        material_fr: 'Rubans méplats cuivre 30x2 mm fixés tous les 1 m avec raccords de contrôle déconnectables à 2 m du sol',
        material_en: '30x2 mm copper tape clamped every 1 m with test joint disconnecting links at 2 m above grade',
        inspection_fr: 'Mesure de continuité électrique entre pointes captrices et niveau sol (< 0.2 ohm)',
        inspection_en: 'Electrical continuity loop measurement between air terminals and ground links (< 0.2 ohm)',
        standard_ref: 'IEC 62305-3',
      },
      {
        id: 'lpz-equipotential-bar',
        tag: '03',
        x: 50,
        y: 78,
        title_fr: 'Barre principale d’équipotentialité (MEB / LPZ 1)',
        title_en: 'Main Equipotential Bonding Bar (MEB / LPZ 1 Boundary)',
        role_fr: 'Raccorde ensemble toutes les masses métalliques pénétrantes (tuyauteries, blindages câbles, structures acier) et parafoudres Type 1 pour éliminer les différences de potentiel.',
        role_en: 'Interconnects all incoming metallic services (water, gas, cable shields, structural steel) and Type 1 SPDs to eliminate dangerous potential differences.',
        material_fr: 'Barre de cuivre massif 50x5 mm montée sur isolateurs 1 kV avec étriers de serrage numérotés',
        material_en: 'Solid electrolytic copper busbar (50x5 mm) mounted on 1 kV standoff insulators',
        inspection_fr: 'Contrôle du serrage et mesure de continuité des liaisons équipotentielles (< 0.05 ohm)',
        inspection_en: 'Bonding connection integrity check and micro-ohmmeter contact resistance (< 0.05 ohm)',
        standard_ref: 'NF C 15-100 / IEC 60364-5-54',
      },
      {
        id: 'lpz-earth-ring',
        tag: '04',
        x: 50,
        y: 93,
        title_fr: 'Ceinture de terre en fond de fouille (Earth-Termination Type B)',
        title_en: 'Foundation Earth Electrode Loop (Type B Earthing)',
        role_fr: 'Dissipe le courant de choc dans le massif géologique avec une impédance globale < 10 ohms sans gradients de potentiel de pas dangereux.',
        role_en: 'Disperses high-frequency impulse energy safely into deep ground strata maintaining overall resistance < 10 ohms to avoid step potentials.',
        material_fr: 'Boucle fermée en cuivre nu 75 mm² enfouie à > 0.8 m avec piquets de terre verticaux aux 4 angles',
        material_en: '75 mm² bare stranded copper perimeter ring buried @ > 0.8 m with vertical deep-driven copper-clad earth rods',
        inspection_fr: 'Mesure de résistance de terre par méthode des 3 piquets (telluromètre 62%) < 10 Ω',
        inspection_en: 'Earth ground resistance fall-of-potential test (3-point 62% method) verifying R < 10 Ω',
        standard_ref: 'IEC 62305-3 / IEEE 81',
      },
    ],

    xlpe_transition_station: [
      {
        id: 'xlpe-joint-bay',
        tag: '01',
        x: 48,
        y: 45,
        title_fr: 'Chambre de jonction enterrée (Joint Bay)',
        title_en: 'Underground Concrete Cable Joint Bay',
        role_fr: 'Cuve de protection en génie civil abritant les jonctions préfabriquées 225 kV contre les infiltrations d’eau, agressions mécaniques et vibrations.',
        role_en: 'Reinforced concrete underground vault protecting 225 kV pre-molded joints from water ingress, backfill settling, and mechanical damage.',
        material_fr: 'Béton armé étanche avec lit de sable stabilisé et couvercles de fermeture amovibles étanches',
        material_en: 'Water-impervious concrete structure backfilled with thermal sand (Rth < 1.0 K·m/W)',
        inspection_fr: 'Contrôle visuel de non-inondation, détection d’humidité et contrôle des calages',
        inspection_en: 'Visual sump inspection, moisture sensor check, and thermographic survey',
        standard_ref: 'IEC 60840 / IEC 62067',
      },
      {
        id: 'xlpe-cross-bonding',
        tag: '02',
        x: 75,
        y: 28,
        title_fr: 'Boîte de permutation des écrans (Cross-Bonding Link Box)',
        title_en: 'Cross-Bonding Link Box with Disconnect Links',
        role_fr: 'Permute cycliquement les écrans métalliques des 3 phases à chaque pas de tiers de section élémentaire pour annuler les courants induits de circulation.',
        role_en: 'Rotates sheath connections across phases at minor section junctions, canceling induced sheath circulating currents and eliminating Joule losses.',
        material_fr: 'Coffret étanche acier inox IP68 submersible avec barrettes amovibles en cuivre argenté',
        material_en: 'IP68 submersible 316L stainless steel enclosure with removable silver-plated copper links',
        inspection_fr: 'Mesure du courant d’écran résiduel en service (< 3% du courant d’âme) et serrage dynamométrique',
        inspection_en: 'Sheath circulating current clamp measurement (< 3% of conductor current) and link torque check',
        standard_ref: 'CIGRE TB 283 / IEEE 575',
      },
      {
        id: 'xlpe-svl',
        tag: '03',
        x: 82,
        y: 52,
        title_fr: 'Limiteur de tension de gaine (SVL - Sheath Voltage Limiter)',
        title_en: 'Sheath Voltage Limiter (ZnO SVL Cartridges)',
        role_fr: 'Protège la gaine extérieure en PE et les jonctions contre les surtensions transitoires de foudre et de manœuvre en écrêtant à la terre.',
        role_en: 'Protects outer PE serving sheath and sectionalizing insulation against lightning and switching impulses by shunting surges to ground.',
        material_fr: 'Varistances céramiques à oxyde de zinc (ZnO) sous enveloppe silicone hydrophobe',
        material_en: 'Zinc-oxide (ZnO) metal-oxide varistor blocks encapsulated in track-resistant silicone housing',
        inspection_fr: 'Mesure du courant de fuite sous tension de référence CC (U1mA) et résistance d’isolement',
        inspection_en: 'Reference DC voltage (U1mA) leakage current testing and insulation resistance check',
        standard_ref: 'IEC 60099-4 / CIGRE TB 283',
      },
      {
        id: 'xlpe-transition-pothead',
        tag: '04',
        x: 20,
        y: 35,
        title_fr: 'Extrémité aérosouterraine composite (Pothead 225 kV)',
        title_en: 'Transition Air-Cable Termination with Corona Ring',
        role_fr: 'Assure la transition diélectrique entre le câble souterrain à isolant solide XLPE et la ligne aérienne en plein air avec anneau anti-effet couronne.',
        role_en: 'Graduates electrical stress from solid XLPE cable insulation to overhead bare conductors, equipped with corona gradient ring.',
        material_fr: 'Isolateur composite en fibre de verre et ailettes en silicone hydrophobe avec fluide diélectrique synthétique',
        material_en: 'Hollow-core composite insulator with silicone elastomer sheds and gas/fluid insulating medium',
        inspection_fr: 'Contrôle caméra UV effet couronne et mesure de décharges partielles UHF',
        inspection_en: 'UV corona camera inspection and UHF online partial discharge monitoring',
        standard_ref: 'IEC 60840',
      },
    ],

    gas_turbine_skid: [
      {
        id: 'gt-skid-filters',
        tag: '01',
        x: 25,
        y: 38,
        title_fr: 'Filtres coalescents duplex & séparateurs de brouillard',
        title_en: 'Duplex Coalescing Fuel Gas Filters & Moisture Knockout',
        role_fr: 'Élimine les aérosols liquides et les particules solides > 0.3 µm pour protéger les injecteurs DLN contre le bouchage et l’érosion.',
        role_en: 'Removes liquid condensates and particulates down to 0.3 µm safeguarding DLN fuel nozzles from erosion and clogging.',
        material_fr: 'Corps en acier carbone forgé sous 50 bar avec cartouches microfibres de verre borosilicaté',
        material_en: 'Forged carbon steel ASME VIII pressure vessels with borosilicate microfiber cartridges',
        inspection_fr: 'Surveillance de la pression différentielle ΔP avec alarme d’encrassement à 1.5 bar',
        inspection_en: 'Differential pressure gauge monitoring with dirty cartridge alarm @ 1.5 bar ΔP',
        standard_ref: 'ASME Section VIII / ISO 10438',
      },
      {
        id: 'gt-skid-preheater',
        tag: '02',
        x: 52,
        y: 35,
        title_fr: 'Réchauffeur électrique de gaz à point de rosée',
        title_en: 'Electric Performance Fuel Gas Superheater',
        role_fr: 'Élève la température du gaz naturel de +28°C au-dessus du point de rosée des hydrocarbures pour garantir une combustion sans gouttes liquides.',
        role_en: 'Superheats natural gas to +28°C above hydrocarbon dew point, preventing liquid droplet formation ahead of combustion chambers.',
        material_fr: 'Faisceau tubulaire chauffant en Incoloy 800 avec régulateur de puissance à thyristors SCR',
        material_en: 'Incoloy 800 immersion electric heating bundle with SCR thyristor proportional controller',
        inspection_fr: 'Vérification de la boucle de régulation de température et contact de surchauffe limiteur',
        inspection_en: 'Temperature control loop calibration and high-temperature safety shutdown switch test',
        standard_ref: 'API 616 / IEC 60079-0 (ATEX Zone 1)',
      },
      {
        id: 'gt-skid-valves',
        tag: '03',
        x: 75,
        y: 42,
        title_fr: 'Vannes de régulation de débit & coupure rapide (SRV / GCV)',
        title_en: 'Stop/Ratio (SRV) & Gas Control Valves (GCV)',
        role_fr: 'Régule la pression de gaz amont (SRV) et dose le débit massique précis injecté dans les étages de flamme (GCV) avec fermeture d’urgence < 100 ms.',
        role_en: 'Maintains inter-stage header pressure (SRV) and accurately meters fuel gas mass flow (GCV) with rapid trip closure in < 100 ms.',
        material_fr: 'Corps en acier inoxydable forgé avec siège à étanchéité métal-métal et servomoteur électro-hydraulique haute vitesse',
        material_en: 'Forged stainless steel valve bodies with Stellite hard-faced seats and hydraulic servo actuators',
        inspection_fr: 'Test périodique de course complète (Fast Acting Trip Test) et calage du signal LVDT',
        inspection_en: 'Periodic partial/full-stroke trip time test and LVDT position transmitter calibration',
        standard_ref: 'ISO 21789 / IEC 61508 (SIL 3)',
      },
      {
        id: 'gt-skid-purge',
        tag: '04',
        x: 50,
        y: 72,
        title_fr: 'Collecteur de purge à l’azote & évents de double isolement',
        title_en: 'Nitrogen Purge Manifold & Double-Block-and-Bleed (DBB) Vents',
        role_fr: 'Inerte totalement les conduites lors des arrêts d’urgence en chassant le gaz résiduel vers la torche/évent haut avec de l’azote sous pression.',
        role_en: 'Flushes residual fuel gas from manifolds to elevated vents using pressurized N2, preventing explosive mixture formation at shutdown.',
        material_fr: 'Tuyauteries inox 316L avec électrovannes pneumatiques sécurisées Normalement Ouvertes vers l’évent',
        material_en: '316L stainless steel manifold with fail-safe Normally Open pneumatic vent valves',
        inspection_fr: 'Contrôle d’étanchéité à la bulle d’hélium sur les vannes de purge et pression de bouteille N2',
        inspection_en: 'Bubble leak test across DBB vent line and N2 backup bottle manifold pressure check',
        standard_ref: 'NFPA 85 / EN 746-2',
      },
    ],

    lv_abc_service_box: [
      {
        id: 'abc-bundled-cable',
        tag: '01',
        x: 35,
        y: 20,
        title_fr: 'Faisceau aérien basse tension torsadé (LV ABC 3x70+54.6+16 mm²)',
        title_en: 'Low Voltage Aerial Bundled Conductor (LV ABC)',
        role_fr: 'Distribue l’énergie triphasée BT 400V en façade ou sur poteau avec neutre porteur en almélec assurant la tenue mécanique aux tractions.',
        role_en: 'Distributes 400V 3-phase power along facades or poles with insulated Almelec messenger neutral sustaining mechanical cable tension.',
        material_fr: 'Conducteurs aluminium isolés au polyéthylène réticulé noir (XLPE résistant aux UV)',
        material_en: 'Compacted aluminum conductors insulated with carbon-black crosslinked polyethylene (XLPE)',
        inspection_fr: 'Vérification de la flèche de pose, absence de frottement sur arêtes et vieillissement UV',
        inspection_en: 'Sag verification, absence of wall abrasion, and sheath UV embrittlement check',
        standard_ref: 'NF C 33-209 / EN 50483',
      },
      {
        id: 'abc-piercing-connectors',
        tag: '02',
        x: 65,
        y: 28,
        title_fr: 'Connecteurs de dérivation à perforation d’isolant (IPC)',
        title_en: 'Insulation Piercing Connectors (IPC / TTDE)',
        role_fr: 'Raccorde le câble de branchement abonné sous tension sans dénuder le réseau principal, avec vis à tête fusible calibrée garantissant le couple optimal.',
        role_en: 'Taps service drop conductor under live conditions without stripping main cable insulation, utilizing shear-head torque control bolts.',
        material_fr: 'Dents de contact en laiton étamé sous capot élastomère étanche IP68 graissé',
        material_en: 'Tinned brass piercing blades sealed inside silicone-greased UV-resistant IP68 elastomer boot',
        inspection_fr: 'Contrôle de rupture de la tête fusible et absence de point chaud par thermographie IR',
        inspection_en: 'Shear-head breakaway confirmation and infrared thermography hotspot check',
        standard_ref: 'NF C 33-020 / EN 50483-4',
      },
      {
        id: 'abc-service-box',
        tag: '03',
        x: 50,
        y: 65,
        title_fr: 'Coffret coupe-circuit de branchement individuel (CCPI)',
        title_en: 'Customer Service Connection & Cutout Box (CCPI / Seila)',
        role_fr: 'Fournit le point de livraison abonné avec coupure omnipolaire, cartouches fusibles HPC taille 00 et parafoudre de type 2 intégré.',
        role_en: 'Provides customer demarcation point housing high-breaking-capacity (HRC) size 00 fuses and neutral disconnect link.',
        material_fr: 'Enveloppe polyester renforcé fibres de verre auto-extinguible IP43 / IK10 plombable',
        material_en: 'Glass-fiber reinforced polyester enclosure IP43 / IK10 with sealable utility cover',
        inspection_fr: 'Contrôle du calibre des cartouches fusibles HPC gG, serrage des bornes à étrier et scellés',
        inspection_en: 'Fuse rating check (gG size 00), cage clamp torque test, and anti-tamper security seals',
        standard_ref: 'NF C 14-100 / IEC 61439-2',
      },
      {
        id: 'abc-meter-board',
        tag: '04',
        x: 82,
        y: 65,
        title_fr: 'Disjoncteur de branchement d’abonné & comptage communicant',
        title_en: 'Main Residual Current Utility Breaker & Smart Meter (AMR)',
        role_fr: 'Assure la protection générale contre les surcharges, court-circuits et défauts d’isolement différentiel 500 mA sélectif, couplé au compteur communicant.',
        role_en: 'Provides overall customer overcurrent and 500 mA time-delayed selective residual-current earth fault protection.',
        material_fr: 'Disjoncteur magnéto-thermique différentiel plombable 500 mA type S avec compteur communicant CPL/G3',
        material_en: 'Sealable 500 mA selective differential circuit breaker with G3-PLC smart utility meter',
        inspection_fr: 'Test du déclenchement différentiel par bouton test et mesure de temps de coupure',
        inspection_en: 'RCD test push-button operation and trip time measurement (< 200 ms @ 1x IΔn)',
        standard_ref: 'NF C 62-411 / IEC 60947-2',
      },
    ],

    solar_inverter_topology: [
      {
        id: 'sol-inv-mppt',
        tag: '01',
        x: 20,
        y: 35,
        title_fr: 'Étages MPPT Multi-Canaux & Bus Continu 1500 Vcc',
        title_en: 'Multi-Channel MPPT Boost Stage & 1500V DC Link Bus',
        role_fr: 'Optimise l’extraction de puissance continue par algorithme IncCond / P&O rapide (< 50 ms) avec condensateurs à film polypropylène auto-cicatrisants.',
        role_en: 'Performs high-speed MPPT tracking per string/combiner feed into low-inductance (< 25 nH) 1500V DC link polypropylene capacitor bank.',
        material_fr: 'Inductances de boost à noyau nanocristallin et condensateurs métallisés longue durée (> 100 000 h)',
        material_en: 'Nanocrystalline boost inductors and metallized polypropylene dry film DC capacitors',
        inspection_fr: 'Contrôle thermographique des borniers DC et mesure de l’ondulation de tension (ripple < 1.5%)',
        inspection_en: 'Infrared scan of DC input terminals and busbar capacitor ripple voltage measurement',
        standard_ref: 'IEC 62109-1 / IEC 62109-2',
      },
      {
        id: 'sol-inv-npc',
        tag: '02',
        x: 50,
        y: 45,
        title_fr: 'Pont Onduleur 3 Niveaux NPC (Neutral Point Clamped)',
        title_en: '3-Level NPC / T-Type Inverter Bridge (IGBT / SiC)',
        role_fr: 'Découpe la haute tension continue en trois paliers (+Vdc/2, 0, -Vdc/2), réduisant par deux les contraintes dv/dt et éliminant les harmoniques de bas rang.',
        role_en: 'Synthesizes three discrete voltage levels, halving switching voltage stress (Vdc/2), reducing dv/dt EMI, and lowering switching losses.',
        material_fr: 'Modules de puissance IGBT 1700V / diodes rapides de calage neutre avec caloduc caloporteur',
        material_en: '1700V trench-gate IGBT power modules with neutral clamping diodes on heat-pipe baseplates',
        inspection_fr: 'Vérification de l’équilibrage des potentiels du point neutre et temps de réponse des pilotes de grille',
        inspection_en: 'Neutral-point potential balancing check and gate-driver desaturation protection test (< 2 µs)',
        standard_ref: 'IEC 62093 / IEEE 1547',
      },
      {
        id: 'sol-inv-lcl',
        tag: '03',
        x: 75,
        y: 40,
        title_fr: 'Filtre de Sortie Réseau L-C-L avec Amortissement Actif',
        title_en: 'L-C-L Grid Interface Filter with Active Resonance Damping',
        role_fr: 'Atténue le bruit de découpage PWM (f_sw = 3 kHz) pour injecter une onde purement sinusoïdale 50 Hz avec THDi < 1.5% au transformateur élévateur.',
        role_en: 'Suppresses PWM carrier harmonics, ensuring pure 50 Hz current injection with THDi < 1.5% into the step-up transformer.',
        material_fr: 'Inductances triphasées à tôles silicium à grains orientés et condensateurs de filtrage étoile',
        material_en: 'Grain-oriented silicon steel three-phase inductors and star-connected AC filter capacitors',
        inspection_fr: 'Mesure de la résonance du filtre et surveillance du facteur de distorsion THDi par analyseur harmonique',
        inspection_en: 'Acoustic inspection, thermal hotspot scan, and spectrum THDi compliance verification',
        standard_ref: 'IEC 61000-6-4 / IEEE 519',
      },
      {
        id: 'sol-inv-control',
        tag: '04',
        x: 50,
        y: 80,
        title_fr: 'Calculateur DSP/FPGA & Régulateur Réseau (Grid-Forming / VSM)',
        title_en: 'Dual DSP/FPGA Controller & Virtual Synchronous Machine (VSM)',
        role_fr: 'Gouverneur numérique exécutant les boucles de courant d-q en repère de Park, le support de tension LVRT, et la fourniture de puissance réactive nocturne (Q@Night).',
        role_en: 'Real-time digital controller executing dq0 Park transform loops, LVRT voltage support, synthetic inertia, and Q@Night reactive capability.',
        material_fr: 'Cartes électroniques tropicalisées sous boîtier blindé CEM avec liaisons fibre optique',
        material_en: 'Conformal-coated dual-core DSP/FPGA board with fiber-optic PWM links and dual CAN/Modbus',
        inspection_fr: 'Test d’émulation des creux de tension LVRT et étalonnage des boucles d’asservissement de courant',
        inspection_en: 'LVRT hardware-in-the-loop firmware response test and current loop calibration (< 2 ms)',
        standard_ref: 'VDE-AR-N 4110 / VDE-AR-N 4120',
      },
    ],

    wind_dfig_pmsg_converter: [
      {
        id: 'wnd-rsc-bridge',
        tag: '01',
        x: 25,
        y: 35,
        title_fr: 'Convertisseur Côté Machine / Rotor (RSC - Machine Side Converter)',
        title_en: 'Rotor/Machine Side Converter (RSC - PWM Inverter)',
        role_fr: 'En DFIG : injecte la tension rotorique à fréquence de glissement variable pour asservir le couple Te. En PMSG : redresse 100% de la puissance statorique variable.',
        role_en: 'In DFIG: injects slip-frequency AC into wound rotor to control torque. In PMSG: rectifies 100% of generator stator variable frequency power.',
        material_fr: 'Ponts IGBT 1700V/3300V refroidis par caloporteur eau-glycol avec capteurs de courant LEM de haute précision',
        material_en: '1700V/3300V IGBT modules on water-glycol liquid cooling cold-plates with precision current transducers',
        inspection_fr: 'Contrôle du débit et de la température du fluide caloporteur, test d’impulsion des pilotes de grille',
        inspection_en: 'Coolant loop pressure/temperature check and gate driver pulse shape verification',
        standard_ref: 'IEC 61400-21 / IEC 61800-5-1',
      },
      {
        id: 'wnd-crowbar',
        tag: '02',
        x: 48,
        y: 28,
        title_fr: 'Crowbar Actif à Thyristors & Hacheur de Freinage (Chopper)',
        title_en: 'Active Crowbar Circuit & DC Chopper Braking Resistor',
        role_fr: 'Protège instantanément (< 5 µs) les IGBT contre les surtensions et surintensités induites lors de creux de tension réseau sévères (défauts proches).',
        role_en: 'Instantly (< 5 µs) bypasses rotor transient overvoltages and clamps DC link energy during severe grid voltage sags (LVRT).',
        material_fr: 'Thyristors de puissance rapides montés en antiparallèle avec résistances de puissance à haute absorption',
        material_en: 'Fast anti-parallel thyristor stack with heavy-duty stainless steel pulsed braking resistor',
        inspection_fr: 'Contrôle de continuité des résistances de décharge et vérification de la détection de surtension Vdc',
        inspection_en: 'Resistance value verification and DC overvoltage comparator threshold trigger test',
        standard_ref: 'IEC 61400-1 / IEEE 1547',
      },
      {
        id: 'wnd-gsc-bridge',
        tag: '03',
        x: 75,
        y: 35,
        title_fr: 'Convertisseur Côté Réseau (GSC - Grid Side Converter)',
        title_en: 'Grid-Side Converter (GSC - 4-Quadrant Inverter)',
        role_fr: 'Maintient la tension du bus continu V_dc à valeur constante (1150 V) et échange la puissance réactive commandée avec le réseau 50 Hz.',
        role_en: 'Regulates DC link voltage (1150 Vdc) constant and independently controls active and reactive power at the 50 Hz grid connection.',
        material_fr: 'Modules de commutation IGBT 4 quadrants avec selfs de lissage et diodes de roue libre rapides',
        material_en: '4-quadrant IGBT bridge with ultra-fast freewheeling diodes and laminated low-inductance busbars',
        inspection_fr: 'Vérification de la stabilité du bus continu sous appel de puissance et surveillance de l’ESR des condensateurs',
        inspection_en: 'DC link voltage regulation test under step load and capacitor bank ESR health diagnosis',
        standard_ref: 'IEC 61800-3 / CEI 60034-1',
      },
      {
        id: 'wnd-foc-damping',
        tag: '04',
        x: 50,
        y: 80,
        title_fr: 'Régulateur Vectoriel FOC & Amortisseur Actif de Torsion de Tour',
        title_en: 'FOC Vector Controller & Active Drivetrain Damping System',
        role_fr: 'Contrôle vectoriel d-q à orientation de flux statorique, amortissement actif des oscillations de torsion mécanique de l’arbre et injection d’inertie synthétique.',
        role_en: 'Field-oriented control (FOC) decoupled d-q algorithm injecting anti-phase torque to actively damp drive-train mechanical resonances.',
        material_fr: 'Unité centrale industrielle durcie avec boucle d’asservissement temps réel 10 kHz',
        material_en: 'Industrial ruggedized DSP/FPGA architecture with 10 kHz deterministic current control cycle',
        inspection_fr: 'Validation du calage de l’angle d’orientation du flux et audit des journaux de déclenchement d’amortissement',
        inspection_en: 'Flux angle calibration check and drivetrain mechanical resonance damping verification',
        standard_ref: 'IEC 61400-22 / Grid Code ENTSO-E',
      },
    ],
  };

  const activeHotspots = hotspotsMap[schematicType] || hotspotsMap.sf6_breaker;
  const selectedHotspot = activeHotspots.find((h) => h.id === selectedHotspotId) || activeHotspots[0];

  return (
    <div className="rounded-2xl border border-[#252E38] bg-[#090D14] overflow-hidden shadow-2xl">
      {/* Top Header & Engineering Mode Ribbon */}
      <div className="p-4 sm:p-5 border-b border-[#222B38] bg-[#0D121B] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Layers className="h-4 w-4" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              {locale === 'fr' ? 'CAO TECHNIQUE & COUPE INTERNE INTERACTIVE' : 'CAD TECHNICAL SCHEMATIC & INTERNAL CUTAWAY'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              IEC VECTOR 2D
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
            <span>{equipment.name_fr}</span>
            <span className="text-slate-400 text-xs font-normal">({equipment.id})</span>
          </h2>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#06080D] p-1 rounded-xl border border-[#252E38] font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('cutaway')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'cutaway'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Coupe Interne' : 'Cutaway'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('kinematics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'kinematics'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Cinématique / Fluide' : 'Kinematics / Fluid'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('terminals')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'terminals'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Schéma & Bornier' : 'Wiring & Terminals'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: SVG Canvas + Sub-Assembly Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222B38]">
        
        {/* Left / Center (8 cols): High-Resolution Vector Schematic Canvas */}
        <div className="lg:col-span-8 p-4 sm:p-6 bg-[#070A10] relative flex flex-col items-center justify-center min-h-[440px] border-b lg:border-b-0 lg:border-r border-[#222B38] overflow-hidden">
          
          {/* Subtle Technical Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          {/* Dynamic Kinematic / State Controls Overlay */}
          {activeMode === 'kinematics' && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0E1420]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#2B384E] text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'État mécanique :' : 'State:'}
              </span>
              <div className="flex rounded-lg bg-[#06080D] p-0.5 border border-[#202938]">
                <button
                  type="button"
                  onClick={() => setKinematicState('closed')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    kinematicState === 'closed' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Fermé (Nominal)' : 'Closed'}
                </button>
                <button
                  type="button"
                  onClick={() => setKinematicState('arcing')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    kinematicState === 'arcing' ? 'bg-amber-400 text-slate-950 animate-pulse' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Coupure d’Arc' : 'Arcing'}
                </button>
                <button
                  type="button"
                  onClick={() => setKinematicState('open')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    kinematicState === 'open' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Ouvert (Isolé)' : 'Open'}
                </button>
              </div>
            </div>
          )}

          {activeMode === 'terminals' && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0E1420]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#2B384E] text-xs font-mono">
              <span className="text-sky-400 font-bold">{locale === 'fr' ? 'Phase :' : 'Phase:'}</span>
              {(['L1', 'L2', 'L3'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePhase(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    activePhase === p ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* SVG Vector Renderers based on Schematic Type */}
          <div className="relative w-full max-w-[560px] aspect-[4/3] flex items-center justify-center">
            
            {schematicType === 'sf6_breaker' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ceramicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b2d28" />
                    <stop offset="50%" stopColor="#7a4b3d" />
                    <stop offset="100%" stopColor="#2b1f1a" />
                  </linearGradient>
                  <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="ptfeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#38bdf8" />
                    <stop offset="70%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Outer Insulator Shell (Ceramic Sheds) */}
                <g opacity="0.95">
                  {/* Flange Top */}
                  <rect x="210" y="25" width="80" height="20" rx="4" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="250" y1="10" x2="250" y2="25" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
                  <text x="250" y="8" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HTB TERMINAL (225 kV)</text>

                  {/* Insulator Column with Sheds */}
                  <rect x="225" y="45" width="50" height="270" rx="3" fill="url(#ceramicGrad)" stroke="#1e293b" strokeWidth="2" />
                  {[65, 95, 125, 155, 185, 215, 245, 275].map((y) => (
                    <path key={y} d={`M 195 ${y} L 225 ${y - 5} L 275 ${y - 5} L 305 ${y} L 275 ${y + 5} L 225 ${y + 5} Z`} fill="#8b5242" stroke="#4a251b" strokeWidth="1.5" />
                  ))}

                  {/* Lower Mechanism Tank */}
                  <rect x="180" y="315" width="140" height="65" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <text x="250" y="345" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">COMMANDE À RESSORTS</text>
                  <text x="250" y="362" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">0.60 MPa SF6 REL.</text>
                </g>

                {/* Internal Chamber Cutaway View Window */}
                <g>
                  {/* Transparent Chamber Window */}
                  <rect x="232" y="70" width="36" height="235" rx="2" fill="#0369a1" fillOpacity="0.22" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />

                  {/* SF6 Gas Molecular Dots representation */}
                  <circle cx="242" cy="85" r="1.5" fill="#38bdf8" opacity="0.6" />
                  <circle cx="258" cy="95" r="1.5" fill="#38bdf8" opacity="0.6" />
                  <circle cx="240" cy="120" r="1.5" fill="#38bdf8" opacity="0.6" />
                  <circle cx="255" cy="140" r="1.5" fill="#38bdf8" opacity="0.6" />
                  <circle cx="245" cy="270" r="1.5" fill="#38bdf8" opacity="0.6" />

                  {/* Fixed Upper Contact */}
                  <rect x="242" y="80" width="16" height="40" fill="url(#copperGrad)" rx="2" stroke="#d97706" strokeWidth="1" />
                  <rect x="246" y="115" width="8" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

                  {/* PTFE Nozzle */}
                  <path d="M 235 130 L 265 130 L 257 155 L 265 180 L 235 180 L 243 155 Z" fill="url(#ptfeGrad)" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Dynamic Moving Contact & Puffer Cylinder depending on Kinematic State */}
                  {kinematicState === 'closed' && (
                    <g>
                      <rect x="246" y="125" width="8" height="70" fill="url(#copperGrad)" rx="2" stroke="#f59e0b" strokeWidth="1" />
                      <rect x="236" y="195" width="28" height="45" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    </g>
                  )}

                  {kinematicState === 'arcing' && (
                    <g>
                      {/* Plasma Electric Arc */}
                      <circle cx="250" cy="145" r="18" fill="url(#arcGlow)" />
                      <path d="M 250 125 Q 244 135 251 143 Q 256 150 250 160" stroke="#f8fafc" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-pulse" />
                      
                      {/* Supersonic Gas Blow Arrows */}
                      <path d="M 238 135 L 246 142 M 262 135 L 254 142" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 238 155 L 246 148 M 262 155 L 254 148" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

                      {/* Moving Contact separated */}
                      <rect x="246" y="160" width="8" height="65" fill="url(#copperGrad)" rx="2" stroke="#f59e0b" strokeWidth="1" />
                      <rect x="236" y="225" width="28" height="45" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    </g>
                  )}

                  {kinematicState === 'open' && (
                    <g>
                      {/* Large Dielectric Separation Distance */}
                      <line x1="250" y1="130" x2="250" y2="185" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="272" y="160" fill="#38bdf8" fontSize="8" fontFamily="monospace">Δd = 120 mm</text>
                      
                      {/* Fully Withdrawn Moving Contact */}
                      <rect x="246" y="185" width="8" height="65" fill="url(#copperGrad)" rx="2" stroke="#d97706" strokeWidth="1" />
                      <rect x="236" y="250" width="28" height="45" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                    </g>
                  )}
                </g>

                {/* SF6 Densimeter gauge on side */}
                <g transform="translate(140, 310)">
                  <line x1="40" y1="20" x2="10" y2="20" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="0" cy="20" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M -8 20 A 8 8 0 0 1 8 20" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1="0" y1="20" x2="4" y2="12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <text x="0" y="44" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">WIKA DENSITÉ</text>
                </g>

                {/* Bursting Safety Disc on right */}
                <g transform="translate(320, 320)">
                  <line x1="0" y1="10" x2="30" y2="10" stroke="#475569" strokeWidth="4" />
                  <circle cx="35" cy="10" r="10" fill="#dc2626" stroke="#fca5a5" strokeWidth="2" />
                  <text x="35" y="32" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">RUPTURE 0.9 MPa</text>
                </g>
              </svg>
            )}

            {schematicType === 'power_transformer' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.45" />
                  </linearGradient>
                  <pattern id="coreLamination" width="4" height="4" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#475569" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Transformer Main Welded Tank */}
                <rect x="110" y="110" width="280" height="230" rx="10" fill="url(#tankGrad)" stroke="#334155" strokeWidth="2.5" />
                <rect x="115" y="115" width="270" height="220" rx="8" fill="url(#oilGrad)" />

                {/* Oil Level Indicator Line */}
                <line x1="120" y1="125" x2="380" y2="125" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="375" y="120" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="end">NIVEAU HUILE MINÉRALE IEC 60296</text>

                {/* 3-Phase Magnetic Iron Core (Feuilleté) */}
                <g>
                  {/* Top Yoke */}
                  <rect x="150" y="140" width="200" height="24" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                  <rect x="150" y="140" width="200" height="24" fill="url(#coreLamination)" opacity="0.6" />
                  
                  {/* Bottom Yoke */}
                  <rect x="150" y="295" width="200" height="24" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                  <rect x="150" y="295" width="200" height="24" fill="url(#coreLamination)" opacity="0.6" />

                  {/* Limbs (3 Colonnes) */}
                  {[165, 235, 305].map((x, i) => (
                    <g key={x}>
                      {/* Core limb */}
                      <rect x={x} y="164" width="30" height="131" fill="#475569" stroke="#64748b" strokeWidth="1" />
                      <rect x={x} y="164" width="30" height="131" fill="url(#coreLamination)" opacity="0.6" />

                      {/* LV Winding (Inner copper cylinder) */}
                      <rect x={x - 6} y="175" width="42" height="110" rx="3" fill="#b45309" stroke="#d97706" strokeWidth="1.5" opacity="0.9" />

                      {/* HV Winding (Outer disc interleaved coils) */}
                      <rect x={x - 12} y="180" width="54" height="100" rx="4" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" />
                      
                      <text x={x + 15} y="335" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {`PHASE ${['A', 'B', 'C'][i]}`}
                      </text>
                    </g>
                  ))}
                </g>

                {/* 225 kV RIP Capacitive Bushings on Top (HTB) */}
                <g>
                  {[180, 250, 320].map((x, i) => (
                    <g key={x}>
                      <polygon points={`${x-8},110 ${x-4},40 ${x+4},40 ${x+8},110`} fill="#854d0e" stroke="#ca8a04" strokeWidth="1.5" />
                      <circle cx={x} cy="35" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
                      <line x1={x} y1="30" x2={x} y2="15" stroke="#f59e0b" strokeWidth="3" />
                      <text x={x} y="10" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{`1${['U','V','W'][i]}`}</text>
                    </g>
                  ))}
                </g>

                {/* Conservator Pipe with Buchholz Relay */}
                <g>
                  {/* Inclined Pipe */}
                  <path d="M 330 110 L 370 70 L 400 70" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
                  
                  {/* Buchholz Relay Casing */}
                  <rect x="355" y="58" width="30" height="24" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="370" cy="70" r="4" fill="#facc15" />
                  <text x="370" y="50" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BUCHHOLZ 2-SEUILS</text>

                  {/* Conservator Tank */}
                  <ellipse cx="420" cy="70" rx="35" ry="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <text x="420" y="74" fill="#cbd5e1" fontSize="8" fontFamily="monospace" textAnchor="middle">AIR-CELL</text>

                  {/* Dehydrating Breather */}
                  <rect x="445" y="90" width="16" height="32" rx="3" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                  <text x="453" y="132" fill="#fb923c" fontSize="7" fontFamily="monospace" textAnchor="middle">GEL SILICE</text>
                </g>

                {/* Radiator Cooling Bank (ONAN/ONAF) */}
                <g transform="translate(60, 150)">
                  {[0, 10, 20, 30].map((dx) => (
                    <rect key={dx} x={dx} y="0" width="5" height="150" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
                  ))}
                  {/* Forced Fan */}
                  <circle cx="18" cy="165" r="12" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="18" y="169" fill="#fff" fontSize="8" textAnchor="middle">⚡</text>
                  <text x="18" y="188" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">VENTILATEUR ONAF</text>
                </g>

                {/* Substation Civil Engineering: Concrete Retention Pit & Flame-Trap Grate (Fosse de rétention) */}
                <g transform="translate(40, 340)">
                  {/* Concrete Pit Wall & Sump */}
                  <rect x="0" y="0" width="420" height="50" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                  <rect x="10" y="5" width="400" height="40" fill="#1e293b" />
                  {/* Calibrated Pebbles / Flame-Trap Grate Pattern */}
                  <line x1="10" y1="12" x2="410" y2="12" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="10" y1="18" x2="410" y2="18" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="210" y="28" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    GRILLE COUPE-FEU & LIT DE GALETS ÉTOUFFOIRS (100% VOLUME HUILE)
                  </text>
                  <text x="210" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    NF C 17-300 / IEEE 980 • SIPHON ANTI-HYDROCARBURE VERS DÉSHUILEUR
                  </text>
                </g>

                {/* Substation Civil Engineering: Reinforced Concrete Firewall (Mur coupe-feu REI 120) */}
                <g transform="translate(15, 60)">
                  <rect x="0" y="0" width="22" height="320" rx="2" fill="#334155" stroke="#64748b" strokeWidth="2" />
                  {/* Texture Hatch */}
                  {[30, 70, 110, 150, 190, 230, 270].map((hy) => (
                    <line key={hy} x1="3" y1={hy} x2="19" y2={hy + 10} stroke="#475569" strokeWidth="1.5" />
                  ))}
                  <text x="11" y="200" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold" transform="rotate(-90 11 200)">
                    MUR COUPE-FEU REI 120 (250 mm BÉTON ARMÉ)
                  </text>
                </g>
              </svg>
            )}

            {schematicType === 'vacuum_breaker' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ceramicBottle" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#172554" />
                  </linearGradient>
                </defs>

                {/* Epoxy Embedded Pole Casing */}
                <rect x="180" y="40" width="140" height="300" rx="16" fill="#1e1e24" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
                <text x="250" y="30" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PÔLE COULÉ RÉSINE ÉPOXY 30 kV</text>

                {/* Vacuum Bottle Ceramic Assembly */}
                <rect x="205" y="90" width="90" height="190" rx="8" fill="url(#ceramicBottle)" stroke="#93c5fd" strokeWidth="2" />
                <rect x="215" y="100" width="70" height="170" rx="6" fill="#030712" stroke="#1d4ed8" strokeWidth="1" />
                <text x="250" y="115" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">&lt; 10⁻⁷ mbar VIDE</text>

                {/* Fixed Upper Contact CuCr */}
                <rect x="240" y="125" width="20" height="35" rx="3" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
                <circle cx="250" cy="155" r="8" fill="#cbd5e1" stroke="#f59e0b" strokeWidth="2" />

                {/* Arcing / Diffuse Vacuum Plasma Arc */}
                {kinematicState === 'arcing' && (
                  <g>
                    <ellipse cx="250" cy="170" rx="14" ry="6" fill="#38bdf8" opacity="0.9" className="animate-pulse" />
                    <line x1="242" y1="162" x2="242" y2="178" stroke="#fff" strokeWidth="1.5" />
                    <line x1="250" y1="162" x2="250" y2="178" stroke="#fff" strokeWidth="2" />
                    <line x1="258" y1="162" x2="258" y2="178" stroke="#fff" strokeWidth="1.5" />
                    <text x="310" y="173" fill="#38bdf8" fontSize="8" fontFamily="monospace">ARC DIFFUS AMF</text>
                  </g>
                )}

                {/* Moving Contact with AMF Spiral Slots */}
                <circle cx="250" cy="185" r="8" fill="#cbd5e1" stroke="#f59e0b" strokeWidth="2" />
                <rect x="242" y="193" width="16" height="35" rx="2" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />

                {/* Stainless Steel Bellows (Soufflet Inox) */}
                <g transform="translate(235, 230)">
                  {[0, 6, 12, 18, 24].map((dy) => (
                    <path key={dy} d={`M 0 ${dy} L 15 ${dy + 3} L 30 ${dy}`} fill="none" stroke="#94a3b8" strokeWidth="2" />
                  ))}
                </g>

                {/* Mechanical Operating Stem */}
                <line x1="250" y1="260" x2="250" y2="340" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                <text x="250" y="360" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">COURSE MECANIQUE 12 mm</text>
              </svg>
            )}

            {/* RMU Cable Compartment and VPIS Detail SVG */}
            {schematicType === 'rmu_cable_compartment' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid & Base Enclosure */}
                <rect x="70" y="30" width="360" height="340" rx="8" fill="#0b1320" stroke="#1e293b" strokeWidth="2" />
                <path d="M 70 120 L 430 120" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <text x="80" y="50" fill="#64748b" fontSize="9" fontFamily="monospace">COMPARTIMENT SF6 (HAUT)</text>
                <text x="80" y="140" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">COMPARTIMENT CÂBLES HTA (BAS)</text>

                {/* Earthing Switch in upper tank */}
                <g transform="translate(100, 60)">
                  <rect x="0" y="0" width="50" height="35" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M 15 35 L 15 50 M 5 50 L 25 50 M 8 54 L 22 54 M 11 58 L 19 58" stroke="#10b981" strokeWidth="2" />
                  <text x="25" y="22" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">TERRE</text>
                </g>

                {/* 3 Phases Bushings (Outer cone type C) */}
                {([160, 240, 320] as const).map((bx, idx) => {
                  const phase = ['L1', 'L2', 'L3'][idx];
                  return (
                    <g key={phase} transform={`translate(${bx}, 95)`}>
                      {/* Epoxy Bushing Cone */}
                      <path d="M -16 0 L 16 0 L 12 45 L -12 45 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                      {/* Copper Conductor core */}
                      <line x1="0" y1="-10" x2="0" y2="45" stroke="#f59e0b" strokeWidth="4" />
                      {/* Screened Separable Connector (Tête équerre T-Body) */}
                      <path d="M -22 45 L 22 45 L 16 110 L 0 120 L -16 110 Z" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                      <text x="0" y="80" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {phase}
                      </text>
                      {/* Voltage divider capacitive pick-off */}
                      <circle cx="10" cy="35" r="3" fill="#f43f5e" />
                      {/* Cable XLPE entering through floor */}
                      <path d="M -8 110 L -8 240 M 8 110 L 8 240" stroke="#475569" strokeWidth="2" fill="none" />
                      <line x1="0" y1="120" x2="0" y2="240" stroke="#f59e0b" strokeWidth="3" />
                      <rect x="-12" y="210" width="24" height="25" fill="#0f172a" stroke="#64748b" rx="2" />
                    </g>
                  );
                })}

                {/* Toroid Zero-Sequence CT (Tore homopolaire 3I0) */}
                <ellipse cx="240" cy="285" rx="105" ry="18" fill="none" stroke="#a855f7" strokeWidth="7" strokeDasharray="6 2" />
                <rect x="350" y="275" width="60" height="22" rx="4" fill="#581c87" stroke="#c084fc" />
                <text x="380" y="290" fill="#f3e8ff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TORE 3I0</text>

                {/* Earth Braid loopback */}
                <path d="M 235 305 L 235 330 L 130 330 L 130 345" fill="none" stroke="#10b981" strokeWidth="3" />
                <path d="M 120 345 L 140 345 M 123 349 L 137 349 M 126 353 L 134 353" stroke="#10b981" strokeWidth="2" />
                <text x="175" y="342" fill="#10b981" fontSize="8" fontFamily="monospace">Tresse de terre retournant à travers le tore</text>

                {/* VPIS Unit on the upper right panel */}
                <g transform="translate(360, 140)">
                  <rect x="0" y="0" width="60" height="75" rx="4" fill="#020617" stroke="#0ea5e9" strokeWidth="1.5" />
                  <text x="30" y="14" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VPIS IEC</text>
                  {/* 3 Flashing Indicator LEDs */}
                  <circle cx="15" cy="30" r="4" fill="#ef4444" className="animate-ping" />
                  <circle cx="15" cy="30" r="4" fill="#ef4444" />
                  <text x="15" y="44" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">L1</text>
                  <circle cx="30" cy="30" r="4" fill="#ef4444" className="animate-ping" />
                  <circle cx="30" cy="30" r="4" fill="#ef4444" />
                  <text x="30" y="44" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">L2</text>
                  <circle cx="45" cy="30" r="4" fill="#ef4444" className="animate-ping" />
                  <circle cx="45" cy="30" r="4" fill="#ef4444" />
                  <text x="45" y="44" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">L3</text>
                  {/* Test Banana Jacks */}
                  <circle cx="20" cy="58" r="3" fill="#334155" stroke="#94a3b8" />
                  <circle cx="40" cy="58" r="3" fill="#334155" stroke="#94a3b8" />
                  <text x="30" y="69" fill="#64748b" fontSize="6" fontFamily="monospace" textAnchor="middle">TEST PHASE</text>
                </g>

                {/* Mechanical Interlock Bar */}
                <line x1="75" y1="120" x2="75" y2="360" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 3" />
                <text x="80" y="320" fill="#f59e0b" fontSize="8" fontFamily="monospace" transform="rotate(-90 80 320)">VERROUILLAGE PORTE / TERRE</text>
              </svg>
            )}

            {/* Lightning Protection Zone (LPZ) & Rooftop Faraday Cage Architectural Cutaway SVG */}
            {schematicType === 'lightning_faraday_cage' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Rolling Sphere Arc & Lightning Flash */}
                <path d="M 50 40 Q 250 90 450 40" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="250" y="55" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">SPHÈRE FICTIVE R = 20 m (CLASSE I)</text>
                
                {/* Cloud & Lightning Bolt */}
                <path d="M 230 15 L 245 40 L 238 42 L 250 70" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

                {/* Building Roof Silhouette & Faraday Mesh (LPZ 0B) */}
                <rect x="80" y="70" width="340" height="230" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                {/* Rooftop Air Terminals (Pointes) */}
                {[90, 170, 250, 330, 410].map((rx) => (
                  <g key={rx}>
                    <line x1={rx} y1="70" x2={rx} y2="48" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    <circle cx={rx} cy="48" r="2.5" fill="#e0f2fe" />
                  </g>
                ))}
                {/* Roof Faraday Mesh Wire */}
                <line x1="85" y1="70" x2="415" y2="70" stroke="#0ea5e9" strokeWidth="4" />
                <text x="250" y="85" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  MAILLAGE CAGE DE FARADAY 5x5 m (LPZ 0B) • RUBAN CUIVRE ÉTAMÉ
                </text>

                {/* Building Zones LPZ 1 & LPZ 2 Internal Separations */}
                <rect x="110" y="105" width="280" height="180" rx="4" fill="#1e293b" fillOpacity="0.6" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="120" y="125" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">ZONE INTÉRIEURE PROTÉGÉE : LPZ 1</text>

                {/* Sensitive Server / SCADA Rack (LPZ 2) */}
                <rect x="260" y="150" width="110" height="120" rx="4" fill="#0369a1" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="315" y="175" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ZONE LPZ 2</text>
                <text x="315" y="195" fill="#cbd5e1" fontSize="7" fontFamily="monospace" textAnchor="middle">AUTOMATES & SCADA</text>
                <text x="315" y="210" fill="#a5f3fc" fontSize="7" fontFamily="monospace" textAnchor="middle">PARAFOUDRES TYPE 2+3</text>

                {/* External Down-Conductors (Descentes) */}
                <line x1="85" y1="70" x2="85" y2="330" stroke="#f59e0b" strokeWidth="4" />
                <line x1="415" y1="70" x2="415" y2="330" stroke="#f59e0b" strokeWidth="4" />
                <text x="70" y="200" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 70 200)">
                  DESCENTE EXTÉRIEURE CUIVRE 30x2 mm
                </text>

                {/* Test Joints (Joints de contrôle déconnectables) */}
                <rect x="78" y="270" width="14" height="20" rx="2" fill="#d97706" stroke="#fff" strokeWidth="1" />
                <text x="50" y="282" fill="#fbbf24" fontSize="7" fontFamily="monospace">JOINT 2 m</text>
                <rect x="408" y="270" width="14" height="20" rx="2" fill="#d97706" stroke="#fff" strokeWidth="1" />

                {/* Main Equipotential Bonding Bar (MEB) */}
                <rect x="130" y="250" width="100" height="18" rx="3" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="180" y="262" fill="#fef3c7" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  BARRE ÉQUIPOTENTIELLE (MEB)
                </text>
                {/* Equipotential bonding lines to pipes, metal structures */}
                <line x1="145" y1="268" x2="145" y2="320" stroke="#10b981" strokeWidth="2.5" />
                <line x1="180" y1="268" x2="180" y2="330" stroke="#10b981" strokeWidth="2.5" />
                <line x1="215" y1="268" x2="260" y2="268" stroke="#10b981" strokeWidth="2.5" />

                {/* Ground Level Foundation Earth Ring (Ceinture de terre) */}
                <line x1="50" y1="330" x2="450" y2="330" stroke="#10b981" strokeWidth="5" />
                <text x="250" y="348" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  BOUCLE DE TERRE À FOND DE FOUILLE &gt; 0.80 m (R &lt; 10 Ω) • CUIVRE 75 mm²
                </text>
                {/* Earth Rods */}
                {[60, 200, 300, 440].map((px) => (
                  <g key={px}>
                    <line x1={px} y1="330" x2={px} y2="380" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                    <path d={`M ${px - 6} 380 L ${px + 6} 380 M ${px - 4} 384 L ${px + 4} 384 M ${px - 2} 388 L ${px + 2} 388`} stroke="#059669" strokeWidth="1.5" />
                  </g>
                ))}
              </svg>
            )}

            {/* High-Voltage Underground XLPE Cable Transition Station Cutaway SVG */}
            {schematicType === 'xlpe_transition_station' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Underground Joint Bay Concrete Vault (Chambre de jonction) */}
                <rect x="30" y="90" width="440" height="270" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <rect x="40" y="100" width="420" height="250" rx="6" fill="#1e293b" />
                
                {/* Thermal backfill sand bed layer */}
                <rect x="45" y="240" width="410" height="105" fill="#78350f" fillOpacity="0.3" stroke="#92400e" strokeWidth="1" strokeDasharray="3 3" />
                <text x="250" y="335" fill="#d97706" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  SABLE STABILISÉ DE REMBLAI THERMIQUE (Rth &lt; 1.0 K·m/W) • NIVEAU RADIER BÉTON
                </text>

                {/* 3 XLPE High Voltage Cables (Phases L1, L2, L3) with Prefabricated Splices */}
                {[135, 175, 215].map((cy, idx) => {
                  const phase = ['1U', '1V', '1W'][idx];
                  return (
                    <g key={phase}>
                      {/* Left cable run */}
                      <rect x="40" y={cy - 6} width="120" height="12" fill="#334155" stroke="#64748b" rx="2" />
                      <line x1="40" y1={cy} x2="160" y2={cy} stroke="#f59e0b" strokeWidth="4" />
                      {/* Prefabricated Premolded Joint Body (Jonction rubanée / préfabriquée) */}
                      <path d={`M 160 ${cy - 12} L 280 ${cy - 12} L 295 ${cy} L 280 ${cy + 12} L 160 ${cy + 12} L 145 ${cy} Z`} fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                      <text x="220" y={cy + 4} fill="#f0f9ff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        JONCTION XLPE 225 kV ({phase})
                      </text>
                      {/* Right cable run */}
                      <rect x="295" y={cy - 6} width="85" height="12" fill="#334155" stroke="#64748b" rx="2" />
                      <line x1="295" y1={cy} x2="380" y2={cy} stroke="#f59e0b" strokeWidth="4" />
                      {/* Sheath lead wire taking off to Cross-bonding box */}
                      <line x1="280" y1={cy - 10} x2="370" y2="70" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                    </g>
                  );
                })}

                {/* Above-ground Cross-Bonding Link Box (Coffret de permutation d'écrans) */}
                <g transform="translate(350, 25)">
                  {/* Pedestal & Box */}
                  <rect x="0" y="0" width="110" height="95" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <text x="55" y="18" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    COFFRET PERMUTATION
                  </text>
                  <text x="55" y="28" fill="#a7f3d0" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    CROSS-BONDING IP68
                  </text>
                  {/* Internal Removable Disconnect Links */}
                  <line x1="20" y1="40" x2="45" y2="60" stroke="#f59e0b" strokeWidth="3" />
                  <line x1="50" y1="40" x2="75" y2="60" stroke="#f59e0b" strokeWidth="3" />
                  <line x1="80" y1="40" x2="35" y2="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                  
                  {/* Zinc Oxide Sheath Voltage Limiters (SVL Cartridges) */}
                  <rect x="20" y="68" width="15" height="20" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
                  <rect x="47" y="68" width="15" height="20" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
                  <rect x="75" y="68" width="15" height="20" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
                  <text x="55" y="93" fill="#fdba74" fontSize="6" fontFamily="monospace" textAnchor="middle">
                    SVL ZnO (PARAFOUDRES D'ÉCRAN)
                  </text>
                </g>

                {/* Ground Level Pylone Transition Pothead Bushing (Aéro-souterrain) */}
                <g transform="translate(45, 10)">
                  <polygon points="15,80 25,15 35,15 45,80" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Corona Ring on Pothead */}
                  <ellipse cx="30" cy="20" rx="22" ry="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  <text x="30" y="8" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ANNEAU CORONA</text>
                  <text x="75" y="45" fill="#38bdf8" fontSize="8" fontFamily="monospace">EXTRÉMITÉ COMPOSITE</text>
                </g>
              </svg>
            )}

            {/* Gas Turbine Auxiliary Fuel & Purge Skid Cutaway SVG */}
            {schematicType === 'gas_turbine_skid' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Skid Steel Structural Base Frame */}
                <rect x="30" y="50" width="440" height="300" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="310" x2="470" y2="310" stroke="#475569" strokeWidth="8" />
                <text x="250" y="332" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  CHÂSSIS SKID CHARPENTE MÉTALLIQUE ATEX ZONE 1 • ENTRAÎNEMENT HYDRAULIQUE
                </text>

                {/* Duplex Coalescing Filters (Stage 1) */}
                <g transform="translate(60, 90)">
                  <rect x="0" y="0" width="35" height="110" rx="10" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                  <rect x="42" y="0" width="35" height="110" rx="10" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                  <line x1="17" y1="20" x2="17" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="59" y1="20" x2="59" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="38" y="125" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">FILTRES DUPLEX</text>
                  <text x="38" y="138" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">0.3 µm &bull; &Delta;P &lt; 1.5 bar</text>
                </g>

                {/* Electric Gas Performance Superheater (Stage 2) */}
                <g transform="translate(180, 85)">
                  <rect x="0" y="0" width="95" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  {/* Heating coils representation */}
                  {[25, 45, 65, 85].map((hx) => (
                    <path key={hx} d={`M ${hx} 20 Q ${hx + 5} 55 ${hx} 90`} fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  ))}
                  <text x="47" y="135" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SURCHAUFFEUR GAZ</text>
                  <text x="47" y="148" fill="#fed7aa" fontSize="7" fontFamily="monospace" textAnchor="middle">+28&deg;C SUP. PT ROSÉE</text>
                </g>

                {/* Servo Valves: Stop Ratio (SRV) & Gas Control Valve (GCV) (Stage 3) */}
                <g transform="translate(320, 95)">
                  {/* SRV Valve Body & Actuator */}
                  <polygon points="0,50 30,30 30,70" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <polygon points="60,50 30,30 30,70" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="23" y="10" width="14" height="22" fill="#0284c7" stroke="#38bdf8" rx="2" />
                  <text x="30" y="8" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">SRV</text>

                  {/* Interstage Header */}
                  <line x1="60" y1="50" x2="80" y2="50" stroke="#cbd5e1" strokeWidth="5" />

                  {/* GCV Valve Body & Actuator */}
                  <polygon points="80,50 110,30 110,70" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <polygon points="140,50 110,30 110,70" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="103" y="10" width="14" height="22" fill="#0284c7" stroke="#38bdf8" rx="2" />
                  <text x="110" y="8" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">GCV</text>

                  <text x="70" y="85" fill="#cbd5e1" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VANNES DE DOSAGE</text>
                  <text x="70" y="98" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">FERMETURE &lt; 100 ms</text>
                </g>

                {/* Nitrogen Purge & Double-Block-and-Bleed Vent System */}
                <g transform="translate(100, 240)">
                  <rect x="0" y="0" width="300" height="50" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                  {/* N2 Bottles & Purge line */}
                  <rect x="15" y="10" width="12" height="30" rx="3" fill="#059669" />
                  <rect x="32" y="10" width="12" height="30" rx="3" fill="#059669" />
                  <text x="60" y="24" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">PURGE AZOTE (N2) &bull; DOUBLE BLOCAGE &amp; ÉVENT (DBB)</text>
                  <text x="60" y="38" fill="#a7f3d0" fontSize="7" fontFamily="monospace">INERTAGE AUTOMATIQUE SIL 3 LORS DE DÉCLENCHEMENT D’URGENCE</text>
                </g>
              </svg>
            )}

            {/* LV Aerial Bundled Conductor (ABC) & Service Connection Box Cutaway SVG */}
            {schematicType === 'lv_abc_service_box' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Wall / Pole Support */}
                <rect x="20" y="20" width="460" height="360" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <line x1="20" y1="120" x2="480" y2="120" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                {/* Overhead LV Aerial Bundled Conductor (ABC Faisceau Torsadé) */}
                <g transform="translate(40, 50)">
                  {/* 4 Twisted Bundled Conductors */}
                  <path d="M 0 20 Q 80 5 160 20 T 320 20 T 420 20" fill="none" stroke="#1e293b" strokeWidth="14" />
                  <path d="M 0 20 Q 80 35 160 20 T 320 20 T 420 20" fill="none" stroke="#0284c7" strokeWidth="4" />
                  <path d="M 0 15 Q 80 0 160 15 T 320 15 T 420 15" fill="none" stroke="#f59e0b" strokeWidth="4" />
                  <path d="M 0 25 Q 80 10 160 25 T 320 25 T 420 25" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 2" />
                  
                  {/* Cable Label */}
                  <text x="140" y="5" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    FAISCEAU BT TORSADÉ NF C 33-209 (3x70 Al + 54.6 Almélec Neutre Porteur + 16 EP)
                  </text>
                </g>

                {/* Insulation Piercing Connectors (IPC / TTDE) */}
                <g transform="translate(240, 85)">
                  <rect x="0" y="0" width="30" height="32" rx="4" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                  {/* Shear head bolt */}
                  <polygon points="15,-6 24,-1 24,6 15,11 6,6 6,-1" fill="#ea580c" stroke="#f59e0b" strokeWidth="1" />
                  <text x="15" y="45" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">IPC / TTDE</text>
                  <text x="15" y="55" fill="#fed7aa" fontSize="6" fontFamily="monospace" textAnchor="middle">TÊTE FUSIBLE</text>
                </g>

                {/* Drop cable going down from IPC to Service Box */}
                <path d="M 255 117 L 255 180 L 190 180 L 190 210" fill="none" stroke="#f59e0b" strokeWidth="3" />

                {/* Customer Service Connection & Cutout Box (CCPI) */}
                <g transform="translate(130, 210)">
                  <rect x="0" y="0" width="130" height="150" rx="6" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                  <text x="65" y="20" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    COFFRET CCPI
                  </text>
                  <text x="65" y="32" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    IP43 / IK10 PLOMBABLE
                  </text>

                  {/* 3 HRC Fuse Cartridges (Taille 00) */}
                  {[20, 55, 90].map((fx, idx) => (
                    <g key={fx} transform={`translate(${fx}, 45)`}>
                      <rect x="0" y="0" width="20" height="50" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                      <line x1="10" y1="0" x2="10" y2="50" stroke="#ea580c" strokeWidth="2" />
                      <text x="10" y="65" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {`F${idx + 1}`}
                      </text>
                      <text x="10" y="75" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">gG 00</text>
                    </g>
                  ))}
                  <text x="65" y="140" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle">BARRETTE NEUTRE DIRECTE</text>
                </g>

                {/* Smart Meter & Main Residual Current Utility Breaker Panel */}
                <g transform="translate(290, 210)">
                  <rect x="0" y="0" width="150" height="150" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                  <text x="75" y="20" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    PANNEAU DE COMPTAGE
                  </text>

                  {/* Smart Meter Screen */}
                  <rect x="25" y="35" width="100" height="35" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                  <text x="75" y="52" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">024856 kWh</text>
                  <text x="75" y="64" fill="#a7f3d0" fontSize="7" fontFamily="monospace" textAnchor="middle">LINKY / CPL G3 ACTIF</text>

                  {/* Differential Breaker 500 mA Selective */}
                  <rect x="35" y="80" width="80" height="45" rx="4" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="75" y="98" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AGCP 500 mA (S)</text>
                  <circle cx="50" cy="112" r="4" fill="#ef4444" />
                  <text x="65" y="115" fill="#f87171" fontSize="6" fontFamily="monospace">TEST T</text>
                  <rect x="85" y="108" width="18" height="8" fill="#10b981" rx="1" />
                </g>
              </svg>
            )}

            {/* Solar Central/String Inverter 1500V 3-Level NPC Cutaway SVG */}
            {schematicType === 'solar_inverter_topology' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Enclosure Frame / Skid outline */}
                <rect x="15" y="15" width="470" height="370" rx="8" fill="#080c14" stroke="#1e293b" strokeWidth="2" />
                <rect x="20" y="20" width="460" height="360" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

                {/* Title Banner */}
                <rect x="20" y="20" width="460" height="28" fill="#1e293b" />
                <text x="30" y="38" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ONDULEUR CENTRAL SOLAIRE 1500V DC / 690V AC &bull; TOPOLOGIE NPC 3 NIVEAUX (IEC 62109)
                </text>
                <text x="465" y="38" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                  3.125 MVA / 50 Hz
                </text>

                {/* Stage 1: DC Inputs, Fuses, SPD & MPPT Stage (Left) */}
                <g transform="translate(30, 60)">
                  <rect x="0" y="0" width="105" height="220" rx="5" fill="#182234" stroke="#f59e0b" strokeWidth="1.5" />
                  <rect x="0" y="0" width="105" height="22" rx="4" fill="#78350f" />
                  <text x="52" y="15" fill="#fef3c7" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    ENTRÉE DC 1500V
                  </text>

                  {/* DC Strings Inputs & Disconnect */}
                  {[0, 1, 2, 3].map((idx) => (
                    <g key={idx} transform={`translate(10, ${32 + idx * 30})`}>
                      <line x1="0" y1="6" x2="20" y2="6" stroke="#ea580c" strokeWidth="2" />
                      <line x1="0" y1="16" x2="20" y2="16" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="20" y="2" width="22" height="18" rx="2" fill="#334155" stroke="#f59e0b" strokeWidth="1" />
                      <text x="31" y="14" fill="#fbbf24" fontSize="6" fontFamily="monospace" textAnchor="middle">FUS</text>
                      <line x1="42" y1="11" x2="85" y2="11" stroke="#f59e0b" strokeWidth="2" />
                    </g>
                  ))}

                  {/* DC Link Polypropylene Capacitor Bank */}
                  <g transform="translate(10, 160)">
                    <rect x="0" y="0" width="85" height="50" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="42" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BUS DC 1500 Vcc</text>
                    <line x1="15" y1="26" x2="35" y2="26" stroke="#0ea5e9" strokeWidth="3" />
                    <line x1="25" y1="20" x2="25" y2="42" stroke="#0ea5e9" strokeWidth="2" />
                    <line x1="50" y1="26" x2="70" y2="26" stroke="#0ea5e9" strokeWidth="3" />
                    <line x1="60" y1="20" x2="60" y2="42" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="42" y="44" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">&plusmn;750V / Point Neutre N</text>
                  </g>
                </g>

                {/* DC to Inverter Bridge Busbars */}
                <path d="M 135 140 L 170 140" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <path d="M 135 180 L 170 180" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                <path d="M 135 210 L 170 210" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

                {/* Stage 2: Inverter Core (3-Level NPC Bridge IGBT/SiC) */}
                <g transform="translate(170, 60)">
                  <rect x="0" y="0" width="160" height="220" rx="5" fill="#182234" stroke="#0ea5e9" strokeWidth="1.5" />
                  <rect x="0" y="0" width="160" height="22" rx="4" fill="#0369a1" />
                  <text x="80" y="15" fill="#e0f2fe" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    PONT 3 NIVEAUX NPC (IGBT 1.7 kV)
                  </text>

                  {/* 3 Phase Legs (U, V, W) */}
                  {['PHASE U', 'PHASE V', 'PHASE W'].map((phase, pidx) => (
                    <g key={phase} transform={`translate(${15 + pidx * 46}, 32)`}>
                      <rect x="0" y="0" width="38" height="175" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                      <text x="19" y="12" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{phase}</text>
                      
                      {/* Top IGBT T1/T2 */}
                      <rect x="6" y="20" width="26" height="24" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="19" y="34" fill="#fbbf24" fontSize="6" fontFamily="monospace" textAnchor="middle">T1 IGBT</text>
                      <rect x="6" y="50" width="26" height="24" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="19" y="64" fill="#fbbf24" fontSize="6" fontFamily="monospace" textAnchor="middle">T2 IGBT</text>

                      {/* Neutral Clamping Diodes D1/D2 */}
                      <circle cx="19" cy="87" r="8" fill="#334155" stroke="#10b981" strokeWidth="1" />
                      <text x="19" y="90" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">NPC</text>

                      {/* Bottom IGBT T3/T4 */}
                      <rect x="6" y="102" width="26" height="24" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="19" y="116" fill="#fbbf24" fontSize="6" fontFamily="monospace" textAnchor="middle">T3 IGBT</text>
                      <rect x="6" y="132" width="26" height="24" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="19" y="146" fill="#fbbf24" fontSize="6" fontFamily="monospace" textAnchor="middle">T4 IGBT</text>

                      {/* AC Output Phase Pin */}
                      <circle cx="19" cy="166" r="4" fill="#38bdf8" />
                    </g>
                  ))}
                </g>

                {/* Inverter to LCL Filter Lines */}
                <path d="M 330 140 L 355 140" fill="none" stroke="#38bdf8" strokeWidth="3" />
                <path d="M 330 170 L 355 170" fill="none" stroke="#38bdf8" strokeWidth="3" />
                <path d="M 330 200 L 355 200" fill="none" stroke="#38bdf8" strokeWidth="3" />

                {/* Stage 3: LCL Grid Filter & AC Contactor (Right) */}
                <g transform="translate(355, 60)">
                  <rect x="0" y="0" width="115" height="220" rx="5" fill="#182234" stroke="#10b981" strokeWidth="1.5" />
                  <rect x="0" y="0" width="115" height="22" rx="4" fill="#065f46" />
                  <text x="57" y="15" fill="#d1fae5" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    FILTRE L-C-L &amp; SORTIE AC
                  </text>

                  {/* Inductors L1 / L2 */}
                  <g transform="translate(15, 35)">
                    <rect x="0" y="0" width="85" height="42" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="42" y="14" fill="#34d399" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">INDUCTANCES L1-L2</text>
                    <path d="M 15 28 Q 25 18 35 28 T 55 28 T 75 28" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </g>

                  {/* Filter Capacitors C_f */}
                  <g transform="translate(15, 90)">
                    <rect x="0" y="0" width="85" height="35" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="42" y="13" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">CAPACITÉS FILTRE C_f</text>
                    <line x1="25" y1="22" x2="35" y2="22" stroke="#0ea5e9" strokeWidth="2" />
                    <line x1="45" y1="22" x2="55" y2="22" stroke="#0ea5e9" strokeWidth="2" />
                    <line x1="65" y1="22" x2="75" y2="22" stroke="#0ea5e9" strokeWidth="2" />
                  </g>

                  {/* Main AC Contactor & Disconnector */}
                  <g transform="translate(15, 140)">
                    <rect x="0" y="0" width="85" height="45" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="42" y="14" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DISJONCTEUR AC 690V</text>
                    <circle cx="25" cy="30" r="5" fill="#22c55e" />
                    <circle cx="42" cy="30" r="5" fill="#22c55e" />
                    <circle cx="60" cy="30" r="5" fill="#22c55e" />
                  </g>

                  <text x="57" y="205" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    &rarr; VERS TRANSFO HTA 33kV
                  </text>
                </g>

                {/* Bottom Master Controller & Grid-Forming DSP/FPGA Rack */}
                <g transform="translate(30, 295)">
                  <rect x="0" y="0" width="440" height="75" rx="6" fill="#111827" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="0" y="0" width="440" height="20" rx="4" fill="#0c4a6e" />
                  <text x="15" y="14" fill="#e0f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    CONTRÔLEUR TEMPS RÉEL MULTI-CŒURS DSP/FPGA &bull; RÉGULATION D-Q &amp; GRID-FORMING VSM
                  </text>
                  <text x="425" y="14" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="end">
                    CYCLE &lt; 20 &mu;s
                  </text>

                  {/* Controller Functional Blocks */}
                  <g transform="translate(15, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="47" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ALGO MPPT INC-COND</text>
                    <text x="47" y="27" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">&eta; MPPT &gt; 99.9%</text>
                  </g>

                  <g transform="translate(120, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <text x="47" y="14" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PARK D-Q DECOUPLING</text>
                    <text x="47" y="27" fill="#fed7aa" fontSize="6" fontFamily="monospace" textAnchor="middle">Id: P(f) / Iq: Q(U)</text>
                  </g>

                  <g transform="translate(225, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="47" y="14" fill="#34d399" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SOUTIEN LVRT / FRT</text>
                    <text x="47" y="27" fill="#a7f3d0" fontSize="6" fontFamily="monospace" textAnchor="middle">I_reac = 2% / 1% &Delta;U</text>
                  </g>

                  <g transform="translate(330, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                    <text x="47" y="14" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Q-AT-NIGHT STATCOM</text>
                    <text x="47" y="27" fill="#e9d5ff" fontSize="6" fontFamily="monospace" textAnchor="middle">Soutien Réseau 24/7</text>
                  </g>
                </g>
              </svg>
            )}

            {/* Wind DFIG / PMSG Full Back-to-Back Converter Cutaway SVG */}
            {schematicType === 'wind_dfig_pmsg_converter' && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Enclosure Frame / Nacelle Cabinet outline */}
                <rect x="15" y="15" width="470" height="370" rx="8" fill="#080c14" stroke="#1e293b" strokeWidth="2" />
                <rect x="20" y="20" width="460" height="360" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

                {/* Title Banner */}
                <rect x="20" y="20" width="460" height="28" fill="#1e293b" />
                <text x="30" y="38" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  CONVERTISSEUR DE FRÉQUENCE ÉOLIEN BACK-TO-BACK &bull; DFIG / PMSG 4 QUADRANTS (IEC 61400)
                </text>
                <text x="465" y="38" fill="#22c55e" fontSize="9" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                  4.5 MW &bull; 690 V AC
                </text>

                {/* Stage 1: Rotor / Machine Side Converter (RSC) */}
                <g transform="translate(30, 60)">
                  <rect x="0" y="0" width="125" height="220" rx="5" fill="#182234" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="0" y="0" width="125" height="22" rx="4" fill="#0369a1" />
                  <text x="62" y="15" fill="#e0f2fe" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    RSC (CÔTÉ MACHINE/ROTOR)
                  </text>

                  {/* Three-Phase AC Input from Generator Rotor/Stator */}
                  <g transform="translate(10, 30)">
                    <text x="50" y="12" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      &larr; GÉNÉRATRICE AC
                    </text>
                    <text x="50" y="22" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">
                      (0 &agrave; 25 Hz glissant)
                    </text>
                    <path d="M 10 32 L 95 32" stroke="#38bdf8" strokeWidth="2" />
                    <path d="M 10 42 L 95 42" stroke="#38bdf8" strokeWidth="2" />
                    <path d="M 10 52 L 95 52" stroke="#38bdf8" strokeWidth="2" />
                  </g>

                  {/* RSC IGBT Bridge Modules with Liquid Cooling Plate */}
                  <g transform="translate(12, 95)">
                    <rect x="0" y="0" width="100" height="95" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="50" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      IGBT 1700V / 3300V
                    </text>
                    
                    {/* IGBT pairs */}
                    <rect x="10" y="24" width="22" height="30" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="21" y="42" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle">U</text>
                    <rect x="39" y="24" width="22" height="30" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="50" y="42" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle">V</text>
                    <rect x="68" y="24" width="22" height="30" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="79" y="42" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle">W</text>

                    {/* Liquid cold plate footer */}
                    <rect x="8" y="65" width="84" height="20" rx="2" fill="#0284c7" />
                    <text x="50" y="78" fill="#f0fdf4" fontSize="6" fontFamily="monospace" textAnchor="middle">PLAQUE EAU-GLYCOL</text>
                  </g>

                  <text x="62" y="210" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    PILOTAGE DU COUPLE Te
                  </text>
                </g>

                {/* Middle Stage: DC Link & Active Crowbar / Brake Chopper */}
                <g transform="translate(170, 60)">
                  <rect x="0" y="0" width="160" height="220" rx="5" fill="#182234" stroke="#f59e0b" strokeWidth="1.5" />
                  <rect x="0" y="0" width="160" height="22" rx="4" fill="#78350f" />
                  <text x="80" y="15" fill="#fef3c7" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    BUS DC 1150V &amp; CROWBAR ACTIF
                  </text>

                  {/* DC Link Capacitors */}
                  <g transform="translate(15, 32)">
                    <rect x="0" y="0" width="130" height="50" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="65" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BANQUE CAPACITÉS DC LINK</text>
                    <line x1="30" y1="28" x2="60" y2="28" stroke="#0ea5e9" strokeWidth="3" />
                    <line x1="45" y1="20" x2="45" y2="44" stroke="#0ea5e9" strokeWidth="2" />
                    <line x1="75" y1="28" x2="105" y2="28" stroke="#0ea5e9" strokeWidth="3" />
                    <line x1="90" y1="20" x2="90" y2="44" stroke="#0ea5e9" strokeWidth="2" />
                  </g>

                  {/* Active Crowbar Thyristor Stack */}
                  <g transform="translate(15, 92)">
                    <rect x="0" y="0" width="130" height="60" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="65" y="14" fill="#f87171" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CROWBAR THYRISTOR (LVRT)</text>
                    <polygon points="50,24 65,34 50,44" fill="#ef4444" />
                    <line x1="65" y1="24" x2="65" y2="44" stroke="#f87171" strokeWidth="2" />
                    <polygon points="80,44 65,34 80,24" fill="#f59e0b" />
                    <line x1="65" y1="24" x2="65" y2="44" stroke="#f59e0b" strokeWidth="2" />
                    <text x="65" y="54" fill="#fca5a5" fontSize="6" fontFamily="monospace" textAnchor="middle">Court-circuit rotor &lt; 5 &mu;s</text>
                  </g>

                  {/* Braking Chopper Resistor */}
                  <g transform="translate(15, 160)">
                    <rect x="0" y="0" width="130" height="48" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="65" y="14" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HACHEUR DE FREINAGE</text>
                    <path d="M 25 30 L 35 24 L 45 36 L 55 24 L 65 36 L 75 24 L 85 36 L 95 24 L 105 30" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <text x="65" y="44" fill="#fed7aa" fontSize="6" fontFamily="monospace" textAnchor="middle">Dissipation surtensions DC</text>
                  </g>
                </g>

                {/* Stage 3: Grid Side Converter (GSC) & AC Filter */}
                <g transform="translate(345, 60)">
                  <rect x="0" y="0" width="125" height="220" rx="5" fill="#182234" stroke="#10b981" strokeWidth="1.5" />
                  <rect x="0" y="0" width="125" height="22" rx="4" fill="#065f46" />
                  <text x="62" y="15" fill="#d1fae5" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    GSC (CÔTÉ RÉSEAU 50 Hz)
                  </text>

                  {/* 4-Quadrant IGBT Inverter Bridge */}
                  <g transform="translate(12, 35)">
                    <rect x="0" y="0" width="100" height="75" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="50" y="14" fill="#34d399" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      PONT IGBT 4-QUADRANTS
                    </text>
                    <rect x="10" y="24" width="22" height="26" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="21" y="40" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">L1</text>
                    <rect x="39" y="24" width="22" height="26" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="50" y="40" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">L2</text>
                    <rect x="68" y="24" width="22" height="26" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="79" y="40" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">L3</text>

                    <text x="50" y="65" fill="#6ee7b7" fontSize="6" fontFamily="monospace" textAnchor="middle">Régulation Vdc = 1150V</text>
                  </g>

                  {/* LCL Filter Choke & AC Contactor */}
                  <g transform="translate(12, 120)">
                    <rect x="0" y="0" width="100" height="85" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="50" y="14" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">FILTRE &amp; DISJONCTEUR</text>
                    <path d="M 20 32 Q 35 20 50 32 T 80 32" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <rect x="20" y="45" width="60" height="24" rx="2" fill="#334155" stroke="#22c55e" strokeWidth="1" />
                    <text x="50" y="60" fill="#86efac" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DISJ 690V 50Hz</text>
                  </g>

                  <text x="62" y="215" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    &rarr; TRANSFO TOUR 33kV
                  </text>
                </g>

                {/* Bottom Master Controller & Drivetrain Damping FPGA Rack */}
                <g transform="translate(30, 295)">
                  <rect x="0" y="0" width="440" height="75" rx="6" fill="#111827" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="0" y="0" width="440" height="20" rx="4" fill="#0c4a6e" />
                  <text x="15" y="14" fill="#e0f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    AUTOMATE ÉOLIEN RAPIDE &bull; AMORTISSEMENT TORSION TOUR &amp; CONTRÔLE VECTORIEL FOC
                  </text>
                  <text x="425" y="14" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="end">
                    BOUCLE 10 kHz
                  </text>

                  {/* Controller Functional Blocks */}
                  <g transform="translate(15, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="47" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">FOC MACHINE (RSC)</text>
                    <text x="47" y="27" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">Iqr: Couple / Idr: Flux</text>
                  </g>

                  <g transform="translate(120, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="47" y="14" fill="#34d399" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VOC RÉSEAU (GSC)</text>
                    <text x="47" y="27" fill="#a7f3d0" fontSize="6" fontFamily="monospace" textAnchor="middle">Idg: P(Vdc) / Iqg: Q(U)</text>
                  </g>

                  <g transform="translate(225, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <text x="47" y="14" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AMORTISSEUR TOUR</text>
                    <text x="47" y="27" fill="#fed7aa" fontSize="6" fontFamily="monospace" textAnchor="middle">Atténuation résonance &omega;0</text>
                  </g>

                  <g transform="translate(330, 28)">
                    <rect x="0" y="0" width="95" height="36" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                    <text x="47" y="14" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">INERTIE SYNTHÉTIQUE</text>
                    <text x="47" y="27" fill="#e9d5ff" fontSize="6" fontFamily="monospace" textAnchor="middle">&Delta;P = -2H &middot; df/dt</text>
                  </g>
                </g>
              </svg>
            )}

            {/* Fallback for other apparatus types */}
            {!['sf6_breaker', 'power_transformer', 'vacuum_breaker', 'rmu_cable_compartment', 'lightning_faraday_cage', 'xlpe_transition_station', 'gas_turbine_skid', 'lv_abc_service_box', 'solar_inverter_topology', 'wind_dfig_pmsg_converter'].includes(schematicType) && (
              <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Generic High-Precision Apparatus Layout */}
                <rect x="120" y="60" width="260" height="280" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="250" cy="150" r="50" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                <rect x="235" y="135" width="30" height="30" fill="#0284c7" rx="4" />
                <text x="250" y="240" fill="#f8fafc" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  {equipment.entity_type}
                </text>
                <text x="250" y="260" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  SCHEMA CAO NORMATIF IEC
                </text>
                <line x1="200" y1="285" x2="300" y2="285" stroke="#334155" strokeWidth="2" />
              </svg>
            )}

            {/* Interactive Hotspot Pins Overlay (in cutaway mode) */}
            {activeMode === 'cutaway' && activeHotspots.map((h) => {
              const isSelected = selectedHotspotId === h.id || (!selectedHotspotId && h.id === activeHotspots[0].id);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHotspotId(h.id)}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  aria-label={locale === 'fr' ? h.title_fr : h.title_en}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full transition-all cursor-pointer group ${
                    isSelected
                      ? 'w-7 h-7 bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 font-black scale-110 shadow-lg'
                      : 'w-6 h-6 bg-slate-900/90 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border-2 border-cyan-400/80 font-bold hover:scale-105'
                  }`}
                >
                  <span className="text-[11px] font-mono">{h.tag}</span>
                  
                  {/* Tooltip on Hover */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap border border-slate-700 shadow-xl pointer-events-none">
                    <span className="text-amber-400 font-bold">{h.tag}.</span>
                    <span>{locale === 'fr' ? h.title_fr : h.title_en}</span>
                  </span>
                </button>
              );
            })}

          </div>

          {/* Bottom Hotspots Quick Selector Ribbon */}
          {activeMode === 'cutaway' && (
            <div className="w-full mt-4 pt-3 border-t border-[#1C2534] flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 font-bold mr-1">
                {locale === 'fr' ? 'ORGANES REPÉRÉS :' : 'HOTSPOT INDEX:'}
              </span>
              {activeHotspots.map((h) => {
                const isSelected = selectedHotspotId === h.id || (!selectedHotspotId && h.id === activeHotspots[0].id);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHotspotId(h.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-[#0E1522] text-slate-400 hover:text-white border-[#222E42]'
                    }`}
                  >
                    <span>{h.tag} · {locale === 'fr' ? h.title_fr : h.title_en}</span>
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* Right (4 cols): Detailed Sub-Assembly Technical Inspector Panel */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-[#0B0F18] flex flex-col justify-between">
          
          {activeMode === 'cutaway' && selectedHotspot ? (
            <div className="space-y-4">
              
              {/* Hotspot Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black">
                    ORGAN #{selectedHotspot.tag}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {selectedHotspot.standard_ref}
                  </span>
                </div>
                
                <h3 className="text-base font-bold font-mono text-white leading-tight">
                  {locale === 'fr' ? selectedHotspot.title_fr : selectedHotspot.title_en}
                </h3>
              </div>

              {/* Functional Role */}
              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] text-xs font-sans leading-relaxed text-slate-300">
                <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Info className="h-3 w-3 text-cyan-400" />
                  <span>{locale === 'fr' ? 'RÔLE PHYSIQUE DANS L’APPAREIL' : 'PHYSICAL APPARATUS ROLE'}</span>
                </div>
                <p>{locale === 'fr' ? selectedHotspot.role_fr : selectedHotspot.role_en}</p>
              </div>

              {/* Material Specifications */}
              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] text-xs font-sans">
                <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>{locale === 'fr' ? 'MATÉRIAU & TECHNOLOGIE' : 'MATERIAL & TECHNOLOGY'}</span>
                </div>
                <p className="text-slate-200 font-medium">
                  {locale === 'fr' ? selectedHotspot.material_fr : selectedHotspot.material_en}
                </p>
              </div>

              {/* Inspection Criteria */}
              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] text-xs font-sans">
                <div className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{locale === 'fr' ? 'CRITÈRES D’INSPECTION ET ESSAIS' : 'INSPECTION & TESTING PROTOCOL'}</span>
                </div>
                <p className="text-slate-300">
                  {locale === 'fr' ? selectedHotspot.inspection_fr : selectedHotspot.inspection_en}
                </p>
              </div>

              {/* Link to standard */}
              {onNavigateStandard && (
                <button
                  type="button"
                  onClick={() => onNavigateStandard(selectedHotspot.standard_ref)}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-between transition-colors"
                >
                  <span>{locale === 'fr' ? 'Consulter la norme' : 'View Standard'} {selectedHotspot.standard_ref}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}

            </div>
          ) : activeMode === 'kinematics' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Activity className="h-4 w-4" />
                </span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'PHYSIQUE DE COUPURE & FLUIDES' : 'QUENCHING DYNAMICS & FLUIDS'}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] space-y-2 text-xs font-mono">
                <div className="text-slate-400 font-bold">{locale === 'fr' ? 'Énergie dissipée :' : 'Dissipated Arc Energy:'}</div>
                <div className="text-sm font-extrabold text-amber-400">E = ∫ u(t) · i(t) dt ≈ 450 kJ</div>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  {locale === 'fr' 
                    ? 'Le soufflage vigoureux de SF6 ou le confinement sous vide permet de refroidir le plasma en moins de 10 microsecondes avant la tension de rétablissement (TTR).'
                    : 'Intense gas blasting or vacuum envelope suppresses the thermal plasma channel within 10 µs prior to transient recovery voltage (TRV).'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{locale === 'fr' ? 'Rigidité diélectrique :' : 'Dielectric Withstand:'}</span>
                  <span className="font-bold text-emerald-400">89 kV/cm (SF6 @ 0.6 MPa)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{locale === 'fr' ? 'Pente TTR max supportée :' : 'Max TRV Rate-of-Rise:'}</span>
                  <span className="font-bold text-cyan-400">2.0 kV/µs (IEC 62271-100)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{locale === 'fr' ? 'Temps d’arc propre :' : 'Arcing Duration:'}</span>
                  <span className="font-bold text-white">12 ms (0.6 cycle @ 50 Hz)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Zap className="h-4 w-4" />
                </span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'RACCORDEMENTS & BORNES D’ESSAI' : 'TERMINAL CONNECTIONS & TEST PORTS'}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] space-y-2 text-xs font-mono">
                <div className="text-cyan-400 font-bold">1. Bornes Puissance Haute Tension :</div>
                <div className="text-slate-300 text-[11px] font-sans">
                  {locale === 'fr' 
                    ? 'Plages en aluminium ou cuivre argenté 4 trous NEMA pour méplats 100 mm ou raccords expansifs pour faisceau de conducteurs Aster 570.'
                    : 'NEMA 4-hole silver-plated tinned copper pads accommodating 100 mm flat bars or flexible expansion connectors for twin Aster 570 bundles.'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080C14] border border-[#1E2638] space-y-2 text-xs font-mono">
                <div className="text-amber-400 font-bold">2. Contrôle Commande & Déclenchement :</div>
                <div className="text-slate-300 text-[11px] font-sans">
                  {locale === 'fr' 
                    ? 'Borniers débrochables Phoenix Contact avec liaisons pour bobines d’ouverture Y1/Y2 (110 VCC), réarmement ressorts M1, et pressostat SF6.'
                    : 'Phoenix Contact rail terminal blocks for trip coils Y1/Y2 (110 VDC), spring charging motor M1, and 2-stage SF6 pressure switch.'}
                </div>
              </div>
            </div>
          )}

          {/* Quick Verification Footer */}
          <div className="pt-3 border-t border-[#1C2534] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Conforme IEC / IEEE</span>
            </span>
            <span>Échelle CAO 1:12</span>
          </div>

        </div>

      </div>
    </div>
  );
};
