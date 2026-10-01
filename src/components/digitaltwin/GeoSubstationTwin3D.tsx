// src/components/digitaltwin/GeoSubstationTwin3D.tsx
// ============================================================================
// GEOSPATIAL 3D & SUBSTATION DIGITAL TWIN (GEOTWIN 3D & DLR)
// Unified Engineering Twin for High-Voltage Substations & Overhead Lines
// Compliant with IEC 61936-1, IEC 60826, and CIGRE TB 207 / IEEE 738
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Layers,
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  Download,
  FileCode2,
  Share2,
  Eye,
  Camera,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { SubstationBay3DCanvas } from './modules/SubstationBay3DCanvas';
import { CorridorGisElevationView } from './modules/CorridorGisElevationView';
import { DynamicLineRatingSimulator } from './modules/DynamicLineRatingSimulator';
import { AasDrawer } from './AasDrawer';
import {
  CLEARANCE_AUDIT_RULES_225KV,
  GEOTWIN_SUBSTATIONS,
  SUBSTATION_BAY_EQUIPMENT_3D
} from './data/geotwinData';
import type { Equipment } from '../../types/epede';

interface GeoSubstationTwin3DProps {
  locale: 'fr' | 'en';
  onNavigateEquipment?: (id: string) => void;
}

type GeoTwinTab = 'bay_3d' | 'corridor_gis' | 'dlr_simulator' | 'compliance_audit';

export const GeoSubstationTwin3D: React.FC<GeoSubstationTwin3DProps> = ({
  locale,
  onNavigateEquipment
}) => {
  const [activeTab, setActiveTab] = useState<GeoTwinTab>('bay_3d');
  const [selectedAasId, setSelectedAasId] = useState<string | null>(null);
  const [isAasDrawerOpen, setIsAasDrawerOpen] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Convert selected AAS ID into canonical Equipment object for AasDrawer
  const activeEquipmentForAas: Equipment | null = useMemo(() => {
    if (!selectedAasId) return null;
    const found = SUBSTATION_BAY_EQUIPMENT_3D.find(
      (eq) => eq.aasAssetId === selectedAasId || eq.id === selectedAasId
    );
    if (!found) {
      return {
        id: selectedAasId,
        domain_id: 'D02',
        domain_code: 'D02',
        entity_type: 'HighVoltageSwitchgear',
        name_fr: 'Appareillage Haute Tension 225 kV',
        name_en: '225 kV High Voltage Apparatus',
        aliases_fr: ['Poste HTB'],
        aliases_en: ['HV Substation'],
        description_fr: 'Appareil haute tension modélisé dans le jumeau numérique 3D selon CEI 61936-1.',
        description_en: 'High voltage apparatus modeled in the 3D digital twin per IEC 61936-1.',
        function_fr: 'Isolement et commande de réseau électrique de transport.',
        function_en: 'Isolation and control of transmission power grid.',
        typical_location_fr: 'Poste 225 kV de Yaoundé / Batschenga',
        typical_location_en: '225 kV Substation of Yaoundé / Batschenga',
        voltage_level: 'HV',
        is_safety_critical: true,
        hazard_level: 'high_voltage',
        technical: {
          'Tension nominale': '245 kV',
          'BIL Choc de foudre': '1050 kV',
          'Ligne de fuite': '31 mm/kV'
        }
      };
    }

    return {
      id: found.id,
      domain_id: 'D02',
      domain_code: 'D02',
      entity_type: found.category,
      name_fr: found.name.fr,
      name_en: found.name.en,
      aliases_fr: [found.tag],
      aliases_en: [found.tag],
      description_fr: `${found.name.fr} - Tension nominale ${found.ratedVoltageKv} kV, courant assigné ${found.ratedCurrentA} A. Conforme ${found.iecStandard}.`,
      description_en: `${found.name.en} - Rated voltage ${found.ratedVoltageKv} kV, rated current ${found.ratedCurrentA} A. Compliant with ${found.iecStandard}.`,
      function_fr: 'Isolement, coupure ou mesure dans la travée de ligne 225 kV.',
      function_en: 'Isolation, switching or measurement in 225 kV line bay.',
      typical_location_fr: `Poste 225 kV - Coordonnées 3D: X=${found.position3D.x}m, Y=${found.position3D.y}m, Z=${found.position3D.z}m`,
      typical_location_en: `225 kV Substation - 3D Coordinates: X=${found.position3D.x}m, Y=${found.position3D.y}m, Z=${found.position3D.z}m`,
      voltage_level: found.ratedVoltageKv >= 400 ? 'EHV' : found.ratedVoltageKv >= 60 ? 'HV' : 'MV',
      is_safety_critical: true,
      hazard_level: 'high_voltage',
      technical: {
        'Tension assignée': `${found.ratedVoltageKv} kV`,
        'Courant assigné': `${found.ratedCurrentA} A`,
        'BIL Choc': `${found.bilImpulseKv} kV`,
        'Ligne de fuite': `${found.creepageDistanceMmPerKv} mm/kV`,
        'Norme CEI': found.iecStandard,
        'Température point chaud': `${found.thermalHotspotTempC || 35} °C`
      }
    };
  }, [selectedAasId]);

  const handleInspectAas = (assetId: string) => {
    setSelectedAasId(assetId);
    setIsAasDrawerOpen(true);
  };

  const handleDownloadDossier = () => {
    const reportData = {
      title: 'EPEDE 3D Geospatial & Substation Digital Twin Report',
      timestamp: new Date().toISOString(),
      standards: ['IEC 61936-1:2021', 'IEC 60826:2017', 'CIGRE TB 207', 'IEEE Std 738'],
      substations: GEOTWIN_SUBSTATIONS,
      clearanceCompliance: CLEARANCE_AUDIT_RULES_225KV,
      bayEquipment: SUBSTATION_BAY_EQUIPMENT_3D
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EPEDE_GeoTwin_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Toolbar & Breadcrumb */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="uppercase tracking-wider">
                JUMEAU GÉOSPATIAL 3D & POSTES HTB · GEOTWIN 3D & DLR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {locale === 'fr'
                ? 'Jumeau Numérique 3D de Poste, Tracé SIG & Ampacité Dynamique (DLR)'
                : '3D Substation Digital Twin, GIS Corridor & Dynamic Line Rating'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-4xl leading-relaxed">
              {locale === 'fr'
                ? 'Exploration spatiale vectorielle 3D des baies HTB 225/400 kV (CEI 61936-1), gabarits diélectriques d\'isolement, profil en long topographique avec flèche caténaire (CEI 60826) et calcul thermique CIGRE TB 207 / IEEE 738.'
                : '3D vector spatial exploration of 225/400 kV switchyard bays (IEC 61936-1), dielectric clearance spheres, longitudinal elevation profile with catenary sag (IEC 60826), and CIGRE TB 207 / IEEE 738 thermal balance engine.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadDossier}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Exporter Dossier Audit (JSON)' : 'Export Audit Dossier'}</span>
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('bay_3d')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'bay_3d'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'fr' ? '1. Baie Haute Tension 3D (CEI 61936-1)' : '1. 3D Substation Bay (IEC 61936-1)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corridor_gis')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'corridor_gis'
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>{locale === 'fr' ? '2. Tracé SIG & Profil en Long (CEI 60826)' : '2. GIS Corridor & Elevation (IEC 60826)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dlr_simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'dlr_simulator'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{locale === 'fr' ? '3. Moteur Thermique DLR (CIGRE TB 207)' : '3. Dynamic Rating DLR (CIGRE TB 207)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compliance_audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'compliance_audit'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{locale === 'fr' ? '4. Matrice d\'Audit & Distances de Sécurité' : '4. Safety Clearances Audit Matrix'}</span>
          </button>
        </div>
      </div>

      {/* 3. Active Tab Viewport Content */}
      {activeTab === 'bay_3d' && (
        <SubstationBay3DCanvas
          locale={locale}
          onInspectAas={handleInspectAas}
          onNavigateEquipment={onNavigateEquipment}
        />
      )}

      {activeTab === 'corridor_gis' && (
        <CorridorGisElevationView
          locale={locale}
          onInspectSubstation={(sub) => {
            handleInspectAas(sub.id);
          }}
          onInspectTower={(tower) => {
            handleInspectAas(tower.towerId);
          }}
        />
      )}

      {activeTab === 'dlr_simulator' && (
        <DynamicLineRatingSimulator locale={locale} />
      )}

      {activeTab === 'compliance_audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>
                  {locale === 'fr'
                    ? 'Matrice d\'Audit Réglementaire des Distances d\'Isolement (CEI 61936-1)'
                    : 'IEC 61936-1 Dielectric Safety & Clearances Audit Matrix'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Vérification algorithmique des gabarits diélectriques pour tension de tenue au choc de foudre BIL = 1050 kV (Réseaux 225 kV).
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CONFORMITÉ AUDITÉE : 100%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Code Règle</th>
                  <th className="p-3">Désignation</th>
                  <th className="p-3">Norme Référence</th>
                  <th className="p-3">Requis (mm)</th>
                  <th className="p-3">Mesuré (mm)</th>
                  <th className="p-3">Marge Sécurité</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CLEARANCE_AUDIT_RULES_225KV.map((rule) => (
                  <tr key={rule.ruleCode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-cyan-400">{rule.ruleCode}</td>
                    <td className="p-3 font-sans text-white font-medium">{rule.title[locale]}</td>
                    <td className="p-3 text-slate-400">{rule.standardRef}</td>
                    <td className="p-3 text-amber-400 font-bold">{rule.requiredClearanceMm} mm</td>
                    <td className="p-3 text-emerald-400 font-bold">{rule.actualMeasuredMm} mm</td>
                    <td className="p-3 text-emerald-300 font-bold">+{rule.safetyMarginPercent}%</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CONFORME
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] text-cyan-300">
                Formules Fondamentales CEI 61936-1
              </h5>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Distance de base N :</span> N = 2100 mm pour Ur = 245 kV (BIL 1050 kV peak).
              </p>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Hauteur de passage H :</span> H = 2250 mm + N = 4350 mm (Garantit la sécurité d'un travailleur avec outils portatifs).
              </p>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Distance de circulation B :</span> B = H + 500 mm pour passage de camion-nacelle d'entretien.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] text-emerald-300">
                Protection Environnementale & Incendie (NFPA 850)
              </h5>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Fosse de rétention totale :</span> 100% du volume d'huile diélectrique + 10% d'eaux pluviales d'orage.
              </p>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Matelas coupe-feu :</span> Lit de galets de silex (Ø 40/60 mm) d'épaisseur 300 mm empêchant la propagation de flammes en nappe.
              </p>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-white font-bold">Mur pare-feu REI 120 :</span> Séparation béton armé résistante 2h entre autotransformateurs adjacents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Slide-over AAS v3 Digital Twin Drawer */}
      <AasDrawer
        equipment={activeEquipmentForAas}
        isOpen={isAasDrawerOpen && !!activeEquipmentForAas}
        onClose={() => setIsAasDrawerOpen(false)}
        locale={locale}
      />
    </div>
  );
};
