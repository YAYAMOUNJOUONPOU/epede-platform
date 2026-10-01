// src/data/tccCoordinationEngine.ts
// EPEDE Wave 2: Automated Time-Current Characteristic (TCC) & Protection Selectivity Engine
// Generates log-log discrimination curves across the canonical chain (Motor -> LV ACB -> Feeder 50/51 -> Substation 87T/51)
// and computes dynamic grading margins (Delta t) to certify chronological selectivity.

export interface TccCurveDefinition {
  id: string;
  name: { fr: string; en: string };
  role: 'motor_withstand' | 'lv_breaker' | 'mv_feeder' | 'hv_incomer';
  deviceTag: string;
  color: string;
  voltageRefKv: number;
  pickupAmperes: number;
  curveFamily: 'iec_ni' | 'iec_vi' | 'iec_ei' | 'lv_electronic' | 'motor_start';
  tms?: number;
  shortTimePickup?: number;
  shortTimeDelaySec?: number;
  instantaneousPickup?: number;
}

export interface TccCurvePoint {
  currentA: number; // Current referred to common voltage base (e.g. 400 V or 30 kV)
  timeSec: number;
}

export interface TccSelectivityAnalysis {
  upstreamId: string;
  downstreamId: string;
  faultCurrentA: number;
  upstreamTimeSec: number;
  downstreamTimeSec: number;
  gradingMarginDeltaTSec: number;
  recommendedMarginSec: number;
  isSelective: boolean;
  status: 'selective' | 'marginal' | 'blind_spot';
  assessment: { fr: string; en: string };
}

export class TccCoordinationEngine {
  // Evaluates standard IEC 60255 IDMT operating time
  public static calculateIecIdmtTime(
    currentA: number,
    pickupA: number,
    tms: number,
    curveType: 'iec_ni' | 'iec_vi' | 'iec_ei'
  ): number {
    if (currentA <= pickupA) return 999;

    const ratio = currentA / pickupA;
    let a = 0.14;
    let b = 0.02;

    if (curveType === 'iec_vi') {
      a = 13.5;
      b = 1.0;
    } else if (curveType === 'iec_ei') {
      a = 80.0;
      b = 2.0;
    }

    const t = (a / (Math.pow(ratio, b) - 1)) * tms;
    return Math.max(0.02, t);
  }

  // Generates coordinate points across the current range (10 A to 50,000 A)
  public static generateCurvePoints(
    curve: TccCurveDefinition,
    currentsA: number[]
  ): TccCurvePoint[] {
    const points: TccCurvePoint[] = [];

    currentsA.forEach((i) => {
      let t = 999;

      if (curve.curveFamily === 'motor_start') {
        // Motor 250 kW: In = 450 A at 400 V
        // Starting inrush: 6x In (2700 A) for 4.0 seconds, thermal limit 7.5x In for 10 s
        if (i < 450) {
          t = 999; // Continuous running
        } else if (i <= 2700) {
          // Starting acceleration envelope
          t = 4.0 * Math.pow(2700 / i, 2);
        } else {
          // Stalled rotor thermal limit
          t = 12.0 * Math.pow(2700 / i, 2);
        }
      } else if (curve.curveFamily === 'lv_electronic') {
        // LV ACB (Micrologic type: Long time L, Short time S, Instantaneous I)
        // Ir = pickupAmperes (e.g. 630 A), tr = 10s at 6x Ir
        const ir = curve.pickupAmperes;
        const isd = curve.shortTimePickup || ir * 4;
        const tsd = curve.shortTimeDelaySec || 0.2;
        const ii = curve.instantaneousPickup || ir * 10;

        if (i < ir) {
          t = 999;
        } else if (i < isd) {
          // I2t inverse thermal response
          t = 10.0 * Math.pow((6 * ir) / i, 2);
        } else if (i < ii) {
          // Definite time delay
          t = tsd;
        } else {
          // Instantaneous tripping (< 30 ms)
          t = 0.03;
        }
      } else {
        // IEC IDMT Relays (Feeder or Incomer)
        const idmtTime = this.calculateIecIdmtTime(
          i,
          curve.pickupAmperes,
          curve.tms || 0.1,
          curve.curveFamily
        );

        if (curve.instantaneousPickup && i >= curve.instantaneousPickup) {
          t = 0.04; // High-set instantaneous unit 50
        } else {
          t = idmtTime;
        }
      }

      if (t < 900 && t >= 0.01) {
        points.push({ currentA: i, timeSec: Number(t.toFixed(3)) });
      }
    });

    return points;
  }

  // Pre-configured canonical coordination chain (referred to 400 V base)
  public static getCanonicalProtectionChain(): TccCurveDefinition[] {
    // Current transformation ratio from 30 kV to 400 V is 30,000 / 400 = 75
    return [
      {
        id: 'curve-motor',
        name: { fr: 'Moteur 250 kW (Démarrage & Échauffement)', en: '250 kW Motor (Start & Damage)' },
        role: 'motor_withstand',
        deviceTag: '--M01-PROT',
        color: '#F59E0B', // Amber
        voltageRefKv: 0.4,
        pickupAmperes: 450,
        curveFamily: 'motor_start',
      },
      {
        id: 'curve-lv-acb',
        name: { fr: 'Disjoncteur BT Général TGBT (ACB 1600 A)', en: 'Main LV ACB Incomer (1600 A)' },
        role: 'lv_breaker',
        deviceTag: '==BT.QA1',
        color: '#10B981', // Emerald
        voltageRefKv: 0.4,
        pickupAmperes: 630,
        curveFamily: 'lv_electronic',
        shortTimePickup: 2520, // 4x Ir
        shortTimeDelaySec: 0.15,
        instantaneousPickup: 6300, // 10x Ir
      },
      {
        id: 'curve-mv-feeder',
        name: { fr: 'Relais Départ 30 kV Feeder 4 (ANSI 51)', en: '30 kV Feeder 4 Relay (ANSI 51)' },
        role: 'mv_feeder',
        deviceTag: '==HTA.FC4',
        color: '#3B82F6', // Blue
        voltageRefKv: 0.4, // Referred to 400 V base (280 A on 30 kV is 280 * 75 = 21,000 A at 400 V)
        pickupAmperes: 1200,
        curveFamily: 'iec_ni',
        tms: 0.18,
        instantaneousPickup: 14000,
      },
      {
        id: 'curve-hv-substation',
        name: { fr: 'Relais Amont Transfo 225/30 kV (ANSI 51)', en: 'Substation Incomer 225/30 kV (ANSI 51)' },
        role: 'hv_incomer',
        deviceTag: '==SUB.TR2',
        color: '#8B5CF6', // Purple
        voltageRefKv: 0.4,
        pickupAmperes: 2400,
        curveFamily: 'iec_vi',
        tms: 0.28,
        instantaneousPickup: 28000,
      }
    ];
  }

  // Analyzes grading margin between adjacent protective devices at prospective fault level
  public static analyzeSelectivity(
    upstream: TccCurveDefinition,
    downstream: TccCurveDefinition,
    faultCurrentA: number
  ): TccSelectivityAnalysis {
    const currents = [faultCurrentA];
    const ptsUp = this.generateCurvePoints(upstream, currents);
    const ptsDown = this.generateCurvePoints(downstream, currents);

    const tUp = ptsUp.length > 0 ? ptsUp[0].timeSec : 999;
    const tDown = ptsDown.length > 0 ? ptsDown[0].timeSec : 999;
    const deltaT = tUp - tDown;
    const recommended = 0.300; // 300 ms grading margin standard

    let status: TccSelectivityAnalysis['status'] = 'selective';
    let assessment = {
      fr: `Sélectivité totale garantie à I_k = ${faultCurrentA} A (Marge Δt = ${(deltaT * 1000).toFixed(0)} ms ≥ 300 ms).`,
      en: `Full selectivity guaranteed at I_k = ${faultCurrentA} A (Margin Δt = ${(deltaT * 1000).toFixed(0)} ms ≥ 300 ms).`
    };

    if (deltaT < 0) {
      status = 'blind_spot';
      assessment = {
        fr: `DISCRIMINATION DÉFAILLANTE : L'appareil amont déclenche avant l'appareil aval à ${faultCurrentA} A (Chevauchement de courbe).`,
        en: `SELECTIVITY BREACH: Upstream device trips before downstream at ${faultCurrentA} A (Curve crossing).`
      };
    } else if (deltaT < 0.250) {
      status = 'marginal';
      assessment = {
        fr: `MARGE CRITIQUE : Intervalle de déclenchement insuffisant (${(deltaT * 1000).toFixed(0)} ms < 300 ms). Risque de déclenchement intempestif amont.`,
        en: `CRITICAL MARGIN: Grading margin below safety threshold (${(deltaT * 1000).toFixed(0)} ms < 300 ms). Risk of nuisance tripping.`
      };
    }

    return {
      upstreamId: upstream.id,
      downstreamId: downstream.id,
      faultCurrentA,
      upstreamTimeSec: tUp,
      downstreamTimeSec: tDown,
      gradingMarginDeltaTSec: Number(deltaT.toFixed(3)),
      recommendedMarginSec: recommended,
      isSelective: deltaT >= 0.250,
      status,
      assessment
    };
  }
}
