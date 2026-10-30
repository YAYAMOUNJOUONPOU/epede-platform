// src/data/learningPathwaysData.ts
// EPEDE 2.0 - Core Progressive Learning Pathways (01 to 08)
// Bridge from zero knowledge to advanced power systems engineering with visual lessons,
// plain language principles, internal anatomy, IEC symbols, and Cameroon grid context.

import type { UsageLevel } from '../services/UsageLevelContext';
import type { DomainCode } from '../types/epede';

export interface PathwayLessonSection {
  number: number;
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  realWorldAnalogy: { fr: string; en: string };
  physicalPrinciple: { fr: string; en: string };
  keyFormulas?: string[];
  equipmentPhotoUrl?: string;
  equipmentPhotoCaption?: { fr: string; en: string };
  iecSymbolDescription?: { fr: string; en: string };
  cameroonFieldNote?: { fr: string; en: string };
  targetAction?: {
    type: 'EQUIPMENT' | 'CALCULATOR' | 'SIMULATION' | 'GRID' | 'STANDARDS';
    targetId: string;
    label: { fr: string; en: string };
  };
  quiz: {
    question: { fr: string; en: string };
    options: Array<{ fr: string; en: string }>;
    correctAnswerIndex: number;
    explanation: { fr: string; en: string };
  };
}

export interface ProgressivePathway {
  id: string;
  orderNumber: string; // '01', '02', ..., '08'
  title: { fr: string; en: string };
  shortTitle: { fr: string; en: string };
  tagline: { fr: string; en: string };
  description: { fr: string; en: string };
  level: 'beginner' | 'technician' | 'engineer';
  levelBadge: { fr: string; en: string };
  targetProfile: UsageLevel;
  iconName: string;
  accentColor: string;
  estimatedMinutes: number;
  targetDomain: DomainCode;
  heroImageUrl: string;
  learningOutcomes: Array<{ fr: string; en: string }>;
  lessons: PathwayLessonSection[];
}

export const PROGRESSIVE_LEARNING_PATHWAYS: ProgressivePathway[] = [
  // ─────────────────────────────────────────────────────────────
  // PATHWAY 01: Electrical Fundamentals
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-01-fundamentals',
    orderNumber: '01',
    title: {
      fr: 'Fondamentaux de l’Électricité & Phénomènes Physiques',
      en: 'Electrical Fundamentals & Physical Phenomena',
    },
    shortTitle: { fr: '01. Fondamentaux Électriques', en: '01. Electrical Fundamentals' },
    tagline: {
      fr: 'Comprenez physiquement chaque grandeur avant de toucher une formule mathématique.',
      en: 'Understand the physical phenomena behind electricity before touching any formula.',
    },
    description: {
      fr: 'Pour un technicien débutant ou un étudiant : qu’est-ce que la tension, le courant, la résistance, la différence fondamentale entre puissance et énergie, le courant continu et alternatif, et pourquoi le réseau industriel utilise le triphasé 400 V.',
      en: 'For starting electricians and technicians: understand voltage, current, resistance, power vs. energy, AC vs. DC, and why industries rely on three-phase 400 V distribution.',
    },
    level: 'beginner',
    levelBadge: { fr: 'Débutant & Fondations', en: 'Beginner & Foundations' },
    targetProfile: 'DISCOVERY',
    iconName: 'Zap',
    accentColor: '#D7A64A',
    estimatedMinutes: 45,
    targetDomain: 'D01',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Distinguer sans hésitation Tension (Volts), Courant (Ampères) et Résistance (Ohms).',
        en: 'Distinguish without hesitation Voltage (Volts), Current (Amperes), and Resistance (Ohms).',
      },
      {
        fr: 'Comprendre pourquoi 1 kW (puissance instantanée) n’est pas 1 kWh (énergie facturée par Eneo).',
        en: 'Understand why 1 kW (instantaneous power) is fundamentally different from 1 kWh (energy billed by utility).',
      },
      {
        fr: 'Visualiser la rotation du champ magnétique triphasé 400 V par rapport au monophasé 230 V.',
        en: 'Visualize the rotating magnetic field in three-phase 400 V systems compared to single-phase 230 V.',
      },
      {
        fr: 'Comprendre l’origine du facteur de puissance (cos φ) et pourquoi les usines paient des pénalités réactives.',
        en: 'Understand the physical origin of power factor (cos φ) and why industrial plants incur reactive penalties.',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Tension (V) vs Courant (A) : La Métaphore Hydraulique Réelle',
          en: 'Voltage (V) vs Current (A): The Real Hydraulic Analogy',
        },
        summary: {
          fr: 'La tension est la force de poussée électrique (pression de l’eau), le courant est le débit d’électrons qui traverse le câble.',
          en: 'Voltage is electrical push pressure; current is the flow rate of electrons passing through a conductor.',
        },
        realWorldAnalogy: {
          fr: 'Imaginez un château d’eau perché à 30 mètres de hauteur : la hauteur d’eau crée la PRESSION (Tension en Volts). Lorsque vous ouvrez le robinet, l’eau coule : le volume d’eau par seconde est le DÉBIT (Courant en Ampères). Si le robinet est fermé, la pression existe toujours (230 V à la prise), mais aucun courant ne circule (0 A).',
          en: 'Imagine a water tower 30 meters high: the height creates PRESSURE (Voltage in Volts). When you open the valve, water flows: the flow rate per second is CURRENT (Amperes). When the valve is shut, pressure still exists (230 V at the wall outlet), but zero current flows (0 A).',
        },
        physicalPrinciple: {
          fr: 'La tension (U) est une différence de potentiel électrostatique entre deux points mesurée en Volts (V). Le courant (I) est le déplacement ordonné de charges électriques libres (électrons) à travers un matériau conducteur, mesuré en Ampères (1 A = 1 Coulomb par seconde, soit 6.24 x 10^18 électrons par seconde).',
          en: 'Voltage (U) is an electric potential difference between two nodes measured in Volts (V). Current (I) is the organized flow of free electron charges through a conductor, measured in Amperes (1 A = 1 Coulomb per second, representing 6.24 x 10^18 electrons/sec).',
        },
        keyFormulas: [
          'U = R * I (Loi d\'Ohm fondamentale)',
          'I = Q / t (1 Ampère = 1 Coulomb / 1 seconde)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Multimètre numérique mesurant la tension efficace (230 V AC) aux bornes d’un disjoncteur modulaire.',
          en: 'Digital multimeter measuring RMS voltage (230 V AC) across a modular circuit breaker.',
        },
        iecSymbolDescription: {
          fr: 'Symbole normalisé CEI 60617 d’une source de tension (cercle avec deux pôles) et d’un ampèremètre (cercle marqué A) placé en série.',
          en: 'IEC 60617 standardized symbols for a voltage source and series-connected ammeter (circle with A).',
        },
        cameroonFieldNote: {
          fr: 'Au Cameroun, la tension domestique standard est de 230 V monophasé / 400 V triphasé à 50 Hz. Les baisses de tension fréquentes (ex: 180 V au lieu de 230 V) obligent de nombreux ménages et ateliers à installer des régulateurs de tension électromécaniques (AVR servo).',
          en: 'In Cameroon, standard low voltage is 230 V single-phase / 400 V three-phase at 50 Hz. Frequent voltage drops (e.g. 180 V instead of 230 V) lead technicians and workshops to install electro-mechanical servo AVR stabilizers.',
        },
        targetAction: {
          type: 'CALCULATOR',
          targetId: 'voltage-drop',
          label: { fr: 'Calculateur de Chute de Tension en Ligne', en: 'Online Voltage Drop Calculator' },
        },
        quiz: {
          question: {
            fr: 'Si une prise électrique murale est libre (aucun appareil branché), que mesure-t-on entre la Phase et le Neutre ?',
            en: 'If a wall socket has no appliance plugged in, what do you measure between Phase and Neutral?',
          },
          options: [
            { fr: 'Une tension de 230 V et un courant de 0 A', en: 'A voltage of 230 V and a current of 0 A' },
            { fr: 'Une tension de 0 V et un courant de 16 A', en: 'A voltage of 0 V and a current of 16 A' },
            { fr: '0 V et 0 A', en: '0 V and 0 A' },
            { fr: '230 V et 230 A', en: '230 V and 230 A' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! La tension (pression électrique) est toujours présente à la prise même sans consommation. Le courant ne circule que lorsqu\'un appareil ferme le circuit.',
            en: 'Correct! Voltage (electrical push) is permanently present at the socket. Current only flows when an appliance completes the closed circuit.',
          },
        },
      },
      {
        number: 2,
        title: {
          fr: 'Puissance (kW) vs Énergie (kWh) : Ne Plus Jamais les Confondre',
          en: 'Power (kW) vs Energy (kWh): Never Confuse Them Again',
        },
        summary: {
          fr: 'La puissance est la vitesse à laquelle l’énergie est consommée ou produite à un instant précis. L’énergie est le cumul de cette puissance dans le temps.',
          en: 'Power is the instant rate at which energy is delivered. Energy is that power accumulated over time.',
        },
        realWorldAnalogy: {
          fr: 'Faites l’analogie avec une voiture : la PUISSANCE correspond à la VITESSE au compteur (ex: 100 km/h à un instant t). L’ÉNERGIE correspond à la DISTANCE parcourue (ex: 100 km parcourus en 1 heure). Vous payez le carburant pour les kilomètres parcourus, pas seulement pour la vitesse maximale du véhicule.',
          en: 'Think of a car: POWER is the speed on your speedometer (e.g., 100 km/h right now). ENERGY is the total distance traveled on your odometer (100 km in 1 hour). You pay fuel for the distance traveled, not merely the peak speedometer capability.',
        },
        physicalPrinciple: {
          fr: 'La puissance active P (mesurée en Watts ou kiloWatts) est le produit P = U * I * cos φ en régime sinusoïdal. L’énergie électrique E (mesurée en Joules ou kiloWatt-heures, kWh) est l’intégrale temporelle de la puissance : E = P * temps. 1 kWh = 1 000 Watts fonctionnant pendant 1 heure = 3,600,000 Joules.',
          en: 'Active power P (Watts or kW) equals P = U * I * cos φ in AC circuits. Electrical energy E (Joules or kWh) is the time integral: E = P * time. 1 kWh = 1,000 W operated continuously for 1 hour = 3.6 MJ.',
        },
        keyFormulas: [
          'P = U * I * cos φ (Puissance active monophasée, en W)',
          'P_3ph = sqrt(3) * U * I * cos φ (Puissance active triphasée, en W)',
          'E = P * t (Énergie active consommée, en kWh)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Compteur électrique communicant Eneo mesurant à la fois la puissance instantanée (kW) et l’index cumulé d’énergie (kWh).',
          en: 'Smart utility energy meter displaying instantaneous active power demand (kW) and cumulative energy index (kWh).',
        },
        cameroonFieldNote: {
          fr: 'Sur une facture Eneo au Cameroun, la puissance souscrite (ex: 3 kW ou 6 kW en monophasé, 18 kVA en triphasé) détermine le calibre du disjoncteur de branchement d’abonné. L’énergie consommée (kWh) correspond aux unités prépayées achetées ou à la relève mensuelle.',
          en: 'On utility bills in Cameroon, subscribed power demand dictates the service main circuit breaker rating. Cumulative energy (kWh) is what prepaid tokens purchase or post-paid meters record.',
        },
        targetAction: {
          type: 'CALCULATOR',
          targetId: 'power-factor',
          label: { fr: 'Calculateur Triangle des Puissances (P, Q, S)', en: 'Power Triangle Calculator (P, Q, S)' },
        },
        quiz: {
          question: {
            fr: 'Si un climatiseur de 2 000 Watts (2 kW) fonctionne pendant 5 heures consécutives, quelle quantité d’énergie électrique a-t-il consommée ?',
            en: 'If a 2,000 Watt (2 kW) air conditioner runs continuously for 5 hours, how much electrical energy does it consume?',
          },
          options: [
            { fr: '10 kWh', en: '10 kWh' },
            { fr: '2 kWh', en: '2 kWh' },
            { fr: '7 kW', en: '7 kW' },
            { fr: '0.4 kWh', en: '0.4 kWh' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Calcul : Énergie = Puissance x Temps = 2 kW x 5 h = 10 kWh. Cette quantité sera déduite de votre compteur.',
            en: 'Calculation: Energy = Power x Time = 2 kW x 5 h = 10 kWh.',
          },
        },
      },
      {
        number: 3,
        title: {
          fr: 'Courant Continu (DC) vs Alternatif (AC 50 Hz)',
          en: 'Direct Current (DC) vs Alternating Current (AC 50 Hz)',
        },
        summary: {
          fr: 'En continu (DC), les électrons avancent toujours dans le même sens. En alternatif (AC), ils oscillent d’avant en arrière 50 fois par seconde (50 Hz).',
          en: 'In DC, electrons flow in one constant direction. In AC, electrons oscillate back and forth 50 times per second (50 Hz).',
        },
        realWorldAnalogy: {
          fr: 'Pensez à une scie : le courant continu ressemble à une meuleuse rotative (rotation continue dans un seul sens). Le courant alternatif ressemble à une scie à main ou un coupe-bois alternatif (mouvement de va-et-vient qui coupe le bois aussi efficacement, sans que la lame ne doive faire le tour complet).',
          en: 'Think of cutting tools: DC is like a circular grinding wheel spinning unidirectionally. AC is like a handsaw moving back and forth: it cuts wood just as effectively through oscillation without needing full circular travel.',
        },
        physicalPrinciple: {
          fr: 'Le courant continu (DC) est fourni par les batteries, panneaux photovoltaïques et alimentations stabilisées. Le courant alternatif sinusoïdal (AC) est produit naturellement par les alternateurs des centrales électriques. Sa fréquence de 50 Hz signifie que la tension change de polarité 100 fois par seconde (deux passages par zéro par période de 20 ms).',
          en: 'DC is produced by chemical batteries, solar PV cells, and DC rectifiers. Sinusoidal AC is generated by synchronous rotating alternators. At 50 Hz, voltage alternates polarity 100 times per second (two zero-crossings every 20 ms cycle).',
        },
        keyFormulas: [
          'T = 1 / f = 1 / 50 Hz = 0.02 s = 20 ms (Période d\'un cycle 50 Hz)',
          'U_max = U_efficace * sqrt(2) ≈ 230 V * 1.414 = 325 V crête',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Oscilloscope affichant la sinusoïde pure 50 Hz (20 ms de période) du réseau électrique interconnecté.',
          en: 'Oscilloscope displaying the pure 50 Hz sinusoidal waveform (20 ms period) from the grid.',
        },
        cameroonFieldNote: {
          fr: 'Tous les réseaux électriques nationaux d’Afrique centrale et de la CEMAC fonctionnent à 50 Hz. Une chute de fréquence en dessous de 49.0 Hz déclenche automatiquement le délestage d’urgence par les relais à manque de fréquence UFLS (délestage automatique SONATREL).',
          en: 'All national grids in Central Africa operate at 50 Hz. A frequency dip below 49.0 Hz triggers emergency Under-Frequency Load Shedding (UFLS) relays to prevent complete grid collapse.',
        },
        targetAction: {
          type: 'SIMULATION',
          targetId: 'ac-waveform-lab',
          label: { fr: 'Laboratoire de Simulation Sinusoïde 50 Hz', en: '50 Hz Sinusoidal Waveform Simulation Lab' },
        },
        quiz: {
          question: {
            fr: 'Pourquoi les réseaux électriques nationaux transportent-ils l’électricité en alternatif (AC) plutôt qu’en continu (DC) classique ?',
            en: 'Why do national transmission grids transmit power primarily in alternating current (AC)?',
          },
          options: [
            { fr: 'Parce que les transformateurs permettent d’élever facilement la tension en AC pour réduire les pertes Joule', en: 'Because transformers easily step up AC voltage to drastically cut transmission line losses' },
            { fr: 'Parce que le courant alternatif ne présente aucun danger mortel', en: 'Because AC current is completely safe to touch' },
            { fr: 'Parce que les câbles en aluminium ne conduisent pas le courant continu', en: 'Because aluminum conductors cannot conduct DC' },
            { fr: 'Parce que le courant continu ne peut pas alimenter de lampes', en: 'Because DC cannot power electric light bulbs' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exactement ! Le transformateur fonctionne par induction magnétique (qui exige un flux variable, donc alternatif). Élever la tension à 225 000 V divise le courant par plusieurs centaines et réduit les pertes de plus de 400 fois.',
            en: 'Correct! Transformers require alternating magnetic flux. Stepping up to 225 kV reduces transmission current drastically and cuts ohmic losses hundreds of times.',
          },
        },
      },
      {
        number: 4,
        title: {
          fr: 'Monophasé (230 V) vs Triphasé (400 V) : Pourquoi 3 Phases ?',
          en: 'Single-Phase (230 V) vs Three-Phase (400 V): Why 3 Phases?',
        },
        summary: {
          fr: 'Le monophasé utilise 1 phase et 1 neutre pour les appareils domestiques (230 V). Le triphasé utilise 3 phases décalées de 120° (400 V entre phases) créant un champ tournant parfait pour les moteurs.',
          en: 'Single-phase uses 1 phase and 1 neutral for homes (230 V). Three-phase uses 3 phases spaced 120° apart (400 V phase-to-phase), creating a rotating magnetic field ideal for industrial motors.',
        },
        realWorldAnalogy: {
          fr: 'Pédaler sur un vélo : un système monophasé ressemble à un cycliste n’ayant qu’une seule pédale (il ne pousse que la moitié du temps, avec des à-coups). Le triphasé ressemble à un pédalier à trois manivelles calées à 120° : la poussée est continue, constante et parfaitement fluide sans jamais caler.',
          en: 'Pedaling a bicycle: single-phase is like pedaling with one leg (pulsating thrust with dead zones). Three-phase is like a crankshaft with three pistons spaced at 120°: smooth, constant torque with zero dead centers.',
        },
        physicalPrinciple: {
          fr: 'Dans un système triphasé équilibré, la tension simple entre chaque phase et le neutre est V = 230 V. La tension composée entre deux phases quelconques est U = V * sqrt(3) ≈ 230 * 1.732 = 400 V. La somme des courants des trois phases dans le conducteur neutre est rigoureusement nulle si les charges sont équilibrées.',
          en: 'In a balanced three-phase system, line-to-neutral voltage is V = 230 V. Line-to-line voltage is U = V * sqrt(3) ≈ 400 V. In a balanced load condition, vector sum of three phase currents in the neutral conductor is zero.',
        },
        keyFormulas: [
          'U = V * sqrt(3) ≈ 230 V * 1.732 = 400 V',
          'I_neutre = I_L1 + I_L2 + I_L3 = 0 A (à l\'équilibre parfait)',
          'P_tri = sqrt(3) * U * I * cos φ',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Jeu de barres triphasé en cuivre (L1 Marron, L2 Noir, L3 Gris, N Bleu clair, PE Vert/Jaune) dans un TGBT industriel.',
          en: 'Three-phase copper busbar assembly (L1 Brown, L2 Black, L3 Grey, N Light Blue, PE Green/Yellow) in an industrial switchboard.',
        },
        cameroonFieldNote: {
          fr: 'Toute scierie, brasserie ou cimenterie au Cameroun est raccordée en triphasé 400 V (ou HTA 15/30 kV dédié). Pour un électricien d’atelier, inverser deux phases quelconques (L1 et L2) inverse instantanément le sens de rotation d’un moteur triphasé.',
          en: 'Every sawmill, brewery, and cement plant in Cameroon is fed by 400 V three-phase (or dedicated 15/30 kV MV). For a field electrician, swapping any two phases (L1 and L2) reverses motor rotation direction.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'tgbt-form4b-field',
          label: { fr: 'Inspecter les Barres Cuivre d\'un TGBT Triphasé', en: 'Inspect Three-Phase Copper Busbars in TGBT' },
        },
        quiz: {
          question: {
            fr: 'Si vous disposez d’une alimentation triphasée 400 V, quelle tension mesurez-vous entre l’une des phases (L1) et le neutre (N) ?',
            en: 'On a standard 400 V three-phase supply, what voltage do you measure between any phase (L1) and neutral (N)?',
          },
          options: [
            { fr: '230 V', en: '230 V' },
            { fr: '400 V', en: '400 V' },
            { fr: '690 V', en: '690 V' },
            { fr: '0 V', en: '0 V' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'En triphasé BT standard, la tension simple (Phase-Neutre) est de 400 V / sqrt(3) = 230 V. La tension composée (Phase-Phase) est de 400 V.',
            en: 'In low-voltage distribution, line-to-neutral voltage equals 400 V / sqrt(3) = 230 V.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 02: Electrical Components and Equipment
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-02-components',
    orderNumber: '02',
    title: {
      fr: 'Composants & Équipements Électriques en Pratique',
      en: 'Electrical Components & Equipment in Practice',
    },
    shortTitle: { fr: '02. Équipements Électriques', en: '02. Electrical Equipment' },
    tagline: {
      fr: 'Ouvrez les armoires et découvrez l’anatomie interne de chaque appareil réel.',
      en: 'Open the cabinets and discover the internal anatomy of real electrical hardware.',
    },
    description: {
      fr: 'Passez de la théorie aux objets réels : disjoncteurs, contacteurs, relais thermiques, transformateurs, moteurs et sectionneurs. Observez leur photo, leur coupe interne, leur symbole CEI 60617 et leur rôle sur le terrain.',
      en: 'Bridge theory and real physical apparatuses: circuit breakers, contactors, overload relays, transformers, motors, and disconnectors. Inspect cutaways, IEC symbols, and terminal markings.',
    },
    level: 'beginner',
    levelBadge: { fr: 'Matériel Clé', en: 'Core Equipment' },
    targetProfile: 'DISCOVERY',
    iconName: 'Cpu',
    accentColor: '#567A87',
    estimatedMinutes: 50,
    targetDomain: 'D04',
    heroImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Distinguer le rôle d’un sectionneur (visibilité hors charge), d’un interrupteur et d’un disjoncteur (coupure en court-circuit).',
        en: 'Distinguish an off-load disconnector, an on-load switch, and a short-circuit interrupting breaker.',
      },
      {
        fr: 'Comprendre l’anatomie d’une chambre de coupure et comment l’arc électrique est soufflé.',
        en: 'Understand arc chute anatomy and how intense electrical arcs are safely quenched.',
      },
      {
        fr: 'Maîtriser le fonctionnement combiné du contacteur (commande) et du relais thermique (protection surcharge).',
        en: 'Master the coordinated operation of a contactor (control) and thermal overload relay (protection).',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Le Disjoncteur Basse Tension : Déclencheur Magnétique & Thermique',
          en: 'Low Voltage Circuit Breaker: Magnetic & Thermal Release Units',
        },
        summary: {
          fr: 'Un disjoncteur protège les câbles contre deux dangers : les surcharges prolongées (effet bilame thermique) et les courts-circuits brutaux (bobine magnétique instantanée).',
          en: 'A circuit breaker protects cables from two hazards: sustained overloads (bimetal thermal strip) and violent short-circuits (instantaneous magnetic coil).',
        },
        realWorldAnalogy: {
          fr: 'Le disjoncteur est un garde du corps automatique à deux réflexes : si la chaleur monte lentement (trop d’appareils allumés), il attend quelques secondes pour être sûr puis coupe doucement (thermique). Si deux câbles nus se touchent (court-circuit massif), il réagit en quelques millisecondes comme un réflexe oculaire (magnétique).',
          en: 'A circuit breaker is an automatic protector with two reflexes: if heat builds up slowly (too many loads), it waits seconds before tripping (thermal). If bare wires touch (short-circuit), it reacts in milliseconds like an involuntary blink (magnetic).',
        },
        physicalPrinciple: {
          fr: '1. Déclencheur thermique : une bilame constituée de deux métaux à coefficients de dilatation différents se déforme sous l’effet Joule (I²t) et libère le verrou mécanique. 2. Déclencheur magnétique : un solénoïde attire instantanément un plongeur en fer dès que le courant dépasse le seuil de court-circuit (ex: 5 à 10 fois In). 3. Chambre d\'extinction d\'arc : des ailettes de désionisation découpent et refroidissent l\'arc électrique lors de la séparation des contacts.',
          en: '1. Thermal trip: a bimetallic strip made of two bonded metals with differing thermal expansion rates bends under Joule heating (I²t) to trip the latch. 2. Magnetic trip: a solenoid pulls an armature instantly when current spikes above short-circuit thresholds (e.g., 5 to 10 x In). 3. Arc chutes: de-ionizing metallic splitter plates chop and cool the arc during contact separation.',
        },
        keyFormulas: [
          'Effet Joule = R * I^2 * t (Énergie thermique dégagée)',
          'Icu / Ics : Pouvoir de coupure ultime et de service (ex: 10 kA, 50 kA)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Disjoncteur boîtier moulé (MCCB) avec chambre d’extinction d’arc ouverte montrant les séparateurs en acier.',
          en: 'Molded Case Circuit Breaker (MCCB) cutaway showing arc chute deion plates and magnetic trip coil.',
        },
        iecSymbolDescription: {
          fr: 'Symbole CEI 60617 : contact de puissance avec un rectangle surmonté d’une croix (fonction disjoncteur) et les deux déclencheurs (carré thermique + demi-cercle magnétique).',
          en: 'IEC 60617 symbol: main power contact with breaker tick mark, square thermal release, and magnetic release flag.',
        },
        cameroonFieldNote: {
          fr: 'Dans les installations au Cameroun, de nombreux incendies d’origine électrique proviennent de disjoncteurs sous-calibrés ou de mauvaise contrefaçon où le pouvoir de coupure est insuffisant (ex: 3 kA au lieu de 6 kA ou 10 kA exigés près du transformateur).',
          en: 'In Cameroon installations, many electrical fires originate from counterfeit or undersized breakers where breaking capacity is insufficient to interrupt substation fault levels.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'disjoncteur-htb-sf6',
          label: { fr: 'Consulter la Fiche Disjoncteur Électrique', en: 'Open Circuit Breaker Equipment File' },
        },
        quiz: {
          question: {
            fr: 'Quel composant interne d’un disjoncteur magnétothermique coupe le circuit en cas de court-circuit franc en quelques millisecondes ?',
            en: 'Which internal component inside a circuit breaker trips the circuit in milliseconds during a dead short-circuit?',
          },
          options: [
            { fr: 'Le déclencheur électromagnétique (bobine)', en: 'The electromagnetic release (solenoid coil)' },
            { fr: 'Le bilame thermique', en: 'The thermal bimetal strip' },
            { fr: 'Le transformateur de tension', en: 'The voltage transformer' },
            { fr: 'Le radiateur de refroidissement', en: 'The cooling fin radiator' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'La bobine magnétique crée un champ électromagnétique instantané proportionnel au courant de court-circuit qui percute mécaniquement la gâchette en moins de 10 à 20 ms.',
            en: 'The magnetic coil creates an instantaneous electromagnetic field proportional to fault current, driving the release striker in less than 20 ms.',
          },
        },
      },
      {
        number: 2,
        title: {
          fr: 'Contacteur Électrique & Relais Thermique de Surcharge',
          en: 'Electrical Contactor & Thermal Overload Relay',
        },
        summary: {
          fr: 'Le contacteur permet d’enclencher et d’arrêter un moteur à distance avec un petit signal de commande 24 V. Le relais thermique protège le moteur contre l’échauffement.',
          en: 'The contactor switches high motor power on and off via a low-voltage 24 V control signal. The overload relay prevents motor stator burning.',
        },
        realWorldAnalogy: {
          fr: 'Le contacteur est comme un interrupteur actionné par un muscle électrique (électro-aimant) : appuyer sur un bouton poussoir vert envoie un courant minuscule dans la bobine A1-A2, qui attire le noyau de fer et ferme d’un coup les 3 gros contacts de puissance alimentant le moteur.',
          en: 'The contactor is like a muscle-operated switch: pressing a start pushbutton energizes coil A1-A2, generating a magnetic field that slams closed the 3 heavy power poles feeding the motor.',
        },
        physicalPrinciple: {
          fr: 'Un contacteur n\'a AUCUN pouvoir de coupure de court-circuit : il ne coupe que le courant nominal du moteur. Il doit impérativement être associé à un disjoncteur moteur en amont ou à un relais thermique en aval. Le relais thermique comporte des bilames traversées par les phases et un contact auxiliaire NF (95-96) qui coupe l\'alimentation de la bobine A1-A2 en cas de surintensité prolongée.',
          en: 'A contactor has NO short-circuit breaking capacity: it only interrupts rated running and starting currents. It must be paired with upstream breaker fuses and downstream overload protection. The overload relay trips auxiliary NC contact 95-96 to de-energize coil A1-A2.',
        },
        keyFormulas: [
          'Puissance bobine : P_maintien ≈ 5 à 15 VA',
          'Réglage relais thermique : Ir = In_moteur (lu sur la plaque signalétique)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Ensemble contacteur TeSys Schneider Electric (bobine 230 V) associé à son relais thermique LRD embroché sous les pôles.',
          en: 'Contactor assembly paired with clip-on thermal overload relay, showing auxiliary terminals 13-14 and 95-96.',
        },
        iecSymbolDescription: {
          fr: 'Symbole CEI 60617 : bobine rectangulaire marquée KM1 (bornes A1-A2), 3 contacts de puissance principaux (1-2, 3-4, 5-6) et contact auxiliaire d’auto-maintien (13-14).',
          en: 'IEC 60617 symbol: rectangular coil KM1 (A1-A2), 3 power main contacts (1-2, 3-4, 5-6), and NO latching contact (13-14).',
        },
        cameroonFieldNote: {
          fr: 'Erreur courante de dépannage sur le terrain : lorsque le relais thermique déclenche à cause d’un grippage mécanique sur une pompe ou un broyeur, ne jamais réarmer le bouton bleu sans vérifier la cause du blocage et l’intensité réelle avec une pince ampèremétrique.',
          en: 'Frequent field troubleshooting tip: when an overload relay trips on a pump or mill, never press the blue reset button repeatedly without checking for mechanical jamming and measuring phase currents with a clamp meter.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'motor-250kw-field',
          label: { fr: 'Voir le Moteur Industriel Associé', en: 'View Paired Industrial Motor' },
        },
        quiz: {
          question: {
            fr: 'Un contacteur électrique standard peut-il couper à lui seul un courant de court-circuit franc de 10 000 Ampères ?',
            en: 'Can a standard electrical contactor interrupt a dead 10,000 Ampere short-circuit on its own?',
          },
          options: [
            { fr: 'Non, ses contacts se souderaient ou exploseraient ; il doit être protégé par un disjoncteur amont', en: 'No, its contacts would weld or burst; it requires upstream short-circuit breaker protection' },
            { fr: 'Oui, sans aucune difficulté', en: 'Yes, without any issue' },
            { fr: 'Seulement si la bobine est en 24 V continu', en: 'Only if the coil is 24 V DC' },
            { fr: 'Oui, si le relais thermique est réglé au maximum', en: 'Yes, provided the thermal relay is set to max' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Le contacteur est un appareil de manœuvre en service normal, pas de coupure de court-circuit. En cas de défaut franc, le disjoncteur amont doit ouvrir avant la destruction du contacteur.',
            en: 'Contactors handle normal operational switching, not high-energy short-circuit breaking. Upstream circuit breakers must clear faults before contactor destruction.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 03: Electrical Installations
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-03-installations',
    orderNumber: '03',
    title: {
      fr: 'Installations Électriques : Câblage, Tableaux & Régimes de Neutre',
      en: 'Electrical Installations: Wiring, Panels & Earthing Systems',
    },
    shortTitle: { fr: '03. Installations Électriques', en: '03. Electrical Installations' },
    tagline: {
      fr: 'De la prise domestique au TGBT : concevez et sécurisez les réseaux basse tension.',
      en: 'From domestic wall sockets to main distribution switchboards: wire and protect LV systems.',
    },
    description: {
      fr: 'Comprenez comment les circuits d’éclairage, prises et forces motrices sont alimentés, comment dimensionner la section des conducteurs selon la norme NF C 15-100 / CEI 60364, et pourquoi la terre et le disjoncteur différentiel sauvent des vies.',
      en: 'Understand how lighting, socket outlets, and power circuits are wired, size cable conductor cross-sections per IEC 60364, and see why earthing and residual current devices save human lives.',
    },
    level: 'technician',
    levelBadge: { fr: 'Pratique Terrain', en: 'Field Practice' },
    targetProfile: 'TECHNICAL',
    iconName: 'Building2',
    accentColor: '#38bdf8',
    estimatedMinutes: 50,
    targetDomain: 'D06',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Maîtriser le dimensionnement d’un câble en cuivre (1.5 mm², 2.5 mm², 10 mm², 70 mm²) selon le courant et la chute de tension.',
        en: 'Size copper cable cross-sections (1.5 to 70 mm²) based on current carrying capacity and voltage drop.',
      },
      {
        fr: 'Comprendre physiquement la différence entre les régimes de neutre TT, TN-S et IT.',
        en: 'Understand the physical operating differences between TT, TN-S, and IT earthing systems.',
      },
      {
        fr: 'Comprendre pourquoi un disjoncteur classique 16 A ne protège PAS une personne qui touche un fil de phase, alors qu’un DDR 30 mA la sauve.',
        en: 'Understand why a standard 16 A breaker DOES NOT protect a person touching a phase, whereas a 30 mA RCD saves them.',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Le Dispositif Différentiel Résiduel (DDR 30 mA) : Sauveur de Vie',
          en: 'Residual Current Device (30 mA RCD): Life-Saving Protection',
        },
        summary: {
          fr: 'Le différentiel compare en permanence le courant entrant par la phase et le courant sortant par le neutre. Si une différence supérieure à 30 mA apparaît (fuite vers la terre ou à travers le corps humain), il coupe en 30 millisecondes.',
          en: 'The RCD constantly compares incoming phase current with returning neutral current. If a discrepancy exceeding 30 mA occurs (leakage to earth or through a human body), it trips in 30 ms.',
        },
        realWorldAnalogy: {
          fr: 'Imaginez un comptable qui surveille l’entrée et la sortie d’un entrepôt : 100 cartons entrent par la porte Phase, 100 cartons doivent ressortir par la porte Neutre. Si seulement 99.9 cartons ressortent, 0.1 carton s’est échappé par la fenêtre. Le différentiel détecte cette fuite immédiatement et ferme toutes les portes.',
          en: 'Imagine an inventory clerk: 100 boxes enter through the Phase door, and 100 boxes must return through the Neutral door. If only 99.9 return, 0.1 escaped out the window. The RCD detects this missing current immediately and trips.',
        },
        physicalPrinciple: {
          fr: 'Un tore ferromagnétique entoure les conducteurs actifs (Phase + Neutre). En marche normale, la somme vectorielle des courants est nulle (I_phase + I_neutre = 0), donc le flux magnétique dans le tore est nul. Si un défaut d’isolement survient, un courant de fuite I_défaut part vers la terre : le tore s’aimante, induit une tension dans l’enroulement secondaire et déclenche le relais polarisé.',
          en: 'A ferromagnetic toroid surrounds active conductors (Phase + Neutral). In normal operation, phase and neutral currents cancel each other out, yielding zero net flux in the toroid. When an insulation fault leaks current to earth, the resultant magnetic flux induces a voltage in a detection coil that fires a sensitive trip relay.',
        },
        keyFormulas: [
          'I_diff = |I_phase - I_neutre| >= I_delta_n (ex: 30 mA, 300 mA)',
          'Seuil de fibrillation cardiaque irréversible : ~50 mA pendant plus de 0.5 seconde',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Interrupteur différentiel 30 mA type AC 40 A en tête de rangée dans un tableau modulaire.',
          en: '30 mA residual current device (RCD) installed at head of a residential DIN-rail distribution board.',
        },
        cameroonFieldNote: {
          fr: 'En régime de neutre TT (le régime imposé au Cameroun en basse tension par Eneo), la présence d’un DDR 30 mA est obligatoire pour toute prise de courant. Sans DDR, si la résistance de la prise de terre est médiocre (ex: 150 Ohms), un défaut d’isolement ne ferait jamais disjoncter un disjoncteur 16 A, laissant la carcasse métallique sous une tension mortelle de 200 V.',
          en: 'Under TT earthing (standard utility rule in Cameroon), 30 mA RCDs are mandatory for all socket outlets. Without an RCD, poor soil earthing (e.g. 150 Ohms) cannot trigger a 16 A breaker, leaving metallic appliance casings charged at lethal 200 V potential.',
        },
        targetAction: {
          type: 'STANDARDS',
          targetId: 'nf-c-15-100',
          label: { fr: 'Consulter la Fiche Norme NF C 15-100 / CEI 60364', en: 'Consult IEC 60364 Standards Summary' },
        },
        quiz: {
          question: {
            fr: 'Si une personne touche directement un fil de phase 230 V nu, pourquoi un disjoncteur divisionnaire ordinaire de 16 A ne disjoncte-t-il PAS pour la sauver ?',
            en: 'If a person directly touches a live 230 V phase wire, why does a standard 16 A circuit breaker FAIL to trip and save them?',
          },
          options: [
            { fr: 'Parce que le corps humain a une résistance (~1 000 Ω) ne laissant passer que ~0.23 A (230 mA), ce qui est bien inférieur au seuil de 16 A du disjoncteur', en: 'Because human body resistance (~1,000 Ω) only draws ~0.23 A (230 mA), far below the 16 A breaker threshold' },
            { fr: 'Parce que le disjoncteur n’est pas raccordé à la terre', en: 'Because the circuit breaker is not grounded' },
            { fr: 'Parce que le courant alternatif ne traverse pas la peau', en: 'Because AC current does not penetrate human skin' },
            { fr: 'Parce que le compteur prépayé coupe avant le disjoncteur', en: 'Because the prepayment meter always trips first' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! Un courant de 0.23 A (230 mA) est largement suffisant pour tuer un être humain par fibrillation cardiaque, mais pour un disjoncteur 16 A, 0.23 A est une charge dérisoire (comme une petite ampoule LED) ! Seul le différentiel 30 mA détecte ce courant anormal vers la terre.',
            en: 'Correct! 230 mA is more than enough to cause fatal ventricular fibrillation, yet to a 16 A breaker it looks like a harmless 50 W bulb. Only a 30 mA RCD detects and interrupts this leakage.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 04: Power Generation
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-04-generation',
    orderNumber: '04',
    title: {
      fr: 'Production d’Énergie Électrique : Centrales Hydro, Thermiques & Renouvelables',
      en: 'Power Generation: Hydroelectric, Thermal & Renewable Power Plants',
    },
    shortTitle: { fr: '04. Production d’Énergie', en: '04. Power Generation' },
    tagline: {
      fr: 'Découvrez comment la force de l’eau et du soleil est convertie en gigawatts synchronisés.',
      en: 'Discover how the raw force of water and sun is converted into synchronized gigawatts.',
    },
    description: {
      fr: 'Visitez les centrales hydroélectriques (Nachtigal 420 MW, Song Loulou 384 MW), thermiques à gaz (Kribi 216 MW) et solaires photovoltaïques (Guider, Maroua). Comprenez le rôle du rotor/stator de l’alternateur synchrone, de la régulation de tension AVR et du couplage synchrone ANSI 25.',
      en: 'Tour major hydroelectric dams (Nachtigal 420 MW, Song Loulou), gas-fired thermal plants (Kribi 216 MW), and solar PV farms (Guider, Maroua). Learn synchronous generator mechanics, AVR excitation, and ANSI 25 synchronization.',
    },
    level: 'engineer',
    levelBadge: { fr: 'Production & Réseau', en: 'Power Systems' },
    targetProfile: 'ENGINEERING',
    iconName: 'Zap',
    accentColor: '#34d399',
    estimatedMinutes: 50,
    targetDomain: 'D01',
    heroImageUrl: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Expliquer comment une turbine Francis ou Kaplan convertit l’énergie hydraulique en rotation mécanique à 150 tr/min.',
        en: 'Explain how a Francis or Kaplan hydraulic turbine converts head pressure into shaft rotation at 150 RPM.',
      },
      {
        fr: 'Comprendre le rôle du régulateur d’excitation AVR pour stabiliser la tension de l’alternateur à 10.5 kV.',
        en: 'Understand how the Automatic Voltage Regulator (AVR) stabilizes stator terminal voltage at 10.5 kV.',
      },
      {
        fr: 'Maîtriser les 4 conditions strictes de couplage synchrone (ANSI 25) d’une centrale sur le réseau national.',
        en: 'Master the 4 strict conditions for paralleling a generator to the national grid (ANSI 25 synchronizer).',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'L’Alternateur Synchrone : Rotor Tournant & Stator 10.5 kV',
          en: 'The Synchronous Generator: Rotating Rotor & 10.5 kV Stator',
        },
        summary: {
          fr: 'Le rotor est un électro-aimant puissant alimenté en continu qui tourne. En tournant, son champ magnétique coupe les bobinages du stator fixe et y induit une tension alternative triphasée à 50 Hz.',
          en: 'The rotor is a rotating DC electromagnet. As it spins, its magnetic flux sweeps through stationary stator windings, inducing three-phase sinusoidal 50 Hz voltage.',
        },
        realWorldAnalogy: {
          fr: 'Imaginez une dynamo de vélo géante : un aimant tourne à toute vitesse au centre d’une cage de cuivre fixe. Plus l’eau pousse fort sur la turbine, plus l’alternateur est capable de délivrer des mégawatts sans ralentir.',
          en: 'Imagine a bicycle dynamo enlarged to the size of a three-story building: an intense magnetic core spins within a stationary copper stator frame, generating massive power.',
        },
        physicalPrinciple: {
          fr: 'Loi de Faraday d’induction électromagnétique : e = -dPhi / dt. La fréquence électrique produite f dépend directement de la vitesse de rotation n (tr/min) et du nombre de paires de pôles p : f = (p * n) / 60. Pour tourner à 150 tr/min à 50 Hz, un alternateur hydroélectrique nécessite p = (60 * 50) / 150 = 20 paires de pôles (soit 40 pôles saillants sur le rotor).',
          en: 'Faraday’s law of induction: e = -dPhi / dt. Electrical frequency f is synchronized with rotor rotational speed n (RPM) and pole pair count p: f = (p * n) / 60. For 150 RPM hydro units at 50 Hz, p = 20 pole pairs (40 salient poles).',
        },
        keyFormulas: [
          'f = (p * n) / 60 (Fréquence synchrone en Hz)',
          'P_hydro = rho * g * Q * H * rendement (Puissance hydraulique disponible)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Rotor à pôles saillants de 60 MW en cours de montage dans le puits de turbine de la centrale hydroélectrique de Nachtigal.',
          en: 'Salient-pole 60 MW hydro generator rotor during lowering into Nachtigal power plant machine pit.',
        },
        cameroonFieldNote: {
          fr: 'La centrale de Nachtigal sur le fleuve Sanaga comporte 7 groupes de 60 MW (total 420 MW). Chaque groupe évacue son énergie vers un transformateur élévateur GSU 10.5/225 kV pour injecter sur le réseau interconnecté Sud (RIS).',
          en: 'Nachtigal power plant features 7 x 60 MW Francis units (420 MW total). Each unit evacuates power via an individual 10.5/225 kV step-up transformer into Cameroon’s Southern Interconnected Grid (RIS).',
        },
        targetAction: {
          type: 'GRID',
          targetId: 'cameroon-grid-nachtigal',
          label: { fr: 'Voir la Centrale Nachtigal sur la Carte du Réseau', en: 'View Nachtigal on Cameroon Grid Map' },
        },
        quiz: {
          question: {
            fr: 'Si une turbine hydroélectrique tourne à 150 tours par minute, combien de paires de pôles doit posséder son alternateur pour produire un courant à 50 Hz ?',
            en: 'If a hydro turbine spins at 150 RPM, how many pole pairs must its generator have to produce exactly 50 Hz?',
          },
          options: [
            { fr: '20 paires de pôles (40 pôles)', en: '20 pole pairs (40 poles)' },
            { fr: '2 paires de pôles (4 pôles)', en: '2 pole pairs (4 poles)' },
            { fr: '50 paires de pôles', en: '50 pole pairs' },
            { fr: '1 seule paire de pôles', en: '1 single pole pair' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Calcul : p = (60 x f) / n = (60 x 50) / 150 = 3 000 / 150 = 20 paires de pôles.',
            en: 'Calculation: p = (60 x f) / n = (60 x 50) / 150 = 20 pole pairs.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 05: Power Transmission
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-05-transmission',
    orderNumber: '05',
    title: {
      fr: 'Transport Haute Tension & Postes HTB : Pylônes, Lignes & Postes Sources',
      en: 'Power Transmission & Substations: Lines, Towers & Grid Nodes',
    },
    shortTitle: { fr: '05. Transport Haute Tension', en: '05. HV Transmission' },
    tagline: {
      fr: 'Suivez les lignes à 225 000 Volts et pénétrez dans les postes de transformation.',
      en: 'Follow 225,000 Volt transmission corridors and enter high-voltage transformation yards.',
    },
    description: {
      fr: 'Comprenez pourquoi l’électricité est transportée à 90 kV, 110 kV et 225 kV, comment les pylônes treillis résistent aux intempéries, comment les isolateurs empêchent l’arc de contournement, et découvrez l’architecture d’un poste source haute tension (AIS vs GIS).',
      en: 'Understand why bulk energy is transmitted at 90 kV, 110 kV, and 225 kV, how lattice steel towers and insulator strings operate, and explore high-voltage substation topologies (AIS vs. GIS).',
    },
    level: 'engineer',
    levelBadge: { fr: 'Transport HTB', en: 'HV Transmission' },
    targetProfile: 'ENGINEERING',
    iconName: 'Compass',
    accentColor: '#a855f7',
    estimatedMinutes: 50,
    targetDomain: 'D03',
    heroImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Démontrer mathématiquement pourquoi élever la tension à 225 kV divise les pertes Joule par 459 par rapport à 10.5 kV.',
        en: 'Mathematically prove why stepping up to 225 kV cuts line ohmic losses by 459 times compared to 10.5 kV.',
      },
      {
        fr: 'Identifier sur une photo de poste HTB les éléments d’une travée : sectionneur de barre, disjoncteur SF6, réducteurs de mesure (TC/TT) et parafoudres.',
        en: 'Identify outdoor substation bay components: bus disconnector, SF6 breaker, CT/VT instrument transformers, and surge arresters.',
      },
      {
        fr: 'Comprendre le fonctionnement d’une protection différentielle de transformateur (ANSI 87T) et de distance de ligne (ANSI 21).',
        en: 'Understand transformer differential (ANSI 87T) and line distance (ANSI 21) protection operating principles.',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Pourquoi la Très Haute Tension (225 kV) ? La Loi des Pertes en I²',
          en: 'Why Extra-High Voltage (225 kV)? The I² Loss Law',
        },
        summary: {
          fr: 'Transporter 100 mégawatts à 230 Volts exigerait des câbles en cuivre plus épais qu’un tronc d’arbre qui fondraient sous leur propre chaleur. À 225 000 Volts, le courant devient si faible qu’un conducteur ordinaire suffit.',
          en: 'Transmitting 100 MW at 230 V would require copper conductors thicker than tree trunks, which would melt under their own heat. At 225 kV, current drops dramatically, making lightweight overhead conductors viable.',
        },
        realWorldAnalogy: {
          fr: 'Pensez au transport de marchandises par camion : pour transporter 10 000 tonnes de gravier d’Édéa à Douala, vous pouvez soit envoyer 10 000 petites voitures légères (embouteillage monstrueux et carburant gaspillé = courant énorme à basse tension), soit 200 gros trains de fret lourd (flux fluide et économique = haute tension).',
          en: 'Think of freight: moving 10,000 tons of gravel by thousands of small cars creates traffic jams and massive fuel waste (high current at low voltage). Loading it onto heavy freight rail moves it effortlessly with minimal losses (high voltage).',
        },
        physicalPrinciple: {
          fr: 'Pour transmettre une puissance S = sqrt(3) * U * I donnée, si l’on multiplie la tension U par 20, le courant I est divisé par 20. Or, les pertes par effet Joule dans les câbles dépendent du carré du courant : P_pertes = 3 * R * I². Par conséquent, multiplier la tension par 20 divise les pertes par 20² = 400 !',
          en: 'To transmit power S = sqrt(3) * U * I, increasing voltage U by a factor of 20 reduces current I by 20. Since Joule losses scale with I² (P_loss = 3 * R * I²), a 20-fold voltage increase slashes line losses by 20² = 400 times!',
        },
        keyFormulas: [
          'P_pertes = 3 * R_ligne * I^2 = 3 * R_ligne * (S / (sqrt(3) * U))^2',
          'P_pertes proportionnel à 1 / U^2',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Pylône treillis 225 kV de la ligne d’évacuation Song Loulou - Mangombé (conducteurs Almelec en faisceaux).',
          en: '225 kV steel lattice transmission tower carrying bundled Almelec conductors on Song Loulou - Mangombe line.',
        },
        cameroonFieldNote: {
          fr: 'La dorsale 225 kV de SONATREL relie les grands centres de production (Song Loulou, Nachtigal, Édéa) aux postes sources de Douala (Mangombé, Bekoko, Logbaba) et Yaoundé (Oyomabang, Ahala). Une défaillance sur cette ligne provoque un effondrement partiel ou total du Réseau Interconnecté Sud (RIS).',
          en: 'SONATREL’s 225 kV transmission backbone links major hydro plants (Song Loulou, Nachtigal, Edea) to primary substations in Douala and Yaounde. Tripping a critical backbone line risks southern grid cascading separation.',
        },
        targetAction: {
          type: 'GRID',
          targetId: 'cameroon-grid-ris',
          label: { fr: 'Explorer la Dorsale 225 kV SONATREL sur la Carte', en: 'Explore SONATREL 225 kV Backbone Map' },
        },
        quiz: {
          question: {
            fr: 'Si l’on élève la tension d’une ligne de transport d’un facteur 10 (ex: de 20 kV à 200 kV) pour transporter la même puissance, que deviennent les pertes par effet Joule dans les câbles ?',
            en: 'If transmission line voltage is increased by a factor of 10 (e.g. from 20 kV to 200 kV) for the same delivered power, what happens to conductor ohmic losses?',
          },
          options: [
            { fr: 'Elles sont divisées par 100', en: 'They are divided by 100' },
            { fr: 'Elles sont divisées par 10', en: 'They are divided by 10' },
            { fr: 'Elles restent rigoureusement identiques', en: 'They remain identical' },
            { fr: 'Elles sont multipliées par 100', en: 'They are multiplied by 100' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Le courant est divisé par 10, et les pertes variant selon I², elles sont divisées par 10² = 100 fois.',
            en: 'Current is divided by 10, and losses scale with I², so losses are cut by 10² = 100 times.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 06: Power Distribution
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-06-distribution',
    orderNumber: '06',
    title: {
      fr: 'Distribution Électrique Moyenne & Basse Tension : Réseaux HTA, Postes H61 & Cabines',
      en: 'Power Distribution: Medium & Low Voltage, RMU Switchgear & H61 Transformers',
    },
    shortTitle: { fr: '06. Distribution Moyenne & Basse Tension', en: '06. MV/LV Distribution' },
    tagline: {
      fr: 'Du poste source HTA aux quartiers : cellules RMU, transformateurs H61 et réseau BT.',
      en: 'From distribution substations to neighborhoods: RMU switchgear, pole-mounted H61 trafos, and LV networks.',
    },
    description: {
      fr: 'Suivez le parcours de l’électricité depuis les départs 15 kV / 20 kV / 30 kV du distributeur, à travers les cellules en boucle Ring Main Unit (RMU), les transformateurs sur poteau (H61) et en cabine maçonnée, jusqu’aux coffrets de coupure et compteurs d’abonnés.',
      en: 'Follow power from utility 15 kV / 20 kV / 30 kV feeders through Ring Main Units (RMU), pole-mounted H61 transformers, and masonry substations down to consumer service cutouts and smart meters.',
    },
    level: 'technician',
    levelBadge: { fr: 'Réseau MT / BT', en: 'MV / LV Grid' },
    targetProfile: 'TECHNICAL',
    iconName: 'Building2',
    accentColor: '#38bdf8',
    estimatedMinutes: 45,
    targetDomain: 'D05',
    heroImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Comprendre l’architecture en boucle ouverte des réseaux HTA urbains avec cellules modulaires RMU.',
        en: 'Understand open-loop urban MV network topology utilizing compact Ring Main Units (RMU).',
      },
      {
        fr: 'Identifier sur le terrain un transformateur haut de poteau H61 (50 à 160 kVA) et son disjoncteur D16T.',
        en: 'Identify a pole-mounted H61 distribution transformer (50 to 160 kVA) and associated D16T breaker.',
      },
      {
        fr: 'Diagnostiquer les causes de surcharge et de déséquilibre des phases sur les départs basse tension.',
        en: 'Diagnose phase unbalance and overload causes on utility low-voltage feeder lines.',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Le Transformateur de Distribution H61 Haut de Poteau & en Cabine',
          en: 'The H61 Pole-Mounted & Cabin Distribution Transformer',
        },
        summary: {
          fr: 'Le transformateur abaisse la moyenne tension (15 kV ou 30 kV) en basse tension utilisable (400 V triphasé / 230 V monophasé) au plus près des habitations.',
          en: 'The distribution transformer steps down medium voltage (15 kV or 30 kV) to usable low voltage (400 V three-phase / 230 V single-phase) near consumer premises.',
        },
        realWorldAnalogy: {
          fr: 'Le transformateur agit comme un réducteur de pression sur une conduite d’eau maîtresse : vous ne pouvez pas brancher un robinet de cuisine sur la canalisation principale à 50 bars. Le transformateur ramène la pression à un niveau doux et utilisable par tous les appareils.',
          en: 'The transformer acts like a pressure regulator on a high-pressure municipal water main: it steps down high pipe pressure so household faucets can safely dispense water.',
        },
        physicalPrinciple: {
          fr: 'Deux enroulements de cuivre ou aluminium sont bobinés autour d’un circuit magnétique fermé en tôle au silicium. Le rapport des tensions U2 / U1 est égal au rapport du nombre de spires N2 / N1. Un transformateur H61 160 kVA 20 kV / 400 V utilise un couplage Dyn11 : primaire en Triangle (D), secondaire en Étoile (y) avec le Neutre (n) sorti et mis à la terre.',
          en: 'Primary and secondary windings are coupled via a silicon-steel magnetic core. The voltage ratio U2 / U1 equals winding turns ratio N2 / N1. An H61 160 kVA 20 kV / 400 V unit commonly uses Dyn11 vector configuration: Delta primary, Star secondary with accessible Neutral grounded at the substation.',
        },
        keyFormulas: [
          'U2 / U1 = N2 / N1 = m (Rapport de transformation)',
          'I_nominal_BT = S / (sqrt(3) * U_BT) (ex: 160 kVA / (1.732 * 400 V) ≈ 231 A)',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Transformateur H61 sur poteau béton avec ses parafoudres HTA à étincelles et son disjoncteur BT suspendu.',
          en: 'H61 pole-mounted distribution transformer on concrete pole with MV surge arresters and suspended LV circuit breaker.',
        },
        cameroonFieldNote: {
          fr: 'Au Cameroun, la tension moyenne tension historique à Douala et Yaoundé était de 15 kV ou 20 kV, tandis que les extensions récentes et le réseau ouest sont standardisés à 30 kV. Les transformateurs H61 sont souvent double tension primaire (15/30 kV commutable hors tension).',
          en: 'In Cameroon, legacy urban MV systems in Douala and Yaounde operate at 15 kV or 20 kV, while newer rural and regional backbones standardize at 30 kV. Many distribution units feature de-energized dual-ratio primary tap changers (15/30 kV).',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'transfo-distribution-htabt',
          label: { fr: 'Consulter la Fiche Technique Transformateur MT/BT', en: 'Inspect MV/LV Distribution Transformer Specs' },
        },
        quiz: {
          question: {
            fr: 'Quel est le courant nominal disponible au secondaire basse tension (400 V triphasé) d’un transformateur H61 de 160 kVA ?',
            en: 'What is the rated secondary low-voltage (400 V three-phase) current available from a 160 kVA H61 distribution transformer?',
          },
          options: [
            { fr: 'Environ 230 Ampères par phase', en: 'Approximately 230 Amperes per phase' },
            { fr: '16 Ampères', en: '16 Amperes' },
            { fr: '1 600 Ampères', en: '1,600 Amperes' },
            { fr: '400 Ampères', en: '400 Amperes' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Calcul : I = S / (sqrt(3) x U) = 160 000 / (1.732 x 400) = 160 000 / 692.8 ≈ 231 A.',
            en: 'Calculation: I = S / (sqrt(3) x U) = 160,000 / (1.732 x 400) ≈ 231 A.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 07: Industrial Electrical Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-07-industrial',
    orderNumber: '07',
    title: {
      fr: 'Génie Électrique Industriel : Moteurs, Démarreurs, Variateurs & Automates',
      en: 'Industrial Electrical Engineering: Motors, Starters, VFDs & PLCs',
    },
    shortTitle: { fr: '07. Génie Industriel', en: '07. Industrial Systems' },
    tagline: {
      fr: 'Assemblez les composants en systèmes opérationnels réels pour l’industrie.',
      en: 'Assemble individual apparatuses into real operational industrial motor and control systems.',
    },
    description: {
      fr: 'Passez des composants individuels aux ensembles industriels complets : démarrage direct (DOL) et Étoile-Triangle des moteurs asynchrones, variateurs de vitesse (VFD), automates programmables industriels (API / PLC) en 24 V CC et supervision SCADA.',
      en: 'Progress from standalone parts to fully integrated systems: Direct-On-Line (DOL) and Star-Delta induction motor starters, Variable Frequency Drives (VFDs), 24 V DC Programmable Logic Controllers (PLCs), and SCADA control rooms.',
    },
    level: 'technician',
    levelBadge: { fr: 'Pratique Industrielle', en: 'Industrial Systems' },
    targetProfile: 'TECHNICAL',
    iconName: 'Activity',
    accentColor: '#f59e0b',
    estimatedMinutes: 50,
    targetDomain: 'D07',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Lire une plaque signalétique de moteur triphasé et choisir le bon couplage (Étoile ou Triangle) selon la tension réseau 400 V.',
        en: 'Read an induction motor nameplate and select correct Star or Delta terminal links based on 400 V supply.',
      },
      {
        fr: 'Câbler et dépanner un démarreur direct complet (Circuit de Puissance + Circuit de Commande avec auto-maintien).',
        en: 'Wire and troubleshoot a full DOL motor starter (Power Circuit + Control Circuit with latching seal-in).',
      },
      {
        fr: 'Comprendre pourquoi un variateur de vitesse (VFD) élimine la pointe de courant de démarrage tout en économisant l’énergie.',
        en: 'Understand how Variable Frequency Drives (VFD) suppress starting inrush spikes while optimizing energy.',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Le Moteur Asynchrone Triphasé & Couplage Étoile / Triangle',
          en: 'Three-Phase Induction Motor & Star / Delta Terminal Configuration',
        },
        summary: {
          fr: 'Le moteur asynchrone transforme l’énergie électrique en rotation mécanique. Ses 6 bornes (U1-V1-W1 et U2-V2-W2) doivent être reliées en Étoile ou en Triangle selon la tension du réseau.',
          en: 'The induction motor converts electrical power into shaft rotation. Its 6 terminal studs (U1-V1-W1 and U2-V2-W2) must be linked in Star (Y) or Delta (Δ) according to line voltage.',
        },
        realWorldAnalogy: {
          fr: 'Relier les enroulements d’un moteur ressemble à changer de vitesse sur un vélo : le couplage Étoile divise la tension subie par chaque bobine par 1.732 (idéal pour démarrer en douceur sans caler). Le couplage Triangle applique la pleine tension aux bobines pour délivrer le couple et la puissance maximale à pleine vitesse.',
          en: 'Connecting motor windings is like selecting bicycle gears: Star connection applies reduced voltage across each winding (ideal for soft start). Delta connection applies full line voltage across each coil for maximum operational torque.',
        },
        physicalPrinciple: {
          fr: 'Plaque signalétique moteur indiquant \'230 V / 400 V\' : cela signifie que chaque enroulement interne supporte au maximum 230 V. Sur un réseau 400 V triphasé, il faut impérativement coupler ce moteur en ÉTOILE (les bobines reçoivent 400 V / sqrt(3) = 230 V). Si vous le couplez en Triangle sur du 400 V, chaque enroulement recevra 400 V et le moteur grillera en quelques minutes !',
          en: 'Motor nameplate stamped \'230 V / 400 V\': this signifies each individual winding can withstand at most 230 V. On a 400 V three-phase supply, this motor MUST be wired in STAR. Wiring it in Delta on 400 V over-stresses windings and burns stator insulation within minutes!',
        },
        keyFormulas: [
          'Vitesse de synchronisme : Ns = (60 * f) / p (ex: 1 500 tr/min à 50 Hz pour 2 paires de pôles)',
          'Glissement : g = (Ns - N) / Ns ≈ 2 à 5 % à pleine charge',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Boîte à bornes ouverte d’un moteur 15 kW avec barrettes en cuivre montées en Étoile (bornes W2-U2-V2 reliées ensemble).',
          en: 'Terminal box of a 15 kW motor showing brass jumpers configured in Star link connection.',
        },
        iecSymbolDescription: {
          fr: 'Symbole CEI 60617 : cercle avec lettre M et indication 3~ (moteur triphasé) avec 3 conducteurs d’arrivée et fil de protection PE relié à la carcasse.',
          en: 'IEC 60617 symbol: circle enclosing M with 3~ notation, 3 phase terminal arrows, and PE frame earth connection.',
        },
        cameroonFieldNote: {
          fr: 'Sur les moteurs des moulins à farine de maïs ou broyeurs de manioc au Cameroun, les techniciens remplacent souvent les barrettes de couplage par du simple fil de fer ou omettent de serrer les écrous en cuivre, provoquant des échauffements par résistance de contact et la destruction de la boîte à bornes.',
          en: 'In local grain and cassava milling workshops in Cameroon, electricians frequently replace factory brass jumpers with improvised wire or leave terminal studs loose, leading to severe contact heating and burnt terminal boxes.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'motor-250kw-field',
          label: { fr: 'Examiner le Moteur Asynchrone Industriel 250 kW', en: 'Inspect 250 kW Industrial Induction Motor' },
        },
        quiz: {
          question: {
            fr: 'Un moteur triphasé porte sur sa plaque signalétique : \'230 V / 400 V\'. Sur un réseau industriel standard où la tension entre phases est de 400 V, comment devez-vous monter les barrettes dans sa boîte à bornes ?',
            en: 'A three-phase motor nameplate reads: \'230 V / 400 V\'. On a standard 400 V supply, how must the jumpers be placed in its terminal box?',
          },
          options: [
            { fr: 'En Étoile (relier les bornes W2-U2-V2 ensemble par une barrette)', en: 'In Star (bridge W2-U2-V2 together with a link bar)' },
            { fr: 'En Triangle (trois barrettes parallèles verticales)', en: 'In Delta (three vertical parallel bars)' },
            { fr: 'Sans aucune barrette', en: 'Without any links at all' },
            { fr: 'En reliant la phase L1 au neutre', en: 'By tying Phase L1 directly to neutral' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Chaque enroulement ne supportant que 230 V, le couplage Étoile applique 230 V par bobine sur un réseau 400 V. Le couplage Triangle détruirait le moteur.',
            en: 'Because windings tolerate 230 V max, Star connection applies 230 V per winding on a 400 V grid.',
          },
        },
      },
      {
        number: 2,
        title: {
          fr: 'Le Démarreur Direct Complet : Puissance, Commande & Auto-maintien',
          en: 'The Complete Direct-On-Line (DOL) Starter: Power & Control Circuits',
        },
        summary: {
          fr: 'Un démarreur moteur associe deux circuits distincts : le circuit de puissance (400 V triphasé pour alimenter le moteur) et le circuit de commande (230 V ou 24 V pour piloter la marche/arrêt).',
          en: 'A motor starter pairs two distinct circuits: the power circuit (three-phase 400 V feeding the motor) and control circuit (24 V / 230 V managing start/stop logic).',
        },
        realWorldAnalogy: {
          fr: 'Le circuit de commande est le cerveau et le doigt qui appuie sur l’interrupteur ; le circuit de puissance est le muscle qui fait tourner la machine. Une défaillance dans le circuit de commande empêche le contacteur de s’enclencher en toute sécurité.',
          en: 'The control circuit is the brain and nerve triggering the switch; the power circuit is the muscle driving the machine. Any interlock fault safely blocks the main contactor.',
        },
        physicalPrinciple: {
          fr: '1. Circuit de Puissance : Réseau L1-L2-L3 -> Sectionneur/Disjoncteur Q1 -> Contacteur KM1 (pôles 1-2, 3-4, 5-6) -> Relais thermique F1 -> Moteur M1. 2. Circuit de Commande : Alimentation phase commande -> Contact de sécurité NF du relais thermique (95-96) -> Bouton poussoir d\'arrêt \'Coup de poing\' NF (S0) -> Bouton poussoir de marche NO (S1) en parallèle avec le contact auxiliaire NO d\'auto-maintien de KM1 (13-14) -> Bobine du contacteur KM1 (A1-A2) -> Neutre.',
          en: '1. Power Circuit: Grid L1-L2-L3 -> Circuit Breaker Q1 -> Contactor KM1 (poles 1-2, 3-4, 5-6) -> Thermal Overload Relay F1 -> Motor M1. 2. Control Circuit: Control supply -> NC safety contact 95-96 of thermal relay -> NC stop pushbutton S0 -> NO start pushbutton S1 paralleled with KM1 auxiliary seal-in contact 13-14 -> Contactor coil KM1 (A1-A2) -> Neutral.',
        },
        keyFormulas: [
          'Courant de démarrage direct : Id = 6 à 8 * In_moteur',
          'Chute de tension tolérée au démarrage : Delta_U <= 10 % à 15 %',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Armoire électrique industrielle de pompage avec démarreur direct câblé en fils souples numérotés.',
          en: 'Industrial pumping control cabinet with DOL starter wired with numbered conductors.',
        },
        iecSymbolDescription: {
          fr: 'Schéma unifilaire et développé normalisé CEI avec repérage des bornes : 95-96 (F1), 1-2 (S0), 3-4 (S1), 13-14 (KM1) et A1-A2 (KM1).',
          en: 'IEC standardized ladder schematic showing terminal numbers: 95-96 (F1), 1-2 (S0), 3-4 (S1), 13-14 (KM1), and A1-A2 (KM1).',
        },
        cameroonFieldNote: {
          fr: 'Pour respecter la réglementation sur la qualité de l’énergie, les raccordements BT au Cameroun interdisent généralement le démarrage direct au-delà de 5.5 kW (ou 7.5 kW) en raison du creux de tension provoqué chez les voisins. Les moteurs plus puissants exigent un démarreur progressif ou un variateur de vitesse VFD.',
          en: 'To prevent severe local brownouts, utility regulations in Cameroon typically restrict direct-on-line motor starts above 5.5 kW on standard LV feeds. Larger drives require soft-starters or VFDs.',
        },
        targetAction: {
          type: 'SIMULATION',
          targetId: 'motor-starter-simulator',
          label: { fr: 'Tester le Simulateur de Démarrage Moteur DOL', en: 'Run DOL Motor Starter Interactive Lab' },
        },
        quiz: {
          question: {
            fr: 'Dans le circuit de commande d’un démarreur direct, à quoi sert le contact auxiliaire NO (13-14) branché en parallèle avec le bouton de marche (S1) ?',
            en: 'In a DOL starter control circuit, what is the role of auxiliary NO contact 13-14 wired in parallel with start button S1?',
          },
          options: [
            { fr: 'À maintenir la bobine alimentée (auto-maintien) lorsque l’opérateur relâche le bouton poussoir de marche', en: 'To maintain coil power (seal-in latch) when the operator releases the start pushbutton' },
            { fr: 'À mesurer la vitesse du moteur', en: 'To measure motor RPM' },
            { fr: 'À couper le circuit en cas d’incendie', en: 'To trip the circuit on fire' },
            { fr: 'À économiser 50 % d’électricité', en: 'To save 50% power' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Le bouton poussoir S1 est fugitif (il s’ouvre dès qu’on retire le doigt). Le contact 13-14 se ferme dès que KM1 s’enclenche et prend le relais pour maintenir l’alimentation de la bobine A1.',
            en: 'Pushbuttons are momentary spring-return contacts. Auxiliary contact 13-14 closes immediately with KM1 to provide a latching current path to coil A1.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PATHWAY 08: Electrical Drawings, Standards and Safety
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pathway-08-drawings-safety',
    orderNumber: '08',
    title: {
      fr: 'Schémas Électriques, Normes & Sécurité : Interprétation & Habilitation',
      en: 'Electrical Drawings, Standards & Safety: Schematics, LOTO & Norms',
    },
    shortTitle: { fr: '08. Schémas, Normes & Sécurité', en: '08. Drawings, Norms & Safety' },
    tagline: {
      fr: 'Lisez n’importe quel schéma sans hésitation et travaillez en sécurité vitale absolue.',
      en: 'Read any engineering diagram without hesitation and master life-critical safety practices.',
    },
    description: {
      fr: 'Apprenez à interpréter les schémas unifilaires (SLD), multifilaires, de puissance et de commande selon les symboles CEI 60617. Maîtrisez les 5 étapes de la consignation électrique LOTO, les équipements de protection individuelle (EPI) et la prévention des arcs électriques.',
      en: 'Learn to interpret Single-Line Diagrams (SLD), multi-line schematics, power and control prints per IEC 60617. Master the 5 steps of electrical Lockout / Tagout (LOTO), Arc Flash PPE, and life-critical isolation rules.',
    },
    level: 'beginner',
    levelBadge: { fr: 'Compétences Vitales', en: 'Essential Skills' },
    targetProfile: 'DISCOVERY',
    iconName: 'ShieldCheck',
    accentColor: '#10b981',
    estimatedMinutes: 45,
    targetDomain: 'D08',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80',
    learningOutcomes: [
      {
        fr: 'Reconnaître et associer instantanément chaque symbole CEI 60617 à l’équipement physique réel correspondant.',
        en: 'Instantly recognize and correlate every IEC 60617 graphic symbol with its real physical apparatus.',
      },
      {
        fr: 'Exécuter sans erreur les 5 règles d’or de la consignation électrique hors tension (NF C 18-510 / OSHA LOTO).',
        en: 'Execute flawlessly the 5 Golden Rules of electrical Lockout/Tagout de-energization (OSHA LOTO / NF C 18-510).',
      },
      {
        fr: 'Comprendre les risques mortels d’arc flash et choisir les EPI adaptés (visière anti-arc, gants isolants 1 000 V).',
        en: 'Understand fatal arc flash risks and select proper PPE (arc face shield, 1,000 V rated insulating gloves).',
      },
    ],
    lessons: [
      {
        number: 1,
        title: {
          fr: 'Les 5 Règles d’Or de la Consignation Électrique Hors Tension',
          en: 'The 5 Golden Rules of Electrical De-energization (LOTO)',
        },
        summary: {
          fr: 'Travailler sur une installation électrique exige de prouver scientifiquement l’absence totale de tension avant tout contact physique.',
          en: 'Working on electrical systems requires scientifically verifying the total absence of voltage before any physical contact.',
        },
        realWorldAnalogy: {
          fr: 'La consignation est comme désamorcer un engin pyrotechnique : on ne se fie jamais à la parole d’un tiers, à un voyant lumineux éteint ou à une poignée en position basse. On coupe, on cadenasse pour que personne ne puisse réenclencher par erreur, et on teste avec un appareil de mesure certifié (VAT).',
          en: 'De-energization is like bomb disposal: never trust someone’s word, an unlit pilot lamp, or a switch handle position. Open, pad-lock so no one can reclose by mistake, and test with a certified voltage verification probe (VAT).',
        },
        physicalPrinciple: {
          fr: 'Les 5 étapes obligatoires selon la norme NF C 18-510 : 1. Séparation : ouverture visible des sectionneurs ou débrochage des disjoncteurs. 2. Condamnation : verrouillage mécanique par cadenas personnel avec étiquette d\'avertissement LOTO (Lockout/Tagout). 3. Identification de l\'ouvrage : vérifier sur plan et sur site le tableau exact. 4. Vérification d\'Absence de Tension (VAT) : testeur certifié IEC 61243 testé immédiatement avant et après sur une source connue. 5. Mise à la terre et en court-circuit (MALT/CC) : obligatoire en haute tension pour évacuer les charges capacitives résiduelles et protéger contre les renvois de tension.',
          en: 'The 5 mandatory steps per NF C 18-510 / OSHA: 1. Disconnect: visible separation of disconnectors or drawout of breakers. 2. Lockout: mechanical padlock locking with warning tag. 3. Identification: confirm exact panel location against schematics. 4. Verification of Absence of Voltage (VAT): using certified detector checked before and after on a live source. 5. Grounding & short-circuiting: mandatory in HV to dissipate capacitive charges and protect against accidental backfeeding.',
        },
        keyFormulas: [
          'VAT obligatoire entre Phase-Phase, Phase-Neutre et Phase-Terre',
          'Courant létal : 30 mA à 50 mA en 500 ms',
        ],
        equipmentPhotoUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80',
        equipmentPhotoCaption: {
          fr: 'Électricien équipé d’EPI complets (gants isolants 1 000 V, écran facial anti-arc) réalisant une VAT sur un jeu de barres TGBT.',
          en: 'Electrician in full Arc Flash PPE (1,000 V insulating gloves, face shield) conducting voltage absence check (VAT).',
        },
        cameroonFieldNote: {
          fr: 'Au Cameroun, la majorité des électrocutions mortelles en maintenance industrielle proviennent soit d’une absence de condamnation (un collègue réenclenche le disjoncteur croyant rendre service), soit d’un retour de tension inattendu par un groupe électrogène ou inverseur mal verrouillé mécaniquement.',
          en: 'In Cameroon, most fatal industrial electrocutions stem from lack of physical lockout (a coworker reclosing the breaker) or unexpected backfeed from an un-interlocked standby generator.',
        },
        targetAction: {
          type: 'STANDARDS',
          targetId: 'nf-c-18-510',
          label: { fr: 'Consulter la Fiche Sécurité & Habilitation NF C 18-510', en: 'Consult NF C 18-510 Electrical Safety Guide' },
        },
        quiz: {
          question: {
            fr: 'Avant de toucher à mains nues les barres de cuivre d’une armoire électrique après avoir ouvert le disjoncteur général, quelle opération est ABSOLUMENT obligatoire ?',
            en: 'Before touching copper busbars inside a panel after opening the main breaker, which action is ABSOLUTELY mandatory?',
          },
          options: [
            { fr: 'Effectuer une Vérification d’Absence de Tension (VAT) avec un appareil certifié testé avant et après', en: 'Perform a Verification of Absence of Voltage (VAT) using a certified detector tested before and after' },
            { fr: 'Regarder si les voyants lumineux sont éteints', en: 'Check if the panel pilot lights are unlit' },
            { fr: 'Toucher rapidement le câble avec le dos de la main', en: 'Quickly tap the conductor with the back of your hand' },
            { fr: 'Faire confiance au technicien qui a ouvert le disjoncteur', en: 'Trust the coworker who said they opened the breaker' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Une ampoule de voyant peut être grillée, et un disjoncteur peut rester coincé en position fermée malgré le levier baissé. Seule la VAT prouve l’absence physique de tension.',
            en: 'Pilot lamps burn out and breaker contacts can weld shut while the handle appears down. Only physical VAT testing proves absence of voltage.',
          },
        },
      },
    ],
  },
];

