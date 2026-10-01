// src/components/reference/modules/ApparatusNameplateViewer.tsx
// EPEDE - Authentic Electrotechnical Nameplate (Plaque Signalétique) Engine
// Renders realistic laser-etched / stainless steel equipment rating plates compliant with IEC 60076, IEC 62271, IEC 60947 & IEC 60034.

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Zap,
  Cpu,
  QrCode,
  Layers,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';
import { soundEffects } from '../../../services/soundEffectsService';

interface ApparatusNameplateViewerProps {
  equipment: CanonicalEquipmentObject;
  locale: 'fr' | 'en';
}

export const ApparatusNameplateViewer: React.FC<ApparatusNameplateViewerProps> = ({
  equipment,
  locale
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [nameplateFinish, setNameplateFinish] = useState<'METALLIC_BRUSHED' | 'DARK_TITANIUM' | 'ANODIZED_BLACK'>('METALLIC_BRUSHED');

  const serialNumber = `EPEDE-${equipment.tagIec || 'EQ'}-${equipment.id.toUpperCase().slice(-6)}-2026`;
  const mfgYear = '2026';
  const standardsRef = equipment.specifications.standards?.join(' · ') || 'IEC 60076 / IEC 62271';

  const handleCopyTag = () => {
    soundEffects.playSwitchClick();
    navigator.clipboard.writeText(`${equipment.name[locale]} [${equipment.tagIec || equipment.id}] - S/N: ${serialNumber}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Finish Selector Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>{locale === 'fr' ? 'Plaque Signalétique Réglementaire (IEC Nameplate)' : 'Regulatory Apparatus Nameplate'}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px]">
            {[
              { id: 'METALLIC_BRUSHED', label: locale === 'fr' ? 'Inox Brossé' : 'Brushed Steel' },
              { id: 'DARK_TITANIUM', label: 'Titane' },
              { id: 'ANODIZED_BLACK', label: locale === 'fr' ? 'Alu Noir' : 'Black Alu' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  soundEffects.playSwitchClick();
                  setNameplateFinish(f.id as any);
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                  nameplateFinish === f.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyTag}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 flex items-center gap-1 text-[10px] transition-colors"
            title="Copier les références de l'appareil"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* Physical Nameplate Container */}
      <div
        className={`relative p-5 sm:p-6 rounded-2xl border-2 shadow-2xl transition-all select-none ${
          nameplateFinish === 'METALLIC_BRUSHED'
            ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 border-slate-400 shadow-slate-900/50'
            : nameplateFinish === 'DARK_TITANIUM'
            ? 'bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 text-slate-100 border-slate-600 shadow-black/80'
            : 'bg-gradient-to-br from-slate-950 via-black to-slate-900 text-amber-300 border-amber-500/40 shadow-amber-500/10'
        }`}
      >
        {/* Etched Rivet Screws in 4 Corners */}
        <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full border border-black/40 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-black/60 rotate-45" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full border border-black/40 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-black/60 -rotate-45" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full border border-black/40 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-black/60 -rotate-45" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full border border-black/40 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-black/60 rotate-45" />
        </div>

        {/* Header Strip */}
        <div className="flex items-start justify-between border-b pb-3 mb-3 border-current/20">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-75">
              EPEDE INDUSTRIAL POWER SYSTEMS · APPARATUS RATING PLATE
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
              {equipment.name[locale]}
            </h3>
            <div className="text-[11px] font-bold opacity-90 mt-0.5">
              TYPE: {equipment.equipmentType || equipment.category} · TAG: {equipment.tagIec || 'N/A'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-black tracking-wider">
              S/N: {serialNumber}
            </div>
            <div className="text-[10px] opacity-80">
              MFG: {mfgYear} · STD: {standardsRef.split('·')[0]}
            </div>
          </div>
        </div>

        {/* 2-Column Core Electrical Ratings Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] py-1">
          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Tension Nominale (Un) :</span>
            <strong className="text-xs font-black">{equipment.voltageContext.nominalVoltage}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Courant Assigné (In) :</span>
            <strong className="text-xs font-black">{equipment.specifications.electrical.ratedCurrent || 'N/A'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Fréquence (fn) :</span>
            <strong className="text-xs font-black">{equipment.specifications.electrical.frequency || '50 Hz'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Pouvoir Coupure / Isc :</span>
            <strong className="text-xs font-black">{equipment.specifications.electrical.shortCircuitWithstand || equipment.specifications.electrical.breakingCapacity || '65 kA 1s'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Tenue aux Chocs (BIL) :</span>
            <strong className="text-xs font-black">{equipment.specifications.electrical.insulationLevel || '1050 kV peak'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Indice Protection :</span>
            <strong className="text-xs font-black">{equipment.specifications.environmental.ingressProtection || 'IP65 / IK10'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Masse Totale (M) :</span>
            <strong className="text-xs font-black">{equipment.specifications.mechanical.weight || '3800 kg'}</strong>
          </div>

          <div className="p-2 rounded bg-black/10 border border-current/15">
            <span className="block opacity-75 text-[9px] uppercase">Refroidissement / Temp :</span>
            <strong className="text-xs font-black">{equipment.specifications.thermal.coolingMethod || 'ONAN / -25°C..+50°C'}</strong>
          </div>
        </div>

        {/* Footer Regulatory Marks Strip */}
        <div className="mt-3 pt-2.5 border-t border-current/20 flex flex-wrap items-center justify-between text-[9px] opacity-85">
          <div className="flex items-center gap-3">
            <span className="font-bold">CE · IEC 62271 · IEEE C37 · ISO 9001</span>
            <span>CLASSE ISOLEMENT: {equipment.specifications.thermal.insulationClass || 'Classe F (155°C)'}</span>
          </div>

          <div className="flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>ESSAI DE TYPE CERTIFIÉ COFRAC / KEMA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
