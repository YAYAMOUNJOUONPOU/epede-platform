// src/data/equipmentPhotographicRegistry.ts
// Real-world engineering field photographs, cutaway views, nameplates, and component recognition assets.
// Calibrated for field engineers, commissioning technicians, and substation operators.

import type { PhotographicAsset } from '../types/equipmentExplorer';

export const REPRESENTATIVE_DISCLAIMER = {
  fr: "Photographie représentative d'un équipement industriel de cette classe de tension. La configuration exacte et les raccordements varient selon le constructeur et le projet.",
  en: "Representative photograph of industrial equipment in this voltage class. Exact layout, bus connection, and ancillary cubicles vary by manufacturer and project specification."
};

export const EQUIPMENT_PHOTOGRAPHIC_REGISTRY: Record<string, PhotographicAsset[]> = {
  // 1. Hydroelectric Generator 48 MVA (Songloulou / Nachtigal)
  'eq-exp-hydro-gen-01': [
    {
      id: 'photo-hydro-gen-01-rotor',
      caption: {
        fr: 'Rotor à pôles saillants et bobinage statorique Roebel en cours de lignage dans le puits de turbine',
        en: 'Salient-pole rotor and Roebel-bar stator winding alignment within turbine pit powerhouse'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Hydroelectric Powerhouse Field Commissioning (Songloulou 48 MVA / IEC 60034-1)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      locationContext: {
        fr: 'Centrale Hydroélectrique (Configuration type Francis vertical 48 MVA)',
        en: 'Hydroelectric Powerhouse (Representative Francis vertical turbine pit layout)'
      },
      calloutAnnotations: [
        {
          x: 48,
          y: 42,
          label: { fr: 'Arbre Rotorique Principal', en: 'Main Rotor Shaft' },
          detail: { fr: 'Acier forgé monobloc supportant la roue Francis et la couronne polaire', en: 'Forged alloy steel shaft connecting Francis runner to pole wheel' }
        },
        {
          x: 28,
          y: 65,
          label: { fr: 'Barres Stator Roebel VPI', en: 'VPI Roebel Stator Bars' },
          detail: { fr: 'Isolation classe F/B sous imprégnation sous vide mica-résine 11 kV', en: 'Class F/B resin-rich vacuum pressure impregnated 11 kV insulation' }
        },
        {
          x: 75,
          y: 35,
          label: { fr: 'Bagues d\'Excitation Statique', en: 'Static Excitation Slip Rings' },
          detail: { fr: 'Alimentation du champ inducteur rotorique sous 250 V CC (Pont thyristor)', en: 'Rotor excitation DC field supply (Thyristor bridge feed)' }
        }
      ]
    },
    {
      id: 'photo-hydro-gen-01-nameplate',
      caption: {
        fr: 'Plaque signalétique normalisée CEI 60034 de l\'alternateur synchrone',
        en: 'Synchronous hydrogenerator IEC 60034 standardized nameplate'
      },
      viewType: 'NAMEPLATE',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Manufacturer Nameplate Specification (Alstom / GE Hydro)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      locationContext: {
        fr: 'Châssis statorique niveau plancher machine (Exemple représentatif)',
        en: 'Stator frame generator machine floor (Representative layout)'
      },
      calloutAnnotations: [
        {
          x: 50,
          y: 50,
          label: { fr: '48 000 kVA · 11 kV · cos φ 0.85', en: '48,000 kVA · 11 kV · PF 0.85' },
          detail: { fr: 'Vitesse assignée 150 tr/min (40 pôles, 50 Hz), courant nominal 2 519 A', en: 'Rated speed 150 RPM (40 poles, 50 Hz), rated current 2,519 A' }
        }
      ]
    }
  ],

  // 2. 225 kV Step-Up Power Transformer GSU (Songloulou / Mangombe)
  'eq-exp-gsu-trafo-01': [
    {
      id: 'photo-gsu-trafo-01-field',
      caption: {
        fr: 'Transformateur élévateur 60 MVA 11/225 kV avec traversées RIP et aéroréfrigérants ONAF',
        en: '60 MVA 11/225 kV generator step-up transformer with RIP condenser bushings and ONAF coolers'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Substation EHV Yard (SONATREL / IEC 60076-1)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      locationContext: {
        fr: 'Poste élévateur THT (Installation industrielle représentative classe 225 kV)',
        en: 'EHV Substation Switchyard (Representative 225 kV class installation per IEC 60076)'
      },
      calloutAnnotations: [
        {
          x: 35,
          y: 22,
          label: { fr: 'Traversées 225 kV RIP', en: '225 kV RIP Bushings' },
          detail: { fr: 'Condensateur papier imprégné de résine avec isolateur composite silicone (Ligne de fuite 31 mm/kV)', en: 'Resin-impregnated paper condenser core with silicone sheds (31 mm/kV creepage)' }
        },
        {
          x: 72,
          y: 25,
          label: { fr: 'Conservateur & Relais Buchholz', en: 'Conservator & Buchholz Relay' },
          detail: { fr: 'Vase d\'expansion d\'huile avec membrane caoutchouc et dessiccateur au gel de silice', en: 'Oil expansion tank with rubber bag and silica gel desiccant breather' }
        },
        {
          x: 60,
          y: 65,
          label: { fr: 'Batterie de Radiateurs ONAF', en: 'ONAF Radiator Bank' },
          detail: { fr: 'Circulation naturelle d\'huile avec ventilation forcée à deux étages automatiques', en: 'Natural oil circulation with two-stage automated forced air fans' }
        }
      ]
    },
    {
      id: 'photo-gsu-trafo-01-cutaway',
      caption: {
        fr: 'Vue interne de la partie active : circuit magnétique à grains orientés et enroulements concentriques',
        en: 'Internal active part view: grain-oriented magnetic core and concentric windings'
      },
      viewType: 'INTERNAL_CUTAWAY',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Factory Assembly & Active Part Drying (IEC 60076)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      calloutAnnotations: [
        {
          x: 50,
          y: 40,
          label: { fr: 'Enroulement HT en galettes', en: 'HV Disc Winding' },
          detail: { fr: 'Conducteurs en cuivre émaillé transposé (CTC) avec cales d\'huile axiales', en: 'Continuously transposed conductor (CTC) with axial oil cooling ducts' }
        }
      ]
    }
  ],

  // 3. 225 kV Transmission Lattice Tower
  'eq-exp-tower-225kv': [
    {
      id: 'photo-tower-225kv-field',
      caption: {
        fr: 'Pylône treillis 225 kV double terne avec chaînes d\'isolateurs en verre trempé et câble de garde OPGW',
        en: '225 kV double-circuit lattice transmission tower with toughened glass insulator strings and OPGW shield wire'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'EHV Line Maintenance & Inspection (SONATREL Corridor Mangombé-Oyomabang)',
      locationContext: {
        fr: 'Ligne 225 kV Songloulou - Bekoko (PK 68 en relief accidenté)',
        en: '225 kV Line Songloulou - Bekoko (Chainage KM 68 hilly terrain)'
      },
      calloutAnnotations: [
        {
          x: 50,
          y: 12,
          label: { fr: 'Câble de Garde OPGW (Fibre Optique)', en: 'OPGW Optical Ground Wire' },
          detail: { fr: 'Protection contre la foudre directe et 48 fibres optiques monomodes de téléprotection', en: 'Shielding from direct lightning strikes plus 48 single-mode teleprotection fibers' }
        },
        {
          x: 32,
          y: 45,
          label: { fr: 'Chaînes d\'Isolateurs Verre Capot-Tige', en: 'Cap-and-Pin Glass Insulator Strings' },
          detail: { fr: '16 disques en verre trempé avec anneaux pare-effluves anti-effet couronne', en: '16 toughened glass discs with anti-corona grading rings' }
        },
        {
          x: 70,
          y: 60,
          label: { fr: 'Faisceau Biconducteur Aster 570', en: 'Twin Bundle Conductor Aster 570' },
          detail: { fr: 'Alliage d\'aluminium Almelec avec entretoises-amortisseurs anti-vibrations éoliennes', en: 'AAAC alloy twin bundle with Stockbridge vibration spacers' }
        }
      ]
    },
    {
      id: 'photo-tower-insulator-glass-composite',
      caption: {
        fr: 'Chaînes d\'isolateurs 225 kV : comparaison capot-tige en verre trempé vs isolateur composite polymère silicone avec anneau pare-effluve (corona ring)',
        en: '225 kV insulator strings: toughened glass cap-and-pin discs vs silicone composite long-rod with corona grading ring'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Transmission Line Hardware & Insulators (IEC 60383-1 / IEC 61109)',
      locationContext: {
        fr: 'Poste d\'Oyomabang 225 kV / Tête de ligne Mangombé · Chaînes d\'ancrage et de suspension',
        en: 'Oyomabang 225 kV Substation / Mangombé line landing · Tension and suspension strings'
      },
      calloutAnnotations: [
        {
          x: 28,
          y: 40,
          label: { fr: 'Chaîne Capot-Tige Verre Trempé (16 disques)', en: 'Cap-and-Pin Toughened Glass (16 Discs)' },
          detail: { fr: 'Résistance électromécanique 160 kN, détection visuelle immédiate des éclats de verre sans testeur', en: '160 kN electromechanical rating, immediate visual zero-tester defect detection' }
        },
        {
          x: 65,
          y: 35,
          label: { fr: 'Isolateur Long-Rod Composite Silicone (HTV)', en: 'Silicone Composite Long-Rod (HTV)' },
          detail: { fr: 'Hydrophobicité continue de classe HC1 (CEI 62073), insensibilité aux embruns salins et poussières', en: 'Class HC1 continuous hydrophobicity (IEC 62073), superior pollution resistance' }
        },
        {
          x: 68,
          y: 72,
          label: { fr: 'Anneau Pare-Effluve Toroïdal (Corona Ring)', en: 'Toroidal Corona Grading Ring' },
          detail: { fr: 'Uniformisation du gradient de champ électrique d\'extrémité (réduction du champ de crête < 1.8 kV/mm)', en: 'Electric field gradient linearization suppressing localized air ionization and radio interference' }
        }
      ]
    }
  ],

  // 4. SF6 Live-Tank Circuit Breaker 225 kV
  'eq-exp-gis-bay-225k': [
    {
      id: 'photo-sf6-breaker-yard',
      caption: {
        fr: 'Disjoncteur tripolaire 225 kV 31.5 kA à autosoufflage sous SF6 avec commande oléopneumatique',
        en: '225 kV 31.5 kA three-pole auto-puffer SF6 circuit breaker with electro-hydraulic mechanism'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Substation AIS High-Voltage Yard (IEC 62271-100)',
      locationContext: {
        fr: 'Poste d\'Interconnexion de Bekoko 225/90 kV · Travée Ligne Mangombé',
        en: 'Bekoko 225/90 kV Interconnection Substation · Mangombé Line Bay'
      },
      calloutAnnotations: [
        {
          x: 50,
          y: 28,
          label: { fr: 'Chambre de Coupure Porcelaine/SF6', en: 'Porcelain/SF6 Interrupter Chamber' },
          detail: { fr: 'Autosoufflage thermique combiné avec buse PTFE sous pression SF6 de 6.0 bar', en: 'Thermal auto-expansion combined with PTFE nozzle under 6.0 bar SF6 pressure' }
        },
        {
          x: 50,
          y: 72,
          label: { fr: 'Armoire de Commande & Densimètre SF6', en: 'Operating Mechanism & SF6 Density Monitor' },
          detail: { fr: 'Surveillance de pression compensée en température avec seuils alerte (5.5 bar) et blocage (5.0 bar)', en: 'Temperature-compensated density monitor with alarm (5.5 bar) and trip lockout (5.0 bar)' }
        }
      ]
    },
    {
      id: 'photo-gis-compartment-safety-devices',
      caption: {
        fr: 'Compartimentage blindé GIS SF6 : disque de rupture calibré contre la surpression d\'arc interne et densimètre électronique compensé',
        en: 'Gas-Insulated Substation (GIS) compartment: calibrated overpressure rupture disc and temperature-compensated density monitor'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Gas Insulated Switchgear Compartment Safety (IEC 62271-203)',
      locationContext: {
        fr: 'Poste Blindé 225 kV Bekoko (Compartiment Barres & Disjoncteur PSEM)',
        en: 'Bekoko 225 kV Gas Insulated Substation (Busbar & Circuit Breaker Compartment)'
      },
      calloutAnnotations: [
        {
          x: 35,
          y: 40,
          label: { fr: 'Disque de Rupture Métallique Calibré (0.9 MPa)', en: 'Calibrated Metallic Rupture Disc (0.9 MPa)' },
          detail: { fr: 'Évacuation canalisée des gaz chauds en cas de défaut d\'arc interne sans déchirement de l\'enveloppe aluminium', en: 'Directional venting preventing catastrophic enclosure explosion during internal arcing fault' }
        },
        {
          x: 65,
          y: 50,
          label: { fr: 'Densimètre Électronique SF6 Compensé', en: 'Electronic SF6 Gas Density Transmitter' },
          detail: { fr: 'Mesure de pression compensée en température avec transmetteur 4-20 mA et contacts doubles seuils alarme/déclenchement', en: 'Temperature-compensated pressure sensing with 4-20 mA transmitter and alarm/lockout dry contacts' }
        },
        {
          x: 50,
          y: 80,
          label: { fr: 'Barrière Isolante Conique en Résine Époxy', en: 'Conical Epoxy Resin Barrier Insulator' },
          detail: { fr: 'Maintient le conducteur central sous 225 kV tout en assurant l\'étanchéité absolue entre compartiments étanches autonomes', en: 'Supports central 225 kV conductor and forms gas-tight segregation between independent GIS gas compartments' }
        }
      ]
    }
  ],

  // 5. 30 kV Ring Main Unit (RMU) Modular Switchgear
  'eq-exp-cell-mv-30k': [
    {
      id: 'photo-rmu-cell-30k-field',
      caption: {
        fr: 'Tableau de distribution HTA 30 kV sous enveloppe métallique étanche au gaz (SF6/Vide)',
        en: '30 kV MV gas-insulated compact ring main unit (RMU) with vacuum circuit breaker'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Medium Voltage Distribution Substation (Eneo / IEC 62271-200)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      locationContext: {
        fr: 'Poste Urbain HTA/BT Kiosque (Installation industrielle représentative)',
        en: 'MV/LV Urban Distribution Kiosk (Representative compact switchgear layout)'
      },
      calloutAnnotations: [
        {
          x: 35,
          y: 35,
          label: { fr: 'Disjoncteur à Ampoules sous Vide 630 A', en: '630 A Vacuum Bottle Circuit Breaker' },
          detail: { fr: 'Coupure sans gaz à effet de serre avec relais autonome auto-alimenté VIP400', en: 'Zero-SF6 vacuum interruption with self-powered VIP400 protection relay' }
        },
        {
          x: 70,
          y: 45,
          label: { fr: 'Indicateurs de Présence Tension (VPIS)', en: 'Voltage Presence Indicating System (VPIS)' },
          detail: { fr: 'Diviseurs capacitifs normalisés CEI 61958 avec voyants LED haute visibilité', en: 'IEC 61958 capacitive dividers with high-visibility LED lamps' }
        },
        {
          x: 50,
          y: 82,
          label: { fr: 'Compartiment Câbles & Prises Embrochables', en: 'Cable Compartment & Separable Connectors' },
          detail: { fr: 'Traversées cône extérieur type C pour câbles unipolaires XLPE 30 kV', en: 'Outer-cone Type C bushings for 30 kV single-core XLPE cables' }
        }
      ]
    }
  ],

  // 6. Low-Voltage Main Switchboard TGBT Form 4b
  'eq-exp-tgbt-main-400v': [
    {
      id: 'photo-tgbt-form4b-field',
      caption: {
        fr: 'Armoire TGBT industrielle 400 V Forme 4b avec disjoncteur ouvert Masterpact 3200 A débrochable',
        en: 'Industrial 400 V main switchboard Form 4b with withdrawable 3200 A air circuit breaker (ACB)'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Industrial Power Distribution (IEC 61439-1/2 Form 4b)',
      locationContext: {
        fr: 'Local Technique TGBT Aciérie Prometal Douala-Bassa',
        en: 'TGBT Electrical Room Prometal Steel Mill Douala-Bassa'
      },
      calloutAnnotations: [
        {
          x: 35,
          y: 30,
          label: { fr: 'Disjoncteur Général Débrochable ACB 3200 A', en: 'Withdrawable Main ACB 3200 A' },
          detail: { fr: 'Déclencheur électronique Micrologic 6.0X avec protection différentielle sélective', en: 'Electronic trip unit with ground-fault and selective short-time protection' }
        },
        {
          x: 75,
          y: 40,
          label: { fr: 'Compartimentage Forme 4b', en: 'Form 4b Internal Segregation' },
          detail: { fr: 'Séparation métallique entre jeux de barres, unités fonctionnelles et bornes de raccordement', en: 'Metal barriers separating busbars, functional units, and outgoing terminals' }
        },
        {
          x: 50,
          y: 75,
          label: { fr: 'Centrale de Mesure & Analyseur d\'Harmoniques', en: 'Power Quality Meter & Waveform Capture' },
          detail: { fr: 'Mesure Classe 0.2S (U, I, P, Q, THDv, THDi, transitoires et creux de tension)', en: 'Class 0.2S revenue metering with transient and sag waveform capture' }
        }
      ]
    }
  ],

  // 7. Industrial Induction Motor 250 kW
  'eq-exp-motor-ind-250kw': [
    {
      id: 'photo-motor-250kw-field',
      caption: {
        fr: 'Moteur asynchrone triphasé à cage d\'écureuil 250 kW IP55 monté sur skid de pompage industriel',
        en: '250 kW IP55 squirrel-cage three-phase induction motor mounted on industrial pump skid'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Heavy Industrial Drive System (IEC 60034-1 / IE3 Premium Efficiency)',
      locationContext: {
        fr: 'Station d\'Exhaure & Eau de Refroidissement Alucam Édéa',
        en: 'Water Pumping & Cooling Station Alucam Édéa'
      },
      calloutAnnotations: [
        {
          x: 45,
          y: 45,
          label: { fr: 'Carcasse en Fonte Nervurée TEFC', en: 'Ribbed Cast-Iron TEFC Frame' },
          detail: { fr: 'Refroidissement par ventilateur externe attelé avec sonde de température PT100', en: 'Totally enclosed fan-cooled frame with embedded PT100 winding sensors' }
        },
        {
          x: 75,
          y: 35,
          label: { fr: 'Boîte à Bornes 6 Bornes (Δ / Y)', en: '6-Terminal Connection Box (Δ / Y)' },
          detail: { fr: 'Raccordement pour démarrage étoile-triangle ou variateur de vitesse VFD', en: 'Arranged for delta running or variable frequency drive decoupling' }
        }
      ]
    }
  ],

  // 8. 225 kV Center-Break Disconnector & Earthing Switch (Q9/Q8)
  'eq-exp-disconnector-225k': [
    {
      id: 'photo-disconnector-225k-open',
      caption: {
        fr: 'Sectionneur à coupure centrale 225 kV en position ouverte créant la distance de sectionnement visible normalisée CEI 62271-102',
        en: '225 kV center-break disconnector in fully open position providing visible dielectric isolating gap per IEC 62271-102'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Substation Switching Yard 225 kV (SONATREL / IEC 62271-102)',
      locationContext: {
        fr: 'Poste d\'Interconnexion 225 kV de Bekoko · Travée Ligne Songloulou 1',
        en: 'Bekoko 225 kV Interconnection Substation · Songloulou Line Bay 1'
      },
      calloutAnnotations: [
        {
          x: 48,
          y: 35,
          label: { fr: 'Couteaux Rotatifs à Contacts en Argent', en: 'Silver-Plated Rotating Contact Arms' },
          detail: { fr: 'Rotation horizontale synchronisée à 90° par biellette d\'accouplement mécanique', en: 'Horizontal 90° synchronized rotation via mechanical linkage rod' }
        },
        {
          x: 25,
          y: 60,
          label: { fr: 'Colonnes Isolantes en Porcelaine / Composite', en: 'Porcelain / Composite Insulator Columns' },
          detail: { fr: 'Ligne de fuite 31 mm/kV adaptée au climat tropical humide de Douala', en: '31 mm/kV creepage distance engineered for heavy tropical pollution' }
        },
        {
          x: 70,
          y: 75,
          label: { fr: 'Couteau de Terre Rapide Q8 Intégré', en: 'Integrated High-Speed Earth Knife Q8' },
          detail: { fr: 'Mise à la terre de sécurité avec verrouillage électromécanique et clé Castell', en: 'Safety earthing switch interlocked mechanically with main blades' }
        }
      ]
    }
  ],

  // 9. 225 kV Zinc Oxide (ZnO) Station-Class Surge Arrester
  'eq-exp-surge-arrester-225k': [
    {
      id: 'photo-arrester-225k-field',
      caption: {
        fr: 'Parafoudre à oxyde de zinc (ZnO) 225 kV sans éclateur avec enveloppe en silicone hydrophobe et compteur de décharges',
        en: '225 kV gapless zinc oxide (ZnO) station surge arrester with hydrophobic silicone housing and discharge counter'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'High Voltage Surge Protection (IEC 60099-4 Class 4 Discharge)',
      licenseStatus: 'UNSPLASH_COMMERCIAL',
      identificationConfidence: 'REPRESENTATIVE_TYPE',
      technicalReviewStatus: 'APPROVED_BY_LEAD_ENGINEER',
      disclaimer: REPRESENTATIVE_DISCLAIMER,
      locationContext: {
        fr: 'Poste d\'interconnexion THT 225 kV (Parafoudre ZnO d\'arrivée de ligne représentatif)',
        en: '225 kV EHV Substation (Representative station-class ZnO surge arrester)'
      },
      calloutAnnotations: [
        {
          x: 50,
          y: 20,
          label: { fr: 'Anneau Égalisateur de Potentiel', en: 'Grading Corona Ring' },
          detail: { fr: 'Uniformisation du champ électrique le long de la colonne varistance sous 225 kV', en: 'Electric field stress distribution along the high-voltage varistor stack' }
        },
        {
          x: 50,
          y: 50,
          label: { fr: 'Empilement Varistances ZnO Non-Linéaires', en: 'Non-Linear Sintered ZnO Blocks' },
          detail: { fr: 'Impédance quasi-infinie sous tension nominale, conduction foudre en sous-microseconde', en: 'High impedance at nominal voltage, sub-microsecond conduction during surges' }
        },
        {
          x: 50,
          y: 85,
          label: { fr: 'Compteur de Décharges & Milliampèremètre', en: 'Discharge Counter & Leakage Meter' },
          detail: { fr: 'Mesure continue du courant de fuite résistif et enregistrement des chocs de foudre', en: 'Continuous monitoring of resistive leakage current and strike logging' }
        }
      ]
    }
  ],

  // 10. Numerical Protection Relay IED IEC 61850 (87T / 21)
  'eq-exp-relay-ied-61850': [
    {
      id: 'photo-ied-relay-panel',
      caption: {
        fr: 'Relais numérique multifonction de protection différentielle transformateur (87T/50/51) communicant sous protocole CEI 61850',
        en: 'Numerical multifunctional transformer differential protection IED (87T/50/51) communicating via IEC 61850 protocol'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Substation Automation System SAS (IEC 61850 Edition 2 / GOOSE & MMS)',
      locationContext: {
        fr: 'Bâtiment de Commande Poste 225/90/30 kV Mangombé · Armoire Tranche Ligne E01',
        en: 'Mangombé 225/90/30 kV Control Building · Line Bay E01 Protection Cubicle'
      },
      calloutAnnotations: [
        {
          x: 40,
          y: 30,
          label: { fr: 'Afficheur Graphique Local IHM & Synoptique', en: 'Local Graphic HMI & Bay Mimic' },
          detail: { fr: 'Visualisation temps réel des courants triphasés, déphasages et alarmes de déclenchement', en: 'Real-time phasor diagram, harmonic restraint, and event recorder display' }
        },
        {
          x: 65,
          y: 65,
          label: { fr: 'Ports Fibre Optique Double Anneau PRP/HSR', en: 'PRP/HSR Redundant Optical Fiber Ports' },
          detail: { fr: 'Émission de trames GOOSE vers les disjoncteurs en moins de 4 ms sans perte de paquet', en: 'Sub-4 ms GOOSE tripping messages over zero-packet-loss redundant Ethernet' }
        },
        {
          x: 30,
          y: 80,
          label: { fr: 'Bornier Débrochable d\'Essais Injection Secondaire', en: 'Secondary Injection Test Switch Block' },
          detail: { fr: 'Court-circuitage automatique des circuits TC avant déconnexion sécurisée', en: 'Automatic CT secondary shorting during protection test set injection' }
        }
      ]
    }
  ],

  // 11. Battery Energy Storage System (BESS) 5 MW / 10 MWh Container (D09 / D10)
  'eq-exp-bess-container-5mw': [
    {
      id: 'photo-bess-container-field',
      caption: {
        fr: 'Système BESS conteneurisé 5 MW / 10 MWh : baies de modules LFP 1500 V avec refroidissement liquide et détection précoce gaz H2/CO',
        en: '5 MW / 10 MWh containerized BESS: 1500 V LFP battery racks with liquid cooling and early pyrolysis gas detection'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Utility Grid-Scale BESS Installation (NFPA 855 / UL 9540A)',
      locationContext: {
        fr: 'Poste Interconnecté de Bekoko 225 kV · Plateforme BESS Stabilisation Fréquence',
        en: 'Bekoko 225 kV Substation · Fast Frequency Response BESS Yard'
      },
      calloutAnnotations: [
        {
          x: 35,
          y: 45,
          label: { fr: 'Racks Batteries LFP 1500 V', en: '1500 V LFP Battery Racks' },
          detail: { fr: 'Modules prismatiques LiFePO4 haute densité avec BMS esclave par étage', en: 'High-density prismatic LiFePO4 modules with slave BMS monitoring per tier' }
        },
        {
          x: 70,
          y: 35,
          label: { fr: 'Collecteur Refroidissement Liquide Glycolé', en: 'Glycol Liquid Cooling Manifold' },
          detail: { fr: 'Maintien de température homogène (23°C ± 2°C) prolongeant la durée de vie', en: 'Uniform thermal regulation loop maintaining 23°C ± 2°C cell temperature' }
        },
        {
          x: 82,
          y: 75,
          label: { fr: 'Diffuseur Extinction Novec 1230 & Évent Anti-Déflagration', en: 'Novec 1230 Fire Nozzle & Deflagration Vent' },
          detail: { fr: 'Extinction automatique rapide dès détection pré-emballement thermique par capteur off-gas', en: 'Instantaneous total flooding agent release upon off-gas sensor triggering' }
        }
      ]
    }
  ],

  // 12. EV Ultra-Fast High Power Charger 350 kW (D10)
  'eq-exp-ev-hpc-350kw': [
    {
      id: 'photo-ev-hpc-field',
      caption: {
        fr: 'Borne de recharge ultra-rapide HPC 350 kW avec câble CCS2 à refroidissement liquide et interface Plug & Charge ISO 15118',
        en: '350 kW High Power Charger (HPC) dispenser with liquid-cooled CCS2 cable and ISO 15118 Plug & Charge PKI'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'High Power E-Mobility Charging Hub (IEC 61851-23 / ISO 15118)',
      locationContext: {
        fr: 'Aire de Service Autoroutière Yaoundé - Douala · Station de Recharge Véhicules Lourds',
        en: 'Yaoundé - Douala Highway Corridor · Commercial Fast Charging Hub'
      },
      calloutAnnotations: [
        {
          x: 45,
          y: 40,
          label: { fr: 'Câble CCS Combo 2 Refroidi 500 A', en: 'Liquid-Cooled 500 A CCS2 Cable' },
          detail: { fr: 'Circulation de diélectrique liquide maintenant la température du câble sous 50°C', en: 'Internal dielectric fluid circulation allowing 500 A continuous DC current' }
        },
        {
          x: 55,
          y: 25,
          label: { fr: 'Écran IHM Tactile & Lecteur RFID/Carte', en: 'Touchscreen HMI & EMV Reader' },
          detail: { fr: 'Affichage courbe de charge kW/tension/SoC et authentification chiffrée OCPP 2.0.1', en: 'Real-time kW power, pack voltage, SoC display, and secure OCPP 2.0.1 telemetry' }
        }
      ]
    }
  ],

  // 13. STATCOM MMC ±50 Mvar Dynamic Voltage Compensator (D11 / D14)
  'eq-exp-statcom-mmc-50mvar': [
    {
      id: 'photo-statcom-valve-hall',
      caption: {
        fr: 'Salle des valves convertisseur STATCOM MMC ±50 Mvar : colonnes de sous-modules IGBT demi-pont refroidis par eau déionisée',
        en: 'STATCOM MMC ±50 Mvar valve hall: water-cooled IGBT half-bridge submodule towers providing dynamic var injection'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'FACTS & Dynamic Voltage Stability Converter Hall (IEEE 2800 / IEC 62751-1)',
      locationContext: {
        fr: 'Poste 225/90 kV de Mangombé · Bâtiment FACTS STATCOM (Compensation Rapide)',
        en: 'Mangombé 225/90 kV Substation · FACTS STATCOM Converter Hall'
      },
      calloutAnnotations: [
        {
          x: 42,
          y: 50,
          label: { fr: 'Sous-Modules MMC Demi-Pont', en: 'MMC Half-Bridge Submodules' },
          detail: { fr: 'Empilement de condensateurs DC et IGBTs à commutation ultra-rapide (< 15 ms)', en: 'Modular IGBT phase stacks generating pure sinusoidal reactive current' }
        },
        {
          x: 75,
          y: 30,
          label: { fr: 'Réactances de Phase de Découplage', en: 'Phase Buffer Reactors' },
          detail: { fr: 'Limitation des courants de circulation inter-bras et raccordement au transfo 225/33 kV', en: 'Suppression of circulating arm currents and grid connection interface' }
        }
      ]
    }
  ],

  // 14. Online Photoacoustic DGA Multi-gas Analyzer (D09 / D12)
  'eq-exp-dga-online-monitor': [
    {
      id: 'photo-dga-monitor-field',
      caption: {
        fr: 'Analyseur DGA photoacoustique en ligne 7 gaz dissous monté directement sur la cuve d\'autotransformateur 225 kV',
        en: 'Online photoacoustic 7-gas DGA diagnostic monitor mounted directly on 225 kV autotransformer tank'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Transformer Asset Health & DGA Condition Monitoring (IEC 60599 / IEEE C57.104)',
      locationContext: {
        fr: 'Poste 225/90/15 kV de Nyom 2 · Cuve Autotransformateur T1 100 MVA',
        en: 'Nyom 2 225/90/15 kV Substation · 100 MVA Autotransformer T1 Tank'
      },
      calloutAnnotations: [
        {
          x: 52,
          y: 40,
          label: { fr: 'Cellule Spectroscopique Photoacoustique (PAS)', en: 'Photoacoustic Spectroscopy (PAS) Cell' },
          detail: { fr: 'Dosage quantitatif sans gaz vecteur des gaz de défaut (C2H2, H2, CH4, CO, CO2)', en: 'High-precision carrier-gas-free measurement of critical diagnostic fault gases' }
        },
        {
          x: 35,
          y: 70,
          label: { fr: 'Vanne d\'Échantillonnage d\'Huile à Membrane PTFE', en: 'PTFE Membrane Oil Circulation Valve' },
          detail: { fr: 'Prélèvement continu en boucle fermée sans perte d\'huile ni entrée d\'air ambiant', en: 'Hermetic closed-loop sampling manifold preventing moisture ingress' }
        }
      ]
    }
  ],

  // 15. Substation Hardened Ethernet Switch IEC 62443-4-2 (D13 / D14)
  'eq-exp-switch-iec62443': [
    {
      id: 'photo-cyber-switch-field',
      caption: {
        fr: 'Commutateur Ethernet durci de poste certifié CEI 62443-4-2 SL2 avec chiffrement matériel MACsec et redondance sans perte PRP/HSR',
        en: 'Substation hardened Ethernet switch certified IEC 62443-4-2 SL2 featuring line-rate MACsec and PRP/HSR zero-loss redundancy'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Critical Infrastructure OT Network Hardening (IEC 61850-3 / IEEE 1613)',
      locationContext: {
        fr: 'Poste Numérique 225 kV de Bekoko · Baie Télécom & Bus de Poste PRP',
        en: 'Bekoko 225 kV Digital Substation · Telecom & Station Bus PRP Rack'
      },
      calloutAnnotations: [
        {
          x: 45,
          y: 50,
          label: { fr: 'Ports SFP Fibre Optique Gigabit Chiffrés MACsec', en: 'MACsec Encrypted Gigabit Optical SFP Ports' },
          detail: { fr: 'Chiffrement matériel AES-256 à vitesse de ligne protégeant les flux GOOSE et Sampled Values', en: 'Hardware line-rate AES-256 encryption securing inter-bay GOOSE and SV streams' }
        },
        {
          x: 80,
          y: 40,
          label: { fr: 'Double Alimentation Redondante 110/220 V CC', en: 'Dual Redundant 110/220 V DC Inputs' },
          detail: { fr: 'Alimentation secourue par banc de batteries de poste sans aucune micro-coupure', en: 'Zero-interruption power supply backed up by station battery bank' }
        }
      ]
    }
  ],

  // 16. Three-Phase Polyphase Smart Meter AMI DLMS/COSEM (D15)
  'eq-exp-ami-smartmeter-3p': [
    {
      id: 'photo-smart-meter-field',
      caption: {
        fr: 'Compteur communicant triphasé classe 0.5S avec modem cellulaire 4G LTE-M / NB-IoT et relais de coupure bistable 100 A',
        en: 'Three-phase Class 0.5S smart energy meter with cellular 4G LTE-M modem and internal 100 A latching disconnect relay'
      },
      viewType: 'FIELD_INSTALLATION',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      creditOrReference: 'Advanced Metering Infrastructure (AMI) & Revenue Protection (IEC 62056 / DLMS COSEM)',
      locationContext: {
        fr: 'Tableau Comptage Industriel Eneo · Poste HTA/BT Client MT Zone Industrielle Bassa',
        en: 'Industrial Revenue Metering Panel · MV/LV Substation Bassa Industrial Zone'
      },
      calloutAnnotations: [
        {
          x: 50,
          y: 35,
          label: { fr: 'Afficheur LCD Métrologique & Port Optique FLAG', en: 'Metrological LCD & FLAG Optical Port' },
          detail: { fr: 'Lecture locale d\'index actif/réactif 4 quadrants et relève de secours infrarouge', en: '4-quadrant active/reactive index display and localized optical probe interface' }
        },
        {
          x: 70,
          y: 70,
          label: { fr: 'Logement Carte eSIM M2M & Antenne LTE-M', en: 'Industrial M2M eSIM & LTE-M Antenna' },
          detail: { fr: 'Télérelève automatique sécurisée HLS 5 vers le système MDM centralisé', en: 'Automated encrypted tele-metering transmissions to central Head-End MDM' }
        }
      ]
    }
  ]
};

/**
 * Helper to retrieve photographic assets for any equipment, checking both canonical ID and legacy ID mappings
 */
export function getPhotographsForEquipment(equipmentId: string): PhotographicAsset[] {
  if (EQUIPMENT_PHOTOGRAPHIC_REGISTRY[equipmentId]) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY[equipmentId];
  }

  // Check prefix or partial matching
  const lower = equipmentId.toLowerCase();
  if (lower.includes('bess') || lower.includes('storage') || lower.includes('battery')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-bess-container-5mw'] || [];
  }
  if (lower.includes('hpc') || lower.includes('charger') || lower.includes('ev-')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-ev-hpc-350kw'] || [];
  }
  if (lower.includes('statcom') || lower.includes('svc') || lower.includes('facts')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-statcom-mmc-50mvar'] || [];
  }
  if (lower.includes('dga') || lower.includes('photoacoustic') || lower.includes('duval') || lower.includes('gas-monitor')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-dga-online-monitor'] || [];
  }
  if (lower.includes('switch-iec') || lower.includes('prp') || lower.includes('hsr') || lower.includes('cyber-switch')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-switch-iec62443'] || [];
  }
  if (lower.includes('meter') || lower.includes('ami') || lower.includes('dlms') || lower.includes('compteur')) {
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-ami-smartmeter-3p'] || [];
  }
  if (lower.includes('hydro') || lower.includes('gen')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-hydro-gen-01'] || [];
  if (lower.includes('gsu') || lower.includes('trafo-hta') || lower.includes('trafo-main')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-gsu-trafo-01'] || [];
  if (lower.includes('tower') || lower.includes('pylone') || lower.includes('line-225')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-tower-225kv'] || [];
  if (lower.includes('disconnector') || lower.includes('sectionneur') || lower.includes('q9') || lower.includes('q8') || lower.includes('q1')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-disconnector-225k'] || [];
  if (lower.includes('arrester') || lower.includes('parafoudre') || lower.includes('surge') || lower.includes('zno')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-surge-arrester-225k'] || [];
  if (lower.includes('relay') || lower.includes('relais') || lower.includes('ied') || lower.includes('61850') || lower.includes('87t') || lower.includes('protection')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-relay-ied-61850'] || [];
  if (lower.includes('breaker') || lower.includes('disjoncteur') || lower.includes('sf6') || lower.includes('gis-bay')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-gis-bay-225k'] || [];
  if (lower.includes('cell') || lower.includes('kiosk') || lower.includes('rmu')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-cell-mv-30k'] || [];
  if (lower.includes('tgbt') || lower.includes('switchboard')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-tgbt-main-400v'] || [];
  if (lower.includes('motor') || lower.includes('moteur')) return EQUIPMENT_PHOTOGRAPHIC_REGISTRY['eq-exp-motor-ind-250kw'] || [];

  return [];
}
