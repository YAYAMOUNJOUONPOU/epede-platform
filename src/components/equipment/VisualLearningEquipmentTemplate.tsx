// src/components/equipment/VisualLearningEquipmentTemplate.tsx
// EPEDE 2.0 - Standardized 10-Section Visual Learning Page Template for Electrical Equipment
// Section 7 of EPEDE 2.0 Strategic Proposal:
// 1. Visual Introduction (Photo) -> 2. Simple Definition -> 3. Purpose -> 4. Operating Principle
// 5. Internal Construction -> 6. Real-World Application -> 7. Electrical Diagram & IEC Symbol
// 8. Related Equipment -> 9. Key Takeaways -> 10. Continue Learning

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  BookOpen,
  Sparkles,
  Layers,
  MapPin,
  FileText,
  Activity,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Shield,
  Cpu,
  GraduationCap,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { Equipment } from '../../types/epede';
import type { ApiEquipmentDto } from '../../services/epedeApiClient';
import { getPhotographsForEquipment } from '../../data/equipmentPhotographicRegistry';

interface VisualLearningEquipmentTemplateProps {
  equipment: Equipment;
  apiEquipment?: ApiEquipmentDto | null;
  locale: 'fr' | 'en';
  onNavigateEquipment: (id: string) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateCalculator?: (tab: any, context?: any) => void;
  onContinueLearning?: () => void;
}

export const VisualLearningEquipmentTemplate: React.FC<VisualLearningEquipmentTemplateProps> = ({
  equipment,
  apiEquipment,
  locale,
  onNavigateEquipment,
  onNavigateStandard,
  onNavigateCalculator,
  onContinueLearning,
}) => {
  const isFr = locale === 'fr';

  // Real photos from photographic registry
  const photos = getPhotographsForEquipment(equipment.id);
  const primaryPhoto = photos[0];

  // Hotspot interactive selection for Section 5 (Internal Construction)
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

  // Derived content & fallback text
  const equipmentName = isFr ? equipment.name_fr : equipment.name_en;
  const governingStd = (apiEquipment as any)?.governingStandard || 'IEC 62271-100 / IEC 60947';

  return (
    <div className="space-y-8 font-sans text-[#F4F1E8]">
      
      {/* ── SECTION 1: VISUAL INTRODUCTION (Large Real Photo) ─── */}
      <section className="bg-[#151C1E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#0B0F12]">
          <img
            src={
              primaryPhoto?.imageUrl ||
              'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80'
            }
            alt={equipmentName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151C1E] via-[#151C1E]/50 to-transparent" />

          {/* Floating Voltage & Standard Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded bg-[#D7A64A] text-[#0B0F12]">
              {equipment.domain_code}
            </span>
            {equipment.voltage_level && (
              <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-[#0B0F12]/80 text-[#D7A64A] border border-[#D7A64A]/40">
                {equipment.voltage_level}
              </span>
            )}
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#0B0F12]/80 text-[#A9ADA5] border border-white/10">
              {governingStd}
            </span>
          </div>

          {/* Hero Bottom Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-[#D7A64A] uppercase tracking-wider font-bold">
                {isFr ? 'FICHE PÉDAGOGIQUE VISUELLE 10 SECTIONS' : '10-SECTION VISUAL LEARNING FICHE'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-mono font-black text-white mt-1">
                {equipmentName}
              </h1>
            </div>

            {primaryPhoto?.locationContext && (
              <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-[#0B0F12]/80 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isFr ? primaryPhoto.locationContext.fr : primaryPhoto.locationContext.en}</span>
              </div>
            )}
          </div>
        </div>

        {primaryPhoto?.caption && (
          <div className="p-3.5 bg-[#0B0F12] border-t border-white/10 text-xs text-[#A9ADA5] font-sans flex items-center justify-between">
            <span>{isFr ? primaryPhoto.caption.fr : primaryPhoto.caption.en}</span>
            <span className="text-[#D7A64A] font-mono text-[11px] font-bold">SECTION 01 / 10</span>
          </div>
        )}
      </section>

      {/* ── SECTION 2 & 3: SIMPLE DEFINITION & PURPOSE ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 2: Simple Definition (No jargon first) */}
        <section className="p-6 rounded-2xl bg-[#151C1E] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D7A64A]" />
              <span>{isFr ? '02. Définition Simple (Sans jargon)' : '02. Simple Definition (Plain Language)'}</span>
            </span>
            <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 02</span>
          </div>

          <p className="text-base text-white font-medium leading-relaxed font-sans">
            {isFr ? equipment.description_fr : equipment.description_en}
          </p>

          <p className="text-xs text-[#A9ADA5] bg-[#0B0F12] p-3.5 rounded-xl border border-white/5 leading-relaxed">
            {isFr
              ? 'En termes concrets : un technicien doit voir cet appareil comme un organe indispensable qui sécurise ou achemine l’énergie sans danger.'
              : 'In plain practical terms: technicians view this apparatus as an indispensable organ ensuring safe and continuous power flow.'}
          </p>
        </section>

        {/* Section 3: Purpose (Why it exists & what hazard it solves) */}
        <section className="p-6 rounded-2xl bg-[#151C1E] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>{isFr ? '03. À Quoi Sert Cet Appareil ?' : '03. Purpose & Hazard Mitigation'}</span>
            </span>
            <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 03</span>
          </div>

          <p className="text-sm text-[#F4F1E8] leading-relaxed font-sans">
            {isFr ? equipment.function_fr : equipment.function_en}
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-rose-300 bg-rose-950/20 p-3 rounded-lg border border-rose-500/20">
            <span className="font-bold uppercase text-rose-400">{isFr ? 'Danger évité :' : 'Hazard avoided:'}</span>
            <span className="font-sans text-rose-200/90">
              {isFr
                ? 'Empêche la destruction thermique des câbles, l’explosion des armoires et l’électrocution des opérateurs.'
                : 'Prevents cable thermal burnout, switchgear arc blast explosions, and personnel electrocution.'}
            </span>
          </div>
        </section>

      </div>

      {/* ── SECTION 4: OPERATING PRINCIPLE (Progressive Disclosure) ─ */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#151C1E] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? '04. Principe de Fonctionnement (Explication Progressive)' : '04. Operating Principle (Step-by-Step)'}</span>
          </span>
          <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 04 / 10</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 space-y-2">
            <span className="font-mono text-xs font-bold text-[#D7A64A]">Étape 1 · Service Normal</span>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? 'L’appareil conduit le courant nominal sans surchauffe. La résistance de contact reste inférieure à quelques microhms.'
                : 'Apparatus conducts rated current continuously with negligible thermal rise. Contact resistance stays in microhm range.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">Étape 2 · Détection du Défaut</span>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? 'Lors d’une surintensité ou d’un court-circuit, les grandeurs électriques dépassent les seuils programmés (I > Ir ou I >> Isc).'
                : 'During an overload or short-circuit, electrical parameters spike above trip settings (I > Ir or I >> Isc).'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 space-y-2">
            <span className="font-mono text-xs font-bold text-rose-400">Étape 3 · Coupure & Extinction</span>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? 'Séparation des contacts et extinction immédiate de l’arc électrique dans le milieu diélectrique (air, vide ou gaz SF6) en moins de 50 ms.'
                : 'Rapid contact parting and arc quenching in dielectric medium (air, vacuum, or SF6) within 50 milliseconds.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: INTERNAL CONSTRUCTION & HOTSPOTS ───────── */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#151C1E] border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D7A64A]" />
            <span>{isFr ? '05. Construction Interne & Anatomie Écorchée' : '05. Internal Construction & Cutaway Hotspots'}</span>
          </span>
          <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 05 / 10</span>
        </div>

        {primaryPhoto?.calloutAnnotations && primaryPhoto.calloutAnnotations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Image with Hotspot Pins */}
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-white/10 bg-[#0B0F12]">
              <img
                src={primaryPhoto.imageUrl}
                alt={equipmentName}
                className="w-full h-80 object-cover"
              />
              {primaryPhoto.calloutAnnotations.map((hotspot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedHotspot(idx)}
                  style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full font-mono text-xs font-black flex items-center justify-center transition-all ${
                    selectedHotspot === idx
                      ? 'bg-[#D7A64A] text-[#0B0F12] ring-4 ring-[#D7A64A]/40 scale-125 z-20'
                      : 'bg-[#0B0F12]/90 text-white border border-white/40 hover:scale-110 z-10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Hotspots List */}
            <div className="lg:col-span-5 space-y-2 max-h-80 overflow-y-auto pr-1">
              <span className="text-[11px] font-mono uppercase text-[#A9ADA5] block mb-1">
                {isFr ? 'Cliquez sur un organe interne :' : 'Select internal component:'}
              </span>
              {primaryPhoto.calloutAnnotations.map((hotspot, idx) => {
                const isSelected = selectedHotspot === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHotspot(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#0B0F12] border-[#D7A64A] text-white shadow-md'
                        : 'bg-[#0B0F12]/60 border-white/10 text-[#A9ADA5] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span className="w-5 h-5 rounded-full bg-[#151C1E] border border-white/10 flex items-center justify-center text-[10px] text-[#D7A64A]">
                        {idx + 1}
                      </span>
                      <span>{isFr ? hotspot.label.fr : hotspot.label.en}</span>
                    </div>
                    {isSelected && (
                      <p className="mt-2 text-[11px] text-[#F4F1E8] font-sans pl-7 leading-relaxed">
                        {isFr ? hotspot.detail.fr : hotspot.detail.en}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 text-xs text-[#A9ADA5] font-sans leading-relaxed">
            {isFr
              ? 'L’anatomie interne comprend les pôles de puissance en cuivre électrolytique, le mécanisme de déclenchement à ressort armé, la chambre d’extinction d’arc et les bornes de raccordement.'
              : 'Internal construction comprises electrolytic copper power poles, spring-loaded trip mechanism, arc chute deionizer, and secondary terminal blocks.'}
          </div>
        )}
      </section>

      {/* ── SECTION 6 & 7: REAL-WORLD APPLICATION & IEC DIAGRAM ─ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 6: Real-World Application in Cameroon & Africa */}
        <section className="p-6 rounded-2xl bg-[#151C1E] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? '06. Application Réelle sur le Terrain' : '06. Field Application (Cameroon & Africa)'}</span>
            </span>
            <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 06</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200/90 leading-relaxed font-sans">
            {(equipment.typical_location_fr || equipment.typical_location_en) ? (
              <p>{isFr ? equipment.typical_location_fr : equipment.typical_location_en}</p>
            ) : (
              <p>
                {isFr
                  ? 'Déployé dans les postes sources de SONATREL (Oyomabang, Mangombé) et sur le réseau de distribution d’Eneo à Douala et Yaoundé.'
                  : 'Installed across SONATREL primary transmission substations and Eneo distribution feeders in Douala and Yaounde.'}
              </p>
            )}
          </div>

          <p className="text-xs text-[#A9ADA5] font-sans leading-relaxed">
            {isFr
              ? 'Conditions ambiantes équatoriales : humidité élevée (jusqu’à 95%), températures tropicales et risques d’orage violents nécessitent un entretien régulier.'
              : 'Tropical equatorial conditions (high ambient humidity up to 95%, intense lightning flash density) require rigorous scheduled maintenance.'}
          </p>
        </section>

        {/* Section 7: Electrical Diagram & IEC Symbol */}
        <section className="p-6 rounded-2xl bg-[#151C1E] border border-white/10 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#567A87] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#567A87]" />
                <span>{isFr ? '07. Schéma Électrique & Symbole CEI' : '07. Schematic Symbol & IEC Standard'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 07</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#D7A64A] block">
                CEI 60617 / IEC 60617 NORMALISATION
              </span>
              <p className="text-xs text-[#A9ADA5] font-sans leading-relaxed">
                {isFr
                  ? 'Sur un schéma unifilaire (SLD), cet appareil est représenté par son symbole normalisé avec repérage univoque des pôles amont et aval.'
                  : 'On Single-Line Diagrams (SLD), this apparatus is designated with standardized graphic symbols and upstream/downstream terminal markings.'}
              </p>
            </div>
          </div>

          {onNavigateCalculator && (
            <button
              type="button"
              onClick={() => onNavigateCalculator('short-circuit')}
              className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-[#0B0F12] hover:bg-[#567A87]/20 border border-white/10 text-xs font-mono font-bold text-white transition-colors"
            >
              <span>{isFr ? 'Calculer le Pouvoir de Coupure (CEI 60909)' : 'Calculate Breaking Capacity (IEC 60909)'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D7A64A]" />
            </button>
          )}
        </section>

      </div>

      {/* ── SECTION 8: RELATED EQUIPMENT (Assemblies & Upstream/Downstream) ── */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#151C1E] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D7A64A]" />
            <span>{isFr ? '08. Équipements Associés & Travail en Équipe' : '08. Related Equipment & System Assembly'}</span>
          </span>
          <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 08 / 10</span>
        </div>

        <p className="text-xs text-[#A9ADA5] font-sans">
          {isFr
            ? 'Cet appareil ne fonctionne jamais seul : il est coordonné en chaîne avec l’appareillage amont et aval :'
            : 'This equipment never operates in isolation: it coordinates directly with upstream and downstream components:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0B0F12] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-[#D7A64A] font-bold uppercase">Amont (Alimentation)</span>
            <div className="text-xs font-bold text-white font-mono">Disjoncteur / Câble d’Arrivée</div>
            <p className="text-[11px] text-[#A9ADA5] leading-snug">Fournit la tension et coupe les gros défauts de court-circuit.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F12] border border-[#D7A64A]/30 space-y-1">
            <span className="text-[10px] font-mono text-[#D7A64A] font-bold uppercase">Cet Appareil</span>
            <div className="text-xs font-bold text-white font-mono">{equipmentName}</div>
            <p className="text-[11px] text-[#A9ADA5] leading-snug">Remplit sa mission assignée de coupure, mesure ou transformation.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F12] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Aval (Charge Utile)</span>
            <div className="text-xs font-bold text-white font-mono">Moteur / Réseau / Bâtiment</div>
            <p className="text-[11px] text-[#A9ADA5] leading-snug">Reçoit une énergie électrique propre, calibrée et sécurisée.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: KEY TAKEAWAYS (Bullet Summary) ─────────── */}
      <section className="p-6 rounded-2xl bg-[#0B0F12] border border-[#D7A64A]/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D7A64A]" />
            <span>{isFr ? '09. Ce Qu’il Faut Absolument Retenir' : '09. Key Engineering Takeaways'}</span>
          </span>
          <span className="text-[10px] font-mono text-[#A9ADA5]">SECTION 09 / 10</span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F4F1E8] font-sans">
          <li className="flex items-start gap-2 bg-[#151C1E] p-3 rounded-lg border border-white/5">
            <span className="text-[#D7A64A] font-bold mt-0.5">•</span>
            <span>{isFr ? 'Rôle principal : manœuvre, protection ou conversion sous tension assignée.' : 'Core mission: switching, isolation, or transformation at rated voltage.'}</span>
          </li>
          <li className="flex items-start gap-2 bg-[#151C1E] p-3 rounded-lg border border-white/5">
            <span className="text-[#D7A64A] font-bold mt-0.5">•</span>
            <span>{isFr ? 'Norme de référence internationale : CEI / IEC conforme.' : 'International compliance: tested per strict IEC standards.'}</span>
          </li>
          <li className="flex items-start gap-2 bg-[#151C1E] p-3 rounded-lg border border-white/5">
            <span className="text-[#D7A64A] font-bold mt-0.5">•</span>
            <span>{isFr ? 'Sécurité vitale : consigner hors tension (VAT) avant toute intervention.' : 'Life safety: strictly execute 5-step LOTO and VAT before touching.'}</span>
          </li>
          <li className="flex items-start gap-2 bg-[#151C1E] p-3 rounded-lg border border-white/5">
            <span className="text-[#D7A64A] font-bold mt-0.5">•</span>
            <span>{isFr ? 'Coordination : ne jamais remplacer sans vérifier le pouvoir de coupure Icu.' : 'Coordination: never substitute without checking breaking capacity.'}</span>
          </li>
        </ul>
      </section>

      {/* ── SECTION 10: CONTINUE LEARNING (Next Steps) ─────────── */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-[#D7A64A]/10 via-[#151C1E] to-[#151C1E] border border-[#D7A64A]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#D7A64A]" />
            <span className="text-xs font-mono font-bold uppercase text-[#D7A64A]">
              {isFr ? '10. Poursuivre l’Apprentissage' : '10. Continue Your Learning Journey'}
            </span>
          </div>
          <p className="text-xs text-[#A9ADA5] font-sans">
            {isFr
              ? 'Prêt à voir comment cet équipement s’intègre dans un système complet ? Explorez les parcours guidés ou la chaîne électrique.'
              : 'Ready to see how this apparatus operates within complete power systems? Explore the guided pathways or 9-stage grid.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinueLearning}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D7A64A] hover:bg-[#D7A64A]/90 text-[#0B0F12] font-mono text-xs font-black transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>{isFr ? 'Passer à la Leçon Suivante' : 'Proceed to Next Lesson'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};

