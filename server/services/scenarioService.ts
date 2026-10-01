// server/services/scenarioService.ts
// Substation Switching Scenario & Interlocking State Machine Engine (IEC 62271-102 / IEC 61936-1)

export type EquipmentStateType = 
  | 'ENERGIZED' 
  | 'DE_ENERGIZED' 
  | 'OPEN' 
  | 'CLOSED' 
  | 'TRIPPED' 
  | 'ISOLATED' 
  | 'EARTHED' 
  | 'UNDER_MAINTENANCE' 
  | 'FAULTED';

export interface InterlockingRule {
  id: string;
  code: string;
  name: { fr: string; en: string };
  standard: string;
  description: { fr: string; en: string };
}

export interface SubstationScenario {
  id: string;
  code: string;
  title: { fr: string; en: string };
  category: 'MAINTENANCE' | 'COMMISSIONING' | 'EMERGENCY_RESTORATION' | 'BUS_TRANSFER';
  voltageLevelKv: number;
  initialStates: Record<string, EquipmentStateType>;
  targetStates: Record<string, EquipmentStateType>;
  steps: {
    sequence: number;
    equipmentId: string;
    equipmentName: string;
    action: 'OPEN' | 'CLOSE' | 'TRIP' | 'EARTH' | 'LOCKOUT';
    safetyCheck: { fr: string; en: string };
    ruleId: string;
  }[];
  notes: { fr: string; en: string };
}

export interface TransitionRequest {
  equipmentId: string;
  action: 'OPEN' | 'CLOSE' | 'EARTH' | 'UNEARTH';
  currentStates: Record<string, EquipmentStateType>;
  adjacentEquipment?: Record<string, EquipmentStateType>;
}

export interface TransitionResult {
  allowed: boolean;
  newState?: EquipmentStateType;
  interlockBlockedReason?: { fr: string; en: string };
  ruleViolated?: InterlockingRule;
  safetyAdvisory?: { fr: string; en: string };
  updatedStates: Record<string, EquipmentStateType>;
}

export class ScenarioService {
  private rules: Map<string, InterlockingRule> = new Map();
  private scenarios: Map<string, SubstationScenario> = new Map();

  constructor() {
    this.seedRules();
    this.seedScenarios();
  }

  private seedRules() {
    const rulesList: InterlockingRule[] = [
      {
        id: 'RULE_DISC_NO_LOAD',
        code: 'IEC_62271_102_SEC_5_11',
        name: {
          fr: 'Interverrouillage Sectionneur Sous Charge',
          en: 'Disconnector Under-Load Interlocking',
        },
        standard: 'IEC 62271-102',
        description: {
          fr: 'Un sectionneur ne peut être manœuvré (ouvert ou fermé) que si le disjoncteur associé est en position OUVERTE.',
          en: 'A disconnector may only be operated (opened or closed) if the associated circuit breaker is in the OPEN position.',
        },
      },
      {
        id: 'RULE_EARTH_NO_VOLTAGE',
        code: 'IEC_62271_102_SEC_5_12',
        name: {
          fr: 'Interdiction de Mise à la Terre Sous Tension',
          en: 'Earthing Switch Closed-on-Voltage Prohibition',
        },
        standard: 'IEC 62271-102 / NF C 13-200',
        description: {
          fr: 'Le sectionneur de mise à la terre (MALT) ne peut être fermé que si tous les sectionneurs d\'isolement amont et aval sont OUVERTS et la tension vérifiée nulle (VAT).',
          en: 'The earthing switch may only close if all upstream/downstream isolating disconnectors are OPEN and absence of voltage is verified.',
        },
      },
      {
        id: 'RULE_BREAKER_EARTH_INTERLOCK',
        code: 'NF_C_13_100_SEC_4',
        name: {
          fr: 'Interverrouillage Enclenchement sur Terre',
          en: 'Closing onto Earth Switch Interlock',
        },
        standard: 'IEC 61936-1',
        description: {
          fr: 'Le disjoncteur principal ne peut être enclenché si le sectionneur de mise à la terre de la travée est FERMÉ.',
          en: 'The main circuit breaker cannot be closed if the bay earthing switch is CLOSED.',
        },
      },
    ];

    rulesList.forEach((r) => this.rules.set(r.id, r));
  }

  private seedScenarios() {
    const list: SubstationScenario[] = [
      {
        id: 'SCENARIO_TRANSFO_MAINTENANCE',
        code: 'S01_MAINT_TRAFO',
        title: {
          fr: 'Consignation & Mise Hors Tension du Transformateur 225/30 kV pour Maintenance',
          en: 'Isolation & Safe De-Energization of 225/30 kV Power Transformer for Maintenance',
        },
        category: 'MAINTENANCE',
        voltageLevelKv: 225,
        initialStates: {
          'CB_HTA_30KV': 'CLOSED',
          'DS_HTA_30KV': 'CLOSED',
          'CB_HTB_225KV': 'CLOSED',
          'DS_HTB_225KV': 'CLOSED',
          'ES_HTB_225KV': 'OPEN',
          'ES_HTA_30KV': 'OPEN',
          'TRAFO_MAIN': 'ENERGIZED',
        },
        targetStates: {
          'CB_HTA_30KV': 'OPEN',
          'DS_HTA_30KV': 'OPEN',
          'CB_HTB_225KV': 'OPEN',
          'DS_HTB_225KV': 'OPEN',
          'ES_HTB_225KV': 'CLOSED',
          'ES_HTA_30KV': 'CLOSED',
          'TRAFO_MAIN': 'EARTHED',
        },
        steps: [
          {
            sequence: 1,
            equipmentId: 'CB_HTA_30KV',
            equipmentName: 'Disjoncteur Arrivée 30 kV',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Délestage et ouverture de la charge côté secondaire 30 kV.',
              en: 'De-energize secondary 30 kV load by opening feeder breaker.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 2,
            equipmentId: 'CB_HTB_225KV',
            equipmentName: 'Disjoncteur Primaire 225 kV',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Coupure du courant à vide magnétisant côté 225 kV.',
              en: 'Interrupt magnetizing no-load current on 225 kV side.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 3,
            equipmentId: 'DS_HTB_225KV',
            equipmentName: 'Sectionneur Ligne 225 kV',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Création de la distance d\'isolement visible 225 kV.',
              en: 'Establish visible isolation air gap on 225 kV side.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 4,
            equipmentId: 'DS_HTA_30KV',
            equipmentName: 'Sectionneur 30 kV',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Isolement physique du jeu de barres HTA 30 kV.',
              en: 'Physical isolation from 30 kV MV busbar.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 5,
            equipmentId: 'ES_HTB_225KV',
            equipmentName: 'Sectionneur MALT 225 kV',
            action: 'CLOSE',
            safetyCheck: {
              fr: 'Vérification d\'absence de tension (VAT) puis mise à la terre et en court-circuit (MALT).',
              en: 'Absence of voltage check (VAT) followed by earthing switch closure.',
            },
            ruleId: 'RULE_EARTH_NO_VOLTAGE',
          },
          {
            sequence: 6,
            equipmentId: 'ES_HTA_30KV',
            equipmentName: 'Sectionneur MALT 30 kV',
            action: 'CLOSE',
            safetyCheck: {
              fr: 'Mise à la terre sécurisée côté basse tension.',
              en: 'Close low-voltage side earthing switch.',
            },
            ruleId: 'RULE_EARTH_NO_VOLTAGE',
          },
        ],
        notes: {
          fr: 'Procédure conforme au décret de consignation UTE C 18-510 et IEC 61936-1. Port des EPI obligatoire (écran facial, gants isolants 36 kV, perche de sauvetage).',
          en: 'Procedure compliant with UTE C 18-510 lock-out / tag-out protocol and IEC 61936-1. Full PPE required.',
        },
      },
      {
        id: 'SCENARIO_BUS_TRANSFER_DOUBLE_BUS',
        code: 'S02_BUS_TRANSFER',
        title: {
          fr: 'Bascule de Jeu de Barres Sans Coupure (Poste Double Barres 225 kV)',
          en: 'On-Load Busbar Transfer Without Power Interruption (225 kV Double Bus)',
        },
        category: 'BUS_TRANSFER',
        voltageLevelKv: 225,
        initialStates: {
          'BUS_COUPLER_CB': 'OPEN',
          'BUS_COUPLER_DS1': 'CLOSED',
          'BUS_COUPLER_DS2': 'CLOSED',
          'FEEDER_DS_BUS1': 'CLOSED',
          'FEEDER_DS_BUS2': 'OPEN',
          'FEEDER_CB': 'CLOSED',
        },
        targetStates: {
          'BUS_COUPLER_CB': 'OPEN',
          'BUS_COUPLER_DS1': 'CLOSED',
          'BUS_COUPLER_DS2': 'CLOSED',
          'FEEDER_DS_BUS1': 'OPEN',
          'FEEDER_DS_BUS2': 'CLOSED',
          'FEEDER_CB': 'CLOSED',
        },
        steps: [
          {
            sequence: 1,
            equipmentId: 'BUS_COUPLER_CB',
            equipmentName: 'Disjoncteur de Couplage Barres',
            action: 'CLOSE',
            safetyCheck: {
              fr: 'Fermeture du disjoncteur de couplage pour égaliser le potentiel entre Barre 1 et Barre 2.',
              en: 'Close bus coupler circuit breaker to equalize potential between Bus 1 and Bus 2.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 2,
            equipmentId: 'FEEDER_DS_BUS2',
            equipmentName: 'Sectionneur Départ vers Barre 2',
            action: 'CLOSE',
            safetyCheck: {
              fr: 'Fermeture du sectionneur vers la nouvelle barre en parallèle (sans différence de potentiel).',
              en: 'Close feeder disconnector onto Bus 2 in parallel (zero potential difference).',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 3,
            equipmentId: 'FEEDER_DS_BUS1',
            equipmentName: 'Sectionneur Départ vers Barre 1',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Ouverture du sectionneur de l\'ancienne barre (courant dérivé par Barre 2).',
              en: 'Open feeder disconnector from old Bus 1 (current redirected via Bus 2).',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
          {
            sequence: 4,
            equipmentId: 'BUS_COUPLER_CB',
            equipmentName: 'Disjoncteur de Couplage Barres',
            action: 'OPEN',
            safetyCheck: {
              fr: 'Réouverture du couplage après achèvement du transfert.',
              en: 'Reopen bus coupler breaker after transfer completion.',
            },
            ruleId: 'RULE_DISC_NO_LOAD',
          },
        ],
        notes: {
          fr: 'Permet de transférer les départs entre barres sans interrompre les clients industriels ni la transmission.',
          en: 'Enables feeder transfer between busbars without disconnecting transmission clients.',
        },
      },
    ];

    list.forEach((s) => this.scenarios.set(s.id, s));
  }

  public getAllScenarios(): SubstationScenario[] {
    return Array.from(this.scenarios.values());
  }

  public getScenarioById(id: string): SubstationScenario | undefined {
    return this.scenarios.get(id);
  }

  public getAllRules(): InterlockingRule[] {
    return Array.from(this.rules.values());
  }

  // Validate state transition against electrical interlocking rules
  public validateTransition(req: TransitionRequest): TransitionResult {
    const { equipmentId, action, currentStates } = req;
    const states = { ...currentStates };

    // Case 1: Operating a Disconnector (DS)
    if (equipmentId.includes('DS')) {
      const associatedCbId = equipmentId.replace('DS', 'CB');
      const associatedCbState = states[associatedCbId] || 'CLOSED';

      // Disconnector cannot open or close if associated breaker is CLOSED
      if (associatedCbState === 'CLOSED') {
        const rule = this.rules.get('RULE_DISC_NO_LOAD')!;
        return {
          allowed: false,
          interlockBlockedReason: {
            fr: `Interverrouillage actif : Impossible de manœuvrer le sectionneur ${equipmentId} car le disjoncteur ${associatedCbId} est FERMÉ sous charge.`,
            en: `Interlock blocked: Cannot operate disconnector ${equipmentId} while circuit breaker ${associatedCbId} is CLOSED under load.`,
          },
          ruleViolated: rule,
          safetyAdvisory: {
            fr: 'Ouvrez d\'abord le disjoncteur pour couper le courant de charge avant toute manœuvre de sectionneur.',
            en: 'Trip the circuit breaker first to interrupt the load current before operating disconnectors.',
          },
          updatedStates: states,
        };
      }
    }

    // Case 2: Closing an Earthing Switch (ES)
    if (equipmentId.includes('ES') && action === 'CLOSE') {
      const associatedDsId = equipmentId.replace('ES', 'DS');
      const associatedDsState = states[associatedDsId];

      if (associatedDsState === 'CLOSED') {
        const rule = this.rules.get('RULE_EARTH_NO_VOLTAGE')!;
        return {
          allowed: false,
          interlockBlockedReason: {
            fr: `DANGER DE COURT-CIRCUIT : Le sectionneur d'isolement ${associatedDsId} est encore FERMÉ. Mise à la terre interdite.`,
            en: `SHORT-CIRCUIT HAZARD: Isolating disconnector ${associatedDsId} is still CLOSED. Earthing switch is interlocked.`,
          },
          ruleViolated: rule,
          safetyAdvisory: {
            fr: 'Ouvrez le sectionneur d\'isolement et vérifiez l\'absence de tension (VAT) avant d\'enclencher la MALT.',
            en: 'Open isolation disconnector and verify absence of voltage before closing earthing switch.',
          },
          updatedStates: states,
        };
      }
    }

    // Case 3: Closing a Circuit Breaker (CB) when Earthing Switch is Closed
    if (equipmentId.includes('CB') && action === 'CLOSE') {
      const associatedEsId = equipmentId.replace('CB', 'ES');
      const associatedEsState = states[associatedEsId];

      if (associatedEsState === 'CLOSED') {
        const rule = this.rules.get('RULE_BREAKER_EARTH_INTERLOCK')!;
        return {
          allowed: false,
          interlockBlockedReason: {
            fr: `INTERDICTION CRITIQUE : La mise à la terre ${associatedEsId} est FERMÉE. Enclenchement disjoncteur bloqué.`,
            en: `CRITICAL INTERLOCK: Earthing switch ${associatedEsId} is CLOSED. Breaker closing is blocked.`,
          },
          ruleViolated: rule,
          safetyAdvisory: {
            fr: 'Ouvrez le sectionneur de terre (MALT) avant d\'enclencher le disjoncteur pour éviter d\'enclencher sur court-circuit franc.',
            en: 'Open earthing switch prior to breaker re-energization to prevent closing onto bolted ground fault.',
          },
          updatedStates: states,
        };
      }
    }

    // Transition authorized!
    const newState: EquipmentStateType = action === 'CLOSE' ? 'CLOSED' : action === 'OPEN' ? 'OPEN' : action === 'EARTH' ? 'EARTHED' : 'OPEN';
    states[equipmentId] = newState;

    return {
      allowed: true,
      newState,
      updatedStates: states,
      safetyAdvisory: {
        fr: `Manœuvre autorisée et exécutée avec succès sur ${equipmentId}. Nouvel état : ${newState}.`,
        en: `Interlocks verified. Action executed on ${equipmentId}. New state: ${newState}.`,
      },
    };
  }
}

export const scenarioService = new ScenarioService();
