// src/components/production/data/productionSectionsData.ts

export interface SectionFeatureItem {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  equation?: string;
  badge?: string;
}

export interface ProductionMajorSection {
  id: string;
  number: number;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  icon: string;
  color: string;
  introFr: string;
  introEn: string;
  items: SectionFeatureItem[];
}

export const PRODUCTION_MAJOR_SECTIONS: ProductionMajorSection[] = [
  {
    id: 'sources',
    number: 1,
    titleFr: 'Sources d\'Énergie & Potentiel Primaire',
    titleEn: 'Energy Sources & Primary Generation Potential',
    subtitleFr: 'Origines physiques de l\'énergie : renouvelables, fossiles et nucléaires',
    subtitleEn: 'Physical origins of energy: renewable, fossil and nuclear resources',
    icon: 'Sun',
    color: '#0284c7',
    introFr: 'L\'énergie électrique ne peut être créée ex nihilo : elle résulte toujours de la captation, de la concentration et de la conversion d\'une forme d\'énergie primaire présente dans l\'environnement naturel.',
    introEn: 'Electric power cannot be created from nothing: it always results from harvesting, concentrating and converting a primary environmental energy source.',
    items: [
      {
        titleFr: 'Potentiel Gravitaire Hydraulique',
        titleEn: 'Gravitational Hydraulic Potential',
        descriptionFr: 'Exploitation du cycle de l\'eau alimenté par l\'évaporation solaire et les précipitations. L\'énergie stockée dépend du volume de retenue et du dénivelé géologique.',
        descriptionEn: 'Harvesting the hydrological cycle powered by solar evaporation and precipitation. Energy depends on stored volume and head.',
        equation: 'E_pot = m · g · H = ρ · V · g · H',
        badge: 'Renouvelable Décarbonée'
      },
      {
        titleFr: 'Rayonnement Solaire (Flux Photonique)',
        titleEn: 'Solar Irradiance (Photon Flux)',
        descriptionFr: 'Réactions de fusion thermonucléaire au cœur du soleil émettant des photons d\'énergie h·ν captés sous forme d\'irradiance directe (DNI) et globale (GHI).',
        descriptionEn: 'Thermonuclear fusion reactions emitting photons absorbed as direct and global irradiance.',
        equation: 'P_solaire = A · G · η_cellule',
        badge: 'Renouvelable Intermittente'
      },
      {
        titleFr: 'Énergie Cinétique Éolienne',
        titleEn: 'Atmospheric Wind Kinetic Energy',
        descriptionFr: 'Mouvements d\'air créés par les gradients thermiques et la force de Coriolis terrestre. L\'énergie disponible croît avec le cube de la vitesse du vent.',
        descriptionEn: 'Air masses driven by atmospheric thermal gradients and Coriolis force. Energy scales with the cube of wind velocity.',
        equation: 'P_vent = 0.5 · ρ_air · A · v³',
        badge: 'Renouvelable Variable'
      },
      {
        titleFr: 'Énergie Chimique des Combustibles & Biomasse',
        titleEn: 'Chemical Fuel & Biomass Potential',
        descriptionFr: 'Rupture des liaisons carbone-hydrogène lors de la réaction d\'oxydation exothermique de combustion avec le dioxygène de l\'air.',
        descriptionEn: 'Cleavage of C-H molecular bonds during highly exothermic combustion reactions.',
        equation: 'Q_thermique = m_comb · PCI (Pouvoir Calorifique)',
        badge: 'Stockable / Pilotable'
      }
    ]
  },
  {
    id: 'energy_balance',
    number: 2,
    titleFr: 'Bilan Énergétique de Production & Rendements',
    titleEn: 'Production Energy Balance & Conversion Efficiencies',
    subtitleFr: 'Conservation de l\'énergie, limites thermodynamiques et pertes par étage',
    subtitleEn: 'Energy conservation, thermodynamic limits and stage losses',
    icon: 'TrendingUp',
    color: '#0891b2',
    introFr: 'Le premier principe de la thermodynamique impose la conservation de l\'énergie totale, tandis que le second principe (Carnot) fixe le plafond théorique indépassable de tout cycle thermique.',
    introEn: 'The first law of thermodynamics mandates total energy conservation, while Carnot\'s second law imposes an insurmountable ceiling on thermal cycles.',
    items: [
      {
        titleFr: 'Équilibre Énergétique d\'Usine',
        titleEn: 'Plant Energy Balance Equation',
        descriptionFr: 'La puissance électrique brute finale est le produit des rendements de chaque sous-système en série soustrait des consommations auxiliaires internes.',
        descriptionEn: 'Final net electrical power is the product of all series subsystem efficiencies minus internal auxiliary loads.',
        equation: 'P_net = P_primaire · η_captage · η_méca · η_élec - P_auxiliaires',
        badge: 'Principe Fondamental'
      },
      {
        titleFr: 'Limite Théorique de Betz (Éolien)',
        titleEn: 'Betz Theoretical Limit (Wind)',
        descriptionFr: 'Aucun rotor éolien ne peut extraire plus de 16/27 (soit 59.26%) de l\'énergie cinétique du vent sans bloquer totalement l\'écoulement d\'air aval.',
        descriptionEn: 'No wind rotor can extract more than 16/27 (59.26%) of kinetic wind power without halting airflow.',
        equation: 'C_p_max = 16 / 27 ≈ 59.3%',
        badge: 'Plafond Aérodynamique'
      },
      {
        titleFr: 'Rendement Théorique Maximal de Carnot',
        titleEn: 'Carnot Maximum Thermal Efficiency',
        descriptionFr: 'Rendement maximal théorique de toute machine thermique fonctionnant entre une source chaude (T_chaude) et une source froide (T_froide).',
        descriptionEn: 'Theoretical upper efficiency limit for any thermal cycle operating between hot and cold reservoirs.',
        equation: 'η_Carnot = 1 - (T_froide / T_chaude)',
        badge: 'Plafond Thermodynamique'
      },
      {
        titleFr: 'Facteur de Charge & Énergie Productible',
        titleEn: 'Capacity Factor & Generation Output',
        descriptionFr: 'Rapport entre l\'énergie réellement produite pendant une année et l\'énergie maximale théorique si la centrale tournait à 100% sans arrêt.',
        descriptionEn: 'Ratio of actual annual generated MWh to theoretical maximum generation at continuous rated capacity.',
        equation: 'FC = E_annuelle / (P_nom · 8 760 h) · 100%',
        badge: 'Indicateur Économique'
      }
    ]
  },
  {
    id: 'electrical_conversion',
    number: 3,
    titleFr: 'Conversion Électrique & Électromagnétisme',
    titleEn: 'Electromechanical & Electrical Energy Conversion',
    subtitleFr: 'Lois d\'induction de Faraday-Lenz, machines synchrones et commutation',
    subtitleEn: 'Faraday-Lenz induction laws, synchronous machines and power electronics',
    icon: 'Zap',
    color: '#e11d48',
    introFr: 'La quasi-totalité de l\'électricité industrielle mondiale (plus de 90%) est générée par des alternateurs synchrones triphasés exploitant l\'induction électromagnétique.',
    introEn: 'Over 90% of global utility-scale electric energy is generated by three-phase synchronous generators harnessing electromagnetic induction.',
    items: [
      {
        titleFr: 'Loi Fondamentale de Faraday-Lenz',
        titleEn: 'Faraday-Lenz Induction Law',
        descriptionFr: 'La variation temporelle du flux magnétique Φ à travers les spires d\'un bobinage induit une force électromotrice (f.é.m.) alternative.',
        descriptionEn: 'Time-varying magnetic flux linkage across coil windings induces an alternating electromotive force (EMF).',
        equation: 'e(t) = - dΨ / dt = - N · (dΦ / dt)',
        badge: 'Principe Physique'
      },
      {
        titleFr: 'Synchronisme Fréquence - Vitesse de Rotation',
        titleEn: 'Synchronous Frequency-Speed Relation',
        descriptionFr: 'La fréquence électrique f (50 Hz) est strictement proportionnelle à la vitesse de rotation n de l\'arbre mécanique et au nombre de paires de pôles p.',
        descriptionEn: 'Electrical grid frequency f is strictly tied to shaft rotational speed n and rotor pole pairs p.',
        equation: 'f = (p · n) / 60   <=>   n = (60 · f) / p',
        badge: 'Règle Fondamentale'
      },
      {
        titleFr: 'Puissance Triphasée & Diagramme de Puissance P-Q',
        titleEn: 'Three-Phase AC Power & Capability Curve',
        descriptionFr: 'La machine synchrone délivre de la puissance active P (charge motrice de la turbine) et module la puissance réactive Q (soutien de tension réseau).',
        descriptionEn: 'The generator delivers active power P from the turbine and modulates reactive power Q via excitation current.',
        equation: 'S = √(P² + Q²) = √3 · U · I',
        badge: 'Régulation Réseau'
      },
      {
        titleFr: 'Inertie Mécanique & Stabilité Rotorique',
        titleEn: 'Rotational Inertia & Frequency Stability',
        descriptionFr: 'L\'énergie cinétique stockée dans les rotors tournants (constante d\'inertie H) freine instantanément les chutes de fréquence lors des perturbations réseau.',
        descriptionEn: 'Kinetic energy stored in spinning rotors (inertia constant H) resists instantaneous frequency drops during system events.',
        equation: 'E_cin = 0.5 · J · ω²  ;  H = E_cin / S_nom (s)',
        badge: 'Stabilité Système'
      }
    ]
  },
  {
    id: 'technologies',
    number: 4,
    titleFr: 'Technologies de Génération Électrique',
    titleEn: 'Electric Generation Technologies Portfolio',
    subtitleFr: 'Architecture comparée : hydraulique, thermique, solaire, éolien et biomasse',
    subtitleEn: 'Comparative architecture: hydro, thermal, solar, wind, biomass',
    icon: 'Layers',
    color: '#7c3aed',
    introFr: 'Chaque filière technologique possède sa propre chaîne de transformation cinétique, thermique ou photonique, avec des caractéristiques d\'exploitation distinctes.',
    introEn: 'Every generation technology features its own unique thermodynamic, kinetic or photonic process chain, each fulfilling specific grid roles.',
    items: [
      {
        titleFr: 'Hydroélectricité (Francis, Pelton, Kaplan)',
        titleEn: 'Hydropower Engineering',
        descriptionFr: 'Haute efficacité (> 92%), démarrage en 3 minutes, inertie mécanique massive, pilotage total et capacité de stockage (STEP). Pilier du réseau camerounais (Nachtigal, Songloulou, Edéa).',
        descriptionEn: 'High efficiency (> 92%), 3-minute black start, huge physical inertia, full dispatchability. Core pillar of Cameroon grid.',
        equation: 'P = ρ · g · Q · H · η_global',
        badge: 'Filière Vedette'
      },
      {
        titleFr: 'Solaire Photovoltaïque (PV)',
        titleEn: 'Solar Photovoltaic Utility Systems',
        descriptionFr: 'Conversion directe statique par semi-conducteurs, coûts d\'investissement en chute libre, modularité totale, mais absence d\'inertie physique naturelle (onduleurs grid-forming requis).',
        descriptionEn: 'Direct semiconductor conversion, low CapEx, modular scale, zero natural inertia (requiring grid-forming inverters).',
        equation: 'P_ac = η_inv · P_dc_mppt',
        badge: 'Essor Rapide'
      },
      {
        titleFr: 'Énergie Éolienne Terrestre & Offshore',
        titleEn: 'Onshore & Offshore Wind Power',
        descriptionFr: 'Aérodynamique avancée à calage variable, génératrices DFIG ou PMSG à attaque directe, excellente complémentarité avec l\'hydroélectricité.',
        descriptionEn: 'Advanced variable-pitch aerodynamics, DFIG/PMSG drivetrains, strong seasonal complementarity with hydropower.',
        equation: 'P = 0.5 · C_p(λ, β) · ρ · A · v³',
        badge: 'Transition Verte'
      },
      {
        titleFr: 'Centrales Thermiques & Cogénération',
        titleEn: 'Thermal CCGT & Cogeneration',
        descriptionFr: 'Cycles combinés gaz-vapeur (CCGT) à haut rendement (60%), bande de base garantie, démarrage rapide des turbines à gaz industrielles.',
        descriptionEn: 'Combined cycle gas turbines (CCGT) reaching 60% efficiency, firm baseload, high ramp rates.',
        equation: 'η_CCGT = 1 - (1 - η_GT) · (1 - η_ST)',
        badge: 'Garantie de Puissance'
      }
    ]
  },
  {
    id: 'parameters',
    number: 5,
    titleFr: 'Paramètres & Systèmes de Contrôle de Génération',
    titleEn: 'Generation Parameters & Primary Control Systems',
    subtitleFr: 'Régulation de fréquence f-P, régulation de tension U-Q et synchronisation',
    subtitleEn: 'Frequency-power (f-P) control, voltage-reactive (U-Q) control & synchronization',
    icon: 'Sliders',
    color: '#d97706',
    introFr: 'Une centrale électrique ne se contente pas d\'injecter des mégawatts : elle participe activement à la stabilité dynamique du réseau national via ses boucles d\'asservissement en temps réel.',
    introEn: 'A power plant does not simply inject raw megawatts: it actively stabilizes grid frequency and voltage through real-time feedback loops.',
    items: [
      {
        titleFr: 'Régulation Primaire de Fréquence (Statisme s)',
        titleEn: 'Primary Frequency Control (Droop Governor)',
        descriptionFr: 'Asservissement proportionnel du débit de combustible ou d\'eau dès que la fréquence dévie : ΔP = - (1/s) · (Δf / f_nom) · P_nom.',
        descriptionEn: 'Automatic proportional adjustment of turbine input flow upon frequency deviation: ΔP = - (1/s) · (Δf / f_nom) · P_nom.',
        equation: 's = - (Δf / f_nom) / (ΔP / P_nom) · 100%  (typ. 3 à 5%)',
        badge: 'Réponse en < 2 s'
      },
      {
        titleFr: 'Régulateur Automatique de Tension (AVR)',
        titleEn: 'Automatic Voltage Regulator (AVR)',
        descriptionFr: 'Maintient la tension statorique à sa consigne nominale en ajustant instantanément le courant d\'excitation continu rotorique I_f.',
        descriptionEn: 'Maintains stator terminal voltage by continuously adjusting rotor DC excitation current I_f.',
        equation: 'ΔU = K_p · e(t) + K_i · ∫ e(t) dt',
        badge: 'Réponse en < 100 ms'
      },
      {
        titleFr: 'Stabilisateur de Système de Puissance (PSS)',
        titleEn: 'Power System Stabilizer (PSS)',
        descriptionFr: 'Module additionnel de l\'AVR injectant un signal d\'amortissement en avance de phase pour étouffer les oscillations électromécaniques inter-zones (0.2 à 2 Hz).',
        descriptionEn: 'Supplemental AVR loop injecting phase-lead damping torque to suppress low-frequency inter-area oscillations (0.2 - 2 Hz).',
        equation: 'T_amortis = D · Δω_rotor',
        badge: 'Stabilité Dynamique'
      },
      {
        titleFr: 'Conditions de Synchronisation au Réseau (ANSI 25)',
        titleEn: 'Grid Synchronization Conditions (ANSI 25)',
        descriptionFr: 'Quatre conditions physiques obligatoires avant de fermer le disjoncteur groupe : même tension (|ΔU| < 2%), même fréquence (|Δf| < 0.1 Hz), même angle de phase (|Δδ| < 5°) et même ordre de succession des phases.',
        descriptionEn: 'Strict physical criteria before closing generator breaker: equal voltage, frequency, phase angle, and identical phase rotation.',
        equation: 'ΔU ≈ 0  ;  Δf ≈ 0  ;  Δθ ≈ 0  ;  Ordre A-B-C',
        badge: 'Sécurité Critique'
      }
    ]
  },
  {
    id: 'auxiliaries',
    number: 6,
    titleFr: 'Systèmes Auxiliaires de Centrale (Balance of Plant)',
    titleEn: 'Power Plant Auxiliary Systems (BoP)',
    subtitleFr: 'Services propres alternatifs et continus, lubrification, refroidissement et sécurité',
    subtitleEn: 'Station AC/DC auxiliary supplies, lubrication, cooling, compressed air and safety',
    icon: 'Cpu',
    color: '#059669',
    introFr: 'Aucune tranche de production ne peut démarrer ou fonctionner sans son réseau d\'auxiliaires (Balance of Plant - BoP) assurant l\'alimentation des pompes, régulations et circuits de sécurité.',
    introEn: 'No generating unit can start or operate without its internal auxiliary network (Balance of Plant) feeding pumps, controllers and emergency safety systems.',
    items: [
      {
        titleFr: 'Distribution Électrique des Services Propres (400V / 230V)',
        titleEn: 'AC Station Service Distribution (400V / 230V)',
        descriptionFr: 'Tableaux généraux basse tension (TGBT) secourus par transformateurs d\'auxiliaires de groupe (TAG) et transformateurs de soutirage général (TSG).',
        descriptionEn: 'Main low-voltage switchboards fed by unit auxiliary transformers (UAT) and station service transformers (SST).',
        equation: 'P_aux ≈ 1.5% à 5% de la puissance brute usine',
        badge: 'Alimentation Vitale'
      },
      {
        titleFr: 'Système Secouru Courant Continu 110 Vcc / 48 Vcc',
        titleEn: 'DC Backup Power Systems (110 Vdc / 48 Vdc)',
        descriptionFr: 'Batteries d\'accumulateurs étanches plomb-acide ou nickel-cadmium avec chargeurs redondants assurant le déclenchement des protections même en black-out.',
        descriptionEn: 'Station battery banks and redundant rectifiers guaranteeing protection tripping power during total grid blackout.',
        equation: 'Autonomie garantie : 2 à 8 heures sans réseau',
        badge: 'Sécurité Ultime'
      },
      {
        titleFr: 'Centrales d\'Huile de Régulation & Graissage HP',
        titleEn: 'HP Governing & Lubrication Oil Systems',
        descriptionFr: 'Groupes oléohydrauliques à haute pression (100 à 210 bar) avec accumulateurs oléopneumatiques à azote pour la manœuvre du vannage et jacking d\'arbre.',
        descriptionEn: 'High-pressure hydraulic power units with nitrogen accumulators driving guide vane servos and hydrostatic jacking oil.',
        equation: 'Pression nominale : 100 à 210 bar',
        badge: 'Mécanique de Puissance'
      },
      {
        titleFr: 'Groupe Diesel de Secours & Démarrage Autonome (Black Start)',
        titleEn: 'Emergency Diesel Generator & Black Start',
        descriptionFr: 'Groupe électrogène autonome capable de démarrer sans tension réseau pour réalimenter les pompes de lubrification et permettre le démarrage autonome de la centrale.',
        descriptionEn: 'Autonomous diesel genset able to restart with zero grid voltage, energizing vital auxiliaries for national grid restoration.',
        equation: 'Démarrage et prise de charge en < 15 secondes',
        badge: 'Restauration Réseau'
      }
    ]
  }
];
