// src/components/reference/modules/EquipmentFmeaMatrixViewer.tsx
// EPEDE - Apparatus Failure Modes & Effects Analysis (FMEA / AMDEC) & Diagnostic Testing Engine
// Standardized in compliance with IEC 60812, CIGRE WG TBs (A2/A3/B3) and IEEE C37/C57 series.

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Wrench,
  Thermometer,
  Search,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  ChevronDown,
  ChevronRight,
  Info,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';
import { soundEffects } from '../../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../../trust/EvidenceTrustBadge';

interface FmeaRecord {
  id: string;
  subsystem: { fr: string; en: string };
  failureMode: { fr: string; en: string };
  rootCause: { fr: string; en: string };
  effect: { fr: string; en: string };
  severity: number; // 1-10
  occurrence: number; // 1-10
  detection: number; // 1-10
  diagnosticMethod: { fr: string; en: string };
  mitigation: { fr: string; en: string };
  standardRef: string;
}

interface EquipmentFmeaMatrixViewerProps {
  equipment: CanonicalEquipmentObject;
  locale: 'fr' | 'en';
}

export const EquipmentFmeaMatrixViewer: React.FC<EquipmentFmeaMatrixViewerProps> = ({
  equipment,
  locale
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [customRpnRecord, setCustomRpnRecord] = useState<string | null>(null);
  const [customS, setCustomS] = useState<number>(8);
  const [customO, setCustomO] = useState<number>(4);
  const [customD, setCustomD] = useState<number>(3);

  // Generate domain-accurate FMEA records based on equipment archetype
  const fmeaRecords = useMemo<FmeaRecord[]>(() => {
    const cat = equipment.category;
    const id = equipment.id.toLowerCase();
    const type = (equipment.equipmentType || '').toLowerCase();

    if (cat === 'TRANSFORMER' || id.includes('trafo') || id.includes('kiosk')) {
      return [
        {
          id: 'TR-FMEA-01',
          subsystem: { fr: 'Isolation Huile / Papier', en: 'Oil / Paper Insulation' },
          failureMode: {
            fr: 'Dégradation diélectrique & formation de gaz dissous (DGA)',
            en: 'Dielectric degradation & Dissolved Gas generation (DGA)'
          },
          rootCause: {
            fr: 'Points chauds thermiques locaux (>300°C), arcs de faible énergie, humidité résiduelle',
            en: 'Local thermal hot-spots (>300°C), low energy arcing, residual moisture'
          },
          effect: {
            fr: 'Perte de rigidité diélectrique, claquage entre spires, déclenchement Buchholz 63',
            en: 'Loss of dielectric strength, inter-turn breakdown, Buchholz 63 trip'
          },
          severity: 9,
          occurrence: 4,
          detection: 2,
          diagnosticMethod: {
            fr: 'Chromatographie DGA en ligne (Duval Triangle), mesure Tan Delta / C1-C2, teneur en eau Karl Fischer',
            en: 'Online DGA chromatography (Duval Triangle), Tan Delta / C1-C2 test, Karl Fischer water content'
          },
          mitigation: {
            fr: 'Traitement sous vide dégazage huile, régénération silicagel, régulation thermique forcée',
            en: 'Oil vacuum degassing & filtration, silica gel breathers replacement, forced cooling audit'
          },
          standardRef: 'IEC 60599 / IEEE C57.104'
        },
        {
          id: 'TR-FMEA-02',
          subsystem: { fr: 'Enroulements & Cales de Serrage', en: 'Windings & Clamping Structure' },
          failureMode: {
            fr: 'Déformation mécanique et basculement des disques sous court-circuit',
            en: 'Mechanical deformation & disk tilting under short-circuit forces'
          },
          rootCause: {
            fr: 'Forces électrodynamiques radiales/axiales répétées lors de défauts externes de réseau',
            en: 'Repeated radial/axial electrodynamic forces during through-fault short-circuits'
          },
          effect: {
            fr: 'Rupture d’isolation solide, court-circuit entre phases, explosion interne de cuve',
            en: 'Solid insulation tearing, phase-to-phase internal flashover, tank overpressure'
          },
          severity: 10,
          occurrence: 3,
          detection: 3,
          diagnosticMethod: {
            fr: 'Analyse de Réponse Fréquentielle SFRA (IEC 60076-18), Impédance de court-circuit basse tension (%Z)',
            en: 'Sweep Frequency Response Analysis SFRA (IEC 60076-18), Low voltage short-circuit impedance (%Z)'
          },
          mitigation: {
            fr: 'Vérification du serrage des cales, coordination des protections rapides différentielles 87T',
            en: 'Winding clamping re-torqueing during major overhaul, high-speed 87T diff protection'
          },
          standardRef: 'IEC 60076-5 / CIGRE TB 342'
        },
        {
          id: 'TR-FMEA-03',
          subsystem: { fr: 'Changeur de Prises en Charge (OLTC)', en: 'On-Load Tap Changer (OLTC)' },
          failureMode: {
            fr: 'Usure / grippage des contacts d’arc et désynchronisation du mécanisme inverseur',
            en: 'Arcing contact erosion, diverter mechanism binding and tap desynchronization'
          },
          rootCause: {
            fr: 'Nombre élevé de manœuvres, vieillissement de l’huile du compartiment OLTC, fatigue des ressorts',
            en: 'High tap operations count, diverter oil carbonization, spring fatigue'
          },
          effect: {
            fr: 'Court-circuit franc entre prises de réglage, surintensité massive, avarie majeure',
            en: 'Direct inter-tap short circuit, circulating short-circuit current, catastrophic failure'
          },
          severity: 9,
          occurrence: 4,
          detection: 3,
          diagnosticMethod: {
            fr: 'Mesure de résistance dynamique de contact (DRM), analyse acoustique de commutation OLTC',
            en: 'Dynamic Resistance Measurement (DRM), vibration/acoustic tap transition signature'
          },
          mitigation: {
            fr: 'Filtration continue sous pression de l’huile OLTC, remplacement des contacts après 100k manœuvres',
            en: 'Continuous OLTC oil filtration skid, scheduled contact replacement every 100k ops'
          },
          standardRef: 'IEC 60214-1'
        },
        {
          id: 'TR-FMEA-04',
          subsystem: { fr: 'Traversées Condensateur HT (Bushings)', en: 'HV Condenser Bushings' },
          failureMode: {
            fr: 'Perforation diélectrique des feuillards RIP / OIP et claquage externe',
            en: 'Dielectric puncture of RIP/OIP foil gradings and catastrophic explosion'
          },
          rootCause: {
            fr: 'Infiltration d’humidité par joint torique dégradé, décharges partielles internes persistantes',
            en: 'Moisture ingress through weathered seal gaskets, persistent internal partial discharges'
          },
          effect: {
            fr: 'Court-circuit phase-terre HT, incendie d’huile de cuve, arrêt d’exploitation prolongé',
            en: 'HV phase-to-ground flashover, porcelain fragmentation, tank fire risk'
          },
          severity: 10,
          occurrence: 2,
          detection: 2,
          diagnosticMethod: {
            fr: 'Mesure continue de Tan Delta C1/C2 en ligne, thermographie infrarouge de la tête de traversée',
            en: 'Online continuous Tan Delta C1/C2 monitoring, infrared thermography of terminal clamp'
          },
          mitigation: {
            fr: 'Adoption de traversées type RIP (Resin Impregnated Paper) avec isolateurs silicones composite',
            en: 'Retrofit to RIP (Resin Impregnated Paper) dry bushings with silicone composite insulators'
          },
          standardRef: 'IEC 60137 / IEEE C57.19.00'
        }
      ];
    }

    if (cat === 'SWITCHGEAR' || id.includes('cb') || id.includes('gis') || id.includes('breaker') || type.includes('breaker')) {
      return [
        {
          id: 'CB-FMEA-01',
          subsystem: { fr: 'Chambre de Coupure SF6 / Vide', en: 'Interrupter Chamber (SF6 / Vacuum)' },
          failureMode: {
            fr: 'Refus de coupure de court-circuit par érosion des contacts d’arc ou chute de pression gaz',
            en: 'Failure to clear short-circuit fault due to contact ablation or gas density drop'
          },
          rootCause: {
            fr: 'Cumul des kA coupés supérieur à la limite nominale, fuite de garniture dynamique, piètre qualité SF6',
            en: 'Accumulated interrupted kA exceeding endurance curve, gasket leakage, SF6 humidity'
          },
          effect: {
            fr: 'Destruction de la cellule, arc interne non éteint, cascade de défaut sur jeu de barres',
            en: 'Switchgear tank rupture, persistent internal arc, busbar cascade outage'
          },
          severity: 10,
          occurrence: 2,
          detection: 2,
          diagnosticMethod: {
            fr: 'Densistat compensé en température (Seuil 1 alarme / Seuil 2 verrouillage 52BL), caméra optique gaz FLIR SF6',
            en: 'Temperature compensated densimeter (Stage 1 alarm / Stage 2 lock 52BL), FLIR optical gas imaging'
          },
          mitigation: {
            fr: 'Verrouillage électrique d’ouverture sous pression critique, surveillance continue I²t cumulé',
            en: 'Safety electrical trip lockout below min pressure, continuous cumulative I²t tracking'
          },
          standardRef: 'IEC 62271-100 / IEC 62271-4'
        },
        {
          id: 'CB-FMEA-02',
          subsystem: { fr: 'Commande Mécanique à Ressorts / Moteur', en: 'Spring Operating Mechanism / Motor' },
          failureMode: {
            fr: 'Refus de fermeture (52X) ou temps de manœuvre anormal (>60ms)',
            en: 'Failure to close (52X) or abnormal opening/closing travel time (>60ms)'
          },
          rootCause: {
            fr: 'Gommage des graisses, grippage des cames de réarmement, rupture de ressort de déclenchement',
            en: 'Grease hardened from cold/aging, linkage pin friction, trip latch spring fatigue'
          },
          effect: {
            fr: 'Non-élimination sélective d’un défaut aval, déclenchement général en amont',
            en: 'Loss of selective fault isolation, upstream backup protection trip'
          },
          severity: 8,
          occurrence: 4,
          detection: 3,
          diagnosticMethod: {
            fr: 'Analyseur de temps de manœuvre (CBA), enregistrement de courbe de courant des bobines 52TC/52CC',
            en: 'Circuit Breaker Timer/Analyzer (CBA), 52TC/52CC trip/close coil current signature'
          },
          mitigation: {
            fr: 'Nettoyage et graissage aux lubrifiants synthétiques basse température (Aeroshell), cycle préventif annuel',
            en: 'Synthetic low-temp grease lubrication, yearly scheduled exercise cycle'
          },
          standardRef: 'IEC 62271-1 / CIGRE TB 510'
        },
        {
          id: 'CB-FMEA-03',
          subsystem: { fr: 'Bobines de Déclenchement & Circuits Auxiliaires', en: 'Trip Coils & Secondary Auxiliaries' },
          failureMode: {
            fr: 'Bobine de déclenchement 52TC coupée ou circuit de commande ouvert',
            en: 'Open-circuit or burned trip coil (52TC), defective auxiliary limit switch'
          },
          rootCause: {
            fr: 'Surtension continue de batterie, surchauffe par maintien prolongé sans coupure de fin de course',
            en: 'Station battery transient overvoltage, coil kept energized due to stuck auxiliary contact'
          },
          effect: {
            fr: 'Refus absolu d’ouverture sur ordre de protection différentielle ou surintensité',
            en: 'Total failure to open on protection relay command (50/51/87)'
          },
          severity: 10,
          occurrence: 2,
          detection: 1,
          diagnosticMethod: {
            fr: 'Surveillance continue du circuit de déclenchement TCS (Trip Circuit Supervision - ANSI 74TC)',
            en: 'Continuous ANSI 74TC Trip Circuit Supervision across pre-closed & open states'
          },
          mitigation: {
            fr: 'Double bobine de déclenchement indépendante (TC1 / TC2) sur sources auxiliaires CC séparées',
            en: 'Dual independent trip coils (TC1 / TC2) powered by redundant DC battery banks'
          },
          standardRef: 'IEEE C37.09 / IEC 60255'
        }
      ];
    }

    if (cat === 'GENERATION' || id.includes('gen') || id.includes('motor') || id.includes('vfd')) {
      return [
        {
          id: 'ROT-FMEA-01',
          subsystem: { fr: 'Isolation Bobinage Stator HT', en: 'HV Stator Winding Insulation' },
          failureMode: {
            fr: 'Claquage diélectrique phase-masse ou décharges partielles dans les encoches',
            en: 'Phase-to-ground dielectric breakdown or slot partial discharges'
          },
          rootCause: {
            fr: 'Effort électrodynamique 100 Hz, décollement du vernis semi-conducteur, vieillissement thermique classe F',
            en: '100 Hz electrodynamic vibration, semiconductor corona shielding erosion, thermal cycling'
          },
          effect: {
            fr: 'Court-circuit statorique franc, fusion locale du circuit magnétique, arrêt usine',
            en: 'Severe stator earth fault, core iron melting, extended generator unavailability'
          },
          severity: 10,
          occurrence: 3,
          detection: 2,
          diagnosticMethod: {
            fr: 'Surveillance continue des DP (capteurs capacitifs 80 pF), mesure de polarisation / index PI',
            en: 'Continuous PD monitoring (80 pF capacitive couplers), Polarization Index (PI) & Hipot'
          },
          mitigation: {
            fr: 'Imprégnation sous vide VPI, recalage des barres Roebel, surveillance thermique RTD Pt100',
            en: 'Vacuum Pressure Impregnation (VPI), slot wedge tightness checks, Pt100 RTD protection 49S'
          },
          standardRef: 'IEC 60034-27 / IEEE 1434'
        },
        {
          id: 'ROT-FMEA-02',
          subsystem: { fr: 'Paliers Mécaniques & Courants d’Arbre', en: 'Bearings & Shaft Grounding Currents' },
          failureMode: {
            fr: 'Cannelures, piqûres d’étincelage (EDM) et grippage des roulements ou coussinets',
            en: 'Fluting, EDM micro-spark pitting and bearing seizure'
          },
          rootCause: {
            fr: 'Tension résiduelle d’arbre induite par le découpage PWM de l’onduleur ou asymétrie de flux',
            en: 'High-frequency shaft voltage induced by VFD inverter PWM common-mode switching'
          },
          effect: {
            fr: 'Vibrations sévères, échauffement excessif, destruction de la ligne d’arbre',
            en: 'Severe machine vibration, bearing thermal run-away, shaft mechanical damage'
          },
          severity: 8,
          occurrence: 5,
          detection: 2,
          diagnosticMethod: {
            fr: 'Analyse spectrale de vibrations FFT (ISO 10816), brosse de mesure de potentiel d’arbre',
            en: 'Vibration spectrum FFT analysis (ISO 10816), shaft voltage probe & discharge counter'
          },
          mitigation: {
            fr: 'Installation de bague de mise à la terre d’arbre à microfibres et roulements céramiques isolés',
            en: 'Shaft grounding micro-fiber ring installation, hybrid ceramic isolated bearings'
          },
          standardRef: 'IEC 60034-25 / NEMA MG-1'
        },
        {
          id: 'ROT-FMEA-03',
          subsystem: { fr: 'Système d’Excitation & Diodes Tournantes', en: 'Excitation System & Rotating Diodes' },
          failureMode: {
            fr: 'Court-circuit ou coupure d’une diode du pont tournant sans balais',
            en: 'Short-circuit or open-circuit failure of rotating diode on brushless exciter'
          },
          rootCause: {
            fr: 'Surtension transitoire lors de défauts réseau, emballement thermique par mauvais contact de serrage',
            en: 'Grid fault transient inverse voltage, thermal overload from loose torque mounting'
          },
          effect: {
            fr: 'Ondulation de courant d’excitation, perte de puissance réactive, déclenchement 40 (perte de champ)',
            en: 'Severe rotor field current ripple, loss of reactive capability, ANSI 40 trip'
          },
          severity: 9,
          occurrence: 3,
          detection: 3,
          diagnosticMethod: {
            fr: 'Détection d’ondulation d’induit d’excitatrice (ANSI 58), relais de perte de synchronisme 78',
            en: 'Exciter field current harmonic ripple detection (ANSI 58), out-of-step relay 78'
          },
          mitigation: {
            fr: 'Pont de diodes redondant N+1, varistances de protection RC montées sur la roue polaire',
            en: 'N+1 redundant diode bridge configuration, high-energy surge suppressor on rotor shaft'
          },
          standardRef: 'IEEE C50.13 / IEC 60034-16'
        }
      ];
    }

    // Default electro-technical FMEA records
    return [
      {
        id: 'GEN-FMEA-01',
        subsystem: { fr: 'Connexions & Plages de Raccordement', en: 'Terminals & Power Connections' },
        failureMode: {
          fr: 'Échauffement excessif par augmentation de résistance de contact',
          en: 'Excessive thermal hot-spot due to high contact resistance'
        },
        rootCause: {
          fr: 'Desserrage mécanique, corrosion galvanique bimétallique Cu-Al, couple de serrage inadéquat',
          en: 'Mechanical loosening under vibration, galvanic Cu-Al corrosion, improper torque setting'
        },
        effect: {
          fr: 'Fusion des plages de contact, amorçage d’arc électrique, départ d’incendie',
          en: 'Terminal lug melting, arc flash initiation, equipment room fire hazard'
        },
        severity: 8,
        occurrence: 4,
        detection: 2,
        diagnosticMethod: {
          fr: 'Campagne thermographique infrarouge périodique (ISO 18434), contrôle dynamométrique calibré',
          en: 'Periodic infrared thermography (ISO 18434), calibrated torque wrench inspection'
        },
        mitigation: {
          fr: 'Utilisation de rondelles Belleville élastiques et graisse de contact antioxydante neutre',
          en: 'Belleville spring washers installation and neutral antioxidant contact compound'
        },
        standardRef: 'NF C 15-100 / IEC 60364-5-52'
      },
      {
        id: 'GEN-FMEA-02',
        subsystem: { fr: 'Enveloppe & Protection Environnementale (IP/IK)', en: 'Enclosure & Environmental Sealing (IP/IK)' },
        failureMode: {
          fr: 'Infiltration d’humidité, condensation et intrusion de poussières conductrices',
          en: 'Moisture ingress, internal condensation and conductive dust deposition'
        },
        rootCause: {
          fr: 'Joint d’étanchéité craquelé, panne de la résistance de chauffage anticondensation, corrosion de cuve',
          en: 'Degraded gasket rubber, anticondensation space heater failure, enclosure corrosion'
        },
        effect: {
          fr: 'Baisse d’isolement diélectrique globale, contournement diélectrique de jeu de barres',
          en: 'Global insulation degradation, flashover across support insulators'
        },
        severity: 8,
        occurrence: 3,
        detection: 2,
        diagnosticMethod: {
          fr: 'Mesure périodique de résistance d’isolement (Mégohmmètre 1000V/5000V), hygromètre connecté',
          en: 'Periodic insulation resistance test (Megger 1kV/5kV), connected relative humidity probe'
        },
        mitigation: {
          fr: 'Contrôle automatique du chauffage par hygrostat, remplacement décennal des joints EPDM',
          en: 'Automated hygrostat-controlled heating, scheduled EPDM gasket replacement'
        },
        standardRef: 'IEC 60529 / IEC 62262'
      },
      {
        id: 'GEN-FMEA-03',
        subsystem: { fr: 'Circuit de Mise à la Terre & Équipotentialité', en: 'Earthing & Equipotential Bonding' },
        failureMode: {
          fr: 'Rupture de la tresse de masse ou augmentation d’impédance de terre (>30 Ω)',
          en: 'Broken earthing braid or elevated ground loop impedance (>30 ohms)'
        },
        rootCause: {
          fr: 'Corrosion tellurique du feuillard, desserrage de bride de masse, sectionnement accidentel',
          en: 'Soil galvanic corrosion of ground strip, loose earth boss bolt, accidental severance'
        },
        effect: {
          fr: 'Tension de contact et de pas dangereuse pour le personnel (choc électrique grave)',
          en: 'Dangerous touch and step voltages under fault conditions (lethal shock hazard)'
        },
        severity: 10,
        occurrence: 2,
        detection: 2,
        diagnosticMethod: {
          fr: 'Mesure de boucle de terre par méthode des 3 piquets (Wenner/Schlumberger), test de continuité 200mA',
          en: '3-point earth resistance fall-of-potential test, low-resistance 200mA continuity check'
        },
        mitigation: {
          fr: 'Doublage systématique des tresses de terre en cuivre étamé et contrôles réglementaires semestriels',
          en: 'Dual redundant tinned copper earth straps and mandatory regulatory audits'
        },
        standardRef: 'IEEE 80 / IEC 60364-4-41'
      }
    ];
  }, [equipment]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (selectedCategory === 'ALL') return fmeaRecords;
    return fmeaRecords.filter((r) => r.id === selectedCategory);
  }, [fmeaRecords, selectedCategory]);

  // Selected record for deep-dive
  const activeRecord = useMemo(() => {
    return fmeaRecords.find((r) => r.id === (selectedRecordId || fmeaRecords[0]?.id)) || fmeaRecords[0];
  }, [fmeaRecords, selectedRecordId]);

  // Live RPN Calculation helper
  const getRpnSeverityBadge = (rpn: number) => {
    if (rpn >= 200) {
      return {
        label: locale === 'fr' ? 'CRITIQUE (Action Immédiate)' : 'CRITICAL (Immediate Action)',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        barColor: 'bg-rose-500'
      };
    }
    if (rpn >= 100) {
      return {
        label: locale === 'fr' ? 'ÉLEVÉ (Surveillance CBM)' : 'HIGH (CBM Monitoring)',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        barColor: 'bg-amber-500'
      };
    }
    if (rpn >= 40) {
      return {
        label: locale === 'fr' ? 'MOYEN (Maintenance Programmée)' : 'MEDIUM (Scheduled PM)',
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        barColor: 'bg-yellow-500'
      };
    }
    return {
      label: locale === 'fr' ? 'FAIBLE (Acceptable)' : 'LOW (Acceptable)',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      barColor: 'bg-emerald-500'
    };
  };

  const calculatedCustomRpn = customS * customO * customD;
  const customRpnMeta = getRpnSeverityBadge(calculatedCustomRpn);

  return (
    <div className="space-y-6">
      {/* Header Banner with Trust Reference */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{locale === 'fr' ? 'Analyse des Modes de Défaillance & Diagnostic (AMDEC / FMEA)' : 'Failure Modes & Effects Analysis (FMEA / Diagnostics)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IEC 60812 / CIGRE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {locale === 'fr'
                ? `Matrice de criticité RPN (Sévérité × Occurrence × Détection) et protocoles de surveillance d'état pour ${equipment.name[locale]}.`
                : `RPN Criticality Matrix (Severity × Occurrence × Detection) and condition diagnostic workflows for ${equipment.name[locale]}.`}
            </p>
          </div>
        </div>

        <EvidenceTrustBadge
          type="VERIFIED_STANDARD"
          governingStandard="IEC 60812 / CIGRE WG"
          locale={locale}
        />
      </div>

      {/* Main Grid: FMEA Matrix Table (Left) + Interactive RPN & Diagnostics Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FMEA Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'Modes de Défaillances Identifiés' : 'Identified Failure Modes'} ({fmeaRecords.length})</span>
            </span>

            <div className="flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3 text-slate-500" />
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Tous' : 'All'}
              </button>
              {fmeaRecords.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => {
                    soundEffects.playSwitchClick();
                    setSelectedCategory(rec.id);
                    setSelectedRecordId(rec.id);
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedCategory === rec.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rec.id}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const rpn = record.severity * record.occurrence * record.detection;
              const meta = getRpnSeverityBadge(rpn);
              const isSelected = activeRecord.id === record.id;

              return (
                <div
                  key={record.id}
                  onClick={() => {
                    soundEffects.playSwitchClick();
                    setSelectedRecordId(record.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {record.id}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {record.subsystem[locale]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                        RPN: {rpn} ({meta.label.split(' ')[0]})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-amber-300/90 mb-2">
                    ⚠️ {record.failureMode[locale]}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-slate-800/60 text-[11px] font-mono">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">S (Sévérité)</span>
                      <span className="font-bold text-rose-400">{record.severity} / 10</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">O (Occurrence)</span>
                      <span className="font-bold text-amber-400">{record.occurrence} / 10</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">D (Détection)</span>
                      <span className="font-bold text-emerald-400">{record.detection} / 10</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p>
                      <strong className="text-slate-300">{locale === 'fr' ? 'Cause Racine :' : 'Root Cause:'}</strong>{' '}
                      {record.rootCause[locale]}
                    </p>
                    <p>
                      <strong className="text-slate-300">{locale === 'fr' ? 'Effet Système :' : 'System Effect:'}</strong>{' '}
                      {record.effect[locale]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Diagnostics & Custom RPN Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Failure Deep-Dive Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-800/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">
                  {locale === 'fr' ? 'Diagnostic & Atténuation en Ligne' : 'Online Diagnostics & Mitigation'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {activeRecord.id}
              </span>
            </div>

            {/* Diagnostic Method */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>{locale === 'fr' ? 'Méthode de Diagnostic Recommandée' : 'Recommended Diagnostic Method'}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {activeRecord.diagnosticMethod[locale]}
              </p>
              <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{locale === 'fr' ? 'Référentiel Normatif :' : 'Governing Standard:'}</span>
                <span className="font-bold text-slate-300">{activeRecord.standardRef}</span>
              </div>
            </div>

            {/* Mitigation / Preventive Actions */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Actions Préventives & Atténuation' : 'Preventive Actions & Mitigation'}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRecord.mitigation[locale]}
              </p>
            </div>
          </div>

          {/* Interactive RPN Risk Calculator / Sensitivity Slider */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Simulateur de Criticité RPN (IEC 60812)' : 'Interactive RPN Sensitivity Simulator'}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">RPN = S × O × D</span>
            </div>

            {/* Calculated RPN Output */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Score RPN Calculé' : 'Calculated RPN Score'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-white">{calculatedCustomRpn}</span>
                  <span className="text-[11px] text-slate-500">/ 1000 max</span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${customRpnMeta.color}`}>
                {customRpnMeta.label}
              </div>
            </div>

            {/* Slider S */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{locale === 'fr' ? 'Sévérité de l\'impact (S) :' : 'Severity of Impact (S):'}</span>
                <span className="font-bold font-mono text-rose-400">{customS} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={customS}
                onChange={(e) => {
                  soundEffects.playSliderTick();
                  setCustomS(Number(e.target.value));
                }}
                className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider O */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{locale === 'fr' ? 'Probabilité d\'Occurrence (O) :' : 'Occurrence Probability (O):'}</span>
                <span className="font-bold font-mono text-amber-400">{customO} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={customO}
                onChange={(e) => {
                  soundEffects.playSliderTick();
                  setCustomO(Number(e.target.value));
                }}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider D */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{locale === 'fr' ? 'Non-Détectabilité (D, 1=Facile, 10=Invisible) :' : 'Undetectability (D, 1=Easy, 10=Hidden):'}</span>
                <span className="font-bold font-mono text-emerald-400">{customD} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={customD}
                onChange={(e) => {
                  soundEffects.playSliderTick();
                  setCustomD(Number(e.target.value));
                }}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
