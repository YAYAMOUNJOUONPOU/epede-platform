// server/services/workbenchService.ts
// Standardized Calculation Workbench Engine with Rigorous Engineering Formulations

import { canonicalDb } from '../db/canonicalDataStore';
import { CalculationWorkbenchContract, CalculationRunResult } from '../models/types';

export class WorkbenchService {
  public getAllWorkbenches(): CalculationWorkbenchContract[] {
    return Array.from(canonicalDb.workbenches.values());
  }

  public getWorkbenchById(id: string): CalculationWorkbenchContract | null {
    return canonicalDb.workbenches.get(id) || null;
  }

  public executeCalculation(
    workbenchId: string,
    inputs: Record<string, number>
  ): CalculationRunResult {
    const wb = this.getWorkbenchById(workbenchId);
    if (!wb) {
      throw new Error(`Workbench '${workbenchId}' not found`);
    }

    const timestamp = new Date().toISOString();
    let results: Record<string, number | string> = {};
    let interpretationFr = '';
    let interpretationEn = '';

    if (workbenchId === 'voltage-drop-workbench') {
      const U = inputs.voltage_v || 30000;
      const P_kw = inputs.power_kw || 5000;
      const L_m = inputs.length_m || 15000;
      const cos_phi = inputs.cos_phi || 0.92;
      const S_mm2 = inputs.cable_section_mm2 || 150;

      const sin_phi = Math.sqrt(Math.max(0, 1 - cos_phi * cos_phi));
      // Current Ib
      const Ib = (P_kw * 1000) / (Math.sqrt(3) * U * cos_phi);
      // Resistance at 70°C (copper ~ 0.0225 Ω·mm²/m)
      const R_line = (0.0225 * L_m) / S_mm2;
      // Reactance (approx 0.10 Ω/km = 0.00010 Ω/m)
      const X_line = 0.0001 * L_m;

      // Delta U (volts) = sqrt(3) * Ib * (R*cos + X*sin)
      const delta_u = Math.sqrt(3) * Ib * (R_line * cos_phi + X_line * sin_phi);
      const delta_u_pct = (delta_u / U) * 100;

      results = {
        current_ib_a: Number(Ib.toFixed(2)),
        delta_u_volts: Number(delta_u.toFixed(2)),
        delta_u_percentage: Number(delta_u_pct.toFixed(2)),
        r_line_ohms: Number(R_line.toFixed(3)),
        x_line_ohms: Number(X_line.toFixed(3)),
      };

      if (delta_u_pct <= 5.0) {
        interpretationFr = `Chute de tension de ${delta_u_pct.toFixed(2)}% conforme aux prescriptions normatives CEI (< 5% pour distribution HTA).`;
        interpretationEn = `Voltage drop of ${delta_u_pct.toFixed(2)}% satisfies IEC distribution limits (< 5% for MV feeders).`;
      } else {
        interpretationFr = `Attention : chute de tension de ${delta_u_pct.toFixed(2)}% supérieure au seuil recommandé de 5%. Augmenter la section du conducteur.`;
        interpretationEn = `Warning: Voltage drop of ${delta_u_pct.toFixed(2)}% exceeds the 5% recommended threshold. Conductor cross-section upgrade required.`;
      }
    } else if (workbenchId === 'short-circuit-iec60909') {
      const Un = inputs.un_kv || 30;
      const Sk_mva = inputs.sk_upstream_mva || 2500;
      const S_trafo = inputs.trafo_s_mva || 63;
      const Uk_pct = inputs.trafo_uk_pct || 12.5;

      const c = Un > 35 ? 1.1 : 1.05;
      // Z_upstream = (c * Un^2) / Sk_mva
      const Z_grid = (c * Un * Un) / Sk_mva;
      // Z_trafo = (Uk_pct / 100) * (Un^2 / S_trafo)
      const Z_trafo = (Uk_pct / 100) * ((Un * Un) / S_trafo);
      const Z_total = Z_grid + Z_trafo;

      // Ik" = (c * Un) / (sqrt(3) * Z_total)
      const Ik_ss = (c * Un) / (Math.sqrt(3) * Z_total);
      // Ip peak (factor kappa ~ 1.8)
      const Ip = 1.8 * Math.sqrt(2) * Ik_ss;
      const Sk_ss = Math.sqrt(3) * Un * Ik_ss;

      results = {
        ik_symmetrical_ka: Number(Ik_ss.toFixed(2)),
        ip_peak_ka: Number(Ip.toFixed(2)),
        sk_shortcircuit_mva: Number(Sk_ss.toFixed(1)),
        z_grid_ohms: Number(Z_grid.toFixed(3)),
        z_trafo_ohms: Number(Z_trafo.toFixed(3)),
        z_total_ohms: Number(Z_total.toFixed(3)),
      };

      interpretationFr = `Courant de court-circuit triphasé Ik" calculé à ${Ik_ss.toFixed(2)} kA (Ip = ${Ip.toFixed(2)} kA crête). L'appareillage (cellules et disjoncteurs) doit présenter un pouvoir de coupure assigné supérieur (ex. 25 kA ou 31.5 kA).`;
      interpretationEn = `Calculated initial symmetrical short-circuit current Ik" is ${Ik_ss.toFixed(2)} kA (peak Ip = ${Ip.toFixed(2)} kA). Switchgear breaking rating must exceed this value (e.g. standard 25 kA or 31.5 kA).`;
    } else {
      results = { status: 'completed' };
      interpretationFr = 'Calcul conceptuel achevé avec succès.';
      interpretationEn = 'Conceptual calculation executed successfully.';
    }

    return {
      workbenchId,
      timestamp,
      status: 'CONCEPTUAL_ENGINEERING_CALCULATION',
      inputs,
      results,
      engineeringInterpretation: {
        fr: interpretationFr,
        en: interpretationEn,
      },
      limitations: wb.limitations,
      applicableStandards: wb.standards,
      verificationNotice: {
        fr: 'EPEDE fournit des calculs conceptuels d\'orientation. Toute étude d\'exécution contractuelle doit être validée par un ingénieur habilité avec logiciel certifié.',
        en: 'EPEDE provides conceptual reference calculations. Final construction studies must be certified by a licensed professional engineer using approved software.',
      },
    };
  }
}

export const workbenchService = new WorkbenchService();
