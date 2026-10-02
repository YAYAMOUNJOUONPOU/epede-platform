// src/components/diagrams/services/CaeSimulationExportService.ts
// EPEDE — Computer-Aided Engineering (CAE) Power System Simulation Export Service
// Generates production-ready model exchange files for:
// 1. DIgSILENT PowerFactory DGS Format (.dgs)
// 2. ETAP / PSS/E / IEEE Common Data Format (.raw)
// 3. MATPOWER / MATLAB Simulation Script (.m)
// 4. Python pandapower & PyPSA Network Script (.py)

import type { SldTopologyType } from '../modules/SldHeaderToolbar';

export type CaeFormat = 'digsilent_dgs' | 'etap_raw' | 'matpower_m' | 'pandapower_py';

export interface CaeExportPayload {
  filename: string;
  mimeType: string;
  format: CaeFormat;
  content: string;
  instructions: { fr: string; en: string };
}

interface ExportContext {
  topology: SldTopologyType;
  locale: 'fr' | 'en';
  telemetry?: {
    voltageHv?: number;
    voltageMv?: number;
    voltageLv?: number;
    activePowerMw?: number;
    reactivePowerMvar?: number;
    frequencyHz?: number;
  };
}

/**
 * 1. DIgSILENT PowerFactory DGS (Data Generation Script / ASCII-DGS Exchange Format)
 * Adheres to DIgSILENT PowerFactory Version 2024+ DGS standard.
 */
export function generateDigsilentDgs(ctx: ExportContext): string {
  const top = ctx.topology;
  const timestamp = new Date().toISOString();

  let header = `$$ DIgSILENT PowerFactory DGS Data File
$$ Created by EPEDE (Electrical Power Engineering Digital Environment)
$$ Export Date: ${timestamp}
$$ Target Grid Model: ${top.toUpperCase()}
$$ Voltage Level: 225 kV / 30 kV / 0.4 kV
------------------------------------------------------------------------
**DGS Version: 4.0
**Project: EPEDE_${top.toUpperCase()}
`;

  switch (top) {
    case 'single_bus':
      return `${header}
$$ General Project Settings
$GENERAL
F: ID(s) Name(s) Type(s)
C: "EPEDE_PRJ" "Substation 225/30 kV Single Bus" "Prj"

$$ Busbars / Terminals (ElmTerm)
$ElmTerm
F: ID(s) loc_name(s) ucomp(r) ubase(r) phtype(i)
C: "BB_225" "JDB 225kV" 225.0 225.0 0
C: "BB_30"  "JDB 30kV"  30.0  30.0  0
C: "BUS_LV" "TGBT 400V" 0.4   0.4   0

$$ External Grid / Infeed Incomer (ElmXnet)
$ElmXnet
F: ID(s) loc_name(s) bus1(s) ucomp(r) skss(r) rxratio(r)
C: "GRID_SONATREL" "Reseau THT 225kV" "BB_225" 225.0 3500.0 10.0

$$ Two-Winding Power Transformer (ElmTr2) - 225/30 kV 40 MVA ONAN/ONAF per IEC 60076
$ElmTr2
F: ID(s) loc_name(s) bus1(s) bus2(s) Snom(r) utrn_h(r) utrn_l(r) uk(r) Pkr(r) vector_grp(s)
C: "TR_40MVA" "TR1 225/30kV 40MVA" "BB_225" "BB_30" 40.0 225.0 30.0 12.5 145.0 "YNd11"

$$ Transmission Line / Feeder (ElmLne) - Almelec 366 mm² per IEC 60909
$ElmLne
F: ID(s) loc_name(s) bus1(s) bus2(s) dline(r) r1(r) x1(r) c1(r) Inom(r)
C: "L_225_IN" "Ligne 225kV Bekoko" "GRID_SONATREL" "BB_225" 45.0 0.092 0.380 9.8 850.0

$$ Outgoing MV Feeders / Loads (ElmLod)
$ElmLod
F: ID(s) loc_name(s) bus1(s) plod(r) qlod(r) cosphi(r)
C: "LOAD_DEP1" "Depart HTA 1 (Zone Ind)" "BB_30" 12.5 4.8 0.93
C: "LOAD_DEP2" "Depart HTA 2 (Ville)"    "BB_30" 14.0 5.2 0.94
C: "LOAD_AUX"  "Auxiliaires Poste 400V"  "BUS_LV" 0.15 0.05 0.95

$$ Circuit Breakers & Disconnectors (ElmCoup)
$ElmCoup
F: ID(s) loc_name(s) bus1(s) bus2(s) on_off(i) Inom(r) I_k(r)
C: "Q0_LINE"  "DJ Ligne 225kV (SF6)" "BB_225" "L_225_IN" 1 2000.0 40.0
C: "Q0_TR_HV" "DJ Primaire TR 225kV" "BB_225" "TR_40MVA" 1 1250.0 40.0
C: "Q0_TR_MV" "DJ Secondaire TR 30kV" "BB_30" "TR_40MVA" 1 2500.0 25.0
$$ END OF FILE
`;

    case 'double_bus':
      return `${header}
$$ Double Busbar Substation 225 kV with Bus Coupler (CEI 62271-200)
$ElmTerm
F: ID(s) loc_name(s) ucomp(r) ubase(r) phtype(i)
C: "BB1_225" "Jeu de Barres 1 (BB1 225kV)" 225.0 225.0 0
C: "BB2_225" "Jeu de Barres 2 (BB2 225kV)" 225.0 225.0 0
C: "BB_30KV" "Jeu de Barres MT 30kV"       30.0  30.0  0

$$ Bus Coupler Bay (ElmCoup)
$ElmCoup
F: ID(s) loc_name(s) bus1(s) bus2(s) on_off(i) Inom(r) I_k(r)
C: "Q0_COUPLER" "Disjoncteur Couplage (Q0_BC)" "BB1_225" "BB2_225" 1 3150.0 50.0

$$ Bay 1: Line Incomer 1 (Feeder 1 to BB1/BB2)
$ElmLne
F: ID(s) loc_name(s) bus1(s) bus2(s) dline(r) r1(r) x1(r) c1(r) Inom(r)
C: "L_LINE1" "Ligne 225kV Mangombe" "BB1_225" "BB2_225" 68.0 0.088 0.375 10.1 920.0

$$ Bay 2: Line Incomer 2 (Feeder 2 to BB1/BB2)
$ElmLne
F: ID(s) loc_name(s) bus1(s) bus2(s) dline(r) r1(r) x1(r) c1(r) Inom(r)
C: "L_LINE2" "Ligne 225kV Nachtigal" "BB1_225" "BB2_225" 82.0 0.088 0.375 10.1 920.0

$$ Bay 3: Step-Down Transformer 225/30 kV 63 MVA
$ElmTr2
F: ID(s) loc_name(s) bus1(s) bus2(s) Snom(r) utrn_h(r) utrn_l(r) uk(r) Pkr(r) vector_grp(s)
C: "TR_63MVA" "TR Autotransfo 225/30kV" "BB1_225" "BB_30KV" 63.0 225.0 30.0 11.8 195.0 "YNd11"

$$ Circuit Breakers
$ElmCoup
F: ID(s) loc_name(s) bus1(s) bus2(s) on_off(i) Inom(r) I_k(r)
C: "Q0_BAY1" "DJ Depart 1 Ligne" "BB1_225" "L_LINE1" 1 2500.0 50.0
C: "Q0_BAY2" "DJ Depart 2 Ligne" "BB2_225" "L_LINE2" 1 2500.0 50.0
C: "Q0_TR"   "DJ Depart Transfo" "BB1_225" "TR_63MVA" 1 2000.0 50.0
$$ END OF FILE
`;

    case 'breaker_and_half':
      return `${header}
$$ Breaker-and-a-Half (1-1/2 CB) Substation 225 kV Configuration per IEEE C37
$ElmTerm
F: ID(s) loc_name(s) ucomp(r) ubase(r) phtype(i)
C: "BUS_NORTH" "JDB Nord 225kV (BB-N)" 225.0 225.0 0
C: "BUS_SOUTH" "JDB Sud 225kV (BB-S)"  225.0 225.0 0
C: "NODE_MID1" "Noeud Intermediaire 1"  225.0 225.0 0
C: "NODE_MID2" "Noeud Intermediaire 2"  225.0 225.0 0

$$ 3 Circuit Breakers per Diameter (Nord, Milieu, Sud)
$ElmCoup
F: ID(s) loc_name(s) bus1(s) bus2(s) on_off(i) Inom(r) I_k(r)
C: "Q0_NORTH"  "Disjoncteur Nord (CB-N)"  "BUS_NORTH" "NODE_MID1" 1 3150.0 50.0
C: "Q0_MIDDLE" "Disjoncteur Centre (CB-M)" "NODE_MID1" "NODE_MID2" 1 3150.0 50.0
C: "Q0_SOUTH"  "Disjoncteur Sud (CB-S)"   "NODE_MID2" "BUS_SOUTH" 1 3150.0 50.0

$$ Circuit 1 (Line 1 connected at Mid-Node 1)
$ElmLne
F: ID(s) loc_name(s) bus1(s) bus2(s) dline(r) r1(r) x1(r) c1(r) Inom(r)
C: "LINE_1" "Ligne THT Circuit 1" "NODE_MID1" "BUS_NORTH" 55.0 0.085 0.370 10.2 1200.0

$$ Circuit 2 (Line 2 connected at Mid-Node 2)
$ElmLne
F: ID(s) loc_name(s) bus1(s) bus2(s) dline(r) r1(r) x1(r) c1(r) Inom(r)
C: "LINE_2" "Ligne THT Circuit 2" "NODE_MID2" "BUS_SOUTH" 55.0 0.085 0.370 10.2 1200.0
$$ END OF FILE
`;

    case 'rmu_distribution':
      return `${header}
$$ Ring Main Unit (RMU) 30 kV Distribution Substation per IEC 62271-200
$ElmTerm
F: ID(s) loc_name(s) ucomp(r) ubase(r) phtype(i)
C: "BB_RMU_30" "JDB Interne RMU 30kV" 30.0 30.0 0
C: "BB_LV_400" "JDB TGBT Basse Tension 400V" 0.4 0.4 0

$$ Load-Break Switches (LBS) for MV Ring
$ElmCoup
F: ID(s) loc_name(s) bus1(s) bus2(s) on_off(i) Inom(r) I_k(r)
C: "LBS_IN_1" "Interrupteur Arrivee Boucle 1" "BB_RMU_30" "BB_RMU_30" 1 630.0 20.0
C: "LBS_IN_2" "Interrupteur Depart Boucle 2"  "BB_RMU_30" "BB_RMU_30" 1 630.0 20.0
C: "CB_TRAFO" "Disjoncteur Protection Transfo" "BB_RMU_30" "TR_DIST" 1 200.0 20.0

$$ Distribution Transformer 630 kVA 30 kV / 400 V Tier 2 EcoDesign
$ElmTr2
F: ID(s) loc_name(s) bus1(s) bus2(s) Snom(r) utrn_h(r) utrn_l(r) uk(r) Pkr(r) vector_grp(s)
C: "TR_DIST" "Transfo HTA/BT 630kVA" "BB_RMU_30" "BB_LV_400" 0.630 30.0 0.400 4.0 6.5 "Dyn11"

$$ Low Voltage Load Feeders
$ElmLod
F: ID(s) loc_name(s) bus1(s) plod(r) qlod(r) cosphi(r)
C: "LOAD_LV_COMM" "Depart Tertiaire / Bureaux" "BB_LV_400" 0.280 0.092 0.95
C: "LOAD_LV_HVAC" "Depart Climatisation / HVAC" "BB_LV_400" 0.160 0.078 0.90
$$ END OF FILE
`;

    case 'solar_bess':
    default:
      return `${header}
$$ Hybrid Solar PV + BESS Utility Substation 30 kV
$ElmTerm
F: ID(s) loc_name(s) ucomp(r) ubase(r) phtype(i)
C: "BB_COLLECTOR" "JDB Collecteur HTA 30kV" 30.0 30.0 0
C: "BUS_PV_480"   "JDB Onduleur Solaire 480V" 0.48 0.48 0
C: "BUS_BESS_480" "JDB Onduleur BESS 480V"    0.48 0.48 0

$$ PV Inverter Generator (ElmGenstat)
$ElmGenstat
F: ID(s) loc_name(s) bus1(s) pnom(r) cosphi(r) mode(s)
C: "PV_FARM" "Centrale Solaire PV 20 MWp" "BUS_PV_480" 20.0 0.98 "PV"

$$ Battery Energy Storage System (ElmGenstat / BESS)
$ElmGenstat
F: ID(s) loc_name(s) bus1(s) pnom(r) cosphi(r) mode(s)
C: "BESS_10MW" "BESS Li-ion 10MW / 40MWh" "BUS_BESS_480" 10.0 0.95 "PQ"

$$ Inverter Step-Up Transformers 0.48 / 30 kV
$ElmTr2
F: ID(s) loc_name(s) bus1(s) bus2(s) Snom(r) utrn_h(r) utrn_l(r) uk(r) Pkr(r) vector_grp(s)
C: "TR_PV"   "Transfo Elevation PV 22MVA"   "BB_COLLECTOR" "BUS_PV_480"   22.0 30.0 0.48 6.5 120.0 "Dy11"
C: "TR_BESS" "Transfo Elevation BESS 12MVA" "BB_COLLECTOR" "BUS_BESS_480" 12.0 30.0 0.48 6.0 65.0  "Dy11"
$$ END OF FILE
`;
  }
}

/**
 * 2. ETAP / PSS/E / IEEE Common Data Format (IEEE CDF / .raw)
 * Compatible with ETAP PowerStation 2024, Siemens PSS/E v33/34, and IEEE 14/30 bus benchmark solvers.
 */
export function generateEtapRaw(ctx: ExportContext): string {
  const top = ctx.topology;
  const timestamp = new Date().toISOString();

  return `0,   100.00,  33, 0, 1, 50.00     / EPEDE IEEE-CDF RAW FILE: ${top.toUpperCase()} (${timestamp})
${top.toUpperCase()} SUBSTATION MODEL - EXPORTED FROM EPEDE DIGITAL TWIN
BASE MVA: 100.00 MVA, SYSTEM FREQUENCY: 50.00 HZ (IEC 60038)
/ BEGIN BUS DATA CARDS
    1, 'BUS_225_HV   ', 225.000, 3, 1.020,   0.000,   1, 1, 1.050, 0.950,     0.0,     0.0, 1
    2, 'BUS_30_MV     ',  30.000, 1, 0.995,  -3.450,   1, 1, 1.050, 0.950,    28.5,    11.2, 1
    3, 'BUS_AUX_LV    ',   0.400, 1, 0.985,  -4.820,   1, 1, 1.050, 0.950,     0.4,     0.1, 1
    4, 'BUS_COUPLER   ', 225.000, 2, 1.015,  -0.120,   1, 1, 1.050, 0.950,     0.0,     0.0, 1
0 / END BUS DATA
/ BEGIN GENERATOR DATA CARDS
    1, '1 ',    0.000,    0.000,  150.000, -150.000, 1.02000,     0,   500.000, 0.00200, 0.15000, 0.00000, 0.00000, 1.0000, 1, 100.0,  350.000,   10.000, 1, 1.0000
0 / END GENERATOR DATA
/ BEGIN BRANCH / TRANSMISSION LINE DATA CARDS
    1,     4, '1 ', 0.00240, 0.01850, 0.08500,  950.00,  950.00,  950.00, 0.000, 0.000, 0.000, 0.000, 1, 1,   0.00, 1, 1.0000
    2,     3, '1 ', 0.01500, 0.04500, 0.00000,   50.00,   50.00,   50.00, 0.000, 0.000, 0.000, 0.000, 1, 1,   0.00, 1, 1.0000
0 / END BRANCH DATA
/ BEGIN TRANSFORMER DATA CARDS
    1,     2,     0, '1 ', 1, 2, 1, 0.00000, 0.00000, 2, 'TR_225_30   ', 1, 1, 1.0000
0.00450, 0.11800,  40.00
1.00000,   0.000, 225.000,  30.000,   0.00,   0.00,   0.00, 0,     0, 1.00000, 1.00000, 1.00000,  33, 0, 1.10000, 0.90000, 1.10000, 0.90000, 0.00625, 0, 0.00, 0.00
0 / END TRANSFORMER DATA
/ BEGIN SWITCHED SHUNT DATA CARDS
    2, 1, 1.0200, 0.9800, 0, 0.0000, 'CAP_BANK_MV', 0.00, 1, 5.000
0 / END SWITCHED SHUNT DATA
Q
`;
}

/**
 * 3. MATPOWER / MATLAB Simulation Script (.m)
 * Standard case struct runnable directly in MATLAB via `runpf(case_name)` or `runopf(case_name)`.
 */
export function generateMatpowerM(ctx: ExportContext): string {
  const top = ctx.topology;
  const timestamp = new Date().toISOString();

  return `% MATPOWER Case File generated by EPEDE (Electrical Power Engineering Digital Environment)
% Topology: ${top.toUpperCase()}
% Exported: ${timestamp}
% Run using: >> results = runpf(epede_${top});

function mpc = epede_${top}
%% MATPOWER Case Format : Version 2
mpc.version = '2';

%%-----  Power Flow Base MVA  -----%%
mpc.baseMVA = 100;

%%-----  Bus Data  -----%%
% bus_i type Pd Qd Gs Bs area Vm Va baseKV zone Vmax Vmin
mpc.bus = [
    1   3   0       0       0   0   1   1.02    0.0     225     1   1.10    0.90;   % HV Grid Slack Bus (225 kV)
    2   1   24.5    8.2     0   0   1   1.00   -2.8      30     1   1.05    0.95;   % MV Busbar (30 kV)
    3   1    4.2    1.1     0   0   1   0.99   -4.1     0.4     1   1.05    0.95;   % LV Switchboard (400 V)
    4   1    0      0       0   0   1   1.01   -0.5     225     1   1.10    0.90;   % Reserve / Coupler Bus
];

%%-----  Generator Data  -----%%
% bus Pg Qg Qmax Qmin Vg mBase status Pmax Pmin Pc1 Pc2 Qc1min Qc1max Qc2min Qc2max ramp_agc ramp_10 ramp_30 ramp_q apf
mpc.gen = [
    1   28.7   9.3   80.0  -40.0   1.02   100   1   350   0   0 0 0 0 0 0 0 0 0 0 0;
];

%%-----  Branch Data  -----%%
% fbus tbus r x b rateA rateB rateC ratio angle status angmin angmax
mpc.branch = [
    1   4   0.0035  0.0280  0.0450  150  180  200  0      0   1   -360  360;  % 225 kV Line
    4   2   0.0052  0.1250  0       40   45   50   1.000  0   1   -360  360;  % 225/30 kV 40 MVA Transformer
    2   3   0.0180  0.0620  0        5    6    8   1.000  0   1   -360  360;  % 30/0.4 kV Auxiliary Transformer
];

%%-----  Generator Cost Data  -----%%
% 2 startup shutdown n c(n-1) ... c0
mpc.gencost = [
    2   0   0   3   0.025   22.5   0;
];
end
`;
}

/**
 * 4. Python pandapower & PyPSA Script (.py)
 * Open-source power system modeling script ready for interactive Python analysis.
 */
export function generatePandapowerPy(ctx: ExportContext): string {
  const top = ctx.topology;
  const timestamp = new Date().toISOString();

  return `#!/usr/bin/env python3
"""
EPEDE Digital Twin Export — Python pandapower Simulation Script
Topology: ${top.toUpperCase()}
Generated: ${timestamp}
Requirements: pip install pandapower numpy matplotlib
"""

import pandapower as pp
import pandapower.networks as pn
import pandapower.topology as top

# 1. Initialize Network with 100 MVA Base
net = pp.create_empty_network(name="EPEDE_${top.toUpperCase()}", f_hz=50.0)

# 2. Define Buses per IEC 60038 Standard Voltage Tiers
b_225_grid = pp.create_bus(net, vn_kv=225.0, name="JDB THT 225kV Grid", zone="TRANSMISSION")
b_225_sub  = pp.create_bus(net, vn_kv=225.0, name="JDB 225kV Poste", zone="SUBSTATION")
b_30_mv    = pp.create_bus(net, vn_kv=30.0,  name="JDB HTA 30kV", zone="DISTRIBUTION")
b_04_lv    = pp.create_bus(net, vn_kv=0.4,   name="TGBT Basse Tension 400V", zone="UTILIZATION")

# 3. External Grid Incomer (Slack Bus)
pp.create_ext_grid(net, bus=b_225_grid, vm_pu=1.02, va_degree=0.0, s_sc_max_mva=3500.0, rx_max=0.1, name="Grid Infeed (SONATREL)")

# 4. High-Voltage Transmission Line (Almelec 366 mm² per IEC 60909)
pp.create_line_from_parameters(
    net,
    from_bus=b_225_grid,
    to_bus=b_225_sub,
    length_km=32.5,
    r_ohm_per_km=0.088,
    x_ohm_per_km=0.375,
    c_nf_per_km=9.8,
    max_i_ka=0.920,
    name="Ligne THT 225kV"
)

# 5. Power Transformer 225/30 kV 40 MVA YNd11 (IEC 60076)
pp.create_transformer_from_parameters(
    net,
    hv_bus=b_225_sub,
    lv_bus=b_30_mv,
    sn_mva=40.0,
    vn_hv_kv=225.0,
    vn_lv_kv=30.0,
    vkr_percent=0.36,
    vk_percent=12.5,
    pfe_kw=32.0,
    i0_percent=0.08,
    name="TR1 225/30kV 40MVA"
)

# 6. Distribution Transformer 30 kV / 400 V 630 kVA Dyn11
pp.create_transformer_from_parameters(
    net,
    hv_bus=b_30_mv,
    lv_bus=b_04_lv,
    sn_mva=0.630,
    vn_hv_kv=30.0,
    vn_lv_kv=0.4,
    vkr_percent=1.1,
    vk_percent=4.0,
    pfe_kw=0.85,
    i0_percent=0.15,
    name="TR Auxiliaire 630kVA"
)

# 7. Distribution Loads (Active & Reactive Power)
pp.create_load(net, bus=b_30_mv, p_mw=18.5, q_mvar=6.2, name="Depart HTA Industriel")
pp.create_load(net, bus=b_30_mv, p_mw=12.0, q_mvar=3.8, name="Depart HTA Urbain")
pp.create_load(net, bus=b_04_lv, p_mw=0.25, q_mvar=0.08, name="Services Auxiliaires TGBT")

# 8. Run AC Newton-Raphson Load Flow per IEC 60909
print("[EPEDE CAE Bridge] Running AC Newton-Raphson Power Flow...")
pp.runpp(net, algorithm="nr", calculate_voltage_angles=True)

# 9. Print Concise Engineering Summary
print("\\n--- BUS RESULTS ---")
print(net.res_bus[["vm_pu", "va_degree", "p_mw", "q_mvar"]])

print("\\n--- TRANSFORMER LOADING ---")
print(net.res_trafo[["p_hv_mw", "loading_percent"]])

print("\\n--- TRANSMISSION LINE LOADING ---")
print(net.res_line[["loading_percent", "i_ka"]])
`;
}

/**
 * Universal CAE Model Exporter Factory
 */
export function buildCaeExportPayload(format: CaeFormat, ctx: ExportContext): CaeExportPayload {
  const top = ctx.topology;
  const isFr = ctx.locale === 'fr';

  switch (format) {
    case 'digsilent_dgs':
      return {
        format,
        filename: `epede_${top}_digsilent_export.dgs`,
        mimeType: 'text/plain;charset=utf-8',
        content: generateDigsilentDgs(ctx),
        instructions: {
          fr: 'Ouvrez DIgSILENT PowerFactory → File → Import → DGS Data Exchange Format (.dgs). Sélectionnez ce fichier pour instancier automatiquement les jeux de barres, transformateurs et disjoncteurs.',
          en: 'Open DIgSILENT PowerFactory → File → Import → DGS Data Exchange Format (.dgs). Select this file to automatically instantiate busbars, transformers, and switchgear.'
        }
      };

    case 'etap_raw':
      return {
        format,
        filename: `epede_${top}_etap_ieee_cdf.raw`,
        mimeType: 'text/plain;charset=utf-8',
        content: generateEtapRaw(ctx),
        instructions: {
          fr: 'Dans ETAP PowerStation ou PSS/E → File → Import IEEE Common Data Format (CDF) / PSS/E RAW File. Les nœuds, générateurs et branches seront mappés.',
          en: 'In ETAP PowerStation or PSS/E → File → Import IEEE Common Data Format (CDF) / PSS/E RAW File. Buses, branches, and generators will be mapped.'
        }
      };

    case 'matpower_m':
      return {
        format,
        filename: `epede_${top}.m`,
        mimeType: 'text/x-matlab;charset=utf-8',
        content: generateMatpowerM(ctx),
        instructions: {
          fr: 'Placez le fichier dans votre workspace MATLAB / Octave avec MATPOWER installé. Exécutez : results = runpf(epede_' + top + '); pour résoudre l\'écoulement de charges.',
          en: 'Place the file in your MATLAB / Octave workspace with MATPOWER installed. Execute: results = runpf(epede_' + top + '); to solve power flow.'
        }
      };

    case 'pandapower_py':
    default:
      return {
        format,
        filename: `epede_${top}_simulation.py`,
        mimeType: 'text/x-python;charset=utf-8',
        content: generatePandapowerPy(ctx),
        instructions: {
          fr: 'Exécutez dans un terminal Python : pip install pandapower && python ' + `epede_${top}_simulation.py` + ' pour exécuter le calcul de flux Newton-Raphson CEI 60909.',
          en: 'Run in a Python terminal: pip install pandapower && python ' + `epede_${top}_simulation.py` + ' to execute IEC 60909 Newton-Raphson load flow.'
        }
      };
  }
}
