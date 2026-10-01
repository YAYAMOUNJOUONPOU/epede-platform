// server/services/fieldEngineeringService.ts
// Field Engineering, Commissioning Protocols & Secondary Injection Testing (IEC 60255 / IEC 61936-1)

export interface CommissioningProtocol {
  id: string;
  code: string;
  title: { fr: string; en: string };
  standard: string;
  equipmentType: 'TRANSFORMER' | 'DISTANCE_RELAY' | 'OVERCURRENT_RELAY' | 'SUBSTATION_EARTHING' | 'CIRCUIT_BREAKER';
  testCategory: 'FAT' | 'SAT' | 'PERIODIC_MAINTENANCE';
  requiredTools: string[];
  safetyPrecautions: { fr: string; en: string }[];
  testSteps: {
    step: number;
    description: { fr: string; en: string };
    acceptanceCriteria: { fr: string; en: string };
    tolerance: string;
  }[];
}

export class FieldEngineeringService {
  private protocols: Map<string, CommissioningProtocol> = new Map();

  constructor() {
    this.seedProtocols();
  }

  private seedProtocols() {
    const list: CommissioningProtocol[] = [
      {
        id: 'PROT_RELAY_ANSI_21',
        code: 'SAT_ANSI_21_DISTANCE',
        title: {
          fr: 'Protocole d\'Essai par Injection Secondaire - Relais de Distance ANSI 21 (MiCOM / SIPROTEC / Relion)',
          en: 'Secondary Injection Test Protocol - Distance Protection ANSI 21',
        },
        standard: 'IEC 60255-121 / IEEE C37.113',
        equipmentType: 'DISTANCE_RELAY',
        testCategory: 'SAT',
        requiredTools: [
          'Valise d\'injection triphasée numérique (ex: OMICRON CMC 356 ou Megger SMRT410)',
          'Cordons de test de sécurité 4 mm blindés',
          'Logiciel de test automatisé (Test Universe)',
          'Multimètre étalonné True-RMS CAT IV 600V',
        ],
        safetyPrecautions: [
          {
            fr: 'Débrocher les blocs d\'essais de courant (Essai CT) avant injection pour éviter d\'injecter vers les transformateurs de courant sous tension.',
            en: 'Open test switches / shorting blocks to isolate CT secondary circuits prior to injection.',
          },
          {
            fr: 'Déconnecter la commande de déclenchement 86 (Lockout) ou consigner les bobines de déclenchement du disjoncteur réel.',
            en: 'Isolate trip output contacts (Lockout 86) to prevent unintended breaker tripping during live testing.',
          },
        ],
        testSteps: [
          {
            step: 1,
            description: {
              fr: 'Mesure de l\'angle de ligne et impédance de boucle Zone 1 (0.85 ZL) à Phi = 85°.',
              en: 'Verify Zone 1 loop reach boundary (0.85 ZL) at line characteristic angle 85°.',
            },
            acceptanceCriteria: {
              fr: 'Déclenchement instantané à t < 25 ms avec précision d\'impédance dans le cercle Mho / rectangle.',
              en: 'Instantaneous trip time t < 25 ms within reach envelope.',
            },
            tolerance: '± 3% sur Z1, ± 10 ms sur le temps',
          },
          {
            step: 2,
            description: {
              fr: 'Essai temporisé Zone 2 (1.20 ZL) avec retardement intentionnel (300 ms).',
              en: 'Zone 2 overreaching reach test (1.20 ZL) with 300 ms intentional time delay.',
            },
            acceptanceCriteria: {
              fr: 'Déclenchement temporisé stabilisé à 300 ms.',
              en: 'Definite-time trip confirmed at 300 ms.',
            },
            tolerance: '± 20 ms',
          },
          {
            step: 3,
            description: {
              fr: 'Essai de non-fonctionnement en zone inverse (Zone 4 / Défaut amont).',
              en: 'Reverse directional boundary stability test (Zone 4 behind relay).',
            },
            acceptanceCriteria: {
              fr: 'Absence totale d\'ordre de déclenchement vers le disjoncteur (discrimination directionnelle).',
              en: 'Zero trip command issued; directional blocking verified.',
            },
            tolerance: '100% de blocage',
          },
        ],
      },
      {
        id: 'PROT_RELAY_ANSI_87T',
        code: 'SAT_ANSI_87T_DIFFERENTIAL',
        title: {
          fr: 'Protocole d\'Essai de Protection Différentielle Transformateur ANSI 87T (Retenue Harmonique H2)',
          en: 'Transformer Differential Protection ANSI 87T Secondary Test (2nd Harmonic Restraint)',
        },
        standard: 'IEC 60255-127 / IEEE C37.91',
        equipmentType: 'TRANSFORMER',
        testCategory: 'SAT',
        requiredTools: [
          'Valise d\'injection triphasée 6 courants / 4 tensions (Omicron CMC)',
          'Générateur harmonique programmable (50 Hz fondamental + 100 Hz harmonique 2)',
        ],
        safetyPrecautions: [
          {
            fr: 'Vérifier l\'appariement des rapports de transformation TC côté HTB et TC côté HTA configurés dans le relais.',
            en: 'Verify CT ratio matching and vector group compensation (Dyn11 / YNd11) inside relay software.',
          },
        ],
        testSteps: [
          {
            step: 1,
            description: {
              fr: 'Essai du seuil minimal de sensibilité Idiff_min (0.2 à 0.3 In).',
              en: 'Minimum pickup sensitivity test Idiff_min (0.2 to 0.3 In).',
            },
            acceptanceCriteria: {
              fr: 'Pickup sans courant de traversée au seuil spécifié.',
              en: 'Relay pick-up verified with zero through-current.',
            },
            tolerance: '± 5%',
          },
          {
            step: 2,
            description: {
              fr: 'Caractéristique à pourcentage de retenue à deux pentes (Pente 1 = 30%, Pente 2 = 70%).',
              en: 'Dual-slope percentage restraint curve verification (Slope 1 = 30%, Slope 2 = 70%).',
            },
            acceptanceCriteria: {
              fr: 'Stabilité garantie pour tout défaut externe franc traversant sans saturation des TC.',
              en: 'Complete stability on through-fault currents.',
            },
            tolerance: '± 5% sur Idiff / Irest',
          },
          {
            step: 3,
            description: {
              fr: 'Test de blocage par injection d\'harmonique 2 (courant d\'enclenchement inrush trafo).',
              en: 'Second harmonic inrush restraint blocking test (H2 ratio injection).',
            },
            acceptanceCriteria: {
              fr: 'Blocage immédiat du déclenchement dès que H2 / H1 dépasse 15% (seuil standard CEI).',
              en: 'Trip blocked when 2nd harmonic exceeds 15% of fundamental.',
            },
            tolerance: '± 1% sur le ratio H2',
          },
        ],
      },
      {
        id: 'PROT_EARTHING_GRID_IEEE_81',
        code: 'SAT_GROUNDING_IEEE_81',
        title: {
          fr: 'Mesure de la Résistance du Réseau de Terre de Poste HTB (Méthode de la Chute de Tension à 61.8%)',
          en: 'Substation Grounding Grid Resistance Test (Fall-of-Potential Method per IEEE 81)',
        },
        standard: 'IEEE 81 / IEEE 80 / NF C 13-200',
        equipmentType: 'SUBSTATION_EARTHING',
        testCategory: 'SAT',
        requiredTools: [
          'Telluromètre de terre 4 bornes à fréquence commutable (ex: Chauvin Arnoux CA 6472)',
          'Touret de câble de courant (300 m minimum)',
          'Touret de câble de potentiel (200 m)',
          'Piquets de test en cuivre / acier',
        ],
        safetyPrecautions: [
          {
            fr: 'Ne pas réaliser la mesure par temps orageux (risque de surtension induite sur les câbles de test déroulés).',
            en: 'Never perform grounding grid testing during thunderstorm conditions (lightning surge hazard).',
          },
        ],
        testSteps: [
          {
            step: 1,
            description: {
              fr: 'Positionnement du piquet de courant C2 à une distance d > 5 fois la diagonale du quadrillage du poste.',
              en: 'Place current auxiliary electrode C2 at d > 5x ground grid diagonal dimension.',
            },
            acceptanceCriteria: {
              fr: 'Distance suffisante pour séparer les zones d\'influence des hémisphères de potentiel.',
              en: 'Distinct flat plateau observed on resistance vs distance curve.',
            },
            tolerance: 'Courbe en S avec palier net',
          },
          {
            step: 2,
            description: {
              fr: 'Mesure aux points 50%, 61.8% et 72% de la distance pour identifier le palier de résistance vraie.',
              en: 'Measure at 50%, 61.8% and 72% to confirm horizontal plateau resistance.',
            },
            acceptanceCriteria: {
              fr: 'Résistance globale du poste Rg < 1.0 Ohm (ou < 0.5 Ohm pour 225 kV) afin de respecter les tensions de pas et de toucher.',
              en: 'Overall grid resistance Rg < 1.0 Ohm (or < 0.5 Ohm for 225 kV) per touch voltage limits.',
            },
            tolerance: 'Rg <= 0.5 Ohm',
          },
        ],
      },
    ];

    list.forEach((p) => this.protocols.set(p.id, p));
  }

  public getAllProtocols(): CommissioningProtocol[] {
    return Array.from(this.protocols.values());
  }

  public getProtocolById(id: string): CommissioningProtocol | undefined {
    return this.protocols.get(id);
  }
}

export const fieldEngineeringService = new FieldEngineeringService();
