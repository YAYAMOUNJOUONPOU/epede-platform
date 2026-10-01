// src/components/common/EngineeringInfographicRenderer.tsx
import React, { useState } from 'react';
import { ENGINEERING_INFOGRAPHICS, EngineeringInfographic } from '../../data/engineeringInfographics';
import { PowerSystemsEngineeringDiagram } from '../diagrams/infographics/PowerSystemsEngineeringDiagram';
import { TransmissionVsDistributionDiagram } from '../diagrams/infographics/TransmissionVsDistributionDiagram';
import { SubstationOverviewDiagram } from '../diagrams/infographics/SubstationOverviewDiagram';
import { SubstationComponentsDiagram } from '../diagrams/infographics/SubstationComponentsDiagram';
import { SubstationSldDiagram } from '../diagrams/infographics/SubstationSldDiagram';
import { SubstationProtectionZonesDiagram } from '../diagrams/infographics/SubstationProtectionZonesDiagram';
import { SubstationGroundGridDiagram } from '../diagrams/infographics/SubstationGroundGridDiagram';
import { ThermalPowerPlantConversionDiagram } from '../diagrams/infographics/ThermalPowerPlantConversionDiagram';
import { CommonPowerDistributionTypesDiagram } from '../diagrams/infographics/CommonPowerDistributionTypesDiagram';
import { HowTransformerWorksDiagram } from '../diagrams/infographics/HowTransformerWorksDiagram';
import { WhyHighVoltageReducesLossesDiagram } from '../diagrams/infographics/WhyHighVoltageReducesLossesDiagram';
import { HowPowerDistributionWorksDiagram } from '../diagrams/infographics/HowPowerDistributionWorksDiagram';
import { HowPowerGenerationWorksDiagram } from '../diagrams/infographics/HowPowerGenerationWorksDiagram';
import { HowPowerTransmissionWorksDiagram } from '../diagrams/infographics/HowPowerTransmissionWorksDiagram';
import { TransformerNameplateDiagram } from '../diagrams/infographics/TransformerNameplateDiagram';
import { MainPowerGenerationTypesDiagram } from '../diagrams/infographics/MainPowerGenerationTypesDiagram';
import { RenewableCollectorSubstationDiagram } from '../diagrams/infographics/RenewableCollectorSubstationDiagram';
import { SubstationDcTripCircuitDiagram } from '../diagrams/infographics/SubstationDcTripCircuitDiagram';
import { MvFeederFlisrAutomationDiagram } from '../diagrams/infographics/MvFeederFlisrAutomationDiagram';
import { IndustrialMotorProtectionDiagram } from '../diagrams/infographics/IndustrialMotorProtectionDiagram';
import { SolarBessGridInterconnectionDiagram } from '../diagrams/infographics/SolarBessGridInterconnectionDiagram';
import { TransmissionDistanceProtectionDiagram } from '../diagrams/infographics/TransmissionDistanceProtectionDiagram';
import { Layers, Image as ImageIcon } from 'lucide-react';

interface Props {
  infographicId: string;
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
  className?: string;
  showToggle?: boolean;
}

export const EngineeringInfographicRenderer: React.FC<Props> = ({
  infographicId,
  locale,
  onSelectHotspot,
  selectedHotspotId,
  className = '',
  showToggle = true
}) => {
  const [viewMode, setViewMode] = useState<'VECTOR' | 'IMAGE'>('VECTOR');
  const [imgLoadError, setImgLoadError] = useState(false);

  const data: EngineeringInfographic | undefined = ENGINEERING_INFOGRAPHICS[infographicId];

  if (!data) {
    return (
      <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm">
        Infographie non trouvée : {infographicId}
      </div>
    );
  }

  const renderVectorDiagram = () => {
    switch (infographicId) {
      case 'what-is-power-systems':
      case 'what_is_power_systems':
      case 'power_systems_engineering':
        return (
          <PowerSystemsEngineeringDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'transmission-vs-distribution':
      case 'transmission_vs_distribution':
        return (
          <TransmissionVsDistributionDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'substation-overview':
      case 'substation_overview':
        return (
          <SubstationOverviewDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'substation-components':
      case 'substation_components':
        return (
          <SubstationComponentsDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'substation-one-line-diagram':
      case 'substation_sld':
      case 'substation-sld':
        return (
          <SubstationSldDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'substation-protection-zones':
      case 'substation_protection_zones':
        return (
          <SubstationProtectionZonesDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'substation-ground-grid':
      case 'substation_ground_grid':
        return (
          <SubstationGroundGridDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'thermal-power-plant':
      case 'thermal_power_conversion':
      case 'thermal-power-conversion':
        return (
          <ThermalPowerPlantConversionDiagram 
            locale={locale} 
            onSelectHotspot={onSelectHotspot} 
            selectedHotspotId={selectedHotspotId} 
          />
        );
      case 'common-power-distribution-system-types':
      case 'common_power_distribution_system_types':
      case 'distribution_system_types':
      case 'distribution-system-types':
        return (
          <CommonPowerDistributionTypesDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'how-a-transformer-works':
      case 'how_a_transformer_works':
      case 'how-transformer-works':
        return (
          <HowTransformerWorksDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'why-high-voltage-reduces-losses':
      case 'why_high_voltage_reduces_losses':
      case 'how-high-voltage-reduces-losses':
      case 'how_high_voltage_reduces_losses':
      case 'high_voltage_reduces_losses':
        return (
          <WhyHighVoltageReducesLossesDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'how-power-distribution-works':
      case 'how_power_distribution_works':
        return (
          <HowPowerDistributionWorksDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'how-power-generation-works':
      case 'how_power_generation_works':
        return (
          <HowPowerGenerationWorksDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'how-power-transmission-works':
      case 'how_power_transmission_works':
        return (
          <HowPowerTransmissionWorksDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'how-to-read-a-transformer-nameplate':
      case 'how_to_read_a_transformer_nameplate':
      case 'transformer_nameplate':
      case 'transformer-nameplate':
        return (
          <TransformerNameplateDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'main-types-of-power-generation':
      case 'main_types_of_power_generation':
      case 'generation_types':
        return (
          <MainPowerGenerationTypesDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'renewable-collector-substation':
      case 'renewable_collector_substation':
      case 'renewable-collector-substation-substations':
      case 'renewable_collector_substation_substations':
        return (
          <RenewableCollectorSubstationDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'substation-dc-auxiliary-and-trip-circuit':
      case 'substation_dc_auxiliary_and_trip_circuit':
      case 'trip_circuit_supervision':
      case 'trip-circuit-supervision':
      case 'ansi_74tc_50bf':
      case 'ansi-74tc-50bf':
      case 'dc_auxiliaries':
      case 'dc-auxiliaries':
        return (
          <SubstationDcTripCircuitDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'mv-feeder-flisr-and-loop-automation':
      case 'mv_feeder_flisr_and_loop_automation':
      case 'flisr_automation':
      case 'flisr-automation':
      case 'feeder-automation':
      case 'feeder_automation':
      case 'recloser-coordination':
      case 'recloser_coordination':
        return (
          <MvFeederFlisrAutomationDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'industrial-mv-motor-protection':
      case 'industrial_mv_motor_protection':
      case 'motor-protection':
      case 'motor_protection':
      case 'ansi_49_51lr':
      case 'thermal-replica':
      case 'thermal_replica':
        return (
          <IndustrialMotorProtectionDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'solar-bess-grid-interconnection':
      case 'solar_bess_grid_interconnection':
      case 'solar-bess':
      case 'solar_bess':
      case 'bess-frequency-regulation':
      case 'bess_frequency_regulation':
      case 'virtual-inertia':
      case 'virtual_inertia':
      case 'ieee-2800':
      case 'ieee_2800':
        return (
          <SolarBessGridInterconnectionDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      case 'transmission-distance-protection':
      case 'transmission_distance_protection':
      case 'distance-protection':
      case 'distance_protection':
      case 'ansi-21-85-68':
      case 'ansi_21_85_68':
      case 'rx-plane':
      case 'rx_plane':
      case 'teleprotection':
      case 'pott-putt':
      case 'pott_putt':
        return (
          <TransmissionDistanceProtectionDiagram
            locale={locale}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Diagramme vectoriel en cours d'intégration...
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Top Floating Control Bar if toggle enabled */}
      {showToggle && (
        <div className="flex items-center justify-end gap-2 mb-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('VECTOR')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'VECTOR' 
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Schéma Vectoriel HD' : 'Interactive Vector HD'}</span>
            </button>
            <button
              onClick={() => setViewMode('IMAGE')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'IMAGE' 
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Fichier Image Source' : 'Source Image'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'VECTOR' || imgLoadError ? (
        renderVectorDiagram()
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 text-center">
          <img
            src={`/images/infographics/${data.fileName}`}
            alt={locale === 'fr' ? data.title_fr : data.title_en}
            className="max-h-[580px] w-auto mx-auto rounded-xl object-contain shadow-2xl"
            onError={() => setImgLoadError(true)}
          />
          {imgLoadError && (
            <div className="mt-3 p-2 bg-amber-500/10 text-amber-300 text-xs rounded border border-amber-500/20">
              {locale === 'fr' 
                ? 'Fichier image non détecté sur le disque : affichage automatique du schéma vectoriel interactif haute précision.' 
                : 'Local image file not on disk: defaulting to interactive precision vector diagram.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
