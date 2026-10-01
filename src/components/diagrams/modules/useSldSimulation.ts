// src/components/diagrams/modules/useSldSimulation.ts
import { useState, useEffect } from 'react';
import { SldTopologyType } from './SldHeaderToolbar';
import { RelayTripInfo } from './SldRelayTripBanner';
import { SoeLogEntry } from './SldSoeLogPanel';
import { soundEffects } from '../../../services/soundEffectsService';

export const useSldSimulation = (locale: 'fr' | 'en', initialTopology?: SldTopologyType) => {
  const [activeTopology, setActiveTopology] = useState<SldTopologyType>(initialTopology || 'single_bus');
  const [bypassInterlocks, setBypassInterlocks] = useState(false);
  const [interlockAlert, setInterlockAlert] = useState<string | null>(null);
  const [activeFault, setActiveFault] = useState<string | null>(null);

  useEffect(() => {
    if (initialTopology) {
      setActiveTopology(initialTopology);
    }
  }, [initialTopology]);

  // 1. TOPOLOGY 1: SINGLE BUS 225/30 kV STATE
  const [q0_line, setQ0Line] = useState(true);
  const [q0_trafo_hv, setQ0TrafoHv] = useState(true);
  const [q0_trafo_mv, setQ0TrafoMv] = useState(true);
  const [q0_f1, setQ0F1] = useState(true);
  const [q0_f2, setQ0F2] = useState(true);
  const [q0_f3, setQ0F3] = useState(false);
  const [qs_line, setQsLine] = useState(true);
  const [qs_trafo, setQsTrafo] = useState(true);
  const [q8_line, setQ8Line] = useState(false);

  // 2. TOPOLOGY 2: DOUBLE BUS 225 kV STATE
  const [qs_bc1, setQsBc1] = useState(true);
  const [q0_bc, setQ0Bc] = useState(true);
  const [qs_bc2, setQsBc2] = useState(true);

  const [qs1_a, setQs1A] = useState(true);
  const [qs1_b, setQs1B] = useState(false);
  const [q0_1, setQ01] = useState(true);
  const [qs1_line, setQs1Line] = useState(true);
  const [q8_1, setQ81] = useState(false);

  const [qs2_a, setQs2A] = useState(false);
  const [qs2_b, setQs2B] = useState(true);
  const [q0_2, setQ02] = useState(true);
  const [qs2_line, setQs2Line] = useState(true);
  const [q8_2, setQ82] = useState(false);

  const [qst_a, setQstA] = useState(true);
  const [qst_b, setQstB] = useState(false);
  const [q0_t, setQ0T] = useState(true);

  // 3. TOPOLOGY 3: BREAKER-AND-A-HALF (1-1/2 CB) 225 kV STATE
  const [qs_bh_1a, setQsBh1a] = useState(true);
  const [q0_bh_1, setQ0Bh1] = useState(true);
  const [qs_bh_1b, setQsBh1b] = useState(true);
  const [q8_bh_cb1, setQ8BhCb1] = useState(false);

  const [qs_bh_l1, setQsBhL1] = useState(true);
  const [q8_bh_1, setQ8Bh1] = useState(false);

  const [qs_bh_m1, setQsBhM1] = useState(true);
  const [q0_bh_m, setQ0BhM] = useState(true);
  const [qs_bh_m2, setQsBhM2] = useState(true);
  const [q8_bh_cbm, setQ8BhCbm] = useState(false);

  const [qs_bh_l2, setQsBhL2] = useState(true);
  const [q8_bh_2, setQ8Bh2] = useState(false);

  const [qs_bh_2a, setQsBh2a] = useState(true);
  const [q0_bh_2, setQ0Bh2] = useState(true);
  const [qs_bh_2b, setQsBh2b] = useState(true);
  const [q8_bh_cb2, setQ8BhCb2] = useState(false);

  // 4. TOPOLOGY 4: RMU 36 kV DISTRIBUTION STATE
  const [lbs1, setLbs1] = useState(true);
  const [q8_rmu1, setQ8Rmu1] = useState(false);
  const [lbs2, setLbs2] = useState(true);
  const [q8_rmu2, setQ8Rmu2] = useState(false);
  const [q0_rmu_t, setQ0RmuT] = useState(true);
  const [q8_rmu_t, setQ8RmuT] = useState(false);

  const [q0_bt, setQ0Bt] = useState(true);
  const [q0_bt_f1, setQ0BtF1] = useState(true);
  const [q0_bt_f2, setQ0BtF2] = useState(true);
  const [q0_bt_f3, setQ0BtF3] = useState(true);

  // 4. TOPOLOGY 4: SOLAR PV 100 MW + BESS 50 MWh STATE
  const [q0_pv, setQ0Pv] = useState(true);
  const [q8_pv, setQ8Pv] = useState(false);
  const [q0_bess, setQ0Bess] = useState(true);
  const [q8_bess, setQ8Bess] = useState(false);
  const [q0_aux, setQ0Aux] = useState(true);
  const [qs_33_t, setQs33T] = useState(true);
  const [q0_33_t, setQ033T] = useState(true);
  const [q0_225_sb, setQ0225Sb] = useState(true);
  const [qs_225_line_sb, setQs225LineSb] = useState(true);
  const [q8_225_sb, setQ8225Sb] = useState(false);

  const [solarIrradiance, setSolarIrradiance] = useState<number>(850); // W/m²
  const [bessMode, setBessMode] = useState<'discharge' | 'charge' | 'standby' | 'grid_forming'>('discharge');
  const [bessPowerSetting, setBessPowerSetting] = useState<number>(15); // MW
  const [bessSocPercent, setBessSocPercent] = useState<number>(76); // %

  // SHARED TELEMETRY & CONTROLS
  const [trafoTap, setTrafoTap] = useState(0);
  const [activeLoadMw, setActiveLoadMw] = useState(48.5);

  // Relay trip state
  const [relayTripped, setRelayTripped] = useState<RelayTripInfo | null>(null);

  // Sequence of Events Log
  const [soeLogs, setSoeLogs] = useState<SoeLogEntry[]>([
    {
      id: 'soe-01',
      time: '12:00:00',
      ansi: 'SYS',
      event: 'Mise sous tension nominale Poste 225/30 kV — Configuration normale',
      breakers: '52-1 [FERMÉ], 52-2 [FERMÉ], 52-3 [FERMÉ]',
      clearing: '0 ms',
      severity: 'NORMAL'
    }
  ]);

  // Derived electrical states: SINGLE BUS
  const isLineEnergized = qs_line && q0_line && !q8_line;
  const isBus225Energized = isLineEnergized;
  const isTrafoEnergized = isBus225Energized && qs_trafo && q0_trafo_hv;
  const isBus30Energized = isTrafoEnergized && q0_trafo_mv;

  const u_hv_nom = 225.0;
  const u_mv_nom = 30.0 * (1 + trafoTap * 0.0125);
  const current_hv = isTrafoEnergized ? (activeLoadMw * 1e6) / (Math.sqrt(3) * u_hv_nom * 1e3 * 0.98) : 0;
  const current_mv = isBus30Energized ? (activeLoadMw * 1e6) / (Math.sqrt(3) * u_mv_nom * 1e3 * 0.98) : 0;

  // Derived electrical states: DOUBLE BUS
  const isLine1SourceLive = qs1_line && q0_1 && !q8_1;
  const isCouplerClosed = q0_bc && qs_bc1 && qs_bc2;

  let isBusA_Energized = isLine1SourceLive && qs1_a;
  let isBusB_Energized = isLine1SourceLive && qs1_b;
  if (isCouplerClosed) {
    if (isBusA_Energized) isBusB_Energized = true;
    if (isBusB_Energized) isBusA_Energized = true;
  }

  const isLine1_Energized = isLine1SourceLive;
  const isLine2_Energized = qs2_line && q0_2 && !q8_2 && ((qs2_a && isBusA_Energized) || (qs2_b && isBusB_Energized));
  const isTrafo_Energized = q0_t && ((qst_a && isBusA_Energized) || (qst_b && isBusB_Energized));

  // Derived electrical states: BREAKER-AND-A-HALF (1-1/2 CB) 225 kV
  const path1Closed = qs_bh_1a && q0_bh_1 && qs_bh_1b && !q8_bh_cb1;
  const pathMClosed = qs_bh_m1 && q0_bh_m && qs_bh_m2 && !q8_bh_cbm;
  const path2Closed = qs_bh_2a && q0_bh_2 && qs_bh_2b && !q8_bh_cb2;

  const isLine1Bh_Live = qs_bh_l1 && !q8_bh_1;
  const isLine2Bh_Live = qs_bh_l2 && !q8_bh_2;

  const isNode1_Energized = isLine1Bh_Live || (isLine2Bh_Live && pathMClosed);
  const isNode2_Energized = isLine2Bh_Live || (isLine1Bh_Live && pathMClosed);

  const isBus1_Energized = isNode1_Energized && path1Closed;
  const isBus2_Energized = isNode2_Energized && path2Closed;
  const isCbmPath_Energized = (isNode1_Energized || isNode2_Energized) && pathMClosed;
  const isLine1Bh_Energized = isLine1Bh_Live;
  const isLine2Bh_Energized = isLine2Bh_Live;

  // Derived electrical states: RMU
  const isRing1_Energized = !q8_rmu1;
  const isRmuBus_Energized = (isRing1_Energized && lbs1) || (lbs2 && !q8_rmu2);
  const isRing2_Energized = isRmuBus_Energized && lbs2 && !q8_rmu2;
  const isDistTrafo_Energized = isRmuBus_Energized && q0_rmu_t && !q8_rmu_t;
  const isTgbt_Energized = isDistTrafo_Energized && q0_bt;

  // Derived electrical states: SOLAR PV + BESS
  const isPvGenerating = q0_pv && !q8_pv && solarIrradiance > 50;
  const solarPowerMw = isPvGenerating ? (solarIrradiance / 1000) * 100 * 0.98 : 0;
  const isBessActive = q0_bess && !q8_bess && bessMode !== 'standby';
  const bessPowerMw = isBessActive
    ? (bessMode === 'discharge' ? bessPowerSetting : bessMode === 'charge' ? -bessPowerSetting : bessPowerSetting * 0.4)
    : 0;

  const isBus33Energized = (isPvGenerating && q0_pv) ||
    (isBessActive && q0_bess) ||
    (qs_33_t && q0_33_t && q0_225_sb && qs_225_line_sb && !q8_225_sb);

  const isTrafoHvEnergized = isBus33Energized && qs_33_t && q0_33_t;
  const isGrid225Connected = isTrafoHvEnergized && q0_225_sb && qs_225_line_sb && !q8_225_sb;

  const totalExportMw = isGrid225Connected
    ? Math.max(-50, solarPowerMw + bessPowerMw - (q0_aux ? 0.6 : 0))
    : 0;
  const reactivePowerMvar = isGrid225Connected ? (q0_aux ? 18.5 : totalExportMw * 0.12) : 0;

  // Interlocking verification helper (CEI 62271-102)
  const triggerInterlockWarning = (msg: string) => {
    soundEffects.playAlarm();
    setInterlockAlert(msg);
    setTimeout(() => {
      setInterlockAlert(null);
    }, 4500);
  };

  const playDeviceSound = (device: string, isClosing: boolean) => {
    if (device.startsWith('q0') || device.startsWith('lbs') || device.includes('cb')) {
      if (isClosing) {
        soundEffects.playBreakerClose();
      } else {
        soundEffects.playBreakerOpen();
      }
    } else {
      soundEffects.playDisconnectorSwitch();
    }
  };

  // Switch toggle handler with CEI 62271-102 validation
  const handleToggle = (device: string) => {
    // ---------------- SINGLE BUS TOPOLOGY ----------------
    if (activeTopology === 'single_bus') {
      if (device === 'q0_line') {
        setQ0Line(!q0_line);
        return;
      }
      if (device === 'qs_line') {
        if (!bypassInterlocks && q0_line) {
          triggerInterlockWarning(
            locale === 'fr'
              ? 'INTERVERROUILLAGE CEI 62271-102 VIOLÉ : Manœuvre du sectionneur QS1 interdite sous charge (disjoncteur 52-1 fermé) !'
              : 'IEC 62271-102 INTERLOCK VIOLATION: Switching disconnector QS1 on load is prohibited (breaker 52-1 is closed)!'
          );
          return;
        }
        setQsLine(!qs_line);
        return;
      }
      if (device === 'q8_line') {
        if (!bypassInterlocks && (qs_line || q0_line)) {
          triggerInterlockWarning(
            locale === 'fr'
              ? 'INTERVERROUILLAGE CEI 62271-102 VIOLÉ : Fermeture du sectionneur de mise à la terre Q8 interdite si la ligne est raccordée ou sous tension !'
              : 'IEC 62271-102 INTERLOCK VIOLATION: Earthing switch Q8 closing forbidden while line is connected or energized!'
          );
          return;
        }
        setQ8Line(!q8_line);
        return;
      }
      if (device === 'qs_trafo') {
        if (!bypassInterlocks && q0_trafo_hv) {
          triggerInterlockWarning(
            locale === 'fr'
              ? 'INTERVERROUILLAGE CEI 62271-102 VIOLÉ : Manœuvre du sectionneur transformateur QS2 interdite disjoncteur 52-2 fermé !'
              : 'IEC 62271-102 INTERLOCK VIOLATION: Switching transformer disconnector QS2 is prohibited while breaker 52-2 is closed!'
          );
          return;
        }
        setQsTrafo(!qs_trafo);
        return;
      }
      if (device === 'q0_trafo_hv') {
        if (!bypassInterlocks && !qs_trafo && !q0_trafo_hv) {
          triggerInterlockWarning(
            locale === 'fr'
              ? 'INTERVERROUILLAGE CEI 62271-102 VIOLÉ : Enclenchement 52-2 interdit si sectionneur QS2 ouvert !'
              : 'IEC 62271-102 INTERLOCK VIOLATION: Closing breaker 52-2 is forbidden while disconnector QS2 is open!'
          );
          return;
        }
        setQ0TrafoHv(!q0_trafo_hv);
        return;
      }
      if (device === 'q0_trafo_mv') {
        setQ0TrafoMv(!q0_trafo_mv);
        return;
      }
      if (device === 'q0_f1') {
        setQ0F1(!q0_f1);
        return;
      }
      if (device === 'q0_f2') {
        setQ0F2(!q0_f2);
        return;
      }
      if (device === 'q0_f3') {
        setQ0F3(!q0_f3);
        return;
      }
      return;
    }

    // ---------------- DOUBLE BUS TOPOLOGY ----------------
    if (activeTopology === 'double_bus') {
      if (device === 'q0_bc') {
        setQ0Bc(!q0_bc);
        return;
      }
      if (device === 'qs_bc1') {
        if (!bypassInterlocks && q0_bc) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur coupleur QS-BC1 interdite disjoncteur 52-BC fermé !');
          return;
        }
        setQsBc1(!qs_bc1);
        return;
      }
      if (device === 'qs_bc2') {
        if (!bypassInterlocks && q0_bc) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur coupleur QS-BC2 interdite disjoncteur 52-BC fermé !');
          return;
        }
        setQsBc2(!qs_bc2);
        return;
      }
      if (device === 'q0_1') {
        setQ01(!q0_1);
        return;
      }
      if (device === 'qs1_a') {
        if (!bypassInterlocks && q0_1 && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Transfert de barre à chaud interdit sans couplage fermé (52-BC) !');
          return;
        }
        setQs1A(!qs1_a);
        return;
      }
      if (device === 'qs1_b') {
        if (!bypassInterlocks && q0_1 && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Transfert de barre à chaud interdit sans couplage fermé (52-BC) !');
          return;
        }
        setQs1B(!qs1_b);
        return;
      }
      if (device === 'qs1_line') {
        if (!bypassInterlocks && q0_1) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur ligne interdite sous charge (Ouvrir 52-1) !');
          return;
        }
        setQs1Line(!qs1_line);
        return;
      }
      if (device === 'q8_1') {
        if (!bypassInterlocks && (qs1_line || q0_1)) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture terre Q8-1 interdite avec ligne raccordée !');
          return;
        }
        setQ81(!q8_1);
        return;
      }
      if (device === 'q0_2') {
        setQ02(!q0_2);
        return;
      }
      if (device === 'qs2_a') {
        if (!bypassInterlocks && q0_2 && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Transfert de barre à chaud interdit sans couplage fermé !');
          return;
        }
        setQs2A(!qs2_a);
        return;
      }
      if (device === 'qs2_b') {
        if (!bypassInterlocks && q0_2 && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Transfert de barre à chaud interdit sans couplage fermé !');
          return;
        }
        setQs2B(!qs2_b);
        return;
      }
      if (device === 'qs2_line') {
        if (!bypassInterlocks && q0_2) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur ligne interdite sous charge (Ouvrir 52-2) !');
          return;
        }
        setQs2Line(!qs2_line);
        return;
      }
      if (device === 'q8_2') {
        if (!bypassInterlocks && (qs2_line || q0_2)) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture terre Q8-2 interdite avec ligne raccordée !');
          return;
        }
        setQ82(!q8_2);
        return;
      }
      if (device === 'q0_t') {
        setQ0T(!q0_t);
        return;
      }
      if (device === 'qst_a') {
        if (!bypassInterlocks && q0_t && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur transfo QST-A interdite sous charge sans couplage !');
          return;
        }
        setQstA(!qst_a);
        return;
      }
      if (device === 'qst_b') {
        if (!bypassInterlocks && q0_t && !isCouplerClosed) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur transfo QST-B interdite sous charge sans couplage !');
          return;
        }
        setQstB(!qst_b);
        return;
      }
      return;
    }

    // ---------------- BREAKER-AND-A-HALF TOPOLOGY (1-1/2 CB) ----------------
    if (activeTopology === 'breaker_and_half') {
      // CB-1A
      if (device === 'q0_bh_1') {
        if (!bypassInterlocks && q8_bh_cb1 && !q0_bh_1) {
          triggerInterlockWarning('CEI 62271-102 : Enclenchement 52-1A interdit tant que la mise à la terre maintenance MALT DJ1 est fermée !');
          return;
        }
        setQ0Bh1(!q0_bh_1);
        return;
      }
      if (device === 'qs_bh_1a') {
        if (!bypassInterlocks && q0_bh_1) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur barres QS-1A interdite sous charge (Ouvrir disjoncteur 52-1A) !');
          return;
        }
        setQsBh1a(!qs_bh_1a);
        return;
      }
      if (device === 'qs_bh_1b') {
        if (!bypassInterlocks && q0_bh_1) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur isolement QS-1B interdite sous charge (Ouvrir disjoncteur 52-1A) !');
          return;
        }
        setQsBh1b(!qs_bh_1b);
        return;
      }
      if (device === 'q8_bh_cb1') {
        if (!bypassInterlocks && (qs_bh_1a || qs_bh_1b || q0_bh_1)) {
          triggerInterlockWarning('CEI 62271-102 : MALT Maint. DJ1 interdite tant que QS-1A ou QS-1B ou 52-1A sont fermés !');
          return;
        }
        setQ8BhCb1(!q8_bh_cb1);
        return;
      }

      // Circuit 1 (Ligne 1 Ouest)
      if (device === 'qs_bh_l1') {
        setQsBhL1(!qs_bh_l1);
        return;
      }
      if (device === 'q8_bh_1') {
        if (!bypassInterlocks && qs_bh_l1) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture sectionneur terre Q8-L1 interdite tant que QS-L1 est fermé !');
          return;
        }
        setQ8Bh1(!q8_bh_1);
        return;
      }

      // CB-M (Central Tie)
      if (device === 'q0_bh_m') {
        if (!bypassInterlocks && q8_bh_cbm && !q0_bh_m) {
          triggerInterlockWarning('CEI 62271-102 : Enclenchement 52-M interdit tant que la mise à la terre maintenance MALT DJ-M est fermée !');
          return;
        }
        setQ0BhM(!q0_bh_m);
        return;
      }
      if (device === 'qs_bh_m1') {
        if (!bypassInterlocks && q0_bh_m) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur QS-M1 interdite sous charge (Ouvrir disjoncteur 52-M) !');
          return;
        }
        setQsBhM1(!qs_bh_m1);
        return;
      }
      if (device === 'qs_bh_m2') {
        if (!bypassInterlocks && q0_bh_m) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur QS-M2 interdite sous charge (Ouvrir disjoncteur 52-M) !');
          return;
        }
        setQsBhM2(!qs_bh_m2);
        return;
      }
      if (device === 'q8_bh_cbm') {
        if (!bypassInterlocks && (qs_bh_m1 || qs_bh_m2 || q0_bh_m)) {
          triggerInterlockWarning('CEI 62271-102 : MALT Maint. DJ-M interdite tant que QS-M1 ou QS-M2 ou 52-M sont fermés !');
          return;
        }
        setQ8BhCbm(!q8_bh_cbm);
        return;
      }

      // Circuit 2 (Ligne 2 Est)
      if (device === 'qs_bh_l2') {
        setQsBhL2(!qs_bh_l2);
        return;
      }
      if (device === 'q8_bh_2') {
        if (!bypassInterlocks && qs_bh_l2) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture sectionneur terre Q8-L2 interdite tant que QS-L2 est fermé !');
          return;
        }
        setQ8Bh2(!q8_bh_2);
        return;
      }

      // CB-2A
      if (device === 'q0_bh_2') {
        if (!bypassInterlocks && q8_bh_cb2 && !q0_bh_2) {
          triggerInterlockWarning('CEI 62271-102 : Enclenchement 52-2A interdit tant que la mise à la terre maintenance MALT DJ2 est fermée !');
          return;
        }
        setQ0Bh2(!q0_bh_2);
        return;
      }
      if (device === 'qs_bh_2a') {
        if (!bypassInterlocks && q0_bh_2) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur isolement QS-2A interdite sous charge (Ouvrir disjoncteur 52-2A) !');
          return;
        }
        setQsBh2a(!qs_bh_2a);
        return;
      }
      if (device === 'qs_bh_2b') {
        if (!bypassInterlocks && q0_bh_2) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur barres QS-2B interdite sous charge (Ouvrir disjoncteur 52-2A) !');
          return;
        }
        setQsBh2b(!qs_bh_2b);
        return;
      }
      if (device === 'q8_bh_cb2') {
        if (!bypassInterlocks && (qs_bh_2a || qs_bh_2b || q0_bh_2)) {
          triggerInterlockWarning('CEI 62271-102 : MALT Maint. DJ2 interdite tant que QS-2A ou QS-2B ou 52-2A sont fermés !');
          return;
        }
        setQ8BhCb2(!q8_bh_cb2);
        return;
      }
      return;
    }

    // ---------------- RMU DISTRIBUTION TOPOLOGY ----------------
    if (activeTopology === 'rmu_distribution') {
      if (device === 'lbs1') {
        setLbs1(!lbs1);
        return;
      }
      if (device === 'q8_1') {
        if (!bypassInterlocks && lbs1) {
          triggerInterlockWarning('CEI 62271-200 : Fermeture sectionneur de terre Q8-1 interdite interrupteur LBS1 fermé !');
          return;
        }
        setQ8Rmu1(!q8_rmu1);
        return;
      }
      if (device === 'lbs2') {
        setLbs2(!lbs2);
        return;
      }
      if (device === 'q8_2') {
        if (!bypassInterlocks && lbs2) {
          triggerInterlockWarning('CEI 62271-200 : Fermeture sectionneur de terre Q8-2 interdite interrupteur LBS2 fermé !');
          return;
        }
        setQ8Rmu2(!q8_rmu2);
        return;
      }
      if (device === 'q0_rmu_t') {
        setQ0RmuT(!q0_rmu_t);
        return;
      }
      if (device === 'q8_t') {
        if (!bypassInterlocks && q0_rmu_t) {
          triggerInterlockWarning('CEI 62271-200 : Fermeture sectionneur terre transformateur interdite disjoncteur HTA fermé !');
          return;
        }
        setQ8RmuT(!q8_rmu_t);
        return;
      }
      if (device === 'q0_bt') {
        setQ0Bt(!q0_bt);
        return;
      }
      if (device === 'q0_bt_f1') {
        setQ0BtF1(!q0_bt_f1);
        return;
      }
      if (device === 'q0_bt_f2') {
        setQ0BtF2(!q0_bt_f2);
        return;
      }
      if (device === 'q0_bt_f3') {
        setQ0BtF3(!q0_bt_f3);
        return;
      }
      return;
    }

    // ---------------- SOLAR PV + BESS TOPOLOGY ----------------
    if (activeTopology === 'solar_bess') {
      if (device === 'q0_pv') {
        if (!bypassInterlocks && q8_pv && !q0_pv) {
          triggerInterlockWarning('CEI 62271-200 : Enclenchement 52-PV interdit avec sectionneur de terre Q8-PV fermé !');
          return;
        }
        setQ0Pv(!q0_pv);
        return;
      }
      if (device === 'q8_pv') {
        if (!bypassInterlocks && q0_pv) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture terre Q8-PV interdite avec disjoncteur 52-PV fermé !');
          return;
        }
        setQ8Pv(!q8_pv);
        return;
      }
      if (device === 'q0_bess') {
        if (!bypassInterlocks && q8_bess && !q0_bess) {
          triggerInterlockWarning('CEI 62271-200 : Enclenchement 52-BESS interdit avec sectionneur de terre Q8-BESS fermé !');
          return;
        }
        setQ0Bess(!q0_bess);
        return;
      }
      if (device === 'q8_bess') {
        if (!bypassInterlocks && q0_bess) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture terre Q8-BESS interdite avec disjoncteur 52-BESS fermé !');
          return;
        }
        setQ8Bess(!q8_bess);
        return;
      }
      if (device === 'q0_aux') {
        setQ0Aux(!q0_aux);
        return;
      }
      if (device === 'qs_33_t') {
        if (!bypassInterlocks && q0_33_t) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur QS-33-T interdite sous charge (Ouvrir 52-33T d\'abord) !');
          return;
        }
        setQs33T(!qs_33_t);
        return;
      }
      if (device === 'q0_33_t') {
        if (!bypassInterlocks && !qs_33_t && !q0_33_t) {
          triggerInterlockWarning('CEI 62271-102 : Enclenchement disjoncteur 52-33T interdit si sectionneur QS-33-T ouvert !');
          return;
        }
        setQ033T(!q0_33_t);
        return;
      }
      if (device === 'q0_225') {
        setQ0225Sb(!q0_225_sb);
        return;
      }
      if (device === 'qs_225_line') {
        if (!bypassInterlocks && q0_225_sb) {
          triggerInterlockWarning('CEI 62271-102 : Manœuvre sectionneur ligne 225 kV interdite sous charge (Ouvrir 52-225 d\'abord) !');
          return;
        }
        setQs225LineSb(!qs_225_line_sb);
        return;
      }
      if (device === 'q8_225') {
        if (!bypassInterlocks && (qs_225_line_sb || q0_225_sb)) {
          triggerInterlockWarning('CEI 62271-102 : Fermeture terre ligne 225 kV interdite si sectionneur ou disjoncteur enclenché !');
          return;
        }
        setQ8225Sb(!q8_225_sb);
        return;
      }
      return;
    }
  };

  // Fault simulation
  const handleSimulateFault = (type: '87T' | '50_51' | '21' | '50N' | '49' | '64R' | '81O_81U' | '64_DC' | '87B_BUS1' | '87B_BUS2' | '21_LINE1' | '50BF_TIE') => {
    const now = new Date().toLocaleTimeString();
    soundEffects.playRelayTrip();
    setActiveFault(type);

    if (type === '87B_BUS1') {
      setQ0Bh1(false);
      setRelayTripped({
        ansi: 'ANSI 87B',
        description_fr: 'DIFFÉRENTIELLE JEU DE BARRES 1 (Zone Bus 1, If = 22.4 kA). Déclenchement sélectif du disjoncteur 52-1A uniquement. Les Lignes 1 & 2 restent 100% alimentées par la Barre 2 via 52-M !',
        description_en: 'BUS 1 DIFFERENTIAL TRIP (Zone Bus 1, If = 22.4 kA). Selective trip of breaker 52-1A only. Lines 1 & 2 remain 100% energized from Bus 2 via 52-M!',
        timestamp: now,
        clearingTime: '25 ms',
        faultMagnitude: 'I_diff = 22.4 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 87B',
          event: 'Défaut Barre 1 — Déclenchement sélectif 52-1A (Continuité totale assurée par 52-M et Barre 2)',
          breakers: '52-1A [OUVERT], 52-M [FERMÉ], 52-2A [FERMÉ]',
          clearing: '25 ms',
          severity: 'CRITICAL',
          faultRecordType: 'THREE_PHASE_BUS_FAULT',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '87B_BUS2') {
      setQ0Bh2(false);
      setRelayTripped({
        ansi: 'ANSI 87B',
        description_fr: 'DIFFÉRENTIELLE JEU DE BARRES 2 (Zone Bus 2, If = 20.8 kA). Déclenchement sélectif du disjoncteur 52-2A uniquement. Les Lignes 1 & 2 restent 100% alimentées par la Barre 1 via 52-M !',
        description_en: 'BUS 2 DIFFERENTIAL TRIP (Zone Bus 2, If = 20.8 kA). Selective trip of breaker 52-2A only. Lines 1 & 2 remain 100% energized from Bus 1 via 52-M!',
        timestamp: now,
        clearingTime: '25 ms',
        faultMagnitude: 'I_diff = 20.8 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 87B',
          event: 'Défaut Barre 2 — Déclenchement sélectif 52-2A (Continuité totale assurée par 52-M et Barre 1)',
          breakers: '52-2A [OUVERT], 52-M [FERMÉ], 52-1A [FERMÉ]',
          clearing: '25 ms',
          severity: 'CRITICAL',
          faultRecordType: 'THREE_PHASE_BUS_FAULT',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '21_LINE1') {
      setQ0Bh1(false);
      setQ0BhM(false);
      setRelayTripped({
        ansi: 'ANSI 21 / 87L',
        description_fr: 'DÉFAUT LIGNE 1 OUEST (Zone 1 - 85% portée). Déclenchement simultané des deux disjoncteurs encadrants 52-1A et 52-M. Ligne 1 isolée, Ligne 2 reste en service via 52-2A.',
        description_en: 'LINE 1 FAULT (Zone 1 - 85% reach). Dual trip of framing breakers 52-1A and 52-M. Line 1 isolated, Line 2 remains active via 52-2A.',
        timestamp: now,
        clearingTime: '35 ms',
        faultMagnitude: 'Z_meas = 2.4 Ω, If = 16.5 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 21/87L',
          event: 'Court-circuit Ligne 1 — Déclenchement encadrant 52-1A et 52-M (Ligne 2 indemne sur Barre 2)',
          breakers: '52-1A [OUVERT], 52-M [OUVERT]',
          clearing: '35 ms',
          severity: 'CRITICAL',
          faultRecordType: 'ANSI_79_AUTO_RECLOSE',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '50BF_TIE') {
      setQ0Bh1(false);
      setQ0Bh2(false);
      setRelayTripped({
        ansi: 'ANSI 50BF',
        description_fr: 'DÉFAILLANCE DISJONCTEUR CENTRAL 52-M (Refus d\'ouverture au courant de défaut > 150 ms). Élimination de secours par déclenchement télécommandé des disjoncteurs adjacents 52-1A et 52-2A.',
        description_en: 'BREAKER FAILURE 52-M (Failure to trip on fault current > 150 ms). Breaker failure trip of adjacent breakers 52-1A and 52-2A.',
        timestamp: now,
        clearingTime: '165 ms',
        faultMagnitude: 'I_stuck = 14.2 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 50BF',
          event: 'Défaillance disjoncteur 52-M — Déclenchement de secours des disjoncteurs adjacents 52-1A et 52-2A',
          breakers: '52-1A [OUVERT], 52-2A [OUVERT], 52-M [BLOQUÉ]',
          clearing: '165 ms',
          severity: 'CRITICAL',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '81O_81U') {
      setQ0225Sb(false);
      setQ033T(false);
      setRelayTripped({
        ansi: 'ANSI 81O/81U & 78',
        description_fr: 'DÉCOUPLAGE RÉSEAU / PERTE DU SYSTÈME (RoCoF df/dt > 1.5 Hz/s ou f < 47.5 Hz). Déclenchement îlotage selon IEEE 1547 / CEI 61727.',
        description_en: 'LOSS OF MAINS / ANTI-ISLANDING TRIP (RoCoF df/dt > 1.5 Hz/s or f < 47.5 Hz). Decoupling as per IEEE 1547 / IEC 61727.',
        timestamp: now,
        clearingTime: '60 ms',
        faultMagnitude: 'df/dt = 2.1 Hz/s',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 81U/78',
          event: 'Détection perte réseau amont — Découplage anti-îlotage automatique des onduleurs et ouverture 52-225',
          breakers: '52-225 [OUVERT], 52-33T [OUVERT]',
          clearing: '60 ms',
          severity: 'CRITICAL',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '64_DC') {
      setQ0Pv(false);
      setRelayTripped({
        ansi: 'ANSI 64 / RCMU',
        description_fr: 'DÉFAUT D\'ISOLEMENT DC CHAMP SOLAIRE (Résistance d\'isolement R_iso < 40 kΩ). Isolement automatique du sous-champ PV 1500 V.',
        description_en: 'SOLAR PV DC INSULATION FAULT (Insulation resistance R_iso < 40 kΩ). Automatic trip of 1500 V PV array.',
        timestamp: now,
        clearingTime: '40 ms',
        faultMagnitude: 'R_iso = 18 kΩ',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 64',
          event: 'Défaut d\'isolement pôle DC vers la terre — Déclenchement disjoncteur 52-PV',
          breakers: '52-PV [OUVERT]',
          clearing: '40 ms',
          severity: 'WARNING',
        },
        ...prev.slice(0, 9)
      ]);
      return;
    }

    if (type === '87T') {
      setQ0TrafoHv(false);
      setQ0TrafoMv(false);
      setQ0T(false);
      setRelayTripped({
        ansi: 'ANSI 87T',
        description_fr: 'DÉCLENCHEMENT DIFFÉRENTIEL TRANSFORMATEUR (I_diff > 0.25 In). Déclenchement instantané 52-2 & 52-3.',
        description_en: 'TRANSFORMER DIFFERENTIAL TRIP (I_diff > 0.25 In). Instantaneous lockout of 52-2 & 52-3.',
        timestamp: now,
        clearingTime: '28 ms',
        faultMagnitude: 'I_diff = 1.45 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 87T',
          event: 'Défaut interne enroulements transfo 63 MVA — Déclenchement différentiel',
          breakers: '52-2 [OUVERT], 52-3 [OUVERT]',
          clearing: '28 ms',
          severity: 'CRITICAL',
          faultRecordType: 'TRAFO_INRUSH_VS_87T',
        },
        ...prev.slice(0, 9)
      ]);
    } else if (type === '50_51') {
      setQ0Line(false);
      setQ01(false);
      setRelayTripped({
        ansi: 'ANSI 50/51',
        description_fr: 'DÉCLENCHEMENT SURINTENSITÉ / COURT-CIRCUIT LIGNE 225 kV (I_fault = 14.8 kA). Déclenchement temporisé 52-1.',
        description_en: 'OVERCURRENT / SHORT-CIRCUIT TRIP 225 kV LINE (I_fault = 14.8 kA). Time-delayed trip of 52-1.',
        timestamp: now,
        clearingTime: '320 ms',
        faultMagnitude: 'I_sc = 14.8 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 50/51',
          event: 'Court-circuit triphasé départ 225 kV — Surintensité à temps inverse',
          breakers: '52-1 [OUVERT]',
          clearing: '320 ms',
          severity: 'CRITICAL',
          faultRecordType: 'THREE_PHASE_BUS_FAULT',
        },
        ...prev.slice(0, 9)
      ]);
    } else if (type === '21') {
      setQ0Line(false);
      setQ01(false);
      setRelayTripped({
        ansi: 'ANSI 21',
        description_fr: 'PROTECTION DE DISTANCE (Zone 1 — 85% portée ligne, Z_meas = 3.6 Ω < Z_reach). Déclenchement instantané 52-1.',
        description_en: 'DISTANCE PROTECTION (Zone 1 — 85% reach, Z_meas = 3.6 Ω < Z_reach). Instantaneous trip 52-1.',
        timestamp: now,
        clearingTime: '35 ms',
        faultMagnitude: 'Z_meas = 3.6 Ω, If = 12.1 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 21',
          event: 'Défaut phase-phase ligne 225 kV en Zone 1 — Protection de distance numérique',
          breakers: '52-1 [OUVERT]',
          clearing: '35 ms',
          severity: 'CRITICAL',
          faultRecordType: 'ANSI_79_AUTO_RECLOSE',
        },
        ...prev.slice(0, 9)
      ]);
    } else if (type === '50N') {
      setQ0TrafoMv(false);
      setQ0RmuT(false);
      setRelayTripped({
        ansi: 'ANSI 50N/51N',
        description_fr: 'DÉFAUT HOMOPOLAIRE / TERRE JEU DE BARRES 30 kV (3I_0 = 1.62 kA). Déclenchement disjoncteur 52-3.',
        description_en: 'EARTH FAULT / ZERO SEQUENCE 30 kV BUS (3I_0 = 1.62 kA). Trip of incoming breaker 52-3.',
        timestamp: now,
        clearingTime: '180 ms',
        faultMagnitude: '3I_0 = 1.62 kA',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 50N/51N',
          event: 'Défaut phase-terre réseau HTA 30 kV — Protection homopolaire temporisée',
          breakers: '52-3 [OUVERT]',
          clearing: '180 ms',
          severity: 'CRITICAL',
          faultRecordType: 'SINGLE_PHASE_GROUND_FAULT',
        },
        ...prev.slice(0, 9)
      ]);
    } else if (type === '49') {
      setQ0TrafoHv(false);
      setQ0TrafoMv(false);
      setQ0T(false);
      setRelayTripped({
        ansi: 'ANSI 49',
        description_fr: 'IMAGE THERMIQUE TRANSFORMATEUR (θ_enroulement = 124°C > seuil déclenchement 115°C). Isolement 52-2 & 52-3.',
        description_en: 'TRANSFORMER THERMAL OVERLOAD (θ_winding = 124°C > trip threshold 115°C). Lockout 52-2 & 52-3.',
        timestamp: now,
        clearingTime: '5.2 s',
        faultMagnitude: 'θ = 124°C (118% In permanent)',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 49',
          event: 'Surcharge thermique prolongée transformateur — Déclenchement réplique thermique',
          breakers: '52-2 [OUVERT], 52-3 [OUVERT]',
          clearing: '5.2 s',
          severity: 'WARNING',
        },
        ...prev.slice(0, 9)
      ]);
    } else if (type === '64R') {
      setQ0TrafoHv(false);
      setQ0TrafoMv(false);
      setQ0T(false);
      setRelayTripped({
        ansi: 'ANSI 64R',
        description_fr: 'DÉFAUT MASSE CUVE TRANSFORMATEUR (Courant de fuite cuve-terre I_mc = 420 A). Déclenchement instantané 52-2 & 52-3.',
        description_en: 'RESTRICTED EARTH FAULT / TANK LEAKAGE (Tank earth current I_mc = 420 A). Instantaneous trip 52-2 & 52-3.',
        timestamp: now,
        clearingTime: '22 ms',
        faultMagnitude: 'I_tank = 420 A',
      });
      setSoeLogs(prev => [
        {
          id: `soe-${Date.now()}`,
          time: now,
          ansi: 'ANSI 64R',
          event: 'Amorçage diélectrique interne vers la cuve métallique — Masse cuve instantanée',
          breakers: '52-2 [OUVERT], 52-3 [OUVERT]',
          clearing: '22 ms',
          severity: 'CRITICAL',
        },
        ...prev.slice(0, 9)
      ]);
    }
  };

  const handleResetProtections = () => {
    const now = new Date().toLocaleTimeString();
    soundEffects.playSuccessChime();
    soundEffects.playBreakerClose();
    setActiveFault(null);
    setRelayTripped(null);
    setQ0Line(true);
    setQ0TrafoHv(true);
    setQ0TrafoMv(true);
    setQ01(true);
    setQ02(true);
    setQ0T(true);
    setQ0Bc(true);
    setQ0RmuT(true);
    setQ0Bt(true);
    setQ0Pv(true);
    setQ0Bess(true);
    setQ0Aux(true);
    setQ033T(true);
    setQ0225Sb(true);
    setQ0Bh1(true);
    setQ0BhM(true);
    setQ0Bh2(true);

    setSoeLogs(prev => [
      {
        id: `soe-${Date.now()}`,
        time: now,
        ansi: 'RESET',
        event: 'Acquittement alarmes & réarmement motorisé des disjoncteurs HT/BT',
        breakers: 'TOUS DISJONCTEURS [FERMÉ]',
        clearing: 'OK',
        severity: 'NORMAL',
      },
      ...prev.slice(0, 9)
    ]);
  };

  const addSoeLog = (entry: Omit<SoeLogEntry, 'id'>) => {
    setSoeLogs(prev => [
      {
        id: `soe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...entry
      },
      ...prev.slice(0, 29)
    ]);
  };

  return {
    activeTopology,
    setActiveTopology,
    bypassInterlocks,
    setBypassInterlocks,
    interlockAlert,
    triggerInterlockWarning,

    // Single Bus
    q0_line,
    q0_trafo_hv,
    q0_trafo_mv,
    q0_f1,
    q0_f2,
    q0_f3,
    qs_line,
    qs_trafo,
    q8_line,
    isLineEnergized,
    isBus225Energized,
    isTrafoEnergized,
    isBus30Energized,
    u_hv_nom,
    u_mv_nom,
    trafoTap,
    setTrafoTap,
    activeLoadMw,
    setActiveLoadMw,
    current_hv,
    current_mv,

    // Double Bus
    qs_bc1,
    q0_bc,
    qs_bc2,
    qs1_a,
    qs1_b,
    q0_1,
    qs1_line,
    q8_1,
    qs2_a,
    qs2_b,
    q0_2,
    qs2_line,
    q8_2,
    qst_a,
    qst_b,
    q0_t,
    isBusA_Energized,
    isBusB_Energized,
    isCouplerClosed,
    isLine1_Energized,
    isLine2_Energized,
    isTrafo_Energized,

    // Breaker and a Half (1-1/2 CB)
    qs_bh_1a,
    q0_bh_1,
    qs_bh_1b,
    q8_bh_cb1,
    qs_bh_l1,
    q8_bh_1,
    qs_bh_m1,
    q0_bh_m,
    qs_bh_m2,
    q8_bh_cbm,
    qs_bh_l2,
    q8_bh_2,
    qs_bh_2a,
    q0_bh_2,
    qs_bh_2b,
    q8_bh_cb2,
    isBus1_Energized,
    isBus2_Energized,
    isLine1Bh_Energized,
    isLine2Bh_Energized,
    isNode1_Energized,
    isNode2_Energized,
    isCbmPath_Energized,

    // RMU
    lbs1,
    q8_rmu1,
    lbs2,
    q8_rmu2,
    q0_rmu_t,
    q8_rmu_t,
    q0_bt,
    q0_bt_f1,
    q0_bt_f2,
    q0_bt_f3,
    isRing1_Energized,
    isRing2_Energized,
    isRmuBus_Energized,
    isDistTrafo_Energized,
    isTgbt_Energized,

    // Solar PV + BESS
    q0_pv,
    q8_pv,
    q0_bess,
    q8_bess,
    q0_aux,
    qs_33_t,
    q0_33_t,
    q0_225_sb,
    qs_225_line_sb,
    q8_225_sb,
    solarIrradiance,
    setSolarIrradiance,
    bessMode,
    setBessMode,
    bessPowerSetting,
    setBessPowerSetting,
    bessSocPercent,
    setBessSocPercent,
    solarPowerMw,
    bessPowerMw,
    totalExportMw,
    reactivePowerMvar,
    isPvGenerating,
    isBessActive,
    isBus33Energized,
    isTrafoHvEnergized,
    isGrid225Connected,

    // Fault & Trips
    activeFault,
    relayTripped,
    soeLogs,
    addSoeLog,
    handleToggle,
    handleSimulateFault,
    handleResetProtections,
  };
};
