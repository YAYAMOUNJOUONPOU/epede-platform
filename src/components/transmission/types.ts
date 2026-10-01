// src/components/transmission/types.ts
// EPEDE Domain D03: Transmission Networks (Transport HT) Types

export type TransmissionVoltage = '400kV' | '225kV' | '90kV' | '60kV';

export type CorridorType = 'overhead_line' | 'underground_cable' | 'hybrid_transition';

// 1. Master Transmission Journey
export interface TransmissionJourneyStage {
  id: string;
  order: number;
  code: string;
  title_fr: string;
  title_en: string;
  category: 'generation_interface' | 'substation_gantry' | 'bulk_corridor' | 'special_crossing' | 'transition' | 'underground' | 'intertie_substation' | 'bulk_infeed';
  voltage_level: string;
  typical_distance_km: number;
  sil_mw: number; // Surge Impedance Loading
  characteristic_impedance_ohms: number;
  reactive_charging_mvar_per_100km: number;
  key_components_fr: string[];
  key_components_en: string[];
  physical_phenomena_fr: string;
  physical_phenomena_en: string;
  governing_formulas: {
    name: string;
    latex: string;
    description: string;
  }[];
  sonatrel_cameroon_benchmark: {
    line_name: string;
    substations: string;
    voltage: string;
    length_km: number;
    specifics_fr: string;
    specifics_en: string;
  };
  operational_rules: string[];
  icon: string;
}

// 2. Overhead Line (OHL) Explorer Tree
export interface OhlComponentNode {
  id: string;
  code: string;
  label_fr: string;
  label_en: string;
  category: 'structure' | 'conductors' | 'insulators' | 'shield_wire' | 'hardware' | 'grounding' | 'signage';
  level: 1 | 2 | 3;
  subsystem_fr: string;
  subsystem_en: string;
  description_fr: string;
  description_en: string;
  technical_specs: {
    key: string;
    value: string;
    unit?: string;
  }[];
  governing_standards: string[];
  failure_modes: {
    mode: string;
    cause: string;
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    mitigation: string;
  }[];
  maintenance_tasks: string[];
  children?: OhlComponentNode[];
}

// 3. Underground Cable (UGC) Explorer Tree
export interface UgcComponentNode {
  id: string;
  code: string;
  label_fr: string;
  label_en: string;
  category: 'conductor_core' | 'dielectric_screen' | 'metallic_sheath' | 'bonding_link_box' | 'terminations_joints' | 'monitoring_dts';
  level: 1 | 2 | 3;
  subsystem_fr: string;
  subsystem_en: string;
  description_fr: string;
  description_en: string;
  technical_specs: {
    key: string;
    value: string;
    unit?: string;
  }[];
  governing_standards: string[];
  failure_modes: {
    mode: string;
    cause: string;
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    mitigation: string;
  }[];
  maintenance_tasks: string[];
  children?: UgcComponentNode[];
}

// 4. Equipment Object Schema (Phase 2 Canonical Model)
export interface CanonicalTransmissionEquipment {
  id: string;
  canonical_code: string;
  name_fr: string;
  name_en: string;
  domain_code: 'D03';
  subdomain_code: 'D03.01' | 'D03.02' | 'D03.03';
  classification: {
    system_type: 'Overhead_Line' | 'Underground_Cable' | 'Hybrid_Corridor' | 'Transition_Bay';
    voltage_class: 'HTB_225kV' | 'HTB_400kV' | 'HTB_90kV';
    iec_functional_id: string;
  };
  electrical_parameters: {
    rated_voltage_un_kv: number;
    highest_voltage_um_kv: number;
    nominal_frequency_hz: number;
    rated_continuous_current_a: number;
    short_circuit_withstand_ka_1s: number;
    bil_lightning_impulse_kv_peak: number;
    sil_switching_impulse_kv_peak: number;
    positive_sequence_r1_ohm_per_km: number;
    positive_sequence_x1_ohm_per_km: number;
    positive_sequence_b1_microsiemens_per_km: number;
    zero_sequence_r0_ohm_per_km: number;
    zero_sequence_x0_ohm_per_km: number;
    zero_sequence_b0_microsiemens_per_km: number;
    surge_impedance_zc_ohms: number;
    surge_impedance_loading_sil_mw: number;
  };
  physical_geometry: {
    conductor_type: string;
    cross_section_mm2: number;
    bundle_configuration: 'Simplex' | 'Duplex_400mm' | 'Triplex' | 'Quad_450mm';
    overall_diameter_mm: number;
    linear_weight_kg_per_km: number;
    ruling_span_m: number;
    max_sag_at_75c_m: number;
    right_of_way_width_m: number;
    min_ground_clearance_m: number;
  };
  thermal_ampacity: {
    winter_continuous_mva: number;
    summer_continuous_mva: number;
    emergency_15min_mva: number;
    conductor_max_temp_c: number;
    dlr_enabled: boolean; // Dynamic Line Rating
  };
  cigre_asset_health: {
    health_index_score: number; // 0 to 100
    estimated_lifespan_years: number;
    current_age_years: number;
    critical_inspection_criteria: string[];
    partial_discharge_status?: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
    thermography_status: 'NORMAL' | 'HOTSPOT_DETECTED';
  };
  cameroon_corridor_application: {
    corridor_name: string;
    owner_operator: 'SONATREL' | 'Eneo' | 'Eneo / SONATREL';
    commissioning_year: number;
    length_km: number;
  };
}

// 5. Physical / Electrical / Functional Layer Model
export interface CatenaryModel {
  span_length_m: number;
  conductor_tension_dan: number;
  conductor_weight_dan_per_m: number;
  conductor_temp_c: number;
  ambient_temp_c: number;
  wind_speed_ms: number;
  calculated_sag_m: number;
  ground_clearance_margin_m: number;
  safety_clearance_status: 'SAFE' | 'WARNING' | 'VIOLATION';
}

export interface ElectricalPiModel {
  length_km: number;
  frequency_hz: number;
  r_total_ohms: number;
  x_total_ohms: number;
  b_total_microsiemens: number;
  surge_impedance_ohms: number;
  propagation_constant_rad_per_km: number;
  no_load_ferranti_ratio: number;
  charging_mvar: number;
  voltage_drop_percent: number;
  joule_losses_mw: number;
}

// 6. Relationship and State Model
export type OperationalState =
  | 'NOMINAL_IN_SERVICE'
  | 'THERMAL_ALERT'
  | 'N_MINUS_1_OVERLOAD'
  | 'TRIPPED_FAULT_LOCKOUT'
  | 'EARTHED_MAINTENANCE';

export type TransmissionOperationalState = 
  | 'IN_SERVICE_NOMINAL'
  | 'THERMAL_OVERLOAD_WARNING'
  | 'CONTINGENCY_N1_OVERRIDE'
  | 'TRIPPED_AUTO_RECLOSE_PENDING'
  | 'TRIPPED_LOCKOUT'
  | 'DE_ENERGIZED_ISOLATED'
  | 'EARTHED_MAINTENANCE';

export interface TopologicalNode {
  id: string;
  name: string;
  type: 'SUBSTATION_BAY' | 'OVERHEAD_SECTION' | 'CABLE_SECTION' | 'TRANSITION_YARD' | 'INTERTIE_BUS';
  voltage_kv: number;
  connected_to: string[];
  mutual_coupling_with?: string;
  scada_status: 'CLOSED' | 'OPEN' | 'FAULT' | 'MAINTENANCE';
}

// 7. Protection and Telecom Overlay
export interface ProtectionZoneConfig {
  zone: 'Zone 1' | 'Zone 2' | 'Zone 3' | 'Reverse Zone 4';
  reach_percent: number;
  reach_ohms_primary: number;
  time_delay_s: number;
  directional: 'FORWARD' | 'REVERSE';
  scheme: 'INSTANTANEOUS' | 'TIME_DELAYED' | 'TELEPROTECTION_TRIP';
}

export interface TeleprotectionScheme {
  name: 'POTT' | 'PUTT' | 'BCC' | 'DTT';
  full_name: string;
  description_fr: string;
  description_en: string;
  communication_medium: 'OPGW_FIBER' | 'MICROWAVE' | 'PLC_CARRIER';
  latency_ms: number;
  trip_time_total_ms: number;
}

// 8. Scenario Simulator Model
export interface TransmissionScenario {
  id: string;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  physics_basis_fr: string;
  physics_basis_en: string;
  initial_conditions: {
    voltage_kv: number;
    length_km: number;
    load_mw: number;
    power_factor: number;
    ambient_temp_c: number;
    wind_speed_ms: number;
    reactor_mvar?: number;
  };
  governing_law: string;
  key_learning_fr: string;
  key_learning_en: string;
  sonatrel_reference: string;
}

// 9. EPEDE Module Reuse Map
export interface EpedeModuleReuse {
  source_module: string;
  source_name_fr: string;
  source_name_en: string;
  data_flowing_in: string[];
  data_flowing_out: string[];
  shared_interfaces: string[];
  engineering_rationale_fr: string;
  engineering_rationale_en: string;
  link_route: string;
}
